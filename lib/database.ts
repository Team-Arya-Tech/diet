// Local storage database utilities for Ayurvedic diet management
import { getAllFoods, getAllCategories } from "./ayurvedic-data"
import { getRecipes as getRecipesFromDB } from "./recipe-database"
import intelligentDietPlans from "../data/intelligent-diet-plans.json"

// Patient interface with comprehensive health data
export interface Patient {
  id: string
  name: string
  age: number
  gender: "male" | "female" | "other"
  weight: number
  height: number
  bmi?: number
  constitution: "vata" | "pitta" | "kapha" | "vata-pitta" | "pitta-kapha" | "vata-kapha" | "tridoshic"
  currentConditions: string[]
  dietaryRestrictions: string[]
  allergies?: string[]
  lifestyle: {
    activityLevel: "sedentary" | "moderate" | "active" | "very-active"
    sleepHours: number
    stressLevel: "low" | "moderate" | "high"
    waterIntake: number // liters per day
    mealTiming: string
    bowelMovements?: "regular" | "irregular" | "constipated" | "loose"
    exerciseRoutine?: string
  }
  medicalHistory: string[]
  occupation: string
  contactInfo?: {
    phone?: string
    email?: string
    address?: string
  }
  emergencyContact?: {
    name?: string
    phone?: string
    relation?: string
  }
  assessmentDate?: Date
  createdAt: Date
  updatedAt: Date
}

// Enhanced nutrition data interface
export interface NutritionData {
  calories: number
  protein: number // grams
  carbohydrates: number // grams
  fat: number // grams
  fiber: number // grams
  sugar: number // grams
  sodium: number // mg
  calcium: number // mg
  iron: number // mg
  vitaminC: number // mg
  vitaminD: number // IU
  vitaminB12: number // mcg
  omega3: number // mg
}

// Recipe interface with complete data
export interface Recipe {
  id: string
  name: string
  description: string
  category: "breakfast" | "lunch" | "dinner" | "snack" | "beverage" | "dessert"
  cuisineType: "indian" | "continental" | "chinese" | "mediterranean" | "other"
  ingredients: {
    food: string
    quantity: number
    unit: string
    ayurvedicProperties?: AyurvedicFood
  }[]
  instructions: string[]
  prepTime: number // minutes
  cookTime: number // minutes
  servings: number
  nutrition: NutritionData
  ayurvedicProperties: {
    dosha: "vata" | "pitta" | "kapha" | "tridoshic"
    rasa: string[] // tastes
    effect: "heating" | "cooling" | "neutral"
    season: "spring" | "summer" | "autumn" | "winter" | "all"
    timeOfDay: "morning" | "noon" | "evening" | "night" | "anytime"
  }
  difficulty: "easy" | "medium" | "hard"
  tags: string[]
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

// Meal plan interface for comprehensive planning
export interface MealPlan {
  id: string
  name: string
  description: string
  duration: number // days
  targetCalories: number
  macroTargets: {
    proteinPercent: number
    carbPercent: number
    fatPercent: number
  }
  dailyMeals: {
    [day: number]: {
      breakfast: string[] // recipe IDs
      midMorning?: string[]
      lunch: string[]
      midAfternoon?: string[]
      dinner: string[]
      bedtime?: string[]
    }
  }
  ayurvedicFocus: {
    constitution: string
    seasonalAdaptation: boolean
    conditions: string[]
  }
  createdAt: Date
  updatedAt: Date
}

// Enhanced Diet Plan interface
export interface DietPlan {
  id: string
  patientId: string
  planName: string
  description: string
  duration: number // days
  startDate: Date
  endDate?: Date
  targetCalories: number
  objectives: string[] // weight loss, diabetes management, etc.
  mealPlanId?: string // reference to MealPlan
  dailyMeals: {
    [day: number]: {
      breakfast: {
        recipes: string[] // recipe IDs
        alternatives?: string[]
        notes?: string
      }
      midMorning?: {
        recipes: string[]
        alternatives?: string[]
        notes?: string
      }
      lunch: {
        recipes: string[]
        alternatives?: string[]
        notes?: string
      }
      midAfternoon?: {
        recipes: string[]
        alternatives?: string[]
        notes?: string
      }
      dinner: {
        recipes: string[]
        alternatives?: string[]
        notes?: string
      }
      bedtime?: {
        recipes: string[]
        alternatives?: string[]
        notes?: string
      }
    }
  }
  restrictions: string[]
  recommendations: string[]
  ayurvedicGuidelines: {
    constitutionFocus: string
    seasonalAdaptations: string[]
    lifestyleRecommendations: string[]
    herbs: string[]
  }
  progress: {
    adherence: number // percentage
    weightChange: number
    symptomsImprovement: string[]
    notes: string[]
  }
  createdBy: string
  createdAt: Date
  updatedAt: Date
  isActive: boolean
}

// Consultation interface for tracking patient consultations
export interface Consultation {
  id: string
  patientId: string
  date: Date
  consultationType: "initial" | "follow-up" | "review" | "emergency"
  chiefComplaint: string
  symptoms: string[]
  assessmentFindings: {
    constitution: string
    imbalances: string[]
    pulse: string
    tongue: string
    digestion: string
    sleep: string
    energy: string
  }
  recommendations: {
    dietaryChanges: string[]
    lifestyle: string[]
    herbalRemedies: string[]
    therapies: string[]
  }
  prescriptions?: {
    medicine: string
    dosage: string
    duration: string
    instructions: string
  }[]
  followUpDate?: Date
  notes: string
  consultantId: string
  createdAt: Date
  updatedAt: Date
}

// Progress tracking interface
export interface PatientProgress {
  id: string
  patientId: string
  date: Date
  weight: number
  bmi: number
  vitalSigns: {
    bloodPressure?: string
    pulse?: number
    temperature?: number
  }
  symptoms: {
    improved: string[]
    worsened: string[]
    new: string[]
  }
  dietAdherence: number // percentage
  lifestyleAdherence: number // percentage
  overallWellbeing: number // 1-10 scale
  notes: string
  nextGoals: string[]
  createdBy: string
  createdAt: Date
}

// Enhanced Ayurvedic Food interface matching JSON structure
export interface AyurvedicFood {
  Food: string
  Rasa: string // taste (sweet, sour, salty, pungent, bitter, astringent)
  Guna: string // quality (heavy, light, oily, dry, hot, cold, etc.)
  Veerya: string // potency (hot, cold, warm, cool, neutral)
  Vipaka: string // post-digestive effect (sweet, sour, pungent)
  "Dosha Effect": string // effect on doshas
  Digestibility: string // easy, moderate, difficult
  Pathya: string // beneficial for (conditions)
  Apathya: string // contraindicated for (conditions)
}

// Extended food interface for internal use with additional metadata
export interface ExtendedAyurvedicFood extends AyurvedicFood {
  id?: string
  category?: string // vegetable, fruit, grain, spice, herb, etc.
  season?: string[] // best seasons for consumption
  nutrition?: NutritionData // optional nutritional information
  commonNames?: string[] // alternative names
  botanicalName?: string // scientific name for herbs
  isOrganic?: boolean
  region?: string[] // geographical regions where commonly used
}

// Intelligent Diet Plan Template Interface
export interface IntelligentDietPlanTemplate {
  id: string
  constitution: string
  conditions: string[]
  ageRange: [number, number]
  season: string
  planName: string
  description: string
  duration: number
  targetCalories: number
  objectives: string[]
  dailyMeals: {
    breakfast: {
      foods: string[]
      timing: string
      ayurvedicNotes: string
    }
    midMorning?: {
      foods: string[]
      timing: string
      ayurvedicNotes: string
    }
    lunch: {
      foods: string[]
      timing: string
      ayurvedicNotes: string
    }
    midAfternoon?: {
      foods: string[]
      timing: string
      ayurvedicNotes: string
    }
    dinner: {
      foods: string[]
      timing: string
      ayurvedicNotes: string
    }
  }
  restrictions: string[]
  lifestyle: {
    sleepTime: string
    wakeTime: string
    exercise: string
    meditation: string
  }
}

// Food analysis and search interface
export interface FoodSearchResult {
  food: AyurvedicFood
  score: number // relevance score
  matchedFields: string[] // which fields matched the search
}

// Progress tracking
export interface ProgressRecord {
  id: string
  patientId: string
  dietPlanId?: string
  date: Date
  weight: number
  measurements?: {
    waist?: number
    chest?: number
    hips?: number
    arms?: number
  }
  symptoms: {
    improved: string[]
    worsened: string[]
    new: string[]
  }
  adherence: {
    diet: number // percentage
    lifestyle: number // percentage
    medications: number // percentage
  }
  energyLevel: number // 1-10 scale
  sleepQuality: number // 1-10 scale
  digestiveHealth: number // 1-10 scale
  mood: number // 1-10 scale
  notes: string
  nextGoals: string[]
}

// Analytics and reporting interfaces
export interface DashboardStats {
  totalPatients: number
  activePatients: number
  activeDietPlans: number
  totalFoods: number
  totalRecipes: number
  weeklyGrowth: number
  monthlyConsultations: number
  averageAdherence: number
}

export interface PatientSummary {
  id: string
  name: string
  age: number
  constitution: string
  lastConsultation: Date
  activeDietPlan?: string
  adherenceScore: number
  status: "active" | "inactive" | "completed"
}

export interface FoodCategory {
  "Category Type": string
  "Sub-Category": string
  "Recommended Foods": string
  "Avoid Foods": string
  Reason: string
  "Meal Suggestions": string
  "Special Notes": string
}

// Local storage keys
const PATIENTS_KEY = "ayurvedic_patients"
const DIET_PLANS_KEY = "ayurvedic_diet_plans"
const RECIPES_KEY = "ayurvedic_recipes"
const MEAL_PLANS_KEY = "ayurvedic_meal_plans"
const CONSULTATIONS_KEY = "ayurvedic_consultations"
const PROGRESS_KEY = "ayurvedic_progress"
const FOODS_KEY = "ayurvedic_foods"

// Patient management functions
export const savePatient = (patient: Patient): void => {
  const patients = getPatients()
  const existingIndex = patients.findIndex((p) => p.id === patient.id)

  if (existingIndex >= 0) {
    patients[existingIndex] = { ...patient, updatedAt: new Date() }
  } else {
    patients.push({ ...patient, createdAt: patient.createdAt || new Date(), updatedAt: new Date() })
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients))
  }
}

export const getPatients = (): Patient[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(PATIENTS_KEY)
  return stored ? JSON.parse(stored) : []
}

export const getPatientById = (id: string): Patient | null => {
  const patients = getPatients()
  return patients.find((p) => p.id === id) || null
}

export const createPatient = (patientData: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>): Patient => {
  const newPatient: Patient = {
    ...patientData,
    id: generateId(),
    bmi: calculateBMI(patientData.weight, patientData.height),
    createdAt: new Date(),
    updatedAt: new Date()
  }
  
  savePatient(newPatient)
  return newPatient
}

export const updatePatient = (id: string, updates: Partial<Patient>): Patient | null => {
  const patients = getPatients()
  const patientIndex = patients.findIndex((p) => p.id === id)
  
  if (patientIndex === -1) return null
  
  const updatedPatient = {
    ...patients[patientIndex],
    ...updates,
    id, // Ensure ID doesn't change
    updatedAt: new Date()
  }
  
  if (updates.weight || updates.height) {
    updatedPatient.bmi = calculateBMI(
      updates.weight || patients[patientIndex].weight,
      updates.height || patients[patientIndex].height
    )
  }
  
  patients[patientIndex] = updatedPatient
  
  if (typeof window !== "undefined") {
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients))
  }
  
  return updatedPatient
}

// Helper function to calculate BMI
const calculateBMI = (weight: number, height: number): number => {
  const heightInMeters = height / 100
  return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10
}

// Intelligent Diet Plan Generation
export const generateIntelligentDietPlan = (patient: Patient): DietPlan | null => {
  const templates = intelligentDietPlans as IntelligentDietPlanTemplate[]
  
  // Find the best matching template based on patient profile
  let bestMatch: IntelligentDietPlanTemplate | null = null
  let matchScore = 0
  
  templates.forEach((template: IntelligentDietPlanTemplate) => {
    let score = 0
    
    // Constitution match (highest priority)
    if (template.constitution === patient.constitution || template.constitution === "any") {
      score += template.constitution === patient.constitution ? 50 : 20
    }
    
    // Age range match
    if (patient.age >= template.ageRange[0] && patient.age <= template.ageRange[1]) {
      score += 20
    }
    
    // Condition match
    const matchingConditions = template.conditions.filter(condition => 
      patient.currentConditions.some(patientCondition => 
        patientCondition.toLowerCase().includes(condition.toLowerCase()) ||
        condition.toLowerCase().includes(patientCondition.toLowerCase())
      )
    )
    score += matchingConditions.length * 15
    
    // Season match (current season)
    const currentMonth = new Date().getMonth()
    let currentSeason = "winter"
    if (currentMonth >= 2 && currentMonth <= 4) currentSeason = "spring"
    else if (currentMonth >= 5 && currentMonth <= 7) currentSeason = "summer"
    else if (currentMonth >= 8 && currentMonth <= 10) currentSeason = "autumn"
    
    if (template.season === currentSeason || template.season === "any") {
      score += template.season === currentSeason ? 10 : 5
    }
    
    if (score > matchScore) {
      matchScore = score
      bestMatch = template
    }
  })
  
  if (!bestMatch) {
    console.warn('No matching diet plan template found for patient:', patient.name)
    return null
  }

  // Type assertion to help TypeScript understand bestMatch is not null
  const selectedTemplate = bestMatch as IntelligentDietPlanTemplate
  
  // Generate personalized diet plan from template
  const personalizedPlan: DietPlan = {
    id: generateId(),
    patientId: patient.id,
    planName: `${selectedTemplate.planName} - ${patient.name}`,
    description: `${selectedTemplate.description} (Customized for ${patient.constitution} constitution)`,
    duration: selectedTemplate.duration,
    startDate: new Date(),
    endDate: new Date(Date.now() + selectedTemplate.duration * 24 * 60 * 60 * 1000),
    targetCalories: adjustCaloriesForPatient(selectedTemplate.targetCalories, patient),
    objectives: [...selectedTemplate.objectives],
    dailyMeals: transformTemplateMeals(selectedTemplate.dailyMeals, patient),
    restrictions: [...selectedTemplate.restrictions],
    recommendations: [
      `Follow ${selectedTemplate.lifestyle.exercise} routine`,
      `Practice ${selectedTemplate.lifestyle.meditation}`,
      `Sleep by ${selectedTemplate.lifestyle.sleepTime} and wake up by ${selectedTemplate.lifestyle.wakeTime}`,
      ...generatePersonalizedRecommendations(patient, selectedTemplate)
    ],
    ayurvedicGuidelines: {
      constitutionFocus: `This plan is designed for ${patient.constitution} constitution`,
      seasonalAdaptations: generateSeasonalAdaptations(selectedTemplate, patient),
      lifestyleRecommendations: [
        selectedTemplate.lifestyle.exercise,
        selectedTemplate.lifestyle.meditation,
        `Sleep schedule: ${selectedTemplate.lifestyle.sleepTime} - ${selectedTemplate.lifestyle.wakeTime}`
      ],
      herbs: generateHerbRecommendations(patient.constitution, patient.currentConditions)
    },
    progress: {
      adherence: 0,
      weightChange: 0,
      symptomsImprovement: [],
      notes: [`Plan generated on ${new Date().toLocaleDateString()}`]
    },
    createdBy: "AI Diet Generator",
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true
  }
  
  return personalizedPlan
}

// Helper functions for diet plan generation
const adjustCaloriesForPatient = (baseCalories: number, patient: Patient): number => {
  let adjustedCalories = baseCalories
  
  // Adjust for age
  if (patient.age > 50) adjustedCalories *= 0.9
  if (patient.age < 25) adjustedCalories *= 1.1
  
  // Adjust for activity level
  switch (patient.lifestyle.activityLevel) {
    case "sedentary": adjustedCalories *= 0.9; break
    case "active": adjustedCalories *= 1.1; break
    case "very-active": adjustedCalories *= 1.2; break
  }
  
  // Adjust for constitution
  switch (patient.constitution) {
    case "vata": adjustedCalories *= 1.05; break // Vata needs more calories
    case "kapha": adjustedCalories *= 0.9; break // Kapha needs fewer calories
  }
  
  return Math.round(adjustedCalories)
}

const transformTemplateMeals = (templateMeals: IntelligentDietPlanTemplate['dailyMeals'], patient: Patient) => {
  const dailyMeals: DietPlan['dailyMeals'] = {}
  
  for (let day = 1; day <= 7; day++) {
    dailyMeals[day] = {
      breakfast: {
        recipes: templateMeals.breakfast.foods,
        notes: `${templateMeals.breakfast.timing} - ${templateMeals.breakfast.ayurvedicNotes}`
      },
      lunch: {
        recipes: templateMeals.lunch.foods,
        notes: `${templateMeals.lunch.timing} - ${templateMeals.lunch.ayurvedicNotes}`
      },
      dinner: {
        recipes: templateMeals.dinner.foods,
        notes: `${templateMeals.dinner.timing} - ${templateMeals.dinner.ayurvedicNotes}`
      }
    }
    
    if (templateMeals.midMorning) {
      dailyMeals[day].midMorning = {
        recipes: templateMeals.midMorning.foods,
        notes: `${templateMeals.midMorning.timing} - ${templateMeals.midMorning.ayurvedicNotes}`
      }
    }
    
    if (templateMeals.midAfternoon) {
      dailyMeals[day].midAfternoon = {
        recipes: templateMeals.midAfternoon.foods,
        notes: `${templateMeals.midAfternoon.timing} - ${templateMeals.midAfternoon.ayurvedicNotes}`
      }
    }
  }
  
  return dailyMeals
}

const generatePersonalizedRecommendations = (patient: Patient, template: IntelligentDietPlanTemplate): string[] => {
  const recommendations: string[] = []
  
  // BMI-based recommendations
  if (patient.bmi && patient.bmi > 25) {
    recommendations.push("Focus on portion control and regular physical activity")
  } else if (patient.bmi && patient.bmi < 18.5) {
    recommendations.push("Include healthy fats and protein-rich foods for weight gain")
  }
  
  // Stress level recommendations
  if (patient.lifestyle.stressLevel === "high") {
    recommendations.push("Practice stress-reducing techniques like pranayama and meditation")
    recommendations.push("Avoid stimulants and include calming herbs like ashwagandha")
  }
  
  // Constitution-specific recommendations
  switch (patient.constitution) {
    case "vata":
      recommendations.push("Eat warm, cooked foods and maintain regular meal times")
      break
    case "pitta":
      recommendations.push("Avoid spicy and acidic foods, stay cool and calm")
      break
    case "kapha":
      recommendations.push("Include warming spices and avoid heavy, oily foods")
      break
  }
  
  return recommendations
}

const generateSeasonalAdaptations = (template: IntelligentDietPlanTemplate, patient: Patient): string[] => {
  const adaptations: string[] = []
  const currentMonth = new Date().getMonth()
  
  if (currentMonth >= 5 && currentMonth <= 7) { // Summer
    adaptations.push("Increase cooling foods and reduce heating spices")
    adaptations.push("Stay well hydrated with coconut water and fresh juices")
  } else if (currentMonth >= 11 || currentMonth <= 1) { // Winter
    adaptations.push("Include warming spices like ginger, cinnamon, and black pepper")
    adaptations.push("Consume warm, cooked foods and avoid cold drinks")
  }
  
  return adaptations
}

const generateHerbRecommendations = (constitution: string, conditions: string[]): string[] => {
  const herbs: string[] = []
  
  // Constitution-based herbs
  switch (constitution) {
    case "vata":
      herbs.push("Ashwagandha", "Brahmi", "Jatamansi")
      break
    case "pitta":
      herbs.push("Amla", "Neem", "Guduchi")
      break
    case "kapha":
      herbs.push("Trikatu", "Guggul", "Punarnava")
      break
  }
  
  // Condition-based herbs
  conditions.forEach(condition => {
    const lowerCondition = condition.toLowerCase()
    if (lowerCondition.includes("diabetes")) {
      herbs.push("Bitter gourd", "Fenugreek", "Jamun")
    } else if (lowerCondition.includes("hypertension")) {
      herbs.push("Arjuna", "Garlic", "Hawthorn")
    } else if (lowerCondition.includes("digestion")) {
      herbs.push("Ginger", "Cumin", "Fennel")
    }
  })
  
  return [...new Set(herbs)] // Remove duplicates
}

// Diet plan management functions
export const saveDietPlan = (plan: DietPlan): void => {
  const plans = getDietPlans()
  const existingIndex = plans.findIndex((p) => p.id === plan.id)

  if (existingIndex >= 0) {
    plans[existingIndex] = plan
  } else {
    plans.push(plan)
  }

  localStorage.setItem(DIET_PLANS_KEY, JSON.stringify(plans))
}

export const getDietPlans = (): DietPlan[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(DIET_PLANS_KEY)
  return stored ? JSON.parse(stored) : []
}

export const getDietPlansByPatient = (patientId: string): DietPlan[] => {
  return getDietPlans().filter((plan) => plan.patientId === patientId)
}

export const deleteDietPlan = (id: string): void => {
  const plans = getDietPlans().filter((p) => p.id !== id)
  localStorage.setItem(DIET_PLANS_KEY, JSON.stringify(plans))
}

export const deletePatient = (id: string): void => {
  const patients = getPatients().filter((p) => p.id !== id)
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients))

  // Also delete associated diet plans
  const dietPlans = getDietPlans().filter((plan: DietPlan) => plan.patientId !== id)
  localStorage.setItem(DIET_PLANS_KEY, JSON.stringify(dietPlans))
}
export const saveRecipe = (recipe: Recipe): void => {
  const recipes = getRecipes()
  const existingIndex = recipes.findIndex((r) => r.id === recipe.id)

  if (existingIndex >= 0) {
    recipes[existingIndex] = { ...recipe, updatedAt: new Date() }
  } else {
    recipes.push(recipe)
  }

  localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes))
}

export const getRecipes = (): Recipe[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(RECIPES_KEY)
  return stored ? JSON.parse(stored) : []
}

export const getRecipeById = (id: string): Recipe | null => {
  const recipes = getRecipes()
  return recipes.find((r) => r.id === id) || null
}

export const deleteRecipe = (id: string): void => {
  const recipes = getRecipes().filter((r) => r.id !== id)
  localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes))
}

// Meal plan management functions
export const saveMealPlan = (mealPlan: MealPlan): void => {
  const mealPlans = getMealPlans()
  const existingIndex = mealPlans.findIndex((mp) => mp.id === mealPlan.id)

  if (existingIndex >= 0) {
    mealPlans[existingIndex] = { ...mealPlan, updatedAt: new Date() }
  } else {
    mealPlans.push(mealPlan)
  }

  localStorage.setItem(MEAL_PLANS_KEY, JSON.stringify(mealPlans))
}

export const getMealPlans = (): MealPlan[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(MEAL_PLANS_KEY)
  return stored ? JSON.parse(stored) : []
}

export const getMealPlanById = (id: string): MealPlan | null => {
  const mealPlans = getMealPlans()
  return mealPlans.find((mp) => mp.id === id) || null
}

// Consultation management functions
export const saveConsultation = (consultation: Consultation): void => {
  const consultations = getConsultations()
  const existingIndex = consultations.findIndex((c) => c.id === consultation.id)

  if (existingIndex >= 0) {
    consultations[existingIndex] = consultation
  } else {
    consultations.push(consultation)
  }

  localStorage.setItem(CONSULTATIONS_KEY, JSON.stringify(consultations))
}

export const getConsultations = (): Consultation[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(CONSULTATIONS_KEY)
  return stored ? JSON.parse(stored) : []
}

export const getConsultationsByPatient = (patientId: string): Consultation[] => {
  return getConsultations().filter((c) => c.patientId === patientId)
}

// Progress tracking functions
export const saveProgressRecord = (progress: ProgressRecord): void => {
  const progressRecords = getProgressRecords()
  const existingIndex = progressRecords.findIndex((p) => p.id === progress.id)

  if (existingIndex >= 0) {
    progressRecords[existingIndex] = progress
  } else {
    progressRecords.push(progress)
  }

  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progressRecords))
}

export const getProgressRecords = (): ProgressRecord[] => {
  if (typeof window === "undefined") return []
  const stored = localStorage.getItem(PROGRESS_KEY)
  return stored ? JSON.parse(stored) : []
}

export const getProgressByPatient = (patientId: string): ProgressRecord[] => {
  return getProgressRecords().filter((p) => p.patientId === patientId)
}

// Ayurvedic Foods management (from JSON data)
export const initializeFoodsDatabase = (): void => {
  // Foods are now loaded directly from JSON files via ayurvedic-data module
  // No need for initialization as the data is imported statically
  console.log("Ayurvedic foods loaded from JSON:", getAllFoods().length + " foods available")
}

export const getAyurvedicFoods = (): AyurvedicFood[] => {
  // Import the JSON data directly from ayurvedic-data module
  return getAllFoods()
}

export const searchFoods = (query: string, filters?: {
  dosha?: string
  category?: string
  season?: string
}): FoodSearchResult[] => {
  const foods = getAyurvedicFoods()
  const results: FoodSearchResult[] = []

  foods.forEach((food) => {
    let score = 0
    const matchedFields: string[] = []

    // Text search
    if (food.Food.toLowerCase().includes(query.toLowerCase())) {
      score += 10
      matchedFields.push('name')
    }

    // Apply filters
    if (filters) {
      if (filters.dosha && !food["Dosha Effect"].toLowerCase().includes(filters.dosha.toLowerCase())) {
        return // Skip if dosha filter doesn't match
      }
      // For category filter, infer from food name since it's not in JSON
      if (filters.category) {
        const inferredCategory = inferFoodCategory(food.Food)
        if (inferredCategory !== filters.category) {
          return // Skip if category filter doesn't match
        }
      }
      // For season filter, infer from Veerya (heating/cooling properties)
      if (filters.season) {
        const inferredSeasons = inferSeason(food)
        if (!inferredSeasons.includes(filters.season)) {
          return // Skip if season filter doesn't match
        }
      }
    }

    if (score > 0 || query === '') {
      results.push({ food, score, matchedFields })
    }
  })

  // Sort by score (descending)
  return results.sort((a, b) => b.score - a.score)
}

// Helper functions
const inferFoodCategory = (foodName: string): string => {
  const name = foodName.toLowerCase()
  
  if (name.includes('rice') || name.includes('wheat') || name.includes('barley') || name.includes('millet')) {
    return 'grain'
  }
  if (name.includes('dal') || name.includes('lentil') || name.includes('bean') || name.includes('chickpea')) {
    return 'legume'
  }
  if (name.includes('oil') || name.includes('ghee')) {
    return 'fat'
  }
  if (name.includes('milk') || name.includes('yogurt') || name.includes('cheese')) {
    return 'dairy'
  }
  if (name.includes('seed') || name.includes('nut')) {
    return 'nuts_seeds'
  }
  if (name.includes('pepper') || name.includes('turmeric') || name.includes('ginger') || name.includes('cinnamon')) {
    return 'spice'
  }
  if (name.includes('tea') || name.includes('juice') || name.includes('water')) {
    return 'beverage'
  }
  
  // Try to determine if it's a fruit or vegetable (simplified)
  const fruits = ['mango', 'apple', 'banana', 'orange', 'grape', 'pomegranate', 'coconut', 'dates', 'figs']
  const vegetables = ['spinach', 'carrot', 'beetroot', 'cucumber', 'cabbage', 'onion', 'garlic', 'potato']
  
  if (fruits.some(fruit => name.includes(fruit))) {
    return 'fruit'
  }
  if (vegetables.some(veg => name.includes(veg))) {
    return 'vegetable'
  }
  
  return 'other'
}

const inferSeason = (food: any): string[] => {
  const { Veerya } = food
  
  if (Veerya && Veerya.toLowerCase().includes('hot')) {
    return ['winter', 'autumn']
  }
  if (Veerya && Veerya.toLowerCase().includes('cold')) {
    return ['summer', 'spring']
  }
  
  return ['all'] // Default to all seasons
}

// Dashboard analytics functions
export const getDashboardStats = (): DashboardStats => {
  const patients = getPatients()
  const dietPlans = getDietPlans()
  const foods = getAyurvedicFoods()
  const recipes = getRecipesFromDB() // Use new recipe database
  const consultations = getConsultations()

  // Calculate active patients (those with consultations in last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  
  const recentConsultations = consultations.filter(c => new Date(c.date) > thirtyDaysAgo)
  const activePatients = new Set(recentConsultations.map(c => c.patientId)).size

  // Calculate active diet plans
  const activeDietPlans = dietPlans.filter((plan: DietPlan) => plan.isActive).length

  // Calculate weekly growth (simplified)
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)
  const newPatientsThisWeek = patients.filter(p => new Date(p.createdAt) > weekAgo).length
  const weeklyGrowth = (newPatientsThisWeek / Math.max(patients.length - newPatientsThisWeek, 1)) * 100

  return {
    totalPatients: patients.length,
    activePatients,
    activeDietPlans,
    totalFoods: foods.length,
    totalRecipes: recipes.length,
    weeklyGrowth: Math.round(weeklyGrowth),
    monthlyConsultations: recentConsultations.length,
    averageAdherence: 85 // This would be calculated from progress records
  }
}

export const getRecentPatients = (limit: number = 5): PatientSummary[] => {
  const patients = getPatients()
  const consultations = getConsultations()
  const dietPlans = getDietPlans()

  return patients
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit)
    .map(patient => {
      const lastConsultation = consultations
        .filter(c => c.patientId === patient.id)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]

      const activeDietPlan = dietPlans.find((plan: DietPlan) => 
        plan.patientId === patient.id && plan.isActive
      )

      return {
        id: patient.id,
        name: patient.name,
        age: patient.age,
        constitution: patient.constitution,
        lastConsultation: lastConsultation ? lastConsultation.date : patient.createdAt,
        activeDietPlan: activeDietPlan?.planName,
        adherenceScore: 85, // This would come from progress records
        status: activeDietPlan ? "active" : "inactive"
      }
    })
}

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Initialize sample data for demo purposes
export const initializeSampleData = (): void => {
  // Initialize foods from JSON
  initializeFoodsDatabase()

  // Check if sample data already exists
  const existingPatients = getPatients()
  if (existingPatients.length > 0) return

  // Create sample patients
  const samplePatients: Patient[] = [
    {
      id: generateId(),
      name: "Dr. Priya Sharma",
      age: 34,
      gender: "female",
      weight: 65,
      height: 162,
      bmi: 24.8,
      constitution: "pitta-kapha",
      currentConditions: ["Stress", "Irregular sleep"],
      dietaryRestrictions: ["Vegetarian"],
      allergies: [],
      lifestyle: {
        activityLevel: "moderate",
        sleepHours: 6,
        stressLevel: "high",
        waterIntake: 2.5,
        mealTiming: "Irregular",
        bowelMovements: "regular",
        exerciseRoutine: "Yoga 3x week"
      },
      medicalHistory: ["Migraine"],
      occupation: "Doctor",
      contactInfo: {
        phone: "+91-9876543210",
        email: "priya.sharma@email.com",
        address: "Mumbai, Maharashtra"
      },
      emergencyContact: {
        name: "Rajesh Sharma",
        phone: "+91-9876543211",
        relation: "Spouse"
      },
      assessmentDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: generateId(),
      name: "Rajesh Kumar",
      age: 45,
      gender: "male",
      weight: 78,
      height: 175,
      bmi: 25.5,
      constitution: "vata-pitta",
      currentConditions: ["Diabetes", "High BP"],
      dietaryRestrictions: ["Low salt", "Sugar-free"],
      allergies: ["Peanuts"],
      lifestyle: {
        activityLevel: "sedentary",
        sleepHours: 7,
        stressLevel: "moderate",
        waterIntake: 3,
        mealTiming: "Regular",
        bowelMovements: "irregular",
        exerciseRoutine: "Walking daily"
      },
      medicalHistory: ["Diabetes Type 2", "Hypertension"],
      occupation: "Software Engineer",
      contactInfo: {
        phone: "+91-9876543212",
        email: "rajesh.kumar@email.com",
        address: "Bangalore, Karnataka"
      },
      emergencyContact: {
        name: "Sunita Kumar",
        phone: "+91-9876543213",
        relation: "Wife"
      },
      assessmentDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: generateId(),
      name: "Anita Patel",
      age: 28,
      gender: "female",
      weight: 55,
      height: 158,
      bmi: 22.0,
      constitution: "kapha",
      currentConditions: ["PCOS", "Weight gain"],
      dietaryRestrictions: ["Gluten-free"],
      allergies: ["Shellfish"],
      lifestyle: {
        activityLevel: "active",
        sleepHours: 8,
        stressLevel: "low",
        waterIntake: 2,
        mealTiming: "Regular",
        bowelMovements: "regular",
        exerciseRoutine: "Gym 4x week"
      },
      medicalHistory: ["PCOS"],
      occupation: "Marketing Manager",
      contactInfo: {
        phone: "+91-9876543214",
        email: "anita.patel@email.com",
        address: "Delhi, India"
      },
      emergencyContact: {
        name: "Mohan Patel",
        phone: "+91-9876543215",
        relation: "Father"
      },
      assessmentDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  // Save sample patients
  samplePatients.forEach(patient => savePatient(patient))

  // Create sample recipes
  const sampleRecipes: Recipe[] = [
    {
      id: generateId(),
      name: "Golden Turmeric Milk",
      description: "Warming Ayurvedic beverage for immunity and relaxation",
      category: "beverage",
      cuisineType: "indian",
      ingredients: [
        { food: "Milk", quantity: 1, unit: "cup" },
        { food: "Turmeric", quantity: 1, unit: "tsp" },
        { food: "Ginger", quantity: 0.5, unit: "tsp" },
        { food: "Honey", quantity: 1, unit: "tsp" }
      ],
      instructions: [
        "Heat milk in a saucepan",
        "Add turmeric and ginger powder",
        "Simmer for 5 minutes",
        "Add honey before serving"
      ],
      prepTime: 5,
      cookTime: 5,
      servings: 1,
      nutrition: {
        calories: 150,
        protein: 8,
        carbohydrates: 12,
        fat: 8,
        fiber: 0,
        sugar: 12,
        sodium: 120,
        calcium: 280,
        iron: 0.5,
        vitaminC: 2,
        vitaminD: 120,
        vitaminB12: 1.2,
        omega3: 0
      },
      ayurvedicProperties: {
        dosha: "vata",
        rasa: ["sweet", "bitter"],
        effect: "heating",
        season: "winter",
        timeOfDay: "evening"
      },
      difficulty: "easy",
      tags: ["immunity", "warming", "bedtime"],
      createdBy: "system",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]

  // Save sample recipes
  sampleRecipes.forEach(recipe => saveRecipe(recipe))

  console.log("Sample data initialized successfully!")
}
