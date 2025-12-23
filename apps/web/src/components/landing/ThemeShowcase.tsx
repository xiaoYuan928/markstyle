'use client'

import Link from 'next/link'

const themes = [
  { name: 'simple', label: '简洁', desc: '默认干净可读', primary: '#2563eb', bg: '#f8fafc', accent: '#e2e8f0' },
  { name: 'ink', label: '墨韵', desc: '中国风水墨', primary: '#c2410c', bg: '#faf3e7', accent: '#e8d5c4' },
  { name: 'neon', label: '霓虹', desc: '赛博朋克', primary: '#00d9ff', bg: '#0f172a', accent: '#a855f7' },
  { name: 'journal', label: '手账', desc: '手绘便签', primary: '#f97316', bg: '#fffaf0', accent: '#fde68a' },
  { name: 'noir', label: '极简黑', desc: '商务留白', primary: '#0f172a', bg: '#ffffff', accent: '#e5e7eb' },
  { name: 'gradient', label: '渐变', desc: '粉蓝立体', primary: '#667eea', bg: '#f8f9ff', accent: '#f093fb' },
  { name: 'vivid', label: '多彩', desc: '活泼渐变', primary: '#f97316', bg: '#fff7ed', accent: '#22c55e' },
  { name: 'tech', label: '科技蓝', desc: 'SaaS 专业', primary: '#1e3a5f', bg: '#f1f5f9', accent: '#3b82f6' },
  { name: 'magazine', label: '杂志', desc: '纸感衬线', primary: '#e63946', bg: '#f7f4ed', accent: '#1d4ed8' },
  { name: 'glass', label: '玻璃', desc: '淡彩拟态', primary: '#4f46e5', bg: '#f8fafc', accent: '#67e8f9' },
  { name: 'grid', label: '方格本', desc: '网格手账', primary: '#2563eb', bg: '#fdfdf9', accent: '#c7d8ff' },
  { name: 'doodle', label: '涂鸦', desc: '手绘符号', primary: '#f97316', bg: '#fffdf7', accent: '#10b981' },
] as const

function ThemePreviewCard({ theme }: { theme: typeof themes[number] }) {
  return (
    <div
      className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 shadow-sm"
      style={{ background: theme.bg }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className="inline-block w-2 h-6 rounded-full"
          style={{ background: theme.primary }}
        />
        <span className="text-sm font-semibold text-gray-900 dark:text-white">{theme.label}</span>
      </div>
      <div
        className="rounded-lg p-3 text-sm space-y-2 border border-gray-100 dark:border-gray-800"
        style={{ background: 'rgba(255,255,255,0.75)' }}
      >
        <div className="font-semibold text-gray-900 dark:text-white">标题示例</div>
        <p className="text-xs text-gray-700 dark:text-gray-200">正文段落，展示行距与色彩。</p>
        <div className="flex items-center gap-2">
          <span className="rounded-full px-2 py-0.5 text-[11px] font-medium text-white" style={{ background: theme.primary }}>标签</span>
          <span className="text-[11px] text-gray-600 dark:text-gray-300" style={{ color: theme.primary }}>链接</span>
        </div>
        <div
          className="rounded-md px-2 py-1 text-[11px] font-mono"
          style={{ background: theme.accent, color: theme.primary }}
        >
          console.log('Hello')
        </div>
      </div>
    </div>
  )
}

export function ThemeShowcase() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            20+ 精美主题，持续更新
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            从国风水墨到赛博霓虹，从手账纸感到极简商务，点击预览查看效果
          </p>
        </div>

        {/* Themes grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {themes.map(theme => (
            <Link
              key={theme.name}
              href={`/?theme=${theme.name}`}
              className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg transition-all hover:shadow-xl hover:-translate-y-1 border border-gray-200 dark:border-gray-700 text-left"
            >
              <ThemePreviewCard theme={theme} />
              <div className="px-4 pb-4">
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">{theme.label}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{theme.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 text-base font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400"
          >
            <span>查看全部主题效果</span>
            <span className="material-symbols-outlined ml-1">arrow_forward</span>
          </Link>
        </div>
      </div>

    </section>
  )
}
