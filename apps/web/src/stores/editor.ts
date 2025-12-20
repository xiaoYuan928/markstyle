import type { EditorView } from '@codemirror/view'
import { create } from 'zustand'

interface EditorState {
  editor: EditorView | null
  setEditor: (editor: EditorView | null) => void
  getContent: () => string
  setContent: (content: string) => void
  getSelection: () => string
  replaceSelection: (text: string) => void
  insertAtCursor: (text: string) => void
  clearContent: () => void
}

export const useEditorStore = create<EditorState>((set, get) => ({
  editor: null,

  setEditor: editor => set({ editor }),

  getContent: () => {
    const { editor } = get()
    return editor?.state.doc.toString() ?? ''
  },

  setContent: (content) => {
    const { editor } = get()
    if (editor) {
      editor.dispatch({
        changes: {
          from: 0,
          to: editor.state.doc.length,
          insert: content,
        },
      })
    }
  },

  getSelection: () => {
    const { editor } = get()
    if (!editor)
      return ''
    const { from, to } = editor.state.selection.main
    return editor.state.sliceDoc(from, to)
  },

  replaceSelection: (text) => {
    const { editor } = get()
    if (editor) {
      editor.dispatch(editor.state.replaceSelection(text))
    }
  },

  insertAtCursor: (text) => {
    const { editor } = get()
    if (editor) {
      const { from } = editor.state.selection.main
      editor.dispatch({
        changes: { from, insert: text },
        selection: { anchor: from + text.length },
      })
    }
  },

  clearContent: () => {
    const { setContent } = get()
    setContent('')
  },
}))
