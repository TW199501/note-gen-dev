# NoteGen Development Mode Script
# Purpose: Start development server

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting NoteGen Development Mode" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

# Check if dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "[WARN]  node_modules not found, installing dependencies..." -ForegroundColor Yellow
    pnpm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[FAIL] Dependency installation failed" -ForegroundColor Red
        exit 1
    }
}

Write-Host "Starting development server..." -ForegroundColor Yellow
Write-Host "  Executing: pnpm tauri dev" -ForegroundColor Gray
Write-Host ""

pnpm tauri dev
