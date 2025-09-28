import { EnhancedFood } from './enhanced-food-database'
import { TasteProfile } from './six-tastes-analyzer'

export interface ThermalProperties {
  virya: 'heating' | 'cooling' | 'neutral'
  intensity: number // 1-5 scale
  seasonalRecommendation: string[]
  constitutionalEffect: {
    vata: 'beneficial' | 'neutral' | 'caution'
    pitta: 'beneficial' | 'neutral' | 'caution'
    kapha: 'beneficial' | 'neutral' | 'caution'
  }
}

export interface NutritionalAnalysisWithThermal {
  totalCalories: number
  macronutrients: {
    protein: number
    carbohydrates: number
    fat: number
    fiber: number
  }
  micronutrients: {
    vitamins: Record<string, number>
    minerals: Record<string, number>
  }
  ayurvedicProfile: {
    overallThermalEffect: 'heating' | 'cooling' | 'balanced'
    thermalIntensity: number
    tasteProfile: TasteProfile
    doshaImpact: {
      vata: number
      pitta: number
      kapha: number
    }
  }
  seasonalSuitability: Record<string, number> // 0-100 score for each season
  constitutionalRecommendations: Record<string, {
    suitability: number // 0-100 score
    modifications: string[]
    warnings: string[]
  }>
}

export class EnhancedNutritionalCalculator {
  // Thermal effect mapping
  private static readonly THERMAL_FOOD_DATABASE: Record<string, ThermalProperties> = {
    // Heating foods
    'ginger': {
      virya: 'heating',
      intensity: 4,
      seasonalRecommendation: ['winter', 'monsoon'],
      constitutionalEffect: { vata: 'beneficial', pitta: 'caution', kapha: 'beneficial' }
    },
    'black-pepper': {
      virya: 'heating',
      intensity: 5,
      seasonalRecommendation: ['winter'],
      constitutionalEffect: { vata: 'beneficial', pitta: 'caution', kapha: 'beneficial' }
    },
    'cinnamon': {
      virya: 'heating',
      intensity: 3,
      seasonalRecommendation: ['winter', 'spring'],
      constitutionalEffect: { vata: 'beneficial', pitta: 'neutral', kapha: 'beneficial' }
    },
    'garlic': {
      virya: 'heating',
      intensity: 4,
      seasonalRecommendation: ['winter', 'monsoon'],
      constitutionalEffect: { vata: 'beneficial', pitta: 'caution', kapha: 'beneficial' }
    },
    
    // Cooling foods
    'cucumber': {
      virya: 'cooling',
      intensity: 3,
      seasonalRecommendation: ['summer'],
      constitutionalEffect: { vata: 'caution', pitta: 'beneficial', kapha: 'caution' }
    },
    'coconut': {
      virya: 'cooling',
      intensity: 4,
      seasonalRecommendation: ['summer', 'spring'],
      constitutionalEffect: { vata: 'neutral', pitta: 'beneficial', kapha: 'caution' }
    },
    'mint': {
      virya: 'cooling',
      intensity: 3,
      seasonalRecommendation: ['summer'],
      constitutionalEffect: { vata: 'caution', pitta: 'beneficial', kapha: 'neutral' }
    },
    'fennel': {
      virya: 'cooling',
      intensity: 2,
      seasonalRecommendation: ['summer', 'spring'],
      constitutionalEffect: { vata: 'neutral', pitta: 'beneficial', kapha: 'neutral' }
    },
    
    // Neutral foods
    'rice': {
      virya: 'neutral',
      intensity: 1,
      seasonalRecommendation: ['all'],
      constitutionalEffect: { vata: 'beneficial', pitta: 'beneficial', kapha: 'neutral' }
    },
    'ghee': {
      virya: 'neutral',
      intensity: 1,
      seasonalRecommendation: ['all'],
      constitutionalEffect: { vata: 'beneficial', pitta: 'beneficial', kapha: 'caution' }
    }
  }

  private static readonly SEASONAL_THERMAL_PREFERENCES = {
    'spring': { heating: 0.6, cooling: 0.3, neutral: 0.8 },
    'summer': { heating: 0.2, cooling: 1.0, neutral: 0.7 },
    'monsoon': { heating: 0.8, cooling: 0.4, neutral: 0.7 },
    'autumn': { heating: 0.5, cooling: 0.5, neutral: 0.8 },
    'winter': { heating: 1.0, cooling: 0.2, neutral: 0.6 }
  }

  private static readonly CONSTITUTIONAL_THERMAL_PREFERENCES = {
    'vata': { heating: 0.8, cooling: 0.3, neutral: 0.7 },
    'pitta': { heating: 0.2, cooling: 1.0, neutral: 0.8 },
    'kapha': { heating: 1.0, cooling: 0.3, neutral: 0.6 }
  }

  // Main analysis function
  static analyzeNutritionWithThermal(
    foods: EnhancedFood[],
    portions: number[], // serving sizes
    season?: string,
    constitution?: string
  ): NutritionalAnalysisWithThermal {
    
    // Calculate basic nutrition
    const basicNutrition = this.calculateBasicNutrition(foods, portions)
    
    // Calculate thermal effects
    const thermalAnalysis = this.analyzeThermalEffects(foods, portions)
    
    // Calculate taste profile
    const tasteProfile = this.calculateOverallTasteProfile(foods, portions)
    
    // Calculate dosha impact
    const doshaImpact = this.calculateDoshaImpact(foods, portions)
    
    // Seasonal suitability
    const seasonalSuitability = this.calculateSeasonalSuitability(thermalAnalysis, tasteProfile)
    
    // Constitutional recommendations
    const constitutionalRecommendations = this.generateConstitutionalRecommendations(
      thermalAnalysis, tasteProfile, doshaImpact
    )

    return {
      totalCalories: basicNutrition.totalCalories,
      macronutrients: basicNutrition.macronutrients,
      micronutrients: basicNutrition.micronutrients,
      ayurvedicProfile: {
        overallThermalEffect: thermalAnalysis.overallEffect,
        thermalIntensity: thermalAnalysis.intensity,
        tasteProfile,
        doshaImpact
      },
      seasonalSuitability,
      constitutionalRecommendations
    }
  }

  // Calculate basic nutritional values
  private static calculateBasicNutrition(foods: EnhancedFood[], portions: number[]) {
    let totalCalories = 0
    let totalProtein = 0
    let totalCarbs = 0
    let totalFat = 0
    let totalFiber = 0
    
    const vitamins: Record<string, number> = {}
    const minerals: Record<string, number> = {}

    foods.forEach((food, index) => {
      const portion = portions[index] || 1
      const factor = portion / 100 // nutrition is per 100g
      
      totalCalories += food.nutrition.calories * factor
      totalProtein += food.nutrition.protein * factor
      totalCarbs += food.nutrition.carbs * factor
      totalFat += food.nutrition.fat * factor
      totalFiber += food.nutrition.fiber * factor
      
      // Vitamins and minerals
      vitamins['C'] = (vitamins['C'] || 0) + (food.nutrition.vitaminC * factor)
      vitamins['A'] = (vitamins['A'] || 0) + (food.nutrition.vitaminA * factor)
      minerals['calcium'] = (minerals['calcium'] || 0) + (food.nutrition.calcium * factor)
      minerals['iron'] = (minerals['iron'] || 0) + (food.nutrition.iron * factor)
      minerals['potassium'] = (minerals['potassium'] || 0) + (food.nutrition.potassium * factor)
    })

    return {
      totalCalories: Math.round(totalCalories),
      macronutrients: {
        protein: Math.round(totalProtein * 10) / 10,
        carbohydrates: Math.round(totalCarbs * 10) / 10,
        fat: Math.round(totalFat * 10) / 10,
        fiber: Math.round(totalFiber * 10) / 10
      },
      micronutrients: { vitamins, minerals }
    }
  }

  // Analyze thermal effects
  private static analyzeThermalEffects(foods: EnhancedFood[], portions: number[]) {
    let heatingScore = 0
    let coolingScore = 0
    let neutralScore = 0
    let totalIntensity = 0

    foods.forEach((food, index) => {
      const portion = portions[index] || 1
      const weight = portion / 100
      
      const thermalProps = this.THERMAL_FOOD_DATABASE[food.id] || 
                          this.inferThermalProperties(food)
      
      const adjustedIntensity = thermalProps.intensity * weight
      totalIntensity += adjustedIntensity
      
      switch (thermalProps.virya) {
        case 'heating':
          heatingScore += adjustedIntensity
          break
        case 'cooling':
          coolingScore += adjustedIntensity
          break
        case 'neutral':
          neutralScore += adjustedIntensity
          break
      }
    })

    const total = heatingScore + coolingScore + neutralScore
    let overallEffect: 'heating' | 'cooling' | 'balanced'
    
    if (heatingScore > coolingScore + neutralScore) {
      overallEffect = 'heating'
    } else if (coolingScore > heatingScore + neutralScore) {
      overallEffect = 'cooling'
    } else {
      overallEffect = 'balanced'
    }

    return {
      overallEffect,
      intensity: Math.round((totalIntensity / foods.length) * 10) / 10,
      distribution: {
        heating: Math.round((heatingScore / total) * 100),
        cooling: Math.round((coolingScore / total) * 100),
        neutral: Math.round((neutralScore / total) * 100)
      }
    }
  }

  // Infer thermal properties from Ayurvedic data
  private static inferThermalProperties(food: EnhancedFood): ThermalProperties {
    const virya = food.ayurvedic.virya
    
    // Infer intensity from taste profile and dosha effects
    let intensity = 2 // default neutral intensity
    
    if (food.ayurvedic.rasa.pungent > 50 || food.ayurvedic.rasa.sour > 60) {
      intensity = Math.min(5, intensity + 2)
    }
    
    if (food.ayurvedic.rasa.sweet > 70 || food.ayurvedic.rasa.bitter > 50) {
      intensity = Math.max(1, intensity - 1)
    }

    // Infer constitutional effects from dosha impacts
    const constitutionalEffect = {
      vata: this.getDoshaEffect(food.ayurvedic.doshaEffect.vata),
      pitta: this.getDoshaEffect(food.ayurvedic.doshaEffect.pitta),
      kapha: this.getDoshaEffect(food.ayurvedic.doshaEffect.kapha)
    }

    // Infer seasonal recommendations
    const seasonalRecommendation = this.inferSeasonalRecommendations(virya, intensity)

    return {
      virya,
      intensity,
      seasonalRecommendation,
      constitutionalEffect
    }
  }

  private static getDoshaEffect(doshaValue: number): 'beneficial' | 'neutral' | 'caution' {
    if (doshaValue <= -1) return 'beneficial'
    if (doshaValue >= 2) return 'caution'
    return 'neutral'
  }

  private static inferSeasonalRecommendations(virya: string, intensity: number): string[] {
    switch (virya) {
      case 'heating':
        return intensity >= 3 ? ['winter', 'monsoon'] : ['winter', 'monsoon', 'spring']
      case 'cooling':
        return intensity >= 3 ? ['summer'] : ['summer', 'spring']
      case 'neutral':
      default:
        return ['all']
    }
  }

  // Calculate overall taste profile
  private static calculateOverallTasteProfile(foods: EnhancedFood[], portions: number[]): TasteProfile {
    const totalTastes = {
      sweet: 0, sour: 0, salty: 0, pungent: 0, bitter: 0, astringent: 0
    }
    let totalWeight = 0

    foods.forEach((food, index) => {
      const portion = portions[index] || 1
      const weight = portion / 100
      totalWeight += weight
      
      Object.keys(totalTastes).forEach(taste => {
        totalTastes[taste as keyof TasteProfile] += 
          food.ayurvedic.rasa[taste as keyof TasteProfile] * weight
      })
    })

    // Normalize to percentages
    const normalized: TasteProfile = {
      sweet: Math.round((totalTastes.sweet / totalWeight)),
      sour: Math.round((totalTastes.sour / totalWeight)),
      salty: Math.round((totalTastes.salty / totalWeight)),
      pungent: Math.round((totalTastes.pungent / totalWeight)),
      bitter: Math.round((totalTastes.bitter / totalWeight)),
      astringent: Math.round((totalTastes.astringent / totalWeight))
    }

    return normalized
  }

  // Calculate dosha impact
  private static calculateDoshaImpact(foods: EnhancedFood[], portions: number[]) {
    let vataImpact = 0
    let pittaImpact = 0
    let kaphaImpact = 0
    let totalWeight = 0

    foods.forEach((food, index) => {
      const portion = portions[index] || 1
      const weight = portion / 100
      totalWeight += weight
      
      vataImpact += food.ayurvedic.doshaEffect.vata * weight
      pittaImpact += food.ayurvedic.doshaEffect.pitta * weight
      kaphaImpact += food.ayurvedic.doshaEffect.kapha * weight
    })

    return {
      vata: Math.round((vataImpact / totalWeight) * 10) / 10,
      pitta: Math.round((pittaImpact / totalWeight) * 10) / 10,
      kapha: Math.round((kaphaImpact / totalWeight) * 10) / 10
    }
  }

  // Calculate seasonal suitability
  private static calculateSeasonalSuitability(
    thermalAnalysis: any, 
    tasteProfile: TasteProfile
  ): Record<string, number> {
    const suitability: Record<string, number> = {}
    
    Object.keys(this.SEASONAL_THERMAL_PREFERENCES).forEach(season => {
      const prefs = this.SEASONAL_THERMAL_PREFERENCES[season as keyof typeof this.SEASONAL_THERMAL_PREFERENCES]
      
      let score = 50 // base score
      
      // Thermal effect scoring
      switch (thermalAnalysis.overallEffect) {
        case 'heating':
          score += (prefs.heating - 0.5) * 100
          break
        case 'cooling':
          score += (prefs.cooling - 0.5) * 100
          break
        case 'balanced':
          score += (prefs.neutral - 0.5) * 50
          break
      }
      
      // Taste profile adjustments (seasonal taste preferences)
      if (season === 'summer' && tasteProfile.sweet > 30) score += 10
      if (season === 'winter' && tasteProfile.pungent > 20) score += 10
      if (season === 'spring' && tasteProfile.bitter > 15) score += 10
      
      suitability[season] = Math.max(0, Math.min(100, Math.round(score)))
    })
    
    return suitability
  }

  // Generate constitutional recommendations
  private static generateConstitutionalRecommendations(
    thermalAnalysis: any,
    tasteProfile: TasteProfile,
    doshaImpact: { vata: number; pitta: number; kapha: number }
  ) {
    const recommendations: Record<string, {
      suitability: number
      modifications: string[]
      warnings: string[]
    }> = {}

    const constitutions: Array<'vata' | 'pitta' | 'kapha'> = ['vata', 'pitta', 'kapha']
    
    constitutions.forEach(constitution => {
      const prefs = this.CONSTITUTIONAL_THERMAL_PREFERENCES[constitution]
      const doshaValue = doshaImpact[constitution]
      
      let suitability = 50
      const modifications: string[] = []
      const warnings: string[] = []
      
      // Thermal suitability
      switch (thermalAnalysis.overallEffect) {
        case 'heating':
          suitability += (prefs.heating - 0.5) * 100
          if (constitution === 'pitta' && thermalAnalysis.intensity > 3) {
            warnings.push('High heating intensity may aggravate Pitta')
            modifications.push('Add cooling accompaniments like coconut or cucumber')
          }
          break
        case 'cooling':
          suitability += (prefs.cooling - 0.5) * 100
          if (constitution === 'vata' && thermalAnalysis.intensity > 3) {
            warnings.push('Excessive cooling may increase Vata')
            modifications.push('Add warming spices like ginger or cinnamon')
          }
          break
      }
      
      // Dosha impact adjustments
      if (doshaValue > 1) {
        suitability -= 20
        warnings.push(`May increase ${constitution} dosha`)
      } else if (doshaValue < -1) {
        suitability += 20
      }
      
      // Constitution-specific taste recommendations
      if (constitution === 'vata' && tasteProfile.bitter > 40) {
        modifications.push('Reduce bitter tastes, add more sweet and sour')
      }
      if (constitution === 'pitta' && tasteProfile.pungent > 30) {
        modifications.push('Reduce pungent spices, add cooling herbs')
      }
      if (constitution === 'kapha' && tasteProfile.sweet > 50) {
        modifications.push('Reduce sweet tastes, add more pungent and bitter')
      }
      
      recommendations[constitution] = {
        suitability: Math.max(0, Math.min(100, Math.round(suitability))),
        modifications,
        warnings
      }
    })
    
    return recommendations
  }

  // Utility methods for meal planning
  static recommendThermalBalance(currentFoods: EnhancedFood[], season: string, constitution: string): {
    addHeating: boolean
    addCooling: boolean
    suggestions: string[]
  } {
    const analysis = this.analyzeThermalEffects(currentFoods, currentFoods.map(() => 100))
    const seasonPrefs = this.SEASONAL_THERMAL_PREFERENCES[season as keyof typeof this.SEASONAL_THERMAL_PREFERENCES]
    const constitutionPrefs = this.CONSTITUTIONAL_THERMAL_PREFERENCES[constitution as keyof typeof this.CONSTITUTIONAL_THERMAL_PREFERENCES]
    
    const suggestions: string[] = []
    let addHeating = false
    let addCooling = false
    
    if (analysis.overallEffect === 'cooling' && seasonPrefs.heating > 0.7) {
      addHeating = true
      suggestions.push('Add warming spices like ginger, cinnamon, or black pepper')
    }
    
    if (analysis.overallEffect === 'heating' && constitutionPrefs.cooling > 0.8) {
      addCooling = true
      suggestions.push('Add cooling elements like coconut, cucumber, or mint')
    }
    
    return { addHeating, addCooling, suggestions }
  }

  static getThermalFoodRecommendations(
    targetThermalEffect: 'heating' | 'cooling' | 'neutral',
    intensity: number = 3
  ): string[] {
    return Object.entries(this.THERMAL_FOOD_DATABASE)
      .filter(([, props]) => 
        props.virya === targetThermalEffect && 
        Math.abs(props.intensity - intensity) <= 1
      )
      .map(([foodId]) => foodId)
  }
}