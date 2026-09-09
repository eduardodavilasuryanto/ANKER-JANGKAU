#!/usr/bin/env bash
# One-time local setup for macOS and Linux.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "Created .env from .env.example."
fi

uv sync --directory backend --group dev

(
  cd frontend
  npm install
)

echo "Setup complete. Run ./scripts/dev.sh to start the frontend and backend."
