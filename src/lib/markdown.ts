// 根据 markdown 截取标题
export function extractTitle(content: string) {
  const regex = /^# (.*)/m
  const match = content.match(regex)
  if (match) {
    const res = match[1]
    return res.replace(/[^a-zA-Z0-9\u4e00-\u9fa5\s]/g, '')
  }
  return ''
}

/**
 * 將 Markdown 轉換為純文本，移除語法符號以避免干擾 AI 理解
 * @param markdown Markdown 格式的文本
 * @returns 純文本內容
 */
export function markdownToPlainText(markdown: string): string {
  if (!markdown) return ''
  
  let text = markdown
  
  // 移除代碼塊（```code``` 或 ```language\ncode\n```）
  text = text.replace(/```[\s\S]*?```/g, (match) => {
    // 保留代碼塊內的內容，但移除語法標記
    const codeContent = match.replace(/```[\w]*\n?/g, '').replace(/```/g, '')
    return `[代碼塊]\n${codeContent}\n[/代碼塊]`
  })
  
  // 移除行內代碼（`code`）
  text = text.replace(/`([^`]+)`/g, '$1')
  
  // 移除標題符號（# ## ### 等）
  text = text.replace(/^#{1,6}\s+(.+)$/gm, '$1')
  
  // 移除粗體和斜體（**text** 或 *text*）
  text = text.replace(/\*\*([^*]+)\*\*/g, '$1')
  text = text.replace(/\*([^*]+)\*/g, '$1')
  text = text.replace(/__([^_]+)__/g, '$1')
  text = text.replace(/_([^_]+)_/g, '$1')
  
  // 移除刪除線（~~text~~）
  text = text.replace(/~~([^~]+)~~/g, '$1')
  
  // 移除鏈接，保留文字（[text](url) -> text）
  text = text.replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
  
  // 移除圖片，保留 alt 文字（![alt](url) -> alt）
  text = text.replace(/!\[([^\]]*)\]\([^\)]+\)/g, (match, alt) => alt || '[圖片]')
  
  // 移除引用標記（> text）
  text = text.replace(/^>\s+(.+)$/gm, '$1')
  
  // 移除列表標記（- * + 或 1. 2. 等）
  text = text.replace(/^[\s]*[-*+]\s+(.+)$/gm, '$1')
  text = text.replace(/^\s*\d+\.\s+(.+)$/gm, '$1')
  
  // 移除水平線（--- 或 ***）
  text = text.replace(/^[-*]{3,}$/gm, '')
  
  // 移除表格語法（| col1 | col2 |）
  text = text.replace(/\|/g, ' ')
  text = text.replace(/^[-:\s|]+$/gm, '')
  
  // 清理多餘的空白行
  text = text.replace(/\n{3,}/g, '\n\n')
  
  // 移除首尾空白
  text = text.trim()
  
  return text
}