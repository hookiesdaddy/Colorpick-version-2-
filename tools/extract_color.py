from io import BytesIO

from colorthief import ColorThief
from PIL import Image


def _saturation(r, g, b):
    """Return HSL saturation (0–1) for an RGB triple."""
    r_, g_, b_ = r / 255, g / 255, b / 255
    mx, mn = max(r_, g_, b_), min(r_, g_, b_)
    if mx == mn:
        return 0.0
    l = (mx + mn) / 2
    d = mx - mn
    return d / (2 - mx - mn) if l > 0.5 else d / (mx + mn)


def _is_neutral(r, g, b):
    """True if the colour is near-black, near-white, or near-grey."""
    return _saturation(r, g, b) < 0.18 or max(r, g, b) < 40 or min(r, g, b) > 215


def _pick_top2(palette, skip_neutrals=True):
    """
    From a palette list return the two most dominant colours.
    When skip_neutrals is True, filters out near-black/white/grey first.
    Falls back to raw palette order if filtering leaves fewer than 2.
    """
    if skip_neutrals:
        vibrant = [c for c in palette if not _is_neutral(*c)]
        pool = vibrant if len(vibrant) >= 2 else palette
    else:
        pool = palette
    primary   = pool[0]
    secondary = pool[1] if len(pool) > 1 else pool[0]
    return primary, secondary


def _vibrant_strip(img):
    """
    Return a 1-row image containing only the vibrant (non-neutral) pixels
    from img, so ColorThief only sees colours worth picking.
    Falls back to the original image if too few vibrant pixels exist.
    """
    pixels = list(img.getdata())
    vibrant = [
        (r, g, b) for r, g, b in pixels
        if not _is_neutral(r, g, b)
    ]
    if len(vibrant) < 50:
        return img  # image is almost entirely neutral — use as-is
    strip = Image.new("RGB", (len(vibrant), 1))
    strip.putdata(vibrant)
    return strip


def extract_dominant_color(image_bytes: bytes, skip_neutrals: bool = True) -> dict:
    """
    Accepts raw image bytes.
    Returns primary + secondary colours as hex and rgb.
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

    # Downsample large images to cap memory/CPU usage
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

    # Optionally strip neutrals before ColorThief so outlines/highlights don't dominate
    work = _vibrant_strip(img) if skip_neutrals else img

    # Encode to PNG (lossless) for ColorThief
    buf = BytesIO()
    work.save(buf, format="PNG")
    buf.seek(0)

    try:
        color_thief = ColorThief(buf)
        palette = color_thief.get_palette(color_count=8, quality=1)
    except Exception as e:
        raise RuntimeError(f"Color extraction failed: {e}")

    (r, g, b), (r2, g2, b2) = _pick_top2(palette, skip_neutrals=skip_neutrals)

    return {
        "hex": "#{:02x}{:02x}{:02x}".format(r, g, b),
        "rgb": {"r": r, "g": g, "b": b},
        "secondary": {
            "hex": "#{:02x}{:02x}{:02x}".format(r2, g2, b2),
            "rgb": {"r": r2, "g": g2, "b": b2},
        },
    }
