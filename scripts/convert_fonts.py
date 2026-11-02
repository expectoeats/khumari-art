# One-off build script: create woff2 subsets (Latin range) of web-used fonts.
# Originals are kept untouched; CSS references woff2 first, OTF/TTF as fallback.
import os
from fontTools.subset import main as subset_main

FONTS_DIR = os.path.join("public", "fonts")
FILES = [
    "SF-Pro-Display-Light.otf",
    "SF-Pro-Display-Regular.otf",
    "SF-Pro-Display-Medium.otf",
    "SF-Pro-Display-Semibold.otf",
    "SF-Pro-Display-Bold.otf",
    "SF-Pro-Text-Regular.otf",
    "SF-Pro-Text-Medium.otf",
    "SF-Pro.ttf",
    "BeausiteFit-Light.otf",
    "BeausiteFit-Regular.otf",
    "BeausiteFit-Medium.otf",
    "BeausiteFit-Bold.otf",
]
UNICODES = ",".join([
    "U+0020-007E",      # Basic Latin
    "U+00A0-00FF",      # Latin-1 Supplement
    "U+0100-017F",      # Latin Extended-A
    "U+2000-206F",      # General Punctuation (quotes, dashes, ellipsis)
    "U+20A0-20BF",      # Currency symbols (rupee, euro, pound...)
    "U+2150-218F",      # Number forms (fractions)
    "U+25A0-25FF",      # Geometric shapes (bullets)
    "U+2700-27BF",      # Dingbats
])

for fname in FILES:
    src = os.path.join(FONTS_DIR, fname)
    dst = os.path.join(FONTS_DIR, fname.rsplit(".", 1)[0] + ".woff2")
    if not os.path.exists(src):
        print(f"SKIP (missing): {fname}")
        continue
    subset_main([
        src,
        f"--unicodes={UNICODES}",
        "--layout-features=*",
        "--hinting=True",
        "--flavor=woff2",
        f"--output-file={dst}",
        "--name-IDs=1,2,3,4,5,6",
        "--recalc-bounds",
    ])
    kb_in, kb_out = os.path.getsize(src) // 1024, os.path.getsize(dst) // 1024
    print(f"OK {fname}: {kb_in}KB -> {kb_out}KB")

print("DONE")
