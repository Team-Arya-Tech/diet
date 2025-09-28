"use client"

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Activity, Languages, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { EnhancedPatientForm } from "@/components/ui/enhanced-patient-form"
import { type Patient, savePatient, generateId } from "@/lib/database"
import { type EnhancedPatient, EnhancedPatientService } from "@/lib/enhanced-patient-management"

export default function NewPatientPage() {
  const router = useRouter()
  const [language, setLanguage] = useState<"en" | "hi">("en")

  const content = {
    en: {
      title: "Add New Patient",
      subtitle: "Create a comprehensive patient profile for personalized Ayurvedic care",
    },
    hi: {
      title: "नया रोगी जोड़ें",
      subtitle: "व्यक्तिगत आयुर्वेदिक देखभाल के लिए एक व्यापक रोगी प्रोफ़ाइल बनाएं",
    },
  }

  const currentContent = content[language]

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
      occupation: enhancedPatient.address || '', // Use available field
      createdAt: enhancedPatient.createdAt,
      updatedAt: enhancedPatient.updatedAt,
    }
  }

  const handleSavePatient = (enhancedPatient: EnhancedPatient) => {
    // Save both enhanced and basic versions
    EnhancedPatientService.savePatient(enhancedPatient)
    const basicPatient = convertToBasicPatient(enhancedPatient)
    savePatient(basicPatient)
    
    router.push("/patients")
  }

  const handleCancel = () => {
    router.push("/patients")
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
            <Link href="/patients">
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
          onSave={handleSavePatient}
          onCancel={handleCancel}
        />
      </div>
    </div>
  )
}
