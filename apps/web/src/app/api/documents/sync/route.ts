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

interface LocalDocument {
  id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

/**
 * POST /api/documents/sync - 批量上传本地文档到云端
 * Body: { documents: LocalDocument[] }
 *
 * 逻辑：
 * 1. 检查每个 localId 是否已存在
 * 2. 不存在则创建新文档
 * 3. 存在则根据 updatedAt 决定是否更新
 */
export async function POST(req: Request) {
  try {
    const user = await getUserFromRequest(req)
    if (!user) {
      return Response.json({ error: '请先登录' }, { status: 401 })
    }

    const { documents } = await req.json() as { documents: LocalDocument[] }

    if (!Array.isArray(documents) || documents.length === 0) {
      return Response.json({ error: '没有需要同步的文档' }, { status: 400 })
    }

    const token = req.headers.get('Authorization')?.slice(7)
    if (!token) {
      return Response.json({ error: '无效的认证信息' }, { status: 401 })
    }

    const supabase = createSupabaseClient(token)

    // 获取用户现有的云端文档（按 local_id 索引）
    const { data: existingDocs, error: fetchError } = await supabase
      .from('documents')
      .select('id, local_id, updated_at')
      .eq('user_id', user.userId)

    if (fetchError) {
      console.error('Error fetching existing documents:', fetchError)
      return Response.json({ error: '获取云端文档失败' }, { status: 500 })
    }

    const existingByLocalId = new Map(
      (existingDocs || [])
        .filter(d => d.local_id)
        .map(d => [d.local_id, d]),
    )

    const toCreate: Array<{
      user_id: string
      local_id: string
      title: string
      content: string
      created_at: string
      updated_at: string
    }> = []

    const toUpdate: Array<{
      id: string
      title: string
      content: string
      updated_at: string
    }> = []

    let skipped = 0

    for (const doc of documents) {
      const existing = existingByLocalId.get(doc.id)

      if (existing) {
        // 比较更新时间，本地更新则同步到云端
        const localUpdated = new Date(doc.updatedAt).getTime()
        const cloudUpdated = new Date(existing.updated_at).getTime()

        if (localUpdated > cloudUpdated) {
          toUpdate.push({
            id: existing.id,
            title: doc.title,
            content: doc.content,
            updated_at: doc.updatedAt,
          })
        }
        else {
          skipped++
        }
      }
      else {
        // 新文档
        toCreate.push({
          user_id: user.userId,
          local_id: doc.id,
          title: doc.title,
          content: doc.content,
          created_at: doc.createdAt,
          updated_at: doc.updatedAt,
        })
      }
    }

    let created = 0
    let updated = 0

    // 批量创建新文档
    if (toCreate.length > 0) {
      const { error: createError } = await supabase
        .from('documents')
        .insert(toCreate)

      if (createError) {
        console.error('Error creating documents:', createError)
        return Response.json({ error: '创建文档失败' }, { status: 500 })
      }
      created = toCreate.length
    }

    // 逐个更新文档
    for (const doc of toUpdate) {
      const { error: updateError } = await supabase
        .from('documents')
        .update({
          title: doc.title,
          content: doc.content,
          updated_at: doc.updated_at,
        })
        .eq('id', doc.id)
        .eq('user_id', user.userId)

      if (updateError) {
        console.error('Error updating document:', updateError)
      }
      else {
        updated++
      }
    }

    return Response.json({
      success: true,
      created,
      updated,
      skipped,
      total: documents.length,
    })
  }
  catch (error) {
    console.error('Documents sync error:', error)
    return Response.json({ error: '服务器错误' }, { status: 500 })
  }
}
