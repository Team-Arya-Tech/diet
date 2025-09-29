import jsPDF from 'jspdf'
import { Exercise } from './ayurvedic-exercises'
import { Patient } from './database'

// Utility function to load image as base64
const loadImageAsBase64 = async (imagePath: string): Promise<string | null> => {
  try {
    const response = await fetch(imagePath)
    const blob = await response.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.warn('Failed to load image:', imagePath, error)
    return null
  }
}

interface ExercisePDFOptions {
  patient: Patient
  exercises: Exercise[]
  recommendations?: string[]
  title?: string
}

export class ExercisePDFGenerator {
  private pdf: jsPDF
  private currentY: number = 20
  private pageHeight: number = 280
  private margin: number = 20
  
  constructor() {
    this.pdf = new jsPDF()
  }

  async generateExercisePDF(options: ExercisePDFOptions): Promise<jsPDF> {
    const { patient, exercises, recommendations, title } = options
    
    // Reset position
    this.currentY = 20
    
    // Add header (now async)
    await this.addHeader(title || "Ayurvedic Exercise Recommendations")
    
    // Add patient information
    this.addPatientInfo(patient)
    
    // Add recommendations if provided
    if (recommendations && recommendations.length > 0) {
      this.addRecommendations(recommendations)
    }
    
    // Add exercises
    this.addExercises(exercises)
    
    // Add footer
    this.addFooter()
    
    return this.pdf
  }

  private async addHeader(title: string): Promise<void> {
    // Try to load and add main page background image
    const bgImage = await loadImageAsBase64('/main_bg.png')
    if (bgImage) {
      try {
        this.pdf.addImage(bgImage, 'PNG', 0, 0, 210, 60, '', 'NONE')
      } catch (error) {
        // Fallback to color background
        this.pdf.setFillColor(245, 245, 220)
        this.pdf.rect(0, 0, 210, 60, 'F')
      }
    } else {
      // Fallback background
      this.pdf.setFillColor(245, 245, 220)
      this.pdf.rect(0, 0, 210, 60, 'F')
    }
    
    // Try to load and add banner image
    const bannerImage = await loadImageAsBase64('/banner_canva.png')
    if (bannerImage) {
      try {
        this.pdf.addImage(bannerImage, 'PNG', 0, 0, 210, 35, '', 'NONE')
      } catch (error) {
        // Fallback to brown header
        this.pdf.setFillColor(139, 69, 19)
        this.pdf.rect(0, 0, 210, 35, 'F')
      }
    } else {
      // Fallback brown header
      this.pdf.setFillColor(139, 69, 19)
      this.pdf.rect(0, 0, 210, 35, 'F')
    }
    
    // AhaarWISE logo (overlay on banner)
    const logoImage = await loadImageAsBase64('/logo_ahaarwise.png')
    if (logoImage) {
      try {
        this.pdf.addImage(logoImage, 'PNG', 15, 10, 20, 20, '', 'NONE')
      } catch (error) {
        // Fallback to placeholder circle
        this.pdf.setFillColor(218, 165, 32) // Goldenrod
        this.pdf.circle(25, 20, 12, 'F')
        this.pdf.setTextColor(139, 69, 19)
        this.pdf.setFontSize(10)
        this.pdf.setFont('helvetica', 'bold')
        this.pdf.text('A', 22, 24)
      }
    } else {
      // Fallback to placeholder circle
      this.pdf.setFillColor(218, 165, 32) // Goldenrod
      this.pdf.circle(25, 20, 12, 'F')
      this.pdf.setTextColor(139, 69, 19)
      this.pdf.setFontSize(10)
      this.pdf.setFont('helvetica', 'bold')
      this.pdf.text('A', 22, 24)
    }
    
    // AhaarWISE brand name
    this.pdf.setTextColor(255, 255, 255)
    this.pdf.setFontSize(24)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text('AhaarWISE', 45, 20)
    
    // Tagline
    this.pdf.setFontSize(10)
    this.pdf.setFont('helvetica', 'normal')
    this.pdf.text('Ayurvedic Exercise & Wellness Management', 45, 28)
    
    // Document title
    this.pdf.setTextColor(139, 69, 19)
    this.pdf.setFontSize(18)
    this.pdf.setFont('helvetica', 'bold')
    this.pdf.text(title, this.margin, 45)
    
    this.currentY = 65
  }

  private addPatientInfo(patient: Patient): void {
    this.pdf.setFontSize(14)
    this.pdf.setTextColor(101, 67, 33) // Dark brown
    this.pdf.text("Patient Information", this.margin, this.currentY)
    this.currentY += 10
    
    this.pdf.setFontSize(10)
    this.pdf.setTextColor(0, 0, 0)
    
    const patientInfo = [
      `Name: ${patient.name}`,
      `Age: ${patient.age} years`,
      `Constitution: ${patient.constitution.charAt(0).toUpperCase() + patient.constitution.slice(1)}`,
      `Current Conditions: ${patient.currentConditions.join(', ') || 'None'}`,
      `Activity Level: ${patient.lifestyle.activityLevel.charAt(0).toUpperCase() + patient.lifestyle.activityLevel.slice(1)}`
    ]
    
    patientInfo.forEach(info => {
      this.pdf.text(info, this.margin, this.currentY)
      this.currentY += 6
    })
    
    this.currentY += 10
  }

  private addRecommendations(recommendations: string[]): void {
    this.checkPageBreak(30)
    
    this.pdf.setFontSize(14)
    this.pdf.setTextColor(101, 67, 33)
    this.pdf.text("Personalized Recommendations", this.margin, this.currentY)
    this.currentY += 10
    
    this.pdf.setFontSize(10)
    this.pdf.setTextColor(0, 0, 0)
    
    recommendations.forEach((rec, index) => {
      const bullet = `${index + 1}. `
      const text = this.wrapText(rec, 160)
      
      this.checkPageBreak(text.length * 6 + 5)
      
      this.pdf.text(bullet, this.margin, this.currentY)
      
      text.forEach((line, lineIndex) => {
        this.pdf.text(line, this.margin + (lineIndex === 0 ? 12 : 15), this.currentY)
        if (lineIndex < text.length - 1) this.currentY += 6
      })
      
      this.currentY += 8
    })
    
    this.currentY += 5
  }

  private addExercises(exercises: Exercise[]): void {
    this.checkPageBreak(30)
    
    this.pdf.setFontSize(14)
    this.pdf.setTextColor(101, 67, 33)
    this.pdf.text(`Recommended Exercises (${exercises.length})`, this.margin, this.currentY)
    this.currentY += 15
    
    exercises.forEach((exercise, index) => {
      this.addSingleExercise(exercise, index + 1)
    })
  }

  private addSingleExercise(exercise: Exercise, number: number): void {
    const exerciseHeight = this.calculateExerciseHeight(exercise)
    this.checkPageBreak(exerciseHeight)
    
    // Exercise title
    this.pdf.setFontSize(12)
    this.pdf.setTextColor(139, 69, 19)
    this.pdf.text(`${number}. ${exercise.name} (${exercise.englishName})`, this.margin, this.currentY)
    this.currentY += 8
    
    // Basic info
    this.pdf.setFontSize(9)
    this.pdf.setTextColor(101, 67, 33)
    this.pdf.text(`Category: ${exercise.category} | Duration: ${exercise.duration} | Difficulty: ${exercise.difficulty}`, this.margin, this.currentY)
    this.currentY += 8
    
    // Description
    this.pdf.setFontSize(9)
    this.pdf.setTextColor(0, 0, 0)
    const descText = `${exercise.type} exercise with ${exercise.primaryBenefits.length} primary benefits`
    const descLines = this.wrapText(descText, 160)
    descLines.forEach(line => {
      this.pdf.text(line, this.margin, this.currentY)
      this.currentY += 5
    })
    this.currentY += 3
    
    // Steps
    this.pdf.setFontSize(10)
    this.pdf.setTextColor(101, 67, 33)
    this.pdf.text("Steps:", this.margin, this.currentY)
    this.currentY += 6
    
    this.pdf.setFontSize(9)
    this.pdf.setTextColor(0, 0, 0)
    exercise.steps.forEach((step: string, stepIndex: number) => {
      const stepText = this.wrapText(`${stepIndex + 1}. ${step}`, 155)
      stepText.forEach((line, lineIndex) => {
        this.checkPageBreak(6)
        this.pdf.text(line, this.margin + (lineIndex === 0 ? 0 : 5), this.currentY)
        this.currentY += 5
      })
    })
    
    // Benefits
    this.currentY += 3
    this.pdf.setFontSize(10)
    this.pdf.setTextColor(101, 67, 33)
    this.pdf.text("Benefits:", this.margin, this.currentY)
    this.currentY += 6
    
    this.pdf.setFontSize(9)
    this.pdf.setTextColor(0, 0, 0)
    exercise.primaryBenefits.slice(0, 3).forEach((benefit: string) => {
      const benefitLines = this.wrapText(`• ${benefit}`, 160)
      benefitLines.forEach(line => {
        this.checkPageBreak(5)
        this.pdf.text(line, this.margin, this.currentY)
        this.currentY += 5
      })
    })
    
    // Dosha effects
    this.currentY += 3
    this.pdf.setFontSize(10)
    this.pdf.setTextColor(101, 67, 33)
    this.pdf.text("Dosha Effects:", this.margin, this.currentY)
    this.currentY += 6
    
    this.pdf.setFontSize(9)
    this.pdf.setTextColor(0, 0, 0)
    Object.entries(exercise.doshaEffects).forEach(([dosha, effect]) => {
      if (effect) {
        this.checkPageBreak(5)
        this.pdf.text(`${dosha.charAt(0).toUpperCase() + dosha.slice(1)}: ${effect}`, this.margin, this.currentY)
        this.currentY += 5
      }
    })
    
    // Best time
    this.currentY += 3
    this.pdf.setFontSize(9)
    this.pdf.setTextColor(101, 67, 33)
    this.pdf.text(`Best Time: ${exercise.bestTimeToPerform}`, this.margin, this.currentY)
    this.currentY += 8
    
    // Add separator line
    if (number < 10) { // Don't add line after last exercise
      this.pdf.setDrawColor(218, 165, 32, 0.3)
      this.pdf.line(this.margin, this.currentY, 190, this.currentY)
      this.currentY += 10
    }
  }

  private calculateExerciseHeight(exercise: Exercise): number {
    // Rough calculation of exercise content height
    const titleHeight = 8
    const infoHeight = 8
    const descHeight = 15 // Fixed height for type and benefits summary
    const stepsHeight = exercise.steps.length * 10
    const benefitsHeight = Math.min(exercise.primaryBenefits.length, 3) * 5 + 9
    const doshaHeight = Object.keys(exercise.doshaEffects).length * 5 + 9
    const timeHeight = 8
    const separatorHeight = 10
    
    return titleHeight + infoHeight + descHeight + stepsHeight + benefitsHeight + doshaHeight + timeHeight + separatorHeight
  }

  private checkPageBreak(requiredHeight: number): void {
    if (this.currentY + requiredHeight > this.pageHeight) {
      this.pdf.addPage()
      this.currentY = 20
    }
  }

  private wrapText(text: string, maxWidth: number): string[] {
    const words = text.split(' ')
    const lines: string[] = []
    let currentLine = ''
    
    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word
      const testWidth = this.pdf.getTextWidth(testLine)
      
      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine)
        currentLine = word
      } else {
        currentLine = testLine
      }
    }
    
    if (currentLine) {
      lines.push(currentLine)
    }
    
    return lines
  }

  private addFooter(): void {
    const pageCount = this.pdf.getNumberOfPages()
    
    for (let i = 1; i <= pageCount; i++) {
      this.pdf.setPage(i)
      
      // Add footer line
      this.pdf.setDrawColor(218, 165, 32)
      this.pdf.line(this.margin, this.pageHeight + 15, 190, this.pageHeight + 15)
      
      // Add footer text
      this.pdf.setFontSize(8)
      this.pdf.setTextColor(101, 67, 33)
      this.pdf.text(
        `Generated by AhaarWISE - Ayurvedic Exercise System | ${new Date().toLocaleDateString()}`,
        this.margin,
        this.pageHeight + 20
      )
      
      // Add page number
      this.pdf.text(
        `Page ${i} of ${pageCount}`,
        190 - 30,
        this.pageHeight + 20
      )
    }
  }

  async exportToPDF(options: ExercisePDFOptions, filename?: string): Promise<void> {
    const pdf = await this.generateExercisePDF(options)
    const fileName = filename || `exercise-plan-${options.patient.name.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`
    pdf.save(fileName)
  }
}

// Export utility function
export const generateExercisePDF = async (options: ExercisePDFOptions, filename?: string): Promise<void> => {
  const generator = new ExercisePDFGenerator()
  await generator.exportToPDF(options, filename)
}