import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* CTA Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            准备好让你的公众号文章更出彩了吗？
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            免费使用，无需注册；每日 3 次免登录封面生成，注册再送 20 积分。
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105"
          >
            <span className="material-symbols-outlined mr-2">rocket_launch</span>
            开始使用 MarkStyle
          </Link>
          <div className="mt-4 text-sm text-gray-400">
            有想法或问题？
            <a href="mailto:hi@markstyle.org" className="text-blue-300 hover:text-blue-200 underline underline-offset-4">发送反馈</a>
          </div>
        </div>
      </div>

      {/* Footer links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-500 text-2xl">edit_note</span>
            <span className="text-xl font-semibold text-white">MarkStyle</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <Link href="/" className="hover:text-white transition-colors">
              编辑器
            </Link>
            <a href="mailto:hi@markstyle.org" className="hover:text-white transition-colors">
              反馈与建议
            </a>
          </div>

          {/* Copyright */}
          <div className="text-sm text-gray-500">
            &copy;
            {' '}
            {currentYear}
            {' '}
            MarkStyle. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
