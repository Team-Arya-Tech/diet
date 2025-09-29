import { NextRequest, NextResponse } from 'next/server'

// Mock user database - replace with real database
const users = new Map([
  ['admin', { 
    id: 1, 
    username: 'admin', 
    role: 'admin', 
    fullName: 'System Administrator',
    email: 'admin@ahaarwise.com',
    phone: '+1-555-0001',
    department: 'IT Administration',
    experience: '10+ years',
    specialization: 'System Management',
    bio: 'Experienced system administrator with expertise in healthcare IT systems.',
    address: '123 Healthcare Avenue, Medical City, HC 12345'
  }],
  ['doctor', { 
    id: 2, 
    username: 'doctor', 
    role: 'practitioner', 
    fullName: 'Dr. Priya Sharma',
    email: 'priya.sharma@ahaarwise.com',
    phone: '+1-555-0002',
    department: 'Ayurvedic Medicine',
    experience: '15 years',
    specialization: 'Panchakarma & Nutrition',
    bio: 'Certified Ayurvedic practitioner specializing in dietary therapy and detoxification.',
    address: '456 Wellness Street, Ayurveda Center, AC 67890'
  }],
  ['assistant', { 
    id: 3, 
    username: 'assistant', 
    role: 'assistant', 
    fullName: 'Rajesh Kumar',
    email: 'rajesh.kumar@ahaarwise.com',
    phone: '+1-555-0003',
    department: 'Patient Care',
    experience: '5 years',
    specialization: 'Patient Support & Documentation',
    bio: 'Dedicated healthcare assistant with focus on patient care coordination.',
    address: '789 Care Lane, Support Center, SC 34567'
  }]
])

// GET - Get current user's profile
export async function GET(request: NextRequest) {
  try {
    // In a real app, you would verify the JWT token here
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Mock: Extract username from some session/token
    // For now, we'll use a cookie or session storage
    const cookies = request.cookies
    const sessionUser = cookies.get('session_user')?.value
    
    if (!sessionUser) {
      return NextResponse.json({ error: 'No active session' }, { status: 401 })
    }

    const userData = users.get(sessionUser)
    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({
      userId: userData.id,
      username: userData.username,
      role: userData.role,
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      department: userData.department,
      experience: userData.experience,
      specialization: userData.specialization,
      bio: userData.bio,
      address: userData.address
    })

  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    )
  }
}

// PUT - Update user profile
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // In a real app, verify JWT and get user ID
    const cookies = request.cookies
    const sessionUser = cookies.get('session_user')?.value
    
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userData = users.get(sessionUser)
    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Validate and sanitize input
    const allowedFields = [
      'fullName', 'email', 'phone', 'department', 
      'experience', 'specialization', 'bio', 'address'
    ]

    const updates: any = {}
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        // Basic validation
        if (field === 'email' && body[field]) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(body[field])) {
            return NextResponse.json(
              { error: 'Invalid email format' },
              { status: 400 }
            )
          }
        }
        
        updates[field] = body[field]
      }
    }

    // Update user data
    const updatedUser = { ...userData, ...updates }
    users.set(sessionUser, updatedUser)

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        userId: updatedUser.id,
        username: updatedUser.username,
        role: updatedUser.role,
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        department: updatedUser.department,
        experience: updatedUser.experience,
        specialization: updatedUser.specialization,
        bio: updatedUser.bio,
        address: updatedUser.address
      }
    })

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}

// DELETE - Deactivate account
export async function DELETE(request: NextRequest) {
  try {
    const cookies = request.cookies
    const sessionUser = cookies.get('session_user')?.value
    
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userData = users.get(sessionUser)
    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // In a real app, you would mark the account as deactivated rather than delete
    // For now, we'll just simulate account deactivation
    const deactivatedUser = { ...userData, status: 'deactivated', deactivatedAt: new Date().toISOString() }
    users.set(sessionUser, deactivatedUser)

    return NextResponse.json({
      message: 'Account deactivated successfully',
      deactivatedAt: deactivatedUser.deactivatedAt
    })

  } catch (error) {
    console.error('Account deactivation error:', error)
    return NextResponse.json(
      { error: 'Failed to deactivate account' },
      { status: 500 }
    )
  }
}