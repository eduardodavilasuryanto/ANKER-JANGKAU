# One-time local setup for Windows.
# Analogy: unpack the toy house, put batteries in, label the rooms.

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

if (-not (Test-Path ".env")) {
  Copy-Item ".env.example" ".env"
  Write-Host "Created .env from .env.example. Fill MAPID keys later."
}

if (-not (Test-Path "backend\.venv")) {
  python -m venv "backend\.venv"
}

& "backend\.venv\Scripts\python.exe" -m pip install -r "backend\requirements.txt"

if (Get-Command npm -ErrorAction SilentlyContinue) {
  Set-Location "frontend"
  npm install
  Set-Location $root
} else {
  Write-Host "npm not found. Install Node 20, then run npm install inside frontend/."
}

Write-Host "Setup done. Next: read docs/GUIDEBOOK.md section 6."
