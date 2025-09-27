"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ClearSessionPage() {
  const router = useRouter()

  useEffect(() => {
    // Clear localStorage
    localStorage.removeItem('ayurvedic_user')
    
    // Call logout API to clear session cookies
    fetch('/api/auth/logout', { method: 'POST' })
      .then(() => {
        // Redirect to auth page
        router.push('/auth/login')
      })
      .catch(() => {
        // Still redirect even if API fails
        router.push('/auth/login')
      })
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Clearing Session...</h1>
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  )
}