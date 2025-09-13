// Diet plan generation logic based on Ayurvedic principles
import { type Patient, type DietPlan, generateId } from "./database"
import { type AyurvedicFood, type FoodCategory, getAllFoods, getRecommendationsForProfile } from "./ayurvedic-data"

export interface DietPlanOptions {
  duration: number // days
  mealsPerDay: number
  includeSnacks: boolean
  focusAreas: string[] // weight loss, immunity, digestion, etc.
  avoidFoods: string[]
}

export interface GeneratedMealPlan {
  breakfast: string[]
  lunch: string[]
  dinner: string[]
  snacks: string[]
}

export interface DietPlanRecommendation {
  foods: AyurvedicFood[]
  categories: FoodCategory[]
  reasoning: string
}

// Generate personalized diet plan based on patient profile
export const generateDietPlan = (patient: Patient, options: DietPlanOptions): DietPlan => {
  const recommendations = getPersonalizedRecommendations(patient, options)
  const mealPlan = generateMealPlan(patient, recommendations, options)

  return {
    id: generateId(),
    patientId: patient.id,
    planName: `${patient.constitution.toUpperCase()} Diet Plan - ${new Date().toLocaleDateString()}`,
    duration: options.duration,
    meals: mealPlan,
    restrictions: generateRestrictions(patient, recommendations),
    recommendations: generateGeneralRecommendations(patient, recommendations),
    createdAt: new Date(),
  }
}

// Get personalized food recommendations based on patient profile
export const getPersonalizedRecommendations = (patient: Patient, options: DietPlanOptions): DietPlanRecommendation => {
  const allFoods = getAllFoods()
  const categories = getRecommendationsForProfile(
    patient.age,
    patient.gender,
    patient.constitution,
    patient.currentConditions,
    patient.occupation,
  )

  // Filter foods based on constitution
  let recommendedFoods = allFoods.filter((food) => {
    const doshaEffect = food["Dosha Effect"].toLowerCase()

    // Match foods that balance the patient's constitution
    switch (patient.constitution) {
      case "vata":
        return doshaEffect.includes("reduces vata") || doshaEffect.includes("vata reduces")
      case "pitta":
        return doshaEffect.includes("reduces pitta") || doshaEffect.includes("pitta reduces")
      case "kapha":
        return doshaEffect.includes("reduces kapha") || doshaEffect.includes("kapha reduces")
      case "vata-pitta":
        return doshaEffect.includes("reduces vata") || doshaEffect.includes("reduces pitta")
      case "pitta-kapha":
        return doshaEffect.includes("reduces pitta") || doshaEffect.includes("reduces kapha")
      case "vata-kapha":
        return doshaEffect.includes("reduces vata") || doshaEffect.includes("reduces kapha")
      case "tridoshic":
        return true // All foods are suitable for tridoshic constitution
      default:
        return true
    }
  })

  // Filter based on current conditions
  if (patient.currentConditions.length > 0) {
    recommendedFoods = recommendedFoods.filter((food) => {
      return patient.currentConditions.some((condition) => food.Pathya.toLowerCase().includes(condition.toLowerCase()))
    })
  }

  // Remove foods that should be avoided
  recommendedFoods = recommendedFoods.filter((food) => {
    return (
      !patient.dietaryRestrictions.some((restriction) => food.Food.toLowerCase().includes(restriction.toLowerCase())) &&
      !options.avoidFoods.some((avoid) => food.Food.toLowerCase().includes(avoid.toLowerCase()))
    )
  })

  // Filter out foods contraindicated for patient's conditions
  recommendedFoods = recommendedFoods.filter((food) => {
    return !patient.currentConditions.some((condition) => food.Apathya.toLowerCase().includes(condition.toLowerCase()))
  })

  const reasoning = generateRecommendationReasoning(patient, categories)

  return {
    foods: recommendedFoods,
    categories,
    reasoning,
  }
}

// Generate meal plan structure
const generateMealPlan = (
  patient: Patient,
  recommendations: DietPlanRecommendation,
  options: DietPlanOptions,
): GeneratedMealPlan => {
  const { foods } = recommendations

  // Categorize foods by meal type based on Ayurvedic principles
  const breakfastFoods = foods.filter(
    (food) =>
      food.Digestibility === "Easy" ||
      food.Food.toLowerCase().includes("milk") ||
      food.Food.toLowerCase().includes("fruit") ||
      food.Food.toLowerCase().includes("porridge") ||
      food.Food.toLowerCase().includes("oats"),
  )

  const lunchFoods = foods.filter((food) => food.Digestibility === "Moderate" || food.Digestibility === "Easy")

  const dinnerFoods = foods.filter((food) => food.Digestibility === "Easy" || food.Guna === "Light")

  const snackFoods = foods.filter((food) => food.Guna === "Light" && food.Digestibility === "Easy")

  // Generate meal suggestions based on constitution and time of day
  const breakfast = generateMealSuggestions(breakfastFoods, patient.constitution, "breakfast", 3)
  const lunch = generateMealSuggestions(lunchFoods, patient.constitution, "lunch", 4)
  const dinner = generateMealSuggestions(dinnerFoods, patient.constitution, "dinner", 3)
  const snacks = options.includeSnacks ? generateMealSuggestions(snackFoods, patient.constitution, "snacks", 2) : []

  return {
    breakfast,
    lunch,
    dinner,
    snacks,
  }
}

// Generate meal suggestions for specific meal time
const generateMealSuggestions = (
  foods: AyurvedicFood[],
  constitution: string,
  mealType: string,
  count: number,
): string[] => {
  // Shuffle and select foods
  const shuffled = [...foods].sort(() => 0.5 - Math.random())
  const selected = shuffled.slice(0, Math.min(count, shuffled.length))

  // Convert to meal suggestions with preparation methods
  return selected.map((food) => {
    const mealSuggestions = getMealSuggestionsByType(food, mealType, constitution)
    return mealSuggestions[Math.floor(Math.random() * mealSuggestions.length)]
  })
}

// Get meal suggestions based on food and meal type
const getMealSuggestionsByType = (food: AyurvedicFood, mealType: string, constitution: string): string[] => {
  const foodName = food.Food.toLowerCase()

  switch (mealType) {
    case "breakfast":
      if (foodName.includes("milk"))
        return [`Warm ${food.Food} with honey and spices`, `${food.Food} porridge with nuts`]
      if (foodName.includes("fruit")) return [`Fresh ${food.Food} bowl`, `${food.Food} smoothie with yogurt`]
      if (foodName.includes("oats")) return [`${food.Food} porridge with ghee`, `Spiced ${food.Food} with milk`]
      return [`Light ${food.Food} preparation`, `Steamed ${food.Food} with spices`]

    case "lunch":
      if (foodName.includes("rice")) return [`${food.Food} with dal and vegetables`, `${food.Food} khichdi with ghee`]
      if (foodName.includes("lentil") || foodName.includes("dal"))
        return [`${food.Food} curry with rice`, `${food.Food} soup with bread`]
      return [`${food.Food} curry with grains`, `Cooked ${food.Food} with spices`]

    case "dinner":
      return [`Light ${food.Food} soup`, `Steamed ${food.Food} with herbs`, `${food.Food} broth`]

    case "snacks":
      return [`${food.Food} tea`, `Roasted ${food.Food}`, `${food.Food} with warm water`]

    default:
      return [`Prepared ${food.Food}`]
  }
}

// Generate dietary restrictions based on patient profile
const generateRestrictions = (patient: Patient, recommendations: DietPlanRecommendation): string[] => {
  const restrictions: string[] = [...patient.dietaryRestrictions]

  // Add constitution-based restrictions
  switch (patient.constitution) {
    case "vata":
      restrictions.push("Avoid cold and raw foods", "Limit bitter and astringent tastes", "Avoid irregular meal times")
      break
    case "pitta":
      restrictions.push(
        "Avoid spicy and hot foods",
        "Limit sour and salty tastes",
        "Avoid eating when angry or stressed",
      )
      break
    case "kapha":
      restrictions.push("Avoid heavy and oily foods", "Limit sweet and salty tastes", "Avoid overeating")
      break
  }

  // Add condition-based restrictions
  patient.currentConditions.forEach((condition) => {
    switch (condition.toLowerCase()) {
      case "diabetes":
        restrictions.push("Avoid refined sugars", "Limit high-glycemic foods", "Control portion sizes")
        break
      case "hypertension":
        restrictions.push("Limit salt intake", "Avoid processed foods", "Reduce caffeine")
        break
      case "obesity":
        restrictions.push("Avoid fried foods", "Limit heavy meals", "Reduce calorie-dense foods")
        break
    }
  })

  return [...new Set(restrictions)] // Remove duplicates
}

// Generate general recommendations
const generateGeneralRecommendations = (patient: Patient, recommendations: DietPlanRecommendation): string[] => {
  const recs: string[] = []

  // Constitution-based recommendations
  switch (patient.constitution) {
    case "vata":
      recs.push(
        "Eat warm, cooked foods regularly",
        "Include healthy fats like ghee and oils",
        "Maintain regular meal times",
        "Stay hydrated with warm liquids",
      )
      break
    case "pitta":
      recs.push(
        "Eat cooling and fresh foods",
        "Include sweet and bitter tastes",
        "Avoid eating in hot weather",
        "Stay cool and calm while eating",
      )
      break
    case "kapha":
      recs.push(
        "Eat light and warm foods",
        "Include pungent and bitter tastes",
        "Exercise before meals",
        "Avoid heavy meals in the evening",
      )
      break
  }

  // Lifestyle-based recommendations
  if (patient.lifestyle.activityLevel === "sedentary") {
    recs.push("Include more fiber-rich foods", "Eat smaller, frequent meals")
  }

  if (patient.lifestyle.stressLevel === "high") {
    recs.push("Include calming foods like warm milk", "Avoid stimulants like caffeine")
  }

  // Age-based recommendations
  if (patient.age > 60) {
    recs.push("Focus on easily digestible foods", "Include calcium-rich foods", "Stay well hydrated")
  }

  return recs
}

// Generate reasoning for recommendations
const generateRecommendationReasoning = (patient: Patient, categories: FoodCategory[]): string => {
  let reasoning = `This diet plan is specifically designed for a ${patient.age}-year-old ${patient.gender} with ${patient.constitution} constitution. `

  if (patient.currentConditions.length > 0) {
    reasoning += `The plan addresses current health conditions: ${patient.currentConditions.join(", ")}. `
  }

  reasoning += `Foods are selected to balance ${patient.constitution} dosha and support overall health. `

  if (patient.lifestyle.stressLevel === "high") {
    reasoning += "Special attention is given to stress-reducing foods. "
  }

  if (patient.occupation) {
    reasoning += `Recommendations consider the demands of working as a ${patient.occupation}. `
  }

  return reasoning
}

// Get seasonal recommendations
export const getSeasonalRecommendations = (season: "spring" | "summer" | "monsoon" | "autumn" | "winter"): string[] => {
  switch (season) {
    case "spring":
      return ["Include bitter and pungent tastes", "Eat light and warm foods", "Avoid heavy and oily foods"]
    case "summer":
      return ["Include sweet and cooling foods", "Stay hydrated", "Avoid hot and spicy foods"]
    case "monsoon":
      return ["Eat warm and dry foods", "Include digestive spices", "Avoid raw and cold foods"]
    case "autumn":
      return ["Include sweet and nourishing foods", "Eat warm meals", "Avoid dry and rough foods"]
    case "winter":
      return ["Include warm and oily foods", "Eat nourishing meals", "Avoid cold and light foods"]
    default:
      return []
  }
}
