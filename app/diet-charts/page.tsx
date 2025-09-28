"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Plus, Search, Download, Sparkles, Filter, Clock, Users, User, UserPlus } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useTranslation } from "@/components/translation-provider"
import { 
  searchFoodItems, 
  getFoodsByMealType, 
  generateAIDietChart,
  exportDietChartToPDF,
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
import { getPatients, type Patient, initializeSampleData } from "@/lib/database"
import { getRecommendationsForProfile } from "@/lib/ayurvedic-data"
import Link from "next/link"

export default function DietChartsPage() {
  // All hooks must be inside the function component
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
  // Patient selection state
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  // Smart Recommendations state
  const [recommendations, setRecommendations] = useState<any[]>([])

  // Load food items, saved charts, and patients
  useEffect(() => {
    // Initialize sample data if needed
    try {
      initializeSampleData()
    } catch (error) {
      console.error("Error initializing sample data:", error)
    }
    const foods = searchFoodItems("", filters)
    setFoodItems(foods)
    setSavedCharts(getDietCharts())
    const patientsData = getPatients()
    setPatients(patientsData)
  }, [filters])

  // Update recommendations when patient changes
  useEffect(() => {
    if (selectedPatient) {
      const recs = getRecommendationsForProfile(
        selectedPatient.age,
        selectedPatient.gender,
        selectedPatient.constitution,
        selectedPatient.currentConditions,
        selectedPatient.occupation
      )
      setRecommendations(recs)
    } else {
      setRecommendations([])
    }
  }, [selectedPatient])

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

  // Generate AI diet chart using API
  const handleAIGeneration = async () => {
    if (!selectedPatient) {
      alert("Please select a patient first")
      return
    }

    try {
      // Call the LLM API to generate the diet chart
      const res = await fetch("/api/ai-diet-chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient: selectedPatient,
          options: {
            duration: 7,
            focusArea: selectedPatient.currentConditions.length > 0 ? selectedPatient.currentConditions[0] : 'General wellness',
            dietaryStyle: 'Traditional Ayurvedic'
          }
        })
      })
      
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to generate AI diet chart")
      }
      
      const { dietPlan } = await res.json()
      if (dietPlan) {
        // Convert DietPlan to DietChart format for UI compatibility
        const dietChart: DietChart = {
          id: dietPlan.id,
          name: dietPlan.planName,
          description: dietPlan.description,
          patientId: dietPlan.patientId,
          startDate: new Date(dietPlan.startDate),
          endDate: new Date(dietPlan.endDate),
          weeklyPlan: convertDietPlanToWeeklyPlan(dietPlan),
          totalCalories: dietPlan.targetCalories,
          nutritionalSummary: {
            calories: dietPlan.targetCalories,
            protein: Math.round(dietPlan.targetCalories * 0.15 / 4),
            carbohydrates: Math.round(dietPlan.targetCalories * 0.55 / 4),
            fat: Math.round(dietPlan.targetCalories * 0.30 / 9),
            fiber: 25,
            sugar: 50,
            sodium: 2300,
            potassium: 3500,
            calcium: 1000,
            iron: 15,
            vitamins: {}
          },
          ayurvedicGuidelines: dietPlan.recommendations || [],
          createdAt: new Date(dietPlan.createdAt),
          createdBy: dietPlan.createdBy,
          isAIGenerated: true
        }
        
        setCurrentDietChart(dietChart)
        setSavedCharts(prev => [...prev, dietChart])
        
        // Convert first day's meals to selected foods format for display
        const firstDay = dietChart.weeklyPlan[0]
        if (firstDay) {
          const convertedFoods = {
            breakfast: firstDay.meals.breakfast.items || [],
            lunch: firstDay.meals.lunch.items || [],
            dinner: firstDay.meals.dinner.items || [],
            snacks: firstDay.meals.snacks.items || []
          }
          setSelectedFoods(convertedFoods)
        }
        
        setActiveTab("builder")
        alert("AI diet chart generated successfully!")
      }
    } catch (error) {
      console.error("Failed to generate AI diet chart:", error)
      alert("Failed to generate AI diet chart. Please try again.")
    }
  }

  // Calculate target calories based on patient data
  const calculateTargetCalories = (patient: Patient): number => {
    // Basic BMR calculation using Mifflin-St Jeor Equation
    let bmr: number
    if (patient.gender === "male") {
      bmr = 88.362 + (13.397 * patient.weight) + (4.799 * patient.height) - (5.677 * patient.age)
    } else {
      bmr = 447.593 + (9.247 * patient.weight) + (3.098 * patient.height) - (4.330 * patient.age)
    }

    // Activity factor
    const activityMultipliers = {
      sedentary: 1.2,
      moderate: 1.55,
      active: 1.725,
      "very-active": 1.9
    }

    return Math.round(bmr * activityMultipliers[patient.lifestyle.activityLevel])
  }

  // Convert DietPlan to WeeklyMealPlan format
  const convertDietPlanToWeeklyPlan = (dietPlan: any): any[] => {
    const weeklyPlan = []
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    
    for (let i = 1; i <= 7; i++) {
      const dayPlan = dietPlan.dailyMeals?.[i]
      if (dayPlan) {
        // Convert each meal to the expected format
        const convertMeal = (mealData: any) => {
          if (!mealData) return { items: [], totalCalories: 0, nutrition: {}, ayurvedicBalance: {} }
          
          // Create a selected food item from meal data
          const selectedFood: SelectedFood = {
            foodId: `meal-${Date.now()}`,
            name: mealData.recipes?.[0] || 'AI Generated Meal',
            quantity: 1,
            unit: "serving",
            calories: 250, // Default calories
            ayurvedicScore: 85
          }
          
          return {
            items: [selectedFood],
            totalCalories: selectedFood.calories,
            nutrition: calculateNutritionalSummary([selectedFood]),
            ayurvedicBalance: {
              doshaEffect: { vata: 0, pitta: 0, kapha: 0 },
              rasaBalance: ["sweet"],
              viryaEffect: "neutral"
            }
          }
        }

        weeklyPlan.push({
          day: i,
          dayName: days[i - 1],
          meals: {
            breakfast: convertMeal(dayPlan.breakfast),
            lunch: convertMeal(dayPlan.lunch),
            dinner: convertMeal(dayPlan.dinner),
            snacks: convertMeal(dayPlan.midMorning || dayPlan.midAfternoon)
          },
          dailyCalories: 2000, // Default daily calories
          dailyNutrition: {
            calories: 2000,
            protein: 75,
            carbohydrates: 250,
            fat: 67,
            fiber: 25,
            sugar: 50,
            sodium: 2300,
            potassium: 3500,
            calcium: 1000,
            iron: 15,
            vitamins: {}
          }
        })
      }
    }
    
    return weeklyPlan
  }

  // Save current diet chart
  const handleSaveDietChart = async () => {
    await generateDietChartFromSelectedFoods();
  }

  // Calculate daily totals
  const calculateDailyTotals = () => {
    const allFoods = Object.values(selectedFoods).flat()
    return calculateNutritionalSummary(allFoods)
  }


  // Generate a DietChart using LLM for selected foods
  const generateDietChartFromSelectedFoods = async () => {
    if (!selectedPatient) {
      alert("Please select a patient first")
      return
    }
    if (!Object.values(selectedFoods).some(meals => meals.length > 0)) {
      alert("Please add some foods to the diet chart before saving.")
      return
    }
    try {
      // Call the LLM API with selected foods as preferences
      const res = await fetch("/api/ai-diet-chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient: selectedPatient,
          options: {
            preferences: {
              preferredMeals: ["breakfast", "lunch", "dinner", "snacks"],
              avoidFoods: [],
              cuisine: [],
              selectedFoods // pass the selected foods for LLM context
            },
            duration: 7,
            goals: ["balanced-nutrition", "health-optimization"]
          }
        })
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to generate diet chart")
      }
      const { dietPlan } = await res.json()
      if (dietPlan) {
        setCurrentDietChart(dietPlan)
        setSavedCharts(prev => [...prev, dietPlan])
        alert("Diet chart saved successfully! Export buttons are now enabled.")
      }
    } catch (error) {
      alert("Failed to generate diet chart via AI. Please try again.")
      console.error(error)
    }
  }

  const dailyTotals = calculateDailyTotals()

  // Check if export should be enabled (either saved chart or foods selected)
  const canExport = currentDietChart || (selectedPatient && Object.values(selectedFoods).some(meals => meals.length > 0))

  // Handle export functions - create chart on-the-fly if needed

  const handleExportPDF = async () => {
    let chartToExport = currentDietChart
    if (!chartToExport && selectedPatient && Object.values(selectedFoods).some(meals => meals.length > 0)) {
      await generateDietChartFromSelectedFoods()
      chartToExport = currentDietChart
    }
    if (chartToExport) {
      exportDietChartToPDF(chartToExport)
    }
  }


  const handleExportCSV = async () => {
    let chartToExport = currentDietChart
    if (!chartToExport && selectedPatient && Object.values(selectedFoods).some(meals => meals.length > 0)) {
      await generateDietChartFromSelectedFoods()
      chartToExport = currentDietChart
    }
    if (chartToExport) {
      exportDietChartToCSV(chartToExport)
    }
  }


  const handleExportJSON = async () => {
    let chartToExport = currentDietChart
    if (!chartToExport && selectedPatient && Object.values(selectedFoods).some(meals => meals.length > 0)) {
      await generateDietChartFromSelectedFoods()
      chartToExport = currentDietChart
    }
    if (chartToExport) {
      exportDietChartToJSON(chartToExport)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/20 relative overflow-x-hidden">
      {/* AhaarWISE Branding Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-amber-100 shadow-lg shadow-orange-500/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div className="flex items-center">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl shadow-lg">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    AhaarWISE
                  </h1>
                  <p className="text-sm text-gray-600">Ayurvedic Diet Intelligence System - Modern nutrition with ancient wisdom</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-5">
              <LanguageSwitcher />
              <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-2.5 rounded-xl border border-amber-200 shadow-sm">
                <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-orange-700">Ayurvedic Practitioner</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm font-medium text-gray-900">Holistic Health & Wellness</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Diet Chart Builder</h1>
          <p className="text-muted-foreground">Create personalized diet plans with AI assistance</p>
        </div>
        <div className="flex gap-2">
          <LanguageSwitcher />
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      {/* Patient Selection */}
      <Card className="shadow-sm border-0 bg-gradient-to-r from-slate-50 to-gray-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4 flex-1">
              <div className="p-3 rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="patient-select" className="text-base font-semibold text-gray-900">
                  Patient Selection
                </Label>
                <Select 
                  value={selectedPatient?.id || ""} 
                  onValueChange={(value) => {
                    const patient = patients.find(p => p.id === value)
                    setSelectedPatient(patient || null)
                  }}
                >
                  <SelectTrigger className="h-16 border-gray-200 focus:border-primary focus:ring-primary/20 text-lg">
                    <SelectValue placeholder="Choose a patient to create diet chart..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-80 w-full min-w-[500px] max-w-[700px]">
                    {patients.length === 0 ? (
                      <div className="p-6 text-center space-y-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                          <Users className="h-6 w-6 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 mb-1">No patients found</p>
                          <p className="text-sm text-gray-500 mb-4">Add your first patient to get started</p>
                        </div>
                        <Link href="/patients/new">
                          <Button size="sm" className="w-full">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add New Patient
                          </Button>
                        </Link>
                      </div>
                    ) : (
                      <>
                        {patients.map((patient) => (
                          <SelectItem key={patient.id} value={patient.id} className="p-4 h-16">
                            <div className="flex items-center w-full">
                              <p className="font-semibold text-gray-900 text-lg">{patient.name}</p>
                            </div>
                          </SelectItem>
                        ))}
                        <Separator className="my-2" />
                        <div className="p-3">
                          <Link href="/patients/new">
                            <Button variant="ghost" size="sm" className="w-full justify-start">
                              <UserPlus className="h-4 w-4 mr-2" />
                              Add New Patient
                            </Button>
                          </Link>
                        </div>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Selected Patient Summary */}
            {selectedPatient && (
              <div className="flex items-center gap-4 bg-white rounded-lg p-4 border border-gray-200 shadow-sm min-w-0 max-w-md">
                <Avatar className="h-12 w-12 border-2 border-primary/20 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-semibold">
                    {selectedPatient.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 truncate">{selectedPatient.name}</h3>
                    <Badge variant="secondary" className="text-xs capitalize flex-shrink-0">
                      {selectedPatient.constitution}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex-shrink-0">{selectedPatient.age}y • {selectedPatient.gender}</span>
                    <span className="font-medium text-primary truncate">
                      Target: {calculateTargetCalories(selectedPatient)} cal/day
                    </span>
                  </div>
                  {selectedPatient.currentConditions.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {selectedPatient.currentConditions.slice(0, 2).map((condition, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {condition}
                        </Badge>
                      ))}
                      {selectedPatient.currentConditions.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{selectedPatient.currentConditions.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setSelectedPatient(null)}
                  className="h-8 w-8 p-0 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors flex-shrink-0"
                  title="Clear selection"
                >
                  ×
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Chart Creation Options */}
      {selectedPatient && (
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50/30 via-purple-50/20 to-indigo-50/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 p-3 shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Chart Creation Options
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Choose how you want to create your diet chart for {selectedPatient.name}
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Manual Chart Building Option */}
            <Card className="border border-green-200 hover:border-green-300 transition-colors cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center rounded-xl bg-green-100 p-3 group-hover:bg-green-200 transition-colors">
                    <User className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-green-800">Manual Selection</h4>
                    <p className="text-sm text-green-600">Build your chart step by step</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-4">
                  Select foods manually from our database and create a personalized diet chart. You have full control over each meal and portion.
                </p>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Browse food database</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Customize portions and meals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    <span>Real-time nutritional tracking</span>
                  </div>
                </div>
                <Button 
                  onClick={() => setActiveTab("builder")} 
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Start Manual Selection
                </Button>
              </CardContent>
            </Card>

            {/* AI Generation Option */}
            <Card className="border border-purple-200 hover:border-purple-300 transition-colors cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center justify-center rounded-xl bg-purple-100 p-3 group-hover:bg-purple-200 transition-colors">
                    <Sparkles className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-purple-800">AI Generation</h4>
                    <p className="text-sm text-purple-600">Let AI create your chart</p>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-4">
                  Generate a complete 7-day Ayurvedic diet plan using AI based on patient's constitution, health conditions, and preferences.
                </p>
                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <span>Constitution-based recommendations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <span>Ayurvedic principles integration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    <span>Complete weekly meal plan</span>
                  </div>
                </div>
                <Button 
                  onClick={handleAIGeneration} 
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  disabled={!selectedPatient}
                >
                  Generate AI Chart
                </Button>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}

      {/* Smart Recommendations Section (Expandable) */}
      {selectedPatient && (
        <Card className="mt-4 border-0 shadow-lg bg-gradient-to-br from-orange-50/30 via-amber-50/20 to-yellow-50/10 backdrop-blur-sm">
          <Accordion type="single" collapsible>
            <AccordionItem value="smart-recommendations" className="border-none">
              <AccordionTrigger className="hover:no-underline px-6 py-4">
                <div className="flex items-center gap-4 w-full">
                  <div className="flex items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 p-3 shadow-lg">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                      Smart Recommendations
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Personalized Ayurvedic insights for {selectedPatient.name}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
                    {recommendations.length} suggestions
                  </Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6">
                {recommendations.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium">No smart recommendations available</p>
                    <p className="text-sm text-gray-500 mt-1">Recommendations will appear based on patient profile</p>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {recommendations.map((rec, idx) => (
                      <Card key={idx} className="border border-orange-100/50 shadow-sm hover:shadow-md transition-shadow bg-white/80 backdrop-blur-sm">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-gray-900">
                              {rec["Sub-Category"]}
                            </CardTitle>
                            <Badge 
                              variant="outline" 
                              className="bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 border-orange-200"
                            >
                              {rec["Category Type"]}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                              <div>
                                <span className="font-medium text-green-700">Recommended:</span>
                                <p className="text-gray-700 mt-1">{rec["Recommended Foods"]}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                              <div>
                                <span className="font-medium text-red-700">Avoid:</span>
                                <p className="text-gray-700 mt-1">{rec["Avoid Foods"]}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <div>
                                <span className="font-medium text-blue-700">Meal Ideas:</span>
                                <p className="text-gray-700 mt-1">{rec["Meal Suggestions"]}</p>
                              </div>
                            </div>
                            
                            {rec["Special Notes"] && (
                              <div className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                                <div>
                                  <span className="font-medium text-amber-700">Notes:</span>
                                  <p className="text-gray-700 mt-1">{rec["Special Notes"]}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Card>
      )}

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
                  {selectedPatient && (
                    <CardDescription>
                      Target: {calculateTargetCalories(selectedPatient)} calories
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold">{dailyTotals.calories}</p>
                      <p className="text-sm text-muted-foreground">Calories</p>
                      {selectedPatient && (
                        <p className="text-xs text-muted-foreground">
                          {((dailyTotals.calories / calculateTargetCalories(selectedPatient)) * 100).toFixed(0)}% of target
                        </p>
                      )}
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
                <Button 
                  onClick={handleSaveDietChart} 
                  className="w-full"
                  disabled={!selectedPatient || !Object.values(selectedFoods).some(meals => meals.length > 0)}
                >
                  Save Diet Chart
                </Button>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={!canExport}
                    onClick={handleExportPDF}
                  >
                    PDF
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={!canExport}
                    onClick={handleExportCSV}
                  >
                    CSV
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={!canExport}
                    onClick={handleExportJSON}
                  >
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
                        Created: {new Date(chart.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex justify-between text-sm">
                        <span>Created: {new Date(chart.createdAt).toLocaleDateString()}</span>
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
                {selectedPatient && ` for ${selectedPatient.name}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-green-600">{dailyTotals.calories}</p>
                  <p className="text-sm text-muted-foreground">Total Calories</p>
                  <p className="text-xs">
                    Target: {selectedPatient ? calculateTargetCalories(selectedPatient) : '1800'}
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-blue-600">{dailyTotals.protein}g</p>
                  <p className="text-sm text-muted-foreground">Protein</p>
                  <p className="text-xs">
                    Target: {selectedPatient ? Math.round(selectedPatient.weight * 1.2) : '120'}g
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-orange-600">{dailyTotals.carbohydrates}g</p>
                  <p className="text-sm text-muted-foreground">Carbs</p>
                  <p className="text-xs">
                    Target: {selectedPatient ? Math.round((calculateTargetCalories(selectedPatient) * 0.45) / 4) : '200'}g
                  </p>
                </div>
                <div className="text-center p-4 rounded-lg bg-muted/50">
                  <p className="text-2xl font-bold text-purple-600">{dailyTotals.fat}g</p>
                  <p className="text-sm text-muted-foreground">Fat</p>
                  <p className="text-xs">
                    Target: {selectedPatient ? Math.round((calculateTargetCalories(selectedPatient) * 0.3) / 9) : '60'}g
                  </p>
                </div>
              </div>
              
              {selectedPatient && (
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <h4 className="font-semibold mb-2">Patient Profile Summary</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Constitution:</span>
                      <p className="font-medium capitalize">{selectedPatient.constitution}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Activity Level:</span>
                      <p className="font-medium capitalize">{selectedPatient.lifestyle.activityLevel}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">BMI:</span>
                      <p className="font-medium">
                        {(selectedPatient.weight / Math.pow(selectedPatient.height / 100, 2)).toFixed(1)}
                      </p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Age:</span>
                      <p className="font-medium">{selectedPatient.age} years</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
