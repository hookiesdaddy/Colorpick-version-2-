import asyncio
import json
import socket
import time
from pathlib import Path
from typing import List, Optional, Tuple

import httpx
from fastapi import FastAPI, File, Form, Header, HTTPException, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from starlette.responses import Response
from starlette.types import Scope
from pydantic import BaseModel

from config import settings
from tools.extract_color import extract_dominant_color

app = FastAPI(title="colorpick", version=settings.version)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class CachedStaticFiles(StaticFiles):
    """Serve static files with Cache-Control headers (1-day TTL)."""
    async def get_response(self, path: str, scope: Scope) -> Response:
        resp = await super().get_response(path, scope)
        resp.headers["Cache-Control"] = "public, max-age=86400"
        return resp

STATIC_DIR = Path(__file__).parent / "static"
app.mount("/static", CachedStaticFiles(directory=STATIC_DIR), name="static")

GOVEE_CONTROL_URL = "https://developer-api.govee.com/v1/devices/control"
GOVEE_DEVICES_URL = "https://developer-api.govee.com/v1/devices"


class URLRequest(BaseModel):
    url: str
    skip_neutrals: bool = False


@app.get("/")
async def index():
    return FileResponse(STATIC_DIR / "index.html")


@app.get("/health")
async def health():
    return {"status": "ok", "version": settings.version}


@app.post("/analyze")
async def analyze(
    request: Request,
    file: Optional[UploadFile] = File(default=None),
    skip_neutrals: str = Form(default='0'),
    prefer_secondary: str = Form(default='0'),
):
    """Simple endpoint for iOS Shortcuts / external clients. Returns just the hex color.
    Accepts multipart/form-data with a 'file' field, or raw image bytes in the body.
    Optional query params: ?skip_neutrals=1&prefer_secondary=1"""
    # Also check query params so Shortcuts can pass settings in the URL
    qs = dict(request.query_params)
    use_skip = skip_neutrals in ('1', 'true', 'True') or qs.get('skip_neutrals') in ('1', 'true', 'True')
    use_secondary = prefer_secondary in ('1', 'true', 'True') or qs.get('prefer_secondary') in ('1', 'true', 'True')

    if file is not None:
        data = await file.read()
    else:
        data = await request.body()
    if not data:
        raise HTTPException(status_code=422, detail="No image provided")
    if len(data) > settings.max_image_size_bytes:
        raise HTTPException(status_code=413, detail="Image exceeds 10MB limit")
    result = _extract(data, skip_neutrals=use_skip)
    hex_color = result["secondary"]["hex"] if use_secondary else result["hex"]
    return {"hex": hex_color}


@app.post("/extract")
async def extract(
    file: Optional[UploadFile] = File(default=None),
    url: Optional[str] = Form(default=None),
    skip_neutrals: str = Form(default='0'),
):
    """Extract the dominant color. Returns hex + rgb. Does NOT set lights."""
    image_bytes, source = await _get_image_bytes(file, url)
    return {**_extract(image_bytes, skip_neutrals=skip_neutrals in ('1', 'true', 'True')), "source": source}


@app.post("/extract/url")
async def extract_url(body: URLRequest):
    """JSON body URL variant — convenient for Shortcuts JSON mode."""
    image_bytes, source = await _fetch_url(body.url)
    return {**_extract(image_bytes, skip_neutrals=body.skip_neutrals), "source": source}


@app.post("/extract-and-set")
async def extract_and_set(
    file: Optional[UploadFile] = File(default=None),
    url: Optional[str] = Form(default=None),
    x_govee_api_key: Optional[str] = Header(default=None),
):
    """Extract dominant color AND set both Govee lights to that color."""
    image_bytes, source = await _get_image_bytes(file, url)
    color = _extract(image_bytes)
    api_key = x_govee_api_key or settings.govee_api_key
    light_results = await _set_all_lights(color["rgb"]["r"], color["rgb"]["g"], color["rgb"]["b"], api_key)
    return {**color, "source": source, "lights": light_results}


@app.post("/set-light")
async def set_light(
    r: int = Form(...),
    g: int = Form(...),
    b: int = Form(...),
    x_govee_api_key: Optional[str] = Header(default=None),
):
    """Set both Govee lights to an explicit RGB color."""
    if not all(0 <= v <= 255 for v in (r, g, b)):
        raise HTTPException(status_code=422, detail="RGB values must be 0–255")
    api_key = x_govee_api_key or settings.govee_api_key
    light_results = await _set_all_lights(r, g, b, api_key)
    hex_color = "#{:02x}{:02x}{:02x}".format(r, g, b)
    return {"hex": hex_color, "rgb": {"r": r, "g": g, "b": b}, "lights": light_results}


@app.post("/set-light-hex")
async def set_light_hex(
    request: Request,
    hex: Optional[str] = Form(default=None),
    selected_devices: Optional[str] = Form(default=None),
    x_govee_api_key: Optional[str] = Header(default=None),
):
    """Set lights from a hex string. Accepts hex as a form field or ?hex= query param.
    Optional selected_devices: JSON array of {device, model, name} objects to target."""
    hex_val = hex or request.query_params.get("hex") or ""
    hex_val = hex_val.strip().lstrip("#")
    if len(hex_val) != 6:
        raise HTTPException(status_code=422, detail="Invalid hex color — expected 6 hex digits")
    try:
        r, g, b = int(hex_val[0:2], 16), int(hex_val[2:4], 16), int(hex_val[4:6], 16)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid hex color")
    api_key = x_govee_api_key or settings.govee_api_key
    devices = _parse_selected_devices(selected_devices)
    light_results = await _set_all_lights(r, g, b, api_key, devices=devices)
    return {"hex": f"#{hex_val}", "rgb": {"r": r, "g": g, "b": b}, "lights": light_results}


@app.post("/govee/power")
async def govee_power(
    state: str = Form(...),
    selected_devices: Optional[str] = Form(default=None),
    x_govee_api_key: Optional[str] = Header(default=None),
):
    """Turn Govee lights on or off. state must be 'on' or 'off'."""
    if state not in ("on", "off"):
        raise HTTPException(status_code=422, detail="state must be 'on' or 'off'")
    api_key = x_govee_api_key or settings.govee_api_key
    if not api_key:
        raise HTTPException(status_code=422, detail="No API key configured")
    devices = _parse_selected_devices(selected_devices)
    async with httpx.AsyncClient(timeout=10.0) as client:
        tasks = [_set_govee_power(client, d, state, api_key) for d in devices]
        results = list(await asyncio.gather(*tasks))
    return {"state": state, "lights": results}


@app.post("/govee/lan/discover")
async def govee_lan_discover():
    """Discover Govee devices on the local network via UDP LAN API (port 4001/4002)."""
    BROADCAST_ADDR = "239.255.255.250"
    BROADCAST_PORT = 4001
    LISTEN_PORT    = 4002
    SCAN_TIMEOUT   = 3.0
    SCAN_MSG = json.dumps(
        {"msg": {"cmd": "scan", "data": {"account_topic": "reserved"}}}
    ).encode()

    def _discover() -> list:
        devices: list = []
        recv_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        recv_sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            recv_sock.bind(("", LISTEN_PORT))
        except OSError as e:
            raise RuntimeError(f"Cannot bind to port {LISTEN_PORT}: {e}")
        recv_sock.settimeout(0.5)

        send_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        send_sock.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_TTL, 1)
        try:
            send_sock.sendto(SCAN_MSG, (BROADCAST_ADDR, BROADCAST_PORT))
        finally:
            send_sock.close()

        seen: set = set()
        deadline = time.monotonic() + SCAN_TIMEOUT
        while time.monotonic() < deadline:
            try:
                data, addr = recv_sock.recvfrom(4096)
                msg = json.loads(data.decode())
                d = msg.get("msg", {}).get("data", {})
                ip = d.get("ip") or addr[0]
                device_id = d.get("device", "")
                if device_id and device_id not in seen:
                    seen.add(device_id)
                    sku = d.get("sku", "")
                    devices.append({
                        "ip": ip,
                        "device": device_id,
                        "sku": sku,
                        "name": sku or device_id,
                    })
            except socket.timeout:
                pass
            except Exception:
                pass
        recv_sock.close()
        return devices

    try:
        devices = await asyncio.get_running_loop().run_in_executor(None, _discover)
        return {"devices": len(devices), "device_list": devices}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"LAN discovery failed: {e}")


@app.post("/set-light-lan")
async def set_light_lan(
    request: Request,
    hex: Optional[str] = Form(default=None),
    devices: Optional[str] = Form(default=None),
):
    """Set Govee lights via LAN UDP (port 4003). Each device must include an 'ip' field."""
    hex_val = (hex or request.query_params.get("hex") or "").strip().lstrip("#")
    if len(hex_val) != 6:
        raise HTTPException(status_code=422, detail="Invalid hex color — expected 6 hex digits")
    try:
        r, g, b = int(hex_val[0:2], 16), int(hex_val[2:4], 16), int(hex_val[4:6], 16)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid hex color")

    device_list = []
    if devices:
        try:
            parsed = json.loads(devices)
            if isinstance(parsed, list):
                device_list = parsed
        except Exception:
            pass
    if not device_list:
        raise HTTPException(status_code=422, detail="No LAN devices provided")

    results = await _set_all_lights_lan(r, g, b, device_list)
    return {"hex": f"#{hex_val}", "rgb": {"r": r, "g": g, "b": b}, "lights": results}


@app.post("/govee/lan/power")
async def govee_lan_power(
    state: str = Form(...),
    devices: Optional[str] = Form(default=None),
):
    """Turn Govee LAN lights on or off."""
    if state not in ("on", "off"):
        raise HTTPException(status_code=422, detail="state must be 'on' or 'off'")
    device_list = []
    if devices:
        try:
            parsed = json.loads(devices)
            if isinstance(parsed, list):
                device_list = parsed
        except Exception:
            pass
    if not device_list:
        raise HTTPException(status_code=422, detail="No LAN devices provided")

    value = 1 if state == "on" else 0

    async def _power_one(device: dict) -> dict:
        ip   = device.get("ip")
        name = device.get("name") or device.get("sku") or ip
        if not ip:
            return {"name": name, "status": "error", "detail": "No IP address"}
        msg = json.dumps({"msg": {"cmd": "turn", "data": {"value": value}}}).encode()
        def _send():
            sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            sock.settimeout(2.0)
            try: sock.sendto(msg, (ip, 4003))
            finally: sock.close()
        try:
            await asyncio.get_running_loop().run_in_executor(None, _send)
            return {"name": name, "status": "ok"}
        except Exception as e:
            return {"name": name, "status": "error", "detail": str(e)}

    results = list(await asyncio.gather(*[_power_one(d) for d in device_list]))
    return {"state": state, "lights": results}


@app.post("/govee/test")
async def test_govee(x_govee_api_key: Optional[str] = Header(default=None)):
    """Validate a Govee API key and return the full device list."""
    api_key = x_govee_api_key or settings.govee_api_key
    if not api_key:
        raise HTTPException(status_code=422, detail="No API key provided")
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(
                GOVEE_DEVICES_URL,
                headers={"Govee-API-Key": api_key},
            )
        if resp.status_code == 200:
            data = resp.json()
            raw = data.get("data", {}).get("devices", [])
            device_list = [
                {"device": d["device"], "model": d["model"], "name": d.get("deviceName", d["device"])}
                for d in raw
            ]
            return {"status": "ok", "devices": len(device_list), "device_list": device_list}
        raise HTTPException(status_code=400, detail=f"Govee rejected the key (HTTP {resp.status_code})")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# --- helpers ---

async def _get_image_bytes(
    file: Optional[UploadFile], url: Optional[str]
) -> Tuple[bytes, str]:
    if file is not None:
        data = await file.read()
        if len(data) > settings.max_image_size_bytes:
            raise HTTPException(status_code=413, detail="Image exceeds 10MB limit")
        return data, "upload"
    if url is not None:
        return await _fetch_url(url)
    raise HTTPException(status_code=422, detail="Provide either a file upload or a url field")


async def _fetch_url(url: str) -> Tuple[bytes, str]:
    try:
        async with httpx.AsyncClient(timeout=15.0, follow_redirects=True) as client:
            resp = await client.get(url)
            resp.raise_for_status()
            content_length = int(resp.headers.get("content-length", 0))
            if content_length > settings.max_image_size_bytes:
                raise HTTPException(status_code=413, detail="Image exceeds 10MB limit")
            data = resp.content
    except HTTPException:
        raise
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch URL: HTTP {e.response.status_code}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to fetch URL: {e}")
    if len(data) > settings.max_image_size_bytes:
        raise HTTPException(status_code=413, detail="Image exceeds 10MB limit")
    return data, "url"


def _extract(image_bytes: bytes, skip_neutrals: bool = True) -> dict:
    try:
        return extract_dominant_color(image_bytes, skip_neutrals=skip_neutrals)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


async def _set_govee_light(
    client: httpx.AsyncClient, device: dict, r: int, g: int, b: int, api_key: str
) -> dict:
    payload = {
        "device": device["device"],
        "model": device["model"],
        "cmd": {"name": "color", "value": {"r": r, "g": g, "b": b}},
    }
    try:
        resp = await client.put(
            GOVEE_CONTROL_URL,
            json=payload,
            headers={"Govee-API-Key": api_key, "Content-Type": "application/json"},
        )
        resp.raise_for_status()
        return {"name": device["name"], "status": "ok"}
    except Exception as e:
        return {"name": device["name"], "status": "error", "detail": str(e)}


def _parse_selected_devices(selected_devices: Optional[str]) -> list:
    """Parse JSON device list from form field; falls back to settings.govee_devices."""
    if selected_devices:
        try:
            parsed = json.loads(selected_devices)
            if isinstance(parsed, list) and parsed:
                return parsed
        except Exception:
            pass
    return settings.govee_devices


async def _set_all_lights(r: int, g: int, b: int, api_key: str = "", devices: list = None) -> list:
    key = api_key or settings.govee_api_key
    devs = devices if devices is not None else settings.govee_devices
    if not key:
        return [{"name": d["name"], "status": "skipped", "detail": "No API key configured"} for d in devs]
    async with httpx.AsyncClient(timeout=10.0) as client:
        tasks = [_set_govee_light(client, device, r, g, b, key) for device in devs]
        return list(await asyncio.gather(*tasks))


async def _set_govee_lan_light(device: dict, r: int, g: int, b: int) -> dict:
    ip   = device.get("ip")
    name = device.get("name") or device.get("sku") or ip
    if not ip:
        return {"name": name, "status": "error", "detail": "No IP address"}
    msg = json.dumps(
        {"msg": {"cmd": "colorwc", "data": {"color": {"r": r, "g": g, "b": b}, "colorTemInKelvin": 0}}}
    ).encode()
    def _send():
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.settimeout(2.0)
        try: sock.sendto(msg, (ip, 4003))
        finally: sock.close()
    try:
        await asyncio.get_running_loop().run_in_executor(None, _send)
        return {"name": name, "status": "ok"}
    except Exception as e:
        return {"name": name, "status": "error", "detail": str(e)}


async def _set_all_lights_lan(r: int, g: int, b: int, devices: list) -> list:
    tasks = [_set_govee_lan_light(d, r, g, b) for d in devices]
    return list(await asyncio.gather(*tasks))


async def _set_govee_power(
    client: httpx.AsyncClient, device: dict, state: str, api_key: str
) -> dict:
    payload = {
        "device": device["device"],
        "model": device["model"],
        "cmd": {"name": "turn", "value": state},
    }
    try:
        resp = await client.put(
            GOVEE_CONTROL_URL,
            json=payload,
            headers={"Govee-API-Key": api_key, "Content-Type": "application/json"},
        )
        resp.raise_for_status()
        return {"name": device["name"], "status": "ok"}
    except Exception as e:
        return {"name": device["name"], "status": "error", "detail": str(e)}
