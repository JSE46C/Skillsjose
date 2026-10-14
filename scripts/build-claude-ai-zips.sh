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

# claude.ai limita la descripción a 200 caracteres (Claude Code admite 1024).
# Se sustituye solo el campo description del SKILL.md de la copia empaquetada.
python3 - "$TMP" <<'PY'
import json, re, sys
from pathlib import Path
DESC = {
    "karpathy-guidelines": "Pautas para programar con menos errores: pensar antes, simplicidad, cambios quirúrgicos y objetivos verificables. Usar al escribir, revisar o refactorizar código.",
    "diagram-design": "Crea diagramas con marca propia (procesos, swimlanes, organigramas, flujos, Gantt, cascada, Sankey; 44 tipos) en HTML/SVG/PNG. Usar al pedir un diagrama o esquema visual.",
    "ppt-master": "Genera presentaciones PowerPoint (.pptx) nativas y editables desde PDF, Word, web o un tema. Usar al pedir crear, rehacer o mejorar una presentación o diapositivas.",
}
for name, desc in DESC.items():
    assert len(desc) <= 200, (name, len(desc))
    f = Path(sys.argv[1]) / name / "SKILL.md"
    text = f.read_text(encoding="utf-8")
    end = text.index("\n---", 3)
    front, body = text[:end], text[end:]
    # description puede ser de una línea o un bloque YAML (>, |) con líneas sangradas
    front, n = re.subn(r"^description:.*(?:\n[ \t]+.*)*", "description: " + json.dumps(desc, ensure_ascii=False), front, count=1, flags=re.M)
    assert n == 1, name
    f.write_text(front + body, encoding="utf-8")
PY

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
