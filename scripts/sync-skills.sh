#!/usr/bin/env bash
# Copia en .claude/skills/ las skills de terceros fijadas en skills.lock.
# Uso:
#   scripts/sync-skills.sh            -> instala exactamente los commits fijados
#   scripts/sync-skills.sh --update   -> trae la última versión de main y actualiza skills.lock
# Tras --update, revisa el diff (git diff --stat) antes de hacer commit.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOCK="$ROOT/skills.lock"
DEST="$ROOT/.claude/skills"
UPDATE=0
[[ "${1:-}" == "--update" ]] && UPDATE=1

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

NEW_LOCK="$TMP/skills.lock"
grep '^#' "$LOCK" > "$NEW_LOCK"

grep -v '^#' "$LOCK" | while read -r name repo commit path; do
  [[ -z "$name" ]] && continue
  src="$TMP/${repo//\//_}"
  if [[ ! -d "$src" ]]; then
    git clone -q --filter=blob:none "https://github.com/$repo.git" "$src"
  fi
  if (( UPDATE )); then
    commit="$(git -C "$src" rev-parse --short HEAD)"
  else
    git -C "$src" checkout -q "$commit"
  fi
  rm -rf "${DEST:?}/$name"
  mkdir -p "$DEST/$name"
  cp -R "$src/$path/." "$DEST/$name/"
  rm -rf "$DEST/$name/.git"   # skills que viven en la raíz del repo upstream
  printf '%-25s %-35s %-9s %s\n' "$name" "$repo" "$commit" "$path" >> "$NEW_LOCK"
  echo "ok  $name  ($repo@$commit)"
done

cp "$NEW_LOCK" "$LOCK"
