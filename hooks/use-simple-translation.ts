"use client"

import { useTranslation } from "@/components/translation-provider"
import { ayurvedicTranslations } from "@/lib/translation"

// Simple synchronous translation hook for common UI elements
export const useSimpleTranslation = () => {
  const { language } = useTranslation()

  // Create a map for quick lookups
  const translationMap = new Map<string, string>()
  
  ayurvedicTranslations.forEach(entry => {
    if (language === "hi") {
      translationMap.set(entry.en.toLowerCase(), entry.hi)
    } else {
      translationMap.set(entry.hi, entry.en)
    }
  })

  const ts = (text: string): string => {
    if (language === "en") return text
    
    // Try exact match first
    const lowerText = text.toLowerCase()
    if (translationMap.has(lowerText)) {
      return translationMap.get(lowerText) || text
    }
    
    // Try word-by-word translation for simple phrases
    const words = text.split(" ")
    const translatedWords = words.map(word => {
      const cleanWord = word.toLowerCase().replace(/[^\w\s]/g, "")
      return translationMap.get(cleanWord) || word
    })
    
    const result = translatedWords.join(" ")
    return result !== text ? result : text
  }

  return { ts, language }
}

// Common UI translations
export const commonTranslations = {
  // Navigation
  dashboard: { en: "Dashboard", hi: "डैशबोर्ड" },
  patients: { en: "Patients", hi: "रोगी" },
  foods: { en: "Foods", hi: "खाद्य पदार्थ" },
  recipes: { en: "Recipes", hi: "व्यंजन" },
  exercises: { en: "Exercises", hi: "व्यायाम" },
  reports: { en: "Reports", hi: "रिपोर्ट" },
  "diet-charts": { en: "Diet Charts", hi: "आहार चार्ट" },
  "diet-plans": { en: "Diet Plans", hi: "आहार योजना" },
  
  // Common actions
  search: { en: "Search", hi: "खोजें" },
  filter: { en: "Filter", hi: "फिल्टर" },
  add: { en: "Add", hi: "जोड़ें" },
  edit: { en: "Edit", hi: "संपादित करें" },
  delete: { en: "Delete", hi: "हटाएं" },
  save: { en: "Save", hi: "सहेजें" },
  cancel: { en: "Cancel", hi: "रद्द करें" },
  view: { en: "View", hi: "देखें" },
  create: { en: "Create", hi: "बनाएं" },
  generate: { en: "Generate", hi: "उत्पन्न करें" },
  export: { en: "Export", hi: "निर्यात करें" },
  download: { en: "Download", hi: "डाउनलोड करें" },
  
  // Common labels
  name: { en: "Name", hi: "नाम" },
  age: { en: "Age", hi: "आयु" },
  gender: { en: "Gender", hi: "लिंग" },
  constitution: { en: "Constitution", hi: "प्रकृति" },
  condition: { en: "Condition", hi: "स्थिति" },
  description: { en: "Description", hi: "विवरण" },
  status: { en: "Status", hi: "स्थिति" },
  date: { en: "Date", hi: "दिनांक" },
  time: { en: "Time", hi: "समय" },
  
  // Status labels
  active: { en: "Active", hi: "सक्रिय" },
  inactive: { en: "Inactive", hi: "निष्क्रिय" },
  completed: { en: "Completed", hi: "पूर्ण" },
  pending: { en: "Pending", hi: "लंबित" },
  loading: { en: "Loading", hi: "लोड हो रहा है" },
  
  // Messages
  "no-data": { en: "No data available", hi: "कोई डेटा उपलब्ध नहीं" },
  "loading-data": { en: "Loading data...", hi: "डेटा लोड हो रहा है..." },
  success: { en: "Success", hi: "सफलता" },
  error: { en: "Error", hi: "त्रुटि" },
  warning: { en: "Warning", hi: "चेतावनी" },
  
  // Ayurvedic terms
  vata: { en: "Vata", hi: "वात" },
  pitta: { en: "Pitta", hi: "पित्त" },
  kapha: { en: "Kapha", hi: "कफ" },
  tridoshic: { en: "Tridoshic", hi: "त्रिदोषिक" },
  
  // Meal types
  breakfast: { en: "Breakfast", hi: "नाश्ता" },
  lunch: { en: "Lunch", hi: "दोपहर का खाना" },
  dinner: { en: "Dinner", hi: "रात का खाना" },
  snacks: { en: "Snacks", hi: "नाश्ता" },
  
  // Form labels
  "select-patient": { en: "Select Patient", hi: "रोगी चुनें" },
  "select-option": { en: "Select Option", hi: "विकल्प चुनें" },
  "enter-search": { en: "Enter search term", hi: "खोज शब्द दर्ज करें" },
  
  // Buttons
  "generate-ai-chart": { en: "Generate AI Chart", hi: "AI चार्ट बनाएं" },
  "generate-weekly-chart": { en: "Generate Weekly Chart", hi: "साप्ताहिक चार्ट बनाएं" },
  "save-diet-chart": { en: "Save Diet Chart", hi: "आहार चार्ट सहेजें" },
  "export-pdf": { en: "Export PDF", hi: "PDF निर्यात करें" },
}

// Helper function to get translation
export const getTranslation = (key: keyof typeof commonTranslations, language: "en" | "hi") => {
  return commonTranslations[key]?.[language] || key
}