"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Activity, Languages, ArrowLeft, Save, User, Heart, Briefcase, X } from "lucide-react"
import Link from "next/link"
import { type Patient, savePatient, generateId } from "@/lib/database"

export default function NewPatientPage() {
  const router = useRouter()
  const [language, setLanguage] = useState<"en" | "hi">("en")
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
    constitution: "",
    currentConditions: [] as string[],
    dietaryRestrictions: [] as string[],
    lifestyle: {
      activityLevel: "",
      sleepHours: "",
      stressLevel: "",
      waterIntake: "",
      mealTiming: "",
    },
    medicalHistory: [] as string[],
    occupation: "",
  })

  const [newCondition, setNewCondition] = useState("")
  const [newRestriction, setNewRestriction] = useState("")
  const [newMedicalHistory, setNewMedicalHistory] = useState("")

  const content = {
    en: {
      title: "Add New Patient",
      subtitle: "Create a comprehensive patient profile for personalized Ayurvedic care",
      personalInfo: "Personal Information",
      constitution: "Ayurvedic Constitution",
      healthInfo: "Health Information",
      lifestyle: "Lifestyle Information",
      save: "Save Patient",
      cancel: "Cancel",
      name: "Full Name",
      age: "Age",
      gender: "Gender",
      weight: "Weight (kg)",
      height: "Height (cm)",
      male: "Male",
      female: "Female",
      other: "Other",
      currentConditions: "Current Health Conditions",
      addCondition: "Add Condition",
      dietaryRestrictions: "Dietary Restrictions",
      addRestriction: "Add Restriction",
      activityLevel: "Activity Level",
      sleepHours: "Sleep Hours per Night",
      stressLevel: "Stress Level",
      waterIntake: "Water Intake (Liters/day)",
      mealTiming: "Preferred Meal Timing",
      medicalHistory: "Medical History",
      addHistory: "Add Medical History",
      occupation: "Occupation",
      sedentary: "Sedentary",
      moderate: "Moderate",
      active: "Active",
      veryActive: "Very Active",
      low: "Low",
      high: "High",
    },
    hi: {
      title: "नया रोगी जोड़ें",
      subtitle: "व्यक्तिगत आयुर्वेदिक देखभाल के लिए एक व्यापक रोगी प्रोफ़ाइल बनाएं",
      personalInfo: "व्यक्तिगत जानकारी",
      constitution: "आयुर्वेदिक संविधान",
      healthInfo: "स्वास्थ्य जानकारी",
      lifestyle: "जीवनशैली की जानकारी",
      save: "रोगी सहेजें",
      cancel: "रद्द करें",
      name: "पूरा नाम",
      age: "आयु",
      gender: "लिंग",
      weight: "वजन (किग्रा)",
      height: "ऊंचाई (सेमी)",
      male: "पुरुष",
      female: "महिला",
      other: "अन्य",
      currentConditions: "वर्तमान स्वास्थ्य स्थितियां",
      addCondition: "स्थिति जोड़ें",
      dietaryRestrictions: "आहार प्रतिबंध",
      addRestriction: "प्रतिबंध जोड़ें",
      activityLevel: "गतिविधि स्तर",
      sleepHours: "प्रति रात नींद के घंटे",
      stressLevel: "तनाव का स्तर",
      waterIntake: "पानी का सेवन (लीटर/दिन)",
      mealTiming: "पसंदीदा भोजन समय",
      medicalHistory: "चिकित्सा इतिहास",
      addHistory: "चिकित्सा इतिहास जोड़ें",
      occupation: "व्यवसाय",
      sedentary: "गतिहीन",
      moderate: "मध्यम",
      active: "सक्रिय",
      veryActive: "बहुत सक्रिय",
      low: "कम",
      high: "उच्च",
    },
  }

  const currentContent = content[language]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const patient: Patient = {
        id: generateId(),
        name: formData.name,
        age: Number.parseInt(formData.age),
        gender: formData.gender as "male" | "female" | "other",
        weight: Number.parseFloat(formData.weight),
        height: Number.parseFloat(formData.height),
        constitution: formData.constitution as Patient["constitution"],
        currentConditions: formData.currentConditions,
        dietaryRestrictions: formData.dietaryRestrictions,
        lifestyle: {
          activityLevel: formData.lifestyle.activityLevel as Patient["lifestyle"]["activityLevel"],
          sleepHours: Number.parseFloat(formData.lifestyle.sleepHours),
          stressLevel: formData.lifestyle.stressLevel as Patient["lifestyle"]["stressLevel"],
          waterIntake: Number.parseFloat(formData.lifestyle.waterIntake),
          mealTiming: formData.lifestyle.mealTiming,
        },
        medicalHistory: formData.medicalHistory,
        occupation: formData.occupation,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      savePatient(patient)
      router.push("/patients")
    } catch (error) {
      console.error("Error saving patient:", error)
    } finally {
      setLoading(false)
    }
  }

  const addCondition = () => {
    if (newCondition.trim()) {
      setFormData((prev) => ({
        ...prev,
        currentConditions: [...prev.currentConditions, newCondition.trim()],
      }))
      setNewCondition("")
    }
  }

  const removeCondition = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      currentConditions: prev.currentConditions.filter((_, i) => i !== index),
    }))
  }

  const addRestriction = () => {
    if (newRestriction.trim()) {
      setFormData((prev) => ({
        ...prev,
        dietaryRestrictions: [...prev.dietaryRestrictions, newRestriction.trim()],
      }))
      setNewRestriction("")
    }
  }

  const removeRestriction = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.filter((_, i) => i !== index),
    }))
  }

  const addMedicalHistory = () => {
    if (newMedicalHistory.trim()) {
      setFormData((prev) => ({
        ...prev,
        medicalHistory: [...prev.medicalHistory, newMedicalHistory.trim()],
      }))
      setNewMedicalHistory("")
    }
  }

  const removeMedicalHistory = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      medicalHistory: prev.medicalHistory.filter((_, i) => i !== index),
    }))
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

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                <User className="h-5 w-5" />
                <span>{currentContent.personalInfo}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className={language === "hi" ? "font-devanagari" : ""}>
                  {currentContent.name}
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age" className={language === "hi" ? "font-devanagari" : ""}>
                  {currentContent.age}
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData((prev) => ({ ...prev, age: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className={language === "hi" ? "font-devanagari" : ""}>
                  {currentContent.gender}
                </Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">{currentContent.male}</SelectItem>
                    <SelectItem value="female">{currentContent.female}</SelectItem>
                    <SelectItem value="other">{currentContent.other}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight" className={language === "hi" ? "font-devanagari" : ""}>
                  {currentContent.weight}
                </Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData((prev) => ({ ...prev, weight: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="height" className={language === "hi" ? "font-devanagari" : ""}>
                  {currentContent.height}
                </Label>
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData((prev) => ({ ...prev, height: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation" className={language === "hi" ? "font-devanagari" : ""}>
                  {currentContent.occupation}
                </Label>
                <Input
                  id="occupation"
                  value={formData.occupation}
                  onChange={(e) => setFormData((prev) => ({ ...prev, occupation: e.target.value }))}
                />
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
              <div className="space-y-2">
                <Label className={language === "hi" ? "font-devanagari" : ""}>{currentContent.constitution}</Label>
                <Select
                  value={formData.constitution}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, constitution: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select constitution" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vata">Vata</SelectItem>
                    <SelectItem value="pitta">Pitta</SelectItem>
                    <SelectItem value="kapha">Kapha</SelectItem>
                    <SelectItem value="vata-pitta">Vata-Pitta</SelectItem>
                    <SelectItem value="pitta-kapha">Pitta-Kapha</SelectItem>
                    <SelectItem value="vata-kapha">Vata-Kapha</SelectItem>
                    <SelectItem value="tridoshic">Tridoshic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Health Information */}
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                <Heart className="h-5 w-5" />
                <span>{currentContent.healthInfo}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Current Conditions */}
              <div className="space-y-2">
                <Label className={language === "hi" ? "font-devanagari" : ""}>{currentContent.currentConditions}</Label>
                <div className="flex space-x-2">
                  <Input
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    placeholder="Enter condition"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCondition())}
                  />
                  <Button type="button" onClick={addCondition} variant="outline">
                    {currentContent.addCondition}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.currentConditions.map((condition, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                      <span>{condition}</span>
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeCondition(index)} />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Dietary Restrictions */}
              <div className="space-y-2">
                <Label className={language === "hi" ? "font-devanagari" : ""}>
                  {currentContent.dietaryRestrictions}
                </Label>
                <div className="flex space-x-2">
                  <Input
                    value={newRestriction}
                    onChange={(e) => setNewRestriction(e.target.value)}
                    placeholder="Enter restriction"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addRestriction())}
                  />
                  <Button type="button" onClick={addRestriction} variant="outline">
                    {currentContent.addRestriction}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.dietaryRestrictions.map((restriction, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                      <span>{restriction}</span>
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeRestriction(index)} />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Medical History */}
              <div className="space-y-2">
                <Label className={language === "hi" ? "font-devanagari" : ""}>{currentContent.medicalHistory}</Label>
                <div className="flex space-x-2">
                  <Input
                    value={newMedicalHistory}
                    onChange={(e) => setNewMedicalHistory(e.target.value)}
                    placeholder="Enter medical history"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addMedicalHistory())}
                  />
                  <Button type="button" onClick={addMedicalHistory} variant="outline">
                    {currentContent.addHistory}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.medicalHistory.map((history, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center space-x-1">
                      <span>{history}</span>
                      <X className="h-3 w-3 cursor-pointer" onClick={() => removeMedicalHistory(index)} />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lifestyle Information */}
          <Card>
            <CardHeader>
              <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                <Briefcase className="h-5 w-5" />
                <span>{currentContent.lifestyle}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className={language === "hi" ? "font-devanagari" : ""}>{currentContent.activityLevel}</Label>
                <Select
                  value={formData.lifestyle.activityLevel}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      lifestyle: { ...prev.lifestyle, activityLevel: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">{currentContent.sedentary}</SelectItem>
                    <SelectItem value="moderate">{currentContent.moderate}</SelectItem>
                    <SelectItem value="active">{currentContent.active}</SelectItem>
                    <SelectItem value="very-active">{currentContent.veryActive}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className={language === "hi" ? "font-devanagari" : ""}>{currentContent.sleepHours}</Label>
                <Input
                  type="number"
                  step="0.5"
                  value={formData.lifestyle.sleepHours}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      lifestyle: { ...prev.lifestyle, sleepHours: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <Label className={language === "hi" ? "font-devanagari" : ""}>{currentContent.stressLevel}</Label>
                <Select
                  value={formData.lifestyle.stressLevel}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      lifestyle: { ...prev.lifestyle, stressLevel: value },
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select stress level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{currentContent.low}</SelectItem>
                    <SelectItem value="moderate">{currentContent.moderate}</SelectItem>
                    <SelectItem value="high">{currentContent.high}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className={language === "hi" ? "font-devanagari" : ""}>{currentContent.waterIntake}</Label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.lifestyle.waterIntake}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      lifestyle: { ...prev.lifestyle, waterIntake: e.target.value },
                    }))
                  }
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label className={language === "hi" ? "font-devanagari" : ""}>{currentContent.mealTiming}</Label>
                <Textarea
                  value={formData.lifestyle.mealTiming}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      lifestyle: { ...prev.lifestyle, mealTiming: e.target.value },
                    }))
                  }
                  placeholder="e.g., Breakfast: 8 AM, Lunch: 1 PM, Dinner: 7 PM"
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <Button type="submit" disabled={loading} className="flex items-center space-x-2">
              <Save className="h-4 w-4" />
              <span className={language === "hi" ? "font-devanagari" : ""}>
                {loading ? "Saving..." : currentContent.save}
              </span>
            </Button>
            <Link href="/patients">
              <Button type="button" variant="outline">
                <span className={language === "hi" ? "font-devanagari" : ""}>{currentContent.cancel}</span>
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
