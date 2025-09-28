import { EnhancedFood, EnhancedFoodDatabase } from './enhanced-food-database'
import { EnhancedPatient } from './enhanced-patient-management'
import { AyurvedicAIAdvisor } from './ayurvedic-ai-advisor'

export interface SeasonalContext {
  season: 'spring' | 'summer' | 'monsoon' | 'autumn' | 'winter'
  region: string
  temperature: number
  humidity: number
  weatherPattern: 'dry' | 'humid' | 'windy' | 'cold' | 'hot'
  localDate: Date
}

export interface SeasonalRecommendation {
  season: string
  recommendations: {
    foods: {
      include: EnhancedFood[]
      avoid: EnhancedFood[]
      emphasize: string[]
    }
    lifestyle: {
      wakeTime: string
      sleepTime: string
      exerciseType: string[]
      exerciseIntensity: 'low' | 'moderate' | 'high'
      activities: string[]
    }
    herbs: {
      name: string
      purpose: string
      dosage: string
      preparation: string
    }[]
    spices: {
      name: string
      benefits: string[]
      usage: string
    }[]
    precautions: string[]
  }
  doshaBalance: {
    vata: 'increase' | 'decrease' | 'maintain'
    pitta: 'increase' | 'decrease' | 'maintain'
    kapha: 'increase' | 'decrease' | 'maintain'
  }
  reasoning: string
}

export interface SeasonalMealPlan {
  season: string
  constitution: string
  meals: {
    breakfast: {
      primary: string[]
      supporting: string[]
      preparation: string
      timing: string
    }
    lunch: {
      primary: string[]
      supporting: string[]
      preparation: string
      timing: string
    }
    dinner: {
      primary: string[]
      supporting: string[]
      preparation: string
      timing: string
    }
    snacks: {
      morning?: string[]
      evening?: string[]
    }
  }
  hydration: {
    type: string[]
    temperature: 'hot' | 'warm' | 'room-temperature' | 'cool'
    timing: string[]
    quantity: string
  }
  specialConsiderations: string[]
}

export class SeasonalDietAdaptation {
  private static seasonalProfiles = {
    spring: {
      characteristics: ['kapha accumulation', 'mucus buildup', 'sluggishness', 'allergies'],
      primaryDosha: 'kapha',
      secondaryDosha: 'vata',
      weatherQualities: ['wet', 'heavy', 'cool', 'cloudy'],
      therapeuticApproach: 'detoxification and lightening'
    },
    summer: {
      characteristics: ['pitta aggravation', 'heat buildup', 'inflammation', 'acidity'],
      primaryDosha: 'pitta',
      secondaryDosha: 'vata',
      weatherQualities: ['hot', 'sharp', 'light', 'penetrating'],
      therapeuticApproach: 'cooling and soothing'
    },
    monsoon: {
      characteristics: ['vata aggravation', 'digestive weakness', 'infection susceptibility'],
      primaryDosha: 'vata',
      secondaryDosha: 'pitta',
      weatherQualities: ['erratic', 'wet', 'windy', 'unstable'],
      therapeuticApproach: 'grounding and strengthening'
    },
    autumn: {
      characteristics: ['vata accumulation', 'dryness', 'instability', 'nervousness'],
      primaryDosha: 'vata',
      secondaryDosha: 'pitta',
      weatherQualities: ['dry', 'rough', 'windy', 'variable'],
      therapeuticApproach: 'nourishing and stabilizing'
    },
    winter: {
      characteristics: ['kapha accumulation', 'stagnation', 'cold buildup', 'lethargy'],
      primaryDosha: 'kapha',
      secondaryDosha: 'vata',
      weatherQualities: ['cold', 'heavy', 'stable', 'moist'],
      therapeuticApproach: 'warming and stimulating'
    }
  }

  static getCurrentSeason(region: string = 'india'): SeasonalContext {
    const now = new Date()
    const month = now.getMonth() + 1
    
    // Indian seasonal calendar
    let season: SeasonalContext['season']
    if (month >= 3 && month <= 5) season = 'spring'
    else if (month >= 6 && month <= 8) season = 'summer'
    else if (month >= 9 && month <= 10) season = 'monsoon'
    else if (month >= 11 && month <= 12) season = 'autumn'
    else season = 'winter'

    return {
      season,
      region,
      temperature: this.getSeasonalTemperature(season, region),
      humidity: this.getSeasonalHumidity(season, region),
      weatherPattern: this.getWeatherPattern(season),
      localDate: now
    }
  }

  private static getSeasonalTemperature(season: string, region: string): number {
    const baseTemps = {
      spring: 25,
      summer: 35,
      monsoon: 28,
      autumn: 22,
      winter: 15
    }
    return baseTemps[season as keyof typeof baseTemps] || 25
  }

  private static getSeasonalHumidity(season: string, region: string): number {
    const baseHumidity = {
      spring: 60,
      summer: 40,
      monsoon: 85,
      autumn: 55,
      winter: 70
    }
    return baseHumidity[season as keyof typeof baseHumidity] || 60
  }

  private static getWeatherPattern(season: string): SeasonalContext['weatherPattern'] {
    const patterns = {
      spring: 'humid' as const,
      summer: 'hot' as const,
      monsoon: 'humid' as const,
      autumn: 'dry' as const,
      winter: 'cold' as const
    }
    return patterns[season as keyof typeof patterns] || 'dry'
  }

  static generateSeasonalRecommendations(
    patient: EnhancedPatient,
    seasonalContext: SeasonalContext
  ): SeasonalRecommendation {
    const seasonProfile = this.seasonalProfiles[seasonalContext.season]
    const constitution = patient.constitution
    
    return {
      season: seasonalContext.season,
      recommendations: {
        foods: this.getSeasonalFoodRecommendations(seasonalContext.season, constitution),
        lifestyle: this.getSeasonalLifestyleRecommendations(seasonalContext.season, constitution),
        herbs: this.getSeasonalHerbs(seasonalContext.season, constitution),
        spices: this.getSeasonalSpices(seasonalContext.season, constitution),
        precautions: this.getSeasonalPrecautions(seasonalContext.season, constitution)
      },
      doshaBalance: this.getSeasonalDoshaBalance(seasonalContext.season),
      reasoning: this.generateSeasonalReasoning(seasonalContext.season, constitution, seasonProfile)
    }
  }

  private static getSeasonalFoodRecommendations(season: string, constitution: string) {
    const foods = EnhancedFoodDatabase.getAllFoods()
    
    const seasonalFoods = {
      spring: {
        include: foods.filter(f => 
          f.season?.includes('spring') || 
          f.ayurvedic.virya === 'heating' ||
          f.ayurvedic.guna.includes('light')
        ).slice(0, 10),
        avoid: foods.filter(f => 
          f.ayurvedic.guna.includes('heavy') ||
          f.ayurvedic.doshaEffect.kapha > 0
        ).slice(0, 5),
        emphasize: ['bitter greens', 'warming spices', 'light proteins', 'detoxifying herbs']
      },
      summer: {
        include: foods.filter(f => 
          f.season?.includes('summer') || 
          f.ayurvedic.virya === 'cooling' ||
          f.ayurvedic.rasa.sweet > 50
        ).slice(0, 10),
        avoid: foods.filter(f => 
          f.ayurvedic.virya === 'heating' ||
          f.ayurvedic.rasa.pungent > 30
        ).slice(0, 5),
        emphasize: ['cooling fruits', 'leafy greens', 'coconut water', 'rose water']
      },
      monsoon: {
        include: foods.filter(f => 
          f.ayurvedic.guna.includes('warm') ||
          f.ayurvedic.rasa.pungent > 20
        ).slice(0, 10),
        avoid: foods.filter(f => 
          f.category === 'raw-vegetables' ||
          f.ayurvedic.virya === 'cooling'
        ).slice(0, 5),
        emphasize: ['cooked foods', 'warming spices', 'digestive teas', 'dry preparations']
      },
      autumn: {
        include: foods.filter(f => 
          f.ayurvedic.guna.includes('nourishing') ||
          f.ayurvedic.rasa.sweet > 40
        ).slice(0, 10),
        avoid: foods.filter(f => 
          f.ayurvedic.guna.includes('dry') ||
          f.ayurvedic.doshaEffect.vata > 0
        ).slice(0, 5),
        emphasize: ['root vegetables', 'warm oils', 'nourishing soups', 'sweet fruits']
      },
      winter: {
        include: foods.filter(f => 
          f.ayurvedic.virya === 'heating' ||
          f.ayurvedic.guna.includes('warm')
        ).slice(0, 10),
        avoid: foods.filter(f => 
          f.ayurvedic.virya === 'cooling' ||
          f.category === 'cold-beverages'
        ).slice(0, 5),
        emphasize: ['warming foods', 'hot beverages', 'rich proteins', 'heating spices']
      }
    }

    return seasonalFoods[season as keyof typeof seasonalFoods] || seasonalFoods.spring
  }

  private static getSeasonalLifestyleRecommendations(season: string, constitution: string) {
    const lifestyleRecommendations = {
      spring: {
        wakeTime: '06:30',
        sleepTime: '22:30',
        exerciseType: ['yoga', 'brisk walking', 'cycling'],
        exerciseIntensity: 'moderate' as const,
        activities: ['pranayama', 'detox practices', 'oil massage', 'early morning walks']
      },
      summer: {
        wakeTime: '05:30',
        sleepTime: '23:00',
        exerciseType: ['swimming', 'yoga', 'light walking'],
        exerciseIntensity: 'low' as const,
        activities: ['cooling pranayama', 'moon gazing', 'water activities', 'afternoon rest']
      },
      monsoon: {
        wakeTime: '06:00',
        sleepTime: '22:00',
        exerciseType: ['indoor yoga', 'meditation', 'light stretching'],
        exerciseIntensity: 'low' as const,
        activities: ['oil massage', 'steam therapy', 'indoor activities', 'digestive practices']
      },
      autumn: {
        wakeTime: '06:00',
        sleepTime: '22:00',
        exerciseType: ['gentle yoga', 'walking', 'tai chi'],
        exerciseIntensity: 'moderate' as const,
        activities: ['self-massage', 'warm baths', 'meditation', 'grounding exercises']
      },
      winter: {
        wakeTime: '06:30',
        sleepTime: '21:30',
        exerciseType: ['vigorous yoga', 'strength training', 'cardio'],
        exerciseIntensity: 'high' as const,
        activities: ['heating practices', 'sauna', 'vigorous exercise', 'stimulating massage']
      }
    }

    return lifestyleRecommendations[season as keyof typeof lifestyleRecommendations] || lifestyleRecommendations.spring
  }

  private static getSeasonalHerbs(season: string, constitution: string) {
    const seasonalHerbs = {
      spring: [
        { name: 'Triphala', purpose: 'Detoxification', dosage: '1-2g twice daily', preparation: 'warm water' },
        { name: 'Turmeric', purpose: 'Anti-inflammatory', dosage: '500mg daily', preparation: 'with warm milk' },
        { name: 'Neem', purpose: 'Blood purification', dosage: '2-4 leaves', preparation: 'fresh or tea' }
      ],
      summer: [
        { name: 'Aloe Vera', purpose: 'Cooling and healing', dosage: '2 tbsp juice', preparation: 'fresh morning' },
        { name: 'Coriander', purpose: 'Cooling digestion', dosage: '1 tsp seeds', preparation: 'overnight water' },
        { name: 'Rose Petals', purpose: 'Heart cooling', dosage: '1 tsp', preparation: 'tea or water' }
      ],
      monsoon: [
        { name: 'Ginger', purpose: 'Digestive strength', dosage: '1 inch piece', preparation: 'tea or fresh' },
        { name: 'Tulsi', purpose: 'Immunity boost', dosage: '5-7 leaves', preparation: 'tea or fresh' },
        { name: 'Black Pepper', purpose: 'Metabolism', dosage: 'pinch', preparation: 'with meals' }
      ],
      autumn: [
        { name: 'Ashwagandha', purpose: 'Nervous system support', dosage: '500mg', preparation: 'with warm milk' },
        { name: 'Brahmi', purpose: 'Mental clarity', dosage: '300mg', preparation: 'with ghee' },
        { name: 'Sesame Oil', purpose: 'Nourishment', dosage: 'external use', preparation: 'warm massage' }
      ],
      winter: [
        { name: 'Cinnamon', purpose: 'Warming circulation', dosage: '1/2 tsp', preparation: 'tea or milk' },
        { name: 'Cardamom', purpose: 'Respiratory support', dosage: '2-3 pods', preparation: 'tea or chew' },
        { name: 'Cloves', purpose: 'Digestive warmth', dosage: '2-3 pieces', preparation: 'tea or chew' }
      ]
    }

    return seasonalHerbs[season as keyof typeof seasonalHerbs] || seasonalHerbs.spring
  }

  private static getSeasonalSpices(season: string, constitution: string) {
    const seasonalSpices = {
      spring: [
        { name: 'Black Pepper', benefits: ['Digestive fire', 'Toxin elimination'], usage: 'Freshly ground with meals' },
        { name: 'Mustard Seeds', benefits: ['Warming', 'Mucus reduction'], usage: 'Tempering in cooking' },
        { name: 'Fenugreek', benefits: ['Liver support', 'Blood cleansing'], usage: 'Soaked overnight and consumed' }
      ],
      summer: [
        { name: 'Fennel', benefits: ['Cooling digestion', 'Sweet taste'], usage: 'Tea or chew after meals' },
        { name: 'Mint', benefits: ['Cooling', 'Refreshing'], usage: 'Fresh leaves in water or food' },
        { name: 'Cumin', benefits: ['Digestive support', 'Cooling effect'], usage: 'Roasted powder with meals' }
      ],
      monsoon: [
        { name: 'Hing (Asafoetida)', benefits: ['Digestive strength', 'Gas reduction'], usage: 'Pinch in dal and vegetables' },
        { name: 'Ajwain', benefits: ['Digestive fire', 'Infection prevention'], usage: 'Tea or with warm water' },
        { name: 'Dry Ginger', benefits: ['Warmth', 'Immunity'], usage: 'Powder in tea or milk' }
      ],
      autumn: [
        { name: 'Nutmeg', benefits: ['Nervous system', 'Sleep support'], usage: 'Pinch in warm milk before bed' },
        { name: 'Sesame Seeds', benefits: ['Nourishment', 'Warmth'], usage: 'Roasted and sprinkled on food' },
        { name: 'Ghee', benefits: ['Lubrication', 'Nourishment'], usage: 'With meals and cooking' }
      ],
      winter: [
        { name: 'Ginger', benefits: ['Warmth', 'Circulation'], usage: 'Fresh or dried in tea and cooking' },
        { name: 'Cinnamon', benefits: ['Warming', 'Sweet taste'], usage: 'In warm beverages and desserts' },
        { name: 'Long Pepper', benefits: ['Respiratory support', 'Heating'], usage: 'Small amounts in warm preparations' }
      ]
    }

    return seasonalSpices[season as keyof typeof seasonalSpices] || seasonalSpices.spring
  }

  private static getSeasonalPrecautions(season: string, constitution: string): string[] {
    const precautions = {
      spring: [
        'Avoid heavy, oily, and sweet foods',
        'Reduce dairy consumption',
        'Avoid afternoon naps',
        'Stay active to prevent lethargy'
      ],
      summer: [
        'Avoid hot, spicy, and sour foods',
        'Limit exposure to direct sunlight',
        'Avoid strenuous exercise in heat',
        'Stay well hydrated'
      ],
      monsoon: [
        'Avoid raw foods and salads',
        'Don\'t drink untreated water',
        'Avoid getting wet in rain',
        'Keep digestive fire strong'
      ],
      autumn: [
        'Avoid dry, rough, and cold foods',
        'Maintain regular meal times',
        'Avoid excessive travel',
        'Keep skin moisturized'
      ],
      winter: [
        'Avoid cold foods and beverages',
        'Don\'t skip meals',
        'Avoid excessive exercise',
        'Keep body warm and covered'
      ]
    }

    return precautions[season as keyof typeof precautions] || precautions.spring
  }

  private static getSeasonalDoshaBalance(season: string) {
    const doshaBalance = {
      spring: { vata: 'maintain' as const, pitta: 'maintain' as const, kapha: 'decrease' as const },
      summer: { vata: 'decrease' as const, pitta: 'decrease' as const, kapha: 'maintain' as const },
      monsoon: { vata: 'decrease' as const, pitta: 'maintain' as const, kapha: 'maintain' as const },
      autumn: { vata: 'decrease' as const, pitta: 'maintain' as const, kapha: 'increase' as const },
      winter: { vata: 'maintain' as const, pitta: 'increase' as const, kapha: 'decrease' as const }
    }

    return doshaBalance[season as keyof typeof doshaBalance] || doshaBalance.spring
  }

  private static generateSeasonalReasoning(season: string, constitution: string, seasonProfile: any): string {
    return `During ${season}, the ${seasonProfile.primaryDosha} dosha tends to ${seasonProfile.characteristics.join(', ')}. ` +
           `For individuals with ${constitution} constitution, the focus should be on ${seasonProfile.therapeuticApproach}. ` +
           `The ${seasonProfile.weatherQualities.join(', ')} qualities of this season require specific dietary and lifestyle adaptations ` +
           `to maintain optimal health and prevent seasonal imbalances.`
  }

  static createSeasonalMealPlan(
    patient: EnhancedPatient, 
    seasonalContext: SeasonalContext
  ): SeasonalMealPlan {
    const constitution = patient.constitution
    const season = seasonalContext.season

    const mealPlans = {
      spring: {
        breakfast: {
          primary: ['Warm quinoa porridge', 'Herbal tea', 'Light fruit'],
          supporting: ['Honey', 'Warming spices', 'Nuts'],
          preparation: 'Cooked and warm',
          timing: '7:00-8:00 AM'
        },
        lunch: {
          primary: ['Mixed vegetable curry', 'Brown rice', 'Dal'],
          supporting: ['Bitter greens', 'Digestive spices', 'Buttermilk'],
          preparation: 'Well-cooked with spices',
          timing: '12:00-1:00 PM'
        },
        dinner: {
          primary: ['Light soup', 'Steamed vegetables', 'Small portion grains'],
          supporting: ['Digestive tea', 'Minimal oil', 'Warming herbs'],
          preparation: 'Light and easily digestible',
          timing: '6:00-7:00 PM'
        },
        snacks: {
          morning: ['Herbal tea', 'Soaked almonds'],
          evening: ['Digestive tea', 'Light crackers']
        }
      },
      summer: {
        breakfast: {
          primary: ['Fresh fruit salad', 'Coconut water', 'Cooling smoothie'],
          supporting: ['Mint', 'Rose water', 'Sweet fruits'],
          preparation: 'Fresh and cooling',
          timing: '6:30-7:30 AM'
        },
        lunch: {
          primary: ['Cooling vegetables', 'Basmati rice', 'Yogurt'],
          supporting: ['Cucumber', 'Coriander', 'Sweet lassi'],
          preparation: 'Moderately spiced, cooling',
          timing: '12:30-1:30 PM'
        },
        dinner: {
          primary: ['Light khichdi', 'Cooling vegetables', 'Milk'],
          supporting: ['Rose water', 'Fennel', 'Sweet preparations'],
          preparation: 'Simple and cooling',
          timing: '7:00-8:00 PM'
        },
        snacks: {
          morning: ['Coconut water', 'Sweet fruits'],
          evening: ['Cooling drinks', 'Sweet snacks']
        }
      },
      monsoon: {
        breakfast: {
          primary: ['Hot porridge', 'Ginger tea', 'Cooked fruits'],
          supporting: ['Warming spices', 'Honey', 'Dry fruits'],
          preparation: 'Hot and well-cooked',
          timing: '7:00-8:00 AM'
        },
        lunch: {
          primary: ['Warm curry', 'Rice', 'Lentils'],
          supporting: ['Digestive spices', 'Pickles', 'Warm water'],
          preparation: 'Hot with strong spices',
          timing: '12:00-1:00 PM'
        },
        dinner: {
          primary: ['Hot soup', 'Bread', 'Warm vegetables'],
          supporting: ['Ginger', 'Black pepper', 'Warm beverages'],
          preparation: 'Hot and freshly cooked',
          timing: '6:30-7:30 PM'
        },
        snacks: {
          morning: ['Hot tea', 'Warm snacks'],
          evening: ['Warm beverages', 'Cooked snacks']
        }
      },
      autumn: {
        breakfast: {
          primary: ['Warm oatmeal', 'Warm milk', 'Sweet fruits'],
          supporting: ['Ghee', 'Nuts', 'Warming spices'],
          preparation: 'Warm and nourishing',
          timing: '7:00-8:00 AM'
        },
        lunch: {
          primary: ['Nourishing curry', 'Rice', 'Dal'],
          supporting: ['Root vegetables', 'Healthy oils', 'Warm water'],
          preparation: 'Well-cooked with healthy fats',
          timing: '12:00-1:00 PM'
        },
        dinner: {
          primary: ['Nourishing soup', 'Bread', 'Warm vegetables'],
          supporting: ['Ghee', 'Sweet taste', 'Warm beverages'],
          preparation: 'Nourishing and grounding',
          timing: '6:00-7:00 PM'
        },
        snacks: {
          morning: ['Warm milk', 'Nuts and dates'],
          evening: ['Herbal tea', 'Sweet snacks']
        }
      },
      winter: {
        breakfast: {
          primary: ['Hot porridge', 'Warm beverages', 'Heating foods'],
          supporting: ['Ghee', 'Warming spices', 'Rich foods'],
          preparation: 'Hot and rich',
          timing: '7:30-8:30 AM'
        },
        lunch: {
          primary: ['Rich curry', 'Rice', 'Protein'],
          supporting: ['Heating spices', 'Healthy fats', 'Hot beverages'],
          preparation: 'Rich and warming',
          timing: '12:30-1:30 PM'
        },
        dinner: {
          primary: ['Nourishing stew', 'Bread', 'Rich preparations'],
          supporting: ['Ghee', 'Warming herbs', 'Hot drinks'],
          preparation: 'Rich and satisfying',
          timing: '6:30-7:30 PM'
        },
        snacks: {
          morning: ['Hot beverages', 'Rich snacks'],
          evening: ['Warm drinks', 'Nourishing snacks']
        }
      }
    }

    const selectedPlan = mealPlans[season as keyof typeof mealPlans] || mealPlans.spring

    return {
      season,
      constitution,
      meals: selectedPlan,
      hydration: {
        type: season === 'summer' ? ['coconut water', 'cooling teas', 'infused water'] :
              season === 'winter' ? ['warm herbal teas', 'hot water', 'warming drinks'] :
              ['room temperature water', 'herbal teas', 'natural beverages'],
        temperature: season === 'summer' ? 'cool' :
                    season === 'winter' ? 'hot' :
                    season === 'monsoon' ? 'hot' : 'warm',
        timing: ['Upon waking', 'Between meals', 'Before bed'],
        quantity: patient.waterIntake ? `${patient.waterIntake}L daily` : '2-3L daily'
      },
      specialConsiderations: this.getSpecialConsiderations(season, constitution, patient)
    }
  }

  private static getSpecialConsiderations(season: string, constitution: string, patient: EnhancedPatient): string[] {
    const considerations = []

    // Add constitution-specific considerations
    if (constitution.includes('vata')) {
      considerations.push('Focus on grounding and nourishing foods')
      considerations.push('Maintain regular meal timings')
    }
    if (constitution.includes('pitta')) {
      considerations.push('Avoid excessive heat and spice')
      considerations.push('Include cooling elements in diet')
    }
    if (constitution.includes('kapha')) {
      considerations.push('Emphasize light and warming foods')
      considerations.push('Avoid heavy and cold preparations')
    }

    // Add seasonal considerations
    if (season === 'summer') {
      considerations.push('Increase fluid intake significantly')
      considerations.push('Avoid outdoor activities during peak heat')
    }
    if (season === 'monsoon') {
      considerations.push('Maintain strong digestive fire')
      considerations.push('Avoid raw and cold foods completely')
    }
    if (season === 'winter') {
      considerations.push('Include more warming foods and spices')
      considerations.push('Maintain body warmth and energy')
    }

    // Add patient-specific considerations
    if (patient.currentSymptoms.length > 0) {
      considerations.push('Adjust recommendations based on current symptoms')
    }
    if (patient.digestiveStrength === 'weak') {
      considerations.push('Focus on easily digestible preparations')
    }

    return considerations
  }

  static getSeasonalTransitionGuidance(
    fromSeason: string,
    toSeason: string,
    patient: EnhancedPatient
  ) {
    return {
      transitionPeriod: '15 days',
      gradualChanges: [
        'Slowly introduce seasonal foods',
        'Adjust meal timings gradually',
        'Modify exercise routine progressively',
        'Change lifestyle practices slowly'
      ],
      keyFocus: `Transition from ${fromSeason} to ${toSeason} practices`,
      warnings: [
        'Avoid sudden dietary changes',
        'Monitor body\'s response to new foods',
        'Maintain digestive strength during transition'
      ]
    }
  }
}