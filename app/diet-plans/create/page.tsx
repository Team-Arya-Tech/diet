"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Activity, Languages, ArrowLeft, Save, User, Settings, Target, X } from "lucide-react"
import Link from "next/link"
import { type Patient, getPatients, saveDietPlan } from "@/lib/database"
import { generateDietPlan, type DietPlanOptions } from "@/lib/diet-plan-generator"

export default function CreateDietPlanPage() {
  const router = useRouter()
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [language, setLanguage] = useState<"en" | "hi">("en")
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)

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

    setGenerating(true)
    try {
      const dietPlan = generateDietPlan(selectedPatient, options)
      saveDietPlan(dietPlan)
      router.push(`/diet-plans/${dietPlan.id}`)
    } catch (error) {
      console.error("Error generating diet plan:", error)
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
          <h1 className={`text-4xl font-bold mb-2 ${language === "hi" ? "font-devanagari" : ""}`}>
            {currentContent.title}
          </h1>
          <p className={`text-muted-foreground text-lg ${language === "hi" ? "font-devanagari" : ""}`}>
            {currentContent.subtitle}
          </p>
        </div>

        {patients.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className={`text-lg font-semibold mb-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                {currentContent.noPatients}
              </h3>
              <Link href="/patients/new">
                <Button className="mt-4">Add Patient</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Patient Selection */}
            <Card>
              <CardHeader>
                <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                  <User className="h-5 w-5" />
                  <span>{currentContent.selectPatient}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select onValueChange={handlePatientSelect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a patient" />
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
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">{selectedPatient.name}</h4>
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
            <Card>
              <CardHeader>
                <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                  <Settings className="h-5 w-5" />
                  <span>{currentContent.planOptions}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className={language === "hi" ? "font-devanagari" : ""}>{currentContent.duration}</Label>
                    <Select
                      value={options.duration.toString()}
                      onValueChange={(value) => setOptions((prev) => ({ ...prev, duration: Number.parseInt(value) }))}
                    >
                      <SelectTrigger>
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
                    <Label className={language === "hi" ? "font-devanagari" : ""}>{currentContent.mealsPerDay}</Label>
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
            <Card>
              <CardHeader>
                <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                  <Target className="h-5 w-5" />
                  <span>{currentContent.focusAreas}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Select value={newFocusArea} onValueChange={setNewFocusArea}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select focus area" />
                    </SelectTrigger>
                    <SelectContent>
                      {focusAreaOptions.map((area) => (
                        <SelectItem key={area} value={area}>
                          {area}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button type="button" onClick={addFocusArea} variant="outline">
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
            <Card>
              <CardHeader>
                <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                  <X className="h-5 w-5" />
                  <span>{currentContent.avoidFoods}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-2">
                  <Input
                    value={newAvoidFood}
                    onChange={(e) => setNewAvoidFood(e.target.value)}
                    placeholder="Enter food to avoid"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addAvoidFood())}
                  />
                  <Button type="button" onClick={addAvoidFood} variant="outline">
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
            <div className="flex space-x-4">
              <Button
                onClick={handleGeneratePlan}
                disabled={!selectedPatient || generating}
                className="flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span className={language === "hi" ? "font-devanagari" : ""}>
                  {generating ? currentContent.generating : currentContent.generate}
                </span>
              </Button>
              <Link href="/diet-plans">
                <Button variant="outline">
                  <span className={language === "hi" ? "font-devanagari" : ""}>{currentContent.cancel}</span>
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
