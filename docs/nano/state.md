# nano — Catatan Kerja

> Diperbarui otomatis oleh nano di akhir tiap sesi. Jangan dihapus — ini "memori"
> antar-sesi yang membuat nano tahu "kita lanjut dari mana".

## Status saat ini

- **Fase:** belum mulai (diskusi; belum memilih fase)
- **Terakhir diperbarui:** 2026-11-23

## Yang sudah selesai

- **2026-11-23** — **Contoh user manual dari template** dibuat:
  `docs/nano/contoh/Manual-Penilaian-Kinerja-Penilai-v1.0.docx` (1.9 MB, 4 screenshot asli,
  84 paragraf). Sistem: Platform Penilaian Kinerja (repo demo ini), user: **Penilai / Rekan Sejawat**.
  - Mengikuti template: cover biru `#093697` + alamat/IT support + salam; Overview + garis besar
    alur; 3 Heading 1 (Masuk · Membuka Form · Mengisi dan Mengirim) + H2 Penutup; tiap bagian
    diawali "Berikut langkah-langkah…", langkah bernomor, catatan *italic*, diakhiri
    "… telah selesai."; screenshot + caption; penutup + salam.
  - Heading terverifikasi: H1 24pt bold `#093697` highlight kuning · H2 18pt bold `#093697`.
  - Screenshot diambil dari app asli (Chrome CDP, backend port 8002 + frontend port 4300 —
    port 4200 milik proyek lain `App_Purnatugas`, tidak disentuh). Server uji sudah dimatikan.
  - Catatan: `soffice` tidak ada → render visual hanya via Quick Look (`qlmanage`); kotak kecil
    `□` di preview Quick Look adalah artefak render paragraf kosong, **bukan** isi dokumen.
  - **PDF versi kirim** dibuat 2026-11-23: `Manual-Penilaian-Kinerja-Penilai-v1.0.pdf` (6 halaman,
    ~2,4 MB). Karena LibreOffice/Word/pandoc tidak ada, PDF di-render via **docx → HTML → Chrome
    headless `--print-to-pdf`** (bukan engine Word). `.docx` tetap sumber utama; PDF meniru
    struktur/warna/style template. Diverifikasi via pypdf + `pdftoppm` (6 halaman, 4 screenshot,
    tanpa tanda `*` literal). Jika butuh PDF persis hasil Word → pasang LibreOffice.
  - Perbaikan 2026-11-23: penanda `**bold**`/`*italic*` diproses (tidak tampil literal); langkah
    alur Overview di-bold; screenshot 6in proporsional.
  - **Perbaikan cover 2026-11-23 (permintaan user):** cover kini punya **logo UII** (inline 3.0in,
    atas, tengah) + **grafik latar dekoratif** biru-kuning **melayang di belakang teks** (anchor
    `behindDoc`, 8.51×4.73in, dari halaman V≈6.3in) — sesuai template. Asset disimpan di skill:
    `templates/cover-logo.png` & `templates/cover-bg.png`, terdokumentasi di
    `references/user-manual-guidance.md` bagian A.
    Generator PDF diperbarui: pisahkan gambar inline vs anchor, tata per halaman, hormati
    perataan paragraf (center), dan render background sebagai `cover-bg` absolut di bawah.


## Yang sedang berjalan

- (kosong)

## Pertanyaan terbuka (perlu konfirmasi)

- (kosong)

## Keputusan yang sudah disepakati

- **2026-11-23** — **Skill nano (fase Dokumentasi / user manual) diperbarui menyeluruh** dengan
  pelajaran sesi ini. SKILL.md kini punya sub-bagian: **"Cover: logo + grafik latar"**,
  **"Render PDF (bila LibreOffice/Word tidak ada)"**, dan **"Verifikasi"**. Ditambahkan pula
  **contoh kerja self-contained** di skill: `references/user-manual-example/`
  (`scripts/build-user-manual.py` + `docx2html.py` + `render-pdf.sh` + `assets/` docx&pdf +
  `README.md`, skrip sudah ber-argumen `--out`/`--shots`/`--logo`/`--bg`). Aset cover
  `templates/cover-logo.png` & `cover-bg.png`. Diuji end-to-end: hasil docx 2,0 MB, PDF 6 hal,
  cover ber-logo+latar identik. Semua terdokumentasi di daftar **Knowledge bawaan** SKILL.md.

- **2026-11-23** — **User manual WAJIB pakai template `.docx` resmi BSI UII**, bukan buat baru.
  - Sumber: Confluence UX *User Manual Guidance* (page `150405155`). Token Confluence
    diperbarui 2026-11-23 (token lama ditolak 403).
  - Halaman guidance **tidak punya lampiran `.docx`** — template aslinya **Google Doc**
    (`12aduIlpSj0sFMo9QDvmjMH9R2HcWYAwi-NEY-wlR7EU`). Sudah di-export ke `.docx` dan disimpan
    di skill: `~/.claude/skills/nano/templates/user-manual-template.docx` (12.9 MB, 31 gambar,
    106 paragraf, style Heading 1–4).
  - Instruksi detail diekstrak dari **komentar** Google Doc → ditulis ke
    `~/.claude/skills/nano/references/user-manual-guidance.md`.
  - **SKILL.md diperbarui:** sub-bagian "User manual — WAJIB pakai template BSI UII" di fase
    Dokumentasi (prosedur + aturan heading/screenshot/penutup), tabel skill, dan daftar
    Knowledge bawaan.
  - Ringkasan aturan: satu manual per user; bahasa jelas & formal (`di tempat`, `silakan`);
    numbering heading **manual** (H1 24pt highlight kuning, H2/H3 biru `#093697` bold, H4 hitam
    bold); tiap step diakhiri kalimat "… telah selesai."; screenshot width 7.4 in + anotasi;
    format nama file `Manual [sistem]: [fitur dan versi] - [user: fitur utama]`.


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
