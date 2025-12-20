import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  // Layout
  isEditOnLeft: boolean
  showSidebar: boolean
  showRightPanel: boolean
  previewWidth: 'mobile' | 'full'
  syncScroll: boolean

  // Scroll sync
  scrollSource: 'editor' | 'preview' | null
  scrollPercent: number

  // Dialogs
  showUploadDialog: boolean
  showExportDialog: boolean
  showSettingsDialog: boolean

  // Mobile
  isMobile: boolean
  activeTab: 'editor' | 'preview'

  // Actions
  toggleEditPosition: () => void
  toggleSidebar: () => void
  toggleRightPanel: () => void
  setPreviewWidth: (width: 'mobile' | 'full') => void
  setSyncScroll: (sync: boolean) => void
  setScrollState: (source: 'editor' | 'preview' | null, percent: number) => void
  setShowUploadDialog: (show: boolean) => void
  setShowExportDialog: (show: boolean) => void
  setShowSettingsDialog: (show: boolean) => void
  setIsMobile: (isMobile: boolean) => void
  setActiveTab: (tab: 'editor' | 'preview') => void
}

export const useUIStore = create<UIState>()(
  persist(
    set => ({
      // Layout
      isEditOnLeft: true,
      showSidebar: true,
      showRightPanel: true,
      previewWidth: 'full',
      syncScroll: true,

      // Scroll sync
      scrollSource: null,
      scrollPercent: 0,

      // Dialogs
      showUploadDialog: false,
      showExportDialog: false,
      showSettingsDialog: false,

      // Mobile
      isMobile: false,
      activeTab: 'editor',

      // Actions
      toggleEditPosition: () =>
        set(state => ({ isEditOnLeft: !state.isEditOnLeft })),

      toggleSidebar: () =>
        set(state => ({ showSidebar: !state.showSidebar })),

      toggleRightPanel: () =>
        set(state => ({ showRightPanel: !state.showRightPanel })),

      setPreviewWidth: width => set({ previewWidth: width }),
      setSyncScroll: sync => set({ syncScroll: sync }),
      setScrollState: (source, percent) => set({ scrollSource: source, scrollPercent: percent }),

      setShowUploadDialog: show => set({ showUploadDialog: show }),
      setShowExportDialog: show => set({ showExportDialog: show }),
      setShowSettingsDialog: show => set({ showSettingsDialog: show }),

      setIsMobile: isMobile => set({ isMobile }),
      setActiveTab: tab => set({ activeTab: tab }),
    }),
    {
      name: 'md-ui-storage',
      partialize: state => ({
        isEditOnLeft: state.isEditOnLeft,
        previewWidth: state.previewWidth,
        syncScroll: state.syncScroll,
      }),
    },
  ),
)
