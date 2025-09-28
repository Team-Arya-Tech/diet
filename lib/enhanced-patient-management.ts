export interface EnhancedPatient {
  id: string
  name: string
  age: number
  gender: 'male' | 'female' | 'other'
  email?: string
  phone?: string
  address?: string
  
  // Basic Ayurvedic Info
  constitution: 'vata' | 'pitta' | 'kapha' | 'vata-pitta' | 'pitta-kapha' | 'vata-kapha' | 'tridoshic'
  currentImbalance?: string[]
  
  // Enhanced Health Parameters
  mealFrequency: number // meals per day
  bowelMovements: 'regular' | 'irregular' | 'constipated' | 'loose'
  waterIntake: number // liters per day
  
  sleepPattern: {
    bedTime: string // "22:00"
    wakeTime: string // "06:00"
    quality: 'excellent' | 'good' | 'fair' | 'poor'
    duration: number // hours
  }
  
  // Menstrual Health (for females)
  menstrualCycle?: {
    regular: boolean
    lastPeriod?: Date
    cycleLength?: number // days
    flow: 'light' | 'moderate' | 'heavy'
    symptoms?: string[]
  }
  
  // Physical Parameters
  height: number // cm
  weight: number // kg
  bmi?: number
  bloodPressure?: {
    systolic: number
    diastolic: number
    date: Date
  }
  
  // Lifestyle Factors
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active'
  stressLevel: 1 | 2 | 3 | 4 | 5 // 1=very low, 5=very high
  smokingStatus: 'never' | 'former' | 'current'
  alcoholConsumption: 'never' | 'occasional' | 'moderate' | 'heavy'
  
  // Digestive Health
  digestiveStrength: 'weak' | 'variable' | 'strong'
  foodPreferences: string[]
  foodAllergies: string[]
  foodIntolerances: string[]
  
  // Current Health Status
  currentSymptoms: string[]
  chronicConditions: string[]
  medications: Array<{
    name: string
    dosage: string
    frequency: string
    startDate: Date
  }>
  
  // Ayurvedic Assessment
  pulseReading?: {
    vata: number // 1-10 scale
    pitta: number
    kapha: number
    date: Date
    notes?: string
  }
  
  tongueExamination?: {
    color: string
    coating: string
    texture: string
    date: Date
  }
  
  // Goals and Preferences
  healthGoals: string[]
  dietaryRestrictions: string[]
  culturalPreferences: string[]
  
  // Timestamps
  createdAt: Date
  updatedAt: Date
  lastConsultation?: Date
  
  // Status
  status: 'active' | 'inactive' | 'archived'
  activeDietPlan?: string // reference to diet plan
  adherenceScore?: number // 0-100
}

export interface PatientVitals {
  id: string
  patientId: string
  date: Date
  weight: number
  bloodPressure: {
    systolic: number
    diastolic: number
  }
  pulseRate: number
  temperature: number
  notes?: string
}

export interface ConsultationRecord {
  id: string
  patientId: string
  date: Date
  duration: number // minutes
  chiefComplaint: string
  symptoms: string[]
  assessment: string
  recommendations: string[]
  prescriptions?: Array<{
    medicine: string
    dosage: string
    duration: string
    instructions: string
  }>
  followUpDate?: Date
  consultationType: 'initial' | 'follow-up' | 'emergency'
  fees?: number
}

// Enhanced patient management functions
export class EnhancedPatientService {
  private static readonly STORAGE_KEY = 'enhanced_patients'
  private static readonly VITALS_KEY = 'patient_vitals'
  private static readonly CONSULTATIONS_KEY = 'consultations'

  // Patient Management
  static savePatient(patient: EnhancedPatient): void {
    const patients = this.getAllPatients()
    const existingIndex = patients.findIndex(p => p.id === patient.id)
    
    patient.updatedAt = new Date()
    if (patient.height && patient.weight) {
      patient.bmi = this.calculateBMI(patient.weight, patient.height)
    }
    
    if (existingIndex >= 0) {
      patients[existingIndex] = patient
    } else {
      patient.createdAt = new Date()
      patients.push(patient)
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(patients))
  }

  static getAllPatients(): EnhancedPatient[] {
    const stored = localStorage.getItem(this.STORAGE_KEY)
    if (!stored) return []
    
    return JSON.parse(stored).map((p: any) => ({
      ...p,
      createdAt: new Date(p.createdAt),
      updatedAt: new Date(p.updatedAt),
      lastConsultation: p.lastConsultation ? new Date(p.lastConsultation) : undefined,
      menstrualCycle: p.menstrualCycle ? {
        ...p.menstrualCycle,
        lastPeriod: p.menstrualCycle.lastPeriod ? new Date(p.menstrualCycle.lastPeriod) : undefined
      } : undefined
    }))
  }

  static getPatientById(id: string): EnhancedPatient | null {
    const patients = this.getAllPatients()
    return patients.find(p => p.id === id) || null
  }

  static deletePatient(id: string): void {
    const patients = this.getAllPatients().filter(p => p.id !== id)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(patients))
  }

  // Health Metrics
  static calculateBMI(weight: number, height: number): number {
    const heightInMeters = height / 100
    return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10
  }

  static getBMICategory(bmi: number): string {
    if (bmi < 18.5) return 'Underweight'
    if (bmi < 25) return 'Normal'
    if (bmi < 30) return 'Overweight'
    return 'Obese'
  }

  static calculateAge(birthDate: Date): number {
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    
    return age
  }

  // Vital Signs Management
  static saveVitals(vitals: PatientVitals): void {
    const allVitals = this.getAllVitals()
    allVitals.push(vitals)
    localStorage.setItem(this.VITALS_KEY, JSON.stringify(allVitals))
  }

  static getAllVitals(): PatientVitals[] {
    const stored = localStorage.getItem(this.VITALS_KEY)
    if (!stored) return []
    
    return JSON.parse(stored).map((v: any) => ({
      ...v,
      date: new Date(v.date)
    }))
  }

  static getPatientVitals(patientId: string): PatientVitals[] {
    return this.getAllVitals()
      .filter(v => v.patientId === patientId)
      .sort((a, b) => b.date.getTime() - a.date.getTime())
  }

  // Consultation Management
  static saveConsultation(consultation: ConsultationRecord): void {
    const consultations = this.getAllConsultations()
    consultations.push(consultation)
    localStorage.setItem(this.CONSULTATIONS_KEY, JSON.stringify(consultations))
    
    // Update patient's last consultation date
    const patient = this.getPatientById(consultation.patientId)
    if (patient) {
      patient.lastConsultation = consultation.date
      this.savePatient(patient)
    }
  }

  static getAllConsultations(): ConsultationRecord[] {
    const stored = localStorage.getItem(this.CONSULTATIONS_KEY)
    if (!stored) return []
    
    return JSON.parse(stored).map((c: any) => ({
      ...c,
      date: new Date(c.date),
      followUpDate: c.followUpDate ? new Date(c.followUpDate) : undefined
    }))
  }

  static getPatientConsultations(patientId: string): ConsultationRecord[] {
    return this.getAllConsultations()
      .filter(c => c.patientId === patientId)
      .sort((a, b) => b.date.getTime() - a.date.getTime())
  }

  // Analytics and Insights
  static getPatientStats() {
    const patients = this.getAllPatients()
    const consultations = this.getAllConsultations()
    
    return {
      totalPatients: patients.length,
      activePatients: patients.filter(p => p.status === 'active').length,
      constitutionDistribution: this.getConstitutionDistribution(patients),
      averageAge: Math.round(patients.reduce((sum, p) => sum + p.age, 0) / patients.length),
      consultationsThisMonth: consultations.filter(c => {
        const now = new Date()
        const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1)
        return c.date >= monthAgo
      }).length,
      adherenceScores: patients
        .filter(p => p.adherenceScore !== undefined)
        .map(p => p.adherenceScore!)
    }
  }

  private static getConstitutionDistribution(patients: EnhancedPatient[]) {
    const distribution: Record<string, number> = {}
    patients.forEach(p => {
      distribution[p.constitution] = (distribution[p.constitution] || 0) + 1
    })
    return distribution
  }

  // Health Assessment Helpers
  static assessHealthRisk(patient: EnhancedPatient): {
    level: 'low' | 'moderate' | 'high'
    factors: string[]
    recommendations: string[]
  } {
    const factors: string[] = []
    const recommendations: string[] = []
    
    if (patient.bmi && patient.bmi > 30) {
      factors.push('Obesity (BMI > 30)')
      recommendations.push('Focus on weight management through balanced Ayurvedic diet')
    }
    
    if (patient.stressLevel >= 4) {
      factors.push('High stress levels')
      recommendations.push('Incorporate stress-reducing practices like yoga and meditation')
    }
    
    if (patient.sleepPattern.quality === 'poor') {
      factors.push('Poor sleep quality')
      recommendations.push('Establish regular sleep routine following Ayurvedic principles')
    }
    
    if (patient.smokingStatus === 'current') {
      factors.push('Current smoking')
      recommendations.push('Consider smoking cessation with Ayurvedic support')
    }
    
    const riskLevel = factors.length >= 3 ? 'high' : factors.length >= 1 ? 'moderate' : 'low'
    
    return {
      level: riskLevel,
      factors,
      recommendations
    }
  }

  static generatePatientSummary(patient: EnhancedPatient): string {
    const consultations = this.getPatientConsultations(patient.id)
    const vitals = this.getPatientVitals(patient.id)
    const riskAssessment = this.assessHealthRisk(patient)
    
    return `
      Patient: ${patient.name} (${patient.age} years, ${patient.gender})
      Constitution: ${patient.constitution}
      BMI: ${patient.bmi || 'Not calculated'}
      Risk Level: ${riskAssessment.level}
      Total Consultations: ${consultations.length}
      Last Vital Check: ${vitals[0]?.date.toLocaleDateString() || 'Never'}
      Current Symptoms: ${patient.currentSymptoms.join(', ') || 'None reported'}
      Health Goals: ${patient.healthGoals.join(', ') || 'Not specified'}
    `
  }
}