'use client'
import useSettingStore from "@/stores/setting";
import React, { useEffect, useRef, useState } from 'react';
import { useTheme } from 'next-themes'
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
// DOMPurify 是瀏覽器端庫，需要動態導入
import 'highlight.js/styles/github.min.css';
import './chat.scss';

type ThemeType = 'light' | 'dark' | 'system';

export default function ChatPreview({text}: {text: string, themeReverse?: boolean}) {
  const previewRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme()
  const [mdTheme, setMdTheme] = useState<ThemeType>('light')
  const { codeTheme, contentTextScale } = useSettingStore()
  const [htmlContent, setHtmlContent] = useState<string>('');

  const md = useRef<MarkdownIt | null>(null);
  const dompurifyRef = useRef<any>(null);

  // 動態導入 DOMPurify（僅在客戶端）
  useEffect(() => {
    if (typeof window !== 'undefined' && !dompurifyRef.current) {
      // 動態導入 DOMPurify（僅在客戶端）
      import(/* webpackIgnore: true */ 'dompurify').then((DOMPurify: any) => {
        dompurifyRef.current = DOMPurify;
      }).catch(() => {
        // 如果加載失敗，dompurifyRef.current 保持為 null
        console.warn('Failed to load DOMPurify');
      });
    }
  }, []);

  useEffect(() => {
    hljs.registerLanguage('javascript', javascript);
    hljs.registerLanguage('typescript', typescript);
    hljs.registerLanguage('bash', bash);
    hljs.registerLanguage('json', json);
    hljs.registerLanguage('html', xml);
    hljs.registerLanguage('css', css);
  }, []);
  
  useEffect(() => {
    md.current = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true,
      highlight: function (str, lang): string {
        if (lang && hljs.getLanguage(lang)) {
          try {
            const themeClass = mdTheme === 'dark' ? 'hljs-dark' : 'hljs-light';
            return `<pre class="hljs ${themeClass}"><code>` +
              hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
            '</code></pre>';
          } catch {}
        }
        // 使用通用高亮
        const themeClass = mdTheme === 'dark' ? 'hljs-dark' : 'hljs-light';
        return `<pre class="hljs ${themeClass}"><code>` +
          (md.current ? md.current.utils.escapeHtml(str) : str) +
          '</code></pre>';
      }
    });

    md.current.renderer.rules.link_open = function (tokens: any, idx: any, options: any, env: any, self: any) {
      tokens[idx].attrSet('target', '_blank');
      tokens[idx].attrSet('rel', 'noopener noreferrer');
      return self.renderToken(tokens, idx, options);
    }
    
    if (text) {
      const renderedHtml = md.current.render(text);
      // 使用 DOMPurify 清理 HTML 內容，防止 XSS 攻擊
      if (dompurifyRef.current) {
        const sanitizedHtml = dompurifyRef.current.default.sanitize(renderedHtml, {
          ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr', 'del', 'sub', 'sup'],
          ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'id'],
          ALLOW_DATA_ATTR: false
        });
        setHtmlContent(sanitizedHtml);
      } else {
        // DOMPurify 尚未加載，暫時使用原始 HTML（會在下次渲染時清理）
        setHtmlContent(renderedHtml);
        // 嘗試再次加載
        if (typeof window !== 'undefined') {
          // 動態導入 DOMPurify（僅在客戶端）
          import(/* webpackIgnore: true */ 'dompurify').then((DOMPurify: any) => {
            dompurifyRef.current = DOMPurify;
            const sanitizedHtml = DOMPurify.default.sanitize(renderedHtml, {
              ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr', 'del', 'sub', 'sup'],
              ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'id'],
              ALLOW_DATA_ATTR: false
            });
            setHtmlContent(sanitizedHtml);
          });
        }
      }
    }
  }, [mdTheme, text]);

  // 解析Markdown为HTML - 仅在md实例未更新时处理
  useEffect(() => {
    if (md.current && text) {
      const renderedHtml = md.current.render(text);
      // 使用 DOMPurify 清理 HTML 內容，防止 XSS 攻擊
      if (dompurifyRef.current) {
        const sanitizedHtml = dompurifyRef.current.default.sanitize(renderedHtml, {
          ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr', 'del', 'sub', 'sup'],
          ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'id'],
          ALLOW_DATA_ATTR: false
        });
        setHtmlContent(sanitizedHtml);
      } else {
        // DOMPurify 尚未加載，暫時使用原始 HTML（會在下次渲染時清理）
        setHtmlContent(renderedHtml);
        // 嘗試再次加載
        if (typeof window !== 'undefined') {
          // 動態導入 DOMPurify（僅在客戶端）
          import(/* webpackIgnore: true */ 'dompurify').then((DOMPurify: any) => {
            dompurifyRef.current = DOMPurify;
            const sanitizedHtml = DOMPurify.default.sanitize(renderedHtml, {
              ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr', 'del', 'sub', 'sup'],
              ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'id'],
              ALLOW_DATA_ATTR: false
            });
            setHtmlContent(sanitizedHtml);
          });
        }
      }
    } else if (!text) {
      setHtmlContent('');
    }
  }, [text]);

  useEffect(() => {
    if (theme === 'system') {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setMdTheme('dark')
      } else {
        setMdTheme('light')
      }
    } else {
      setMdTheme(theme as ThemeType)
    }
  }, [theme])

  useEffect(() => {
    // 加载Markdown主题样式
    const link = document.createElement('link');
    link.id = 'markdown-theme-style';
    link.rel = 'stylesheet';
    switch (theme) {
      case 'dark':
        link.href = '/markdown/github-markdown-dark.css';
        break;
      case 'light':
        link.href = '/markdown/github-markdown-light.css';
        break;
      case 'system':
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          link.href = '/markdown/github-markdown-dark.css';
        } else {
          link.href = '/markdown/github-markdown-light.css';
        }
        break;
    }
    
    const existingLink = document.getElementById('markdown-theme-style');
    if (existingLink) document.head.removeChild(existingLink);
    document.head.appendChild(link);

    // 监听系统主题变化
    const matchMedia = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      if (theme === 'system') {
        const themeValue = matchMedia.matches ? 'dark' : 'light'
        setMdTheme(themeValue)
      }
    }
    matchMedia.addEventListener('change', handler)
    return () => {
      matchMedia.removeEventListener('change', handler)
    }
  }, [theme])
  
  // 应用正文文字大小缩放
  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.style.fontSize = `${contentTextScale + 15}%`
    }
  }, [contentTextScale])

  // 根据主题选择样式
  const getThemeClass = () => {
    if (mdTheme === 'dark') {
      return 'markdown-body markdown-dark';
    }
    return 'markdown-body';
  };

  // 应用高亮样式
  const getHighlightStyle = () => {
    return codeTheme || 'github';
  };

  return (
    <div className="flex-1 max-w-[calc(100vw-30px)] md:max-w-[calc(100vw-440px)]">
      <div 
        ref={previewRef}
        className={getThemeClass()}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
        data-highlight-style={getHighlightStyle()}
      />
    </div>
  );
}