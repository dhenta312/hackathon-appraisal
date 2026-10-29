# Platform Penilaian Kinerja (Performance Appraisal)

MVP hackathon inovasi IT: mengganti penilaian kinerja berbasis Google Form + rekap
manual HR menjadi aplikasi dengan **alur menilai yang ringan** dan **skor yang
transparan**.

## Stack

- **Backend:** Laravel (PHP 8.5), SQLite, Sanctum token auth — folder `backend/`
- **Frontend:** Angular 18 (standalone components) — folder `frontend/`

## Cara menjalankan

### 1. Backend (port 8000)

```bash
cd backend
composer install
cp .env.example .env      # jika .env belum ada
php artisan key:generate  # jika belum
php artisan migrate --seed
php artisan serve
```

### 2. Frontend (port 4200)

```bash
cd frontend
npm install
npm start
```

Buka `http://localhost:4200`.

## Akun demo (password semua: `password`)

| Nama  | Email              | Role     | Keterangan    |
| ----- | ------------------ | -------- | ------------- |
| Andi  | andi@example.com   | UX       | Penilai demo  |
| Budi  | budi@example.com   | Frontend | Penilai demo  |
| Citra | citra@example.com  | Backend  | Pegawai       |
| Dewi  | dewi@example.com   | UX       | Pegawai       |
| Eko   | eko@example.com    | Frontend | Pegawai       |
| Fajar | fajar@example.com  | Backend  | Admin/HR      |

## Skrip demo (±3 menit)

### Bagian 1 — Menilai ringan (login sebagai Andi)

1. Login `andi@example.com` / `password` → masuk "Tim saya".
2. Tunjukkan **progres**: "sudah X dari 5 dinilai" + status per rekan.
3. Klik **Citra** → form muncul **otomatis sesuai role Backend** — penilai tidak
   perlu memilih role (bandingkan: di Google Form harus pilih manual).
4. Isi beberapa pertanyaan (skala 1–5) → klik **Simpan draf** → tunjukkan bisa
   dilanjutkan kapan saja (fitur yang tidak ada di Google Form).
5. Masuk lagi ke Citra → draf sudah terisi → lanjutkan sampai selesai → tulis
   **satu alasan per komponen** (bukan per jawaban) → **Kirim**.
6. Kembali ke "Tim saya" → status Citra "Selesai", progres naik.

### Bagian 2 — Skor transparan (login sebagai Fajar/admin)

1. Logout → login `fajar@example.com` / `password`.
2. Di "Tim saya", klik tombol **Hasil** pada Citra.
3. Tunjukkan: total (misal 90.4/100), rincian per komponen dengan bobotnya,
   kontribusi **"Penilai A/B" (anonim)** lengkap dengan alasannya, dan presensi
   sebagai baris data terpisah — bukan "dinilai".

## Klaim inovasi (untuk pitch)

1. **Mengubah metode menilai** — role auto-load, alasan per komponen, save draft
   & resume, progres. Mengisi 9 rekan berubah dari beban jadi ringan.
2. **Dari black box ke explainable** — rumus terlihat, rata-rata antar penilai
   ditampilkan transparan, identitas penilai dianonimkan.
3. **Presensi jadi data** — 20 poin ditarik dari catatan kehadiran, bukan
   "dinilai" oleh rekan.

## Catatan teknis

- Komponen skor: Core value (10), Soft skill (25), Hard skill (30), Growth &
  Innovation (15), Presensi (20) — total 100.
- Rumus per penilai: `skor komponen = rata-rata nilai pertanyaan ÷ 5 × bobot`;
  skor final komponen = rata-rata semua penilai yang sudah submit.
- Hanya penilaian berstatus `submitted` yang dihitung; draf tidak berpengaruh.
- Pegawai hanya bisa melihat hasil sendiri; admin (HR) melihat semua.
