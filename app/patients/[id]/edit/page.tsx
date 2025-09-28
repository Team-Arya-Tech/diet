"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Activity, Languages, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { EnhancedPatientForm } from "@/components/ui/enhanced-patient-form"
import { type Patient, getPatientById, savePatient } from "@/lib/database"
import { type EnhancedPatient, EnhancedPatientService } from "@/lib/enhanced-patient-management"

export default function EditPatientPage() {
  const params = useParams()
  const router = useRouter()
  const [patient, setPatient] = useState<EnhancedPatient | null>(null)
  const [language, setLanguage] = useState<"en" | "hi">("en")
  const [loading, setLoading] = useState(true)

  const content = {
    en: {
      title: "Edit Patient",
      subtitle: "Update patient profile for personalized Ayurvedic care",
      loading: "Loading patient details...",
      notFound: "Patient not found",
      backToPatients: "Back to Patients",
    },
    hi: {
      title: "रोगी संपादित करें",
      subtitle: "व्यक्तिगत आयुर्वेदिक देखभाल के लिए रोगी प्रोफ़ाइल अपडेट करें",
      loading: "रोगी विवरण लोड हो रहा है...",
      notFound: "रोगी नहीं मिला",
      backToPatients: "रोगियों पर वापस जाएं",
    },
  }

  const currentContent = content[language]

  useEffect(() => {
    if (params.id) {
      // Try to get enhanced patient first
      const enhancedPatient = EnhancedPatientService.getPatientById(params.id as string)
      
      if (enhancedPatient) {
        setPatient(enhancedPatient)
      } else {
        // Fallback to basic patient and convert
        const basicPatient = getPatientById(params.id as string)
        if (basicPatient) {
          setPatient(convertBasicToEnhanced(basicPatient))
        }
      }
      setLoading(false)
    }
  }, [params.id])

  // Convert basic Patient to EnhancedPatient for editing
  const convertBasicToEnhanced = (basicPatient: Patient): EnhancedPatient => {
    return {
      id: basicPatient.id,
      name: basicPatient.name,
      age: basicPatient.age,
      gender: basicPatient.gender,
      email: '',
      phone: '',
      address: basicPatient.occupation || '',
      constitution: basicPatient.constitution,
      currentImbalance: [],
      mealFrequency: 3,
      bowelMovements: 'regular',
      waterIntake: basicPatient.lifestyle.waterIntake,
      sleepPattern: {
        bedTime: '22:00',
        wakeTime: '06:00',
        quality: 'good',
        duration: basicPatient.lifestyle.sleepHours
      },
      menstrualCycle: {
        regular: true,
        cycleLength: 28,
        flow: 'moderate',
        symptoms: []
      },
      height: basicPatient.height,
      weight: basicPatient.weight,
      bmi: EnhancedPatientService.calculateBMI(basicPatient.weight, basicPatient.height),
      activityLevel: basicPatient.lifestyle.activityLevel,
      stressLevel: basicPatient.lifestyle.stressLevel === 'low' ? 1 : 
                   basicPatient.lifestyle.stressLevel === 'moderate' ? 3 : 5,
      smokingStatus: 'never',
      alcoholConsumption: 'never',
      digestiveStrength: 'strong',
      foodPreferences: [],
      foodAllergies: [],
      foodIntolerances: [],
      currentSymptoms: basicPatient.currentConditions,
      chronicConditions: basicPatient.medicalHistory,
      healthGoals: [],
      dietaryRestrictions: basicPatient.dietaryRestrictions,
      culturalPreferences: [],
      medications: [],
      status: 'active',
      createdAt: basicPatient.createdAt,
      updatedAt: basicPatient.updatedAt
    }
  }

  // Convert EnhancedPatient to basic Patient for backward compatibility
  const convertToBasicPatient = (enhancedPatient: EnhancedPatient): Patient => {
    return {
      id: enhancedPatient.id,
      name: enhancedPatient.name,
      age: enhancedPatient.age,
      gender: enhancedPatient.gender,
      weight: enhancedPatient.weight,
      height: enhancedPatient.height,
      constitution: enhancedPatient.constitution,
      currentConditions: enhancedPatient.currentSymptoms || [],
      dietaryRestrictions: enhancedPatient.dietaryRestrictions || [],
      lifestyle: {
        activityLevel: enhancedPatient.activityLevel === 'light' ? 'moderate' : enhancedPatient.activityLevel,
        sleepHours: enhancedPatient.sleepPattern?.duration || 8,
        stressLevel: enhancedPatient.stressLevel === 1 ? 'low' : 
                   enhancedPatient.stressLevel <= 3 ? 'moderate' : 'high',
        waterIntake: enhancedPatient.waterIntake,
        mealTiming: `Meals per day: ${enhancedPatient.mealFrequency}`,
      },
      medicalHistory: enhancedPatient.chronicConditions || [],
      occupation: enhancedPatient.address || '',
      createdAt: enhancedPatient.createdAt,
      updatedAt: enhancedPatient.updatedAt,
    }
  }

  const handleSavePatient = (enhancedPatient: EnhancedPatient) => {
    // Save both enhanced and basic versions
    EnhancedPatientService.savePatient(enhancedPatient)
    const basicPatient = convertToBasicPatient(enhancedPatient)
    savePatient(basicPatient)
    
    router.push(`/patients/${enhancedPatient.id}`)
  }

  const handleCancel = () => {
    router.push(`/patients/${params.id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p>{currentContent.loading}</p>
        </div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{currentContent.notFound}</h2>
          <Link href="/patients">
            <Button>{currentContent.backToPatients}</Button>
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
          <div className="flex items-center space-x-4 mb-4">
            <Link href={`/patients/${params.id}`}>
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

        <EnhancedPatientForm
          patient={patient}
          onSave={handleSavePatient}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}