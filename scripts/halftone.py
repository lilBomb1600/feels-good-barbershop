"""
Small grayscale sources for the halftone backgrounds (BACKGROUNDS-22 #8, the barber/print-shop fit).
The dots themselves are drawn at runtime by src/components/ui/Halftone.tsx, so they stay crisp at any
size while the download stays a few KB (a pre-rendered dot screen was ~300 KB per section).
- halftone-rose-src: the rose cape (fg-085, red channel), red dots where the petals are, on the light reviews section.
- halftone-shop-src: the shop interior with the mural and checkered floor (fg-016), cream dots on the dark visit section.
"""
import os
import numpy as np
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "assets-inbox", "maps")
OUT = os.path.join(ROOT, "public", "images", "textures")


def source(src, box, w, name, channel=None):
    im = ImageOps.exif_transpose(Image.open(os.path.join(SRC, src))).convert("RGB")
    # the rose reads best from the red channel (petals bright, the fabric between them dark)
    im = im.getchannel(channel) if channel else im.convert("L")
    W, H = im.size
    im = im.crop((int(box[0] * W), int(box[1] * H), int(box[2] * W), int(box[3] * H)))
    im = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
    g = np.asarray(im).astype(np.float32) / 255
    lo, hi = np.percentile(g, 4), np.percentile(g, 96)
    g = np.clip((g - lo) / max(hi - lo, 1e-3), 0, 1)
    Image.fromarray((g * 255).astype(np.uint8)).save(os.path.join(OUT, f"{name}.webp"), "WEBP", quality=82)
    print(name, im.size, os.path.getsize(os.path.join(OUT, f"{name}.webp")), "bytes")


os.makedirs(OUT, exist_ok=True)
source("fg-085.jpg", (0.0, 0.5, 0.75, 1.0), 260, "halftone-rose-src", channel="R")
source("fg-016.jpg", (0.0, 0.12, 1.0, 0.62), 300, "halftone-shop-src")
