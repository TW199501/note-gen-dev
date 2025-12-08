"use client"
import { Send, Square } from "lucide-react"
import useSettingStore, { GenTemplate, GenTemplateRange } from "@/stores/setting"
import useChatStore from "@/stores/chat"
import useTagStore from "@/stores/tag"
import useMarkStore from "@/stores/mark"
import { fetchAiStream } from "@/lib/ai"
import { convertImage } from "@/lib/utils"
import { TooltipButton } from "@/components/tooltip-button"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
    Tabs,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useState, useImperativeHandle, forwardRef, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Store } from "@tauri-apps/plugin-store"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation";
import dayjs, { Dayjs } from "dayjs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { useTranslations } from "next-intl"

interface MarkGenProps {
    inputValue?: string;
}

export const MarkGen = forwardRef<{ openGen: () => void }, MarkGenProps>(({ inputValue }, ref) => {
    const [open, setOpen] = useState(false)
    const { primaryModel } = useSettingStore()
    const { currentTagId } = useTagStore()
    const { insert, loading, setLoading, saveChat, locale } = useChatStore()
    const { fetchMarks, marks } = useMarkStore()
    const [tab, setTab] = useState('0')
    const [genTemplate, setGenTemplate] = useState<GenTemplate[]>([])
    const router = useRouter()
    const abortControllerRef = useRef<AbortController | null>(null)
    const [isRemoveThinking, setIsRemoveThinking] = useState(true)
    const t = useTranslations('record.chat.note')

    async function initGenTemplates() {
        const store = await Store.load('store.json')
        const template = await store.get<GenTemplate[]>('templateList') || []
        setGenTemplate(template)
    }

    useImperativeHandle(ref, () => ({
        openGen
    }))

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!open) return
            if (e.key === 'Enter' && !e.isComposing) {
                e.preventDefault()
                handleGen()
            } else if (e.key === 'Escape') {
                e.preventDefault()
                setOpen(false)
            } else if (e.key === 'Escape' && loading) {
                e.preventDefault()
                terminateChat()
            }
        }

        setTimeout(() => {
            window.addEventListener('keydown', handleKeyDown)
        }, 500);
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [open, loading])

    function terminateChat() {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
            abortControllerRef.current = null
            setLoading(false)
        }
    }

    function openGen() {
        setOpen(true)
        initGenTemplates()
    }

    async function handleGen() {
        setOpen(false)
        if (!primaryModel) return
        setLoading(true)
        const message = await insert({
            tagId: currentTagId,
            role: 'system',
            content: '',
            type: 'note',
            inserted: false,
            image: undefined,
        })
        if (!message) return
        await fetchMarks()
        const range = genTemplate.find(item => item.id === tab)?.range
        let subtractDate: Dayjs
        switch (range) {
            case GenTemplateRange.All:
                subtractDate = dayjs().subtract(99, 'year')
                break
            case GenTemplateRange.Today:
                subtractDate = dayjs().subtract(1, 'day')
                break
            case GenTemplateRange.Week:
                subtractDate = dayjs().subtract(1, 'week')
                break
            case GenTemplateRange.Month:
                subtractDate = dayjs().subtract(1, 'month')
                break
            case GenTemplateRange.ThreeMonth:
                subtractDate = dayjs().subtract(3, 'month')
                break
            case GenTemplateRange.Year:
                subtractDate = dayjs().subtract(1, 'year')
                break
            default:
                subtractDate = dayjs().subtract(99, 'year')
                break
        };
        const marksByRange = marks.filter(item => dayjs(item.createdAt).isAfter(subtractDate))
        const scanMarks = marksByRange.filter(item => item.type === 'scan')
        const textMarks = marksByRange.filter(item => item.type === 'text').map(item => {
            if (!item.content) return item
            if (isRemoveThinking) {
                item.content = item.content.replace(/<thinking>[\s\S]*?<thinking>/g, '');
            }
            return item
        })
        const imageMarks = marksByRange.filter(item => item.type === 'image')
        const linkMarks = marksByRange.filter(item => item.type === 'link')
        const fileMarks = marksByRange.filter(item => item.type === 'file')
        for (const image of imageMarks) {
            if (!image.url.includes('http')) {
                image.url = await convertImage(`/image/${image.url}`)
            }
        }
        const request_content = `
      ${t('scanMarksIntro')}
      ${scanMarks.map((item, index) => t('markItem', {
            index: index + 1,
            content: item.content,
            date: dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
        })).join(';\n\n')}。
      ${t('textMarksIntro')}
      ${textMarks.map((item, index) => t('markItem', {
            index: index + 1,
            content: item.content,
            date: dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
        })).join(';\n\n')}。
      ${t('imageMarksIntro')}
      ${imageMarks.map(item => `
        ${t('imageDesc', { content: item.content })}
        ${t('imageUrl', { url: item.url })}
      `).join(';\n\n')}。
      ${t('linkMarksIntro')}
      ${linkMarks.map((item, index) => t('linkItem', {
            index: index + 1,
            title: item.desc,
            url: item.url,
            content: item.content,
            date: dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')
        })).join(';\n\n')}。
      ${t('fileMarksIntro')}
      ${fileMarks.map(item => `
        ${t('fileContent', { content: item.content })}
      `).join(';\n\n')}。
      ---
      ${inputValue ? t('meetRequirement', { requirement: inputValue }) : ''}
      ${t('noRecordsMessage')}
      ${t('formatRequirements')}
      - ${t('useLanguage', { locale })}
      - ${t('useMarkdown')}
      - ${t('ensureHeading')}
      - ${t('correctOrder')}
      - ${t('referenceLinks')}
        ## ${t('referenceLinksTitle')}
        ${t('referenceLinkItem', { index: 1, title: t('linkTitle') + '1', url: t('linkUrl') + '1' })}
        ${t('referenceLinkItem', { index: 2, title: t('linkTitle') + '2', url: t('linkUrl') + '2' })}
      
      ${imageMarks.length > 0 ?
                `- ${t('imagePlacement')}`
                : ''
            }
      ${genTemplate.find(item => item.id === tab)?.content}
    `
        // 先保存空消息，然后通过流式请求更新
        await saveChat({
            ...message,
            content: '',
        }, true)

        // 创建新的 AbortController 用于终止请求
        abortControllerRef.current = new AbortController()
        const signal = abortControllerRef.current.signal

        // 使用流式方式获取AI结果
        let cache_content = '';
        try {
            await fetchAiStream(request_content, async (content) => {
                cache_content = content
                // 每次收到流式内容时更新消息
                await saveChat({
                    ...message,
                    content: content,
                }, false)
            }, signal)
        } catch (error: any) {
            // 如果不是中止错误，则记录错误信息
            if (error.name !== 'AbortError') {
                console.error('Stream error:', error)
            }
        } finally {
            abortControllerRef.current = null
            setLoading(false)
            const cleanedContent = cache_content.replace(/<thinking>[\s\S]*?<thinking>/g, '');
            await saveChat({
                ...message,
                content: cleanedContent
            }, true)
        }
    }

    function handleSetting() {
        router.push('/core/setting/template');
    }

    const handleStop = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }
    }

    return loading ?
        <TooltipButton
            size="sm"
            variant="destructive"
            icon={<Square />}
            tooltipText={t('cancel')}
            onClick={handleStop}
        /> :
        <AlertDialog onOpenChange={openGen} open={open}>
            <AlertDialogTrigger className="relative" asChild>
                <TooltipButton
                    size="sm"
                    variant="default"
                    icon={<Send />}
                    tooltipText={t('organize')}
                />
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{t('organizeAs')}</AlertDialogTitle>
                    <Tabs defaultValue={tab} onValueChange={value => setTab(value)}>
                        <TabsList>
                            {
                                genTemplate.map(item => (
                                    <TabsTrigger value={item.id} key={item.id}>{item.title}</TabsTrigger>
                                ))
                            }
                        </TabsList>
                    </Tabs>
                </AlertDialogHeader>
                <div className="flex flex-col gap-4">
                    <div className="space-y-1">
                        <div className="flex items-center justify-between mb-2">
                            <Label htmlFor="name">{t('templateContent')}</Label>
                            <Label>{t('recordRange')}: {genTemplate.find(item => item.id === tab)?.range}</Label>
                        </div>
                        <ScrollArea className="h-32 w-full p-2 rounded-md border">
                            <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                                {genTemplate.find(item => item.id === tab)?.content}
                            </p>
                        </ScrollArea>
                    </div>
                    <div className="flex items-center gap-2">
                        <Checkbox id="remove-thinking" checked={isRemoveThinking} onCheckedChange={(checked) => setIsRemoveThinking(checked === true)} />
                        <Label htmlFor="remove-thinking">{t('filterThinkingContent')}</Label>
                    </div>
                </div>
                <AlertDialogFooter>
                    <Button variant={"ghost"} disabled={loading} onClick={handleSetting}>{t('manageTemplate')}</Button>
                    <Button variant={"outline"} onClick={() => setOpen(false)}>{t('cancel')}</Button>
                    <Button onClick={handleGen}>{t('startOrganize')}</Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
})

MarkGen.displayName = 'MarkGen';
