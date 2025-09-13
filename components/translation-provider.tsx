"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { translateText } from "@/lib/translation"

interface TranslationContextType {
  language: "en" | "hi"
  setLanguage: (lang: "en" | "hi") => void
  t: (text: string, context?: string) => Promise<string>
  isTranslating: boolean
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined)

export const useTranslation = () => {
  const context = useContext(TranslationContext)
  if (!context) {
    throw new Error("useTranslation must be used within a TranslationProvider")
  }
  return context
}

interface TranslationProviderProps {
  children: ReactNode
}

export const TranslationProvider = ({ children }: TranslationProviderProps) => {
  const [language, setLanguage] = useState<"en" | "hi">("en")
  const [isTranslating, setIsTranslating] = useState(false)

  // Load saved language preference
  useEffect(() => {
    const savedLang = localStorage.getItem("ayurvedic_language") as "en" | "hi"
    if (savedLang) {
      setLanguage(savedLang)
    }
  }, [])

  // Save language preference
  useEffect(() => {
    localStorage.setItem("ayurvedic_language", language)
  }, [language])

  const t = async (text: string, context?: string): Promise<string> => {
    if (language === "en") return text

    setIsTranslating(true)
    try {
      const translated = await translateText(text, language, context as any)
      return translated
    } catch (error) {
      console.error("Translation error:", error)
      return text
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t, isTranslating }}>
      {children}
    </TranslationContext.Provider>
  )
}
