// Ayurvedic food and category data management
import ayurvedicFoods from "../data/ayurvedic-foods.json"
import ayurvedicCategories from "../data/ayurvedic-categories.json"
import type { AyurvedicFood, FoodCategory } from "./database"

export const getAllFoods = (): AyurvedicFood[] => {
  return ayurvedicFoods as AyurvedicFood[]
}

export const getAllCategories = (): FoodCategory[] => {
  return ayurvedicCategories as FoodCategory[]
}

export const searchFoods = (query: string): AyurvedicFood[] => {
  const foods = getAllFoods()
  const searchTerm = query.toLowerCase()

  return foods.filter(
    (food) =>
      food.Food.toLowerCase().includes(searchTerm) ||
      food.Rasa.toLowerCase().includes(searchTerm) ||
      food["Dosha Effect"].toLowerCase().includes(searchTerm) ||
      food.Pathya.toLowerCase().includes(searchTerm),
  )
}

export const filterFoodsByDosha = (dosha: string): AyurvedicFood[] => {
  const foods = getAllFoods()
  return foods.filter((food) => food["Dosha Effect"].toLowerCase().includes(dosha.toLowerCase()))
}

export const filterFoodsByTaste = (taste: string): AyurvedicFood[] => {
  const foods = getAllFoods()
  return foods.filter((food) => food.Rasa.toLowerCase().includes(taste.toLowerCase()))
}

export const getFoodsForCondition = (condition: string): AyurvedicFood[] => {
  const foods = getAllFoods()
  return foods.filter((food) => food.Pathya.toLowerCase().includes(condition.toLowerCase()))
}

export const getCategoriesForType = (categoryType: string): FoodCategory[] => {
  const categories = getAllCategories()
  return categories.filter((category) => category["Category Type"].toLowerCase().includes(categoryType.toLowerCase()))
}

export const getRecommendationsForProfile = (
  age: number,
  gender: string,
  constitution: string,
  conditions: string[],
  occupation: string,
): FoodCategory[] => {
  const categories = getAllCategories()
  const recommendations: FoodCategory[] = []

  // Age-based recommendations
  if (age < 18) {
    recommendations.push(
      ...categories.filter((c) => c["Category Type"] === "Age-Specific" && c["Sub-Category"].includes("Children")),
    )
  } else if (age >= 60) {
    recommendations.push(
      ...categories.filter((c) => c["Category Type"] === "Age-Specific" && c["Sub-Category"].includes("Elderly")),
    )
  }

  // Gender-based recommendations
  if (gender === "female") {
    recommendations.push(...categories.filter((c) => c["Category Type"] === "Women-Specific"))
  }

  // Constitution-based recommendations
  const doshaFoods = filterFoodsByDosha(constitution)

  // Occupation-based recommendations
  if (occupation) {
    recommendations.push(
      ...categories.filter(
        (c) =>
          c["Category Type"] === "Occupation-Based" &&
          c["Sub-Category"].toLowerCase().includes(occupation.toLowerCase()),
      ),
    )
  }

  // Condition-based recommendations
  conditions.forEach((condition) => {
    recommendations.push(
      ...categories.filter(
        (c) =>
          c["Category Type"] === "Condition-Based" && c["Sub-Category"].toLowerCase().includes(condition.toLowerCase()),
      ),
    )
  })

  return recommendations
}

// Translation utilities (basic implementation)
export const translateText = async (text: string, targetLang: "hi" | "en"): Promise<string> => {
  // Basic translation mapping for common Ayurvedic terms
  const translations: Record<string, Record<string, string>> = {
    en: {
      वात: "Vata",
      पित्त: "Pitta",
      कफ: "Kapha",
      आहार: "Diet",
      रोगी: "Patient",
      भोजन: "Food",
      स्वास्थ्य: "Health",
    },
    hi: {
      Vata: "वात",
      Pitta: "पित्त",
      Kapha: "कफ",
      Diet: "आहार",
      Patient: "रोगी",
      Food: "भोजन",
      Health: "स्वास्थ्य",
    },
  }

  // Simple word replacement for demo
  let translatedText = text
  const langTranslations = translations[targetLang] || {}

  Object.entries(langTranslations).forEach(([key, value]) => {
    translatedText = translatedText.replace(new RegExp(key, "gi"), value)
  })

  return translatedText
}
