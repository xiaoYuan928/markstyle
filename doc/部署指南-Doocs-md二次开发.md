# Doocs/md 二次开发部署指南

> 本指南帮助你基于 Doocs/md 开源项目快速搭建自己的公众号排版工具

---

## 第一步：Fork 项目到自己的 GitHub

### 1.1 访问项目地址

```
https://github.com/doocs/md
```

### 1.2 点击 Fork 按钮

- 点击页面右上角的 **Fork** 按钮
- 选择你的 GitHub 账号
- 等待 Fork 完成

![image-20251218172411448](http://blog.ipengtao.com/20251218172412896.png)

### 1.3 Fork 后的仓库地址

```
https://github.com/你的用户名/项目名
```

![image-20251218172527055](http://blog.ipengtao.com/20251218172528242.png)

---

## 第二步：本地开发环境搭建

### 2.1 克隆项目到本地

```bash
# 克隆你 Fork 的仓库
git clone https://github.com/你的用户名/项目名.git

# 进入项目目录
cd 项目名
```

![image-20251218172730459](http://blog.ipengtao.com/20251218172731755.png)

### 2.2 安装依赖

```bash
# 确保 Node.js 版本 >= 18
node -v

# 安装依赖（推荐使用 pnpm）
pnpm install

# 或使用 npm
npm install
```

![image-20251218173353145](http://blog.ipengtao.com/20251218173354379.png)

### 2.3 启动开发服务器

```bash
pnpm dev

# 或
npm run dev
```

### 2.4 访问本地服务

```
http://localhost:5173
```

![image-20251218174139254](http://blog.ipengtao.com/20251218174141355.png)

---

## 第三步：二次开发（添加主题）

### 3.1 项目结构说明

```
md/
├── src/
│   ├── assets/
│   │   └── less/
│   │       └── theme/        # 主题样式文件目录
│   │           ├── basic.less    # 基础样式
│   │           └── themes.less   # 主题配置
│   ├── components/
│   │   └── CodemirrorEditor/
│   │       └── rightClickMenu.vue  # 右键菜单（含主题选择）
│   ├── config/
│   │   └── theme.js          # 主题配置列表
│   ├── stores/
│   │   └── index.js          # 状态管理
│   └── App.vue
├── index.html
└── package.json
```

### 3.2 添加新主题的步骤

#### 步骤 A：在 `src/config/theme.js` 添加主题配置

```javascript
// src/config/theme.js
export const themeList = [
  // 现有主题
  { label: '经典', value: 'default' },
  { label: '优雅', value: 'elegant' },

  // 新增主题
  { label: '极简白', value: 'minimal-white' },
  { label: '程序员', value: 'coder' },
  { label: '暗夜码农', value: 'dark-coder' },
  { label: '专业蓝', value: 'professional-blue' },
  { label: '渐变彩虹', value: 'rainbow' },
  // ... 继续添加
]
```

#### 步骤 B：创建主题 CSS 文件

在 `src/assets/less/theme/` 目录下创建对应的主题文件：

```css
/* src/assets/less/theme/minimal-white.css */

/* 整体背景 */
.preview {
  background: #ffffff;
  color: #333333;
}

/* 标题样式 */
.preview h1 {
  font-size: 24px;
  font-weight: bold;
  color: #1a1a1a;
  border-bottom: 2px solid #333;
  padding-bottom: 8px;
  margin: 24px 0 16px;
}

.preview h2 {
  font-size: 20px;
  font-weight: bold;
  color: #2a2a2a;
  margin: 20px 0 12px;
}

.preview h3 {
  font-size: 18px;
  font-weight: bold;
  color: #3a3a3a;
  margin: 16px 0 8px;
}

/* 正文样式 */
.preview p {
  font-size: 15px;
  line-height: 1.8;
  color: #333333;
  margin: 12px 0;
}

/* 引用块样式 */
.preview blockquote {
  border-left: 4px solid #ddd;
  padding: 12px 16px;
  background: #f9f9f9;
  color: #666;
  margin: 16px 0;
}

/* 代码块样式 */
.preview pre {
  background: #f5f5f5;
  border-radius: 4px;
  padding: 16px;
  overflow-x: auto;
}

.preview code {
  font-family: 'Fira Code', monospace;
  font-size: 14px;
}

/* 行内代码 */
.preview p code {
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
  color: #d63384;
}

/* 列表样式 */
.preview ul,
.preview ol {
  padding-left: 24px;
  margin: 12px 0;
}

.preview li {
  line-height: 1.8;
  margin: 4px 0;
}

/* 表格样式 */
.preview table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
}

.preview th,
.preview td {
  border: 1px solid #ddd;
  padding: 8px 12px;
  text-align: left;
}

.preview th {
  background: #f5f5f5;
  font-weight: bold;
}

/* 链接样式 */
.preview a {
  color: #0066cc;
  text-decoration: none;
}

/* 图片样式 */
.preview img {
  max-width: 100%;
  border-radius: 4px;
  margin: 12px 0;
}

/* 分割线 */
.preview hr {
  border: none;
  border-top: 1px solid #eee;
  margin: 24px 0;
}
```

#### 步骤 C：在主题加载逻辑中注册新主题

查找项目中主题切换的逻辑，通常在 `stores/index.js` 或相关组件中，确保新主题被正确加载。

### 3.3 主题设计参考

以下是一些主题配色建议：

```
极简白：
- 背景: #ffffff
- 正文: #333333
- 标题: #1a1a1a
- 强调: #0066cc

程序员风：
- 背景: #1e1e1e
- 正文: #d4d4d4
- 标题: #569cd6
- 强调: #4ec9b0

专业蓝：
- 背景: #ffffff
- 正文: #333333
- 标题: #1a56db
- 强调: #3b82f6

渐变彩虹：
- 标题渐变: linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3)
- 正文: #333333
- 背景: #ffffff
```

---

## 第四步：修改品牌元素

### 4.1 修改网站标题

```html
<!-- index.html -->
<title>你的产品名称 - 公众号排版神器</title>
```

### 4.2 修改 Logo

替换 `public/` 目录下的图标文件：

- `favicon.ico`
- `logo.png`（如果有）

### 4.3 修改页脚信息

在 `src/App.vue` 或相关组件中修改页脚版权信息。

---

## 第五步：部署到 Vercel（推荐）

### 5.1 注册 Vercel 账号

访问 https://vercel.com 并使用 GitHub 登录

### 5.2 导入项目

1. 点击 **New Project**
2. 选择你 Fork 的 `md` 仓库
3. 点击 **Import**

### 5.3 配置部署

```
Framework Preset: Vite
Build Command: pnpm build（或 npm run build）
Output Directory: dist
Install Command: pnpm install（或 npm install）
```

### 5.4 点击 Deploy

等待部署完成，Vercel 会自动分配一个域名：

```
https://你的项目名.vercel.app
```

### 5.5 绑定自定义域名

1. 在 Vercel 项目设置中点击 **Domains**
2. 添加你的域名（如 `md.yourdomain.com`）
3. 按照提示在域名服务商添加 DNS 记录：
   ```
   类型: CNAME
   名称: md
   值: cname.vercel-dns.com
   ```

---

## 第六步：持续开发流程

### 6.1 日常开发流程

```bash
# 1. 创建新分支
git checkout -b feature/new-theme

# 2. 开发并测试
pnpm dev

# 3. 提交代码
git add .
git commit -m "feat: 添加新主题 xxx"

# 4. 推送到 GitHub
git push origin feature/new-theme

# 5. 合并到 main 分支
git checkout main
git merge feature/new-theme
git push origin main

# 6. Vercel 自动部署（推送后自动触发）
```

### 6.2 同步上游更新（可选）

```bash
# 添加上游仓库
git remote add upstream https://github.com/doocs/md.git

# 获取上游更新
git fetch upstream

# 合并更新（注意解决冲突）
git merge upstream/main
```

---

## 常见问题

### Q1: 本地运行报错 Node 版本问题

```bash
# 使用 nvm 切换 Node 版本
nvm install 18
nvm use 18
```

### Q2: 样式在公众号显示异常

- 公众号不支持某些 CSS 属性（如 `position: fixed`）
- 建议使用内联样式而非 class
- 测试时直接粘贴到公众号编辑器验证

### Q3: Vercel 部署失败

- 检查 `package.json` 中的 build 命令
- 确保所有依赖都在 `dependencies` 中

### Q4: 国内访问 Vercel 较慢

备选方案：

1. 使用 Cloudflare 加速
2. 部署到国内云服务（阿里云 OSS、腾讯云 COS）

---

## 快速命令参考

```bash
# 克隆项目
git clone https://github.com/你的用户名/md.git && cd md

# 安装依赖
pnpm install

# 本地开发
pnpm dev

# 构建生产版本
pnpm build

# 预览生产版本
pnpm preview
```

---

## 相关资源

- **Doocs/md 源码**：https://github.com/doocs/md
- **Vercel 文档**：https://vercel.com/docs
- **Vue 3 文档**：https://vuejs.org/
- **TailwindCSS 文档**：https://tailwindcss.com/
- **公众号样式兼容参考**：https://developers.weixin.qq.com/doc/

---

_指南结束 - 祝开发顺利！_
