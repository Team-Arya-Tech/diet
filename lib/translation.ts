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

// Enhanced translation function with context awareness
export const translateText = async (
  text: string,
  targetLang: "hi" | "en",
  context?: "medical" | "food" | "constitution" | "general" | "ui",
): Promise<string> => {
  if (!text) return text

  // For simple word translations, use our dictionary
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

  // For complex sentences, return original text with a note
  // In a real implementation, this would call a translation API
  return text
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
export const formatTextForLanguage = (text: string, language: "en" | "hi"): string => {
  if (language === "hi" && !isHindiText(text)) {
    // If displaying in Hindi but text is English, try to translate
    return translateText(text, "hi")
      .then((result) => result)
      .catch(() => text)
  }
  return text
}
