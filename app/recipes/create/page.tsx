"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Activity,
  Languages,
  ArrowLeft,
  Save,
  Plus,
  X,
  ChefHat,
  Clock,
  Users,
} from "lucide-react"
import Link from "next/link"
import { saveRecipe, generateId, type Recipe } from "@/lib/database"

export default function CreateRecipePage() {
  const router = useRouter()
  const [language, setLanguage] = useState<"en" | "hi">("en")
  const [loading, setLoading] = useState(false)

  const [recipe, setRecipe] = useState<Partial<Recipe>>({
    name: "",
    description: "",
    category: "lunch",
    cuisineType: "indian",
    ingredients: [],
    instructions: [],
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    nutrition: {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      fiber: 0,
      sugar: 0,
      sodium: 0,
      calcium: 0,
      iron: 0,
      vitaminC: 0,
      vitaminD: 0,
      vitaminB12: 0,
      omega3: 0,
    },
    ayurvedicProperties: {
      dosha: "tridoshic",
      rasa: [],
      effect: "neutral",
      season: "all",
      timeOfDay: "anytime",
    },
    difficulty: "medium",
    tags: [],
  })

  const [newIngredient, setNewIngredient] = useState({
    food: "",
    quantity: 1,
    unit: "cup",
  })

  const [newInstruction, setNewInstruction] = useState("")
  const [newTag, setNewTag] = useState("")
  const [newRasa, setNewRasa] = useState("")

  const handleInputChange = (field: string, value: any) => {
    setRecipe((prev) => ({ ...prev, [field]: value }))
  }

  const handleNutritionChange = (field: string, value: number) => {
    setRecipe((prev) => ({
      ...prev,
      nutrition: { ...prev.nutrition!, [field]: value },
    }))
  }

  const handleAyurvedicChange = (field: string, value: any) => {
    setRecipe((prev) => ({
      ...prev,
      ayurvedicProperties: { ...prev.ayurvedicProperties!, [field]: value },
    }))
  }

  const addIngredient = () => {
    if (newIngredient.food.trim()) {
      setRecipe((prev) => ({
        ...prev,
        ingredients: [...(prev.ingredients || []), { ...newIngredient }],
      }))
      setNewIngredient({ food: "", quantity: 1, unit: "cup" })
    }
  }

  const removeIngredient = (index: number) => {
    setRecipe((prev) => ({
      ...prev,
      ingredients: prev.ingredients?.filter((_, i) => i !== index) || [],
    }))
  }

  const addInstruction = () => {
    if (newInstruction.trim()) {
      setRecipe((prev) => ({
        ...prev,
        instructions: [...(prev.instructions || []), newInstruction.trim()],
      }))
      setNewInstruction("")
    }
  }

  const removeInstruction = (index: number) => {
    setRecipe((prev) => ({
      ...prev,
      instructions: prev.instructions?.filter((_, i) => i !== index) || [],
    }))
  }

  const addTag = () => {
    if (newTag.trim() && !recipe.tags?.includes(newTag.trim())) {
      setRecipe((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tag: string) => {
    setRecipe((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag) || [],
    }))
  }

  const addRasa = () => {
    if (newRasa.trim() && !recipe.ayurvedicProperties?.rasa.includes(newRasa.trim())) {
      setRecipe((prev) => ({
        ...prev,
        ayurvedicProperties: {
          ...prev.ayurvedicProperties!,
          rasa: [...(prev.ayurvedicProperties?.rasa || []), newRasa.trim()],
        },
      }))
      setNewRasa("")
    }
  }

  const removeRasa = (rasa: string) => {
    setRecipe((prev) => ({
      ...prev,
      ayurvedicProperties: {
        ...prev.ayurvedicProperties!,
        rasa: prev.ayurvedicProperties?.rasa.filter((r) => r !== rasa) || [],
      },
    }))
  }

  const handleSave = async () => {
    if (!recipe.name?.trim() || !recipe.ingredients?.length || !recipe.instructions?.length) {
      alert("Please fill in all required fields: name, ingredients, and instructions.")
      return
    }

    setLoading(true)
    try {
      const newRecipe: Recipe = {
        ...recipe,
        id: generateId(),
        createdBy: "dietician", // In a real app, this would be the logged-in user
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Recipe

      saveRecipe(newRecipe)
      router.push("/recipes")
    } catch (error) {
      console.error("Error saving recipe:", error)
      alert("Error saving recipe. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const content = {
    en: {
      title: "Create New Recipe",
      subtitle: "Add a new Ayurvedic recipe with nutritional and therapeutic properties",
      save: "Save Recipe",
      cancel: "Cancel",
      basicInfo: "Basic Information",
      name: "Recipe Name",
      description: "Description",
      category: "Category",
      cuisine: "Cuisine Type",
      difficulty: "Difficulty",
      timing: "Timing & Servings",
      prepTime: "Prep Time (minutes)",
      cookTime: "Cook Time (minutes)",
      servings: "Servings",
      ingredients: "Ingredients",
      addIngredient: "Add Ingredient",
      ingredient: "Ingredient",
      quantity: "Quantity",
      unit: "Unit",
      instructions: "Instructions",
      addInstruction: "Add Instruction",
      instruction: "Instruction",
      nutrition: "Nutritional Information",
      calories: "Calories",
      protein: "Protein (g)",
      carbs: "Carbohydrates (g)",
      fat: "Fat (g)",
      fiber: "Fiber (g)",
      ayurvedic: "Ayurvedic Properties",
      dosha: "Primary Dosha",
      rasa: "Tastes (Rasa)",
      addRasa: "Add Taste",
      effect: "Thermal Effect",
      season: "Best Season",
      timeOfDay: "Best Time of Day",
      tags: "Tags",
      addTag: "Add Tag",
      saving: "Saving...",
    },
    hi: {
      title: "नई रेसिपी बनाएं",
      subtitle: "पोषण और चिकित्सीय गुणों के साथ नई आयुर्वेदिक रेसिपी जोड़ें",
      save: "रेसिपी सेव करें",
      cancel: "रद्द करें",
      basicInfo: "बुनियादी जानकारी",
      name: "रेसिपी का नाम",
      description: "विवरण",
      category: "श्रेणी",
      cuisine: "व्यंजन प्रकार",
      difficulty: "कठिनाई",
      timing: "समय और सर्विंग्स",
      prepTime: "तैयारी का समय (मिनट)",
      cookTime: "पकाने का समय (मिनट)",
      servings: "सर्विंग्स",
      ingredients: "सामग्री",
      addIngredient: "सामग्री जोड़ें",
      ingredient: "सामग्री",
      quantity: "मात्रा",
      unit: "इकाई",
      instructions: "निर्देश",
      addInstruction: "निर्देश जोड़ें",
      instruction: "निर्देश",
      nutrition: "पोषण संबंधी जानकारी",
      calories: "कैलोरी",
      protein: "प्रोटीन (ग्राम)",
      carbs: "कार्बोहाइड्रेट (ग्राम)",
      fat: "वसा (ग्राम)",
      fiber: "फाइबर (ग्राम)",
      ayurvedic: "आयुर्वेदिक गुण",
      dosha: "मुख्य दोष",
      rasa: "स्वाद (रस)",
      addRasa: "स्वाद जोड़ें",
      effect: "तापीय प्रभाव",
      season: "सबसे अच्छा मौसम",
      timeOfDay: "दिन का सबसे अच्छा समय",
      tags: "टैग",
      addTag: "टैग जोड़ें",
      saving: "सेव कर रहे हैं...",
    },
  }

  const currentContent = content[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <Activity className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-primary">AhaarWISE</h1>
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
          <h1 className={`text-4xl font-bold mb-2 ${language === "hi" ? "font-devanagari" : ""}`}>
            {currentContent.title}
          </h1>
          <p className={`text-muted-foreground text-lg ${language === "hi" ? "font-devanagari" : ""}`}>
            {currentContent.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                  <ChefHat className="h-5 w-5" />
                  <span>{currentContent.basicInfo}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className={language === "hi" ? "font-devanagari" : ""}>{currentContent.name} *</Label>
                  <Input
                    value={recipe.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter recipe name"
                  />
                </div>

                <div className="space-y-2">
                  <Label className={language === "hi" ? "font-devanagari" : ""}>{currentContent.description}</Label>
                  <Textarea
                    value={recipe.description || ""}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Brief description of the recipe"
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className={language === "hi" ? "font-devanagari" : ""}>{currentContent.category}</Label>
                    <Select
                      value={recipe.category}
                      onValueChange={(value) => handleInputChange("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breakfast">Breakfast</SelectItem>
                        <SelectItem value="lunch">Lunch</SelectItem>
                        <SelectItem value="dinner">Dinner</SelectItem>
                        <SelectItem value="snack">Snack</SelectItem>
                        <SelectItem value="beverage">Beverage</SelectItem>
                        <SelectItem value="dessert">Dessert</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className={language === "hi" ? "font-devanagari" : ""}>{currentContent.cuisine}</Label>
                    <Select
                      value={recipe.cuisineType}
                      onValueChange={(value) => handleInputChange("cuisineType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="indian">Indian</SelectItem>
                        <SelectItem value="continental">Continental</SelectItem>
                        <SelectItem value="chinese">Chinese</SelectItem>
                        <SelectItem value="mediterranean">Mediterranean</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className={language === "hi" ? "font-devanagari" : ""}>{currentContent.difficulty}</Label>
                  <Select
                    value={recipe.difficulty}
                    onValueChange={(value) => handleInputChange("difficulty", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Timing & Servings */}
            <Card>
              <CardHeader>
                <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                  <Clock className="h-5 w-5" />
                  <span>{currentContent.timing}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className={language === "hi" ? "font-devanagari" : ""}>{currentContent.prepTime}</Label>
                    <Input
                      type="number"
                      value={recipe.prepTime || 0}
                      onChange={(e) => handleInputChange("prepTime", Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className={language === "hi" ? "font-devanagari" : ""}>{currentContent.cookTime}</Label>
                    <Input
                      type="number"
                      value={recipe.cookTime || 0}
                      onChange={(e) => handleInputChange("cookTime", Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className={language === "hi" ? "font-devanagari" : ""}>{currentContent.servings}</Label>
                    <Input
                      type="number"
                      value={recipe.servings || 0}
                      onChange={(e) => handleInputChange("servings", Number(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ingredients */}
            <Card>
              <CardHeader>
                <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                  <Users className="h-5 w-5" />
                  <span>{currentContent.ingredients} *</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-4 gap-2">
                  <Input
                    placeholder={currentContent.ingredient}
                    value={newIngredient.food}
                    onChange={(e) => setNewIngredient((prev) => ({ ...prev, food: e.target.value }))}
                  />
                  <Input
                    type="number"
                    placeholder={currentContent.quantity}
                    value={newIngredient.quantity}
                    onChange={(e) => setNewIngredient((prev) => ({ ...prev, quantity: Number(e.target.value) }))}
                  />
                  <Select
                    value={newIngredient.unit}
                    onValueChange={(value) => setNewIngredient((prev) => ({ ...prev, unit: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cup">Cup</SelectItem>
                      <SelectItem value="tbsp">Tablespoon</SelectItem>
                      <SelectItem value="tsp">Teaspoon</SelectItem>
                      <SelectItem value="g">Grams</SelectItem>
                      <SelectItem value="kg">Kilograms</SelectItem>
                      <SelectItem value="ml">Milliliters</SelectItem>
                      <SelectItem value="l">Liters</SelectItem>
                      <SelectItem value="piece">Piece</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={addIngredient} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {recipe.ingredients?.map((ingredient, index) => (
                    <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                      <span>
                        {ingredient.quantity} {ingredient.unit} {ingredient.food}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeIngredient(index)}
                        className="text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                  <span>{currentContent.instructions} *</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Textarea
                    placeholder={currentContent.instruction}
                    value={newInstruction}
                    onChange={(e) => setNewInstruction(e.target.value)}
                    rows={2}
                    className="flex-1"
                  />
                  <Button onClick={addInstruction} size="sm" className="mt-auto">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {recipe.instructions?.map((instruction, index) => (
                    <div key={index} className="flex items-start justify-between bg-muted p-2 rounded">
                      <span className="flex-1">
                        {index + 1}. {instruction}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeInstruction(index)}
                        className="text-destructive ml-2"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Nutrition */}
            <Card>
              <CardHeader>
                <CardTitle className={language === "hi" ? "font-devanagari" : ""}>{currentContent.nutrition}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className={language === "hi" ? "font-devanagari" : ""}>{currentContent.calories}</Label>
                    <Input
                      type="number"
                      value={recipe.nutrition?.calories || 0}
                      onChange={(e) => handleNutritionChange("calories", Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className={language === "hi" ? "font-devanagari" : ""}>{currentContent.protein}</Label>
                    <Input
                      type="number"
                      value={recipe.nutrition?.protein || 0}
                      onChange={(e) => handleNutritionChange("protein", Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className={language === "hi" ? "font-devanagari" : ""}>{currentContent.carbs}</Label>
                    <Input
                      type="number"
                      value={recipe.nutrition?.carbohydrates || 0}
                      onChange={(e) => handleNutritionChange("carbohydrates", Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className={language === "hi" ? "font-devanagari" : ""}>{currentContent.fat}</Label>
                    <Input
                      type="number"
                      value={recipe.nutrition?.fat || 0}
                      onChange={(e) => handleNutritionChange("fat", Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className={language === "hi" ? "font-devanagari" : ""}>{currentContent.fiber}</Label>
                    <Input
                      type="number"
                      value={recipe.nutrition?.fiber || 0}
                      onChange={(e) => handleNutritionChange("fiber", Number(e.target.value))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ayurvedic Properties */}
            <Card>
              <CardHeader>
                <CardTitle className={language === "hi" ? "font-devanagari" : ""}>{currentContent.ayurvedic}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className={language === "hi" ? "font-devanagari" : ""}>{currentContent.dosha}</Label>
                    <Select
                      value={recipe.ayurvedicProperties?.dosha}
                      onValueChange={(value) => handleAyurvedicChange("dosha", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vata">Vata</SelectItem>
                        <SelectItem value="pitta">Pitta</SelectItem>
                        <SelectItem value="kapha">Kapha</SelectItem>
                        <SelectItem value="tridoshic">Tridoshic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className={language === "hi" ? "font-devanagari" : ""}>{currentContent.effect}</Label>
                    <Select
                      value={recipe.ayurvedicProperties?.effect}
                      onValueChange={(value) => handleAyurvedicChange("effect", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="heating">Heating</SelectItem>
                        <SelectItem value="cooling">Cooling</SelectItem>
                        <SelectItem value="neutral">Neutral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className={language === "hi" ? "font-devanagari" : ""}>{currentContent.season}</Label>
                    <Select
                      value={recipe.ayurvedicProperties?.season}
                      onValueChange={(value) => handleAyurvedicChange("season", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spring">Spring</SelectItem>
                        <SelectItem value="summer">Summer</SelectItem>
                        <SelectItem value="autumn">Autumn</SelectItem>
                        <SelectItem value="winter">Winter</SelectItem>
                        <SelectItem value="all">All Seasons</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className={language === "hi" ? "font-devanagari" : ""}>{currentContent.timeOfDay}</Label>
                    <Select
                      value={recipe.ayurvedicProperties?.timeOfDay}
                      onValueChange={(value) => handleAyurvedicChange("timeOfDay", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning</SelectItem>
                        <SelectItem value="noon">Noon</SelectItem>
                        <SelectItem value="evening">Evening</SelectItem>
                        <SelectItem value="night">Night</SelectItem>
                        <SelectItem value="anytime">Anytime</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Rasa (Tastes) */}
                <div className="space-y-2">
                  <Label className={language === "hi" ? "font-devanagari" : ""}>{currentContent.rasa}</Label>
                  <div className="flex space-x-2">
                    <Select value={newRasa} onValueChange={setNewRasa}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select taste" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sweet">Sweet</SelectItem>
                        <SelectItem value="sour">Sour</SelectItem>
                        <SelectItem value="salty">Salty</SelectItem>
                        <SelectItem value="pungent">Pungent</SelectItem>
                        <SelectItem value="bitter">Bitter</SelectItem>
                        <SelectItem value="astringent">Astringent</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={addRasa} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recipe.ayurvedicProperties?.rasa.map((taste, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <span>{taste}</span>
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeRasa(taste)} />
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label className={language === "hi" ? "font-devanagari" : ""}>{currentContent.tags}</Label>
                  <div className="flex space-x-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add tag"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      className="flex-1"
                    />
                    <Button onClick={addTag} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recipe.tags?.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                        <span>{tag}</span>
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 mt-8">
          <Button onClick={handleSave} disabled={loading} className="flex items-center space-x-2">
            <Save className="h-4 w-4" />
            <span className={language === "hi" ? "font-devanagari" : ""}>
              {loading ? currentContent.saving : currentContent.save}
            </span>
          </Button>
          <Link href="/recipes">
            <Button variant="outline">
              <span className={language === "hi" ? "font-devanagari" : ""}>{currentContent.cancel}</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
