/* eslint-disable node/prefer-global/process */
import { createClient } from '@supabase/supabase-js'
import { getUserFromRequest } from '@/lib/credits'

function createSupabaseClient(token: string) {
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
 * GET /api/documents - 获取用户所有文档
 * Query params:
 *   - deleted: 'true' 获取回收站文档，否则获取正常文档
 */
export async function GET(req: Request) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) {
      return Response.json({ error: '请先登录' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const deleted = searchParams.get('deleted') === 'true'

    const token = req.headers.get('Authorization')?.slice(7)
    if (!token) {
      return Response.json({ error: '无效的认证信息' }, { status: 401 })
    }

    const supabase = createSupabaseClient(token)

    let query = supabase
      .from('documents')
      .select('id, local_id, title, content, created_at, updated_at, deleted_at')
      .eq('user_id', user.userId)

    if (deleted) {
      query = query.not('deleted_at', 'is', null)
    }
    else {
      query = query.is('deleted_at', null)
    }

    const { data, error } = await query.order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching documents:', error)
      return Response.json({ error: '获取文档失败' }, { status: 500 })
    }

    return Response.json({ documents: data })
  }
  catch (error) {
    console.error('Documents GET error:', error)
    return Response.json({ error: '服务器错误' }, { status: 500 })
  }
}

/**
 * POST /api/documents - 创建新文档
 * Body: { title, content, localId? }
 */
export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) {
      return Response.json({ error: '请先登录' }, { status: 401 })
    }

    const { title, content, localId } = await req.json()

    const token = req.headers.get('Authorization')?.slice(7)
    if (!token) {
      return Response.json({ error: '无效的认证信息' }, { status: 401 })
    }

    const supabase = createSupabaseClient(token)

    const { data, error } = await supabase
      .from('documents')
      .insert({
        user_id: user.userId,
        title: title || '未命名文档',
        content: content || '',
        local_id: localId || null,
      })
      .select('id, local_id, title, content, created_at, updated_at')
      .single()

    if (error) {
      console.error('Error creating document:', error)
      return Response.json({ error: '创建文档失败' }, { status: 500 })
    }

    return Response.json({ document: data })
  }
  catch (error) {
    console.error('Documents POST error:', error)
    return Response.json({ error: '服务器错误' }, { status: 500 })
  }
}

/**
 * PUT /api/documents - 更新文档
 * Body: { id, title?, content? }
 */
export async function PUT(req: Request) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) {
      return Response.json({ error: '请先登录' }, { status: 401 })
    }

    const { id, title, content } = await req.json()

    if (!id) {
      return Response.json({ error: '缺少文档 ID' }, { status: 400 })
    }

    const token = req.headers.get('Authorization')?.slice(7)
    if (!token) {
      return Response.json({ error: '无效的认证信息' }, { status: 401 })
    }

    const supabase = createSupabaseClient(token)

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }
    if (title !== undefined)
      updates.title = title
    if (content !== undefined)
      updates.content = content

    const { data, error } = await supabase
      .from('documents')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.userId)
      .select('id, title, content, updated_at')
      .single()

    if (error) {
      console.error('Error updating document:', error)
      return Response.json({ error: '更新文档失败' }, { status: 500 })
    }

    return Response.json({ document: data })
  }
  catch (error) {
    console.error('Documents PUT error:', error)
    return Response.json({ error: '服务器错误' }, { status: 500 })
  }
}

/**
 * DELETE /api/documents - 删除文档（软删除）
 * Query params:
 *   - id: 文档 ID
 *   - permanent: 'true' 永久删除
 *   - restore: 'true' 恢复文档
 *   - emptyTrash: 'true' 清空回收站
 */
export async function DELETE(req: Request) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) {
      return Response.json({ error: '请先登录' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const permanent = searchParams.get('permanent') === 'true'
    const restore = searchParams.get('restore') === 'true'
    const emptyTrash = searchParams.get('emptyTrash') === 'true'

    const token = req.headers.get('Authorization')?.slice(7)
    if (!token) {
      return Response.json({ error: '无效的认证信息' }, { status: 401 })
    }

    const supabase = createSupabaseClient(token)

    // 清空回收站
    if (emptyTrash) {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('user_id', user.userId)
        .not('deleted_at', 'is', null)

      if (error) {
        console.error('Error emptying trash:', error)
        return Response.json({ error: '清空回收站失败' }, { status: 500 })
      }

      return Response.json({ success: true })
    }

    if (!id) {
      return Response.json({ error: '缺少文档 ID' }, { status: 400 })
    }

    // 恢复文档
    if (restore) {
      const { error } = await supabase
        .from('documents')
        .update({ deleted_at: null, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('user_id', user.userId)

      if (error) {
        console.error('Error restoring document:', error)
        return Response.json({ error: '恢复文档失败' }, { status: 500 })
      }

      return Response.json({ success: true })
    }

    // 永久删除
    if (permanent) {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id)
        .eq('user_id', user.userId)

      if (error) {
        console.error('Error deleting document permanently:', error)
        return Response.json({ error: '永久删除失败' }, { status: 500 })
      }

      return Response.json({ success: true })
    }

    // 软删除
    const { error } = await supabase
      .from('documents')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', user.userId)

    if (error) {
      console.error('Error soft deleting document:', error)
      return Response.json({ error: '删除文档失败' }, { status: 500 })
    }

    return Response.json({ success: true })
  }
  catch (error) {
    console.error('Documents DELETE error:', error)
    return Response.json({ error: '服务器错误' }, { status: 500 })
  }
}
