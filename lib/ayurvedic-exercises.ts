import exercisesData from '@/data/ayurvedic-exercises.json'

// Types for Ayurvedic Exercises
export interface Exercise {
  id: string
  name: string
  englishName: string
  category: 'Asana' | 'Pranayama' | 'Meditation' | 'Lifestyle'
  type: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  duration: string
  doshaEffects: {
    vata: string
    pitta: string
    kapha: string
  }
  primaryBenefits: string[]
  contraindications: string[]
  bestTimeToPerform: string
  seasonalRecommendations: {
    spring: string
    summer: string
    autumn: string
    winter: string
  }
  steps: string[]
  modifications: {
    vata: string
    pitta: string
    kapha: string
  }
}

export interface ExerciseCategory {
  description: string
  subcategories: string[]
}

export interface DoshaGuideline {
  generalApproach: string
  idealTiming: string
  seasonalFocus: string
  avoidances: string
}

export type Constitution = 'vata' | 'pitta' | 'kapha' | 'vata-pitta' | 'pitta-kapha' | 'vata-kapha' | 'tridoshic'
export type Season = 'spring' | 'summer' | 'autumn' | 'winter'
export type TimeOfDay = 'morning' | 'midday' | 'evening' | 'night'

// Exercise Service Class
export class AyurvedicExerciseService {
  private exercises: Exercise[]
  private categories: Record<string, ExerciseCategory>
  private doshaGuidelines: Record<string, DoshaGuideline>

  constructor() {
    this.exercises = exercisesData.exercises as Exercise[]
    this.categories = exercisesData.categories
    this.doshaGuidelines = exercisesData.doshaGuidelines
  }

  // Get all exercises
  getAllExercises(): Exercise[] {
    return this.exercises
  }

  // Get exercise by ID
  getExerciseById(id: string): Exercise | undefined {
    return this.exercises.find(exercise => exercise.id === id)
  }

  // Get exercises by category
  getExercisesByCategory(category: string): Exercise[] {
    return this.exercises.filter(exercise => exercise.category === category)
  }

  // Get exercises by difficulty
  getExercisesByDifficulty(difficulty: string): Exercise[] {
    return this.exercises.filter(exercise => exercise.difficulty === difficulty)
  }

  // Get exercises suitable for constitution
  getExercisesForConstitution(constitution: Constitution): Exercise[] {
    const primaryDosha = this.getPrimaryDosha(constitution)
    
    return this.exercises.filter(exercise => {
      const effect = exercise.doshaEffects[primaryDosha]
      return effect.includes('Balancing') || 
             effect.includes('Grounding') || 
             effect.includes('Cooling') ||
             effect.includes('Calming') ||
             !effect.includes('Increasing')
    })
  }

  // Get exercises for specific season
  getExercisesForSeason(season: Season): Exercise[] {
    return this.exercises.filter(exercise => {
      const recommendation = exercise.seasonalRecommendations[season]
      return recommendation && recommendation.length > 0
    })
  }

  // Get exercises for time of day
  getExercisesForTimeOfDay(timeOfDay: TimeOfDay): Exercise[] {
    const timeKeywords = {
      morning: ['morning', 'sunrise', 'early'],
      midday: ['midday', 'noon', 'active'],
      evening: ['evening', 'sunset', 'calming'],
      night: ['night', 'bedtime', 'restorative']
    }

    const keywords = timeKeywords[timeOfDay] || []
    
    return this.exercises.filter(exercise => {
      return keywords.some(keyword => 
        exercise.bestTimeToPerform.toLowerCase().includes(keyword)
      )
    })
  }

  // Search exercises by name or benefits
  searchExercises(query: string): Exercise[] {
    const lowerQuery = query.toLowerCase()
    
    return this.exercises.filter(exercise => 
      exercise.name.toLowerCase().includes(lowerQuery) ||
      exercise.englishName.toLowerCase().includes(lowerQuery) ||
      exercise.primaryBenefits.some(benefit => 
        benefit.toLowerCase().includes(lowerQuery)
      )
    )
  }

  // Get recommended exercises for specific condition
  getExercisesForCondition(condition: string): Exercise[] {
    const conditionKeywords: Record<string, string[]> = {
      stress: ['stress', 'anxiety', 'calms', 'nervous system'],
      flexibility: ['flexibility', 'stretches', 'mobility'],
      strength: ['strength', 'builds', 'tones'],
      balance: ['balance', 'stability', 'grounding'],
      concentration: ['concentration', 'focus', 'clarity', 'memory'],
      digestion: ['digestion', 'digestive', 'abdominal'],
      breathing: ['breathing', 'respiratory', 'lung'],
      sleep: ['sleep', 'calming', 'restorative', 'relaxation']
    }

    const keywords: string[] = conditionKeywords[condition.toLowerCase()] || [condition.toLowerCase()]
    
    return this.exercises.filter(exercise =>
      exercise.primaryBenefits.some(benefit =>
        keywords.some((keyword: string) => benefit.toLowerCase().includes(keyword))
      )
    )
  }

  // Get personalized routine
  getPersonalizedRoutine(params: {
    constitution: Constitution
    season?: Season
    timeOfDay?: TimeOfDay
    duration?: number // in minutes
    goals?: string[]
  }): Exercise[] {
    let availableExercises = this.getExercisesForConstitution(params.constitution)

    // Filter by season if provided
    if (params.season) {
      const seasonalExercises = this.getExercisesForSeason(params.season)
      availableExercises = availableExercises.filter(ex => 
        seasonalExercises.some(seasonal => seasonal.id === ex.id)
      )
    }

    // Filter by time of day if provided
    if (params.timeOfDay) {
      const timeExercises = this.getExercisesForTimeOfDay(params.timeOfDay)
      availableExercises = availableExercises.filter(ex =>
        timeExercises.some(timeEx => timeEx.id === ex.id)
      )
    }

    // Filter by goals if provided
    if (params.goals && params.goals.length > 0) {
      availableExercises = availableExercises.filter(exercise =>
        params.goals!.some(goal =>
          exercise.primaryBenefits.some(benefit =>
            benefit.toLowerCase().includes(goal.toLowerCase())
          )
        )
      )
    }

    // Create balanced routine
    const routine: Exercise[] = []
    const categories = ['Asana', 'Pranayama', 'Meditation']
    
    categories.forEach(category => {
      const categoryExercises = availableExercises.filter(ex => ex.category === category)
      if (categoryExercises.length > 0) {
        // Add 1-2 exercises from each category
        routine.push(categoryExercises[0])
        if (categoryExercises.length > 1 && routine.length < 6) {
          routine.push(categoryExercises[1])
        }
      }
    })

    return routine.slice(0, params.duration ? Math.floor(params.duration / 10) : 6)
  }

  // Get categories
  getCategories(): Record<string, ExerciseCategory> {
    return this.categories
  }

  // Get dosha guidelines
  getDoshaGuidelines(dosha: string): DoshaGuideline | undefined {
    return this.doshaGuidelines[dosha]
  }

  // Helper method to get primary dosha from constitution
  private getPrimaryDosha(constitution: Constitution): 'vata' | 'pitta' | 'kapha' {
    if (constitution.includes('vata')) return 'vata'
    if (constitution.includes('pitta')) return 'pitta'
    if (constitution.includes('kapha')) return 'kapha'
    return 'vata' // default
  }

  // Check if exercise is suitable for constitution
  isExerciseSuitableForConstitution(exerciseId: string, constitution: Constitution): boolean {
    const exercise = this.getExerciseById(exerciseId)
    if (!exercise) return false

    const primaryDosha = this.getPrimaryDosha(constitution)
    const effect = exercise.doshaEffects[primaryDosha]
    
    // Consider beneficial effects
    const beneficialEffects = [
      'Balancing', 'Grounding', 'Cooling', 'Calming', 
      'Deeply Calming', 'Highly Balancing', 'Deeply Grounding'
    ]
    
    return beneficialEffects.some(beneficial => effect.includes(beneficial))
  }

  // Get exercise modifications for constitution
  getExerciseModification(exerciseId: string, constitution: Constitution): string | undefined {
    const exercise = this.getExerciseById(exerciseId)
    if (!exercise) return undefined

    const primaryDosha = this.getPrimaryDosha(constitution)
    return exercise.modifications[primaryDosha]
  }

  // Get seasonal recommendation for exercise
  getSeasonalRecommendation(exerciseId: string, season: Season): string | undefined {
    const exercise = this.getExerciseById(exerciseId)
    if (!exercise) return undefined

    return exercise.seasonalRecommendations[season]
  }

  // Generate exercise statistics
  getExerciseStats() {
    const totalExercises = this.exercises.length
    const categoryCounts = this.exercises.reduce((acc, exercise) => {
      acc[exercise.category] = (acc[exercise.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const difficultyCounts = this.exercises.reduce((acc, exercise) => {
      acc[exercise.difficulty] = (acc[exercise.difficulty] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total: totalExercises,
      byCategory: categoryCounts,
      byDifficulty: difficultyCounts
    }
  }
}

// Create singleton instance
export const ayurvedicExerciseService = new AyurvedicExerciseService()

// Utility functions for components
export const getExercises = () => ayurvedicExerciseService.getAllExercises()
export const getExerciseById = (id: string) => ayurvedicExerciseService.getExerciseById(id)
export const getExercisesByCategory = (category: string) => ayurvedicExerciseService.getExercisesByCategory(category)
export const searchExercises = (query: string) => ayurvedicExerciseService.searchExercises(query)
export const getPersonalizedRoutine = (params: any) => ayurvedicExerciseService.getPersonalizedRoutine(params)