# Panduan Instalasi nano

Panduan lengkap memasang **nano** — AI Asisten untuk Manajemen Proyek — di perangkat lain,
dari nol sampai bisa dipakai.

---

## 1. Apa itu nano?

nano adalah asisten kerja berbasis AI (skill Claude Code) yang membantu tim menyelesaikan
siklus pengembangan sistem secara utuh: **Diskusi & Analisis → Pengembangan Sistem →
Dokumentasi**, dengan Pilar (design system UII), memori antar-sesi, dan kontrol manusia.

nano **bukan aplikasi terpisah** — ia bekerja di dalam **Claude Code**.

---

## 2. Prasyarat

### 2.1 Wajib

| Kebutuhan | Keterangan |
|---|---|
| **Claude Code CLI** | wajib — nano adalah skill yang dibaca Claude Code |
| **Git** | untuk clone repo & update |
| **Node.js** | untuk Angular & Playwright |
| **Python 3** | untuk script (diagram, PDF, dll.) |
| **Google Chrome** | untuk screenshot & konversi PDF |

### 2.2 Opsional (untuk fitur penuh)

| Kebutuhan | Untuk fitur |
|---|---|
| **Figma MCP + login Figma** | design-to-code / code-to-design (`figma:*`) |
| **Superpowers skills** (plugin) | brainstorming, writing-plans, TDD (`superpowers:*`) |
| **Playwright + Chromium** | automated test + report |
| **python-pptx + Pillow** | otomasi deck presentasi + diagram |
| **Akses PILAR** | sumber desain resmi UII |

> Tanpa yang "opsional", nano tetap bisa dipakai untuk PRD, FSD, BPMN, dan penyusunan
> dokumen. Fitur desain & testing membutuhkan dependency di atas.

---

## 3. Langkah instalasi

### Langkah 1 — Clone repo

```bash
git clone https://github.com/dhenta312/hackathon-appraisal.git
cd hackathon-appraisal
```

### Langkah 2 — Jalankan setup

```bash
./setup.sh
```

Script ini otomatis: `git pull` → menyalin semua skill ke `~/.claude/skills/` → cek prasyarat.

### Langkah 3 — Restart Claude Code

Tutup terminal/session Claude Code, lalu **buka lagi**. Claude Code mengenali skill baru
setelah dijalankan ulang.

### Langkah 4 — Verifikasi

```bash
ls ~/.claude/skills/
```

Hasilnya harus memuat folder-folder ini:

```
nano  ai-native-development-workflow  dev-workflow
generating-test-reports  editing-powerpoint-with-python  screenshotting-web-app
```

### Langkah 5 — Coba

Ketik di Claude Code:

```
/nano
```

atau cukup sapaan:

```
hai nano
```

nano akan menjawab dan menawarkan tiga pekerjaan.

---

## 4. Cara pakai

Tiga pekerjaan nano:

| Pekerjaan | Fungsi |
|---|---|
| **Diskusi & Analisis** | catatan rapat → PRD + FSD + BPMN |
| **Pengembangan Sistem** | design Figma + document spec + prototype (Angular + Laravel) |
| **Dokumentasi** | automated test + report + user manual |

nano membaca/memperbarui **`docs/nano/state.md`** (memori antar-sesi) di dalam repo proyek,
sehingga "kita lanjut dari mana?" selalu terjawab.

---

## 5. Cara update ke versi terbaru

```bash
cd <folder-repo>
./setup.sh
```

Satu perintah cukup — `setup.sh` otomatis `git pull` dulu, lalu menyalin ulang skill.

---

## 6. Troubleshooting

| Masalah | Penyebab | Solusi |
|---|---|---|
| `ERROR: Unknown skill: nano` | skill belum terinstall / Claude Code belum di-restart | jalankan `./setup.sh`, lalu restart Claude Code |
| `Unknown skill: superpowers:...` | plugin Superpowers belum terpasang | pasang plugin Superpowers |
| `Unknown skill: figma:...` | Figma MCP belum dikonfigurasi | pasang Figma MCP + login Figma |
| `./setup.sh` gagal (bukan repo git) | repo diunduh sebagai zip | clone via `git clone` (bukan download zip) |
| Skill terinstall tapi tidak terbaca | Claude Code belum restart | tutup & buka lagi Claude Code |

### Cek cepat bila masih bermasalah

```bash
ls ~/.claude/skills/nano/SKILL.md    # file skill ada?
head -4 ~/.claude/skills/nano/SKILL.md  # name: nano cocok?
```

---

## 7. Catatan

- **Memori (`docs/nano/state.md`) bersifat per-proyek.** Untuk proyek baru, salin template-nya
  dari repo ini ke proyek kamu, atau biarkan nano membuatkannya di run pertama.
- **nano butuh Claude Code** — dia "otak" yang dibaca Claude Code, bukan program yang diklik.
