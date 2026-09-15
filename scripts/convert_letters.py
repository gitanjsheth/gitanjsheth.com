#!/usr/bin/env python3
"""
convert_letters.py — turn testimonial letter PDFs into web-ready images.

The letters arrive as PDFs (in `letters_and_pics/`). PDFs don't render inline
cleanly, so this converts each one to a high-resolution, LOSSLESS PNG (PNG is
preferred over JPG to avoid text artefacts on documents), plus a small
first-page thumbnail for the card cutout.

    Input : letters_and_pics/*.pdf         (e.g. "Bhattsaheb Letter.pdf")
    Output: public/letters/<slug>.png      (full letter, all pages stacked)
            public/letters/thumbs/<slug>.png (first-page preview)

The <slug> is derived from the filename (trailing "Letter" dropped), so
"Bhattsaheb Letter.pdf" -> slug "bhattsaheb". Use that slug in the matching
testimonial JSON:

    "letterImage": "/letters/bhattsaheb.png",
    "letterThumb": "/letters/thumbs/bhattsaheb.png"

Requirements:
    pip install pymupdf pillow

Run:
    python3 scripts/convert_letters.py
    # options: --src DIR --out DIR --dpi 250 --thumb-width 400
"""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

try:
    import fitz  # PyMuPDF
except ImportError:
    sys.exit("Missing dependency: PyMuPDF. Run:  pip install pymupdf pillow")

try:
    from PIL import Image
except ImportError:
    sys.exit("Missing dependency: Pillow. Run:  pip install pymupdf pillow")


def slugify(filename: str) -> str:
    """'Ketanbhai KR Doshi Letter.pdf' -> 'ketanbhai-kr-doshi'."""
    stem = Path(filename).stem
    stem = re.sub(r"\bletter\b", "", stem, flags=re.IGNORECASE)  # drop the word "Letter"
    stem = stem.strip()
    stem = re.sub(r"[^A-Za-z0-9]+", "-", stem).strip("-").lower()
    return stem or "letter"


def render_pdf(pdf_path: Path, dpi: int) -> list[Image.Image]:
    """Render every page of a PDF to a list of PIL images at the given DPI."""
    pages: list[Image.Image] = []
    with fitz.open(pdf_path) as doc:
        zoom = dpi / 72.0  # PDF base is 72 DPI
        matrix = fitz.Matrix(zoom, zoom)
        for page in doc:
            pix = page.get_pixmap(matrix=matrix, alpha=False)
            img = Image.frombytes("RGB", (pix.width, pix.height), pix.samples)
            pages.append(img)
    return pages


def stack_vertically(images: list[Image.Image], gap: int = 24, bg=(255, 255, 255)) -> Image.Image:
    """Combine multiple pages into one tall image (single letterImage per letter)."""
    if len(images) == 1:
        return images[0]
    width = max(im.width for im in images)
    height = sum(im.height for im in images) + gap * (len(images) - 1)
    canvas = Image.new("RGB", (width, height), bg)
    y = 0
    for im in images:
        canvas.paste(im, ((width - im.width) // 2, y))
        y += im.height + gap
    return canvas


def make_thumb(first_page: Image.Image, width: int) -> Image.Image:
    ratio = width / first_page.width
    height = int(first_page.height * ratio)
    return first_page.resize((width, height), Image.LANCZOS)


def main() -> int:
    root = Path(__file__).resolve().parents[1]
    parser = argparse.ArgumentParser(description="Convert testimonial letter PDFs to PNGs.")
    parser.add_argument("--src", default=str(root / "letters_and_pics"),
                        help="Folder containing the letter PDFs.")
    parser.add_argument("--out", default=str(root / "public" / "letters"),
                        help="Output folder for full letter PNGs.")
    parser.add_argument("--dpi", type=int, default=250, help="Render DPI (200–300 recommended).")
    parser.add_argument("--thumb-width", type=int, default=400, help="Thumbnail width in px.")
    args = parser.parse_args()

    src = Path(args.src)
    out = Path(args.out)
    thumbs = out / "thumbs"
    out.mkdir(parents=True, exist_ok=True)
    thumbs.mkdir(parents=True, exist_ok=True)

    pdfs = sorted(p for p in src.glob("*.pdf"))
    if not pdfs:
        print(f"No PDFs found in {src}. Nothing to do.")
        return 0

    print(f"Converting {len(pdfs)} letter(s) from {src} at {args.dpi} DPI…\n")
    for pdf in pdfs:
        slug = slugify(pdf.name)
        pages = render_pdf(pdf, args.dpi)
        full = stack_vertically(pages)
        full_path = out / f"{slug}.png"
        thumb_path = thumbs / f"{slug}.png"
        full.save(full_path, format="PNG", optimize=True)
        make_thumb(pages[0], args.thumb_width).save(thumb_path, format="PNG", optimize=True)
        print(f"  {pdf.name:<32} -> {full_path.relative_to(root)}  (+ thumb)")
        print(f'      testimonial: "letterImage": "/letters/{slug}.png", '
              f'"letterThumb": "/letters/thumbs/{slug}.png"')

    print("\nDone. Reference the PNGs from your testimonial JSON (see lines above).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
