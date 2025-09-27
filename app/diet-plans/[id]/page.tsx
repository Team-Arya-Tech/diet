"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Activity,
  Languages,
  ArrowLeft,
  Edit,
  Calendar,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  BookOpen,
  Leaf,
  Heart,
  User,
} from "lucide-react"
import Link from "next/link"
import { type DietPlan, getDietPlans, getPatientById } from "@/lib/database"
import { getRecommendationsForProfile } from "@/lib/ayurvedic-data"

export default function DietPlanDetailPage() {
  const params = useParams()
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null)
  const [patient, setPatient] = useState<any>(null)
  const [language, setLanguage] = useState<"en" | "hi">("en")
  const [loading, setLoading] = useState(true)
  const [recommendations, setRecommendations] = useState<any[]>([])

  useEffect(() => {
    if (params.id) {
      const plans = getDietPlans()
      const plan = plans.find(p => p.id === params.id)
      setDietPlan(plan || null)
      let patientData = null
      if (plan) {
        patientData = getPatientById(plan.patientId)
        setPatient(patientData)
      }
      // Smart Recommendations
      if (patientData) {
        const recs = getRecommendationsForProfile(
          patientData.age,
          patientData.gender,
          patientData.constitution,
          patientData.currentConditions,
          patientData.occupation
        )
        setRecommendations(recs)
      }
      setLoading(false)
    }
  }, [params.id])

  const content = {
    en: {
      title: "Diet Plan Details",
      overview: "Overview",
      meals: "Daily Meals",
      guidelines: "Ayurvedic Guidelines",
      progress: "Progress",
      planName: "Plan Name",
      patient: "Patient",
      duration: "Duration",
      startDate: "Start Date",
      endDate: "End Date",
      targetCalories: "Target Calories",
      objectives: "Objectives",
      restrictions: "Restrictions",
      recommendations: "Recommendations",
      constitution: "Constitution Focus",
      seasonal: "Seasonal Adaptations",
      lifestyle: "Lifestyle Recommendations",
      herbs: "Recommended Herbs",
      adherence: "Adherence",
      weightChange: "Weight Change",
      notes: "Notes",
      breakfast: "Breakfast",
      midMorning: "Mid-Morning",
      lunch: "Lunch",
      midAfternoon: "Mid-Afternoon",
      dinner: "Dinner",
      createdBy: "Created By",
      createdAt: "Created At",
      days: "days",
      kcal: "kcal/day",
      kg: "kg",
      none: "None specified",
    },
    hi: {
      title: "आहार योजना विवरण",
      overview: "अवलोकन",
      meals: "दैनिक भोजन",
      guidelines: "आयुर्वेदिक दिशानिर्देश",
      progress: "प्रगति",
      planName: "योजना का नाम",
      patient: "रोगी",
      duration: "अवधि",
      startDate: "प्रारंभ तिथि",
      endDate: "समाप्ति तिथि",
      targetCalories: "लक्षित कैलोरी",
      objectives: "उद्देश्य",
      restrictions: "प्रतिबंध",
      recommendations: "सिफारिशें",
      constitution: "संविधान फोकस",
      seasonal: "मौसमी अनुकूलन",
      lifestyle: "जीवनशैली सिफारिशें",
      herbs: "अनुशंसित जड़ी बूटी",
      adherence: "पालन",
      weightChange: "वजन परिवर्तन",
      notes: "नोट्स",
      breakfast: "नाश्ता",
      midMorning: "सुबह का नाश्ता",
      lunch: "दोपहर का खाना",
      midAfternoon: "दोपहर का नाश्ता",
      dinner: "रात का खाना",
      createdBy: "द्वारा बनाया गया",
      createdAt: "निर्माण तिथि",
      days: "दिन",
      kcal: "कैलोरी/दिन",
      kg: "किग्रा",
      none: "कोई निर्दिष्ट नहीं",
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
          <div className="flex items-center justify-between mb-4">
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
                <span>
                  {currentContent.duration}: {dietPlan.duration} {currentContent.days}
                </span>
                <span>•</span>
                <span>
                  {currentContent.targetCalories}: {dietPlan.targetCalories} {currentContent.kcal}
                </span>
                {patient && (
                  <>
                    <span>•</span>
                    <span>{currentContent.patient}: {patient.name}</span>
                  </>
                )}
              </div>
            </div>
            <Badge className={dietPlan.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
              {dietPlan.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className={language === "hi" ? "font-devanagari" : ""}>
              {currentContent.overview}
            </TabsTrigger>
            <TabsTrigger value="meals" className={language === "hi" ? "font-devanagari" : ""}>
              {currentContent.meals}
            </TabsTrigger>
            <TabsTrigger value="guidelines" className={language === "hi" ? "font-devanagari" : ""}>
              {currentContent.guidelines}
            </TabsTrigger>
            <TabsTrigger value="progress" className={language === "hi" ? "font-devanagari" : ""}>
              {currentContent.progress}
            </TabsTrigger>
            <TabsTrigger value="smart" className={language === "hi" ? "font-devanagari" : ""}>
              Smart Recommendations
            </TabsTrigger>
          </TabsList>
          {/* Smart Recommendations Tab */}
          <TabsContent value="smart" className="space-y-6">
            <div className="grid gap-6">
              {recommendations.length === 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>No smart recommendations found for this profile.</CardTitle>
                  </CardHeader>
                </Card>
              ) : (
                recommendations.map((rec, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <span>{rec["Sub-Category"]}</span>
                        <Badge variant="secondary">{rec["Category Type"]}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div>
                        <span className="font-semibold">Recommended Foods:</span>
                        <span className="ml-2">{rec["Recommended Foods"]}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Foods to Avoid:</span>
                        <span className="ml-2">{rec["Avoid Foods"]}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Meal Suggestions:</span>
                        <span className="ml-2">{rec["Meal Suggestions"]}</span>
                      </div>
                      <div>
                        <span className="font-semibold">Special Notes:</span>
                        <span className="ml-2">{rec["Special Notes"]}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Plan Information */}
              <Card>
                <CardHeader>
                  <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                    <Target className="h-5 w-5" />
                    <span>Plan Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className={`text-sm font-medium text-muted-foreground ${language === "hi" ? "font-devanagari" : ""}`}>
                        {currentContent.startDate}
                      </p>
                      <p className="font-medium">{new Date(dietPlan.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className={`text-sm font-medium text-muted-foreground ${language === "hi" ? "font-devanagari" : ""}`}>
                        {currentContent.endDate}
                      </p>
                      <p className="font-medium">
                        {dietPlan.endDate ? new Date(dietPlan.endDate).toLocaleDateString() : "Not specified"}
                      </p>
                    </div>
                    <div>
                      <p className={`text-sm font-medium text-muted-foreground ${language === "hi" ? "font-devanagari" : ""}`}>
                        {currentContent.createdBy}
                      </p>
                      <p className="font-medium">{dietPlan.createdBy}</p>
                    </div>
                    <div>
                      <p className={`text-sm font-medium text-muted-foreground ${language === "hi" ? "font-devanagari" : ""}`}>
                        {currentContent.createdAt}
                      </p>
                      <p className="font-medium">{new Date(dietPlan.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Objectives */}
              <Card>
                <CardHeader>
                  <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                    <CheckCircle className="h-5 w-5" />
                    <span>{currentContent.objectives}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {(dietPlan.objectives || []).map((objective, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle className={language === "hi" ? "font-devanagari" : ""}>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{dietPlan.description}</p>
              </CardContent>
            </Card>

            {/* Restrictions & Recommendations */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                    <AlertTriangle className="h-5 w-5" />
                    <span>{currentContent.restrictions}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {(dietPlan.restrictions || []).length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {(dietPlan.restrictions || []).map((restriction, index) => (
                        <Badge key={index} variant="destructive">
                          {restriction}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">{currentContent.none}</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                    <BookOpen className="h-5 w-5" />
                    <span>{currentContent.recommendations}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {(dietPlan.recommendations || []).map((recommendation, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Meals Tab */}
          <TabsContent value="meals" className="space-y-6">
            <div className="grid gap-6">
              {/* Check if using new dailyMeals structure */}
              {dietPlan.dailyMeals && Object.keys(dietPlan.dailyMeals).length > 0 ? (
                Object.entries(dietPlan.dailyMeals).map(([day, meals]) => (
                  <Card key={day}>
                    <CardHeader>
                      <CardTitle>Day {day}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4">
                        {Object.entries(meals).map(([mealType, mealData]) => (
                          <div key={mealType} className="border rounded-lg p-4">
                            <h4 className="font-semibold mb-2 capitalize">{mealType}</h4>
                            <div className="space-y-2">
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Foods:</p>
                                <div className="flex flex-wrap gap-1">
                                  {(mealData as any).recipes?.map((recipe: string, index: number) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {recipe}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              {(mealData as any).notes && (
                                <div>
                                  <p className="text-sm font-medium text-muted-foreground">Notes:</p>
                                  <p className="text-sm text-muted-foreground">{(mealData as any).notes}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                /* Fallback for old structure */
                <Card>
                  <CardHeader>
                    <CardTitle>Meal Plan</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {(dietPlan as any).meals && Object.entries((dietPlan as any).meals).map(([mealType, meals]) => (
                        <div key={mealType} className="border rounded-lg p-4">
                          <h4 className="font-semibold mb-2 capitalize">{mealType}</h4>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Foods:</p>
                              <div className="flex flex-wrap gap-1">
                                {(meals as string[])?.map((meal: string, index: number) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {meal}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Guidelines Tab */}
          <TabsContent value="guidelines" className="space-y-6">
            {dietPlan.ayurvedicGuidelines && (
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                      <Heart className="h-5 w-5" />
                      <span>{currentContent.constitution}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{dietPlan.ayurvedicGuidelines.constitutionFocus}</p>
                  </CardContent>
                </Card>

                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                        <Calendar className="h-5 w-5" />
                        <span>{currentContent.seasonal}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {dietPlan.ayurvedicGuidelines.seasonalAdaptations?.map((adaptation, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="h-2 w-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm">{adaptation}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                        <User className="h-5 w-5" />
                        <span>{currentContent.lifestyle}</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {dietPlan.ayurvedicGuidelines.lifestyleRecommendations?.map((recommendation, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="h-2 w-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm">{recommendation}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                      <Leaf className="h-5 w-5" />
                      <span>{currentContent.herbs}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {dietPlan.ayurvedicGuidelines.herbs?.map((herb, index) => (
                        <Badge key={index} variant="outline" className="bg-green-50 text-green-700">
                          {herb}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                    <CheckCircle className="h-5 w-5" />
                    <span>{currentContent.adherence}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{dietPlan.progress?.adherence || 0}%</div>
                    <p className="text-muted-foreground text-sm">Overall adherence to plan</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                    <Activity className="h-5 w-5" />
                    <span>{currentContent.weightChange}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">
                      {(dietPlan.progress?.weightChange || 0) > 0 ? "+" : ""}
                      {dietPlan.progress?.weightChange || 0} {currentContent.kg}
                    </div>
                    <p className="text-muted-foreground text-sm">Since plan start</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                    <BookOpen className="h-5 w-5" />
                    <span>{currentContent.notes}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {(dietPlan.progress?.notes || []).map((note, index) => (
                      <p key={index} className="text-sm text-muted-foreground">
                        {note}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {(dietPlan.progress?.symptomsImprovement?.length || 0) > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Symptoms Improvement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {dietPlan.progress?.symptomsImprovement?.map((symptom, index) => (
                      <Badge key={index} variant="outline" className="bg-green-50 text-green-700">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
