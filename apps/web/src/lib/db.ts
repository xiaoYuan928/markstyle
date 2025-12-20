import Dexie, { type EntityTable } from 'dexie'

/**
 * 文档接口
 */
export interface Document {
  id: string
  title: string
  content: string
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null // 软删除标记
}

/**
 * MarkStyle 数据库
 */
class MarkStyleDB extends Dexie {
  documents!: EntityTable<Document, 'id'>

  constructor() {
    super('markstyle-db')

    this.version(1).stores({
      documents: 'id, title, createdAt, updatedAt, deletedAt',
    })
  }
}

// 数据库单例
export const db = new MarkStyleDB()

/**
 * 文档操作 API
 */
export const documentsAPI = {
  /**
   * 获取所有未删除的文档
   */
  async getAll(): Promise<Document[]> {
    const allDocs = await db.documents.toArray()
    return allDocs
      .filter(doc => doc.deletedAt === null)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  },

  /**
   * 获取单个文档
   */
  async getById(id: string): Promise<Document | undefined> {
    return db.documents.get(id)
  },

  /**
   * 创建文档
   */
  async create(title: string, content: string): Promise<Document> {
    const now = new Date()
    const id = crypto.randomUUID()
    const doc: Document = {
      id,
      title,
      content,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    }
    await db.documents.add(doc)
    return doc
  },

  /**
   * 更新文档
   */
  async update(id: string, updates: Partial<Pick<Document, 'title' | 'content'>>): Promise<void> {
    await db.documents.update(id, {
      ...updates,
      updatedAt: new Date(),
    })
  },

  /**
   * 软删除文档
   */
  async softDelete(id: string): Promise<void> {
    await db.documents.update(id, {
      deletedAt: new Date(),
    })
  },

  /**
   * 恢复文档
   */
  async restore(id: string): Promise<void> {
    await db.documents.update(id, {
      deletedAt: null,
    })
  },

  /**
   * 永久删除文档
   */
  async hardDelete(id: string): Promise<void> {
    await db.documents.delete(id)
  },

  /**
   * 获取回收站文档
   */
  async getDeleted(): Promise<Document[]> {
    return db.documents
      .filter(doc => doc.deletedAt !== null)
      .reverse()
      .sortBy('deletedAt')
  },

  /**
   * 清空回收站
   */
  async emptyTrash(): Promise<void> {
    const deletedDocs = await this.getDeleted()
    const ids = deletedDocs.map(d => d.id)
    await db.documents.bulkDelete(ids)
  },

  /**
   * 批量导入文档
   */
  async bulkImport(docs: Omit<Document, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>[]): Promise<Document[]> {
    const now = new Date()
    const newDocs: Document[] = docs.map(doc => ({
      id: crypto.randomUUID(),
      title: doc.title,
      content: doc.content,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    }))
    await db.documents.bulkAdd(newDocs)
    return newDocs
  },
}

/**
 * 从 localStorage 迁移数据到 IndexedDB
 */
export async function migrateFromLocalStorage(): Promise<boolean> {
  const STORAGE_KEY = 'md-posts-storage'
  const MIGRATION_FLAG = 'markstyle-migrated-to-idb'

  // 检查是否已迁移
  if (localStorage.getItem(MIGRATION_FLAG)) {
    return false
  }

  // 获取旧数据
  const oldData = localStorage.getItem(STORAGE_KEY)
  if (!oldData) {
    localStorage.setItem(MIGRATION_FLAG, 'true')
    return false
  }

  try {
    const parsed = JSON.parse(oldData)
    const posts = parsed.state?.posts || []

    if (posts.length === 0) {
      localStorage.setItem(MIGRATION_FLAG, 'true')
      return false
    }

    // 转换并导入
    const docs: Document[] = posts.map((post: {
      id: string
      title: string
      content: string
      createDatetime: string
      updateDatetime: string
    }) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      createdAt: new Date(post.createDatetime),
      updatedAt: new Date(post.updateDatetime),
      deletedAt: null,
    }))

    await db.documents.bulkPut(docs)

    // 标记已迁移
    localStorage.setItem(MIGRATION_FLAG, 'true')

    console.log(`[Migration] Successfully migrated ${docs.length} documents from localStorage to IndexedDB`)
    return true
  }
  catch (error) {
    console.error('[Migration] Failed to migrate from localStorage:', error)
    return false
  }
}
