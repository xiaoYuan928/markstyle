'use client'

import { getSupabase } from './supabase'

/**
 * 云端文档接口（与本地 Document 兼容）
 */
export interface CloudDocument {
  id: string
  localId: string | null
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}

/**
 * 获取 access token
 */
async function getAccessToken(): Promise<string | null> {
  const supabase = getSupabase()
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? null
}

/**
 * 带认证的 fetch
 */
async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = await getAccessToken()
  if (!token) {
    throw new Error('未登录')
  }

  return fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  })
}

/**
 * 转换 API 响应为 CloudDocument
 */
function toCloudDocument(data: {
  id: string
  local_id: string | null
  title: string
  content: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}): CloudDocument {
  return {
    id: data.id,
    localId: data.local_id,
    title: data.title,
    content: data.content,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    deletedAt: data.deleted_at ? new Date(data.deleted_at) : null,
  }
}

/**
 * 云端文档操作 API
 */
export const cloudDocumentsAPI = {
  /**
   * 获取所有未删除的文档
   */
  async getAll(): Promise<CloudDocument[]> {
    const response = await authFetch('/api/documents')
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || '获取文档失败')
    }

    return (data.documents || []).map(toCloudDocument)
  },

  /**
   * 获取单个文档
   */
  async getById(id: string): Promise<CloudDocument | undefined> {
    const docs = await this.getAll()
    return docs.find(d => d.id === id)
  },

  /**
   * 创建文档
   */
  async create(title: string, content: string, localId?: string): Promise<CloudDocument> {
    const response = await authFetch('/api/documents', {
      method: 'POST',
      body: JSON.stringify({ title, content, localId }),
    })
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || '创建文档失败')
    }

    return toCloudDocument(data.document)
  },

  /**
   * 更新文档
   * @returns true 如果更新成功，false 如果失败（静默处理）
   */
  async update(id: string, updates: Partial<Pick<CloudDocument, 'title' | 'content'>>): Promise<boolean> {
    try {
      const response = await authFetch('/api/documents', {
        method: 'PUT',
        body: JSON.stringify({ id, ...updates }),
      })

      if (!response.ok) {
        const data = await response.json()
        console.warn('Cloud update failed:', data.error || '更新文档失败')
        return false
      }
      return true
    }
    catch (error) {
      console.warn('Cloud update error:', error)
      return false
    }
  },

  /**
   * 软删除文档
   */
  async softDelete(id: string): Promise<void> {
    const response = await authFetch(`/api/documents?id=${id}`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || '删除文档失败')
    }
  },

  /**
   * 恢复文档
   */
  async restore(id: string): Promise<void> {
    const response = await authFetch(`/api/documents?id=${id}&restore=true`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || '恢复文档失败')
    }
  },

  /**
   * 永久删除文档
   */
  async hardDelete(id: string): Promise<void> {
    const response = await authFetch(`/api/documents?id=${id}&permanent=true`, {
      method: 'DELETE',
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || '永久删除失败')
    }
  },

  /**
   * 获取回收站文档
   */
  async getDeleted(): Promise<CloudDocument[]> {
    const response = await authFetch('/api/documents?deleted=true')
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || '获取回收站失败')
    }

    return (data.documents || []).map(toCloudDocument)
  },

  /**
   * 清空回收站
   */
  async emptyTrash(): Promise<void> {
    const response = await authFetch('/api/documents?emptyTrash=true', {
      method: 'DELETE',
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || '清空回收站失败')
    }
  },

  /**
   * 同步本地文档到云端
   */
  async syncFromLocal(documents: Array<{
    id: string
    title: string
    content: string
    createdAt: string
    updatedAt: string
  }>): Promise<{ created: number, updated: number, skipped: number }> {
    const response = await authFetch('/api/documents/sync', {
      method: 'POST',
      body: JSON.stringify({ documents }),
    })
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || '同步失败')
    }

    return {
      created: data.created,
      updated: data.updated,
      skipped: data.skipped,
    }
  },
}
