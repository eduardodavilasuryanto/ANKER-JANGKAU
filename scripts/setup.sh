#!/usr/bin/env bash
# One-time local setup for macOS and Linux.

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PYTHON_BIN="${PYTHON_BIN:-python3}"

cd "$ROOT_DIR"

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "Created .env from .env.example."
fi

if [[ ! -d backend/.venv ]]; then
  "$PYTHON_BIN" -m venv backend/.venv
fi

backend/.venv/bin/python -m pip install -r backend/requirements.txt

(
  cd frontend
  npm install
)

echo "Setup complete. Run ./scripts/dev.sh to start the frontend and backend."
