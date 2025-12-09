# NoteGen 運維腳本

本目錄包含用於項目維護的 PowerShell 腳本。

## 腳本列表

### 1. `rebuild.ps1` - 完整重建腳本

清理所有構建產物和依賴，然後重新安裝和構建。

**使用方法：**

```powershell
# 完整重建（清理 + 安裝 + 構建前端 + 構建 Tauri）
.\scripts\rebuild.ps1

# 跳過清理步驟
.\scripts\rebuild.ps1 -SkipClean

# 只清理和安裝，不構建
.\scripts\rebuild.ps1 -SkipBuild -SkipTauri

# 只構建前端，不構建 Tauri
.\scripts\rebuild.ps1 -SkipClean -SkipInstall -SkipTauri
```

**參數說明：**

- `-SkipClean`: 跳過清理步驟
- `-SkipInstall`: 跳過依賴安裝
- `-SkipBuild`: 跳過前端構建
- `-SkipTauri`: 跳過 Tauri 構建

### 2. `clean.ps1` - 清理腳本

只清理構建產物和依賴，不重新安裝。

**使用方法：**

```powershell
.\scripts\clean.ps1
```

**清理內容：**

- `.next/` - Next.js 構建緩存
- `out/` - Next.js 輸出目錄
- `node_modules/` - Node.js 依賴
- `pnpm-lock.yaml` - pnpm 鎖定文件
- `src-tauri/target/` - Rust 構建產物

### 3. `dev.ps1` - 開發模式啟動腳本

啟動開發服務器（自動檢查並安裝依賴）。

**使用方法：**

```powershell
.\scripts\dev.ps1
```

### 4. `force-clean.ps1` - 強制清理腳本

強制清理被占用的 Rust 構建產物（當 `cargo clean` 失敗時使用）。

**使用方法：**

```powershell
.\scripts\force-clean.ps1
```

**功能：**

- 檢查可能占用文件的進程
- 分層刪除 target 目錄（從最外層開始）
- 自動移除只讀屬性
- 提供詳細的錯誤信息和解決建議

## 快速命令

### 完整重建

```powershell
.\scripts\rebuild.ps1
```

### 只清理

```powershell
.\scripts\clean.ps1
```

### 啟動開發模式

```powershell
.\scripts\dev.ps1
```

### 手動步驟（如果腳本有問題）

```powershell
# 1. 清理
.\scripts\clean.ps1

# 2. 安裝依賴
pnpm install

# 3. 構建前端
pnpm build

# 4. 構建 Tauri
pnpm tauri build
```

## 注意事項

1. **執行策略**：如果遇到「無法載入，因為在此系統上已停用指令碼執行」錯誤，請執行：

   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

2. **構建時間**：
   - 前端構建：約 10-30 秒
   - Tauri 構建：約 3-5 分鐘（首次構建可能更長）

3. **構建產物位置**：
   - 前端：`out/`
   - Tauri 可執行文件：`src-tauri/target/release/note-gen.exe`
   - MSI 安裝包：`src-tauri/target/release/bundle/msi/`
   - NSIS 安裝包：`src-tauri/target/release/bundle/nsis/`
