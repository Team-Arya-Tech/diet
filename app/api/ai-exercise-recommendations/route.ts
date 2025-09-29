import { NextRequest, NextResponse } from 'next/server'
import { generateAIExerciseRoutine, getAIExerciseRecommendationsForCondition } from '@/lib/ai-exercise-recommendations'
import { getPatientById } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      patientId, 
      type = 'routine', 
      preferences = {},
      condition,
      severity = 'moderate' 
    } = body

    if (!patientId) {
      return NextResponse.json(
        { error: 'Patient ID is required' },
        { status: 400 }
      )
    }

    const patient = getPatientById(patientId)
    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      )
    }

    let result

    if (type === 'routine') {
      // Generate comprehensive routine
      result = await generateAIExerciseRoutine(patient, preferences)
    } else if (type === 'condition' && condition) {
      // Get recommendations for specific condition
      result = await getAIExerciseRecommendationsForCondition(
        condition, 
        patient.constitution as any, 
        severity
      )
    } else {
      return NextResponse.json(
        { error: 'Invalid request type or missing condition' },
        { status: 400 }
      )
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('AI Exercise Recommendation Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate exercise recommendations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const patientId = searchParams.get('patientId')
  const type = searchParams.get('type') || 'routine'

  if (!patientId) {
    return NextResponse.json(
      { error: 'Patient ID is required' },
      { status: 400 }
    )
  }

  try {
    const patient = getPatientById(patientId)
    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      )
    }

    // Generate a basic routine with default preferences
    const result = await generateAIExerciseRoutine(patient, {
      timeAvailable: 30,
      experience: 'beginner',
      goals: ['balance', 'flexibility', 'stress relief']
    })

    return NextResponse.json(result)

  } catch (error) {
    console.error('AI Exercise Recommendation Error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate exercise recommendations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}