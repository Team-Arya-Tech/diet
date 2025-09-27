import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getUserById } from '@/lib/user-storage'

export async function POST(request: NextRequest) {
  try {
    // Clear the session cookie
    const cookieStore = await cookies()
    cookieStore.delete('session')

    return NextResponse.json({
      message: 'Logout successful'
    })

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')

    if (!sessionCookie) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Decode session token
    try {
      const sessionData = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString())
      
      // Verify user still exists
      const user = getUserById(sessionData.userId)
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 401 }
        )
      }
      
      return NextResponse.json({
        user: {
          userId: user.id,
          username: user.username,
          role: user.role,
          fullName: user.fullName,
          email: user.email
        },
        authenticated: true
      })
    } catch (decodeError) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      )
    }

  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}