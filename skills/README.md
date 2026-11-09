# nano — AI Asisten untuk Manajemen Proyek (dari Ide hingga Dokumentasi)

**nano** adalah kumpulan skill Claude Code yang membantu tim menyelesaikan siklus
pengembangan sistem secara utuh dan konsisten — dari ide → PRD → rencana sistem →
dokumentasi pengguna — dengan Pilar (design system UII) + memori antar-sesi + kontrol
manusia di tiap langkah.

## Cara pakai (tim lain)

```bash
git clone <url-repo-ini>
cd <repo>
./setup.sh
```

Selesai — skill terpasang di `~/.claude/skills/` dan langsung dikenali Claude Code.

## Prasyarat

| Kebutuhan | Untuk apa |
|---|---|
| Claude Code CLI | menjalankan skill |
| Figma MCP + login Figma | design-to-code / code-to-design |
| Superpowers skills (plugin) | brainstorming, writing-plans, TDD, dst. |
| Akses PILAR (Figma + badge) | sumber desain resmi UII |
| Node.js + Python 3 | tooling |
| Playwright + Chromium | automated test + report |
| python-pptx + Pillow | otomasi deck + diagram |
| Google Chrome | screenshot & konversi PDF |

## Tiga pekerjaan nano

1. **PRD** — catatan rapat / transkrip → dokumen kebutuhan terstruktur (latar, tujuan,
   ruang lingkup, kebutuhan fungsional, alur, risiko) + daftar pertanyaan terbuka.
2. **Sistem** — rencana pembangunan (stack, arsitektur, Pilar) + prototype cepat.
3. **Dokumentasi** — panduan pengguna bergambar (langkah + screenshot + penjelasan).

## Memori (di dalam repo)

`docs/nano/state.md` — catatan kerja antar-sesi. nano membaca statusnya saat dipanggil
("kita lanjut dari mana?") dan memperbaruinya di akhir sesi. Karena ada di dalam repo,
konteks ikut ter-clone dan tidak bergantung pada ingatan individu.

## Skill yang menyusun nano

| Skill | Fungsi |
|---|---|
| `ai-native-development-workflow` | memandu 8 langkah (diskusi → PRD → FSD → build → deploy) |
| `dev-workflow` | konvensi stack Laravel + Angular + SQLite + PILAR |
| `generating-test-reports` | automated test + laporan HTML + PDF |
| `editing-powerpoint-with-python` | otomasi deck presentasi |
| `screenshotting-web-app` | screenshot SPA ber-login |
