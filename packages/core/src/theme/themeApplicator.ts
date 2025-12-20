/**
 * 主题应用工具
 * 负责将主题样式应用到页面
 */

import type { ThemeName } from '@md/shared/configs'
import type { CSSVariableConfig } from './cssVariables'
import { baseCSSContent, themeMap } from '@md/shared/configs'
import { processCSS } from './cssProcessor'
import { wrapCSSWithScope } from './cssScopeWrapper'
import { generateCSSVariables } from './cssVariables'
import { getThemeInjector } from './themeInjector'

export interface ThemeConfig {
  themeName: string // 主题名称
  customCSS?: string // 用户自定义 CSS
  variables: CSSVariableConfig
}

/**
 * 应用主题
 * @param config - 主题配置
 */
export async function applyTheme(config: ThemeConfig): Promise<void> {
  // 1. 生成 CSS 变量
  const variablesCSS = generateCSSVariables(config.variables)

  // 2. 获取主题 CSS
  let themeCSS = themeMap[config.themeName as ThemeName] || themeMap.simple || ``

  // 3. 添加用户自定义 CSS
  if (config.customCSS) {
    themeCSS = `${themeCSS}\n\n${config.customCSS}`
  }

  // 5. 给主题 CSS 添加作用域（只影响 #output 预览区域）
  const scopedThemeCSS = wrapCSSWithScope(themeCSS, `#output`)

  // 6. 拼接完整 CSS
  let mergedCSS = [
    variablesCSS, // CSS 变量（全局）
    baseCSSContent, // 基础样式（全局）
    scopedThemeCSS, // 主题样式（限制在 #output）
  ].filter(Boolean).join(`\n\n`)

  // 7. 使用 PostCSS 处理 CSS（简化 calc() 表达式等）
  mergedCSS = await processCSS(mergedCSS)

  // 8. 注入到页面
  const injector = getThemeInjector()
  injector.inject(mergedCSS)
}
