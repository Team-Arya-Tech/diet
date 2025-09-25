// Category recommendation system based on Ayurvedic categories
import categoryData from "../data/ayurvedic-categories.json"

export interface CategoryRecommendation {
  id: string
  categoryType: string
  subCategory: string
  recommendedFoods: string[]
  avoidFoods: string[]
  reason: string
  mealSuggestions: string
  specialNotes: string
  priority: "high" | "medium" | "low"
  matchScore: number
}

export interface UserProfile {
  age: number
  gender: "male" | "female" | "other"
  constitution: "vata" | "pitta" | "kapha" | "vata-pitta" | "pitta-kapha" | "vata-kapha" | "tridoshic"
  occupation: string
  healthConditions: string[]
  dietaryRestrictions: string[]
  lifeStage: string
  currentSeason: "spring" | "summer" | "autumn" | "winter"
  activityLevel: "sedentary" | "moderate" | "active" | "very-active"
  pregnancyStage?: "first-trimester" | "second-trimester" | "third-trimester"
  isPregnant?: boolean
  isLactating?: boolean
  isMenupausal?: boolean
  specificGoals: string[]
}

export interface RecommendationReport {
  userId: string
  userName: string
  generatedDate: Date
  profile: UserProfile
  recommendations: CategoryRecommendation[]
  summary: {
    totalCategories: number
    highPriorityCount: number
    mediumPriorityCount: number
    lowPriorityCount: number
    averageMatchScore: number
  }
  keyInsights: string[]
  actionItems: string[]
}

// Generate personalized category recommendations
export const generateCategoryRecommendations = (profile: UserProfile): CategoryRecommendation[] => {
  const recommendations: CategoryRecommendation[] = []
  
  // Process each category in the data
  categoryData.forEach((category, index) => {
    const matchScore = calculateMatchScore(category, profile)
    
    if (matchScore > 0.3) { // Only include relevant recommendations
      const recommendation: CategoryRecommendation = {
        id: `rec-${index}`,
        categoryType: category["Category Type"],
        subCategory: category["Sub-Category"],
        recommendedFoods: category["Recommended Foods"].split(", "),
        avoidFoods: category["Avoid Foods"].split(", "),
        reason: category.Reason,
        mealSuggestions: category["Meal Suggestions"],
        specialNotes: category["Special Notes"],
        priority: determinePriority(matchScore),
        matchScore: Math.round(matchScore * 100) / 100
      }
      
      recommendations.push(recommendation)
    }
  })
  
  // Sort by match score (highest first)
  return recommendations.sort((a, b) => b.matchScore - a.matchScore)
}

// Calculate how well a category matches the user profile
const calculateMatchScore = (category: any, profile: UserProfile): number => {
  let score = 0
  const factors: { [key: string]: number } = {}
  
  // Age-based matching
  if (category["Category Type"] === "Age-Specific") {
    factors.age = calculateAgeMatch(category["Sub-Category"], profile.age)
  }
  
  // Gender and life-stage matching
  if (category["Category Type"] === "Women-Specific" && profile.gender === "female") {
    factors.gender = calculateWomenSpecificMatch(category["Sub-Category"], profile)
  }
  
  // Occupation-based matching
  if (category["Category Type"] === "Occupation-Based") {
    factors.occupation = calculateOccupationMatch(category["Sub-Category"], profile.occupation)
  }
  
  // Condition-based matching
  if (category["Category Type"] === "Condition-Based") {
    factors.condition = calculateConditionMatch(category["Sub-Category"], profile.healthConditions)
  }
  
  // Seasonal matching
  if (category["Category Type"] === "Seasonal-Based") {
    factors.seasonal = calculateSeasonalMatch(category["Sub-Category"], profile.currentSeason)
  }
  
  // Fitness-based matching
  if (category["Category Type"] === "Fitness-Based") {
    factors.fitness = calculateFitnessMatch(category["Sub-Category"], profile.activityLevel)
  }
  
  // Environmental factors
  if (category["Category Type"] === "Environmental-Based") {
    factors.environmental = 0.6 // Moderate relevance for all users
  }
  
  // Lifestyle factors
  if (category["Category Type"] === "Lifestyle-Based") {
    factors.lifestyle = calculateLifestyleMatch(category["Sub-Category"], profile)
  }
  
  // Calculate weighted average
  const weights = Object.values(factors)
  if (weights.length > 0) {
    score = weights.reduce((sum, weight) => sum + weight, 0) / weights.length
  }
  
  return Math.min(score, 1.0) // Cap at 1.0
}

// Age matching function
const calculateAgeMatch = (subCategory: string, age: number): number => {
  const ageCategories: { [key: string]: { min: number, max: number } } = {
    "Infants": { min: 0, max: 1 },
    "Toddlers": { min: 1, max: 3 },
    "Children": { min: 4, max: 12 },
    "Teenagers": { min: 13, max: 18 },
    "Young Adults": { min: 19, max: 35 },
    "Middle Age": { min: 40, max: 60 },
    "Elderly": { min: 60, max: 120 }
  }
  
  for (const [category, range] of Object.entries(ageCategories)) {
    if (subCategory.includes(category) && age >= range.min && age <= range.max) {
      return 1.0
    }
  }
  
  return 0
}

// Women-specific matching
const calculateWomenSpecificMatch = (subCategory: string, profile: UserProfile): number => {
  if (profile.gender !== "female") return 0
  
  // Pregnancy stages
  if (profile.isPregnant && subCategory.includes("Pregnancy")) {
    if (profile.pregnancyStage && subCategory.includes(profile.pregnancyStage.replace("-", " "))) {
      return 1.0
    }
    return 0.8
  }
  
  // Lactation
  if (profile.isLactating && subCategory.includes("Lactation")) {
    return 1.0
  }
  
  // Menopause
  if (profile.isMenupausal && subCategory.includes("Menopause")) {
    return 1.0
  }
  
  // General women's health
  if (subCategory.includes("Menstrual") || subCategory.includes("PCOS") || 
      subCategory.includes("Fertility") || subCategory.includes("Thyroid")) {
    return 0.7
  }
  
  return 0.5 // General relevance for women
}

// Occupation matching
const calculateOccupationMatch = (subCategory: string, occupation: string): number => {
  const occupationMappings: { [key: string]: string[] } = {
    "Software Engineers": ["developer", "programmer", "engineer", "tech", "IT"],
    "Athletes": ["athlete", "sports", "trainer", "fitness"],
    "Teachers": ["teacher", "educator", "professor", "instructor"],
    "Healthcare Workers": ["doctor", "nurse", "medical", "healthcare"],
    "Drivers": ["driver", "transport", "delivery"],
    "Manual Laborers": ["laborer", "construction", "factory", "manual"],
    "Night Shift Workers": ["night shift", "security", "guard"],
    "Frequent Travelers": ["sales", "consultant", "travel", "business"],
    "Chefs": ["chef", "cook", "culinary", "restaurant"],
    "Artists": ["artist", "creative", "designer", "musician"],
    "Emergency Responders": ["emergency", "firefighter", "paramedic", "police"],
    "Farmers": ["farmer", "agriculture", "farming"],
    "Pilots": ["pilot", "aviation", "airline"],
    "Surgeons": ["surgeon", "surgery", "medical"]
  }
  
  for (const [category, keywords] of Object.entries(occupationMappings)) {
    if (subCategory.includes(category)) {
      for (const keyword of keywords) {
        if (occupation.toLowerCase().includes(keyword)) {
          return 1.0
        }
      }
    }
  }
  
  return 0
}

// Condition matching
const calculateConditionMatch = (subCategory: string, healthConditions: string[]): number => {
  const conditionKeywords = subCategory.toLowerCase()
  
  for (const condition of healthConditions) {
    if (conditionKeywords.includes(condition.toLowerCase()) ||
        condition.toLowerCase().includes(conditionKeywords.split(" - ")[0])) {
      return 1.0
    }
  }
  
  return 0
}

// Seasonal matching
const calculateSeasonalMatch = (subCategory: string, currentSeason: string): number => {
  if (subCategory.toLowerCase().includes(currentSeason)) {
    return 1.0
  }
  return 0
}

// Fitness matching
const calculateFitnessMatch = (subCategory: string, activityLevel: string): number => {
  const fitnessMap: { [key: string]: string[] } = {
    "Bodybuilders": ["very-active"],
    "Athletes": ["active", "very-active"],
    "Yoga Practitioners": ["moderate", "active"],
    "Runners": ["active", "very-active"],
    "Cyclists": ["active", "very-active"]
  }
  
  for (const [category, levels] of Object.entries(fitnessMap)) {
    if (subCategory.includes(category) && levels.includes(activityLevel)) {
      return 1.0
    }
  }
  
  return 0
}

// Lifestyle matching
const calculateLifestyleMatch = (subCategory: string, profile: UserProfile): number => {
  // Check dietary restrictions
  for (const restriction of profile.dietaryRestrictions) {
    if (subCategory.toLowerCase().includes(restriction.toLowerCase())) {
      return 1.0
    }
  }
  
  return 0.3 // Default moderate relevance
}

// Determine priority based on match score
const determinePriority = (matchScore: number): "high" | "medium" | "low" => {
  if (matchScore >= 0.8) return "high"
  if (matchScore >= 0.6) return "medium"
  return "low"
}

// Generate comprehensive recommendation report
export const generateRecommendationReport = (
  userId: string,
  userName: string,
  profile: UserProfile
): RecommendationReport => {
  const recommendations = generateCategoryRecommendations(profile)
  
  const summary = {
    totalCategories: recommendations.length,
    highPriorityCount: recommendations.filter(r => r.priority === "high").length,
    mediumPriorityCount: recommendations.filter(r => r.priority === "medium").length,
    lowPriorityCount: recommendations.filter(r => r.priority === "low").length,
    averageMatchScore: recommendations.reduce((sum, r) => sum + r.matchScore, 0) / recommendations.length || 0
  }
  
  const keyInsights = generateKeyInsights(recommendations, profile)
  const actionItems = generateActionItems(recommendations)
  
  return {
    userId,
    userName,
    generatedDate: new Date(),
    profile,
    recommendations,
    summary,
    keyInsights,
    actionItems
  }
}

// Generate key insights from recommendations
const generateKeyInsights = (recommendations: CategoryRecommendation[], profile: UserProfile): string[] => {
  const insights: string[] = []
  
  // Constitution-based insights
  insights.push(`Based on your ${profile.constitution} constitution, focus on balancing foods is recommended.`)
  
  // Age-specific insights
  if (profile.age < 18) {
    insights.push("Growing years require extra attention to protein and calcium-rich foods.")
  } else if (profile.age > 60) {
    insights.push("Focus on easily digestible, warm foods for optimal health.")
  }
  
  // Activity level insights
  if (profile.activityLevel === "very-active") {
    insights.push("High activity levels require energy-dense foods and proper hydration.")
  } else if (profile.activityLevel === "sedentary") {
    insights.push("Lighter meals and metabolism-boosting foods are beneficial.")
  }
  
  // Seasonal insights
  insights.push(`Current ${profile.currentSeason} season recommendations emphasize appropriate foods for the climate.`)
  
  return insights
}

// Generate actionable items
const generateActionItems = (recommendations: CategoryRecommendation[]): string[] => {
  const actionItems: string[] = []
  
  const highPriorityRecs = recommendations.filter(r => r.priority === "high")
  
  if (highPriorityRecs.length > 0) {
    actionItems.push(`Start with ${highPriorityRecs[0].categoryType} recommendations first`)
    actionItems.push(`Include these foods daily: ${highPriorityRecs[0].recommendedFoods.slice(0, 3).join(", ")}`)
    actionItems.push(`Avoid: ${highPriorityRecs[0].avoidFoods.slice(0, 2).join(", ")}`)
  }
  
  actionItems.push("Monitor your body's response to dietary changes")
  actionItems.push("Consult with an Ayurvedic practitioner for personalized guidance")
  
  return actionItems
}

// Export functions for different formats
export const exportRecommendationToPDF = (report: RecommendationReport): void => {
  // Create PDF content
  const content = generatePDFContent(report)
  
  // Create blob and download
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `ayurvedic-recommendations-${report.userName}-${report.generatedDate.toISOString().split('T')[0]}.txt`
  link.click()
  URL.revokeObjectURL(url)
}

export const exportRecommendationToCSV = (report: RecommendationReport): void => {
  const csvContent = generateCSVContent(report)
  
  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `ayurvedic-recommendations-${report.userName}-${report.generatedDate.toISOString().split('T')[0]}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

export const exportRecommendationToJSON = (report: RecommendationReport): void => {
  const jsonContent = JSON.stringify(report, null, 2)
  
  const blob = new Blob([jsonContent], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `ayurvedic-recommendations-${report.userName}-${report.generatedDate.toISOString().split('T')[0]}.json`
  link.click()
  URL.revokeObjectURL(url)
}

// Generate PDF content (as text for now)
const generatePDFContent = (report: RecommendationReport): string => {
  let content = `AHAARWISE - AYURVEDIC CATEGORY RECOMMENDATIONS REPORT
Generated for: ${report.userName}
Date: ${report.generatedDate.toLocaleDateString()}

PROFILE SUMMARY:
Age: ${report.profile.age}
Gender: ${report.profile.gender}
Constitution: ${report.profile.constitution}
Occupation: ${report.profile.occupation}
Activity Level: ${report.profile.activityLevel}
Current Season: ${report.profile.currentSeason}

RECOMMENDATION SUMMARY:
Total Categories: ${report.summary.totalCategories}
High Priority: ${report.summary.highPriorityCount}
Medium Priority: ${report.summary.mediumPriorityCount}
Low Priority: ${report.summary.lowPriorityCount}
Average Match Score: ${report.summary.averageMatchScore.toFixed(2)}

KEY INSIGHTS:
${report.keyInsights.map(insight => `• ${insight}`).join('\n')}

ACTION ITEMS:
${report.actionItems.map(item => `• ${item}`).join('\n')}

DETAILED RECOMMENDATIONS:
`

  report.recommendations.forEach((rec, index) => {
    content += `
${index + 1}. ${rec.categoryType} - ${rec.subCategory}
   Priority: ${rec.priority.toUpperCase()} (Match Score: ${rec.matchScore})
   
   Recommended Foods: ${rec.recommendedFoods.join(", ")}
   
   Avoid: ${rec.avoidFoods.join(", ")}
   
   Reason: ${rec.reason}
   
   Meal Suggestions: ${rec.mealSuggestions}
   
   Special Notes: ${rec.specialNotes}
   
   ---
`
  })

  return content
}

// Generate CSV content
const generateCSVContent = (report: RecommendationReport): string => {
  let csv = "Category Type,Sub Category,Priority,Match Score,Recommended Foods,Avoid Foods,Reason,Meal Suggestions,Special Notes\n"
  
  report.recommendations.forEach(rec => {
    const row = [
      rec.categoryType,
      rec.subCategory,
      rec.priority,
      rec.matchScore.toString(),
      `"${rec.recommendedFoods.join("; ")}"`,
      `"${rec.avoidFoods.join("; ")}"`,
      `"${rec.reason}"`,
      `"${rec.mealSuggestions}"`,
      `"${rec.specialNotes}"`
    ].join(",")
    
    csv += row + "\n"
  })
  
  return csv
}

// Save user profile for future recommendations
export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.setItem("ayurvedic_user_profile", JSON.stringify(profile))
}

// Load user profile
export const loadUserProfile = (): UserProfile | null => {
  const saved = localStorage.getItem("ayurvedic_user_profile")
  return saved ? JSON.parse(saved) : null
}

// Get sample profiles for testing
export const getSampleProfiles = (): UserProfile[] => {
  return [
    {
      age: 28,
      gender: "female",
      constitution: "vata-pitta",
      occupation: "Software Engineer",
      healthConditions: ["Eye Strain", "Stress"],
      dietaryRestrictions: ["vegetarian"],
      lifeStage: "working-professional",
      currentSeason: "summer",
      activityLevel: "moderate",
      specificGoals: ["stress management", "eye health"]
    },
    {
      age: 35,
      gender: "male",
      constitution: "kapha",
      occupation: "Teacher",
      healthConditions: ["Weight Management"],
      dietaryRestrictions: [],
      lifeStage: "adult",
      currentSeason: "winter",
      activityLevel: "active",
      specificGoals: ["weight loss", "energy boost"]
    },
    {
      age: 45,
      gender: "female",
      constitution: "pitta",
      occupation: "Healthcare Worker",
      healthConditions: ["Immunity", "High Stress"],
      dietaryRestrictions: ["gluten-free"],
      lifeStage: "middle-age",
      currentSeason: "autumn",
      activityLevel: "very-active",
      specificGoals: ["immunity building", "stress reduction"]
    }
  ]
}
