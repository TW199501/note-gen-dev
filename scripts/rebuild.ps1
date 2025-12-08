# NoteGen 項目清理和重新構建腳本
# 用途：清理所有構建產物和依賴，然後重新安裝和構建

param(
    [switch]$SkipClean = $false,
    [switch]$SkipInstall = $false,
    [switch]$SkipBuild = $false,
    [switch]$SkipTauri = $false
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  NoteGen 項目清理和重新構建腳本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

# 步驟 1: 清理構建產物
if (-not $SkipClean) {
    Write-Host "[1/5] 清理構建產物..." -ForegroundColor Yellow
    
    # 清理前端構建產物
    $itemsToRemove = @(
        ".next",
        "out",
        "node_modules",
        "pnpm-lock.yaml"
    )
    
    foreach ($item in $itemsToRemove) {
        $path = Join-Path $projectRoot $item
        if (Test-Path $path) {
            Write-Host "  刪除: $item" -ForegroundColor Gray
            Remove-Item -Recurse -Force $path -ErrorAction SilentlyContinue
        }
    }
    
    # 清理 Rust 構建產物
    $tauriDir = Join-Path $projectRoot "src-tauri"
    if (Test-Path $tauriDir) {
        Write-Host "  清理 Rust 構建產物..." -ForegroundColor Gray
        Set-Location $tauriDir
        
        # 先嘗試正常的 cargo clean
        $cleanSuccess = $false
        try {
            $null = cargo clean 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Host "  [OK] Rust 構建產物已清理" -ForegroundColor Green
                $cleanSuccess = $true
            }
        }
        catch {
            # cargo clean 失敗，繼續嘗試手動清理
        }
        
        # 如果 cargo clean 失敗，嘗試手動刪除特定目錄
        if (-not $cleanSuccess) {
            Write-Host "  [WARN]  cargo clean 失敗（文件可能被占用），嘗試手動清理..." -ForegroundColor Yellow
            
            # 嘗試刪除可能被占用的目錄（從最外層開始）
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
                        # 先嘗試移除只讀屬性
                        Get-ChildItem -Path $fullPath -Recurse -Force | ForEach-Object {
                            $_.Attributes = $_.Attributes -band (-bnot [System.IO.FileAttributes]::ReadOnly)
                        }
                        
                        Remove-Item -Recurse -Force $fullPath -ErrorAction Stop
                        Write-Host "  [OK] 已刪除: $dir" -ForegroundColor Green
                        $removedAny = $true
                    }
                    catch {
                        Write-Host "  [WARN]  無法刪除: $dir (可能被占用)" -ForegroundColor Yellow
                    }
                }
            }
            
            if ($removedAny) {
                Write-Host "  [OK] 部分清理完成" -ForegroundColor Green
            }
            else {
                Write-Host "  [WARN]  無法清理 Rust 構建產物（文件被占用）" -ForegroundColor Yellow
                Write-Host "     解決方法：" -ForegroundColor DarkGray
                Write-Host "     1. 關閉文件管理器（如果正在訪問該目錄）" -ForegroundColor DarkGray
                Write-Host "     2. 關閉防毒軟體的實時掃描" -ForegroundColor DarkGray
                Write-Host "     3. 關閉所有相關程序（VS Code、終端等）" -ForegroundColor DarkGray
                Write-Host "     4. 重啟電腦後再試" -ForegroundColor DarkGray
            }
        }
        
        Set-Location $projectRoot
    }
    
    Write-Host "  [OK] 構建產物已清理" -ForegroundColor Green
    Write-Host ""
}
else {
    Write-Host "[1/5] 跳過清理步驟" -ForegroundColor Gray
    Write-Host ""
}

# 步驟 2: 重新安裝依賴
if (-not $SkipInstall) {
    Write-Host "[2/5] 重新安裝依賴..." -ForegroundColor Yellow
    
    Write-Host "  執行: pnpm install" -ForegroundColor Gray
    pnpm install
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  [FAIL] 依賴安裝失敗" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "  [OK] 依賴安裝完成" -ForegroundColor Green
    Write-Host ""
}
else {
    Write-Host "[2/5] 跳過依賴安裝" -ForegroundColor Gray
    Write-Host ""
}

# 步驟 3: 構建前端
if (-not $SkipBuild) {
    Write-Host "[3/5] 構建前端..." -ForegroundColor Yellow
    
    Write-Host "  執行: pnpm build" -ForegroundColor Gray
    pnpm build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  [FAIL] 前端構建失敗" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "  [OK] 前端構建完成" -ForegroundColor Green
    Write-Host ""
}
else {
    Write-Host "[3/5] 跳過前端構建" -ForegroundColor Gray
    Write-Host ""
}

# 步驟 4: 構建 Tauri 應用
if (-not $SkipTauri) {
    Write-Host "[4/5] 構建 Tauri 應用..." -ForegroundColor Yellow
    
    Write-Host "  執行: pnpm tauri build" -ForegroundColor Gray
    Write-Host "  [WARN]  這可能需要幾分鐘時間..." -ForegroundColor Yellow
    pnpm tauri build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "  [FAIL] Tauri 構建失敗" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "  [OK] Tauri 構建完成" -ForegroundColor Green
    Write-Host ""
}
else {
    Write-Host "[4/5] 跳過 Tauri 構建" -ForegroundColor Gray
    Write-Host ""
}

# 步驟 5: 顯示構建結果
Write-Host "[5/5] 構建結果" -ForegroundColor Yellow
Write-Host ""

$buildOutputs = @(
    @{
        Name = "前端構建產物"
        Path = "out"
    },
    @{
        Name = "Tauri 可執行文件"
        Path = "src-tauri\target\release\note-gen.exe"
    },
    @{
        Name = "MSI 安裝包"
        Path = "src-tauri\target\release\bundle\msi\*.msi"
    },
    @{
        Name = "NSIS 安裝包"
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
        Write-Host "  [WARN]  $($output.Name): 未找到" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  構建流程完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
