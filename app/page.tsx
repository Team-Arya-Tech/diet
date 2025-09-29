"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-context"
import AuthPage from "@/app/auth/login/page"

export default function HomePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  
  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  // Show login page if not authenticated
  if (!user) {
    return <AuthPage />
  }

  // This shouldn't render due to the redirect, but just in case
  return null
}