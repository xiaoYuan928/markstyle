'use client'

import type { Session, User } from '@supabase/supabase-js'
import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { getSupabase } from '@/lib/supabase'
import { usePostStore } from '@/stores'

interface UserProfile {
  id: string
  plan_type: 'free' | 'basic' | 'pro'
  plan_expires_at: string | null
  credits: number
}

interface AuthContextType {
  user: User | null
  session: Session | null
  userProfile: UserProfile | null
  isLoading: boolean
  signInWithGitHub: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
  refreshCredits: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // 获取用户 profile
  const fetchUserProfile = useCallback(async (userId: string) => {
    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
    return data as UserProfile
  }, [])

  // 刷新积分
  const refreshCredits = useCallback(async () => {
    if (!user)
      return
    const profile = await fetchUserProfile(user.id)
    if (profile) {
      setUserProfile(profile)
    }
  }, [user, fetchUserProfile])

  useEffect(() => {
    const supabase = getSupabase()
    let isMounted = true

    // 获取初始 session（快速完成，不等待 profile）
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!isMounted)
        return
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)

      // 异步加载 profile（不阻塞 UI）
      if (session?.user) {
        fetchUserProfile(session.user.id).then((profile) => {
          if (isMounted && profile)
            setUserProfile(profile)
        }).catch(console.error)

        // 初始加载时如果已登录，切换到云端模式
        usePostStore.getState().switchToCloud().catch(console.error)
      }
    }).catch((err) => {
      console.error('Failed to get session:', err)
      if (isMounted)
        setIsLoading(false)
    })

    // 监听 auth 状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)

        if (session?.user) {
          // 异步加载 profile
          fetchUserProfile(session.user.id).then((profile) => {
            if (isMounted && profile)
              setUserProfile(profile)
          }).catch(console.error)

          // 切换到云端模式（仅在登录时触发）
          if (event === 'SIGNED_IN') {
            usePostStore.getState().switchToCloud().catch(console.error)
          }
        }
        else {
          setUserProfile(null)

          // 切换到本地模式（仅在登出时触发）
          if (event === 'SIGNED_OUT') {
            usePostStore.getState().switchToLocal().catch(console.error)
          }
        }
      },
    )

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [fetchUserProfile])

  const signInWithGitHub = async () => {
    const supabase = getSupabase()
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    })
  }

  const signInWithGoogle = async () => {
    const supabase = getSupabase()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    })
  }

  const signOut = async () => {
    const supabase = getSupabase()
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        userProfile,
        isLoading,
        signInWithGitHub,
        signInWithGoogle,
        signOut,
        refreshCredits,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
