# NoteGen Rebuild Script
# Purpose: Clean all build artifacts and dependencies, then reinstall and rebuild

param(
    [switch]$SkipClean = $false,
    [switch]$SkipInstall = $false,
    [switch]$SkipBuild = $false,
    [switch]$SkipTauri = $false
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  NoteGen Rebuild Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

# Step 1: Clean build artifacts
if (-not $SkipClean) {
    Write-Host "[1/5] Cleaning build artifacts..." -ForegroundColor Yellow
    
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
    
    Write-Host "  [OK] Build artifacts cleaned" -ForegroundColor Green
    Write-Host ""
}
else {
    Write-Host "[1/5] Skipping clean step" -ForegroundColor Gray
    Write-Host ""
}

# Step 2: Reinstall dependencies
if (-not $SkipInstall) {
    Write-Host "[2/5] Reinstalling dependencies..." -ForegroundColor Yellow
    
    Write-Host "  Executing: pnpm install" -ForegroundColor Gray
    pnpm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  [FAIL] Dependency installation failed" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "  [OK] Dependencies installed" -ForegroundColor Green
    Write-Host ""
}
else {
    Write-Host "[2/5] Skipping dependency installation" -ForegroundColor Gray
    Write-Host ""
}

# Step 3: Build frontend
if (-not $SkipBuild) {
    Write-Host "[3/5] Building frontend..." -ForegroundColor Yellow
    
    Write-Host "  Executing: pnpm build" -ForegroundColor Gray
    pnpm build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  [FAIL] Frontend build failed" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "  [OK] Frontend build completed" -ForegroundColor Green
    Write-Host ""
}
else {
    Write-Host "[3/5] Skipping frontend build" -ForegroundColor Gray
    Write-Host ""
}

# Step 4: Build Tauri application
if (-not $SkipTauri) {
    Write-Host "[4/5] Building Tauri application..." -ForegroundColor Yellow
    
    Write-Host "  Executing: pnpm tauri build" -ForegroundColor Gray
    Write-Host "  [WARN]  This may take several minutes..." -ForegroundColor Yellow
    pnpm tauri build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  [FAIL] Tauri build failed" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "  [OK] Tauri build completed" -ForegroundColor Green
    Write-Host ""
}
else {
    Write-Host "[4/5] Skipping Tauri build" -ForegroundColor Gray
    Write-Host ""
}

# Step 5: Display build results
Write-Host "[5/5] Build Results" -ForegroundColor Yellow
Write-Host ""

$buildOutputs = @(
    @{
        Name = "Frontend Build Output"
        Path = "out"
    },
    @{
        Name = "Tauri Executable"
        Path = "src-tauri\target\release\note-gen.exe"
    },
    @{
        Name = "MSI Installer"
        Path = "src-tauri\target\release\bundle\msi\*.msi"
    },
    @{
        Name = "NSIS Installer"
        Path = "src-tauri\target\release\bundle\nsis\*.exe"
    }
)

foreach ($output in $buildOutputs) {
    $fullPath = Join-Path $projectRoot $output.Path
    $files = Get-ChildItem -Path $fullPath -ErrorAction SilentlyContinue
    
    if ($files) {
        Write-Host "  [OK] $($output.Name):" -ForegroundColor Green
        foreach ($file in $files) {
            $size = [math]::Round($file.Length / 1MB, 2)
            Write-Host "     - $($file.Name) ($size MB)" -ForegroundColor Gray
        }
    }
    else {
        Write-Host "  [WARN]  $($output.Name): Not found" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Rebuild process completed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
