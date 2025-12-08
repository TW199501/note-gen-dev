'use client'

import { ThemeProvider } from "@/components/theme-provider"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import useSettingStore from "@/stores/setting"
import { useEffect, useState } from "react";
import { initAllDatabases } from "@/db"
import dayjs from "dayjs"
import { useI18n } from "@/hooks/useI18n"
import useVectorStore from "@/stores/vector"
import useImageStore from "@/stores/imageHosting"
import useShortcutStore from "@/stores/shortcut"
import initQuickRecordText from "@/lib/shortcut/quick-record-text"
import { useRouter } from "next/navigation"
import initShowWindow from "@/lib/shortcut/show-window"
import { initMcp } from "@/lib/mcp/init"
import { SearchDialog } from "@/components/search-dialog"
// import { reportAppStart } from "@/lib/event-report" // 已移除：UpgradeLink 服務已不可用

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { initSettingData, uiScale, customCss } = useSettingStore()
  const { initMainHosting } = useImageStore()
  const { currentLocale } = useI18n()
  const { initShortcut } = useShortcutStore()
  const { initVectorDb } = useVectorStore()
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    initSettingData()
    initMainHosting()
    initAllDatabases()
    initShortcut()
    initVectorDb()
    initQuickRecordText(router)
    initShowWindow()
    initMcp()
    // 上报应用启动事件 - 已移除：UpgradeLink 服務已不可用
    // reportAppStart()
  }, [])

  // 应用界面缩放
  useEffect(() => {
    if (uiScale && uiScale !== 100) {
      document.documentElement.style.fontSize = `${uiScale}%`
    }
  }, [uiScale])

  // 应用自定义 CSS
  useEffect(() => {
    if (customCss) {
      let styleElement = document.getElementById('custom-css-style')
      if (!styleElement) {
        styleElement = document.createElement('style')
        styleElement.id = 'custom-css-style'
        document.head.appendChild(styleElement)
      }
      styleElement.textContent = customCss
    }
  }, [customCss])

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

  // 禁用浏览器后退快捷键（Backspace）和添加搜索快捷键（Cmd/Ctrl+F）
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 搜索快捷键：Cmd+F (macOS) 或 Ctrl+F (Windows/Linux)
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault()
        setSearchOpen(true)
        return
      }

      // 如果按下 Backspace 键，且不在可编辑元素中
      if (e.key === 'Backspace') {
        const target = e.target as HTMLElement
        const isEditable = 
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable ||
          target.getAttribute('contenteditable') === 'true'
        
        // 如果在可编辑元素中，允许正常删除
        if (isEditable) {
          return
        }
        
        // 否则阻止默认的后退行为
        e.preventDefault()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <AppSidebar onSearchClick={() => setSearchOpen(true)} />
        <SidebarInset>
          <main className="flex flex-1 flex-col overflow-hidden w-[calc(100vw-48px)]">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </ThemeProvider>
  );
}
