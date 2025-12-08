"use client"
import { FileText } from "lucide-react"
import { useTranslations } from "next-intl"

interface RagSourcesProps {
  sources: string[]
}

export function RagSources({ sources }: RagSourcesProps) {
  const t = useTranslations()
  
  if (!sources || sources.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mt-4 text-xs text-muted-foreground">
      <FileText className="size-3" />
      <span>{t('record.chat.ragSources.label')}:</span>
      {sources.map((source, index) => (
        <span key={index} className="inline-flex items-center gap-1 px-2 py-0.5 bg-muted rounded">
          {source}
        </span>
      ))}
    </div>
  )
}
