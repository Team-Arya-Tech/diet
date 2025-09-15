"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Calendar, Plus, Search, Download, Sparkles, Filter, Clock, Users } from "lucide-react"
import { 
  searchFoodItems, 
  getFoodsByMealType, 
  generateAIDietChart,
  exportDietChartToCSV,
  exportDietChartToJSON,
  saveDietChart,
  getDietCharts,
  calculateNutritionalSummary,
  type FoodItem,
  type DietChart,
  type SelectedFood,
  type MealPlan,
  type DietChartFilters
} from "@/lib/food-database"
import { exportDietChartToPDF } from "@/lib/pdf-export"
import { getPatients, getDietPlans } from "@/lib/database"
import type { Patient, DietPlan } from "@/lib/database"

export default function DietChartPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMeal, setSelectedMeal] = useState<"breakfast" | "lunch" | "dinner" | "snacks">("breakfast")
  const [selectedFoods, setSelectedFoods] = useState<{[key: string]: SelectedFood[]}>({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: []
  })
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [currentDietChart, setCurrentDietChart] = useState<DietChart | null>(null)
  const [savedCharts, setSavedCharts] = useState<DietChart[]>([])
  const [filters, setFilters] = useState<DietChartFilters>({})
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState("builder")
  const [selectedPatientId, setSelectedPatientId] = useState<string>("")

  // Load food items, saved charts, and patients
  useEffect(() => {
    const foods = searchFoodItems("", filters)
    setFoodItems(foods)
    setSavedCharts(getDietCharts())
  }, [filters])

  // Search foods
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    const foods = searchFoodItems(query, filters)
    setFoodItems(foods)
  }

  // Add food to meal
  const addFoodToMeal = (food: FoodItem) => {
    const selectedFood: SelectedFood = {
      foodId: food.id,
      name: food.name,
      quantity: 1,
      unit: "serving",
      calories: food.nutritionalInfo.caloriesPerServing,
      ayurvedicScore: 85 // Mock score for now
    }

    setSelectedFoods(prev => ({
      ...prev,
      [selectedMeal]: [...prev[selectedMeal], selectedFood]
    }))
  }

  // Remove food from meal
  const removeFoodFromMeal = (mealType: string, index: number) => {
    setSelectedFoods(prev => ({
      ...prev,
      [mealType]: prev[mealType].filter((_, i) => i !== index)
    }))
  }

  // Update food quantity
  const updateFoodQuantity = (mealType: string, index: number, quantity: number) => {
    setSelectedFoods(prev => ({
      ...prev,
      [mealType]: prev[mealType].map((food, i) => 
        i === index ? { ...food, quantity, calories: food.calories * quantity } : food
      )
    }))
  }

  // Generate AI diet chart
  const handleAIGeneration = async () => {
    try {
      const aiChart = await generateAIDietChart({
        patientProfile: {
          age: 30,
          gender: "female",
          constitution: "vata",
          healthConditions: [],
          dietaryRestrictions: [],
          activityLevel: "moderate",
          currentWeight: 65,
          targetWeight: 62,
          targetCalories: 1800
        },
        preferences: {
          cuisine: ["indian", "western"],
          avoidFoods: [],
          preferredMeals: ["breakfast", "lunch", "dinner"]
        },
        duration: 7,
        goals: ["weight-loss", "balanced-nutrition"]
      })
      setCurrentDietChart(aiChart)
      // Convert AI chart to selected foods format
      const convertedFoods = {
        breakfast: aiChart.weeklyPlan[0]?.meals.breakfast.items || [],
        lunch: aiChart.weeklyPlan[0]?.meals.lunch.items || [],
        dinner: aiChart.weeklyPlan[0]?.meals.dinner.items || [],
        snacks: aiChart.weeklyPlan[0]?.meals.snacks.items || []
      }
      setSelectedFoods(convertedFoods)
      setActiveTab("builder")
    } catch (error) {
      console.error("Failed to generate AI diet chart:", error)
    }
  }

  // Save current diet chart
  const handleSaveDietChart = () => {
    if (Object.values(selectedFoods).some(meals => meals.length > 0)) {
      const chartName = `Diet Chart ${new Date().toLocaleDateString()}`
      // Create a simple diet chart structure
      const simpleDietChart = {
        name: chartName,
        selectedFoods,
        totalCalories: dailyTotals.calories,
        createdAt: new Date()
      }
      // In a real app, you'd save this to a database
      console.log("Saving diet chart:", simpleDietChart)
      setSavedCharts(prev => [...prev, simpleDietChart as any])
    }
  }
  const handlePDFExport = async () => {
    try {
      const patients = getPatients()
      const dietPlans = getDietPlans()
      
      let patient: Patient | undefined
      let dietPlan: DietPlan | undefined

      if (selectedPatientId) {
        patient = patients.find(p => p.id === selectedPatientId)
        dietPlan = dietPlans.find(plan => plan.patientId === selectedPatientId && plan.isActive)
      }

      // If no patient selected, create a mock patient for demonstration
      if (!patient) {
        patient = {
          id: "demo-patient",
          name: "Demo Patient",
          age: 35,
          gender: "female",
          weight: 65,
          height: 162,
          bmi: 24.8,
          constitution: "pitta-kapha",
          currentConditions: ["General wellness"],
          dietaryRestrictions: ["Vegetarian"],
          allergies: [],
          lifestyle: {
            activityLevel: "moderate",
            sleepHours: 7,
            stressLevel: "low",
            waterIntake: 2.5,
            mealTiming: "Regular",
            bowelMovements: "regular",
            exerciseRoutine: "Yoga 3x week"
          },
          medicalHistory: [],
          occupation: "Professional",
          contactInfo: {
            phone: "+91-XXXX-XXXXXX",
            email: "demo@example.com"
          },
          assessmentDate: new Date(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }

      // If no diet plan, create one from current selections
      if (!dietPlan) {
        dietPlan = {
          id: "demo-plan",
          patientId: patient.id,
          planName: "Custom Diet Chart",
          description: "Personalized diet chart created with selected foods",
          duration: 7,
          startDate: new Date(),
          targetCalories: dailyTotals.calories,
          objectives: ["Balanced nutrition", "Ayurvedic wellness"],
          dailyMeals: {
            1: {
              breakfast: {
                recipes: selectedFoods.breakfast.map(f => f.name),
                notes: "Start your day with nutritious breakfast"
              },
              lunch: {
                recipes: selectedFoods.lunch.map(f => f.name),
                notes: "Main meal with balanced nutrition"
              },
              dinner: {
                recipes: selectedFoods.dinner.map(f => f.name),
                notes: "Light dinner for better digestion"
              }
            }
          },
          restrictions: ["Avoid overeating", "Maintain meal timing"],
          recommendations: [
            "Drink warm water throughout the day",
            "Practice mindful eating",
            "Follow constitutional guidelines"
          ],
          ayurvedicGuidelines: {
            constitutionFocus: `This plan is designed for ${patient.constitution} constitution`,
            seasonalAdaptations: ["Adjust foods based on current season"],
            lifestyleRecommendations: ["Regular exercise", "Adequate sleep", "Stress management"],
            herbs: ["Ginger", "Turmeric", "Cumin"]
          },
          progress: {
            adherence: 85,
            weightChange: 0,
            symptomsImprovement: [],
            notes: [`Plan created on ${new Date().toLocaleDateString()}`]
          },
          createdBy: "Diet Chart Builder",
          createdAt: new Date(),
          updatedAt: new Date(),
          isActive: true
        }
      }

      await exportDietChartToPDF(patient, dietPlan, {
        includeNutritionalAnalysis: true,
        includeAyurvedicGuidelines: true,
        includeProgressCharts: true,
        includeRecommendations: true,
        language: 'en'
      })

    } catch (error) {
      console.error("Error exporting PDF:", error)
      alert("Error generating PDF. Please try again.")
    }
  }

  // Calculate daily totals
  const calculateDailyTotals = () => {
    const allFoods = Object.values(selectedFoods).flat()
    return calculateNutritionalSummary(allFoods)
  }

  const dailyTotals = calculateDailyTotals()

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Diet Chart Builder</h1>
          <p className="text-muted-foreground">Create personalized diet plans with AI assistance</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Patient" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Demo Patient</SelectItem>
              {getPatients().map((patient) => (
                <SelectItem key={patient.id} value={patient.id}>
                  {patient.name} ({patient.constitution})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button onClick={handleAIGeneration} className="bg-gradient-to-r from-purple-500 to-pink-500">
            <Sparkles className="h-4 w-4 mr-2" />
            AI Generate
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="builder">Diet Builder</TabsTrigger>
          <TabsTrigger value="saved">Saved Charts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="builder" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Food Search & Selection */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Food Database
                  </CardTitle>
                  <CardDescription>
                    Search and add foods to your diet plan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Search foods (e.g., quinoa, dal, oatmeal)"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="flex-1"
                    />
                    <Select value={selectedMeal} onValueChange={(value: any) => setSelectedMeal(value)}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breakfast">Breakfast</SelectItem>
                        <SelectItem value="lunch">Lunch</SelectItem>
                        <SelectItem value="dinner">Dinner</SelectItem>
                        <SelectItem value="snacks">Snacks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {showFilters && (
                    <Card className="p-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <Label>Cuisine</Label>
                          <Select onValueChange={(value) => setFilters(prev => ({ ...prev, cuisine: [value] }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="indian">Indian</SelectItem>
                              <SelectItem value="western">Western</SelectItem>
                              <SelectItem value="mediterranean">Mediterranean</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Constitution</Label>
                          <Select onValueChange={(value) => setFilters(prev => ({ ...prev, constitution: [value] }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="vata">Vata</SelectItem>
                              <SelectItem value="pitta">Pitta</SelectItem>
                              <SelectItem value="kapha">Kapha</SelectItem>
                              <SelectItem value="tridoshic">Tridoshic</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Max Prep Time</Label>
                          <Select onValueChange={(value) => setFilters(prev => ({ ...prev, maxPrepTime: parseInt(value) }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="15">15 min</SelectItem>
                              <SelectItem value="30">30 min</SelectItem>
                              <SelectItem value="60">1 hour</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Difficulty</Label>
                          <Select onValueChange={(value) => setFilters(prev => ({ ...prev, difficulty: [value] }))}>
                            <SelectTrigger>
                              <SelectValue placeholder="Any" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="easy">Easy</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </Card>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {foodItems.map((food) => (
                      <Card key={food.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{food.name}</h3>
                            <Button size="sm" onClick={() => addFoodToMeal(food)}>
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{food.description}</p>
                          <div className="flex flex-wrap gap-1 mb-2">
                            <Badge variant="secondary">{food.cuisine}</Badge>
                            <Badge variant="outline">
                              <Clock className="h-3 w-3 mr-1" />
                              {food.prepTime}min
                            </Badge>
                            <Badge>{food.nutritionalInfo.caloriesPerServing} cal</Badge>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {food.ayurvedicProperties.constitution.map((const_type) => (
                              <Badge key={const_type} variant="outline" className="text-xs">
                                {const_type}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Selected Foods & Meal Plan */}
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Today's Meal Plan
                  </CardTitle>
                  <CardDescription>
                    Your selected foods for today
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(selectedFoods).map(([mealType, foods]) => (
                    <div key={mealType}>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold capitalize">{mealType}</h4>
                        <Badge variant="outline">
                          {foods.reduce((sum, food) => sum + food.calories, 0)} cal
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        {foods.map((food, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{food.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {food.calories} cal
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Input
                                type="number"
                                min="0.5"
                                step="0.5"
                                value={food.quantity}
                                onChange={(e) => updateFoodQuantity(mealType, index, parseFloat(e.target.value))}
                                className="w-16 h-8"
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => removeFoodFromMeal(mealType, index)}
                              >
                                ×
                              </Button>
                            </div>
                          </div>
                        ))}
                        {foods.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No foods added yet
                          </p>
                        )}
                      </div>
                      <Separator className="mt-3" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Daily Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Daily Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{dailyTotals.calories}</p>
                      <p className="text-sm text-muted-foreground">Calories</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{dailyTotals.protein}g</p>
                      <p className="text-sm text-muted-foreground">Protein</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{dailyTotals.carbohydrates}g</p>
                      <p className="text-sm text-muted-foreground">Carbs</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{dailyTotals.fat}g</p>
                      <p className="text-sm text-muted-foreground">Fat</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <Button onClick={handleSaveDietChart} className="w-full">
                  Save Diet Chart
                </Button>
                <div className="grid grid-cols-3 gap-2">
                  <Button variant="outline" size="sm" onClick={handlePDFExport}>
                    PDF
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => exportDietChartToCSV(currentDietChart!)}>
                    CSV
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => exportDietChartToJSON(currentDietChart!)}>
                    JSON
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="saved" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Saved Diet Charts
              </CardTitle>
              <CardDescription>
                Your previously created diet plans
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedCharts.map((chart) => (
                  <Card key={chart.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{chart.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Created: {chart.createdAt.toLocaleDateString()}
                      </p>
                      <div className="flex justify-between text-sm">
                        <span>Created: {chart.createdAt.toLocaleDateString()}</span>
                        <Badge variant={chart.isAIGenerated ? "default" : "secondary"}>
                          {chart.isAIGenerated ? "AI" : "Manual"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {savedCharts.length === 0 && (
                  <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground">No saved diet charts yet</p>
                    <p className="text-sm text-muted-foreground">Create your first diet chart to get started</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nutritional Analytics</CardTitle>
              <CardDescription>
                Analyze your diet patterns and nutritional intake
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-green-600">{dailyTotals.calories}</p>
                  <p className="text-sm text-muted-foreground">Total Calories</p>
                  <p className="text-xs">Target: 1800</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-blue-600">{dailyTotals.protein}g</p>
                  <p className="text-sm text-muted-foreground">Protein</p>
                  <p className="text-xs">Target: 120g</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-orange-600">{dailyTotals.carbohydrates}g</p>
                  <p className="text-sm text-muted-foreground">Carbs</p>
                  <p className="text-xs">Target: 200g</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-purple-600">{dailyTotals.fat}g</p>
                  <p className="text-sm text-muted-foreground">Fat</p>
                  <p className="text-xs">Target: 60g</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
