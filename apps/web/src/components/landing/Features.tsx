const features = [
  {
    icon: 'edit_note',
    title: 'Markdown 实时预览',
    description: '左侧编写 Markdown，右侧实时预览排版效果，所见即所得',
  },
  {
    icon: 'palette',
    title: '20+ 精美主题',
    description: '从简洁、国风到赛博、纸感、手绘，持续更新，满足不同需求',
  },
  {
    icon: 'content_copy',
    title: '一键复制',
    description: '一键复制富文本，直接粘贴到微信公众号后台，保持完美排版',
  },
  {
    icon: 'upload_file',
    title: '飞书/Notion 支持',
    description: '从飞书、Notion 等应用粘贴内容，自动转换为 Markdown 格式',
  },
  {
    icon: 'dark_mode',
    title: '深色模式',
    description: '支持明暗主题切换，保护眼睛，夜间编辑更舒适',
  },
  {
    icon: 'auto_awesome',
    title: 'AI 封面生成',
    description: '免登录每日 3 次，注册赠 20 积分，支持多尺寸公众号封面',
  },
]

export function Features() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            为什么选择 MarkStyle
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            简单易用，功能强大，让公众号排版不再是难题
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="w-12 h-12 flex items-center justify-center bg-blue-100 dark:bg-blue-900/50 rounded-xl mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400 text-2xl">
                  {feature.icon}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
