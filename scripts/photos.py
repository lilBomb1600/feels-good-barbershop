"""
Photo pipeline for the Feel Goods remaster.

Source: assets-inbox/maps/fg-XXX.jpg (the shop's own Google Maps "by owner" photos, git-ignored).
For each selected photo: exif_transpose, crop (relative box), "rose grade" (monochrome in the site's
ink/paper tones, only the reds of the rose capes, flag capes and dyed hair keep their color),
strip EXIF, export WebP at fixed widths capped at the crop's real width (never upscale).
Writes public/images/... and src/data/photo-manifest.json.

Run: python scripts/photos.py
"""
import json, os
import numpy as np
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets-inbox", "maps")
OUT = os.path.join(ROOT, "public", "images")
INK = np.array([18, 13, 11], np.float32)
PAPER = np.array([244, 236, 220], np.float32)

TILE = [640, 1280]
WIDE = [640, 1280, 1920, 2560]

# id: (source, crop box x0,y0,x1,y1 relative, widths, grade)
PHOTOS = {
    # lookbook
    "fade-mural": ("084", (0.12, 0.14, 0.88, 0.90), TILE, "rose"),
    "taper-hand": ("059", (0.06, 0.04, 0.86, 0.84), TILE, "rose"),
    "taper-back": ("088", (0.12, 0.12, 0.86, 0.86), TILE, "rose"),
    "fade-pole": ("067", (0.20, 0.24, 0.96, 1.00), TILE, "rose"),
    "star-kid": ("108", (0.12, 0.06, 0.926, 0.92), TILE, "rose"),
    "star-zigzag": ("028", (0.0, 0.08, 1.0, 0.83), TILE, "rose"),
    "key-back": ("078", (0.12, 0.08, 0.88, 0.84), TILE, "rose"),
    "key-side": ("009", (0.10, 0.12, 0.86, 0.88), TILE, "rose"),
    "lines-back": ("117", (0.0, 0.02, 0.80, 0.82), TILE, "rose"),
    "lines-side": ("032", (0.05, 0.02, 0.92, 0.94), TILE, "rose"),
    "lines-slick": ("103", (0.06, 0.0, 0.6225, 1.0), TILE, "rose"),
    "kid-side": ("038", (0.0, 0.04, 0.80, 0.84), TILE, "rose"),
    "kid-back": ("086", (0.0, 0.08, 1.0, 0.83), TILE, "rose"),
    "curls-bun": ("043", (0.06, 0.10, 0.86, 0.90), TILE, "rose"),
    "curls-bun-side": ("042", (0.20, 0.12, 1.0, 0.92), TILE, "rose"),
    "curls-back": ("055", (0.06, 0.0, 0.94, 0.88), TILE, "rose"),
    "curls-side": ("050", (0.10, 0.0, 0.975, 1.0), TILE, "rose"),
    "afro-taper": ("056", (0.14, 0.12, 0.94, 0.92), TILE, "rose"),
    "curls-blue": ("072", (0.0, 0.05, 1.0, 0.80), TILE, "rose"),
    "beard-after": ("114", (0.215, 0.29, 0.783, 0.64), TILE, "rose"),
    "beard-bun": ("017", (0.14, 0.24, 0.90, 1.0), TILE, "rose"),
    "beard-fade": ("000", (0.10, 0.0, 0.886, 1.0), TILE, "rose"),
    # price board
    "price-adults": ("024", (0.06, 0.18, 0.84, 0.96), TILE, "rose"),
    "price-seniors": ("007", (0.04, 0.08, 0.96, 1.0), TILE, "rose"),
    "price-kids": ("073", (0.0, 0.02, 0.78, 0.80), TILE, "rose"),
    "price-towel": ("031", (0.17, 0.0, 0.7325, 1.0), TILE, "rose"),
    # barber portrait, cropped above the shirt print (confirm it is Johnny, see CONFIRM.md)
    "barber": ("025", (0.205, 0.32, 0.45, 0.5725), TILE, "rose"),
    # textures
    "cape": ("085", (0.0, 0.57, 0.70, 1.0), WIDE, "cape"),
    "shop": ("016", (0.0, 0.10, 1.0, 0.60), WIDE, "rose"),
}


def rose_grade(im: Image.Image) -> Image.Image:
    a = np.asarray(im).astype(np.float32) / 255
    hsv = np.asarray(im.convert("HSV")).astype(np.float32) / 255
    h, s, v = hsv[..., 0] * 360, hsv[..., 1], hsv[..., 2]
    dh = np.minimum(np.abs(h - 355), 360 - np.abs(h - 355))
    m = np.clip((15 - dh) / 8, 0, 1) * np.clip((s - 0.52) / 0.2, 0, 1) * np.clip((v - 0.12) / 0.15, 0, 1)
    # luminance with a gentle S-curve, then mapped from ink to paper
    g = 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]
    g = np.clip((g - 0.5) * 1.22 + 0.5, 0, 1)
    g = g * g * (3 - 2 * g) * 0.35 + g * 0.65
    mono = INK[None, None, :] * (1 - g[..., None]) + PAPER[None, None, :] * g[..., None]
    # keep reds, pushed slightly deeper toward the site's rose
    red = a * 255
    red = red * np.array([1.0, 0.82, 0.84], np.float32)
    out = mono * (1 - m[..., None]) + red * m[..., None]
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


def cape_grade(im: Image.Image) -> Image.Image:
    """The cape keeps every red; leaves and folds drop to deep ink so the fabric reads black and rose."""
    a = np.asarray(im).astype(np.float32) / 255
    hsv = np.asarray(im.convert("HSV")).astype(np.float32) / 255
    h, s = hsv[..., 0] * 360, hsv[..., 1]
    dh = np.minimum(np.abs(h - 355), 360 - np.abs(h - 355))
    m = np.clip((24 - dh) / 10, 0, 1) * np.clip((s - 0.25) / 0.2, 0, 1)
    g = 0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2]
    g = np.clip(g * 1.1, 0, 1) ** 1.5
    mono = INK[None, None, :] * (1 - g[..., None]) + PAPER[None, None, :] * g[..., None]
    red = np.clip((a - 0.5) * 1.25 + 0.5, 0, 1) * 255 * np.array([1.0, 0.8, 0.82], np.float32)
    out = mono * (1 - m[..., None]) + red * m[..., None]
    return Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))


def main():
    manifest = {}
    for pid, (src, box, widths, grade) in PHOTOS.items():
        im = Image.open(os.path.join(SRC, f"fg-{src}.jpg"))
        im = ImageOps.exif_transpose(im).convert("RGB")
        W, H = im.size
        x0, y0, x1, y1 = box
        im = im.crop((round(x0 * W), round(y0 * H), round(x1 * W), round(y1 * H)))
        if grade == "rose":
            im = rose_grade(im)
        elif grade == "cape":
            im = cape_grade(im)
        cw, ch = im.size
        sub = "textures" if pid in ("cape", "shop") else "photos"
        os.makedirs(os.path.join(OUT, sub), exist_ok=True)
        made = []
        for w in widths:
            if w > cw:
                continue
            h = round(ch * w / cw)
            im.resize((w, h), Image.LANCZOS).save(
                os.path.join(OUT, sub, f"{pid}-{w}.webp"), "WEBP", quality=74, method=6
            )
            made.append(w)
        if not made or made[-1] < cw and cw < widths[-1]:
            # source smaller than the next step: export at its own width (never upscale)
            im.save(os.path.join(OUT, sub, f"{pid}-{cw}.webp"), "WEBP", quality=74, method=6)
            made.append(cw)
        manifest[pid] = {"src": f"fg-{src}.jpg", "dir": sub, "w": cw, "h": ch, "widths": made}
        print(pid, cw, ch, made)
    with open(os.path.join(ROOT, "src", "data", "photo-manifest.json"), "w") as f:
        json.dump(manifest, f, indent=1)


if __name__ == "__main__":
    main()
