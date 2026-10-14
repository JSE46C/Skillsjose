#!/usr/bin/env bash
# Genera en dist/ los .zip para subir a claude.ai (Ajustes → Capacidades → Skills → Subir).
# Límite de claude.ai: 30 MB sin comprimir por skill. ppt-master se recorta
# (sin templates/icons ni templates/sounds) para entrar en ese límite.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/.claude/skills"
OUT="$ROOT/dist"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

rm -rf "$OUT" && mkdir -p "$OUT"

for s in karpathy-guidelines diagram-design ppt-master; do
  cp -R "$SRC/$s" "$TMP/$s"
done
rm -rf "$TMP/ppt-master/templates/icons" "$TMP/ppt-master/templates/sounds"
find "$TMP" -name '__pycache__' -type d -prune -exec rm -rf {} +

# La skill de ppt-master se autoverifica; si el recorte la rompe, abortar.
python3 "$TMP/ppt-master/scripts/attribution_guard.py"

for s in karpathy-guidelines diagram-design ppt-master; do
  size_kb=$(du -sk "$TMP/$s" | cut -f1)
  if (( size_kb > 30 * 1024 )); then
    echo "ERROR: $s ocupa ${size_kb} KB (> 30 MB)" >&2; exit 1
  fi
  (cd "$TMP" && zip -qr -X "$OUT/$s.zip" "$s")
  printf '%-22s %6s KB sin comprimir  %5s ficheros  -> dist/%s.zip (%s)\n' \
    "$s" "$size_kb" "$(find "$TMP/$s" -type f | wc -l)" "$s" "$(du -h "$OUT/$s.zip" | cut -f1)"
done
