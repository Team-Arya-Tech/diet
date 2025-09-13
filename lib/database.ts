// Local storage database utilities for Ayurvedic diet management
export interface Patient {
  id: string
  name: string
  age: number
  gender: "male" | "female" | "other"
  weight: number
  height: number
  constitution: "vata" | "pitta" | "kapha" | "vata-pitta" | "pitta-kapha" | "vata-kapha" | "tridoshic"
  currentConditions: string[]
  dietaryRestrictions: string[]
  lifestyle: {
    activityLevel: "sedentary" | "moderate" | "active" | "very-active"
    sleepHours: number
    stressLevel: "low" | "moderate" | "high"
    waterIntake: number // liters per day
    mealTiming: string
  }
  medicalHistory: string[]
  occupation: string
  createdAt: Date
  updatedAt: Date
}

export interface DietPlan {
  id: string
  patientId: string
  planName: string
  duration: number // days
  meals: {
    breakfast: string[]
    lunch: string[]
    dinner: string[]
    snacks: string[]
  }
  restrictions: string[]
  recommendations: string[]
  createdAt: Date
}

export interface AyurvedicFood {
  Food: string
  Rasa: string // taste
  Guna: string // quality
  Veerya: string // potency
  Vipaka: string // post-digestive effect
  "Dosha Effect": string
  Digestibility: string
  Pathya: string // beneficial for
  Apathya: string // contraindicated for
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

// Patient management functions
export const savePatient = (patient: Patient): void => {
  const patients = getPatients()
  const existingIndex = patients.findIndex((p) => p.id === patient.id)

  if (existingIndex >= 0) {
    patients[existingIndex] = { ...patient, updatedAt: new Date() }
  } else {
    patients.push(patient)
  }

  localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients))
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

export const deletePatient = (id: string): void => {
  const patients = getPatients().filter((p) => p.id !== id)
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients))

  // Also delete associated diet plans
  const dietPlans = getDietPlans().filter((plan) => plan.patientId !== id)
  localStorage.setItem(DIET_PLANS_KEY, JSON.stringify(dietPlans))
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

// Generate unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
