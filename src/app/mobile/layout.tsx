'use client'

import { ThemeProvider } from "@/components/theme-provider"
import useSettingStore from "@/stores/setting"
import { useEffect } from "react";
import { initAllDatabases } from "@/db"
import dayjs from "dayjs"
import { useI18n } from "@/hooks/useI18n"
import useVectorStore from "@/stores/vector"
import { AppFootbar } from "@/components/app-footbar"
import { TooltipProvider } from "@/components/ui/tooltip";
import './mobile-styles.scss'
import useImageStore from "@/stores/imageHosting";
import { initMcp } from "@/lib/mcp/init"
// import { reportAppStart } from "@/lib/event-report" // 已移除：UpgradeLink 服務已不可用

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { initSettingData } = useSettingStore()
  const { initMainHosting } = useImageStore()
  const { currentLocale } = useI18n()
  useEffect(() => {
    initSettingData()
    initMainHosting()
    initAllDatabases()
    initMcp()
    // 上报应用启动事件 - 已移除：UpgradeLink 服務已不可用
    // reportAppStart()
  }, [])

  const { initVectorDb } = useVectorStore()
  
  // 初始化向量数据库
  useEffect(() => {
    initVectorDb()
  }, [])

  // 動態設置 dayjs 語言
  useEffect(() => {
    const setDayjsLocale = async () => {
      try {
        switch (currentLocale) {
          case 'zh':
            const zh = await import('dayjs/locale/zh');
            dayjs.locale(zh.default);
            break;
          case 'zh-TW':
            const zhTW = await import('dayjs/locale/zh-tw');
            dayjs.locale(zhTW.default);
            break;
          case 'en':
            const en = await import('dayjs/locale/en');
            dayjs.locale(en.default);
            break;
          case 'ja':
            const ja = await import('dayjs/locale/ja');
            dayjs.locale(ja.default);
            break;
          case 'pt-BR':
            const ptBR = await import('dayjs/locale/pt-br');
            dayjs.locale(ptBR.default);
            break;
          default:
            // 默認使用英文
            const enDefault = await import('dayjs/locale/en');
            dayjs.locale(enDefault.default);
            break;
        }
      } catch (error) {
        console.error('Failed to load dayjs locale:', error);
        // 如果加載失敗，使用默認語言
        dayjs.locale('en');
      }
    };
    
    setDayjsLocale();
  }, [currentLocale])

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TooltipProvider>
        <div className="flex flex-col h-full">
          <main className="flex flex-1 w-full overflow-hidden">
            {children}
          </main>
          <AppFootbar />
        </div>
      </TooltipProvider>
    </ThemeProvider>
  );
}
