# User Manual — Contoh Kerja (self-contained)

Contoh nyata pembuatan user manual **mengikuti template BSI UII** (cover ber-logo + grafik
latar, heading berjenjang, screenshot, penutup). Dipakai nano sebagai acuan saat fase
**Dokumentasi**.

## Isi

| File | Keterangan |
|---|---|
| `assets/Manual-Penilaian-Kinerja-Penilai-v1.0.docx` | Hasil contoh (Word) — 5 gambar inline + 1 anchor background |
| `assets/Manual-Penilaian-Kinerja-Penilai-v1.0.pdf` | Versi PDF (6 halaman) hasil render HTML→Chrome |
| `scripts/build-user-manual.py` | Generator `.docx` (python-docx) — cover logo + background melayang, heading, langkah, catatan, screenshot |
| `scripts/docx2html.py` | `.docx` → HTML (pisahkan inline vs anchor, per-halaman, hormati perataan) |
| `scripts/render-pdf.sh` | `.docx` → PDF via Chrome headless + pratinjau `pdftoppm` |

## Cara pakai (proyek baru)

```bash
# 1) Siapkan screenshot (PNG) di satu folder, mis. ./shots/01-login.png ...
# 2) Sesuaikan teks/nama sistem di build-user-manual.py (bagian COVER & tiap bagian)
#    lalu jalankan:
python3 scripts/build-user-manual.py --out Manual-Sistem.docx --shots ./shots

# 3) Render PDF (tanpa LibreOffice):
./scripts/render-pdf.sh Manual-Sistem.docx
```

> `--logo`/`--bg` default mengarah ke `templates/cover-logo.png` & `templates/cover-bg.png`
> milik skill nano. Override bila perlu.

## Prinsip penting (yang mudah salah)

- **Cover wajib** berisi **logo UII** (inline 3.0 in) **dan grafik latar** (anchor `behindDoc`,
  8.51×4.73 in, dari halaman V≈6.3 in) — cover teks-saja dianggap salah.
- **Heading numbering manual** (bukan auto). H1 24pt bold + highlight kuning, H2/H3 biru
  `#093697` bold, H4 hitam bold.
- Tiap bagian: *"Berikut langkah-langkah yang harus dilakukan, yaitu:"* → langkah bernomor →
  catatan *italic* → **"… telah selesai."** di akhir.
- Dukung `**bold**` dan `*italic*` saat membangun paragraf — kalau tidak, tanda bintang
  muncul literal.
- **Verifikasi**: buka ulang docx (python-docx) + render PDF lalu lihat (`pdftoppm`).
  Kotak `□` di preview Quick Look = artefak renderer, **bukan** isi dokumen.

Lihat juga `../user-manual-guidance.md` (aturan penulisan & struktur lengkap) dan
`../../SKILL.md` bagian **"User manual — WAJIB pakai template BSI UII"**.
