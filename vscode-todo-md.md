# Todo MD 擴展功能完整指南

> ⚠️ **注意**：此擴展不完全符合 todo.txt 規範。

## 📋 目錄

- [簡介](#簡介)
- [文件支持](#文件支持)
- [核心功能](#核心功能)
- [過濾器](#過濾器)
- [命令列表](#命令列表)
- [設置選項](#設置選項)
- [顏色配置](#顏色配置)
- [相關資源](#相關資源)

---

## 簡介

**Todo MD** 是一個強大的 VS Code 擴展，專為 Markdown 文件設計的任務管理工具。它支持多種特殊標籤、過濾器、排序和視圖功能，幫助您更好地組織和管理待辦事項。

### 主要特性

- ✅ 項目、上下文、標籤支持
- ✅ 優先級系統（A-Z）
- ✅ 截止日期和重複任務
- ✅ 樹狀視圖和網頁視圖
- ✅ 強大的過濾和搜索功能
- ✅ 44 個命令
- ✅ 62 個可配置設置

---

## 文件支持

### 預設文件

預設情況下，擴展會自動激活以下文件：

- `todo.md`
- `someday.md`
- `todo.archive.md`

### 自定義文件模式

可通過 `todomd.activatePattern` 設置配置其他文件模式：

```json
{
  "todomd.activatePattern": "**/{todo,someday,todo.archive}.md"
}
```

**範例：**
- 激活任何 `.txt` 文件：`**/*.txt`
- 激活單個文件：`**/todo.txt`
- 激活多個文件：`**/{todo,task}.txt`

---

## 核心功能

### 1. 項目（Projects）

使用 `+` 符號標記項目：

```markdown
+Project
```

**嵌套項目**：支持嵌套項目，但不會被特殊處理：

```markdown
+Project\nested
```

### 2. 上下文（Contexts）

使用 `@` 符號標記上下文：

```markdown
@context
```

### 3. 標籤（Tags）

使用 `#` 符號標記標籤：

```markdown
#tag1 #tag2
```

### 4. 優先級（Priority）

優先級是一個大寫字母，用圓括號包圍，範圍為 `(A-Z)`。只有前六個 `(A-F)` 有獨特的顏色：

```markdown
(A) 高優先級任務
(B) 中優先級任務
(C) 低優先級任務
```

### 5. 特殊標籤對（Special {tag:value} pairs）

#### 基本特殊標籤

| 標籤 | 描述 | 範例 |
|------|------|------|
| `{f}` | 收藏 | `{f}` |
| `{due:YYYY-MM-DD}` | 截止日期 | `{due:2020-04-30}` |
| `{overdue:YYYY-MM-DD}` | 最早過期日期（僅重複任務，自動添加） | `{overdue:2020-05-15}` |
| `{cm:YYYY-MM-DD}` | 完成日期 | `{cm:2020-05-15}` |
| `{cr:YYYY-MM-DD}` | 創建日期 | `{cr:2020-05-15}` |
| `{h}` | 隱藏（在樹狀視圖和網頁視圖中不可見，除非有截止日期） | `{h}` |
| `{c}` | 折疊狀態（在樹狀視圖或網頁視圖中折疊嵌套任務） | `{c}` |
| `{count:N/M}` | 計數器（完成時增加計數，達到目標時視為完成） | `{count:0/3}` |
| `{start:YYYY-MM-DDTHH:mm:ss}` | 開始時間 | `{start:2021-04-08T16:17:15}` |
| `{duration:1h2m}` | 持續時間（完成帶有 `{start}` 標籤的任務後自動計算） | `{duration:1h2m}` |

### 6. 重複截止日期（Recurring Due Date）

重複截止日期不應被歸檔，且每天重置完成狀態。

#### 每週重複

```markdown
# 每週一到期
{due:monday}

# 簡寫形式
{due:mon}

# 每週日和週一
{due:mon,sun}
```

#### 間隔重複

```markdown
# 每隔 2 天（需要起始日期）
{due:2020-06-28|e2d}

# 每隔 2 個月的最後一天（或該月最後一天）
{due:2020-02-31|e2m}

# 每隔 2 年的二月底
{due:2020-02-31|e2y}
```

### 7. 註釋（Comments）

註釋不被視為任務，以 `#` 開頭，後跟空格：

```markdown
# 這是一個註釋
```

快捷鍵：`Ctrl/Cmd+/`（僅在 todo.md 文件中）

---

## 過濾器

在任務樹狀視圖和網頁視圖中可以使用以下過濾器：

### 基本過濾器

| 過濾器 | 說明 | 範例 |
|--------|------|------|
| `#tag` | 標籤 | `#work` |
| `+project` | 項目 | `+Project` |
| `@context` | 上下文 | `@home` |
| `$A` | 優先級 | `$A` |
| `>$C` | 優先級範圍 | `>$C`（匹配 A、B、C） |

### 狀態過濾器

| 過濾器 | 說明 |
|--------|------|
| `$done` | 已完成的任務 |
| `$due` | 截止或過期任務 |
| `$overdue` | 過期任務 |
| `$upcoming` | 有截止日期但未到期的任務（等同於 `-$noDue -$due`） |
| `$recurring` | 重複任務 |
| `$hidden` | 帶有 `{h}` 特殊標籤的任務 |
| `$favorite` | 帶有 `{f}` 特殊標籤的任務 |
| `$started` | 帶有 `{start:...}` 標籤的未完成任務 |

### 否定過濾器

| 過濾器 | 說明 |
|--------|------|
| `$noDue` | 未指定截止日期 |
| `$noProject` | 沒有項目的任務 |
| `$noTag` | 沒有標籤的任務 |
| `$noContext` | 沒有上下文的任務 |
| `-#tag` | 不包含標籤 `#tag` 的任務 |

### 搜索過濾器

| 過濾器 | 說明 |
|--------|------|
| `TEXT_TO_SEARCH` | 在原始文本中搜索（行中的任何內容） |
| `"TEXT_TO_SEARCH"` | 僅在任務標題中搜索（不包括特殊實體，如標籤或項目） |

---

## 命令列表

Todo MD 提供 **44 個命令**來管理任務。所有命令都以 `todomd.` 開頭。

### 視圖控制

| 命令 | 說明 | 快捷鍵 |
|------|------|--------|
| `todomd.toggleComment` | 切換註釋 | `Ctrl/Cmd+/` |
| `todomd.toggleTagsTreeViewSorting` | 切換標籤樹狀視圖排序 | - |
| `todomd.toggleProjectsTreeViewSorting` | 切換項目樹狀視圖排序 | - |
| `todomd.toggleContextsTreeViewSorting` | 切換上下文樹狀視圖排序 | - |
| `todomd.showWebviewSettings` | 顯示網頁視圖設置 | - |
| `todomd.webview.pickSort` | 排序 | - |
| `todomd.webview.toggleShowRecurringUpcoming` | 切換顯示重複未來任務 | - |
| `todomd.focusTasksWebviewAndInput` | 聚焦任務網頁視圖和輸入框 | - |
| `todomd.collapseAllNestedTasks` | 折疊所有嵌套任務 | - |
| `todomd.expandAllTasks` | 展開所有任務 | - |

### 任務操作

| 命令 | 說明 | 快捷鍵 |
|------|------|--------|
| `todomd.incrementPriority` | 增加優先級 | - |
| `todomd.decrementPriority` | 減少優先級 | - |
| `todomd.toggleDone` | 切換完成狀態 | `Alt+D` |
| `todomd.hideTask` | 隱藏任務 | - |
| `todomd.deleteTask` | 刪除任務 | - |
| `todomd.completeTask` | 完成任務 | - |
| `todomd.startTask` | 開始任務（完成時添加 `{duration}` 標籤） | - |
| `todomd.toggleFavorite` | 切換收藏狀態（`{f}` 標籤） | - |

### 任務創建

| 命令 | 說明 |
|------|------|
| `todomd.addTaskToDefaultFile` | 添加任務到默認文件 |
| `todomd.addTaskToActiveFile` | 添加任務到活動文件 |
| `todomd.createSimilarTask` | 創建類似任務（相同標籤、項目、上下文） |

### 排序

| 命令 | 說明 |
|------|------|
| `todomd.sortByDefault` | 按截止日期和優先級排序（默認排序） |
| `todomd.sortByPriority` | 按優先級排序 |
| `todomd.sortByProject` | 按項目排序 |
| `todomd.sortByTag` | 按標籤排序 |
| `todomd.sortByContext` | 按上下文排序 |
| `todomd.sortByCreationDate` | 按創建日期排序 |
| `todomd.sortByDueDate` | 按截止日期排序 |
| `todomd.sortByCompletionDate` | 按完成日期排序 |

### 日期管理

| 命令 | 說明 |
|------|------|
| `todomd.setDueDate` | 設置相對於現在的截止日期（輔助命令） |
| `todomd.setDate` | 設置日期 |
| `todomd.removeOverdue` | 移除過期標籤 |

### 文件操作

| 命令 | 說明 |
|------|------|
| `todomd.openDefaultFile` | 打開默認文件 |
| `todomd.openDefaultArchiveFile` | 打開默認歸檔文件 |
| `todomd.openSomedayFile` | 打開「某日」文件 |
| `todomd.archiveCompletedTasks` | 將已完成任務移動到歸檔文件 |
| `todomd.moveToSomeday` | 移動到「某日」文件 |

### 任務查詢

| 命令 | 說明 |
|------|------|
| `todomd.getNextTask` | 從主文件獲取到期任務；如果沒有到期任務，則獲取優先級最高的任務 |
| `todomd.getFewNextTasks` | 獲取多個任務（到期任務優先） |
| `todomd.getRandomTask` | 獲取隨機任務 |

### 過濾器操作

| 命令 | 說明 |
|------|------|
| `todomd.applyFilterToTreeView` | 應用過濾器 |
| `todomd.clearTreeViewFilter` | 清除過濾器 |

### 其他

| 命令 | 說明 |
|------|------|
| `todomd.resetAllRecurringTasks` | 重置所有重複任務 |
| `todomd.followLink` | 跟隨鏈接 |

---

## 設置選項

Todo MD 擴展的所有設置都以 `todomd.` 開頭。共有 **62 個設置選項**。

### 網頁視圖設置（Webview Settings）

| 設置 | 默認值 | 說明 |
|------|--------|------|
| `webview.showCompleted` | `true` | 是否在網頁視圖中顯示已完成的任務 |
| `webview.completedStrikeThrough` | `false` | 是否在網頁視圖中對已完成任務添加刪除線 |
| `webview.showRecurringCompleted` | `true` | 是否在網頁視圖中顯示重複已完成的任務 |
| `webview.showRecurringUpcoming` | `true` | 是否在網頁視圖中顯示重複未來任務 |
| `webview.showPriority` | `true` | 是否在網頁視圖中顯示優先級 |
| `webview.showCheckbox` | `true` | 是否在網頁視圖中顯示複選框 |
| `webview.showNestedTaskCount` | `false` | 是否在網頁視圖中顯示嵌套任務計數指示器（如 0/10） |
| `webview.showTaskDetails` | `false` | 為 `true` 時，在網頁視圖底部顯示選定任務的詳細信息 |
| `webview.notificationsEnabled` | `false` | 為 `true` 時，在網頁視圖中顯示操作後的通知（如任務完成） |
| `webview.fontSize` | `"15px"` | 網頁視圖中的字體大小（CSS 單位） |
| `webview.fontFamily` | `"..."` | 網頁視圖中的字體系列（CSS 單位） |
| `webview.lineHeight` | `1.4` | 網頁視圖中的行高 |
| `webview.padding` | `"2px"` | 網頁視圖中的上下內邊距（CSS 單位） |
| `webview.indentSize` | `"1.8em"` | 網頁視圖中嵌套元素的視覺縮進 |
| `webview.customCheckboxEnabled` | `true` | 是否使用自定義樣式元素渲染複選框（而非原生輸入元素） |
| `webview.autoShowSuggest` | `true` | 輸入時顯示自動完成（禁用時可通過 `Ctrl+Space` 調用） |
| `webview.focusFilterInputOnClick` | `true` | 點擊（選擇）任務後將焦點放在過濾輸入框上 |
| `webview.customCSSPath` | `""` | 網頁視圖自定義 CSS 的絕對路徑 |
| `webview.tagStyles` | `{}` | 為網頁視圖中的任何標籤設置不同的顏色 |

### 文件設置

| 設置 | 默認值 | 說明 |
|------|--------|------|
| `defaultFile` | `""` | 當沒有匹配 `todomd.activatePattern` 的編輯器打開時，樹狀視圖或命令使用的文件的絕對路徑。支持 `${workspaceFolder}` 變量 |
| `defaultArchiveFile` | `""` | 所有歸檔任務將被移動到的文件的絕對路徑。支持 `${workspaceFolder}` 變量 |
| `defaultSomedayFile` | `""` | 用作「某日」文件的文件的絕對路徑 |
| `activatePattern` | `"**/{todo,someday,todo.archive}.md"` | 選擇擴展將操作的文件。使用 Glob 語法 |

### 行為設置

| 設置 | 默認值 | 說明 |
|------|--------|------|
| `durationIncludeSeconds` | `false` | 啟用時，持續時間（編輯器、懸停）包括秒 |
| `autoArchiveTasks` | `false` | 啟用時，將任務移動到歸檔文件（完成時） |
| `confirmTaskDelete` | `"always"` | 從樹狀視圖或網頁視圖中刪除任務時顯示確認 |
| `getNextNumberOfTasks` | `5` | `getFewNextTasks` 命令返回的任務數量 |
| `tabSize` | `4` | 當無法猜測縮進時用於解析嵌套任務的數字（文件未在編輯器中打開） |

### 排序設置

| 設置 | 默認值 | 說明 |
|------|--------|------|
| `sortTagsView` | `"alphabetic"` | 標籤樹狀視圖排序方式 |
| `sortProjectsView` | `"alphabetic"` | 項目樹狀視圖排序方式 |
| `sortContextsView` | `"alphabetic"` | 上下文樹狀視圖排序方式 |
| `sortNestedTasks` | `"default"` | 樹狀視圖中嵌套任務的排序方式 |

### 自動完成設置

| 設置 | 默認值 | 說明 |
|------|--------|------|
| `suggestItems` | `{}` | 此擴展只會自動完成位於單個文件中的標籤/項目/上下文。此設置允許在所有文件中添加項目及其描述（Markdown），其中擴展是活動的。範例：`#tag`、`+project`、`@context` |

### 顯示設置

| 設置 | 默認值 | 說明 |
|------|--------|------|
| `counterBadgeEnabled` | `false` | 顯示小徽章以顯示標籤/項目/上下文在活動文檔中出現的次數 |
| `progressChartEnabled` | `true` | 是否在編輯器中顯示嵌套任務裝飾（餅圖） |
| `progressBackground` | `"#c6cdd3"` | 編輯器中嵌套任務進度（餅圖）背景顏色 |
| `progressForeground` | `"#0077AA"` | 編輯器中嵌套任務進度（餅圖）前景顏色 |
| `completedStrikeThrough` | `true` | 在編輯器中對已完成的任務顯示刪除線文字裝飾 |

### 狀態欄設置

| 設置 | 默認值 | 說明 |
|------|--------|------|
| `mainStatusBarItem` | `{...}` | 配置主狀態欄項目的外觀/行為（顯示下一個完成任務） |
| `progressStatusBarItem` | `{...}` | 配置進度狀態欄項目的外觀/行為（當活動文本編輯器匹配 `todomd.activatePattern` 時顯示），文本格式：`1/3 33%` |

### 日期設置

| 設置 | 默認值 | 說明 |
|------|--------|------|
| `addCreationDate` | `false` | 創建任務時添加創建日期：`{cr:2020-04-30}` |
| `completionDateIncludeDate` | `true` | 完成任務時是否包含日期：`{cm}` vs `{cm:2020-04-30}` |
| `completionDateIncludeTime` | `false` | 完成任務時添加日期和時間：`{cm:2020-04-30T09:11:17}` |
| `creationDateIncludeTime` | `false` | 創建任務時添加日期和時間：`{cr:2020-04-30T09:11:17}` |
| `closestDueDateIncludeWeekday` | `false` | 啟用時，編輯器裝飾顯示到期日期的天數添加星期幾的名稱 |
| `autoBumpRecurringOverdueDate` | `false` | 完成過期重複任務時，將起始日期替換為今天的日期 |
| `setDueDateThisWeekDay` | `"Friday"` | 使用設置截止日期命令或建議 `SET_DUE_THIS_WEEK` 時的週日 |
| `setDueDateNextWeekDay` | `"Friday"` | 使用設置截止日期命令或建議 `SET_DUE_NEXT_WEEK` 時的週日 |

### 樹狀視圖設置

| 設置 | 默認值 | 說明 |
|------|--------|------|
| `treeView.showBadge` | `true` | 是否顯示樹狀視圖容器的到期任務計數徽章 |
| `treeView.useVscodeCheckboxApi` | `true` | 勾選時，將使用 vscode api 顯示複選框 |
| `savedFilters` | `[]` | 應用過濾器時可以選擇的過濾器 |
| `treeViews` | `[]` | 添加更多樹狀視圖，具有預定義的過濾器 |

### 標籤設置

| 設置 | 默認值 | 說明 |
|------|--------|------|
| `labelDueSymbol` | `"📗 "` | 到期任務的前綴（樹狀視圖、通知、對話框、快速選擇） |
| `labelNotDueSymbol` | `"📅 "` | 未到期任務的前綴（樹狀視圖、通知、對話框、快速選擇） |
| `labelOverdueSymbol` | `"📕 "` | 過期任務的前綴（樹狀視圖、通知、對話框、快速選擇） |
| `labelInvalidDueSymbol` | `"🟣 "` | 無效到期日期任務的前綴（樹狀視圖、通知、對話框、快速選擇） |
| `labelFavorite` | `" ❤️ "` | 當任務具有收藏 `{f}` 特殊標籤時顯示的標籤（樹狀視圖、通知、對話框、快速選擇） |
| `labelShowItems` | `true` | 在標籤中顯示項目/標籤/上下文（樹狀視圖、通知、對話框、快速選擇） |
| `useBoldTextInLabels` | `true` | 在標籤中以粗體顯示項目/標籤/上下文 |

### 其他設置

| 設置 | 默認值 | 說明 |
|------|--------|------|
| `commentFormat` | `{"start":"# ", "end":""}` | 選擇註釋符號（僅在行首有效） |
| `decorations` | `{...}` | 高級文本編輯器裝飾調整（文檔） |
| `isDev` | `false` | 模擬開發模式（僅供擴展作者使用） |

---

## 顏色配置

可以在 `settings.json` 的 `workbench.colorCustomizations` 部分指定以下 **21 種顏色**：

### 任務狀態顏色

| 顏色 | 深色主題 | 淺色主題 | 高對比度 | 說明 |
|------|----------|----------|----------|------|
| `todomd.favoriteTaskBackground` | `#f62caf18` | `#f62caf18` | `#f62caf18` | 收藏任務 `{f}` 的整行背景顏色 |
| `todomd.commentForeground` | `#b4b4b4` | `#b4b4b4` | `#b4b4b4` | 註釋 `# Comment` 的顏色 |
| `todomd.notDueForeground` | `#c3ccfc` | `#7e8081` | `#c3ccfc` | 未到期 |
| `todomd.dueForeground` | `#35c03a` | `#01c208` | `#37df3d` | 到期 |
| `todomd.overdueForeground` | `#d44343` | `#d44343` | `#f64f4f` | 過期 |
| `todomd.invalidDueDateForeground` | `#ffffff` | `#ffffff` | `#ffffff` | 無效截止日期（格式錯誤或無效日期）的前景顏色 |
| `todomd.invalidDueDateBackground` | `#7284eb` | `#7284eb` | `#7284eb` | 無效截止日期（格式錯誤或無效日期）的背景顏色 |

### 優先級顏色

| 顏色 | 深色主題 | 淺色主題 | 高對比度 | 說明 |
|------|----------|----------|----------|------|
| `todomd.priorityAForeground` | `#ec4f47` | `#ec4f47` | `#ec4f47` | `(A)` |
| `todomd.priorityBForeground` | `#fd9f9a` | `#fd9f9a` | `#fd9f9a` | `(B)` |
| `todomd.priorityCForeground` | `#ffb039` | `#ffb648` | `#ffb648` | `(C)` |
| `todomd.priorityDForeground` | `#e2cb00` | `#f1d900` | `#f1d900` | `(D)` |
| `todomd.priorityEForeground` | `#97c500` | `#ace000` | `#ace000` | `(E)` |
| `todomd.priorityFForeground` | `#00cfad` | `#00cfad` | `#00cfad` | `(F)` |

### 元素顏色

| 顏色 | 深色主題 | 淺色主題 | 高對比度 | 說明 |
|------|----------|----------|----------|------|
| `todomd.tagForeground` | `#1abaff` | `#029cdf` | `#1abaff` | 標籤顏色 `#Tag` |
| `todomd.contextForeground` | `#7284eb` | `#7284eb` | `#7284eb` | 上下文顏色 `@Context` |
| `todomd.specialTagForeground` | `#c3ccfc` | `#7e8081` | `#c3ccfc` | 特殊標籤顏色 `{h}` |
| `todomd.projectForeground` | `#36cc9a` | `#36cc9a` | `#36cc9a` | 項目顏色 `+Project` |

### 裝飾顏色

| 顏色 | 深色主題 | 淺色主題 | 高對比度 | 說明 |
|------|----------|----------|----------|------|
| `todomd.nestedTasksCountBackground` | `#e0d971` | `#f7f3c099` | `#e0d971` | 嵌套任務計數器編輯器裝飾背景 |
| `todomd.nestedTasksCountForeground` | `#000000` | `#000000` | `#000000` | 嵌套任務計數器編輯器裝飾前景 |
| `todomd.nestedTasksCountBorder` | `#fff0` | `#dfd987bd` | `#fff0` | 嵌套任務計數器編輯器裝飾邊框 |
| `todomd.treeViewCompletedTaskIcon` | `#7cc54b` | `#7cc54b` | `#7cc54b` | 樹狀視圖中已完成任務圖標的顏色 |

### 配置範例

```json
{
  "workbench.colorCustomizations": {
    "todomd.priorityAForeground": "#ff0000",
    "todomd.tagForeground": "#00ff00",
    "todomd.dueForeground": "#0000ff"
  }
}
```

---

## 相關資源

### 官方文檔

- **GitHub 倉庫**：https://github.com/usernamehw/vscode-todo-md
- **詳細文檔**：https://github.com/usernamehw/vscode-todo-md/tree/master/docs/docs.md

### 上游 VS Code 問題請求

請為以下上游 VS Code 問題投票，以改善擴展體驗：

1. [#97190](https://github.com/microsoft/vscode/issues/97190) - 為自定義樹狀視圖提供更豐富（可選）的 UI
2. [#32813](https://github.com/microsoft/vscode/issues/32813) - 程式訪問主題的顏色
3. [#115365](https://github.com/microsoft/vscode/issues/115365) - 允許 TreeItem.label 支持 MarkdownString
4. [#21611](https://github.com/microsoft/vscode/issues/21611) - 添加總是顯示基於詞彙的建議的選項
5. [#85682](https://github.com/microsoft/vscode/issues/85682) - 編輯器內設置的 API
6. [#32856](https://github.com/microsoft/vscode/issues/32856) - 行內文字裝飾破壞了單詞包裝
7. [#25633](https://github.com/microsoft/vscode/issues/25633) - 完成設置中的顏色鍵時，填充當前值
8. [#5455](https://github.com/microsoft/vscode/issues/5455) - 在 Gutter 中的 OnClick 事件

---

## 使用範例

### 基本任務

```markdown
- [ ] (A) 完成項目文檔 +Project @work #urgent {due:2024-12-31}
- [ ] (B) 修復 Bug #123 +Project @work #bug
- [x] (C) 更新 README +Project @home {cm:2024-01-15}
```

### 重複任務

```markdown
- [ ] (A) 每週團隊會議 +Project @work {due:monday}
- [ ] (B) 每月報告 +Project @work {due:2024-01-01|e1m}
```

### 嵌套任務

```markdown
- [ ] (A) 主任務 +Project
  - [ ] 子任務 1
  - [x] 子任務 2 {cm:2024-01-15}
    - [ ] 子子任務
```

### 計數任務

```markdown
- [ ] (B) 完成 3 次練習 {count:0/3} #practice
```

### 收藏任務

```markdown
- [ ] (A) 重要任務 {f} +Important #priority
```

---

**最後更新**：2024年1月
