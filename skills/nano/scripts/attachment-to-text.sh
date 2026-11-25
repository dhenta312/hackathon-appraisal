#!/usr/bin/env bash
# attachment-to-text.sh — konversi lampiran non-teks menjadi teks.
#
# Latar: gateway LiteLLM (ANTHROPIC_BASE_URL) hanya melayani model text-only.
# Mengirim gambar/PDF/berkas binary sebagai content block memicu API 400
# ("messages.content.type is invalid, allowed values: ['text']"). Skrip ini
# mengekstrak teks secara LOKAL sehingga hasilnya aman dikirim sebagai teks.
#
# Pemakaian:
#   bash attachment-to-text.sh <berkas> [<berkas> ...]
#
# Output: satu berkas .txt per input di /tmp/nano-attachments/<nama>.txt
# Cetakan stdout = path hasil (satu baris per berkas). Error → stderr, exit != 0.
#
# Didukung: pdf (pdftotext) · docx/doc/rtf/html (textutil) · xlsx (openpyxl)
#           pptx (python3 stdlib) · gambar: png/jpg/jpeg/gif/webp/tif/tiff/heic/bmp
#           (sips → tesseract OCR, bahasa ind+eng) · berkas teks apa pun (lolos langsung)

set -uo pipefail

OUT_DIR="/tmp/nano-attachments"
mkdir -p "$OUT_DIR"

log_err() { echo "attachment-to-text: $*" >&2; }
cmd_ok()  { command -v "$1" >/dev/null 2>&1; }

# Ekstraksi teks untuk satu berkas → cetak path hasil.
convert_one() {
  local input="$1"
  local base out

  if [[ ! -f "$input" ]]; then
    log_err "berkas tidak ditemukan: $input"; return 2
  fi
  base="$(basename "$input")"
  local ext
  ext="$(echo "${input##*.}" | tr '[:upper:]' '[:lower:]')"   # aman untuk bash 3.2 macOS
  # Sertakan ekstensi asli pada nama hasil agar docx & pdf bernama sama tidak saling menimpa.
  out="$OUT_DIR/${base}.txt"

  case "$ext" in
    txt|md|csv|json|log|xml|yml|yaml|ts|js|py|php|java|sql|sh|env|ini|conf)
      cp "$input" "$out" ;;
    pdf)
      cmd_ok pdftotext || { log_err "pdftotext tidak terpasang (brew install poppler)"; return 3; }
      pdftotext -layout "$input" "$out" || return 3 ;;
    docx|doc|rtf|htm|html|odt)
      textutil -convert txt -stdout "$input" > "$out" || return 3 ;;
    xlsx|xls)
      cmd_ok python3 || { log_err "python3 tidak tersedia"; return 3; }
      python3 - "$input" "$out" <<'PY' || return 3
import sys
from openpyxl import load_workbook
src, dst = sys.argv[1], sys.argv[2]
wb = load_workbook(src, data_only=True)
with open(dst, "w") as f:
    for ws in wb.worksheets:
        f.write(f"### Sheet: {ws.title} ###\n")
        for row in ws.iter_rows(values_only=True):
            f.write("\t".join("" if c is None else str(c) for c in row) + "\n")
PY
      ;;
    pptx)
      cmd_ok python3 || { log_err "python3 tidak tersedia"; return 3; }
      python3 - "$input" "$out" <<'PY' || return 3
import sys, re, zipfile, html
src, dst = sys.argv[1], sys.argv[2]
with zipfile.ZipFile(src) as z:
    slides = sorted(n for n in z.namelist()
                    if re.fullmatch(r"ppt/slides/slide\d+\.xml", n))
    parts = []
    for i, name in enumerate(slides, 1):
        xml = z.read(name).decode("utf-8", "ignore")
        texts = [html.unescape(t) for t in re.findall(r"<a:t>(.*?)</a:t>", xml, re.S)]
        parts.append(f"### Slide {i} ###\n" + "\n".join(texts))
    open(dst, "w").write("\n\n".join(parts))
PY
      ;;
    png|jpg|jpeg|gif|webp|tif|tiff|heic|bmp|pct)
      cmd_ok tesseract || { log_err "tesseract tidak terpasang (brew install tesseract)"; return 3; }
      local ocr_in="$input"
      # HEIC/TIFF/BMP tidak dibaca tesseract → konversi ke PNG dulu via sips.
      case "$ext" in
        heic|tif|tiff|bmp|pct)
          ocr_in="$OUT_DIR/${base%.*}.png"
          sips -s format png "$input" --out "$ocr_in" >/dev/null || return 3 ;;
      esac
      tesseract "$ocr_in" "${out%.txt}" -l ind+eng --psm 3 >/dev/null 2>&1 || return 3 ;;
    *)
      # Ekstensi tak dikenal: percobaan teks via content-type.
      local mime
      mime="$(file -b --mime-type "$input")"
      if [[ "$mime" == text/* || "$mime" == "application/json" ]]; then
        cp "$input" "$out"
      else
        log_err "tipe tidak didukung: $input (mime: $mime)"; return 2
      fi ;;
  esac

  if [[ ! -s "$out" ]]; then
    log_err "hasil kosong untuk: $input (mungkin hasil scan tanpa lapisan teks?)"
  fi
  echo "$out"
}

[[ $# -ge 1 ]] || { log_err "pemakaian: bash attachment-to-text.sh <berkas> [...]"; exit 1; }

fail=0
for f in "$@"; do
  convert_one "$f" || fail=1
done
exit "$fail"
