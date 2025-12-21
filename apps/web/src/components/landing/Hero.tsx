import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 py-20 sm:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-100 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-full shadow-lg">
            <span className="material-symbols-outlined text-primary text-3xl">edit_note</span>
            <span className="text-xl font-semibold text-gray-900 dark:text-white">MarkStyle</span>
          </div>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
          让公众号排版
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            更简单
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10">
          免费的 Markdown 编辑器，8+ 精美主题，一键复制到微信公众号。
          <br className="hidden sm:block" />
          支持从飞书、Notion 粘贴内容自动转换。
        </p>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105 hover:shadow-xl"
          >
            <span className="material-symbols-outlined mr-2">edit_note</span>
            立即开始使用
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">8+</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">精美主题</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">100%</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">免费使用</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-white">0</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">需登录</div>
          </div>
        </div>
      </div>
    </section>
  )
}
