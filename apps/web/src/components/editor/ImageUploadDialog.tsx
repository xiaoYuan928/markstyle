'use client'

import { useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useImageHostStore } from '@/stores/imageHost'
import {
  formatFileSize,
  isValidImageFile,
  uploadToGitHub,
  validateGitHubConfig,
} from '@/utils/imageUpload'

interface ImageUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUploadSuccess: (url: string) => void
}

export function ImageUploadDialog({
  open,
  onOpenChange,
  onUploadSuccess,
}: ImageUploadDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [showConfig, setShowConfig] = useState(false)

  const { githubConfig, setGitHubConfig, isConfigured } = useImageHostStore()

  // Local config state for editing
  const [localConfig, setLocalConfig] = useState({
    repo: githubConfig.repo,
    branch: githubConfig.branch,
    token: githubConfig.token,
    path: githubConfig.path,
  })

  // Sync local config when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setLocalConfig({
        repo: githubConfig.repo,
        branch: githubConfig.branch,
        token: githubConfig.token,
        path: githubConfig.path,
      })
      setSelectedFile(null)
      setUploadProgress(0)
      setShowConfig(!isConfigured())
    }
    onOpenChange(newOpen)
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }, [])

  const handleFileSelect = (file: File) => {
    if (!isValidImageFile(file)) {
      toast.error('请选择有效的图片文件 (JPEG, PNG, GIF, WebP, SVG)')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('图片大小不能超过 10MB')
      return
    }

    setSelectedFile(file)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleSaveConfig = async () => {
    if (!localConfig.repo || !localConfig.token) {
      toast.error('请填写仓库地址和 Token')
      return
    }

    // Validate the config
    const isValid = await validateGitHubConfig({
      repo: localConfig.repo,
      branch: localConfig.branch || 'main',
      token: localConfig.token,
      path: localConfig.path || 'images',
    })

    if (!isValid) {
      toast.error('配置验证失败，请检查仓库地址和 Token')
      return
    }

    setGitHubConfig({
      repo: localConfig.repo,
      branch: localConfig.branch || 'main',
      token: localConfig.token,
      path: localConfig.path || 'images',
    })

    toast.success('配置已保存')
    setShowConfig(false)
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('请先选择图片')
      return
    }

    if (!isConfigured()) {
      toast.error('请先配置 GitHub 图床')
      setShowConfig(true)
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const url = await uploadToGitHub(
        selectedFile,
        githubConfig,
        setUploadProgress,
      )

      toast.success('上传成功')
      onUploadSuccess(url)
      onOpenChange(false)
    }
    catch (error) {
      toast.error(error instanceof Error ? error.message : '上传失败')
    }
    finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>图片上传</DialogTitle>
          <DialogDescription>
            上传图片到 GitHub 仓库，获取 CDN 加速链接
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload Zone */}
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 dark:border-gray-600'}
              ${selectedFile ? 'bg-green-50 dark:bg-green-900/20 border-green-500' : ''}
              hover:border-primary hover:bg-primary/5
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleInputChange}
            />
            {selectedFile
              ? (
                  <div className="space-y-2">
                    <span className="material-symbols-outlined text-4xl text-green-500">
                      check_circle
                    </span>
                    <p className="text-sm font-medium">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>
                )
              : (
                  <div className="space-y-2">
                    <span className="material-symbols-outlined text-4xl text-gray-400">
                      cloud_upload
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      拖拽图片到此处，或点击选择
                    </p>
                    <p className="text-xs text-gray-400">
                      支持 JPEG, PNG, GIF, WebP, SVG (最大 10MB)
                    </p>
                  </div>
                )}
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>上传中...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Config Toggle */}
          <button
            type="button"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            onClick={() => setShowConfig(!showConfig)}
          >
            <span className="material-symbols-outlined text-base">
              {showConfig ? 'expand_less' : 'expand_more'}
            </span>
            GitHub 配置
            {isConfigured() && (
              <span className="text-green-500 text-xs">(已配置)</span>
            )}
          </button>

          {/* GitHub Config */}
          {showConfig && (
            <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              {/* 配置指南 */}
              <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1 pb-2 border-b border-gray-200 dark:border-gray-700">
                <p className="font-medium text-gray-700 dark:text-gray-300">配置步骤：</p>
                <p>1. 创建一个<strong>公开</strong>的 GitHub 仓库（私有仓库图片无法访问）</p>
                <p>
                  2.{' '}
                  <a
                    href="https://github.com/settings/tokens/new?description=MarkStyle%20Image%20Upload&scopes=repo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    点击创建 Token
                  </a>
                  {' '}→ 勾选 repo 权限 → Generate token
                </p>
                <p className="pl-3 text-gray-500">有效期建议选 No expiration，省去定期更新的麻烦</p>
                <p>3. 复制 Token（仅显示一次），填入下方配置</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="repo">仓库地址</Label>
                <Input
                  id="repo"
                  placeholder="username/repo-name"
                  value={localConfig.repo}
                  onChange={e =>
                    setLocalConfig(prev => ({ ...prev, repo: e.target.value }))}
                />
                <p className="text-xs text-gray-500">你的 GitHub 用户名/仓库名，如 zhangsan/images</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch">分支</Label>
                <Input
                  id="branch"
                  placeholder="main"
                  value={localConfig.branch}
                  onChange={e =>
                    setLocalConfig(prev => ({ ...prev, branch: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="token">
                  Personal Access Token
                  <a
                    href="https://github.com/settings/tokens/new?description=MarkStyle%20Image%20Upload&scopes=repo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-primary hover:underline"
                    onClick={e => e.stopPropagation()}
                  >
                    创建 Token
                  </a>
                </Label>
                <Input
                  id="token"
                  type="password"
                  placeholder="ghp_xxxx"
                  value={localConfig.token}
                  onChange={e =>
                    setLocalConfig(prev => ({ ...prev, token: e.target.value }))}
                />
                <p className="text-xs text-gray-500">需要 repo 权限</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="path">存储路径</Label>
                <Input
                  id="path"
                  placeholder="images"
                  value={localConfig.path}
                  onChange={e =>
                    setLocalConfig(prev => ({ ...prev, path: e.target.value }))}
                />
                <p className="text-xs text-gray-500">图片存放的文件夹，默认 images 即可</p>
              </div>

              <Button onClick={handleSaveConfig} className="w-full">
                保存配置
              </Button>
            </div>
          )}

          {/* Upload Button */}
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || isUploading || !isConfigured()}
            className="w-full"
          >
            {isUploading ? '上传中...' : '上传图片'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
