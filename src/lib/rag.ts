import { readTextFile, readDir, BaseDirectory, DirEntry } from "@tauri-apps/plugin-fs";
import { fetchEmbedding, rerankDocuments, getTranslation } from "./ai";
import {
    upsertVectorDocument,
    deleteVectorDocumentsByFilename,
    getSimilarDocuments,
    initVectorDb
} from "@/db/vector";
import { invoke } from "@tauri-apps/api/core";

// 重新导出initVectorDb，使其可在其他模块中导入
export { initVectorDb };
import { getFilePathOptions, getWorkspacePath } from "./workspace";
import { DirTree } from "@/stores/article";
import { toast } from "@/hooks/use-toast";
import { join } from "@tauri-apps/api/path";
import { Store } from "@tauri-apps/plugin-store";
import { markdownToPlainText } from "./markdown";

/**
 * 文本分块函数，用于将大文本分成小块
 */
export function chunkText(
    text: string,
    chunkSize: number = 1000,
    chunkOverlap: number = 200
): string[] {
    const chunks: string[] = [];

    // 检查文本是否足够长，需要分块
    if (text.length <= chunkSize) {
        chunks.push(text);
        return chunks;
    }

    // 尝试在段落边界进行分块
    const paragraphs = text.split('\n\n');
    let currentChunk = '';

    for (const paragraph of paragraphs) {
        // 如果加上当前段落后超出了块大小，则保存当前块并开始新块
        if (currentChunk.length + paragraph.length + 2 > chunkSize) {
            // 如果当前块非空，保存它
            if (currentChunk.length > 0) {
                chunks.push(currentChunk);
                // 保留重叠部分到新块
                const lastChunkParts = currentChunk.split('\n\n');
                const overlapLength = Math.min(chunkOverlap, currentChunk.length);
                const overlapParts = [];
                let currentLength = 0;

                // 从后向前取段落，直到达到重叠大小
                for (let i = lastChunkParts.length - 1; i >= 0; i--) {
                    const part = lastChunkParts[i];
                    if (currentLength + part.length + 2 <= overlapLength) {
                        overlapParts.unshift(part);
                        currentLength += part.length + 2;
                    } else {
                        break;
                    }
                }

                currentChunk = overlapParts.join('\n\n');
            }

            // 如果单个段落过长，需要强制分割
            if (paragraph.length > chunkSize) {
                // 先尝试按句子分割
                const sentences = paragraph.split(/(?:\.|\?|\!)\s+/);
                let sentenceChunk = '';

                for (const sentence of sentences) {
                    if (sentenceChunk.length + sentence.length > chunkSize) {
                        if (sentenceChunk) {
                            chunks.push(sentenceChunk);
                            // 保留重叠
                            const overlapLength = Math.min(chunkOverlap, sentenceChunk.length);
                            sentenceChunk = sentenceChunk.slice(-overlapLength);
                        }
                    }

                    sentenceChunk += sentence + ' ';
                }

                if (sentenceChunk) {
                    currentChunk += sentenceChunk;
                }
            } else {
                currentChunk += paragraph + '\n\n';
            }
        } else {
            currentChunk += paragraph + '\n\n';
        }
    }

    // 添加最后一个块
    if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
    }

    return chunks;
}

/**
 * 处理单个Markdown文件，计算向量并存储到数据库
 */
export async function processMarkdownFile(
    filePath: string,
    fileContent?: string
): Promise<boolean> {
    try {
        const workspace = await getWorkspacePath()
        let content = ''
        if (workspace.isCustom) {
            content = fileContent || await readTextFile(filePath)
        } else {
            const { path, baseDir } = await getFilePathOptions(filePath)
            content = fileContent || await readTextFile(path, { baseDir })
        }
        const store = await Store.load('store.json')
        const chunkSize = await store.get<number>('ragChunkSize');
        const chunkOverlap = await store.get<number>('ragChunkOverlap');
        const chunks = chunkText(content, chunkSize, chunkOverlap);
        // 文件名（不含路径）
        const filename = filePath.split('/').pop() || filePath;

        // 先删除该文件的旧记录
        await deleteVectorDocumentsByFilename(filename);

        // 处理每个文本块
        // fetchEmbedding 内部使用全局重试计数，确保在 chunk 之间重试计数保持连续
        // 这样在遇到速率限制时，重试计数会持续累积，而不是每个 chunk 都重置
        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];

            // 计算嵌入向量
            // fetchEmbedding 内部会使用全局重试计数，确保跨 chunk 的连续性
            const embedding = await fetchEmbedding(chunk);

            if (!embedding) {
                // 如果獲取嵌入向量失敗，檢查是否是 403 錯誤
                // 403 錯誤通常表示 API Key 問題，應該停止處理
                if (typeof window !== 'undefined') {
                    const lastError = (window as any).__lastEmbeddingError;
                    if (lastError && (lastError.includes('403') || lastError.includes('Forbidden'))) {
                        // 403 錯誤：停止處理並拋出錯誤
                        throw new Error(lastError);
                    }
                }
                console.error(`无法计算文件 ${filename} 第 ${i + 1} 块的向量`);
                continue;
            }

            // 保存到数据库
            await upsertVectorDocument({
                filename,
                chunk_id: i,
                content: chunk,
                embedding: JSON.stringify(embedding),
                updated_at: Date.now()
            });

            // 在同一個文件的多個 chunk 之間添加短暫延遲，避免請求過於頻繁
            if (i < chunks.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 200)); // 200ms 延遲
            }
        }

        return true;
    } catch (error) {
        const errorMsg = await getTranslation('rag.error.processFileFailed', { filePath });
        console.error(errorMsg, error);
        return false;
    }
}

/**
 * 获取工作区目录树
 */
async function getWorkspaceFiles(): Promise<DirTree[]> {
    const workspace = await getWorkspacePath();

    // 递归处理目录的辅助函数
    async function processDirectory(dirPath: string, useCustomPath: boolean): Promise<DirTree[]> {
        let entries: DirEntry[];

        if (useCustomPath) {
            entries = await readDir(dirPath);
        } else {
            entries = await readDir(dirPath, { baseDir: BaseDirectory.AppData });
        }

        const result: DirTree[] = [];

        for (const entry of entries) {
            if (entry.name === '.DS_Store' || entry.name.startsWith('.')) continue;
            if (!entry.isDirectory && !entry.name.endsWith('.md')) continue;

            // 创建DirTree对象
            const item: DirTree = {
                ...entry,
                name: entry.name as string,
                isFile: !entry.isDirectory,
                isDirectory: entry.isDirectory,
                isSymlink: false, // Tauri FS API不直接提供isSymlink
                children: [],
                isLocale: true,
                isEditing: false
            } as DirTree;

            // 如果是目录，递归读取子目录
            if (entry.isDirectory) {
                const childPath = await join(dirPath, entry.name);
                // 递归处理子目录
                item.children = await processDirectory(childPath, useCustomPath);

                // 设置父级关系
                item.children.forEach(child => {
                    child.parent = item;
                });
            }

            result.push(item);
        }

        return result;
    }

    // 开始处理根目录
    const rootPath = workspace.isCustom ? workspace.path : 'article';
    return await processDirectory(rootPath, workspace.isCustom);
}

/**
 * 处理工作区中的所有Markdown文件
 */
export async function processAllMarkdownFiles(): Promise<{
    total: number;
    success: number;
    failed: number;
}> {
    try {
        // 获取工作区中的所有文件
        const fileTree = await getWorkspaceFiles();

        // 统计结果
        const result = {
            total: 0,
            success: 0,
            failed: 0
        };

        // 递归处理文件树
        async function processTree(tree: DirTree[]): Promise<void> {
            for (const item of tree) {
                const dirTree = item as DirTree & { isFile?: boolean; name?: string };
                if (dirTree.isFile && dirTree.name?.endsWith('.md')) {
                    result.total++;
                    // 获取完整路径
                    const filePath = await getFilePath(item);
                    try {
                        const success = await processMarkdownFile(filePath);
                        if (success) {
                            result.success++;
                        } else {
                            result.failed++;
                        }
                    } catch (error: any) {
                        // 如果是 403 錯誤，停止處理並拋出錯誤
                        if (error?.message && (error.message.includes('403') || error.message.includes('Forbidden'))) {
                            throw error;
                        }
                        result.failed++;
                        const errorMsg = await getTranslation('rag.error.processFileFailed', { filePath });
                        console.error(errorMsg, error);
                    }

                    // 在處理每個文件之間添加延遲，避免批量請求過於頻繁觸發速率限制
                    // 延遲 500ms，給 API 服務器一些緩衝時間
                    await new Promise(resolve => setTimeout(resolve, 500));
                }

                // 递归处理子目录
                if (item.children && item.children.length > 0) {
                    await processTree(item.children);
                }
            }
        }
        await processTree(fileTree);
        return result;
    } catch (error: any) {
        const errorMsg = await getTranslation('rag.error.processWorkspaceFailed');
        console.error(errorMsg, error);
        // 如果是 403 錯誤，顯示詳細的錯誤信息
        if (error?.message && (error.message.includes('403') || error.message.includes('Forbidden'))) {
            const title = await getTranslation('rag.error.vectorProcessingFailed');
            toast({
                title,
                description: error.message || await getTranslation('ai.error.embeddingRequestFailed403'),
                variant: 'destructive',
            });
        }
        throw error;
    }
}

/**
 * 根据DirTree项获取完整文件路径
 */
async function getFilePath(item: DirTree): Promise<string> {
    const workspace = await getWorkspacePath();
    const dirTree = item as DirTree & { name?: string };
    let path = dirTree.name || '';
    let parent = item.parent;

    // 构建相对路径
    while (parent) {
        const parentTree = parent as DirTree & { name?: string };
        path = `${parentTree.name || ''}/${path}`;
        parent = parent.parent;
    }

    // 转换为完整路径
    if (workspace.isCustom) {
        return await join(workspace.path, path);
    } else {
        return path; // 返回相对于AppData/article的路径
    }
}

/**
 * 为fuzzy_search准备的搜索项结构
 */
interface SearchItem {
    id?: string;
    desc?: string;
    title?: string;
    article?: string;
    url?: string;
    search_type?: string;
    score?: number;
    matches?: {
        key: string;
        indices: [number, number][];
        value: string;
    }[];
}

/**
 * fuzzy_search返回的结果结构
 */
interface FuzzySearchResult {
    item: SearchItem;
    refindex: number;
    score: number;
    matches: {
        key: string;
        indices: [number, number][];
        value: string;
    }[];
}

/**
 * 从工作区中收集所有Markdown文件内容，用于模糊搜索
 */
async function collectMarkdownContents(): Promise<SearchItem[]> {
    try {
        // 获取工作区中的所有文件
        const fileTree = await getWorkspaceFiles();
        const items: SearchItem[] = [];

        // 递归处理文件树
        async function processTree(tree: DirTree[]): Promise<void> {
            for (const item of tree) {
                const dirTree = item as DirTree & { isFile?: boolean; name?: string };
                if (dirTree.isFile && dirTree.name?.endsWith('.md')) {
                    // 获取完整路径
                    const filePath = await getFilePath(item);

                    try {
                        // 读取文件内容
                        let content = '';
                        const workspace = await getWorkspacePath();
                        if (workspace.isCustom) {
                            content = await readTextFile(filePath);
                        } else {
                            const { path, baseDir } = await getFilePathOptions(filePath);
                            content = await readTextFile(path, { baseDir });
                        }

                        // 创建搜索项
                        const itemName = (item as DirTree & { name?: string }).name || '';
                        items.push({
                            id: filePath,
                            title: itemName,
                            article: content,
                            search_type: 'markdown'
                        });
                    } catch (error) {
                        const errorMsg = await getTranslation('rag.error.readFileFailed', { filePath });
                        console.error(errorMsg, error);
                    }
                }

                // 递归处理子目录
                if (item.children && item.children.length > 0) {
                    await processTree(item.children);
                }
            }
        }

        await processTree(fileTree);
        return items;
    } catch (error) {
        const errorMsg = await getTranslation('rag.error.collectMarkdownFailed');
        console.error(errorMsg, error);
        return [];
    }
}

/**
 * 关键词及其权重类型定义
 */
export interface Keyword {
    text: string;
    weight: number;
}

/**
 * 根据关键词数组获取相关上下文
 * @param keywords 关键词数组，每个元素包含关键词文本和权重
 * @returns 包含上下文文本和引用文件名的对象
 */
export async function getContextForQuery(keywords: Keyword[]): Promise<{ context: string; sources: string[] }> {
    try {
        const store = await Store.load('store.json');
        const resultCount = await store.get<number>('ragResultCount') || 5;
        const similarityThreshold = await store.get<number>('ragSimilarityThreshold') || 0.7;
        // 存储所有相关上下文的结果集
        const allContexts: { filename: string, content: string, score: number, keyword?: string, type?: string }[] = [];

        // 如果没有关键词，返回空结果
        if (!keywords || keywords.length === 0) {
            return { context: '', sources: [] };
        }

        // 将关键词按权重排序，优先考虑权重高的关键词
        const sortedKeywords = [...keywords].sort((a, b) => b.weight - a.weight);

        // 1. 使用逐个关键词进行模糊搜索找到相关文件内容
        try {
            // 收集所有Markdown文件内容
            const items = await collectMarkdownContents();
            // 在循環外獲取翻譯，避免重複調用
            const unnamedFile = await getTranslation('rag.common.unnamedFile');
            if (items.length > 0) {
                // 为每个关键词单独进行搜索
                for (const keyword of sortedKeywords) {
                    // 对每个关键词调用Rust的fuzzy_search函数
                    const fuzzyResults: FuzzySearchResult[] = await invoke('fuzzy_search', {
                        items,
                        query: keyword.text,  // 单独使用每个关键词
                        keys: ['title', 'article'],
                        threshold: 0.3, // 模糊搜索阈值
                        includeScore: true,
                        includeMatches: true
                    });

                    // 处理模糊搜索结果
                    for (const result of fuzzyResults) {
                        if (result.score > 0) {
                            const item = result.item;
                            // 提取匹配的文本片段作为上下文
                            const articleMatches = result.matches.filter(m => m.key === 'article');
                            if (articleMatches.length > 0) {
                                // 使用匹配部分的上下文（周围大约500个字符）
                                const match = articleMatches[0];
                                const content = match.value;

                                // 找到第一个匹配位置的索引
                                let startIdx = 0;
                                let endIdx = content.length;
                                if (match.indices.length > 0) {
                                    const firstMatch = match.indices[0];
                                    startIdx = Math.max(0, firstMatch[0] - 250);
                                    endIdx = Math.min(content.length, firstMatch[1] + 250);
                                }

                                // 使用当前关键词的权重作为得分因子
                                const finalScore = result.score * keyword.weight;

                                const contextSnippet = content.substring(startIdx, endIdx);

                                allContexts.push({
                                    filename: item.title || unnamedFile,
                                    content: contextSnippet,
                                    score: finalScore,
                                    keyword: keyword.text,  // 记录匹配的关键词
                                    type: 'fuzzy'
                                });
                            }
                        }
                    }
                }
            }
        } catch (error) {
            const errorMsg = await getTranslation('rag.error.fuzzySearchFailed');
            console.error(errorMsg, error);
        }

        // 2. 使用向量搜索找到相关文档
        try {
            // 为每个关键词生成向量并执行查询
            for (const keyword of sortedKeywords) {
                // 计算查询文本的向量
                const queryEmbedding = await fetchEmbedding(keyword.text);
                if (queryEmbedding) {
                    // 查询最相关的文档
                    let similarDocs = await getSimilarDocuments(queryEmbedding, resultCount, similarityThreshold);

                    if (similarDocs.length > 0) {
                        // 如果配置了重排序模型，使用它进一步优化结果
                        similarDocs = await rerankDocuments(keyword.text, similarDocs);

                        // 添加到结果集，考虑关键词权重
                        for (const doc of similarDocs) {
                            allContexts.push({
                                filename: doc.filename,
                                content: doc.content,
                                score: (doc.similarity || 0) * keyword.weight, // 用相似度乘以权重作为分数
                                keyword: keyword.text,  // 记录匹配的关键词
                                type: 'vector'
                            });
                        }
                    }
                }
            }
        } catch (error) {
            const errorMsg = await getTranslation('rag.error.vectorSearchFailed');
            console.error(errorMsg, error);
        }

        // 如果没有找到任何相关上下文，返回空结果
        if (allContexts.length === 0) {
            return { context: '', sources: [] };
        }

        // 对结果进行去重（同一文件的同一段落可能被多个关键词匹配）
        const uniqueContexts = [];
        const seen = new Set();

        for (const ctx of allContexts) {
            // 使用文件名和内容前100字符作为标识符
            const identifier = `${ctx.filename}-${ctx.content.substring(0, 100)}`;
            if (!seen.has(identifier)) {
                seen.add(identifier);
                uniqueContexts.push(ctx);
            }
        }

        // 对所有上下文按相关性得分排序
        uniqueContexts.sort((a, b) => b.score - a.score);

        // 限制结果数量
        const finalContexts = uniqueContexts.slice(0, resultCount);

        // 提取唯一的文件名
        const sources = Array.from(new Set(finalContexts.map(ctx => ctx.filename)));

        // 构建最终的上下文字符串，將 Markdown 轉換為純文本以避免干擾 AI
        const filePrefix = await getTranslation('rag.common.filePrefix');
        const context = finalContexts.map(ctx => {
            // 將 Markdown 內容轉換為純文本
            const plainTextContent = markdownToPlainText(ctx.content);
            return `${filePrefix}${ctx.filename}
${plainTextContent}
`;
        }).join('\n---\n\n');

        return { context, sources };
    } catch (error) {
        const errorMsg = await getTranslation('rag.error.getContextFailed');
        console.error(errorMsg, error);
        return { context: '', sources: [] };
    }
}

/**
 * 当文件被更新时处理，更新向量数据库
 */
export async function handleFileUpdate(filename: string, content: string): Promise<void> {
    if (!filename.endsWith('.md')) return;

    try {
        await processMarkdownFile(filename, content);
    } catch (error) {
        const errorMsg = await getTranslation('rag.error.updateVectorFailed', { filename });
        console.error(errorMsg, error);
    }
}

/**
 * 检查是否有嵌入模型可用
 */
export async function checkEmbeddingModelAvailable(): Promise<boolean> {
    try {
        // 尝试计算一个简单文本的向量
        // 使用一個簡單的測試文本，不需要翻譯
        const embedding = await fetchEmbedding('test');
        return !!embedding;
    } catch (error) {
        const errorMsg = await getTranslation('rag.error.embeddingModelCheckFailed');
        console.error(errorMsg, error);
        return false;
    }
}

/**
 * 显示向量处理进度的toast
 */
export async function showVectorProcessingToast(message: string) {
    const title = await getTranslation('rag.toast.vectorDatabaseUpdate');
    toast({
        title,
        description: message,
    });
}
