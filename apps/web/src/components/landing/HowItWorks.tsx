const steps = [
  {
    number: '1',
    icon: 'edit',
    title: '编写内容',
    description: '使用 Markdown 语法编写文章，或从飞书、Notion 粘贴内容',
  },
  {
    number: '2',
    icon: 'visibility',
    title: '预览效果',
    description: '实时预览排版效果，选择喜欢的主题风格',
  },
  {
    number: '3',
    icon: 'content_copy',
    title: '一键复制',
    description: '点击复制按钮，直接粘贴到公众号后台发布',
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            三步完成排版
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            简单三步，让你的公众号文章焕然一新
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line (desktop) */}
          <div className="hidden md:block absolute top-24 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 dark:from-blue-800 dark:via-blue-600 dark:to-blue-800" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative text-center">
                {/* Step number circle */}
                <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30">
                  <span className="material-symbols-outlined text-white text-3xl">
                    {step.icon}
                  </span>
                  {/* Step number badge */}
                  <span className="absolute -top-2 -right-2 w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full text-blue-600 font-bold text-lg shadow-md">
                    {step.number}
                  </span>
                </div>

                {/* Step content */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
