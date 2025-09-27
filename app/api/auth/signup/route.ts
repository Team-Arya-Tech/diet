import { NextRequest, NextResponse } from 'next/server'
import { findUserByUsername, findUserByEmail, addUser } from '@/lib/user-storage'

export async function POST(request: NextRequest) {
  try {
    const { username, email, password, role, fullName } = await request.json()

    // Validate input
    if (!username || !email || !password || !role || !fullName) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Validate role
    if (!['practitioner', 'assistant'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    // Check if username already exists
    const existingUser = findUserByUsername(username)
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 409 }
      )
    }

    // Check if email already exists
    const existingEmail = findUserByEmail(email)
    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email already exists' },
        { status: 409 }
      )
    }

    // Create new user
    const newUser = addUser({
      username,
      email,
      password, // In production, hash this password
      role,
      fullName
    })

    // Return success (without password)
    const { password: _, ...userWithoutPassword } = newUser
    return NextResponse.json({
      user: userWithoutPassword,
      message: 'Account created successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}