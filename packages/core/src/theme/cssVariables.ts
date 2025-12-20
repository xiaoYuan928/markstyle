/**
 * CSS 变量生成工具
 * 根据配置动态生成 CSS 变量样式
 */

export interface CSSVariableConfig {
  primaryColor: string
  fontFamily: string
  fontSize: string
  lineHeight?: string
  maxWidth?: string
  isUseIndent?: boolean
  isUseJustify?: boolean
}

/**
 * 生成 CSS 变量样式
 * @param config - 配置对象
 * @returns CSS 变量字符串
 */
export function generateCSSVariables(config: CSSVariableConfig): string {
  return `
:root {
  /* 动态配置变量 */
  --md-primary-color: ${config.primaryColor};
  --md-font-family: ${config.fontFamily};
  --md-font-size: ${config.fontSize};
  --md-line-height: ${config.lineHeight || '1.6'};
  --md-max-width: ${config.maxWidth || '65ch'};
}

/* 段落缩进和对齐 */
#output p {
  ${config.isUseIndent ? 'text-indent: 2em;' : ''}
  ${config.isUseJustify ? 'text-align: justify;' : ''}
}

/* 预览区域行高和最大宽度（使用 !important 覆盖主题默认值） */
#output {
  line-height: var(--md-line-height) !important;
  max-width: var(--md-max-width) !important;
  margin: 0 auto;
}
  `.trim()
}
