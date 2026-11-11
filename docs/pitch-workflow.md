# Pitch — nano (AI Asisten untuk Manajemen Proyek)

## Inti yang diajukan

**nano** — satu AI asisten (skill Claude Code) yang membantu tim menyelesaikan siklus
pengembangan sistem secara utuh dan konsisten: dari **ide → PRD → rencana sistem →
dokumentasi pengguna**.

**Platform Penilaian Pegawai = bukti** bahwa nano benar-benar bekerja (38 commit, ±2 hari,
end-to-end, dokumentasi lengkap).

## Masalah yang diselesaikan

- Konteks hilang antar-sesi & antar-orang → pekerjaan terulang.
- Dokumen kebutuhan & rencana teknis tidak seragam antar-tim.
- Standar desain (Pilar) tidak selalu dipakai → tampilan beda sendiri.
- Dokumentasi pengguna jadi prioritas terakhir.
- AI dipakai tanpa kendali → hasil "meyakinkan" padahal karangan.

## Solusi — nano

- **Satu pintu masuk, tiga pekerjaan:** Diskusi & Analisis · Pengembangan Sistem · Dokumentasi.
- **Ingatan antar-sesi** — tidak mulai dari nol (baca `docs/nano/state.md`).
- **Kontrol manusia** di tiap langkah — AI tidak memutuskan sendiri.
- **Mengenal Pilar** (design system UII) secara otomatis.

## Alur kerja

Tim memanggil nano → nano baca memori → pilih pekerjaan (Diskusi & Analisis / Pengembangan Sistem / Dokumentasi) →
kerjakan → konfirmasi manusia → catat kemajuan.

## Tiga pekerjaan

| Pekerjaan | Masukan → Hasil |
|---|---|
| **Diskusi & Analisis** | catatan rapat → PRD + FSD + BPMN |
| **Pengembangan Sistem** | kebutuhan → design Figma + document spec + prototype (Full Angular+Laravel / Lite Vite) |
| **Dokumentasi** | aplikasi jalan → automated test + report + user manual |

## 4 kendali kualitas

1. Konfirmasi manusia di tiap tahap.
2. Kejujuran atas ketidaktahuan (info tanpa sumber ditandai).
3. Satu sumber resmi (dokumen di repo).
4. Riwayat terjaga (versi baru, tidak menimpa).

## Bukti (Platform Penilaian Pegawai)

- **38 commit, ±2 hari kerja** → produk end-to-end (Laravel + Angular + PILAR).
- Dokumentasi lengkap: **PRD, FSD/SPEC, BPMN, Document Spec, User Manual**.
- **Test E2E (Playwright) lolos** + report HTML + PDF.

## Output (untuk tim lain)

- **6 skill** + `setup.sh` + `docs/nano/state.md` (memori).
- Tim lain tinggal: `git clone` → `./setup.sh` → panggil "nano, kita lanjut dari mana?".

## Struktur slide (10)

1. Judul — nano (AI Asisten untuk Manajemen Proyek)
2. Masalah — Konteks Hilang & Dokumen Tidak Konsisten
3. Solusi — nano: Satu AI Asisten
4. Alur Kerja nano 📷
5. Pekerjaan 1 — Diskusi & Analisis
6. Pekerjaan 2 — Pengembangan Sistem
7. Pekerjaan 3 — Dokumentasi
8. Bukti — Platform Penilaian Pegawai 📷
9. Demo — Dari PILAR ke Form Multi-Step 📷
10. Output + 3 Pilar

## Skrip demo live (±1 menit)

1. Panggil nano → tunjukkan memori (`docs/nano/state.md`) terbaca.
2. Demo "Pekerjaan Sistem": tarik komponen PILAR → implementasi → form multi-step.
3. Demo "Dokumentasi": `npx playwright test` → report HTML + PDF otomatis.
