# Document Spec: Penilaian Kinerja

## Feature Description

Aplikasi **Penilaian Kinerja** adalah aplikasi web untuk mengelola penilaian kinerja pegawai
Universitas Islam Indonesia (UII), menggantikan proses berbasis Google Form + rekap manual.
Aplikasi menyediakan **alur menilai yang ringan** (role auto-load, alasan per komponen, save
draft & resume, progres), **deteksi pengisian asal** (skor seragam / rata-kanan / alasan copas),
dan **skor yang transparan** (rumus terbuka, rincian per komponen, kontribusi penilai anonim,
grade band A–E, presensi sebagai data terpisah), serta **pengaturan mandiri** oleh admin
(periode, pertanyaan, pilihan jawaban, bobot).

## Specification Details

- **Frontend:** Angular 18 (standalone components + signals) dengan Tailwind CSS dan design token **PILAR (UII)**.
- **Backend:** REST API Laravel, basis data SQLite (schema MySQL-compatible), auth Sanctum token.
- **Form penilaian:** multi-step 4 langkah (stepper PILAR): **Core Value → Soft Skill → Hard Skill → Growth & Innovation**.
- **Hubungan penilaian:** Diri sendiri / Atasan langsung / Rekan sejawat / Bawahan / Lainnya.
- **Skala:** 0–5 dengan deskripsi indikator perilaku; alasan per pertanyaan (opsional).
- **Deteksi pengisian asal:** skor seragam, semua-maksimal, dan alasan copas → banner peringatan + flag di data.
- **Skor:** total 0–100 = Core Value (10) + Soft Skill (25) + Hard Skill (30) + Growth & Innovation (15) + Presensi (20).
- **Grade band:** Istimewa (A) 90–100 · Sangat Baik (B) 80–89 · Baik (C) 70–79 · Cukup (D) 60–69 · Perlu Pengembangan (E) <60.
- **Anonim:** kontribusi tiap penilai ditampilkan sebagai "Penilai A/B".
- **Banding:** pegawai dapat mengajukan peninjauan ulang hasil.
- **Responsif:** layout menyesuaikan desktop.

## UI Design Specifications Flow

| No | UI Design | Specifications | Flow |
|----|-----------|----------------|------|
| 1 | **Login**<br>![Login](manual-images/01-login.png) | • Form email + password.<br>• Tombol **Masuk** (primary).<br>• Auth Sanctum token; akun seeded. | 1. Buka aplikasi di browser.<br>2. Masukkan email & password.<br>3. Klik **Masuk** → masuk ke Beranda. |
| 2 | **Beranda**<br>![Beranda](manual-images/02-welcome.png) | • Sidebar navigasi (Beranda, Penilaian).<br>• Info periode aktif & aktivitas. | 1. Setelah login, membaca halaman Beranda.<br>2. Lanjut ke menu **Penilaian** untuk menilai. |
| 3 | **Tim Saya**<br>![Tim saya](manual-images/03-team.png) | • Daftar rekan setim + status (Belum / Draf / Selesai).<br>• Progres "sudah X dari N".<br>• Klik nama rekan untuk membuka form. | 1. Buka menu **Penilaian**.<br>2. Lihat status & progres tiap rekan.<br>3. Klik nama rekan (mis. Dewi). |
| 4 | **Form Penilaian — Langkah 1 (Core Value)**<br>![Form langkah 1](manual-images/04-form-step1.png) | • Pilih **Hubungan Anda** (dropdown).<br>• Step pills 1–4 (komponen).<br>• Skala 0–5 dengan deskripsi perilaku.<br>• Alasan per pertanyaan (opsional).<br>• Stepper: **Draf / Batal / Selanjutnya**. | 1. Pilih hubungan dengan yang dinilai.<br>2. Isi skor 0–5 tiap pertanyaan.<br>3. Isi contoh perilaku (opsional).<br>4. Klik **Selanjutnya** → langkah berikutnya. |
| 5 | **Form Penilaian — Langkah Terakhir**<br>![Form langkah terakhir](manual-images/05-form-step4.png) | • Stepper langkah terakhir: **Batal / Sebelumnya / Simpan** (hijau).<br>• Tombol **Simpan draf** (pojok kanan atas) menyimpan tanpa mengirim. | 1. Sampai langkah terakhir.<br>2. Klik **Simpan** untuk mengirim (skor terhitung), atau **Simpan draf** untuk dilanjutkan nanti. |
| 6 | **Hasil Penilaian**<br>![Hasil](manual-images/06-hasil.png) | • **Total 0–100** + badge grade band (mis. "Sangat Baik (B)").<br>• Rincian per komponen + bobot.<br>• Kontribusi **Penilai A/B** (anonim) + alasan.<br>• Presensi sebagai baris data terpisah. | 1. Buka **Hasil Penilaian** (admin: pilih orang; pegawai: lihat sendiri).<br>2. Baca total, grade band, rincian per komponen.<br>3. Lihat kontribusi tiap penilai (anonim). |
| 7 | **Pengaturan (Admin)**<br>![Pengaturan](manual-images/07-settings.png) | • Tab **Periode / Pertanyaan / Skor / Rumus**.<br>• Buka/tutup periode penilaian.<br>• Kelola pertanyaan + pilihan jawaban + bobot.<br>• Tombol **Tambah periode**. | 1. Login sebagai admin (Fajar).<br>2. Buka menu **Pengaturan**.<br>3. Kelola periode, pertanyaan, dan bobot. |
