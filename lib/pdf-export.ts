// Professional PDF export service for Ayurvedic diet charts and analytics
import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'
import type { Patient, DietPlan, ProgressRecord } from './database'
import type { EnhancedPatient } from './enhanced-patient-management'
import type { Recipe, MealPlan } from './recipe-intelligence'
// Remove unused import for now

// Extend jsPDF interface to include autoTable
declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => void
  }
}

export interface DietChartPDFData {
  patient: Patient
  dietPlan: DietPlan
  progressData?: ProgressRecord[]
  consultationDate: Date
  practitionerName?: string
  clinicInfo?: {
    name: string
    address: string
    phone: string
    email: string
    license?: string
  }
}

export interface MedicalReportOptions {
  includeNutritionalAnalysis: boolean
  includeAyurvedicGuidelines: boolean
  includeProgressCharts: boolean
  includeRecommendations: boolean
  language: 'en' | 'hi'
  watermark?: string
}

export interface PDFBrandingConfig {
  logoUrl?: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  companyName: string
  tagline: string
  website: string
  contactInfo: {
    email: string
    phone: string
    address: string
  }
}

export const AHAARWISE_BRANDING: PDFBrandingConfig = {
  primaryColor: '#F97316', // Orange-500
  secondaryColor: '#FB923C', // Orange-400
  accentColor: '#FED7AA', // Orange-200
  companyName: 'AhaarWISE',
  tagline: 'Intelligent Ayurvedic Nutrition Management System',
  website: 'www.ahaarwise.com',
  contactInfo: {
    email: 'support@ahaarwise.com',
    phone: '+91-9876-543210',
    address: 'Ayurvedic Healthcare Technology Center, New Delhi, India'
  }
}

export interface WeeklyDietChartData {
  patient: Patient
  weeklyPlan: any[]
  nutritionalSummary?: {
    totalCalories: number
    avgProtein: number
    avgCarbs: number
    avgFat: number
    avgFiber: number
  }
  ayurvedicRecommendations?: {
    constitutionGuidance: string[]
    seasonalTips: string[]
    lifestyleTips: string[]
    herbsAndSpices: string[]
    foodCombinations: string[]
    mealTiming: string[]
  }
  generatedDate: Date
}

export class DietChartPDFExporter {
  private doc: jsPDF
  private currentY: number = 20
  private pageHeight: number = 297 // A4 height in mm
  private pageWidth: number = 210 // A4 width in mm
  private margin: number = 20
  private headerHeight: number = 40
  private footerHeight: number = 20
  private branding: PDFBrandingConfig

  constructor(branding: PDFBrandingConfig = AHAARWISE_BRANDING) {
    this.doc = new jsPDF('p', 'mm', 'a4')
    this.branding = branding
    // Ensure autoTable is available
    this.doc.autoTable = (options: any) => autoTable(this.doc, options)
  }

  private addBrandedHeader(title: string, subtitle?: string, consultationDate?: Date): void {
    // Branded header background
    this.doc.setFillColor(this.branding.primaryColor)
    this.doc.rect(0, 0, this.pageWidth, 35, 'F')
    
    // Company logo placeholder
    this.doc.setFillColor(255, 255, 255)
    this.doc.rect(this.margin, 8, 35, 20, 'F')
    
    // Company name in logo area
    this.doc.setTextColor(this.branding.primaryColor)
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(this.branding.companyName, this.margin + 2, 18)
    
    // Main title
    this.doc.setTextColor(255, 255, 255)
    this.doc.setFontSize(18)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(title, this.margin + 45, 18)
    
    // Subtitle
    if (subtitle) {
      this.doc.setFontSize(11)
      this.doc.setFont('helvetica', 'normal')
      this.doc.text(subtitle, this.margin + 45, 25)
    }
    
    // Date
    if (consultationDate) {
      this.doc.setFontSize(10)
      this.doc.text(`Date: ${consultationDate.toLocaleDateString()}`, this.pageWidth - this.margin - 40, 18)
    }
    
    // Tagline
    this.doc.setFontSize(8)
    this.doc.text(this.branding.tagline, this.pageWidth - this.margin - 70, 25)
    
    this.currentY = 45
  }

  private addFooter(pageNumber: number, totalPages: number): void {
    const footerY = this.pageHeight - 15
    
    // Footer line
    this.doc.setDrawColor(this.branding.secondaryColor)
    this.doc.setLineWidth(0.5)
    this.doc.line(this.margin, footerY - 5, this.pageWidth - this.margin, footerY - 5)
    
    // Contact info
    this.doc.setFontSize(8)
    this.doc.setTextColor(100, 100, 100)
    this.doc.text(`${this.branding.website} | ${this.branding.contactInfo.email} | ${this.branding.contactInfo.phone}`, this.margin, footerY)
    
    // Page number
    this.doc.text(`Page ${pageNumber} of ${totalPages}`, this.pageWidth - this.margin - 20, footerY)
    
    // Generation timestamp
    const timestamp = new Date().toLocaleString()
    this.doc.setFontSize(7)
    this.doc.text(`Generated: ${timestamp}`, this.pageWidth - this.margin - 50, footerY + 5)
  }

  // Original header method for backward compatibility
  private addHeader(consultationDate: Date, clinicInfo?: DietChartPDFData['clinicInfo']): void {
    this.addBrandedHeader('Ayurvedic Diet Chart', undefined, consultationDate)
    // Original header background logic preserved
    this.doc.setFillColor(245, 247, 250)
    this.doc.rect(0, 0, this.pageWidth, this.headerHeight, 'F')

    // Clinic logo placeholder
    this.doc.setFillColor(34, 197, 94)
    this.doc.circle(25, 20, 8, 'F')
    this.doc.setTextColor(255, 255, 255)
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('🌿', 21, 24)

    // Clinic information
    this.doc.setTextColor(0, 0, 0)
    this.doc.setFontSize(16)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(clinicInfo?.name || 'AhaarWISE - Ayurvedic Diet Intelligence System', 40, 18)

    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(clinicInfo?.address || 'Professional Ayurvedic Healthcare', 40, 24)
    this.doc.text(`Phone: ${clinicInfo?.phone || '+91-XXXX-XXXXXX'} | Email: ${clinicInfo?.email || 'info@ahaarwise.com'}`, 40, 29)
    
    if (clinicInfo?.license) {
      this.doc.text(`License: ${clinicInfo.license}`, 40, 34)
    }

    // Date and document type
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFontSize(12)
    this.doc.text('AHAARWISE DIET CHART REPORT', this.pageWidth - 10, 18, { align: 'right' })
    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(10)
    this.doc.text(`Date: ${consultationDate.toLocaleDateString('en-IN')}`, this.pageWidth - 10, 24, { align: 'right' })
    this.doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, this.pageWidth - 10, 29, { align: 'right' })

    // Separator line
    this.doc.setDrawColor(200, 200, 200)
    this.doc.line(this.margin, this.headerHeight - 5, this.pageWidth - this.margin, this.headerHeight - 5)

    this.currentY = this.headerHeight + 10
  }

  private addLegacyFooter(pageNumber: number): void {
    const footerY = this.pageHeight - this.footerHeight

    // Footer line
    this.doc.setDrawColor(200, 200, 200)
    this.doc.line(this.margin, footerY, this.pageWidth - this.margin, footerY)

    // Footer content
    this.doc.setFontSize(8)
    this.doc.setFont('helvetica', 'normal')
    this.doc.setTextColor(100, 100, 100)
    
    this.doc.text('This diet chart is prepared based on Ayurvedic principles. Please consult your healthcare provider before making significant dietary changes.', 
      this.pageWidth / 2, footerY + 8, { align: 'center' })
    
    this.doc.text(`Page ${pageNumber}`, this.pageWidth - this.margin, footerY + 8, { align: 'right' })
    this.doc.text('Confidential Medical Document', this.margin, footerY + 8)
    
    // QR Code placeholder for digital verification
    this.doc.setFillColor(240, 240, 240)
    this.doc.rect(this.margin, footerY + 12, 10, 10, 'F')
    this.doc.setFontSize(6)
    this.doc.text('QR', this.margin + 3, footerY + 18)
  }

  private addPatientInformation(patient: Patient): void {
    this.addSectionTitle('PATIENT INFORMATION')

    // Patient details in a professional layout
    const patientData: string[][] = [
      ['Name:', patient.name, 'Age:', `${patient.age} years`],
      ['Gender:', patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1), 'Constitution:', patient.constitution.toUpperCase()],
      ['Weight:', `${patient.weight} kg`, 'Height:', `${patient.height} cm`],
      ['BMI:', patient.bmi?.toString() || 'Not calculated', 'Activity Level:', patient.lifestyle.activityLevel.replace('-', ' ').toUpperCase()],
      ['Phone:', patient.contactInfo?.phone || 'Not provided', 'Email:', patient.contactInfo?.email || 'Not provided']
    ]

    this.doc.autoTable({
      startY: this.currentY,
      head: [],
      body: patientData,
      theme: 'plain',
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 25 },
        1: { cellWidth: 45 },
        2: { fontStyle: 'bold', cellWidth: 25 },
        3: { cellWidth: 45 }
      },
      margin: { left: this.margin, right: this.margin },
      didDrawPage: (data: any) => {
        this.currentY = data.cursor?.y || this.currentY
      }
    })

    this.currentY += 10

    // Health conditions and dietary restrictions
    if (patient.currentConditions.length > 0 || patient.dietaryRestrictions.length > 0) {
      const healthData = []
      
      if (patient.currentConditions.length > 0) {
        healthData.push(['Current Health Conditions:', patient.currentConditions.join(', ')])
      }
      
      if (patient.dietaryRestrictions.length > 0) {
        healthData.push(['Dietary Restrictions:', patient.dietaryRestrictions.join(', ')])
      }
      
      if (patient.allergies && patient.allergies.length > 0) {
        healthData.push(['Allergies:', patient.allergies.join(', ')])
      }

      this.doc.autoTable({
        startY: this.currentY,
        head: [],
        body: healthData,
        theme: 'striped',
        styles: {
          fontSize: 9,
          cellPadding: 4,
        },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 40 },
          1: { cellWidth: 130 }
        },
        margin: { left: this.margin, right: this.margin },
        didDrawPage: (data: any) => {
          this.currentY = data.cursor?.y || this.currentY
        }
      })

      this.currentY += 10
    }
  }

  private addDietPlanDetails(dietPlan: DietPlan): void {
    this.addSectionTitle('PERSONALIZED DIET PLAN')

    // Plan overview
    const planOverview = [
      ['Plan Name:', dietPlan.planName],
      ['Duration:', `${dietPlan.duration} days`],
      ['Target Calories:', `${dietPlan.targetCalories} kcal/day`],
      ['Start Date:', dietPlan.startDate.toLocaleDateString('en-IN')],
      ['End Date:', dietPlan.endDate?.toLocaleDateString('en-IN') || 'Ongoing'],
      ['Status:', dietPlan.isActive ? 'ACTIVE' : 'INACTIVE']
    ]

    this.doc.autoTable({
      startY: this.currentY,
      head: [],
      body: planOverview,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 4,
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 35, fillColor: [248, 250, 252] },
        1: { cellWidth: 135 }
      },
      margin: { left: this.margin, right: this.margin },
      didDrawPage: (data: any) => {
        this.currentY = data.cursor?.y || this.currentY
      }
    })

    this.currentY += 15

    // Daily meal plans
    this.addSubsectionTitle('DAILY MEAL PLAN')

    const mealPlanData: any[][] = []
    const dayNumbers = Object.keys(dietPlan.dailyMeals).slice(0, 7) // Show first 7 days

    dayNumbers.forEach(dayNum => {
      const dayMeals = dietPlan.dailyMeals[parseInt(dayNum)]
      
      mealPlanData.push([`Day ${dayNum}`, '', '', ''])
      
      if (dayMeals.breakfast) {
        mealPlanData.push(['', 'Breakfast', dayMeals.breakfast.recipes.join(', '), dayMeals.breakfast.notes || ''])
      }
      
      if (dayMeals.lunch) {
        mealPlanData.push(['', 'Lunch', dayMeals.lunch.recipes.join(', '), dayMeals.lunch.notes || ''])
      }
      
      if (dayMeals.dinner) {
        mealPlanData.push(['', 'Dinner', dayMeals.dinner.recipes.join(', '), dayMeals.dinner.notes || ''])
      }
      
      if (dayMeals.midMorning) {
        mealPlanData.push(['', 'Mid-Morning', dayMeals.midMorning.recipes.join(', '), dayMeals.midMorning.notes || ''])
      }
      
      if (dayMeals.midAfternoon) {
        mealPlanData.push(['', 'Mid-Afternoon', dayMeals.midAfternoon.recipes.join(', '), dayMeals.midAfternoon.notes || ''])
      }
    })

    this.doc.autoTable({
      startY: this.currentY,
      head: [['Day', 'Meal', 'Foods/Recipes', 'Notes']],
      body: mealPlanData,
      theme: 'striped',
      styles: {
        fontSize: 8,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 15, fontStyle: 'bold' },
        1: { cellWidth: 25, fontStyle: 'bold' },
        2: { cellWidth: 80 },
        3: { cellWidth: 50, fontSize: 7 }
      },
      margin: { left: this.margin, right: this.margin },
      didDrawPage: (data: any) => {
        this.currentY = data.cursor?.y || this.currentY
      }
    })

    this.currentY += 10
  }

  private addAyurvedicGuidelines(dietPlan: DietPlan): void {
    this.addSectionTitle('AYURVEDIC GUIDELINES & RECOMMENDATIONS')

    // Constitution-specific guidelines
    if (dietPlan.ayurvedicGuidelines) {
      const guidelines = dietPlan.ayurvedicGuidelines

      this.addSubsectionTitle('Constitutional Focus')
      this.doc.setFontSize(10)
      this.doc.text(guidelines.constitutionFocus, this.margin, this.currentY, { maxWidth: this.pageWidth - 2 * this.margin })
      this.currentY += 15

      // Seasonal adaptations
      if (guidelines.seasonalAdaptations.length > 0) {
        this.addSubsectionTitle('Seasonal Adaptations')
        guidelines.seasonalAdaptations.forEach((adaptation, index) => {
          this.doc.setFontSize(9)
          this.doc.text(`• ${adaptation}`, this.margin + 5, this.currentY)
          this.currentY += 6
        })
        this.currentY += 10
      }

      // Lifestyle recommendations
      if (guidelines.lifestyleRecommendations.length > 0) {
        this.addSubsectionTitle('Lifestyle Recommendations')
        guidelines.lifestyleRecommendations.forEach((recommendation) => {
          this.doc.setFontSize(9)
          this.doc.text(`• ${recommendation}`, this.margin + 5, this.currentY)
          this.currentY += 6
        })
        this.currentY += 10
      }

      // Herbs and supplements
      if (guidelines.herbs.length > 0) {
        this.addSubsectionTitle('Recommended Herbs & Supplements')
        const herbsText = guidelines.herbs.join(', ')
        this.doc.setFontSize(10)
        this.doc.text(herbsText, this.margin, this.currentY, { maxWidth: this.pageWidth - 2 * this.margin })
        this.currentY += 15
      }
    }

    // General recommendations
    if (dietPlan.recommendations.length > 0) {
      this.addSubsectionTitle('General Recommendations')
      dietPlan.recommendations.forEach((recommendation) => {
        this.doc.setFontSize(9)
        this.doc.text(`• ${recommendation}`, this.margin + 5, this.currentY)
        this.currentY += 6
      })
      this.currentY += 10
    }

    // Restrictions
    if (dietPlan.restrictions.length > 0) {
      this.addSubsectionTitle('Foods to Avoid')
      this.doc.setTextColor(220, 38, 38) // Red color for restrictions
      dietPlan.restrictions.forEach((restriction) => {
        this.doc.setFontSize(9)
        this.doc.text(`• ${restriction}`, this.margin + 5, this.currentY)
        this.currentY += 6
      })
      this.doc.setTextColor(0, 0, 0) // Reset to black
      this.currentY += 10
    }
  }

  private addProgressSummary(dietPlan: DietPlan): void {
    this.addSectionTitle('PROGRESS SUMMARY')

    const progressData = [
      ['Current Adherence:', `${dietPlan.progress.adherence}%`],
      ['Weight Change:', `${dietPlan.progress.weightChange > 0 ? '+' : ''}${dietPlan.progress.weightChange} kg`],
      ['Symptoms Improvement:', dietPlan.progress.symptomsImprovement.join(', ') || 'No significant changes recorded']
    ]

    this.doc.autoTable({
      startY: this.currentY,
      head: [],
      body: progressData,
      theme: 'grid',
      styles: {
        fontSize: 10,
        cellPadding: 4,
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 50, fillColor: [248, 250, 252] },
        1: { cellWidth: 120 }
      },
      margin: { left: this.margin, right: this.margin },
      didDrawPage: (data: any) => {
        this.currentY = data.cursor?.y || this.currentY
      }
    })

    this.currentY += 10

    // Progress notes
    if (dietPlan.progress.notes.length > 0) {
      this.addSubsectionTitle('Progress Notes')
      dietPlan.progress.notes.forEach((note) => {
        this.doc.setFontSize(9)
        this.doc.text(`• ${note}`, this.margin + 5, this.currentY)
        this.currentY += 6
      })
      this.currentY += 10
    }
  }

  private addNutritionalAnalysis(dietPlan: DietPlan): void {
    this.addSectionTitle('NUTRITIONAL ANALYSIS')

    // Mock nutritional data - in real implementation, this would be calculated
    const nutritionalData = [
      ['Daily Calories', `${dietPlan.targetCalories} kcal`, '100%', 'Target Met'],
      ['Protein', '120g', '95%', 'Adequate'],
      ['Carbohydrates', '200g', '88%', 'Good'],
      ['Fats', '65g', '92%', 'Adequate'],
      ['Fiber', '35g', '105%', 'Excellent'],
      ['Calcium', '1200mg', '98%', 'Adequate'],
      ['Iron', '18mg', '85%', 'Monitor'],
      ['Vitamin C', '90mg', '110%', 'Excellent']
    ]

    this.doc.autoTable({
      startY: this.currentY,
      head: [['Nutrient', 'Daily Intake', '% Target', 'Status']],
      body: nutritionalData,
      theme: 'striped',
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      columnStyles: {
        0: { cellWidth: 40, fontStyle: 'bold' },
        1: { cellWidth: 35 },
        2: { cellWidth: 25 },
        3: { cellWidth: 30 }
      },
      margin: { left: this.margin, right: this.margin },
      didDrawPage: (data: any) => {
        this.currentY = data.cursor?.y || this.currentY
      }
    })

    this.currentY += 10
  }

  private addPractitionerSignature(practitionerName?: string): void {
    this.currentY += 20

    // Signature section
    this.doc.setDrawColor(0, 0, 0)
    this.doc.line(this.pageWidth - 80, this.currentY, this.pageWidth - 20, this.currentY)
    
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(practitionerName || 'Ayurvedic Practitioner', this.pageWidth - 50, this.currentY + 8, { align: 'center' })
    
    this.doc.setFont('helvetica', 'normal')
    this.doc.setFontSize(8)
    this.doc.text('Digital Signature', this.pageWidth - 50, this.currentY + 14, { align: 'center' })
    this.doc.text(`Date: ${new Date().toLocaleDateString('en-IN')}`, this.pageWidth - 50, this.currentY + 20, { align: 'center' })

    // Disclaimer
    this.currentY += 35
    this.doc.setFontSize(8)
    this.doc.setTextColor(100, 100, 100)
    this.doc.text(
      'DISCLAIMER: This diet chart is prepared based on traditional Ayurvedic principles and individual assessment. ' +
      'It is recommended to consult with your healthcare provider before making significant dietary changes, especially ' +
      'if you have any medical conditions or are taking medications.',
      this.margin, this.currentY, { maxWidth: this.pageWidth - 2 * this.margin, align: 'justify' }
    )
  }

  private addSectionTitle(title: string): void {
    if (this.currentY > this.pageHeight - 60) {
      this.addNewPage()
    }

    this.doc.setFillColor(34, 197, 94)
    this.doc.rect(this.margin, this.currentY - 5, this.pageWidth - 2 * this.margin, 12, 'F')
    
    this.doc.setTextColor(255, 255, 255)
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(title, this.margin + 5, this.currentY + 3)
    
    this.doc.setTextColor(0, 0, 0)
    this.currentY += 20
  }

  private addSubsectionTitle(title: string): void {
    if (this.currentY > this.pageHeight - 40) {
      this.addNewPage()
    }

    this.doc.setFontSize(11)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(59, 130, 246)
    this.doc.text(title, this.margin, this.currentY)
    
    this.doc.setTextColor(0, 0, 0)
    this.currentY += 10
  }

  private addNewPage(): void {
    this.doc.addPage()
    this.currentY = this.headerHeight + 10
  }

  private checkPageBreak(requiredSpace: number = 30): void {
    if (this.currentY + requiredSpace > this.pageHeight - this.footerHeight - 10) {
      this.addNewPage()
    }
  }

  public async generateDietChartPDF(
    data: DietChartPDFData,
    options: MedicalReportOptions = {
      includeNutritionalAnalysis: true,
      includeAyurvedicGuidelines: true,
      includeProgressCharts: true,
      includeRecommendations: true,
      language: 'en'
    }
  ): Promise<void> {
    try {
      // Add header
      this.addHeader(data.consultationDate, data.clinicInfo)

      // Add patient information
      this.addPatientInformation(data.patient)
      this.checkPageBreak(50)

      // Add diet plan details
      this.addDietPlanDetails(data.dietPlan)
      this.checkPageBreak(50)

      // Add Ayurvedic guidelines if requested
      if (options.includeAyurvedicGuidelines) {
        this.addAyurvedicGuidelines(data.dietPlan)
        this.checkPageBreak(50)
      }

      // Add nutritional analysis if requested
      if (options.includeNutritionalAnalysis) {
        this.addNutritionalAnalysis(data.dietPlan)
        this.checkPageBreak(50)
      }

      // Add progress summary if requested
      if (options.includeProgressCharts) {
        this.addProgressSummary(data.dietPlan)
        this.checkPageBreak(30)
      }

      // Add practitioner signature
      this.addPractitionerSignature(data.practitionerName)

      // Add footer to all pages
      const pageCount = this.doc.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        this.doc.setPage(i)
        this.addLegacyFooter(i)
      }

      // Generate filename
      const filename = `DietChart_${data.patient.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
      
      // Save the PDF
      this.doc.save(filename)

      console.log(`Diet chart PDF generated successfully: ${filename}`)
      
    } catch (error) {
      console.error('Error generating diet chart PDF:', error)
      throw new Error('Failed to generate PDF. Please try again.')
    }
  }

  // Quick export method for simple diet charts
  public static async exportSimpleDietChart(
    patient: Patient,
    dietPlan: DietPlan,
    practitionerName?: string
  ): Promise<void> {
    const exporter = new DietChartPDFExporter()
    
    const data: DietChartPDFData = {
      patient,
      dietPlan,
      consultationDate: new Date(),
      practitionerName,
      clinicInfo: {
        name: 'Ayurvedic Diet Management Center',
        address: 'Professional Ayurvedic Healthcare Center',
        phone: '+91-XXXX-XXXXXX',
        email: 'info@ahaarwise.com'
      }
    }

    await exporter.generateDietChartPDF(data)
  }
}

// Utility function for quick PDF export
export const exportDietChartToPDF = async (
  patient: Patient,
  dietPlan: DietPlan,
  options?: Partial<MedicalReportOptions>
): Promise<void> => {
  const data: DietChartPDFData = {
    patient,
    dietPlan,
    consultationDate: new Date(),
    practitionerName: 'Dr. Ayurvedic Practitioner',
    clinicInfo: {
      name: 'AhaarWISE - Ayurvedic Diet Intelligence System',
      address: 'Digital Healthcare Platform',
      phone: '+91-XXXX-XXXXXX',
      email: 'info@ahaarwise.com',
      license: 'AYUR-LIC-2024-001'
    }
  }

  const defaultOptions: MedicalReportOptions = {
    includeNutritionalAnalysis: true,
    includeAyurvedicGuidelines: true,
    includeProgressCharts: true,
    includeRecommendations: true,
    language: 'en',
    ...options
  }

  const exporter = new DietChartPDFExporter()
  await exporter.generateDietChartPDF(data, defaultOptions)
}

// Export progress report PDF
export const exportProgressReportToPDF = async (
  patients: Patient[],
  dietPlans: DietPlan[],
  timeRange: string = 'last-30-days'
): Promise<void> => {
  const doc = new jsPDF('p', 'mm', 'a4')
  
  // Header
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('AHAARWISE - AYURVEDIC DIET PROGRESS REPORT', 105, 20, { align: 'center' })
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Report Period: ${timeRange}`, 105, 30, { align: 'center' })
  doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 105, 35, { align: 'center' })

  // Patient summary table
  const patientData = patients.map(patient => {
    const activePlan = dietPlans.find(plan => plan.patientId === patient.id && plan.isActive)
    return [
      patient.name,
      patient.constitution,
      activePlan ? 'Active' : 'Inactive',
      activePlan ? `${activePlan.progress.adherence}%` : 'N/A',
      `${activePlan?.progress.weightChange || 0} kg`
    ]
  })

  doc.autoTable({
    startY: 50,
    head: [['Patient Name', 'Constitution', 'Plan Status', 'Adherence', 'Weight Change']],
    body: patientData,
    theme: 'striped',
    styles: { fontSize: 9 },
    headStyles: { fillColor: [34, 197, 94], textColor: [255, 255, 255] }
  })

  const filename = `ProgressReport_${timeRange}_${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(filename)
}

// Enhanced Analytics Export Functions with Comprehensive Branding
export class AnalyticsPDFExporter {
  private doc: jsPDF
  private currentY: number = 20
  private pageHeight: number = 297
  private pageWidth: number = 210
  private margin: number = 20
  private branding: PDFBrandingConfig

  constructor(branding: PDFBrandingConfig = AHAARWISE_BRANDING) {
    this.doc = new jsPDF('p', 'mm', 'a4')
    this.branding = branding
    // Ensure autoTable is available
    this.doc.autoTable = (options: any) => autoTable(this.doc, options)
  }

  private addBrandedHeader(title: string, subtitle?: string, date?: Date): void {
    // Header background
    this.doc.setFillColor(this.branding.primaryColor)
    this.doc.rect(0, 0, this.pageWidth, 35, 'F')
    
    // Company logo area
    this.doc.setFillColor(255, 255, 255)
    this.doc.rect(this.margin, 8, 35, 20, 'F')
    this.doc.setTextColor(this.branding.primaryColor)
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(this.branding.companyName, this.margin + 2, 18)
    
    // Title
    this.doc.setTextColor(255, 255, 255)
    this.doc.setFontSize(18)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(title, this.margin + 45, 18)
    
    if (subtitle) {
      this.doc.setFontSize(11)
      this.doc.setFont('helvetica', 'normal')
      this.doc.text(subtitle, this.margin + 45, 25)
    }
    
    if (date) {
      this.doc.setFontSize(10)
      this.doc.text(`Date: ${date.toLocaleDateString()}`, this.pageWidth - this.margin - 40, 18)
    }
    
    this.doc.setFontSize(8)
    this.doc.text(this.branding.tagline, this.pageWidth - this.margin - 70, 25)
    
    this.currentY = 45
  }

  private addFooter(pageNumber: number): void {
    const footerY = this.pageHeight - 15
    this.doc.setDrawColor(this.branding.secondaryColor)
    this.doc.setLineWidth(0.5)
    this.doc.line(this.margin, footerY - 5, this.pageWidth - this.margin, footerY - 5)
    
    this.doc.setFontSize(8)
    this.doc.setTextColor(100, 100, 100)
    this.doc.text(`${this.branding.website} | ${this.branding.contactInfo.email}`, this.margin, footerY)
    this.doc.text(`Page ${pageNumber}`, this.pageWidth - this.margin - 20, footerY)
  }

  private addSection(title: string): void {
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(0, 0, 0)
    this.doc.text(title, this.margin, this.currentY)
    this.doc.setDrawColor(this.branding.primaryColor)
    this.doc.setLineWidth(0.5)
    this.doc.line(this.margin, this.currentY + 2, this.margin + this.doc.getTextWidth(title), this.currentY + 2)
    this.currentY += 10
  }

  private addTable(headers: string[], data: string[][]): void {
    this.doc.autoTable({
      startY: this.currentY,
      head: [headers],
      body: data,
      theme: 'striped',
      styles: { fontSize: 9 },
      headStyles: { 
        fillColor: [247, 115, 22], // Orange-500
        textColor: [255, 255, 255] 
      },
      margin: { left: this.margin, right: this.margin }
    })
    this.currentY = (this.doc as any).lastAutoTable.finalY + 10
  }

  // Patient Progress Analytics Report
  async exportPatientProgressAnalytics(
    patient: EnhancedPatient,
    progressData: any,
    options: MedicalReportOptions = {
      includeNutritionalAnalysis: true,
      includeAyurvedicGuidelines: true,
      includeProgressCharts: true,
      includeRecommendations: true,
      language: 'en'
    }
  ): Promise<void> {
    this.addBrandedHeader(
      'Patient Progress Analytics',
      `Comprehensive Health Analysis for ${patient.name}`,
      new Date()
    )

    // Patient Overview
    this.addSection('Patient Information')
    const patientInfo = [
      ['Name', patient.name],
      ['Age', `${patient.age} years`],
      ['Gender', patient.gender],
      ['Constitution', patient.constitution],
      ['Current Health Score', `${progressData.healthScore}/100`],
      ['BMI', `${progressData.currentBMI} (${progressData.bmiCategory})`]
    ]
    this.addTable(['Attribute', 'Value'], patientInfo)

    // Progress Metrics
    this.addSection('Key Progress Indicators')
    const progressMetrics = [
      ['Weight Change', `${progressData.weightChange} kg`],
      ['Energy Level Improvement', `+${progressData.energyImprovement}%`],
      ['Symptom Reduction', `${progressData.symptomReduction}%`],
      ['Diet Compliance', `${progressData.dietCompliance}%`],
      ['Exercise Adherence', `${progressData.exerciseAdherence}%`]
    ]
    this.addTable(['Metric', 'Progress'], progressMetrics)

    // Ayurvedic Assessment
    if (options.includeAyurvedicGuidelines) {
      this.addSection('Ayurvedic Constitution Analysis')
      const ayurvedicData = [
        ['Constitution', patient.constitution],
        ['Current Imbalance', patient.currentImbalance?.join(', ') || 'None'],
        ['Activity Level', patient.activityLevel],
        ['Stress Level', `${patient.stressLevel}/5`],
        ['Sleep Quality', patient.sleepPattern.quality]
      ]
      this.addTable(['Dosha/Aspect', 'Current State'], ayurvedicData)
    }

    // Nutritional Analysis
    if (options.includeNutritionalAnalysis) {
      this.addSection('Nutritional Analysis')
      const nutritionData = [
        ['Daily Calories', `${progressData.avgCalories} kcal`],
        ['Protein Intake', `${progressData.proteinIntake}g (${progressData.proteinPercentage}%)`],
        ['Carbohydrate Intake', `${progressData.carbIntake}g (${progressData.carbPercentage}%)`],
        ['Fat Intake', `${progressData.fatIntake}g (${progressData.fatPercentage}%)`],
        ['Fiber Intake', `${progressData.fiberIntake}g`],
        ['Hydration Level', `${progressData.hydrationLevel}%`]
      ]
      this.addTable(['Nutrient', 'Daily Average'], nutritionData)
    }

    // Recommendations
    if (options.includeRecommendations && progressData.recommendations) {
      this.addSection('Personalized Recommendations')
      this.doc.setFontSize(10)
      progressData.recommendations.forEach((rec: string, index: number) => {
        this.doc.text(`${index + 1}. ${rec}`, this.margin + 5, this.currentY)
        this.currentY += 6
      })
    }

    this.addFooter(1)
    this.doc.save(`patient-analytics-${patient.name.replace(/\s+/g, '-')}.pdf`)
  }

  // Population Health Analytics Report
  async exportPopulationHealthAnalytics(metrics: any, dateRange: { start: Date; end: Date }): Promise<void> {
    this.addBrandedHeader(
      'Population Health Analytics',
      'Healthcare Insights & Trends Analysis',
      new Date()
    )

    // Executive Summary
    this.addSection('Executive Summary')
    const summary = [
      ['Total Patients', metrics.totalPatients.toString()],
      ['Active Consultations', metrics.activeConsultations.toString()],
      ['Average Health Score', `${metrics.avgHealthScore}/100`],
      ['Overall Compliance Rate', `${metrics.overallCompliance}%`],
      ['Patient Satisfaction', `${metrics.patientSatisfaction}%`]
    ]
    this.addTable(['Metric', 'Value'], summary)

    // Demographics
    this.addSection('Patient Demographics')
    const demographics = [
      ['Age 18-30', `${metrics.demographics.age1830}%`],
      ['Age 31-45', `${metrics.demographics.age3145}%`],
      ['Age 46-60', `${metrics.demographics.age4660}%`],
      ['Age 60+', `${metrics.demographics.age60plus}%`],
      ['Male Patients', `${metrics.demographics.male}%`],
      ['Female Patients', `${metrics.demographics.female}%`]
    ]
    this.addTable(['Category', 'Percentage'], demographics)

    // Top Health Conditions
    this.addSection('Common Health Conditions')
    const conditions = metrics.topConditions.map((condition: any) => [
      condition.name,
      `${condition.prevalence}%`,
      `${condition.improvementRate}%`,
      condition.avgTreatmentDuration
    ])
    this.addTable(['Condition', 'Prevalence', 'Improvement Rate', 'Avg Treatment Duration'], conditions)

    // Treatment Effectiveness
    this.addSection('Treatment Effectiveness Metrics')
    const effectiveness = [
      ['Average Recovery Time', `${metrics.avgRecoveryTime} days`],
      ['Symptom Improvement', `${metrics.symptomImprovement}%`],
      ['Weight Management Success', `${metrics.weightManagementSuccess}%`],
      ['Lifestyle Adherence', `${metrics.lifestyleAdherence}%`],
      ['Follow-up Compliance', `${metrics.followUpCompliance}%`]
    ]
    this.addTable(['Metric', 'Rate/Duration'], effectiveness)

    this.addFooter(1)
    this.doc.save(`population-health-analytics-${dateRange.start.toISOString().split('T')[0]}.pdf`)
  }

  // Meal Plan Analytics Report
  async exportMealPlanAnalytics(mealPlan: any, patient: EnhancedPatient, nutritionalAnalysis: any): Promise<void> {
    this.addBrandedHeader(
      'Personalized Meal Plan Report',
      `Ayurvedic Nutrition Guide for ${patient.name}`,
      new Date()
    )

    // Meal Plan Overview
    this.addSection('Meal Plan Summary')
    const planInfo = [
      ['Plan Duration', `${mealPlan.duration} days`],
      ['Daily Calories Target', `${mealPlan.dailyCalories} kcal`],
      ['Dominant Rasa (Taste)', mealPlan.dominantTaste],
      ['Seasonal Adaptation', mealPlan.seasonalAdaptation],
      ['Dosha Focus', mealPlan.doshaFocus],
      ['Created Date', new Date(mealPlan.createdAt).toLocaleDateString()]
    ]
    this.addTable(['Attribute', 'Details'], planInfo)

    // Nutritional Breakdown
    this.addSection('Daily Nutritional Analysis')
    const nutrition = [
      ['Calories', `${nutritionalAnalysis.calories} kcal`],
      ['Protein', `${nutritionalAnalysis.protein}g (${nutritionalAnalysis.proteinPercent}%)`],
      ['Carbohydrates', `${nutritionalAnalysis.carbs}g (${nutritionalAnalysis.carbPercent}%)`],
      ['Healthy Fats', `${nutritionalAnalysis.fats}g (${nutritionalAnalysis.fatPercent}%)`],
      ['Dietary Fiber', `${nutritionalAnalysis.fiber}g`],
      ['Vitamin C', `${nutritionalAnalysis.vitaminC}mg`],
      ['Iron', `${nutritionalAnalysis.iron}mg`],
      ['Calcium', `${nutritionalAnalysis.calcium}mg`]
    ]
    this.addTable(['Nutrient', 'Daily Amount'], nutrition)

    // Six Tastes Analysis
    this.addSection('Ayurvedic Six Tastes Distribution')
    const tastes = [
      ['Sweet (Madhura)', `${nutritionalAnalysis.tastes.sweet}%`],
      ['Sour (Amla)', `${nutritionalAnalysis.tastes.sour}%`],
      ['Salty (Lavana)', `${nutritionalAnalysis.tastes.salty}%`],
      ['Pungent (Katu)', `${nutritionalAnalysis.tastes.pungent}%`],
      ['Bitter (Tikta)', `${nutritionalAnalysis.tastes.bitter}%`],
      ['Astringent (Kashaya)', `${nutritionalAnalysis.tastes.astringent}%`]
    ]
    this.addTable(['Taste', 'Percentage'], tastes)

    // Meal Schedule
    this.addSection('Daily Meal Schedule')
    mealPlan.meals.forEach((meal: any, index: number) => {
      this.doc.setFontSize(11)
      this.doc.setFont('helvetica', 'bold')
      this.doc.text(`${meal.name} (${meal.time})`, this.margin, this.currentY)
      this.currentY += 6
      
      this.doc.setFontSize(9)
      this.doc.setFont('helvetica', 'normal')
      this.doc.text(`Ingredients: ${meal.ingredients.join(', ')}`, this.margin + 5, this.currentY)
      this.currentY += 5
      this.doc.text(`Preparation: ${meal.preparation}`, this.margin + 5, this.currentY)
      this.currentY += 8
    })

    this.addFooter(1)
    this.doc.save(`meal-plan-${patient.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`)
  }

  // Compliance Analytics Report
  async exportComplianceAnalytics(complianceData: any, dateRange: { start: Date; end: Date }): Promise<void> {
    this.addBrandedHeader(
      'Treatment Compliance Analytics',
      'Patient Adherence & Engagement Analysis',
      new Date()
    )

    // Overall Compliance Metrics
    this.addSection('Compliance Overview')
    const complianceOverview = [
      ['Overall Compliance Rate', `${complianceData.overallRate}%`],
      ['Diet Plan Adherence', `${complianceData.dietAdherence}%`],
      ['Medication Compliance', `${complianceData.medicationCompliance}%`],
      ['Exercise Adherence', `${complianceData.exerciseAdherence}%`],
      ['Follow-up Attendance', `${complianceData.followUpAttendance}%`],
      ['Lifestyle Modifications', `${complianceData.lifestyleCompliance}%`]
    ]
    this.addTable(['Compliance Area', 'Rate'], complianceOverview)

    // Compliance by Demographics
    this.addSection('Compliance by Demographics')
    const demographics = [
      ['Age 18-30', `${complianceData.byAge.age1830}%`],
      ['Age 31-45', `${complianceData.byAge.age3145}%`],
      ['Age 46-60', `${complianceData.byAge.age4660}%`],
      ['Age 60+', `${complianceData.byAge.age60plus}%`],
      ['Male Patients', `${complianceData.byGender.male}%`],
      ['Female Patients', `${complianceData.byGender.female}%`]
    ]
    this.addTable(['Demographic', 'Compliance Rate'], demographics)

    // Risk Factors for Non-Compliance
    this.addSection('Non-Compliance Risk Factors')
    complianceData.riskFactors.forEach((factor: any, index: number) => {
      this.doc.setFontSize(10)
      this.doc.text(`• ${factor.name}: ${factor.impact} (affects ${factor.frequency}% of cases)`, this.margin + 5, this.currentY)
      this.currentY += 6
    })

    // Improvement Strategies
    this.addSection('Recommended Improvement Strategies')
    complianceData.improvementStrategies.forEach((strategy: string, index: number) => {
      this.doc.setFontSize(10)
      this.doc.text(`${index + 1}. ${strategy}`, this.margin + 5, this.currentY)
      this.currentY += 6
    })

    this.addFooter(1)
    this.doc.save(`compliance-analytics-${dateRange.start.toISOString().split('T')[0]}.pdf`)
  }
}

// Convenience Export Functions
export async function exportPatientAnalyticsPDF(
  patient: EnhancedPatient,
  progressData: any,
  options?: MedicalReportOptions
): Promise<void> {
  const exporter = new AnalyticsPDFExporter()
  await exporter.exportPatientProgressAnalytics(patient, progressData, options)
}

export async function exportPopulationAnalyticsPDF(
  metrics: any,
  dateRange: { start: Date; end: Date }
): Promise<void> {
  const exporter = new AnalyticsPDFExporter()
  await exporter.exportPopulationHealthAnalytics(metrics, dateRange)
}

// Enhanced Weekly Diet Chart PDF Export
export class WeeklyDietChartPDFExporter {
  private doc: jsPDF
  private currentY: number = 20
  private pageHeight: number = 297 // A4 height in mm
  private pageWidth: number = 210 // A4 width in mm
  private margin: number = 15
  private branding: PDFBrandingConfig

  constructor(branding: PDFBrandingConfig = AHAARWISE_BRANDING) {
    this.doc = new jsPDF('p', 'mm', 'a4')
    this.branding = branding
    // Ensure autoTable is available
    this.doc.autoTable = (options: any) => autoTable(this.doc, options)
  }

  async exportWeeklyDietChart(chartData: WeeklyDietChartData): Promise<void> {
    // Page 1: Header and Patient Info
    this.addBrandedHeader()
    this.addPatientSummary(chartData.patient)
    
    // Page 2: Weekly Meal Plan
    this.addNewPage()
    this.addWeeklyMealPlan(chartData.weeklyPlan)
    
    // Page 3: Smart Recommendations
    this.addNewPage()
    this.addSmartRecommendations(chartData.ayurvedicRecommendations, chartData.patient)
    
    // Page 4: Nutritional Summary
    if (chartData.nutritionalSummary) {
      this.addNewPage()
      this.addNutritionalSummary(chartData.nutritionalSummary)
    }
    
    // Final page setup
    this.addFooterToAllPages()
    
    // Generate filename with patient name and date
    const fileName = `AhaarWISE-WeeklyDietChart-${chartData.patient.name.replace(/\s+/g, '_')}-${chartData.generatedDate.toISOString().split('T')[0]}.pdf`
    this.doc.save(fileName)
  }

  private addBrandedHeader(): void {
    // AhaarWISE Header with gradient background
    this.doc.setFillColor(247, 146, 86) // Orange gradient start
    this.doc.rect(0, 0, this.pageWidth, 40, 'F')
    
    // Logo area (placeholder)
    this.doc.setFillColor(255, 255, 255)
    this.doc.rect(this.margin, 8, 40, 25, 'F')
    this.doc.setFillColor(247, 146, 86)
    this.doc.circle(this.margin + 20, 20, 8, 'F')
    
    // AhaarWISE branding
    this.doc.setTextColor(255, 255, 255)
    this.doc.setFontSize(24)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('AhaarWISE', this.margin + 50, 20)
    
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text('Intelligent Ayurvedic Nutrition Management', this.margin + 50, 28)
    
    // Document title
    this.doc.setFontSize(16)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('PERSONALIZED WEEKLY DIET CHART', this.pageWidth/2, 50, { align: 'center' })
    
    // Reset text color
    this.doc.setTextColor(0, 0, 0)
    this.currentY = 65
  }

  private addPatientSummary(patient: Patient): void {
    this.addSectionTitle('PATIENT INFORMATION')
    
    // Patient info card
    this.doc.setFillColor(253, 230, 138) // Light orange
    this.doc.rect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 45, 'F')
    
    // Patient details in two columns
    const leftColumn = this.margin + 5
    const rightColumn = this.pageWidth / 2 + 10
    
    this.doc.setFontSize(11)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Name:', leftColumn, this.currentY + 8)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(patient.name, leftColumn + 20, this.currentY + 8)
    
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Age:', rightColumn, this.currentY + 8)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(`${patient.age} years`, rightColumn + 15, this.currentY + 8)
    
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Gender:', leftColumn, this.currentY + 16)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1), leftColumn + 20, this.currentY + 16)
    
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Constitution:', rightColumn, this.currentY + 16)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(patient.constitution.toUpperCase(), rightColumn + 25, this.currentY + 16)
    
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('BMI:', leftColumn, this.currentY + 24)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(`${patient.bmi || 'Not calculated'}`, leftColumn + 20, this.currentY + 24)
    
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Activity Level:', rightColumn, this.currentY + 24)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(patient.lifestyle.activityLevel.replace('-', ' ').toUpperCase(), rightColumn + 25, this.currentY + 24)
    
    // Chart generation date
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Chart Generated:', leftColumn, this.currentY + 32)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(new Date().toLocaleDateString('en-IN', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }), leftColumn + 35, this.currentY + 32)
    
    this.currentY += 55
    
    // Health conditions if any
    if (patient.currentConditions?.length > 0 || patient.dietaryRestrictions?.length > 0) {
      this.addSectionTitle('HEALTH PROFILE')
      
      if (patient.currentConditions?.length > 0) {
        this.doc.setFont('helvetica', 'bold')
        this.doc.setFontSize(10)
        this.doc.text('Current Health Conditions:', this.margin, this.currentY)
        this.doc.setFont('helvetica', 'normal')
        this.doc.text(patient.currentConditions.join(', '), this.margin + 50, this.currentY)
        this.currentY += 8
      }
      
      if (patient.dietaryRestrictions?.length > 0) {
        this.doc.setFont('helvetica', 'bold')
        this.doc.text('Dietary Restrictions:', this.margin, this.currentY)
        this.doc.setFont('helvetica', 'normal')
        this.doc.text(patient.dietaryRestrictions.join(', '), this.margin + 40, this.currentY)
        this.currentY += 8
      }
      
      this.currentY += 10
    }
  }

  private addWeeklyMealPlan(weeklyPlan: any[]): void {
    this.addSectionTitle('7-DAY MEAL PLAN')
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    const tableData: any[][] = []
    
    weeklyPlan.slice(0, 7).forEach((day, index) => {
      const dayName = days[index] || `Day ${index + 1}`
      
      // Handle both GPT dailyPlans structure and converted weeklyPlan structure
      const formatMealName = (mealData: any) => {
        if (!mealData) return '-'
        
        // If it's a GPT meal object with name
        if (mealData.name) {
          return mealData.name
        }
        
        // If it's converted weeklyPlan items array
        if (mealData.items && Array.isArray(mealData.items)) {
          return mealData.items.map((item: any) => item.name || item).join(', ')
        }
        
        return '-'
      }
      
      const breakfast = formatMealName(day.meals?.breakfast)
      const lunch = formatMealName(day.meals?.lunch)
      const dinner = formatMealName(day.meals?.dinner)
      const snacks = formatMealName(day.meals?.snacks || day.meals?.midMorning || day.meals?.midAfternoon)
      
      // Calculate total daily calories from individual meals
      const calculateMealCalories = (mealData: any) => {
        if (!mealData) return 0
        if (mealData.nutritionalInfo?.calories) return mealData.nutritionalInfo.calories
        if (mealData.totalCalories) return mealData.totalCalories
        if (mealData.items) {
          return mealData.items.reduce((sum: number, item: any) => sum + (item.calories || 0), 0)
        }
        return 0
      }
      
      const dailyCalories = calculateMealCalories(day.meals?.breakfast) + 
                           calculateMealCalories(day.meals?.lunch) + 
                           calculateMealCalories(day.meals?.dinner) + 
                           calculateMealCalories(day.meals?.snacks || day.meals?.midMorning || day.meals?.midAfternoon)
      
      tableData.push([dayName, breakfast, lunch, dinner, snacks, `${dailyCalories} kcal`])
    })
    
    this.doc.autoTable({
      startY: this.currentY,
      head: [['Day', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Total Calories']],
      body: tableData,
      theme: 'striped',
      styles: {
        fontSize: 7,
        cellPadding: 4,
        halign: 'left',
        valign: 'top',
        lineWidth: 0.1,
        lineColor: [200, 200, 200]
      },
      headStyles: {
        fillColor: [251, 146, 60], // Orange
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [254, 243, 199] // Light orange
      },
      columnStyles: {
        0: { cellWidth: 25, fontStyle: 'bold', halign: 'center' }, // Day
        1: { cellWidth: 35 }, // Breakfast
        2: { cellWidth: 35 }, // Lunch
        3: { cellWidth: 35 }, // Dinner
        4: { cellWidth: 30 }, // Snacks
        5: { cellWidth: 20, halign: 'center' } // Calories
      },
      margin: { left: this.margin, right: this.margin },
      tableWidth: 'auto'
    })
    
    // Update currentY after table
    this.currentY = (this.doc as any).lastAutoTable.finalY + 15
  }

  private addSmartRecommendations(recommendations: any, patient: Patient): void {
    this.addSectionTitle('SMART AYURVEDIC RECOMMENDATIONS')
    
    // Constitution-specific guidance
    this.addSubSectionTitle('Constitutional Guidance for ' + patient.constitution.toUpperCase())
    
    const constitutionGuidance = this.getConstitutionGuidance(patient.constitution)
    constitutionGuidance.forEach(guidance => {
      this.doc.setFontSize(9)
      this.doc.text(`• ${guidance}`, this.margin + 3, this.currentY)
      this.currentY += 6
    })
    this.currentY += 8
    
    // Seasonal recommendations
    this.addSubSectionTitle('Seasonal Recommendations')
    const seasonalTips = this.getSeasonalTips()
    seasonalTips.forEach(tip => {
      this.doc.setFontSize(9)
      this.doc.text(`• ${tip}`, this.margin + 3, this.currentY)
      this.currentY += 6
    })
    this.currentY += 8
    
    // Lifestyle recommendations
    this.addSubSectionTitle('Lifestyle Recommendations')
    const lifestyleTips = this.getLifestyleTips(patient)
    lifestyleTips.forEach(tip => {
      this.doc.setFontSize(9)
      this.doc.text(`• ${tip}`, this.margin + 3, this.currentY)
      this.currentY += 6
    })
    this.currentY += 8
    
    // Herbs and spices
    this.addSubSectionTitle('Recommended Herbs & Spices')
    const herbs = this.getRecommendedHerbs(patient.constitution)
    this.doc.setFontSize(9)
    this.doc.text(herbs.join(', '), this.margin + 3, this.currentY, { 
      maxWidth: this.pageWidth - 2 * this.margin 
    })
    this.currentY += 15
    
    // Food combinations to avoid
    this.addSubSectionTitle('Food Combinations to Avoid')
    const avoidCombinations = [
      'Milk with citrus fruits or sour foods',
      'Fish with milk or dairy products',
      'Honey with hot or warm foods',
      'Fruits with meals (eat separately)',
      'Cold drinks with hot meals'
    ]
    avoidCombinations.forEach(combination => {
      this.doc.setFontSize(9)
      this.doc.setTextColor(220, 38, 38) // Red
      this.doc.text(`⚠ ${combination}`, this.margin + 3, this.currentY)
      this.currentY += 6
    })
    this.doc.setTextColor(0, 0, 0) // Reset to black
    this.currentY += 8
    
    // Meal timing guidelines
    this.addSubSectionTitle('Optimal Meal Timing')
    const mealTiming = [
      'Breakfast: 6:00 AM - 8:00 AM (Light and warm)',
      'Mid-Morning: 10:00 AM - 11:00 AM (Fruits or nuts)',
      'Lunch: 12:00 PM - 1:00 PM (Largest meal of the day)',
      'Mid-Afternoon: 3:00 PM - 4:00 PM (Herbal tea)',
      'Dinner: 6:00 PM - 7:00 PM (Light and early)'
    ]
    mealTiming.forEach(timing => {
      this.doc.setFontSize(9)
      this.doc.text(`• ${timing}`, this.margin + 3, this.currentY)
      this.currentY += 6
    })
  }

  private addNutritionalSummary(nutritionalSummary: any): void {
    this.addSectionTitle('NUTRITIONAL ANALYSIS')
    
    // Nutritional breakdown table
    const nutritionData = [
      ['Total Daily Calories', `${nutritionalSummary.totalCalories} kcal`],
      ['Average Protein', `${nutritionalSummary.avgProtein}g per day`],
      ['Average Carbohydrates', `${nutritionalSummary.avgCarbs}g per day`],
      ['Average Healthy Fats', `${nutritionalSummary.avgFat}g per day`],
      ['Average Fiber', `${nutritionalSummary.avgFiber}g per day`]
    ]
    
    this.doc.autoTable({
      startY: this.currentY,
      head: [['Nutrient', 'Daily Average']],
      body: nutritionData,
      theme: 'striped',
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: { 
        fillColor: [251, 146, 60], 
        textColor: [255, 255, 255],
        fontStyle: 'bold' 
      },
      margin: { left: this.margin, right: this.margin }
    })
    
    this.currentY += 80
    
    // Ayurvedic nutrition principles
    this.addSubSectionTitle('Ayurvedic Nutrition Principles Applied')
    const principles = [
      'Six tastes (Rasa) balanced in each meal',
      'Foods matched to your constitutional needs',
      'Seasonal ingredients for optimal digestion',
      'Proper food combinations for better absorption',
      'Mindful eating practices integrated'
    ]
    
    principles.forEach(principle => {
      this.doc.setFontSize(9)
      this.doc.text(`✓ ${principle}`, this.margin + 3, this.currentY)
      this.currentY += 6
    })
  }

  private getConstitutionGuidance(constitution: string): string[] {
    const guidance: Record<string, string[]> = {
      'vata': [
        'Favor warm, moist, and grounding foods',
        'Include healthy fats like ghee and nuts',
        'Avoid raw, cold, and dry foods',
        'Maintain regular meal times',
        'Include sweet, sour, and salty tastes'
      ],
      'pitta': [
        'Choose cooling and calming foods',
        'Avoid spicy, oily, and fried foods',
        'Include sweet, bitter, and astringent tastes',
        'Eat meals at moderate temperature',
        'Stay hydrated with cool (not iced) water'
      ],
      'kapha': [
        'Choose light, warm, and stimulating foods',
        'Include pungent, bitter, and astringent tastes',
        'Avoid heavy, oily, and sweet foods',
        'Eat lighter portions, especially dinner',
        'Include warming spices like ginger and black pepper'
      ]
    }
    
    const constitutionKey = constitution.split('-')[0].toLowerCase()
    return guidance[constitutionKey] || guidance['vata']
  }

  private getSeasonalTips(): string[] {
    const month = new Date().getMonth()
    
    if (month >= 3 && month <= 6) { // Spring/Summer
      return [
        'Include cooling foods like cucumber and mint',
        'Favor fresh seasonal fruits and vegetables',
        'Drink plenty of water and coconut water',
        'Avoid excessive heating spices',
        'Include leafy greens and light grains'
      ]
    } else if (month >= 7 && month <= 10) { // Monsoon/Early Winter  
      return [
        'Include warming spices to aid digestion',
        'Favor cooked foods over raw foods',
        'Include ginger tea for immunity',
        'Avoid heavy and oily foods',
        'Focus on easily digestible meals'
      ]
    } else { // Winter
      return [
        'Include warming and nourishing foods',
        'Favor hot soups and stews',
        'Include healthy fats and nuts',
        'Add warming spices like cinnamon',
        'Avoid cold and frozen foods'
      ]
    }
  }

  private getLifestyleTips(patient: Patient): string[] {
    const baseTips = [
      'Eat in a calm and peaceful environment',
      'Chew your food thoroughly (20-30 times)',
      'Avoid drinking large amounts of water with meals',
      'Take a short walk after meals to aid digestion',
      'Practice gratitude before eating'
    ]
    
    if (patient.lifestyle.stressLevel === 'high') {
      baseTips.push('Practice deep breathing before meals')
      baseTips.push('Consider meditation to reduce stress')
    }
    
    if (patient.lifestyle.activityLevel === 'sedentary') {
      baseTips.push('Include gentle physical activity daily')
      baseTips.push('Try yoga or walking for 30 minutes')
    }
    
    return baseTips
  }

  private getRecommendedHerbs(constitution: string): string[] {
    const herbs: Record<string, string[]> = {
      'vata': ['Ginger', 'Cinnamon', 'Cardamom', 'Fennel', 'Cumin'],
      'pitta': ['Coriander', 'Mint', 'Coconut', 'Rose', 'Fennel'],
      'kapha': ['Ginger', 'Black Pepper', 'Turmeric', 'Cloves', 'Mustard Seeds']
    }
    
    const constitutionKey = constitution.split('-')[0].toLowerCase()
    return herbs[constitutionKey] || herbs['vata']
  }

  private addSectionTitle(title: string): void {
    if (this.currentY > 270) {
      this.addNewPage()
    }
    
    this.doc.setFillColor(251, 146, 60) // Orange
    this.doc.rect(this.margin, this.currentY, this.pageWidth - 2 * this.margin, 10, 'F')
    
    this.doc.setTextColor(255, 255, 255)
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(title, this.margin + 3, this.currentY + 7)
    
    this.doc.setTextColor(0, 0, 0)
    this.currentY += 15
  }

  private addSubSectionTitle(title: string): void {
    if (this.currentY > 275) {
      this.addNewPage()
    }
    
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setTextColor(251, 146, 60)
    this.doc.text(title, this.margin, this.currentY)
    
    this.doc.setTextColor(0, 0, 0)
    this.currentY += 8
  }

  private addNewPage(): void {
    this.doc.addPage()
    this.currentY = 20
  }

  private addFooterToAllPages(): void {
    const pageCount = this.doc.internal.pages.length - 1
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i)
      this.addPageFooter(i, pageCount)
    }
  }

  private addPageFooter(pageNumber: number, totalPages: number): void {
    const footerY = this.pageHeight - 15
    
    // AhaarWISE footer
    this.doc.setDrawColor(251, 146, 60)
    this.doc.setLineWidth(0.5)
    this.doc.line(this.margin, footerY - 5, this.pageWidth - this.margin, footerY - 5)
    
    this.doc.setFontSize(8)
    this.doc.setTextColor(100, 100, 100)
    this.doc.text(
      `${this.branding.website} | ${this.branding.contactInfo.email} | ${this.branding.contactInfo.phone}`,
      this.pageWidth / 2,
      footerY,
      { align: 'center' }
    )
    
    this.doc.text(`Page ${pageNumber} of ${totalPages}`, this.pageWidth - this.margin, footerY, { align: 'right' })
    
    // Disclaimer
    this.doc.setFontSize(7)
    this.doc.text(
      'This personalized diet chart is based on Ayurvedic principles. Consult your healthcare provider for medical conditions.',
      this.pageWidth / 2,
      footerY + 6,
      { align: 'center' }
    )
  }
}

// Enhanced export function for weekly diet charts
export async function exportEnhancedWeeklyDietChartPDF(
  patient: Patient,
  weeklyPlan: any[],
  nutritionalSummary?: any,
  ayurvedicRecommendations?: any
): Promise<void> {
  try {
    const chartData: WeeklyDietChartData = {
      patient,
      weeklyPlan,
      nutritionalSummary,
      ayurvedicRecommendations,
      generatedDate: new Date()
    }
    
    const exporter = new WeeklyDietChartPDFExporter()
    await exporter.exportWeeklyDietChart(chartData)
  } catch (error) {
    console.error('PDF Export Error:', error)
    // Fallback to simple PDF export
    await exportSimpleWeeklyDietChartPDF(patient, weeklyPlan, nutritionalSummary)
  }
}

// Simple fallback PDF export without complex autoTable usage
export async function exportSimpleWeeklyDietChartPDF(
  patient: Patient,
  weeklyPlan: any[],
  nutritionalSummary?: any
): Promise<void> {
  const doc = new jsPDF('p', 'mm', 'a4')
  let currentY = 20

  // Header
  doc.setFillColor(247, 146, 86) // Orange
  doc.rect(0, 0, 210, 40, 'F')
  
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.text('AhaarWISE', 20, 25)
  
  doc.setFontSize(12)
  doc.text('Intelligent Ayurvedic Nutrition Management', 20, 32)
  
  // Document title
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(16)
  doc.text('PERSONALIZED WEEKLY DIET CHART', 105, 55, { align: 'center' })
  
  currentY = 70

  // Patient info
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('PATIENT INFORMATION', 20, currentY)
  currentY += 10
  
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text(`Name: ${patient.name}`, 20, currentY)
  doc.text(`Age: ${patient.age} years`, 110, currentY)
  currentY += 7
  
  doc.text(`Gender: ${patient.gender}`, 20, currentY)
  doc.text(`Constitution: ${patient.constitution.toUpperCase()}`, 110, currentY)
  currentY += 7
  
  doc.text(`BMI: ${patient.bmi || 'Not calculated'}`, 20, currentY)
  doc.text(`Activity: ${patient.lifestyle.activityLevel}`, 110, currentY)
  currentY += 15

  // Weekly plan
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.text('7-DAY MEAL PLAN', 20, currentY)
  currentY += 15
  
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const tableData: any[][] = []
  
  weeklyPlan.slice(0, 7).forEach((day, index) => {
    const dayName = days[index] || `Day ${index + 1}`
    
    // Handle both GPT dailyPlans structure and converted weeklyPlan structure
    const formatMealName = (mealData: any) => {
      if (!mealData) return '-'
      
      // If it's a GPT meal object with name
      if (mealData.name) {
        return mealData.name
      }
      
      // If it's converted weeklyPlan items array
      if (mealData.items && Array.isArray(mealData.items)) {
        return mealData.items.map((item: any) => item.name || item).join(', ')
      }
      
      return '-'
    }
    
    const breakfast = formatMealName(day.meals?.breakfast)
    const lunch = formatMealName(day.meals?.lunch)
    const dinner = formatMealName(day.meals?.dinner)
    const snacks = formatMealName(day.meals?.snacks || day.meals?.midMorning || day.meals?.midAfternoon)
    
    // Calculate total daily calories from individual meals
    const calculateMealCalories = (mealData: any) => {
      if (!mealData) return 0
      if (mealData.nutritionalInfo?.calories) return mealData.nutritionalInfo.calories
      if (mealData.totalCalories) return mealData.totalCalories
      if (mealData.items) {
        return mealData.items.reduce((sum: number, item: any) => sum + (item.calories || 0), 0)
      }
      return 0
    }
    
    const dailyCalories = calculateMealCalories(day.meals?.breakfast) + 
                         calculateMealCalories(day.meals?.lunch) + 
                         calculateMealCalories(day.meals?.dinner) + 
                         calculateMealCalories(day.meals?.snacks || day.meals?.midMorning || day.meals?.midAfternoon)
    
    tableData.push([dayName, breakfast, lunch, dinner, snacks, `${dailyCalories} kcal`])
  })
  
  // Use autoTable for better formatting
  try {
    ;(doc as any).autoTable({
      startY: currentY,
      head: [['Day', 'Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Total Calories']],
      body: tableData,
      theme: 'striped',
      styles: {
        fontSize: 7,
        cellPadding: 4,
        halign: 'left',
        valign: 'top',
        lineWidth: 0.1,
        lineColor: [200, 200, 200]
      },
      headStyles: {
        fillColor: [247, 146, 86], // Orange
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold',
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [254, 243, 199] // Light orange
      },
      columnStyles: {
        0: { cellWidth: 25, fontStyle: 'bold', halign: 'center' }, // Day
        1: { cellWidth: 35 }, // Breakfast
        2: { cellWidth: 35 }, // Lunch
        3: { cellWidth: 35 }, // Dinner
        4: { cellWidth: 30 }, // Snacks
        5: { cellWidth: 20, halign: 'center' } // Calories
      },
      margin: { left: 15, right: 15 }
    })
    
    currentY = (doc as any).lastAutoTable.finalY + 15
  } catch (error) {
    // Fallback to simple text if autoTable fails
    console.warn('AutoTable failed, using simple text format:', error)
    weeklyPlan.slice(0, 7).forEach((day, index) => {
      if (currentY > 250) {
        doc.addPage()
        currentY = 20
      }
      
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.text(`${days[index]} - Day ${index + 1}`, 20, currentY)
      currentY += 8
      
      const meals = ['breakfast', 'lunch', 'dinner', 'snacks']
      meals.forEach(mealType => {
        if (day.meals?.[mealType]?.items) {
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(9)
          const mealLabel = mealType.charAt(0).toUpperCase() + mealType.slice(1)
          const mealNames = day.meals[mealType].items.map((item: any) => item.name || item).join(', ')
          doc.text(`${mealLabel}: ${mealNames}`, 25, currentY, { maxWidth: 160 })
          currentY += 6
        }
      })
      currentY += 5
    })
  }

  // Nutritional summary
  if (nutritionalSummary && currentY < 240) {
    currentY += 10
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('NUTRITIONAL SUMMARY', 20, currentY)
    currentY += 10
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.text(`Daily Calories: ${nutritionalSummary.totalCalories} kcal`, 20, currentY)
    currentY += 6
    doc.text(`Protein: ${nutritionalSummary.avgProtein}g`, 20, currentY)
    currentY += 6
    doc.text(`Carbohydrates: ${nutritionalSummary.avgCarbs}g`, 20, currentY)
    currentY += 6
    doc.text(`Fats: ${nutritionalSummary.avgFat}g`, 20, currentY)
  }

  // Footer
  const footerY = 280
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.text('AhaarWISE - Intelligent Ayurvedic Nutrition Management', 105, footerY, { align: 'center' })
  doc.text('Generated: ' + new Date().toLocaleDateString(), 105, footerY + 5, { align: 'center' })

  // Download
  const fileName = `AhaarWISE-WeeklyDietChart-${patient.name.replace(/\s+/g, '_')}-${new Date().toISOString().split('T')[0]}.pdf`
  doc.save(fileName)
}

export async function exportPopulationAnalyticsPDFLegacy(
  metrics: any,
  dateRange: { start: Date; end: Date }
): Promise<void> {
  const exporter = new AnalyticsPDFExporter()
  await exporter.exportPopulationHealthAnalytics(metrics, dateRange)
}

export async function exportMealPlanAnalyticsPDF(
  mealPlan: any,
  patient: EnhancedPatient,
  nutritionalAnalysis: any
): Promise<void> {
  const exporter = new AnalyticsPDFExporter()
  await exporter.exportMealPlanAnalytics(mealPlan, patient, nutritionalAnalysis)
}

export async function exportComplianceAnalyticsPDF(
  complianceData: any,
  dateRange: { start: Date; end: Date }
): Promise<void> {
  const exporter = new AnalyticsPDFExporter()
  await exporter.exportComplianceAnalytics(complianceData, dateRange)
}
