import { type NextRequest, NextResponse } from "next/server"
import { translateText } from "@/lib/translation"

export async function POST(request: NextRequest) {
  try {
    const { text, targetLang, context } = await request.json()

    if (!text || !targetLang) {
      return NextResponse.json({ error: "Text and target language are required" }, { status: 400 })
    }

    const translatedText = await translateText(text, targetLang, context)

    return NextResponse.json({
      originalText: text,
      translatedText,
      targetLanguage: targetLang,
      context,
    })
  } catch (error) {
    console.error("Translation API error:", error)
    return NextResponse.json({ error: "Translation failed" }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    supportedLanguages: ["en", "hi"],
    categories: ["medical", "food", "constitution", "general", "ui"],
    message: "Translation API is running",
  })
}
