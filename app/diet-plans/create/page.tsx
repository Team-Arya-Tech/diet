"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Activity, Languages, ArrowLeft, Save, User, Settings, Target, X, BookOpen } from "lucide-react"
import Link from "next/link"
import { type Patient, getPatients, saveDietPlan } from "@/lib/database"
import { type DietPlanOptions } from "@/lib/diet-plan-generator"

export default function CreateDietPlanPage() {
  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [language, setLanguage] = useState<"en" | "hi">("en")
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [options, setOptions] = useState<DietPlanOptions>({
    duration: 7,
    mealsPerDay: 3,
    includeSnacks: true,
    focusAreas: [],
    avoidFoods: [],
  })

  const [newFocusArea, setNewFocusArea] = useState("")
  const [newAvoidFood, setNewAvoidFood] = useState("")

  useEffect(() => {
    const allPatients = getPatients()
    setPatients(allPatients)
  }, [])

  const handlePatientSelect = (patientId: string) => {
    const patient = patients.find((p) => p.id === patientId)
    setSelectedPatient(patient || null)
  }

  const addFocusArea = () => {
    if (newFocusArea.trim() && !options.focusAreas.includes(newFocusArea.trim())) {
      setOptions((prev) => ({
        ...prev,
        focusAreas: [...prev.focusAreas, newFocusArea.trim()],
      }))
      setNewFocusArea("")
    }
  }

  const removeFocusArea = (area: string) => {
    setOptions((prev) => ({
      ...prev,
      focusAreas: prev.focusAreas.filter((a) => a !== area),
    }))
  }

  const addAvoidFood = () => {
    if (newAvoidFood.trim() && !options.avoidFoods.includes(newAvoidFood.trim())) {
      setOptions((prev) => ({
        ...prev,
        avoidFoods: [...prev.avoidFoods, newAvoidFood.trim()],
      }))
      setNewAvoidFood("")
    }
  }

  const removeAvoidFood = (food: string) => {
    setOptions((prev) => ({
      ...prev,
      avoidFoods: prev.avoidFoods.filter((f) => f !== food),
    }))
  }

  const handleGeneratePlan = async () => {
    if (!selectedPatient) return
    setError(null)
    setGenerating(true)
    try {
      const res = await fetch("/api/ai-diet-chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient: selectedPatient, options }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to generate diet plan")
      }
      const { dietPlan } = await res.json()
      // Save to local storage for now (simulate DB save)
      if (dietPlan) {
        // Use dynamic import to avoid SSR issues
        const { saveDietPlan } = await import("@/lib/database")
        saveDietPlan(dietPlan)
        router.push(`/diet-plans/${dietPlan.id}`)
      } else {
        throw new Error("No diet plan returned from AI")
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate diet plan")
    } finally {
      setGenerating(false)
    }
  }

  const content = {
    en: {
      title: "Create Diet Plan",
      subtitle: "Generate a personalized Ayurvedic diet plan for a patient",
      selectPatient: "Select Patient",
      planOptions: "Plan Options",
      focusAreas: "Focus Areas",
      avoidFoods: "Foods to Avoid",
      generate: "Generate Diet Plan",
      cancel: "Cancel",
      duration: "Duration (days)",
      mealsPerDay: "Meals per day",
      includeSnacks: "Include snacks",
      addFocusArea: "Add Focus Area",
      addAvoidFood: "Add Food to Avoid",
      noPatients: "No patients available. Please add patients first.",
      generating: "Generating plan...",
      selectPatientFirst: "Please select a patient first",
    },
    hi: {
      title: "आहार योजना बनाएं",
      subtitle: "रोगी के लिए व्यक्तिगत आयुर्वेदिक आहार योजना बनाएं",
      selectPatient: "रोगी चुनें",
      planOptions: "योजना विकल्प",
      focusAreas: "फोकस क्षेत्र",
      avoidFoods: "बचने वाले खाद्य पदार्थ",
      generate: "आहार योजना बनाएं",
      cancel: "रद्द करें",
      duration: "अवधि (दिन)",
      mealsPerDay: "प्रति दिन भोजन",
      includeSnacks: "नाश्ता शामिल करें",
      addFocusArea: "फोकस क्षेत्र जोड़ें",
      addAvoidFood: "बचने वाला भोजन जोड़ें",
      noPatients: "कोई रोगी उपलब्ध नहीं। कृपया पहले रोगी जोड़ें।",
      generating: "योजना बना रहे हैं...",
      selectPatientFirst: "कृपया पहले एक रोगी चुनें",
    },
  }

  const currentContent = content[language]

  const focusAreaOptions = [
    "Weight Loss",
    "Weight Gain",
    "Immunity Boost",
    "Digestive Health",
    "Heart Health",
    "Diabetes Management",
    "Stress Relief",
    "Energy Boost",
    "Skin Health",
    "Joint Health",
    "Mental Clarity",
    "Sleep Quality",
  ]

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 min-h-screen" style={{
        backgroundImage: 'url("/main_bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Enhanced Header Section */}
        <div className="mb-6">
          <div 
            className="relative rounded-xl overflow-hidden p-6 mb-4 min-h-[140px] border-2"
            style={{
              backgroundColor: '#E8E0D0',
              borderColor: '#D4C4A8',
              backgroundImage: 'url("/banner_canva.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div 
                className="p-4 rounded-xl w-fit border-2"
                style={{
                  backgroundColor: '#F0E6D2',
                  borderColor: '#D4C4A8'
                }}
              >
                <BookOpen className="h-8 w-8 text-amber-900" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <Link href="/diet-plans">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-white/80 hover:bg-white border-amber-300 text-amber-800 hover:text-amber-900"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      {language === "en" ? "Back to Diet Plans" : "आहार योजना पर वापस"}
                    </Button>
                  </Link>
                </div>
                <h1 className={`text-2xl sm:text-3xl font-bold text-amber-900 ${language === "hi" ? "font-devanagari" : ""}`}>
                  {currentContent.title}
                </h1>
                <p className={`text-base sm:text-lg text-amber-800 mt-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                  {currentContent.subtitle}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage(language === "en" ? "hi" : "en")}
                className="flex items-center space-x-2 bg-white/80 hover:bg-white"
              >
                <Languages className="h-4 w-4" />
                <span>{language === "en" ? "हिंदी" : "English"}</span>
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded border border-red-200 animate-pulse">
            <span className="font-semibold">Error:</span> {error}
          </div>
        )}
        {patients.length === 0 ? (
          <Card 
            className="text-center py-12 border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 backdrop-blur-sm"
            style={{
              backgroundImage: 'url("/bg10.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundBlendMode: 'soft-light'
            }}
          >
            <CardContent>
              <User className="h-12 w-12 text-amber-700 mx-auto mb-4" />
              <h3 className={`text-lg font-semibold mb-2 text-amber-900 ${language === "hi" ? "font-devanagari" : ""}`}>
                {currentContent.noPatients}
              </h3>
              <Link href="/patients/new">
                <Button className="mt-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0">
                  {language === "en" ? "Add Patient" : "नया रोगी जोड़ें"}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Patient Selection */}
            <Card 
              className="border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 backdrop-blur-sm"
              style={{
                backgroundImage: 'url("/bg3.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundBlendMode: 'soft-light'
              }}
            >
              <CardHeader className="pb-4">
                <CardTitle className={`flex items-center space-x-3 text-amber-900 ${language === "hi" ? "font-devanagari" : ""}`}>
                  <div className="p-2 rounded-lg bg-amber-100 border border-amber-300">
                    <User className="h-5 w-5 text-amber-700" />
                  </div>
                  <span className="text-lg font-semibold">{currentContent.selectPatient}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select onValueChange={handlePatientSelect}>
                  <SelectTrigger className="h-11 border-2 border-amber-200 focus:border-amber-500 bg-white/80">
                    <SelectValue placeholder={language === "en" ? "Choose a patient" : "एक रोगी चुनें"} />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name} - {patient.constitution} ({patient.age}y, {patient.gender})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedPatient && (
                  <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <h4 className="font-semibold mb-2 text-amber-900">{selectedPatient.name}</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Constitution:</span>
                        <Badge className="ml-2">{selectedPatient.constitution}</Badge>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Age:</span>
                        <span className="ml-2 font-medium">{selectedPatient.age}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Activity:</span>
                        <span className="ml-2 font-medium capitalize">{selectedPatient.lifestyle.activityLevel}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Conditions:</span>
                        <span className="ml-2 font-medium">{selectedPatient.currentConditions.length}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Plan Options */}
            <Card 
              className="border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 backdrop-blur-sm"
              style={{
                backgroundImage: 'url("/bg18.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundBlendMode: 'soft-light'
              }}
            >
              <CardHeader className="pb-4">
                <CardTitle className={`flex items-center space-x-3 text-amber-900 ${language === "hi" ? "font-devanagari" : ""}`}>
                  <div className="p-2 rounded-lg bg-amber-100 border border-amber-300">
                    <Settings className="h-5 w-5 text-amber-700" />
                  </div>
                  <span className="text-lg font-semibold">{currentContent.planOptions}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className={`font-medium text-amber-900 ${language === "hi" ? "font-devanagari" : ""}`}>{currentContent.duration}</Label>
                    <Select
                      value={options.duration.toString()}
                      onValueChange={(value) => setOptions((prev) => ({ ...prev, duration: Number.parseInt(value) }))}
                    >
                      <SelectTrigger className="h-11 border-2 border-amber-200 focus:border-amber-500 bg-white/80">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 days</SelectItem>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="14">14 days</SelectItem>
                        <SelectItem value="21">21 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className={`font-medium text-amber-900 ${language === "hi" ? "font-devanagari" : ""}`}>{currentContent.mealsPerDay}</Label>
                    <Select
                      value={options.mealsPerDay.toString()}
                      onValueChange={(value) =>
                        setOptions((prev) => ({ ...prev, mealsPerDay: Number.parseInt(value) }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2">2 meals</SelectItem>
                        <SelectItem value="3">3 meals</SelectItem>
                        <SelectItem value="4">4 meals</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeSnacks"
                    checked={options.includeSnacks}
                    onCheckedChange={(checked) => setOptions((prev) => ({ ...prev, includeSnacks: !!checked }))}
                  />
                  <Label htmlFor="includeSnacks" className={language === "hi" ? "font-devanagari" : ""}>
                    {currentContent.includeSnacks}
                  </Label>
                </div>
              </CardContent>
            </Card>

            {/* Focus Areas */}
            <Card 
              className="border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 backdrop-blur-sm"
              style={{
                backgroundImage: 'url("/bg14.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundBlendMode: 'soft-light'
              }}
            >
              <CardHeader className="pb-4">
                <CardTitle className={`flex items-center space-x-3 text-amber-900 ${language === "hi" ? "font-devanagari" : ""}`}>
                  <div className="p-2 rounded-lg bg-amber-100 border border-amber-300">
                    <Target className="h-5 w-5 text-amber-700" />
                  </div>
                  <span className="text-lg font-semibold">{currentContent.focusAreas}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Select value={newFocusArea} onValueChange={setNewFocusArea}>
                    <SelectTrigger className="flex-1 h-11 border-2 border-amber-200 focus:border-amber-500 bg-white/80">
                      <SelectValue placeholder={language === "en" ? "Select focus area" : "फोकस एरिया चुनें"} />
                    </SelectTrigger>
                    <SelectContent>
                      {focusAreaOptions.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" onClick={addFocusArea} variant="outline" className="bg-white/80 hover:bg-white border-amber-300 text-amber-800 hover:text-amber-900">
                    {currentContent.addFocusArea}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {options.focusAreas.map((area, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                      <span>{area}</span>
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeFocusArea(area)} />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Foods to Avoid */}
            <Card 
              className="border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 backdrop-blur-sm"
              style={{
                backgroundImage: 'url("/bg10.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundBlendMode: 'soft-light'
              }}
            >
              <CardHeader className="pb-4">
                <CardTitle className={`flex items-center space-x-3 text-amber-900 ${language === "hi" ? "font-devanagari" : ""}`}>
                  <div className="p-2 rounded-lg bg-amber-100 border border-amber-300">
                    <X className="h-5 w-5 text-amber-700" />
                  </div>
                  <span className="text-lg font-semibold">{currentContent.avoidFoods}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newAvoidFood}
                    onChange={(e) => setNewAvoidFood(e.target.value)}
                    placeholder={language === "en" ? "Enter food to avoid" : "बचने वाला खाद्य दर्ज करें"}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAvoidFood())}
                    className="h-11 border-2 border-amber-200 focus:border-amber-500 bg-white/80"
                  />
                  <Button type="button" onClick={addAvoidFood} variant="outline" className="bg-white/80 hover:bg-white border-amber-300 text-amber-800 hover:text-amber-900">
                    {currentContent.addAvoidFood}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {options.avoidFoods.map((food, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                      <span>{food}</span>
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeAvoidFood(food)} />
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex space-x-4 pt-6">
              <Button
                onClick={handleGeneratePlan}
                disabled={!selectedPatient || generating}
                className={`flex items-center space-x-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 px-8 py-3 h-12 ${generating ? "animate-pulse" : ""}`}
              >
                <Save className="h-5 w-5" />
                <span className={`font-semibold ${language === "hi" ? "font-devanagari" : ""}`}>
                  {generating ? currentContent.generating : currentContent.generate}
                </span>
              </Button>
              <Link href="/diet-plans">
                <Button variant="outline" className="bg-white/80 hover:bg-white border-amber-300 text-amber-800 hover:text-amber-900 px-8 py-3 h-12">
                  <span className={`font-semibold ${language === "hi" ? "font-devanagari" : ""}`}>{currentContent.cancel}</span>
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
