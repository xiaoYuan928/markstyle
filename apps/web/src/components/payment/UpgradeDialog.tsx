'use client'

import { useState } from 'react'
import { LoginDialog } from '@/components/auth/LoginDialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { GUEST_DAILY_LIMIT } from '@/lib/credits'

type DialogType = 'guest' | 'user'

interface UpgradeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: DialogType
  remainingCredits?: number
}

export function UpgradeDialog({
  open,
  onOpenChange,
  type,
  remainingCredits = 0,
}: UpgradeDialogProps) {
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  // 访客引导登录
  if (type === 'guest') {
    return (
      <>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <span className="material-symbols-outlined text-amber-500">info</span>
                今日免费额度已用完
              </DialogTitle>
              <DialogDescription>
                访客每天可免费生成
                {' '}
                {GUEST_DAILY_LIMIT}
                {' '}
                张封面
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4 border border-primary/20">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-2xl">card_giftcard</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      登录即送 20 次生图额度
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      支持 GitHub / Google 一键登录
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-green-500">check_circle</span>
                  封面生成历史永久保存
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-green-500">check_circle</span>
                  云端文档同步（即将上线）
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onOpenChange(false)}
              >
                明天再来
              </Button>
              <Button
                className="flex-1"
                onClick={() => {
                  onOpenChange(false)
                  setShowLoginDialog(true)
                }}
              >
                <span className="material-symbols-outlined text-[18px] mr-1">login</span>
                立即登录
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
      </>
    )
  }

  // 登录用户引导充值/升级
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500">bolt</span>
            积分不足
          </DialogTitle>
          <DialogDescription>
            当前剩余
            {' '}
            {remainingCredits}
            {' '}
            次生图额度
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* 积分充值选项 */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">选择充值套餐</p>

            <div className="grid gap-2">
              <button className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-primary/5 transition-colors text-left">
                <div>
                  <p className="font-medium">100 积分</p>
                  <p className="text-xs text-gray-500">约 ¥0.10/次</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">¥9.9</p>
                  <p className="text-xs text-gray-400">送 10 积分</p>
                </div>
              </button>

              <button className="flex items-center justify-between p-3 rounded-lg border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-colors text-left relative">
                <div className="absolute -top-2 -right-2 bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                  推荐
                </div>
                <div>
                  <p className="font-medium">500 积分</p>
                  <p className="text-xs text-gray-500">约 ¥0.07/次</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">¥39.9</p>
                  <p className="text-xs text-gray-400">送 100 积分</p>
                </div>
              </button>

              <button className="flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-primary hover:bg-primary/5 transition-colors text-left">
                <div>
                  <p className="font-medium">1000 积分</p>
                  <p className="text-xs text-gray-500">约 ¥0.05/次</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">¥69.9</p>
                  <p className="text-xs text-gray-400">送 300 积分</p>
                </div>
              </button>
            </div>
          </div>

          <p className="text-xs text-center text-gray-400">
            支付功能即将上线，敬请期待
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onOpenChange(false)}
          >
            稍后再说
          </Button>
          <Button
            className="flex-1"
            disabled
          >
            <span className="material-symbols-outlined text-[18px] mr-1">shopping_cart</span>
            立即充值
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
