import { NextRequest, NextResponse } from 'next/server'

// Mock session storage - in a real app, use Redis or database
const activeSessions = new Map()

export async function GET(request: NextRequest) {
  try {
    const cookies = request.cookies
    const sessionUser = cookies.get('session_user')?.value
    
    if (!sessionUser) {
      return NextResponse.json({ error: 'No active session' }, { status: 401 })
    }

    // Get all active sessions for this user
    const userSessions = Array.from(activeSessions.entries())
      .filter(([sessionId, session]) => session.username === sessionUser)
      .map(([sessionId, session]) => ({
        sessionId,
        createdAt: session.createdAt,
        lastActivity: session.lastActivity,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        isCurrent: sessionId === request.cookies.get('session_id')?.value
      }))

    return NextResponse.json({
      sessions: userSessions,
      totalSessions: userSessions.length
    })

  } catch (error) {
    console.error('Session fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }
}

// POST - Create new session (called during login)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, ipAddress, userAgent } = body

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      )
    }

    // Generate session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Create session data
    const sessionData = {
      username,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      ipAddress: ipAddress || 'unknown',
      userAgent: userAgent || 'unknown'
    }

    // Store session
    activeSessions.set(sessionId, sessionData)

    // Clean up old sessions (older than 24 hours)
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000
    for (const [id, session] of activeSessions.entries()) {
      if (new Date(session.createdAt).getTime() < oneDayAgo) {
        activeSessions.delete(id)
      }
    }

    return NextResponse.json({
      sessionId,
      message: 'Session created successfully'
    })

  } catch (error) {
    console.error('Session creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }
}

// DELETE - Terminate session(s)
export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const sessionId = url.searchParams.get('sessionId')
    const terminateAll = url.searchParams.get('all') === 'true'
    
    const cookies = request.cookies
    const sessionUser = cookies.get('session_user')?.value
    const currentSessionId = cookies.get('session_id')?.value
    
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (terminateAll) {
      // Terminate all sessions for this user
      const userSessions = Array.from(activeSessions.entries())
        .filter(([id, session]) => session.username === sessionUser)
      
      for (const [id] of userSessions) {
        activeSessions.delete(id)
      }

      return NextResponse.json({
        message: 'All sessions terminated successfully',
        terminatedCount: userSessions.length
      })
    } else if (sessionId) {
      // Terminate specific session
      const session = activeSessions.get(sessionId)
      
      if (!session || session.username !== sessionUser) {
        return NextResponse.json(
          { error: 'Session not found or unauthorized' },
          { status: 404 }
        )
      }

      activeSessions.delete(sessionId)

      return NextResponse.json({
        message: 'Session terminated successfully',
        terminatedSessionId: sessionId
      })
    } else {
      // Terminate current session
      if (currentSessionId) {
        activeSessions.delete(currentSessionId)
      }

      return NextResponse.json({
        message: 'Current session terminated successfully'
      })
    }

  } catch (error) {
    console.error('Session termination error:', error)
    return NextResponse.json(
      { error: 'Failed to terminate session' },
      { status: 500 }
    )
  }
}

// PUT - Update session activity
export async function PUT(request: NextRequest) {
  try {
    const cookies = request.cookies
    const sessionId = cookies.get('session_id')?.value
    
    if (!sessionId) {
      return NextResponse.json({ error: 'No session ID' }, { status: 400 })
    }

    const session = activeSessions.get(sessionId)
    if (!session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Update last activity
    session.lastActivity = new Date().toISOString()
    activeSessions.set(sessionId, session)

    return NextResponse.json({
      message: 'Session activity updated',
      lastActivity: session.lastActivity
    })

  } catch (error) {
    console.error('Session update error:', error)
    return NextResponse.json(
      { error: 'Failed to update session' },
      { status: 500 }
    )
  }
}