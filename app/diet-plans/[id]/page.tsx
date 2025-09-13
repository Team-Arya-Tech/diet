"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Activity,
  Languages,
  ArrowLeft,
  User,
  Calendar,
  Clock,
  Target,
  AlertCircle,
  CheckCircle,
  Coffee,
  Sun,
  Moon,
  Cookie,
} from "lucide-react"
import Link from "next/link"
import { type DietPlan, getDietPlans, getPatientById } from "@/lib/database"

export default function DietPlanDetailPage() {
  const params = useParams()
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null)
  const [patientName, setPatientName] = useState("")
  const [language, setLanguage] = useState<"en" | "hi">("en")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params.id) {
      const plans = getDietPlans()
      const plan = plans.find((p) => p.id === params.id)
      setDietPlan(plan || null)

      if (plan) {
        const patient = getPatientById(plan.patientId)
        setPatientName(patient ? patient.name : "Unknown Patient")
      }

      setLoading(false)
    }
  }, [params.id])

  const content = {
    en: {
      title: "Diet Plan Details",
      patient: "Patient",
      duration: "Duration",
      created: "Created",
      meals: "Meal Plan",
      breakfast: "Breakfast",
      lunch: "Lunch",
      dinner: "Dinner",
      snacks: "Snacks",
      recommendations: "General Recommendations",
      restrictions: "Dietary Restrictions",
      days: "days",
      noMeals: "No meals specified",
      noRecommendations: "No specific recommendations",
      noRestrictions: "No dietary restrictions",
    },
    hi: {
      title: "आहार योजना विवरण",
      patient: "रोगी",
      duration: "अवधि",
      created: "बनाया गया",
      meals: "भोजन योजना",
      breakfast: "नाश्ता",
      lunch: "दोपहर का खाना",
      dinner: "रात का खाना",
      snacks: "नाश्ता",
      recommendations: "सामान्य सिफारिशें",
      restrictions: "आहार प्रतिबंध",
      days: "दिन",
      noMeals: "कोई भोजन निर्दिष्ट नहीं",
      noRecommendations: "कोई विशिष्ट सिफारिश नहीं",
      noRestrictions: "कोई आहार प्रतिबंध नहीं",
    },
  }

  const currentContent = content[language]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p>Loading diet plan...</p>
        </div>
      </div>
    )
  }

  if (!dietPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Diet plan not found</h2>
          <Link href="/diet-plans">
            <Button>Back to Diet Plans</Button>
          </Link>
        </div>
      </div>
    )
  }

  const mealIcons = {
    breakfast: Coffee,
    lunch: Sun,
    dinner: Moon,
    snacks: Cookie,
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
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/diet-plans">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{dietPlan.planName}</h1>
              <div className="flex items-center space-x-4 text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>{patientName}</span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {dietPlan.duration} {currentContent.days}
                  </span>
                </div>
                <span>•</span>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(dietPlan.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Meal Plans */}
          <div className="space-y-6">
            <h2 className={`text-2xl font-bold ${language === "hi" ? "font-devanagari" : ""}`}>
              {currentContent.meals}
            </h2>

            {Object.entries(dietPlan.meals).map(([mealType, meals]) => {
              const MealIcon = mealIcons[mealType as keyof typeof mealIcons]
              const mealLabel = currentContent[mealType as keyof typeof currentContent] || mealType

              return (
                <Card key={mealType}>
                  <CardHeader>
                    <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                      <MealIcon className="h-5 w-5" />
                      <span className="capitalize">{mealLabel}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {meals.length > 0 ? (
                      <ul className="space-y-2">
                        {meals.map((meal, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm">{meal}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className={`text-muted-foreground text-sm ${language === "hi" ? "font-devanagari" : ""}`}>
                        {currentContent.noMeals}
                      </p>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Recommendations and Restrictions */}
          <div className="space-y-6">
            {/* General Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>{currentContent.recommendations}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dietPlan.recommendations.length > 0 ? (
                  <ul className="space-y-2">
                    {dietPlan.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={`text-muted-foreground text-sm ${language === "hi" ? "font-devanagari" : ""}`}>
                    {currentContent.noRecommendations}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Dietary Restrictions */}
            <Card>
              <CardHeader>
                <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <span>{currentContent.restrictions}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dietPlan.restrictions.length > 0 ? (
                  <ul className="space-y-2">
                    {dietPlan.restrictions.map((restriction, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{restriction}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={`text-muted-foreground text-sm ${language === "hi" ? "font-devanagari" : ""}`}>
                    {currentContent.noRestrictions}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Plan Summary */}
            <Card>
              <CardHeader>
                <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                  <Target className="h-5 w-5" />
                  <span>Plan Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Total Meals</p>
                    <p className="font-medium">
                      {dietPlan.meals.breakfast.length + dietPlan.meals.lunch.length + dietPlan.meals.dinner.length}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Snack Options</p>
                    <p className="font-medium">{dietPlan.meals.snacks.length}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Recommendations</p>
                    <p className="font-medium">{dietPlan.recommendations.length}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Restrictions</p>
                    <p className="font-medium">{dietPlan.restrictions.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
