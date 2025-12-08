# NoteGen 項目清理腳本
# 用途：清理所有構建產物和依賴

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  NoteGen 項目清理腳本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

Write-Host "清理構建產物..." -ForegroundColor Yellow

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
    } else {
        Write-Host "  跳過: $item (不存在)" -ForegroundColor DarkGray
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
        $cleanOutput = cargo clean 2>&1 | Out-String
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  [OK] Rust 構建產物已清理" -ForegroundColor Green
            $cleanSuccess = $true
        }
    } catch {
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
                } catch {
                    Write-Host "  [WARN]  無法刪除: $dir (可能被占用)" -ForegroundColor Yellow
                }
            }
        }
        
        if ($removedAny) {
            Write-Host "  [OK] 部分清理完成" -ForegroundColor Green
        } else {
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

Write-Host ""
Write-Host "[OK] 清理完成！" -ForegroundColor Green
