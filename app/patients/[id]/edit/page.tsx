"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Activity, Languages, ArrowLeft, UserCog } from "lucide-react"
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
      <DashboardLayout>
        <div className="p-6 min-h-screen flex items-center justify-center" style={{
          backgroundImage: 'url("/main_bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
          <div className="text-center bg-white/80 backdrop-blur-[1px] rounded-xl p-8 border-2 border-amber-900/60">
            <Activity className="h-8 w-8 animate-spin text-amber-600 mx-auto mb-4" />
            <p className="text-amber-800">{currentContent.loading}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!patient) {
    return (
      <DashboardLayout>
        <div className="p-6 min-h-screen flex items-center justify-center" style={{
          backgroundImage: 'url("/main_bg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}>
          <div className="text-center bg-white/80 backdrop-blur-[1px] rounded-xl p-8 border-2 border-amber-900/60">
            <h2 className="text-2xl font-bold mb-4 text-amber-900">{currentContent.notFound}</h2>
            <Link href="/patients">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">{currentContent.backToPatients}</Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    )
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
                <UserCog className="h-8 w-8 text-amber-900" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-4 mb-2">
                  <Link href={`/patients/${params.id}`}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="bg-white/80 hover:bg-white border-amber-300 text-amber-800 hover:text-amber-900"
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      {language === "en" ? "Back to Patient" : "रोगी पर वापस जाएं"}
                    </Button>
                  </Link>
                </div>
                <h1 className={`text-2xl sm:text-3xl font-bold text-amber-900 ${language === "hi" ? "font-devanagari" : ""}`}>
                  {currentContent.title}
                </h1>
                <p className={`text-base sm:text-lg text-amber-800 mt-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                  {currentContent.subtitle}
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  {language === "en" ? `Editing: ${patient?.name}` : `संपादित कर रहे हैं: ${patient?.name}`}
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
                patient={patient}
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