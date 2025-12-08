# 待辦事項

**最後更新**: 2025-01-27

---

## 📋 任務概覽

- **安全風險修復**: 5/13 已完成 ✅
- **編譯測試**: 1/1 已完成 ✅
- **構建問題修復**: 1/4 已完成
- **文檔任務**: 3/4 已完成
- **學習計劃**: 已完成 ✅（理解等級：85-90%）

---

## 🔒 安全風險修復任務

## ✅ 已完成（高風險）

- [x] **(A) 修復硬編碼的 API 密鑰問題** +Security #高風險 {cm:2025-01-27} ✅
  - **位置**: `src/lib/event-report.ts`, `src-tauri/tauri.conf.json`, `src/app/core/setting/about/updater.tsx`
  - **問題**: 硬編碼了 UpgradeLink 服務的 `accessKey`、`secretKey`、`appKey`
  - **修復**: 已移除所有 UpgradeLink 相關功能（服務已不可用）
  - **詳細文檔**: `docs/HARDCODED_KEYS.md`

- [x] **(A) 將 Access Token 從 URL 參數移至 HTTP Header** +Security #高風險 {cm:2025-01-27} ✅
  - **位置**: `src/lib/sync/gitee.ts`
  - **修復**: 所有 Gitee API 請求已改為使用 `Authorization: token ${accessToken}` Header

- [x] **(A) 禁用不安全的 HTTP 協議** +Security #高風險 {cm:2025-01-27} ✅
  - **位置**: `src-tauri/tauri.conf.json`
  - **修復**: `dangerousInsecureTransportProtocol` 已設為 `false`，強制使用 HTTPS

- [x] **(A) 配置內容安全策略 (CSP)** +Security #高風險 {cm:2025-01-27} ✅
  - **位置**: `src-tauri/tauri.conf.json`
  - **修復**: 已配置適當的 CSP 策略，防止 XSS 攻擊

- [x] **(A) 修復 XSS 風險（dangerouslySetInnerHTML）** +Security #高風險 {cm:2025-01-27} ✅
  - **位置**: `src/app/core/record/chat/chat-preview.tsx`
  - **修復**: 已安裝 DOMPurify，在渲染前清理 HTML 內容

## ⏳ 待處理（高風險）

- [ ] **(A) 加強 MCP 服務器命令執行安全** +Security #高風險 @src-tauri/src/mcp.rs
  - **位置**: `src-tauri/src/mcp.rs` (第91-170行)
  - **問題**: 允許執行任意命令和參數，可能導致命令注入攻擊
  - **建議**: 嚴格驗證和清理用戶輸入；使用白名單限制可執行的命令；實施最小權限原則

- [ ] **(A) 驗證 MCP HTTP 服務器 URL** +Security #高風險 @src/lib/mcp/client.ts
  - **位置**: `src/lib/mcp/client.ts` (第221行)
  - **問題**: HTTP 請求直接使用用戶配置的 URL，未進行驗證
  - **風險**: 可能導致 SSRF (Server-Side Request Forgery) 攻擊
  - **建議**: 驗證 URL 格式和協議（僅允許 HTTPS）；使用白名單限制允許的域名

- [ ] **(A) 驗證和清理 MCP 自定義 Headers** +Security #高風險 @src/lib/mcp/client.ts
  - **位置**: `src/lib/mcp/client.ts` (第213-218行)
  - **問題**: 直接解析用戶提供的 headers，可能包含惡意內容
  - **建議**: 驗證和清理 headers；禁止敏感 headers；使用白名單

## ⏳ 待處理（中風險）

- [ ] **(B) 限制文件系統權限** +Security #中風險 @src-tauri/capabilities/default.json
  - **問題**: 文件系統權限設置為 `"path": "**"`，允許訪問所有路徑
  - **建議**: 限制文件系統訪問範圍，只允許訪問應用程序需要的特定目錄

- [ ] **(B) 限制 HTTP 網絡權限** +Security #中風險 @src-tauri/capabilities/default.json
  - **問題**: HTTP 權限允許訪問所有 HTTP/HTTPS URL
  - **建議**: 使用白名單限制允許訪問的域名和 URL

- [ ] **(B) 清理 Console 輸出中的敏感信息** +Security #中風險
  - **問題**: 可能無意中輸出敏感信息到控制台
  - **建議**: 移除或條件化所有 console 輸出（僅在開發環境）

- [ ] **(B) 審查所有 SQL 查詢確保參數化** +Security #中風險 @src/db
  - **問題**: 需要確認所有 SQL 查詢都正確使用參數化
  - **建議**: 審查所有數據庫操作，確保沒有字符串拼接

- [ ] **(B) 驗證文件路徑處理邏輯** +Security #中風險 @src/lib/files.ts @src/lib/workspace.ts
  - **問題**: 路徑處理邏輯複雜，可能導致路徑遍歷攻擊
  - **建議**: 嚴格驗證所有路徑輸入；確保路徑規範化後不會逃逸工作區

- [ ] **(B) 檢查 localStorage 使用，移除敏感信息** +Security #中風險
  - **問題**: localStorage 可能存儲敏感信息，容易被 XSS 攻擊讀取
  - **建議**: 僅存儲非敏感信息；敏感信息應使用 Tauri Store 或加密存儲

- [ ] **(B) 驗證 PicGo URL 配置** +Security #中風險 @src/lib/imageHosting/picgo.ts
  - **問題**: 直接使用用戶配置的 URL 進行請求，未驗證
  - **建議**: 驗證 URL 格式；僅允許 localhost 或特定域名

- [ ] **(B) 加密存儲 S3 憑證** +Security #中風險 @src/stores/imageHosting.ts
  - **問題**: S3 憑證存儲在 Tauri Store 中未加密
  - **建議**: 考慮加密存儲；使用系統憑證管理器

## ⏳ 待處理（低風險）

- [ ] **(C) 改進 Cookie 安全設置** +Security #低風險 @src/components/ui/sidebar.tsx
- [ ] **(C) 確保所有 JSON.parse 都有異常處理** +Security #低風險
- [ ] **(C) 驗證動態導入的語言文件路徑** +Security #低風險 @src/i18n/request.ts

---

## 🏗️ 構建和打包問題修復任務

- [ ] **(A) 修復 NODE_ENV 環境變量問題** +Build #高風險 @next.config.ts
  - **問題**: `assetPrefix` 依賴 `NODE_ENV === 'production'`，構建時可能未正確設置
  - **建議**: 在 `package.json` 的 `build` 腳本中明確設置 `NODE_ENV=production`

- [ ] **(B) 統一版本號管理** +Build #中風險
  - **問題**: 版本號不一致（`tauri.conf.json`: 0.22.3, `package.json`: 0.1.0, iOS: 0.22.2）
  - **建議**: 統一版本號管理策略；使用腳本自動同步版本號

- [x] **(C) 評估 Turbopack 生產構建穩定性** +Build #低風險 {cm:2025-01-27} ✅
  - **修復**: 生產構建已改為使用標準 webpack；保留開發環境使用 Turbopack

- [ ] **(C) 驗證構建產物路徑配置** +Build #低風險 @src-tauri/tauri.conf.json
  - **問題**: 需要確認 `frontendDist: "../out"` 與 Next.js 輸出目錄一致

---

## ✅ 編譯測試任務（已完成）

- [x] **(A) 編譯測試：驗證項目能否成功編譯** +Build #最高優先級 {cm:2025-01-27} ✅
  - **前端構建**: ✅ 成功（使用標準 webpack）
  - **Tauri 構建**: ✅ 成功（3分55秒）
  - **構建產物**: ✅ 可執行文件、NSIS 安裝程序、MSI 安裝程序均已生成
  - **狀態**: ✅ 編譯測試通過，構建成功

---

## 📚 文檔與項目任務

- [x] **(B) 將 model-card.tsx、ai.ts 和 event-report.ts 中的硬編碼改為多國語言** +i18n #中優先級 {cm:2025-01-27} ✅
  - **位置**: `src/app/core/setting/ai/model-card.tsx`, `src/lib/ai.ts`, `src/lib/event-report.ts`
  - **任務**: 將錯誤訊息、測試文字和提示文字中的硬編碼中文改為使用翻譯鍵值
  - **已完成**:
    - ✅ model-card.tsx: 所有錯誤訊息已改為使用翻譯
    - ✅ ai.ts: 所有錯誤訊息和提示文字已改為使用翻譯（添加了 getTranslation 輔助函數）
    - ✅ event-report.ts: 檢查後發現主要是註釋，無需翻譯

- [x] **(B) 將 sync.tsx 和 mark-gen.tsx 中的硬編碼改為多國語言** +i18n #中優先級 {cm:2025-01-27} ✅
  - **位置**: `src/app/core/article/custom-footer/sync.tsx`, `src/app/core/record/chat/mark-gen.tsx`
  - **任務**: 將 AI 提示文字和錯誤訊息中的硬編碼中文改為使用翻譯鍵值
  - **需要添加的翻譯鍵值**:
    - `article.footer.sync.aiCommitPrompt`: AI 生成提交信息的提示
    - `article.footer.sync.requestFailed`: 請求失敗檢查
    - `record.chat.note.scanMarksIntro`: 截圖 OCR 識別文字片段介紹
    - `record.chat.note.textMarksIntro`: 文本複製記錄片段介紹
    - `record.chat.note.imageMarksIntro`: 插圖記錄片段描述介紹
    - `record.chat.note.linkMarksIntro`: 鏈接記錄內容介紹
    - `record.chat.note.fileMarksIntro`: 文件記錄片段描述介紹
    - `record.chat.note.markItem`: 第 X 條記錄內容
    - `record.chat.note.createdAt`: 創建於
    - `record.chat.note.imageDesc`: 描述
    - `record.chat.note.imageUrl`: 圖片地址
    - `record.chat.note.linkTitle`: 標題
    - `record.chat.note.linkUrl`: 鏈接
    - `record.chat.note.linkContent`: 內容
    - `record.chat.note.fileContent`: 內容
    - `record.chat.note.meetRequirement`: 滿足需求
    - `record.chat.note.noRecordsMessage`: 如果記錄內容為空，則返回本次整理中不存在任何記錄信息
    - `record.chat.note.formatRequirements`: 滿足以下格式要求
    - `record.chat.note.useLanguage`: 使用 {locale} 語言
    - `record.chat.note.useMarkdown`: 使用 Markdown 語法
    - `record.chat.note.ensureHeading`: 確保存在一級標題
    - `record.chat.note.correctOrder`: 筆記順序可能是錯誤的，要按照正確順序排列
    - `record.chat.note.referenceLinks`: 如果存在鏈接記錄，將其作為參考鏈接放在文章末尾，格式如下
    - `record.chat.note.referenceLinksTitle`: 參考鏈接
    - `record.chat.note.imagePlacement`: 如果存在插圖記錄，通過插圖記錄的描述，將圖片鏈接放在筆記中的適合位置，圖片地址包含 uuid，請完整返回，並對插圖附帶簡單的描述

- [x] **(B) 創建項目概覽文檔 (PROJECT_OVERVIEW.md)** +Documentation {cm:2025-01-27} ✅
  - **位置**: `docs/PROJECT_OVERVIEW.md`
  - **狀態**: 已完成

- [x] **(B) 創建前端架構文檔 (FRONTEND_ARCH.md)** +Documentation {cm:2025-01-27} ✅
  - **位置**: `docs/FRONTEND_ARCH.md`
  - **狀態**: 已完成

- [x] **(C) 創建 API 概覽文檔 (API_OVERVIEW.md)** +Documentation {cm:2025-01-27} ✅
  - **位置**: `docs/API_OVERVIEW.md`
  - **狀態**: 已完成

- [x] **(B) 創建首次掃描筆記** +Documentation {cm:2025-01-27} ✅
  - **位置**: `docs/todo/todo2025-01-27-01.md`
  - **狀態**: 已完成

- [ ] **(C) 創建關鍵用戶流程文檔 (ui-flow-*.md)** +Documentation
  - **計劃**: 記錄從記錄到寫作、AI 聊天、同步、搜索等關鍵流程

- [ ] **(B) 檢查並更新 README.md** +Documentation
  - **缺失內容**: 開發環境設置步驟、本地開發指南、構建說明

---

## 📖 學習計劃任務（已完成）

**當前理解等級**: 85-90% ✅  
**目標理解等級**: 90% ✅  
**詳細計劃文檔**: `docs/LEARNING_PLAN.md`  
**學習筆記**: `docs/LEARNING_NOTES.md`

## ✅ 已完成階段

- [x] **階段 1：核心業務邏輯深入** ✅
  - [x] 記錄到寫作流程（60% → 80%）
  - [x] AI 聊天流程（40% → 90%）
  - [x] 同步功能（40% → 85%）
  - [x] 搜索功能（50% → 85%）

- [x] **階段 2：狀態管理深入** ✅
  - [x] Stores 依賴關係分析（50% → 90%）

- [x] **階段 3：數據流和錯誤處理** ✅
  - [x] Tauri Commands 深入學習（60% → 80%）

- [x] **階段 4：邊界情況和特殊邏輯** ✅
  - [x] 邊界情況處理分析（30% → 80%）

- [x] **階段 5：代碼依賴關係** ✅
  - [x] 代碼依賴關係分析（50% → 75%）

### ✅ 達到 90% 的標誌（全部達成）

- [x] 能夠預測代碼行為 ✅
- [x] 理解完整的數據流 ✅
- [x] 理解錯誤處理機制 ✅
- [x] 理解依賴關係 ✅
- [x] 能夠安全地修改代碼 ✅

---

## 📝 檢查範圍

- ✅ 已檢查 `src/` 目錄下的所有主要文件
- ✅ 已檢查配置文件（`tauri.conf.json`, `capabilities/`）
- ✅ 已檢查數據庫操作文件
- ✅ 已檢查網絡請求相關文件
- ✅ 已檢查文件操作相關文件
- ✅ 已檢查用戶輸入處理
- ✅ 已檢查敏感信息存儲

---

## 💡 建議

- 建議優先處理高風險安全問題
- 所有敏感信息應使用環境變量或加密存儲
- 定期進行安全審計和依賴項更新
- 考慮使用安全掃描工具（如 npm audit, cargo audit）
- 實施代碼審查流程，特別關注安全相關變更
