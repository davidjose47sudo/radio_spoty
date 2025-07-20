"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { validateCurrentSession, customSignOut, type CustomAuthUser } from '@/lib/auth-custom'

interface AuthContextType {
  user: CustomAuthUser | null
  loading: boolean
  isAuthenticated: boolean
  login: (user: CustomAuthUser) => void
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<CustomAuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const validateSession = async () => {
    try {
      const userData = await validateCurrentSession()
      setUser(userData)
    } catch (error) {
      console.error('Session validation error:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = (userData: CustomAuthUser) => {
    setUser(userData)
  }

  const logout = async () => {
    try {
      await customSignOut()
      setUser(null)
      // Redirect to home or login page
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
      // Force logout even if API call fails
      setUser(null)
      window.location.href = '/'
    }
  }

  const refreshUser = async () => {
    await validateSession()
  }

  useEffect(() => {
    validateSession()
  }, [])

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser
  }

  return (
    <AuthContext.Provider value={value}>
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

// Helper hooks for specific user properties
export function useUser() {
  const { user } = useAuth()
  return user
}

export function useIsAdmin() {
  const { user } = useAuth()
  return user?.role === 'admin'
}

export function useIsPremium() {
  const { user } = useAuth()
  return user?.subscription_plan === 'premium' || user?.subscription_plan === 'family'
}

export function useCanUseAI() {
  const { user } = useAuth()
  return (
    user?.subscription_status === 'active' &&
    (user?.subscription_plan === 'premium' || user?.subscription_plan === 'family')
  )
}
