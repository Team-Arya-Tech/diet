import { NextRequest, NextResponse } from 'next/server'

import { generateAIDietChart } from '@/lib/ai-diet-generator'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body

    // Accepts: { patient, options }
    if (!body.patient) {
      return NextResponse.json(
        { error: 'patient is required' },
        { status: 400 }
      )
    }

    // Generate AI diet chart
    const dietPlan = await generateAIDietChart(body.patient, body.options)

    if (!dietPlan) {
      return NextResponse.json({ error: 'AI failed to generate a diet plan' }, { status: 500 })
    }

    return NextResponse.json({ dietPlan })

  } catch (error) {
    console.error('AI Diet Chart Generation Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to generate AI diet chart',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'AI Diet Chart Generation API',
    status: 'active' 
  })
}
