import { NextRequest, NextResponse } from 'next/server'
import { getAllUsers } from '@/lib/user-storage'

export async function GET(request: NextRequest) {
  try {
    const users = getAllUsers()
    
    // Return only demo accounts (filter out any user-created accounts for demo purposes)
    const demoAccounts = users
      .filter(user => ['admin', 'doctor', 'assistant'].includes(user.username))
      .map(user => ({
        username: user.username,
        password: user.password, // In production, never expose passwords
        role: user.role,
        fullName: user.fullName
      }))

    return NextResponse.json({ demoAccounts })

  } catch (error) {
    console.error('Demo accounts error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch demo accounts' },
      { status: 500 }
    )
  }
}