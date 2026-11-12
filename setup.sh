#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILLS_DIR="${HOME}/.claude/skills"

echo "======================================"
echo "  nano — AI Asisten: setup"
echo "======================================"
echo ""

# 0. Update repo (auto-pull) bila ini clone git
echo "[1/4] Update repo ..."
if git -C "${REPO_DIR}" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  if git -C "${REPO_DIR}" pull --ff-only >/dev/null 2>&1; then
    echo "      ✓ repo sudah terbaru"
  else
    echo "      ! tidak bisa pull (belum commit / konflik) — lanjut dengan versi lokal"
  fi
else
  echo "      ! bukan repo git (mungkin diunduh zip) — lewati pull"
fi

# 1. Salin semua skill ke lokasi global
echo ""
echo "[2/4] Menyalin skill ke ${SKILLS_DIR} ..."
mkdir -p "${SKILLS_DIR}"
for d in "${REPO_DIR}"/skills/*/; do
  name="$(basename "$d")"
  # "$d." bukan "$d": trailing slash membuat cp menyalin ISI folder ke parent,
  # sehingga references/ nano tumpah ke ${SKILLS_DIR} dan tidak ikut ter-update.
  cp -R "$d." "${SKILLS_DIR}/${name}/"
  echo "      ✓ ${name}"
done

# 2. Cek prasyarat
echo ""
echo "[3/4] Cek prasyarat:"
check_cmd() {
  if command -v "$1" >/dev/null 2>&1; then
    echo "      ✓ $2"
  else
    echo "      ✗ $2 — belum terpasang"
  fi
}
check_cmd claude   "Claude Code CLI"
check_cmd python3  "Python 3"

# Node harus mendukung Angular 18: ^18.19.1 || ^20.11.1 || >=22
if command -v node >/dev/null 2>&1; then
  node_v="$(node -p 'process.versions.node' 2>/dev/null || echo "?")"
  IFS=. read -r node_major node_minor _ <<< "${node_v}"
  if { [ "${node_major:-0}" -eq 18 ] && [ "${node_minor:-0}" -ge 19 ]; } \
    || { [ "${node_major:-0}" -eq 20 ] && [ "${node_minor:-0}" -ge 11 ]; } \
    || [ "${node_major:-0}" -ge 22 ]; then
    echo "      ✓ Node.js ${node_v} (mendukung Angular 18)"
  else
    echo "      ✗ Node.js ${node_v} — Angular 18 butuh ^18.19.1, ^20.11.1, atau >=22"
  fi
else
  echo "      ✗ Node.js — belum terpasang (frontend Angular butuh Node >= 18.19)"
fi

# PHP + Composer untuk aplikasi demo (backend Laravel)
if command -v php >/dev/null 2>&1; then
  if php -r 'exit(version_compare(PHP_VERSION, "8.3.0", ">=") ? 0 : 1);' 2>/dev/null; then
    echo "      ✓ PHP $(php -r 'echo PHP_VERSION;' 2>/dev/null) (backend Laravel)"
  else
    echo "      ✗ PHP $(php -r 'echo PHP_VERSION;' 2>/dev/null) — backend demo butuh >= 8.3"
  fi
else
  echo "      ✗ PHP — belum terpasang (backend demo butuh >= 8.3)"
fi
check_cmd composer "Composer (backend demo)"

if [ -d "/Applications/Google Chrome.app" ]; then
  echo "      ✓ Google Chrome"
else
  echo "      ✗ Google Chrome — belum terpasang"
fi

# 3. Dependency tambahan
echo ""
echo "[4/4] Dependency tambahan (pasang manual bila perlu):"
echo "      - Figma MCP + login Figma — untuk design-to-code / code-to-design"
echo "      - Superpowers skills (plugin Claude Code)"
echo "      - Context7 (opsional):    /plugin marketplace add upstash/context7  — doc library terkini"
echo "      - ngrok (opsional):      brew install ngrok + ngrok config add-authtoken <token>  — publish prototype"
echo "      - Confluence (opsional):  skill generating-confluence-docs + .env.confluence (space/parent)  — publish dokumen"
echo "      - Playwright + Chromium:  cd frontend && npx playwright install chromium"
echo "      - python-pptx + Pillow:   pip3 install python-pptx pillow"
echo "      - Akses PILAR:            https://www.figma.com/design/AYHhj3V2tSnZleViFsIjEx/PILAR-DESIGN-SYSTEM"

echo ""
echo "======================================"
echo "  Selesai. Skill nano sudah terpasang."
echo "  Memori kerja ada di docs/nano/state.md"
echo "  Untuk update berikutnya: jalankan ./setup.sh lagi"
echo "======================================"
