"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Activity, Languages, Search, Plus, BookOpen, Calendar, User, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { type DietPlan, getDietPlans, deleteDietPlan, getPatientById } from "@/lib/database"

export default function DietPlansPage() {
  const [dietPlans, setDietPlans] = useState<DietPlan[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [language, setLanguage] = useState<"en" | "hi">("en")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDietPlans()
  }, [])

  const loadDietPlans = () => {
    const allPlans = getDietPlans()
    setDietPlans(allPlans)
    setLoading(false)
  }

  const handleDeletePlan = (id: string) => {
    if (
      confirm(
        language === "en"
          ? "Are you sure you want to delete this diet plan?"
          : "क्या आप वाकई इस आहार योजना को हटाना चाहते हैं?",
      )
    ) {
      deleteDietPlan(id)
      loadDietPlans()
    }
  }

  const filteredPlans = dietPlans.filter((plan) => plan.planName.toLowerCase().includes(searchTerm.toLowerCase()))

  const getPatientName = (patientId: string): string => {
    const patient = getPatientById(patientId)
    return patient ? patient.name : "Unknown Patient"
  }

  const content = {
    en: {
      title: "Diet Plans",
      subtitle: "Manage personalized Ayurvedic diet plans for patients",
      createNew: "Create New Plan",
      search: "Search diet plans...",
      noPlans: "No diet plans found",
      noResults: "No plans match your search",
      patient: "Patient",
      duration: "Duration",
      created: "Created",
      actions: "Actions",
      view: "View",
      delete: "Delete",
      days: "days",
    },
    hi: {
      title: "आहार योजनाएं",
      subtitle: "रोगियों के लिए व्यक्तिगत आयुर्वेदिक आहार योजनाओं का प्रबंधन करें",
      createNew: "नई योजना बनाएं",
      search: "आहार योजनाएं खोजें...",
      noPlans: "कोई आहार योजना नहीं मिली",
      noResults: "आपकी खोज से कोई योजना मेल नहीं खाती",
      patient: "रोगी",
      duration: "अवधि",
      created: "बनाया गया",
      actions: "कार्य",
      view: "देखें",
      delete: "हटाएं",
      days: "दिन",
    },
  }

  const currentContent = content[language]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p>Loading diet plans...</p>
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

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={currentContent.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Link href="/diet-plans/create">
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span className={language === "hi" ? "font-devanagari" : ""}>{currentContent.createNew}</span>
            </Button>
          </Link>
        </div>

        {/* Diet Plans Grid */}
        {filteredPlans.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className={`text-lg font-semibold mb-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                {dietPlans.length === 0 ? currentContent.noPlans : currentContent.noResults}
              </h3>
              {dietPlans.length === 0 && (
                <Link href="/diet-plans/create">
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
            {filteredPlans.map((plan) => (
              <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{plan.planName}</CardTitle>
                      <CardDescription className="flex items-center space-x-2">
                        <User className="h-3 w-3" />
                        <span>{getPatientName(plan.patientId)}</span>
                      </CardDescription>
                    </div>
                    <Badge variant="outline">
                      {plan.duration} {currentContent.days}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Breakfast</p>
                        <p className="font-medium">{plan.meals.breakfast.length} items</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Lunch</p>
                        <p className="font-medium">{plan.meals.lunch.length} items</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Dinner</p>
                        <p className="font-medium">{plan.meals.dinner.length} items</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Snacks</p>
                        <p className="font-medium">{plan.meals.snacks.length} items</p>
                      </div>
                    </div>

                    <div className="flex items-center text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span className={language === "hi" ? "font-devanagari" : ""}>
                        {currentContent.created}: {new Date(plan.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Link href={`/diet-plans/${plan.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full bg-transparent">
                          <Eye className="h-3 w-3 mr-1" />
                          <span className={language === "hi" ? "font-devanagari" : ""}>{currentContent.view}</span>
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeletePlan(plan.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
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
