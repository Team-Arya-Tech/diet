"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { 
  Clock, 
  Users, 
  ChefHat, 
  Flame, 
  Leaf, 
  Star, 
  Plus,
  Search,
  BookOpen,
  Calculator,
  Heart,
  Filter,
  Download,
  Share2
} from "lucide-react"

import { 
  getAllRecipes, 
  getRecipesByCategory, 
  getRecipesByConstitution,
  getRecipesBySeason,
  searchRecipes,
  getRecipeById,
  Recipe,
  ayurvedicCookingPrinciples
} from "@/lib/recipe-intelligence"
import { NutritionalCalculator } from "@/lib/nutritional-calculator"

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [selectedConstitution, setSelectedConstitution] = useState<string>("")
  const [selectedSeason, setSelectedSeason] = useState<string>("")
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("")
  const [activeTab, setActiveTab] = useState("recipes")

  useEffect(() => {
    setRecipes(getAllRecipes())
  }, [])

  useEffect(() => {
    // If no search query and no filters, show all recipes
    if (!searchQuery && !selectedCategory && !selectedConstitution && !selectedSeason && !selectedDifficulty) {
      setRecipes(getAllRecipes())
      return
    }

    const filters = {
      category: selectedCategory as Recipe['category'] || undefined,
      constitution: selectedConstitution || undefined,
      season: selectedSeason || undefined,
      difficulty: selectedDifficulty as Recipe['difficulty'] || undefined
    }

    const filteredRecipes = searchRecipes(searchQuery, filters)
    setRecipes(filteredRecipes)
  }, [searchQuery, selectedCategory, selectedConstitution, selectedSeason, selectedDifficulty])

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("")
    setSelectedConstitution("")
    setSelectedSeason("")
    setSelectedDifficulty("")
    // Reset to show all recipes
    setRecipes(getAllRecipes())
  }

  const exportRecipe = (recipe: Recipe) => {
    const recipeText = generateRecipeText(recipe)
    const blob = new Blob([recipeText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${recipe.name.replace(/\s+/g, '-').toLowerCase()}-recipe.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  const generateRecipeText = (recipe: Recipe): string => {
    return `${recipe.name}
${'='.repeat(recipe.name.length)}

${recipe.description}

Cuisine: ${recipe.cuisine}
Category: ${recipe.category}
Difficulty: ${recipe.difficulty}
Prep Time: ${recipe.prepTime} mins
Cook Time: ${recipe.cookTime} mins
Total Time: ${recipe.totalTime} mins
Servings: ${recipe.servings}

INGREDIENTS:
${recipe.ingredients.map(ing => `• ${ing.quantity} ${ing.unit} ${ing.name}${ing.notes ? ` (${ing.notes})` : ''}`).join('\n')}

INSTRUCTIONS:
${recipe.cookingSteps.map(step => `${step.stepNumber}. ${step.instruction}${step.ayurvedicTip ? `\n   💡 Ayurvedic Tip: ${step.ayurvedicTip}` : ''}`).join('\n\n')}

NUTRITIONAL INFORMATION (Per Serving):
• Calories: ${recipe.nutritionalInfo.caloriesPerServing}
• Protein: ${recipe.nutritionalInfo.protein}g
• Carbohydrates: ${recipe.nutritionalInfo.carbohydrates}g
• Fat: ${recipe.nutritionalInfo.fat}g
• Fiber: ${recipe.nutritionalInfo.fiber}g

AYURVEDIC PROPERTIES:
• Primary Rasa: ${recipe.ayurvedicProperties.primaryRasa.join(', ')}
• Virya: ${recipe.ayurvedicProperties.virya}
• Vipaka: ${recipe.ayurvedicProperties.vipaka}
• Digestibility: ${recipe.ayurvedicProperties.digestibility}
• Best for: ${recipe.ayurvedicProperties.constitution.join(', ')} constitution(s)
• Ideal seasons: ${recipe.ayurvedicProperties.season.join(', ')}

HEALTH BENEFITS:
${recipe.healthBenefits.map(benefit => `• ${benefit}`).join('\n')}

AYURVEDIC GUIDELINES:
${recipe.ayurvedicGuidelines.map(guideline => `• ${guideline.principle}: ${guideline.description}`).join('\n')}
`
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-orange-600 bg-clip-text text-transparent">
            Recipe Intelligence
          </h1>
          <p className="text-muted-foreground mt-2">
            Complete recipes with Ayurvedic cooking wisdom and automatic nutritional calculation
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Recipe
          </Button>
          <Button variant="outline" size="sm">
            <BookOpen className="w-4 h-4 mr-2" />
            Cooking Guide
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recipes" className="flex items-center gap-2">
            <ChefHat className="w-4 h-4" />
            Recipes
          </TabsTrigger>
          <TabsTrigger value="cooking-guide" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Cooking Wisdom
          </TabsTrigger>
          <TabsTrigger value="nutrition-calculator" className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Nutrition Calculator
          </TabsTrigger>
        </TabsList>

        <TabsContent value="recipes" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search & Filter Recipes
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <Filter className="w-4 h-4 mr-2" />
                  Clear Filters
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label>Search Recipes</Label>
                  <Input
                    placeholder="Search by name, ingredients, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="w-48">
                  <Label>Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Breakfast</SelectItem>
                      <SelectItem value="lunch">Lunch</SelectItem>
                      <SelectItem value="dinner">Dinner</SelectItem>
                      <SelectItem value="snacks">Snacks</SelectItem>
                      <SelectItem value="beverage">Beverages</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <Label>Constitution</Label>
                  <Select value={selectedConstitution} onValueChange={setSelectedConstitution}>
                    <SelectTrigger>
                      <SelectValue placeholder="All constitutions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vata">Vata</SelectItem>
                      <SelectItem value="pitta">Pitta</SelectItem>
                      <SelectItem value="kapha">Kapha</SelectItem>
                      <SelectItem value="tridoshic">Tridoshic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label>Season</Label>
                  <Select value={selectedSeason} onValueChange={setSelectedSeason}>
                    <SelectTrigger>
                      <SelectValue placeholder="All seasons" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spring">Spring</SelectItem>
                      <SelectItem value="summer">Summer</SelectItem>
                      <SelectItem value="autumn">Autumn</SelectItem>
                      <SelectItem value="winter">Winter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1">
                  <Label>Difficulty</Label>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder="All levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recipe Grid and Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recipe List */}
            <div className="lg:col-span-1 space-y-4">
              <div className="text-sm text-muted-foreground">
                Found {recipes.length} recipe{recipes.length !== 1 ? 's' : ''}
              </div>
              <ScrollArea className="h-[600px]">
                <div className="space-y-3">
                  {recipes.map((recipe) => (
                    <Card 
                      key={recipe.id} 
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedRecipe?.id === recipe.id ? 'ring-2 ring-green-500' : ''
                      }`}
                      onClick={() => setSelectedRecipe(recipe)}
                    >
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <div className="flex items-start justify-between">
                            <h3 className="font-medium text-sm leading-tight">{recipe.name}</h3>
                            <Badge variant="secondary" className="text-xs">
                              {recipe.category}
                            </Badge>
                          </div>
                          
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {recipe.description}
                          </p>
                          
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {recipe.totalTime}m
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {recipe.servings}
                            </div>
                            <div className="flex items-center gap-1">
                              <Flame className="w-3 h-3" />
                              {recipe.difficulty}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            {recipe.ayurvedicProperties.constitution.slice(0, 2).map((const_) => (
                              <Badge key={const_} variant="outline" className="text-xs">
                                {const_}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Recipe Detail */}
            <div className="lg:col-span-2">
              {selectedRecipe ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl">{selectedRecipe.name}</CardTitle>
                        <CardDescription className="mt-2">
                          {selectedRecipe.description}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => exportRecipe(selectedRecipe)}>
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
                    
                    {/* Recipe Meta */}
                    <div className="flex flex-wrap gap-4 pt-4">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          Prep: {selectedRecipe.prepTime}m | Cook: {selectedRecipe.cookTime}m | Total: {selectedRecipe.totalTime}m
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Serves {selectedRecipe.servings}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ChefHat className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm capitalize">{selectedRecipe.difficulty}</span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <Tabs defaultValue="ingredients" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                        <TabsTrigger value="instructions">Instructions</TabsTrigger>
                        <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                        <TabsTrigger value="ayurvedic">Ayurvedic</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="ingredients" className="space-y-4">
                        <div className="grid gap-3">
                          {selectedRecipe.ingredients.map((ingredient, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                <span className="font-medium">{ingredient.name}</span>
                                {ingredient.ayurvedicRole && (
                                  <Badge variant="outline" className="text-xs">
                                    {ingredient.ayurvedicRole}
                                  </Badge>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="font-medium">{ingredient.quantity} {ingredient.unit}</div>
                                {ingredient.notes && (
                                  <div className="text-xs text-muted-foreground">{ingredient.notes}</div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="instructions" className="space-y-4">
                        <div className="space-y-4">
                          {selectedRecipe.cookingSteps.map((step) => (
                            <div key={step.stepNumber} className="flex gap-4">
                              <div className="flex-shrink-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                {step.stepNumber}
                              </div>
                              <div className="flex-1 space-y-2">
                                <p className="text-sm">{step.instruction}</p>
                                {step.duration && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="w-3 h-3" />
                                    {step.duration} minutes
                                  </div>
                                )}
                                {step.ayurvedicTip && (
                                  <div className="p-3 bg-orange-50 border-l-4 border-orange-500 rounded">
                                    <div className="flex items-start gap-2">
                                      <Leaf className="w-4 h-4 text-orange-500 mt-0.5" />
                                      <div>
                                        <div className="text-xs font-medium text-orange-700">Ayurvedic Tip</div>
                                        <div className="text-xs text-orange-600">{step.ayurvedicTip}</div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="nutrition" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm">Calories per Serving</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold text-green-600">
                                {selectedRecipe.nutritionalInfo.caloriesPerServing}
                              </div>
                            </CardContent>
                          </Card>
                          
                          <Card>
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm">Macronutrients</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Protein</span>
                                <span className="font-medium">{selectedRecipe.nutritionalInfo.protein}g</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Carbs</span>
                                <span className="font-medium">{selectedRecipe.nutritionalInfo.carbohydrates}g</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Fat</span>
                                <span className="font-medium">{selectedRecipe.nutritionalInfo.fat}g</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Fiber</span>
                                <span className="font-medium">{selectedRecipe.nutritionalInfo.fiber}g</span>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Micronutrients</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="flex justify-between">
                                <span>Calcium</span>
                                <span className="font-medium">{selectedRecipe.nutritionalInfo.calcium}mg</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Iron</span>
                                <span className="font-medium">{selectedRecipe.nutritionalInfo.iron}mg</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Potassium</span>
                                <span className="font-medium">{selectedRecipe.nutritionalInfo.potassium}mg</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Sodium</span>
                                <span className="font-medium">{selectedRecipe.nutritionalInfo.sodium}mg</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                      
                      <TabsContent value="ayurvedic" className="space-y-4">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Leaf className="w-4 h-4" />
                              Ayurvedic Properties
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Primary Rasa:</span>
                                <div className="flex gap-1 mt-1">
                                  {selectedRecipe.ayurvedicProperties.primaryRasa.map((rasa) => (
                                    <Badge key={rasa} variant="secondary" className="text-xs">
                                      {rasa}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Virya:</span>
                                <div className="mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {selectedRecipe.ayurvedicProperties.virya}
                                  </Badge>
                                </div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Vipaka:</span>
                                <div className="mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {selectedRecipe.ayurvedicProperties.vipaka}
                                  </Badge>
                                </div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Digestibility:</span>
                                <div className="mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {selectedRecipe.ayurvedicProperties.digestibility}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div>
                              <span className="text-muted-foreground text-sm">Constitution Compatibility:</span>
                              <div className="flex gap-1 mt-2">
                                {selectedRecipe.ayurvedicProperties.constitution.map((const_) => (
                                  <Badge key={const_} variant="secondary">
                                    {const_}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <span className="text-muted-foreground text-sm">Ideal Seasons:</span>
                              <div className="flex gap-1 mt-2">
                                {selectedRecipe.ayurvedicProperties.season.map((season) => (
                                  <Badge key={season} variant="outline">
                                    {season}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-sm flex items-center gap-2">
                              <Heart className="w-4 h-4" />
                              Health Benefits & Guidelines
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <span className="text-muted-foreground text-sm">Health Benefits:</span>
                              <ul className="mt-2 space-y-1">
                                {selectedRecipe.healthBenefits.map((benefit, index) => (
                                  <li key={index} className="text-sm flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5"></div>
                                    {benefit}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <Separator />
                            
                            <div>
                              <span className="text-muted-foreground text-sm">Ayurvedic Guidelines:</span>
                              <div className="mt-3 space-y-3">
                                {selectedRecipe.ayurvedicGuidelines.map((guideline, index) => (
                                  <div key={index} className="p-3 bg-orange-50 rounded-lg border">
                                    <div className="font-medium text-sm text-orange-700">{guideline.principle}</div>
                                    <div className="text-xs text-orange-600 mt-1">{guideline.description}</div>
                                    <div className="text-xs text-muted-foreground mt-2">
                                      <strong>Application:</strong> {guideline.application}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center h-96">
                    <div className="text-center space-y-3">
                      <ChefHat className="w-12 h-12 text-muted-foreground mx-auto" />
                      <div className="text-lg font-medium">Select a Recipe</div>
                      <p className="text-muted-foreground">
                        Choose a recipe from the list to view details, ingredients, and cooking instructions
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="cooking-guide" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Ayurvedic Cooking Wisdom
              </CardTitle>
              <CardDescription>
                Traditional principles and techniques for creating nourishing, healing meals
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* General Principles */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-orange-500" />
                  General Principles
                </h3>
                <div className="grid gap-4">
                  {ayurvedicCookingPrinciples.generalPrinciples.map((principle, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <h4 className="font-medium text-sm">{principle.title}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{principle.description}</p>
                        <div className="mt-2 p-2 bg-green-50 rounded text-xs">
                          <strong>Practice:</strong> {principle.practical}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Cooking Techniques */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <ChefHat className="w-5 h-5 text-orange-500" />
                  Sacred Cooking Techniques
                </h3>
                <div className="grid gap-4">
                  {ayurvedicCookingPrinciples.cookingTechniques.map((technique, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <h4 className="font-medium text-sm">{technique.technique}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{technique.description}</p>
                        <div className="mt-2 p-2 bg-orange-50 rounded text-xs">
                          <strong>Ayurvedic Benefit:</strong> {technique.ayurvedicBenefit}
                        </div>
                        <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                          <strong>Method:</strong> {technique.method}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Seasonal Guidelines */}
              <div>
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-orange-500" />
                  Seasonal Cooking Guidelines
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(ayurvedicCookingPrinciples.seasonalGuidelines).map(([season, guidelines]) => (
                    <Card key={season}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm capitalize">{season}</CardTitle>
                        <CardDescription className="text-xs">{guidelines.focus}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <span className="text-xs font-medium">Key Ingredients:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {guidelines.ingredients.map((ingredient) => (
                              <Badge key={ingredient} variant="secondary" className="text-xs">
                                {ingredient}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-medium">Cooking Methods:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {guidelines.cookingMethods.map((method) => (
                              <Badge key={method} variant="outline" className="text-xs">
                                {method}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-red-600">Avoid:</span>
                          <div className="text-xs text-red-600 mt-1">
                            {guidelines.avoid.join(', ')}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nutrition-calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Nutritional Calculator
              </CardTitle>
              <CardDescription>
                Calculate nutrition and Ayurvedic properties for custom ingredient combinations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Calculator className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium">Custom Nutrition Calculator</h3>
                <p className="text-muted-foreground mt-2">
                  This feature allows you to calculate nutrition for custom ingredient combinations.
                </p>
                <Button className="mt-4" disabled>
                  Coming Soon
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
