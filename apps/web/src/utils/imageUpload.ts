import type { GitHubConfig } from '@/stores/imageHost'

/**
 * 将文件转换为 Base64 字符串（不含前缀）
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      // 移除 data:image/xxx;base64, 前缀
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * 生成唯一文件名：时间戳-原文件名
 */
export function generateFileName(originalName: string): string {
  const timestamp = Date.now()
  // 清理文件名中的特殊字符
  const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_')
  return `${timestamp}-${safeName}`
}

/**
 * 上传图片到 GitHub
 */
export async function uploadToGitHub(
  file: File,
  config: GitHubConfig,
  onProgress?: (progress: number) => void,
): Promise<string> {
  // 验证配置
  if (!config.repo || !config.token) {
    throw new Error('请先配置 GitHub 仓库和 Token')
  }

  onProgress?.(10)

  // 转换为 base64
  const content = await fileToBase64(file)
  onProgress?.(30)

  // 生成文件路径
  const fileName = generateFileName(file.name)
  const filePath = config.path ? `${config.path}/${fileName}` : fileName

  onProgress?.(40)

  // 调用 GitHub API
  const response = await fetch(
    `https://api.github.com/repos/${config.repo}/contents/${filePath}`,
    {
      method: 'PUT',
      headers: {
        'Authorization': `token ${config.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json',
      },
      body: JSON.stringify({
        message: `Upload ${file.name}`,
        content,
        branch: config.branch || 'main',
      }),
    },
  )

  onProgress?.(80)

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    if (response.status === 401) {
      throw new Error('GitHub Token 无效或已过期')
    }
    if (response.status === 404) {
      throw new Error('仓库不存在或无权访问')
    }
    if (response.status === 422) {
      throw new Error('文件已存在或路径无效')
    }
    throw new Error(error.message || `上传失败: ${response.status}`)
  }

  onProgress?.(100)

  // 返回 jsdelivr CDN 地址（更快的访问速度）
  const cdnUrl = `https://cdn.jsdelivr.net/gh/${config.repo}@${config.branch || 'main'}/${filePath}`

  return cdnUrl
}

/**
 * 验证 GitHub 配置是否有效
 */
export async function validateGitHubConfig(config: GitHubConfig): Promise<boolean> {
  if (!config.repo || !config.token) {
    return false
  }

  try {
    const response = await fetch(
      `https://api.github.com/repos/${config.repo}`,
      {
        headers: {
          'Authorization': `token ${config.token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      },
    )
    return response.ok
  }
  catch {
    return false
  }
}

/**
 * 检查文件是否为有效图片
 */
export function isValidImageFile(file: File): boolean {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
  return validTypes.includes(file.type)
}

/**
 * 获取文件大小的人类可读格式
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024)
    return `${bytes} B`
  if (bytes < 1024 * 1024)
    return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
