"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useAPITranslation } from "@/hooks/use-api-translation"
import { Loader2, Copy, Check } from "lucide-react"

interface TranslationResult {
  translatedText: string
  fromCache: boolean
  service: string
  error?: string
}

export default function TranslationDemo() {
  const [inputText, setInputText] = useState("")
  const [targetLang, setTargetLang] = useState<"hi" | "en">("hi")
  const [context, setContext] = useState("general")
  const [result, setResult] = useState<TranslationResult | null>(null)
  const [copied, setCopied] = useState(false)

  const { translateWithAPI, isTranslating, error } = useAPITranslation({
    fallbackToLocal: true
  })

  const handleTranslate = async () => {
    if (!inputText.trim()) return

    const translationResult = await translateWithAPI(inputText, targetLang, context)
    setResult(translationResult)
  }

  const copyToClipboard = async () => {
    if (result?.translatedText) {
      await navigator.clipboard.writeText(result.translatedText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const sampleTexts = {
    medical: "Patient has vata dosha imbalance and requires kapha-pacifying diet",
    food: "This khichdi contains basmati rice, moong dal, and digestive spices",
    constitution: "Pitta constitution should avoid spicy and oily foods",
    ui: "Create Diet Plan",
    general: "Welcome to our Ayurvedic nutrition platform"
  }

  const loadSample = (category: string) => {
    setInputText(sampleTexts[category as keyof typeof sampleTexts])
    setContext(category)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Translation API Demo</CardTitle>
          <CardDescription>
            Test the enhanced translation system with multiple API fallbacks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Sample Text Buttons */}
          <div className="space-y-2">
            <Label>Quick Sample Texts:</Label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(sampleTexts).map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  onClick={() => loadSample(category)}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* Input Text */}
          <div className="space-y-2">
            <Label htmlFor="input-text">Text to Translate</Label>
            <Textarea
              id="input-text"
              placeholder="Enter text to translate..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={3}
            />
          </div>

          {/* Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Target Language</Label>
              <Select value={targetLang} onValueChange={(value: "hi" | "en") => setTargetLang(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hi">Hindi (हिंदी)</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Context Category</Label>
              <Select value={context} onValueChange={setContext}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="medical">Medical/Ayurvedic</SelectItem>
                  <SelectItem value="food">Food & Nutrition</SelectItem>
                  <SelectItem value="constitution">Constitution</SelectItem>
                  <SelectItem value="ui">User Interface</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Translate Button */}
          <Button 
            onClick={handleTranslate} 
            disabled={!inputText.trim() || isTranslating}
            className="w-full"
          >
            {isTranslating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Translating...
              </>
            ) : (
              "Translate"
            )}
          </Button>

          {/* Error Display */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-4">
                <p className="text-red-600 text-sm">Error: {error}</p>
              </CardContent>
            </Card>
          )}

          {/* Translation Result */}
          {result && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Translation Result</CardTitle>
                  <div className="flex gap-2">
                    <Badge variant={result.fromCache ? "secondary" : "default"}>
                      {result.fromCache ? "Cached" : "Fresh"}
                    </Badge>
                    <Badge variant="outline">
                      {result.service === "api" ? "API" : 
                       result.service === "local" ? "Local" : "Original"}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label>Original Text:</Label>
                  <p className="text-sm text-gray-600 p-2 bg-white rounded border">
                    {inputText}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Translated Text:</Label>
                  <div className="flex items-center gap-2">
                    <p className="text-sm p-2 bg-white rounded border flex-1">
                      {result.translatedText}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyToClipboard}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                {result.error && (
                  <div className="space-y-2">
                    <Label className="text-red-600">Error:</Label>
                    <p className="text-sm text-red-600 p-2 bg-red-100 rounded border">
                      {result.error}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* API Status */}
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Translation Services Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs space-y-1 text-blue-700">
                <p>✓ Local Dictionary: Always available (instant)</p>
                <p>🤖 OpenAI GPT: {process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY ? "✓ Configured (Best for medical)" : "Not configured"}</p>
                <p>🌐 Google Translate: {process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY ? "✓ Configured" : "Not configured"}</p>
                <p>🔷 Microsoft Translator: {process.env.NEXT_PUBLIC_AZURE_TRANSLATOR_KEY ? "✓ Configured" : "Not configured"}</p>
                <p>🔓 LibreTranslate: Available (free)</p>
                <p>💾 MyMemory: Available (free with limits)</p>
                <div className="mt-2 p-2 bg-white rounded text-xs">
                  <strong>Recommendation:</strong> Add OpenAI API key for best medical translations!
                </div>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}
