#!/usr/bin/env bash
set -euo pipefail

REPO_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILLS_DIR="${HOME}/.claude/skills"

echo "======================================"
echo "  nano — AI Asisten: setup"
echo "======================================"
echo ""

# 1. Salin semua skill ke lokasi global
echo "[1/3] Menyalin skill ke ${SKILLS_DIR} ..."
mkdir -p "${SKILLS_DIR}"
for d in "${REPO_DIR}"/skills/*/; do
  name="$(basename "$d")"
  cp -r "$d" "${SKILLS_DIR}/"
  echo "      ✓ ${name}"
done

# 2. Cek prasyarat
echo ""
echo "[2/3] Cek prasyarat:"
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

# 3. Dependency tambahan (tidak bisa di-cek otomatis semua)
echo ""
echo "[3/3] Dependency tambahan (pasang manual bila perlu):"
echo "      - Figma MCP + login Figma — untuk design-to-code / code-to-design"
echo "      - Superpowers skills (plugin Claude Code)"
echo "      - Playwright + Chromium:  cd frontend && npx playwright install chromium"
echo "      - python-pptx + Pillow:   pip3 install python-pptx pillow"
echo "      - Akses PILAR:            https://www.figma.com/design/AYHhj3V2tSnZleViFsIjEx/PILAR-DESIGN-SYSTEM"

echo ""
echo "======================================"
echo "  Selesai. Skill nano sudah terpasang."
echo "  Memori kerja ada di docs/nano/state.md"
echo "======================================"
