#!/usr/bin/env bash
set -euo pipefail

echo "[render-start] $(date -u +%FT%T%Z) - Running start wrapper"
echo "[render-start] Node version: $(node -v || echo 'node not found')"
echo "[render-start] Working directory: $(pwd)"
echo "[render-start] Listing root:" 
ls -la || true
echo "[render-start] Listing .next (if present):"
ls -la .next || true

# Check for production build markers that `next start` expects.
if [ ! -f .next/BUILD_ID ] && [ ! -f .next/prerender-manifest.json ]; then
	echo "[render-start] Production build markers missing (no .next/BUILD_ID or prerender-manifest.json)."
	echo "[render-start] Attempting to run 'next build' to generate production artifacts."
	npx --yes next build
	echo "[render-start] Re-listing .next after build:"
	ls -la .next || true
fi

echo "[render-start] Starting Next.js production server"
exec npx --yes next start
