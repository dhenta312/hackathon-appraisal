# Hasil Karya — HACKATHON 2026 (BSI UII)

**Judul karya:** nano — AI Asisten untuk Manajemen Proyek (Ide → Dokumentasi)
**Bukti penerapan:** Platform Penilaian Kinerja Pegawai (Laravel + Angular, end-to-end)

---

## 01. Problem

Pengembangan sistem di lingkungan kampus menghadapi masalah **konsistensi proses**, bukan
masalah kekurangan alat. Satu tim sudah memakai AI untuk menulis kode, tetapi:

- **Konteks hilang antar-sesi dan antar-orang.** Keputusan di rapat tidak tercatat di mana
  pun, sehingga sesi berikutnya dimulai dari nol dan hal yang sama diputuskan ulang.
- **Dokumen kebutuhan tidak seragam.** PRD, rencana teknis, dan dokumentasi tiap tim
  berbeda format, sehingga sulit dibandingkan, di-review, atau diwariskan.
- **Standar desain UII (Pilar) tidak selalu dipakai** — tampilan aplikasi bergantung selera
  masing-masing pengembang.
- **Dokumentasi pengguna jadi prioritas terakhir**, sering tidak selesai saat proyek
  diserahkan.
- **AI dipakai tanpa kendali** → hasilnya terdengar meyakinkan tetapi sebagian karangan
  (halusinasi API, keputusan teknis tanpa dasar).

Akibatnya biaya terbesar proyek bukan menulis kode, melainkan **pengerjaan ulang** akibat
salah paham, dan **penyerahan** yang tertahan karena dokumen tidak siap.

---

## 02. Current Process

**Sebelum nano:**

| Tahap | Cara kerja sekarang | Masalah |
|---|---|---|
| Diskusi → requirement | Chat & rapat; hasil di catatan pribadi atau dokumen bebas | Tidak terstruktur, hilang antar-sesi |
| Perencanaan teknis | Dibuat per pengembang, bentuk bebas | Tidak seragam antar-tim, sulit direview |
| Pembangunan | AI dipakai ad-hoc (copilot/chat) tanpa SOP | Hasil bergantung skill individu, rawan halusinasi |
| Desain UI | Mengikuti selera pengembang | Standar Pilar tidak dipakai |
| Dokumentasi | Dikerjakan di akhir, bila sempat | Sering tidak lengkap |

**Inti persoalan:** setiap tahap bergantung pada **ingatan dan kebiasaan individu**, bukan
pada prosedur yang dilekatkan pada alat. Tim baru harus mempelajari ulang cara kerja tim
sebelumnya dari nol.

---

## 03. Solution

**nano** — AI asisten berbasis Claude Code yang menjadikan **siklus pengembangan sistem
sebagai prosedur yang dibakukan dan dapat dieksekusi**.

### Satu pintu masuk, tiga pekerjaan

| Pekerjaan | Masukan → Hasil |
|---|---|
| **Diskusi & Analisis** | catatan rapat → PRD + FSD + BPMN |
| **Pengembangan Sistem** | kebutuhan → design Figma + document spec + prototype (Full Angular+Laravel / Lite Vite) |
| **Dokumentasi** | aplikasi jalan → automated test + report + user manual |

### Empat mekanisme yang membedakan nano

1. **Memori antar-sesi** — berkas `docs/nano/state.md` di dalam repo proyek mencatat fase,
   yang selesai, yang berjalan, pertanyaan terbuka, dan keputusan. Karena ikut ter-clone,
   memori terdokumentasi dan tidak bergantung ingatan individu.
2. **Kontrol manusia di tiap langkah** — AI mengusulkan, manusia mengonfirmasi sebelum
   pekerjaan dilanjutkan. AI tidak memutuskan sendiri.
3. **Mengenal Pilar** — design token PILAR Design System UII dibawa sebagai knowledge bawaan
   nano, sehingga hasil UI konsisten sejak awal.
4. **Empat kendali kualitas** — (a) konfirmasi manusia per tahap, (b) kejujuran atas
   ketidaktahuan (informasi tanpa sumber ditandai "perlu dikonfirmasi"), (c) satu sumber
   resmi (dokumen di repo), (d) riwayat versi (hasil baru tidak menimpa yang lama).

### Bukti penerapan — Platform Penilaian Kinerja Pegawai

Aplikasi web yang **dibangun memakai nano** sebagai studi kasus nyata, bukan mockup.
Aplikasi menggantikan penilaian kinerja berbasis Google Form + rekap manual HR:

- **Alur menilai yang ringan** — role auto-load, alasan per komponen, save draft & resume, progres.
- **Skor yang transparan** — rumus terlihat, rincian per komponen, kontribusi penilai
  ditampilkan anonim (Penilai A/B), presensi sebagai data.
- **Skor maksimum 100** — Core Value (10), Soft Skill (25), Hard Skill (30),
  Growth & Innovation (15), Presensi (20).
- **Tata kelola mandiri admin** — kelola periode, pertanyaan, pilihan jawaban, dan bobot
  tanpa bantuan teknis.
- **Deteksi pengisian asal** — skor seragam, semua-maksimal, dan alasan copas ditandai
  sebelum data masuk.

**Output yang dihasilkan nano untuk proyek ini:** PRD, FSD/SPEC, BPMN, Document Spec,
User Manual, laporan tes, dan deck presentasi — lengkap dalam satu alur.

---

## 04. Impact

### Before vs After — proses pengembangan

| Aspek | Sebelum | Setelah memakai nano |
|---|---|---|
| Sumber kebenaran | ingatan individu & chat | `docs/nano/state.md` + dokumen di repo |
| Konsistensi dokumen | bebas per tim | satu format baku (PRD → FSD → BPMN) |
| Standar desain | selera pengembang | PILAR dibawa sebagai knowledge bawaan |
| Posisi dokumentasi | dikerjakan terakhir, sering tidak jadi | dihasilkan sebagai bagian alur |
| Ketergantungan pada individu | tinggi | prosedur ada di repo, siapa pun bisa melanjutkan |

### Before vs After — proses penilaian kinerja (pengguna akhir)

| Aspek | Sebelum (Google Form + rekap HR) | Setelah (Platform Penilaian Kinerja) |
|---|---|---|
| Waktu menilai satu rekan | ±3 jam | ±15 menit |
| Rekap skor | manual oleh HR, lambat & rawan salah | otomatis saat penilaian dikirim |
| Transparansi skor | angka gelap, sering dipertanyakan | rumus & rincian per komponen terbuka |
| Beban penilai | template berbeda per role, wajib alasan semua | role auto-load, draft bisa dilanjutkan |
| Deteksi pengisian asal | baru terdeteksi setelah direkap | ditandai sebelum data dikirim |

### Hasil terukur

- **Penilaian satu rekan turun dari ±3 jam menjadi ±15 menit** — pengurangan waktu
  sekitar 92% pada pekerjaan yang paling membebani penilai.
- **Rekap manual HR hilang sepenuhnya** — skor terhitung saat penilaian dikirim.
- **Keluhan "kenapa skor saya segitu?" dapat dijawab** — setiap angka bisa ditelusuri ke
  komponen dan kontributor (anonim).

> Catatan kejujuran: angka waktu di atas diambil dari batas atas dan bawah proses manual
> yang dilaporkan tim HR. Pengukuran before/after yang ketat (sampel penilai, periode
> terkontrol) direncanakan sebagai bagian fase adopsi dan belum dilakukan.

---

## 05. Governance

### Bagaimana memastikan cara kerja ini tetap dipatuhi?

1. **Prosedur melekat pada alat, bukan pada orang.** Skill nano disimpan di repo git dan
   dipasang lewat satu perintah (`./setup.sh`). Tim baru tidak bisa "lupa" mengikuti alur —
   alur itu yang menjalankan pekerjaan.
2. **Memori per-proyek difilekan di repo.** Setiap sesi diawali dengan membaca `state.md`
   dan diakhiri dengan memperbaruinya. Jejak keputusan dapat ditelusuri siapa pun.
3. **Kontrol manusia sebagai gerbang mutu.** AI tidak melanjutkan tahap tanpa konfirmasi
   penanggung jawab. Tanggung jawab akhir berada di manusia, bukan pada AI.
4. **Satu sumber resmi.** Dokumen di repo adalah acuan; jawaban di chat tidak dianggap
   kontrak. Ini mencegah perbedaan tafsir antar-tim.
5. **Riwayat versi terjaga.** Pembaruan dokumen menghasilkan versi baru, tidak menimpa —
   sehingga perubahan dapat dipertanggungjawabkan.
6. **Kepemilikan bersama.** Karena skill tersimpan di git, siapa pun di organisasi dapat
   meninjau, memperbaiki, dan menelusuri riwayatnya. Tidak ada ketergantungan pada satu orang.

### Rencana adopsi bertahap

| Fase | Cakupan | Ukuran |
|---|---|---|
| **Uji coba** | 1–2 tim | waktu penyusunan dokumen, jumlah revisi akibat salah paham |
| **Perluasan** | 3–5 tim | konsistensi desain, kelengkapan dokumentasi |
| **Standar organisasi** | seluruh unit | pertanyaan berulang ke tim, waktu onboarding anggota baru |

---

## 06. Security

### Bagaimana mencegah solusi menjadi security risk?

| Risiko | Mitigasi |
|---|---|
| **Halusinasi AI** (API/konfigurasi karangan) | 4 kendali kualitas + *grounding*: Context7 (dokumentasi library terkini) dan Laravel Boost (best practice Laravel) menahan AI menebak API |
| **Kebocoran kredensial** | seluruh kredensial (token Figma, Confluence, `.env`) di-*gitignore* dan hanya lokal; tidak pernah masuk riwayat commit |
| **AI bertindak tanpa otorisasi** | AI hanya mengusulkan; setiap tahap menunggu konfirmasi manusia. Tidak ada keputusan otomatis yang mengikat |
| **Data sensitif dikirim ke layanan luar** | hanya konteks yang relevan yang dikirim; dokumen hasil tetap tersimpan di repo organisasi, bukan di layanan pihak ketiga |
| **Kode membawa celah keamanan** | kode hasil nano ditinjau lewat PRD/SPEC dan direview manusia sebelum rilis; standar Laravel (Boost) dan Angular diikuti |
| **Kehilangan pekerjaan** | riwayat git + memori `state.md` = tidak ada pekerjaan yang hilang bila sesi atau anggota berubah |
| **Tanggung jawab tidak jelas** | keputusan final selalu di penanggung jawab manusia — terlacak di riwayat dokumen dan commit |

### Batas yang diakui

- Platform Penilaian Kinerja **belum** menggunakan SSO/LDAP dan belum lolos audit
  keamanan production-grade. Untuk demo, autentikasi memakai akun yang di-seed.
- Integrasi absensi masih berupa data contoh, bukan koneksi ke sistem kehadiran nyata.

Keduanya tercatat sebagai roadmap, bukan diklaim sebagai sudah terselesaikan.

---

## Ringkasan satu paragraf

nano mengubah penggunaan AI dari *asal jalan* menjadi **prosedur kerja yang dibakukan**:
satu pintu masuk tiga pekerjaan, memori antar-sesi, kontrol manusia per tahap, dan design
system UII sebagai bawaan — lalu membuktikannya dengan membangun Platform Penilaian Kinerja
Pegawai secara end-to-end, lengkap dengan dokumentasi dan tests.
