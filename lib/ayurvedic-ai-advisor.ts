import { EnhancedPatient } from './enhanced-patient-management'
import { EnhancedFood } from './enhanced-food-database'
import { TasteAnalysis, SixTastesAnalyzer } from './six-tastes-analyzer'

export interface AyurvedicAdvice {
  id: string
  patientId: string
  timestamp: Date
  
  // Assessment Results
  constitutionalAssessment: {
    primaryDosha: string
    secondaryDosha?: string
    currentImbalance: string[]
    balanceScore: number // 0-100
  }
  
  // Personalized Recommendations
  dietaryRecommendations: {
    foodsToInclude: string[]
    foodsToAvoid: string[]
    mealTiming: string[]
    seasonalAdjustments: string[]
    cookingMethods: string[]
  }
  
  lifestyleRecommendations: {
    dailyRoutine: string[]
    exerciseRecommendations: string[]
    sleepOptimization: string[]
    stressManagement: string[]
    seasonalPractices: string[]
  }
  
  // Specific Interventions
  herbalRecommendations: Array<{
    herb: string
    dosage: string
    duration: string
    purpose: string
    contraindications?: string[]
  }>
  
  yogaAndBreathing: Array<{
    practice: string
    duration: string
    frequency: string
    benefits: string[]
  }>
  
  // Symptom-Specific Advice
  symptomManagement: Array<{
    symptom: string
    severity: 'mild' | 'moderate' | 'severe'
    interventions: string[]
    timeline: string
  }>
  
  // Warnings and Precautions
  warnings: string[]
  followUpRecommendations: string[]
  
  // Confidence and Sources
  confidenceLevel: number // 0-100
  aiInsights: string[]
  traditionalReferences: string[]
}

export interface SymptomAnalysis {
  symptom: string
  possibleCauses: string[]
  doshaImplication: string
  severity: 'mild' | 'moderate' | 'severe'
  urgency: 'low' | 'medium' | 'high'
  recommendations: string[]
}

export class AyurvedicAIAdvisor {
  private static readonly ADVICE_STORAGE_KEY = 'ayurvedic_advice_history'
  
  // Main advice generation function
  static async generatePersonalizedAdvice(patient: EnhancedPatient): Promise<AyurvedicAdvice> {
    const advice: AyurvedicAdvice = {
      id: `advice_${Date.now()}`,
      patientId: patient.id,
      timestamp: new Date(),
      constitutionalAssessment: this.assessConstitution(patient),
      dietaryRecommendations: this.generateDietaryRecommendations(patient),
      lifestyleRecommendations: this.generateLifestyleRecommendations(patient),
      herbalRecommendations: this.generateHerbalRecommendations(patient),
      yogaAndBreathing: this.generateYogaRecommendations(patient),
      symptomManagement: this.analyzeSymptoms(patient),
      warnings: this.generateWarnings(patient),
      followUpRecommendations: this.generateFollowUpRecommendations(patient),
      confidenceLevel: this.calculateConfidenceLevel(patient),
      aiInsights: this.generateAIInsights(patient),
      traditionalReferences: this.getTraditionalReferences(patient.constitution)
    }
    
    // Save advice to history
    this.saveAdviceToHistory(advice)
    
    return advice
  }

  // Constitutional assessment
  private static assessConstitution(patient: EnhancedPatient) {
    const constitution = patient.constitution
    const symptoms = patient.currentSymptoms
    const lifestyle = {
      stress: patient.stressLevel,
      sleep: patient.sleepPattern.quality,
      digestion: patient.digestiveStrength,
      activity: patient.activityLevel
    }

    // Calculate current imbalance based on symptoms and lifestyle
    const imbalances: string[] = []
    
    // Vata imbalance indicators
    if (symptoms.includes('anxiety') || symptoms.includes('insomnia') || 
        lifestyle.stress >= 4 || patient.bowelMovements === 'irregular') {
      imbalances.push('vata-excess')
    }
    
    // Pitta imbalance indicators
    if (symptoms.includes('acidity') || symptoms.includes('anger') ||
        symptoms.includes('inflammation') || lifestyle.stress >= 4) {
      imbalances.push('pitta-excess')
    }
    
    // Kapha imbalance indicators
    if (symptoms.includes('weight-gain') || symptoms.includes('lethargy') ||
        patient.activityLevel === 'sedentary' || patient.bmi && patient.bmi > 25) {
      imbalances.push('kapha-excess')
    }

    // Calculate balance score
    const balanceScore = this.calculateBalanceScore(patient, imbalances)

    return {
      primaryDosha: constitution.split('-')[0],
      secondaryDosha: constitution.includes('-') ? constitution.split('-')[1] : undefined,
      currentImbalance: imbalances,
      balanceScore
    }
  }

  // Dietary recommendations
  private static generateDietaryRecommendations(patient: EnhancedPatient) {
    const constitution = patient.constitution
    const currentSymptoms = patient.currentSymptoms
    const digestiveStrength = patient.digestiveStrength
    
    let foodsToInclude: string[] = []
    let foodsToAvoid: string[] = []
    let mealTiming: string[] = []
    let cookingMethods: string[] = []

    // Base recommendations by constitution
    switch (constitution.split('-')[0]) {
      case 'vata':
        foodsToInclude = [
          'Warm, cooked foods', 'Sweet fruits like dates and figs', 'Healthy fats like ghee and olive oil',
          'Warm spices like ginger and cinnamon', 'Grounding grains like rice and oats'
        ]
        foodsToAvoid = [
          'Cold, raw foods', 'Dry and rough foods', 'Excessive bitter and astringent tastes',
          'Carbonated drinks', 'Irregular meal times'
        ]
        mealTiming = [
          'Eat at regular times', 'Largest meal at midday', 'Light dinner before 7 PM',
          'Avoid skipping meals', 'Eat in calm environment'
        ]
        cookingMethods = ['Steaming', 'Sautéing with ghee', 'Slow cooking', 'Warm preparations']
        break
        
      case 'pitta':
        foodsToInclude = [
          'Cooling foods like cucumber and coconut', 'Sweet and bitter tastes', 'Fresh fruits',
          'Leafy greens', 'Cooling spices like coriander and fennel'
        ]
        foodsToAvoid = [
          'Spicy and hot foods', 'Excessive sour and salty foods', 'Fried foods',
          'Alcohol and caffeine', 'Eating when angry or stressed'
        ]
        mealTiming = [
          'Regular meal times', 'Substantial breakfast', 'Largest meal at lunch',
          'Light dinner', 'Avoid late night eating'
        ]
        cookingMethods = ['Steaming', 'Boiling', 'Raw preparations', 'Minimal oil']
        break
        
      case 'kapha':
        foodsToInclude = [
          'Light and warm foods', 'Pungent, bitter, and astringent tastes', 'Spices like turmeric and black pepper',
          'Leafy greens and cruciferous vegetables', 'Legumes and beans'
        ]
        foodsToAvoid = [
          'Heavy and oily foods', 'Excessive sweet and salty foods', 'Dairy products',
          'Cold foods and drinks', 'Overeating'
        ]
        mealTiming = [
          'Skip breakfast or have light breakfast', 'Largest meal at midday',
          'Early light dinner', 'Avoid snacking', 'Fast occasionally'
        ]
        cookingMethods = ['Grilling', 'Roasting', 'Stir-frying', 'Minimal oil']
        break
    }

    // Adjust for digestive strength
    if (digestiveStrength === 'weak') {
      cookingMethods = ['Steaming', 'Slow cooking', 'Well-cooked preparations']
      foodsToAvoid.push('Raw foods', 'Heavy proteins', 'Complex combinations')
    }

    // Seasonal adjustments
    const currentSeason = this.getCurrentSeason()
    const seasonalAdjustments = this.getSeasonalAdjustments(constitution, currentSeason)

    return {
      foodsToInclude,
      foodsToAvoid,
      mealTiming,
      seasonalAdjustments,
      cookingMethods
    }
  }

  // Lifestyle recommendations
  private static generateLifestyleRecommendations(patient: EnhancedPatient) {
    const constitution = patient.constitution
    const stressLevel = patient.stressLevel
    const sleepQuality = patient.sleepPattern.quality
    const activityLevel = patient.activityLevel

    let dailyRoutine: string[] = []
    let exerciseRecommendations: string[] = []
    let sleepOptimization: string[] = []
    let stressManagement: string[] = []

    // Base recommendations by constitution
    switch (constitution.split('-')[0]) {
      case 'vata':
        dailyRoutine = [
          'Wake up between 5:30-6:30 AM', 'Start day with warm water and lemon',
          'Oil massage (Abhyanga) before bath', 'Regular meal times',
          'Wind down routine before bed'
        ]
        exerciseRecommendations = [
          'Gentle yoga and stretching', 'Walking in nature', 'Swimming',
          'Avoid excessive cardio', 'Focus on grounding exercises'
        ]
        sleepOptimization = [
          'Sleep by 10 PM', 'Warm bath before bed', 'Avoid screens 1 hour before bed',
          'Chamomile tea', 'Consistent sleep schedule'
        ]
        stressManagement = [
          'Meditation and pranayama', 'Gentle music', 'Journaling',
          'Avoid overstimulation', 'Regular oil massage'
        ]
        break
        
      case 'pitta':
        dailyRoutine = [
          'Wake up between 5:00-6:00 AM', 'Cool shower in morning',
          'Substantial breakfast', 'Avoid midday sun', 'Cool evening activities'
        ]
        exerciseRecommendations = [
          'Moderate intensity exercise', 'Swimming', 'Cycling',
          'Morning or evening workouts', 'Avoid competitive sports'
        ]
        sleepOptimization = [
          'Sleep by 10 PM', 'Cool, dark room', 'Avoid late meals',
          'Coconut oil on scalp', 'Cool bedtime routine'
        ]
        stressManagement = [
          'Cooling pranayama', 'Nature walks', 'Avoid anger triggers',
          'Practice patience', 'Cool environment'
        ]
        break
        
      case 'kapha':
        dailyRoutine = [
          'Wake up by 6 AM', 'Energizing morning routine', 'Light breakfast or skip',
          'Active daytime', 'Early dinner'
        ]
        exerciseRecommendations = [
          'Vigorous exercise', 'Cardio workouts', 'Weight training',
          'Morning exercise', 'Variety in routine'
        ]
        sleepOptimization = [
          'Sleep by 10 PM', 'Wake up early', 'Avoid daytime naps',
          'Energizing morning routine', 'Consistent schedule'
        ]
        stressManagement = [
          'Energizing pranayama', 'Social activities', 'New experiences',
          'Avoid isolation', 'Active hobbies'
        ]
        break
    }

    // Adjustments based on current state
    if (stressLevel >= 4) {
      stressManagement.push('Consider professional counseling', 'Increase meditation time', 'Reduce workload if possible')
    }

    if (sleepQuality === 'poor') {
      sleepOptimization.push('Avoid caffeine after 2 PM', 'Create sleep sanctuary', 'Consider herbal sleep aids')
    }

    const seasonalPractices = this.getSeasonalLifestyle(constitution, this.getCurrentSeason())

    return {
      dailyRoutine,
      exerciseRecommendations,
      sleepOptimization,
      stressManagement,
      seasonalPractices
    }
  }

  // Herbal recommendations
  private static generateHerbalRecommendations(patient: EnhancedPatient) {
    const constitution = patient.constitution
    const symptoms = patient.currentSymptoms
    const digestiveStrength = patient.digestiveStrength

    const recommendations = []

    // Base constitutional herbs
    switch (constitution.split('-')[0]) {
      case 'vata':
        recommendations.push({
          herb: 'Ashwagandha',
          dosage: '500mg twice daily',
          duration: '3 months',
          purpose: 'Stress reduction and nervous system support',
          contraindications: ['Pregnancy', 'Autoimmune conditions']
        })
        break
        
      case 'pitta':
        recommendations.push({
          herb: 'Amalaki (Amla)',
          dosage: '1 tsp powder daily',
          duration: '2-3 months',
          purpose: 'Cooling and detoxification',
          contraindications: ['Excessive acidity (in some cases)']
        })
        break
        
      case 'kapha':
        recommendations.push({
          herb: 'Turmeric',
          dosage: '1 tsp with warm milk',
          duration: 'Daily as needed',
          purpose: 'Anti-inflammatory and metabolism boost',
          contraindications: ['Blood thinning medications', 'Gallstones']
        })
        break
    }

    // Digestive support
    if (digestiveStrength === 'weak') {
      recommendations.push({
        herb: 'Ginger',
        dosage: 'Fresh ginger tea before meals',
        duration: 'Daily',
        purpose: 'Digestive fire enhancement',
        contraindications: ['Excessive pitta', 'Ulcers']
      })
    }

    // Symptom-specific herbs
    if (symptoms.includes('anxiety')) {
      recommendations.push({
        herb: 'Brahmi',
        dosage: '300mg twice daily',
        duration: '6-8 weeks',
        purpose: 'Mental clarity and anxiety reduction'
      })
    }

    return recommendations
  }

  // Yoga and breathing recommendations  
  private static generateYogaRecommendations(patient: EnhancedPatient) {
    const constitution = patient.constitution
    const stressLevel = patient.stressLevel
    const activityLevel = patient.activityLevel

    const recommendations = []

    // Constitutional yoga practices
    switch (constitution.split('-')[0]) {
      case 'vata':
        recommendations.push({
          practice: 'Gentle Hatha Yoga',
          duration: '30-45 minutes',
          frequency: '4-5 times per week',
          benefits: ['Grounding', 'Flexibility', 'Nervous system calming']
        })
        recommendations.push({
          practice: 'Nadi Shodhana (Alternate Nostril Breathing)',
          duration: '10 minutes',
          frequency: 'Daily',
          benefits: ['Balance nervous system', 'Reduce anxiety', 'Mental clarity']
        })
        break
        
      case 'pitta':
        recommendations.push({
          practice: 'Cooling Yoga Flow',
          duration: '45 minutes',
          frequency: '3-4 times per week',
          benefits: ['Cooling effect', 'Stress reduction', 'Flexibility']
        })
        recommendations.push({
          practice: 'Sheetali Pranayama (Cooling Breath)',
          duration: '5-10 minutes',
          frequency: 'Daily, especially in summer',
          benefits: ['Body cooling', 'Pitta pacification', 'Mental calmness']
        })
        break
        
      case 'kapha':
        recommendations.push({
          practice: 'Dynamic Vinyasa Yoga',
          duration: '60 minutes',
          frequency: '5-6 times per week',
          benefits: ['Energy boost', 'Weight management', 'Circulation']
        })
        recommendations.push({
          practice: 'Bhastrika Pranayama (Bellows Breath)',
          duration: '5-10 minutes',
          frequency: 'Daily morning',
          benefits: ['Energy increase', 'Metabolism boost', 'Mental alertness']
        })
        break
    }

    // Stress-specific additions
    if (stressLevel >= 4) {
      recommendations.push({
        practice: 'Yoga Nidra (Yogic Sleep)',
        duration: '20-30 minutes',
        frequency: 'Daily before bed',
        benefits: ['Deep relaxation', 'Stress relief', 'Better sleep']
      })
    }

    return recommendations
  }

  // Symptom analysis
  private static analyzeSymptoms(patient: EnhancedPatient): Array<{
    symptom: string
    severity: 'mild' | 'moderate' | 'severe'
    interventions: string[]
    timeline: string
  }> {
    const symptoms = patient.currentSymptoms
    const constitution = patient.constitution

    return symptoms.map(symptom => {
      const analysis = this.getSymptomAnalysis(symptom, constitution)
      return {
        symptom,
        severity: analysis.severity,
        interventions: analysis.recommendations,
        timeline: this.getExpectedTimeline(symptom, analysis.severity)
      }
    })
  }

  // Helper methods
  private static calculateBalanceScore(patient: EnhancedPatient, imbalances: string[]): number {
    let score = 100
    
    // Deduct points for various imbalance indicators
    score -= imbalances.length * 15
    score -= patient.stressLevel * 5
    score -= patient.currentSymptoms.length * 3
    
    if (patient.sleepPattern.quality === 'poor') score -= 10
    if (patient.bowelMovements !== 'regular') score -= 8
    if (patient.digestiveStrength === 'weak') score -= 10
    
    return Math.max(0, Math.min(100, score))
  }

  private static getCurrentSeason(): string {
    const month = new Date().getMonth() + 1
    if (month >= 3 && month <= 5) return 'spring'
    if (month >= 6 && month <= 8) return 'summer'
    if (month >= 9 && month <= 11) return 'autumn'
    return 'winter'
  }

  private static getSeasonalAdjustments(constitution: string, season: string): string[] {
    const adjustments: Record<string, Record<string, string[]>> = {
      'vata': {
        'winter': ['Increase warm foods', 'More oil in diet', 'Avoid cold drinks'],
        'summer': ['Stay hydrated', 'Moderate cooling foods', 'Avoid excessive heat'],
        'spring': ['Light detox', 'Reduce heavy foods', 'Increase bitter tastes'],
        'autumn': ['Grounding foods', 'Regular routine', 'Warm preparations']
      },
      'pitta': {
        'summer': ['Maximize cooling foods', 'Avoid hot spices', 'Stay in shade'],
        'winter': ['Moderate warming', 'Include sweet tastes', 'Warm oil massage'],
        'spring': ['Gentle detox', 'Bitter greens', 'Moderate exercise'],
        'autumn': ['Balance warmth and coolness', 'Sweet fruits', 'Regular routine']
      },
      'kapha': {
        'spring': ['Deep detox', 'Pungent foods', 'Increase activity'],
        'winter': ['Light, warm foods', 'Avoid dairy', 'Stay active indoors'],
        'summer': ['Light meals', 'Bitter vegetables', 'Cooling exercise'],
        'autumn': ['Warming spices', 'Cooked foods', 'Regular routine']
      }
    }
    
    return adjustments[constitution.split('-')[0]]?.[season] || []
  }

  private static getSeasonalLifestyle(constitution: string, season: string): string[] {
    // Similar structure to seasonal adjustments but for lifestyle
    return [`Adjust daily routine for ${season}`, `Follow ${constitution} seasonal guidelines`]
  }

  private static getSymptomAnalysis(symptom: string, constitution: string): SymptomAnalysis {
    // Comprehensive symptom analysis database
    const symptomDatabase: Record<string, Omit<SymptomAnalysis, 'symptom'>> = {
      'anxiety': {
        possibleCauses: ['Vata imbalance', 'Excessive stimulation', 'Irregular routine'],
        doshaImplication: 'Primarily Vata excess',
        severity: 'moderate',
        urgency: 'medium',
        recommendations: ['Regular routine', 'Calming practices', 'Grounding foods']
      },
      'acidity': {
        possibleCauses: ['Pitta imbalance', 'Spicy foods', 'Stress', 'Irregular meals'],
        doshaImplication: 'Primarily Pitta excess',
        severity: 'moderate',
        urgency: 'medium',
        recommendations: ['Cooling foods', 'Avoid spicy foods', 'Regular meal times']
      }
      // Add more symptoms as needed
    }

    return {
      symptom,
      ...(symptomDatabase[symptom] || {
        possibleCauses: ['Requires detailed consultation'],
        doshaImplication: 'Multiple doshas may be involved',
        severity: 'mild',
        urgency: 'low',
        recommendations: ['Consult Ayurvedic practitioner']
      })
    }
  }

  private static getExpectedTimeline(symptom: string, severity: string): string {
    const timelineMap: Record<string, Record<string, string>> = {
      'mild': { default: '2-4 weeks' },
      'moderate': { default: '4-8 weeks' },
      'severe': { default: '8-12 weeks or longer' }
    }
    
    return timelineMap[severity]?.default || '4-6 weeks'
  }

  private static generateWarnings(patient: EnhancedPatient): string[] {
    const warnings: string[] = []
    
    if (patient.chronicConditions.length > 0) {
      warnings.push('Consult healthcare provider before making major dietary changes')
    }
    
    if (patient.medications && patient.medications.length > 0) {
      warnings.push('Some herbs may interact with medications - consult practitioner')
    }
    
    if (patient.stressLevel >= 4) {
      warnings.push('High stress levels may require professional support')
    }
    
    return warnings
  }

  private static generateFollowUpRecommendations(patient: EnhancedPatient): string[] {
    return [
      'Schedule follow-up consultation in 4-6 weeks',
      'Track symptoms and energy levels daily',
      'Monitor sleep quality and digestion',
      'Adjust recommendations based on seasonal changes'
    ]
  }

  private static calculateConfidenceLevel(patient: EnhancedPatient): number {
    let confidence = 85 // Base confidence
    
    // Increase confidence for complete information
    if (patient.constitution && patient.currentSymptoms.length > 0) confidence += 10
    if (patient.digestiveStrength && patient.sleepPattern) confidence += 5
    
    // Decrease for complex cases
    if (patient.chronicConditions.length > 2) confidence -= 15
    if (patient.currentSymptoms.length > 5) confidence -= 10
    
    return Math.max(60, Math.min(95, confidence))
  }

  private static generateAIInsights(patient: EnhancedPatient): string[] {
    const insights: string[] = []
    
    // Pattern recognition insights
    if (patient.stressLevel >= 4 && patient.sleepPattern.quality === 'poor') {
      insights.push('Strong correlation detected between stress and sleep quality - prioritize stress management')
    }
    
    if (patient.digestiveStrength === 'weak' && patient.currentSymptoms.includes('fatigue')) {
      insights.push('Weak digestion may be contributing to fatigue - focus on digestive health')
    }
    
    return insights
  }

  private static getTraditionalReferences(constitution: string): string[] {
    const references: Record<string, string[]> = {
      'vata': [
        'Charaka Samhita - Vata management principles',
        'Ashtanga Hridaya - Daily regimen for Vata constitution'
      ],
      'pitta': [
        'Sushruta Samhita - Pitta pacification methods',
        'Charaka Samhita - Cooling therapies and diet'
      ],
      'kapha': [
        'Charaka Samhita - Kapha reduction strategies',
        'Ashtanga Hridaya - Lightening therapies'
      ]
    }
    
    return references[constitution.split('-')[0]] || []
  }

  // Storage methods
  private static saveAdviceToHistory(advice: AyurvedicAdvice): void {
    const history = this.getAdviceHistory()
    history.push(advice)
    
    // Keep only last 50 advice records
    if (history.length > 50) {
      history.splice(0, history.length - 50)
    }
    
    localStorage.setItem(this.ADVICE_STORAGE_KEY, JSON.stringify(history))
  }

  static getAdviceHistory(): AyurvedicAdvice[] {
    const stored = localStorage.getItem(this.ADVICE_STORAGE_KEY)
    if (!stored) return []
    
    return JSON.parse(stored).map((advice: any) => ({
      ...advice,
      timestamp: new Date(advice.timestamp)
    }))
  }

  static getPatientAdviceHistory(patientId: string): AyurvedicAdvice[] {
    return this.getAdviceHistory()
      .filter(advice => advice.patientId === patientId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }
}