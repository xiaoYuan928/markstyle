'use client'

import Link from 'next/link'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useState } from 'react'
import { toast } from 'sonner'
import { useEditorStore, usePostStore, useThemeStore } from '@/stores'
import { copyToWeChat } from '@/utils/clipboard'

export function EditorHeader() {
  const { theme, setTheme } = useTheme()
  const currentPost = usePostStore(state => state.posts.find(p => p.id === state.currentPostId))
  const getContent = useEditorStore(state => state.getContent)
  const primaryColor = useThemeStore(state => state.primaryColor)
  const [isCopying, setIsCopying] = useState(false)

  const handleExport = () => {
    const content = getContent()
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${currentPost?.title || 'document'}.md`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('已导出 Markdown 文件')
  }

  const handleCopyToWeChat = async () => {
    if (isCopying)
      return

    setIsCopying(true)
    try {
      await copyToWeChat(primaryColor)
      toast.success('复制成功！请在公众号编辑器中粘贴')
    }
    catch (error) {
      console.error('Copy failed:', error)
      toast.error('复制失败，请重试')
    }
    finally {
      setIsCopying(false)
    }
  }

  return (
    <header className="h-14 bg-surface dark:bg-surface border-b border-border flex items-center px-4 justify-between shrink-0 z-20 relative">
      {/* Left: Logo */}
      <Link href="/home" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
        <span className="material-symbols-outlined text-primary text-2xl">edit_note</span>
        <span className="font-bold text-lg text-gray-900 dark:text-white hidden sm:block">MarkStyle</span>
      </Link>

      {/* Right: Actions */}
      <div className="flex items-center space-x-2">
        {/* Copy to WeChat Button - Primary Action */}
        <button
          onClick={handleCopyToWeChat}
          disabled={isCopying}
          className="flex items-center space-x-1.5 px-4 py-1.5 rounded-md bg-primary hover:bg-primary/90 text-white transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-[18px]">content_copy</span>
          <span className="hidden sm:inline">{isCopying ? '复制中...' : '复制到公众号'}</span>
        </button>

        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1" />

        <button
          onClick={handleExport}
          className="hidden md:flex items-center space-x-1 px-3 py-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors text-sm font-medium"
          title="导出 Markdown"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          <span>导出</span>
        </button>

        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2" />

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
          title="切换深色模式"
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 -mt-5" />
        </button>
      </div>
    </header>
  )
}
