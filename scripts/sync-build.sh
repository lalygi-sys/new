#!/usr/bin/env bash
# Sync prototype/BUILD into hub + asset cache-bust query params.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BUILD_FILE="$ROOT/prototype/BUILD"

if [[ -f "$BUILD_FILE" ]]; then
  BUILD="$(tr -d '[:space:]' < "$BUILD_FILE")"
else
  BUILD="$(git -C "$ROOT" rev-parse --short HEAD)"
  echo "$BUILD" > "$BUILD_FILE"
fi

for file in \
  "$ROOT/prototype/hub.html" \
  "$ROOT/prototype/ib-dashboard/index.html" \
  "$ROOT/prototype/rebate/index.html" \
  "$ROOT/prototype/index.html"
do
  sed -i '' "s/const BUILD = '[^']*'/const BUILD = '$BUILD'/" "$file"
  sed -i '' "s/?v=[^\"']*/?v=$BUILD/g" "$file"
done

echo "BUILD=$BUILD synced"
