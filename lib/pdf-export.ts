// Professional PDF export service for Ayurvedic diet charts
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import type { Patient, DietPlan, ProgressRecord } from './database'

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

export class DietChartPDFExporter {
  private doc: jsPDF
  private currentY: number = 20
  private pageHeight: number = 297 // A4 height in mm
  private pageWidth: number = 210 // A4 width in mm
  private margin: number = 20
  private headerHeight: number = 40
  private footerHeight: number = 20

  constructor() {
    this.doc = new jsPDF('p', 'mm', 'a4')
  }

  private addHeader(consultationDate: Date, clinicInfo?: DietChartPDFData['clinicInfo']): void {
    // Header background
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

  private addFooter(pageNumber: number): void {
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
        this.addFooter(i)
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
