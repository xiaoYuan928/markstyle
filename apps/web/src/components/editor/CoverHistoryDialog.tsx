'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useAuth } from '@/components/auth'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getSupabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

interface CoverRecord {
  id: string
  prompt: string
  image_url: string
  width: number
  height: number
  credits_used: number
  created_at: string
}

interface CoverHistoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CoverHistoryDialog({ open, onOpenChange }: CoverHistoryDialogProps) {
  const [covers, setCovers] = useState<CoverRecord[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCover, setSelectedCover] = useState<CoverRecord | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  const { session } = useAuth()

  // 获取 access token
  const getAccessToken = useCallback(async (): Promise<string | null> => {
    if (!session)
      return null
    const supabase = getSupabase()
    const { data } = await supabase.auth.getSession()
    return data.session?.access_token ?? null
  }, [session])

  // 加载历史记录
  const loadHistory = useCallback(async (pageNum: number = 1) => {
    if (!session)
      return

    setIsLoading(true)
    try {
      const token = await getAccessToken()
      if (!token) {
        toast.error('请先登录')
        return
      }

      const response = await fetch(`/api/covers/history?page=${pageNum}&limit=12`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '获取失败')
      }

      setCovers(result.data)
      setPage(result.pagination.page)
      setTotalPages(result.pagination.totalPages)
      setTotal(result.pagination.total)
    }
    catch (error) {
      toast.error(error instanceof Error ? error.message : '获取历史记录失败')
    }
    finally {
      setIsLoading(false)
    }
  }, [session, getAccessToken])

  // 打开时加载数据
  useEffect(() => {
    if (open && session) {
      loadHistory(1)
    }
  }, [open, session, loadHistory])

  // 删除记录
  const handleDelete = useCallback(async (id: string) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('确定要删除这条记录吗？'))
      return

    try {
      const token = await getAccessToken()
      if (!token)
        return

      const response = await fetch('/api/covers/history', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || '删除失败')
      }

      toast.success('删除成功')
      setSelectedCover(null)
      loadHistory(page)
    }
    catch (error) {
      toast.error(error instanceof Error ? error.message : '删除失败')
    }
  }, [getAccessToken, loadHistory, page])

  // 下载图片
  const handleDownload = useCallback(async (cover: CoverRecord) => {
    try {
      const response = await fetch(cover.image_url)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      const a = document.createElement('a')
      a.href = url
      a.download = `cover-${cover.id.slice(0, 8)}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success('下载成功')
    }
    catch {
      toast.error('下载失败')
    }
  }, [])

  // 复制图片
  const handleCopyImage = useCallback(async (cover: CoverRecord) => {
    try {
      const response = await fetch(cover.image_url)
      const blob = await response.blob()

      // 转换为 PNG
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
    catch {
      toast.error('复制失败')
    }
  }, [])

  // 格式化时间
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (!session) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>生成历史</DialogTitle>
            <DialogDescription>
              请先登录查看封面生成历史
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader className="shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">history</span>
            封面生成历史
            {total > 0 && (
              <span className="text-sm font-normal text-gray-500">
                (
                {total}
                {' '}
                张)
              </span>
            )}
          </DialogTitle>
          <DialogDescription>
            查看和管理你生成过的封面图片
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex gap-4">
          {/* 左侧：封面列表 */}
          <div className="flex-1 overflow-y-auto" style={{ scrollbarGutter: 'stable' }}>
            {isLoading
              ? (
                  <div className="flex items-center justify-center h-40">
                    <span className="material-symbols-outlined text-4xl animate-spin text-gray-400">progress_activity</span>
                  </div>
                )
              : covers.length === 0
                ? (
                    <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                      <span className="material-symbols-outlined text-4xl mb-2">image_not_supported</span>
                      <p>暂无生成记录</p>
                    </div>
                  )
                : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {covers.map(cover => (
                        <button
                          key={cover.id}
                          onClick={() => setSelectedCover(cover)}
                          className={cn(
                            'relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden transition-all hover:ring-2 hover:ring-primary/50',
                            selectedCover?.id === cover.id && 'ring-2 ring-primary',
                          )}
                        >
                          <img
                            src={cover.image_url}
                            alt={cover.prompt.slice(0, 20)}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                            <p className="text-white text-xs truncate">{formatTime(cover.created_at)}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

            {/* 分页 */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadHistory(page - 1)}
                  disabled={page <= 1 || isLoading}
                >
                  <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                </Button>
                <span className="text-sm text-gray-500">
                  {page}
                  {' '}
                  /
                  {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadHistory(page + 1)}
                  disabled={page >= totalPages || isLoading}
                >
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </Button>
              </div>
            )}
          </div>

          {/* 右侧：详情面板 */}
          {selectedCover && (
            <div className="w-72 shrink-0 border-l pl-4 flex flex-col">
              <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden mb-3">
                <img
                  src={selectedCover.image_url}
                  alt="Selected cover"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2 text-sm flex-1 overflow-y-auto">
                <div>
                  <p className="text-gray-500 text-xs">尺寸</p>
                  <p>
                    {selectedCover.width}
                    {' '}
                    x
                    {' '}
                    {selectedCover.height}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">生成时间</p>
                  <p>{new Date(selectedCover.created_at).toLocaleString('zh-CN')}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs mb-1">描述</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-4">
                    {selectedCover.prompt}
                  </p>
                </div>
              </div>

              {/* 操作按钮 */}
              <div className="flex gap-2 mt-3 pt-3 border-t">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopyImage(selectedCover)}
                  title="复制图片"
                >
                  <span className="material-symbols-outlined text-[18px]">content_copy</span>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleDownload(selectedCover)}
                >
                  <span className="material-symbols-outlined text-[18px] mr-1">download</span>
                  下载
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDelete(selectedCover.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  title="删除"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
