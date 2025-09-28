"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  User, 
  Brain, 
  Heart, 
  Zap, 
  Wind, 
  Flame, 
  Mountain,
  Sparkles,
  PlayCircle,
  RotateCcw,
  CheckCircle
} from 'lucide-react'

interface ConstitutionQuestion {
  id: string
  category: 'physical' | 'mental' | 'behavioral' | 'physiological'
  question: string
  options: Array<{
    text: string
    scores: { vata: number; pitta: number; kapha: number }
  }>
}

interface ConstitutionResult {
  primary: 'vata' | 'pitta' | 'kapha'
  secondary?: 'vata' | 'pitta' | 'kapha'
  scores: { vata: number; pitta: number; kapha: number }
  percentage: { vata: number; pitta: number; kapha: number }
  confidence: number
  recommendations: string[]
}

export function InteractiveConstitutionAssessment() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [isComplete, setIsComplete] = useState(false)
  const [result, setResult] = useState<ConstitutionResult | null>(null)
  const [isStarted, setIsStarted] = useState(false)

  const questions: ConstitutionQuestion[] = [
    {
      id: 'body-build',
      category: 'physical',
      question: 'How would you describe your natural body build?',
      options: [
        { text: 'Thin, light, find it hard to gain weight', scores: { vata: 3, pitta: 0, kapha: 0 } },
        { text: 'Medium build, muscular, athletic', scores: { vata: 0, pitta: 3, kapha: 0 } },
        { text: 'Large frame, gain weight easily, strong', scores: { vata: 0, pitta: 0, kapha: 3 } },
        { text: 'Combination of above traits', scores: { vata: 1, pitta: 1, kapha: 1 } }
      ]
    },
    {
      id: 'skin-type',
      category: 'physical',
      question: 'What best describes your skin?',
      options: [
        { text: 'Dry, rough, cool, thin', scores: { vata: 3, pitta: 0, kapha: 0 } },
        { text: 'Warm, oily, soft, with freckles/moles', scores: { vata: 0, pitta: 3, kapha: 0 } },
        { text: 'Thick, moist, cool, smooth', scores: { vata: 0, pitta: 0, kapha: 3 } },
        { text: 'Changes seasonally', scores: { vata: 1, pitta: 1, kapha: 1 } }
      ]
    },
    {
      id: 'hair-type',
      category: 'physical',
      question: 'How would you describe your hair?',
      options: [
        { text: 'Dry, frizzy, coarse, kinky', scores: { vata: 3, pitta: 0, kapha: 0 } },
        { text: 'Fine, soft, early graying/balding', scores: { vata: 0, pitta: 3, kapha: 0 } },
        { text: 'Thick, lustrous, strong, wavy', scores: { vata: 0, pitta: 0, kapha: 3 } },
        { text: 'Mix of characteristics', scores: { vata: 1, pitta: 1, kapha: 1 } }
      ]
    },
    {
      id: 'appetite',
      category: 'physiological',
      question: 'How is your appetite generally?',
      options: [
        { text: 'Variable, sometimes hungry, sometimes not', scores: { vata: 3, pitta: 0, kapha: 0 } },
        { text: 'Strong, get irritated when hungry', scores: { vata: 0, pitta: 3, kapha: 0 } },
        { text: 'Steady, can skip meals easily', scores: { vata: 0, pitta: 0, kapha: 3 } },
        { text: 'Depends on the situation', scores: { vata: 1, pitta: 1, kapha: 1 } }
      ]
    },
    {
      id: 'digestion',
      category: 'physiological',
      question: 'How is your digestion?',
      options: [
        { text: 'Irregular, gas, bloating', scores: { vata: 3, pitta: 0, kapha: 0 } },
        { text: 'Strong, can eat almost anything', scores: { vata: 0, pitta: 3, kapha: 0 } },
        { text: 'Slow but steady, feel heavy after eating', scores: { vata: 0, pitta: 0, kapha: 3 } },
        { text: 'Good most of the time', scores: { vata: 1, pitta: 1, kapha: 1 } }
      ]
    },
    {
      id: 'sleep-pattern',
      category: 'behavioral',
      question: 'What are your sleep patterns like?',
      options: [
        { text: 'Light sleeper, difficulty falling asleep', scores: { vata: 3, pitta: 0, kapha: 0 } },
        { text: 'Moderate sleep, wake up refreshed', scores: { vata: 0, pitta: 3, kapha: 0 } },
        { text: 'Heavy sleeper, need 8+ hours', scores: { vata: 0, pitta: 0, kapha: 3 } },
        { text: 'Sleep patterns vary', scores: { vata: 1, pitta: 1, kapha: 1 } }
      ]
    },
    {
      id: 'mental-nature',
      category: 'mental',
      question: 'How would you describe your mental nature?',
      options: [
        { text: 'Quick thinking, restless, creative', scores: { vata: 3, pitta: 0, kapha: 0 } },
        { text: 'Sharp intellect, focused, determined', scores: { vata: 0, pitta: 3, kapha: 0 } },
        { text: 'Calm, steady, good memory', scores: { vata: 0, pitta: 0, kapha: 3 } },
        { text: 'Balanced thinking style', scores: { vata: 1, pitta: 1, kapha: 1 } }
      ]
    },
    {
      id: 'stress-response',
      category: 'mental',
      question: 'How do you typically respond to stress?',
      options: [
        { text: 'Worry, anxiety, scattered thoughts', scores: { vata: 3, pitta: 0, kapha: 0 } },
        { text: 'Anger, irritation, frustration', scores: { vata: 0, pitta: 3, kapha: 0 } },
        { text: 'Withdraw, become sluggish, eat more', scores: { vata: 0, pitta: 0, kapha: 3 } },
        { text: 'Handle it pretty well', scores: { vata: 1, pitta: 1, kapha: 1 } }
      ]
    },
    {
      id: 'energy-levels',
      category: 'behavioral',
      question: 'How are your energy levels throughout the day?',
      options: [
        { text: 'Bursts of energy, then crash', scores: { vata: 3, pitta: 0, kapha: 0 } },
        { text: 'Consistent moderate to high energy', scores: { vata: 0, pitta: 3, kapha: 0 } },
        { text: 'Slow to start, steady throughout', scores: { vata: 0, pitta: 0, kapha: 3 } },
        { text: 'Generally consistent', scores: { vata: 1, pitta: 1, kapha: 1 } }
      ]
    },
    {
      id: 'weather-preference',
      category: 'physiological',
      question: 'Which weather do you prefer?',
      options: [
        { text: 'Warm, humid weather', scores: { vata: 3, pitta: 0, kapha: 0 } },
        { text: 'Cool, dry weather', scores: { vata: 0, pitta: 3, kapha: 0 } },
        { text: 'Warm, dry weather', scores: { vata: 0, pitta: 0, kapha: 3 } },
        { text: 'Moderate weather', scores: { vata: 1, pitta: 1, kapha: 1 } }
      ]
    }
  ]

  const handleAnswer = (optionIndex: number) => {
    const question = questions[currentQuestion]
    const newAnswers = { ...answers, [question.id]: optionIndex }
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Calculate results
      const result = calculateConstitution(newAnswers)
      setResult(result)
      setIsComplete(true)
    }
  }

  const calculateConstitution = (answers: Record<string, number>): ConstitutionResult => {
    let vataTotal = 0, pittaTotal = 0, kaphaTotal = 0

    Object.entries(answers).forEach(([questionId, optionIndex]) => {
      const question = questions.find(q => q.id === questionId)
      if (question && question.options[optionIndex]) {
        const scores = question.options[optionIndex].scores
        vataTotal += scores.vata
        pittaTotal += scores.pitta
        kaphaTotal += scores.kapha
      }
    })

    const total = vataTotal + pittaTotal + kaphaTotal
    const percentage = {
      vata: Math.round((vataTotal / total) * 100),
      pitta: Math.round((pittaTotal / total) * 100),
      kapha: Math.round((kaphaTotal / total) * 100)
    }

    // Determine primary and secondary
    const sorted = [
      { type: 'vata' as const, score: vataTotal, percentage: percentage.vata },
      { type: 'pitta' as const, score: pittaTotal, percentage: percentage.pitta },
      { type: 'kapha' as const, score: kaphaTotal, percentage: percentage.kapha }
    ].sort((a, b) => b.score - a.score)

    const primary = sorted[0].type
    const secondary = sorted[1].percentage > 25 ? sorted[1].type : undefined

    // Calculate confidence based on score distribution
    const confidence = Math.round(((sorted[0].score - sorted[1].score) / total) * 100 + 50)

    // Generate personalized recommendations
    const recommendations = generateRecommendations(primary, secondary, percentage)

    return {
      primary,
      secondary,
      scores: { vata: vataTotal, pitta: pittaTotal, kapha: kaphaTotal },
      percentage,
      confidence: Math.min(95, Math.max(60, confidence)),
      recommendations
    }
  }

  const generateRecommendations = (
    primary: string, 
    secondary: string | undefined, 
    percentage: Record<string, number>
  ): string[] => {
    const recommendations: string[] = []

    switch (primary) {
      case 'vata':
        recommendations.push(
          'Focus on warm, nourishing foods to ground your airy nature',
          'Establish regular routines for meals and sleep',
          'Practice calming activities like gentle yoga and meditation',
          'Stay hydrated with warm beverages throughout the day'
        )
        break
      case 'pitta':
        recommendations.push(
          'Choose cooling foods and avoid excessive spices',
          'Practice moderation in work and exercise',
          'Incorporate cooling activities like swimming',
          'Avoid skipping meals to prevent irritability'
        )
        break
      case 'kapha':
        recommendations.push(
          'Include light, warming spices in your diet',
          'Engage in regular vigorous exercise',
          'Wake up early and avoid daytime naps',
          'Choose stimulating activities to boost energy'
        )
        break
    }

    if (secondary) {
      recommendations.push(`Balance your ${secondary} qualities with appropriate lifestyle choices`)
    }

    return recommendations
  }

  const resetAssessment = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setIsComplete(false)
    setResult(null)
    setIsStarted(false)
  }

  const getProgressPercentage = () => {
    return Math.round(((currentQuestion + 1) / questions.length) * 100)
  }

  const getDoshaIcon = (dosha: string) => {
    switch (dosha) {
      case 'vata': return <Wind className="w-6 h-6" />
      case 'pitta': return <Flame className="w-6 h-6" />
      case 'kapha': return <Mountain className="w-6 h-6" />
      default: return <Brain className="w-6 h-6" />
    }
  }

  const getDoshaColor = (dosha: string) => {
    switch (dosha) {
      case 'vata': return 'from-blue-500 to-indigo-600'
      case 'pitta': return 'from-red-500 to-orange-600'
      case 'kapha': return 'from-green-500 to-emerald-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  if (!isStarted) {
    return (
      <Card className="max-w-4xl mx-auto bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-900">
            Discover Your Ayurvedic Constitution
          </CardTitle>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Unlock the secrets of your unique body-mind type through our comprehensive Prakriti assessment. 
            This ancient wisdom will guide you toward personalized health and wellness recommendations.
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white rounded-xl border border-blue-200">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full">
                  <Wind className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="font-bold text-blue-800 mb-2">Vata</h3>
              <p className="text-sm text-gray-600">Air + Ether<br/>Movement & Creativity</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl border border-red-200">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-r from-red-500 to-orange-600 rounded-full">
                  <Flame className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="font-bold text-red-800 mb-2">Pitta</h3>
              <p className="text-sm text-gray-600">Fire + Water<br/>Transformation & Intelligence</p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-xl border border-green-200">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full">
                  <Mountain className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="font-bold text-green-800 mb-2">Kapha</h3>
              <p className="text-sm text-gray-600">Earth + Water<br/>Structure & Stability</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-amber-200">
            <h3 className="font-bold mb-4 text-center">What You'll Discover:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm">Your primary constitutional type</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm">Personalized diet recommendations</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm">Lifestyle guidance for optimal health</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm">Exercise recommendations</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Button
              onClick={() => setIsStarted(true)}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-8 py-4 text-lg"
            >
              <PlayCircle className="w-5 h-5 mr-2" />
              Begin Assessment
            </Button>
            <p className="text-xs text-gray-500 mt-2">Takes about 5 minutes • {questions.length} questions</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isComplete && result) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Results Header */}
        <Card className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
          <CardContent className="p-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white/20 rounded-full">
                {getDoshaIcon(result.primary)}
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-2">
              Your Constitution: {result.primary.charAt(0).toUpperCase() + result.primary.slice(1)}
              {result.secondary && `-${result.secondary.charAt(0).toUpperCase() + result.secondary.slice(1)}`}
            </h2>
            <p className="text-orange-100 text-lg">
              Confidence Level: {result.confidence}%
            </p>
          </CardContent>
        </Card>

        {/* Dosha Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Your Dosha Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {Object.entries(result.percentage).map(([dosha, percentage]) => (
              <div key={dosha} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    {getDoshaIcon(dosha)}
                    <span className="font-semibold capitalize">{dosha}</span>
                  </div>
                  <span className="font-bold">{percentage}%</span>
                </div>
                <Progress value={percentage} className="h-3" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Personalized Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              Personalized Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {result.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                  <Zap className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">{rec}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={resetAssessment}
            variant="outline"
            className="border-orange-300 text-orange-600 hover:bg-orange-50"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Take Assessment Again
          </Button>
          <Button
            className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600"
            onClick={() => {
              // In a real app, this would save results and navigate to dashboard
              alert('Results saved! Redirecting to personalized dashboard...')
            }}
          >
            Save Results & Continue
          </Button>
        </div>
      </div>
    )
  }

  // Question Interface
  const question = questions[currentQuestion]
  
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress Header */}
      <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
              Question {currentQuestion + 1} of {questions.length}
            </Badge>
            <Badge variant="outline" className="border-orange-300 text-orange-600">
              {question.category}
            </Badge>
          </div>
          <Progress value={getProgressPercentage()} className="h-2 mb-2" />
          <p className="text-sm text-gray-600 text-center">
            {getProgressPercentage()}% Complete
          </p>
        </CardContent>
      </Card>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">
            {question.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full text-left p-4 h-auto border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200"
                onClick={() => handleAnswer(index)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-transparent"></div>
                  </div>
                  <span className="text-gray-700">{option.text}</span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={resetAssessment}
          className="border-red-300 text-red-600 hover:bg-red-50"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Start Over
        </Button>
      </div>
    </div>
  )
}