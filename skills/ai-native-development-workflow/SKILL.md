---
name: ai-native-development-workflow
description: Use when building software end-to-end (gathering requirements, writing PRD/FSD, designing the database, building a Laravel backend and Angular frontend, deploying) and wanting a faster, smarter, safer AI-assisted process that stays aligned with internal standards and best practices.
---

# AI-Native Development Workflow

## Overview

Workflow 8 langkah untuk membangun software end-to-end dengan bantuan AI: **lebih cepat**
(otomasi), **lebih cerdas** (AI di tiap tahap), **lebih aman** (standar + verifikasi di tiap
gate). Cocok untuk stack Laravel + Angular + MySQL.

## Prinsip inti

- **AI menghasilkan draf, manusia memutuskan & memverifikasi.** AI mempercepat tiap tahap,
  tapi keputusan arah, prioritas, dan approval tetap di manusia.
- **Tiap tahap punya artefak masuk → artefak keluar** yang bisa diaudit.

## 8 Langkah + Skill Claude Code

| # | Langkah | AI membantu | Output (artefak) | Skill yang dipakai |
|---|---|---|---|---|
| 1 | Diskusi kebutuhan (user & stakeholder) | merangkum hasil diskusi | catatan kebutuhan | superpowers:brainstorming |
| 2 | Kumpulkan aturan, dokumen, standar kerja | membedah dokumen acuan | daftar aturan & standar | deep-research (bila riset standar eksternal) |
| 3 | PRD — dokumen kebutuhan bisnis | menyusun draf PRD | PRD | superpowers:brainstorming · superpowers:writing-plans |
| 4 | FSD — desain fungsional & teknis | menyusun draf FSD | FSD + rencana task | superpowers:writing-plans |
| 5 | Struktur database (MySQL) | generate migration & schema | schema sesuai standar | superpowers:test-driven-development |
| 6 | Backend (Laravel best practice) | generate controller/model/test | API + test | superpowers:test-driven-development · superpowers:executing-plans |
| 7 | Frontend (Angular + framework UI) | generate komponen | UI sesuai desain | figma:figma-design-to-code · figma:figma-use · figma:figma-code-connect |
| 8 | Deployment ke gateway UII | otomasi langkah deploy | app live | (devops standar) |

## Deliverable (artefak dokumentasi)

Selain kode, workflow menghasilkan artefak dokumentasi standar (template mengikuti
project App Purnatugas):

| Artefak | Lokasi | Template / isi |
|---|---|---|
| **PRD** | `docs/PRD.md` | 18 seksi: ringkasan eksekutif, latar & masalah, tujuan & ukuran, pengguna & peran, ruang lingkup, alur pengguna, kebutuhan fungsional, model data, aturan bisnis, referensi nilai, API, validasi, non-fungsional, asumsi, kriteria penerimaan, roadmap, glosarium, lampiran |
| **FSD / SPEC** | `docs/SPEC.md` | 11 seksi: arsitektur, stack, struktur repo, backend, kontrak API, frontend, alur data, cara menjalankan, pengujian, keterbatasan, glosarium |
| **Document Spec** | `docs/DOCUMENT-SPEC.md` | Feature Description + Specification Details + tabel "UI Design Specifications Flow" (kolom: No / UI Design / Specifications / Flow, satu baris per layar + screenshot) |
| **BPMN** | `docs/bpmn/*.bpmn` + `.png` | XML BPMN 2.0 (swimlane, konvensi id `T_` userTask / `S_` serviceTask / `G_` gateway / `Flow_N`) + diagram visual flowchart |
| **User manual** | `.pdf` / `.md` | Cover ("User Manual / [Sistem] / Sisi Pengguna") + bab per alur + langkah bernomor + screenshot ber-anotasi merah |

**Skill/tool per artefak:**
- **PRD & FSD** → `superpowers:writing-plans` (langkah 3–4).
- **BPMN** → tulis XML BPMN 2.0 manual, atau `figma:figma-generate-diagram` untuk flowchart.
- **Document Spec & user manual** → `screenshotting-web-app` (screenshot ber-anotasi) + HTML → PDF via Chrome print-to-pdf.

## Daftar skill Claude Code

### Figma — desain ↔ kode (langkah 7)

**Inti:**
- `figma:figma-design-to-code` — implementasi desain Figma → kode (wajib sebelum `get_design_context`)
- `figma:figma-use` — menulis/mengedit desain di Figma (wajib sebelum `use_figma`)
- `figma:figma-code-connect` — memetakan komponen kode ↔ desain
- `figma:figma-generate-design` — mendorong halaman/app → Figma
- `figma:figma-generate-library` — membangun design system (token, komponen, variant)
- `figma:figma-generate-diagram` — diagram alur/arsitektur di FigJam
- `figma:figma-create-new-file` — membuat file Figma baru

**Pendukung (sesuai kebutuhan):**
- `figma:figma-implement-motion` · `figma:figma-use-motion` — animasi
- `figma:figma-spec` — PRD/RFC di Figma spec
- `figma:figma-use-figjam` · `figma:figma-use-slides` — konteks FigJam / Slides
- `figma:figma-code-workflows` — impor project lokal → Figma Code
- `figma:figma-shaders` · `figma:figma-generative-plugins` · `figma:figma-swiftui` — kasus khusus

### Superpowers — proses & kualitas

- `superpowers:brainstorming` — menggali kebutuhan & ide (langkah 1, 3)
- `superpowers:writing-plans` — menulis spec/rencana (langkah 3, 4)
- `superpowers:writing-skills` — menulis skill
- `superpowers:test-driven-development` — test dulu, implementasi (langkah 5, 6)
- `superpowers:executing-plans` · `superpowers:subagent-driven-development` — eksekusi rencana
- `superpowers:dispatching-parallel-agents` — paralelkan tugas independen
- `superpowers:systematic-debugging` — telusuri bug sistematis
- `superpowers:verification-before-completion` — verifikasi sebelum klaim selesai
- `superpowers:requesting-code-review` · `superpowers:receiving-code-review` — review sebelum merge
- `superpowers:using-git-worktrees` — isolasi pekerjaan fitur
- `superpowers:finishing-a-development-branch` — merapikan & menggabungkan saat selesai
- `superpowers:using-superpowers` — meta-skill: cara menemukan & memakai skill lain
- `superpowers:diagnosing-superpowers` — mendiagnosa saat sesi superpowers bermasalah

### Skill Claude Code lainnya

- `deep-research` — riset multi-sumber dengan verifikasi (langkah 2)
- `dataviz` — chart/grafik/dashboard yang konsisten (laporan & halaman hasil)
- `security-review` — review keamanan perubahan (pilar "safer")
- `simplify` — refactor/simplify kode yang baru diubah (kualitas)
- `review` — review pull request / diff kerja
- `run` — jalankan & screenshot app (lihat juga `screenshotting-web-app`)
- `init` — buat CLAUDE.md dokumentasi codebase
- `claude-api` — referensi Claude API (untuk app berbasis AI/LLM)
- `update-config` — konfigurasi harness: settings.json, hooks, permissions
- `fewer-permission-prompts` — kurangi prompt permission berulang (tim)
- `keybindings-help` — kustomisasi shortcut keyboard (personal)
- `loop` — tugas berulang/berjadwal

## Kapan dipakai / tidak

**Dipakai saat:** mulai proyek baru dari nol, atau fitur besar yang mencakup banyak lapisan
(database → backend → frontend → deploy), dan tim ingin prosesnya bisa diulang & diaudit.

**Tidak untuk:** perbaikan satu baris, tugas mekanis kecil, atau proyek tanpa kebutuhan
dokumentasi/standar internal.

## Kesalahan umum

- **Loncat ke coding sebelum PRD/FSD jelas** → hasil menyimpang. Mulai dari langkah 1–2 dulu.
- **AI dipakai tanpa gate verifikasi** → output tak terkontrol.
- **Desain & kode tidak dihubungkan** → pakai `figma:figma-design-to-code` + `figma:figma-code-connect`.
- **Database dibuat tanpa standar** → susah maintain.
- **Deploy dilupakan** → langkah 8 bagian dari workflow, bukan opsional.

## Studi kasus (bukti workflow ini jalan)

Dipakai di beberapa proyek UII (mis. sistem penilaian kinerja pegawai, kelola data
purna tugas): produk end-to-end selesai dalam hitungan hari, lengkap dengan PRD, FSD,
BPMN, Document Spec, dan user manual — backend Laravel + frontend Angular (design system
PILAR) + test otomatis.

## Tools

- **PILAR** — design system & badge UII (https://pilarng.github.io/badge, Figma: PILAR Design System)
- **Figma X Claude** — integrasi desain → kode
- **Automate Test** — standar test otomatis
