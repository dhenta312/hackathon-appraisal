---
name: ai-native-development-workflow
description: Use when building software end-to-end (gathering requirements, writing PRD/FSD, designing the database, building a Laravel backend and Angular frontend, deploying) and wanting a faster, smarter, safer AI-assisted process that stays aligned with internal standards and best practices.
---

# AI-Native Development Workflow

## Overview

Workflow 8 langkah untuk membangun software end-to-end dengan bantuan AI: **lebih cepat**
(otomasi), **lebih cerdas** (AI di tiap tahap), dan **lebih aman** (standar + verifikasi di tiap
gate). Cocok untuk stack Laravel + Angular + MySQL.

## Prinsip inti

- **AI menghasilkan draf, manusia memutuskan & memverifikasi.** AI mempercepat tiap tahap,
  tapi keputusan arah, prioritas, dan approval tetap di manusia.
- **Tiap tahap punya artefak masuk → artefak keluar.** Hasil tiap tahap bisa diaudit,
  bukan sekadar "dikerjakan AI".

## 8 Langkah

| # | Langkah | AI membantu | Output (artefak) | Gate / verifikasi |
|---|---|---|---|---|
| 1 | Diskusi kebutuhan (user & stakeholder) | merangkum hasil diskusi | catatan kebutuhan | dikonfirmasi user |
| 2 | Kumpulkan aturan, dokumen, standar kerja | membedah dokumen acuan | daftar aturan & standar | dicek kelengkapannya |
| 3 | PRD — dokumen kebutuhan bisnis | menyusun draf PRD | PRD | ditinjau pemilik |
| 4 | FSD — desain fungsional & teknis | menyusun draf FSD | FSD + rencana task | builder-check |
| 5 | Struktur database MySQL | generate migration & schema | schema sesuai standar | migrasi jalan + seed |
| 6 | Backend Laravel (best practice) | generate controller/model/test | API + test | test lulus |
| 7 | Frontend Angular (framework UI) | generate komponen | UI sesuai desain | visual match desain |
| 8 | Deployment ke gateway UII | otomasi langkah deploy | app live | smoke test |

## Kapan dipakai / tidak

**Dipakai saat:** mulai proyek baru dari nol, atau fitur besar yang mencakup banyak lapisan
(database → backend → frontend → deploy), dan tim ingin prosesnya bisa diulang & diaudit.

**Tidak untuk:** perbaikan satu baris, tugas mekanis kecil, atau proyek tanpa kebutuhan
dokumentasi/standar internal.

## Kesalahan umum

- **Loncat ke coding sebelum PRD/FSD jelas** → hasil menyimpang dari kebutuhan. Mulai dari
  langkah 1–2 dulu.
- **AI dipakai tanpa gate verifikasi** → output tak terkontrol. Selalu ada gate di tiap langkah.
- **Database dibuat tanpa standar** → susah maintain. Ikuti aturan internal di langkah 5.
- **Deploy dilupakan** → produk tak sampai ke user. Langkah 8 bagian dari workflow, bukan opsional.

## Studi kasus (bukti workflow ini jalan)

Sistem **Penilaian Kinerja Pegawai** dibangun dengan workflow ini:
38 commit, ±2 hari kerja. PRD = dokumen spec (204 baris), FSD = dokumen plan (382 baris),
backend Laravel + frontend Angular (design system PILAR UII) + test otomatis.

## Tools

- **PILAR** — design system & badge UII (https://pilarng.github.io/badge, Figma: PILAR Design System)
- **Figma X Claude** — integrasi desain → kode
- **Automate Test** — standar test otomatis
