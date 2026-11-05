# Pitch — Skill Set Claude Code

## Inti yang diajukan

**5 skill Claude Code yang reusable** — mempermudah workflow pengembangan software,
dari analisis kebutuhan sampai delivery.

**Platform Penilaian Pegawai = bukti** bahwa skill set ini benar-benar bekerja
(38 commit, ±2 hari, end-to-end, dokumentasi lengkap).

## 5 Skill

| Skill | Fungsi |
|---|---|
| `ai-native-development-workflow` | memandu 8 langkah (diskusi → PRD → FSD → build → deploy) |
| `dev-workflow` | konvensi stack Laravel + Angular + SQLite + PILAR + jebakan |
| `generating-test-reports` | automated test (Playwright E2E) + laporan HTML + PDF |
| `editing-powerpoint-with-python` | otomasi deck presentasi (inspect/edit/diagram) |
| `screenshotting-web-app` | screenshot SPA ber-login untuk dokumentasi |

## Workflow 8 langkah (di-encode oleh `ai-native-development-workflow`)

1. Diskusi kebutuhan → 2. Kumpulkan aturan/dokumen → 3. PRD (AI) → 4. FSD (AI) →
5. MySQL → 6. Laravel → 7. Angular + PILAR → 8. Deploy gateway UII.

Tiap tahap: AI menghasilkan draf, manusia memutuskan & memverifikasi.

## 3 Pilar

- **Faster** — otomasi proses dari hulu ke hilir.
- **Smarter** — AI di tiap tahap (PRD, FSD, kode, test).
- **Safer** — standar internal + gate verifikasi + automated test.

## Bukti (Platform Penilaian Pegawai)

- **38 commit, ±2 hari kerja** → produk end-to-end (Laravel + Angular + PILAR).
- Dokumentasi lengkap: **PRD, FSD/SPEC, BPMN, Document Spec, User Manual**.
- **Test E2E (Playwright) lolos** + report HTML + PDF.
- Semua bisa diaudit dari git history + demo live.

## Struktur slide (10)

1. Judul — Skill Set Claude Code
2. Masalah — Development Manual & Lambat
3. Solusi — 5 Skill Claude Code (Reusable)
4. Skill 1 — ai-native-development-workflow 📷 (diagram 8 langkah)
5. Skill 2 — dev-workflow
6. Skill 3 — generating-test-reports
7. Skill 4 & 5 — Deliverable & Dokumentasi
8. Bukti — Platform Penilaian Pegawai 📷
9. Demo — Dari PILAR ke Form Multi-Step 📷
10. Output + 3 Pilar

## Skrip demo live (±1 menit)

1. Buka PILAR (Figma) → tarik komponen `stepperButtonSet`.
2. Analisis token → implementasi jadi komponen Angular → form multi-step.
3. Tutup loop: desain di Figma = kode yang jalan.
4. Jalankan `npx playwright test` → report HTML + PDF otomatis.
