"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Clock, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Calendar,
  Target,
  Flame,
  Snowflake,
  Leaf
} from 'lucide-react'
import { Exercise } from '@/lib/ayurvedic-exercises'

interface ExerciseCardProps {
  exercise: Exercise
  showFullDetails?: boolean
  constitution?: string
}

export function ExerciseCard({ exercise, showFullDetails = false, constitution }: ExerciseCardProps) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-stone-100 text-stone-800 border-stone-300'
      case 'Intermediate': return 'bg-amber-100 text-amber-800 border-amber-300' 
      case 'Advanced': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      default: return 'bg-neutral-100 text-neutral-800 border-neutral-300'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Asana': return <Users className="h-4 w-4" />
      case 'Pranayama': return <Flame className="h-4 w-4" />
      case 'Meditation': return <Leaf className="h-4 w-4" />
      default: return <Target className="h-4 w-4" />
    }
  }

  const getDoshaEffect = (dosha: string, effect: string) => {
    if (effect.includes('Balancing') || effect.includes('Grounding')) return 'text-stone-700'
    if (effect.includes('Cooling') || effect.includes('Calming')) return 'text-amber-700'
    if (effect.includes('Warming') || effect.includes('Energizing')) return 'text-yellow-700'
    if (effect.includes('Increasing')) return 'text-neutral-700'
    return 'text-stone-600'
  }

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Exercise Images */}
      {exercise.id === 'surya-namaskara' && (
        <div className="relative w-full h-48 bg-gradient-to-b from-amber-50 to-stone-50">
          <Image
            src="/surya-namaskar.jpeg"
            alt="Surya Namaskar - Sun Salutation"
            fill
            className="object-cover"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute bottom-2 left-2 right-2">
            <Badge className="bg-white/90 text-amber-800 border-amber-300">
              Traditional Sun Salutation
            </Badge>
          </div>
        </div>
      )}
      
      {exercise.id === 'vrikshasana' && (
        <div className="relative w-full h-48 bg-gradient-to-b from-green-50 to-stone-50">
          <Image
            src="/vrikshana.jpeg"
            alt="Vrikshasana - Tree Pose"
            fill
            className="object-cover"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute bottom-2 left-2 right-2">
            <Badge className="bg-white/90 text-green-800 border-green-300">
              Grounding Tree Pose
            </Badge>
          </div>
        </div>
      )}
      
      {exercise.id === 'pranayama-nadi-shodhana' && (
        <div className="relative w-full h-48 bg-gradient-to-b from-blue-50 to-stone-50">
          <Image
            src="/nadi.jpeg"
            alt="Nadi Shodhana - Alternate Nostril Breathing"
            fill
            className="object-cover"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute bottom-2 left-2 right-2">
            <Badge className="bg-white/90 text-blue-800 border-blue-300">
              Balancing Pranayama
            </Badge>
          </div>
        </div>
      )}
      
      {exercise.id === 'bhramari-pranayama' && (
        <div className="relative w-full h-48 bg-gradient-to-b from-purple-50 to-stone-50">
          <Image
            src="/bhramari.jpeg"
            alt="Bhramari Pranayama - Humming Bee Breath"
            fill
            className="object-cover"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute bottom-2 left-2 right-2">
            <Badge className="bg-white/90 text-purple-800 border-purple-300">
              Calming Sound Breath
            </Badge>
          </div>
        </div>
      )}
      
      {exercise.id === 'balasana' && (
        <div className="relative w-full h-48 bg-gradient-to-b from-indigo-50 to-stone-50">
          <Image
            src="/balasana.jpeg"
            alt="Balasana - Child's Pose"
            fill
            className="object-cover"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute bottom-2 left-2 right-2">
            <Badge className="bg-white/90 text-indigo-800 border-indigo-300">
              Restorative Grounding
            </Badge>
          </div>
        </div>
      )}
      
      {exercise.id === 'ujjayi-pranayama' && (
        <div className="relative w-full h-48 bg-gradient-to-b from-cyan-50 to-stone-50">
          <Image
            src="/ujjayi.jpeg"
            alt="Ujjayi Pranayama - Victorious Breath"
            fill
            className="object-cover"
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute bottom-2 left-2 right-2">
            <Badge className="bg-white/90 text-cyan-800 border-cyan-300">
              Ocean Breath Power
            </Badge>
          </div>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {getCategoryIcon(exercise.category)}
              {exercise.name}
            </CardTitle>
            <CardDescription className="text-sm text-gray-600 mt-1">
              {exercise.englishName}
            </CardDescription>
          </div>
          <Badge className={getDifficultyColor(exercise.difficulty)}>
            {exercise.difficulty}
          </Badge>
        </div>
        
        <div className="flex items-center gap-4 text-sm text-gray-500 mt-2">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {exercise.duration}
          </div>
          <Badge variant="outline" className="text-xs">
            {exercise.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Primary Benefits */}
        <div>
          <h4 className="font-medium text-sm mb-2 flex items-center gap-1 text-stone-800">
            <CheckCircle className="h-4 w-4 text-amber-700" />
            Primary Benefits
          </h4>
          <div className="grid grid-cols-1 gap-1">
            {exercise.primaryBenefits.slice(0, showFullDetails ? undefined : 3).map((benefit, index) => (
              <div key={index} className="text-sm text-stone-700 flex items-start gap-1">
                <div className="w-1 h-1 bg-amber-600 rounded-full mt-2 flex-shrink-0"></div>
                {benefit}
              </div>
            ))}
            {!showFullDetails && exercise.primaryBenefits.length > 3 && (
              <div className="text-xs text-stone-600">
                +{exercise.primaryBenefits.length - 3} more benefits
              </div>
            )}
          </div>
        </div>

        {/* Dosha Effects */}
        <div>
          <h4 className="font-medium text-sm mb-2 text-stone-800">Dosha Effects</h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-amber-50/70 backdrop-blur-sm rounded border border-amber-200/60">
              <div className="font-medium text-amber-900">Vata</div>
              <div className={getDoshaEffect('vata', exercise.doshaEffects.vata)}>
                {exercise.doshaEffects.vata}
              </div>
            </div>
            <div className="text-center p-2 bg-stone-50/70 backdrop-blur-sm rounded border border-stone-200/60">
              <div className="font-medium text-stone-900">Pitta</div>
              <div className={getDoshaEffect('pitta', exercise.doshaEffects.pitta)}>
                {exercise.doshaEffects.pitta}
              </div>
            </div>
            <div className="text-center p-2 bg-yellow-50/70 backdrop-blur-sm rounded border border-yellow-200/60">
              <div className="font-medium text-yellow-900">Kapha</div>
              <div className={getDoshaEffect('kapha', exercise.doshaEffects.kapha)}>
                {exercise.doshaEffects.kapha}
              </div>
            </div>
          </div>
        </div>

        {/* Constitution-specific modification */}
        {constitution && exercise.modifications[constitution as keyof typeof exercise.modifications] && (
          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
            <h4 className="font-medium text-sm mb-1 text-amber-800">
              For {constitution.charAt(0).toUpperCase() + constitution.slice(1)} Constitution
            </h4>
            <p className="text-sm text-amber-700">
              {exercise.modifications[constitution as keyof typeof exercise.modifications]}
            </p>
          </div>
        )}

        {/* Best time to perform */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span className="font-medium">Best time:</span>
          {exercise.bestTimeToPerform}
        </div>

        {/* Contraindications (if any) */}
        {exercise.contraindications.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-1 flex items-center gap-1 text-red-700">
              <AlertTriangle className="h-4 w-4" />
              Contraindications
            </h4>
            <div className="text-xs text-red-600 space-y-1">
              {exercise.contraindications.slice(0, showFullDetails ? undefined : 2).map((contra, index) => (
                <div key={index} className="flex items-start gap-1">
                  <div className="w-1 h-1 bg-red-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  {contra}
                </div>
              ))}
              {!showFullDetails && exercise.contraindications.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{exercise.contraindications.length - 2} more precautions
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <Link href={`/exercises/${exercise.id}`}>
            <Button variant="outline" className="w-full">
              View Full Instructions
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

interface ExerciseGridProps {
  exercises: Exercise[]
  constitution?: string
  emptyMessage?: string
}

export function ExerciseGrid({ exercises, constitution, emptyMessage = "No exercises found" }: ExerciseGridProps) {
  if (exercises.length === 0) {
    return (
      <div className="text-center py-12">
        <Leaf className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {exercises.map((exercise) => (
        <ExerciseCard 
          key={exercise.id} 
          exercise={exercise} 
          constitution={constitution}
        />
      ))}
    </div>
  )
}

interface ExerciseStepsProps {
  steps: string[]
  title?: string
}

export function ExerciseSteps({ steps, title = "Instructions" }: ExerciseStepsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-stone-800">{title}</h3>
      <div className="space-y-3">
        {steps.map((step, index) => (
          <div key={index} className="flex gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-amber-700 text-white rounded-full flex items-center justify-center text-sm font-medium">
              {index + 1}
            </div>
            <p className="text-stone-700 pt-0.5">{step}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

interface SeasonalRecommendationsProps {
  recommendations: {
    spring: string
    summer: string
    autumn: string
    winter: string
  }
}

export function SeasonalRecommendations({ recommendations }: SeasonalRecommendationsProps) {
  const seasons = [
    { key: 'spring', name: 'Spring', icon: <Leaf className="h-4 w-4" />, color: 'bg-yellow-50/70 backdrop-blur-sm border-yellow-200/60' },
    { key: 'summer', name: 'Summer', icon: <Flame className="h-4 w-4" />, color: 'bg-stone-50/70 backdrop-blur-sm border-stone-200/60' },
    { key: 'autumn', name: 'Autumn', icon: <Leaf className="h-4 w-4" />, color: 'bg-amber-50/70 backdrop-blur-sm border-amber-200/60' },
    { key: 'winter', name: 'Winter', icon: <Snowflake className="h-4 w-4" />, color: 'bg-neutral-50/70 backdrop-blur-sm border-neutral-200/60' }
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-stone-800">Seasonal Adaptations</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {seasons.map((season) => (
          <div key={season.key} className={`p-4 rounded-lg border ${season.color}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-amber-700">{season.icon}</span>
              <h4 className="font-medium text-stone-800">{season.name}</h4>
            </div>
            <p className="text-sm text-stone-700">
              {recommendations[season.key as keyof typeof recommendations]}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

interface DoshaModificationsProps {
  modifications: {
    vata: string
    pitta: string
    kapha: string
  }
}

export function DoshaModifications({ modifications }: DoshaModificationsProps) {
  const doshas = [
    { key: 'vata', name: 'Vata', color: 'bg-amber-50/70 backdrop-blur-sm border-amber-200/60 text-amber-800' },
    { key: 'pitta', name: 'Pitta', color: 'bg-stone-50/70 backdrop-blur-sm border-stone-200/60 text-stone-800' },
    { key: 'kapha', name: 'Kapha', color: 'bg-yellow-50/70 backdrop-blur-sm border-yellow-200/60 text-yellow-800' }
  ]

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-stone-800">Constitutional Modifications</h3>
      <div className="space-y-3">
        {doshas.map((dosha) => (
          <div key={dosha.key} className={`p-4 rounded-lg border ${dosha.color}`}>
            <h4 className="font-medium mb-2 text-stone-800">{dosha.name} Constitution</h4>
            <p className="text-sm text-stone-700">
              {modifications[dosha.key as keyof typeof modifications]}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}