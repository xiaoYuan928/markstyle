'use client'

import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { usePostStore, useUIStore } from '@/stores'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface PostItemProps {
  post: { id: string, title: string }
  isActive: boolean
  onSelect: () => void
  onRename: (newTitle: string) => void
  onDelete: () => void
}

function PostItem({ post, isActive, onSelect, onRename, onDelete }: PostItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(post.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setEditTitle(post.title)
    setIsEditing(true)
  }

  const handleSubmit = () => {
    const trimmed = editTitle.trim()
    if (trimmed && trimmed !== post.title) {
      onRename(trimmed)
    }
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
    else if (e.key === 'Escape') {
      setEditTitle(post.title)
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <div
        className={cn(
          'flex items-center space-x-2 px-3 py-2 rounded-md border-l-2',
          isActive
            ? 'bg-blue-50 dark:bg-blue-900/20 border-primary'
            : 'border-transparent',
        )}
      >
        <span className="material-symbols-outlined text-[18px] text-gray-400">article</span>
        <input
          ref={inputRef}
          type="text"
          value={editTitle}
          onChange={e => setEditTitle(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          className="flex-1 min-w-0 bg-white dark:bg-gray-800 border border-primary rounded px-1 py-0.5 text-sm outline-none"
        />
      </div>
    )
  }

  return (
    <DropdownMenu>
      <div
        className={cn(
          'flex items-center px-3 py-2 rounded-md transition-colors border-l-2 group cursor-pointer',
          isActive
            ? 'bg-blue-50 dark:bg-blue-900/20 text-primary font-medium border-primary'
            : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 border-transparent',
        )}
        onClick={onSelect}
        onDoubleClick={handleDoubleClick}
      >
        <span className="material-symbols-outlined text-[18px] mr-2">article</span>
        <span className="truncate flex-1 text-sm">
          {post.title || 'Untitled'}
          .md
        </span>
        <DropdownMenuTrigger asChild>
          <button
            onClick={e => e.stopPropagation()}
            className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-opacity"
          >
            <span className="material-symbols-outlined text-[16px]">more_vert</span>
          </button>
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onClick={() => {
            setEditTitle(post.title)
            setIsEditing(true)
          }}
        >
          <span className="material-symbols-outlined text-[16px] mr-2">edit</span>
          重命名
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onDelete}
          className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
        >
          <span className="material-symbols-outlined text-[16px] mr-2">delete</span>
          删除
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface TrashItemProps {
  post: { id: string, title: string }
  onRestore: () => void
  onPermanentDelete: () => void
}

function TrashItem({ post, onRestore, onPermanentDelete }: TrashItemProps) {
  return (
    <DropdownMenu>
      <div className="flex items-center px-3 py-2 rounded-md transition-colors text-gray-500 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 group cursor-pointer">
        <span className="material-symbols-outlined text-[18px] mr-2">delete</span>
        <span className="truncate flex-1 text-sm line-through opacity-70">
          {post.title || 'Untitled'}
        </span>
        <DropdownMenuTrigger asChild>
          <button
            onClick={e => e.stopPropagation()}
            className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-opacity"
          >
            <span className="material-symbols-outlined text-[16px]">more_vert</span>
          </button>
        </DropdownMenuTrigger>
      </div>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={onRestore}>
          <span className="material-symbols-outlined text-[16px] mr-2">restore</span>
          恢复
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onPermanentDelete}
          className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
        >
          <span className="material-symbols-outlined text-[16px] mr-2">delete_forever</span>
          彻底删除
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function Sidebar() {
  const {
    posts,
    deletedPosts,
    currentPostId,
    showTrash,
    createPost,
    setCurrentPost,
    updatePost,
    deletePost,
    restorePost,
    permanentlyDeletePost,
    emptyTrash,
    setShowTrash,
    importMarkdownFiles,
  } = usePostStore()
  const { toggleSidebar } = useUIStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCreate = () => {
    createPost()
    setShowTrash(false)
  }

  const handleRename = (id: string, newTitle: string) => {
    updatePost(id, { title: newTitle })
  }

  const handleDelete = (id: string) => {
    if (posts.length <= 1) {
      createPost()
    }
    deletePost(id)
  }

  const handleRestore = async (id: string) => {
    await restorePost(id)
    toast.success('文档已恢复')
  }

  const handlePermanentDelete = async (id: string) => {
    await permanentlyDeletePost(id)
    toast.success('文档已彻底删除')
  }

  const handleEmptyTrash = async () => {
    if (deletedPosts.length === 0) return
    await emptyTrash()
    toast.success('回收站已清空')
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    const mdFiles = Array.from(files).filter(
      f => f.name.endsWith('.md') || f.name.endsWith('.markdown'),
    )

    if (mdFiles.length === 0) {
      toast.error('请选择 Markdown 文件 (.md)')
      return
    }

    const count = await importMarkdownFiles(mdFiles)
    if (count > 0) {
      toast.success(`成功导入 ${count} 个文档`)
      setShowTrash(false)
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <aside className="h-full bg-surface dark:bg-surface flex flex-col">
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      <div className="p-4 flex-1 overflow-hidden flex flex-col">
        <div className="flex space-x-2 mb-4">
          <button
            onClick={handleCreate}
            className="flex-1 bg-primary text-white hover:bg-blue-600 shadow-sm text-sm font-medium py-2 px-3 rounded-md flex items-center justify-center space-x-1 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>新建</span>
          </button>
          <button
            onClick={handleImportClick}
            className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 shadow-sm text-sm font-medium py-2 px-3 rounded-md flex items-center justify-center space-x-1 transition-colors"
            title="导入 Markdown 文件"
          >
            <span className="material-symbols-outlined text-[18px]">upload_file</span>
            <span>导入</span>
          </button>
        </div>

        {/* Tabs: 文档 / 回收站 */}
        <div className="flex border-b border-border mb-3">
          <button
            onClick={() => setShowTrash(false)}
            className={cn(
              'flex-1 py-2 text-xs font-medium transition-colors border-b-2 -mb-px',
              !showTrash
                ? 'text-primary border-primary'
                : 'text-gray-500 border-transparent hover:text-gray-700',
            )}
          >
            <span className="material-symbols-outlined text-[16px] mr-1 align-middle">folder</span>
            文档
          </button>
          <button
            onClick={() => setShowTrash(true)}
            className={cn(
              'flex-1 py-2 text-xs font-medium transition-colors border-b-2 -mb-px',
              showTrash
                ? 'text-primary border-primary'
                : 'text-gray-500 border-transparent hover:text-gray-700',
            )}
          >
            <span className="material-symbols-outlined text-[16px] mr-1 align-middle">delete</span>
            回收站
            {deletedPosts.length > 0 && (
              <span className="ml-1 text-[10px] bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
                {deletedPosts.length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {!showTrash
            ? (
                <nav className="space-y-1">
                  {posts.map(post => (
                    <PostItem
                      key={post.id}
                      post={post}
                      isActive={currentPostId === post.id}
                      onSelect={() => setCurrentPost(post.id)}
                      onRename={newTitle => handleRename(post.id, newTitle)}
                      onDelete={() => handleDelete(post.id)}
                    />
                  ))}
                  {posts.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      暂无文档
                    </div>
                  )}
                </nav>
              )
            : (
                <div className="space-y-1">
                  {deletedPosts.map(post => (
                    <TrashItem
                      key={post.id}
                      post={post}
                      onRestore={() => handleRestore(post.id)}
                      onPermanentDelete={() => handlePermanentDelete(post.id)}
                    />
                  ))}
                  {deletedPosts.length === 0 && (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      回收站为空
                    </div>
                  )}
                  {deletedPosts.length > 0 && (
                    <button
                      onClick={handleEmptyTrash}
                      className="w-full mt-4 py-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    >
                      清空回收站
                    </button>
                  )}
                </div>
              )}
        </div>
      </div>

      <div className="p-3 border-t border-border flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {showTrash ? deletedPosts.length : posts.length}
          {' '}
          个
          {showTrash ? '已删除' : '文档'}
        </span>
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
          title="收起侧边栏"
        >
          <span className="material-symbols-outlined text-[18px]">chevron_left</span>
        </button>
      </div>
    </aside>
  )
}
