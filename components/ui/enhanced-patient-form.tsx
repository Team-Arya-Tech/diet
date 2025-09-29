"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EnhancedPatient, EnhancedPatientService } from "@/lib/enhanced-patient-management"
import { 
  User, 
  Heart, 
  Moon, 
  Activity, 
  Utensils, 
  Brain,
  Calendar,
  AlertCircle,
  CheckCircle
} from "lucide-react"

interface EnhancedPatientFormProps {
  patient?: EnhancedPatient
  onSave: (patient: EnhancedPatient) => void
  onCancel: () => void
}

export function EnhancedPatientForm({ patient, onSave, onCancel }: EnhancedPatientFormProps) {
  const [formData, setFormData] = useState<Partial<EnhancedPatient>>({
    id: patient?.id || `patient_${Date.now()}`,
    name: patient?.name || '',
    age: patient?.age || 0,
    gender: patient?.gender || 'female',
    email: patient?.email || '',
    phone: patient?.phone || '',
    address: patient?.address || '',
    constitution: patient?.constitution || 'vata',
    currentImbalance: patient?.currentImbalance || [],
    mealFrequency: patient?.mealFrequency || 3,
    bowelMovements: patient?.bowelMovements || 'regular',
    waterIntake: patient?.waterIntake || 2,
    sleepPattern: patient?.sleepPattern || {
      bedTime: '22:00',
      wakeTime: '06:00',
      quality: 'good',
      duration: 8
    },
    menstrualCycle: patient?.menstrualCycle || {
      regular: true,
      cycleLength: 28,
      flow: 'moderate',
      symptoms: []
    },
    height: patient?.height || 0,
    weight: patient?.weight || 0,
    activityLevel: patient?.activityLevel || 'moderate',
    stressLevel: patient?.stressLevel || 3,
    smokingStatus: patient?.smokingStatus || 'never',
    alcoholConsumption: patient?.alcoholConsumption || 'never',
    digestiveStrength: patient?.digestiveStrength || 'strong',
    foodPreferences: patient?.foodPreferences || [],
    foodAllergies: patient?.foodAllergies || [],
    foodIntolerances: patient?.foodIntolerances || [],
    currentSymptoms: patient?.currentSymptoms || [],
    chronicConditions: patient?.chronicConditions || [],
    healthGoals: patient?.healthGoals || [],
    dietaryRestrictions: patient?.dietaryRestrictions || [],
    culturalPreferences: patient?.culturalPreferences || [],
    medications: patient?.medications || [],
    status: patient?.status || 'active'
  })

  const [currentTab, setCurrentTab] = useState('basic')
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof EnhancedPatient] as any),
        [field]: value
      }
    }))
  }

  const handleArrayInputChange = (field: string, value: string) => {
    if (!value.trim()) return
    
    setFormData(prev => ({
      ...prev,
      [field]: [...((prev[field as keyof EnhancedPatient] as string[]) || []), value.trim()]
    }))
  }

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: ((prev[field as keyof EnhancedPatient] as string[]) || []).filter((_, i) => i !== index)
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required'
    }
    if (!formData.age || formData.age <= 0 || formData.age > 120) {
      newErrors.age = 'Valid age is required'
    }
    if (!formData.height || formData.height <= 0) {
      newErrors.height = 'Valid height is required'
    }
    if (!formData.weight || formData.weight <= 0) {
      newErrors.weight = 'Valid weight is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (!validateForm()) return

    const completePatient: EnhancedPatient = {
      ...formData,
      bmi: EnhancedPatientService.calculateBMI(formData.weight!, formData.height!),
      createdAt: patient?.createdAt || new Date(),
      updatedAt: new Date()
    } as EnhancedPatient

    onSave(completePatient)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <Card className="border-2 border-amber-900/60 shadow-xl bg-white/95 backdrop-blur-sm">
        <CardHeader 
          className="relative rounded-t-lg overflow-hidden p-6 border-b-2 border-amber-200/50"
          style={{
            backgroundImage: 'url("/banner_canva.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-white/85 backdrop-blur-[1px]"></div>
          <CardTitle className="relative z-10 flex items-center gap-3 text-2xl text-amber-900 font-bold">
            <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg border border-amber-200">
              <User className="w-6 h-6 text-amber-700" />
            </div>
            {patient ? 'Edit Patient Profile' : 'New Patient Registration'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
            <TabsList className="grid w-full grid-cols-6 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 h-auto p-2 rounded-none">
              <TabsTrigger value="basic" className="flex items-center gap-2 py-3 px-4 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-amber-900 data-[state=active]:border-amber-300 data-[state=active]:border data-[state=active]:shadow-sm rounded-lg">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">Basic Info</span>
                <span className="sm:hidden">Basic</span>
              </TabsTrigger>
              <TabsTrigger value="health" className="flex items-center gap-2 py-3 px-4 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-amber-900 data-[state=active]:border-amber-300 data-[state=active]:border data-[state=active]:shadow-sm rounded-lg">
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Health Metrics</span>
                <span className="sm:hidden">Health</span>
              </TabsTrigger>
              <TabsTrigger value="lifestyle" className="flex items-center gap-2 py-3 px-4 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-amber-900 data-[state=active]:border-amber-300 data-[state=active]:border data-[state=active]:shadow-sm rounded-lg">
                <Activity className="w-4 h-4" />
                <span className="hidden sm:inline">Lifestyle</span>
                <span className="sm:hidden">Life</span>
              </TabsTrigger>
              <TabsTrigger value="sleep" className="flex items-center gap-2 py-3 px-4 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-amber-900 data-[state=active]:border-amber-300 data-[state=active]:border data-[state=active]:shadow-sm rounded-lg">
                <Moon className="w-4 h-4" />
                <span className="hidden sm:inline">Sleep & Wellness</span>
                <span className="sm:hidden">Sleep</span>
              </TabsTrigger>
              <TabsTrigger value="nutrition" className="flex items-center gap-2 py-3 px-4 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-amber-900 data-[state=active]:border-amber-300 data-[state=active]:border data-[state=active]:shadow-sm rounded-lg">
                <Utensils className="w-4 h-4" />
                <span className="hidden sm:inline">Nutrition</span>
                <span className="sm:hidden">Food</span>
              </TabsTrigger>
              <TabsTrigger value="goals" className="flex items-center gap-2 py-3 px-4 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-amber-900 data-[state=active]:border-amber-300 data-[state=active]:border data-[state=active]:shadow-sm rounded-lg">
                <Brain className="w-4 h-4" />
                <span className="hidden sm:inline">Goals & Preferences</span>
                <span className="sm:hidden">Goals</span>
              </TabsTrigger>
            </TabsList>

            {/* Basic Information */}
            <TabsContent value="basic" className="p-8 space-y-8 bg-gradient-to-br from-white to-amber-50/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-sm font-semibold text-amber-900 flex items-center gap-2">
                    <span className="text-red-500">*</span>
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`border-2 focus:border-amber-500 focus:ring-amber-500/20 rounded-lg h-11 ${errors.name ? 'border-red-500' : 'border-amber-200'}`}
                    placeholder="Enter full name"
                  />
                  {errors.name && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.name}</p>}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="age" className="text-sm font-semibold text-amber-900 flex items-center gap-2">
                    <span className="text-red-500">*</span>
                    Age
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                    className={`border-2 focus:border-amber-500 focus:ring-amber-500/20 rounded-lg h-11 ${errors.age ? 'border-red-500' : 'border-amber-200'}`}
                    placeholder="Enter age"
                    min="1"
                    max="120"
                  />
                  {errors.age && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.age}</p>}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="gender" className="text-sm font-semibold text-amber-900">
                    Gender
                  </Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => handleInputChange('gender', value)}
                  >
                    <SelectTrigger className="border-2 border-amber-200 focus:border-amber-500 focus:ring-amber-500/20 rounded-lg h-11">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="border-2 border-amber-200">
                      <SelectItem value="female" className="focus:bg-amber-50">Female</SelectItem>
                      <SelectItem value="male" className="focus:bg-amber-50">Male</SelectItem>
                      <SelectItem value="other" className="focus:bg-amber-50">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="constitution" className="text-sm font-semibold text-amber-900">
                    Ayurvedic Constitution
                  </Label>
                  <Select
                    value={formData.constitution}
                    onValueChange={(value) => handleInputChange('constitution', value)}
                  >
                    <SelectTrigger className="border-2 border-amber-200 focus:border-amber-500 focus:ring-amber-500/20 rounded-lg h-11">
                      <SelectValue placeholder="Select constitution" />
                    </SelectTrigger>
                    <SelectContent className="border-2 border-amber-200">
                      <SelectItem value="vata" className="focus:bg-amber-50">Vata (Air + Ether)</SelectItem>
                      <SelectItem value="pitta" className="focus:bg-amber-50">Pitta (Fire + Water)</SelectItem>
                      <SelectItem value="kapha" className="focus:bg-amber-50">Kapha (Earth + Water)</SelectItem>
                      <SelectItem value="vata-pitta" className="focus:bg-amber-50">Vata-Pitta</SelectItem>
                      <SelectItem value="pitta-kapha" className="focus:bg-amber-50">Pitta-Kapha</SelectItem>
                      <SelectItem value="vata-kapha" className="focus:bg-amber-50">Vata-Kapha</SelectItem>
                      <SelectItem value="tridoshic" className="focus:bg-amber-50">Tridoshic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="email" className="text-sm font-semibold text-amber-900">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="border-2 border-amber-200 focus:border-amber-500 focus:ring-amber-500/20 rounded-lg h-11"
                    placeholder="Enter email address"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-sm font-semibold text-amber-900">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="border-2 border-amber-200 focus:border-amber-500 focus:ring-amber-500/20 rounded-lg h-11"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="address" className="text-sm font-semibold text-amber-900">
                  Address
                </Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={4}
                  className="border-2 border-amber-200 focus:border-amber-500 focus:ring-amber-500/20 rounded-lg resize-none"
                  placeholder="Enter complete address"
                />
              </div>
            </TabsContent>

            {/* Health Metrics */}
            <TabsContent value="health" className="p-8 space-y-8 bg-gradient-to-br from-white to-amber-50/30">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-3">
                  <Label htmlFor="height" className="text-sm font-semibold text-amber-900 flex items-center gap-2">
                    <span className="text-red-500">*</span>
                    Height (cm)
                  </Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', parseFloat(e.target.value))}
                    className={`border-2 focus:border-amber-500 focus:ring-amber-500/20 rounded-lg h-11 ${errors.height ? 'border-red-500' : 'border-amber-200'}`}
                    placeholder="Height in cm"
                    min="50"
                    max="250"
                  />
                  {errors.height && <p className="text-red-500 text-sm flex items-center gap-1"><AlertCircle className="w-4 h-4" />{errors.height}</p>}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="weight" className="text-sm font-semibold text-amber-900 flex items-center gap-2">
                    <span className="text-red-500">*</span>
                    Weight (kg)
                  </Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', parseFloat(e.target.value))}
                    className={errors.weight ? 'border-red-500' : ''}
                  />
                  {errors.weight && <p className="text-red-500 text-sm">{errors.weight}</p>}
                </div>

                <div className="space-y-2">
                  <Label>BMI</Label>
                  <div className="p-3 bg-gray-50 rounded-md">
                    {formData.height && formData.weight ? (
                      <span className="font-bold">
                        {EnhancedPatientService.calculateBMI(formData.weight, formData.height)} 
                        <span className="text-sm font-normal ml-2">
                          ({EnhancedPatientService.getBMICategory(
                            EnhancedPatientService.calculateBMI(formData.weight, formData.height)
                          )})
                        </span>
                      </span>
                    ) : (
                      <span className="text-gray-400">Enter height & weight</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Meal Frequency (per day)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.mealFrequency}
                    onChange={(e) => handleInputChange('mealFrequency', parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Water Intake (liters/day)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.waterIntake}
                    onChange={(e) => handleInputChange('waterIntake', parseFloat(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Bowel Movements</Label>
                  <Select
                    value={formData.bowelMovements}
                    onValueChange={(value) => handleInputChange('bowelMovements', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="regular">Regular (1-2 times/day)</SelectItem>
                      <SelectItem value="irregular">Irregular</SelectItem>
                      <SelectItem value="constipated">Constipated</SelectItem>
                      <SelectItem value="loose">Loose/Frequent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Digestive Strength</Label>
                  <Select
                    value={formData.digestiveStrength}
                    onValueChange={(value) => handleInputChange('digestiveStrength', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weak">Weak (Manda Agni)</SelectItem>
                      <SelectItem value="variable">Variable (Vishama Agni)</SelectItem>
                      <SelectItem value="strong">Strong (Tikshna Agni)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Menstrual Cycle (for females) */}
              {formData.gender === 'female' && (
                <Card className="border-pink-200 bg-pink-50/30">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-pink-600" />
                      Menstrual Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="regular-cycle"
                          checked={formData.menstrualCycle?.regular}
                          onCheckedChange={(checked) => 
                            handleNestedInputChange('menstrualCycle', 'regular', checked)
                          }
                        />
                        <Label htmlFor="regular-cycle">Regular Cycle</Label>
                      </div>

                      <div className="space-y-2">
                        <Label>Cycle Length (days)</Label>
                        <Input
                          type="number"
                          min="20"
                          max="45"
                          value={formData.menstrualCycle?.cycleLength}
                          onChange={(e) => 
                            handleNestedInputChange('menstrualCycle', 'cycleLength', parseInt(e.target.value))
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Flow</Label>
                        <Select
                          value={formData.menstrualCycle?.flow}
                          onValueChange={(value) => 
                            handleNestedInputChange('menstrualCycle', 'flow', value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="moderate">Moderate</SelectItem>
                            <SelectItem value="heavy">Heavy</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Lifestyle */}
            <TabsContent value="lifestyle" className="p-8 space-y-8 bg-gradient-to-br from-white to-amber-50/30">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Activity Level</Label>
                  <Select
                    value={formData.activityLevel}
                    onValueChange={(value) => handleInputChange('activityLevel', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedentary">Sedentary</SelectItem>
                      <SelectItem value="light">Light Activity</SelectItem>
                      <SelectItem value="moderate">Moderate Activity</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="very-active">Very Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Stress Level (1-5)</Label>
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <Button
                        key={level}
                        type="button"
                        variant={formData.stressLevel === level ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleInputChange('stressLevel', level)}
                        className="w-12 h-12"
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">1=Very Low, 5=Very High</p>
                </div>

                <div className="space-y-2">
                  <Label>Smoking Status</Label>
                  <Select
                    value={formData.smokingStatus}
                    onValueChange={(value) => handleInputChange('smokingStatus', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never</SelectItem>
                      <SelectItem value="former">Former Smoker</SelectItem>
                      <SelectItem value="current">Current Smoker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Alcohol Consumption</Label>
                  <Select
                    value={formData.alcoholConsumption}
                    onValueChange={(value) => handleInputChange('alcoholConsumption', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="never">Never</SelectItem>
                      <SelectItem value="occasional">Occasional</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="heavy">Heavy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            {/* Sleep & Wellness */}
            <TabsContent value="sleep" className="p-8 space-y-8 bg-gradient-to-br from-white to-amber-50/30">
              <Card className="border-blue-200 bg-blue-50/30">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Moon className="w-5 h-5 text-blue-600" />
                    Sleep Pattern
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Bedtime</Label>
                      <Input
                        type="time"
                        value={formData.sleepPattern?.bedTime}
                        onChange={(e) => 
                          handleNestedInputChange('sleepPattern', 'bedTime', e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Wake Time</Label>
                      <Input
                        type="time"
                        value={formData.sleepPattern?.wakeTime}
                        onChange={(e) => 
                          handleNestedInputChange('sleepPattern', 'wakeTime', e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Sleep Quality</Label>
                      <Select
                        value={formData.sleepPattern?.quality}
                        onValueChange={(value) => 
                          handleNestedInputChange('sleepPattern', 'quality', value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">Excellent</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                          <SelectItem value="poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Nutrition Tab */}
            <TabsContent value="nutrition" className="p-8 space-y-8 bg-gradient-to-br from-white to-amber-50/30">
              <div className="space-y-6">
                {/* Food Preferences */}
                <div className="space-y-3">
                  <Label>Food Preferences</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.foodPreferences?.map((pref, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {pref}
                        <button
                          type="button"
                          onClick={() => removeArrayItem('foodPreferences', index)}
                          className="ml-1 hover:text-red-500"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add food preference"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleArrayInputChange('foodPreferences', e.currentTarget.value)
                          e.currentTarget.value = ''
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Food Allergies */}
                <div className="space-y-3">
                  <Label>Food Allergies</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.foodAllergies?.map((allergy, index) => (
                      <Badge key={index} variant="destructive" className="flex items-center gap-1">
                        {allergy}
                        <button
                          type="button"
                          onClick={() => removeArrayItem('foodAllergies', index)}
                          className="ml-1 hover:text-red-300"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add food allergy"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleArrayInputChange('foodAllergies', e.currentTarget.value)
                          e.currentTarget.value = ''
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Current Symptoms */}
                <div className="space-y-3">
                  <Label>Current Symptoms</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.currentSymptoms?.map((symptom, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {symptom}
                        <button
                          type="button"
                          onClick={() => removeArrayItem('currentSymptoms', index)}
                          className="ml-1 hover:text-red-500"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add current symptom"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleArrayInputChange('currentSymptoms', e.currentTarget.value)
                          e.currentTarget.value = ''
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Goals & Preferences */}
            <TabsContent value="goals" className="p-8 space-y-8 bg-gradient-to-br from-white to-amber-50/30">
              <div className="space-y-6">
                {/* Health Goals */}
                <div className="space-y-3">
                  <Label>Health Goals</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.healthGoals?.map((goal, index) => (
                      <Badge key={index} variant="default" className="flex items-center gap-1">
                        {goal}
                        <button
                          type="button"
                          onClick={() => removeArrayItem('healthGoals', index)}
                          className="ml-1 hover:text-orange-300"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add health goal"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleArrayInputChange('healthGoals', e.currentTarget.value)
                          e.currentTarget.value = ''
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Dietary Restrictions */}
                <div className="space-y-3">
                  <Label>Dietary Restrictions</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {formData.dietaryRestrictions?.map((restriction, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {restriction}
                        <button
                          type="button"
                          onClick={() => removeArrayItem('dietaryRestrictions', index)}
                          className="ml-1 hover:text-red-500"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add dietary restriction"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleArrayInputChange('dietaryRestrictions', e.currentTarget.value)
                          e.currentTarget.value = ''
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4 p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border-2 border-amber-200/50">
        <Button 
          variant="outline" 
          onClick={onCancel}
          className="border-2 border-amber-300 text-amber-800 hover:bg-amber-50 hover:text-amber-900 h-11 px-6 font-medium"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-11 px-8 font-medium"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          {patient ? 'Update Patient' : 'Save Patient'}
        </Button>
      </div>
    </div>
  )
}