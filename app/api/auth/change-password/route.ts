import { NextRequest, NextResponse } from 'next/server'

// Mock password storage - in a real app, use proper password hashing
const passwords = new Map([
  ['admin', 'admin123'],
  ['doctor', 'doctor123'],
  ['assistant', 'assist123']
])

// Mock function to hash password (in real app, use bcrypt)
function hashPassword(password: string): string {
  // This is just for demo - never store plain text passwords!
  return `hashed_${password}`
}

// Mock function to verify password
function verifyPassword(password: string, hashedPassword: string): boolean {
  // This is just for demo
  return hashedPassword === `hashed_${password}` || hashedPassword === password
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { currentPassword, newPassword } = body

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Get current user from session
    const cookies = request.cookies
    const sessionUser = cookies.get('session_user')?.value
    
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify current password
    const storedPassword = passwords.get(sessionUser)
    if (!storedPassword || !verifyPassword(currentPassword, storedPassword)) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      )
    }

    // Check if new password is different from current
    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: 'New password must be different from current password' },
        { status: 400 }
      )
    }

    // Update password
    passwords.set(sessionUser, newPassword)

    // Log password change for security audit
    console.log(`Password changed for user: ${sessionUser} at ${new Date().toISOString()}`)

    return NextResponse.json({
      message: 'Password changed successfully',
      changedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Password change error:', error)
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    )
  }
}