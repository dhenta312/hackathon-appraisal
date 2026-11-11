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
  cp -r "$d" "${SKILLS_DIR}/"
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
check_cmd node     "Node.js"
check_cmd python3  "Python 3"
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
echo "      - Playwright + Chromium:  cd frontend && npx playwright install chromium"
echo "      - python-pptx + Pillow:   pip3 install python-pptx pillow"
echo "      - Akses PILAR:            https://www.figma.com/design/AYHhj3V2tSnZleViFsIjEx/PILAR-DESIGN-SYSTEM"

echo ""
echo "======================================"
echo "  Selesai. Skill nano sudah terpasang."
echo "  Memori kerja ada di docs/nano/state.md"
echo "  Untuk update berikutnya: jalankan ./setup.sh lagi"
echo "======================================"
