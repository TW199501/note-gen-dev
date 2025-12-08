# NoteGen 項目開發模式啟動腳本
# 用途：啟動開發服務器

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  啟動 NoteGen 開發模式" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

# 檢查依賴是否已安裝
if (-not (Test-Path "node_modules")) {
    Write-Host "[WARN]  未檢測到 node_modules，正在安裝依賴..." -ForegroundColor Yellow
    pnpm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[FAIL] 依賴安裝失敗" -ForegroundColor Red
        exit 1
    }
}

Write-Host "啟動開發服務器..." -ForegroundColor Yellow
Write-Host "  執行: pnpm tauri dev" -ForegroundColor Gray
Write-Host ""

pnpm tauri dev
