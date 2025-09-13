// AI assistant for Ayurvedic diet guidance using provided data
import { type AyurvedicFood, type FoodCategory, getAllFoods } from "./ayurvedic-data"
import type { Patient } from "./database"

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  language: "en" | "hi"
}

export interface AyurvedicContext {
  foods: AyurvedicFood[]
  categories: FoodCategory[]
  patients?: Patient[]
}

// Generate AI response based on Ayurvedic knowledge
export const generateAyurvedicResponse = async (
  userMessage: string,
  context: AyurvedicContext,
  language: "en" | "hi" = "en",
): Promise<string> => {
  const lowerMessage = userMessage.toLowerCase()

  // Food-related queries
  if (lowerMessage.includes("food") || lowerMessage.includes("eat") || lowerMessage.includes("diet")) {
    return handleFoodQuery(userMessage, context, language)
  }

  // Constitution-related queries
  if (
    lowerMessage.includes("vata") ||
    lowerMessage.includes("pitta") ||
    lowerMessage.includes("kapha") ||
    lowerMessage.includes("constitution") ||
    lowerMessage.includes("dosha")
  ) {
    return handleConstitutionQuery(userMessage, context, language)
  }

  // Condition-related queries
  if (
    lowerMessage.includes("diabetes") ||
    lowerMessage.includes("hypertension") ||
    lowerMessage.includes("obesity") ||
    lowerMessage.includes("digestion") ||
    lowerMessage.includes("immunity") ||
    lowerMessage.includes("stress")
  ) {
    return handleConditionQuery(userMessage, context, language)
  }

  // General Ayurvedic guidance
  return handleGeneralQuery(userMessage, context, language)
}

// Handle food-related queries
const handleFoodQuery = (message: string, context: AyurvedicContext, language: "en" | "hi"): string => {
  const { foods } = context
  const lowerMessage = message.toLowerCase()

  // Extract food names mentioned in the query
  const mentionedFoods = foods.filter((food) => lowerMessage.includes(food.Food.toLowerCase()))

  if (mentionedFoods.length > 0) {
    const food = mentionedFoods[0]
    return language === "en"
      ? `${food.Food} has ${food.Rasa} taste and ${food.Veerya} potency. It ${food["Dosha Effect"]} and is beneficial for ${food.Pathya}. However, it should be avoided in cases of ${food.Apathya}. The digestibility is ${food.Digestibility}.`
      : `${food.Food} का स्वाद ${food.Rasa} है और ${food.Veerya} वीर्य है। यह ${food["Dosha Effect"]} और ${food.Pathya} के लिए लाभकारी है। हालांकि, ${food.Apathya} की स्थिति में इससे बचना चाहिए। पाचनशक्ति ${food.Digestibility} है।`
  }

  // General food advice based on query keywords
  if (lowerMessage.includes("weight loss")) {
    return language === "en"
      ? "For weight loss, focus on foods that reduce Kapha dosha like bitter gourd, barley, millet, and green vegetables. Avoid heavy, oily, and sweet foods. Include warming spices like ginger, black pepper, and turmeric."
      : "वजन घटाने के लिए, कफ दोष को कम करने वाले खाद्य पदार्थों पर ध्यान दें जैसे करेला, जौ, बाजरा, और हरी सब्जियां। भारी, तेल युक्त, और मीठे खाद्य पदार्थों से बचें। अदरक, काली मिर्च, और हल्दी जैसे गर्म मसालों को शामिल करें।"
  }

  if (lowerMessage.includes("digestion")) {
    return language === "en"
      ? "For better digestion, include digestive spices like ginger, cumin, fennel, and coriander. Eat warm, cooked foods and avoid cold, raw foods. Drink warm water and eat at regular times."
      : "बेहतर पाचन के लिए, अदरक, जीरा, सौंफ, और धनिया जैसे पाचक मसालों को शामिल करें। गर्म, पका हुआ भोजन खाएं और ठंडे, कच्चे भोजन से बचें। गर्म पानी पिएं और नियमित समय पर खाना खाएं।"
  }

  return language === "en"
    ? "I can help you with Ayurvedic food recommendations. Please ask about specific foods, health conditions, or dietary goals."
    : "मैं आयुर्वेदिक भोजन की सिफारिशों में आपकी मदद कर सकता हूं। कृपया विशिष्ट खाद्य पदार्थों, स्वास्थ्य स्थितियों, या आहार लक्ष्यों के बारे में पूछें।"
}

// Handle constitution-related queries
const handleConstitutionQuery = (message: string, context: AyurvedicContext, language: "en" | "hi"): string => {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("vata")) {
    return language === "en"
      ? "Vata constitution benefits from warm, moist, and grounding foods. Include cooked grains, warm milk, ghee, nuts, and sweet fruits. Avoid cold, dry, and raw foods. Maintain regular meal times and stay hydrated with warm liquids."
      : "वात संविधान को गर्म, नम, और स्थिर करने वाले खाद्य पदार्थों से लाभ होता है। पके हुए अनाज, गर्म दूध, घी, मेवे, और मीठे फल शामिल करें। ठंडे, सूखे, और कच्चे खाद्य पदार्थों से बचें। नियमित भोजन समय बनाए रखें और गर्म तरल पदार्थों से हाइड्रेटेड रहें।"
  }

  if (lowerMessage.includes("pitta")) {
    return language === "en"
      ? "Pitta constitution benefits from cooling, sweet, and bitter foods. Include fresh fruits, vegetables, milk, ghee, and cooling herbs. Avoid spicy, sour, and fried foods. Eat in a calm environment and avoid eating when angry or stressed."
      : "पित्त संविधान को ठंडे, मीठे, और कड़वे खाद्य पदार्थों से लाभ होता है। ताजे फल, सब्जियां, दूध, घी, और ठंडी जड़ी-बूटियां शामिल करें। मसालेदार, खट्टे, और तले हुए खाद्य पदार्थों से बचें। शांत वातावरण में खाना खाएं और गुस्से या तनाव में खाने से बचें।"
  }

  if (lowerMessage.includes("kapha")) {
    return language === "en"
      ? "Kapha constitution benefits from light, warm, and spicy foods. Include vegetables, legumes, warming spices, and bitter tastes. Avoid heavy, oily, cold, and sweet foods. Exercise before meals and avoid overeating."
      : "कफ संविधान को हल्के, गर्म, और मसालेदार खाद्य पदार्थों से लाभ होता है। सब्जियां, दालें, गर्म मसाले, और कड़वे स्वाद शामिल करें। भारी, तेल युक्त, ठंडे, और मीठे खाद्य पदार्थों से बचें। भोजन से पहले व्यायाम करें और अधिक खाने से बचें।"
  }

  return language === "en"
    ? "Each constitution (Vata, Pitta, Kapha) has specific dietary needs. Vata needs warming foods, Pitta needs cooling foods, and Kapha needs light, spicy foods. What's your constitution?"
    : "प्रत्येक संविधान (वात, पित्त, कफ) की विशिष्ट आहार आवश्यकताएं होती हैं। वात को गर्म भोजन, पित्त को ठंडे भोजन, और कफ को हल्के, मसालेदार भोजन की आवश्यकता होती है। आपका संविधान क्या है?"
}

// Handle condition-specific queries
const handleConditionQuery = (message: string, context: AyurvedicContext, language: "en" | "hi"): string => {
  const lowerMessage = message.toLowerCase()
  const { categories } = context

  // Find relevant categories for the condition
  const relevantCategories = categories.filter(
    (cat) =>
      cat["Sub-Category"].toLowerCase().includes(lowerMessage) ||
      cat["Recommended Foods"].toLowerCase().includes(lowerMessage) ||
      cat.Reason.toLowerCase().includes(lowerMessage),
  )

  if (relevantCategories.length > 0) {
    const category = relevantCategories[0]
    return language === "en"
      ? `For ${category["Sub-Category"]}, I recommend: ${category["Recommended Foods"]}. Avoid: ${category["Avoid Foods"]}. Reason: ${category.Reason}. Meal suggestions: ${category["Meal Suggestions"]}`
      : `${category["Sub-Category"]} के लिए, मैं सुझाता हूं: ${category["Recommended Foods"]}। बचें: ${category["Avoid Foods"]}। कारण: ${category.Reason}। भोजन सुझाव: ${category["Meal Suggestions"]}`
  }

  // General condition advice
  if (lowerMessage.includes("diabetes")) {
    return language === "en"
      ? "For diabetes management, focus on bitter foods like bitter gourd, fenugreek, turmeric, and barley. Avoid refined sugars, white rice, and processed foods. Include fiber-rich vegetables and maintain regular meal timing."
      : "मधुमेह प्रबंधन के लिए, करेला, मेथी, हल्दी, और जौ जैसे कड़वे खाद्य पदार्थों पर ध्यान दें। रिफाइंड चीनी, सफेद चावल, और प्रसंस्कृत खाद्य पदार्थों से बचें। फाइबर युक्त सब्जियां शामिल करें और नियमित भोजन समय बनाए रखें।"
  }

  return language === "en"
    ? "I can provide specific dietary guidance for various health conditions. Please mention your specific condition or health goal."
    : "मैं विभिन्न स्वास्थ्य स्थितियों के लिए विशिष्ट आहार मार्गदर्शन प्रदान कर सकता हूं। कृपया अपनी विशिष्ट स्थिति या स्वास्थ्य लक्ष्य का उल्लेख करें।"
}

// Handle general Ayurvedic queries
const handleGeneralQuery = (message: string, context: AyurvedicContext, language: "en" | "hi"): string => {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("namaste")) {
    return language === "en"
      ? "Namaste! I'm your Ayurvedic diet assistant. I can help you with food recommendations, constitution guidance, and dietary advice based on traditional Ayurvedic principles. How can I assist you today?"
      : "नमस्ते! मैं आपका आयुर्वेदिक आहार सहायक हूं। मैं पारंपरिक आयुर्वेदिक सिद्धांतों के आधार पर भोजन की सिफारिशें, संविधान मार्गदर्शन, और आहार सलाह में आपकी मदद कर सकता हूं। आज मैं आपकी कैसे सहायता कर सकता हूं?"
  }

  if (lowerMessage.includes("help") || lowerMessage.includes("what can you do")) {
    return language === "en"
      ? "I can help you with: 1) Food recommendations based on constitution and health conditions, 2) Dietary guidance for specific health goals, 3) Information about Ayurvedic food properties, 4) Meal planning suggestions, 5) Seasonal dietary advice. What would you like to know?"
      : "मैं आपकी इन चीजों में मदद कर सकता हूं: 1) संविधान और स्वास्थ्य स्थितियों के आधार पर भोजन की सिफारिशें, 2) विशिष्ट स्वास्थ्य लक्ष्यों के लिए आहार मार्गदर्शन, 3) आयुर्वेदिक भोजन गुणों की जानकारी, 4) भोजन योजना सुझाव, 5) मौसमी आहार सलाह। आप क्या जानना चाहेंगे?"
  }

  if (lowerMessage.includes("season") || lowerMessage.includes("weather")) {
    return language === "en"
      ? "Seasonal eating is important in Ayurveda. Summer: eat cooling foods like cucumber, coconut water, mint. Winter: eat warming foods like ginger, cinnamon, hot soups. Monsoon: eat light, warm, easily digestible foods with digestive spices."
      : "आयुर्वेद में मौसमी भोजन महत्वपूर्ण है। गर्मी: खीरा, नारियल पानी, पुदीना जैसे ठंडे खाद्य पदार्थ खाएं। सर्दी: अदरक, दालचीनी, गर्म सूप जैसे गर्म खाद्य पदार्थ खाएं। मानसून: पाचक मसालों के साथ हल्के, गर्म, आसानी से पचने वाले खाद्य पदार्थ खाएं।"
  }

  return language === "en"
    ? "I'm here to help with Ayurvedic dietary guidance. You can ask me about specific foods, health conditions, constitution types, or general dietary advice. What would you like to know?"
    : "मैं आयुर्वेदिक आहार मार्गदर्शन में मदद के लिए यहां हूं। आप मुझसे विशिष्ट खाद्य पदार्थों, स्वास्थ्य स्थितियों, संविधान प्रकारों, या सामान्य आहार सलाह के बारे में पूछ सकते हैं। आप क्या जानना चाहेंगे?"
}

// Get food recommendations for specific constitution
export const getFoodRecommendationsForConstitution = (constitution: string, language: "en" | "hi" = "en"): string => {
  const foods = getAllFoods()
  const suitableFoods = foods
    .filter((food) => food["Dosha Effect"].toLowerCase().includes(`reduces ${constitution.toLowerCase()}`))
    .slice(0, 10)

  const foodNames = suitableFoods.map((f) => f.Food).join(", ")

  return language === "en"
    ? `For ${constitution} constitution, beneficial foods include: ${foodNames}. These foods help balance your dosha and support overall health.`
    : `${constitution} संविधान के लिए, लाभकारी खाद्य पदार्थों में शामिल हैं: ${foodNames}। ये खाद्य पदार्थ आपके दोष को संतुलित करने और समग्र स्वास्थ्य का समर्थन करने में मदद करते हैं।`
}

// Get seasonal recommendations
export const getSeasonalRecommendations = (
  season: "spring" | "summer" | "monsoon" | "autumn" | "winter",
  language: "en" | "hi" = "en",
): string => {
  const recommendations = {
    spring: {
      en: "Spring is Kapha season. Eat light, warm, and spicy foods. Include bitter and pungent tastes. Good foods: leafy greens, sprouts, ginger tea, turmeric, honey. Avoid heavy, oily, and cold foods.",
      hi: "वसंत कफ का मौसम है। हल्के, गर्म, और मसालेदार खाद्य पदार्थ खाएं। कड़वे और तीखे स्वाद शामिल करें। अच्छे खाद्य पदार्थ: पत्तेदार साग, अंकुरित अनाज, अदरक की चाय, हल्दी, शहद। भारी, तेल युक्त, और ठंडे खाद्य पदार्थों से बचें।",
    },
    summer: {
      en: "Summer is Pitta season. Eat cooling, sweet, and bitter foods. Good foods: cucumber, coconut water, mint, sweet fruits, milk. Avoid hot, spicy, and sour foods. Stay hydrated and eat fresh foods.",
      hi: "गर्मी पित्त का मौसम है। ठंडे, मीठे, और कड़वे खाद्य पदार्थ खाएं। अच्छे खाद्य पदार्थ: खीरा, नारियल पानी, पुदीना, मीठे फल, दूध। गर्म, मसालेदार, और खट्टे खाद्य पदार्थों से बचें। हाइड्रेटेड रहें और ताजा भोजन खाएं।",
    },
    monsoon: {
      en: "Monsoon affects all doshas. Eat warm, light, and easily digestible foods. Include digestive spices like ginger, cumin, coriander. Avoid raw foods, street food, and heavy meals. Boost immunity with turmeric and tulsi.",
      hi: "मानसून सभी दोषों को प्रभावित करता है। गर्म, हल्के, और आसानी से पचने वाले खाद्य पदार्थ खाएं। अदरक, जीरा, धनिया जैसे पाचक मसाले शामिल करें। कच्चे खाद्य पदार्थ, स्ट्रीट फूड, और भारी भोजन से बचें। हल्दी और तुलसी से प्रतिरक्षा बढ़ाएं।",
    },
    autumn: {
      en: "Autumn is Vata season. Eat warm, moist, and nourishing foods. Include sweet and sour tastes. Good foods: cooked grains, warm milk, ghee, nuts, seasonal fruits. Maintain regular routines and stay warm.",
      hi: "शरद ऋतु वात का मौसम है। गर्म, नम, और पोषक खाद्य पदार्थ खाएं। मीठे और खट्टे स्वाद शामिल करें। अच्छे खाद्य पदार्थ: पके हुए अनाज, गर्म दूध, घी, मेवे, मौसमी फल। नियमित दिनचर्या बनाए रखें और गर्म रहें।",
    },
    winter: {
      en: "Winter is Kapha and Vata season. Eat warm, oily, and nourishing foods. Include warming spices and hot beverages. Good foods: ghee, nuts, warm soups, ginger tea, cooked vegetables. Avoid cold and raw foods.",
      hi: "सर्दी कफ और वात का मौसम है। गर्म, तेल युक्त, और पोषक खाद्य पदार्थ खाएं। गर्म मसाले और गर्म पेय शामिल करें। अच्छे खाद्य पदार्थ: घी, मेवे, गर्म सूप, अदरक की चाय, पकी हुई सब्जियां। ठंडे और कच्चे खाद्य पदार्थों से बचें।",
    },
  }

  return recommendations[season][language]
}

// Generate personalized advice based on patient data
export const generatePersonalizedAdvice = (patient: Patient, query: string, language: "en" | "hi" = "en"): string => {
  const advice = []

  // Constitution-based advice
  advice.push(getFoodRecommendationsForConstitution(patient.constitution, language))

  // Condition-based advice
  if (patient.currentConditions.length > 0) {
    const condition = patient.currentConditions[0]
    advice.push(
      language === "en"
        ? `For your ${condition}, focus on foods that address this condition specifically.`
        : `आपकी ${condition} के लिए, उन खाद्य पदार्थों पर ध्यान दें जो इस स्थिति को विशेष रूप से संबोधित करते हैं।`,
    )
  }

  // Lifestyle-based advice
  if (patient.lifestyle.stressLevel === "high") {
    advice.push(
      language === "en"
        ? "Given your high stress level, include calming foods like warm milk with ghee, almonds, and brahmi tea."
        : "आपके उच्च तनाव स्तर को देखते हुए, घी के साथ गर्म दूध, बादाम, और ब्राह्मी चाय जैसे शांत करने वाले खाद्य पदार्थ शामिल करें।",
    )
  }

  return advice.join(" ")
}
