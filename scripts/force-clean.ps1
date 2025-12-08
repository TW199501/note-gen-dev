# NoteGen Force Clean Script
# Purpose: Force clean locked Rust build artifacts

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  NoteGen Force Clean Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Split-Path -Parent $PSScriptRoot
$tauriDir = Join-Path $projectRoot "src-tauri"
$targetDir = Join-Path $tauriDir "target"

if (-not (Test-Path $targetDir)) {
    Write-Host "Target directory does not exist, no cleanup needed" -ForegroundColor Green
    exit 0
}

Write-Host "Checking for processes that may lock files..." -ForegroundColor Yellow

# Check for processes that may lock files
$processesToCheck = @("explorer", "Code", "cargo", "rustc", "note-gen")
$foundProcesses = @()

foreach ($procName in $processesToCheck) {
    $procs = Get-Process -Name $procName -ErrorAction SilentlyContinue
    if ($procs) {
        $foundProcesses += $procName
        Write-Host "  Found process: $procName" -ForegroundColor Yellow
    }
}

if ($foundProcesses.Count -gt 0) {
    Write-Host ""
    Write-Host "Recommend closing the following programs:" -ForegroundColor Yellow
    foreach ($proc in $foundProcesses) {
        Write-Host "  - $proc" -ForegroundColor Gray
    }
    Write-Host ""
    $continue = Read-Host "Continue cleanup? (y/n)"
    if ($continue -ne "y" -and $continue -ne "Y") {
        Write-Host "Cancelled" -ForegroundColor Gray
        exit 0
    }
}

Write-Host ""
Write-Host "Starting force cleanup..." -ForegroundColor Yellow

Set-Location $tauriDir

# Try layered deletion (from outermost layer)
$targetDirsToRemove = @(
    "target\release\bundle\msi",
    "target\release\bundle\nsis",
    "target\release\bundle",
    "target\release\deps",
    "target\release\build",
    "target\release\incremental",
    "target\release",
    "target\debug\deps",
    "target\debug\build",
    "target\debug\incremental",
    "target\debug",
    "target\.rustc_info.json",
    "target"
)

$removedCount = 0
$failedCount = 0

foreach ($dir in $targetDirsToRemove) {
    $fullPath = Join-Path $tauriDir $dir
    if (Test-Path $fullPath) {
        try {
            # Remove read-only attributes
            Get-ChildItem -Path $fullPath -Recurse -Force -ErrorAction SilentlyContinue | ForEach-Object {
                try {
                    $_.Attributes = $_.Attributes -band (-bnot [System.IO.FileAttributes]::ReadOnly)
                } catch {
                    # Ignore files that cannot modify attributes
                }
            }
            
            # Try to delete
            Remove-Item -Recurse -Force $fullPath -ErrorAction Stop
            Write-Host "  Deleted: $dir" -ForegroundColor Green
            $removedCount++
        } catch {
            Write-Host "  Failed to delete: $dir" -ForegroundColor Red
            Write-Host "      Error: $($_.Exception.Message)" -ForegroundColor DarkGray
            $failedCount++
        }
    }
}

Set-Location $projectRoot

Write-Host ""
if ($failedCount -eq 0) {
    Write-Host "Force cleanup completed!" -ForegroundColor Green
} else {
    Write-Host "Partial cleanup completed ($removedCount succeeded, $failedCount failed)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "If files still cannot be deleted, try:" -ForegroundColor Yellow
    Write-Host "  1. Close all file manager windows" -ForegroundColor Gray
    Write-Host "  2. Close VS Code and all terminals" -ForegroundColor Gray
    Write-Host "  3. Temporarily disable antivirus real-time protection" -ForegroundColor Gray
    Write-Host "  4. Run this script with administrator privileges" -ForegroundColor Gray
    Write-Host "  5. Restart computer and try again" -ForegroundColor Gray
}
