#!/usr/bin/env bash
# Genera en dist/ los .zip para subir a claude.ai (Ajustes → Capacidades → Skills → Subir).
# Límites de claude.ai por skill: 30 MB sin comprimir, 200 ficheros, descripción <= 200 caracteres.
# diagram-design se recorta: de los ejemplos solo se deja la variante clara de cada tipo.
# ppt-master no cabe (solo sus scripts son ~290 ficheros): se usa desde Claude Code.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/.claude/skills"
OUT="$ROOT/dist"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

rm -rf "$OUT" && mkdir -p "$OUT"

for s in karpathy-guidelines diagram-design; do
  cp -R "$SRC/$s" "$TMP/$s"
done
find "$TMP/diagram-design/assets" -name 'example-*' \
  \( -name '*-dark.html' -o -name '*-full.html' -o -name '*-terminal.html' -o -name '*-animated.html' \) -delete
find "$TMP" -name '__pycache__' -type d -prune -exec rm -rf {} +

# claude.ai limita la descripción a 200 caracteres (Claude Code admite 1024).
# Se sustituye solo el campo description del SKILL.md de la copia empaquetada.
python3 - "$TMP" <<'PY'
import json, re, sys
from pathlib import Path
DESC = {
    "karpathy-guidelines": "Pautas para programar con menos errores: pensar antes, simplicidad, cambios quirúrgicos y objetivos verificables. Usar al escribir, revisar o refactorizar código.",
    "diagram-design": "Crea diagramas con marca propia (procesos, swimlanes, organigramas, flujos, Gantt, cascada, Sankey; 44 tipos) en HTML/SVG/PNG. Usar al pedir un diagrama o esquema visual.",
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

for s in karpathy-guidelines diagram-design; do
  size_kb=$(du -sk "$TMP/$s" | cut -f1)
  if (( size_kb > 30 * 1024 )); then
    echo "ERROR: $s ocupa ${size_kb} KB (> 30 MB)" >&2; exit 1
  fi
  nfiles=$(find "$TMP/$s" -type f | wc -l)
  if (( nfiles > 200 )); then
    echo "ERROR: $s tiene $nfiles ficheros (> 200)" >&2; exit 1
  fi
  (cd "$TMP" && zip -qr -X "$OUT/$s.zip" "$s")
  printf '%-22s %6s KB sin comprimir  %5s ficheros  -> dist/%s.zip (%s)\n' \
    "$s" "$size_kb" "$(find "$TMP/$s" -type f | wc -l)" "$s" "$(du -h "$OUT/$s.zip" | cut -f1)"
done
