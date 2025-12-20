import type { ThemeName } from '@md/shared/configs'
import { themeOptions } from '@md/shared/configs'
import { applyTheme as applyThemeCore } from '@md/core/theme'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Re-export theme options from shared package
export { themeOptions }
export type { ThemeName }

export const PRIMARY_COLORS = [
  { name: 'blue', value: '#3B82F6', label: 'Blue' },
  { name: 'purple', value: '#8B5CF6', label: 'Purple' },
  { name: 'green', value: '#22C55E', label: 'Green' },
  { name: 'orange', value: '#F97316', label: 'Orange' },
  { name: 'gray', value: '#1F2937', label: 'Gray' },
] as const

export const FONT_FAMILIES = [
  { name: 'noto', value: '"Noto Sans SC", sans-serif', label: 'Noto Sans SC' },
  { name: 'inter', value: 'Inter, sans-serif', label: 'Inter' },
  { name: 'merriweather', value: 'Merriweather, serif', label: 'Merriweather' },
  { name: 'jetbrains', value: '"JetBrains Mono", monospace', label: 'JetBrains Mono' },
] as const

export const FONT_SIZES = ['14px', '15px', '16px', '17px', '18px'] as const

export const LINE_HEIGHTS = ['1.4', '1.5', '1.6', '1.8', '2.0'] as const
export const MAX_WIDTHS = [
  { name: 'reading', value: '65ch', label: 'Reading (65ch)' },
  { name: 'wide', value: '80ch', label: 'Wide' },
  { name: 'full', value: '100%', label: 'Full' },
] as const

export const CODE_THEMES = [
  'github',
  'github-dark',
  'monokai',
  'vs',
  'vs2015',
  'atom-one-dark',
  'atom-one-light',
  'dracula',
  'nord',
  'tokyo-night-dark',
] as const

export type CodeThemeName = (typeof CODE_THEMES)[number]

interface ThemeState {
  // Theme settings
  theme: ThemeName
  primaryColor: string
  fontFamily: string
  fontSize: string
  lineHeight: string
  maxWidth: string
  codeBlockTheme: CodeThemeName

  // Typography options
  isUseIndent: boolean
  isUseJustify: boolean
  isMacCodeBlock: boolean
  isShowLineNumber: boolean

  // Actions
  setTheme: (theme: ThemeName) => void
  setPrimaryColor: (color: string) => void
  setFontFamily: (font: string) => void
  setFontSize: (size: string) => void
  setLineHeight: (height: string) => void
  setMaxWidth: (width: string) => void
  setCodeBlockTheme: (theme: CodeThemeName) => void
  setUseIndent: (use: boolean) => void
  setUseJustify: (use: boolean) => void
  setMacCodeBlock: (use: boolean) => void
  setShowLineNumber: (show: boolean) => void
  resetTheme: () => void
  applyCurrentTheme: () => Promise<void>
}

const defaultState = {
  theme: 'simple' as ThemeName,
  primaryColor: '#3B82F6',
  fontFamily: FONT_FAMILIES[0].value,
  fontSize: '16px',
  lineHeight: '1.6',
  maxWidth: '65ch',
  codeBlockTheme: 'github' as CodeThemeName,
  isUseIndent: false,
  isUseJustify: false,
  isMacCodeBlock: true,
  isShowLineNumber: true,
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      ...defaultState,

      setTheme: (theme) => {
        set({ theme })
        get().applyCurrentTheme()
      },

      setPrimaryColor: (primaryColor) => {
        set({ primaryColor })
        get().applyCurrentTheme()
      },

      setFontFamily: (fontFamily) => {
        set({ fontFamily })
        get().applyCurrentTheme()
      },

      setFontSize: (fontSize) => {
        set({ fontSize })
        get().applyCurrentTheme()
      },

      setLineHeight: (lineHeight) => {
        set({ lineHeight })
        get().applyCurrentTheme()
      },

      setMaxWidth: (maxWidth) => {
        set({ maxWidth })
        get().applyCurrentTheme()
      },

      setCodeBlockTheme: codeBlockTheme => set({ codeBlockTheme }),
      setUseIndent: isUseIndent => set({ isUseIndent }),
      setUseJustify: isUseJustify => set({ isUseJustify }),
      setMacCodeBlock: isMacCodeBlock => set({ isMacCodeBlock }),
      setShowLineNumber: isShowLineNumber => set({ isShowLineNumber }),

      resetTheme: () => {
        set(defaultState)
        get().applyCurrentTheme()
      },

      applyCurrentTheme: async () => {
        const state = get()
        try {
          await applyThemeCore({
            themeName: state.theme,
            variables: {
              primaryColor: state.primaryColor,
              fontSize: state.fontSize,
              fontFamily: state.fontFamily,
              lineHeight: state.lineHeight,
              maxWidth: state.maxWidth,
            },
          })
        }
        catch (error) {
          console.error('Failed to apply theme:', error)
        }
      },
    }),
    {
      name: 'md-theme-storage',
    },
  ),
)
