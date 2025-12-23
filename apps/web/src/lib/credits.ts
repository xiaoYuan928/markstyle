/* eslint-disable node/prefer-global/process */
import { createClient } from '@supabase/supabase-js'

/**
 * 创建带用户 token 的 Supabase 客户端
 */
function createSupabaseWithToken(token: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })
}

/**
 * 从请求中获取用户信息
 */
export async function getUserFromRequest(req: Request): Promise<{
  userId: string
  email: string | null
} | null> {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.slice(7)
  const supabase = createSupabaseWithToken(token)

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    return null
  }

  return {
    userId: user.id,
    email: user.email ?? null,
  }
}

/**
 * 获取用户积分余额
 */
export async function getUserCredits(userId: string): Promise<number | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase service role key')
    return null
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .select('credits')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error fetching user credits:', error)
    return null
  }

  return data?.credits ?? null
}

/**
 * 扣减用户积分
 */
export async function deductCredits(
  userId: string,
  amount: number,
  description: string,
  referenceId?: string,
): Promise<{ success: boolean, newBalance?: number, error?: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return { success: false, error: 'Server configuration error' }
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

  // 获取当前积分
  const { data: profile, error: fetchError } = await supabaseAdmin
    .from('user_profiles')
    .select('credits')
    .eq('id', userId)
    .single()

  if (fetchError || !profile) {
    return { success: false, error: 'User profile not found' }
  }

  if (profile.credits < amount) {
    return { success: false, error: 'Insufficient credits' }
  }

  const newBalance = profile.credits - amount

  // 更新积分
  const { error: updateError } = await supabaseAdmin
    .from('user_profiles')
    .update({ credits: newBalance })
    .eq('id', userId)

  if (updateError) {
    console.error('Error updating credits:', updateError)
    return { success: false, error: 'Failed to update credits' }
  }

  // 记录流水
  const { error: transactionError } = await supabaseAdmin
    .from('credit_transactions')
    .insert({
      user_id: userId,
      amount: -amount,
      type: 'usage',
      description,
      reference_id: referenceId,
    })

  if (transactionError) {
    console.error('Error recording transaction:', transactionError)
    // 流水记录失败不影响主流程
  }

  return { success: true, newBalance }
}

/**
 * 保存封面生成记录
 */
export async function saveCoverGeneration(params: {
  userId: string
  prompt: string
  imageUrl: string
  width: number
  height: number
  creditsUsed?: number
}): Promise<{ success: boolean, id?: string, error?: string }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return { success: false, error: 'Server configuration error' }
  }

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

  const { data, error } = await supabaseAdmin
    .from('cover_generations')
    .insert({
      user_id: params.userId,
      prompt: params.prompt,
      image_url: params.imageUrl,
      width: params.width,
      height: params.height,
      credits_used: params.creditsUsed ?? 1,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Error saving cover generation:', error)
    return { success: false, error: 'Failed to save cover generation' }
  }

  return { success: true, id: data?.id }
}

/**
 * 访客每日免费额度管理（基于 localStorage，在客户端使用）
 */
export const GUEST_DAILY_LIMIT = 3

export function getGuestDailyKey(): string {
  const today = new Date().toISOString().split('T')[0]
  return `guest_credits_${today}`
}

/**
 * 获取访客今日已使用次数
 */
export function getGuestUsedCount(): number {
  if (typeof window === 'undefined')
    return 0
  const key = getGuestDailyKey()
  const used = localStorage.getItem(key)
  return used ? Number.parseInt(used, 10) : 0
}

/**
 * 获取访客今日剩余次数
 */
export function getGuestRemainingCount(): number {
  return Math.max(0, GUEST_DAILY_LIMIT - getGuestUsedCount())
}

/**
 * 扣减访客额度
 * @returns 是否扣减成功
 */
export function deductGuestCredit(): boolean {
  if (typeof window === 'undefined')
    return false
  const remaining = getGuestRemainingCount()
  if (remaining <= 0)
    return false

  const key = getGuestDailyKey()
  const newCount = getGuestUsedCount() + 1
  localStorage.setItem(key, String(newCount))
  return true
}

/**
 * 检查访客是否还有额度
 */
export function hasGuestCredits(): boolean {
  return getGuestRemainingCount() > 0
}

// ========== 服务端访客额度管理（基于数据库） ==========

/**
 * 检查访客今日使用次数（服务端）
 * 同时检查 IP 和指纹，取较大值
 */
export async function checkGuestUsage(
  fingerprint: string | null,
  ipAddress: string | null,
): Promise<{ allowed: boolean, used: number, remaining: number }> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    // 配置缺失时，降级为允许（依赖前端检查）
    return { allowed: true, used: 0, remaining: GUEST_DAILY_LIMIT }
  }

  const { createClient } = await import('@supabase/supabase-js')
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

  const today = new Date().toISOString().split('T')[0]
  let maxUsed = 0

  // 检查指纹使用次数
  if (fingerprint) {
    const { data: fpData } = await supabaseAdmin
      .from('guest_usage')
      .select('used_count')
      .eq('fingerprint', fingerprint)
      .eq('used_date', today)
      .single()

    if (fpData?.used_count) {
      maxUsed = Math.max(maxUsed, fpData.used_count)
    }
  }

  // 检查 IP 使用次数
  if (ipAddress) {
    const { data: ipData } = await supabaseAdmin
      .from('guest_usage')
      .select('used_count')
      .eq('ip_address', ipAddress)
      .eq('used_date', today)
      .single()

    if (ipData?.used_count) {
      maxUsed = Math.max(maxUsed, ipData.used_count)
    }
  }

  const remaining = Math.max(0, GUEST_DAILY_LIMIT - maxUsed)
  return {
    allowed: remaining > 0,
    used: maxUsed,
    remaining,
  }
}

/**
 * 记录访客使用（服务端）
 * 同时更新 IP 和指纹的使用记录
 */
export async function recordGuestUsage(
  fingerprint: string | null,
  ipAddress: string | null,
): Promise<boolean> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return false
  }

  const { createClient } = await import('@supabase/supabase-js')
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

  const today = new Date().toISOString().split('T')[0]

  // 辅助函数：更新或插入使用记录
  async function upsertUsage(field: 'fingerprint' | 'ip_address', value: string) {
    const { data: existing } = await supabaseAdmin
      .from('guest_usage')
      .select('used_count')
      .eq(field, value)
      .eq('used_date', today)
      .single()

    if (existing) {
      await supabaseAdmin
        .from('guest_usage')
        .update({
          used_count: existing.used_count + 1,
          updated_at: new Date().toISOString(),
        })
        .eq(field, value)
        .eq('used_date', today)
    }
    else {
      await supabaseAdmin
        .from('guest_usage')
        .insert({
          [field]: value,
          used_date: today,
          used_count: 1,
        })
    }
  }

  try {
    if (fingerprint) {
      await upsertUsage('fingerprint', fingerprint)
    }
    if (ipAddress) {
      await upsertUsage('ip_address', ipAddress)
    }
    return true
  }
  catch (error) {
    console.error('Failed to record guest usage:', error)
    return false
  }
}
