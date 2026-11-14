<p align="center">
  <img src="https://api.iconify.design/lucide/atom.svg?color=%23ffffff&width=160" width="160" alt="nano logo" />
</p>

# nano — AI Asisten untuk Manajemen Proyek (Ide → Sistem → Dokumentasi)

**nano** adalah AI asisten berbasis Claude Code yang membantu tim menyelesaikan siklus
pengembangan sistem secara utuh dan konsisten — dari **ide → PRD → rencana sistem →
prototype → dokumentasi pengguna** — dengan Pilar (design system UII), memori antar-sesi,
dan kontrol manusia di tiap langkah.

> nano **bukan aplikasi terpisah** — ia bekerja di dalam **Claude Code** sebagai kumpulan
> skill. Repo ini adalah **sumber skill nano**, bukan folder proyek kerja.

## Tiga pekerjaan nano

| Pekerjaan | Fungsi |
|---|---|
| **Diskusi & Analisis** | catatan rapat → PRD + FSD + BPMN |
| **Pengembangan Sistem** | design Figma + document spec + prototype (Full Angular+Laravel, atau Lite Vite) |
| **Dokumentasi** | automated test + report + user manual |

## Isi repo

| Folder | Isi |
|---|---|
| `skills/` | source skill nano: `nano` (pintu masuk, termasuk knowledge bawaan di `nano/references/` — token PILAR Design System UII) + skill pendukung (`dev-workflow`, `ai-native-development-workflow`, `generating-test-reports`, `screenshotting-web-app`, `editing-powerpoint-with-python`) |
| `docs/` | memori kerja (`nano/state.md`) + dokumen contoh (PRD, SPEC, BPMN, test report, user manual) |
| `backend/`, `frontend/` | aplikasi demo hasil nano (lihat bagian [Aplikasi demo](#aplikasi-demo)) |

## Instalasi

Panduan lengkap, prasyarat per-OS, dan troubleshooting: **[INSTALL.md](INSTALL.md)**.

### Prasyarat singkat

- **Claude Code** — `npm install -g @anthropic-ai/claude-code` lalu login (`claude`)
- **Git**, **Node.js** (≥ 18.19 / 20.11 — Angular 18), **Python 3**, **Google Chrome**
- **PHP ≥ 8.3** + **Composer** — hanya untuk **aplikasi demo** (backend Laravel).
  `./setup.sh` mengecek versi PHP dan Node sekaligus.
- Opsional (fitur penuh): Figma MCP, Superpowers, Context7, ngrok, Playwright,
  python-pptx, akses PILAR

### 5 langkah

1. **Clone repo**
   ```bash
   git clone https://github.com/dhenta312/hackathon-appraisal.git
   cd hackathon-appraisal
   ```
2. **Jalankan setup** — otomatis `git pull`, menyalin skill ke `~/.claude/skills/`,
   lalu cek prasyarat.
   ```bash
   ./setup.sh
   ```
3. **Restart Claude Code** — tutup lalu buka lagi agar skill baru terbaca.
4. **Verifikasi**
   ```bash
   ls ~/.claude/skills/
   ```
   Pastikan folder `nano` muncul.
5. **Coba**
   ```bash
   claude
   > hai nano
   ```
   nano akan menjawab dan menawarkan tiga pekerjaan.

## Memulai proyek baru dengan nano

1. **Buat folder proyek baru** di luar repo ini, lalu salin template memori:
   ```bash
   mkdir -p proyek-baru/docs/nano
   cp hackathon-appraisal/docs/nano/state.md proyek-baru/docs/nano/state.md
   ```
2. **Buka Claude Code di proyek baru** dan panggil nano:
   ```bash
   cd proyek-baru
   claude
   > hai nano
   ```

Memori (`docs/nano/state.md`) bersifat **per-proyek** — nano membacanya untuk tahu
"kita lanjut dari mana" dan memperbaruinya di akhir sesi.

> **Proyek Laravel?** Saat mulai membangun backend, pasang **Laravel Boost** lebih dulu:
> `composer require laravel/boost --dev && php artisan boost:install` — agar kode
> mengikuti best practice dan nano tidak menebak API Laravel.

## Cara update ke versi terbaru

```bash
cd hackathon-appraisal
./setup.sh
```

Satu perintah cukup — `setup.sh` otomatis `git pull` dulu, lalu menyalin ulang skill.

## Skill & MCP yang harus ada

`./setup.sh` hanya memasang skill nano dari repo ini. Supaya **semua pekerjaan** nano
jalan penuh, lengkapi dependensi berikut sekali di tiap mesin.

### Skill (wajib untuk pekerjaan terkait)

| Skill | Asal | Dipakai oleh | Cara pasang |
|---|---|---|---|
| `superpowers:brainstorming`, `superpowers:writing-plans`, dll. | plugin **Superpowers** | Diskusi & Analisis | `/plugin marketplace add obra/superpowers` lalu `/plugin install superpowers` |
| `figma:figma-generate-design`, `figma:figma-design-to-code`, `figma:figma-generate-library` | plugin **Figma** (butuh MCP Figma) | Pengembangan Sistem (design ↔ code) | pasang plugin Figma + login akun Figma |
| `pilar-design-system` | skill global (bukan dari repo ini) | Pengembangan Sistem (token/komponen PILAR) | pasang skill `pilar-design-system` ke `~/.claude/skills/` |
| `dev-workflow`, `ai-native-development-workflow`, `generating-test-reports`, `screenshotting-web-app`, `editing-powerpoint-with-python` | **repo ini** | semua pekerjaan | otomatis via `./setup.sh` |

> Tanpa Superpowers/Figma, nano tetap jalan — hanya bagian yang butuh skill itu yang
> tidak tersedia (mis. brainstorming terstruktur, design-to-code).

### MCP server

| MCP | Untuk | Cara pasang | Status |
|---|---|---|---|
| **Figma** | design-to-code & code-to-design (`figma:*`) | konfigurasi di Claude Code + login Figma | Wajib bila memakai `figma:*` |
| **Context7** | dokumentasi library terkini (Angular/Laravel/Vite/Tailwind) | `/plugin marketplace add upstash/context7` | Opsional |
| **Laravel Boost** | backend Laravel: guidelines + skill + MCP best-practice (anti-halu) | sudah terpasang di `backend/` (`composer require laravel/boost --dev && php artisan boost:install`) | Aktif — butuh `composer install` di `backend/` |
| **Confluence** | penulisan dokumen terpusat — PRD, FSD, SPEC, user manual tersimpan di satu tempat | konfigurasi MCP Confluence + login Atlassian | 🚧 Coming soon |
| **ClickUp** | penulisan task — backlog & sprint hasil nano langsung tercatat sebagai task | konfigurasi MCP ClickUp + API token | 🚧 Coming soon |
| *(tanpa MCP)* | screenshot & PDF | Google Chrome + Playwright | Wajib untuk Dokumentasi |

> **Arah ke depan (Scrum):** Confluence + ClickUp akan terhubung dengan nano agar seluruh
> alur — diskusi → PRD/FSD (dokumen terpusat) → backlog & sprint (task) → pengembangan →
> dokumentasi — berjalan nyambung dan mendukung **budaya Scrum** tim. Keduanya **belum
> tersedia (coming soon)**; nano tetap jalan penuh tanpa keduanya.

### Tool CLI tambahan

| Tool | Untuk | Cara pasang | Wajib? |
|---|---|---|---|
| Playwright + Chromium | automated test (`npm i -D @playwright/test && npx playwright install chromium`) | Dokumentasi | Wajib untuk Dokumentasi |
| python-pptx + Pillow | `pip3 install python-pptx pillow` | Dokumentasi (deck) | Opsional |
| ngrok | `brew install ngrok` + authtoken | publish prototype (URL publik) | Opsional |

### Cek cepat

```bash
ls ~/.claude/skills/                 # nano + skill repo ini terpasang?
claude                                # lalu di dalam sesi: /plugin (cek Superpowers, Figma)
```

## Aplikasi demo

**Platform Penilaian Kinerja** — aplikasi web (Laravel + Angular) yang dibangun memakai
nano sebagai contoh hasil "Pengembangan Sistem". Aplikasi ini menggantikan penilaian
kinerja berbasis Google Form + rekap manual HR dengan alur menilai yang ringan dan skor
yang transparan.

→ Cara menjalankan (stack, seeder akun demo, skrip demo): **[DEMO.md](DEMO.md)**

## Panduan lain

| Dokumen | Isi |
|---|---|
| [INSTALL.md](INSTALL.md) | panduan instalasi lengkap (peserta baru, troubleshooting) |
| [DEMO.md](DEMO.md) | menjalankan aplikasi demo penilaian kinerja |
| [skills/README.md](skills/README.md) | ringkasan skill yang menyusun nano |
| [docs/](docs/) | PRD, SPEC, BPMN, test report, user manual contoh |
