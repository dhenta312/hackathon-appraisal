# Hasil Karya — HACKATHON 2026 (BSI UII)

**Judul karya:** nano — AI Asisten untuk Manajemen Proyek (Ide → Sistem → Dokumentasi)
**Bukti penerapan:** Platform Penilaian Kinerja Pegawai (Laravel + Angular, end-to-end) — pilot project

> Dokumen ini mengikuti 6 bagian format penulisan hasil karya Hackathon 2026.

---

## 01. Problem

**Badan Sistem Informasi UII tidak kekurangan format. Tidak kekurangan tempat menyimpan dokumen. Tidak
kekurangan alat bantu AI. Yang kurang hanya satu: waktu untuk mengetiknya.**

Dokumen sudah punya format baku, dan Confluence sudah jadi rumahnya. Tapi rumah itu kosong
sampai ada orang yang duduk dan mengetik. Itulah masalahnya:

- **Semua dokumen masih lahir dari jari manusia** — notulen rapat, laporan progres, dokumen
  serah terima, dokumen UAT, daftar risiko, sampai dokumentasi pengguna. Makin banyak
  dokumen, makin panjang antrean mengetik.
- **Confluence jadi gudang, bukan mesin** — notulen rapat masuk, lalu berhenti di sana.
  Tidak ada yang mengubahnya menjadi analisis; jembatan antara rapat dan dokumen tetap
  dijaga ingatan orang.
- **Format teknis sudah siap, isinya belum** — template FSD/SPEC ada, tetapi tetap diketik
  dari nol setiap proyek.
- **Pilar sudah ada, komponen custom masih liar** — komponen di luar Pilar dirancang manual
  dan perlahan semakin kompleks.
- **Dokumentasi pengguna selalu jadi yang terakhir** — dan paling sering tidak pernah selesai.
- **AI dipakai tanpa rem** — hasilnya terdengar meyakinkan, padahal sebagian karangan:
  API yang tidak ada, keputusan teknis tanpa dasar.

Ujungnya sama di setiap proyek: **waktu tim habis untuk mengetik ulang yang seharusnya bisa
mengerjakan hal lain**, dan penyerahan tertahan karena dokumen belum siap.

---

## 02. Current Process

**Alurnya sudah ada. Yang belum ada adalah yang mengerjakannya.**

| Tahap | Cara kerja sekarang | Yang masih manual |
|---|---|---|
| Diskusi → analisis | Hasil rapat **disimpan di Confluence** | Menyusun analisis dari catatan; menuangkannya ke halaman Confluence |
| Dokumen pendukung | Disimpan di Confluence dengan format ada | **Notulen rapat, laporan progres, dokumen serah terima, dokumen UAT, daftar risiko** — semuanya diketik manual |
| Perencanaan teknis | Sudah ada formatnya (FSD/SPEC) | Tetap **ditulis manual** dari nol |
| Desain UI | Sudah ada **Pilar** (design system UII) | **Terkendala komponen custom** — komponen di luar Pilar masih harus dirancang manual dan kerap tidak konsisten |
| Dokumentasi pengguna | Dibuat di akhir proyek | Masih **ditulis manual**, sering tidak sempat selesai |

**Inti persoalan:** format dan tempat sudah tertata; yang belum tertata adalah **proses
produksinya**. Setiap dokumen bergantung pada satu orang yang sedang punya waktu untuk
mengetik. Confluence baru sebatas arsip — belum pernah menjadi bagian dari alur kerja.

Khusus untuk **penilaian kinerja pegawai** (kasus yang digantikan di pilot project):
prosesnya memakai **Google Form + rekap manual oleh HR** — template berbeda per role,
penilai wajib menulis alasan di semua komponen, dan skor baru ketahuan setelah HR merekap
di akhir periode.

---

## 03. Solution

**nano menjalankan satu siklus penuh — bukan hanya dokumentasinya.** Ia masuk paling awal,
membaca notulen rapat di Confluence, menyusun analisis dan spesifikasi, lalu **membangun
sistemnya**: desain dengan Pilar, kode Angular + Laravel yang dipandu Context7 dan Laravel
Boost. Setelah sistemnya jalan, ia menutup lingkaran — menghasilkan dokumentasi dan
**menerbitkannya kembali ke Confluence**.

Format tetap milik organisasi. Tempat penyimpanan tetap milik organisasi. Yang digantikan
adalah **pekerjaan manual di sepanjang siklus** — dari mengetik dokumen sampai menebak API.

### Satu pintu masuk, tiga pekerjaan

| Pekerjaan | Masukan → Hasil |
|---|---|
| **Diskusi & Analisis** | catatan rapat → PRD + FSD + BPMN |
| **Pengembangan Sistem** | kebutuhan → design Figma + document spec + prototype (Full Angular+Laravel / Lite Vite) |
| **Dokumentasi** | aplikasi jalan → automated test + report + user manual |

### Yang sudah berjalan hari ini

| Sebelumnya dikerjakan manual | Kini ditangani nano |
|---|---|
| **Membaca notulensi/hasil diskusi di Confluence** | nano meminta link dokumentasi, membaca halamannya, lalu menjadikannya bahan analisis |
| Analisis dari catatan rapat | PRD + FSD/SPEC + BPMN |
| Perencanaan teknis (sudah ada format) | diisi nano mengikuti format yang ada |
| Dokumentasi pengguna di akhir proyek | user manual + laporan tes, dihasilkan sebagai bagian alur |
| Menyalin dokumen ke Confluence | **publish otomatis** (PRD, FSD, BPMN, screenshot, manual) |

Perhatikan bahwa lingkarannya sudah **tertutup**: nano membaca dari Confluence sebelum
bekerja, dan menulis ke Confluence setelah selesai. Tidak ada lagi orang yang bolak-balik
menyalin.

### nano ikut membangun sistemnya — bukan sekadar mencatatnya

Ini yang membedakan nano dari asisten dokumentasi. Saat masuk ke **Pengembangan Sistem**,
nano tidak mengarang dari ingatan; ia membaca acuan yang benar sebelum menulis satu baris kode.

| Penopang | Perannya saat nano membangun sistem |
|---|---|
| **Pilar (design system UII)** | token PILAR **terbundel di dalam nano** (`references/pilar-design-tokens.md`), dibaca sebelum menyusun desain → UI mengikuti standar UII sejak layar pertama, bukan selera pengembang |
| **Context7 MCP** | menarik **dokumentasi library terkini** (Angular, Laravel, Vite, Tailwind) → nano membaca API resminya, bukan menebak dari ingatan |
| **Laravel Boost MCP** | membawa **guideline & best practice Laravel** resmi → kode backend mengikuti konvensi framework, bukan tebakan |
| **dev-workflow UII** | konvensi pengembangan organisasi — stack, token Tailwind PILAR, pola commit, stepper, jebakan yang biasa terjadi |

Hasilnya bisa dipilih sesuai kebutuhan: **Full** (Angular + Laravel + SQLite) untuk sistem
yang butuh backend dan data, atau **Lite** (Vite) untuk prototype cepat. Keduanya tetap
membawa Pilar. nano juga bisa menyalakan aplikasinya sendiri — cek dependency, minta
konfirmasi, lalu jalankan server dan berikan URL-nya.

### Empat hal yang membuat nano berbeda

1. **nano tidak lupa.** Berkas `docs/nano/state.md` di dalam repo mencatat fase, yang sudah
   selesai, yang sedang jalan, pertanyaan terbuka, dan keputusan. Karena ikut ter-clone,
   memori ini milik tim — bukan milik satu kepala.
2. **Manusia tetap di kursi kemudi.** nano mengusulkan, manusia mengonfirmasi. Tidak ada
   tahap yang berjalan tanpa izin.
3. **nano membangun sesuai standar, bukan sesuai tebakan.** Pilar untuk desain, Context7
   dan Laravel Boost untuk kode — tiga sumber kebenaran yang menahan AI dari mengarang.
4. **Empat kendali kualitas.** Konfirmasi manusia per tahap, kejujuran atas ketidaktahuan
   (informasi tanpa sumber ditandai "perlu dikonfirmasi"), satu sumber resmi di repo, dan
   riwayat versi yang tidak menimpa.

### Batas yang kami akui: Pilar dan komponen custom

Pilar dibawa sebagai pengetahuan bawaan, jadi komponen yang sudah ada di Pilar langsung
dipakai konsisten. **Komponen custom di luar Pilar belum sepenuhnya tertangani** — nano
memakai pola dan token Pilar sebagai acuan, tetapi perancangan komponen baru masih perlu
tinjauan manusia. Ini **solusi parsial, bukan tuntas**, dan kami sebut apa adanya.

### Lima dokumen yang belum kami tangani

Kami tidak mengklaim semuanya beres. Kelima dokumen ini masih diketik manual dan menjadi
pekerjaan berikutnya:

| Dokumen | Kondisi sekarang |
|---|---|
| **Notulen rapat** | dibaca nano sebagai bahan analisis, tetapi **belum** ditulis ulang oleh nano |
| **Laporan progres** | masih diketik manual di Confluence |
| **Dokumen serah terima** | masih diketik manual di akhir proyek |
| **Dokumen UAT** | masih diketik manual |
| **Daftar risiko** | masih diketik manual |

### Pilot project — Platform Penilaian Kinerja Pegawai

Satu aplikasi web nyata yang **dibangun memakai nano**, bukan mockup. Fungsinya di sini
bukan menggantikan peran HR, melainkan **menjadi bukti**: nano sanggup membawa produk dari
ide sampai dokumentasi.

- **Menilai jadi ringan** — role auto-load, alasan per komponen, save draft & resume, progres.
- **Skor terbuka** — rumus terlihat, rincian per komponen, kontribusi penilai ditampilkan
  anonim (Penilai A/B), presensi sebagai data.
- **Skor maksimum 100** — Core Value (10), Soft Skill (25), Hard Skill (30),
  Growth & Innovation (15), Kehadiran & Kedisiplinan (20).
- **Admin mandiri** — kelola periode, pertanyaan, pilihan jawaban, dan bobot tanpa bantuan
  teknis. Otorisasi terpisah antara admin dan pengguna biasa.
- **Pengisian asal terdeteksi** — skor seragam, semua-maksimal, dan alasan copas ditandai
  sebelum data masuk.

**Yang dihasilkan nano untuk proyek ini:** PRD, FSD/SPEC, BPMN, Document Spec, User Manual,
laporan tes, dan deck presentasi — seluruhnya dalam satu alur.

---

## 04. Impact

**Buktinya bukan slide. Buktinya riwayat git.**

Yang berubah adalah **cara tim mengembangkan sistem**, bukan cara HR menilai pegawai.
Platform Penilaian Kinerja adalah **pilot project** — objek uji untuk mengukur seberapa jauh
nano bisa membawa sebuah produk.

### Sebelum vs Sesudah

| Aspek | Sebelum | Setelah memakai nano |
|---|---|---|
| Produksi dokumen | diketik manual satu per satu | dihasilkan nano dari catatan diskusi |
| Perencanaan teknis | format ada, isi diketik manual | diisi nano mengikuti format yang ada |
| Dokumentasi pengguna | manual, sering tidak selesai | dihasilkan sebagai bagian alur |
| Hasil rapat → analisis | baca notulensi, analisis dibuat manual | nano membaca halaman Confluence & menyusun analisisnya |
| Publish ke Confluence | disalin manual ke halaman | dipublikasikan otomatis |
| Sumber kebenaran | ingatan individu & chat | `docs/nano/state.md` + dokumen di repo |
| Menulis kode | mengandalkan ingatan AI soal API | dipandu **Context7** (doc terkini) + **Laravel Boost** (best practice) |
| Standar desain | Pilar ada, komponen custom manual | **token Pilar terbundel di nano**; komponen custom: parsial |
| Ketergantungan pada individu | tinggi | prosedur ada di repo, siapa pun bisa melanjutkan |
| Kendali atas AI | ad-hoc, hasil rawan karangan | 4 kendali kualitas + *grounding* Context7/Laravel Boost |

### Dampak terukur pada pilot project

Satu produk end-to-end — Laravel + Angular, 5 kategori penilaian, RBAC, deteksi pengisian
asal — dibangun **±2 hari kerja / 38 commit**, pada **30 Okt – 5 Nov 2026**.

> **Nol commit menyentuh aplikasi setelah 5 Nov.** Dua minggu berikutnya, repo hanya
> diperbarui untuk mengembangkan nano itu sendiri. Artinya kode yang dihasilkan **selesai** —
> bukan setengah jadi yang harus ditambal terus.

Dampaknya terasa di dua sisi:

- **Bagi pengembang** — satu orang menempuh ide → PRD → FSD → aplikasi → dokumentasi dalam
  satu tarikan napas, tanpa kehilangan konteks antar-sesi.
- **Bagi pengguna akhir (bonus dari pilot)** — waktu menilai satu rekan turun dari ±3 jam
  menjadi ±15 menit, dan rekap manual HR hilang karena skor terhitung saat dikirim.

> **Catatan kejujuran.** Angka kecepatan build (2 hari, 38 commit) dihitung langsung dari
> riwayat git — siapa pun bisa memeriksanya. Angka ±3 jam → ±15 menit berasal dari laporan
> tim HR sebagai batas proses lama, **bukan** pengukuran terkontrol; pengukuran ketatnya
> direncanakan pada fase adopsi dan **belum dilakukan**.

### Angka yang bisa dibawa ke panggung

- **±3 jam → ±15 menit** untuk menilai satu rekan — sekitar **92%** pekerjaan terberat
  penilai hilang.
- **Rekap manual HR: nol** — skor terhitung saat penilaian dikirim.
- **Pertanyaan "kenapa skor saya segitu?" akhirnya bisa dijawab** — setiap angka bisa
  ditelusuri ke komponen dan kontributornya (anonim).

---

## 05. Governance

**Kepatuhan tidak boleh bergantung pada disiplin orang. Ia harus melekat pada alatnya.**

1. **Prosedurnya ada di dalam alat.** Skill nano tersimpan di repo git dan dipasang dengan
   satu perintah (`./setup.sh`). Tim baru tidak bisa "lupa" mengikuti alur — alur itulah yang
   menjalankan pekerjaan.
2. **Memori proyek ikut ter-commit.** Setiap sesi dibuka dengan membaca `state.md` dan
   ditutup dengan memperbaruinya. Jejak keputusan bisa ditelusuri siapa pun.
3. **Manusia adalah gerbang mutu.** Tidak ada tahap yang lanjut tanpa konfirmasi penanggung
   jawab. Tanggung jawab akhir tetap di manusia, bukan di AI.
4. **Satu sumber resmi.** Dokumen di repo adalah acuan; jawaban di chat bukan kontrak. Ini
   yang mencegah satu tim menafsirkan berbeda dari tim lain.
5. **Riwayat tidak ditimpa.** Setiap pembaruan menghasilkan versi baru, sehingga setiap
   perubahan bisa dipertanggungjawabkan.
6. **Tidak ada satu orang yang jadi titik lemah.** Karena skill ada di git, siapa pun bisa
   meninjau, memperbaiki, dan menelusuri riwayatnya.
7. **Format organisasi dihormati.** nano mengisi format yang sudah berlaku — FSD/SPEC dan
   halaman Confluence — bukan memaksa format baru.

### Rencana adopsi bertahap

| Fase | Cakupan | Yang diukur |
|---|---|---|
| **Uji coba** | 1–2 tim | waktu penyusunan dokumen, jumlah revisi akibat salah paham |
| **Perluasan** | 3–5 tim | konsistensi desain, kelengkapan dokumentasi |
| **Standar organisasi** | seluruh unit | pertanyaan berulang ke tim, waktu onboarding anggota baru |

---

## 06. Security

**Bahaya terbesar AI bukanlah jawaban yang salah — melainkan jawaban salah yang terdengar
benar.** Karena itu pertahanannya dibangun sejak awal.

| Risiko | Mitigasi |
|---|---|
| **Halusinasi AI** (API/konfigurasi karangan) | 4 kendali kualitas + *grounding*: Context7 (dokumentasi library terkini) dan Laravel Boost (best practice Laravel) menahan AI menebak API |
| **Kebocoran kredensial** | seluruh kredensial (token Figma, Confluence, `.env`) di-*gitignore* dan hanya lokal; terverifikasi tidak pernah masuk riwayat commit |
| **AI bertindak tanpa otorisasi** | AI hanya mengusulkan; setiap tahap menunggu konfirmasi manusia. Tidak ada keputusan otomatis yang mengikat |
| **Data sensitif dikirim ke layanan luar** | hanya konteks yang relevan yang dikirim; dokumen hasil tetap tersimpan di repo organisasi, bukan di layanan pihak ketiga |
| **Kode membawa celah keamanan** | kode hasil nano ditinjau lewat PRD/SPEC dan direview manusia sebelum rilis; standar Laravel (Boost) dan Angular diikuti |
| **Kehilangan pekerjaan** | riwayat git + memori `state.md` = tidak ada pekerjaan yang hilang bila sesi atau anggota berubah |
| **Tanggung jawab tidak jelas** | keputusan final selalu di penanggung jawab manusia — terlacak di riwayat dokumen dan commit |

### Batas yang kami akui

- Platform Penilaian Kinerja **belum** memakai SSO/LDAP dan belum lolos audit keamanan
  production-grade. Untuk demo, autentikasi memakai akun yang di-seed.
- Integrasi absensi masih berupa data contoh, bukan koneksi ke sistem kehadiran nyata.
- **Komponen custom di luar Pilar belum sepenuhnya ditangani nano** (solusi parsial).

Ketiganya adalah roadmap, bukan klaim bahwa semuanya sudah beres.

---

## Penutup

Selama ini AI dipakai untuk **satu potong pekerjaan**: menulis kode. nano memakainya untuk
**seluruh siklus** — membaca rapat di Confluence, membangun sistemnya dengan Pilar, Context7,
dan Laravel Boost, lalu menutupnya dengan dokumentasi yang diterbitkan kembali ke Confluence.

Satu pintu masuk, tiga pekerjaan, memori yang tidak lupa, manusia yang tetap memegang
keputusan, dan standar UII sebagai bawaan. Lalu dibuktikan dengan membangun Platform
Penilaian Kinerja Pegawai secara end-to-end sebagai pilot project — dari ide, ke kode, ke
dokumentasi, dalam satu alur.
