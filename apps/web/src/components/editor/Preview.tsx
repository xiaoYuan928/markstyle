'use client'

import { useCallback, useEffect, useRef } from 'react'
import { usePostStore, useRenderStore, useThemeStore, useUIStore } from '@/stores'

interface PreviewProps {
  className?: string
}

export function Preview({ className = '' }: PreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isScrollingRef = useRef(false)

  const output = useRenderStore(state => state.output)
  const updateRendererOptions = useRenderStore(state => state.updateRendererOptions)
  const render = useRenderStore(state => state.render)
  const currentPost = usePostStore(state => state.currentPost)
  const { applyCurrentTheme, primaryColor, fontFamily, fontSize, lineHeight, maxWidth, isShowLineNumber, isMacCodeBlock } = useThemeStore()
  const { syncScroll, scrollSource, scrollPercent, setScrollState } = useUIStore()

  // Apply theme on mount and when theme settings change
  useEffect(() => {
    applyCurrentTheme()
  }, [applyCurrentTheme, primaryColor, fontFamily, fontSize, lineHeight, maxWidth])

  // Update renderer options when code block settings change
  useEffect(() => {
    updateRendererOptions({ isShowLineNumber, isMacCodeBlock })
    // Re-render current content with new options
    const post = currentPost()
    if (post?.content) {
      render(post.content)
    }
  }, [isShowLineNumber, isMacCodeBlock, updateRendererOptions, render, currentPost])

  // Handle scroll event for sync scrolling
  const handleScroll = useCallback(() => {
    if (!syncScroll || isScrollingRef.current)
      return

    const container = containerRef.current
    if (!container)
      return

    const scrollHeight = container.scrollHeight - container.clientHeight
    if (scrollHeight <= 0)
      return

    const percent = container.scrollTop / scrollHeight
    setScrollState('preview', percent)
  }, [syncScroll, setScrollState])

  // Respond to scroll events from editor
  useEffect(() => {
    if (!syncScroll || scrollSource !== 'editor')
      return

    const container = containerRef.current
    if (!container)
      return

    const scrollHeight = container.scrollHeight - container.clientHeight
    if (scrollHeight <= 0)
      return

    isScrollingRef.current = true
    container.scrollTop = scrollPercent * scrollHeight

    // Reset scrolling flag after animation
    requestAnimationFrame(() => {
      isScrollingRef.current = false
    })
  }, [syncScroll, scrollSource, scrollPercent])

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={`h-full overflow-y-auto p-8 lg:p-12 bg-white dark:bg-surface ${className}`}
    >
      <article
        id="output"
        className="preview-wrapper max-w-none"
        dangerouslySetInnerHTML={{ __html: output }}
      />
    </div>
  )
}
