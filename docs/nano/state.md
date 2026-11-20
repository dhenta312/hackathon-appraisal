# nano — Catatan Kerja

> Diperbarui otomatis oleh nano di akhir tiap sesi. Jangan dihapus — ini "memori"
> antar-sesi yang membuat nano tahu "kita lanjut dari mana".

## Status saat ini

- **Fase:** belum mulai (diskusi; belum memilih fase)
- **Terakhir diperbarui:** 2026-11-20

## Yang sudah selesai

- (kosong)

## Yang sedang berjalan

- (kosong)

## Pertanyaan terbuka (perlu konfirmasi)

- (kosong)

## Keputusan yang sudah disepakati

- **2026-11-20** — Skill komunitas **Karpathy rules** (`forrestchang/andrej-karpathy-skills`)
  **tidak dipasang**: rule-nya tumpang-tindih dengan superpowers + system prompt, dan
  berpotensi bentrok dengan alur wajib nano (Simplicity First vs menu/tawaran fase nano).
- **2026-11-20** — **Document Skills resmi Anthropic dipasang** via plugin
  (`anthropics/skills` → `document-skills@anthropic-agent-skills`, scope user).
  Skill tersedia: `docx`, `xlsx`, `pptx`, `pdf` (+ bonus: `doc-coauthoring`,
  `frontend-design`, `theme-factory`, `webapp-testing`, dll.).
  Dependensi Python terpasang di `~/.local`: `python-docx`, `openpyxl`, `python-pptx`,
  `pypdf`, `pdfplumber`, `reportlab`.
  - **Rencana:** dipakai di fase **Dokumentasi** nano (test report + user manual dalam
    Word/Excel/PDF); opsional ekspor PRD/FSD ke Word.
  - **Sudah diuji 2026-11-20** — 4/4 format lolos:
    - `docx`: 10.9 KB, 3 tabel, pill warna (fill `E6F4EA`/teks `1E7B34`) terverifikasi via python-docx.
    - `xlsx`: openpyxl, header styled + freeze panes OK.
    - `pptx`: 1 slide 13.33×7.5 in, 10 shape OK.
    - `pdf`: reportlab → pypdf/pdfplumber baca balik OK; render visual via pdftoppm terverifikasi.
    - **Best practice terkonfirmasi:** docx butuh `columnWidths` tabel + `width` per cell (DXA), shading `CLEAR`; pptx pakai `slide_layouts[6]` blank. Prefix `pdf2image` output dir harus dibuat dulu.
  - **Keterbatasan lingkungan (bukan bug skill):** `soffice` tidak terpasang → render visual docx/pptx via PDF tidak bisa; npm `docx` tidak ter-bundle → install manual di dir kerja; `pandoc` tidak ada (dipakai untuk baca docx, jarang perlu).
  - Overlap yang perlu diatur: `pptx` (Anthropic) vs `editing-powerpoint-with-python` (lokal).
  - Bukti uji: `docs/nano/contoh/` (QA-Test-Report.docx, Lampiran-Test-Cases.xlsx, Slide-Uji-Coba.pptx, Ringkasan-Uji.pdf, page-1.jpg).
  - **Skill nano diperbarui** (`~/.claude/skills/nano/SKILL.md`): tawarkan format dokumen
    (Word/Excel/PowerPoint/PDF/Markdown) di fase **Dokumentasi**, pada **sesi terkait
    dokumen**, dan opsi ekspor PRD/FSD ke Word/PDF; tabel skill + catatan dependensi
    document-skills ditambahkan.
  - **Tawaran Confluence tetap wajib** — format dokumen (Word/Excel/PPT/PDF) dan publish
    Confluence adalah dua tawaran terpisah; tawaran document-skills tidak boleh
    menggantikan/menggeser tawaran Confluence (ditegaskan di checklist #4 & fase Dokumentasi).
