#!/usr/bin/env bash
# Run the dev server for a checkout that lives on a filesystem without symlinks.
#
# This project sits on a FAT32 SD card. npm needs symlinks to create the .bin
# shims, so `npm install` inside the project fails with EPERM, and without
# node_modules there is no dev server.
#
# The fix is to keep node_modules on a real filesystem and point everything else
# back here. The workdir holds node_modules plus a symlink per source entry, so
# the files Vite serves and watches are the ones you edit -- no copying, no
# syncing, no stale mirror.
#
#   ./tools/dev.sh            start the dev server (default port 5173)
#   ./tools/dev.sh 4000       start it on another port
#   PYC_WORKDIR=~/x ./tools/dev.sh    put the workdir somewhere specific
set -euo pipefail

PROJECT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
WORKDIR="${PYC_WORKDIR:-${XDG_CACHE_HOME:-$HOME/.cache}/pycomprehend-dev}"
PORT="${1:-5173}"

echo "project : $PROJECT"
echo "workdir : $WORKDIR"

mkdir -p "$WORKDIR"
cd "$WORKDIR"

# package.json/package-lock.json are copied, not linked: npm rewrites them, and
# writing through to the card would be both slow and surprising.
cp "$PROJECT/package.json" .
[ -f "$PROJECT/package-lock.json" ] && cp "$PROJECT/package-lock.json" .

if [ ! -d node_modules ] || [ package.json -nt node_modules ]; then
  echo "installing dependencies in the workdir…"
  npm install --no-audit --no-fund
fi

for entry in src public index.html tsconfig.json tailwind.config.js postcss.config.js; do
  [ -e "$PROJECT/$entry" ] && ln -sfn "$PROJECT/$entry" "$entry"
done

# A local config, because the project's own vite.config.ts must stay correct for
# a normal checkout. preserveSymlinks is the essential line: without it Vite
# resolves each source file to its real path on the card and then looks for
# node_modules from there, finding none.
cat > vite.config.ts <<'CONFIG'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: { preserveSymlinks: true },
  // FAT32 stores timestamps at 2-second granularity, which makes native file
  // events unreliable; polling keeps hot reload honest.
  server: { watch: { usePolling: true, interval: 300 } },
});
CONFIG

echo
echo "starting Vite on http://localhost:$PORT/  (Ctrl-C to stop)"
echo "edits in $PROJECT/src hot-reload as usual"
echo
exec npx vite --port "$PORT" --strictPort
