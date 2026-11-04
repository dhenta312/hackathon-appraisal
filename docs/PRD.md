# Product Requirements Document (PRD)
# Platform Penilaian Kinerja Pegawai

## 1. Ringkasan eksekutif

**Platform Penilaian Kinerja** adalah aplikasi web end-to-end yang menggantikan proses
penilaian kinerja pegawai berbasis Google Form + rekap manual HR. Aplikasi menyediakan
**alur menilai yang ringan** (role auto-load, alasan per komponen, save draft, progres) dan
**skor yang transparan** (rumus terlihat, rata-rata antar penilai anonim, presensi sebagai data).

Skor maksimum **100** terbagi: Core Value (10), Soft Skill (25), Hard Skill (30),
Growth & Innovation (15), Presensi (20).

## 2. Latar belakang & masalah

Proses penilaian saat ini masih manual dan berat, namun hasilnya menentukan hal nyata
(kenaikan gaji & perubahan role). Masalah terjadi di tiga pihak sekaligus:

1. **Penilai** (pegawai, wajib menilai rekan setim): kebanjiran beban — banyak pertanyaan ×
   banyak orang × template berbeda per role × wajib alasan per jawaban. Ujungnya mengisi
   asal-asalan atau mepet deadline.
2. **HR**: merekap jawaban manual lalu menghitung pakai rumus rumit yang **tidak dibuka**.
   Lambat, rawan salah, jadi bottleneck.
3. **Yang dinilai**: menerima angka (maks 100) tanpa tahu asal-usulnya. Melahirkan
   ketidakpercayaan ("kenapa saya cuma 78?").

## 3. Tujuan & ukuran keberhasilan

**Tujuan:**
- Menghilangkan gesekan di alur menilai (role auto-load, alasan per komponen, draft, progres).
- Mengubah skor dari *black box* menjadi *explainable* (rumus terbuka, kontribusi penilai anonim).
- Membuat proses dikelola mandiri oleh admin (self-service periode, pertanyaan, bobot).

**Ukuran keberhasilan:**
- Waktu menilai satu rekan turun drastis ("dulu ±3 jam, sekarang ±15 menit").
- Skor bisa dipertanggungjawabkan: rincian per komponen + kontribusi tiap penilai.
- Deteksi pengisian asal (skor seragam / copas) tertangkap sebelum data masuk.

## 4. Pengguna & peran

| Peran | Deskripsi | Hak akses |
|---|---|---|
| **Pegawai (penilai)** | Menilai rekan setim | Menilai rekan; melihat hasil **diri sendiri** |
| **Admin/HR** | Mengelola penilaian | Melihat hasil semua orang; kelola periode, pertanyaan, bobot |

## 5. Ruang lingkup

### 5.1 Termasuk (in scope)
- Login (akun seeded), halaman welcome, daftar tim + progres.
- Form penilaian multi-step (4 komponen) + hubungan penilaian + save draft & resume.
- Mesin skoring 0–100 transparan + dashboard hasil (per komponen, per penilai anonim).
- Grade band (predikat A–E), deteksi pengisian asal, banding.
- Pengaturan admin: periode, pertanyaan + pilihan jawaban, bobot.

### 5.2 Tidak termasuk (out of scope saat ini)
- Integrasi nyata ke sistem absensi (presensi di-seed/dummy).
- Auth penuh (SSO/LDAP) & keamanan production-grade.
- AI yang menulis alasan otomatis.

## 6. Alur pengguna utama

### 6.1 Menilai rekan
1. Login → landing **Tim saya**: daftar rekan + status (Belum/Draf/Selesai) + progres.
2. Pilih nama rekan → sistem **otomatis memuat template sesuai role** rekan.
3. Pilih hubungan, isi skor 0–5 + alasan per pertanyaan, navigasi antar langkah.
4. **Simpan draf** (bisa dilanjutkan) atau **Kirim** (skor terhitung).

### 6.2 Melihat hasil
1. Admin pilih orang (atau pegawai lihat diri sendiri).
2. Tampilkan total 0–100, rincian per komponen + bobot, kontribusi **Penilai A/B** (anonim),
   alasan, presensi, dan grade band.

## 7. Kebutuhan fungsional

### 7.1 Login (`/login`)
- Form email + password, autentikasi token Sanctum. Akun seeded.

### 7.2 Welcome (`/welcome`)
- Dashboard selamat datang: periode aktif, notifikasi, aktivitas.

### 7.3 Tim saya (`/team`)
- Daftar rekan setim + status per orang + progres "sudah X dari N".

### 7.4 Form penilaian (`/assess/:id`)
- Multi-step per komponen (Core Value → Soft Skill → Hard Skill → Growth & Innovation).
- Pilihan hubungan (diri sendiri/atasan/rekan/bawahan/lainnya).
- Skala 0–5 dengan deskripsi perilaku; alasan per pertanyaan (opsional).
- Save draft & resume; kirim = hitung skor.

### 7.5 Hasil (`/results/:id`)
- Total + rincian per komponen + grade band + per-assessor anonim + presensi.

### 7.6 Pengaturan (`/settings`, admin)
- Buka/tutup periode; kelola pertanyaan + pilihan jawaban + bobot.

### 7.7 Deteksi pengisian asal
- Tandai skor seragam, semua-maksimal, dan alasan copas → banner peringatan + flag di data.

### 7.8 Banding (appeal)
- Pegawai mengajukan peninjauan ulang hasil.

## 8. Model data (entitas)

- `users` — id, name, email, password, team_id, job_role_id, is_admin.
- `teams` — id, name.
- `job_roles` — id, name (UX, Frontend, Backend).
- `components` — id, code, name, weight (core_value=10, soft_skill=25, hard_skill=30, growth_innovation=15, presensi=20).
- `questions` — id, component_id, job_role_id (nullable), text, sort_order.
- `answer_choices` — id, question_id, label, point_value (0–5).
- `assessments` — id, assessor_id, assessed_id, relationship, period, status (draft/submitted), flag, submitted_at.
- `scores` — id, assessment_id, question_id, value.
- `reasons` — id, assessment_id, question_id, text.
- `attendance` — id, user_id, period, points (0–20).
- `periods` — id, name, start, end, is_open.
- `appeals` — id, user_id, assessment-related, reason, status.

## 9. Aturan bisnis

- **Skala:** tiap pertanyaan dinilai 0–5.
- **Rumus skor komponen:** `round(avg(nilai pertanyaan) / 5 × bobot, 1)`.
- **Gabungan antar penilai:** skor final komponen = `round(avg(skor komponen antar penilai submitted), 1)`.
- **Total:** jumlah 4 komponen yang dinilai + presensi (maks 100).
- **Hanya penilaian `submitted` yang dihitung**; draf tidak memengaruhi skor.
- **Atribusi anonim:** kontribusi penilai ditampilkan sebagai "Penilai A/B".
- **Presensi** diambil dari `attendance` (seeded), bukan input penilai.
- **Otorisasi:** pegawai hanya lihat hasil sendiri; admin lihat semua.

## 10. Referensi nilai (dropdown)

- **Hubungan:** Diri sendiri / Atasan langsung / Rekan sejawat / Bawahan / Lainnya.
- **Skala 0–5:** 0 (tidak menunjukkan) … 5 (konsisten).
- **Grade band:** Istimewa (A) 90–100 · Sangat Baik (B) 80–89 · Baik (C) 70–79 · Cukup (D) 60–69 · Perlu Pengembangan (E) <60.

## 11. Spesifikasi API

- `POST /api/login` → `{ token, user }`.
- `GET /api/team` → `{ members: [{ id, name, job_role_name, status }] }`.
- `GET /api/assessments/{assessedId}` → template komponen + pertanyaan + pilihan + draf.
- `POST /api/assessments/{assessedId}` → body `{ action: draft|submit, relationship, scores, reasons }`.
- `GET /api/results/{userId}` → total + komponen + per-assessor + attendance + grade.
- Settings: kelola `periods`, `questions`, `answer_choices`, `components` (bobot).

## 12. Aturan validasi

- Menilai harus dalam tim yang sama (selain itu → 403).
- Kirim (submit) dengan indikasi pengisian asal → konfirmasi dulu di frontend.
- Alasan boleh kosong (tidak wajib); tidak pernah error karena string kosong.
- Tidak ada penilai submitted untuk seseorang → total `null` ("Belum dinilai"), tanpa divide-by-zero.

## 13. Kebutuhan non-fungsional

- **Responsif:** layout menyesuaikan desktop (prioritas demo).
- **Kecepatan:** operasi CRUD ringan; halaman hasil memuat cepat.
- **Kejelasan:** rumus & kontribusi ditampilkan (transparansi).
- **Konsistensi UI:** design token PILAR UII (Tailwind).

## 14. Asumsi & ketergantungan

- Demo memakai **SQLite** (tanpa setup server DB); schema sudah MySQL-compatible.
- Data presensi **di-seed**, tidak terhubung sistem absensi nyata.
- Auth sederhana (akun seeded), bukan SSO.

## 15. Kriteria penerimaan (acceptance criteria)

- Penilai bisa menilai rekan per orang dengan role auto-load, draft & resume.
- Skor 0–100 terhitung otomatis & transparan (per komponen + per penilai anonim).
- Admin bisa kelola periode, pertanyaan, pilihan, bobot tanpa bantuan teknis.
- Indikasi pengisian asal terdeteksi & dikonfirmasi sebelum submit.
- Satu cerita demo utuh: "dulu 3 jam, sekarang ±15 menit; dulu angka gelap, sekarang jelas".

## 16. Roadmap (di luar rilis saat ini)

- Integrasi absensi nyata (presensi otomatis).
- SSO/LDAP & role yang lebih granular.
- Editor template pertanyaan per role di UI.
- Notifikasi email pengingat penilaian.

## 17. Glosarium

| Istilah | Arti |
|---|---|
| Penilai | Pegawai yang memberi nilai ke rekan setim |
| Komponen | Aspek penilaian berbobot (Core Value, Soft Skill, dst.) |
| Grade band | Predikat A–E dari total skor |
| Banding | Permintaan peninjauan ulang hasil |
| Presensi | Poin kehadiran (0–20), data terpisah dari penilaian |

## 18. Lampiran — stack & struktur project

- **Frontend:** Angular 18 (standalone components + signals), Tailwind CSS, design token PILAR UII.
- **Backend:** Laravel (REST API), Sanctum token auth, SQLite.
- **Struktur:** `backend/` (Laravel) + `frontend/` (Angular) + `docs/` (dokumentasi).
