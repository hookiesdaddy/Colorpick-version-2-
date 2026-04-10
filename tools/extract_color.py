from io import BytesIO

from colorthief import ColorThief
from PIL import Image


# ── Helpers ───────────────────────────────────────────────────────────────────

def _saturation(r, g, b):
    r_, g_, b_ = r / 255, g / 255, b / 255
    mx, mn = max(r_, g_, b_), min(r_, g_, b_)
    if mx == mn:
        return 0.0
    l = (mx + mn) / 2
    d = mx - mn
    return d / (2 - mx - mn) if l > 0.5 else d / (mx + mn)


def _is_neutral(r, g, b):
    return _saturation(r, g, b) < 0.18 or max(r, g, b) < 40 or min(r, g, b) > 215


# ── Default: pure frequency-based, no filtering ───────────────────────────────

def _extract_raw(img):
    """
    Top 2 colors by raw pixel count using PIL quantization.
    Primary is always the most frequent color.
    Secondary avoids being dark/neutral if any non-dark option exists in the palette.
    """
    q = img.quantize(colors=32, method=Image.Quantize.MEDIANCUT)
    counts = q.getcolors()          # [(count, palette_index), ...]
    if not counts:
        return (0, 0, 0), (0, 0, 0)
    counts.sort(key=lambda x: x[0], reverse=True)
    pal = q.getpalette()            # flat [R, G, B, R, G, B, ...]

    def to_rgb(idx):
        return (pal[idx * 3], pal[idx * 3 + 1], pal[idx * 3 + 2])

    all_colors = [to_rgb(c[1]) for c in counts]
    primary = all_colors[0]

    if len(all_colors) < 2:
        return primary, primary

    # If primary is dark/neutral, try to find a non-dark secondary
    # If primary is vibrant, still prefer a non-dark secondary
    non_dark = [c for c in all_colors[1:] if not _is_neutral(*c)]
    if non_dark:
        secondary = non_dark[0]
    else:
        # All options are dark/neutral — just take the next most frequent
        secondary = all_colors[1]

    return primary, secondary


# ── Skip-neutrals: vibrant-strip + ColorThief ─────────────────────────────────

def _vibrant_strip(img):
    """1-row image containing only vibrant (non-neutral) pixels."""
    pixels = list(img.getdata())
    vibrant = [(r, g, b) for r, g, b in pixels if not _is_neutral(r, g, b)]
    if len(vibrant) < 50:
        return img
    strip = Image.new("RGB", (len(vibrant), 1))
    strip.putdata(vibrant)
    return strip


def _extract_vibrant(img):
    """Top 2 vibrant colors, skipping near-black/white/grey pixels."""
    work = _vibrant_strip(img)
    buf = BytesIO()
    work.save(buf, format="PNG")
    buf.seek(0)
    try:
        palette = ColorThief(buf).get_palette(color_count=8, quality=1)
    except Exception:
        return _extract_raw(img)  # fallback

    vibrant = [c for c in palette if not _is_neutral(*c)]
    pool = vibrant if len(vibrant) >= 2 else palette
    pool_sorted = sorted(pool, key=lambda c: _saturation(*c), reverse=True)
    primary   = pool_sorted[0]
    secondary = pool_sorted[1] if len(pool_sorted) > 1 else pool_sorted[0]
    return primary, secondary


# ── Public entry point ────────────────────────────────────────────────────────

def extract_dominant_color(image_bytes: bytes, skip_neutrals: bool = False) -> dict:
    """
    Returns primary + secondary colours as hex and rgb.
    skip_neutrals=False  → raw frequency (default, no filtering)
    skip_neutrals=True   → vibrant-only (skips dark/grey/white)
    """
    try:
        img = Image.open(BytesIO(image_bytes))
        img.load()  # validates + decodes in one pass (replaces verify + re-open)
    except Exception as e:
        raise ValueError(f"Could not read image: {e}")

    MAX_DIM = 800
    if max(img.size) > MAX_DIM:
        img.thumbnail((MAX_DIM, MAX_DIM), Image.LANCZOS)

    # Normalise to RGB
    if img.mode in ("RGBA", "P", "LA"):
        if img.mode == "P":
            img = img.convert("RGBA")
        bg = Image.new("RGB", img.size, (255, 255, 255))
        bg.paste(img, mask=img.split()[-1])
        img = bg
    if img.mode != "RGB":
        img = img.convert("RGB")

    if skip_neutrals:
        (r, g, b), (r2, g2, b2) = _extract_vibrant(img)
    else:
        (r, g, b), (r2, g2, b2) = _extract_raw(img)

    return {
        "hex": "#{:02x}{:02x}{:02x}".format(r, g, b),
        "rgb": {"r": r, "g": g, "b": b},
        "secondary": {
            "hex": "#{:02x}{:02x}{:02x}".format(r2, g2, b2),
            "rgb": {"r": r2, "g": g2, "b": b2},
        },
    }
