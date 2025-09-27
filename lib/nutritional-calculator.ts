import { getAllFoodItems, FoodItem } from '@/lib/food-database'
import { RecipeIngredient, Recipe } from '@/lib/recipe-intelligence'

// Enhanced nutritional calculation service that uses the existing food database
export class NutritionalCalculator {
  
  /**
   * Calculate total nutrition for a recipe based on its ingredients
   */
  static calculateRecipeNutrition(ingredients: RecipeIngredient[]): Recipe['nutritionalInfo'] {
    const totalNutrition = {
      caloriesPerServing: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      potassium: 0,
      calcium: 0,
      iron: 0,
      vitamins: {} as { [key: string]: number }
    }

    ingredients.forEach(ingredient => {
      const foodItem = this.findFoodItem(ingredient.name, ingredient.id)
      if (foodItem) {
        const multiplier = this.calculatePortionMultiplier(ingredient.quantity, ingredient.unit)
        
        // Add macronutrients
        totalNutrition.caloriesPerServing += (foodItem.nutritionalInfo.caloriesPerServing || 0) * multiplier
        totalNutrition.protein += (foodItem.nutritionalInfo.protein || 0) * multiplier
        totalNutrition.carbohydrates += (foodItem.nutritionalInfo.carbohydrates || 0) * multiplier
        totalNutrition.fat += (foodItem.nutritionalInfo.fat || 0) * multiplier
        totalNutrition.fiber += (foodItem.nutritionalInfo.fiber || 0) * multiplier
        totalNutrition.sugar += (foodItem.nutritionalInfo.sugar || 0) * multiplier
        
        // Add micronutrients
        totalNutrition.calcium += (foodItem.nutritionalInfo.calcium || 0) * multiplier
        totalNutrition.iron += (foodItem.nutritionalInfo.iron || 0) * multiplier
        totalNutrition.potassium += (foodItem.nutritionalInfo.potassium || 0) * multiplier
        totalNutrition.sodium += (foodItem.nutritionalInfo.sodium || 0) * multiplier
        
        // Add vitamins from the vitamins object
        Object.entries(foodItem.nutritionalInfo.vitamins || {}).forEach(([vitamin, value]) => {
          if (typeof value === 'number') {
            totalNutrition.vitamins[vitamin] = (totalNutrition.vitamins[vitamin] || 0) + value * multiplier
          }
        })
      }
    })

    // Round values to reasonable decimal places
    const roundedNutrition = { ...totalNutrition }
    Object.keys(roundedNutrition).forEach(key => {
      if (key !== 'vitamins') {
        const value = roundedNutrition[key as keyof typeof roundedNutrition]
        if (typeof value === 'number') {
          (roundedNutrition as any)[key] = Math.round(value * 100) / 100
        }
      }
    })

    // Round vitamin values
    Object.keys(roundedNutrition.vitamins).forEach(vitamin => {
      roundedNutrition.vitamins[vitamin] = Math.round(roundedNutrition.vitamins[vitamin] * 100) / 100
    })

    return roundedNutrition
  }

  /**
   * Find food item in database by name or ID
   */
  private static findFoodItem(name: string, id?: string): FoodItem | null {
    const foodDatabase = getAllFoodItems()
    
    // First try to find by ID if provided
    if (id) {
      const foundById = foodDatabase.find((item: FoodItem) => item.id === id)
      if (foundById) return foundById
    }

    // Then try to find by exact name match
    const exactMatch = foodDatabase.find((item: FoodItem) => 
      item.name.toLowerCase() === name.toLowerCase()
    )
    if (exactMatch) return exactMatch

    // Finally try partial name matching
    const partialMatch = foodDatabase.find((item: FoodItem) => 
      item.name.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(item.name.toLowerCase())
    )
    
    return partialMatch || null
  }

  /**
   * Calculate portion multiplier based on quantity and unit
   */
  private static calculatePortionMultiplier(quantity: number, unit: string): number {
    // Standard conversion rates (approximate)
    const conversions: { [key: string]: number } = {
      // Volume
      'cup': 1,
      'tbsp': 1/16,
      'tsp': 1/48,
      'ml': 1/240,
      'liter': 1000/240,
      
      // Weight (assuming average density)
      'g': 1/100,
      'kg': 10,
      'oz': 28.35/100,
      'lb': 453.6/100,
      
      // Pieces/units
      'piece': 0.1, // Approximate
      'pieces': 0.1,
      'clove': 0.05,
      'cloves': 0.05,
      'inch': 0.1, // For ginger, etc.
      'medium': 0.5,
      'large': 0.8,
      'small': 0.3
    }

    const unitLower = unit.toLowerCase()
    const conversionFactor = conversions[unitLower] || 1
    
    return quantity * conversionFactor
  }

  /**
   * Calculate Ayurvedic properties of a recipe based on ingredients
   */
  static calculateAyurvedicProperties(ingredients: RecipeIngredient[]): {
    primaryRasa: string[]
    virya: 'heating' | 'cooling' | 'neutral'
    vipaka: 'sweet' | 'sour' | 'pungent'
    doshaEffect: {
      vata: 'increases' | 'decreases' | 'balances' | 'neutral'
      pitta: 'increases' | 'decreases' | 'balances' | 'neutral'
      kapha: 'increases' | 'decreases' | 'balances' | 'neutral'
    }
  } {
    const rasaCounts: { [key: string]: number } = {}
    let heatingCount = 0
    let coolingCount = 0
    let neutralCount = 0
    
    const doshaEffects = {
      vata: { increases: 0, decreases: 0, balances: 0, neutral: 0 },
      pitta: { increases: 0, decreases: 0, balances: 0, neutral: 0 },
      kapha: { increases: 0, decreases: 0, balances: 0, neutral: 0 }
    }

    ingredients.forEach(ingredient => {
      const foodItem = this.findFoodItem(ingredient.name, ingredient.id)
      if (foodItem?.ayurvedicProperties) {
        const props = foodItem.ayurvedicProperties
        
        // Count rasa
        props.rasa.forEach(rasa => {
          rasaCounts[rasa] = (rasaCounts[rasa] || 0) + 1
        })
        
        // Count virya
        if (props.virya === 'heating') heatingCount++
        else if (props.virya === 'cooling') coolingCount++
        else neutralCount++
        
        // Count dosha effects
        Object.keys(doshaEffects).forEach(dosha => {
          const effect = props.doshaEffect[dosha as keyof typeof props.doshaEffect]
          if (effect && effect !== 'neutral') {
            doshaEffects[dosha as keyof typeof doshaEffects][effect as keyof typeof doshaEffects.vata]++
          } else {
            doshaEffects[dosha as keyof typeof doshaEffects].neutral++
          }
        })
      }
    })

    // Determine primary rasa (most common)
    const primaryRasa = Object.entries(rasaCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .map(([rasa]) => rasa)

    // Determine overall virya
    const virya: 'heating' | 'cooling' | 'neutral' = 
      heatingCount > coolingCount ? 'heating' :
      coolingCount > heatingCount ? 'cooling' : 'neutral'

    // Determine overall dosha effects
    const doshaEffect = {
      vata: this.getDominantEffect(doshaEffects.vata),
      pitta: this.getDominantEffect(doshaEffects.pitta),
      kapha: this.getDominantEffect(doshaEffects.kapha)
    }

    return {
      primaryRasa,
      virya,
      vipaka: 'sweet', // Default, could be calculated more sophisticatedly
      doshaEffect
    }
  }

  private static getDominantEffect(effects: { increases: number, decreases: number, balances: number, neutral: number }): 
    'increases' | 'decreases' | 'balances' | 'neutral' {
    const maxCount = Math.max(effects.increases, effects.decreases, effects.balances, effects.neutral)
    
    if (effects.decreases === maxCount) return 'decreases'
    if (effects.balances === maxCount) return 'balances'
    if (effects.increases === maxCount) return 'increases'
    return 'neutral'
  }

  /**
   * Get nutritional analysis summary for a recipe
   */
  static getNutritionalAnalysis(recipe: Recipe): {
    caloriesPerServing: number
    macroBreakdown: {
      protein: { grams: number, percentage: number }
      carbs: { grams: number, percentage: number }
      fat: { grams: number, percentage: number }
    }
    micronutrientHighlights: string[]
    ayurvedicBenefits: string[]
    recommendations: string[]
  } {
    const nutrition = recipe.nutritionalInfo
    const totalMacros = nutrition.protein + nutrition.carbohydrates + nutrition.fat
    
    const macroBreakdown = {
      protein: {
        grams: nutrition.protein,
        percentage: Math.round((nutrition.protein / totalMacros) * 100)
      },
      carbs: {
        grams: nutrition.carbohydrates,
        percentage: Math.round((nutrition.carbohydrates / totalMacros) * 100)
      },
      fat: {
        grams: nutrition.fat,
        percentage: Math.round((nutrition.fat / totalMacros) * 100)
      }
    }

    const micronutrientHighlights = []
    if (nutrition.fiber >= 5) micronutrientHighlights.push(`High fiber (${nutrition.fiber}g)`)
    if (nutrition.calcium >= 100) micronutrientHighlights.push(`Good calcium source (${nutrition.calcium}mg)`)
    if (nutrition.iron >= 2) micronutrientHighlights.push(`Iron rich (${nutrition.iron}mg)`)
    if (nutrition.potassium >= 300) micronutrientHighlights.push(`Potassium rich (${nutrition.potassium}mg)`)

    const ayurvedicBenefits = this.getAyurvedicBenefits(recipe)
    const recommendations = this.getConsumptionRecommendations(recipe)

    return {
      caloriesPerServing: nutrition.caloriesPerServing,
      macroBreakdown,
      micronutrientHighlights,
      ayurvedicBenefits,
      recommendations
    }
  }

  private static getAyurvedicBenefits(recipe: Recipe): string[] {
    const benefits = []
    const props = recipe.ayurvedicProperties

    if (props.digestibility === 'easy') {
      benefits.push("Easy to digest - suitable for all ages")
    }

    if (props.doshaEffect.vata === 'balances') {
      benefits.push("Calms Vata - reduces anxiety and promotes grounding")
    }

    if (props.doshaEffect.pitta === 'balances') {
      benefits.push("Balances Pitta - cooling and anti-inflammatory")
    }

    if (props.doshaEffect.kapha === 'balances') {
      benefits.push("Stimulates Kapha - energizing and metabolism-boosting")
    }

    if (props.primaryRasa.includes('sweet')) {
      benefits.push("Sweet taste builds strength and nourishes tissues")
    }

    return benefits
  }

  private static getConsumptionRecommendations(recipe: Recipe): string[] {
    const recommendations = []
    const props = recipe.ayurvedicProperties

    // Time recommendations
    if (props.timeOfDay.includes('morning')) {
      recommendations.push("Best consumed in the morning for optimal digestion")
    }
    if (props.timeOfDay.includes('noon')) {
      recommendations.push("Ideal for lunch when digestive fire is strongest")
    }

    // Seasonal recommendations
    if (props.season.length > 0) {
      recommendations.push(`Most beneficial during ${props.season.join(', ')} season(s)`)
    }

    // Constitution recommendations
    if (props.constitution.includes('tridoshic')) {
      recommendations.push("Suitable for all body types")
    } else {
      recommendations.push(`Especially beneficial for ${props.constitution.join(', ')} constitution(s)`)
    }

    return recommendations
  }
}

// Helper function to find recipe ingredients in food database
export function validateRecipeIngredients(ingredients: RecipeIngredient[]): {
  valid: RecipeIngredient[]
  invalid: RecipeIngredient[]
} {
  const valid: RecipeIngredient[] = []
  const invalid: RecipeIngredient[] = []
  const foodDatabase = getAllFoodItems()

  ingredients.forEach(ingredient => {
    const foodItem = foodDatabase.find((item: FoodItem) => 
      item.id === ingredient.id || 
      item.name.toLowerCase() === ingredient.name.toLowerCase()
    )
    
    if (foodItem) {
      valid.push(ingredient)
    } else {
      invalid.push(ingredient)
    }
  })

  return { valid, invalid }
}

export default NutritionalCalculator
