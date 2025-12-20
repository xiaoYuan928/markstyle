'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useEditorStore, usePostStore } from '@/stores'

/**
 * 格式化相对时间
 */
function formatRelativeTime(dateString: string | undefined): string {
  if (!dateString) return ''

  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSeconds < 10) return '刚刚保存'
  if (diffSeconds < 60) return `${diffSeconds}秒前保存`
  if (diffMinutes < 60) return `${diffMinutes}分钟前保存`
  if (diffHours < 24) return `${diffHours}小时前保存`
  if (diffDays < 7) return `${diffDays}天前保存`

  // 超过7天显示具体日期
  return `${date.getMonth() + 1}/${date.getDate()} 保存`
}

interface ToolbarButton {
  icon: string
  title: string
  action: () => void
}

export function Toolbar() {
  const editor = useEditorStore(state => state.editor)
  const currentPost = usePostStore(state => state.posts.find(p => p.id === state.currentPostId))
  const [savedTimeText, setSavedTimeText] = useState('')

  // 更新保存时间显示（每10秒更新一次）
  useEffect(() => {
    const updateSavedTime = () => {
      setSavedTimeText(formatRelativeTime(currentPost?.updateDatetime))
    }

    updateSavedTime()
    const interval = setInterval(updateSavedTime, 10000)

    return () => clearInterval(interval)
  }, [currentPost?.updateDatetime])

  // 去除图片注释（如 ![img](url) 中的 img alt 文本）
  const removeImageCaptions = () => {
    if (!editor)
      return

    const content = editor.state.doc.toString()
    let newContent = content
    let totalRemoved = 0

    // 1. 处理图片 alt 文本：![img](url) -> ![](url)
    const imageAltPatterns = [
      { pattern: /!\[img\]/gi, replacement: '![]' },
      { pattern: /!\[image\]/gi, replacement: '![]' },
      { pattern: /!\[图片\]/g, replacement: '![]' },
      { pattern: /!\[图\]/g, replacement: '![]' },
      { pattern: /!\[图\d+\]/g, replacement: '![]' }, // ![图1] ![图2] 等
    ]

    for (const { pattern, replacement } of imageAltPatterns) {
      const matches = newContent.match(pattern)
      if (matches) {
        totalRemoved += matches.length
      }
      newContent = newContent.replace(pattern, replacement)
    }

    // 2. 处理单独一行的图片注释文本
    const linePatterns = [
      /^[ \t]*img[ \t]*$/gim,
      /^[ \t]*image[ \t]*$/gim,
      /^[ \t]*图片[ \t]*$/gm,
      /^[ \t]*图片说明[ \t]*$/gm,
      /^[ \t]*图[ \t]*\d*[ \t]*$/gm,
      /^[ \t]*<figcaption>.*?<\/figcaption>[ \t]*$/gim,
    ]

    for (const pattern of linePatterns) {
      const matches = newContent.match(pattern)
      if (matches) {
        totalRemoved += matches.length
      }
      newContent = newContent.replace(pattern, '')
    }

    // 清理多余的连续空行（超过2个空行变成2个）
    newContent = newContent.replace(/\n{3,}/g, '\n\n')
    // 清理文档开头的空行
    newContent = newContent.replace(/^\n+/, '')

    if (totalRemoved === 0) {
      toast.info('没有找到需要去除的图片注释')
      return
    }

    // 替换整个文档内容
    editor.dispatch({
      changes: {
        from: 0,
        to: editor.state.doc.length,
        insert: newContent,
      },
    })

    toast.success(`已去除 ${totalRemoved} 个图片注释`)
  }

  const insertText = (before: string, after: string = '') => {
    if (!editor)
      return
    const { from, to } = editor.state.selection.main
    const selectedText = editor.state.doc.sliceString(from, to)
    editor.dispatch({
      changes: {
        from,
        to,
        insert: `${before}${selectedText}${after}`,
      },
      selection: { anchor: from + before.length, head: from + before.length + selectedText.length },
    })
    editor.focus()
  }

  const wrapSelection = (wrapper: string, placeholder: string = '') => {
    if (!editor)
      return
    const { from, to } = editor.state.selection.main
    const selectedText = editor.state.doc.sliceString(from, to)

    // If no text is selected, insert placeholder and select it
    if (from === to && placeholder) {
      editor.dispatch({
        changes: {
          from,
          to,
          insert: `${wrapper}${placeholder}${wrapper}`,
        },
        selection: { anchor: from + wrapper.length, head: from + wrapper.length + placeholder.length },
      })
      editor.focus()
      return
    }

    // If text is selected, wrap it
    insertText(wrapper, wrapper)
  }

  const insertAtLineStart = (prefix: string) => {
    if (!editor)
      return
    const { from } = editor.state.selection.main
    const line = editor.state.doc.lineAt(from)
    editor.dispatch({
      changes: {
        from: line.from,
        to: line.from,
        insert: prefix,
      },
    })
    editor.focus()
  }

  const buttons: (ToolbarButton | 'divider')[] = [
    { icon: 'format_bold', title: 'Bold', action: () => wrapSelection('**', '粗体文本') },
    { icon: 'format_italic', title: 'Italic', action: () => wrapSelection('*', '斜体文本') },
    { icon: 'format_strikethrough', title: 'Strikethrough', action: () => wrapSelection('~~', '删除线') },
    'divider',
    { icon: 'title', title: 'Heading 1', action: () => insertAtLineStart('# ') },
    { icon: 'format_quote', title: 'Quote', action: () => insertAtLineStart('> ') },
    { icon: 'code', title: 'Code', action: () => wrapSelection('`', 'code') },
    'divider',
    { icon: 'format_list_bulleted', title: 'List', action: () => insertAtLineStart('- ') },
    { icon: 'link', title: 'Link', action: () => insertText('[', '](url)') },
    { icon: 'image', title: 'Image', action: () => insertText('![alt](', ')') },
    'divider',
    { icon: 'hide_image', title: '去除图片注释', action: removeImageCaptions },
  ]

  return (
    <div className="h-10 border-b border-border flex items-center px-4 bg-surface dark:bg-surface shrink-0 justify-between">
      <div className="flex items-center space-x-1">
        {buttons.map((item, index) =>
          item === 'divider'
            ? (
                <div key={index} className="h-4 w-px bg-gray-300 dark:bg-gray-600 mx-2" />
              )
            : (
                <button
                  key={index}
                  onClick={item.action}
                  className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                  title={item.title}
                >
                  <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                </button>
              ),
        )}
      </div>
      {savedTimeText && (
        <div className="text-xs text-gray-400 font-medium">{savedTimeText}</div>
      )}
    </div>
  )
}
