// Food database utilities for diet chart builder
import foodDatabase from "../data/food-database.json"

export interface FoodItem {
  id: string
  name: string
  category: "breakfast" | "lunch" | "dinner" | "snack"
  cuisine: "indian" | "western"
  description: string
  ingredients: string[]
  ayurvedicProperties: {
    rasa: string[]
    virya: "heating" | "cooling"
    vipaka: string
    doshaEffect: {
      vata: "balancing" | "aggravating" | "neutral"
      pitta: "balancing" | "aggravating" | "neutral"
      kapha: "balancing" | "aggravating" | "neutral"
    }
    constitution: string[]
    season: string[]
    timeOfDay: string[]
  }
  nutritionalInfo: {
    caloriesPerServing: number
    protein: number
    carbohydrates: number
    fat: number
    fiber: number
    sugar: number
    sodium: number
    potassium: number
    calcium: number
    iron: number
    vitamins: { [key: string]: number }
  }
  servingSize: string
  prepTime: number
  difficulty: "easy" | "medium" | "hard"
  tags: string[]
  mealSuitability: string[]
}

export interface DietChart {
  id: string
  name: string
  description: string
  patientId: string
  startDate: Date
  endDate: Date
  weeklyPlan: WeeklyMealPlan[]
  totalCalories: number
  nutritionalSummary: NutritionalSummary
  ayurvedicGuidelines: string[]
  createdAt: Date
  createdBy: string
  isAIGenerated: boolean
}

export interface WeeklyMealPlan {
  day: number
  dayName: string
  meals: {
    breakfast: MealPlan
    lunch: MealPlan
    dinner: MealPlan
    snacks: MealPlan
  }
  dailyCalories: number
  dailyNutrition: NutritionalSummary
}

export interface MealPlan {
  items: SelectedFood[]
  totalCalories: number
  nutrition: NutritionalSummary
  ayurvedicBalance: {
    doshaEffect: { vata: number, pitta: number, kapha: number }
    rasaBalance: string[]
    viryaEffect: string
  }
}

export interface SelectedFood {
  foodId: string
  name: string
  quantity: number
  unit: string
  calories: number
  ayurvedicScore: number
}

export interface NutritionalSummary {
  calories: number
  protein: number
  carbohydrates: number
  fat: number
  fiber: number
  sugar: number
  sodium: number
  potassium: number
  calcium: number
  iron: number
  vitamins: Record<string, number>
}

export interface DietChartFilters {
  mealType?: string[]
  cuisine?: string[]
  constitution?: string[]
  difficulty?: string[]
  tags?: string[]
  maxPrepTime?: number
  minCalories?: number
  maxCalories?: number
}

export interface AIChartRequest {
  patientProfile: {
    age: number
    gender: string
    constitution: string
    healthConditions: string[]
    dietaryRestrictions: string[]
    activityLevel: string
    currentWeight: number
    targetWeight: number
    targetCalories: number
  }
  preferences: {
    cuisine: string[]
    avoidFoods: string[]
    preferredMeals: string[]
  }
  duration: number // days
  goals: string[]
}

// Get all food items
export const getAllFoodItems = (): FoodItem[] => {
  return foodDatabase as unknown as FoodItem[]
}

// Search food items
export const searchFoodItems = (
  query: string, 
  filters: DietChartFilters = {}
): FoodItem[] => {
  let foods = getAllFoodItems()

  // Text search
  if (query) {
    const searchTerm = query.toLowerCase()
    foods = foods.filter(food => 
      food.name.toLowerCase().includes(searchTerm) ||
      food.description.toLowerCase().includes(searchTerm) ||
      food.ingredients.some(ing => ing.toLowerCase().includes(searchTerm)) ||
      food.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    )
  }

  // Apply filters
  if (filters.mealType?.length) {
    foods = foods.filter(food => 
      filters.mealType!.some(meal => food.mealSuitability.includes(meal))
    )
  }

  if (filters.cuisine?.length) {
    foods = foods.filter(food => filters.cuisine!.includes(food.cuisine))
  }

  if (filters.constitution?.length) {
    foods = foods.filter(food => 
      filters.constitution!.some(constitution => food.ayurvedicProperties.constitution.includes(constitution))
    )
  }

  if (filters.difficulty?.length) {
    foods = foods.filter(food => filters.difficulty!.includes(food.difficulty))
  }

  if (filters.tags?.length) {
    foods = foods.filter(food => 
      filters.tags!.some(tag => food.tags.includes(tag))
    )
  }

  if (filters.maxPrepTime) {
    foods = foods.filter(food => food.prepTime <= filters.maxPrepTime!)
  }

  if (filters.minCalories) {
    foods = foods.filter(food => food.nutritionalInfo.caloriesPerServing >= filters.minCalories!)
  }

  if (filters.maxCalories) {
    foods = foods.filter(food => food.nutritionalInfo.caloriesPerServing <= filters.maxCalories!)
  }

  return foods
}

// Get foods by meal type
export const getFoodsByMealType = (mealType: string): FoodItem[] => {
  return getAllFoodItems().filter(food => food.mealSuitability.includes(mealType))
}

// Get foods by constitution
export const getFoodsByConstitution = (constitution: string): FoodItem[] => {
  return getAllFoodItems().filter(food => 
    food.ayurvedicProperties.constitution.includes(constitution) ||
    food.ayurvedicProperties.constitution.includes("tridoshic")
  )
}

// Calculate ayurvedic score for a food based on user profile
export const calculateAyurvedicScore = (
  food: FoodItem, 
  constitution: string,
  season: string,
  healthConditions: string[] = []
): number => {
  let score = 0

  // Constitution compatibility (40% weight)
  if (food.ayurvedicProperties.constitution.includes(constitution)) {
    score += 0.4
  } else if (food.ayurvedicProperties.constitution.includes("tridoshic")) {
    score += 0.3
  }

  // Seasonal appropriateness (30% weight)
  if (food.ayurvedicProperties.season.includes(season)) {
    score += 0.3
  } else if (food.ayurvedicProperties.season.includes("all")) {
    score += 0.25
  }

  // Dosha effect (20% weight)
  const mainDosha = constitution.split("-")[0] as keyof typeof food.ayurvedicProperties.doshaEffect
  if (food.ayurvedicProperties.doshaEffect[mainDosha] === "balancing") {
    score += 0.2
  } else if (food.ayurvedicProperties.doshaEffect[mainDosha] === "neutral") {
    score += 0.1
  }

  // Health condition considerations (10% weight)
  // This would need more complex logic based on specific conditions
  score += 0.1

  return Math.round(score * 100) / 100
}

// Generate sample foods for quick add
export const getSampleFoods = (mealType: string): FoodItem[] => {
  const foods = getFoodsByMealType(mealType)
  // Return first 3 most popular/common foods
  return foods.slice(0, 3)
}

// Calculate nutritional summary for multiple foods
export const calculateNutritionalSummary = (selectedFoods: SelectedFood[]): NutritionalSummary => {
  const foods = getAllFoodItems()
  
  const summary: NutritionalSummary = {
    calories: 0,
    protein: 0,
    carbohydrates: 0,
    fat: 0,
    fiber: 0,
    sugar: 0,
    sodium: 0,
    potassium: 0,
    calcium: 0,
    iron: 0,
    vitamins: {}
  }

  selectedFoods.forEach(selectedFood => {
    const food = foods.find(f => f.id === selectedFood.foodId)
    if (food) {
      const multiplier = selectedFood.quantity // Assuming quantity is serving multiplier
      const nutrition = food.nutritionalInfo

      summary.calories += nutrition.caloriesPerServing * multiplier
      summary.protein += nutrition.protein * multiplier
      summary.carbohydrates += nutrition.carbohydrates * multiplier
      summary.fat += nutrition.fat * multiplier
      summary.fiber += nutrition.fiber * multiplier
      summary.sugar += nutrition.sugar * multiplier
      summary.sodium += nutrition.sodium * multiplier
      summary.potassium += nutrition.potassium * multiplier
      summary.calcium += nutrition.calcium * multiplier
      summary.iron += nutrition.iron * multiplier

      // Aggregate vitamins
      Object.entries(nutrition.vitamins).forEach(([vitamin, value]) => {
        if (!summary.vitamins[vitamin]) {
          summary.vitamins[vitamin] = 0
        }
        summary.vitamins[vitamin] += value * multiplier
      })
    }
  })

  // Round all values
  Object.keys(summary).forEach(key => {
    if (key !== 'vitamins' && typeof summary[key as keyof NutritionalSummary] === 'number') {
      (summary as any)[key] = Math.round((summary as any)[key])
    }
  })

  // Round vitamin values
  Object.keys(summary.vitamins).forEach(vitamin => {
    summary.vitamins[vitamin] = Math.round(summary.vitamins[vitamin] * 10) / 10
  })

  return summary
}

// Save diet chart
export const saveDietChart = (chart: DietChart): void => {
  const charts = getDietCharts()
  const existingIndex = charts.findIndex(c => c.id === chart.id)
  
  if (existingIndex >= 0) {
    charts[existingIndex] = chart
  } else {
    chart.id = generateId()
    chart.createdAt = new Date()
    charts.push(chart)
  }
  
  localStorage.setItem("diet_charts", JSON.stringify(charts))
}

// Get all diet charts
export const getDietCharts = (): DietChart[] => {
  const stored = localStorage.getItem("diet_charts")
  return stored ? JSON.parse(stored) : []
}

// Get diet chart by ID
export const getDietChartById = (id: string): DietChart | null => {
  const charts = getDietCharts()
  return charts.find(chart => chart.id === id) || null
}

// Delete diet chart
export const deleteDietChart = (id: string): void => {
  const charts = getDietCharts()
  const filtered = charts.filter(chart => chart.id !== id)
  localStorage.setItem("diet_charts", JSON.stringify(filtered))
}

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Export diet chart to different formats
export const exportDietChartToPDF = (chart: DietChart): void => {
  const content = generatePDFContent(chart)
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `diet-chart-${chart.name}-${new Date().toISOString().split('T')[0]}.txt`
  link.click()
  URL.revokeObjectURL(url)
}

export const exportDietChartToCSV = (chart: DietChart): void => {
  let csv = "Day,Meal,Food Item,Calories,Protein(g),Carbs(g),Fat(g),Fiber(g)\n"
  
  chart.weeklyPlan.forEach(day => {
    Object.entries(day.meals).forEach(([mealType, meal]) => {
      meal.items.forEach(food => {
        csv += `${day.dayName},${mealType},${food.name},${food.calories},`
        // Add nutritional data (simplified)
        csv += `0,0,0,0\n` // Would need actual nutrition per food
      })
    })
  })
  
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `diet-chart-${chart.name}-${new Date().toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export const exportDietChartToJSON = (chart: DietChart): void => {
  const json = JSON.stringify(chart, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `diet-chart-${chart.name}-${new Date().toISOString().split('T')[0]}.json`
  link.click()
  URL.revokeObjectURL(url)
}

// Generate PDF content
const generatePDFContent = (chart: DietChart): string => {
  let content = `AYURVEDIC DIET CHART
Chart Name: ${chart.name}
Description: ${chart.description}
Duration: ${chart.startDate.toDateString()} to ${chart.endDate.toDateString()}
Total Calories: ${chart.totalCalories} per day (average)

WEEKLY MEAL PLAN:
`

  chart.weeklyPlan.forEach(day => {
    content += `\n--- ${day.dayName.toUpperCase()} (${day.dailyCalories} calories) ---\n`
    
    Object.entries(day.meals).forEach(([mealType, meal]) => {
      content += `\n${mealType.toUpperCase()}:\n`
      meal.items.forEach(food => {
        content += `  • ${food.name} (${food.quantity} ${food.unit}) - ${food.calories} cal\n`
      })
      content += `  Total: ${meal.totalCalories} calories\n`
    })
  })

  content += `\nNUTRITIONAL SUMMARY (Daily Average):
Calories: ${chart.nutritionalSummary.calories}
Protein: ${chart.nutritionalSummary.protein}g
Carbohydrates: ${chart.nutritionalSummary.carbohydrates}g
Fat: ${chart.nutritionalSummary.fat}g
Fiber: ${chart.nutritionalSummary.fiber}g

AYURVEDIC GUIDELINES:
${chart.ayurvedicGuidelines.map(guideline => `• ${guideline}`).join('\n')}
`

  return content
}

// AI diet chart generation (mock for now)
export const generateAIDietChart = async (request: AIChartRequest): Promise<DietChart> => {
  // Import the AI service dynamically to avoid SSR issues
  const { generateAIDietChartWithOpenAI } = await import('./ai-diet-service')
  return generateAIDietChartWithOpenAI(request)
}

// Helper function to create meal plan
const createMealPlan = (foods: FoodItem[]): MealPlan => {
  const selectedFoods: SelectedFood[] = foods.map(food => ({
    foodId: food.id,
    name: food.name,
    quantity: 1,
    unit: "serving",
    calories: food.nutritionalInfo.caloriesPerServing,
    ayurvedicScore: 85
  }))

  const totalCalories = selectedFoods.reduce((sum, food) => sum + food.calories, 0)
  
  return {
    items: selectedFoods,
    totalCalories,
    nutrition: calculateNutritionalSummary(selectedFoods),
    ayurvedicBalance: {
      doshaEffect: { vata: 0, pitta: 0, kapha: 0 },
      rasaBalance: ["sweet"],
      viryaEffect: "neutral"
    }
  }
}
