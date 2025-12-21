'use client'

import { useEffect } from 'react'
import { Editor } from '@/components/editor/Editor'
import { usePostStore } from '@/stores'

export default function EditorPage() {
  const initialize = usePostStore(state => state.initialize)
  const isInitialized = usePostStore(state => state.isInitialized)
  const isLoading = usePostStore(state => state.isLoading)

  // Initialize posts from IndexedDB
  useEffect(() => {
    initialize()
  }, [initialize])

  // Show loading state
  if (!isInitialized || isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <span className="text-sm text-gray-500">Loading...</span>
        </div>
      </div>
    )
  }

  return <Editor />
}
