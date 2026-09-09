# One-time local setup for Windows.
# Analogy: unpack the toy house, put batteries in, label the rooms.

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

if (-not (Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
  Write-Host "Created .env from .env.example. Fill MAPID keys later."
}

if (-not (Get-Command uv -ErrorAction SilentlyContinue)) {
  throw "uv is required. Install it from https://docs.astral.sh/uv/."
}

uv sync --directory "backend" --group dev

if (Get-Command npm -ErrorAction SilentlyContinue) {
  Set-Location "frontend"
  npm install
  Set-Location $root
} else {
  Write-Host "npm not found. Install Node 20, then run npm install inside frontend/."
}

Write-Host "Setup done. Next: read docs/GUIDEBOOK.md section 6."
