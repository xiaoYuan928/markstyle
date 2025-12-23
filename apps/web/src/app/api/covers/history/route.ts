/* eslint-disable node/prefer-global/process */
import { createClient } from '@supabase/supabase-js'

/**
 * 从请求中获取用户 ID
 */
async function getUserIdFromRequest(req: Request): Promise<string | null> {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.slice(7)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    return null
  }

  return user.id
}

/**
 * GET /api/covers/history - 获取用户封面生成历史
 */
export async function GET(req: Request) {
  try {
    const userId = await getUserIdFromRequest(req)

    if (!userId) {
      return Response.json(
        { error: '请先登录' },
        { status: 401 },
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return Response.json(
        { error: '服务配置错误' },
        { status: 500 },
      )
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // 获取分页参数
    const url = new URL(req.url)
    const page = Number.parseInt(url.searchParams.get('page') || '1', 10)
    const limit = Number.parseInt(url.searchParams.get('limit') || '20', 10)
    const offset = (page - 1) * limit

    // 获取总数
    const { count, error: countError } = await supabaseAdmin
      .from('cover_generations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (countError) {
      console.error('Error counting covers:', countError)
      return Response.json(
        { error: '获取数据失败' },
        { status: 500 },
      )
    }

    // 获取数据
    const { data, error } = await supabaseAdmin
      .from('cover_generations')
      .select('id, prompt, image_url, width, height, credits_used, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching covers:', error)
      return Response.json(
        { error: '获取数据失败' },
        { status: 500 },
      )
    }

    return Response.json({
      data,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  }
  catch (error) {
    console.error('Cover history error:', error)
    return Response.json(
      { error: '服务器错误' },
      { status: 500 },
    )
  }
}

/**
 * DELETE /api/covers/history - 删除封面记录
 */
export async function DELETE(req: Request) {
  try {
    const userId = await getUserIdFromRequest(req)

    if (!userId) {
      return Response.json(
        { error: '请先登录' },
        { status: 401 },
      )
    }

    const { id } = await req.json()

    if (!id) {
      return Response.json(
        { error: '缺少记录 ID' },
        { status: 400 },
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return Response.json(
        { error: '服务配置错误' },
        { status: 500 },
      )
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

    // 确保只能删除自己的记录
    const { error } = await supabaseAdmin
      .from('cover_generations')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting cover:', error)
      return Response.json(
        { error: '删除失败' },
        { status: 500 },
      )
    }

    return Response.json({ success: true })
  }
  catch (error) {
    console.error('Delete cover error:', error)
    return Response.json(
      { error: '服务器错误' },
      { status: 500 },
    )
  }
}
