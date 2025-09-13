"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Sparkles,
  Clock,
  Users,
  ChefHat,
  Loader2,
  Heart,
  Leaf,
  Zap,
  BookOpen,
  Utensils,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTranslation } from "@/components/translation-provider"
import { generateAIRecipe, type AIGeneratedMeal } from "@/lib/ai-diet-generator"
import { saveRecipe, type Recipe } from "@/lib/recipe-database"

export default function AIRecipeGeneratorPage() {
  const router = useRouter()
  const { language } = useTranslation()
  const [generating, setGenerating] = useState(false)
  const [generatedRecipe, setGeneratedRecipe] = useState<AIGeneratedMeal | null>(null)
  
  // Debug effect to track state changes
  useEffect(() => {
    console.log("Generated recipe state changed:", generatedRecipe)
  }, [generatedRecipe])

  useEffect(() => {
    console.log("Generating state changed:", generating)
  }, [generating])
  
  // Form state
  const [formData, setFormData] = useState({
    cuisine: "",
    mealType: "",
    constitution: "",
    ingredients: "",
    dietary: "",
    cookingTime: "",
    servings: "4",
    difficulty: "",
    healthGoals: "",
    avoidIngredients: "",
  })

  const handleGenerate = async () => {
    if (!formData.constitution || !formData.mealType) {
      alert("Please select at least constitution and meal type")
      return
    }

    console.log("Starting AI recipe generation...")
    setGenerating(true)
    try {
      const preferences = {
        mealType: formData.mealType,
        constitution: formData.constitution,
        dietaryRestrictions: formData.dietary.split(",").map(i => i.trim()).filter(Boolean),
        availableIngredients: formData.ingredients.split(",").map(i => i.trim()).filter(Boolean),
        cookingTime: formData.cookingTime || "30 minutes",
        difficulty: formData.difficulty || "medium",
        healthGoals: formData.healthGoals.split(",").map(i => i.trim()).filter(Boolean),
      }

      console.log("Calling generateAIRecipe with preferences:", preferences)
      const recipe = await generateAIRecipe(preferences)
      console.log("Received recipe from AI:", recipe)
      
      if (recipe) {
        console.log("Setting generated recipe state")
        setGeneratedRecipe(recipe)
      } else {
        console.error("AI recipe generation returned null")
        alert("Failed to generate recipe. Please try again.")
      }
    } catch (error) {
      console.error("Error generating recipe:", error)
      alert(`Error generating recipe: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your internet connection and try again.`)
    } finally {
      console.log("Setting generating to false")
      setGenerating(false)
    }
  }

  const handleSaveRecipe = () => {
    if (generatedRecipe) {
      // Convert AIGeneratedMeal to Recipe format
      const recipe: Recipe = {
        id: "",
        name: generatedRecipe.name,
        description: generatedRecipe.ayurvedicBenefits,
        category: formData.mealType as any,
        mealType: [formData.mealType as any],
        constitution: [formData.constitution as any],
        ingredients: generatedRecipe.ingredients.map(ing => ({
          name: ing,
          quantity: 1,
          unit: "piece"
        })),
        instructions: generatedRecipe.cookingMethod.split('\n'),
        cookingTime: parseInt(generatedRecipe.cookingTime) || 30,
        prepTime: 15,
        difficulty: generatedRecipe.difficulty,
        servings: generatedRecipe.servings,
        nutritionalInfo: {
          caloriesPerServing: generatedRecipe.nutritionalInfo.calories,
          protein: generatedRecipe.nutritionalInfo.protein,
          carbohydrates: generatedRecipe.nutritionalInfo.carbs,
          fat: generatedRecipe.nutritionalInfo.fat,
          fiber: generatedRecipe.nutritionalInfo.fiber,
          sugar: 0,
          sodium: 0,
          potassium: 0,
          vitamins: {},
          minerals: {}
        },
        ayurvedicProperties: {

          rasa: ['sweet'],
          virya: 'heating',
          vipaka: 'sweet',
          doshaEffect: {
            vata: 'neutral',
            pitta: 'neutral',
            kapha: 'neutral'
          },
          seasonalSuitability: ['summer'],
          therapeuticUses: [generatedRecipe.ayurvedicBenefits],
          contraindications: []
        },
        tags: [],
        images: [],
        author: "AI Generated",
        ratings: [],
        averageRating: 0,
        totalRatings: 0,
        isVegetarian: true,
        isVegan: false,
        isDairyFree: false,
        isGlutenFree: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        isAIGenerated: true
      }

      saveRecipe(recipe)
      router.push("/recipes")
    }
  }

  const content = {
    en: {
      title: "AI Recipe Generator",
      subtitle: "Create personalized Ayurvedic recipes using AI",
      backToRecipes: "Back to Recipes",
      generateRecipe: "Generate Recipe",
      saveRecipe: "Save Recipe",
      regenerate: "Generate Another",
      constitution: "Constitution",
      mealType: "Meal Type",
      cuisine: "Cuisine",
      ingredients: "Preferred Ingredients (comma-separated)",
      dietary: "Dietary Restrictions (comma-separated)",
      cookingTime: "Max Cooking Time (minutes)",
      servings: "Number of Servings",
      difficulty: "Difficulty Level",
      healthGoals: "Health Goals (comma-separated)",
      avoidIngredients: "Ingredients to Avoid (comma-separated)",
      generatedRecipe: "Generated Recipe",
      instructions: "Instructions",
      nutritionalInfo: "Nutritional Information",
      ayurvedicProperties: "Ayurvedic Properties",
      breakfast: "Breakfast",
      lunch: "Lunch", 
      dinner: "Dinner",
      snack: "Snack",
      beverage: "Beverage",
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
      minutes: "minutes",
      servingsUnit: "servings",
      rating: "Rating",
      suitableFor: "Suitable For",
      benefits: "Benefits",
      effects: "Effects",
      calories: "Calories",
      protein: "Protein",
      carbs: "Carbohydrates",
      fat: "Fat",
      perServing: "per serving",
    },
    hi: {
      title: "AI व्यंजन जनरेटर",
      subtitle: "AI का उपयोग करके व्यक्तिगत आयुर्वेदिक व्यंजन बनाएं",
      backToRecipes: "व्यंजनों पर वापस जाएं",
      generateRecipe: "व्यंजन बनाएं",
      saveRecipe: "व्यंजन सेव करें",
      regenerate: "दूसरा जनरेट करें",
      constitution: "प्रकृति",
      mealType: "भोजन का प्रकार",
      cuisine: "व्यंजन",
      ingredients: "पसंदीदा सामग्री (कॉमा से अलग करें)",
      dietary: "आहार प्रतिबंध (कॉमा से अलग करें)",
      cookingTime: "अधिकतम पकाने का समय (मिनट)",
      servings: "सर्विंग्स की संख्या",
      difficulty: "कठिनाई स्तर",
      healthGoals: "स्वास्थ्य लक्ष्य (कॉमा से अलग करें)",
      avoidIngredients: "बचने वाली सामग्री (कॉमा से अलग करें)",
      generatedRecipe: "जनरेट किया गया व्यंजन",
      instructions: "निर्देश",
      nutritionalInfo: "पोषण संबंधी जानकारी",
      ayurvedicProperties: "आयुर्वेदिक गुण",
      breakfast: "नाश्ता",
      lunch: "दोपहर का खाना",
      dinner: "रात का खाना",
      snack: "नाश्ता",
      beverage: "पेय",
      easy: "आसान",
      medium: "मध्यम",
      hard: "कठिन",
      minutes: "मिनट",
      servingsUnit: "सर्विंग्स",
      rating: "रेटिंग",
      suitableFor: "उपयुक्त",
      benefits: "फायदे",
      effects: "प्रभाव",
      calories: "कैलोरी",
      protein: "प्रोटीन",
      carbs: "कार्बोहाइड्रेट",
      fat: "वसा",
      perServing: "प्रति सर्विंग",
    },
  }

  const currentContent = content[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Link href="/recipes">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {currentContent.backToRecipes}
              </Button>
            </Link>
            <Sparkles className="h-8 w-8 text-primary mr-3" />
            <h1 className={`text-4xl font-bold text-primary ${language === "hi" ? "font-devanagari" : ""}`}>
              {currentContent.title}
            </h1>
          </div>
          <p className={`text-muted-foreground text-lg ${language === "hi" ? "font-devanagari" : ""}`}>
            {currentContent.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Generator Form */}
          <Card>
            <CardHeader>
              <CardTitle className={language === "hi" ? "font-devanagari" : ""}>
                Recipe Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Constitution */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className={language === "hi" ? "font-devanagari" : ""}>
                    {currentContent.constitution} *
                  </Label>
                  <Select value={formData.constitution} onValueChange={(value) => setFormData({...formData, constitution: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select constitution" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vata">Vata</SelectItem>
                      <SelectItem value="pitta">Pitta</SelectItem>
                      <SelectItem value="kapha">Kapha</SelectItem>
                      <SelectItem value="vata-pitta">Vata-Pitta</SelectItem>
                      <SelectItem value="pitta-kapha">Pitta-Kapha</SelectItem>
                      <SelectItem value="vata-kapha">Vata-Kapha</SelectItem>
                      <SelectItem value="tridoshic">Tridoshic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Meal Type */}
                <div>
                  <Label className={language === "hi" ? "font-devanagari" : ""}>
                    {currentContent.mealType} *
                  </Label>
                  <Select value={formData.mealType} onValueChange={(value) => setFormData({...formData, mealType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select meal type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">{currentContent.breakfast}</SelectItem>
                      <SelectItem value="lunch">{currentContent.lunch}</SelectItem>
                      <SelectItem value="dinner">{currentContent.dinner}</SelectItem>
                      <SelectItem value="snack">{currentContent.snack}</SelectItem>
                      <SelectItem value="beverage">{currentContent.beverage}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Servings and Cooking Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className={language === "hi" ? "font-devanagari" : ""}>
                    {currentContent.servings}
                  </Label>
                  <Input
                    type="number"
                    value={formData.servings}
                    onChange={(e) => setFormData({...formData, servings: e.target.value})}
                    placeholder="4"
                  />
                </div>

                <div>
                  <Label className={language === "hi" ? "font-devanagari" : ""}>
                    {currentContent.cookingTime}
                  </Label>
                  <Input
                    value={formData.cookingTime}
                    onChange={(e) => setFormData({...formData, cookingTime: e.target.value})}
                    placeholder="30 minutes"
                  />
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <Label className={language === "hi" ? "font-devanagari" : ""}>
                  {currentContent.difficulty}
                </Label>
                <Select value={formData.difficulty} onValueChange={(value) => setFormData({...formData, difficulty: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">{currentContent.easy}</SelectItem>
                    <SelectItem value="medium">{currentContent.medium}</SelectItem>
                    <SelectItem value="hard">{currentContent.hard}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Ingredients */}
              <div>
                <Label className={language === "hi" ? "font-devanagari" : ""}>
                  {currentContent.ingredients}
                </Label>
                <Textarea
                  value={formData.ingredients}
                  onChange={(e) => setFormData({...formData, ingredients: e.target.value})}
                  placeholder="rice, dal, vegetables, spices..."
                  rows={3}
                />
              </div>

              {/* Dietary Restrictions */}
              <div>
                <Label className={language === "hi" ? "font-devanagari" : ""}>
                  {currentContent.dietary}
                </Label>
                <Textarea
                  value={formData.dietary}
                  onChange={(e) => setFormData({...formData, dietary: e.target.value})}
                  placeholder="vegetarian, gluten-free, dairy-free..."
                  rows={2}
                />
              </div>

              {/* Health Goals */}
              <div>
                <Label className={language === "hi" ? "font-devanagari" : ""}>
                  {currentContent.healthGoals}
                </Label>
                <Textarea
                  value={formData.healthGoals}
                  onChange={(e) => setFormData({...formData, healthGoals: e.target.value})}
                  placeholder="weight management, immunity, digestion..."
                  rows={2}
                />
              </div>

              <Button 
                onClick={handleGenerate} 
                disabled={generating || !formData.constitution || !formData.mealType}
                className={`w-full ${language === "hi" ? "font-devanagari" : ""}`}
              >
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {currentContent.generateRecipe}
                  </>
                )}
              </Button>
              
              {/* Debug button for testing */}
              <Button 
                onClick={() => {
                  console.log("Test button clicked")
                  const testRecipe = {
                    name: "Test Recipe",
                    ingredients: ["1 cup rice", "2 cups water"],
                    cookingMethod: "Cook rice with water",
                    ayurvedicBenefits: "Good for testing",
                    nutritionalInfo: {
                      calories: 200,
                      protein: 4,
                      carbs: 45,
                      fat: 1,
                      fiber: 2
                    },
                    cookingTime: "20 minutes",
                    difficulty: "easy" as const,
                    servings: 2
                  }
                  console.log("Setting test recipe:", testRecipe)
                  setGeneratedRecipe(testRecipe)
                }}
                variant="outline"
                className="w-full mt-2"
              >
                Test Recipe (Debug)
              </Button>
            </CardContent>
          </Card>

          {/* Generated Recipe */}
          {generatedRecipe ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                    <ChefHat className="h-5 w-5" />
                    <span>{generatedRecipe.name}</span>
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Badge variant="secondary">
                      {generatedRecipe.difficulty}
                    </Badge>
                    <Badge variant="outline">
                      Ayurvedic Recipe
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">{/* Recipe content continues... */}
                {/* Recipe Info */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <Clock className="h-4 w-4 mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Cooking Time</p>
                    <p className="font-medium">{generatedRecipe.cookingTime}</p>
                  </div>
                  <div className="text-center">
                    <Users className="h-4 w-4 mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Servings</p>
                    <p className="font-medium">{generatedRecipe.servings}</p>
                  </div>
                  <div className="text-center">
                    <Zap className="h-4 w-4 mx-auto mb-1" />
                    <p className="text-xs text-muted-foreground">Calories</p>
                    <p className="font-medium">{generatedRecipe.nutritionalInfo.calories}</p>
                  </div>
                </div>

                {/* Ingredients */}
                <div>
                  <h4 className={`font-semibold text-lg mb-3 flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                    <Utensils className="h-4 w-4" />
                    <span>Ingredients</span>
                  </h4>
                  <ul className="space-y-2">
                    {generatedRecipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                        <span>{ingredient}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions */}
                <div>
                  <h4 className={`font-semibold text-lg mb-3 flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                    <BookOpen className="h-4 w-4" />
                    <span>{currentContent.instructions}</span>
                  </h4>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm whitespace-pre-wrap">{generatedRecipe.cookingMethod}</p>
                  </div>
                </div>

                {/* Ayurvedic Properties */}
                {generatedRecipe.ayurvedicBenefits && (
                  <div>
                    <h4 className={`font-semibold text-lg mb-3 flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                      <Leaf className="h-4 w-4" />
                      <span>{currentContent.benefits}</span>
                    </h4>
                    <div className="flex items-start space-x-2 bg-muted/50 p-4 rounded-lg">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2"></div>
                      <span className="text-sm">{generatedRecipe.ayurvedicBenefits}</span>
                    </div>
                  </div>
                )}

                {/* Nutritional Info */}
                <div>
                  <h4 className={`font-semibold text-lg mb-3 flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                    <Heart className="h-4 w-4" />
                    <span>{currentContent.nutritionalInfo}</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground">{currentContent.protein}</p>
                      <p className="font-semibold">{generatedRecipe.nutritionalInfo.protein}g</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground">{currentContent.carbs}</p>
                      <p className="font-semibold">{generatedRecipe.nutritionalInfo.carbs}g</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground">{currentContent.fat}</p>
                      <p className="font-semibold">{generatedRecipe.nutritionalInfo.fat}g</p>
                    </div>
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <p className="text-xs text-muted-foreground">Fiber</p>
                      <p className="font-semibold">{generatedRecipe.nutritionalInfo.fiber}g</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <Button onClick={handleSaveRecipe} className="flex-1">
                    <Heart className="mr-2 h-4 w-4" />
                    {currentContent.saveRecipe}
                  </Button>
                  <Button onClick={handleGenerate} variant="outline" disabled={generating}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {currentContent.regenerate}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">
                  Generate a recipe to see it here
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
