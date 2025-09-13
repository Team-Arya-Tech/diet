"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Activity,
  Languages,
  ArrowLeft,
  Edit,
  User,
  Heart,
  Briefcase,
  Calendar,
  Droplets,
  Moon,
  Zap,
  Clock,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { type Patient, getPatientById, generateIntelligentDietPlan, saveDietPlan } from "@/lib/database"
import { generateAIDietChart } from "@/lib/ai-diet-generator"

export default function PatientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [patient, setPatient] = useState<Patient | null>(null)
  const [language, setLanguage] = useState<"en" | "hi">("en")
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [generatingAI, setGeneratingAI] = useState(false)

  useEffect(() => {
    if (params.id) {
      const patientData = getPatientById(params.id as string)
      setPatient(patientData)
      setLoading(false)
    }
  }, [params.id])

  const handleGenerateDietPlan = async () => {
    if (!patient) return
    
    setGenerating(true)
    try {
      const newDietPlan = generateIntelligentDietPlan(patient)
      if (newDietPlan) {
        saveDietPlan(newDietPlan)
        // Redirect to the new diet plan
        router.push(`/diet-plans/${newDietPlan.id}`)
      } else {
        alert("Unable to generate diet plan. Please check patient profile completeness.")
      }
    } catch (error) {
      console.error("Error generating diet plan:", error)
      alert("Error generating diet plan. Please try again.")
    } finally {
      setGenerating(false)
    }
  }

  const handleGenerateAIDietPlan = async () => {
    if (!patient) return
    
    setGeneratingAI(true)
    try {
      const aiDietPlan = await generateAIDietChart(patient, {
        duration: 7,
        focusArea: patient.currentConditions.length > 0 ? patient.currentConditions[0] : 'General wellness',
        dietaryStyle: 'Traditional Ayurvedic'
      })
      
      if (aiDietPlan) {
        saveDietPlan(aiDietPlan)
        // Redirect to the new AI-generated diet plan
        router.push(`/diet-plans/${aiDietPlan.id}`)
      } else {
        alert("Unable to generate AI diet plan. Please check your internet connection and try again.")
      }
    } catch (error) {
      console.error("Error generating AI diet plan:", error)
      alert("Error generating AI diet plan. Please try again.")
    } finally {
      setGeneratingAI(false)
    }
  }

  const getConstitutionColor = (constitution: string) => {
    switch (constitution) {
      case "vata":
        return "bg-blue-100 text-blue-800"
      case "pitta":
        return "bg-red-100 text-red-800"
      case "kapha":
        return "bg-green-100 text-green-800"
      case "vata-pitta":
        return "bg-purple-100 text-purple-800"
      case "pitta-kapha":
        return "bg-orange-100 text-orange-800"
      case "vata-kapha":
        return "bg-teal-100 text-teal-800"
      case "tridoshic":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const content = {
    en: {
      title: "Patient Details",
      edit: "Edit Patient",
      generateDietPlan: "Generate AI Diet Plan",
      generateAIDietPlan: "Generate Advanced AI Plan",
      personalInfo: "Personal Information",
      constitution: "Ayurvedic Constitution",
      healthInfo: "Health Information",
      lifestyle: "Lifestyle Information",
      name: "Name",
      age: "Age",
      gender: "Gender",
      weight: "Weight",
      height: "Height",
      occupation: "Occupation",
      currentConditions: "Current Conditions",
      dietaryRestrictions: "Dietary Restrictions",
      medicalHistory: "Medical History",
      activityLevel: "Activity Level",
      sleepHours: "Sleep Hours",
      stressLevel: "Stress Level",
      waterIntake: "Water Intake",
      mealTiming: "Meal Timing",
      createdAt: "Created",
      updatedAt: "Last Updated",
      none: "None specified",
      kg: "kg",
      cm: "cm",
      hours: "hours/night",
      liters: "liters/day",
    },
    hi: {
      title: "रोगी विवरण",
      edit: "रोगी संपादित करें",
      generateDietPlan: "AI आहार योजना बनाएं",
      generateAIDietPlan: "उन्नत AI योजना बनाएं",
      personalInfo: "व्यक्तिगत जानकारी",
      constitution: "आयुर्वेदिक संविधान",
      healthInfo: "स्वास्थ्य जानकारी",
      lifestyle: "जीवनशैली की जानकारी",
      name: "नाम",
      age: "आयु",
      gender: "लिंग",
      weight: "वजन",
      height: "ऊंचाई",
      occupation: "व्यवसाय",
      currentConditions: "वर्तमान स्थितियां",
      dietaryRestrictions: "आहार प्रतिबंध",
      medicalHistory: "चिकित्सा इतिहास",
      activityLevel: "गतिविधि स्तर",
      sleepHours: "नींद के घंटे",
      stressLevel: "तनाव का स्तर",
      waterIntake: "पानी का सेवन",
      mealTiming: "भोजन का समय",
      createdAt: "बनाया गया",
      updatedAt: "अंतिम अपडेट",
      none: "कोई निर्दिष्ट नहीं",
      kg: "किग्रा",
      cm: "सेमी",
      hours: "घंटे/रात",
      liters: "लीटर/दिन",
    },
  }

  const currentContent = content[language]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p>Loading patient details...</p>
        </div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Patient not found</h2>
          <Link href="/patients">
            <Button>Back to Patients</Button>
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
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Link href="/patients">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                onClick={handleGenerateAIDietPlan}
                disabled={generatingAI}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
              >
                <Sparkles className="h-4 w-4" />
                <span className={language === "hi" ? "font-devanagari" : ""}>
                  {generatingAI ? "Generating AI Plan..." : currentContent.generateAIDietPlan}
                </span>
              </Button>
              <Button
                onClick={handleGenerateDietPlan}
                disabled={generating}
                className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600"
              >
                <Sparkles className="h-4 w-4" />
                <span className={language === "hi" ? "font-devanagari" : ""}>
                  {generating ? "Generating..." : currentContent.generateDietPlan}
                </span>
              </Button>
              <Link href={`/patients/${patient.id}/edit`}>
                <Button className="flex items-center space-x-2">
                  <Edit className="h-4 w-4" />
                  <span className={language === "hi" ? "font-devanagari" : ""}>{currentContent.edit}</span>
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">{patient.name}</h1>
              <div className="flex items-center space-x-4 text-muted-foreground">
                <span>
                  {currentContent.age}: {patient.age}
                </span>
                <span>•</span>
                <span className="capitalize">{patient.gender}</span>
                <span>•</span>
                <Badge className={getConstitutionColor(patient.constitution)}>{patient.constitution}</Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                <User className="h-5 w-5" />
                <span>{currentContent.personalInfo}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p
                    className={`text-sm font-medium text-muted-foreground ${language === "hi" ? "font-devanagari" : ""}`}
                  >
                    {currentContent.name}
                  </p>
                  <p className="font-medium">{patient.name}</p>
                </div>
                <div>
                  <p
                    className={`text-sm font-medium text-muted-foreground ${language === "hi" ? "font-devanagari" : ""}`}
                  >
                    {currentContent.age}
                  </p>
                  <p className="font-medium">{patient.age}</p>
                </div>
                <div>
                  <p
                    className={`text-sm font-medium text-muted-foreground ${language === "hi" ? "font-devanagari" : ""}`}
                  >
                    {currentContent.gender}
                  </p>
                  <p className="font-medium capitalize">{patient.gender}</p>
                </div>
                <div>
                  <p
                    className={`text-sm font-medium text-muted-foreground ${language === "hi" ? "font-devanagari" : ""}`}
                  >
                    {currentContent.weight}
                  </p>
                  <p className="font-medium">
                    {patient.weight} {currentContent.kg}
                  </p>
                </div>
                <div>
                  <p
                    className={`text-sm font-medium text-muted-foreground ${language === "hi" ? "font-devanagari" : ""}`}
                  >
                    {currentContent.height}
                  </p>
                  <p className="font-medium">
                    {patient.height} {currentContent.cm}
                  </p>
                </div>
                <div>
                  <p
                    className={`text-sm font-medium text-muted-foreground ${language === "hi" ? "font-devanagari" : ""}`}
                  >
                    {currentContent.occupation}
                  </p>
                  <p className="font-medium">{patient.occupation || currentContent.none}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Constitution */}
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                <Heart className="h-5 w-5" />
                <span>{currentContent.constitution}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <Badge className={`${getConstitutionColor(patient.constitution)} text-lg px-4 py-2`}>
                  {patient.constitution.toUpperCase()}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">Primary Ayurvedic constitution type</p>
              </div>
            </CardContent>
          </Card>

          {/* Health Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                <Heart className="h-5 w-5" />
                <span>{currentContent.healthInfo}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p
                  className={`text-sm font-medium text-muted-foreground mb-2 ${language === "hi" ? "font-devanagari" : ""}`}
                >
                  {currentContent.currentConditions}
                </p>
                <div className="flex flex-wrap gap-2">
                  {patient.currentConditions.length > 0 ? (
                    patient.currentConditions.map((condition, index) => (
                      <Badge key={index} variant="secondary">
                        {condition}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground">{currentContent.none}</p>
                  )}
                </div>
              </div>

              <div>
                <p
                  className={`text-sm font-medium text-muted-foreground mb-2 ${language === "hi" ? "font-devanagari" : ""}`}
                >
                  {currentContent.dietaryRestrictions}
                </p>
                <div className="flex flex-wrap gap-2">
                  {patient.dietaryRestrictions.length > 0 ? (
                    patient.dietaryRestrictions.map((restriction, index) => (
                      <Badge key={index} variant="outline">
                        {restriction}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground">{currentContent.none}</p>
                  )}
                </div>
              </div>

              <div>
                <p
                  className={`text-sm font-medium text-muted-foreground mb-2 ${language === "hi" ? "font-devanagari" : ""}`}
                >
                  {currentContent.medicalHistory}
                </p>
                <div className="flex flex-wrap gap-2">
                  {patient.medicalHistory.length > 0 ? (
                    patient.medicalHistory.map((history, index) => (
                      <Badge key={index} variant="secondary">
                        {history}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground">{currentContent.none}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lifestyle Information */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                <Briefcase className="h-5 w-5" />
                <span>{currentContent.lifestyle}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p
                      className={`text-sm font-medium text-muted-foreground ${language === "hi" ? "font-devanagari" : ""}`}
                    >
                      {currentContent.activityLevel}
                    </p>
                    <p className="font-medium capitalize">{patient.lifestyle.activityLevel}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Moon className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p
                      className={`text-sm font-medium text-muted-foreground ${language === "hi" ? "font-devanagari" : ""}`}
                    >
                      {currentContent.sleepHours}
                    </p>
                    <p className="font-medium">
                      {patient.lifestyle.sleepHours} {currentContent.hours}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p
                      className={`text-sm font-medium text-muted-foreground ${language === "hi" ? "font-devanagari" : ""}`}
                    >
                      {currentContent.stressLevel}
                    </p>
                    <p className="font-medium capitalize">{patient.lifestyle.stressLevel}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Droplets className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p
                      className={`text-sm font-medium text-muted-foreground ${language === "hi" ? "font-devanagari" : ""}`}
                    >
                      {currentContent.waterIntake}
                    </p>
                    <p className="font-medium">
                      {patient.lifestyle.waterIntake} {currentContent.liters}
                    </p>
                  </div>
                </div>
              </div>

              {patient.lifestyle.mealTiming && (
                <div className="mt-6">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Clock className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium text-muted-foreground mb-1 ${language === "hi" ? "font-devanagari" : ""}`}
                      >
                        {currentContent.mealTiming}
                      </p>
                      <p className="text-sm">{patient.lifestyle.mealTiming}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timestamps */}
          <Card className="lg:col-span-2">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span className={language === "hi" ? "font-devanagari" : ""}>
                    {currentContent.createdAt}: {new Date(patient.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span className={language === "hi" ? "font-devanagari" : ""}>
                    {currentContent.updatedAt}: {new Date(patient.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
