import { type Document, documentsAPI, migrateFromLocalStorage } from '@/lib/db'
import { create } from 'zustand'

export interface Post {
  id: string
  title: string
  content: string
  createDatetime: string
  updateDatetime: string
}

interface PostState {
  posts: Post[]
  deletedPosts: Post[]
  currentPostId: string | null
  isLoading: boolean
  isInitialized: boolean
  showTrash: boolean

  // Computed
  currentPost: () => Post | undefined

  // Actions
  initialize: () => Promise<void>
  createPost: (title?: string, content?: string) => Promise<string>
  updatePost: (id: string, updates: Partial<Pick<Post, 'title' | 'content'>>) => Promise<void>
  deletePost: (id: string) => Promise<void>
  restorePost: (id: string) => Promise<void>
  permanentlyDeletePost: (id: string) => Promise<void>
  emptyTrash: () => Promise<void>
  setCurrentPost: (id: string) => void
  setShowTrash: (show: boolean) => void
  updateCurrentPostContent: (content: string) => void
  importMarkdownFiles: (files: File[]) => Promise<number>
  refreshDeletedPosts: () => Promise<void>
}

const DEFAULT_CONTENT = `# 欢迎使用 MarkStyle

这是一款专为**公众号排版**设计的 Markdown 编辑器。

## 主要功能

- 实时预览
- 多种主题
- 一键复制到公众号
- 支持从飞书/Notion 粘贴

## 开始写作

在左侧编辑器中输入 Markdown 内容，右侧实时预览效果。

\`\`\`javascript
console.log('Hello, MarkStyle!')
\`\`\`

> 提示：点击右上角「复制」按钮，可将排版后的内容粘贴到公众号编辑器中。

- 列表项 1
- 列表项 2
- 列表项 3
`

/**
 * 将 Document 转换为 Post（兼容旧接口）
 */
function documentToPost(doc: Document): Post {
  return {
    id: doc.id,
    title: doc.title,
    content: doc.content,
    createDatetime: doc.createdAt.toISOString(),
    updateDatetime: doc.updatedAt.toISOString(),
  }
}

// 防抖保存，避免频繁写入 IndexedDB
let saveTimeout: ReturnType<typeof setTimeout> | null = null
const SAVE_DEBOUNCE_MS = 500

export const usePostStore = create<PostState>()((set, get) => ({
  posts: [],
  deletedPosts: [],
  currentPostId: null,
  isLoading: false,
  isInitialized: false,
  showTrash: false,

  currentPost: () => {
    const { posts, currentPostId } = get()
    return posts.find(p => p.id === currentPostId)
  },

  initialize: async () => {
    if (get().isInitialized) return

    set({ isLoading: true })

    try {
      // 先尝试从 localStorage 迁移
      await migrateFromLocalStorage()

      // 从 IndexedDB 加载所有文档
      const docs = await documentsAPI.getAll()
      const posts = docs.map(documentToPost)

      // 如果没有文档，创建一个默认文档
      if (posts.length === 0) {
        const newDoc = await documentsAPI.create('欢迎使用 MarkStyle', DEFAULT_CONTENT)
        const newPost = documentToPost(newDoc)
        set({
          posts: [newPost],
          currentPostId: newPost.id,
          isLoading: false,
          isInitialized: true,
        })
        return
      }

      // 恢复上次选中的文档
      const lastPostId = localStorage.getItem('markstyle-last-post-id')
      const currentPostId = posts.find(p => p.id === lastPostId)?.id || posts[0]?.id || null

      set({
        posts,
        currentPostId,
        isLoading: false,
        isInitialized: true,
      })
    }
    catch (error) {
      console.error('Failed to initialize posts:', error)
      set({ isLoading: false, isInitialized: true })
    }
  },

  createPost: async (title = '未命名文档', content = '') => {
    const doc = await documentsAPI.create(title, content)
    const post = documentToPost(doc)

    set(state => ({
      posts: [post, ...state.posts],
      currentPostId: post.id,
    }))

    localStorage.setItem('markstyle-last-post-id', post.id)
    return post.id
  },

  updatePost: async (id, updates) => {
    // 立即更新内存状态
    set(state => ({
      posts: state.posts.map(p =>
        p.id === id
          ? { ...p, ...updates, updateDatetime: new Date().toISOString() }
          : p,
      ),
    }))

    // 防抖保存到 IndexedDB
    if (saveTimeout) {
      clearTimeout(saveTimeout)
    }
    saveTimeout = setTimeout(async () => {
      try {
        await documentsAPI.update(id, updates)
      }
      catch (error) {
        console.error('Failed to save post:', error)
      }
    }, SAVE_DEBOUNCE_MS)
  },

  deletePost: async (id) => {
    // 立即更新内存状态
    set((state) => {
      const newPosts = state.posts.filter(p => p.id !== id)
      const newCurrentId
        = state.currentPostId === id
          ? newPosts[0]?.id ?? null
          : state.currentPostId

      if (newCurrentId) {
        localStorage.setItem('markstyle-last-post-id', newCurrentId)
      }

      return { posts: newPosts, currentPostId: newCurrentId }
    })

    // 从 IndexedDB 删除（软删除）
    try {
      await documentsAPI.softDelete(id)
    }
    catch (error) {
      console.error('Failed to delete post:', error)
    }
  },

  setCurrentPost: (id) => {
    set({ currentPostId: id })
    localStorage.setItem('markstyle-last-post-id', id)
  },

  updateCurrentPostContent: (content) => {
    const { currentPostId, updatePost } = get()
    if (currentPostId) {
      updatePost(currentPostId, { content })
    }
  },

  importMarkdownFiles: async (files) => {
    const imported: Post[] = []

    for (const file of files) {
      try {
        const content = await file.text()
        // 使用文件名（去掉扩展名）作为标题
        const title = file.name.replace(/\.md$/i, '') || '导入的文档'

        const doc = await documentsAPI.create(title, content)
        imported.push(documentToPost(doc))
      }
      catch (error) {
        console.error(`Failed to import file ${file.name}:`, error)
      }
    }

    if (imported.length > 0) {
      set(state => ({
        posts: [...imported, ...state.posts],
        currentPostId: imported[0].id,
      }))

      localStorage.setItem('markstyle-last-post-id', imported[0].id)
    }

    return imported.length
  },

  setShowTrash: (show) => {
    set({ showTrash: show })
    if (show) {
      get().refreshDeletedPosts()
    }
  },

  refreshDeletedPosts: async () => {
    try {
      const docs = await documentsAPI.getDeleted()
      const posts = docs.map(documentToPost)
      set({ deletedPosts: posts })
    }
    catch (error) {
      console.error('Failed to load deleted posts:', error)
    }
  },

  restorePost: async (id) => {
    try {
      await documentsAPI.restore(id)
      const doc = await documentsAPI.getById(id)
      if (doc) {
        const post = documentToPost(doc)
        set(state => ({
          posts: [post, ...state.posts],
          deletedPosts: state.deletedPosts.filter(p => p.id !== id),
        }))
      }
    }
    catch (error) {
      console.error('Failed to restore post:', error)
    }
  },

  permanentlyDeletePost: async (id) => {
    try {
      await documentsAPI.hardDelete(id)
      set(state => ({
        deletedPosts: state.deletedPosts.filter(p => p.id !== id),
      }))
    }
    catch (error) {
      console.error('Failed to permanently delete post:', error)
    }
  },

  emptyTrash: async () => {
    try {
      await documentsAPI.emptyTrash()
      set({ deletedPosts: [] })
    }
    catch (error) {
      console.error('Failed to empty trash:', error)
    }
  },
}))
