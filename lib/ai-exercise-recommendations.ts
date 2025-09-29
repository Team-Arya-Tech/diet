import { openai } from './openai-config'
import { ayurvedicExerciseService, Exercise, Constitution } from './ayurvedic-exercises'
import { type Patient } from './database'

export interface AIExerciseRecommendation {
  exercise: Exercise
  personalizedInstructions: string
  duration: string
  frequency: string
  modifications: string[]
  precautions: string[]
  benefits: string[]
  reasonForRecommendation: string
}

export interface AIRoutineRecommendation {
  routineName: string
  description: string
  totalDuration: string
  bestTimeOfDay: string
  exercises: AIExerciseRecommendation[]
  weeklySchedule: {
    [key: string]: string[] // day -> exercise IDs
  }
  progressionTips: string[]
  additionalNotes: string
}

export const generateAIExerciseRoutine = async (
  patient: Patient, 
  preferences: {
    goals?: string[]
    timeAvailable?: number // in minutes
    experience?: 'beginner' | 'intermediate' | 'advanced'
    conditions?: string[]
    season?: 'spring' | 'summer' | 'autumn' | 'winter'
  } = {}
): Promise<AIRoutineRecommendation> => {
  // Get base exercises suitable for constitution
  const constitution = patient.constitution as Constitution
  
  try {
    const suitableExercises = ayurvedicExerciseService.getExercisesForConstitution(constitution)
    
    // Apply additional filters based on preferences
    let filteredExercises = suitableExercises
    
    if (preferences.experience) {
      const experienceLevels = {
        beginner: ['Beginner'],
        intermediate: ['Beginner', 'Intermediate'], 
        advanced: ['Beginner', 'Intermediate', 'Advanced']
      }
      const allowedLevels = experienceLevels[preferences.experience]
      filteredExercises = filteredExercises.filter(ex => 
        allowedLevels.includes(ex.difficulty)
      )
    }

    if (preferences.goals && preferences.goals.length > 0) {
      filteredExercises = filteredExercises.filter(exercise =>
        preferences.goals!.some(goal =>
          exercise.primaryBenefits.some(benefit =>
            benefit.toLowerCase().includes(goal.toLowerCase())
          )
        )
      )
    }

    // Create AI prompt for personalized recommendations
    const prompt = `
As an Ayurvedic wellness expert, create a personalized exercise routine for this patient:

PATIENT PROFILE:
- Age: ${patient.age}
- Constitution: ${patient.constitution}
- Health Conditions: ${patient.medicalHistory?.join(', ') || 'None specified'}
- Dietary Restrictions: ${patient.dietaryRestrictions?.join(', ') || 'None specified'}

PREFERENCES:
- Goals: ${preferences.goals?.join(', ') || 'General wellness'}
- Available Time: ${preferences.timeAvailable || 30} minutes per session
- Experience Level: ${preferences.experience || 'beginner'}
- Health Conditions: ${preferences.conditions?.join(', ') || 'None'}
- Current Season: ${preferences.season || 'spring'}

AVAILABLE EXERCISES:
${filteredExercises.slice(0, 15).map(ex => `
- ${ex.name} (${ex.englishName}): ${ex.category}, ${ex.difficulty}
  Benefits: ${ex.primaryBenefits.slice(0, 3).join(', ')}
  Duration: ${ex.duration}
  Dosha Effect on ${constitution}: ${ex.doshaEffects[constitution.split('-')[0] as keyof typeof ex.doshaEffects]}
`).join('\n')}

Please provide a comprehensive response in this JSON format:
{
  "routineName": "Personalized routine name",
  "description": "Brief description of the routine and its benefits",
  "totalDuration": "Total time needed",
  "bestTimeOfDay": "Best time to practice",
  "exercises": [
    {
      "exerciseId": "exercise-id-from-list",
      "personalizedInstructions": "Specific instructions for this patient",
      "duration": "How long to practice this exercise",
      "frequency": "How often per week",
      "modifications": ["Patient-specific modifications"],
      "precautions": ["Important precautions for this patient"],
      "benefits": ["Specific benefits for this patient"],
      "reasonForRecommendation": "Why this exercise is recommended"
    }
  ],
  "weeklySchedule": {
    "Monday": ["exercise-id1", "exercise-id2"],
    "Tuesday": ["exercise-id3"],
    "Wednesday": ["exercise-id1", "exercise-id4"],
    "Thursday": ["rest"],
    "Friday": ["exercise-id2", "exercise-id5"],
    "Saturday": ["exercise-id1", "exercise-id3"],
    "Sunday": ["rest or gentle practice"]
  },
  "progressionTips": ["How to progress over time"],
  "additionalNotes": "Any additional guidance"
}

Focus on:
1. Constitutional balance (${constitution})
2. Seasonal appropriateness
3. Patient's current health status
4. Gradual progression
5. Ayurvedic principles of practice timing and method
6. Safety and contraindications
7. Realistic time commitments

Ensure all exercise IDs in the response match exactly with the provided exercise list.
`

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert Ayurvedic practitioner specializing in therapeutic exercise and yoga. Provide personalized, safe, and effective recommendations based on individual constitution and health needs."
        },
        {
          role: "user", 
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    })

    const aiRoutine = JSON.parse(response.choices[0].message.content || '{}')
    
    // Enhance AI response with actual exercise data
    const enhancedExercises: AIExerciseRecommendation[] = aiRoutine.exercises.map((aiEx: any) => {
      const exercise = filteredExercises.find(ex => ex.id === aiEx.exerciseId)
      if (!exercise) {
        // Fallback to first suitable exercise if ID not found
        const fallback = filteredExercises[0]
        return {
          exercise: fallback,
          personalizedInstructions: aiEx.personalizedInstructions || fallback.steps.slice(0, 3).join('. '),
          duration: aiEx.duration || fallback.duration,
          frequency: aiEx.frequency || '3-4 times per week',
          modifications: aiEx.modifications || [fallback.modifications[constitution.split('-')[0] as keyof typeof fallback.modifications]],
          precautions: aiEx.precautions || fallback.contraindications.slice(0, 2),
          benefits: aiEx.benefits || fallback.primaryBenefits.slice(0, 3),
          reasonForRecommendation: aiEx.reasonForRecommendation || `Excellent for ${constitution} constitution`
        }
      }
      
      return {
        exercise,
        personalizedInstructions: aiEx.personalizedInstructions,
        duration: aiEx.duration,
        frequency: aiEx.frequency,
        modifications: aiEx.modifications,
        precautions: aiEx.precautions,
        benefits: aiEx.benefits,
        reasonForRecommendation: aiEx.reasonForRecommendation
      }
    })

    return {
      routineName: aiRoutine.routineName,
      description: aiRoutine.description,
      totalDuration: aiRoutine.totalDuration,
      bestTimeOfDay: aiRoutine.bestTimeOfDay,
      exercises: enhancedExercises,
      weeklySchedule: aiRoutine.weeklySchedule,
      progressionTips: aiRoutine.progressionTips,
      additionalNotes: aiRoutine.additionalNotes
    }

  } catch (error) {
    console.error('Error generating AI exercise routine:', error)
    
    // Fallback to rule-based routine
    const fallbackRoutine = ayurvedicExerciseService.getPersonalizedRoutine({
      constitution: constitution,
      season: preferences.season,
      timeOfDay: 'morning',
      duration: preferences.timeAvailable || 30,
      goals: preferences.goals
    })

    const fallbackExercises: AIExerciseRecommendation[] = fallbackRoutine.map(exercise => ({
      exercise,
      personalizedInstructions: `Practice this ${exercise.name} according to the traditional method, focusing on breath awareness and mindful movement.`,
      duration: exercise.duration,
      frequency: '3-4 times per week',
      modifications: [exercise.modifications[constitution.split('-')[0] as keyof typeof exercise.modifications]],
      precautions: exercise.contraindications.slice(0, 2),
      benefits: exercise.primaryBenefits.slice(0, 3),
      reasonForRecommendation: `Selected for ${constitution} constitutional balance and general wellness.`
    }))

    return {
      routineName: `Balanced ${constitution.charAt(0).toUpperCase() + constitution.slice(1)} Routine`,
      description: `A foundational routine designed for ${constitution} constitution, focusing on balance and wellness.`,
      totalDuration: `${preferences.timeAvailable || 30} minutes`,
      bestTimeOfDay: 'Morning or evening',
      exercises: fallbackExercises,
      weeklySchedule: {
        'Monday': fallbackExercises.slice(0, 2).map(ex => ex.exercise.id),
        'Tuesday': ['rest'],
        'Wednesday': fallbackExercises.slice(1, 3).map(ex => ex.exercise.id),
        'Thursday': fallbackExercises.slice(0, 1).map(ex => ex.exercise.id),
        'Friday': fallbackExercises.slice(2).map(ex => ex.exercise.id),
        'Saturday': fallbackExercises.slice(0, 2).map(ex => ex.exercise.id),
        'Sunday': ['rest or gentle practice']
      },
      progressionTips: [
        'Start with shorter durations and gradually increase',
        'Listen to your body and rest when needed',
        'Maintain consistent daily practice',
        'Focus on breath awareness throughout'
      ],
      additionalNotes: 'This is a foundational routine. Consult with an Ayurvedic practitioner for personalized guidance.'
    }
  }
}

export const getAIExerciseRecommendationsForCondition = async (
  condition: string,
  constitution: Constitution,
  severity: 'mild' | 'moderate' | 'severe' = 'moderate'
): Promise<AIExerciseRecommendation[]> => {
  try {
    const relevantExercises = ayurvedicExerciseService.getExercisesForCondition(condition)
    const constitutionallyAppropriate = relevantExercises.filter(exercise =>
      ayurvedicExerciseService.isExerciseSuitableForConstitution(exercise.id, constitution)
    )

    const prompt = `
As an Ayurvedic therapist, recommend specific exercises for:

CONDITION: ${condition} (${severity} severity)
CONSTITUTION: ${constitution}

AVAILABLE EXERCISES:
${constitutionallyAppropriate.slice(0, 10).map(ex => `
- ${ex.name}: ${ex.primaryBenefits.join(', ')}
`).join('\n')}

Provide 3-5 most appropriate exercises in JSON format:
[
  {
    "exerciseId": "exercise-id",
    "personalizedInstructions": "Specific guidance for this condition",
    "duration": "Recommended duration",
    "frequency": "How often",
    "modifications": ["Condition-specific modifications"],
    "precautions": ["Important precautions"],
    "benefits": ["How this helps the condition"],
    "reasonForRecommendation": "Why this exercise is ideal for this condition and constitution"
  }
]
`

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert in Ayurvedic therapeutic practices. Recommend safe, effective exercises for specific health conditions."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.2,
      max_tokens: 1500
    })

    const aiRecommendations = JSON.parse(response.choices[0].message.content || '[]')
    
    return aiRecommendations.map((aiRec: any) => {
      const exercise = constitutionallyAppropriate.find(ex => ex.id === aiRec.exerciseId) || constitutionallyAppropriate[0]
      return {
        exercise,
        personalizedInstructions: aiRec.personalizedInstructions,
        duration: aiRec.duration,
        frequency: aiRec.frequency,
        modifications: aiRec.modifications,
        precautions: aiRec.precautions,
        benefits: aiRec.benefits,
        reasonForRecommendation: aiRec.reasonForRecommendation
      }
    })

  } catch (error) {
    console.error('Error getting AI exercise recommendations for condition:', error)
    
    // Fallback to rule-based recommendations
    const exercises = ayurvedicExerciseService.getExercisesForCondition(condition).slice(0, 3)
    return exercises.map(exercise => ({
      exercise,
      personalizedInstructions: `Practice this ${exercise.name} gently, focusing on breath and comfort.`,
      duration: exercise.duration,
      frequency: 'Daily or as comfortable',
      modifications: [exercise.modifications[constitution.split('-')[0] as keyof typeof exercise.modifications]],
      precautions: exercise.contraindications,
      benefits: exercise.primaryBenefits,
      reasonForRecommendation: `Traditional Ayurvedic practice beneficial for ${condition}.`
    }))
  }
}