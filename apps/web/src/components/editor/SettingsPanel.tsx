'use client'

import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { FONT_FAMILIES, MAX_WIDTHS, PRIMARY_COLORS, themeOptions, useThemeStore, useUIStore } from '@/stores'

export function SettingsPanel() {
  const { showRightPanel, syncScroll, setSyncScroll } = useUIStore()
  const { theme: colorMode, setTheme: setColorMode } = useTheme()
  const {
    theme,
    primaryColor,
    fontFamily,
    fontSize,
    lineHeight,
    maxWidth,
    setTheme,
    setPrimaryColor,
    setFontFamily,
    setFontSize,
    setLineHeight,
    setMaxWidth,
    resetTheme,
  } = useThemeStore()

  if (!showRightPanel)
    return null

  return (
    <aside className="w-72 bg-surface dark:bg-surface border-l border-border flex flex-col shrink-0 overflow-y-auto z-10">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="font-semibold text-sm text-gray-900 dark:text-white tracking-wide">排版设置</h2>
        <button
          onClick={resetTheme}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <span className="material-symbols-outlined text-[18px]">restart_alt</span>
        </button>
      </div>

      <div className="p-5 space-y-8">
        {/* Article Theme Section */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">文章风格</label>
          <div className="grid grid-cols-3 gap-2">
            {themeOptions.map(option => (
              <button
                key={option.value}
                onClick={() => setTheme(option.value)}
                className={cn(
                  'w-full h-9 px-2 rounded-md text-xs font-medium transition-colors text-center whitespace-nowrap',
                  theme === option.value
                    ? 'border-2 border-primary bg-primary/10 text-primary'
                    : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
                )}
                title={option.desc}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-px bg-gray-200 dark:bg-gray-700" />

        {/* Typography Section */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">字体排版</label>
          <div className="space-y-4">
            {/* Font Family */}
            <div>
              <div className="text-xs text-gray-500 mb-1">字体</div>
              <select
                value={fontFamily}
                onChange={e => setFontFamily(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md text-sm text-gray-700 dark:text-gray-200 focus:ring-primary focus:border-primary py-1.5 px-2"
              >
                {FONT_FAMILIES.map(font => (
                  <option key={font.name} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Font Size */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="text-xs text-gray-500">字号</div>
                <div className="text-xs text-gray-400 font-mono">{fontSize}</div>
              </div>
              <input
                type="range"
                min="12"
                max="24"
                value={Number.parseInt(fontSize)}
                onChange={e => setFontSize(`${e.target.value}px`)}
                className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Line Height */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="text-xs text-gray-500">行高</div>
                <div className="text-xs text-gray-400 font-mono">{lineHeight}</div>
              </div>
              <input
                type="range"
                min="1.2"
                max="2.2"
                step="0.1"
                value={Number.parseFloat(lineHeight)}
                onChange={e => setLineHeight(e.target.value)}
                className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-200 dark:bg-gray-700" />

        {/* Color Mode Section */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">颜色模式</label>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button
              onClick={() => setColorMode('light')}
              className={cn(
                'flex items-center justify-center p-2 rounded-md text-xs font-medium transition-colors',
                colorMode === 'light'
                  ? 'border-2 border-primary bg-white text-gray-800'
                  : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300',
              )}
            >
              <span className="material-symbols-outlined text-[18px] mr-1">light_mode</span>
              {' '}
              浅色
            </button>
            <button
              onClick={() => setColorMode('dark')}
              className={cn(
                'flex items-center justify-center p-2 rounded-md text-xs font-medium transition-colors',
                colorMode === 'dark'
                  ? 'border-2 border-primary bg-gray-900 text-white'
                  : 'border border-gray-200 dark:border-gray-700 bg-gray-900 text-white',
              )}
            >
              <span className="material-symbols-outlined text-[18px] mr-1">dark_mode</span>
              {' '}
              深色
            </button>
          </div>

          {/* Accent Color - 仅在简洁主题下显示 */}
          {theme === 'simple' && (
            <div>
              <div className="text-xs text-gray-500 mb-2">主题色</div>
              <div className="flex space-x-3">
                {PRIMARY_COLORS.map(color => (
                  <button
                    key={color.name}
                    onClick={() => setPrimaryColor(color.value)}
                    className={cn(
                      'w-6 h-6 rounded-full transition-all',
                      primaryColor === color.value
                        ? 'ring-2 ring-offset-2 dark:ring-offset-gray-900'
                        : 'hover:ring-2 hover:ring-offset-2 dark:ring-offset-gray-900',
                    )}
                    style={{
                      'backgroundColor': color.value,
                      '--tw-ring-color': color.value,
                    } as React.CSSProperties}
                    title={color.label}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="h-px bg-gray-200 dark:bg-gray-700" />

        {/* Layout Section */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">布局</label>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">最大宽度</span>
              <select
                value={maxWidth}
                onChange={e => setMaxWidth(e.target.value)}
                className="bg-transparent border-none text-xs text-primary font-medium focus:ring-0 p-0 cursor-pointer"
              >
                {MAX_WIDTHS.map(width => (
                  <option key={width.name} value={width.value}>
                    {width.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-300">同步滚动</span>
              <button
                onClick={() => setSyncScroll(!syncScroll)}
                className={cn(
                  'w-9 h-5 rounded-full relative transition-colors',
                  syncScroll ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600',
                )}
              >
                <span
                  className={cn(
                    'absolute top-1 w-3 h-3 bg-white rounded-full transition-all',
                    syncScroll ? 'right-1' : 'left-1',
                  )}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
