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
      className="flex items-center space-x-2"
    >
      <Languages className="h-4 w-4" />
      <span>{language === "en" ? "हिंदी" : "English"}</span>
    </Button>
  )
}
