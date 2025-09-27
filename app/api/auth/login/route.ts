import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { findUserByCredentials } from '@/lib/user-storage'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Find user
    const user = findUserByCredentials(username, password)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Create session token (in production, use proper JWT)
    const sessionToken = Buffer.from(JSON.stringify({
      userId: user.id,
      username: user.username,
      role: user.role,
      loginTime: new Date().toISOString()
    })).toString('base64')

    // Set HTTP-only cookie
    const cookieStore = await cookies()
    cookieStore.set('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    // Return user data (without password)
    const { password: _, ...userWithoutPassword } = user
    return NextResponse.json({
      user: userWithoutPassword,
      message: 'Login successful'
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}