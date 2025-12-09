import { Button } from "@/components/ui/button";
import useArticleStore from "@/stores/article";
import useVectorStore from "@/stores/vector";
import { Database, DatabaseZap, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function VectorCalc() {
    const {
        vectorCalcProgress,
        isVectorCalculating,
        executeVectorCalculation,
        pendingVectorContent
    } = useArticleStore()
    const { isVectorDbEnabled, setVectorDbEnabled } = useVectorStore()
    const t = useTranslations('article.footer.vectorCalc')
    const router = useRouter()
    const [displayProgress, setDisplayProgress] = useState(0)

    // 平滑更新进度显示
    useEffect(() => {
        const interval = setInterval(() => {
            setDisplayProgress(prev => {
                const diff = vectorCalcProgress - prev
                if (Math.abs(diff) < 0.1) return vectorCalcProgress
                return prev + diff * 0.1
            })
        }, 16) // 60fps

        return () => clearInterval(interval)
    }, [vectorCalcProgress])

    // 计算背景色（根据进度从透明到主题色）
    const getBackgroundStyle = () => {
        const opacity = Math.min(displayProgress / 100, 1)
        return {
            background: `linear-gradient(to right, hsl(var(--primary) / ${opacity * 0.2}) ${displayProgress}%, transparent ${displayProgress}%)`
        }
    }

    const handleClick = async () => {
        // 如果向量數據庫未啟用，跳轉到設置頁面
        if (!isVectorDbEnabled) {
            router.push('/core/setting/rag')
            return
        }

        // 如果已啟用且有待計算內容，執行計算
        if (!isVectorCalculating && pendingVectorContent) {
            executeVectorCalculation()
        }
    }

    // 根据状态选择图标
    const getIcon = () => {
        // 如果向量數據庫未啟用，顯示禁用狀態的圖標（使用更明顯的樣式）
        if (!isVectorDbEnabled) {
            return <Database className="!size-3.5 opacity-60 text-muted-foreground" />
        }

        if (isVectorCalculating) {
            // 计算中：旋转的加载图标
            return <Loader2 className="!size-3.5 animate-spin" />
        } else if (pendingVectorContent) {
            // 待计算：带闪电的数据库图标
            return <DatabaseZap className="!size-3.5" />
        } else {
            // 已计算：普通数据库图标
            return <Database className="!size-3.5" />
        }
    }

    // 根据状态生成tooltip文本
    const getTooltipText = () => {
        // 如果向量數據庫未啟用，提示用戶啟用
        if (!isVectorDbEnabled) {
            return t('disabled')
        }

        if (isVectorCalculating) {
            return t('calculating')
        } else if (pendingVectorContent) {
            return t('pending', { progress: Math.round(displayProgress) })
        } else {
            return t('synced')
        }
    }

    return (
        <Button
            variant="ghost"
            size="sm"
            className="h-5 px-1 text-xs relative overflow-hidden"
            onClick={handleClick}
            disabled={isVectorDbEnabled && (isVectorCalculating || !pendingVectorContent)}
            title={!isVectorDbEnabled ? t('disabledTooltip') : `${t('tooltip')} - ${getTooltipText()}`}
        >
            {isVectorDbEnabled && (
                <div
                    className="absolute inset-0 transition-all duration-100"
                    style={getBackgroundStyle()}
                />
            )}
            <div className="relative flex items-center">
                {getIcon()}
            </div>
        </Button>
    )
}
