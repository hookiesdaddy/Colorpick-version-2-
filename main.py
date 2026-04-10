import asyncio
from pathlib import Path
from typing import Optional, Tuple

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
    x_govee_api_key: Optional[str] = Header(default=None),
):
    """Set lights from a hex string. Accepts hex as a form field or ?hex= query param."""
    hex_val = hex or request.query_params.get("hex") or ""
    hex_val = hex_val.strip().lstrip("#")
    if len(hex_val) != 6:
        raise HTTPException(status_code=422, detail="Invalid hex color — expected 6 hex digits")
    try:
        r, g, b = int(hex_val[0:2], 16), int(hex_val[2:4], 16), int(hex_val[4:6], 16)
    except ValueError:
        raise HTTPException(status_code=422, detail="Invalid hex color")
    api_key = x_govee_api_key or settings.govee_api_key
    light_results = await _set_all_lights(r, g, b, api_key)
    return {"hex": f"#{hex_val}", "rgb": {"r": r, "g": g, "b": b}, "lights": light_results}


@app.post("/govee/test")
async def test_govee(x_govee_api_key: Optional[str] = Header(default=None)):
    """Validate a Govee API key by listing devices."""
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
            device_count = len(data.get("data", {}).get("devices", []))
            return {"status": "ok", "devices": device_count}
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


async def _set_all_lights(r: int, g: int, b: int, api_key: str = "") -> list:
    key = api_key or settings.govee_api_key
    if not key:
        return [{"name": d["name"], "status": "skipped", "detail": "No API key configured"} for d in settings.govee_devices]
    async with httpx.AsyncClient(timeout=10.0) as client:
        tasks = [_set_govee_light(client, device, r, g, b, key) for device in settings.govee_devices]
        return list(await asyncio.gather(*tasks))
