'use client'

import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'
import { markdown } from '@codemirror/lang-markdown'
import { bracketMatching } from '@codemirror/language'
import { EditorState } from '@codemirror/state'
import { EditorView, highlightActiveLine, highlightActiveLineGutter, keymap, lineNumbers } from '@codemirror/view'
import { useCallback, useEffect, useRef } from 'react'
import { useEditorStore, usePostStore, useRenderStore, useUIStore } from '@/stores'
import { handlePasteContent } from '@/utils/htmlToMarkdown'

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

  const setEditor = useEditorStore(state => state.setEditor)
  const currentPost = usePostStore(state => state.currentPost)
  const updateCurrentPostContent = usePostStore(state => state.updateCurrentPostContent)
  const render = useRenderStore(state => state.render)
  const { syncScroll, scrollSource, scrollPercent, setScrollState } = useUIStore()

  const post = currentPost()

  const handleChange = useCallback((content: string) => {
    updateCurrentPostContent(content)
    render(content)
  }, [updateCurrentPostContent, render])

  // Handle scroll event for sync scrolling
  const handleScroll = useCallback(() => {
    if (!syncScroll || isScrollingRef.current)
      return

    const editor = editorRef.current
    if (!editor)
      return

    const scrollDOM = editor.scrollDOM
    const scrollHeight = scrollDOM.scrollHeight - scrollDOM.clientHeight
    if (scrollHeight <= 0)
      return

    const percent = scrollDOM.scrollTop / scrollHeight
    setScrollState('editor', percent)
  }, [syncScroll, setScrollState])

  // Handle paste event for HTML to Markdown conversion
  const handlePaste = useCallback((event: ClipboardEvent) => {
    const editor = editorRef.current
    if (!editor || !event.clipboardData)
      return

    const markdown = handlePasteContent(event.clipboardData)

    // If we got converted Markdown, insert it and prevent default paste
    if (markdown) {
      event.preventDefault()

      const { from, to } = editor.state.selection.main
      editor.dispatch({
        changes: { from, to, insert: markdown },
        selection: { anchor: from + markdown.length },
      })
    }
  }, [])

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
    const container = containerRef.current
    container.addEventListener('paste', handlePaste)

    // Add scroll event listener for sync scrolling
    view.scrollDOM.addEventListener('scroll', handleScroll)

    // Initial render
    if (post?.content) {
      render(post.content)
    }

    return () => {
      container.removeEventListener('paste', handlePaste)
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
