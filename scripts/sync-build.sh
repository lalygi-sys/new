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

HUB="$ROOT/prototype/hub.html"
sed -i '' "s/const BUILD = '[^']*'/const BUILD = '$BUILD'/" "$HUB"
sed -i '' "s|index\\.html?v=[^\"']*|index.html?v=$BUILD|g" "$HUB"

DASH="$ROOT/prototype/ib-dashboard/index.html"
sed -i '' "s|\\.\\./shared/ib-chrome\\.css\\(\\?v=[^\"']*\\)\\?|../shared/ib-chrome.css?v=$BUILD|g" "$DASH"
sed -i '' "s|styles\\.css\\(\\?v=[^\"']*\\)\\?\"|styles.css?v=$BUILD\"|g" "$DASH"
sed -i '' "s|\\.\\./shared/ib-chrome\\.js\\(\\?v=[^\"']*\\)\\?|../shared/ib-chrome.js?v=$BUILD|g" "$DASH"
sed -i '' "s|app\\.js\\(\\?v=[^\"']*\\)\\?\"|app.js?v=$BUILD\"|g" "$DASH"

REBATE="$ROOT/prototype/rebate/index.html"
sed -i '' "s|shared/ib-chrome\\.css\\(\\?v=[^\"']*\\)\\?|shared/ib-chrome.css?v=$BUILD|g" "$REBATE"
sed -i '' "s|shared/ib-chrome\\.js\\(\\?v=[^\"']*\\)\\?|shared/ib-chrome.js?v=$BUILD|g" "$REBATE"

CONTESTS="$ROOT/prototype/index.html"
sed -i '' "s|shared/ib-chrome\\.css\\(\\?v=[^\"']*\\)\\?|shared/ib-chrome.css?v=$BUILD|g" "$CONTESTS"

echo "BUILD=$BUILD synced"
