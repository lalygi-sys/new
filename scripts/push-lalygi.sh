#!/usr/bin/env bash
# Push main to lalygi-sys/new (GitHub Pages). Token: .local/lalygi-token or LALYGI_GITHUB_TOKEN.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

TOKEN_FILE="$ROOT/.local/lalygi-token"
if [[ -n "${LALYGI_GITHUB_TOKEN:-}" ]]; then
  TOKEN="$LALYGI_GITHUB_TOKEN"
elif [[ -f "$TOKEN_FILE" ]]; then
  TOKEN="$(tr -d '[:space:]' < "$TOKEN_FILE")"
else
  echo "No token. Save PAT once: mkdir -p .local && echo 'ghp_…' > .local/lalygi-token" >&2
  exit 1
fi

git push "https://lalygi-sys:${TOKEN}@github.com/lalygi-sys/new.git" main "$@"

echo "Pages URL: https://lalygi-sys.github.io/new/?v=$(tr -d '[:space:]' < "$ROOT/prototype/BUILD" 2>/dev/null || git rev-parse --short HEAD)"
