#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

echo "Cleaning project caches and build artifacts..."

# Vite pre-bundle cache (common source of virtual:plugin-vuetify errors)
rm -rf node_modules/.vite

# Build output
rm -rf dist

# Optional npm cache housekeeping (safe)
npm cache verify >/dev/null || true

echo "Clean complete."
echo "Next: npm install && npm run dev -- --force"