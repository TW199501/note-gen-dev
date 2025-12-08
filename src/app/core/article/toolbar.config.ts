import { isMobileDevice } from '@/lib/check'
import emitter from '@/lib/emitter'

export const createToolbarConfig = (t: any) => {
  let config = [
    { name: 'undo', tipPosition: 's' },
    { name: 'redo', tipPosition: 's' },
    '|',
    {
      name: 'mark',
      tipPosition: 's',
      tip: t('toolbar.mark.tooltip'),
      className: 'right',
      icon: '<svg><use xlink:href="#vditor-icon-mark"></svg>',
      click: () => emitter.emit('toolbar-mark'),
    },
    {
      name: 'continue',
      tipPosition: 's',
      tip: t('toolbar.continue.tooltip'),
      className: 'right',
      icon: '<svg><use xlink:href="#vditor-icon-list-plus"></svg>',
      click: () => emitter.emit('toolbar-continue'),
    },
    {
      name: 'translation',
      tipPosition: 's',
      tip: t('toolbar.translation.tooltip'),
      className: 'right',
      icon: '<svg><use xlink:href="#vditor-icon-translation"></svg>',
      click: () => emitter.emit('toolbar-translation'),
    },
    '|',
    { name: 'headings', tipPosition: 's', className: 'bottom' },
    { name: 'bold', tipPosition: 's' },
    { name: 'italic', tipPosition: 's' },
    { name: 'strike', tipPosition: 's' },
    '|',
    { name: 'line', tipPosition: 's' },
    { name: 'quote', tipPosition: 's' },
    { name: 'list', tipPosition: 's' },
    { name: 'ordered-list', tipPosition: 's' },
    { name: 'check', tipPosition: 's' },
    { name: 'code', tipPosition: 's' },
    { name: 'inline-code', tipPosition: 's' },
    { name: 'upload', tipPosition: 's' },
    { name: 'link', tipPosition: 's' },
    { name: 'table', tipPosition: 's' },
    '|',
    { name: 'edit-mode', tipPosition: 's', className: 'bottom edit-mode-button' },
    { name: 'preview', tipPosition: 's' },
    { name: 'outline', tipPosition: 's' },
  ]

  if (isMobileDevice()) {
    config = config.slice(0, 12).filter((item) => item !== '|')
  }

  return config
}