# Pitch — AI-Native Workflow

## Headline

> **Metode membangun software berbantu AI — dari dokumen ke produk jalan. Bisa dipakai ulang untuk proyek apa pun.**

## Inti: 3 tahap + 1 prinsip (metode yang reusable)

Setiap tahap punya pola yang sama: **Input → AI membantu → Output artefak**.
Karena polanya berulang, metode ini bisa diterapkan ke domain/proyek lain.

### Tahap 1 — Analisis
- **Input:** dokumen proses lama (mis. *guide pengisian penilaian*).
- **AI membantu:** membedah alur & memetakan masalah.
- **Output:** rancangan — intent, solusi, model data, rumus skoring.

### Tahap 2 — Brainstorming Fitur
- **Input:** rancangan + daftar masalah.
- **AI membantu:** mengeksplorasi & memprioritaskan fitur (wajib vs stretch).
- **Output:** daftar fitur yang disepakati.

### Tahap 3 — Development
- **Input:** daftar fitur + rencana task.
- **AI membantu:** generate kode + test (TDD); manusia review di tiap gate.
- **Output:** produk jalan.

### Prinsip inti
- **AI mengerjakan, manusia memutuskan.**
- **Tiap tahap berakhir dengan artefak yang bisa diperiksa** (gate verifikasi).

## Kenapa bisa dipakai orang lain

- Bukan alat khusus satu kasus — ini **metode**, berlaku untuk proyek apa pun.
- Pola "Input → AI membantu → Output artefak" bisa diulang di domain berbeda.
- Gate verifikasi menjamin **kualitas terjaga, bukan cuma kecepatan**.
- Cocok untuk tim kecil, hackathon, maupun inisiatif internal.

## Bukti (studi kasus: Platform Penilaian Kinerja)

- **±2 hari / 38 commit** → sistem penilaian kinerja end-to-end (Laravel + Angular).
- 6 fitur utama + 3 fitur berbantuan AI (deteksi pengisian asal, grade band A–E, 360°).
- Semua bisa diaudit dari git history + demo live.

## Struktur slide (10)

1. Judul — AI-Native Workflow
2. Tahap 1 — Analisis
3. Tahap 2 — Brainstorming Fitur
4. Tahap 3 — Development
5. Prinsip — AI Mengerjakan, Manusia Memutuskan
6. Bukti Terukur — ±2 Hari, 38 Commit 📷
7. Yang Dihasilkan Workflow Ini 📷
8. Demo Live — Dari PILAR ke Form Multi-Step 📷
9. Bisa Dipakai Tim Lain
10. Terima Kasih

## Skrip demo live (±1 menit)

1. Buka PILAR (Figma) → tarik komponen `stepperButtonSet`.
2. Analisis token (`#0044cd`, `#00a63e`, `#e17100`, radius 10px) → petakan ke kode.
3. Implementasi jadi komponen Angular → form penilaian berubah jadi multi-step.
4. Tutup loop: desain di Figma = kode yang jalan.
