# FAQ — Prediksi Pertanyaan Juri (nano)

Dokumen ini berisi prediksi pertanyaan yang mungkin ditanyakan juri saat pitching nano,
lengkap dengan jawaban siap pakai. Diprioritaskan dari yang paling berbahaya.

---

## 1. Inovasi & Posisi

**Q: Apa bedanya nano dengan sekadar pakai Claude Code biasa?**
> Claude Code itu *mesin*; nano itu *prosedur kerja yang dibakukan*. `SKILL.md` = "SOP yang
> bisa dieksekusi AI". Inovasinya bukan AI-nya, tapi **satu alur baku + memori antar-sesi +
> kontrol manusia** — supaya hasil konsisten antar-tim, bukan bergantung skill individu.

**Q: Bukannya ini cuma file markdown?**
> Betul bentuknya markdown, tapi fungsinya **prosedur yang dipaksa diikuti AI**. Seperti
> "checklist pilot": terlihat sederhana, tapi nilainya di isi (best practice + jebakan +
> kontrol) yang mencegah AI menyimpang.

**Q: Kenapa tidak pakai Copilot / Cursor / tool lain?**
> Nano bukan pengganti coding assistant — dia **orkestrasi alur end-to-end** (ide → dokumen),
> dengan memori + kontrol manusia + standar desain UII. Bisa dipakai bersamaan dengan tool lain.

---

## 2. Bukti & Kecepatan

**Q: Bisa buktikan lebih cepat?**
> Studi kasus: **sistem penilaian pegawai** end-to-end selesai dalam **±2 hari / 38 commit**,
> lengkap dokumentasi (PRD, FSD, BPMN, Document Spec, User Manual) + **test E2E lolos**.
> Pengukuran before/after jadi bagian fase adopsi (ada KPI-nya).

**Q: App demo-nya kecil — ini skala ke proyek nyata?**
> Nano bukan app, tapi **alur kerja**. Ukuran proyek tidak mengubah alurnya. Justru makin besar
> proyek, makin besar manfaat konsistensi + memori.

---

## 3. Kualitas & Keamanan

**Q: Kalau AI halusinasi / mengarang?**
> Ada **4 kendali kualitas**: (1) konfirmasi manusia tiap tahap, (2) kejujuran atas
> ketidaktahuan (info tanpa sumber ditandai "perlu dikonfirmasi"), (3) satu sumber resmi (repo),
> (4) riwayat versi (tidak menimpa). Ditambah grounding: **Context7** (doc library terkini) +
> **Laravel Boost** (best practice Laravel).

**Q: Keamanan token / secret?**
> Semua kredensial (Figma, Confluence, `.env`) **gitignored & lokal**, tidak pernah ke-commit.
> `.gitignore` bisa ditunjukkan sebagai bukti.

**Q: Kalau output AI salah, siapa yang bertanggung jawab?**
> **Manusia** — karena manusia yang mengonfirmasi di tiap tahap. AI tidak memutuskan sendiri;
> keputusan final selalu di penanggung jawab.

---

## 4. Reusabilitas & Adopsi

**Q: Tim lain bisa langsung pakai tanpa kamu?**
> Ya — `git clone` + `./setup.sh` (otomatis pull + pasang skill) + restart Claude Code.
> Prasyarat wajib cuma **Claude Code**; sisanya (Figma, Context7, ngrok, Confluence) **opsional**.

**Q: Prasyaratnya banyak — itu tidak menyulitkan?**
> Yang wajib hanya Claude Code (dasar). Sisanya bertahap — nano tetap jalan untuk PRD/FSD/BPMN
> tanpa dependency tambahan.

---

## 5. Scope & Teknis

**Q: Kalau project bukan Angular/Laravel?**
> Nano punya 2 mode: **Full** (Angular + Laravel) dan **Lite** (Vite, frontend saja). Dan alur
> **Diskusi & Analisis** + **Dokumentasi** bersifat stack-agnostic. Ke depan bisa ditambah
> template stack lain.

**Q: "Memori antar-sesi" itu teknisnya apa?**
> File `docs/nano/state.md` di dalam repo proyek — mencatat fase, selesai, berjalan, pertanyaan
> terbuka, keputusan. Karena di repo, memori **ikut ter-clone & terdokumentasi**, tidak
> bergantung ingatan individu.

---

## 6. Organisasi & Roadmap

**Q: Rencana adopsi ke organisasi?**
> 3 fase: **uji coba** (1–2 tim) → **perluasan** (3–5 tim) → **standar organisasi**. Diukur
> dengan KPI: waktu penyusunan dokumen, revisi akibat salah paham, konsistensi desain,
> kelengkapan dokumentasi, pertanyaan berulang ke tim.

**Q: Siapa yang memelihara skill kalau rusak?**
> Karena skill tersimpan di **repo (git)**, siapa pun di tim bisa meninjau, memperbarui, dan
> menelusuri riwayatnya — bukan milik satu orang.

---

## Tips menjawab

1. **Jangan jual "AI-nya"** — jual **alur + memori + kontrol manusia** yang konsisten.
2. **Kalau tidak tahu, jujur** — "itu belum kami ukur, akan diukur di fase X" lebih kuat
   daripada mengarang angka.
3. **Selalu arahkan ke bukti** — 38 commit, ±2 hari, dokumentasi lengkap, test lolos.
