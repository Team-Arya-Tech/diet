"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Activity,
  Languages,
  Search,
  Plus,
  ChefHat,
  Clock,
  Users,
  Trash2,
  Eye,
  Filter,
  Flame,
  Snowflake,
  Leaf,
} from "lucide-react"
import Link from "next/link"
import { 
  getRecipes, 
  searchRecipes, 
  getRecipesByConstitution,
  type Recipe 
} from "@/lib/recipe-database"

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedDifficulty, setSelectedDifficulty] = useState("")
  const [selectedConstitution, setSelectedConstitution] = useState("")
  const [language, setLanguage] = useState<"en" | "hi">("en")
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const allRecipes = getRecipes()
    setRecipes(allRecipes)
    setLoading(false)
  }, [])

  useEffect(() => {
    applyFilters()
  }, [searchTerm, selectedCategory, selectedDifficulty, selectedConstitution, recipes])

  const loadRecipes = () => {
    const allRecipes = getRecipes()
    setRecipes(allRecipes)
    setLoading(false)
  }

  const applyFilters = () => {
    let result = recipes

    // Apply search and filters using the searchRecipes function
    result = searchRecipes({
      query: searchTerm || undefined,
      category: selectedCategory ? selectedCategory as any : undefined,
      mealType: selectedCategory ? selectedCategory as any : undefined,
      difficulty: selectedDifficulty || undefined,
      constitution: selectedConstitution ? selectedConstitution as any : undefined,
    })

    setFilteredRecipes(result)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "hard": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getVeeryaIcon = (virya: 'heating' | 'cooling') => {
    if (virya === "heating") return <Flame className="h-3 w-3 text-red-500" />
    if (virya === "cooling") return <Snowflake className="h-3 w-3 text-blue-500" />
    return <Leaf className="h-3 w-3 text-green-500" />
  }

  const clearFilters = () => {
    setSelectedCategory("")
    setSelectedDifficulty("")
    setSelectedConstitution("")
  }

  const content = {
    en: {
      title: "Recipe Collection",
      subtitle: "Discover and manage Ayurvedic recipes with nutritional and therapeutic benefits",
      createNew: "Add New Recipe",
      search: "Search recipes...",
      filters: "Filters",
      clearFilters: "Clear Filters",
      category: "Category",
      difficulty: "Difficulty",
      constitution: "Constitution",
      noRecipes: "No recipes found",
      noResults: "No recipes match your search criteria",
      servings: "servings",
      minutes: "minutes",
      view: "View",
      delete: "Delete",
      ingredients: "ingredients",
      showingResults: "Showing {count} recipes",
      allCategories: "All Categories",
      allDifficulties: "All Difficulties",
      allConstitutions: "All Constitutions",
    },
    hi: {
      title: "रेसिपी संग्रह",
      subtitle: "पोषण और चिकित्सीय लाभों के साथ आयुर्वेदिक व्यंजनों की खोज और प्रबंधन करें",
      createNew: "नई रेसिपी जोड़ें",
      search: "रेसिपी खोजें...",
      filters: "फिल्टर",
      clearFilters: "फिल्टर साफ़ करें",
      category: "श्रेणी",
      difficulty: "कठिनाई",
      constitution: "प्रकृति",
      noRecipes: "कोई रेसिपी नहीं मिली",
      noResults: "आपके खोज मानदंडों से कोई रेसिपी मेल नहीं खाती",
      servings: "सर्विंग्स",
      minutes: "मिनट",
      view: "देखें",
      delete: "हटाएं",
      ingredients: "सामग्री",
      showingResults: "{count} रेसिपी दिखा रहे हैं",
      allCategories: "सभी श्रेणियां",
      allDifficulties: "सभी कठिनाई स्तर",
      allConstitutions: "सभी प्रकृति",
    },
  }

  const currentContent = content[language]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p>Loading recipes...</p>
        </div>
      </div>
    )
  }

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
          <h1 className={`text-4xl font-bold mb-2 ${language === "hi" ? "font-devanagari" : ""}`}>
            {currentContent.title}
          </h1>
          <p className={`text-muted-foreground text-lg ${language === "hi" ? "font-devanagari" : ""}`}>
            {currentContent.subtitle}
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder={currentContent.search}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Link href="/recipes/create">
                  <Button className="flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span className={language === "hi" ? "font-devanagari" : ""}>{currentContent.createNew}</span>
                  </Button>
                </Link>
                <Link href="/recipes/ai-generator">
                  <Button className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600">
                    <ChefHat className="h-4 w-4" />
                    <span className={language === "hi" ? "font-devanagari" : ""}>AI Recipe</span>
                  </Button>
                </Link>
              </div>

              {/* Filter Toggle */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2"
                >
                  <Filter className="h-4 w-4" />
                  <span className={language === "hi" ? "font-devanagari" : ""}>{currentContent.filters}</span>
                </Button>

                <div className="flex items-center space-x-4">
                  <p className={`text-sm text-muted-foreground ${language === "hi" ? "font-devanagari" : ""}`}>
                    {currentContent.showingResults.replace("{count}", filteredRecipes.length.toString())}
                  </p>
                  {(selectedCategory || selectedDifficulty || selectedConstitution) && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <span className={language === "hi" ? "font-devanagari" : ""}>{currentContent.clearFilters}</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${language === "hi" ? "font-devanagari" : ""}`}>
                      {currentContent.category}
                    </label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger>
                        <SelectValue placeholder={currentContent.allCategories} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">{currentContent.allCategories}</SelectItem>
                        <SelectItem value="breakfast">Breakfast</SelectItem>
                        <SelectItem value="lunch">Lunch</SelectItem>
                        <SelectItem value="dinner">Dinner</SelectItem>
                        <SelectItem value="snacks">Snacks</SelectItem>
                        <SelectItem value="beverages">Beverages</SelectItem>
                        <SelectItem value="desserts">Desserts</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${language === "hi" ? "font-devanagari" : ""}`}>
                      {currentContent.difficulty}
                    </label>
                    <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                      <SelectTrigger>
                        <SelectValue placeholder={currentContent.allDifficulties} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">{currentContent.allDifficulties}</SelectItem>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${language === "hi" ? "font-devanagari" : ""}`}>
                      {currentContent.constitution}
                    </label>
                    <Select value={selectedConstitution} onValueChange={setSelectedConstitution}>
                      <SelectTrigger>
                        <SelectValue placeholder={currentContent.allConstitutions} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">{currentContent.allConstitutions}</SelectItem>
                        <SelectItem value="vata">Vata</SelectItem>
                        <SelectItem value="pitta">Pitta</SelectItem>
                        <SelectItem value="kapha">Kapha</SelectItem>
                        <SelectItem value="tridoshic">Tridoshic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recipes Grid */}
        {filteredRecipes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <ChefHat className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className={`text-lg font-semibold mb-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                {recipes.length === 0 ? currentContent.noRecipes : currentContent.noResults}
              </h3>
              {recipes.length === 0 && (
                <Link href="/recipes/create">
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className={language === "hi" ? "font-devanagari" : ""}>{currentContent.createNew}</span>
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map((recipe) => (
              <Card key={recipe.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{recipe.name}</CardTitle>
                      <CardDescription className="line-clamp-2">{recipe.description}</CardDescription>
                      <div className="flex flex-wrap gap-1 mt-2">
                        <Badge variant="outline" className="capitalize">{recipe.mealType}</Badge>
                        <Badge className={getDifficultyColor(recipe.difficulty)} variant="secondary">
                          {recipe.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {recipe.ayurvedicProperties.virya}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      {getVeeryaIcon(recipe.ayurvedicProperties.virya)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Recipe Stats */}
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <Clock className="h-3 w-3 mx-auto mb-1 text-muted-foreground" />
                        <p className="font-medium">{recipe.cookingTime}</p>
                        <p className="text-muted-foreground">{currentContent.minutes}</p>
                      </div>
                      <div className="text-center">
                        <Users className="h-3 w-3 mx-auto mb-1 text-muted-foreground" />
                        <p className="font-medium">{recipe.servings}</p>
                        <p className="text-muted-foreground">{currentContent.servings}</p>
                      </div>
                      <div className="text-center">
                        <ChefHat className="h-3 w-3 mx-auto mb-1 text-muted-foreground" />
                        <p className="font-medium">{recipe.ingredients.length}</p>
                        <p className="text-muted-foreground">{currentContent.ingredients}</p>
                      </div>
                    </div>

                    {/* Nutrition Overview */}
                    {recipe.nutritionalInfo && (
                      <div className="text-xs">
                        <p className="text-muted-foreground mb-1">Nutrition (per serving):</p>
                        <div className="grid grid-cols-2 gap-1">
                          <span>Calories: {Math.round(recipe.nutritionalInfo.caloriesPerServing)}</span>
                          <span>Protein: {Math.round(recipe.nutritionalInfo.protein)}g</span>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-2">
                      <Link href={`/recipes/${recipe.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <Eye className="h-3 w-3 mr-1" />
                          <span className={language === "hi" ? "font-devanagari" : ""}>{currentContent.view}</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
