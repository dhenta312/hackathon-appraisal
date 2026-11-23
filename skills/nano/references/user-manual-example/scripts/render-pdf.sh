#!/usr/bin/env bash
# render-pdf.sh — render .docx user manual -> PDF tanpa LibreOffice
# (docx -> HTML -> Chrome headless --print-to-pdf), lalu pratinjau via pdftoppm.
#
# Pakai:  ./render-pdf.sh Manual.docx [Manual.pdf]
set -euo pipefail

DOCX="${1:?Pakai: render-pdf.sh file.docx [output.pdf]}"
PDF="${2:-${DOCX%.docx}.pdf}"
HERE="$(cd "$(dirname "$0")" && pwd)"
HTML="$(mktemp -t manual).html"

python3 "$HERE/docx2html.py" "$DOCX" --out "$HTML"

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
if [ ! -x "$CHROME" ]; then
  echo "Chrome tidak ditemukan di $CHROME" >&2
  exit 1
fi

"$CHROME" --headless=new --disable-gpu --no-sandbox --no-pdf-header-footer \
  --virtual-time-budget=5000 --print-to-pdf="$PDF" "file://$HTML" >/dev/null 2>&1

echo "PDF: $PDF"
if command -v pdftoppm >/dev/null 2>&1; then
  pdftoppm -png -r 90 "$PDF" "${PDF%.pdf}-page"
  echo "Pratinjau halaman: ${PDF%.pdf}-page-1.png ... (cek cover, screenshot, penutup)"
fi
