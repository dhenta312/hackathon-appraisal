# Product Requirements Document (PRD)
# Platform Penilaian Kinerja Pegawai

> Diperbarui 2026-11-14 — disinkronkan dengan hasil diskusi 2026-10-29
> (`docs/superpowers/specs/`) dan kondisi implementasi aktual (`backend/` + `frontend/`).

## 1. Ringkasan eksekutif

**Platform Penilaian Kinerja** adalah aplikasi web end-to-end yang menggantikan proses
penilaian kinerja pegawai berbasis Google Form + rekap manual HR. Aplikasi menyediakan
**alur menilai yang ringan** (penilaian 360°, role auto-load, save draft, progres,
deteksi pengisian asal) dan **skor yang transparan** (rumus terlihat, rata-rata antar
penilai anonim, kehadiran sebagai data terpisah).

Penilaian bersifat **360°**: setiap pegawai bisa menilai **siapa saja di organisasi** —
diri sendiri, rekan setim, maupun rekan kerja lintas tim — dengan template pertanyaan
yang dimuat otomatis sesuai role orang yang dinilai.

Skor maksimum **100** terbagi: Core Value (10), Soft Skill (25), Hard Skill (30),
Growth & Innovation (15), Kehadiran & Kedisiplinan (20).

## 2. Latar belakang & masalah

Proses penilaian saat ini masih manual dan berat, namun hasilnya menentukan hal nyata
(kenaikan gaji & perubahan role). Masalah terjadi di tiga pihak sekaligus:

1. **Penilai** (pegawai, wajib menilai rekan): kebanjiran beban — banyak pertanyaan ×
   banyak orang × template berbeda per role. Ujungnya mengisi asal-asalan atau mepet
   deadline.
2. **HR**: merekap jawaban manual lalu menghitung pakai rumus rumit yang **tidak dibuka**.
   Lambat, rawan salah, jadi bottleneck.
3. **Yang dinilai**: menerima angka (maks 100) tanpa tahu asal-usulnya. Melahirkan
   ketidakpercayaan ("kenapa saya cuma 78?").

## 3. Tujuan & ukuran keberhasilan

**Tujuan:**
- Menghilangkan gesekan di alur menilai (role auto-load, draft & resume, progres,
  konfirmasi saat terindikasi mengisi asal).
- Mengubah skor dari *black box* menjadi *explainable* (rumus terbuka, kontribusi
  penilai anonim, kehadiran sebagai baris data terpisah).
- Membuat proses dikelola mandiri oleh admin (self-service periode, pertanyaan,
  pilihan jawaban, bobot).

**Ukuran keberhasilan:**
- Waktu menilai satu rekan turun drastis ("dulu ±3 jam, sekarang ±15 menit").
- Skor bisa dipertanggungjawabkan: rincian per komponen + kontribusi tiap penilai.
- Deteksi pengisian asal (skor seragam / semua-maksimal / alasan copas) tertangkap
  sebelum data masuk.

## 4. Pengguna & peran

| Peran | Deskripsi | Hak akses |
|---|---|---|
| **Pegawai (penilai)** | Menilai siapa saja (360°) termasuk diri sendiri | Menilai; melihat hasil **diri sendiri**; mengajukan banding |
| **Admin/HR** | Mengelola penilaian | Melihat hasil semua orang; mengelola periode, pertanyaan, pilihan jawaban, bobot; daftar banding (via API) |

## 5. Ruang lingkup

### 5.1 Termasuk (in scope)
- Login (akun seeded), halaman welcome, daftar pegawai + progres (360°).
- Form penilaian multi-step per komponen: pilih hubungan, skor 0–5 lewat pilihan
  jawaban, alasan per pertanyaan, save draft & resume.
- Deteksi pengisian asal (peringatan di frontend + flag di data).
- Mesin skoring 0–100 transparan + dashboard hasil (per komponen, per penilai anonim,
  kehadiran, grade band).
- Banding (appeal) dari halaman hasil.
- Pengaturan admin: periode (buka/tutup, tambah), pertanyaan + pilihan jawaban, bobot.

### 5.2 Tidak termasuk (out of scope saat ini)
- Integrasi nyata ke sistem absensi (kehadiran di-seed/dummy).
- Auth penuh (SSO/LDAP) & keamanan production-grade.
- AI yang menulis alasan otomatis.
- UI admin untuk memproses daftar banding (endpoint API sudah tersedia).

## 6. Alur pengguna utama

### 6.1 Menilai (360°)
1. Login → landing **Tim saya**: daftar **semua pegawai** dengan label konteks
   (Diri sendiri / Rekan setim / Rekan kerja) + status (Belum/Draf/Selesai) +
   progres "sudah X dari N".
2. Pilih pegawai → sistem **otomatis memuat template sesuai role** orang tersebut.
3. Pilih hubungan penilaian, isi skor 0–5 (pilihan jawaban berbobot) + alasan per
   pertanyaan, navigasi antar langkah (multi-step per komponen).
4. **Simpan draf** (bisa dilanjutkan kapan saja) atau **Kirim** — bila terindikasi
   asal, muncul dialog konfirmasi dulu.

### 6.2 Melihat hasil
1. Admin memilih orang; pegawai melihat diri sendiri.
2. Tampilkan: total 0–100, grade band, rincian per komponen + bobot, kontribusi
   **Penilai A/B** (anonim) beserta alasannya, kehadiran sebagai baris data terpisah.
3. Pegawai dapat mengajukan **banding** langsung dari halaman hasil.

## 7. Kebutuhan fungsional

### 7.1 Login (`/login`)
- Form email + password, autentikasi token Sanctum. Akun seeded.

### 7.2 Welcome (`/welcome`)
- Beranda: rentang periode aktif, notifikasi, aktivitas terkini.
- Catatan: konten notifikasi & aktivitas saat ini **data statis (placeholder)**.

### 7.3 Tim saya (`/team`)
- Daftar semua pegawai (360°) dengan label konteks, status per orang, dan progres
  "sudah X dari N". Tombol nilai per orang; tombol hasil (untuk navigasi hasil).

### 7.4 Form penilaian (`/assess/:id`)
- Multi-step per komponen (Core Value → Soft Skill → Hard Skill → Growth & Innovation).
- Pilihan hubungan: Diri sendiri / Atasan langsung / Rekan sejawat / Bawahan / Lainnya.
- Skor 0–5 lewat pilihan jawaban (`answer_choices`, tiap pilihan punya `point_value`).
- Alasan opsional **per pertanyaan**.
- Save draft & resume (draf terisi ulang saat dibuka lagi).
- Sebelum kirim: bila skor seragam / semua maksimal / alasan copas → dialog
  konfirmasi "tetap kirim?".

### 7.5 Hasil (`/results/:id`)
- Total + grade band + rincian per komponen (bobot, skor, kontribusi per penilai
  anonim + alasan) + baris kehadiran (poin dari 20).
- Grade band dihitung di frontend dari total.

### 7.6 Pengaturan (`/settings`, admin)
- Tab **Periode**: buka/tutup periode, tambah periode.
- Tab **Pertanyaan**: tambah/ubah/hapus pertanyaan (dengan komponen & role),
  kelola pilihan jawaban per pertanyaan.
- Tab **Skor**: ubah nama & bobot komponen.

### 7.7 Deteksi pengisian asal
- Frontend: peringatan sebelum kirim (skor seragam, semua-maksimal, alasan copas).
- Backend: flag tersimpan di data penilaian (`skor_seragam`, `semua_maksimal`,
  `alasan_copas` — bisa gabungan).

### 7.8 Banding (appeal)
- Pegawai mengajukan banding (alasan) dari halaman hasil → status `pending`.
- Endpoint daftar banding untuk admin (belum ada UI khusus).

## 8. Model data (entitas)

- `users` — id, name, email, password, team_id, job_role_id, is_admin.
- `teams` — id, name.
- `job_roles` — id, name (UX, Frontend, Backend).
- `components` — id, code, name, weight (`core_value`=10, `soft_skill`=25,
  `hard_skill`=30, `growth_innovation`=15, **`kehadiran`=20** "Kehadiran & Kedisiplinan").
- `questions` — id, component_id, job_role_id (nullable = berlaku semua role), text, sort_order.
- `answer_choices` — id, question_id, label, point_value (0–5), sort_order.
- `assessments` — id, assessor_id, assessed_id, relationship, period, status
  (draft/submitted), flag, submitted_at.
- `scores` — id, assessment_id, question_id, value (0–5).
- `reasons` — id, assessment_id, question_id, text (alasan per pertanyaan).
- `attendance` — id, user_id, period, points (0–20).
- `periods` — id, name, start, end, is_open.
- `appeals` — id, user_id, period, reason, status (pending), created_at.

## 9. Aturan bisnis

- **Penilaian 360°:** pegawai boleh menilai siapa saja, termasuk diri sendiri —
  tidak dibatasi tim.
- **Skala:** tiap pertanyaan dinilai 0–5 melalui pilihan jawaban berbobot.
- **Rumus skor komponen (per penilai):** `round(avg(nilai pertanyaan) / 5 × bobot, 1)`.
- **Gabungan antar penilai:** skor final komponen = `round(avg(skor antar penilai yang
  sudah submit), 1)`.
- **Total:** jumlah 4 komponen yang dinilai + poin kehadiran (maks 100).
- **Hanya penilaian `submitted` yang dihitung**; draf tidak memengaruhi skor.
- **Atribusi anonim:** kontribusi penilai ditampilkan sebagai "Penilai A/B" sesuai
  urutan submit.
- **Kehadiran** diambil dari `attendance` (seeded), bukan input penilai; komponen
  `kehadiran` tidak punya pertanyaan.
- **Submit lengkap:** semua pertanyaan pada template harus terisi sebelum kirim.
- **Sekali kirim:** penilaian yang sudah `submitted` tidak bisa dikirim/ubah ulang.
- **Otorisasi hasil:** pegawai hanya lihat hasil sendiri; admin lihat semua.
- **Periode aktif:** diambil dari periode yang statusnya terbuka (fallback `2026-Q4`).

## 10. Referensi nilai (dropdown)

- **Hubungan:** Diri sendiri / Atasan langsung / Rekan sejawat / Bawahan / Lainnya.
- **Skala 0–5:** 0 (tidak menunjukkan) … 5 (konsisten) — direpresentasikan sebagai
  pilihan jawaban berbobot per pertanyaan.
- **Grade band:** Istimewa (A) 90–100 · Sangat Baik (B) 80–89 · Baik (C) 70–79 ·
  Cukup (D) 60–69 · Perlu Pengembangan (E) <60.

## 11. Spesifikasi API

- `POST /api/login` → `{ token, user }`.
- `GET /api/team` → `{ members: [{ id, name, job_role_name, is_self, is_teammate, status }] }`
  — semua pegawai (360°).
- `GET /api/assessments/{assessedId}` → template komponen + pertanyaan + pilihan
  jawaban + draf (hubungan, skor, alasan).
- `POST /api/assessments/{assessedId}` → `{ action: draft|submit, relationship,
  scores, reasons }` → `{ id, status, flag }`.
- `GET /api/results/{userId}` → `{ total, components, attendance }` (grade dihitung
  frontend).
- `POST /api/appeals` (pegawai) → ajukan banding; `GET /api/appeals` (admin) → daftar.
- `GET|POST /api/settings/periods`, `POST /api/settings/periods/{id}/toggle`.
- `GET|POST|PUT|DELETE /api/settings/questions`, `POST .../questions/{id}/choices`,
  `PUT|DELETE /api/settings/choices/{id}`.
- `GET /api/settings/components`, `PUT /api/settings/components/{id}` (bobot).

## 12. Aturan validasi

- Nilai skor: bilangan bulat 0–5.
- Kirim (submit) dengan pertanyaan yang belum lengkap → `422` "Semua pertanyaan
  harus diisi sebelum mengirim".
- Mengirim ulang penilaian yang sudah `submitted` → `409` "Penilaian sudah dikirim".
- Pegawai membuka hasil orang lain → `403`.
- Alasan boleh kosong (tidak wajib); string kosong tidak pernah jadi error.
- Tidak ada penilai submitted untuk seseorang → total `null` ("Belum dinilai"),
  tanpa divide-by-zero.
- Tidak ada pembatasan tim pada penilaian (360°).

## 13. Kebutuhan non-fungsional

- **Responsif:** layout menyesuaikan desktop (prioritas demo).
- **Kecepatan:** operasi CRUD ringan; halaman hasil memuat cepat.
- **Kejelasan:** rumus & kontribusi ditampilkan (transparansi).
- **Konsistensi UI:** design token PILAR UII (Tailwind) + komponen stepper PILAR.

## 14. Asumsi & ketergantungan

- Demo memakai **SQLite** (tanpa setup server DB); schema sudah MySQL-compatible.
- Data kehadiran **di-seed**, tidak terhubung sistem absensi nyata.
- Auth sederhana (akun seeded), bukan SSO.
- Konten notifikasi/aktivitas di halaman welcome masih placeholder statis.

## 15. Kriteria penerimaan (acceptance criteria)

- Penilai bisa menilai siapa saja (360°, termasuk diri sendiri) dengan role
  auto-load, draft & resume.
- Skor 0–100 terhitung otomatis & transparan (per komponen + per penilai anonim +
  kehadiran terpisah + grade band).
- Admin bisa kelola periode, pertanyaan, pilihan jawaban, bobot tanpa bantuan teknis.
- Indikasi pengisian asal terdeteksi & dikonfirmasi sebelum submit; flag tersimpan.
- Pegawai bisa mengajukan banding dari halaman hasil.
- Satu cerita demo utuh: "dulu 3 jam, sekarang ±15 menit; dulu angka gelap,
  sekarang jelas".

## 16. Roadmap (di luar rilis saat ini)

- Integrasi absensi nyata (kehadiran otomatis).
- SSO/LDAP & role yang lebih granular.
- UI admin untuk memproses banding (daftar → putuskan).
- Notifikasi email pengingat penilaian (menggantikan placeholder welcome).

## 17. Glosarium

| Istilah | Arti |
|---|---|
| Penilai | Pegawai yang memberi nilai (siapa saja, 360°) |
| Komponen | Aspek penilaian berbobot (Core Value, Soft Skill, dst.) |
| Kehadiran | Poin kehadiran & kedisiplinan (0–20), data terpisah dari penilaian |
| Grade band | Predikat A–E dari total skor |
| Banding | Permintaan peninjauan ulang hasil |
| Flag | Penanda deteksi pengisian asal |

## 18. Lampiran — stack & struktur project

- **Frontend:** Angular 18 (standalone components + signals), Tailwind CSS,
  design token PILAR UII.
- **Backend:** Laravel (REST API), Sanctum token auth, SQLite, Laravel Boost.
- **Struktur:** `backend/` (Laravel) + `frontend/` (Angular) + `docs/` (dokumentasi).
