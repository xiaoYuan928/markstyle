import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface GitHubConfig {
  repo: string      // 如 'user/repo'
  branch: string    // 如 'main'
  token: string     // GitHub Personal Access Token
  path: string      // 存储路径，如 'images'
}

interface ImageHostState {
  // GitHub 配置
  githubConfig: GitHubConfig

  // 计算属性
  isConfigured: () => boolean

  // Actions
  setGitHubConfig: (config: Partial<GitHubConfig>) => void
  clearConfig: () => void
}

const defaultGitHubConfig: GitHubConfig = {
  repo: '',
  branch: 'main',
  token: '',
  path: 'images',
}

export const useImageHostStore = create<ImageHostState>()(
  persist(
    (set, get) => ({
      githubConfig: defaultGitHubConfig,

      isConfigured: () => {
        const { githubConfig } = get()
        return !!(githubConfig.repo && githubConfig.token)
      },

      setGitHubConfig: (config) => {
        set(state => ({
          githubConfig: { ...state.githubConfig, ...config },
        }))
      },

      clearConfig: () => {
        set({ githubConfig: defaultGitHubConfig })
      },
    }),
    {
      name: 'md-imagehost-storage',
    },
  ),
)
