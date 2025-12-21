'use client'

import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { markdown } from '@codemirror/lang-markdown'
import { bracketMatching } from '@codemirror/language'
import { EditorState } from '@codemirror/state'
import { EditorView, highlightActiveLine, highlightActiveLineGutter, keymap, lineNumbers } from '@codemirror/view'
import { useCallback, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useEditorStore, useImageHostStore, usePostStore, useRenderStore, useUIStore } from '@/stores'
import { handlePasteContent } from '@/utils/htmlToMarkdown'
import { isValidImageFile, uploadToGitHub } from '@/utils/imageUpload'

// Editor theme
const editorTheme = EditorView.theme({
  '&': {
    height: '100%',
    fontSize: '14px',
  },
  '.cm-scroller': {
    overflow: 'auto',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
  },
  '.cm-content': {
    padding: '16px',
    minHeight: '100%',
  },
  '.cm-line': {
    padding: '0 4px',
  },
  '&.cm-focused': {
    outline: 'none',
  },
  '.cm-gutters': {
    backgroundColor: 'transparent',
    border: 'none',
    color: 'var(--muted-foreground)',
  },
  '.cm-activeLineGutter': {
    backgroundColor: 'transparent',
  },
  '.cm-activeLine': {
    backgroundColor: 'oklch(0.97 0 0)',
  },
})

interface CodeMirrorEditorProps {
  className?: string
}

export function CodeMirrorEditor({ className = '' }: CodeMirrorEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<EditorView | null>(null)
  const isScrollingRef = useRef(false)
  const scrollThrottleRef = useRef<number | null>(null)

  const setEditor = useEditorStore(state => state.setEditor)
  const currentPost = usePostStore(state => state.currentPost)
  const updateCurrentPostContent = usePostStore(state => state.updateCurrentPostContent)
  const render = useRenderStore(state => state.render)
  const { syncScroll, scrollSource, scrollPercent, setScrollState } = useUIStore()
  const { githubConfig, isConfigured } = useImageHostStore()

  const post = currentPost()

  // Upload image and insert markdown at cursor position
  const uploadImageAndInsert = useCallback(async (file: File) => {
    const editor = editorRef.current
    if (!editor) return

    if (!isConfigured()) {
      toast.error('请先配置 GitHub 图床（点击工具栏图片按钮）')
      return
    }

    if (!isValidImageFile(file)) {
      toast.error('请选择有效的图片文件 (JPEG, PNG, GIF, WebP, SVG)')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('图片大小不能超过 10MB')
      return
    }

    // Insert placeholder at cursor position
    const { from } = editor.state.selection.main
    const placeholder = `![上传中...]()`
    editor.dispatch({
      changes: { from, to: from, insert: placeholder },
      selection: { anchor: from + placeholder.length },
    })

    try {
      const url = await uploadToGitHub(file, githubConfig)

      // Replace placeholder with actual image markdown
      const currentContent = editor.state.doc.toString()
      const placeholderIndex = currentContent.indexOf(placeholder)

      if (placeholderIndex !== -1) {
        const imageMarkdown = `![](${url})`
        editor.dispatch({
          changes: {
            from: placeholderIndex,
            to: placeholderIndex + placeholder.length,
            insert: imageMarkdown,
          },
        })
        toast.success('图片上传成功')
      }
    }
    catch (error) {
      // Remove placeholder on error
      const currentContent = editor.state.doc.toString()
      const placeholderIndex = currentContent.indexOf(placeholder)

      if (placeholderIndex !== -1) {
        editor.dispatch({
          changes: {
            from: placeholderIndex,
            to: placeholderIndex + placeholder.length,
            insert: '',
          },
        })
      }

      toast.error(error instanceof Error ? error.message : '上传失败')
    }
  }, [githubConfig, isConfigured])

  const handleChange = useCallback((content: string) => {
    updateCurrentPostContent(content)
    render(content)
  }, [updateCurrentPostContent, render])

  // Handle scroll event for sync scrolling with throttling
  const handleScroll = useCallback(() => {
    if (!syncScroll || isScrollingRef.current)
      return

    // Throttle scroll updates to reduce flickering
    if (scrollThrottleRef.current !== null)
      return

    scrollThrottleRef.current = window.requestAnimationFrame(() => {
      const editor = editorRef.current
      if (!editor) {
        scrollThrottleRef.current = null
        return
      }

      const scrollDOM = editor.scrollDOM
      const scrollHeight = scrollDOM.scrollHeight - scrollDOM.clientHeight
      if (scrollHeight <= 0) {
        scrollThrottleRef.current = null
        return
      }

      const percent = scrollDOM.scrollTop / scrollHeight
      setScrollState('editor', percent)
      scrollThrottleRef.current = null
    })
  }, [syncScroll, setScrollState])

  // Handle paste event for images and HTML to Markdown conversion
  const handlePaste = useCallback((event: ClipboardEvent) => {
    const editor = editorRef.current
    if (!editor || !event.clipboardData)
      return

    // Check for clipboard image first (screenshots, copied images)
    const files = event.clipboardData.files
    if (files.length > 0) {
      const imageFile = Array.from(files).find(f => f.type.startsWith('image/'))
      if (imageFile) {
        event.preventDefault()
        event.stopPropagation()
        uploadImageAndInsert(imageFile)
        return
      }
    }

    // Otherwise, handle HTML to Markdown conversion
    const markdown = handlePasteContent(event.clipboardData)

    // If we got converted Markdown, insert it and prevent default paste
    if (markdown) {
      event.preventDefault()
      event.stopPropagation() // Also stop propagation to prevent CodeMirror handling

      const { from, to } = editor.state.selection.main
      editor.dispatch({
        changes: { from, to, insert: markdown },
        selection: { anchor: from + markdown.length },
      })
    }
  }, [uploadImageAndInsert])

  // Handle drag over to allow drop and show cursor position
  const handleDragOver = useCallback((event: DragEvent) => {
    // Check if dragging files that include images
    if (event.dataTransfer?.types.includes('Files')) {
      event.preventDefault()
      event.dataTransfer.dropEffect = 'copy'

      // Move cursor to drop position for visual feedback
      const editor = editorRef.current
      if (editor) {
        const pos = editor.posAtCoords({ x: event.clientX, y: event.clientY })
        if (pos !== null) {
          editor.dispatch({
            selection: { anchor: pos },
          })
          editor.focus()
        }
      }
    }
  }, [])

  // Handle drop for image upload
  const handleDrop = useCallback((event: DragEvent) => {
    const files = event.dataTransfer?.files
    if (!files || files.length === 0) return

    const imageFile = Array.from(files).find(f => f.type.startsWith('image/'))
    if (imageFile) {
      event.preventDefault()
      event.stopPropagation()
      uploadImageAndInsert(imageFile)
    }
  }, [uploadImageAndInsert])

  useEffect(() => {
    if (!containerRef.current)
      return

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const content = update.state.doc.toString()
        handleChange(content)
      }
    })

    const state = EditorState.create({
      doc: post?.content ?? '',
      extensions: [
        lineNumbers(),
        highlightActiveLine(),
        highlightActiveLineGutter(),
        history(),
        bracketMatching(),
        markdown(),
        keymap.of([...defaultKeymap, ...historyKeymap]),
        editorTheme,
        updateListener,
        EditorView.lineWrapping,
      ],
    })

    const view = new EditorView({
      state,
      parent: containerRef.current,
    })

    editorRef.current = view
    setEditor(view)

    // Add paste event listener for HTML to Markdown conversion
    // Use capture phase to intercept paste before CodeMirror's internal handler
    const container = containerRef.current
    container.addEventListener('paste', handlePaste, true)

    // Add drag and drop event listeners for image upload
    container.addEventListener('dragover', handleDragOver)
    container.addEventListener('drop', handleDrop)

    // Add scroll event listener for sync scrolling
    view.scrollDOM.addEventListener('scroll', handleScroll)

    // Initial render
    if (post?.content) {
      render(post.content)
    }

    return () => {
      container.removeEventListener('paste', handlePaste, true)
      container.removeEventListener('dragover', handleDragOver)
      container.removeEventListener('drop', handleDrop)
      view.scrollDOM.removeEventListener('scroll', handleScroll)
      view.destroy()
      editorRef.current = null
      setEditor(null)
    }
  }, [])

  // Respond to scroll events from preview
  useEffect(() => {
    if (!syncScroll || scrollSource !== 'preview')
      return

    const editor = editorRef.current
    if (!editor)
      return

    const scrollDOM = editor.scrollDOM
    const scrollHeight = scrollDOM.scrollHeight - scrollDOM.clientHeight
    if (scrollHeight <= 0)
      return

    isScrollingRef.current = true
    scrollDOM.scrollTop = scrollPercent * scrollHeight

    // Reset scrolling flag after animation
    requestAnimationFrame(() => {
      isScrollingRef.current = false
    })
  }, [syncScroll, scrollSource, scrollPercent])

  // Update editor content when post changes
  useEffect(() => {
    const editor = editorRef.current
    if (editor && post) {
      const currentContent = editor.state.doc.toString()
      if (currentContent !== post.content) {
        editor.dispatch({
          changes: {
            from: 0,
            to: editor.state.doc.length,
            insert: post.content,
          },
        })
        render(post.content)
      }
    }
  }, [post?.id])

  return (
    <div
      ref={containerRef}
      className={`h-full overflow-hidden ${className}`}
    />
  )
}
