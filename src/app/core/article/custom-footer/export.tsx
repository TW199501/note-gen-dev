"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { save } from "@tauri-apps/plugin-dialog";
import { writeTextFile, writeFile } from "@tauri-apps/plugin-fs";
import { SquareArrowOutUpRightIcon } from "lucide-react";
import Vditor from "vditor";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useTranslations } from "next-intl";

type ExportFormat = "HTML" | "JSON" | "Markdown" | "PDF";

export default function ExportFormatSelector({editor}: {editor?: Vditor}) {
  const t = useTranslations('article.footer.export');

    const getFileNameFromContent = (content: string): string => {
        const titleMatch = content.match(/^#\s+(.+)$/m);
        if (titleMatch && titleMatch[1]) {
            return titleMatch[1].trim().substring(0, 50); // 限制长度
        }

        // 如果没有标题，使用内容的前20个字符(排除特殊字符)
        const firstLine = content.split('\n')[0] || '';
        const sanitized = firstLine.replace(/[\\/:*?"<>|]/g, '').trim();
        return sanitized.substring(0, 10) || 'untitled';
    };

  const handleFormatSelect = async (format: ExportFormat) => {
    // 获取文件名
    const markdownContent = editor?.getValue() || '';
    const fileName = getFileNameFromContent(markdownContent);

    // PDF 特殊处理
    if (format === "PDF") {
      try {
        // 获取 HTML 内容
        const htmlContent = editor?.getHTML() || '';
        if (!htmlContent) {
          console.error('No content to export');
          return;
        }

        // 创建临时容器来渲染 HTML
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.width = '210mm'; // A4 宽度
        tempDiv.style.padding = '20mm';
        tempDiv.style.backgroundColor = '#ffffff';
        tempDiv.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
        tempDiv.style.fontSize = '14px';
        tempDiv.style.lineHeight = '1.6';
        tempDiv.style.color = '#333333';
        // 添加基本 Markdown 樣式
        tempDiv.innerHTML = `
          <style>
            h1 { font-size: 2em; margin-top: 0.67em; margin-bottom: 0.67em; font-weight: bold; }
            h2 { font-size: 1.5em; margin-top: 0.83em; margin-bottom: 0.83em; font-weight: bold; }
            h3 { font-size: 1.17em; margin-top: 1em; margin-bottom: 1em; font-weight: bold; }
            h4 { font-size: 1em; margin-top: 1.33em; margin-bottom: 1.33em; font-weight: bold; }
            h5 { font-size: 0.83em; margin-top: 1.67em; margin-bottom: 1.67em; font-weight: bold; }
            h6 { font-size: 0.67em; margin-top: 2.33em; margin-bottom: 2.33em; font-weight: bold; }
            p { margin: 1em 0; }
            code { background-color: #f4f4f4; padding: 2px 4px; border-radius: 3px; font-family: monospace; }
            pre { background-color: #f4f4f4; padding: 10px; border-radius: 5px; overflow-x: auto; }
            pre code { background-color: transparent; padding: 0; }
            blockquote { border-left: 4px solid #ddd; margin: 1em 0; padding-left: 1em; color: #666; }
            ul, ol { margin: 1em 0; padding-left: 2em; }
            li { margin: 0.5em 0; }
            table { border-collapse: collapse; width: 100%; margin: 1em 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            img { max-width: 100%; height: auto; }
            a { color: #0066cc; text-decoration: none; }
            a:hover { text-decoration: underline; }
          </style>
          ${htmlContent}
        `;
        document.body.appendChild(tempDiv);

        // 等待内容渲染
        await new Promise(resolve => setTimeout(resolve, 100));

        // 使用 html2canvas 转换为 canvas
        const canvas = await html2canvas(tempDiv, {
          backgroundColor: '#ffffff',
          scale: 2, // 提高清晰度
          useCORS: true,
          logging: false,
        });

        // 清理临时元素
        document.body.removeChild(tempDiv);

        // 计算 PDF 尺寸（A4: 210mm x 297mm）
        const imgWidth = 210; // A4 width in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const pdf = new jsPDF('p', 'mm', 'a4');
        
        // 如果内容超过一页，分页处理
        const pageHeight = 297; // A4 height in mm
        let heightLeft = imgHeight;
        let position = 0;

        // 添加第一页
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // 如果内容超过一页，添加新页
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        // 保存文件
        const selected = await save({
          defaultPath: `${fileName}.pdf`,
          filters: [
            {
              name: 'PDF',
              extensions: ['pdf'],
            },
          ],
        });

        if (selected) {
          // 将 PDF 转换为 ArrayBuffer
          const pdfBlob = pdf.output('arraybuffer');
          // 使用 writeFile 寫入二進制數據
          await writeFile(selected, new Uint8Array(pdfBlob));
        }
      } catch (error) {
        console.error('PDF export failed:', error);
      }
      return;
    }

    // 其他格式的处理
    let content = ''
    switch (format) {
      case "HTML":
        content = editor?.getHTML() || ''
        break;
      case "JSON":
        content = editor?.exportJSON(editor?.getValue() || '') || ''
        break;
      case "Markdown":
        content = editor?.getValue() || ''
        break;
    }

    // 保存到文件
    let ext = 'md'
    switch (format) {
      case "HTML":
        ext = 'html'
        break;
      case "JSON":
        ext = 'json'
        break;
      case "Markdown":
        ext = 'md'
        break;
    }
    const selected = await save({
      defaultPath: `${fileName}.${ext}`,
      filters: [
        {
          name: format,
          extensions: [ext],
        },
      ],
    })
    if (selected) {
      await writeTextFile(selected, content)
    }
  };

  return (
    <div className="items-center gap-1 hidden md:flex">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost"
            size="icon" 
            className="outline-none"
            aria-label={t('buttonLabel')}
            aria-haspopup="true"
            aria-expanded="false"
            title={t('buttonLabel')}
          >
            <SquareArrowOutUpRightIcon className="!size-3" aria-hidden="true" />
            <span className="sr-only">{t('buttonLabel')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          side="top" 
          align="start"
          className="min-w-[6rem]"
          role="menu"
          aria-label={t('menuLabel')}
        >
          <DropdownMenuItem 
            onClick={() => handleFormatSelect("Markdown")}
            role="menuitem"
            aria-label={t('markdownLabel')}
          >
            {t('markdown')}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleFormatSelect("HTML")}
            role="menuitem"
            aria-label={t('htmlLabel')}
          >
            {t('html')}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleFormatSelect("JSON")}
            role="menuitem"
            aria-label={t('jsonLabel')}
          >
            {t('json')}
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={() => handleFormatSelect("PDF")}
            role="menuitem"
            aria-label={t('pdfLabel')}
          >
            {t('pdf')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}