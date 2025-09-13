"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Activity,
  Languages,
  ArrowLeft,
  Clock,
  Users,
  ChefHat,
  Flame,
  Snowflake,
  Leaf,
  Timer,
  Star,
} from "lucide-react"
import Link from "next/link"
import { getRecipeById, type Recipe } from "@/lib/recipe-database"

export default function RecipeDetailPage() {
  const params = useParams()
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [language, setLanguage] = useState<"en" | "hi">("en")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      const foundRecipe = getRecipeById(params.id as string)
      setRecipe(foundRecipe)
      setLoading(false)
    }
  }, [params.id])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "hard": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getEffectIcon = (virya: 'heating' | 'cooling') => {
    if (virya === "heating") return <Flame className="h-4 w-4 text-red-500" />
    if (virya === "cooling") return <Snowflake className="h-4 w-4 text-blue-500" />
    return <Leaf className="h-4 w-4 text-green-500" />
  }

  const getDoshaColor = (dosha: string) => {
    switch (dosha) {
      case "vata": return "bg-blue-100 text-blue-800"
      case "pitta": return "bg-red-100 text-red-800"
      case "kapha": return "bg-green-100 text-green-800"
      case "tridoshic": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getTasteColor = (taste: string) => {
    const lowerTaste = taste.toLowerCase()
    if (lowerTaste.includes("sweet")) return "bg-yellow-100 text-yellow-800"
    if (lowerTaste.includes("sour")) return "bg-orange-100 text-orange-800"
    if (lowerTaste.includes("salty")) return "bg-blue-100 text-blue-800"
    if (lowerTaste.includes("pungent")) return "bg-red-100 text-red-800"
    if (lowerTaste.includes("bitter")) return "bg-green-100 text-green-800"
    if (lowerTaste.includes("astringent")) return "bg-purple-100 text-purple-800"
    return "bg-gray-100 text-gray-800"
  }

  const content = {
    en: {
      title: "Recipe Details",
      prepTime: "Prep Time",
      cookTime: "Cook Time",
      totalTime: "Total Time",
      servings: "Servings",
      difficulty: "Difficulty",
      cuisine: "Cuisine",
      category: "Category",
      ingredients: "Ingredients",
      instructions: "Instructions",
      nutrition: "Nutritional Information",
      ayurvedic: "Ayurvedic Properties",
      calories: "Calories",
      protein: "Protein",
      carbs: "Carbohydrates",
      fat: "Fat",
      fiber: "Fiber",
      dosha: "Primary Dosha",
      tastes: "Tastes (Rasa)",
      effect: "Thermal Effect",
      season: "Best Season",
      timeOfDay: "Best Time",
      tags: "Tags",
      minutes: "min",
      grams: "g",
      perServing: "per serving",
      step: "Step",
    },
    hi: {
      title: "रेसिपी विवरण",
      prepTime: "तैयारी का समय",
      cookTime: "पकाने का समय",
      totalTime: "कुल समय",
      servings: "सर्विंग्स",
      difficulty: "कठिनाई",
      cuisine: "व्यंजन",
      category: "श्रेणी",
      ingredients: "सामग्री",
      instructions: "निर्देश",
      nutrition: "पोषण संबंधी जानकारी",
      ayurvedic: "आयुर्वेदिक गुण",
      calories: "कैलोरी",
      protein: "प्रोटीन",
      carbs: "कार्बोहाइड्रेट",
      fat: "वसा",
      fiber: "फाइबर",
      dosha: "मुख्य दोष",
      tastes: "स्वाद (रस)",
      effect: "तापीय प्रभाव",
      season: "सबसे अच्छा मौसम",
      timeOfDay: "सबसे अच्छा समय",
      tags: "टैग",
      minutes: "मिनट",
      grams: "ग्राम",
      perServing: "प्रति सर्विंग",
      step: "चरण",
    },
  }

  const currentContent = content[language]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p>Loading recipe...</p>
        </div>
      </div>
    )
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Recipe not found</h2>
          <Link href="/recipes">
            <Button>Back to Recipes</Button>
          </Link>
        </div>
      </div>
    )
  }

  const totalTime = recipe.prepTime + recipe.cookingTime

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <Activity className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-primary">AyurDiet</h1>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage(language === "en" ? "hi" : "en")}
                className="flex items-center space-x-2"
              >
                <Languages className="h-4 w-4" />
                <span>{language === "en" ? "हिंदी" : "English"}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/recipes">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-4">{recipe.name}</h1>
              <p className="text-muted-foreground text-lg mb-4">{recipe.description}</p>
              
              {/* Recipe Meta */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="capitalize">{recipe.category}</Badge>
                <Badge variant="outline" className="capitalize">{recipe.category}</Badge>
                <Badge className={getDifficultyColor(recipe.difficulty)} variant="secondary">
                  {recipe.difficulty}
                </Badge>
                <Badge variant="secondary">
                  {recipe.ayurvedicProperties.virya}
                </Badge>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Timer className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{recipe.prepTime} {currentContent.minutes}</p>
                    <p className="text-muted-foreground">{currentContent.prepTime}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{recipe.cookingTime} {currentContent.minutes}</p>
                    <p className="text-muted-foreground">{currentContent.cookTime}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{recipe.servings}</p>
                    <p className="text-muted-foreground">{currentContent.servings}</p>
                  </div>
                </div>
                {recipe.ayurvedicProperties?.virya && (
                  <div className="flex items-center space-x-2">
                    {getEffectIcon(recipe.ayurvedicProperties.virya)}
                    <div>
                      <p className="font-medium capitalize">{recipe.ayurvedicProperties.virya}</p>
                      <p className="text-muted-foreground">{currentContent.effect}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ingredients */}
            {recipe.ingredients && recipe.ingredients.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                    <ChefHat className="h-5 w-5" />
                    <span>{currentContent.ingredients}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                        <span>
                          {ingredient.quantity} {ingredient.unit} <strong>{ingredient.name}</strong>
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Instructions */}
            {recipe.instructions && recipe.instructions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className={language === "hi" ? "font-devanagari" : ""}>{currentContent.instructions}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-4">
                    {recipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </div>
                        <p className="flex-1 mt-1">{instruction}</p>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Nutrition */}
            {recipe.nutritionalInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className={language === "hi" ? "font-devanagari" : ""}>{currentContent.nutrition}</CardTitle>
                  <p className="text-sm text-muted-foreground">{currentContent.perServing}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className={language === "hi" ? "font-devanagari" : ""}>{currentContent.calories}</span>
                      <span className="font-medium">{Math.round(recipe.nutritionalInfo.caloriesPerServing || 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={language === "hi" ? "font-devanagari" : ""}>{currentContent.protein}</span>
                      <span className="font-medium">{Math.round(recipe.nutritionalInfo.protein || 0)}{currentContent.grams}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={language === "hi" ? "font-devanagari" : ""}>{currentContent.carbs}</span>
                      <span className="font-medium">{Math.round(recipe.nutritionalInfo.carbohydrates || 0)}{currentContent.grams}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={language === "hi" ? "font-devanagari" : ""}>{currentContent.fat}</span>
                      <span className="font-medium">{Math.round(recipe.nutritionalInfo.fat || 0)}{currentContent.grams}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={language === "hi" ? "font-devanagari" : ""}>{currentContent.fiber}</span>
                      <span className="font-medium">{Math.round(recipe.nutritionalInfo.fiber || 0)}{currentContent.grams}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ayurvedic Properties */}
            {recipe.ayurvedicProperties && (
              <Card>
                <CardHeader>
                  <CardTitle className={language === "hi" ? "font-devanagari" : ""}>{currentContent.ayurvedic}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className={`text-sm font-medium mb-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                      Thermal Effect
                    </p>
                    <Badge variant="secondary">
                      {recipe.ayurvedicProperties.virya}
                    </Badge>
                  </div>

                  {recipe.ayurvedicProperties.rasa && recipe.ayurvedicProperties.rasa.length > 0 && (
                    <div>
                      <p className={`text-sm font-medium mb-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                        {currentContent.tastes}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {recipe.ayurvedicProperties.rasa.map((taste, index) => (
                          <Badge key={index} className={getTasteColor(taste)} variant="secondary">
                            {taste}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <p className={`text-sm font-medium mb-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                      Thermal Effect
                    </p>
                    <div className="flex items-center space-x-2">
                      {getEffectIcon(recipe.ayurvedicProperties.virya)}
                      <span className="capitalize">{recipe.ayurvedicProperties.virya}</span>
                    </div>
                  </div>

                  {recipe.ayurvedicProperties.seasonalSuitability && recipe.ayurvedicProperties.seasonalSuitability.length > 0 && (
                    <div>
                      <p className={`text-sm font-medium mb-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                        {currentContent.season}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {recipe.ayurvedicProperties.seasonalSuitability.map((season, index) => (
                          <Badge key={index} variant="outline" className="capitalize">
                            {season}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {recipe.mealType && recipe.mealType.length > 0 && (
                    <div>
                      <p className={`text-sm font-medium mb-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                        {currentContent.timeOfDay}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {recipe.mealType.map((meal, index) => (
                          <Badge key={index} variant="outline" className="capitalize">
                            {meal}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Tags */}
            {recipe.tags && recipe.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className={language === "hi" ? "font-devanagari" : ""}>{currentContent.tags}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags.map((tag, index) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Recipe Meta */}
            <Card>
              <CardHeader>
                <CardTitle>Recipe Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created by:</span>
                  <span className="font-medium capitalize">{recipe.author}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium">{new Date(recipe.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last updated:</span>
                  <span className="font-medium">{new Date(recipe.updatedAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
