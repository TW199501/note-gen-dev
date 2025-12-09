"use client";
import { useEffect, useState, useRef } from "react";
import useArticleStore from "@/stores/article";
import { Clock } from "lucide-react";

export default function VectorTimer() {
    const { isVectorCalculating } = useArticleStore();
    const [elapsedTime, setElapsedTime] = useState(0); // 毫秒
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const prevCalculatingRef = useRef<boolean>(false);

    // 格式化時間顯示 (mm:ss 或 hh:mm:ss)
    const formatTime = (ms: number): string => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        if (hours > 0) {
            return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        const prevCalculating = prevCalculatingRef.current;
        prevCalculatingRef.current = isVectorCalculating;

        // 當從 false 變為 true 時（開始計算）
        if (!prevCalculating && isVectorCalculating) {
            // 重置計時器並開始計時
            setElapsedTime(0);
            startTimeRef.current = Date.now();

            // 清除舊的計時器（如果存在）
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }

            // 開始計時
            intervalRef.current = setInterval(() => {
                if (startTimeRef.current) {
                    const now = Date.now();
                    setElapsedTime(now - startTimeRef.current);
                }
            }, 100); // 每100ms更新一次
        }

        // 當從 true 變為 false 時（停止計算）
        if (prevCalculating && !isVectorCalculating) {
            // 計算並設置最終時間
            if (startTimeRef.current) {
                const finalTime = Date.now() - startTimeRef.current;
                setElapsedTime(finalTime);
                startTimeRef.current = null;
            }
            // 停止計時
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        // 清理函數
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isVectorCalculating]);

    // 只在有計算過或正在計算時顯示
    // 如果正在計算中，立即顯示（即使 elapsedTime 還是 0）
    // 如果計算完成，顯示最終時間（elapsedTime > 0）
    // 如果從未計算過且當前沒有在計算，不顯示
    if (!isVectorCalculating && elapsedTime === 0) {
        return null;
    }

    return (
        <div className="flex items-center gap-1 px-1 text-xs text-muted-foreground">
            <Clock className="!size-3" />
            <span className="font-mono min-w-[3ch]">
                {formatTime(elapsedTime)}
            </span>
        </div>
    );
}
