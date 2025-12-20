import { initRenderer } from '@md/core'
import type { RendererAPI } from '@md/shared/types'
import { marked } from 'marked'
import { create } from 'zustand'

export interface Heading {
  id: string
  text: string
  level: number
}

interface RenderState {
  output: string
  headings: Heading[]
  renderer: RendererAPI | null
  rendererOptions: Parameters<typeof initRenderer>[0]

  // Actions
  initializeRenderer: (opts?: Parameters<typeof initRenderer>[0]) => void
  updateRendererOptions: (opts: Partial<Parameters<typeof initRenderer>[0]>) => void
  render: (content: string) => void
  getOutput: () => string
}

const defaultRendererOptions = {
  legend: 'alt-title' as const,
  citeStatus: false,
  countStatus: false,
  isShowLineNumber: true,
  isMacCodeBlock: true,
}

export const useRenderStore = create<RenderState>((set, get) => ({
  output: '',
  headings: [],
  renderer: null,
  rendererOptions: defaultRendererOptions,

  initializeRenderer: (opts = {}) => {
    const options = { ...defaultRendererOptions, ...opts }
    const renderer = initRenderer(options)
    set({ renderer, rendererOptions: options })
  },

  updateRendererOptions: (opts) => {
    const { rendererOptions } = get()
    const newOptions = { ...rendererOptions, ...opts }
    const renderer = initRenderer(newOptions)
    set({ renderer, rendererOptions: newOptions })
  },

  render: (content) => {
    try {
      const { renderer } = get()

      // Initialize renderer if not already done
      if (!renderer) {
        get().initializeRenderer()
      }

      const currentRenderer = get().renderer
      if (!currentRenderer) {
        console.error('Renderer not initialized')
        return
      }

      // Parse front matter and content
      const { markdownContent, readingTime: readingTimeResult } = currentRenderer.parseFrontMatterAndContent(content)

      // Reset footnotes for new render
      currentRenderer.reset({})

      // Render markdown to HTML
      const html = marked.parse(markdownContent) as string

      // Build additional content
      const addition = currentRenderer.buildAddition()
      const readingTimeHtml = currentRenderer.buildReadingTime(readingTimeResult)
      const footnotes = currentRenderer.buildFootnotes()

      // Wrap in container
      const containerContent = readingTimeHtml + html + footnotes
      const wrappedHtml = currentRenderer.createContainer(containerContent)
      const fullOutput = addition + wrappedHtml

      // Extract headings from rendered HTML
      const headingRegex = /<h([1-6])[^>]*(?:data-heading="true")?[^>]*>([^<]+)<\/h\1>/g
      const headings: Heading[] = []
      let match = headingRegex.exec(fullOutput)

      while (match !== null) {
        const level = Number.parseInt(match[1], 10)
        const text = match[2]
        const id = text
          .toLowerCase()
          .replace(/[^\w\u4E00-\u9FA5]+/g, '-')
          .replace(/^-+|-+$/g, '')

        headings.push({ level, id, text })
        match = headingRegex.exec(fullOutput)
      }

      set({ output: fullOutput, headings })
    }
    catch (error) {
      console.error('Markdown render error:', error)
      set({ output: '<p>Render error</p>', headings: [] })
    }
  },

  getOutput: () => get().output,
}))
