'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePostStore, useUIStore } from '@/stores'
import { CodeMirrorEditor } from './CodeMirrorEditor'
import { EditorHeader } from './EditorHeader'
import { Preview } from './Preview'
import { SettingsPanel } from './SettingsPanel'
import { Sidebar } from './Sidebar'
import { Toolbar } from './Toolbar'

export function Editor() {
  const { posts, currentPostId, createPost } = usePostStore()
  const { showSidebar, toggleSidebar } = useUIStore()
  const [sidebarWidth, setSidebarWidth] = useState(256) // 默认 256px
  const [isCollapseZone, setIsCollapseZone] = useState(false) // 是否在收缩区域
  const isResizing = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Create initial post if none exists
  useEffect(() => {
    if (posts.length === 0) {
      createPost()
    }
  }, [posts.length, createPost])

  // 从 localStorage 恢复宽度
  useEffect(() => {
    const saved = localStorage.getItem('markstyle-sidebar-width')
    if (saved) {
      setSidebarWidth(Number(saved))
    }
  }, [])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    isResizing.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [])

  const shouldCollapse = useRef(false)
  const AUTO_COLLAPSE_THRESHOLD = 120 // 拖拽到 120px 以下自动收缩

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current || !containerRef.current) return

      const containerRect = containerRef.current.getBoundingClientRect()
      const newWidth = e.clientX - containerRect.left

      // 检查是否应该自动收缩
      if (newWidth < AUTO_COLLAPSE_THRESHOLD) {
        shouldCollapse.current = true
        setIsCollapseZone(true)
        // 视觉反馈：显示即将收缩
        setSidebarWidth(AUTO_COLLAPSE_THRESHOLD)
      }
      else {
        shouldCollapse.current = false
        setIsCollapseZone(false)
        // 限制宽度范围 180px - 400px
        const clampedWidth = Math.min(Math.max(newWidth, 180), 400)
        setSidebarWidth(clampedWidth)
      }
    }

    const handleMouseUp = () => {
      if (isResizing.current) {
        isResizing.current = false
        document.body.style.cursor = ''
        document.body.style.userSelect = ''

        setIsCollapseZone(false)

        // 如果拖拽到阈值以下，自动收缩
        if (shouldCollapse.current) {
          shouldCollapse.current = false
          toggleSidebar()
          // 恢复到默认宽度，以便下次展开时使用
          setSidebarWidth(256)
        }
        else {
          // 保存宽度
          localStorage.setItem('markstyle-sidebar-width', String(sidebarWidth))
        }
      }
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [sidebarWidth, toggleSidebar])

  // Don't render until we have a post
  if (!currentPostId) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen flex-col bg-background text-gray-800 dark:text-gray-200 overflow-hidden">
      <EditorHeader />

      <div ref={containerRef} className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        {showSidebar
          ? (
              <>
                <div
                  className="hidden md:block shrink-0"
                  style={{ width: sidebarWidth }}
                >
                  <Sidebar />
                </div>
                {/* Resize Handle */}
                <div
                  onMouseDown={handleMouseDown}
                  className={`w-1 transition-colors cursor-col-resize hidden md:block shrink-0 ${
                    isCollapseZone
                      ? 'bg-red-400 hover:bg-red-500'
                      : 'bg-border hover:bg-primary/50 active:bg-primary'
                  }`}
                />
              </>
            )
          : (
              /* Expand button - same position as collapse button */
              <button
                onClick={toggleSidebar}
                className="hidden md:flex absolute left-0 bottom-4 z-10 items-center justify-center w-6 h-10 bg-surface border border-border border-l-0 rounded-r-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors shadow-sm"
                title="展开侧边栏"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-gray-900 relative">
          <Toolbar />

          <div className="flex-1 flex overflow-hidden">
            {/* Editor Panel */}
            <div className="flex-1 border-r border-border flex flex-col min-w-0 bg-gray-50 dark:bg-[#1e1e1e]">
              <div className="p-2 text-xs font-mono text-gray-400 bg-gray-100 dark:bg-gray-800 border-b border-border flex justify-between items-center">
                <span>Markdown Source</span>
                <span className="material-symbols-outlined text-[14px]">code</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <CodeMirrorEditor className="h-full" />
              </div>
            </div>

            {/* Preview Panel */}
            <div className="flex-1 flex flex-col min-w-0 bg-white dark:bg-surface hidden sm:flex">
              <div className="p-2 text-xs font-mono text-gray-400 bg-gray-100 dark:bg-gray-800 border-b border-border flex justify-between items-center">
                <span>Preview</span>
                <span className="material-symbols-outlined text-[14px]">visibility</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <Preview />
              </div>
            </div>
          </div>
        </main>

        <SettingsPanel />
      </div>
    </div>
  )
}
