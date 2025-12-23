/**
 * CSS 主题导出
 * 使用模板字符串嵌入 CSS 内容（兼容 Next.js/Turbopack）
 */

/**
 * 基础样式 CSS
 */
export const baseCSSContent = `
/**
 * MD 基础主题样式
 * 包含所有元素的基础样式和 CSS 变量定义
 */

/* ==================== 容器样式 ==================== */
section,
container {
  font-family: var(--md-font-family);
  font-size: var(--md-font-size);
  line-height: var(--md-line-height, 1.75);
  text-align: left;
}

/* 确保 #output 容器应用基础样式 */
#output {
  font-family: var(--md-font-family);
  font-size: var(--md-font-size);
  line-height: var(--md-line-height, 1.75);
  text-align: left;
}

/* 去除第一个元素的 margin-top */
#output section > :first-child {
  margin-top: 0 !important;
}

/* 全局列表重置，避免默认数字/圆点叠加 */
#output ol,
#output ul {
  list-style: none !important;
  padding-left: 0 !important;
  margin-left: 0 !important;
}

#output ol li,
#output ul li {
  list-style: none !important;
}

#output ol li::marker,
#output ul li::marker {
  content: '' !important;
  display: none !important;
  font-size: 0 !important;
  color: transparent !important;
}

/* 如需临时去掉所有自定义列表样式，恢复浏览器默认 */
#output ol,
#output ul {
  list-style: revert !important;
  padding-left: 1.2em !important;
  margin-left: 0 !important;
}

#output li {
  position: static !important;
  padding-left: 0 !important; /* marker 控制缩进 */
  list-style: revert !important;
}

#output li::before,
#output ol li::before,
#output ul li::before,
#output li::after {
  content: none !important;
  box-shadow: none !important;
  background: none !important;
  width: auto;
  height: auto;
}

#output ol li::marker,
#output ul li::marker {
  content: initial !important;
  color: currentColor !important;
  font-size: inherit !important;
  display: inline !important;
}

/* ==================== 代码块通用样式 ==================== */
/* 代码块容器 - 完整样式确保所有主题一致 */
pre.code__pre,
.hljs.code__pre {
  position: relative;
  font-size: 90%;
  overflow-x: auto;
  border-radius: 8px;
  padding: 0 !important;
  line-height: 1.5;
  margin: 10px 8px;
  background: #282c34 !important;
  border: none;
}

/* 代码块内的 code 标签样式 - 覆盖行内代码样式 */
pre.code__pre > code,
.hljs.code__pre > code {
  display: -webkit-box;
  padding: 0.5em 1em 1em;
  overflow-x: auto;
  text-indent: 0;
  color: #abb2bf;
  background: transparent !important;
  white-space: nowrap;
  margin: 0;
  border: none !important;
  border-radius: 0 !important;
  box-shadow: none !important;
  font-family:
    'Fira Code',
    Menlo,
    Operator Mono,
    Consolas,
    Monaco,
    monospace;
}

/* 重置代码块内所有元素的伪元素，防止主题样式污染 */
pre.code__pre *::before,
.hljs.code__pre *::before,
pre.code__pre *::after,
.hljs.code__pre *::after {
  content: none !important;
  display: none !important;
}

/* Mac 风格按钮 - 保留其伪元素 */
.mac-sign {
  display: flex;
  align-items: center;
}

/* 确保代码块内的 section 不受外部样式影响 */
pre.code__pre section,
.hljs.code__pre section {
  background: transparent;
  border: none;
  margin: 0;
  padding: 0;
}

/* 代码块内按钮元素的通用样式 */
pre.code__pre button,
.hljs.code__pre button {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #ccc;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background 0.2s;
}

pre.code__pre button:hover,
.hljs.code__pre button:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 复制按钮样式 */
pre.code__pre .copy-btn,
.hljs.code__pre .copy-btn,
pre.code__pre .copy-button,
.hljs.code__pre .copy-button,
pre.code__pre [class*="copy"],
.hljs.code__pre [class*="copy"] {
  position: absolute;
  right: 8px;
  top: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: #ccc;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  z-index: 10;
}

pre.code__pre .copy-btn:hover,
.hljs.code__pre .copy-btn:hover,
pre.code__pre .copy-button:hover,
.hljs.code__pre .copy-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* 确保语言标签样式正确 */
pre.code__pre [class*="lang-label"],
.hljs.code__pre [class*="lang-label"],
pre.code__pre .language-label,
.hljs.code__pre .language-label {
  color: #ccc;
  font-size: 12px;
  background: transparent;
}
`

/**
 * 简洁主题 CSS
 */
const simpleCSS = `
/**
 * MD 简洁主题 (@okooo5km)
 * 简洁现代的设计风格
 */

/* ==================== 一级标题 ==================== */
h1 {
  display: table;
  padding: 0 1em;
  border-bottom: 2px solid var(--md-primary-color);
  margin: 1.5em auto 0.8em;
  color: #3f3f3f;
  font-size: calc(var(--md-font-size) * 1.2);
  font-weight: bold;
  text-align: center;
}

/* ==================== 二级标题 ==================== */
h2 {
  display: table;
  padding: 0.5em 1em;
  margin: 2em auto 1em;
  color: #fff !important;
  background: var(--md-primary-color);
  font-size: calc(var(--md-font-size) * 1.2);
  font-weight: bold;
  text-align: center;
  border-radius: 4px;
}

h2 * {
  color: #fff !important;
}

/* ==================== 三级标题 ==================== */
h3 {
  padding-left: 8px;
  border-left: 3px solid var(--md-primary-color);
  margin: 1.5em 8px 0.5em 0;
  color: #3f3f3f;
  font-size: calc(var(--md-font-size) * 1.1);
  font-weight: bold;
  line-height: 1.2;
}

/* ==================== 四级标题 ==================== */
h4 {
  margin: 1.5em 8px 0.5em;
  color: var(--md-primary-color);
  font-size: calc(var(--md-font-size) * 1);
  font-weight: bold;
}

/* ==================== 五级标题 ==================== */
h5 {
  margin: 1.2em 8px 0.5em;
  color: var(--md-primary-color);
  font-size: calc(var(--md-font-size) * 1);
  font-weight: bold;
}

/* ==================== 六级标题 ==================== */
h6 {
  margin: 1.5em 8px 0.5em;
  font-size: calc(var(--md-font-size) * 1);
  color: var(--md-primary-color);
}

/* ==================== 段落 ==================== */
p {
  margin: 1.5em 8px;
  letter-spacing: 0.03em;
  color: #3f3f3f;
}

/* ==================== 引用块 ==================== */
blockquote {
  font-style: normal;
  padding: 1em;
  border-left: 4px solid var(--md-primary-color);
  border-radius: 6px;
  color: #3f3f3f;
  background: #f7f7f7;
  margin-bottom: 1em;
}

blockquote > p {
  display: block;
  font-size: 1em;
  letter-spacing: 0.1em;
  color: #3f3f3f;
  margin: 0;
}

/* GFM Alert 样式覆盖 */
.markdown-alert-note,
.markdown-alert-tip,
.markdown-alert-info,
.markdown-alert-important,
.markdown-alert-warning,
.markdown-alert-caution {
  font-style: normal;
}

/* ==================== 代码块 ==================== */
pre.code__pre,
.hljs.code__pre {
  font-size: 90%;
  overflow-x: auto;
  border-radius: 8px;
  padding: 0 !important;
  line-height: 1.5;
  margin: 10px 8px;
  background: #282c34 !important;
  border: none;
}

pre.code__pre > code,
.hljs.code__pre > code {
  display: -webkit-box;
  padding: 0.5em 1em 1em;
  overflow-x: auto;
  text-indent: 0;
  color: #abb2bf;
  background: transparent;
  white-space: nowrap;
  margin: 0;
  font-family:
    'Fira Code',
    Menlo,
    Operator Mono,
    Consolas,
    Monaco,
    monospace;
}

/* ==================== 行内代码 ==================== */
code {
  font-size: 90%;
  color: #d14;
  background: rgba(27, 31, 35, 0.05);
  padding: 3px 5px;
  border-radius: 4px;
}

/* ==================== 图片 ==================== */
img {
  display: block;
  max-width: 100%;
  margin: 0.1em auto 0.5em;
  border-radius: 4px;
}

figcaption,
.md-figcaption {
  text-align: center;
  color: #888;
  font-size: 0.8em;
}

/* ==================== 列表 ==================== */
ol {
  padding-left: 0 !important;
  margin-left: 0 !important;
  color: #3f3f3f;
  list-style: none !important;
  counter-reset: simple-ol;
}

ul {
  list-style: none !important;
  padding-left: 0 !important;
  margin-left: 8px;
  color: #3f3f3f;
}

li {
  display: block;
  margin: 0.4em 0;
  color: #3f3f3f;
  position: relative;
  padding-left: 0.9em !important;
  list-style: none !important;
}

li::marker,
ol li::marker,
ul li::marker {
  content: '' !important;
  display: none !important;
}

ol > li {
  padding-left: 1.6em !important;
}

ol > li::before {
  content: counter(simple-ol) '.';
  counter-increment: simple-ol;
  position: absolute;
  left: 0;
  top: 0.05em;
  width: auto;
  height: auto;
  background: transparent;
  color: var(--md-primary-color);
  font-weight: 700;
  opacity: 0.8;
  box-shadow: none;
  transform: none;
}

li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.68em;
  width: 0.5em;
  height: 0.12em;
  border-radius: 999px;
  background: var(--md-primary-color);
  opacity: 0.7;
}

/* ==================== 分隔线 ==================== */
hr {
  border-style: solid;
  border-width: 2px 0 0;
  border-color: rgba(0, 0, 0, 0.1);
  -webkit-transform-origin: 0 0;
  -webkit-transform: scale(1, 0.5);
  transform-origin: 0 0;
  transform: scale(1, 0.5);
  height: 0.4em;
  margin: 1.5em 0;
}

/* ==================== 强调 ==================== */
em {
  font-style: italic;
  font-size: inherit;
}

/* ==================== 粗体 ==================== */
strong {
  color: var(--md-primary-color);
  font-weight: bold;
  font-size: inherit;
}

/* ==================== 链接 ==================== */
a {
  color: #576b95;
  text-decoration: none;
}

/* ==================== 表格 ==================== */
table {
  color: #3f3f3f;
}

thead {
  font-weight: bold;
  color: #3f3f3f;
}

th {
  border: 1px solid #dfdfdf;
  padding: 0.7em 0.9em;
  color: #3f3f3f;
  word-break: keep-all;
  background: rgba(0, 0, 0, 0.05);
  text-align: left;
}

td {
  border: 1px solid #dfdfdf;
  padding: 0.65em 0.9em;
  color: #3f3f3f;
  word-break: keep-all;
  text-align: left;
  line-height: 1.7;
}

/* ==================== 暗色模式适配 ==================== */
.dark h1,
.dark h3 {
  color: #e5e7eb;
}

.dark p,
.dark li,
.dark ol,
.dark ul {
  color: #d1d5db;
}

.dark blockquote {
  background: #374151;
  color: #e5e7eb;
}

.dark blockquote > p {
  color: #e5e7eb;
}

.dark table,
.dark thead,
.dark th,
.dark td {
  color: #e5e7eb;
  border-color: #4b5563;
}

.dark th {
  background: rgba(255, 255, 255, 0.05);
}

.dark code {
  color: #f87171;
  background: rgba(255, 255, 255, 0.1);
}

.dark hr {
  border-color: rgba(255, 255, 255, 0.2);
}

.dark figcaption,
.dark .md-figcaption {
  color: #9ca3af;
}
`

/**
 * 墨韵主题 CSS - 中国风水墨
 */
const inkCSS = `
/**
 * MD 墨韵主题 - 中国风水墨
 * 书法、水墨、印章元素，古典优雅
 */

/* ==================== 一级标题 ==================== */
h1 {
  display: block;
  padding: 0.5em 1.5em;
  margin: 1.5em 8px 0.8em;
  color: #2c1810;
  font-size: calc(var(--md-font-size) * 1.3);
  font-weight: bold;
  text-align: center;
  position: relative;
  letter-spacing: 0.2em;
}

h1::after {
  content: '';
  display: block;
  width: 40%;
  height: 3px;
  margin: 0.5em auto 0;
  background: linear-gradient(90deg, transparent, #8B4513, #2c1810, #8B4513, transparent);
  border-radius: 2px;
}

/* ==================== 二级标题 ==================== */
h2 {
  display: flex;
  align-items: center;
  padding: 0.4em 0.8em;
  margin: 1.8em 8px 0.8em;
  color: #2c1810 !important;
  font-size: calc(var(--md-font-size) * 1.15);
  font-weight: 700;
  text-align: left;
  background: transparent;
  position: relative;
  border: 1px solid rgba(196, 30, 58, 0.08);
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.04);
}

h2::before {
  content: '◆';
  display: inline-block;
  margin-right: 0.5em;
  color: #C41E3A;
  font-size: 0.8em;
}

h2 * {
  color: #2c1810 !important;
}

/* ==================== 三级标题 ==================== */
h3 {
  padding-left: 12px;
  border-left: 4px solid;
  border-image: linear-gradient(180deg, #2c1810, #8B4513, transparent) 1;
  margin: 1.5em 8px 0.5em 0;
  color: #2c1810;
  font-size: calc(var(--md-font-size) * 1.1);
  font-weight: bold;
  line-height: 1.4;
}

/* ==================== 四级标题 ==================== */
h4 {
  margin: 1.5em 8px 0.5em;
  color: #8B4513;
  font-size: calc(var(--md-font-size) * 1);
  font-weight: bold;
}

/* ==================== 五级/六级标题 ==================== */
h5, h6 {
  margin: 1.5em 8px 0.5em;
  color: #8B4513;
  font-size: calc(var(--md-font-size) * 1);
}

/* ==================== 段落 ==================== */
p {
  margin: 1.5em 8px;
  letter-spacing: 0.08em;
  color: #3d2914;
  text-align: justify;
}

/* ==================== 引用块 - 宣纸效果 ==================== */
blockquote {
  font-style: normal;
  padding: 1.2em 1.5em;
  border: none;
  border-left: 3px solid #C41E3A;
  border-radius: 0;
  color: #5c4033;
  background: linear-gradient(135deg, #faf6f0 0%, #f5ebe0 100%);
  margin: 1.5em 8px;
  position: relative;
  box-shadow: 2px 2px 8px rgba(0,0,0,0.08);
}

blockquote::before {
  content: '"';
  position: absolute;
  top: -10px;
  left: 15px;
  font-size: 3em;
  color: #C41E3A;
  opacity: 0.3;
  font-family: Georgia, serif;
}

blockquote > p {
  display: block;
  font-size: 1em;
  letter-spacing: 0.08em;
  color: #5c4033;
  margin: 0;
}

/* ==================== 代码块 ==================== */
pre.code__pre,
.hljs.code__pre {
  border: none;
  border-radius: 8px;
  background: #282c34 !important;
}

pre.code__pre > code,
.hljs.code__pre > code {
  color: #abb2bf;
  background: transparent;
}

/* ==================== 图片 ==================== */
img {
  border-radius: 2px;
  border: 1px solid #d4c4b0;
  box-shadow: 3px 3px 10px rgba(0,0,0,0.1);
}

/* ==================== 列表 ==================== */
ul {
  list-style: none;
  padding-left: 0;
}

ol {
  list-style: none;
  padding-left: 0;
  margin-left: 8px;
  counter-reset: ink-ol;
}

li {
  margin: 0.4em 0;
  color: #3d2914;
  position: relative;
  padding-left: 0;
}

.li-bullet {
  color: #C41E3A;
}

li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.65em;
  width: 0.55em;
  height: 0.12em;
  background: linear-gradient(90deg, #C41E3A, #8B4513);
  border-radius: 999px;
  transform: rotate(-2deg);
}

ol > li {
  padding-left: 1.8em;
}

ol > li::before {
  content: counter(ink-ol) '.';
  counter-increment: ink-ol;
  position: absolute;
  left: 0;
  top: 0.05em;
  color: #C41E3A;
  font-weight: 700;
  background: transparent;
  width: auto;
  height: auto;
  transform: none;
  box-shadow: none;
}

/* ==================== 分隔线 ==================== */
hr {
  height: 1px;
  border: none;
  margin: 2em 0;
  background: linear-gradient(90deg, transparent, #8B4513, transparent);
}

/* ==================== 强调 - 朱砂色 ==================== */
strong {
  color: #C41E3A;
  font-weight: bold;
}

/* ==================== 行内代码 ==================== */
code {
  color: #8B4513;
  background: #faf6f0;
  border: 1px solid #d4c4b0;
}

/* ==================== 链接 ==================== */
a {
  color: #8B4513;
  text-decoration: none;
  border-bottom: 1px dashed #8B4513;
}

/* ==================== 表格 ==================== */
table {
  color: #3d2914;
  border: 1px solid #d4c4b0;
}

th {
  background: #faf6f0;
  border: 1px solid #d4c4b0;
  color: #2c1810;
  padding: 0.75em 1em;
}

td {
  border: 1px solid #d4c4b0;
  color: #3d2914;
  padding: 0.65em 1em;
  line-height: 1.7;
}

/* ==================== 暗色模式适配 ==================== */
.dark h1,
.dark h3 {
  color: #e8d5c4 !important;
}

.dark h1::after {
  background: linear-gradient(90deg, transparent, #c9a96e, #e8d5c4, #c9a96e, transparent);
}

.dark h2 {
  color: #e8d5c4 !important;
}

.dark h2 *,
.dark h4,
.dark h5,
.dark h6 {
  color: #c9a96e !important;
}

.dark p,
.dark li {
  color: #d4c4b0;
}

.dark blockquote {
  background: linear-gradient(135deg, #2d2520 0%, #3d322a 100%);
  color: #d4c4b0;
  border-left-color: #C41E3A;
}

.dark blockquote > p {
  color: #d4c4b0;
}

.dark pre.code__pre,
.dark .hljs.code__pre {
  border-color: #4a3f35;
  background: #2d2520;
}

.dark code {
  color: #c9a96e;
  background: #2d2520;
  border-color: #4a3f35;
}

.dark img {
  border-color: #4a3f35;
}

.dark strong {
  color: #ff6b6b;
}

.dark a {
  color: #c9a96e;
  border-bottom-color: #c9a96e;
}

.dark table,
.dark th,
.dark td {
  border-color: #4a3f35;
  color: #d4c4b0;
}

.dark th {
  background: #3d322a;
  color: #e8d5c4;
}

.dark hr {
  background: linear-gradient(90deg, transparent, #c9a96e, transparent);
}
`

/**
 * 霓虹主题 CSS - 赛博朋克
 */
const neonCSS = `
/**
 * MD 霓虹主题 - 赛博朋克
 * 发光效果、玻璃拟态、科技未来感
 */

/* ==================== 一级标题 - 发光效果 ==================== */
h1 {
  display: table;
  padding: 0.5em 1.5em;
  margin: 1.5em auto 0.8em;
  color: #00D9FF;
  font-size: calc(var(--md-font-size) * 1.3);
  font-weight: bold;
  text-align: center;
  text-shadow:
    0 0 10px #00D9FF,
    0 0 20px #00D9FF,
    0 0 40px #00D9FF;
  letter-spacing: 0.1em;
}

/* ==================== 二级标题 - 渐变发光 ==================== */
h2 {
  display: table;
  padding: 0.5em 1.2em;
  margin: 1.8em auto 0.8em;
  color: #fff !important;
  font-size: calc(var(--md-font-size) * 1.15);
  font-weight: 700;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  border-radius: 4px;
  box-shadow:
    0 0 15px rgba(102, 126, 234, 0.5),
    0 4px 15px rgba(118, 75, 162, 0.3);
}

h2 * {
  color: #fff !important;
}

/* ==================== 三级标题 - 霓虹竖线 ==================== */
h3 {
  padding-left: 15px;
  border-left: 4px solid;
  border-image: linear-gradient(180deg, #00D9FF, #f093fb, #667eea) 1;
  margin: 1.5em 8px 0.5em 0;
  color: #e0e0e0;
  font-size: calc(var(--md-font-size) * 1.1);
  font-weight: bold;
  line-height: 1.4;
}

/* ==================== 四级标题 ==================== */
h4 {
  margin: 1.5em 8px 0.5em;
  color: #00D9FF;
  font-size: calc(var(--md-font-size) * 1);
  font-weight: bold;
}

/* ==================== 五级/六级标题 ==================== */
h5, h6 {
  margin: 1.2em 8px 0.5em;
  color: #f093fb;
  font-size: calc(var(--md-font-size) * 1);
}

/* ==================== 段落 ==================== */
p {
  margin: 1.5em 8px;
  letter-spacing: 0.01em;
  color: #0f172a;
  font-weight: 600;
}

/* ==================== 引用块 - 毛玻璃效果 ==================== */
blockquote {
  font-style: normal;
  padding: 1.2em 1.5em;
  border: 1px solid rgba(0, 217, 255, 0.3);
  border-left: 4px solid #00D9FF;
  border-radius: 8px;
  color: #e5e7f0;
  background: rgba(30, 30, 50, 0.7);
  margin: 1.5em 8px;
  box-shadow:
    0 4px 30px rgba(0, 0, 0, 0.3),
    inset 0 0 20px rgba(0, 217, 255, 0.05);
}

blockquote > p {
  display: block;
  font-size: 1em;
  color: #d0d0d0;
  margin: 0;
}

/* ==================== 代码块 - 终端风格 ==================== */
pre.code__pre,
.hljs.code__pre {
  border: 1px solid rgba(0, 217, 255, 0.3);
  background: rgba(15, 15, 25, 0.9);
  box-shadow: 0 0 20px rgba(0, 217, 255, 0.1);
}

/* ==================== 图片 ==================== */
img {
  border-radius: 8px;
  border: 1px solid rgba(0, 217, 255, 0.3);
  box-shadow: 0 0 20px rgba(0, 217, 255, 0.2);
}

/* ==================== 列表 ==================== */
ul {
  list-style: none;
  padding-left: 0;
}

ol {
  list-style: none;
  padding-left: 0;
  margin-left: 8px;
  counter-reset: neon-ol;
}

li {
  margin: 0.4em 0;
  color: #0f172a;
  position: relative;
  padding-left: 0;
}

.li-bullet {
  color: #00D9FF;
  text-shadow: 0 0 5px #00D9FF;
}

li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.75em;
  width: 0.6em;
  height: 0.12em;
  border-radius: 999px;
  background: linear-gradient(90deg, #00D9FF, #f093fb);
  box-shadow: 0 0 8px rgba(0, 217, 255, 0.45);
}

ol > li {
  padding-left: 1.8em;
}

ol > li::before {
  content: counter(neon-ol) '.';
  counter-increment: neon-ol;
  position: absolute;
  left: 0;
  top: 0.05em;
  color: #00D9FF;
  font-weight: 700;
  text-shadow: 0 0 10px rgba(0, 217, 255, 0.55);
  background: transparent;
  width: auto;
  height: auto;
  box-shadow: none;
}

/* ==================== 分隔线 ==================== */
hr {
  height: 2px;
  border: none;
  margin: 2em 0;
  background: linear-gradient(90deg, transparent, #00D9FF, #f093fb, #667eea, transparent);
  box-shadow: 0 0 10px rgba(0, 217, 255, 0.5);
}

/* ==================== 强调 - 发光 ==================== */
strong {
  color: #00D9FF;
  font-weight: bold;
  text-shadow: 0 0 8px rgba(0, 217, 255, 0.5);
}

/* ==================== 行内代码 - 绿色终端 ==================== */
code {
  color: #50fa7b;
  background: rgba(15, 15, 25, 0.8);
  border: 1px solid rgba(80, 250, 123, 0.3);
  padding: 3px 6px;
  border-radius: 4px;
}

/* ==================== 链接 ==================== */
a {
  color: #f093fb;
  text-decoration: none;
  text-shadow: 0 0 5px rgba(240, 147, 251, 0.3);
}

/* ==================== 表格 ==================== */
table {
  color: #c0c0c0;
  border: 1px solid rgba(0, 217, 255, 0.3);
}

th {
  background: rgba(0, 217, 255, 0.15);
  border: 1px solid rgba(0, 217, 255, 0.3);
  color: #00D9FF;
  padding: 0.75em 1em;
}

td {
  border: 1px solid rgba(0, 217, 255, 0.2);
  color: #c0c0c0;
  padding: 0.65em 1em;
  line-height: 1.7;
}

/* ==================== 暗色模式（霓虹主题本身偏暗，保持一致） ==================== */
.dark h1 {
  color: #00D9FF;
}

.dark h3 {
  color: #e0e0e0;
}

.dark p,
.dark li {
  color: #c0c0c0;
}

.dark blockquote {
  background: rgba(20, 20, 35, 0.8);
}

.dark blockquote > p {
  color: #d0d0d0;
}
`

/**
 * 手账主题 CSS - 手写手绘风
 */
const journalCSS = `
/**
 * MD 手账主题 - 手写手绘风
 * 手账本、便签纸、手绘装饰
 */

/* ==================== 一级标题 - 波浪下划线 ==================== */
h1 {
  display: table;
  padding: 0.5em 1em;
  margin: 1.5em auto 0.8em;
  color: #2d3436;
  font-size: calc(var(--md-font-size) * 1.3);
  font-weight: bold;
  text-align: center;
  position: relative;
}

h1::after {
  content: '〰️〰️〰️';
  display: block;
  text-align: center;
  margin-top: 0.3em;
  font-size: 0.5em;
  letter-spacing: -0.2em;
  opacity: 0.6;
}

/* ==================== 二级标题 - 贴纸效果 ==================== */
h2 {
  display: inline-block;
  padding: 0.4em 1em 0.4em 0.8em;
  margin: 1.8em 8px 0.8em;
  color: #fff !important;
  font-size: calc(var(--md-font-size) * 1.15);
  font-weight: bold;
  text-align: left;
  background: var(--md-primary-color);
  border-radius: 4px 20px 20px 4px;
  box-shadow:
    0 6px 18px rgba(0,0,0,0.08),
    0 2px 6px rgba(0,0,0,0.06);
  transform: rotate(-0.6deg);
}

h2 * {
  color: #fff !important;
}

/* ==================== 三级标题 - 荧光笔效果 ==================== */
h3 {
  display: inline;
  padding: 0.2em 0.5em;
  margin: 1.5em 8px 0.5em 0;
  color: #2d3436;
  font-size: calc(var(--md-font-size) * 1.1);
  font-weight: bold;
  line-height: 2;
  background: linear-gradient(transparent 60%, rgba(255, 234, 167, 0.7) 60%);
}

/* ==================== 四级标题 ==================== */
h4 {
  margin: 1.5em 8px 0.5em;
  color: var(--md-primary-color);
  font-size: calc(var(--md-font-size) * 1);
  font-weight: bold;
}

h4::before {
  content: '✎ ';
}

/* ==================== 五级/六级标题 ==================== */
h5, h6 {
  margin: 1.5em 8px 0.5em;
  color: var(--md-primary-color);
  font-size: calc(var(--md-font-size) * 1);
}

/* ==================== 段落 ==================== */
p {
  margin: 1.5em 8px;
  letter-spacing: 0.05em;
  color: #2d3436;
  line-height: 1.8;
}

/* ==================== 引用块 - 便签纸效果 ==================== */
blockquote {
  font-style: normal;
  padding: 1.2em 1.5em;
  border: none;
  border-radius: 0 0 0 0;
  color: #5a4a42;
  background: linear-gradient(135deg, #fff9c4 0%, #fff59d 100%);
  margin: 1.5em 8px;
  position: relative;
  box-shadow:
    4px 4px 0 rgba(0,0,0,0.05),
    6px 6px 12px rgba(0,0,0,0.06);
  transform: rotate(0.4deg);
}

blockquote::before {
  content: '📌';
  position: absolute;
  top: -12px;
  left: 15px;
  font-size: 1.2em;
}

blockquote > p {
  display: block;
  font-size: 1em;
  color: #5a4a42;
  margin: 0;
}

/* ==================== 代码块 ==================== */
pre.code__pre,
.hljs.code__pre {
  border: none;
  border-radius: 12px;
  background: #282c34 !important;
}

pre.code__pre > code,
.hljs.code__pre > code {
  color: #abb2bf;
  background: transparent;
}

/* ==================== 图片 ==================== */
img {
  border-radius: 8px;
  border: 3px solid #fff;
  box-shadow:
    0 3px 10px rgba(0,0,0,0.1),
    0 0 0 1px rgba(0,0,0,0.05);
  transform: rotate(-1deg);
}

/* ==================== 列表 ==================== */
ul {
  list-style: none;
  padding-left: 0;
}

li {
  margin: 0.5em 0;
  color: #2d3436;
}

.li-bullet {
  color: var(--md-primary-color);
}

/* ==================== 分隔线 ==================== */
hr {
  height: auto;
  border: none;
  margin: 2em 0;
  text-align: center;
}

hr::before {
  content: '· · · ✿ · · ·';
  color: var(--md-primary-color);
  font-size: 1em;
  letter-spacing: 0.3em;
}

/* ==================== 强调 ==================== */
strong {
  color: var(--md-primary-color);
  font-weight: bold;
  background: linear-gradient(transparent 70%, rgba(255, 107, 107, 0.2) 70%);
}

/* ==================== 行内代码 ==================== */
code {
  color: #e17055;
  background: #ffeaa7;
  border: 1px dashed #fdcb6e;
  border-radius: 4px;
  padding: 2px 6px;
}

/* ==================== 链接 ==================== */
a {
  color: var(--md-primary-color);
  text-decoration: none;
  border-bottom: 2px dotted var(--md-primary-color);
}

/* ==================== 表格 ==================== */
table {
  color: #2d3436;
  border: 2px solid #dfe6e9;
  border-radius: 8px;
  overflow: hidden;
}

th {
  background: #ffeaa7;
  border: 1px solid #fdcb6e;
  color: #2d3436;
}

td {
  border: 1px dashed #dfe6e9;
  color: #2d3436;
}

/* ==================== 暗色模式适配 ==================== */
.dark h1,
.dark h3 {
  color: #e5e7eb !important;
}

.dark h1::after {
  opacity: 0.4;
}

.dark h3 {
  background: linear-gradient(transparent 60%, rgba(255, 234, 167, 0.3) 60%);
}

.dark p,
.dark li {
  color: #d1d5db;
}

.dark blockquote {
  background: linear-gradient(135deg, #4a4528 0%, #3d3a20 100%);
  color: #e5e7eb;
}

.dark blockquote > p {
  color: #e5e7eb;
}

.dark pre.code__pre,
.dark .hljs.code__pre {
  border-color: #4b5563;
  background: #1f2937;
}

.dark code {
  color: #fbbf24;
  background: #3d3a20;
  border-color: #4a4528;
}

.dark img {
  border-color: #374151;
}

.dark table,
.dark th,
.dark td {
  border-color: #4b5563;
  color: #e5e7eb;
}

.dark th {
  background: #3d3a20;
}

.dark hr::before {
  opacity: 0.6;
}
`

/**
 * 极简黑主题 CSS - 高端商务
 */
const noirCSS = `
/**
 * MD 极简黑主题 - 高端商务
 * 极简、大留白、高级感
 */

/* ==================== 一级标题 - 纯文字 ==================== */
h1 {
  display: block;
  padding: 0;
  margin: 1.8em 8px 1em;
  color: #1a1a1a;
  font-size: calc(var(--md-font-size) * 1.6);
  font-weight: 800;
  text-align: left;
  letter-spacing: -0.02em;
}

/* ==================== 二级标题 - 细线下划线 ==================== */
h2 {
  display: block;
  padding: 0 0 0.5em 0;
  margin: 2em 8px 1em;
  color: #1a1a1a !important;
  font-size: calc(var(--md-font-size) * 1.3);
  font-weight: 700;
  text-align: left;
  background: transparent;
  border-bottom: 1px solid #e0e0e0;
}

h2 * {
  color: #1a1a1a !important;
}

/* ==================== 三级标题 - 小圆点前缀 ==================== */
h3 {
  display: block;
  padding: 0;
  margin: 1.5em 8px 0.5em 0;
  color: #1a1a1a;
  font-size: calc(var(--md-font-size) * 1.1);
  font-weight: 600;
  line-height: 1.4;
}

h3::before {
  content: '•';
  margin-right: 0.5em;
  color: #1a1a1a;
}

/* ==================== 四级标题 ==================== */
h4 {
  margin: 2em 8px 0.5em;
  color: #333;
  font-size: calc(var(--md-font-size) * 1);
  font-weight: 600;
}

/* ==================== 五级/六级标题 ==================== */
h5, h6 {
  margin: 1.5em 8px 0.5em;
  color: #666;
  font-size: calc(var(--md-font-size) * 1);
  font-weight: 500;
}

/* ==================== 段落 ==================== */
p {
  margin: 1.5em 8px;
  letter-spacing: 0;
  color: #333;
  line-height: 1.8;
  max-width: 70ch;
}

/* ==================== 引用块 - 纯左边框 ==================== */
blockquote {
  font-style: italic;
  padding: 0.5em 0 0.5em 1.5em;
  border-left: 3px solid #1a1a1a;
  border-radius: 0;
  color: #666;
  background: transparent;
  margin: 2em 8px;
}

blockquote > p {
  display: block;
  font-size: 1.05em;
  color: #666;
  margin: 0;
}

/* ==================== 代码块 ==================== */
pre.code__pre,
.hljs.code__pre {
  border: none;
  border-radius: 4px;
  background: #282c34 !important;
}

pre.code__pre > code,
.hljs.code__pre > code {
  color: #abb2bf;
  background: transparent;
}

/* ==================== 图片 ==================== */
img {
  border-radius: 0;
  border: none;
}

/* ==================== 列表 ==================== */
ul {
  list-style: none;
  padding-left: 0;
}

ol {
  color: #333;
  list-style: none;
  padding-left: 0;
  margin-left: 8px;
  counter-reset: noir-ol;
}

li {
  margin: 0.4em 0;
  color: #333;
  position: relative;
  padding-left: 0;
}

.li-bullet {
  color: #999;
}

li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.6em;
  width: 0.4em;
  height: 0.4em;
  border-radius: 50%;
  background: #1a1a1a;
  opacity: 0.2;
}

ol > li {
  padding-left: 1.6em;
}

ol > li::before {
  content: counter(noir-ol) '.';
  counter-increment: noir-ol;
  position: absolute;
  left: 0;
  top: 0.05em;
  width: auto;
  height: auto;
  background: transparent;
  color: #1a1a1a;
  opacity: 0.8;
  font-weight: 700;
}

/* ==================== 分隔线 ==================== */
hr {
  height: 1px;
  border: none;
  margin: 3em 0;
  background: #e0e0e0;
}

/* ==================== 强调 - 黑色加粗 ==================== */
strong {
  color: #1a1a1a;
  font-weight: 700;
}

/* ==================== 行内代码 ==================== */
code {
  color: #1a1a1a;
  background: #f5f5f5;
  border: none;
  padding: 3px 6px;
  border-radius: 3px;
  font-size: 0.9em;
}

/* ==================== 链接 ==================== */
a {
  color: #1a1a1a;
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* ==================== 表格 - 无边框 ==================== */
table {
  color: #333;
  border-collapse: collapse;
}

th {
  background: transparent;
  border: none;
  border-bottom: 2px solid #1a1a1a;
  color: #1a1a1a;
  font-weight: 600;
  padding: 0.75em 1em;
}

td {
  border: none;
  border-bottom: 1px solid #e0e0e0;
  color: #333;
  padding: 0.75em 1em;
}

/* ==================== 暗色模式适配 ==================== */
.dark h1 {
  color: #ffffff !important;
}

.dark h2 {
  color: #ffffff !important;
  border-bottom-color: #404040;
}

.dark h2 * {
  color: #ffffff !important;
}

.dark h3 {
  color: #e5e7eb !important;
}

.dark h3::before {
  color: #e5e7eb;
}

.dark h4 {
  color: #d1d5db;
}

.dark h5,
.dark h6 {
  color: #9ca3af;
}

.dark p,
.dark li,
.dark ol {
  color: #d1d5db;
}

.dark .li-bullet {
  color: #6b7280;
}

.dark blockquote {
  border-left-color: #ffffff;
  color: #9ca3af;
}

.dark blockquote > p {
  color: #9ca3af;
}

.dark pre.code__pre,
.dark .hljs.code__pre {
  border-color: #374151;
  background: #1f2937;
}

.dark code {
  color: #e5e7eb;
  background: #374151;
}

.dark strong {
  color: #ffffff;
}

.dark a {
  color: #e5e7eb;
}

.dark table th {
  border-bottom-color: #ffffff;
  color: #ffffff;
}

.dark table td {
  border-bottom-color: #374151;
  color: #d1d5db;
}

.dark hr {
  background: #374151;
}
`

/**
 * 渐变立体主题 CSS - 复刻微信公众号风格
 */
const gradientCSS = `
/**
 * MD 渐变立体主题
 * 粉蓝渐变背景 + 立体偏移效果
 */

/* ==================== 一级标题 ==================== */
h1 {
  display: table;
  padding: 0.5em 1.5em;
  margin: 1.5em auto 0.8em;
  color: #1a1a1a;
  font-size: calc(var(--md-font-size) * 1.4);
  font-weight: bold;
  text-align: center;
  position: relative;
}

h1::after {
  content: '';
  display: block;
  width: 60%;
  height: 3px;
  margin: 0.5em auto 0;
  background: linear-gradient(to right, #fdd5e7, #c2e2f9);
  border-radius: 2px;
}

/* ==================== 二级标题 - 渐变立体效果 ==================== */
h2 {
  display: table;
  position: relative;
  margin: 2em auto 1em;
  padding: 0.6em 1.6em;
  color: #1a1a1a !important;
  font-size: calc(var(--md-font-size) * 1.05);
  font-weight: 700;
  text-align: center;
  background: linear-gradient(135deg, rgba(253, 213, 231, 0.9), rgba(194, 226, 249, 0.9));
  border-radius: 14px;
  border: 1px solid rgba(26, 26, 26, 0.12);
  box-shadow:
    0 10px 28px rgba(194, 226, 249, 0.25),
    inset 0 0 0 1px rgba(255, 255, 255, 0.65);
  line-height: 1.4;
  overflow: hidden;
}

h2 * {
  color: #1a1a1a !important;
}

/* ==================== 三级标题 - 渐变底边装饰 ==================== */
h3 {
  display: inline-block;
  position: relative;
  padding: 0.35em 0.65em;
  margin: 1.5em 8px 0.6em 0;
  color: #0f766e;
  font-size: calc(var(--md-font-size) * 1.08);
  font-weight: 800;
  line-height: 1.4;
  background: linear-gradient(to top, rgba(12, 148, 136, 0.16) 0%, rgba(12, 148, 136, 0.16) 50%, transparent 50%);
  border-bottom: 2px solid rgba(12, 148, 136, 0.35);
  letter-spacing: 0.02em;
}
 
h3::before {
  content: '﹏﹏';
  position: absolute;
  top: -1.1em;
  left: 0;
  width: 100%;
  font-size: 0.8em;
  color: #0f766e;
  opacity: 0.75;
  letter-spacing: 0.15em;
  transform: scaleY(0.8);
}

/* ==================== 四级标题 ==================== */
h4 {
  margin: 1.5em 8px 0.5em;
  color: #1a1a1a;
  font-size: calc(var(--md-font-size) * 1);
  font-weight: bold;
  padding-left: 0.8em;
  border-left: 3px solid #c2e2f9;
}

/* ==================== 五级/六级标题 ==================== */
h5, h6 {
  margin: 1.2em 8px 0.5em;
  color: #666;
  font-size: calc(var(--md-font-size) * 1);
  font-weight: 500;
}

/* ==================== 段落 ==================== */
p {
  margin: 1.5em 8px;
  letter-spacing: 0.05em;
  color: #333;
  line-height: 1.8;
}

/* ==================== 引用块 ==================== */
blockquote {
  font-style: normal;
  padding: 1em 1.5em;
  border: none;
  border-left: 4px solid;
  border-image: linear-gradient(to bottom, #fdd5e7, #c2e2f9) 1;
  border-radius: 0;
  color: #666;
  background: #f9f9f9;
  margin: 1.5em 8px;
}

blockquote > p {
  display: block;
  font-size: 1em;
  color: #666;
  margin: 0;
}

/* ==================== 代码块 ==================== */
pre.code__pre,
.hljs.code__pre {
  border: none;
  border-radius: 8px;
  background: #282c34 !important;
}

pre.code__pre > code,
.hljs.code__pre > code {
  color: #abb2bf;
  background: transparent;
}

/* ==================== 图片 ==================== */
img {
  border-radius: 4px;
  border: none;
}

/* ==================== 列表 ==================== */
ul {
  list-style: none;
  padding-left: 0;
}

ol {
  color: #333;
  list-style: none;
  padding-left: 0;
  margin-left: 8px;
  counter-reset: gradient-ol;
}

li {
  margin: 0.4em 0;
  color: #333;
  position: relative;
  padding-left: 0;
}

.li-bullet {
  color: #c2e2f9;
  font-weight: bold;
}

li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.7em;
  width: 0.55em;
  height: 0.14em;
  border-radius: 999px;
  background: linear-gradient(90deg, #fdd5e7, #c2e2f9);
}

ol > li {
  padding-left: 1.8em;
}

ol > li::before {
  content: counter(gradient-ol) '.';
  counter-increment: gradient-ol;
  position: absolute;
  left: 0;
  top: 0.05em;
  width: auto;
  height: auto;
  background: transparent;
  color: #1a1a1a;
  font-weight: 700;
}

/* ==================== 分隔线 ==================== */
hr {
  height: 2px;
  border: none;
  margin: 2em 0;
  background: linear-gradient(to right, transparent, #fdd5e7, #c2e2f9, transparent);
}

/* ==================== 强调 ==================== */
strong {
  color: #1a1a1a;
  font-weight: 700;
}

/* ==================== 行内代码 ==================== */
code {
  color: #d14;
  background: #f5f5f5;
  border: none;
  padding: 2px 6px;
  border-radius: 3px;
}

/* ==================== 链接 ==================== */
a {
  color: #576b95;
  text-decoration: none;
}

/* ==================== 表格 ==================== */
table {
  color: #333;
}

th {
  background: linear-gradient(to right, #fdd5e7, #c2e2f9);
  border: 1px solid #ddd;
  color: #1a1a1a;
  padding: 0.5em 1em;
}

td {
  border: 1px solid #ddd;
  color: #333;
  padding: 0.5em 1em;
}

/* ==================== 暗色模式适配 ==================== */
.dark h1 {
  color: #e5e7eb;
}

.dark h1::after {
  background: linear-gradient(to right, rgba(253, 213, 231, 0.5), rgba(194, 226, 249, 0.5));
}

.dark h2 {
  color: #e5e7eb !important;
  background: #1f2937;
  border-color: #4b5563;
}

.dark h2::after {
  background: linear-gradient(to right, rgba(253, 213, 231, 0.4), rgba(194, 226, 249, 0.4));
}

.dark h2 * {
  color: #e5e7eb !important;
}

.dark h3 {
  color: #e5e7eb;
  background: linear-gradient(to top, rgba(253, 213, 231, 0.2) 0%, rgba(253, 213, 231, 0.2) 30%, transparent 30%);
}

.dark h4 {
  color: #d1d5db;
  border-left-color: rgba(194, 226, 249, 0.5);
}

.dark h5,
.dark h6 {
  color: #9ca3af;
}

.dark p,
.dark li,
.dark ol {
  color: #d1d5db;
}

.dark .li-bullet {
  color: rgba(194, 226, 249, 0.7);
}

.dark blockquote {
  background: #374151;
  color: #9ca3af;
}

.dark blockquote > p {
  color: #9ca3af;
}

.dark code {
  color: #f87171;
  background: #374151;
}

.dark table th {
  background: linear-gradient(to right, rgba(253, 213, 231, 0.2), rgba(194, 226, 249, 0.2));
  border-color: #4b5563;
  color: #e5e7eb;
}

.dark table td {
  border-color: #4b5563;
  color: #d1d5db;
}

.dark hr {
  background: linear-gradient(to right, transparent, rgba(253, 213, 231, 0.3), rgba(194, 226, 249, 0.3), transparent);
}
`

/**
 * 多彩主题 CSS - 鲜艳活泼风格
 */
const vividCSS = `
/**
 * MD 多彩主题
 * 橙黄渐变标题 + 彩色边框 + 活泼配色
 */

/* 调色盘 */
:where(#output) {
  --vivid-accent: #f5576c;
  --vivid-accent-2: #667eea;
  --vivid-accent-3: #f093fb;
  --vivid-ink: #1a1a1a;
  --vivid-text: #2d3748;
  --vivid-muted: #4a5568;
}

/* ==================== 一级标题 ==================== */
h1 {
  display: block;
  padding: 0.5em 0;
  margin: 1.5em auto 0.5em;
  color: var(--vivid-ink);
  font-size: calc(var(--md-font-size) * 1.5);
  font-weight: 800;
  text-align: center;
  position: relative;
}

h1::after {
  content: '';
  display: block;
  width: 50px;
  height: 4px;
  margin: 0.5em auto 0;
  background: #1a365d;
  border-radius: 2px;
}

/* ==================== 二级标题 - 橙黄渐变胶囊 ==================== */
h2 {
  display: inline-block;
  margin: 2em 0 0.8em;
  padding: 0.6em 1.5em;
  color: #fff !important;
  font-size: calc(var(--md-font-size) * 1.1);
  font-weight: 700;
  text-align: center;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #f093fb 100%);
  border-radius: 25px;
  letter-spacing: 0.05em;
  line-height: 1.5;
  box-shadow:
    0 12px 24px rgba(245, 87, 108, 0.18),
    0 2px 6px rgba(0, 0, 0, 0.08);
}

h2 * {
  color: #fff !important;
}

/* ==================== 三级标题 - 大号加粗 ==================== */
h3 {
  display: block;
  margin: 1.5em 0 0.6em;
  padding: 0;
  color: var(--vivid-ink);
  font-size: calc(var(--md-font-size) * 1.3);
  font-weight: 800;
  line-height: 1.4;
  position: relative;
}

h3::after {
  content: '';
  display: block;
  width: 60px;
  height: 3px;
  margin-top: 0.3em;
  background: linear-gradient(90deg, var(--vivid-accent-2), var(--vivid-accent));
  border-radius: 999px;
}

/* ==================== 四级标题 - 带emoji图标感 ==================== */
h4 {
  display: flex;
  align-items: center;
  gap: 0.5em;
  margin: 1.5em 0 0.5em;
  color: var(--vivid-accent);
  font-size: calc(var(--md-font-size) * 1.1);
  font-weight: 700;
}

/* ==================== 五级/六级标题 ==================== */
h5, h6 {
  margin: 1.2em 0 0.5em;
  color: var(--vivid-text);
  font-size: calc(var(--md-font-size) * 1);
  font-weight: 600;
}

/* ==================== 段落 ==================== */
p {
  margin: 1.2em 0;
  letter-spacing: 0.02em;
  color: var(--vivid-text);
  line-height: 1.9;
}

/* ==================== 引用块 - 浅色背景+彩色左边框 ==================== */
blockquote {
  font-style: normal;
  padding: 1.2em 1.5em;
  border: 1px solid #e8ecf4;
  border-left: 4px solid var(--vivid-accent);
  border-radius: 8px;
  color: var(--vivid-muted);
  background: linear-gradient(135deg, #fff7fb 0%, #f7f9ff 100%);
  margin: 1.5em 0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
}

blockquote > p {
  display: block;
  font-size: 1em;
  color: var(--vivid-muted);
  margin: 0;
  line-height: 1.8;
}

/* ==================== 代码块 ==================== */
pre.code__pre,
.hljs.code__pre {
  border: 1px solid rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  background:
    linear-gradient(90deg, rgba(255, 255, 255, 0.02) 0, rgba(255, 255, 255, 0.02) 50%, transparent 50%, transparent 100%),
    linear-gradient(0deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.04)),
    #101623 !important;
  background-size: 40px 40px, 100% 100%, 100% 100%;
}

pre.code__pre > code,
.hljs.code__pre > code {
  color: #e2e8f0;
  background: transparent;
}

/* ==================== 图片 ==================== */
img {
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* ==================== 列表 ==================== */
ul {
  list-style: none;
  padding-left: 0;
}

ol {
  color: var(--vivid-text);
  list-style: none;
  padding-left: 0;
  margin-left: 8px;
  counter-reset: vivid-ol;
}

li {
  margin: 0.6em 0;
  color: var(--vivid-text);
  position: relative;
  padding-left: 0;
}

.li-bullet {
  color: var(--vivid-accent);
}

li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.7em;
  width: 0.6em;
  height: 0.16em;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--vivid-accent-2), var(--vivid-accent), var(--vivid-accent-3));
  box-shadow: 0 3px 10px rgba(240, 147, 251, 0.25);
}

ol > li {
  padding-left: 1.8em;
}

ol > li::before {
  content: counter(vivid-ol) '.';
  counter-increment: vivid-ol;
  position: absolute;
  left: 0;
  top: 0.05em;
  width: auto;
  height: auto;
  background: transparent;
  color: var(--vivid-ink);
  font-weight: 800;
  box-shadow: none;
}

/* ==================== 分隔线 - 渐变 ==================== */
hr {
  height: 3px;
  border: none;
  margin: 2.5em 0;
  background: linear-gradient(to right, #f093fb, #f5576c, #667eea);
  border-radius: 2px;
}

/* ==================== 强调 ==================== */
strong {
  color: #e53e3e;
  font-weight: 700;
}

em {
  color: #38a169;
  font-style: normal;
  font-weight: 500;
}

/* ==================== 行内代码 ==================== */
code {
  color: #9f7aea;
  background: #faf5ff;
  border: 1px solid #ede9fe;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
  box-shadow: inset 0 -2px 0 rgba(159, 122, 234, 0.1);
}

/* ==================== 链接 ==================== */
a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

a:hover {
  text-decoration: underline;
}

/* ==================== 表格 ==================== */
table {
  color: var(--vivid-text);
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
}

th {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: none;
  color: #fff;
  padding: 0.8em 1em;
  font-weight: 600;
}

td {
  border: 1px solid #e2e8f0;
  color: var(--vivid-text);
  padding: 0.8em 1em;
}

tr:nth-child(even) td {
  background: #f7fafc;
}

/* ==================== 暗色模式适配 ==================== */
.dark h1 {
  color: #f7fafc;
}

.dark h1::after {
  background: #90cdf4;
}

.dark h2 {
  background: linear-gradient(135deg, #9f7aea 0%, #ed64a6 50%, #f093fb 100%);
}

.dark h3 {
  color: #f7fafc;
}

.dark h4 {
  color: #fc8181;
}

.dark h5,
.dark h6 {
  color: #cbd5e0;
}

.dark p,
.dark li,
.dark ol {
  color: #e2e8f0;
}

.dark blockquote {
  background: #2d3748;
  border-color: #4a5568;
  border-left-color: #9f7aea;
  color: #cbd5e0;
}

.dark blockquote > p {
  color: #cbd5e0;
}

.dark code {
  color: #d6bcfa;
  background: #2d3748;
}

.dark strong {
  color: #fc8181;
}

.dark em {
  color: #68d391;
}

.dark a {
  color: #90cdf4;
}

.dark img {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.dark table th {
  background: linear-gradient(135deg, #553c9a, #6b46c1);
}

.dark table td {
  border-color: #4a5568;
  color: #e2e8f0;
}

.dark tr:nth-child(even) td {
  background: #2d3748;
}

.dark hr {
  background: linear-gradient(to right, #9f7aea, #ed64a6, #667eea);
}
`

/**
 * 科技蓝主题 CSS - SaaS 风格
 */
const techCSS = `
/**
 * MD 科技蓝主题
 * 深蓝主色 + 渐变装饰 + 柔和卡片色
 */

/* ==================== 一级标题 ==================== */
h1 {
  display: block;
  padding: 0.5em 0;
  margin: 1.5em auto 0.8em;
  color: #1e3a5f;
  font-size: calc(var(--md-font-size) * 1.5);
  font-weight: 800;
  text-align: center;
  position: relative;
}

h1::after {
  content: '';
  display: block;
  width: 80px;
  height: 4px;
  margin: 0.6em auto 0;
  background: linear-gradient(to right, #8b5cf6, #ec4899, #3b82f6);
  border-radius: 2px;
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.2);
}

/* ==================== 二级标题 - 深蓝胶囊 ==================== */
h2 {
  display: inline-block;
  margin: 2em 0 0.8em;
  padding: 0.5em 1.5em;
  color: #fff !important;
  font-size: calc(var(--md-font-size) * 1);
  font-weight: 600;
  text-align: center;
  background: linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%);
  border-radius: 6px;
  letter-spacing: 0.05em;
  line-height: 1.4;
  box-shadow:
    0 10px 26px rgba(30, 58, 95, 0.18),
    0 2px 8px rgba(0, 0, 0, 0.08);
}

h2 * {
  color: #fff !important;
}

/* ==================== 三级标题 - 左边框装饰 ==================== */
h3 {
  display: block;
  margin: 1.5em 0 0.6em;
  padding: 0.3em 0 0.3em 1em;
  color: #1e3a5f;
  font-size: calc(var(--md-font-size) * 1.15);
  font-weight: 700;
  line-height: 1.4;
  border-left: 4px solid #3b82f6;
  background: linear-gradient(to right, rgba(59, 130, 246, 0.08), transparent);
}

/* ==================== 四级标题 ==================== */
h4 {
  margin: 1.5em 0 0.5em;
  color: #3b82f6;
  font-size: calc(var(--md-font-size) * 1.05);
  font-weight: 600;
}

/* ==================== 五级/六级标题 ==================== */
h5, h6 {
  margin: 1.2em 0 0.5em;
  color: #64748b;
  font-size: calc(var(--md-font-size) * 1);
  font-weight: 600;
}

/* ==================== 段落 ==================== */
p {
  margin: 1.2em 0;
  letter-spacing: 0.02em;
  color: #334155;
  line-height: 1.85;
}

/* ==================== 引用块 - 浅蓝卡片 ==================== */
blockquote {
  font-style: normal;
  padding: 1.2em 1.5em;
  border: 1px solid #e2e8f0;
  border-left: 4px solid #3b82f6;
  border-radius: 8px;
  color: #475569;
  background: linear-gradient(135deg, #eff6ff 0%, #f0f9ff 100%);
  margin: 1.5em 0;
  box-shadow: 0 12px 30px rgba(30, 58, 95, 0.08);
}

blockquote > p {
  display: block;
  font-size: 1em;
  color: #475569;
  margin: 0;
  line-height: 1.8;
}

/* ==================== 代码块 ==================== */
pre.code__pre,
.hljs.code__pre {
  border: none;
  border-radius: 10px;
  background: #1e293b !important;
}

pre.code__pre > code,
.hljs.code__pre > code {
  color: #e2e8f0;
  background: transparent;
}

/* ==================== 图片 ==================== */
img {
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(30, 58, 95, 0.08);
}

/* ==================== 列表 ==================== */
ul {
  list-style: none;
  padding-left: 0;
}

ol {
  color: #334155;
  list-style: none;
  padding-left: 0;
  margin-left: 8px;
  counter-reset: tech-ol;
}

li {
  margin: 0.5em 0;
  color: #334155;
  position: relative;
  padding-left: 0;
}

.li-bullet {
  color: #3b82f6;
}

li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.7em;
  width: 0.55em;
  height: 0.14em;
  border-radius: 999px;
  background: linear-gradient(90deg, #8b5cf6, #3b82f6);
}

ol > li {
  padding-left: 1.8em;
}

ol > li::before {
  content: counter(tech-ol) '.';
  counter-increment: tech-ol;
  position: absolute;
  left: 0;
  top: 0.05em;
  width: auto;
  height: auto;
  background: transparent;
  color: #1e3a5f;
  font-weight: 700;
  box-shadow: none;
}

/* ==================== 分隔线 - 渐变 ==================== */
hr {
  height: 3px;
  border: none;
  margin: 2.5em 0;
  background: linear-gradient(to right, #8b5cf6, #ec4899, #3b82f6);
  border-radius: 2px;
  opacity: 0.6;
}

/* ==================== 强调 ==================== */
strong {
  color: #1e3a5f;
  font-weight: 700;
}

em {
  color: #3b82f6;
  font-style: italic;
}

/* ==================== 行内代码 ==================== */
code {
  color: #0369a1;
  background: #f0f9ff;
  border: 1px solid #e0f2fe;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.9em;
}

/* ==================== 链接 ==================== */
a {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
}

a:hover {
  text-decoration: underline;
}

/* ==================== 表格 - 浅蓝表头 + 斑马纹 ==================== */
table {
  color: #334155;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

th {
  background: #dbeafe;
  border: 1px solid #bfdbfe;
  color: #1e3a5f;
  padding: 0.75em 1em;
  font-weight: 600;
}

td {
  border: 1px solid #e2e8f0;
  color: #334155;
  padding: 0.75em 1em;
}

tr:nth-child(even) td {
  background: #f8fafc;
}

/* ==================== 特色卡片背景色 - 用于标记文本 ==================== */
.markup-highlight {
  background: linear-gradient(135deg, #dbeafe 0%, #e0f2fe 100%);
  padding: 2px 6px;
  border-radius: 4px;
  color: #1e3a5f;
}

/* ==================== 暗色模式适配 ==================== */
.dark h1 {
  color: #93c5fd;
}

.dark h1::after {
  background: linear-gradient(to right, #a78bfa, #f472b6, #60a5fa);
  opacity: 0.8;
}

.dark h2 {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
}

.dark h3 {
  color: #93c5fd;
  border-left-color: #60a5fa;
  background: linear-gradient(to right, rgba(59, 130, 246, 0.15), transparent);
}

.dark h4 {
  color: #60a5fa;
}

.dark h5,
.dark h6 {
  color: #94a3b8;
}

.dark p,
.dark li,
.dark ol {
  color: #cbd5e1;
}

.dark .li-bullet {
  color: #60a5fa;
}

.dark blockquote {
  background: linear-gradient(135deg, #1e3a5f20 0%, #1e40af15 100%);
  border-color: #334155;
  border-left-color: #60a5fa;
  color: #94a3b8;
}

.dark blockquote > p {
  color: #94a3b8;
}

.dark code {
  color: #7dd3fc;
  background: #0f172a;
  border-color: #1e3a5f;
}

.dark strong {
  color: #f1f5f9;
}

.dark em {
  color: #60a5fa;
}

.dark a {
  color: #60a5fa;
}

.dark img {
  border-color: #334155;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.dark table {
  border-color: #334155;
}

.dark table th {
  background: #1e3a5f;
  border-color: #334155;
  color: #e2e8f0;
}

.dark table td {
  border-color: #334155;
  color: #cbd5e1;
}

.dark tr:nth-child(even) td {
  background: #1e293b;
}

.dark hr {
  background: linear-gradient(to right, #a78bfa, #f472b6, #60a5fa);
  opacity: 0.5;
}

.dark .markup-highlight {
  background: linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%);
  color: #e0f2fe;
}
`

/**
 * 纸感杂志风 - 米白底、红蓝点缀、衬线标题
 */
const magazineCSS = `
/* 容器与颜色 */
#output {
  background: #f7f4ed;
  color: #1f2933;
}

h1 {
  display: block;
  margin: 1.5em 0 0.8em;
  padding-bottom: 0.3em;
  font-family: "Merriweather", Georgia, serif;
  font-size: calc(var(--md-font-size) * 1.5);
  font-weight: 800;
  letter-spacing: 0.01em;
  border-bottom: 3px solid #e63946;
}

h2 {
  display: inline-block;
  margin: 1.6em 0 0.8em;
  padding: 0.2em 0.6em;
  font-family: "Merriweather", Georgia, serif;
  font-size: calc(var(--md-font-size) * 1.25);
  font-weight: 700;
  color: #1f2933 !important;
  background: #fff;
  border: 1px solid #1f2933;
  box-shadow: 6px 6px 0 rgba(30, 41, 51, 0.08);
}

h3 {
  margin: 1.3em 0 0.6em;
  padding-left: 0.5em;
  font-size: calc(var(--md-font-size) * 1.1);
  font-weight: 700;
  border-left: 4px solid #1d4ed8;
}

h4, h5, h6 {
  margin: 1.2em 0 0.4em;
  color: #1f2933;
  font-weight: 600;
}

p {
  margin: 1.2em 0;
  color: #1f2933;
  line-height: 1.8;
  letter-spacing: 0.01em;
}

blockquote {
  margin: 1.5em 0;
  padding: 1em 1.2em;
  background: #fff;
  border: 1px solid #e5e7eb;
  box-shadow: 6px 6px 0 rgba(30,41,51,0.06);
  color: #334155;
  position: relative;
}

blockquote::before {
  content: '✶';
  color: #e63946;
  position: absolute;
  left: -0.6em;
  top: -0.6em;
  font-size: 1.2em;
}

code {
  color: #b91c1c;
  background: #fff;
  border: 1px solid #e5e7eb;
  padding: 2px 6px;
  border-radius: 4px;
}

pre.code__pre,
.hljs.code__pre {
  background: #0b1220 !important;
  border-radius: 10px;
  border: 1px solid #1f2933;
  box-shadow: 0 12px 30px rgba(0,0,0,0.2);
}

img {
  border: 6px solid #fff;
  box-shadow: 8px 8px 0 rgba(30,41,51,0.08);
}

ul, ol {
  margin: 0.6em 0 0.6em 1.2em;
}

li {
  margin: 0.4em 0;
}

hr {
  margin: 2em 0;
  border: none;
  border-top: 2px solid #e5e7eb;
}

table {
  border-collapse: collapse;
  width: 100%;
  background: #fff;
  box-shadow: 8px 8px 0 rgba(30,41,51,0.06);
}

th, td {
  border: 1px solid #e5e7eb;
  padding: 0.6em 0.8em;
  color: #1f2933;
}

th {
  background: #f1f5f9;
  font-weight: 700;
}
`

/**
 * 极简双色（日系）- 黑白+水鸭绿
 */
const duoCSS = `
#output {
  background: #f6f5f1;
  color: #0f172a;
}

h1 {
  margin: 1.4em 0 0.5em;
  font-size: calc(var(--md-font-size) * 1.55);
  font-weight: 800;
  letter-spacing: -0.01em;
  color: #0b1724;
}

h2 {
  margin: 1.2em 0 0.6em;
  padding: 0.2em 0;
  font-size: calc(var(--md-font-size) * 1.25);
  font-weight: 700;
  border-bottom: 2px solid #0ea5e9;
  display: inline-block;
}

h3 {
  margin: 1.05em 0 0.4em;
  padding: 0.1em 0.4em;
  font-size: calc(var(--md-font-size) * 1.1);
  font-weight: 700;
  color: #0b1724;
  background: #e0f2fe;
  border-radius: 4px;
}

h4, h5, h6 {
  margin: 1em 0 0.3em;
  color: #0b1724;
  font-weight: 600;
}

p {
  margin: 1.05em 0;
  color: #0f172a;
  line-height: 1.8;
}

blockquote {
  margin: 1.3em 0;
  padding: 1em 1.2em;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  color: #0f172a;
  border-left: 5px solid #0ea5e9;
  border-radius: 6px;
  box-shadow: 0 10px 24px rgba(0,0,0,0.05);
}

code {
  color: #0b1724;
  background: #e0f2fe;
  border-radius: 4px;
  padding: 2px 6px;
  border: 1px solid #bae6fd;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.6);
}

pre.code__pre,
.hljs.code__pre {
  background: #0b1220 !important;
  border-radius: 10px;
  border: 1px solid #0ea5e9;
}

ul, ol {
  margin: 0.6em 0 0.6em 1.2em;
}

li {
  margin: 0.3em 0;
}

a {
  color: #0ea5e9;
}

hr {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 1.5em 0;
}

table {
  border-collapse: collapse;
  width: 100%;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 10px 24px rgba(0,0,0,0.05);
}

th, td {
  border: 1px solid #e5e7eb;
  padding: 0.6em 0.8em;
  color: #0f172a;
}

th {
  background: #e0f2fe;
  color: #0b1724;
}
`

/**
 * 玻璃拟态淡彩 - 半透明卡片 + 轻噪点
 */
const glassCSS = `
#output {
  background: #f8fafc;
  color: #0f172a;
}

h1 {
  margin: 1.5em 0 0.8em;
  padding: 0.5em 0.9em;
  font-size: calc(var(--md-font-size) * 1.35);
  font-weight: 800;
  color: #0f172a;
  background: linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.5));
  border-radius: 14px;
  box-shadow: 0 14px 32px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.65);
  backdrop-filter: blur(8px);
}

h2 {
  display: inline-flex;
  align-items: center;
  gap: 0.45em;
  margin: 1.3em 0 0.8em;
  padding: 0.45em 1em;
  font-size: calc(var(--md-font-size) * 1.18);
  font-weight: 750;
  color: #0f172a;
  background: linear-gradient(135deg, rgba(79,70,229,0.18), rgba(14,165,233,0.16));
  border-radius: 12px;
  box-shadow: 0 14px 30px rgba(15,23,42,0.12), inset 0 0 0 1px rgba(255,255,255,0.55);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(79,70,229,0.25);
}

h2::before {
  content: '◆';
  color: #4f46e5;
  font-size: 0.9em;
  opacity: 0.8;
}

h3 {
  margin: 1.2em 0 0.6em;
  padding: 0.25em 0.6em;
  font-size: calc(var(--md-font-size) * 1.08);
  font-weight: 700;
  color: #0f172a;
  background: rgba(255,255,255,0.7);
  border-radius: 10px;
  border-left: 4px solid transparent;
  border-image: linear-gradient(180deg, #4f46e5, #22d3ee) 1;
  box-shadow: inset 0 0 0 1px rgba(255,255,255,0.5);
}

h4, h5, h6 {
  margin: 1em 0 0.4em;
  color: #0f172a;
}

p {
  margin: 1.05em 0;
  color: #0f172a;
  line-height: 1.82;
}

blockquote {
  margin: 1.2em 0;
  padding: 1em 1.2em;
  background: linear-gradient(145deg, rgba(255,255,255,0.6), rgba(255,255,255,0.4));
  border-radius: 14px;
  box-shadow:
    0 16px 34px rgba(15,23,42,0.12),
    inset 0 0 0 1px rgba(255,255,255,0.55);
  backdrop-filter: blur(8px);
  border-left: 4px solid #a5b4fc;
  color: #0f172a;
}

code {
  color: #0f172a;
  background: rgba(255,255,255,0.75);
  padding: 2px 8px;
  border-radius: 6px;
  border: 1px solid rgba(15,23,42,0.05);
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.7);
}

pre.code__pre,
.hljs.code__pre {
  background: #0b1220 !important;
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.12);
  box-shadow: 0 20px 38px rgba(15,23,42,0.25);
}

img {
  border-radius: 14px;
  border: 1px solid rgba(255,255,255,0.8);
  box-shadow: 0 14px 34px rgba(15,23,42,0.12);
}

ul, ol {
  margin: 0.55em 0 0.55em 1.2em;
}

li {
  margin: 0.32em 0;
}

a {
  color: #6366f1;
}

hr {
  border: none;
  border-top: 1px solid rgba(15,23,42,0.08);
  margin: 1.6em 0;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: rgba(255,255,255,0.8);
  backdrop-filter: blur(6px);
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 14px 34px rgba(15,23,42,0.12);
}

th, td {
  border: 1px solid rgba(15,23,42,0.06);
  padding: 0.7em 0.9em;
  color: #0f172a;
}

th {
  background: rgba(99,102,241,0.12);
  font-weight: 700;
}
`

/**
 * 方格本 - 网格手账
 */
const gridCSS = `
#output {
  background:
    linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px),
    #fdfdf9;
  background-size: 24px 24px, 24px 24px, auto;
  color: #0f172a;
}

h1 {
  margin: 1.6em 0 0.8em;
  padding-bottom: 0.3em;
  font-size: calc(var(--md-font-size) * 1.4);
  font-weight: 800;
  border-bottom: 3px solid #2563eb;
  letter-spacing: 0.02em;
}

h2 {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  margin: 1.3em 0 0.6em;
  padding: 0.2em 0.6em;
  font-size: calc(var(--md-font-size) * 1.18);
  font-weight: 700;
  background: #e0edff;
  border: 1px solid #c7d8ff;
  border-radius: 8px;
}

h3 {
  margin: 1.1em 0 0.5em;
  padding-left: 0.5em;
  font-size: calc(var(--md-font-size) * 1.05);
  font-weight: 700;
  border-left: 4px solid #2563eb;
  color: #0f172a;
}

h4, h5, h6 {
  margin: 1em 0 0.4em;
  color: #0f172a;
  font-weight: 600;
}

p {
  margin: 1em 0;
  line-height: 1.8;
}

blockquote {
  margin: 1.2em 0;
  padding: 1em 1.2em;
  background: #e7f6ff;
  border: 1px solid #c7e6ff;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(37,99,235,0.08);
  color: #0f172a;
}

code {
  background: #eef2ff;
  border: 1px solid #dfe3f8;
  padding: 2px 6px;
  border-radius: 4px;
  color: #0f172a;
}

pre.code__pre,
.hljs.code__pre {
  background: #0f172a !important;
  border-radius: 10px;
  border: 1px solid #1e293b;
  box-shadow: 0 12px 28px rgba(0,0,0,0.18);
}

img {
  border-radius: 10px;
  border: 4px solid #fff;
  box-shadow: 0 12px 26px rgba(0,0,0,0.08);
}

ul, ol {
  margin: 0.6em 0 0.6em 1.2em;
}

li {
  margin: 0.35em 0;
}

hr {
  border: none;
  border-top: 2px dashed rgba(0,0,0,0.08);
  margin: 1.8em 0;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border: 1px solid #e5e7eb;
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
}

th, td {
  border: 1px solid #e5e7eb;
  padding: 0.65em 0.8em;
  color: #0f172a;
}

th {
  background: #e0edff;
  font-weight: 700;
}
`

/**
 * 极简报纸 - 黑白衬线 + Dropcap
 */
const newspaperCSS = `
#output {
  background: #f9f8f6;
  color: #1f2933;
  font-family: "Merriweather", Georgia, serif;
}

h1 {
  margin: 1.6em 0 0.8em;
  font-size: calc(var(--md-font-size) * 1.6);
  font-weight: 800;
  letter-spacing: 0.01em;
}

h2 {
  margin: 1.3em 0 0.6em;
  padding-bottom: 0.3em;
  font-size: calc(var(--md-font-size) * 1.3);
  font-weight: 700;
  border-bottom: 2px solid #1f2933;
}

h3 {
  margin: 1.1em 0 0.5em;
  font-size: calc(var(--md-font-size) * 1.1);
  font-weight: 700;
}

h4, h5, h6 {
  margin: 1em 0 0.3em;
  font-weight: 600;
}

p {
  margin: 1em 0;
  line-height: 1.9;
  text-align: justify;
}

p:first-letter {
  float: left;
  font-size: 2.6em;
  line-height: 1;
  padding: 0 0.12em 0 0;
  font-weight: 800;
}

blockquote {
  margin: 1.4em 0;
  padding: 1em 1.2em;
  border-left: 3px solid #1f2933;
  background: #f3f2ef;
  font-style: italic;
}

code {
  background: #efefef;
  border-radius: 3px;
  padding: 2px 6px;
  color: #111827;
}

pre.code__pre,
.hljs.code__pre {
  background: #111827 !important;
  border-radius: 6px;
  border: 1px solid #1f2933;
}

ul, ol {
  margin: 0.5em 0 0.5em 1.5em;
}

li {
  margin: 0.35em 0;
}

a {
  color: #1f2933;
  text-decoration: underline;
  text-underline-offset: 3px;
}

hr {
  border: none;
  border-top: 1px solid #d1d5db;
  margin: 1.6em 0;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}

th, td {
  border: 1px solid #e5e7eb;
  padding: 0.65em 0.9em;
  color: #1f2933;
}

th {
  background: #f3f2ef;
  font-weight: 700;
}
`

/**
 * 邮戳信笺 - 纹理纸 + 邮戳元素
 */
const letterCSS = `
#output {
  background: radial-gradient(circle at 10% 10%, #fefcf7, #f7f1e8 60%);
  color: #2c2520;
}

h1 {
  margin: 1.6em 0 0.7em;
  padding: 0.2em 0.1em;
  font-size: calc(var(--md-font-size) * 1.45);
  font-weight: 800;
  border-bottom: 2px solid #c2410c;
}

h2 {
  display: inline-flex;
  align-items: center;
  gap: 0.4em;
  margin: 1.3em 0 0.7em;
  padding: 0.3em 0.7em;
  font-size: calc(var(--md-font-size) * 1.18);
  font-weight: 700;
  background: #fff;
  border: 1px dashed #c2410c;
  border-radius: 6px;
  box-shadow: 0 8px 18px rgba(194,65,12,0.08);
}

h2::after {
  content: '✉';
  color: #c2410c;
  font-size: 0.9em;
}

h3 {
  margin: 1.1em 0 0.5em;
  padding-left: 0.5em;
  font-size: calc(var(--md-font-size) * 1.05);
  font-weight: 700;
  border-left: 4px solid #c2410c;
}

h4, h5, h6 {
  margin: 1em 0 0.3em;
  color: #2c2520;
  font-weight: 600;
}

p {
  margin: 1em 0;
  line-height: 1.85;
  letter-spacing: 0.01em;
}

blockquote {
  margin: 1.3em 0;
  padding: 1em 1.2em;
  background: #fff;
  border: 1px dotted #c2410c;
  border-radius: 8px;
  position: relative;
}

blockquote::after {
  content: 'POST';
  position: absolute;
  right: 12px;
  top: -14px;
  font-size: 0.8em;
  padding: 2px 6px;
  border: 1px solid #c2410c;
  color: #c2410c;
  background: #fff;
  transform: rotate(-4deg);
}

code {
  color: #c2410c;
  background: #fff4ec;
  border: 1px solid #f2d5c2;
  border-radius: 4px;
  padding: 2px 6px;
}

pre.code__pre,
.hljs.code__pre {
  background: #2c2520 !important;
  border-radius: 10px;
  border: 1px solid #4a342b;
  box-shadow: 0 12px 28px rgba(0,0,0,0.18);
}

img {
  border-radius: 10px;
  border: 6px solid #fff;
  box-shadow: 0 10px 24px rgba(0,0,0,0.08);
}

ul, ol {
  margin: 0.6em 0 0.6em 1.2em;
}

li {
  margin: 0.35em 0;
}

a {
  color: #c2410c;
}

hr {
  border: none;
  border-top: 1px dashed #c2410c;
  margin: 1.6em 0;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border: 1px solid #f2d5c2;
}

th, td {
  border: 1px solid #f2d5c2;
  padding: 0.65em 0.8em;
  color: #2c2520;
}

th {
  background: #fff4ec;
  font-weight: 700;
}
`

/**
 * 百科卡片 - 分区色条 + 信息框
 */
const cardCSS = `
#output {
  background: #f7f9fc;
  color: #0f172a;
}

h1 {
  margin: 1.4em 0 0.8em;
  font-size: calc(var(--md-font-size) * 1.5);
  font-weight: 800;
}

h2 {
  margin: 1.2em 0 0.6em;
  padding: 0.3em 0.5em;
  font-size: calc(var(--md-font-size) * 1.2);
  font-weight: 700;
  background: linear-gradient(135deg, #2563eb, #22c55e);
  color: #fff !important;
  border-radius: 8px;
  box-shadow: 0 12px 24px rgba(37,99,235,0.15);
}

h3 {
  margin: 1em 0 0.5em;
  padding-left: 0.5em;
  font-size: calc(var(--md-font-size) * 1.05);
  font-weight: 700;
  border-left: 4px solid #2563eb;
}

h4, h5, h6 {
  margin: 0.9em 0 0.3em;
  font-weight: 600;
}

p {
  margin: 1em 0;
  line-height: 1.75;
}

blockquote {
  margin: 1.1em 0;
  padding: 1em 1.2em;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 12px 26px rgba(0,0,0,0.06);
}

code {
  color: #1e3a8a;
  background: #e0f2fe;
  border: 1px solid #bae6fd;
  border-radius: 4px;
  padding: 2px 6px;
}

pre.code__pre,
.hljs.code__pre {
  background: #0b1220 !important;
  border-radius: 12px;
  border: 1px solid #1e293b;
  box-shadow: 0 16px 32px rgba(0,0,0,0.2);
}

img {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 12px 28px rgba(0,0,0,0.08);
}

ul, ol {
  margin: 0.55em 0 0.55em 1.2em;
}

li {
  margin: 0.32em 0;
}

a {
  color: #2563eb;
}

hr {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 1.6em 0;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 12px 26px rgba(0,0,0,0.06);
}

th, td {
  border: 1px solid #e5e7eb;
  padding: 0.7em 0.9em;
  color: #0f172a;
}

th {
  background: #eff6ff;
  font-weight: 700;
}
`

/**
 * 手绘涂鸦 - 手写符号 + 波浪
 */
const doodleCSS = `
#output {
  background: #fffdf7;
  color: #1f2933;
}

h1 {
  margin: 1.5em 0 0.8em;
  font-size: calc(var(--md-font-size) * 1.45);
  font-weight: 800;
  letter-spacing: 0.01em;
  position: relative;
}

h1::after {
  content: '~ ~ ~';
  display: block;
  margin-top: 0.2em;
  color: #f97316;
  letter-spacing: 0.2em;
}

h2 {
  display: inline-block;
  margin: 1.2em 0 0.6em;
  padding: 0.2em 0.6em;
  font-size: calc(var(--md-font-size) * 1.2);
  font-weight: 700;
  color: #1f2933 !important;
  background: #fff3d8;
  border: 2px dashed #f97316;
  border-radius: 8px;
  transform: rotate(-1deg);
}

h3 {
  margin: 1em 0 0.5em;
  padding-left: 0.4em;
  font-size: calc(var(--md-font-size) * 1.05);
  font-weight: 700;
  border-left: 3px solid #10b981;
}

h4, h5, h6 {
  margin: 0.9em 0 0.3em;
  font-weight: 600;
}

p {
  margin: 1em 0;
  line-height: 1.8;
}

blockquote {
  margin: 1.1em 0;
  padding: 1em 1.2em;
  background: #f0fdf4;
  border: 2px dotted #10b981;
  border-radius: 12px;
  transform: rotate(0.5deg);
}

code {
  color: #be123c;
  background: #ffe4e6;
  border: 1px dashed #fca5a5;
  border-radius: 4px;
  padding: 2px 6px;
}

pre.code__pre,
.hljs.code__pre {
  background: #111827 !important;
  border-radius: 12px;
  border: 2px dashed #f97316;
  box-shadow: 0 14px 30px rgba(0,0,0,0.18);
}

img {
  border-radius: 12px;
  border: 4px solid #fff;
  box-shadow: 6px 6px 0 rgba(0,0,0,0.08);
  transform: rotate(-0.6deg);
}

ul, ol {
  margin: 0.6em 0 0.6em 1.2em;
}

li {
  margin: 0.35em 0;
}

a {
  color: #2563eb;
}

hr {
  border: none;
  border-top: 2px dotted #e5e7eb;
  margin: 1.7em 0;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
  border: 2px dashed #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}

th, td {
  border: 1px solid #e5e7eb;
  padding: 0.7em 0.9em;
  color: #1f2933;
}

th {
  background: #fff3d8;
  font-weight: 700;
}
`

/**
 * CSS 主题映射表
 */
export const themeMap: Record<string, string> = {
  simple: simpleCSS,
  ink: inkCSS,
  neon: neonCSS,
  journal: journalCSS,
  noir: noirCSS,
  gradient: gradientCSS,
  vivid: vividCSS,
  tech: techCSS,
  magazine: magazineCSS,
  duo: duoCSS,
  glass: glassCSS,
  grid: gridCSS,
  newspaper: newspaperCSS,
  letter: letterCSS,
  card: cardCSS,
  doodle: doodleCSS,
}

export type ThemeName
  = | 'simple'
    | 'ink'
    | 'neon'
    | 'journal'
    | 'noir'
    | 'gradient'
    | 'vivid'
    | 'tech'
    | 'magazine'
    | 'duo'
    | 'glass'
    | 'grid'
    | 'newspaper'
    | 'letter'
    | 'card'
    | 'doodle'
