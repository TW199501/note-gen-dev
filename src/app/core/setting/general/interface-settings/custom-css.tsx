'use client'

import { useTranslations } from 'next-intl'
import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions } from '@/components/ui/item'
import { Code } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import useSettingStore from '@/stores/setting'
import { useState, useEffect } from 'react'

export function CustomCssSettings() {
  const t = useTranslations('settings.general.interface')
  const { customCss, setCustomCss } = useSettingStore()
  const [open, setOpen] = useState(false)
  const [cssValue, setCssValue] = useState(customCss || '')

  // 同步 store 中的值到本地状态
  useEffect(() => {
    setCssValue(customCss || '')
  }, [customCss])

  const handleSave = async () => {
    await setCustomCss(cssValue)
    setOpen(false)
  }

  const handleCancel = () => {
    setCssValue(customCss || '')
    setOpen(false)
  }

  return (
    <>
      <Item variant="outline">
        <ItemMedia variant="icon"><Code className="size-4" /></ItemMedia>
        <ItemContent>
          <ItemTitle>{t('customCss.title')}</ItemTitle>
          <ItemDescription>{t('customCss.desc')}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            {t('customCss.button')}
          </Button>
        </ItemActions>
      </Item>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{t('customCss.dialogTitle')}</DialogTitle>
            <DialogDescription>{t('customCss.dialogDesc')}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              value={cssValue}
              onChange={(e) => setCssValue(e.target.value)}
              placeholder={t('customCss.placeholder')}
              className="min-h-[400px] font-mono text-sm"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel}>
              {t('customCss.cancel')}
            </Button>
            <Button onClick={handleSave}>
              {t('customCss.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
