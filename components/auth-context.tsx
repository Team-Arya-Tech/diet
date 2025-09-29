"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  userId: number
  username: string
  role: "admin" | "practitioner" | "assistant"
  fullName: string
  email?: string
  phone?: string
  address?: string
  bio?: string
  department?: string
  experience?: string
  specialization?: string
  profilePicture?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
  updateUserProfile?: (profileData: any) => Promise<void>
  refreshUser?: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      // Check with server first to validate session
      const response = await fetch('/api/auth/session')
      if (response.ok) {
        const data = await response.json()
        if (data.authenticated && data.user) {
          setUser(data.user)
          // Update localStorage with verified user data
          localStorage.setItem('ayurvedic_user', JSON.stringify(data.user))
        } else {
          // No valid session
          localStorage.removeItem('ayurvedic_user')
          setUser(null)
        }
      } else {
        // Clear invalid session
        localStorage.removeItem('ayurvedic_user')
        setUser(null)
      }
    } catch (error) {
      console.error('Session check failed:', error)
      localStorage.removeItem('ayurvedic_user')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (username: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Login failed')
    }

    // Store user data
    const userData = {
      userId: data.user.id,
      username: data.user.username,
      role: data.user.role,
      fullName: data.user.fullName,
      email: data.user.email
    }

    setUser(userData)
    localStorage.setItem('ayurvedic_user', JSON.stringify(userData))

    return data
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST'
      })
    } catch (error) {
      console.error('Logout error:', error)
    }

    setUser(null)
    localStorage.removeItem('ayurvedic_user')
    router.push('/')
  }

  const updateUserProfile = async (profileData: any) => {
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      const updatedUser = await response.json()
      
      // Update user state with new profile data
      const newUserData = {
        ...user,
        ...profileData,
        userId: user?.userId || updatedUser.userId,
      }
      
      setUser(newUserData)
      localStorage.setItem('ayurvedic_user', JSON.stringify(newUserData))
      
    } catch (error) {
      console.error('Profile update error:', error)
      throw error
    }
  }

  const refreshUser = async () => {
    if (!user) return
    
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        localStorage.setItem('ayurvedic_user', JSON.stringify(userData))
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error)
    }
  }

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    updateUserProfile,
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

// Higher-order component for protected routes
export function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!loading && !user) {
        router.push('/auth/login')
      }
    }, [user, loading, router])

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      )
    }

    if (!user) {
      return null
    }

    return <Component {...props} />
  }
}