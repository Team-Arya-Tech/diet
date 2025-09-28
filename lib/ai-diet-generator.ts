import { openai } from './openai-config'
import { type Patient, type DietPlan, generateId } from './database'

export interface AIGeneratedMeal {
  name: string
  ingredients: string[]
  cookingMethod: string
  ayurvedicBenefits: string
  nutritionalInfo: {
    calories: number
    protein: number
    carbs: number
    fat: number
    fiber: number
  }
  cookingTime: string
  difficulty: 'easy' | 'medium' | 'hard'
  servings: number
}

export interface AIGeneratedDayPlan {
  breakfast: AIGeneratedMeal
  midMorning?: AIGeneratedMeal
  lunch: AIGeneratedMeal
  midAfternoon?: AIGeneratedMeal
  dinner: AIGeneratedMeal
  bedtime?: AIGeneratedMeal
}

export const generateAIDietChart = async (patient: Patient, preferences?: {
  duration?: number
  focusArea?: string
  dietaryStyle?: string
  availableIngredients?: string[]
}): Promise<DietPlan | null> => {
  try {
    const systemPrompt = `You are an expert Ayurvedic nutritionist and diet planner. Create personalized diet charts based on individual constitution (Prakriti), current health conditions (Vikriti), and lifestyle factors.

Key Principles:
- Follow Ayurvedic principles of food combining and seasonal eating
- Consider individual constitution (Vata, Pitta, Kapha) requirements
- Balance six tastes (Rasa): Sweet, Sour, Salty, Pungent, Bitter, Astringent
- Recommend foods that pacify aggravated doshas
- Consider digestive fire (Agni) and current health conditions
- Use traditional Indian ingredients and cooking methods
- Provide practical, achievable meal plans

Constitution Guidelines:
VATA: Warm, cooked, moist foods. Avoid cold, raw, dry foods. Sweet, sour, salty tastes.
PITTA: Cool, mild, slightly dry foods. Avoid hot, spicy, acidic foods. Sweet, bitter, astringent tastes.
KAPHA: Light, warm, dry foods. Avoid heavy, oily, cold foods. Pungent, bitter, astringent tastes.

Respond in JSON format with structured meal plans.`

    const userPrompt = `Create a ${preferences?.duration || 7}-day personalized Ayurvedic diet chart for:

Patient Profile:
- Name: ${patient.name}
- Age: ${patient.age}
- Constitution: ${patient.constitution}
- Current Conditions: ${patient.currentConditions.join(', ') || 'None'}
- Dietary Restrictions: ${patient.dietaryRestrictions.join(', ') || 'None'}
- BMI: ${patient.bmi}
- Activity Level: ${patient.lifestyle.activityLevel}
- Stress Level: ${patient.lifestyle.stressLevel}
- Sleep: ${patient.lifestyle.sleepHours} hours
- Water Intake: ${patient.lifestyle.waterIntake}L

Preferences:
- Focus Area: ${preferences?.focusArea || 'General wellness'}
- Dietary Style: ${preferences?.dietaryStyle || 'Traditional Ayurvedic'}
- Available Ingredients: ${preferences?.availableIngredients?.join(', ') || 'Common Indian ingredients'}

Requirements:
1. Create daily meal plans for ${preferences?.duration || 7} days
2. Include breakfast, lunch, dinner and 2 snacks per day
3. Each meal should specify:
   - Meal name and description
   - Key ingredients list
   - Cooking method overview
   - Ayurvedic benefits explanation
   - Approximate nutritional values (calories, protein, carbs, fat, fiber)
   - Cooking time and difficulty level
   - Number of servings

4. Consider seasonal foods (current month: ${new Date().toLocaleString('en-US', { month: 'long' })})
5. Ensure constitution-appropriate foods dominate
6. Address specific health conditions if any
7. Include variety while maintaining therapeutic principles
8. Provide practical recipes using common ingredients

Format the response as a JSON object with this structure:
{
  "planName": "Personalized plan name",
  "description": "Brief description of the plan",
  "duration": number,
  "targetCalories": number,
  "objectives": ["objective1", "objective2"],
  "dailyPlans": {
    "1": {
      "breakfast": {
        "name": "Meal name",
        "ingredients": ["ingredient1", "ingredient2"],
        "cookingMethod": "Brief cooking instructions",
        "ayurvedicBenefits": "How this meal benefits the constitution",
        "nutritionalInfo": {
          "calories": number,
          "protein": number,
          "carbs": number,
          "fat": number,
          "fiber": number
        },
        "cookingTime": "X minutes",
        "difficulty": "easy|medium|hard",
        "servings": number
      },
      // ... similar for midMorning, lunch, midAfternoon, dinner, bedtime
    }
    // ... for each day
  },
  "weeklyGuidelines": ["guideline1", "guideline2"],
  "seasonalTips": ["tip1", "tip2"],
  "lifestyleRecommendations": ["recommendation1", "recommendation2"]
}`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from OpenAI')
    }
    // Print the raw LLM response for debugging
    console.log('Raw LLM response:', response)

    // Parse the JSON response robustly
    let aiPlan
    try {
      // Extract the first {...} block from the response
      const match = response.match(/\{[\s\S]*\}/)
      if (!match) throw new Error('No JSON object found in AI response')
      let cleanedResponse = match[0]
        .replace(/\/\/.*$/gm, '') // Remove JS-style comments
        .replace(/,\s*([}\]])/g, '$1') // Remove trailing commas
      aiPlan = JSON.parse(cleanedResponse)
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      console.log('Raw response:', response)
      throw new Error('Invalid JSON response from AI')
    }

    // Convert AI response to our DietPlan format
    const dietPlan: DietPlan = {
      id: generateId(),
      patientId: patient.id,
      planName: aiPlan.planName || `AI Generated Plan for ${patient.name}`,
      description: aiPlan.description || 'AI-generated personalized Ayurvedic diet plan',
      duration: aiPlan.duration || preferences?.duration || 7,
      startDate: new Date(),
      endDate: new Date(Date.now() + (aiPlan.duration || 7) * 24 * 60 * 60 * 1000),
      targetCalories: aiPlan.targetCalories || calculateTargetCalories(patient),
      objectives: aiPlan.objectives || ['Improve overall health', 'Balance constitution'],
      dailyMeals: convertAIDailyPlans(aiPlan.dailyPlans),
      restrictions: patient.dietaryRestrictions,
      recommendations: [
        ...(aiPlan.weeklyGuidelines || []),
        ...(aiPlan.seasonalTips || []),
        ...(aiPlan.lifestyleRecommendations || [])
      ],
      ayurvedicGuidelines: {
        constitutionFocus: `AI-optimized plan for ${patient.constitution} constitution`,
        seasonalAdaptations: aiPlan.seasonalTips || [],
        lifestyleRecommendations: aiPlan.lifestyleRecommendations || [],
        herbs: getConstitutionHerbs(patient.constitution)
      },
      progress: {
        adherence: 0,
        weightChange: 0,
        symptomsImprovement: [],
        notes: [`AI-generated plan created on ${new Date().toLocaleDateString()}`]
      },
      createdBy: "AI Diet Generator (GPT-3.5-turbo)",
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    }

    return dietPlan

  } catch (error) {
    console.error('Error generating AI diet chart:', error)
    return null
  }
}

// Helper function to convert AI daily plans to our format
const convertAIDailyPlans = (aiDailyPlans: any): DietPlan['dailyMeals'] => {
  const dailyMeals: DietPlan['dailyMeals'] = {}

  Object.entries(aiDailyPlans).forEach(([day, dayPlan]: [string, any]) => {
    const dayNumber = parseInt(day)
    
    // Initialize the day with required meal structure
    dailyMeals[dayNumber] = {
      breakfast: { recipes: [] },
      lunch: { recipes: [] },
      dinner: { recipes: [] }
    }

    // Convert each meal type
    const mealTypes = ['breakfast', 'midMorning', 'lunch', 'midAfternoon', 'dinner', 'bedtime'] as const
    
    mealTypes.forEach(mealType => {
      if (dayPlan[mealType] && typeof dayPlan[mealType] === 'object') {
        const meal = dayPlan[mealType]
        
        // Safe access to meal properties with fallbacks
        const mealName = meal.name || 'AI Generated Meal'
        const cookingMethod = meal.cookingMethod || 'No cooking instructions provided'
        const ayurvedicBenefits = meal.ayurvedicBenefits || 'Ayurvedic benefits not specified'
        const ingredients = Array.isArray(meal.ingredients) ? meal.ingredients.join(', ') : 'Ingredients not specified'
        const cookingTime = meal.cookingTime || 'Time not specified'
        const difficulty = meal.difficulty || 'Not specified'
        const servings = meal.servings || 1
        const calories = meal.nutritionalInfo?.calories || 'N/A'
        const protein = meal.nutritionalInfo?.protein || 'N/A'
        
        const mealData = {
          recipes: [mealName],
          notes: `${cookingMethod}\n\nAyurvedic Benefits: ${ayurvedicBenefits}\n\nIngredients: ${ingredients}\n\nCooking Time: ${cookingTime}\nDifficulty: ${difficulty}\nServings: ${servings}\n\nNutrition (per serving): ${calories} cal, ${protein}g protein`
        }
        
        // Type-safe assignment
        if (mealType === 'breakfast' || mealType === 'lunch' || mealType === 'dinner') {
          dailyMeals[dayNumber][mealType] = mealData
        } else {
          // For optional meals
          (dailyMeals[dayNumber] as any)[mealType] = mealData
        }
      }
    })
  })

  return dailyMeals
}

// Helper function to calculate target calories
const calculateTargetCalories = (patient: Patient): number => {
  let baseCalories = 2000 // Default base
  
  // Adjust for age
  if (patient.age > 50) baseCalories *= 0.9
  if (patient.age < 25) baseCalories *= 1.1
  
  // Adjust for activity level
  switch (patient.lifestyle.activityLevel) {
    case 'sedentary': baseCalories *= 0.9; break
    case 'active': baseCalories *= 1.1; break
    case 'very-active': baseCalories *= 1.3; break
  }
  
  // Adjust for constitution
  switch (patient.constitution) {
    case 'vata': baseCalories *= 1.05; break
    case 'kapha': baseCalories *= 0.9; break
  }
  
  return Math.round(baseCalories)
}

// Helper function to get constitution-specific herbs
const getConstitutionHerbs = (constitution: string): string[] => {
  switch (constitution) {
    case 'vata':
      return ['Ashwagandha', 'Brahmi', 'Jatamansi', 'Ginger', 'Cinnamon']
    case 'pitta':
      return ['Amla', 'Neem', 'Guduchi', 'Coriander', 'Fennel']
    case 'kapha':
      return ['Trikatu', 'Guggul', 'Punarnava', 'Black pepper', 'Turmeric']
    default:
      return ['Triphala', 'Turmeric', 'Ginger', 'Cumin', 'Coriander']
  }
}

// Function to generate AI recipes
export const generateAIRecipe = async (params: {
  mealType: string
  constitution: string
  dietaryRestrictions?: string[]
  availableIngredients?: string[]
  cookingTime?: string
  difficulty?: string
  healthGoals?: string[]
}): Promise<AIGeneratedMeal | null> => {
  try {
    console.log('Generating AI recipe with params:', params)
    
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not found, using mock recipe')
      return generateMockRecipe(params)
    }

    const systemPrompt = `You are an expert Ayurvedic chef and nutritionist. Create authentic, healthy recipes that align with Ayurvedic principles and individual constitutional needs.

Guidelines:
- Use traditional Indian ingredients and cooking methods
- Consider dosha-balancing properties of ingredients
- Include appropriate spices for digestive health
- Provide practical, easy-to-follow recipes
- Focus on fresh, seasonal, and wholesome ingredients
- Balance taste, nutrition, and therapeutic benefits`

    const userPrompt = `Create an Ayurvedic recipe for:

Requirements:
- Meal Type: ${params.mealType}
- Constitution: ${params.constitution}
- Dietary Restrictions: ${params.dietaryRestrictions?.join(', ') || 'None'}
- Available Ingredients: ${params.availableIngredients?.join(', ') || 'Common Indian pantry items'}
- Preferred Cooking Time: ${params.cookingTime || 'Any'}
- Difficulty Level: ${params.difficulty || 'Any'}
- Health Goals: ${params.healthGoals?.join(', ') || 'General wellness'}

Respond in JSON format:
{
  "name": "Recipe name",
  "ingredients": ["ingredient with quantity", "ingredient with quantity"],
  "cookingMethod": "Step-by-step cooking instructions",
  "ayurvedicBenefits": "How this recipe benefits the constitution and health",
  "nutritionalInfo": {
    "calories": estimated_calories_per_serving,
    "protein": grams,
    "carbs": grams,
    "fat": grams,
    "fiber": grams
  },
  "cookingTime": "X minutes",
  "difficulty": "easy|medium|hard",
  "servings": number
}`

    console.log('Making OpenAI API call...')
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 1500,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      console.error('No response from OpenAI')
      return generateMockRecipe(params)
    }

    console.log('OpenAI response received:', response)

    // Parse the JSON response
    const cleanedResponse = response.replace(/```json\n?|\n?```/g, '').trim()
    console.log('Cleaned response:', cleanedResponse)
    
    const recipe = JSON.parse(cleanedResponse)
    console.log('Parsed recipe:', recipe)

    return recipe as AIGeneratedMeal

  } catch (error) {
    console.error('Error generating AI recipe:', error)
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack)
    }
    // Return mock recipe as fallback
    return generateMockRecipe(params)
  }
}

// Mock recipe generator for when OpenAI is not available
const generateMockRecipe = (params: {
  mealType: string
  constitution: string
  dietaryRestrictions?: string[]
  availableIngredients?: string[]
  cookingTime?: string
  difficulty?: string
  healthGoals?: string[]
}): AIGeneratedMeal => {
  console.log('Generating mock recipe for:', params)
  
  const recipes = {
    breakfast: {
      name: "Ayurvedic Oatmeal with Spices",
      ingredients: [
        "1 cup rolled oats",
        "2 cups water or milk",
        "1/4 tsp turmeric",
        "1/4 tsp cinnamon",
        "1 tsp ghee",
        "1 tbsp honey",
        "2 tbsp chopped almonds"
      ],
      cookingMethod: "1. Boil water/milk in a pot\n2. Add oats and cook for 5 minutes\n3. Add turmeric and cinnamon\n4. Stir in ghee\n5. Serve hot with honey and almonds",
      ayurvedicBenefits: `Perfect for ${params.constitution} constitution. Warming spices aid digestion and provide sustained energy. Turmeric reduces inflammation while cinnamon balances blood sugar.`,
      nutritionalInfo: {
        calories: 320,
        protein: 12,
        carbs: 45,
        fat: 10,
        fiber: 6
      },
      cookingTime: "15 minutes",
      difficulty: "easy" as const,
      servings: 2
    },
    lunch: {
      name: "Dosha-Balancing Dal with Rice",
      ingredients: [
        "1 cup yellow moong dal",
        "1/2 cup basmati rice",
        "1 tsp cumin seeds",
        "1 tsp turmeric",
        "2 tbsp ghee",
        "1 inch ginger",
        "Salt to taste",
        "Fresh cilantro"
      ],
      cookingMethod: "1. Wash and soak dal and rice\n2. Heat ghee, add cumin seeds\n3. Add ginger and turmeric\n4. Add dal, rice and water\n5. Cook until soft\n6. Garnish with cilantro",
      ayurvedicBenefits: `Ideal for ${params.constitution} constitution. Easy to digest protein and carbohydrates. Turmeric and ginger support digestion and reduce inflammation.`,
      nutritionalInfo: {
        calories: 280,
        protein: 14,
        carbs: 48,
        fat: 6,
        fiber: 8
      },
      cookingTime: "30 minutes",
      difficulty: "medium" as const,
      servings: 3
    },
    dinner: {
      name: "Healing Vegetable Soup",
      ingredients: [
        "2 cups mixed vegetables",
        "1 tsp ginger-garlic paste",
        "1/4 tsp turmeric",
        "1/4 tsp black pepper",
        "1 tbsp ghee",
        "Fresh herbs",
        "Rock salt to taste"
      ],
      cookingMethod: "1. Chop vegetables finely\n2. Heat ghee in a pot\n3. Add ginger-garlic paste\n4. Add vegetables and spices\n5. Add water and simmer\n6. Blend partially if desired\n7. Garnish with herbs",
      ayurvedicBenefits: `Light and nourishing for ${params.constitution}. Easy to digest evening meal that doesn't overload the digestive system. Warming spices kindle digestive fire.`,
      nutritionalInfo: {
        calories: 180,
        protein: 6,
        carbs: 25,
        fat: 7,
        fiber: 8
      },
      cookingTime: "25 minutes",
      difficulty: "easy" as const,
      servings: 2
    }
  }

  const defaultRecipe = recipes[params.mealType as keyof typeof recipes] || recipes.lunch
  
  return {
    ...defaultRecipe,
    difficulty: (params.difficulty as any) || defaultRecipe.difficulty,
    servings: parseInt(params.cookingTime || "2") || defaultRecipe.servings
  }
}
