'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/components/auth'
import { UpgradeDialog } from '@/components/payment/UpgradeDialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { deductGuestCredit, getGuestRemainingCount, GUEST_DAILY_LIMIT } from '@/lib/credits'
import { getFingerprint } from '@/lib/fingerprint'
import { getSupabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { useImageHostStore, usePostStore } from '@/stores'
import { uploadToGitHub } from '@/utils/imageUpload'
import { CoverHistoryDialog } from './CoverHistoryDialog'

// 图片尺寸预设
const IMAGE_SIZE_PRESETS = [
  { name: 'wechat-main', label: '公众号头条', width: 1024, height: 436, ratio: '2.35:1', desc: '推荐' },
  { name: 'wechat-sub', label: '公众号次条', width: 1024, height: 1024, ratio: '1:1', desc: '' },
  { name: 'landscape', label: '横版 16:9', width: 1280, height: 720, ratio: '16:9', desc: '' },
  { name: 'square', label: '正方形', width: 1024, height: 1024, ratio: '1:1', desc: '' },
  { name: 'portrait', label: '竖版 3:4', width: 768, height: 1024, ratio: '3:4', desc: '' },
] as const

type ImageSizePreset = typeof IMAGE_SIZE_PRESETS[number]['name']

interface CoverGeneratorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CoverGeneratorDialog({ open, onOpenChange }: CoverGeneratorDialogProps) {
  const [prompt, setPrompt] = useState('')
  const [selectedSize, setSelectedSize] = useState<ImageSizePreset>('wechat-main')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false)
  const [guestCredits, setGuestCredits] = useState(GUEST_DAILY_LIMIT)

  const { session, userProfile, refreshCredits } = useAuth()

  // 更新访客额度显示
  useEffect(() => {
    if (!session && open) {
      setGuestCredits(getGuestRemainingCount())
    }
  }, [session, open])
  const currentPost = usePostStore(state => state.currentPost)
  const { githubConfig, isConfigured } = useImageHostStore()

  const post = currentPost()

  // 获取 access token 用于 API 调用
  const getAccessToken = useCallback(async (): Promise<string | null> => {
    if (!session)
      return null
    const supabase = getSupabase()
    const { data } = await supabase.auth.getSession()
    return data.session?.access_token ?? null
  }, [session])

  // 第一步：AI 分析文章，生成图片描述
  const handleAnalyzeArticle = useCallback(async () => {
    if (!post) {
      toast.error('请先选择一篇文章')
      return
    }

    const title = post.title || '未命名文章'
    const content = post.content || ''

    if (!content.trim()) {
      toast.error('文章内容为空')
      return
    }

    // 提取文章标题和前 1000 字
    const articleContent = `标题：${title}\n\n${content.slice(0, 1000)}`

    setIsAnalyzing(true)

    try {
      const response = await fetch('/api/generate-cover', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: articleContent }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '分析失败')
      }

      setPrompt(data.generatedPrompt)
      toast.success('AI 已生成图片描述，可修改后生成封面')
    }
    catch (error) {
      toast.error(error instanceof Error ? error.message : '分析失败，请重试')
    }
    finally {
      setIsAnalyzing(false)
    }
  }, [post])

  // 第二步：根据描述生成图片
  const handleGenerateImage = useCallback(async () => {
    if (!prompt.trim()) {
      toast.error('请先输入或生成图片描述')
      return
    }

    // 检查额度（前端预检）
    if (session) {
      // 已登录用户检查积分
      if (userProfile && userProfile.credits < 1) {
        setIsUpgradeOpen(true)
        return
      }
    }
    else {
      // 访客检查每日额度
      if (guestCredits < 1) {
        setIsUpgradeOpen(true)
        return
      }
    }

    const sizeConfig = IMAGE_SIZE_PRESETS.find(s => s.name === selectedSize) || IMAGE_SIZE_PRESETS[0]

    setIsGenerating(true)
    setGeneratedImage(null)

    try {
      // 构建请求头
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }

      // 如果已登录，添加 Authorization header
      const token = await getAccessToken()
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }

      // 获取设备指纹（用于访客防刷）
      let fingerprint: string | undefined
      if (!session) {
        try {
          fingerprint = await getFingerprint()
        }
        catch (e) {
          console.warn('Failed to get fingerprint:', e)
        }
      }

      const response = await fetch('/api/generate-cover', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          prompt,
          width: sizeConfig.width,
          height: sizeConfig.height,
          fingerprint,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // 特殊处理积分不足错误
        if (data.code === 'INSUFFICIENT_CREDITS' || data.code === 'GUEST_LIMIT_REACHED') {
          setIsUpgradeOpen(true)
          // 更新访客额度显示
          if (!session && data.remaining !== undefined) {
            setGuestCredits(data.remaining)
          }
          return
        }
        throw new Error(data.error || '生成失败')
      }

      setGeneratedImage(data.imageUrl)
      toast.success('封面生成成功')

      // 刷新额度显示
      if (session) {
        refreshCredits()
      }
      else {
        // 访客更新本地额度显示（服务端已记录）
        deductGuestCredit()
        setGuestCredits(getGuestRemainingCount())
      }
    }
    catch (error) {
      toast.error(error instanceof Error ? error.message : '生成失败，请重试')
    }
    finally {
      setIsGenerating(false)
    }
  }, [prompt, selectedSize, session, userProfile, guestCredits, getAccessToken, refreshCredits])

  // 下载图片
  const handleDownload = useCallback(async () => {
    if (!generatedImage)
      return

    try {
      const response = await fetch(generatedImage)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = `cover-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('下载成功')
    }
    catch {
      toast.error('下载失败，请重试')
    }
  }, [generatedImage])

  // 复制图片到剪贴板
  const handleCopyImage = useCallback(async () => {
    if (!generatedImage)
      return

    try {
      const response = await fetch(generatedImage)
      const blob = await response.blob()

      // 如果是 webp 格式，需要转换为 PNG（剪贴板只支持 PNG）
      let pngBlob = blob
      if (blob.type !== 'image/png') {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        const loadPromise = new Promise<void>((resolve, reject) => {
          img.onload = () => resolve()
          img.onerror = reject
        })
        img.src = URL.createObjectURL(blob)
        await loadPromise

        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(img, 0, 0)

        pngBlob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((b) => {
            if (b)
              resolve(b)
            else reject(new Error('转换失败'))
          }, 'image/png')
        })

        URL.revokeObjectURL(img.src)
      }

      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': pngBlob }),
      ])

      toast.success('图片已复制到剪贴板')
    }
    catch (error) {
      console.error('Copy image error:', error)
      toast.error('复制失败，请尝试下载后手动复制')
    }
  }, [generatedImage])

  // 上传到图床
  const handleUploadToHost = useCallback(async () => {
    if (!generatedImage)
      return

    if (!isConfigured()) {
      toast.error('请先配置 GitHub 图床（点击工具栏图片按钮）')
      return
    }

    setIsUploading(true)

    try {
      const response = await fetch(generatedImage)
      const blob = await response.blob()
      const file = new File([blob], `cover-${Date.now()}.png`, { type: 'image/png' })

      const url = await uploadToGitHub(file, githubConfig)

      await navigator.clipboard.writeText(url)
      toast.success('已上传并复制链接到剪贴板')
    }
    catch (error) {
      toast.error(error instanceof Error ? error.message : '上传失败')
    }
    finally {
      setIsUploading(false)
    }
  }, [generatedImage, githubConfig, isConfigured])

  // 重置状态
  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setPrompt('')
      setGeneratedImage(null)
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">auto_awesome</span>
              AI 生成公众号封面
            </DialogTitle>
            {session && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsHistoryOpen(true)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="material-symbols-outlined text-[18px] mr-1">history</span>
                历史记录
              </Button>
            )}
          </div>
          <DialogDescription className="flex items-center justify-between">
            <span>使用 AI 为你的文章生成精美的公众号封面图</span>
            <span className={cn(
              'text-xs font-medium px-2 py-0.5 rounded-full',
              session
                ? 'bg-primary/10 text-primary'
                : guestCredits > 0
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
            )}
            >
              {session
                ? `剩余 ${userProfile?.credits ?? '--'} 次`
                : `今日免费 ${guestCredits}/${GUEST_DAILY_LIMIT} 次`}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto flex-1" style={{ scrollbarGutter: 'stable' }}>
          {/* 文章标题提示 */}
          {post && (
            <div className="text-sm text-gray-500 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
              <span className="font-medium">当前文章：</span>
              {post.title || '未命名'}
            </div>
          )}

          {/* 第一步：AI 分析文章 */}
          <Button
            onClick={handleAnalyzeArticle}
            disabled={isAnalyzing || !post}
            variant="outline"
            className="w-full h-12"
          >
            {isAnalyzing
              ? (
                  <>
                    <span className="material-symbols-outlined text-[20px] mr-2 animate-spin">progress_activity</span>
                    AI 分析中...
                  </>
                )
              : (
                  <>
                    <span className="material-symbols-outlined text-[20px] mr-2">auto_awesome</span>
                    一键生成描述（基于文章内容）
                  </>
                )}
          </Button>

          {/* 图片描述输入框 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              图片描述
              <span className="text-xs text-gray-400 ml-2">可手动编辑</span>
            </label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="点击上方按钮自动生成，或手动输入描述..."
              className="w-full h-28 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md p-3 resize-none focus:ring-primary focus:border-primary"
              disabled={isAnalyzing || isGenerating}
            />
          </div>

          {/* 图片尺寸选择 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              图片尺寸
            </label>
            <div className="flex flex-wrap gap-2">
              {IMAGE_SIZE_PRESETS.map(size => (
                <button
                  key={size.name}
                  onClick={() => setSelectedSize(size.name)}
                  disabled={isGenerating}
                  className={cn(
                    'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                    selectedSize === size.name
                      ? 'border-2 border-primary bg-primary/10 text-primary'
                      : 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
                  )}
                >
                  {size.label}
                  {size.desc && (
                    <span className="ml-1 text-[10px] text-primary">
                      (
                      {size.desc}
                      )
                    </span>
                  )}
                  <span className="ml-1 text-[10px] text-gray-400">{size.ratio}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 第二步：生成图片 */}
          <Button
            onClick={handleGenerateImage}
            disabled={isGenerating || !prompt.trim()}
            className="w-full"
          >
            {isGenerating
              ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] mr-2 animate-spin">progress_activity</span>
                    生成中（约 6-12 秒）...
                  </>
                )
              : (
                  <>
                    <span className="material-symbols-outlined text-[18px] mr-2">brush</span>
                    生成封面
                  </>
                )}
          </Button>

          {/* 预览区域 */}
          {generatedImage && (
            <div className="space-y-3 pt-2">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">生成结果</div>
              <div
                className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow-md"
                style={{
                  aspectRatio: (() => {
                    const size = IMAGE_SIZE_PRESETS.find(s => s.name === selectedSize)
                    return size ? `${size.width}/${size.height}` : '2.35/1'
                  })(),
                }}
              >
                <img
                  src={generatedImage}
                  alt="Generated cover"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2">
                <Button
                  onClick={handleCopyImage}
                  variant="outline"
                  size="icon"
                  title="复制图片"
                >
                  <span className="material-symbols-outlined text-[18px]">content_copy</span>
                </Button>
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  className="flex-1"
                >
                  <span className="material-symbols-outlined text-[18px] mr-2">download</span>
                  下载
                </Button>
                <Button
                  onClick={handleUploadToHost}
                  disabled={isUploading || !isConfigured()}
                  className={cn('flex-1', !isConfigured() && 'opacity-50')}
                  title={!isConfigured() ? '请先配置图床' : '上传到图床并复制链接'}
                >
                  {isUploading
                    ? (
                        <>
                          <span className="material-symbols-outlined text-[18px] mr-2 animate-spin">progress_activity</span>
                          上传中...
                        </>
                      )
                    : (
                        <>
                          <span className="material-symbols-outlined text-[18px] mr-2">cloud_upload</span>
                          上传图床
                        </>
                      )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>

      {/* 历史记录弹窗 */}
      <CoverHistoryDialog
        open={isHistoryOpen}
        onOpenChange={setIsHistoryOpen}
      />

      {/* 额度不足引导弹窗 */}
      <UpgradeDialog
        open={isUpgradeOpen}
        onOpenChange={setIsUpgradeOpen}
        type={session ? 'user' : 'guest'}
        remainingCredits={session ? (userProfile?.credits ?? 0) : guestCredits}
      />
    </Dialog>
  )
}
