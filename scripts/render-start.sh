#!/usr/bin/env bash
set -euo pipefail

echo "[render-start] $(date -u +%FT%T%Z) - Running start wrapper"
echo "[render-start] Node version: $(node -v || echo 'node not found')"
echo "[render-start] Working directory: $(pwd)"
echo "[render-start] Listing root:" 
ls -la || true
echo "[render-start] Listing .next (if present):"
ls -la .next || true

echo "[render-start] Starting Next.js production server"
exec npx next start
