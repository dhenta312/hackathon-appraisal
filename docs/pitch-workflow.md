# Pitch — AI-Native Development Workflow (skill.md)

## Inti yang diajukan

**Bukan aplikasi penilaian pegawai — melainkan `skill.md`**: dokumentasi workflow AI-native
yang bisa diadopsi tim lain untuk membangun software lebih cepat, cerdas, dan aman.

**Penilaian pegawai = bukti** bahwa skill.md ini benar-benar bekerja (38 commit, ±2 hari, end-to-end).

```
skill.md (yang diajukan)  ←———  dibuktikan oleh  ———→  Sistem Penilaian Pegawai (studi kasus)
```

## Headline

> **skill.md — panduan reusable membangun software: dari dokumen kebutuhan ke produk jalan,
> lebih cepat, cerdas, dan aman. Dibuktikan oleh sistem penilaian pegawai.**

## Workflow 8 langkah (isi skill.md)

| # | Langkah | AI membantu | Skill Claude Code |
|---|---|---|---|
| 1 | Menggali kebutuhan lewat diskusi | merangkum diskusi | superpowers:brainstorming |
| 2 | Kumpulkan aturan, dokumen, standar | membedah dokumen acuan | deep-research |
| 3 | PRD — dokumen kebutuhan bisnis | menyusun draf PRD | brainstorming + writing-plans |
| 4 | FSD — desain fungsional & teknis | menyusun draf FSD | writing-plans |
| 5 | Struktur database MySQL | generate migration | test-driven-development |
| 6 | Backend Laravel best practice | generate controller/model/test | TDD + executing-plans |
| 7 | Frontend Angular + framework UI | generate komponen | figma-design-to-code + figma-use + code-connect |
| 8 | Deployment ke gateway UII | otomasi deploy | devops standar |

## Prinsip inti

- **AI menghasilkan, manusia memutuskan & memverifikasi.**
- **Tiap tahap punya artefak masuk → artefak keluar** (bisa diaudit).

## Kenapa bisa dipakai tim lain

- `skill.md` + 3 skill pendukung (`dev-workflow`, `editing-powerpoint-with-python`,
  `screenshotting-web-app`) = paket siap pakai.
- Mapping **37 skill Claude Code** (Figma + superpowers + lainnya) → tim tahu persis
  skill mana yang dipanggil di tiap langkah.
- Bukan alat khusus satu kasus — ini **metode**, berlaku untuk proyek apa pun.

## Bukti (sistem penilaian pegawai)

- **38 commit, ±2 hari kerja** → produk end-to-end (Laravel + Angular + PILAR).
- 6 fitur utama + 3 fitur berbantuan AI (deteksi pengisian asal, grade band A–E, 360°).
- Bisa diaudit dari git history + demo live.

## Struktur slide (10)

1. Judul — AI-Native Development Workflow (skill.md)
2. Langkah 1–2 — Analisis Kebutuhan
3. Langkah 3–4 — PRD & FSD (dengan AI)
4. Langkah 5–8 — Build & Deploy
5. Ringkasan — 8 Langkah 📷
6. Bukti Terukur — ±2 Hari, 38 Commit 📷
7. 3 Pilar — Faster, Smarter, Safer
8. Demo Live — Dari PILAR ke Form Multi-Step 📷
9. Output — skill.md + Tools
10. Terima Kasih

## Skrip demo live (±1 menit)

1. Buka PILAR (Figma) → tarik komponen `stepperButtonSet`.
2. Analisis token (`#0044cd`, `#00a63e`, `#e17100`, radius 10px) → petakan ke kode.
3. Implementasi jadi komponen Angular → form penilaian berubah jadi multi-step.
4. Tutup loop: desain di Figma = kode yang jalan.
