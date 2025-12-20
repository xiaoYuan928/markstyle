# 公众号排版工具 MVP 开发计划

> 版本：v1.0
> 日期：2025-12-18
> 基于 PRD 文档制定

---

## 一、项目现状分析

### 1.1 当前进度

| 模块 | 状态 | 说明 |
|-----|------|------|
| Next.js 框架 | ✅ 已完成 | apps/web 基础架构搭建完成 |
| Markdown 编辑器 | ✅ 已完成 | CodeMirror 集成完成 |
| 实时预览 | ✅ 已完成 | 基础预览功能可用 |
| 主题系统 | ⚠️ 基础 | 仅有 3 个简单主题，缺少独特设计 |
| 一键复制到公众号 | ❌ 未实现 | 旧版 Vue 有完整实现，需迁移 |
| 富文本粘贴转换 | ❌ 未实现 | 需要新开发 |

### 1.2 技术架构

```
markstyle/
├── apps/
│   ├── web/                    # 新版 Next.js 应用 (当前开发)
│   └── web-vue-backup/         # 旧版 Vue 应用 (功能参考)
├── packages/
│   ├── core/                   # 核心渲染和主题系统
│   └── shared/                 # 共享配置和主题 CSS
```

---

## 二、主题设计规划（核心差异化）

### 2.1 主题策略

**原则**：不照抄竞品，打造有自己特色的原创主题

**当前已完成 8 个原创主题**：

| 序号 | 主题名 | 设计风格 | 状态 |
|-----|--------|---------|------|
| 1 | 简洁 | 默认简约风格，专业可靠 | ✅ 已完成 |
| 2 | 墨韵 | 中国风水墨，古典优雅 | ✅ 已完成 |
| 3 | 霓虹 | 赛博朋克，发光效果 | ✅ 已完成 |
| 4 | 手账 | 手绘风格，便签纸效果 | ✅ 已完成 |
| 5 | 极简黑 | 高端商务，大留白 | ✅ 已完成 |
| 6 | 渐变 | 立体渐变，粉蓝阴影 | ✅ 已完成 |
| 7 | 多彩 | 鲜艳活泼，彩色渐变 | ✅ 已完成 |
| 8 | 科技蓝 | SaaS 风格，深蓝主色 | ✅ 已完成 |

**后续迭代**：根据用户反馈和灵感，逐步新增更多原创主题

### 2.2 主题设计要素

每个主题需要定义以下元素的**独特样式**：

```
├── 标题样式
│   ├── h1: 一级标题（居中/左对齐、边框/背景/下划线）
│   ├── h2: 二级标题（标签式/编号式/装饰线）
│   └── h3-h6: 次级标题
├── 正文样式
│   ├── 段落间距、字间距
│   └── 强调文字颜色
├── 引用块样式
│   ├── 边框样式（左边框/全边框/无边框）
│   ├── 背景色
│   └── 引号装饰
├── 代码块样式
│   ├── 背景色
│   ├── Mac 风格窗口按钮
│   └── 行号显示
├── 列表样式
│   ├── 有序列表数字样式
│   └── 无序列表标记（圆点/方块/自定义图标）
├── 表格样式
│   ├── 表头背景
│   └── 边框样式
└── 装饰元素
    ├── 分隔线
    └── 特殊标记
```

---

## 三、开发阶段规划

### Phase 1: 集成核心模块 [1-2天]

**目标**：将 packages/core 和 packages/shared 集成到 apps/web

**任务清单**：

- [ ] 1.1 配置 monorepo 依赖
  - 修改 `apps/web/package.json` 添加 `@md/core` 和 `@md/shared`
  - 配置 Next.js 支持 CSS raw 导入

- [ ] 1.2 迁移渲染器
  - 用 `@md/core` 的 `initRenderer` 替换当前简单渲染
  - 文件：`apps/web/src/stores/render.ts`

- [ ] 1.3 集成主题应用系统
  - 导入 `themeMap`、`baseCSSContent`
  - 实现 `applyTheme()` 功能
  - 文件：`apps/web/src/stores/theme.ts`

**关键文件**：
```
apps/web/src/stores/render.ts
apps/web/src/stores/theme.ts
apps/web/package.json
packages/core/src/theme/themeApplicator.ts
packages/shared/src/configs/theme-css/
```

---

### Phase 2: 一键复制到公众号 [2-3天]

**目标**：实现复制到公众号功能，样式在微信正确显示

**任务清单**：

- [ ] 2.1 创建剪贴板工具
  - 从旧版迁移 `clipboard.ts`
  - 实现 `copyHtml()` 富文本复制
  - 新建：`apps/web/src/utils/clipboard.ts`

- [ ] 2.2 CSS 内联化处理
  - 安装 `juice` 库
  - 实现 CSS 合并和内联样式
  - 处理 CSS 变量 `var(--md-primary-color)` 替换

- [ ] 2.3 微信兼容性处理
  - 图片尺寸属性转换（width/height → style）
  - SVG/Mermaid 图表兼容
  - 外链引用处理

- [ ] 2.4 UI 集成
  - Header 添加"复制到公众号"按钮
  - 复制成功/失败提示
  - 文件：`apps/web/src/components/editor/EditorHeader.tsx`

**参考代码**：
```
apps/web-vue-backup/src/utils/clipboard.ts
apps/web-vue-backup/src/utils/index.ts (processClipboardContent)
```

---

### Phase 3: 主题系统完善 [1-2天]

**目标**：完善现有 3 个主题，确保在公众号中显示正确

**任务清单**：

- [ ] 3.1 优化现有主题
  - [ ] 经典（default）：检查公众号兼容性
  - [ ] 优雅（grace）：检查公众号兼容性
  - [ ] 简洁（simple）：检查公众号兼容性

- [ ] 3.2 主题选择器 UI
  - 卡片式主题预览
  - 主题预览缩略图
  - 文件：`apps/web/src/components/editor/SettingsPanel.tsx`

- [ ] 3.3 预留扩展接口
  - 确保主题系统易于扩展
  - 后续可方便添加新主题

**现有 CSS 文件**：
```
packages/shared/src/configs/theme-css/
├── base.css           # 基础样式
├── default.css        # 经典
├── grace.css          # 优雅
└── simple.css         # 简洁
```

> 💡 **后续迭代**：有原创设计灵感后再新增主题

---

### Phase 4: 富文本粘贴转换 [2-3天]

**目标**：支持从飞书/Notion 复制内容，自动转换为 Markdown

**任务清单**：

- [ ] 4.1 剪贴板事件监听
  - 监听编辑器 `paste` 事件
  - 检测粘贴内容类型（HTML/纯文本/Markdown）

- [ ] 4.2 HTML to Markdown 转换器
  - 使用 `turndown` 库
  - 处理飞书特有 HTML 结构
  - 处理 Notion 导出格式
  - 新建：`apps/web/src/utils/htmlToMarkdown.ts`

- [ ] 4.3 格式优化
  - 清理多余空行和空格
  - 保留图片链接
  - 表格转换处理

- [ ] 4.4 集成到编辑器
  - 文件：`apps/web/src/components/editor/CodeMirrorEditor.tsx`

---

### Phase 5: UI 优化与品牌 [1-2天]

**目标**：简化界面，突出核心功能

**任务清单**：

- [ ] 5.1 界面优化
  - 突出主题选择入口
  - 简化工具栏
  - 移动端适配

- [ ] 5.2 品牌元素
  - 更新产品名称和 Logo
  - 修改页面标题和 SEO 描述
  - 更新 favicon

- [ ] 5.3 主题预览增强
  - 主题缩略图生成
  - 主题一键试用

---

## 四、时间规划

| Phase | 内容 | 预估时间 | 优先级 |
|-------|------|---------|--------|
| Phase 1 | 集成核心模块 | 1-2天 | P0 |
| Phase 2 | 一键复制到公众号 | 2-3天 | P0 |
| Phase 3 | 主题系统完善（现有3个） | 1-2天 | P0 |
| Phase 4 | 富文本粘贴转换 | 2-3天 | P1 |
| Phase 5 | UI 优化与品牌 | 1-2天 | P2 |

**总计预估：7-12 天**

---

## 五、验收标准

### MVP 完成标志

- [ ] 3 个主题可用且在公众号显示正确
- [ ] 主题切换实时预览
- [ ] 一键复制到公众号，样式在微信正确显示
- [ ] 支持从飞书/Notion 粘贴内容自动转 Markdown
- [ ] 粘贴后 500ms 内完成渲染
- [ ] 复制成功率 > 95%

### 主题验收标准

每个主题需满足：
- [ ] 在微信公众号中显示正确
- [ ] 标题、引用、代码块样式协调
- [ ] 主题系统易于扩展（方便后续新增）

---

## 六、关键文件索引

### 需要修改的文件

```
apps/web/
├── package.json                              # 添加依赖
├── src/
│   ├── stores/
│   │   ├── theme.ts                          # 集成主题系统
│   │   └── render.ts                         # 集成渲染器
│   ├── components/editor/
│   │   ├── SettingsPanel.tsx                 # 主题选择器重构
│   │   ├── EditorHeader.tsx                  # 添加复制按钮
│   │   └── CodeMirrorEditor.tsx              # 粘贴处理
│   └── utils/
│       ├── clipboard.ts                      # 新建
│       └── htmlToMarkdown.ts                 # 新建
```

### 需要新建的文件

```
apps/web/src/utils/
├── clipboard.ts                              # 剪贴板工具
└── htmlToMarkdown.ts                         # HTML 转 Markdown
```

> 💡 原创主题 CSS 文件待有设计灵感后新增

### 参考文件（旧版 Vue）

```
apps/web-vue-backup/src/
├── utils/clipboard.ts                        # 复制功能参考
├── utils/index.ts                            # processClipboardContent
├── stores/theme.ts                           # 主题 store 参考
└── stores/render.ts                          # 渲染 store 参考
```

---

## 七、进度跟踪

### 当前状态

- [x] PRD 文档编写完成
- [x] 开发计划制定完成
- [x] Phase 1: 集成核心模块
  - [x] 1.1 配置 @md/core 和 @md/shared 依赖
  - [x] 1.2 迁移渲染器到 @md/core
  - [x] 1.3 集成主题系统
- [x] Phase 2: 一键复制到公众号
  - [x] 2.1 创建剪贴板工具 (clipboard.ts)
  - [x] 2.2 CSS 内联化处理 (juice)
  - [x] 2.3 微信兼容性处理
  - [x] 2.4 UI 集成（Header 复制按钮）
- [x] Phase 3: 主题系统完善
  - [x] 修复 WeChat 兼容性问题 (hsl变量、color-mix)
  - [x] 3 个主题可用：经典、优雅、简洁
- [x] Phase 4: 富文本粘贴转换
  - [x] 4.1 创建 htmlToMarkdown 工具 (turndown)
  - [x] 4.2 集成到 CodeMirror 编辑器
  - [x] 支持飞书/Notion 格式转换
- [x] Phase 5: UI 优化与品牌
  - [x] 更新产品名称为 MarkStyle
  - [x] 更新 SEO 元数据（中文标题和描述）
  - [x] 复制按钮中文化
- [x] Phase 6: 编辑器功能增强
  - [x] 6.1 实现同步滚动功能（编辑器与预览联动）
  - [x] 6.2 文档重命名功能（双击或菜单重命名）
  - [x] 6.3 文档删除功能（菜单删除）
  - [x] 6.4 侧边栏 UI 中文化
- [x] Phase 7: 设置面板功能完善
  - [x] 7.1 行高（Line Height）设置生效
  - [x] 7.2 最大宽度（Max Width）设置生效
  - [x] 7.3 显示行号（Show Line Numbers）设置生效
- [x] Phase 8: 文档存储优化
  - [x] 8.1 安装 Dexie.js 依赖
  - [x] 8.2 创建 IndexedDB 数据库层 (lib/db.ts)
  - [x] 8.3 重构 post store 使用 IndexedDB 持久化
  - [x] 8.4 实现 localStorage → IndexedDB 自动迁移
  - [x] 8.5 实现 Markdown 文件导入功能（侧边栏导入按钮）
- [x] Phase 9: 侧边栏交互优化
  - [x] 9.1 添加回收站功能（软删除、恢复、彻底删除、清空）
  - [x] 9.2 默认文档标题改为"欢迎使用 MarkStyle"
  - [x] 9.3 移除顶部 Header 的文档重命名输入框
  - [x] 9.4 实现侧边栏可折叠功能
  - [x] 9.5 实现侧边栏宽度可拖拽调整（180px-400px）
  - [x] 9.6 优化折叠/展开按钮 UX（统一放在底部位置）
- [x] Phase 10: UI 细节优化
  - [x] 10.1 侧边栏字体大小调整（与其他区域协调）
  - [x] 10.2 拖拽到阈值自动收缩侧边栏（<120px 自动收缩，红色提示）
  - [x] 10.3 新建文档默认名称改为"未命名文档"
  - [x] 10.4 修复 h2 标题文字颜色问题（白色文字 + !important）
  - [x] 10.5 工具栏添加"去除图片注释"功能（去除 ![img] 等 alt 文本）
- [x] Phase 11: 主题系统扩展
  - [x] 11.1 修复代码块样式问题（伪元素污染、边框泄漏）
  - [x] 11.2 修复行高调节功能（CSS 变量 --md-line-height）
  - [x] 11.3 优化各主题标题间距
  - [x] 11.4 新增"墨韵"主题（ink）- 中国风水墨
  - [x] 11.5 新增"霓虹"主题（neon）- 赛博朋克
  - [x] 11.6 新增"手账"主题（journal）- 手绘风格
  - [x] 11.7 新增"极简黑"主题（noir）- 高端商务
  - [x] 11.8 新增"渐变"主题（gradient）- 立体渐变效果
  - [x] 11.9 新增"多彩"主题（vivid）- 鲜艳活泼
  - [x] 11.10 新增"科技蓝"主题（tech）- SaaS 风格
- [x] Phase 12: 品牌与部署
  - [x] 12.1 更新网站图标（favicon）为 Material Icons edit_note
  - [x] 12.2 配置 .gitignore
  - [x] 12.3 部署到 Vercel
  - [x] 12.4 配置自定义域名 markstyle.org

### 更新记录

| 日期 | 更新内容 |
|------|---------|
| 2025-12-18 | 创建开发计划文档 |
| 2025-12-18 | 完成 Phase 1 核心模块集成 |
| 2025-12-18 | 完成 Phase 2 一键复制到公众号功能 |
| 2025-12-18 | 完成 Phase 3 主题系统完善 |
| 2025-12-18 | 完成 Phase 4 富文本粘贴转换 |
| 2025-12-18 | 完成 Phase 5 UI 优化与品牌 |
| 2025-12-18 | **MVP 开发完成** |
| 2025-12-19 | 完成 Phase 6 编辑器功能增强（同步滚动、文档重命名/删除） |
| 2025-12-19 | 完成 Phase 7 设置面板功能完善（行高、最大宽度、显示行号） |
| 2025-12-19 | 完成 Phase 8 文档存储优化（IndexedDB + Markdown导入） |
| 2025-12-19 | 完成 Phase 9 侧边栏交互优化（可折叠、可拖拽调整宽度） |
| 2025-12-19 | 完成 Phase 10 UI 细节优化（字体、自动收缩、h2修复、去除图片注释） |
| 2025-12-20 | 完成 Phase 11 主题系统扩展（新增 7 个主题：墨韵、霓虹、手账、极简黑、渐变、多彩、科技蓝） |
| 2025-12-20 | 完成 Phase 12 品牌与部署（favicon、Vercel 部署、域名配置） |

---

## 八、主题列表

当前已实现 **10 个主题**：

| 序号 | 主题名 | 英文标识 | 设计风格 | 状态 |
|-----|--------|---------|---------|------|
| 1 | 简洁 | simple | 默认简约风格，专业可靠 | ✅ 已完成 |
| 2 | 墨韵 | ink | 中国风水墨，古典优雅 | ✅ 已完成 |
| 3 | 霓虹 | neon | 赛博朋克，发光效果 | ✅ 已完成 |
| 4 | 手账 | journal | 手绘风格，便签纸效果 | ✅ 已完成 |
| 5 | 极简黑 | noir | 高端商务，大留白 | ✅ 已完成 |
| 6 | 渐变 | gradient | 立体渐变，粉蓝阴影 | ✅ 已完成 |
| 7 | 多彩 | vivid | 鲜艳活泼，彩色渐变 | ✅ 已完成 |
| 8 | 科技蓝 | tech | SaaS 风格，深蓝主色 | ✅ 已完成 |

### 主题文件位置

```
packages/shared/src/configs/theme-css/index.ts  # 所有主题 CSS 定义
packages/shared/src/configs/theme.ts            # 主题选项配置
```

---

_文档结束_
