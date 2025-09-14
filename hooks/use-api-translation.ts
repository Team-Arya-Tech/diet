import { useState, useCallback } from "react"

interface UseAPITranslationOptions {
  fallbackToLocal?: boolean
  cache?: boolean
}

interface TranslationResult {
  translatedText: string
  fromCache: boolean
  service: string
  error?: string
}

export const useAPITranslation = (options: UseAPITranslationOptions = {}) => {
  const [isTranslating, setIsTranslating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const translateWithAPI = useCallback(async (
    text: string,
    targetLang: "hi" | "en",
    context?: string
  ): Promise<TranslationResult> => {
    if (!text.trim()) {
      return {
        translatedText: text,
        fromCache: false,
        service: "none",
      }
    }

    setIsTranslating(true)
    setError(null)

    try {
      // Try API translation first
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          targetLang,
          context,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        return {
          translatedText: data.translatedText,
          fromCache: data.cached || false,
          service: "api",
        }
      } else {
        throw new Error(`API translation failed: ${response.statusText}`)
      }
    } catch (apiError) {
      console.warn("API translation failed:", apiError)
      setError(apiError instanceof Error ? apiError.message : "Unknown error")

      // Fallback to local translation if enabled
      if (options.fallbackToLocal) {
        try {
          const { translateWithCache } = await import("@/lib/translation")
          const translatedText = await translateWithCache(text, targetLang, context)
          return {
            translatedText,
            fromCache: false,
            service: "local",
          }
        } catch (localError) {
          console.warn("Local translation fallback failed:", localError)
          return {
            translatedText: text,
            fromCache: false,
            service: "none",
            error: "All translation methods failed",
          }
        }
      }

      return {
        translatedText: text,
        fromCache: false,
        service: "none",
        error: apiError instanceof Error ? apiError.message : "Unknown error",
      }
    } finally {
      setIsTranslating(false)
    }
  }, [options.fallbackToLocal])

  const batchTranslate = useCallback(async (
    texts: string[],
    targetLang: "hi" | "en",
    context?: string
  ): Promise<TranslationResult[]> => {
    setIsTranslating(true)
    setError(null)

    try {
      // Translate all texts in parallel
      const promises = texts.map(text => translateWithAPI(text, targetLang, context))
      const results = await Promise.all(promises)
      return results
    } catch (error) {
      console.error("Batch translation failed:", error)
      setError(error instanceof Error ? error.message : "Batch translation failed")
      // Return original texts if batch fails
      return texts.map(text => ({
        translatedText: text,
        fromCache: false,
        service: "none",
        error: "Batch translation failed",
      }))
    } finally {
      setIsTranslating(false)
    }
  }, [translateWithAPI])

  return {
    translateWithAPI,
    batchTranslate,
    isTranslating,
    error,
    clearError: () => setError(null),
  }
}

// Utility function for quick inline translations
export const quickTranslate = async (
  text: string,
  targetLang: "hi" | "en",
  context?: string
): Promise<string> => {
  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        targetLang,
        context,
      }),
    })

    if (response.ok) {
      const data = await response.json()
      return data.translatedText
    } else {
      console.warn("Quick translate API failed, using fallback")
      const { translateWithCache } = await import("@/lib/translation")
      return await translateWithCache(text, targetLang, context)
    }
  } catch (error) {
    console.warn("Quick translate failed:", error)
    return text
  }
}
