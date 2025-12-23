'use client'

import { useCallback, useEffect, useRef } from 'react'
import { usePostStore, useRenderStore, useThemeStore, useUIStore } from '@/stores'

// 全局图片缓存 - 存储已加载图片的 src -> 加载状态
const loadedImages = new Set<string>()

interface PreviewProps {
  className?: string
}

export function Preview({ className = '' }: PreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const articleRef = useRef<HTMLElement>(null)
  const isScrollingRef = useRef(false)
  const scrollThrottleRef = useRef<number | null>(null)
  const lastOutputRef = useRef<string>('')

  const output = useRenderStore(state => state.output)
  const updateRendererOptions = useRenderStore(state => state.updateRendererOptions)
  const render = useRenderStore(state => state.render)
  const currentPost = usePostStore(state => state.currentPost)
  const { applyCurrentTheme, primaryColor, fontFamily, fontSize, lineHeight, maxWidth, isMacCodeBlock } = useThemeStore()
  const { syncScroll, scrollSource, scrollPercent, setScrollState } = useUIStore()

  // Apply theme on mount and when theme settings change
  useEffect(() => {
    applyCurrentTheme()
  }, [applyCurrentTheme, primaryColor, fontFamily, fontSize, lineHeight, maxWidth])

  // Update renderer options when code block settings change
  useEffect(() => {
    updateRendererOptions({ isMacCodeBlock })
    // Re-render current content with new options
    const post = currentPost()
    if (post?.content) {
      render(post.content)
    }
  }, [isMacCodeBlock, updateRendererOptions, render, currentPost])

  // 智能 DOM 更新 - 保留已加载的图片
  useEffect(() => {
    const article = articleRef.current
    if (!article)
      return

    // 如果内容没变，不更新
    if (output === lastOutputRef.current)
      return

    lastOutputRef.current = output

    // 保存当前已加载图片的信息
    const existingImages = new Map<string, HTMLImageElement>()
    article.querySelectorAll('img').forEach((img) => {
      const src = img.getAttribute('src')
      if (src && (img.complete || loadedImages.has(src))) {
        existingImages.set(src, img.cloneNode(true) as HTMLImageElement)
        loadedImages.add(src)
      }
    })

    // 更新 HTML
    article.innerHTML = output

    // 恢复已加载的图片状态，避免闪烁
    article.querySelectorAll('img').forEach((newImg) => {
      const src = newImg.getAttribute('src')
      if (!src)
        return

      // 如果这个图片之前已加载过，标记为已加载以避免闪烁
      if (loadedImages.has(src)) {
        // 图片已在缓存中，浏览器会从缓存加载
        newImg.style.opacity = '1'
      }
      else {
        // 新图片，添加加载监听
        newImg.addEventListener('load', () => {
          loadedImages.add(src)
        }, { once: true })
      }
    })
  }, [output])

  // Handle scroll event for sync scrolling with throttling
  const handleScroll = useCallback(() => {
    if (!syncScroll || isScrollingRef.current)
      return

    // Throttle scroll updates to reduce flickering
    if (scrollThrottleRef.current !== null)
      return

    scrollThrottleRef.current = window.requestAnimationFrame(() => {
      const container = containerRef.current
      if (!container) {
        scrollThrottleRef.current = null
        return
      }

      const scrollHeight = container.scrollHeight - container.clientHeight
      if (scrollHeight <= 0) {
        scrollThrottleRef.current = null
        return
      }

      const percent = container.scrollTop / scrollHeight
      setScrollState('preview', percent)
      scrollThrottleRef.current = null
    })
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
        ref={articleRef}
        id="output"
        className="preview-wrapper max-w-none"
      />
    </div>
  )
}
