export interface TasteProfile {
  sweet: number      // Madhura
  sour: number       // Amla
  salty: number      // Lavana
  pungent: number    // Katu
  bitter: number     // Tikta
  astringent: number // Kashaya
}

export interface TasteAnalysis {
  profile: TasteProfile
  balance: 'balanced' | 'imbalanced' | 'severely-imbalanced'
  dominantTastes: string[]
  deficientTastes: string[]
  recommendations: string[]
  doshaImpact: {
    vata: 'increase' | 'decrease' | 'neutral'
    pitta: 'increase' | 'decrease' | 'neutral'
    kapha: 'increase' | 'decrease' | 'neutral'
  }
  score: number // 0-100, higher is better balance
}

export interface FoodTasteData {
  id: string
  name: string
  category: string
  tastes: TasteProfile
  thermalEffect: 'heating' | 'cooling' | 'neutral'
  postDigestiveEffect: 'sweet' | 'sour' | 'pungent'
  doshaEffect: {
    vata: number    // -3 to +3 scale
    pitta: number
    kapha: number
  }
}

export class SixTastesAnalyzer {
  private static readonly IDEAL_BALANCE: TasteProfile = {
    sweet: 30,      // Should be highest for building tissues
    sour: 15,       // Moderate for digestion
    salty: 10,      // Small amount needed
    pungent: 15,    // Moderate for metabolism
    bitter: 20,     // Important for detox
    astringent: 10  // Small amount for binding
  }

  private static readonly TASTE_NAMES = {
    sweet: 'Sweet (Madhura)',
    sour: 'Sour (Amla)', 
    salty: 'Salty (Lavana)',
    pungent: 'Pungent (Katu)',
    bitter: 'Bitter (Tikta)',
    astringent: 'Astringent (Kashaya)'
  }

  private static readonly DOSHA_TASTE_EFFECTS = {
    sweet: { vata: -2, pitta: -1, kapha: 2 },
    sour: { vata: -1, pitta: 1, kapha: 1 },
    salty: { vata: -2, pitta: 1, kapha: 2 },
    pungent: { vata: 1, pitta: 2, kapha: -2 },
    bitter: { vata: 1, pitta: -2, kapha: -1 },
    astringent: { vata: 1, pitta: -1, kapha: -1 }
  }

  static analyzeMealTastes(foods: FoodTasteData[]): TasteAnalysis {
    // Calculate total taste profile
    const totalProfile = foods.reduce((acc, food) => ({
      sweet: acc.sweet + food.tastes.sweet,
      sour: acc.sour + food.tastes.sour,
      salty: acc.salty + food.tastes.salty,
      pungent: acc.pungent + food.tastes.pungent,
      bitter: acc.bitter + food.tastes.bitter,
      astringent: acc.astringent + food.tastes.astringent
    }), { sweet: 0, sour: 0, salty: 0, pungent: 0, bitter: 0, astringent: 0 })

    // Normalize to percentages
    const total = Object.values(totalProfile).reduce((sum, value) => sum + value, 0)
    const normalizedProfile: TasteProfile = {
      sweet: Math.round((totalProfile.sweet / total) * 100),
      sour: Math.round((totalProfile.sour / total) * 100),
      salty: Math.round((totalProfile.salty / total) * 100),
      pungent: Math.round((totalProfile.pungent / total) * 100),
      bitter: Math.round((totalProfile.bitter / total) * 100),
      astringent: Math.round((totalProfile.astringent / total) * 100)
    }

    // Analyze balance
    const balance = this.assessBalance(normalizedProfile)
    const dominantTastes = this.getDominantTastes(normalizedProfile)
    const deficientTastes = this.getDeficientTastes(normalizedProfile)
    const recommendations = this.generateRecommendations(normalizedProfile, balance)
    const doshaImpact = this.calculateDoshaImpact(normalizedProfile)
    const score = this.calculateBalanceScore(normalizedProfile)

    return {
      profile: normalizedProfile,
      balance,
      dominantTastes,
      deficientTastes,
      recommendations,
      doshaImpact,
      score
    }
  }

  private static assessBalance(profile: TasteProfile): 'balanced' | 'imbalanced' | 'severely-imbalanced' {
    const deviations = Object.entries(profile).map(([taste, value]) => {
      const ideal = this.IDEAL_BALANCE[taste as keyof TasteProfile]
      return Math.abs(value - ideal)
    })

    const avgDeviation = deviations.reduce((sum, dev) => sum + dev, 0) / 6
    
    if (avgDeviation <= 10) return 'balanced'
    if (avgDeviation <= 20) return 'imbalanced'
    return 'severely-imbalanced'
  }

  private static getDominantTastes(profile: TasteProfile): string[] {
    const sortedTastes = Object.entries(profile)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2)
      .filter(([, value]) => value > 25)
      .map(([taste]) => this.TASTE_NAMES[taste as keyof TasteProfile])

    return sortedTastes
  }

  private static getDeficientTastes(profile: TasteProfile): string[] {
    return Object.entries(profile)
      .filter(([taste, value]) => {
        const ideal = this.IDEAL_BALANCE[taste as keyof TasteProfile]
        return value < ideal * 0.5 // Less than 50% of ideal
      })
      .map(([taste]) => this.TASTE_NAMES[taste as keyof TasteProfile])
  }

  private static generateRecommendations(profile: TasteProfile, balance: string): string[] {
    const recommendations: string[] = []

    if (balance === 'severely-imbalanced') {
      recommendations.push('Consider completely restructuring your meal to include all six tastes')
    }

    // Specific taste recommendations
    if (profile.sweet < 20) {
      recommendations.push('Add more sweet foods like dates, rice, or sweet fruits')
    }
    if (profile.bitter < 10) {
      recommendations.push('Include bitter greens like karela, neem, or turmeric')
    }
    if (profile.astringent < 5) {
      recommendations.push('Add astringent foods like pomegranate, legumes, or green tea')
    }
    if (profile.pungent > 25) {
      recommendations.push('Reduce spicy and pungent foods to avoid aggravating Pitta')
    }
    if (profile.salty > 20) {
      recommendations.push('Reduce salt intake to prevent water retention and Kapha increase')
    }

    // Constitutional recommendations
    if (profile.sweet > 40) {
      recommendations.push('Excessive sweet taste may increase Kapha - balance with pungent and bitter tastes')
    }

    return recommendations
  }

  private static calculateDoshaImpact(profile: TasteProfile): TasteAnalysis['doshaImpact'] {
    let vataEffect = 0, pittaEffect = 0, kaphaEffect = 0

    Object.entries(profile).forEach(([taste, percentage]) => {
      const effects = this.DOSHA_TASTE_EFFECTS[taste as keyof TasteProfile]
      const weight = percentage / 100
      
      vataEffect += effects.vata * weight
      pittaEffect += effects.pitta * weight
      kaphaEffect += effects.kapha * weight
    })

    return {
      vata: vataEffect > 0.5 ? 'increase' : vataEffect < -0.5 ? 'decrease' : 'neutral',
      pitta: pittaEffect > 0.5 ? 'increase' : pittaEffect < -0.5 ? 'decrease' : 'neutral',
      kapha: kaphaEffect > 0.5 ? 'increase' : kaphaEffect < -0.5 ? 'decrease' : 'neutral'
    }
  }

  private static calculateBalanceScore(profile: TasteProfile): number {
    const deviations = Object.entries(profile).map(([taste, value]) => {
      const ideal = this.IDEAL_BALANCE[taste as keyof TasteProfile]
      return Math.abs(value - ideal) / ideal
    })

    const avgDeviation = deviations.reduce((sum, dev) => sum + dev, 0) / 6
    return Math.max(0, Math.round((1 - avgDeviation) * 100))
  }

  // Predefined food taste data
  static getFoodTasteDatabase(): FoodTasteData[] {
    return [
      {
        id: 'rice',
        name: 'Basmati Rice',
        category: 'grains',
        tastes: { sweet: 80, sour: 0, salty: 0, pungent: 0, bitter: 0, astringent: 20 },
        thermalEffect: 'cooling',
        postDigestiveEffect: 'sweet',
        doshaEffect: { vata: -1, pitta: -1, kapha: 1 }
      },
      {
        id: 'turmeric',
        name: 'Turmeric',
        category: 'spices',
        tastes: { sweet: 0, sour: 0, salty: 0, pungent: 40, bitter: 60, astringent: 0 },
        thermalEffect: 'heating',
        postDigestiveEffect: 'pungent',
        doshaEffect: { vata: 0, pitta: -1, kapha: -2 }
      },
      {
        id: 'lemon',
        name: 'Lemon',
        category: 'fruits',
        tastes: { sweet: 0, sour: 90, salty: 0, pungent: 0, bitter: 0, astringent: 10 },
        thermalEffect: 'heating',
        postDigestiveEffect: 'sour',
        doshaEffect: { vata: -1, pitta: 1, kapha: -1 }
      },
      {
        id: 'ghee',
        name: 'Clarified Butter (Ghee)',
        category: 'fats',
        tastes: { sweet: 100, sour: 0, salty: 0, pungent: 0, bitter: 0, astringent: 0 },
        thermalEffect: 'cooling',
        postDigestiveEffect: 'sweet',
        doshaEffect: { vata: -2, pitta: -1, kapha: 1 }
      },
      {
        id: 'ginger',
        name: 'Fresh Ginger',
        category: 'spices',
        tastes: { sweet: 20, sour: 0, salty: 0, pungent: 80, bitter: 0, astringent: 0 },
        thermalEffect: 'heating',
        postDigestiveEffect: 'sweet',
        doshaEffect: { vata: -1, pitta: 1, kapha: -2 }
      },
      {
        id: 'spinach',
        name: 'Spinach',
        category: 'vegetables',
        tastes: { sweet: 20, sour: 0, salty: 0, pungent: 0, bitter: 60, astringent: 20 },
        thermalEffect: 'cooling',
        postDigestiveEffect: 'pungent',
        doshaEffect: { vata: 1, pitta: -1, kapha: -1 }
      },
      {
        id: 'honey',
        name: 'Raw Honey',
        category: 'sweeteners',
        tastes: { sweet: 70, sour: 0, salty: 0, pungent: 0, bitter: 0, astringent: 30 },
        thermalEffect: 'heating',
        postDigestiveEffect: 'sweet',
        doshaEffect: { vata: -1, pitta: 0, kapha: -1 }
      },
      {
        id: 'mung-dal',
        name: 'Mung Dal',
        category: 'legumes',
        tastes: { sweet: 60, sour: 0, salty: 0, pungent: 0, bitter: 0, astringent: 40 },
        thermalEffect: 'cooling',
        postDigestiveEffect: 'sweet',
        doshaEffect: { vata: 0, pitta: -1, kapha: 0 }
      },
      {
        id: 'pomegranate',
        name: 'Pomegranate',
        category: 'fruits',
        tastes: { sweet: 40, sour: 20, salty: 0, pungent: 0, bitter: 0, astringent: 40 },
        thermalEffect: 'cooling',
        postDigestiveEffect: 'sweet',
        doshaEffect: { vata: 0, pitta: -1, kapha: -1 }
      },
      {
        id: 'rock-salt',
        name: 'Rock Salt (Sendha Namak)',
        category: 'minerals',
        tastes: { sweet: 0, sour: 0, salty: 100, pungent: 0, bitter: 0, astringent: 0 },
        thermalEffect: 'heating',
        postDigestiveEffect: 'sweet',
        doshaEffect: { vata: -2, pitta: 0, kapha: 1 }
      }
    ]
  }

  // Helper methods for meal planning
  static suggestFoodsForBalance(currentProfile: TasteProfile, targetConstitution?: string): FoodTasteData[] {
    const deficientTastes = this.getDeficientTastes(currentProfile)
    const foodDatabase = this.getFoodTasteDatabase()
    
    return foodDatabase.filter(food => {
      // Check if food provides deficient tastes
      const hasDeficientTaste = deficientTastes.some(tasteName => {
        const taste = this.getTasteKeyFromName(tasteName)
        return taste && food.tastes[taste] > 30
      })
      
      return hasDeficientTaste
    })
  }

  private static getTasteKeyFromName(tasteName: string): keyof TasteProfile | null {
    const entry = Object.entries(this.TASTE_NAMES).find(([, name]) => name === tasteName)
    return entry ? entry[0] as keyof TasteProfile : null
  }

  static createTasteReport(analysis: TasteAnalysis): string {
    return `
## Six Tastes Analysis Report

### Taste Distribution
- Sweet (Madhura): ${analysis.profile.sweet}%
- Sour (Amla): ${analysis.profile.sour}%
- Salty (Lavana): ${analysis.profile.salty}%
- Pungent (Katu): ${analysis.profile.pungent}%
- Bitter (Tikta): ${analysis.profile.bitter}%
- Astringent (Kashaya): ${analysis.profile.astringent}%

### Balance Assessment
**Status**: ${analysis.balance.toUpperCase()}
**Score**: ${analysis.score}/100

### Dominant Tastes
${analysis.dominantTastes.join(', ') || 'None'}

### Deficient Tastes
${analysis.deficientTastes.join(', ') || 'None'}

### Dosha Impact
- Vata: ${analysis.doshaImpact.vata}
- Pitta: ${analysis.doshaImpact.pitta}
- Kapha: ${analysis.doshaImpact.kapha}

### Recommendations
${analysis.recommendations.map(rec => `• ${rec}`).join('\n')}
    `
  }
}