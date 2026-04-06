from io import BytesIO

from colorthief import ColorThief
from PIL import Image


def _saturation(r, g, b):
    """Return HSL saturation (0-1) for an RGB triple."""
    r_, g_, b_ = r / 255, g / 255, b / 255
    mx, mn = max(r_, g_, b_), min(r_, g_, b_)
    if mx == mn:
        return 0.0
    l = (mx + mn) / 2
    d = mx - mn
    return d / (2 - mx - mn) if l > 0.5 else d / (mx + mn)


def _is_neutral(r, g, b, threshold=0.18):
    """True if colour is near-black, near-white, or near-grey."""
    return _saturation(r, g, b) < threshold


def _pick_top2(palette):
    """
    From a palette list, return the two most vibrant (saturated) colours.
    Falls back to the raw palette order if everything is neutral.
    """
    vibrant = [c for c in palette if not _is_neutral(*c)]
    pool = vibrant if len(vibrant) >= 2 else palette
    pool_sorted = sorted(pool, key=lambda c: _saturation(*c), reverse=True)
    primary   = pool_sorted[0]
    secondary = pool_sorted[1] if len(pool_sorted) > 1 else pool_sorted[0]
    return primary, secondary


def extract_dominant_color(image_bytes: bytes) -> dict:
    """
    Accepts raw image bytes.
    Returns primary + secondary colors as hex and rgb.
    Raises ValueError for unreadable/unsupported images.
    Raises RuntimeError for colorthief failures.
    """
    try:
        img = Image.open(BytesIO(image_bytes))
        img.verify()
    except Exception as e:
        raise ValueError(f"Could not read image: {e}")

    # Re-open after verify() (verify() closes the file)
    img = Image.open(BytesIO(image_bytes))

    # Downsample large images before processing to reduce memory/CPU usage
    MAX_DIM = 800
    if max(img.size) > MAX_DIM:
        img.thumbnail((MAX_DIM, MAX_DIM), Image.LANCZOS)

    # colorthief struggles with RGBA and palette modes — convert to RGB
    if img.mode in ("RGBA", "P", "LA"):
        if img.mode == "P":
            img = img.convert("RGBA")
        background = Image.new("RGB", img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[-1])
        img = background

    if img.mode != "RGB":
        img = img.convert("RGB")

    # Re-encode to PNG (lossless) so colorthief sees exact colors
    buf = BytesIO()
    img.save(buf, format="PNG")
    buf.seek(0)

    try:
        color_thief = ColorThief(buf)
        # Extract a wider palette so we have candidates to filter
        palette = color_thief.get_palette(color_count=8, quality=5)
    except Exception as e:
        raise RuntimeError(f"Color extraction failed: {e}")

    (r, g, b), (r2, g2, b2) = _pick_top2(palette)

    return {
        "hex": "#{:02x}{:02x}{:02x}".format(r, g, b),
        "rgb": {"r": r, "g": g, "b": b},
        "secondary": {
            "hex": "#{:02x}{:02x}{:02x}".format(r2, g2, b2),
            "rgb": {"r": r2, "g": g2, "b": b2},
        },
    }
