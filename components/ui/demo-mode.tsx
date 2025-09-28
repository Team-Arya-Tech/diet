"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Play, 
  Pause, 
  SkipForward, 
  RotateCcw, 
  Eye, 
  Users, 
  FileText, 
  Utensils,
  TrendingUp,
  Sparkles,
  BookOpen,
  Coffee,
  Activity
} from 'lucide-react'
import { EnhancedPatient, EnhancedPatientService } from '@/lib/enhanced-patient-management'
import { EnhancedFood, EnhancedFoodDatabase } from '@/lib/enhanced-food-database'

interface DemoStep {
  id: string
  title: string
  description: string
  component: string
  duration: number // seconds
  highlights: string[]
  data?: any
}

interface DemoModeProps {
  onExit: () => void
}

export function DemoMode({ onExit }: DemoModeProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)

  const demoSteps: DemoStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to AhaarWISE',
      description: 'Your comprehensive Ayurvedic Diet Management System designed for modern healthcare practitioners.',
      component: 'welcome',
      duration: 8,
      highlights: [
        'AI-powered personalized recommendations',
        '8000+ food database with Ayurvedic properties',
        'Hospital integration capabilities',
        'HIPAA compliant security features'
      ]
    },
    {
      id: 'patient-management',
      title: 'Advanced Patient Management',
      description: 'Comprehensive patient profiles with Ayurvedic constitution assessment and health tracking.',
      component: 'patients',
      duration: 12,
      highlights: [
        'Complete health parameter tracking',
        'Constitutional assessment',
        'Menstrual health monitoring',
        'Sleep and stress analysis'
      ],
      data: generateSamplePatients()
    },
    {
      id: 'food-database',
      title: 'Comprehensive Food Database',
      description: 'Over 8000 foods with detailed nutritional and Ayurvedic properties from global cuisines.',
      component: 'foods',
      duration: 10,
      highlights: [
        'International cuisine coverage',
        'Six taste analysis',
        'Thermal properties',
        'Dosha impact calculations'
      ],
      data: generateSampleFoods()
    },
    {
      id: 'ai-recommendations',
      title: 'AI-Powered Recommendations',
      description: 'Intelligent dietary and lifestyle recommendations based on individual constitution and symptoms.',
      component: 'ai',
      duration: 15,
      highlights: [
        'Constitutional analysis',
        'Symptom-based suggestions',
        'Seasonal adaptations',
        'Lifestyle optimization'
      ],
      data: generateSampleRecommendations()
    },
    {
      id: 'hospital-integration',
      title: 'Hospital Integration',
      description: 'Seamless integration with hospital systems and electronic health records.',
      component: 'integration',
      duration: 10,
      highlights: [
        'FHIR/HL7 compatibility',
        'EHR data exchange',
        'Telemedicine support',
        'Lab results integration'
      ],
      data: generateIntegrationDemo()
    },
    {
      id: 'analytics',
      title: 'Advanced Analytics',
      description: 'Comprehensive reporting and analytics for practitioners and administrators.',
      component: 'analytics',
      duration: 12,
      highlights: [
        'Patient progress tracking',
        'Population health insights',
        'Compliance reporting',
        'Performance metrics'
      ],
      data: generateAnalyticsData()
    }
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isPlaying && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleNextStep()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [isPlaying, timeRemaining])

  const startDemo = () => {
    setHasStarted(true)
    initializeDemoData()
    setTimeRemaining(demoSteps[0].duration)
    setIsPlaying(true)
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleNextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1)
      setTimeRemaining(demoSteps[currentStep + 1].duration)
    } else {
      // Demo complete
      setIsPlaying(false)
      setTimeRemaining(0)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setTimeRemaining(demoSteps[currentStep - 1].duration)
    }
  }

  const resetDemo = () => {
    setCurrentStep(0)
    setIsPlaying(false)
    setTimeRemaining(demoSteps[0].duration)
    setHasStarted(false)
  }

  const initializeDemoData = () => {
    // Initialize demo data in localStorage
    const samplePatients = generateSamplePatients()
    samplePatients.forEach(patient => {
      EnhancedPatientService.savePatient(patient)
    })

    const sampleFoods = generateSampleFoods()
    sampleFoods.forEach(food => {
      EnhancedFoodDatabase.saveFood(food)
    })
  }

  if (!hasStarted) {
    return (
      <Card className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full">
              <Play className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">
            AhaarWISE Interactive Demo
          </CardTitle>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Experience the complete functionality of our Ayurvedic Diet Management System 
            through this guided demonstration featuring real-world scenarios.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <Alert className="border-blue-200 bg-blue-50">
            <Sparkles className="w-4 h-4" />
            <AlertDescription>
              This demo includes sample patient data, AI recommendations, and hospital integrations 
              to showcase the complete system capabilities.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {demoSteps.map((step, index) => (
              <div key={step.id} className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.duration}s</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center space-y-4">
            <div className="text-sm text-gray-600">
              Total Duration: {demoSteps.reduce((acc, step) => acc + step.duration, 0)} seconds
            </div>
            <div className="space-x-4">
              <Button
                onClick={startDemo}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Demo
              </Button>
              <Button variant="outline" onClick={onExit}>
                Skip Demo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentStepData = demoSteps[currentStep]
  const progressPercentage = ((currentStep) / (demoSteps.length - 1)) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Demo Control Panel */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge variant="default" className="bg-blue-600">
                DEMO MODE
              </Badge>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handlePlayPause}
                  className="border-blue-300"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleNextStep}
                  disabled={currentStep >= demoSteps.length - 1}
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={resetDemo}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Step {currentStep + 1} of {demoSteps.length}
              </div>
              {timeRemaining > 0 && (
                <div className="text-sm font-mono bg-blue-100 px-2 py-1 rounded">
                  {timeRemaining}s
                </div>
              )}
              <Button variant="outline" onClick={onExit} size="sm">
                Exit Demo
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Step Information Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-blue-600" />
                  <span>Current Focus</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg">{currentStepData.title}</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    {currentStepData.description}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-sm mb-2">Key Features:</h4>
                  <ul className="space-y-1">
                    {currentStepData.highlights.map((highlight, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Demo Content */}
          <div className="lg:col-span-3">
            <DemoStepContent step={currentStepData} />
          </div>
        </div>
      </div>
    </div>
  )
}

function DemoStepContent({ step }: { step: DemoStep }) {
  switch (step.component) {
    case 'welcome':
      return <WelcomeDemo />
    case 'patients':
      return <PatientManagementDemo data={step.data} />
    case 'foods':
      return <FoodDatabaseDemo data={step.data} />
    case 'ai':
      return <AIRecommendationsDemo data={step.data} />
    case 'integration':
      return <HospitalIntegrationDemo data={step.data} />
    case 'analytics':
      return <AnalyticsDemo data={step.data} />
    default:
      return <div>Demo content not available</div>
  }
}

function WelcomeDemo() {
  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
        <CardContent className="p-8 text-center">
          <h1 className="text-4xl font-bold mb-4">AhaarWISE</h1>
          <p className="text-xl text-orange-100">
            Intelligent Ayurvedic Diet Management System
          </p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Patient-Centered Care</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Comprehensive patient management with Ayurvedic constitution assessment and personalized care plans.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>150+ Active Patients</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span>95% Satisfaction Rate</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-green-600" />
              <span>AI-Powered Intelligence</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Advanced algorithms analyze patient data to provide personalized Ayurvedic recommendations.
            </p>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-purple-500 rounded-full" />
                <span>Real-time Analysis</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span>Continuous Learning</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function PatientManagementDemo({ data }: { data: EnhancedPatient[] }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Patient Management Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{data.length}</div>
              <div className="text-sm text-gray-600">Total Patients</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {data.filter(p => p.status === 'active').length}
              </div>
              <div className="text-sm text-gray-600">Active Patients</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {data.filter(p => p.currentSymptoms.length > 0).length}
              </div>
              <div className="text-sm text-gray-600">Need Follow-up</div>
            </div>
          </div>

          <div className="space-y-4">
            {data.slice(0, 3).map((patient, index) => (
              <div key={patient.id} className="border rounded-lg p-4 bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{patient.name}</h3>
                    <p className="text-sm text-gray-600">
                      {patient.age} years • {patient.constitution} constitution
                    </p>
                    <div className="flex space-x-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        BMI: {patient.bmi || 'Not calculated'}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {patient.sleepPattern.quality} sleep
                      </Badge>
                    </div>
                  </div>
                  <Badge variant={patient.status === 'active' ? 'default' : 'secondary'}>
                    {patient.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function FoodDatabaseDemo({ data }: { data: EnhancedFood[] }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Utensils className="w-5 h-5" />
            <span>Comprehensive Food Database</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">8,000+</div>
              <div className="text-sm text-gray-600">Food Items</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">15</div>
              <div className="text-sm text-gray-600">Cuisines</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">6</div>
              <div className="text-sm text-gray-600">Taste Analysis</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">3</div>
              <div className="text-sm text-gray-600">Thermal Effects</div>
            </div>
          </div>

          <div className="space-y-4">
            {data.slice(0, 4).map((food, index) => (
              <div key={food.id} className="border rounded-lg p-4 bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{food.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">
                      {food.category} • {food.cuisine} cuisine
                    </p>
                    <div className="flex space-x-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {food.nutrition.calories} cal/100g
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          food.ayurvedic.virya === 'heating' ? 'border-red-300 text-red-600' :
                          food.ayurvedic.virya === 'cooling' ? 'border-blue-300 text-blue-600' :
                          'border-gray-300 text-gray-600'
                        }`}
                      >
                        {food.ayurvedic.virya}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Dominant Taste</div>
                    <div className="font-semibold">
                      {Object.entries(food.ayurvedic.rasa)
                        .sort(([,a], [,b]) => b - a)[0][0]
                        .charAt(0).toUpperCase() + 
                       Object.entries(food.ayurvedic.rasa)
                        .sort(([,a], [,b]) => b - a)[0][0].slice(1)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AIRecommendationsDemo({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            <span>AI-Powered Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold mb-3">Constitutional Analysis</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">45%</div>
                  <div className="text-sm text-gray-600">Vata</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-red-600">35%</div>
                  <div className="text-sm text-gray-600">Pitta</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-green-600">20%</div>
                  <div className="text-sm text-gray-600">Kapha</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Personalized Recommendations</h3>
              <div className="space-y-3">
                {data.recommendations.map((rec: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                    <Coffee className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-700">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function HospitalIntegrationDemo({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-green-600" />
            <span>Hospital Integration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.hospitals.map((hospital: any, index: number) => (
                <div key={index} className="p-4 border rounded-lg bg-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <span className="font-semibold text-sm">{hospital.name}</span>
                  </div>
                  <p className="text-xs text-gray-600">{hospital.type}</p>
                  <Badge variant="outline" className="text-xs mt-2">
                    {hospital.system}
                  </Badge>
                </div>
              ))}
            </div>

            <div>
              <h3 className="font-semibold mb-3">Integration Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {data.features.map((feature: string, index: number) => (
                  <div key={index} className="flex items-center space-x-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AnalyticsDemo({ data }: { data: any }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span>Analytics & Reporting</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {data.metrics.map((metric: any, index: number) => (
              <div key={index} className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{metric.value}</div>
                <div className="text-sm text-gray-600">{metric.label}</div>
              </div>
            ))}
          </div>

          <div>
            <h3 className="font-semibold mb-3">Key Insights</h3>
            <div className="space-y-2">
              {data.insights.map((insight: string, index: number) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Sample data generators
function generateSamplePatients(): EnhancedPatient[] {
  return [
    {
      id: 'demo_patient_1',
      name: 'Priya Sharma',
      age: 28,
      gender: 'female',
      email: 'priya.sharma@example.com',
      phone: '+91-9876543210',
      constitution: 'vata-pitta',
      mealFrequency: 3,
      bowelMovements: 'regular',
      waterIntake: 2.5,
      sleepPattern: {
        bedTime: '22:30',
        wakeTime: '06:00',
        quality: 'good',
        duration: 7.5
      },
      height: 165,
      weight: 58,
      bmi: 21.3,
      activityLevel: 'moderate',
      stressLevel: 3,
      smokingStatus: 'never',
      alcoholConsumption: 'occasional',
      digestiveStrength: 'variable',
      foodPreferences: ['vegetarian', 'home-cooked'],
      foodAllergies: [],
      foodIntolerances: ['lactose'],
      currentSymptoms: ['mild anxiety', 'irregular periods'],
      chronicConditions: [],
      medications: [],
      healthGoals: ['stress management', 'hormonal balance'],
      dietaryRestrictions: ['vegetarian'],
      culturalPreferences: ['indian'],
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    // Add more sample patients...
  ]
}

function generateSampleFoods(): EnhancedFood[] {
  return [
    {
      id: 'demo_food_1',
      name: 'Basmati Rice',
      category: 'grains',
      cuisine: 'indian',
      nutrition: {
        calories: 350,
        protein: 7.5,
        carbs: 78,
        fat: 0.9,
        fiber: 1.4,
        sugar: 0.1,
        sodium: 5,
        potassium: 115,
        calcium: 28,
        iron: 0.8,
        vitaminC: 0,
        vitaminA: 0
      },
      ayurvedic: {
        rasa: { sweet: 80, sour: 0, salty: 0, pungent: 0, bitter: 0, astringent: 20 },
        virya: 'cooling',
        vipaka: 'sweet',
        doshaEffect: { vata: -1, pitta: -1, kapha: 1 },
        guna: ['heavy', 'smooth', 'stable']
      },
      season: ['summer', 'monsoon'],
      region: ['north-india'],
      commonPreparations: ['steamed', 'biryani'],
      medicinalUses: ['digestive health'],
      contraindications: [],
      tags: ['staple'],
      allergens: [],
      dietaryFlags: ['vegetarian', 'vegan', 'gluten-free'],
      freshnessPeriod: 365,
      storageMethod: 'cool, dry place',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    // Add more sample foods...
  ]
}

function generateSampleRecommendations() {
  return {
    recommendations: [
      'Include warming spices like ginger and cinnamon in your daily meals',
      'Practice regular yoga and meditation to balance Vata energy',
      'Eat at consistent times to support digestive health',
      'Choose cooked, warm foods over raw and cold preparations'
    ]
  }
}

function generateIntegrationDemo() {
  return {
    hospitals: [
      { name: 'AIIA Delhi', type: 'Government', system: 'FHIR' },
      { name: 'Apollo Hospital', type: 'Private', system: 'HL7' },
      { name: 'Max Healthcare', type: 'Private', system: 'Custom' }
    ],
    features: [
      'Patient data synchronization',
      'Lab results integration',
      'Prescription management',
      'Telemedicine support'
    ]
  }
}

function generateAnalyticsData() {
  return {
    metrics: [
      { value: '150+', label: 'Active Patients' },
      { value: '95%', label: 'Satisfaction' },
      { value: '87%', label: 'Adherence Rate' },
      { value: '2.3x', label: 'Health Improvement' }
    ],
    insights: [
      'Patient adherence increased by 40% with personalized recommendations',
      'Vata constitution patients show best response to structured meal timing',
      'Seasonal diet adjustments improved symptom management by 60%'
    ]
  }
}