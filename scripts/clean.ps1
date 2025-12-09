# NoteGen Clean Script
# Purpose: Clean all build artifacts and dependencies
# Usage: .\scripts\clean.ps1

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  NoteGen Clean Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

Write-Host "Cleaning build artifacts..." -ForegroundColor Yellow

# Clean frontend build artifacts
$itemsToRemove = @(
    ".next",
    "out",
    "node_modules",
    "pnpm-lock.yaml"
)

foreach ($item in $itemsToRemove) {
    $path = Join-Path $projectRoot $item
    if (Test-Path $path) {
        Write-Host "  Removing: $item" -ForegroundColor Gray
        Remove-Item -Recurse -Force $path -ErrorAction SilentlyContinue
    }
    else {
        Write-Host "  Skipping: $item (not found)" -ForegroundColor DarkGray
    }
}

# Clean Rust build artifacts
$tauriDir = Join-Path $projectRoot "src-tauri"
if (Test-Path $tauriDir) {
    Write-Host "  Cleaning Rust build artifacts..." -ForegroundColor Gray
    Set-Location $tauriDir
    
    # Try normal cargo clean first
    $cleanSuccess = $false
    try {
        $null = cargo clean 2>&1
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  [OK] Rust build artifacts cleaned" -ForegroundColor Green
            $cleanSuccess = $true
        }
    }
    catch {
        # cargo clean failed, continue with manual cleanup
    }
    
    # If cargo clean failed, try manual deletion
    if (-not $cleanSuccess) {
        Write-Host "  [WARN]  cargo clean failed (files may be locked), trying manual cleanup..." -ForegroundColor Yellow
        
        # Try to delete locked directories (from outermost layer)
        $targetDirsToRemove = @(
            "target\release\bundle",
            "target\release",
            "target\debug",
            "target"
        )
        
        $removedAny = $false
        foreach ($dir in $targetDirsToRemove) {
            $fullPath = Join-Path $tauriDir $dir
            if (Test-Path $fullPath) {
                try {
                    # Try to remove read-only attributes first
                    Get-ChildItem -Path $fullPath -Recurse -Force | ForEach-Object {
                        $_.Attributes = $_.Attributes -band (-bnot [System.IO.FileAttributes]::ReadOnly)
                    }
                    
                    Remove-Item -Recurse -Force $fullPath -ErrorAction Stop
                    Write-Host "  [OK] Deleted: $dir" -ForegroundColor Green
                    $removedAny = $true
                }
                catch {
                    Write-Host "  [WARN]  Cannot delete: $dir (may be locked)" -ForegroundColor Yellow
                }
            }
        }
        
        if ($removedAny) {
            Write-Host "  [OK] Partial cleanup completed" -ForegroundColor Green
        }
        else {
            Write-Host "  [WARN]  Cannot clean Rust build artifacts (files are locked)" -ForegroundColor Yellow
            Write-Host "     Solutions:" -ForegroundColor DarkGray
            Write-Host "     1. Close file manager (if accessing the directory)" -ForegroundColor DarkGray
            Write-Host "     2. Disable antivirus real-time scanning" -ForegroundColor DarkGray
            Write-Host "     3. Close all related programs (VS Code, terminals, etc.)" -ForegroundColor DarkGray
            Write-Host "     4. Restart computer and try again" -ForegroundColor DarkGray
        }
    }
    
    Set-Location $projectRoot
}

Write-Host ""
Write-Host "[OK] Cleanup completed!" -ForegroundColor Green
