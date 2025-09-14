// Enhanced translation system for Ayurvedic terms and content
export interface TranslationEntry {
  en: string
  hi: string
  category: "medical" | "food" | "constitution" | "general" | "ui"
}

// Comprehensive Ayurvedic translation dictionary
export const ayurvedicTranslations: TranslationEntry[] = [
  // Constitution terms
  { en: "Vata", hi: "वात", category: "constitution" },
  { en: "Pitta", hi: "पित्त", category: "constitution" },
  { en: "Kapha", hi: "कफ", category: "constitution" },
  { en: "Tridoshic", hi: "त्रिदोषिक", category: "constitution" },

  // Taste terms (Rasa)
  { en: "Sweet", hi: "मधुर", category: "food" },
  { en: "Sour", hi: "अम्ल", category: "food" },
  { en: "Salty", hi: "लवण", category: "food" },
  { en: "Pungent", hi: "कटु", category: "food" },
  { en: "Bitter", hi: "तिक्त", category: "food" },
  { en: "Astringent", hi: "कषाय", category: "food" },

  // Quality terms (Guna)
  { en: "Light", hi: "लघु", category: "food" },
  { en: "Heavy", hi: "गुरु", category: "food" },
  { en: "Hot", hi: "उष्ण", category: "food" },
  { en: "Cold", hi: "शीत", category: "food" },
  { en: "Dry", hi: "रूक्ष", category: "food" },
  { en: "Oily", hi: "स्निग्ध", category: "food" },

  // Potency terms (Veerya)
  { en: "Heating", hi: "उष्ण वीर्य", category: "food" },
  { en: "Cooling", hi: "शीत वीर्य", category: "food" },
  { en: "Warm", hi: "उष्ण", category: "food" },
  { en: "Cool", hi: "शीत", category: "food" },

  // Post-digestive effect (Vipaka)
  { en: "Sweet", hi: "मधुर विपाक", category: "food" },
  { en: "Sour", hi: "अम्ल विपाक", category: "food" },
  { en: "Pungent", hi: "कटु विपाक", category: "food" },

  // Common foods
  { en: "Turmeric", hi: "हल्दी", category: "food" },
  { en: "Ginger", hi: "अदरक", category: "food" },
  { en: "Ghee", hi: "घी", category: "food" },
  { en: "Rice", hi: "चावल", category: "food" },
  { en: "Wheat", hi: "गेहूं", category: "food" },
  { en: "Milk", hi: "दूध", category: "food" },
  { en: "Honey", hi: "शहद", category: "food" },
  { en: "Almonds", hi: "बादाम", category: "food" },
  { en: "Coconut", hi: "नारियल", category: "food" },
  { en: "Spinach", hi: "पालक", category: "food" },
  { en: "Cucumber", hi: "खीरा", category: "food" },
  { en: "Pomegranate", hi: "अनार", category: "food" },
  { en: "Dates", hi: "खजूर", category: "food" },
  { en: "Fennel", hi: "सौंफ", category: "food" },
  { en: "Cumin", hi: "जीरा", category: "food" },
  { en: "Coriander", hi: "धनिया", category: "food" },
  { en: "Cardamom", hi: "इलायची", category: "food" },
  { en: "Cinnamon", hi: "दालचीनी", category: "food" },
  { en: "Black Pepper", hi: "काली मिर्च", category: "food" },
  { en: "Fenugreek", hi: "मेथी", category: "food" },
  { en: "Bitter Gourd", hi: "करेला", category: "food" },
  { en: "Bottle Gourd", hi: "लौकी", category: "food" },
  { en: "Mung Beans", hi: "मूंग दाल", category: "food" },
  { en: "Chickpeas", hi: "चना", category: "food" },
  { en: "Lentils", hi: "दाल", category: "food" },
  { en: "Sesame Seeds", hi: "तिल", category: "food" },
  { en: "Mustard Seeds", hi: "सरसों", category: "food" },

  // Herbs and medicines
  { en: "Ashwagandha", hi: "अश्वगंधा", category: "medical" },
  { en: "Brahmi", hi: "ब्राह्मी", category: "medical" },
  { en: "Tulsi", hi: "तुलसी", category: "medical" },
  { en: "Neem", hi: "नीम", category: "medical" },
  { en: "Triphala", hi: "त्रिफला", category: "medical" },
  { en: "Shatavari", hi: "शतावरी", category: "medical" },
  { en: "Guduchi", hi: "गुडूची", category: "medical" },
  { en: "Amalaki", hi: "आमलकी", category: "medical" },

  // Medical terms
  { en: "Digestion", hi: "पाचन", category: "medical" },
  { en: "Immunity", hi: "प्रतिरक्षा", category: "medical" },
  { en: "Inflammation", hi: "सूजन", category: "medical" },
  { en: "Diabetes", hi: "मधुमेह", category: "medical" },
  { en: "Hypertension", hi: "उच्च रक्तचाप", category: "medical" },
  { en: "Anemia", hi: "खून की कमी", category: "medical" },
  { en: "Constipation", hi: "कब्ज", category: "medical" },
  { en: "Diarrhea", hi: "दस्त", category: "medical" },
  { en: "Nausea", hi: "मतली", category: "medical" },
  { en: "Headache", hi: "सिरदर्द", category: "medical" },
  { en: "Joint Pain", hi: "जोड़ों का दर्द", category: "medical" },
  { en: "Respiratory Issues", hi: "सांस की समस्या", category: "medical" },
  { en: "Skin Disorders", hi: "त्वचा रोग", category: "medical" },
  { en: "Weakness", hi: "कमजोरी", category: "medical" },
  { en: "Obesity", hi: "मोटापा", category: "medical" },
  { en: "Stress", hi: "तनाव", category: "medical" },
  { en: "Insomnia", hi: "अनिद्रा", category: "medical" },
  { en: "Acidity", hi: "अम्लता", category: "medical" },
  { en: "Fever", hi: "बुखार", category: "medical" },
  { en: "Cold", hi: "सर्दी", category: "medical" },
  { en: "Cough", hi: "खांसी", category: "medical" },

  // General terms
  { en: "Patient", hi: "रोगी", category: "general" },
  { en: "Diet", hi: "आहार", category: "general" },
  { en: "Food", hi: "भोजन", category: "general" },
  { en: "Health", hi: "स्वास्थ्य", category: "general" },
  { en: "Medicine", hi: "दवा", category: "general" },
  { en: "Treatment", hi: "उपचार", category: "general" },
  { en: "Consultation", hi: "परामर्श", category: "general" },
  { en: "Prescription", hi: "नुस्खा", category: "general" },
  { en: "Lifestyle", hi: "जीवनशैली", category: "general" },
  { en: "Exercise", hi: "व्यायाम", category: "general" },
  { en: "Meditation", hi: "ध्यान", category: "general" },
  { en: "Yoga", hi: "योग", category: "general" },
  { en: "Sleep", hi: "नींद", category: "general" },
  { en: "Water", hi: "पानी", category: "general" },
  { en: "Morning", hi: "सुबह", category: "general" },
  { en: "Afternoon", hi: "दोपहर", category: "general" },
  { en: "Evening", hi: "शाम", category: "general" },
  { en: "Night", hi: "रात", category: "general" },
  { en: "Breakfast", hi: "नाश्ता", category: "general" },
  { en: "Lunch", hi: "दोपहर का खाना", category: "general" },
  { en: "Dinner", hi: "रात का खाना", category: "general" },
  { en: "Snacks", hi: "नाश्ता", category: "general" },

  // UI terms
  { en: "Search", hi: "खोजें", category: "ui" },
  { en: "Filter", hi: "फिल्टर", category: "ui" },
  { en: "Add", hi: "जोड़ें", category: "ui" },
  { en: "Edit", hi: "संपादित करें", category: "ui" },
  { en: "Delete", hi: "हटाएं", category: "ui" },
  { en: "Save", hi: "सहेजें", category: "ui" },
  { en: "Cancel", hi: "रद्द करें", category: "ui" },
  { en: "View", hi: "देखें", category: "ui" },
  { en: "Create", hi: "बनाएं", category: "ui" },
  { en: "Generate", hi: "उत्पन्न करें", category: "ui" },
  { en: "Back", hi: "वापस", category: "ui" },
  { en: "Next", hi: "अगला", category: "ui" },
  { en: "Previous", hi: "पिछला", category: "ui" },
  { en: "Submit", hi: "जमा करें", category: "ui" },
  { en: "Loading", hi: "लोड हो रहा है", category: "ui" },
  { en: "Error", hi: "त्रुटि", category: "ui" },
  { en: "Success", hi: "सफलता", category: "ui" },
  { en: "Warning", hi: "चेतावनी", category: "ui" },
  { en: "Information", hi: "जानकारी", category: "ui" },
]

// Create translation maps for quick lookup
const enToHiMap = new Map<string, string>()
const hiToEnMap = new Map<string, string>()

ayurvedicTranslations.forEach((entry) => {
  enToHiMap.set(entry.en.toLowerCase(), entry.hi)
  hiToEnMap.set(entry.hi, entry.en)
})

// Enhanced translation function with API integration
export const translateText = async (
  text: string,
  targetLang: "hi" | "en",
  context?: "medical" | "food" | "constitution" | "general" | "ui",
): Promise<string> => {
  if (!text) return text

  // For simple word translations, use our dictionary first
  const sourceMap = targetLang === "hi" ? enToHiMap : hiToEnMap
  const lowerText = text.toLowerCase()

  // Check for exact matches first
  if (sourceMap.has(lowerText)) {
    return sourceMap.get(lowerText) || text
  }

  // For phrases and sentences, do word-by-word translation
  const words = text.split(" ")
  const translatedWords = words.map((word) => {
    const cleanWord = word.toLowerCase().replace(/[^\w\s]/g, "")
    return sourceMap.get(cleanWord) || word
  })

  // If any words were translated, return the result
  const translatedText = translatedWords.join(" ")
  if (translatedText !== text) {
    return translatedText
  }

  // For complex sentences, try API translation
  try {
    return await translateWithAPI(text, targetLang, context)
  } catch (error) {
    console.warn("API translation failed, returning original text:", error)
    return text
  }
}

// API translation function using multiple services
const translateWithAPI = async (
  text: string,
  targetLang: "hi" | "en",
  context?: string
): Promise<string> => {
  // Try different translation APIs in order of preference
  
  // 1. Try OpenAI GPT (best for context-aware medical translations)
  try {
    return await openAITranslate(text, targetLang, context)
  } catch (error) {
    console.warn("OpenAI translation failed:", error)
  }

  // 2. Try Google Translate API
  try {
    return await googleTranslate(text, targetLang)
  } catch (error) {
    console.warn("Google Translate failed:", error)
  }

  // 3. Try Microsoft Translator API
  try {
    return await microsoftTranslate(text, targetLang)
  } catch (error) {
    console.warn("Microsoft Translator failed:", error)
  }

  // 4. Try LibreTranslate (free/open source)
  try {
    return await libreTranslate(text, targetLang)
  } catch (error) {
    console.warn("LibreTranslate failed:", error)
  }

  // 5. Try MyMemory Translation API (free)
  try {
    return await myMemoryTranslate(text, targetLang)
  } catch (error) {
    console.warn("MyMemory Translate failed:", error)
  }

  // If all APIs fail, return original text
  throw new Error("All translation APIs failed")
}

// OpenAI GPT translation implementation (best for context-aware medical translations)
const openAITranslate = async (text: string, targetLang: "hi" | "en", context?: string): Promise<string> => {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY
  if (!apiKey) throw new Error("OpenAI API key not configured")

  const sourceLang = targetLang === "hi" ? "English" : "Hindi"
  const targetLanguage = targetLang === "hi" ? "Hindi" : "English"
  
  // Create context-specific prompts for better translations
  const contextPrompts = {
    medical: `You are an expert medical translator specializing in Ayurvedic medicine. Translate the following ${sourceLang} text to ${targetLanguage}. Maintain medical accuracy and use appropriate Ayurvedic terminology. If there are Sanskrit terms, provide both the transliteration and meaning.`,
    food: `You are a nutrition and culinary translator. Translate the following ${sourceLang} text about food and nutrition to ${targetLanguage}. Keep food names authentic and explain any cultural food terms.`,
    constitution: `You are an Ayurvedic constitution expert. Translate the following ${sourceLang} text about body constitution (prakriti/vikriti) to ${targetLanguage}. Maintain the traditional Ayurvedic terminology while making it understandable.`,
    ui: `Translate this user interface text from ${sourceLang} to ${targetLanguage}. Keep it concise and user-friendly.`,
    general: `Translate the following ${sourceLang} text to ${targetLanguage}. Maintain the original meaning and tone.`
  }

  const systemPrompt = contextPrompts[context as keyof typeof contextPrompts] || contextPrompts.general

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini", // More cost-effective for translations
      messages: [
        {
          role: "system",
          content: `${systemPrompt}\n\nIMPORTANT: Return ONLY the translated text, no explanations or additional content.`
        },
        {
          role: "user",
          content: text
        }
      ],
      max_tokens: 500,
      temperature: 0.3, // Lower temperature for more consistent translations
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  
  if (data.choices && data.choices[0] && data.choices[0].message) {
    return data.choices[0].message.content.trim()
  } else {
    throw new Error("Invalid response from OpenAI API")
  }
}

// Google Translate API implementation
const googleTranslate = async (text: string, targetLang: "hi" | "en"): Promise<string> => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY
  if (!apiKey) throw new Error("Google Translate API key not configured")

  const response = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: targetLang === "hi" ? "en" : "hi",
        target: targetLang,
        format: "text",
      }),
    }
  )

  if (!response.ok) throw new Error("Google Translate API request failed")

  const data = await response.json()
  return data.data.translations[0].translatedText
}

// Microsoft Translator API implementation
const microsoftTranslate = async (text: string, targetLang: "hi" | "en"): Promise<string> => {
  const apiKey = process.env.NEXT_PUBLIC_AZURE_TRANSLATOR_KEY
  const region = process.env.NEXT_PUBLIC_AZURE_TRANSLATOR_REGION || "global"
  
  if (!apiKey) throw new Error("Azure Translator API key not configured")

  const response = await fetch(
    `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&to=${targetLang}`,
    {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey,
        "Ocp-Apim-Subscription-Region": region,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{ text }]),
    }
  )

  if (!response.ok) throw new Error("Microsoft Translator API request failed")

  const data = await response.json()
  return data[0].translations[0].text
}

// LibreTranslate API implementation (free/open source)
const libreTranslate = async (text: string, targetLang: "hi" | "en"): Promise<string> => {
  const apiUrl = process.env.NEXT_PUBLIC_LIBRETRANSLATE_URL || "https://libretranslate.de"
  const apiKey = process.env.NEXT_PUBLIC_LIBRETRANSLATE_API_KEY

  const body: any = {
    q: text,
    source: targetLang === "hi" ? "en" : "hi",
    target: targetLang,
    format: "text",
  }

  if (apiKey) {
    body.api_key = apiKey
  }

  const response = await fetch(`${apiUrl}/translate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })

  if (!response.ok) throw new Error("LibreTranslate API request failed")

  const data = await response.json()
  return data.translatedText
}

// MyMemory Translation API (free with limits)
const myMemoryTranslate = async (text: string, targetLang: "hi" | "en"): Promise<string> => {
  const sourceLang = targetLang === "hi" ? "en" : "hi"
  const email = process.env.NEXT_PUBLIC_MYMEMORY_EMAIL || "test@example.com"

  const response = await fetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${sourceLang}|${targetLang}&de=${email}`,
    {
      method: "GET",
    }
  )

  if (!response.ok) throw new Error("MyMemory API request failed")

  const data = await response.json()
  
  if (data.responseStatus === 200) {
    return data.responseData.translatedText
  } else {
    throw new Error("MyMemory translation failed")
  }
}

// Cached translation to avoid repeated API calls
const translationCache = new Map<string, string>()

const getCacheKey = (text: string, targetLang: string, context?: string): string => {
  return `${text}_${targetLang}_${context || 'default'}`
}

export const translateWithCache = async (
  text: string,
  targetLang: "hi" | "en",
  context?: string
): Promise<string> => {
  const cacheKey = getCacheKey(text, targetLang, context)
  
  // Check cache first
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!
  }

  // Translate and cache result
  const translated = await translateText(text, targetLang, context as any)
  translationCache.set(cacheKey, translated)
  
  return translated
}

// Translate Ayurvedic food properties
export const translateFoodProperties = async (food: any, targetLang: "hi" | "en"): Promise<any> => {
  const translated = { ...food }

  if (targetLang === "hi") {
    translated.Food = await translateText(food.Food, "hi", "food")
    translated.Rasa = await translateText(food.Rasa, "hi", "food")
    translated.Guna = await translateText(food.Guna, "hi", "food")
    translated.Veerya = await translateText(food.Veerya, "hi", "food")
    translated.Vipaka = await translateText(food.Vipaka, "hi", "food")
    translated.Pathya = await translateText(food.Pathya, "hi", "medical")
    translated.Apathya = await translateText(food.Apathya, "hi", "medical")
  }

  return translated
}

// Get translation for specific category
export const getTranslationsByCategory = (category: TranslationEntry["category"]): TranslationEntry[] => {
  return ayurvedicTranslations.filter((entry) => entry.category === category)
}

// Batch translate multiple texts
export const batchTranslate = async (
  texts: string[],
  targetLang: "hi" | "en",
  context?: TranslationEntry["category"],
): Promise<string[]> => {
  return Promise.all(texts.map((text) => translateText(text, targetLang, context)))
}

// Get available languages
export const getAvailableLanguages = () => [
  { code: "en", name: "English", nativeName: "English" },
  { code: "hi", name: "Hindi", nativeName: "हिंदी" },
]

// Detect if text contains Hindi characters
export const isHindiText = (text: string): boolean => {
  const hindiRegex = /[\u0900-\u097F]/
  return hindiRegex.test(text)
}

// Format text for display in specific language
export const formatTextForLanguage = async (text: string, language: "en" | "hi"): Promise<string> => {
  if (language === "hi" && !isHindiText(text)) {
    // If displaying in Hindi but text is English, try to translate
    try {
      return await translateText(text, "hi")
    } catch {
      return text
    }
  }
  return text
}
