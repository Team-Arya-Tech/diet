"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Activity, Languages, ArrowLeft, UserPlus } from "lucide-react"
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
                <UserPlus className="h-8 w-8 text-amber-900" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <Link href="/patients">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-white/80 hover:bg-white border-amber-300 text-amber-800 hover:text-amber-900"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      {language === "en" ? "Back to Patients" : "रोगियों पर वापस जाएं"}
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

        {/* Form Container with Consistent Theme */}
        <div className="max-w-4xl mx-auto">
          <div 
            className="relative rounded-xl overflow-hidden border-2 border-amber-900/60 shadow-lg"
            style={{
              backgroundImage: 'url("/bg10.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px]"></div>
            <div className="relative z-10 p-6">
              <EnhancedPatientForm
                onSave={handleSavePatient}
                onCancel={handleCancel}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
