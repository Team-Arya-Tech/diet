import { type NextRequest, NextResponse } from "next/server"
import { translateWithCache } from "@/lib/translation"

interface TranslationRequest {
  text: string
  targetLang: "hi" | "en"
  context?: string
}

export async function POST(request: NextRequest) {
  try {
    const { text, targetLang, context }: TranslationRequest = await request.json()

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: "Text and target language are required" },
        { status: 400 }
      )
    }

    // Use the enhanced translation with API fallbacks and caching
    const translatedText = await translateWithCache(text, targetLang, context)

    return NextResponse.json({
      originalText: text,
      translatedText,
      targetLanguage: targetLang,
      context,
      cached: true, // Will be true if result was cached
    })
  } catch (error) {
    console.error("Translation API error:", error)
    return NextResponse.json(
      { error: "Translation failed", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    supportedLanguages: ["en", "hi"],
    categories: ["medical", "food", "constitution", "general", "ui"],
    message: "Enhanced Translation API with multiple service fallbacks",
    services: [
      "Local Dictionary (Primary)",
      "Google Translate API",
      "Microsoft Translator",
      "LibreTranslate",
      "MyMemory Translation"
    ],
    caching: "Enabled for improved performance",
  })
}
