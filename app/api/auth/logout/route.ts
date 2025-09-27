import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

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