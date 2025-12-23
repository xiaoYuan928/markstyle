'use client'

import FingerprintJS from '@fingerprintjs/fingerprintjs'

let cachedFingerprint: string | null = null

/**
 * 获取设备指纹（客户端）
 * 使用 FingerprintJS 生成唯一的设备标识
 */
export async function getFingerprint(): Promise<string> {
  if (cachedFingerprint) {
    return cachedFingerprint
  }

  try {
    const fp = await FingerprintJS.load()
    const result = await fp.get()
    cachedFingerprint = result.visitorId
    return cachedFingerprint
  }
  catch (error) {
    console.error('Failed to get fingerprint:', error)
    // 降级方案：使用随机 ID + 存储到 localStorage
    const fallbackKey = 'device_fallback_id'
    let fallbackId = localStorage.getItem(fallbackKey)
    if (!fallbackId) {
      fallbackId = `fallback_${Date.now()}_${Math.random().toString(36).slice(2)}`
      localStorage.setItem(fallbackKey, fallbackId)
    }
    cachedFingerprint = fallbackId
    return cachedFingerprint
  }
}
