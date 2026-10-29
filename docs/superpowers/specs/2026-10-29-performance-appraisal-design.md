# Rancangan: Platform Penilaian Kinerja (Performance Appraisal)

**Status:** siap ditinjau pemilik (sudah lolos builder-check + revisi sesuai jawaban)
**Tanggal:** 2026-10-29
**Konteks:** Lomba hackathon inovasi IT internal tempat kerja

---

## 1. Intent & Why

Penilaian kinerja di tempat kerja saat ini memakai Google Form. Prosesnya manual
dan berat, tapi hasilnya menentukan hal yang sangat nyata: **kenaikan gaji dan
perubahan role kerja**.

Masalahnya bukan di satu titik, tapi di tiga pihak sekaligus:

1. **Yang menilai** (pegawai, wajib menilai rekan setim): kebanjiran beban —
   banyak pertanyaan × banyak orang yang wajib dinilai × template berbeda per
   role × wajib menulis alasan per jawaban. Ujungnya orang mengisi asal-asalan
   atau mepet deadline.
2. **HR**: merekap semua jawaban manual lalu menghitung pakai rumus yang rumit
   dan **tidak dibuka** ke publik. Kerja ini lambat, rawan salah hitung, dan
   jadi bottleneck.
3. **Yang dinilai**: menerima angka (maks 100) tanpa tahu angka itu berasal dari
   mana. Ini melahirkan ketidakpercayaan: "kenapa saya cuma 78?"

Skor maksimum 100 terbagi: Core value (10), Soft skill (25), Hard skill (30),
Growth & innovation (15), Presensi (20).

**Inti inovasinya:** menghilangkan gesekan di alur menilai (yang bikin orang
malas dan asal), dan mengubah skor dari *black box* menjadi *explainable*.

---

## 2. Goals, Non-Goals, Anti-Goals

### Goals (yang harus tercapai di MVP)
- Penilai bisa menilai rekan setimnya **per orang** dengan alur yang jauh lebih
  ringan daripada Google Form (lihat bagian 5).
- Sistem menghitung skor 0–100 secara otomatis, transparan, per komponen.
- Dashboard hasil menampilkan rincian: dari mana angka itu berasal (bobot per
  komponen, sub-skor, kontribusi tiap penilai yang dianonimkan, alasan).
- Satu cerita demo utuh: "yang dulu 3 jam, sekarang ±15 menit; yang dulu angka
  gelap, sekarang angka jelas."

### Non-Goals (sengaja tidak dikerjakan)
- Integrasi nyata ke sistem absensi (presensi di-seed/dummy).
- Auth penuh (SSO/LDAP) dan keamanan production-grade.
- Editor template pertanyaan berbasis role (cukup 2–3 role di-seed).
- AI yang menuliskan alasan otomatis.

### Anti-Goals (yang membuat ini gagal meski "jalan")
- Demo yang *setengah jalan* di banyak fitur, alih-alih satu cerita yang mulus.
- Nambah scope sampai presensi/absensi nyata jadi blocker saat hari-H.
- Fokus ke "jumlah fitur" ketimbang ke "cerita yang terasa".

---

## 3. Constraints

- **Waktu:** 2–3 hari pengerjaan.
- **Tim:** 2 orang. Satu orang berlatar UI/UX Designer (sedang mendalami
  frontend/backend), satu orang lainnya (skill detail dipetakan di tahap plan).
- **Stack:** Angular (frontend) + Laravel (backend). Database: SQLite untuk demo.
- **Deliverable:** MVP runnable + presentasi. Semua data di-seed, tidak ada data
  produksi nyata.

---

## 4. Solusi yang Disepakati

**Narasi pitch = transformasi end-to-end. Yang dibangun = irisan tipis
end-to-end.** Dua sisi yang menjadi fokus:

- **A — Alur menilai yang ringan (per orang).** Bukan "mode perbandingan" —
  alur aslinya tetap per-orang (pilih nama → form sesuai role). Inovasinya
  adalah menghilangkan gesekan di alur itu (detail di bagian 5).
- **B — Skor transparan (mesin skoring + dashboard).**

Presensi (20 poin) di-seed sebagai data, tidak diintegrasikan.

---

## 5. Alur Pengguna & Layar

### Peran & otorisasi (sudah diputuskan)
- **Employee** — menilai rekan setimnya, dan melihat dashboard hasil **dirinya
  sendiri**.
- **Admin/HR** — melihat hasil semua orang. Demo memakai perpindahan akun yang
  bersih: login sebagai penilai → menilai → login sebagai admin → tunjukkan
  dashboard hasil.

### Alur 1 — Menilai Rekan (per orang)
1. Login (akun seeded) → landing **"Tim saya"**: daftar rekan setim + status
   tiap orang (sudah/belum dinilai) + progres "sudah 4 dari 9".
2. Pilih nama rekan → **sistem otomatis memuat template sesuai role rekan
   tersebut** (role adalah atribut tetap, tidak dipilih manual).
3. Isi form:
   - Pertanyaan dinilai sesuai skala (mis. 1–5), dengan panduan arti skala di
     samping (stretch).
   - **Alasan ditulis per komponen**, bukan per jawaban.
4. **Bisa save draft & lanjut nanti** — tidak harus selesai sekali duduk.
5. **Submit** → skor terhitung otomatis.

### Alur 2 — Dashboard Hasil (skor transparan)
1. Pilih orang (admin) atau lihat diri sendiri (employee).
2. Tampilkan:
   - Total 0–100.
   - Rincian per komponen beserta bobotnya (Core value 10, Soft skill 25, dsb.)
     dan sub-skor yang diperoleh.
   - **Skor = rata-rata dari para penilai**, ditampilkan **per penilai secara
     anonim** (mis. "Penilai A", "Penilai B").
   - Alasan yang ditulis per komponen (anonim).
   - Presensi sebagai nilai terpisah yang jelas (data, bukan "dinilai").
3. (Stretch) Badge "penilaian seragam terdeteksi" bila varians skor seorang
   penilai terlalu kecil.

### Prioritas fitur (hasil keputusan)
- **Wajib:** role auto-load, alasan per komponen, progress 4/9, save draft &
  resume, skor transparan + dashboard.
- **Stretch (kalau sempat):** panduan skala inline, deteksi bias.

---

## 6. Model Data (Laravel, ringkas)

- `users` — id, name, email, password, team_id, job_role_id, is_admin
- `teams` — id, name
- `job_roles` — id, name (contoh: UX, Frontend, Backend)
- `components` — id, code, name, weight (core_value=10, soft_skill=25,
  hard_skill=30, growth_innovation=15, presensi=20)
- `questions` — id, component_id, job_role_id, text, sort_order (template per role)
- `assessments` — id, assessor_id, assessed_id, period, status
  (`draft`/`submitted`), submitted_at
- `scores` — id, assessment_id, question_id, value (skala, mis. 1–5)
- `reasons` — id, assessment_id, component_id, text (satu alasan per komponen)
- `attendance` — id, user_id, period, points (seeded, 0–20)

---

## 7. Mesin Skoring

- Setiap pertanyaan punya skala nilai (mis. 1–5).
- Skor komponen = (jumlah/average skor pertanyaan) dinormalisasi ke bobot
  komponen. Rumus **ditampilkan**, tidak disembunyikan.
- **Penggabungan antar penilai:** skor komponen final = **rata-rata** dari
  semua penilai yang sudah submit. Kontribusi tiap penilai ditampilkan (anonim).
- Presensi diambil dari `attendance` (seeded), bukan hasil input penilai.
- Total = jumlah kelima komponen, maks 100.
- Contoh tampilan rincian: *Soft skill — 22/25 · rata-rata 2 penilai
  (Penilai A: 24, Penilai B: 20)*.

*(Detail persis normalisasi — average vs sum, rentang skala — diserahkan ke
builder, selama rumusnya konsisten dan transparan.)*

---

## 8. Klaim Inovasi (untuk pitch)

1. **Menghilangkan gesekan yang bikin orang malas menilai** — role auto-load,
   alasan per komponen, save draft & resume, progress. Ini mengubah pengalaman
   "menilai 9 orang" dari beban jadi ringan.
2. **Dari black box ke explainable** — rumus yang tadinya gelap jadi terlihat
   dan bisa dipertanggungjawabkan, dengan rata-rata antar penilai yang tampil
   transparan.
3. *(Stretch murah)* **Deteksi bias** — cek statistik sederhana yang menandai
   penilai yang memberi skor seragam ke semua orang.

---

## 9. Skrip Demo & Seed Data

Seed: 1 tim berisi 5–6 anggota dengan 2–3 role berbeda, 2 penilai, template
pertanyaan untuk tiap role, presensi terisi.

**Busur demo:**
1. Penilai login → lihat "Tim saya" (progres 0/5) → pilih rekan → form sesuai
   role muncul otomatis → isi cepat, alasan per komponen → **save draft** di
   tengah jalan untuk menunjukkan fitur resume → submit.
2. Pindah akun admin → dashboard hasil seorang anggota: total 78, rincian per
   komponen, kontribusi "Penilai A/B" anonim, presensi 18/20, alasan terbaca.
3. (Opsional) badge deteksi bias bila sempat.

---

## 10. Yang Diserahkan ke Builder (keputusan saya, boleh diubah)

- Isi pertanyaan seed yang persis (contoh per komponen per role) — pakai
  placeholder yang masuk akal.
- Detail visual/layout — pengguna (UI/UX) akan mengarahkan; dokumen ini memberi
  alur, bukan desain pixel.
- Pendekatan auth sederhana (login seeded) vs auth penuh.
- Detail normalisasi skor (average vs sum, rentang skala).

---

## 11. Keputusan yang Sudah Dikonfirmasi Pemilik

- **Alur menilai:** per orang (pilih nama → form sesuai role), bukan mode
  perbandingan. Role di-load otomatis dari profil, tidak dipilih manual.
- **Penggabungan skor antar penilai:** rata-rata, dan ditampilkan per penilai.
- **Atribusi:** anonim ("Penilai A/B").
- **Otorisasi:** employee hanya lihat hasil sendiri; admin lihat semua.
- **Prioritas fitur:** lihat bagian 5 (wajib vs stretch).
