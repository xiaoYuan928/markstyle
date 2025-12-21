import Link from 'next/link'

const themes = [
  {
    name: 'simple',
    label: '简洁',
    desc: '干净清爽，适合各类内容',
    colors: ['#3b82f6', '#e5e7eb', '#ffffff'],
  },
  {
    name: 'ink',
    label: '墨韵',
    desc: '中国风水墨，古典雅致',
    colors: ['#1a1a1a', '#8b4513', '#f5f5dc'],
  },
  {
    name: 'neon',
    label: '霓虹',
    desc: '赛博朋克风格，科技感十足',
    colors: ['#00ffff', '#ff00ff', '#1a1a2e'],
  },
  {
    name: 'journal',
    label: '手账',
    desc: '手绘风格，温馨可爱',
    colors: ['#ff6b6b', '#4ecdc4', '#ffe66d'],
  },
  {
    name: 'noir',
    label: '极简黑',
    desc: '高端商务，简约大气',
    colors: ['#000000', '#333333', '#ffffff'],
  },
  {
    name: 'gradient',
    label: '渐变',
    desc: '立体渐变，时尚现代',
    colors: ['#667eea', '#764ba2', '#f093fb'],
  },
  {
    name: 'vivid',
    label: '多彩',
    desc: '鲜艳活泼，吸引眼球',
    colors: ['#ff4757', '#2ed573', '#1e90ff'],
  },
  {
    name: 'tech',
    label: '科技蓝',
    desc: 'SaaS风格，专业可靠',
    colors: ['#1e3a5f', '#9333ea', '#3b82f6'],
  },
]

export function ThemeShowcase() {
  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            8 种精美主题
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            多种风格任你选择，让每篇文章都独具特色
          </p>
        </div>

        {/* Themes grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {themes.map((theme) => (
            <Link
              key={theme.name}
              href={`/?theme=${theme.name}`}
              className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              {/* Color preview */}
              <div className="h-32 relative overflow-hidden">
                <div className="absolute inset-0 flex">
                  {theme.colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="flex-1 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                {/* Overlay with theme name */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white font-medium">点击预览</span>
                </div>
              </div>

              {/* Theme info */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {theme.label}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {theme.desc}
                </p>
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
