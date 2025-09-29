"use client"

import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft,
  Clock, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Calendar,
  Target,
  Flame,
  Snowflake,
  Leaf,
  BookOpen,
  Heart
} from 'lucide-react'
import { 
  ayurvedicExerciseService, 
  Exercise 
} from '@/lib/ayurvedic-exercises'
import { 
  ExerciseSteps,
  SeasonalRecommendations,
  DoshaModifications
} from '@/components/ui/exercise-components'

interface ExercisePageProps {
  params: {
    id: string
  }
}

function ExercisePage({ params }: ExercisePageProps) {
  const exercise = ayurvedicExerciseService.getExerciseById(params.id)
  
  if (!exercise) {
    notFound()
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-yellow-100/70 text-yellow-800 border-yellow-200/60 backdrop-blur-sm'
      case 'Intermediate': return 'bg-amber-100/70 text-amber-800 border-amber-200/60 backdrop-blur-sm' 
      case 'Advanced': return 'bg-stone-100/70 text-stone-800 border-stone-200/60 backdrop-blur-sm'
      default: return 'bg-neutral-100/70 text-neutral-800 border-neutral-200/60 backdrop-blur-sm'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Asana': return <Users className="h-6 w-6 text-amber-700" />
      case 'Pranayama': return <Flame className="h-6 w-6 text-amber-700" />
      case 'Meditation': return <Leaf className="h-6 w-6 text-amber-700" />
      default: return <Target className="h-6 w-6 text-amber-700" />
    }
  }

  const getDoshaEffect = (dosha: string, effect: string) => {
    if (effect.includes('Balancing') || effect.includes('Grounding')) return 'text-stone-700 bg-stone-50/70 backdrop-blur-sm border-stone-200/60'
    if (effect.includes('Cooling') || effect.includes('Calming')) return 'text-amber-700 bg-amber-50/70 backdrop-blur-sm border-amber-200/60'
    if (effect.includes('Warming') || effect.includes('Energizing')) return 'text-yellow-700 bg-yellow-50/70 backdrop-blur-sm border-yellow-200/60'
    if (effect.includes('Increasing')) return 'text-neutral-700 bg-neutral-50/70 backdrop-blur-sm border-neutral-200/60'
    return 'text-stone-700 bg-stone-50/70 backdrop-blur-sm border-stone-200/60'
  }

  // Get related exercises from same category
  const relatedExercises = ayurvedicExerciseService
    .getExercisesByCategory(exercise.category)
    .filter(ex => ex.id !== exercise.id)
    .slice(0, 3)

  return (
    <DashboardLayout>
      <div className="min-h-screen main_bg">
        <div className="p-6 max-w-5xl mx-auto space-y-8">
        {/* Back Button */}
        <div className="flex items-center gap-4">
          <Link href="/exercises">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Exercises
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100/70 backdrop-blur-sm rounded-lg border border-amber-200/60">
                  {getCategoryIcon(exercise.category)}
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-stone-900">{exercise.name}</h1>
                  <p className="text-xl text-stone-700">{exercise.englishName}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-sm">
                <Badge className={getDifficultyColor(exercise.difficulty)}>
                  {exercise.difficulty}
                </Badge>
                <Badge variant="outline">{exercise.category}</Badge>
                <Badge variant="outline">{exercise.type}</Badge>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-white/70 backdrop-blur-sm border-amber-200/60">
              <CardContent className="p-4 flex items-center gap-3">
                <Clock className="h-5 w-5 text-amber-700" />
                <div>
                  <p className="font-medium text-stone-800">Duration</p>
                  <p className="text-sm text-stone-600">{exercise.duration}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/70 backdrop-blur-sm border-amber-200/60">
              <CardContent className="p-4 flex items-center gap-3">
                <Calendar className="h-5 w-5 text-amber-700" />
                <div>
                  <p className="font-medium text-stone-800">Best Time</p>
                  <p className="text-sm text-stone-600">{exercise.bestTimeToPerform}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/70 backdrop-blur-sm border-amber-200/60">
              <CardContent className="p-4 flex items-center gap-3">
                <Target className="h-5 w-5 text-amber-700" />
                <div>
                  <p className="font-medium text-stone-800">Type</p>
                  <p className="text-sm text-stone-600">{exercise.type}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Exercise Image Sections */}
        {exercise.id === 'surya-namaskara' && (
          <Card className="overflow-hidden bg-white/70 backdrop-blur-sm border-amber-200/60">
            <div className="relative h-64 md:h-80">
              <img 
                src="/surya-namaskar.jpeg" 
                alt="Surya Namaskar - Sun Salutation Sequence" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-amber-200/60">
                  <h3 className="font-semibold text-stone-800 mb-1">Traditional Sun Salutation</h3>
                  <p className="text-sm text-stone-600">
                    A complete sequence of 12 postures flowing with breath, honoring the sun as the source of all energy
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {exercise.id === 'vrikshasana' && (
          <Card className="overflow-hidden bg-white/70 backdrop-blur-sm border-green-200/60">
            <div className="relative h-64 md:h-80">
              <img 
                src="/vrikshana.jpeg" 
                alt="Vrikshasana - Tree Pose Balance" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-green-200/60">
                  <h3 className="font-semibold text-stone-800 mb-1">Grounding Tree Pose</h3>
                  <p className="text-sm text-stone-600">
                    A foundational balance pose that cultivates stability, focus, and connection with nature's grounding energy
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {exercise.id === 'pranayama-nadi-shodhana' && (
          <Card className="overflow-hidden bg-white/70 backdrop-blur-sm border-blue-200/60">
            <div className="relative h-64 md:h-80">
              <img 
                src="/nadi.jpeg" 
                alt="Nadi Shodhana - Alternate Nostril Breathing" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-blue-200/60">
                  <h3 className="font-semibold text-stone-800 mb-1">Balancing Pranayama</h3>
                  <p className="text-sm text-stone-600">
                    Ancient breathing technique that harmonizes the nervous system and balances the left and right brain hemispheres
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {exercise.id === 'bhramari-pranayama' && (
          <Card className="overflow-hidden bg-white/70 backdrop-blur-sm border-purple-200/60">
            <div className="relative h-64 md:h-80">
              <img 
                src="/bhramari.jpeg" 
                alt="Bhramari Pranayama - Humming Bee Breath" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-purple-200/60">
                  <h3 className="font-semibold text-stone-800 mb-1">Calming Sound Breath</h3>
                  <p className="text-sm text-stone-600">
                    Sacred humming breath that creates healing vibrations, deeply calming the nervous system and enhancing inner focus
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {exercise.id === 'balasana' && (
          <Card className="overflow-hidden bg-white/70 backdrop-blur-sm border-indigo-200/60">
            <div className="relative h-64 md:h-80">
              <img 
                src="/balasana.jpeg" 
                alt="Balasana - Child's Pose" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-indigo-200/60">
                  <h3 className="font-semibold text-stone-800 mb-1">Restorative Grounding</h3>
                  <p className="text-sm text-stone-600">
                    A deeply restful pose that promotes surrender, introspection, and grounding of scattered vata energy
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {exercise.id === 'ujjayi-pranayama' && (
          <Card className="overflow-hidden bg-white/70 backdrop-blur-sm border-cyan-200/60">
            <div className="relative h-64 md:h-80">
              <img 
                src="/ujjayi.jpeg" 
                alt="Ujjayi Pranayama - Victorious Breath" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-cyan-200/60">
                  <h3 className="font-semibold text-stone-800 mb-1">Ocean Breath Power</h3>
                  <p className="text-sm text-stone-600">
                    The victorious breath that creates internal heat and ocean-like sounds, building focus while energizing the body
                  </p>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Instructions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Steps */}
            <Card className="bg-white/70 backdrop-blur-sm border-amber-200/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-stone-800">
                  <BookOpen className="h-5 w-5 text-amber-700" />
                  Step-by-Step Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ExerciseSteps steps={exercise.steps} />
              </CardContent>
            </Card>

            {/* Seasonal Recommendations */}
            <Card className="bg-white/70 backdrop-blur-sm border-amber-200/60">
              <CardContent className="p-6">
                <SeasonalRecommendations recommendations={exercise.seasonalRecommendations} />
              </CardContent>
            </Card>

            {/* Constitutional Modifications */}
            <Card className="bg-white/70 backdrop-blur-sm border-amber-200/60">
              <CardContent className="p-6">
                <DoshaModifications modifications={exercise.modifications} />
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Primary Benefits */}
            <Card className="bg-white/70 backdrop-blur-sm border-amber-200/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-amber-800">
                  <CheckCircle className="h-5 w-5" />
                  Primary Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {exercise.primaryBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-sm text-stone-700">{benefit}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Dosha Effects */}
            <Card className="bg-white/70 backdrop-blur-sm border-amber-200/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-stone-800">
                  <Heart className="h-5 w-5 text-amber-700" />
                  Dosha Effects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(exercise.doshaEffects).map(([dosha, effect]) => (
                    <div key={dosha} className={`p-3 rounded-lg border ${getDoshaEffect(dosha, effect)}`}>
                      <div className="font-medium capitalize mb-1 text-stone-800">{dosha}</div>
                      <div className="text-sm">{effect}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contraindications */}
            {exercise.contraindications.length > 0 && (
              <Card className="bg-white/70 backdrop-blur-sm border-stone-300/60">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-stone-800">
                    <AlertTriangle className="h-5 w-5 text-amber-700" />
                    Contraindications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {exercise.contraindications.map((contra, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-stone-600 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm text-stone-700">{contra}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Related Exercises */}
        {relatedExercises.length > 0 && (
          <div className="space-y-4">
            <Separator />
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-stone-800">Related {exercise.category} Practices</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedExercises.map((relatedExercise) => (
                  <Card key={relatedExercise.id} className="hover:shadow-md transition-shadow bg-white/70 backdrop-blur-sm border-amber-200/60">
                    <CardHeader>
                      <CardTitle className="text-lg text-stone-800">{relatedExercise.name}</CardTitle>
                      <CardDescription className="text-stone-600">{relatedExercise.englishName}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-stone-600">
                          <Clock className="h-4 w-4 text-amber-700" />
                          {relatedExercise.duration}
                        </div>
                        <Badge className={getDifficultyColor(relatedExercise.difficulty)}>
                          {relatedExercise.difficulty}
                        </Badge>
                        <Link href={`/exercises/${relatedExercise.id}`}>
                          <Button variant="outline" size="sm" className="w-full border-amber-200 text-amber-800 hover:bg-amber-50">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default ExercisePage