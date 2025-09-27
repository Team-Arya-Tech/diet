"use client"

import { Button } from "@/components/ui/button"
import { Languages } from "lucide-react"
import { useTranslation } from "./translation-provider"

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useTranslation()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setLanguage(language === "en" ? "hi" : "en")}
      className="flex items-center space-x-2 relative"
    >
      <Languages className="h-4 w-4" />
      <span>{language === "en" ? "हिंदी" : "English"}</span>
      {/* Ayurveda leaf accent */}
      <svg
        className="absolute -top-2 -right-2 w-3 h-3 opacity-30 text-primary pointer-events-none select-none"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 2C12 2 20 8 20 14C20 18 16 22 12 22C8 22 4 18 4 14C4 8 12 2 12 2Z" />
        <path d="M12 8V14" />
      </svg>
    </Button>
  )
}
