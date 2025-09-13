// Recipe Management System
import { generateId } from './database'

export interface Recipe {
  id: string
  name: string
  description: string
  category: RecipeCategory
  mealType: MealType[]
  constitution: Constitution[]
  ingredients: Ingredient[]
  instructions: string[]
  cookingTime: number // minutes
  prepTime: number // minutes
  difficulty: 'easy' | 'medium' | 'hard'
  servings: number
  nutritionalInfo: NutritionalInfo
  ayurvedicProperties: AyurvedicProperties
  tags: string[]
  images: string[]
  author: string
  ratings: Rating[]
  averageRating: number
  totalRatings: number
  isVegetarian: boolean
  isVegan: boolean
  isDairyFree: boolean
  isGlutenFree: boolean
  createdAt: Date
  updatedAt: Date
  isAIGenerated: boolean
}

export interface Ingredient {
  name: string
  quantity: number
  unit: string
  ayurvedicTaste?: Taste[]
  ayurvedicEffect?: 'heating' | 'cooling' | 'neutral'
  isOptional?: boolean
  alternatives?: string[]
}

export interface NutritionalInfo {
  caloriesPerServing: number
  protein: number // grams
  carbohydrates: number // grams
  fat: number // grams
  fiber: number // grams
  sugar: number // grams
  sodium: number // mg
  potassium: number // mg
  vitamins: { [key: string]: number }
  minerals: { [key: string]: number }
}

export interface AyurvedicProperties {
  rasa: Taste[] // Six tastes
  virya: 'heating' | 'cooling' // Thermal effect
  vipaka: 'sweet' | 'sour' | 'pungent' // Post-digestive effect
  prabhava?: string // Special effect
  doshaEffect: {
    vata: 'increase' | 'decrease' | 'neutral'
    pitta: 'increase' | 'decrease' | 'neutral'
    kapha: 'increase' | 'decrease' | 'neutral'
  }
  seasonalSuitability: Season[]
  therapeuticUses: string[]
  contraindications: string[]
}

export interface Rating {
  userId: string
  userName: string
  rating: number // 1-5
  review?: string
  date: Date
}

export type RecipeCategory = 
  | 'breakfast'
  | 'main-course'
  | 'appetizer'
  | 'dessert'
  | 'beverage'
  | 'snack'
  | 'soup'
  | 'salad'
  | 'bread'
  | 'rice'
  | 'dal'
  | 'vegetable'
  | 'chutney'
  | 'pickle'
  | 'sweet'
  | 'medicine'

export type MealType = 'breakfast' | 'midMorning' | 'lunch' | 'midAfternoon' | 'dinner' | 'bedtime'

export type Constitution = 'vata' | 'pitta' | 'kapha' | 'vata-pitta' | 'pitta-kapha' | 'vata-kapha' | 'tridoshic'

export type Taste = 'sweet' | 'sour' | 'salty' | 'pungent' | 'bitter' | 'astringent'

export type Season = 'spring' | 'summer' | 'monsoon' | 'autumn' | 'winter' | 'late-winter'

// Recipe data storage
const RECIPES_KEY = "ayurvedic_recipes"
const RECIPE_CATEGORIES_KEY = "recipe_categories"

// Local storage helper functions
export const saveRecipe = (recipe: Recipe): void => {
  const recipes = getRecipes()
  const existingIndex = recipes.findIndex((r) => r.id === recipe.id)

  if (existingIndex >= 0) {
    recipes[existingIndex] = { ...recipe, updatedAt: new Date() }
  } else {
    recipes.push({ ...recipe, createdAt: recipe.createdAt || new Date(), updatedAt: new Date() })
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes))
  }
}

export const getRecipes = (): Recipe[] => {
  if (typeof window === "undefined") return getSampleRecipes()
  const stored = localStorage.getItem(RECIPES_KEY)
  return stored ? JSON.parse(stored) : getSampleRecipes()
}

export const getRecipeById = (id: string): Recipe | null => {
  const recipes = getRecipes()
  return recipes.find((r) => r.id === id) || null
}

export const deleteRecipe = (id: string): void => {
  const recipes = getRecipes()
  const filteredRecipes = recipes.filter((r) => r.id !== id)
  
  if (typeof window !== "undefined") {
    localStorage.setItem(RECIPES_KEY, JSON.stringify(filteredRecipes))
  }
}

export const searchRecipes = (params: {
  query?: string
  category?: RecipeCategory
  mealType?: MealType
  constitution?: Constitution
  difficulty?: string
  maxCookingTime?: number
  dietaryRestrictions?: string[]
  ingredients?: string[]
}): Recipe[] => {
  const recipes = getRecipes()
  
  return recipes.filter(recipe => {
    // Text search
    if (params.query) {
      const searchText = params.query.toLowerCase()
      const matchesText = 
        recipe.name.toLowerCase().includes(searchText) ||
        recipe.description.toLowerCase().includes(searchText) ||
        recipe.ingredients.some(ing => ing.name.toLowerCase().includes(searchText)) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchText))
      
      if (!matchesText) return false
    }

    // Category filter
    if (params.category && recipe.category !== params.category) {
      return false
    }

    // Meal type filter
    if (params.mealType && !recipe.mealType.includes(params.mealType)) {
      return false
    }

    // Constitution filter
    if (params.constitution && !recipe.constitution.includes(params.constitution)) {
      return false
    }

    // Difficulty filter
    if (params.difficulty && recipe.difficulty !== params.difficulty) {
      return false
    }

    // Cooking time filter
    if (params.maxCookingTime && recipe.cookingTime > params.maxCookingTime) {
      return false
    }

    // Dietary restrictions
    if (params.dietaryRestrictions?.includes('vegetarian') && !recipe.isVegetarian) {
      return false
    }
    if (params.dietaryRestrictions?.includes('vegan') && !recipe.isVegan) {
      return false
    }
    if (params.dietaryRestrictions?.includes('dairy-free') && !recipe.isDairyFree) {
      return false
    }
    if (params.dietaryRestrictions?.includes('gluten-free') && !recipe.isGlutenFree) {
      return false
    }

    // Ingredients filter
    if (params.ingredients && params.ingredients.length > 0) {
      const hasAllIngredients = params.ingredients.every(ingredient =>
        recipe.ingredients.some(recipeIngredient =>
          recipeIngredient.name.toLowerCase().includes(ingredient.toLowerCase())
        )
      )
      if (!hasAllIngredients) return false
    }

    return true
  })
}

export const addRecipeRating = (recipeId: string, rating: Omit<Rating, 'date'>): void => {
  const recipes = getRecipes()
  const recipe = recipes.find(r => r.id === recipeId)
  
  if (recipe) {
    const newRating: Rating = {
      ...rating,
      date: new Date()
    }
    
    recipe.ratings.push(newRating)
    recipe.totalRatings = recipe.ratings.length
    recipe.averageRating = recipe.ratings.reduce((sum, r) => sum + r.rating, 0) / recipe.totalRatings
    
    saveRecipe(recipe)
  }
}

export const getTopRatedRecipes = (limit = 10): Recipe[] => {
  const recipes = getRecipes()
  return recipes
    .filter(recipe => recipe.totalRatings > 0)
    .sort((a, b) => b.averageRating - a.averageRating)
    .slice(0, limit)
}

export const getRecipesByConstitution = (constitution: Constitution): Recipe[] => {
  const recipes = getRecipes()
  return recipes.filter(recipe => 
    recipe.constitution.includes(constitution) ||
    recipe.constitution.includes('tridoshic') ||
    (constitution.includes('-') && 
      constitution.split('-').some(c => recipe.constitution.includes(c as Constitution)))
  )
}

export const getSeasonalRecipes = (season: Season): Recipe[] => {
  const recipes = getRecipes()
  return recipes.filter(recipe => 
    recipe.ayurvedicProperties.seasonalSuitability.includes(season)
  )
}

// Sample recipes data
export const getSampleRecipes = (): Recipe[] => [
  {
    id: "recipe-1",
    name: "Vata Pacifying Golden Milk",
    description: "Warming and nourishing turmeric milk perfect for Vata constitution",
    category: "beverage",
    mealType: ["bedtime"],
    constitution: ["vata", "tridoshic"],
    ingredients: [
      { name: "Whole milk", quantity: 1, unit: "cup", ayurvedicTaste: ["sweet"], ayurvedicEffect: "cooling" },
      { name: "Turmeric powder", quantity: 0.5, unit: "tsp", ayurvedicTaste: ["pungent", "bitter"], ayurvedicEffect: "heating" },
      { name: "Ghee", quantity: 1, unit: "tsp", ayurvedicTaste: ["sweet"], ayurvedicEffect: "cooling" },
      { name: "Ginger powder", quantity: 0.25, unit: "tsp", ayurvedicTaste: ["pungent"], ayurvedicEffect: "heating" },
      { name: "Cardamom", quantity: 2, unit: "pods", ayurvedicTaste: ["pungent", "sweet"], ayurvedicEffect: "cooling" },
      { name: "Raw honey", quantity: 1, unit: "tsp", ayurvedicTaste: ["sweet"], ayurvedicEffect: "heating", isOptional: true }
    ],
    instructions: [
      "Heat milk in a saucepan over medium heat",
      "Add turmeric, ginger, and cardamom",
      "Simmer for 5 minutes, stirring occasionally",
      "Strain into a cup",
      "Add ghee and stir well",
      "Allow to cool slightly, then add honey if desired",
      "Drink warm before bedtime"
    ],
    cookingTime: 10,
    prepTime: 5,
    difficulty: "easy",
    servings: 1,
    nutritionalInfo: {
      caloriesPerServing: 180,
      protein: 8,
      carbohydrates: 12,
      fat: 12,
      fiber: 1,
      sugar: 12,
      sodium: 100,
      potassium: 350,
      vitamins: { "vitamin A": 10, "vitamin D": 25 },
      minerals: { calcium: 300, magnesium: 25 }
    },
    ayurvedicProperties: {
      rasa: ["sweet", "pungent"],
      virya: "heating",
      vipaka: "sweet",
      prabhava: "Enhances ojas and promotes restful sleep",
      doshaEffect: {
        vata: "decrease",
        pitta: "neutral",
        kapha: "increase"
      },
      seasonalSuitability: ["autumn", "winter", "late-winter"],
      therapeuticUses: ["Improves digestion", "Reduces inflammation", "Promotes sleep", "Boosts immunity"],
      contraindications: ["High Kapha conditions", "Diabetes (without honey)"]
    },
    tags: ["warming", "bedtime", "anti-inflammatory", "digestive"],
    images: ["/images/recipes/golden-milk.jpg"],
    author: "Traditional Ayurvedic Recipe",
    ratings: [],
    averageRating: 0,
    totalRatings: 0,
    isVegetarian: true,
    isVegan: false,
    isDairyFree: false,
    isGlutenFree: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    isAIGenerated: false
  },
  {
    id: "recipe-2",
    name: "Pitta Cooling Coconut Rice",
    description: "Light and cooling rice dish perfect for Pitta constitution",
    category: "main-course",
    mealType: ["lunch", "dinner"],
    constitution: ["pitta", "tridoshic"],
    ingredients: [
      { name: "Basmati rice", quantity: 1, unit: "cup", ayurvedicTaste: ["sweet"], ayurvedicEffect: "cooling" },
      { name: "Coconut milk", quantity: 0.5, unit: "cup", ayurvedicTaste: ["sweet"], ayurvedicEffect: "cooling" },
      { name: "Fresh coconut", quantity: 0.25, unit: "cup", ayurvedicTaste: ["sweet"], ayurvedicEffect: "cooling" },
      { name: "Curry leaves", quantity: 10, unit: "leaves", ayurvedicTaste: ["bitter"], ayurvedicEffect: "heating" },
      { name: "Green chilies", quantity: 2, unit: "pieces", ayurvedicTaste: ["pungent"], ayurvedicEffect: "heating" },
      { name: "Ginger", quantity: 1, unit: "inch piece", ayurvedicTaste: ["pungent"], ayurvedicEffect: "heating" },
      { name: "Coconut oil", quantity: 2, unit: "tbsp", ayurvedicTaste: ["sweet"], ayurvedicEffect: "cooling" },
      { name: "Mustard seeds", quantity: 1, unit: "tsp", ayurvedicTaste: ["pungent"], ayurvedicEffect: "heating" },
      { name: "Salt", quantity: 1, unit: "tsp", ayurvedicTaste: ["salty"], ayurvedicEffect: "heating" }
    ],
    instructions: [
      "Wash and cook basmati rice until fluffy",
      "Heat coconut oil in a pan",
      "Add mustard seeds and let them splutter",
      "Add curry leaves, green chilies, and ginger",
      "Sauté for 2 minutes",
      "Add cooked rice and mix gently",
      "Add coconut milk and fresh coconut",
      "Season with salt and simmer for 5 minutes",
      "Garnish with fresh curry leaves and serve"
    ],
    cookingTime: 25,
    prepTime: 15,
    difficulty: "medium",
    servings: 4,
    nutritionalInfo: {
      caloriesPerServing: 320,
      protein: 6,
      carbohydrates: 45,
      fat: 14,
      fiber: 2,
      sugar: 3,
      sodium: 600,
      potassium: 200,
      vitamins: { "vitamin C": 15, "folate": 8 },
      minerals: { manganese: 88, selenium: 19 }
    },
    ayurvedicProperties: {
      rasa: ["sweet", "pungent"],
      virya: "cooling",
      vipaka: "sweet",
      doshaEffect: {
        vata: "neutral",
        pitta: "decrease",
        kapha: "increase"
      },
      seasonalSuitability: ["summer", "monsoon"],
      therapeuticUses: ["Cooling effect", "Easy digestion", "Calms Pitta dosha"],
      contraindications: ["High Kapha conditions", "Cold weather"]
    },
    tags: ["cooling", "light", "vegetarian", "south-indian"],
    images: ["/images/recipes/coconut-rice.jpg"],
    author: "Traditional South Indian Recipe",
    ratings: [],
    averageRating: 0,
    totalRatings: 0,
    isVegetarian: true,
    isVegan: true,
    isDairyFree: true,
    isGlutenFree: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    isAIGenerated: false
  },
  {
    id: "recipe-3",
    name: "Kapha Reducing Spiced Millet Porridge",
    description: "Light and warming millet porridge with metabolism-boosting spices",
    category: "breakfast",
    mealType: ["breakfast"],
    constitution: ["kapha", "tridoshic"],
    ingredients: [
      { name: "Pearl millet", quantity: 0.5, unit: "cup", ayurvedicTaste: ["sweet"], ayurvedicEffect: "heating" },
      { name: "Water", quantity: 2, unit: "cups" },
      { name: "Ginger", quantity: 1, unit: "inch piece", ayurvedicTaste: ["pungent"], ayurvedicEffect: "heating" },
      { name: "Black pepper", quantity: 0.25, unit: "tsp", ayurvedicTaste: ["pungent"], ayurvedicEffect: "heating" },
      { name: "Cinnamon", quantity: 0.5, unit: "tsp", ayurvedicTaste: ["pungent", "sweet"], ayurvedicEffect: "heating" },
      { name: "Cloves", quantity: 3, unit: "pieces", ayurvedicTaste: ["pungent"], ayurvedicEffect: "heating" },
      { name: "Jaggery", quantity: 2, unit: "tbsp", ayurvedicTaste: ["sweet"], ayurvedicEffect: "heating" },
      { name: "Ghee", quantity: 1, unit: "tsp", ayurvedicTaste: ["sweet"], ayurvedicEffect: "cooling" },
      { name: "Almonds", quantity: 8, unit: "pieces", ayurvedicTaste: ["sweet"], ayurvedicEffect: "heating" }
    ],
    instructions: [
      "Dry roast millet until aromatic",
      "Boil water with ginger, cinnamon, and cloves",
      "Add roasted millet and cook for 20 minutes",
      "Stir in jaggery and black pepper",
      "Add soaked and chopped almonds",
      "Finish with ghee",
      "Serve hot"
    ],
    cookingTime: 30,
    prepTime: 10,
    difficulty: "easy",
    servings: 2,
    nutritionalInfo: {
      caloriesPerServing: 280,
      protein: 8,
      carbohydrates: 52,
      fat: 6,
      fiber: 5,
      sugar: 18,
      sodium: 5,
      potassium: 280,
      vitamins: { "vitamin E": 26, "niacin": 15 },
      minerals: { magnesium: 114, phosphorus: 174 }
    },
    ayurvedicProperties: {
      rasa: ["sweet", "pungent"],
      virya: "heating",
      vipaka: "pungent",
      doshaEffect: {
        vata: "decrease",
        pitta: "increase",
        kapha: "decrease"
      },
      seasonalSuitability: ["winter", "late-winter", "monsoon"],
      therapeuticUses: ["Improves metabolism", "Reduces Kapha", "Provides energy", "Easy to digest"],
      contraindications: ["High Pitta conditions", "Summer season"]
    },
    tags: ["warming", "energizing", "gluten-free", "metabolism-boosting"],
    images: ["/images/recipes/millet-porridge.jpg"],
    author: "Traditional Ayurvedic Recipe",
    ratings: [],
    averageRating: 0,
    totalRatings: 0,
    isVegetarian: true,
    isVegan: false,
    isDairyFree: true,
    isGlutenFree: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    isAIGenerated: false
  }
]

export const createRecipe = (recipeData: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt' | 'ratings' | 'averageRating' | 'totalRatings'>): Recipe => {
  const newRecipe: Recipe = {
    ...recipeData,
    id: generateId(),
    ratings: [],
    averageRating: 0,
    totalRatings: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  saveRecipe(newRecipe)
  return newRecipe
}

// Initialize sample data if not exists
if (typeof window !== "undefined" && !localStorage.getItem(RECIPES_KEY)) {
  getSampleRecipes().forEach(recipe => saveRecipe(recipe))
}
