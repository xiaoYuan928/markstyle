import TurndownService from 'turndown'

/**
 * Create a configured Turndown service instance
 */
function createTurndownService(): TurndownService {
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    hr: '---',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    fence: '```',
    emDelimiter: '*',
    strongDelimiter: '**',
    linkStyle: 'inlined',
  })

  // Handle Feishu specific elements
  turndownService.addRule('feishuMention', {
    filter: (node) => {
      return node.nodeName === 'SPAN' && node.getAttribute('data-mention-id') !== null
    },
    replacement: (content) => {
      return `@${content}`
    },
  })

  // Handle Notion specific elements
  turndownService.addRule('notionCheckbox', {
    filter: (node) => {
      return node.nodeName === 'INPUT' && node.getAttribute('type') === 'checkbox'
    },
    replacement: (_content, node) => {
      const isChecked = (node as HTMLInputElement).checked
      return isChecked ? '[x] ' : '[ ] '
    },
  })

  // Handle code blocks with language
  turndownService.addRule('codeBlock', {
    filter: (node) => {
      return node.nodeName === 'PRE' && node.querySelector('code') !== null
    },
    replacement: (_content, node) => {
      const code = node.querySelector('code')
      if (!code)
        return ''

      const className = code.className || ''
      const language = className.match(/language-(\w+)/)?.[1] || ''
      const text = code.textContent || ''

      return `\n\`\`\`${language}\n${text}\n\`\`\`\n`
    },
  })

  // Handle strikethrough
  turndownService.addRule('strikethrough', {
    filter: ['del', 's', 'strike'] as (keyof HTMLElementTagNameMap)[],
    replacement: content => `~~${content}~~`,
  })

  // Handle table cells properly
  turndownService.addRule('tableCell', {
    filter: ['th', 'td'],
    replacement: (content, node) => {
      const cell = content.trim().replace(/\n/g, ' ')
      const parent = node.parentNode as Element
      const index = Array.from(parent?.children || []).indexOf(node as Element)
      const prefix = index === 0 ? '| ' : ' '
      return `${prefix}${cell} |`
    },
  })

  // Handle table rows
  turndownService.addRule('tableRow', {
    filter: 'tr',
    replacement: (content, node) => {
      const parent = node.parentNode as Element
      const isHeader = parent?.nodeName === 'THEAD'
      const cells = content.trim()

      if (isHeader) {
        const cellCount = (node as Element).children.length
        const separator = '\n|' + ' --- |'.repeat(cellCount)
        return `\n${cells}${separator}`
      }

      return `\n${cells}`
    },
  })

  // Handle tables
  turndownService.addRule('table', {
    filter: 'table',
    replacement: content => `\n${content}\n`,
  })

  return turndownService
}

/**
 * Clean up HTML before conversion
 */
function cleanHtml(html: string): string {
  // Remove script tags
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

  // Remove style tags
  html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')

  // Remove comments
  html = html.replace(/<!--[\s\S]*?-->/g, '')

  // Remove extra whitespace but preserve single spaces
  html = html.replace(/\s+/g, ' ')

  return html.trim()
}

/**
 * Clean up the converted Markdown
 */
function cleanMarkdown(markdown: string): string {
  // Remove excessive blank lines (more than 2)
  markdown = markdown.replace(/\n{3,}/g, '\n\n')

  // Remove trailing spaces from each line
  markdown = markdown.split('\n').map(line => line.trimEnd()).join('\n')

  // Remove leading/trailing blank lines
  markdown = markdown.trim()

  return markdown
}

/**
 * Convert HTML to Markdown
 */
export function htmlToMarkdown(html: string): string {
  if (!html || html.trim() === '') {
    return ''
  }

  const cleanedHtml = cleanHtml(html)
  const turndownService = createTurndownService()

  try {
    const markdown = turndownService.turndown(cleanedHtml)
    return cleanMarkdown(markdown)
  }
  catch (error) {
    console.error('Failed to convert HTML to Markdown:', error)
    return ''
  }
}

/**
 * Check if clipboard content is HTML
 */
export function isHtmlContent(clipboardData: DataTransfer): boolean {
  return clipboardData.types.includes('text/html')
}

/**
 * Check if content looks like Markdown
 */
export function looksLikeMarkdown(text: string): boolean {
  // Check for common Markdown patterns
  const mdPatterns = [
    /^#{1,6}\s/, // Headers
    /^\*\*[^*]+\*\*/, // Bold
    /^\*[^*]+\*/, // Italic
    /^[-*+]\s/, // Unordered list
    /^\d+\.\s/, // Ordered list
    /^```/, // Code block
    /^\[.+\]\(.+\)/, // Link
    /^>\s/, // Blockquote
    /^\|.+\|/, // Table
  ]

  const lines = text.split('\n').slice(0, 10) // Check first 10 lines
  return lines.some(line => mdPatterns.some(pattern => pattern.test(line.trim())))
}

/**
 * Handle paste event and convert HTML to Markdown if needed
 */
export function handlePasteContent(clipboardData: DataTransfer): string | null {
  const html = clipboardData.getData('text/html')
  const plainText = clipboardData.getData('text/plain')

  // If no HTML, return null to let default paste behavior happen
  if (!html) {
    return null
  }

  // If the plain text already looks like Markdown, use it directly
  if (plainText && looksLikeMarkdown(plainText)) {
    return null
  }

  // Convert HTML to Markdown
  const markdown = htmlToMarkdown(html)

  // If conversion resulted in meaningful content, return it
  if (markdown && markdown.length > 0) {
    return markdown
  }

  return null
}
