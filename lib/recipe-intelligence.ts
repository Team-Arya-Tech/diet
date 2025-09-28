import { EnhancedFood, EnhancedFoodDatabase } from './enhanced-food-database'
import { EnhancedPatient } from './enhanced-patient-management'
import { SixTastesAnalyzer, TasteAnalysis } from './six-tastes-analyzer'
import { SeasonalContext } from './seasonal-diet-adaptation'

export interface RecipeIngredient {
  id: string
  name: string
  food?: EnhancedFood
  quantity: number
  unit: string
  notes?: string
  ayurvedicRole?: 'main' | 'spice' | 'garnish' | 'base'
  preparation?: string
  optional?: boolean
}

export interface CookingStep {
  stepNumber: number
  instruction: string
  duration?: number
  temperature?: string
  ayurvedicTip?: string
}

export interface AyurvedicCookingGuideline {
  principle: string
  description: string
  benefits: string[]
  application: string
}

export interface Recipe {
  id: string
  name: string
  description: string
  cuisine: string
  category: 'breakfast' | 'lunch' | 'dinner' | 'snacks' | 'beverage'
  
  // Ingredients
  ingredients: RecipeIngredient[]
  
  // Instructions
  cookingSteps: CookingStep[]
  
  // Timing
  prepTime: number // minutes
  cookTime: number // minutes
  totalTime: number
  servings: number
  
  // Difficulty
  difficulty: 'easy' | 'medium' | 'hard'
  skillsRequired: string[]
  
  // Ayurvedic Properties
  ayurvedicProperties: {
    primaryRasa: string[]
    secondaryRasa: string[]
    virya: 'heating' | 'cooling' | 'neutral'
    vipaka: 'sweet' | 'sour' | 'pungent'
    doshaEffect: {
      vata: 'increases' | 'decreases' | 'balances' | 'neutral'
      pitta: 'increases' | 'decreases' | 'balances' | 'neutral'
      kapha: 'increases' | 'decreases' | 'balances' | 'neutral'
    }
    constitution: string[]
    season: string[]
    timeOfDay: string[]
    digestibility: 'easy' | 'moderate' | 'heavy'
  }
  
  // Calculated Nutrition
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
  
  // Ayurvedic Guidelines
  ayurvedicGuidelines: AyurvedicCookingGuideline[]
  
  // Recipe Variations
  variations?: {
    name: string
    changes: string[]
    ayurvedicBenefit: string
  }[]
  
  // Tags and metadata
  tags: string[]
  healthBenefits: string[]
  contraindications?: string[]
  
  // Recipe source
  source: 'traditional' | 'modern' | 'fusion'
  region?: string
}

// Sample comprehensive recipes database
const recipesDatabase: Recipe[] = [
  {
    id: "recipe-001",
    name: "Ayurvedic Golden Milk Khichdi",
    description: "A healing one-pot meal combining rice, lentils with turmeric and warming spices - perfect for all constitutions",
    cuisine: "indian",
    category: "lunch",
    
    ingredients: [
      {
        id: "rice-basmati",
        name: "Basmati Rice",
        quantity: 0.5,
        unit: "cup",
        ayurvedicRole: "base",
        notes: "Aged basmati preferred for better digestibility"
      },
      {
        id: "moong-dal",
        name: "Split Yellow Moong Dal",
        quantity: 0.25,
        unit: "cup",
        ayurvedicRole: "main",
        notes: "Pre-soaked for 30 minutes"
      },
      {
        id: "ghee",
        name: "Pure Cow Ghee",
        quantity: 1,
        unit: "tbsp",
        ayurvedicRole: "base",
        notes: "Organic, grass-fed ghee preferred"
      },
      {
        id: "turmeric",
        name: "Turmeric Powder",
        quantity: 0.5,
        unit: "tsp",
        ayurvedicRole: "spice",
        notes: "Fresh turmeric can be used (1 inch piece)"
      },
      {
        id: "cumin-seeds",
        name: "Cumin Seeds",
        quantity: 0.5,
        unit: "tsp",
        ayurvedicRole: "spice"
      },
      {
        id: "ginger",
        name: "Fresh Ginger",
        quantity: 1,
        unit: "inch piece",
        ayurvedicRole: "spice",
        notes: "Finely minced"
      },
      {
        id: "rock-salt",
        name: "Rock Salt (Sendha Namak)",
        quantity: 0.5,
        unit: "tsp",
        ayurvedicRole: "spice",
        notes: "Adjust to taste"
      },
      {
        id: "water",
        name: "Filtered Water",
        quantity: 3,
        unit: "cups",
        ayurvedicRole: "base"
      }
    ],
    
    cookingSteps: [
      {
        stepNumber: 1,
        instruction: "Wash basmati rice and moong dal together until water runs clear. Soak for 15 minutes.",
        duration: 5,
        ayurvedicTip: "Washing removes excess starch and makes grains lighter for digestion"
      },
      {
        stepNumber: 2,
        instruction: "Heat ghee in a heavy-bottomed pot or pressure cooker over medium heat.",
        duration: 2,
        ayurvedicTip: "Ghee should be warm but not smoking to preserve its medicinal properties"
      },
      {
        stepNumber: 3,
        instruction: "Add cumin seeds and let them splutter. Add minced ginger and sauté for 30 seconds.",
        duration: 1,
        ayurvedicTip: "Tempering spices in ghee releases their essential oils and improves digestibility"
      },
      {
        stepNumber: 4,
        instruction: "Add turmeric powder and stir quickly to avoid burning. Add drained rice and dal.",
        duration: 1,
        ayurvedicTip: "Turmeric should be added carefully as it can become bitter if overheated"
      },
      {
        stepNumber: 5,
        instruction: "Sauté rice and dal for 2-3 minutes until grains are well-coated with ghee and spices.",
        duration: 3,
        ayurvedicTip: "This step helps seal the grains and prevents them from becoming mushy"
      },
      {
        stepNumber: 6,
        instruction: "Add water and rock salt. Bring to a boil, then reduce heat to low and cover.",
        duration: 5,
        ayurvedicTip: "Using the right water-to-grain ratio ensures proper texture and digestibility"
      },
      {
        stepNumber: 7,
        instruction: "Cook for 15-20 minutes until rice and dal are soft and well-cooked. Stir occasionally.",
        duration: 20,
        ayurvedicTip: "Low, slow cooking preserves prana (life energy) in the food"
      },
      {
        stepNumber: 8,
        instruction: "Let rest for 5 minutes before serving. Garnish with fresh cilantro if desired.",
        duration: 5,
        ayurvedicTip: "Resting allows flavors to meld and makes the dish easier to digest"
      }
    ],
    
    prepTime: 20,
    cookTime: 25,
    totalTime: 45,
    servings: 2,
    difficulty: "easy",
    skillsRequired: ["Basic knife skills", "Stovetop cooking"],
    
    ayurvedicProperties: {
      primaryRasa: ["sweet"],
      secondaryRasa: ["astringent"],
      virya: "heating",
      vipaka: "sweet",
      doshaEffect: {
        vata: "balances",
        pitta: "neutral",
        kapha: "balances"
      },
      constitution: ["vata", "kapha", "tridoshic"],
      season: ["winter", "monsoon", "spring"],
      timeOfDay: ["noon", "evening"],
      digestibility: "easy"
    },
    
    nutritionalInfo: {
      caloriesPerServing: 280,
      protein: 10,
      carbohydrates: 45,
      fat: 8,
      fiber: 4,
      sugar: 2,
      sodium: 350,
      potassium: 280,
      calcium: 40,
      iron: 2.5,
      vitamins: {
        "vitaminB1": 0.2,
        "folate": 45,
        "vitaminE": 1.2
      }
    },
    
    ayurvedicGuidelines: [
      {
        principle: "Agni Enhancement",
        description: "The combination of ghee, ginger, and cumin kindles digestive fire",
        benefits: ["Improves metabolism", "Reduces bloating", "Enhances nutrient absorption"],
        application: "Eat when hungry, avoid overeating"
      },
      {
        principle: "Tridoshic Balance",
        description: "This recipe balances all three doshas when prepared correctly",
        benefits: ["Suitable for daily consumption", "Promotes harmony", "Builds ojas (vitality)"],
        application: "Can be eaten by all constitutions in appropriate quantities"
      },
      {
        principle: "Sattvic Cooking",
        description: "Prepared with pure ingredients and positive intention",
        benefits: ["Promotes mental clarity", "Increases spiritual awareness", "Nourishes deeply"],
        application: "Cook with love and awareness, eat in peaceful environment"
      }
    ],
    
    variations: [
      {
        name: "Pitta-Pacifying Version",
        changes: ["Reduce ginger by half", "Add 1 tsp coconut oil", "Use sweet spices like fennel"],
        ayurvedicBenefit: "More cooling for pitta constitution"
      },
      {
        name: "Kapha-Reducing Version",
        changes: ["Add pinch of black pepper", "Include 1 tsp mustard seeds", "Reduce ghee slightly"],
        ayurvedicBenefit: "More stimulating for kapha constitution"
      }
    ],
    
    tags: ["comfort-food", "healing", "easy-digest", "one-pot", "protein-rich"],
    healthBenefits: [
      "Supports digestive health",
      "Provides complete protein",
      "Anti-inflammatory properties",
      "Boosts immunity",
      "Calms nervous system"
    ],
    
    source: "traditional",
    region: "North India"
  },
  
  {
    id: "recipe-002",
    name: "Ayurvedic Spiced Oatmeal with Almonds",
    description: "A warming breakfast that combines western oats with Ayurvedic spices for optimal digestion and nourishment",
    cuisine: "fusion",
    category: "breakfast",
    
    ingredients: [
      {
        id: "rolled-oats",
        name: "Organic Rolled Oats",
        quantity: 0.5,
        unit: "cup",
        ayurvedicRole: "base"
      },
      {
        id: "almond-milk",
        name: "Fresh Almond Milk",
        quantity: 1,
        unit: "cup",
        ayurvedicRole: "base",
        notes: "Homemade preferred, or unsweetened store-bought"
      },
      {
        id: "almonds",
        name: "Soaked Almonds",
        quantity: 6,
        unit: "pieces",
        ayurvedicRole: "main",
        notes: "Soaked overnight and peeled"
      },
      {
        id: "dates",
        name: "Medjool Dates",
        quantity: 2,
        unit: "pieces",
        ayurvedicRole: "main",
        notes: "Pitted and chopped"
      },
      {
        id: "cardamom",
        name: "Green Cardamom Powder",
        quantity: 0.25,
        unit: "tsp",
        ayurvedicRole: "spice"
      },
      {
        id: "cinnamon",
        name: "Ceylon Cinnamon Powder",
        quantity: 0.25,
        unit: "tsp",
        ayurvedicRole: "spice"
      },
      {
        id: "ghee",
        name: "Ghee",
        quantity: 1,
        unit: "tsp",
        ayurvedicRole: "base"
      }
    ],
    
    cookingSteps: [
      {
        stepNumber: 1,
        instruction: "Soak almonds overnight. In the morning, peel and roughly chop them.",
        duration: 5,
        ayurvedicTip: "Soaking almonds removes tannins and makes them easier to digest"
      },
      {
        stepNumber: 2,
        instruction: "Warm almond milk gently in a saucepan - do not boil.",
        duration: 3,
        ayurvedicTip: "Gentle heating preserves the nutritional quality of almond milk"
      },
      {
        stepNumber: 3,
        instruction: "Add oats to warm milk and cook on low heat for 5-7 minutes, stirring frequently.",
        duration: 7,
        ayurvedicTip: "Slow cooking makes oats more digestible and creamy"
      },
      {
        stepNumber: 4,
        instruction: "Add chopped dates, cardamom, and cinnamon. Continue cooking for 2-3 minutes.",
        duration: 3,
        ayurvedicTip: "Spices aid digestion and dates provide natural sweetness"
      },
      {
        stepNumber: 5,
        instruction: "Remove from heat and stir in ghee. Top with chopped almonds.",
        duration: 1,
        ayurvedicTip: "Adding ghee at the end preserves its beneficial properties"
      },
      {
        stepNumber: 6,
        instruction: "Serve warm immediately. Can be garnished with a pinch of saffron if desired.",
        duration: 1,
        ayurvedicTip: "Eating warm food supports digestive fire (agni)"
      }
    ],
    
    prepTime: 10,
    cookTime: 15,
    totalTime: 25,
    servings: 1,
    difficulty: "easy",
    skillsRequired: ["Basic stovetop cooking"],
    
    ayurvedicProperties: {
      primaryRasa: ["sweet"],
      secondaryRasa: ["astringent"],
      virya: "heating",
      vipaka: "sweet",
      doshaEffect: {
        vata: "balances",
        pitta: "neutral",
        kapha: "increases"
      },
      constitution: ["vata", "pitta"],
      season: ["winter", "spring", "autumn"],
      timeOfDay: ["morning"],
      digestibility: "easy"
    },
    
    nutritionalInfo: {
      caloriesPerServing: 350,
      protein: 12,
      carbohydrates: 45,
      fat: 14,
      fiber: 8,
      sugar: 18,
      sodium: 100,
      potassium: 400,
      calcium: 200,
      iron: 3,
      vitamins: {
        "vitaminE": 8,
        "vitaminB1": 0.4,
        "vitaminB6": 0.2,
        "magnesium": 80
      }
    },
    
    ayurvedicGuidelines: [
      {
        principle: "Morning Nourishment",
        description: "Provides sustained energy without being too heavy for morning digestion",
        benefits: ["Steady blood sugar", "Mental clarity", "Digestive strength"],
        application: "Best eaten between 7-9 AM when digestive fire is awakening"
      },
      {
        principle: "Ojas Building",
        description: "Combination of nuts, dates, and spices builds vital essence",
        benefits: ["Increases immunity", "Enhances vitality", "Promotes longevity"],
        application: "Regular consumption supports overall health and vigor"
      }
    ],
    
    variations: [
      {
        name: "Kapha-Reducing Version",
        changes: ["Use water instead of almond milk", "Add ginger powder", "Reduce dates to 1"],
        ayurvedicBenefit: "Lighter and more stimulating for kapha types"
      }
    ],
    
    tags: ["breakfast", "nourishing", "easy-digest", "protein-rich", "warming"],
    healthBenefits: [
      "Heart healthy",
      "Brain food",
      "Sustained energy",
      "High fiber",
      "Antioxidant rich"
    ],
    
    source: "fusion",
    region: "Global Ayurvedic"
  }
]

// Nutritional calculation functions
export function calculateRecipeNutrition(recipe: Recipe): Recipe['nutritionalInfo'] {
  // This would ideally connect to a nutritional database
  // For now, we'll use the pre-calculated values
  return recipe.nutritionalInfo
}

export function getRecipesByCategory(category: Recipe['category']): Recipe[] {
  return recipesDatabase.filter(recipe => recipe.category === category)
}

export function getRecipesByConstitution(constitution: string): Recipe[] {
  return recipesDatabase.filter(recipe => 
    recipe.ayurvedicProperties.constitution.includes(constitution) ||
    recipe.ayurvedicProperties.constitution.includes('tridoshic')
  )
}

export function getRecipesBySeason(season: string): Recipe[] {
  return recipesDatabase.filter(recipe => 
    recipe.ayurvedicProperties.season.includes(season.toLowerCase())
  )
}

export function searchRecipes(
  query: string = '',
  filters: {
    category?: Recipe['category']
    constitution?: string
    season?: string
    difficulty?: Recipe['difficulty']
    maxPrepTime?: number
    cuisine?: string
  } = {}
): Recipe[] {
  let results = recipesDatabase

  // Text search
  if (query) {
    results = results.filter(recipe =>
      recipe.name.toLowerCase().includes(query.toLowerCase()) ||
      recipe.description.toLowerCase().includes(query.toLowerCase()) ||
      recipe.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    )
  }

  // Apply filters
  if (filters.category) {
    results = results.filter(recipe => recipe.category === filters.category)
  }

  if (filters.constitution) {
    results = results.filter(recipe => 
      recipe.ayurvedicProperties.constitution.includes(filters.constitution!) ||
      recipe.ayurvedicProperties.constitution.includes('tridoshic')
    )
  }

  if (filters.season) {
    results = results.filter(recipe => 
      recipe.ayurvedicProperties.season.includes(filters.season!.toLowerCase())
    )
  }

  if (filters.difficulty) {
    results = results.filter(recipe => recipe.difficulty === filters.difficulty)
  }

  if (filters.maxPrepTime) {
    results = results.filter(recipe => recipe.totalTime <= filters.maxPrepTime!)
  }

  if (filters.cuisine) {
    results = results.filter(recipe => recipe.cuisine === filters.cuisine)
  }

  return results
}

export function getRecipeById(id: string): Recipe | undefined {
  return recipesDatabase.find(recipe => recipe.id === id)
}

export function getAllRecipes(): Recipe[] {
  return recipesDatabase
}

// Ayurvedic cooking tips and guidelines
export const ayurvedicCookingPrinciples = {
  generalPrinciples: [
    {
      title: "Cook with Love and Awareness",
      description: "The consciousness of the cook enters the food. Cook with positive emotions and full attention.",
      practical: "Take deep breaths before cooking, set positive intentions, avoid cooking when angry or stressed"
    },
    {
      title: "Use Fresh, Seasonal Ingredients",
      description: "Fresh foods carry more prana (life energy) and seasonal foods naturally balance the doshas.",
      practical: "Shop at local farmers markets, use ingredients within 2-3 days of purchase"
    },
    {
      title: "Proper Food Combining",
      description: "Certain food combinations can be difficult to digest and create toxins (ama).",
      practical: "Avoid combining milk with sour or salty foods, don't mix fruits with meals"
    },
    {
      title: "Mindful Eating Environment",
      description: "The environment affects digestion. Eat in calm, clean surroundings.",
      practical: "Sit down to eat, avoid distractions like TV, eat in silence or with pleasant conversation"
    }
  ],
  
  cookingTechniques: [
    {
      technique: "Tempering (Tadka)",
      description: "Heating spices in ghee or oil to release essential oils and improve digestibility",
      ayurvedicBenefit: "Enhances bioavailability of nutrients and stimulates digestive fire",
      method: "Heat ghee, add whole spices, let them splutter, then add to dish"
    },
    {
      technique: "Slow Cooking",
      description: "Gentle, prolonged cooking preserves nutrients and life energy",
      ayurvedicBenefit: "Creates food that is easy to digest and assimilate",
      method: "Use low heat, allow sufficient time, avoid rushing the process"
    },
    {
      technique: "Proper Seasoning",
      description: "Using the six tastes in appropriate proportions for balance",
      ayurvedicBenefit: "Satisfies all doshas and prevents cravings",
      method: "Include sweet, sour, salty, pungent, bitter, and astringent tastes"
    }
  ],
  
  seasonalGuidelines: {
    spring: {
      focus: "Detoxification and lightening",
      ingredients: ["Leafy greens", "Sprouts", "Light grains", "Warming spices"],
      cookingMethods: ["Steaming", "Light sautéing", "Raw preparations"],
      avoid: ["Heavy, oily foods", "Excessive dairy", "Cold foods"]
    },
    summer: {
      focus: "Cooling and hydrating",
      ingredients: ["Cooling herbs", "Sweet fruits", "Coconut", "Cucumber"],
      cookingMethods: ["Minimal cooking", "Room temperature dishes", "Cooling preparations"],
      avoid: ["Excessive heat", "Spicy foods", "Heavy meals"]
    },
    autumn: {
      focus: "Grounding and warming",
      ingredients: ["Root vegetables", "Warming spices", "Nourishing grains", "Nuts"],
      cookingMethods: ["Roasting", "Slow cooking", "Warming preparations"],
      avoid: ["Raw foods", "Cold drinks", "Light meals"]
    },
    winter: {
      focus: "Warming and nourishing",
      ingredients: ["Hearty grains", "Warming spices", "Healthy fats", "Cooked foods"],
      cookingMethods: ["Long cooking", "Warming spices", "Nourishing preparations"],
      avoid: ["Cold foods", "Raw foods", "Light meals"]
    }
  }
}

// Enhanced Recipe Intelligence Engine

export interface MealPlan {
  id: string
  patientId: string
  startDate: Date
  endDate: Date
  name: string
  description: string
  
  meals: {
    [date: string]: {
      breakfast: Recipe[]
      lunch: Recipe[]
      dinner: Recipe[]
      snacks: Recipe[]
    }
  }
  
  weeklyGoals: {
    nutritional: { [key: string]: number }
    ayurvedic: string[]
    lifestyle: string[]
  }
  
  shoppingList: {
    ingredient: string
    quantity: number
    unit: string
    category: string
    priority: 'essential' | 'recommended' | 'optional'
  }[]
  
  adherence?: {
    date: string
    meal: string
    followed: boolean
    modifications: string[]
    rating: number
  }[]
}

export interface RecipeRecommendationCriteria {
  patient: EnhancedPatient
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks'
  seasonalContext: SeasonalContext
  preferences: {
    cuisine?: string[]
    cookingTime?: number
    difficulty?: Recipe['difficulty']
    avoidIngredients?: string[]
    emphasizeIngredients?: string[]
  }
  therapeuticGoals?: string[]
  previousMeals?: Recipe[]
}

export class RecipeIntelligenceEngine {
  private static mealPlans: MealPlan[] = []

  // Enhanced Recipe Generation
  static generatePersonalizedRecipe(criteria: RecipeRecommendationCriteria): Recipe {
    const { patient, mealType, seasonalContext, preferences, therapeuticGoals } = criteria
    
    // Get suitable base recipe
    const baseRecipe = this.findBestBaseRecipe(patient, mealType, seasonalContext)
    
    // Personalize the recipe
    const personalizedRecipe = this.personalizeRecipe(baseRecipe, patient, therapeuticGoals || [])
    
    return personalizedRecipe
  }

  private static findBestBaseRecipe(
    patient: EnhancedPatient,
    mealType: string,
    seasonalContext: SeasonalContext
  ): Recipe {
    let suitableRecipes = recipesDatabase.filter(recipe => {
      // Match meal type
      if (recipe.category !== mealType) return false
      
      // Check constitution compatibility
      const constitutionMatch = recipe.ayurvedicProperties.constitution.includes(patient.constitution) ||
                              recipe.ayurvedicProperties.constitution.includes('tridoshic')
      if (!constitutionMatch) return false
      
      // Check seasonal appropriateness
      const seasonMatch = recipe.ayurvedicProperties.season.includes(seasonalContext.season) ||
                         recipe.ayurvedicProperties.season.includes('all')
      if (!seasonMatch) return false
      
      return true
    })
    
    // If no perfect matches, use more flexible criteria
    if (suitableRecipes.length === 0) {
      suitableRecipes = recipesDatabase.filter(recipe => recipe.category === mealType)
    }
    
    // Return the most suitable recipe (first match for now)
    return suitableRecipes[0] || recipesDatabase[0]
  }

  private static personalizeRecipe(
    baseRecipe: Recipe,
    patient: EnhancedPatient,
    therapeuticGoals: string[]
  ): Recipe {
    const personalizedRecipe = { ...baseRecipe }
    
    // Add personalized modifications based on patient needs
    const modifications = this.generatePersonalizedModifications(patient, therapeuticGoals)
    
    if (modifications.length > 0) {
      personalizedRecipe.variations = personalizedRecipe.variations || []
      personalizedRecipe.variations.push({
        name: `Personalized for ${patient.name}`,
        changes: modifications,
        ayurvedicBenefit: `Customized for ${patient.constitution} constitution and current health goals`
      })
    }
    
    return personalizedRecipe
  }

  private static generatePersonalizedModifications(
    patient: EnhancedPatient,
    therapeuticGoals: string[]
  ): string[] {
    const modifications = []
    
    // Constitution-based modifications
    if (patient.constitution.includes('vata')) {
      modifications.push('Add extra ghee for grounding')
      modifications.push('Include warming spices like ginger')
    }
    if (patient.constitution.includes('pitta')) {
      modifications.push('Reduce heating spices')
      modifications.push('Add cooling herbs like cilantro')
    }
    if (patient.constitution.includes('kapha')) {
      modifications.push('Add stimulating spices like black pepper')
      modifications.push('Reduce heavy ingredients')
    }
    
    // Health goal modifications
    therapeuticGoals.forEach(goal => {
      switch (goal.toLowerCase()) {
        case 'weight loss':
          modifications.push('Reduce oil content')
          modifications.push('Add metabolism-boosting spices')
          break
        case 'digestion':
          modifications.push('Add digestive spices like cumin')
          modifications.push('Cook ingredients thoroughly')
          break
        case 'immunity':
          modifications.push('Add turmeric and ginger')
          modifications.push('Include antioxidant-rich ingredients')
          break
      }
    })
    
    // Symptom-based modifications
    if (patient.currentSymptoms.includes('acidity')) {
      modifications.push('Avoid sour and spicy ingredients')
      modifications.push('Add cooling ingredients')
    }
    if (patient.currentSymptoms.includes('bloating')) {
      modifications.push('Add digestive spices')
      modifications.push('Avoid heavy combinations')
    }
    
    return modifications
  }

  // Meal Planning Intelligence
  static generateWeeklyMealPlan(
    patient: EnhancedPatient,
    seasonalContext: SeasonalContext,
    preferences: any = {}
  ): MealPlan {
    const startDate = new Date()
    const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000)
    
    const mealPlan: MealPlan = {
      id: `meal_plan_${patient.id}_${Date.now()}`,
      patientId: patient.id,
      startDate,
      endDate,
      name: `Weekly Ayurvedic Meal Plan for ${patient.name}`,
      description: `Personalized weekly meal plan based on ${patient.constitution} constitution`,
      meals: {},
      weeklyGoals: this.generateWeeklyGoals(patient),
      shoppingList: []
    }
    
    // Generate meals for each day
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000)
      const dateStr = currentDate.toISOString().split('T')[0]
      
      const criteria: RecipeRecommendationCriteria = {
        patient,
        mealType: 'breakfast',
        seasonalContext,
        preferences,
        therapeuticGoals: patient.healthGoals
      }
      
      mealPlan.meals[dateStr] = {
        breakfast: [this.selectMealRecipe({ ...criteria, mealType: 'breakfast' })],
        lunch: [this.selectMealRecipe({ ...criteria, mealType: 'lunch' })],
        dinner: [this.selectMealRecipe({ ...criteria, mealType: 'dinner' })],
        snacks: [this.selectMealRecipe({ ...criteria, mealType: 'snacks' })]
      }
    }
    
    // Generate shopping list
    mealPlan.shoppingList = this.generateShoppingList(mealPlan)
    
    this.saveMealPlan(mealPlan)
    return mealPlan
  }

  private static selectMealRecipe(criteria: RecipeRecommendationCriteria): Recipe {
    const availableRecipes = recipesDatabase.filter(recipe => recipe.category === criteria.mealType)
    
    // Score and select the best recipe
    const scoredRecipes = availableRecipes.map(recipe => ({
      recipe,
      score: this.calculateRecipeScore(recipe, criteria.patient, criteria)
    }))
    
    scoredRecipes.sort((a, b) => b.score - a.score)
    return scoredRecipes[0]?.recipe || availableRecipes[0]
  }

  private static calculateRecipeScore(
    recipe: Recipe,
    patient: EnhancedPatient,
    criteria: RecipeRecommendationCriteria
  ): number {
    let score = 50 // base score
    
    // Constitution compatibility
    if (recipe.ayurvedicProperties.constitution.includes(patient.constitution)) {
      score += 30
    }
    
    // Seasonal appropriateness
    if (recipe.ayurvedicProperties.season.includes(criteria.seasonalContext.season)) {
      score += 20
    }
    
    // Therapeutic alignment
    if (criteria.therapeuticGoals) {
      const alignmentCount = criteria.therapeuticGoals.filter(goal =>
        recipe.healthBenefits.some(benefit =>
          benefit.toLowerCase().includes(goal.toLowerCase())
        )
      ).length
      score += alignmentCount * 10
    }
    
    // Digestive compatibility
    if (patient.digestiveStrength === 'weak' && recipe.ayurvedicProperties.digestibility === 'easy') {
      score += 15
    }
    
    // Preferences
    if (criteria.preferences.difficulty && recipe.difficulty === criteria.preferences.difficulty) {
      score += 10
    }
    
    if (criteria.preferences.cookingTime && recipe.totalTime <= criteria.preferences.cookingTime) {
      score += 10
    }
    
    return Math.max(0, Math.min(100, score))
  }

  private static generateWeeklyGoals(patient: EnhancedPatient) {
    return {
      nutritional: {
        calories: patient.activityLevel === 'very-active' ? 2200 : patient.activityLevel === 'active' ? 2000 : 1800,
        protein: 50,
        fiber: 25,
        vitamins: 100
      },
      ayurvedic: [
        'Balance six tastes daily',
        'Eat according to constitution',
        'Follow seasonal guidelines'
      ],
      lifestyle: [
        'Eat at regular times',
        'Practice mindful eating',
        'Stay hydrated throughout day'
      ]
    }
  }

  private static generateShoppingList(mealPlan: MealPlan) {
    const ingredientCount: { [key: string]: { quantity: number; unit: string; category: string } } = {}
    
    Object.values(mealPlan.meals).forEach(dayMeals => {
      Object.values(dayMeals).forEach(mealRecipes => {
        mealRecipes.forEach(recipe => {
          recipe.ingredients.forEach(ingredient => {
            const key = ingredient.name
            if (ingredientCount[key]) {
              ingredientCount[key].quantity += ingredient.quantity
            } else {
              ingredientCount[key] = {
                quantity: ingredient.quantity,
                unit: ingredient.unit,
                category: ingredient.ayurvedicRole || 'misc'
              }
            }
          })
        })
      })
    })
    
    return Object.entries(ingredientCount).map(([ingredient, data]) => ({
      ingredient,
      quantity: Math.round(data.quantity * 10) / 10,
      unit: data.unit,
      category: data.category,
      priority: data.category === 'spice' ? 'optional' as const : 'essential' as const
    }))
  }

  // Recipe Analysis and Recommendations
  static analyzeRecipeNutrition(recipe: Recipe): {
    tasteBalance: any // Simplified for compatibility
    constitutionalSuitability: { [constitution: string]: number }
    therapeuticProperties: string[]
    recommendations: string[]
  } {
    // This would integrate with the enhanced food database for detailed analysis
    const analysis = {
      tasteBalance: {
        tastes: { sweet: 30, sour: 10, salty: 15, pungent: 20, bitter: 15, astringent: 10 },
        dominantTaste: recipe.ayurvedicProperties.primaryRasa[0] || 'sweet',
        balance: 85,
        recommendations: [
          'Well-balanced across most tastes',
          'Good for daily consumption'
        ]
      },
      constitutionalSuitability: {
        vata: recipe.ayurvedicProperties.constitution.includes('vata') ? 90 : 60,
        pitta: recipe.ayurvedicProperties.constitution.includes('pitta') ? 90 : 60,
        kapha: recipe.ayurvedicProperties.constitution.includes('kapha') ? 90 : 60
      },
      therapeuticProperties: recipe.healthBenefits,
      recommendations: [
        `Best consumed during ${recipe.ayurvedicProperties.timeOfDay.join(' or ')}`,
        `Suitable for ${recipe.ayurvedicProperties.season.join(', ')} seasons`,
        `${recipe.ayurvedicProperties.digestibility} to digest`
      ]
    }
    
    return analysis
  }

  static recommendRecipeModifications(
    recipe: Recipe,
    patient: EnhancedPatient,
    targetGoals: string[]
  ): {
    modifications: string[]
    benefits: string[]
    newNutritionalProfile: Partial<Recipe['nutritionalInfo']>
  } {
    const modifications = this.generatePersonalizedModifications(patient, targetGoals)
    
    return {
      modifications,
      benefits: [
        'Better suited to your constitution',
        'Aligned with your health goals',
        'Optimized digestibility'
      ],
      newNutritionalProfile: {
        // This would calculate based on modifications
        caloriesPerServing: recipe.nutritionalInfo.caloriesPerServing * 0.95,
        protein: recipe.nutritionalInfo.protein * 1.1,
        fiber: recipe.nutritionalInfo.fiber * 1.2
      }
    }
  }

  // Storage and retrieval methods
  private static saveMealPlan(mealPlan: MealPlan): void {
    this.mealPlans.push(mealPlan)
    if (typeof window !== 'undefined') {
      localStorage.setItem('meal_plans', JSON.stringify(this.mealPlans))
    }
  }

  static getAllMealPlans(): MealPlan[] {
    if (typeof window !== 'undefined' && this.mealPlans.length === 0) {
      const stored = localStorage.getItem('meal_plans')
      if (stored) {
        this.mealPlans = JSON.parse(stored)
      }
    }
    return this.mealPlans
  }

  static getMealPlanById(id: string): MealPlan | undefined {
    return this.getAllMealPlans().find(plan => plan.id === id)
  }

  static getMealPlansForPatient(patientId: string): MealPlan[] {
    return this.getAllMealPlans().filter(plan => plan.patientId === patientId)
  }
}

export { recipesDatabase }
