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

  // Handle Notion attachment images (internal protocol, not accessible externally)
  turndownService.addRule('notionAttachment', {
    filter: (node) => {
      if (node.nodeName !== 'IMG') return false
      const src = node.getAttribute('src') || ''
      return src.startsWith('attachment:')
    },
    replacement: (_content, node) => {
      const alt = (node as HTMLImageElement).alt || 'image'
      // 转换为提示块，告知用户需要手动上传
      return `\n\n> **[图片需要手动上传]** ${alt}\n\n`
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
      const grandParent = parent?.parentNode as Element
      const isInThead = parent?.nodeName === 'THEAD'

      // Check if this is the first row of a table without thead (Feishu style)
      // In this case, treat the first row as header
      const isFirstRowInTable = !isInThead
        && (parent?.nodeName === 'TBODY' || parent?.nodeName === 'TABLE')
        && Array.from(parent?.children || []).indexOf(node as Element) === 0
        && !grandParent?.querySelector('thead')

      const isHeader = isInThead || isFirstRowInTable
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

  // Handle empty span/div elements (飞书可能产生的空元素)
  turndownService.addRule('emptyElements', {
    filter: (node) => {
      return ['SPAN', 'DIV'].includes(node.nodeName)
        && !node.textContent?.trim()
        && !node.querySelector('img')
    },
    replacement: () => '',
  })

  return turndownService
}

/**
 * Detect if HTML is from Feishu (飞书)
 */
function isFeishuHtml(html: string): boolean {
  return html.includes('feishu') ||
         html.includes('lark') ||
         html.includes('bytedance') ||
         html.includes('data-lark') ||
         html.includes('data-docx')
}

/**
 * Clean Feishu HTML by removing duplicate plain text layer
 * Feishu copies both plain text and rich HTML, causing duplication
 */
function cleanFeishuHtml(html: string): string {
  // Create a temporary DOM to parse the HTML
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const body = doc.body

  // Feishu often wraps content in a container with multiple children:
  // - One child is plain text (no semantic tags)
  // - Other children have rich HTML structure (p, h1, h2, etc.)

  // Strategy: Find and remove elements that are just plain text duplicates
  const children = Array.from(body.children)

  if (children.length >= 2) {
    // Check each child - if it's a plain text block that duplicates other content, remove it
    const toRemove: Element[] = []

    for (const child of children) {
      const childText = child.textContent?.trim() || ''
      if (!childText) continue

      // Count semantic HTML tags in this child
      const semanticTags = child.querySelectorAll('p, h1, h2, h3, h4, h5, h6, ul, ol, li, table, blockquote, pre, code, strong, em, a')

      // If this element has very few semantic tags but lots of text,
      // and its text content is contained in other siblings, it's likely a duplicate
      if (semanticTags.length === 0 || (childText.length > 100 && semanticTags.length < 3)) {
        // Check if this text appears in other siblings (meaning it's duplicate)
        for (const other of children) {
          if (other === child) continue
          const otherText = other.textContent?.trim() || ''
          const otherSemanticTags = other.querySelectorAll('p, h1, h2, h3, h4, h5, h6, ul, ol, li, table, blockquote, pre, code, strong, em, a')

          // If the other element has more structure and similar content
          if (otherSemanticTags.length > semanticTags.length) {
            // Check if significant overlap in text content
            const childWords = new Set(childText.split(/\s+/).filter(w => w.length > 2))
            const otherWords = new Set(otherText.split(/\s+/).filter(w => w.length > 2))
            let overlap = 0
            for (const word of childWords) {
              if (otherWords.has(word)) overlap++
            }
            // If more than 50% of words overlap, it's a duplicate
            if (childWords.size > 0 && overlap / childWords.size > 0.5) {
              toRemove.push(child)
              break
            }
          }
        }
      }
    }

    // Remove identified duplicates
    for (const el of toRemove) {
      el.remove()
    }
  }

  // Also remove any elements with Feishu-specific data attributes that are duplicates
  const feishuElements = body.querySelectorAll('[data-clipboard-text], [data-lark-record-data]')
  feishuElements.forEach(el => el.remove())

  return body.innerHTML
}

/**
 * Clean up HTML before conversion
 */
function cleanHtml(html: string): string {
  // Remove script tags
  html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

  // Remove style tags
  html = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')

  // Remove elements with aria-hidden="true" (飞书等应用的隐藏层)
  html = html.replace(/<[^>]+aria-hidden\s*=\s*["']true["'][^>]*>[\s\S]*?<\/[^>]+>/gi, '')

  // Remove elements with display:none or visibility:hidden
  html = html.replace(/<[^>]+style\s*=\s*["'][^"']*display\s*:\s*none[^"']*["'][^>]*>[\s\S]*?<\/[^>]+>/gi, '')
  html = html.replace(/<[^>]+style\s*=\s*["'][^"']*visibility\s*:\s*hidden[^"']*["'][^>]*>[\s\S]*?<\/[^>]+>/gi, '')

  // Remove Feishu's data-clipboard-text elements (纯文本副本)
  html = html.replace(/<[^>]+data-clipboard-text[^>]*>[\s\S]*?<\/[^>]+>/gi, '')

  // Remove comments
  html = html.replace(/<!--[\s\S]*?-->/g, '')

  // Apply Feishu-specific cleaning if detected
  const isFeishu = isFeishuHtml(html)
  if (isFeishu) {
    try {
      html = cleanFeishuHtml(html)
    }
    catch (e) {
      console.warn('Failed to clean Feishu HTML:', e)
    }
  }

  // Remove extra whitespace but preserve single spaces
  html = html.replace(/\s+/g, ' ')

  return html.trim()
}

/**
 * Detect and remove duplicate content blocks in Markdown
 * This handles cases where Feishu/Lark pastes both plain text and rich HTML
 */
function removeDuplicateContent(markdown: string): string {
  // Feishu duplicate pattern detection:
  // 1. Plain text dump contains [图片] or 【图片】 placeholders
  // 2. Formatted section contains ![](http...) real image syntax
  // If both exist, the content before the first real image is duplicate

  // Check for both half-width and full-width brackets
  const hasPlaceholder = markdown.includes('[图片]') || markdown.includes('【图片】')
  const firstRealImageMatch = markdown.match(/!\[.*?\]\(https?:\/\/[^)]+\)/)

  // If both placeholder and real image exist, it's likely Feishu duplicate
  if (hasPlaceholder && firstRealImageMatch) {
    const firstRealImageIndex = markdown.indexOf(firstRealImageMatch[0])

    // Make sure the placeholder appears BEFORE the real image
    const placeholderIndex = Math.min(
      markdown.indexOf('[图片]') >= 0 ? markdown.indexOf('[图片]') : Infinity,
      markdown.indexOf('【图片】') >= 0 ? markdown.indexOf('【图片】') : Infinity,
    )

    if (placeholderIndex < firstRealImageIndex && firstRealImageIndex > 200) {
      // Find a good starting point - look for the beginning of a paragraph or heading before the image
      const contentFromImage = markdown.substring(firstRealImageIndex)

      // Look backwards from the image to find paragraph/section start
      const beforeImage = markdown.substring(0, firstRealImageIndex)
      const lastDoubleNewline = beforeImage.lastIndexOf('\n\n')

      if (lastDoubleNewline > placeholderIndex) {
        // Start from the paragraph that contains the image
        return markdown.substring(lastDoubleNewline + 2).trim()
      }

      return contentFromImage.trim()
    }
  }

  // Only remove duplicate if we have STRONG evidence of Feishu-style duplication:
  // The exact same heading text must appear twice - once as plain text, once as ## heading
  const headingMatches = markdown.matchAll(/^(#{1,6})\s+(.+)$/gm)

  for (const match of headingMatches) {
    const fullHeadingMatch = match[0]
    const headingText = match[2].trim()
    const headingIndex = markdown.indexOf(fullHeadingMatch)
    const beforeHeading = markdown.substring(0, headingIndex)

    // Only consider this a duplicate if:
    // 1. The EXACT heading text appears as a standalone line before the heading
    // 2. AND there's a [图片] placeholder in the beforeHeading section
    const headingAsPlainTextPattern = new RegExp(`^${escapeRegExp(headingText)}\\s*$`, 'm')
    const hasPlainTextHeading = headingAsPlainTextPattern.test(beforeHeading)
    const hasPlaceholderBefore = beforeHeading.includes('[图片]') || beforeHeading.includes('【图片】')

    if (hasPlainTextHeading && hasPlaceholderBefore) {
      return markdown.substring(headingIndex).trim()
    }
  }

  return markdown
}

/**
 * Escape special regex characters in a string
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
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

  // Remove duplicate content blocks (Feishu paste fix)
  markdown = removeDuplicateContent(markdown)

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
 * Replace Notion attachment: protocol images with placeholder
 */
function replaceNotionAttachments(text: string): string {
  // Match ![alt](attachment:...) pattern
  return text.replace(
    /!\[([^\]]*)\]\(attachment:[^)]+\)/g,
    (_match, alt) => {
      const imageName = alt || 'image'
      return `\n> **[图片需要手动上传]** ${imageName}\n`
    },
  )
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
  // But still process Notion attachment images
  if (plainText && looksLikeMarkdown(plainText)) {
    // Check if contains Notion attachment images
    if (plainText.includes('attachment:')) {
      return replaceNotionAttachments(plainText)
    }
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
