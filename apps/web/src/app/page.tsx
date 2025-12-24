'use client'

import type { ThemeName } from '@md/shared/configs'
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'
import { Editor } from '@/components/editor/Editor'
import { OnboardingDialog } from '@/components/onboarding/OnboardingDialog'
import { usePostStore } from '@/stores'
import { useThemeStore } from '@/stores/theme'

function LoadingSpinner() {
  return (
    <div className="h-screen flex items-center justify-center bg-surface">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    </div>
  )
}

function EditorPageContent() {
  const initialize = usePostStore(state => state.initialize)
  const isInitialized = usePostStore(state => state.isInitialized)
  const isLoading = usePostStore(state => state.isLoading)
  const searchParams = useSearchParams()
  const setTheme = useThemeStore(state => state.setTheme)

  // Initialize posts from IndexedDB
  useEffect(() => {
    initialize()
  }, [initialize])

  // Apply theme from URL query (?theme=xxx)
  useEffect(() => {
    const themeParam = searchParams.get('theme')
    if (themeParam) {
      setTheme(themeParam as ThemeName)
    }
  }, [searchParams, setTheme])

  // Show loading state
  if (!isInitialized || isLoading) {
    return <LoadingSpinner />
  }

  return (
    <>
      <Editor />
      <OnboardingDialog />
    </>
  )
}

export default function EditorPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <EditorPageContent />
    </Suspense>
  )
}
