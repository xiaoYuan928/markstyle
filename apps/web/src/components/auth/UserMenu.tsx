'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { CoverHistoryDialog } from '@/components/editor/CoverHistoryDialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { usePostStore } from '@/stores'
import { useAuth } from './AuthProvider'
import { LoginDialog } from './LoginDialog'

interface UserMenuProps {
  className?: string
}

export function UserMenu({ className }: UserMenuProps) {
  const { user, userProfile, isLoading, signOut } = useAuth()
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [showHistoryDialog, setShowHistoryDialog] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)

  const syncMode = usePostStore(state => state.syncMode)
  const migrateToCloud = usePostStore(state => state.migrateToCloud)

  // 加载中状态
  if (isLoading) {
    return (
      <div className={className}>
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
      </div>
    )
  }

  // 未登录状态
  if (!user) {
    return (
      <>
        <button
          onClick={() => setShowLoginDialog(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">person</span>
          <span className="hidden sm:inline">登录</span>
        </button>
        <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
      </>
    )
  }

  // 已登录状态
  const avatarUrl = user.user_metadata?.avatar_url
  const name = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0]
  const email = user.email

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none">
            {avatarUrl
              ? (
                  <img
                    src={avatarUrl}
                    alt={name || 'User'}
                    className="w-8 h-8 rounded-full"
                  />
                )
              : (
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                    {name?.charAt(0) || email?.charAt(0) || 'U'}
                  </div>
                )}
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          {/* User Info */}
          <div className="px-2 py-2">
            <p className="text-sm font-medium truncate">{name}</p>
            <p className="text-xs text-muted-foreground truncate">{email}</p>
          </div>

          <DropdownMenuSeparator />

          {/* Credits Display */}
          <div className="px-2 py-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">生图额度</span>
              <span className="font-medium text-primary">
                {userProfile?.credits ?? '--'}
                {' '}
                次
              </span>
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* Menu Items */}
          <DropdownMenuItem className="cursor-pointer" onClick={() => setShowHistoryDialog(true)}>
            <span className="material-symbols-outlined text-[18px] mr-2">history</span>
            封面历史
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer"
            disabled={isSyncing}
            onClick={async () => {
              if (syncMode !== 'cloud') {
                toast.info('请先登录以使用云同步')
                return
              }
              setIsSyncing(true)
              try {
                const result = await migrateToCloud()
                if (result.created > 0 || result.updated > 0) {
                  toast.success(`同步完成：新增 ${result.created} 篇，更新 ${result.updated} 篇`)
                }
                else if (result.skipped > 0) {
                  toast.info('本地文档已全部同步到云端')
                }
                else {
                  toast.info('没有需要同步的本地文档')
                }
              }
              catch (error) {
                toast.error('同步失败，请稍后重试')
                console.error('Migration error:', error)
              }
              finally {
                setIsSyncing(false)
              }
            }}
          >
            <span className={`material-symbols-outlined text-[18px] mr-2 ${isSyncing ? 'animate-spin' : ''}`}>
              {isSyncing ? 'progress_activity' : 'cloud_sync'}
            </span>
            {isSyncing ? '同步中...' : '同步本地文档'}
          </DropdownMenuItem>

          <DropdownMenuItem className="cursor-pointer">
            <span className="material-symbols-outlined text-[18px] mr-2">diamond</span>
            升级套餐
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            className="cursor-pointer text-red-600 focus:text-red-600"
            onClick={() => signOut()}
          >
            <span className="material-symbols-outlined text-[18px] mr-2">logout</span>
            退出登录
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CoverHistoryDialog
        open={showHistoryDialog}
        onOpenChange={setShowHistoryDialog}
      />
    </>
  )
}
