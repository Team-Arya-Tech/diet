import { NextRequest, NextResponse } from 'next/server'
import { generateAIDietChartWithOpenAI } from '@/lib/ai-diet-service'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate request body
    if (!body.patientProfile) {
      return NextResponse.json(
        { error: 'Patient profile is required' },
        { status: 400 }
      )
    }

    // Generate AI diet chart
    const dietChart = await generateAIDietChartWithOpenAI(body)

    return NextResponse.json({ dietChart })

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
