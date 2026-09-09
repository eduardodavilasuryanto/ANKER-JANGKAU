# Start kitchen (8000) and shop window (5173).
# Run from repo root:  .\scripts\dev.ps1

$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\backend'; & .\.venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$root\frontend'; npm run dev"

Write-Host "Kitchen:     http://localhost:8000/docs"
Write-Host "Shop window: http://localhost:5173"
