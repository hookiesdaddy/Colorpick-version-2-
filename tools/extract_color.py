from io import BytesIO

from colorthief import ColorThief
from PIL import Image


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

    # Re-encode to JPEG bytes for colorthief
    buf = BytesIO()
    img.save(buf, format="JPEG", quality=95)
    buf.seek(0)

    try:
        color_thief = ColorThief(buf)
        palette = color_thief.get_palette(color_count=2, quality=5)
    except Exception as e:
        raise RuntimeError(f"Color extraction failed: {e}")

    r, g, b = palette[0]
    r2, g2, b2 = palette[1] if len(palette) > 1 else palette[0]

    return {
        "hex": "#{:02x}{:02x}{:02x}".format(r, g, b),
        "rgb": {"r": r, "g": g, "b": b},
        "secondary": {
            "hex": "#{:02x}{:02x}{:02x}".format(r2, g2, b2),
            "rgb": {"r": r2, "g": g2, "b": b2},
        },
    }
