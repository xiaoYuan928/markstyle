import juice from 'juice'

/**
 * Legacy copy fallback using textarea and execCommand
 */
function legacyCopy(text: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.setAttribute('readonly', 'true')
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)

      textarea.select()
      const ok = document.execCommand('copy')
      document.body.removeChild(textarea)

      if (ok) {
        resolve()
      }
      else {
        reject(new Error('execCommand failed'))
      }
    }
    catch (err) {
      reject(err)
    }
  })
}

/**
 * Copy plain text to clipboard
 */
export async function copyPlain(text: string): Promise<void> {
  if (window.isSecureContext && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return
    }
    catch {
      // Fall through to legacy copy
    }
  }
  await legacyCopy(text)
}

/**
 * Copy HTML to clipboard (for rich text paste)
 */
export async function copyHtml(html: string, fallback?: string): Promise<void> {
  const plain = fallback ?? html.replace(/<[^>]+>/g, '')
  if (window.isSecureContext && navigator.clipboard?.write) {
    try {
      const item = new ClipboardItem({
        'text/html': new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([plain], { type: 'text/plain' }),
      })
      await navigator.clipboard.write([item])
      return
    }
    catch {
      // Fall through to plain text copy
    }
  }
  await copyPlain(plain)
}

/**
 * Get theme styles from injected style tag
 */
function getThemeStyles(): string {
  const themeStyle = document.querySelector('#md-theme') as HTMLStyleElement

  if (!themeStyle || !themeStyle.textContent) {
    console.warn('[getThemeStyles] Theme style not found')
    return ''
  }

  // Remove #output scope prefix since copied HTML won't be in #output container
  let cssContent = themeStyle.textContent

  // Replace #output {} with body {}
  cssContent = cssContent.replace(/#output\s*\{/g, 'body {')

  // Replace "#output h1" with "h1", "#output .class" with ".class" etc.
  cssContent = cssContent.replace(/#output\s+/g, '')
  cssContent = cssContent.replace(/^#output\s*/gm, '')

  return `<style>${cssContent}</style>`
}

/**
 * Get highlight.js styles if available
 */
async function getHljsStyles(): Promise<string> {
  const hljsLink = document.querySelector('#hljs') as HTMLLinkElement
  if (!hljsLink)
    return ''

  try {
    const response = await fetch(hljsLink.href)
    const cssText = await response.text()
    return `<style>${cssText}</style>`
  }
  catch (error) {
    console.warn('Failed to fetch highlight.js styles:', error)
    return ''
  }
}

/**
 * Merge CSS inline using juice
 */
function mergeCss(html: string): string {
  return juice(html, {
    inlinePseudoElements: true,
    preserveImportant: true,
    resolveCSSVariables: false,
  })
}

/**
 * Modify HTML structure for WeChat compatibility
 */
function modifyHtmlStructure(htmlString: string): string {
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = htmlString

  // Move `li > ul` and `li > ol` after `li`
  tempDiv.querySelectorAll('li > ul, li > ol').forEach((originalItem) => {
    originalItem.parentElement!.insertAdjacentElement('afterend', originalItem)
  })

  return tempDiv.innerHTML
}

/**
 * Create empty node for SVG copy compatibility
 */
function createEmptyNode(): HTMLElement {
  const node = document.createElement('p')
  node.style.fontSize = '0'
  node.style.lineHeight = '0'
  node.style.margin = '0'
  node.innerHTML = '&nbsp;'
  return node
}

/**
 * Process image sizes for WeChat
 */
function solveWeChatImage(container: HTMLElement): void {
  container.querySelectorAll('img').forEach((image) => {
    const width = image.getAttribute('width')
    const height = image.getAttribute('height')

    if (width) {
      image.removeAttribute('width')
      image.style.width = /^\d+$/.test(width) ? `${width}px` : width
    }

    if (height) {
      image.removeAttribute('height')
      image.style.height = /^\d+$/.test(height) ? `${height}px` : height
    }
  })
}

/**
 * Get all styles to add to clipboard content
 */
async function getStylesToAdd(): Promise<string> {
  const themeStyles = getThemeStyles()
  const hljsStyles = await getHljsStyles()
  return [themeStyles, hljsStyles].filter(Boolean).join('')
}

/**
 * Process clipboard content for WeChat compatibility
 * This modifies the DOM in place, so use with caution
 */
export async function processClipboardContent(primaryColor: string): Promise<void> {
  const clipboardDiv = document.getElementById('output')
  if (!clipboardDiv) {
    throw new Error('Output element not found')
  }

  const stylesToAdd = await getStylesToAdd()

  if (stylesToAdd) {
    clipboardDiv.innerHTML = stylesToAdd + clipboardDiv.innerHTML
  }

  // Merge CSS and modify HTML structure
  clipboardDiv.innerHTML = modifyHtmlStructure(mergeCss(clipboardDiv.innerHTML))

  // Process styles and color variables
  clipboardDiv.innerHTML = clipboardDiv.innerHTML
    .replace(/([^-])top:(.*?)em/g, '$1transform: translateY($2em)')
    .replace(/hsl\(var\(--foreground\)\)/g, '#3f3f3f')
    .replace(/var\(--blockquote-background\)/g, '#f7f7f7')
    .replace(/var\(--md-primary-color\)/g, primaryColor)
    .replace(/--md-primary-color:.+?;/g, '')
    .replace(/--md-font-family:.+?;/g, '')
    .replace(/--md-font-size:.+?;/g, '')
    .replace(
      /<span class="nodeLabel"([^>]*)><p[^>]*>(.*?)<\/p><\/span>/g,
      '<span class="nodeLabel"$1>$2</span>',
    )
    .replace(
      /<span class="edgeLabel"([^>]*)><p[^>]*>(.*?)<\/p><\/span>/g,
      '<span class="edgeLabel"$1>$2</span>',
    )

  // Process image sizes
  solveWeChatImage(clipboardDiv)

  // Add empty nodes for SVG copy compatibility
  const beforeNode = createEmptyNode()
  const afterNode = createEmptyNode()
  clipboardDiv.insertBefore(beforeNode, clipboardDiv.firstChild)
  clipboardDiv.appendChild(afterNode)

  // Fix Mermaid compatibility
  const nodes = clipboardDiv.querySelectorAll('.nodeLabel')
  nodes.forEach((node) => {
    const parent = node.parentElement!
    const xmlns = parent.getAttribute('xmlns')
    const style = parent.getAttribute('style')
    const section = document.createElement('section')
    if (xmlns)
      section.setAttribute('xmlns', xmlns)
    if (style)
      section.setAttribute('style', style)
    section.innerHTML = parent.innerHTML

    const grand = parent.parentElement!
    grand.innerHTML = ''
    grand.appendChild(section)
  })

  // Fix: mermaid text color being overridden by stroke
  clipboardDiv.innerHTML = clipboardDiv.innerHTML
    .replace(
      /<tspan([^>]*)>/g,
      '<tspan$1 style="fill: #333333 !important; color: #333333 !important; stroke: none !important;">',
    )
}

/**
 * Copy content to WeChat clipboard
 * This creates a temporary copy of the output, processes it, and copies
 */
export async function copyToWeChat(primaryColor: string): Promise<void> {
  const outputDiv = document.getElementById('output')
  if (!outputDiv) {
    throw new Error('Output element not found')
  }

  // Save original content
  const originalContent = outputDiv.innerHTML

  try {
    // Process content for WeChat
    await processClipboardContent(primaryColor)

    // Copy the processed content
    await copyHtml(outputDiv.innerHTML)
  }
  finally {
    // Restore original content
    outputDiv.innerHTML = originalContent
  }
}
