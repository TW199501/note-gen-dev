// 同步排除配置

export const SYNC_EXCLUDED_FIELDS: string[] = [
  'workspacePath',
  'workspaceHistory',
  'assetsPath',
  'uiScale',
  'contentTextScale',
  'customCss',
  // 安全：排除所有敏感憑證和 token
  'accessToken',              // GitHub Access Token
  'giteeAccessToken',         // Gitee Access Token
  'gitlabAccessToken',        // GitLab Access Token
  'giteaAccessToken',         // Gitea Access Token
  'githubImageAccessToken',   // GitHub Image Hosting Token
  // 其他可能的敏感信息
  'proxy',                    // 代理配置可能包含認證信息
]

// 检查字段是否应该被排除在同步之外
export function shouldExcludeFromSync(fieldName: string): boolean {
  return SYNC_EXCLUDED_FIELDS.includes(fieldName)
}

// 从对象中过滤掉不应该同步的字段
export function filterSyncData<T extends Record<string, any>>(data: T): Partial<T> {
  const filtered: Partial<T> = {}
  
  for (const key in data) {
    if (!shouldExcludeFromSync(key)) {
      filtered[key] = data[key]
    }
  }
  
  return filtered
}

// 合并下载的配置数据，保留本地的排除字段
export function mergeSyncData<T extends Record<string, any>>(
  localData: T,
  remoteData: Partial<T>
): T {
  const merged = { ...remoteData } as T
  
  // 保留本地的排除字段
  for (const field of SYNC_EXCLUDED_FIELDS) {
    if (field in localData) {
      merged[field as keyof T] = localData[field as keyof T]
    }
  }
  
  return merged
}
