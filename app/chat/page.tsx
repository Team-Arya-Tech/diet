"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, Languages, Send, Bot, User, Loader2, UserCheck } from "lucide-react"
import Link from "next/link"
import { type ChatMessage, generateAyurvedicResponse, type AyurvedicContext } from "@/lib/ayurvedic-ai"
import { getAllFoods, getAllCategories } from "@/lib/ayurvedic-data"
import { getPatients } from "@/lib/database"

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [language, setLanguage] = useState<"en" | "hi">("en")
  const [isTyping, setIsTyping] = useState(false)
  const [selectedPatientId, setSelectedPatientId] = useState<string | undefined>(undefined)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const ayurvedicContext: AyurvedicContext = {
    foods: getAllFoods(),
    categories: getAllCategories(),
    patients: getPatients(),
  }

  useEffect(() => {
    // Initialize with welcome message
    const welcomeMessage: ChatMessage = {
      id: "welcome",
      role: "assistant",
      content:
        language === "en"
          ? "🙏 Namaste! I'm your AI-powered Ayurvedic diet assistant, enhanced with OpenAI technology. I can provide personalized food recommendations, constitution guidance, and dietary advice based on traditional Ayurvedic principles. Select a patient for personalized consultation or ask me general questions. How can I assist you today?"
          : "🙏 नमस्ते! मैं आपका AI-संचालित आयुर्वेदिक आहार सहायक हूं, जो OpenAI तकनीक से बेहतर बनाया गया है। मैं पारंपरिक आयुर्वेदिक सिद्धांतों के आधार पर व्यक्तिगत भोजन की सिफारिशें, संविधान मार्गदर्शन, और आहार सलाह प्रदान कर सकता हूं। व्यक्तिगत सलाह के लिए एक रोगी चुनें या मुझसे सामान्य प्रश्न पूछें। आज मैं आपकी कैसे सहायता कर सकता हूं?",
      timestamp: new Date(),
      language,
    }

    setMessages([welcomeMessage])
  }, [language])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isTyping) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date(),
      language,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    try {
      const patientId = selectedPatientId === "general" ? undefined : selectedPatientId
      const response = await generateAyurvedicResponse(inputMessage, ayurvedicContext, language, patientId)

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
        language,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error generating response:", error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          language === "en"
            ? "I apologize, but I'm having trouble processing your request. Please try again."
            : "मुझे खेद है, लेकिन मुझे आपके अनुरोध को संसाधित करने में समस्या हो रही है। कृपया पुनः प्रयास करें।",
        timestamp: new Date(),
        language,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickQuestions =
    language === "en"
      ? [
          "What foods are good for Vata constitution?",
          "How to manage diabetes with Ayurvedic diet?",
          "What should I eat in summer?",
          "Foods for better digestion?",
          "How to boost immunity naturally?",
        ]
      : [
          "वात संविधान के लिए कौन से खाद्य पदार्थ अच्छे हैं?",
          "आयुर्वेदिक आहार से मधुमेह का प्रबंधन कैसे करें?",
          "गर्मियों में क्या खाना चाहिए?",
          "बेहतर पाचन के लिए खाद्य पदार्थ?",
          "प्राकृतिक रूप से प्रतिरक्षा कैसे बढ़ाएं?",
        ]

  const content = {
    en: {
      title: "AI Diet Assistant",
      subtitle: "Get personalized Ayurvedic dietary guidance and recommendations",
      placeholder: "Ask me about Ayurvedic diet, foods, or health conditions...",
      send: "Send",
      quickQuestions: "Quick Questions",
      typing: "AI is typing...",
    },
    hi: {
      title: "AI आहार सहायक",
      subtitle: "व्यक्तिगत आयुर्वेदिक आहार मार्गदर्शन और सिफारिशें प्राप्त करें",
      placeholder: "मुझसे आयुर्वेदिक आहार, खाद्य पदार्थ, या स्वास्थ्य स्थितियों के बारे में पूछें...",
      send: "भेजें",
      quickQuestions: "त्वरित प्रश्न",
      typing: "AI टाइप कर रहा है...",
    },
  }

  const currentContent = content[language]

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 min-h-screen" style={{
        backgroundImage: 'url("/main_bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Enhanced Header Section */}
        <div className="mb-6">
          <div 
            className="relative rounded-xl overflow-hidden p-6 mb-4 min-h-[140px] border-2"
            style={{
              backgroundColor: '#E8E0D0',
              borderColor: '#D4C4A8',
              backgroundImage: 'url("/banner_canva.png")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div 
                className="p-4 rounded-xl w-fit border-2"
                style={{
                  backgroundColor: '#F0E6D2',
                  borderColor: '#D4C4A8'
                }}
              >
                <Bot className="h-8 w-8 text-amber-900" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-amber-900">
                  AI Ayurveda Assistant
                </h1>
                <p className="text-base sm:text-lg text-amber-800 mt-2">
                  Get personalized Ayurvedic guidance and dietary recommendations powered by AI
                </p>
                <div className="flex items-center space-x-2 mt-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-amber-700 font-medium">
                    {language === "en" ? "AI Assistant Online" : "AI सहायक ऑनलाइन"}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage(language === "en" ? "hi" : "en")}
                className="flex items-center space-x-2 bg-white/80 hover:bg-white"
              >
                <Languages className="h-4 w-4" />
                <span>{language === "en" ? "हिंदी" : "English"}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Main Chat Container */}
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Enhanced Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              {/* Enhanced Patient Selection */}
              <Card 
                className="relative overflow-hidden border-2 border-amber-900/60 shadow-lg hover:shadow-xl transition-all duration-300"
                style={{
                  backgroundImage: 'url("/bg18.png")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px]"></div>
                <CardHeader className="relative z-10 pb-3">
                  <CardTitle className={`text-lg flex items-center space-x-3 text-gray-800 ${language === "hi" ? "font-devanagari" : ""}`}>
                    <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg border border-amber-200">
                      <UserCheck className="h-5 w-5 text-amber-700" />
                    </div>
                    <span>{language === "en" ? "Select Patient" : "रोगी चुनें"}</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-2 pl-11">
                    {language === "en" ? "Choose a patient for personalized advice" : "व्यक्तिगत सलाह के लिए रोगी चुनें"}
                  </p>
                </CardHeader>
                <CardContent className="relative z-10">
                  <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                    <SelectTrigger className={`border-amber-200 focus:border-amber-400 ${language === "hi" ? "font-devanagari" : ""}`}>
                      <SelectValue placeholder={language === "en" ? "Choose patient..." : "रोगी चुनें..."} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general" className={language === "hi" ? "font-devanagari" : ""}>
                        {language === "en" ? "General Consultation" : "सामान्य सलाह"}
                      </SelectItem>
                      {ayurvedicContext.patients?.map((patient) => (
                        <SelectItem key={patient.id} value={patient.id} className={language === "hi" ? "font-devanagari" : ""}>
                          {patient.name} ({patient.constitution})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Enhanced Quick Questions */}
              <Card 
                className="sticky top-4 overflow-hidden border-2 border-amber-900/60 shadow-lg hover:shadow-xl transition-all duration-300"
                style={{
                  backgroundImage: 'url("/bg14.png")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px]"></div>
                <CardHeader className="relative z-10 pb-3">
                  <CardTitle className={`text-lg flex items-center space-x-3 text-gray-800 ${language === "hi" ? "font-devanagari" : ""}`}>
                    <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg border border-amber-200">
                      <Bot className="h-5 w-5 text-amber-700" />
                    </div>
                    <span>{currentContent.quickQuestions}</span>
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-2 pl-11">
                    {language === "en" ? "Popular questions to get started" : "शुरू करने के लिए लोकप्रिय प्रश्न"}
                  </p>
                </CardHeader>
                <CardContent className="relative z-10">
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {quickQuestions.map((question, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        className={`w-full text-left justify-start h-auto p-3 text-xs hover:bg-amber-50 hover:text-amber-900 transition-all duration-200 border border-transparent hover:border-amber-200 rounded-lg ${language === "hi" ? "font-devanagari" : ""}`}
                        onClick={() => setInputMessage(question)}
                      >
                        <div className="flex items-start space-x-2 text-left">
                          <span className="text-amber-600 font-semibold text-sm min-w-[1.5rem]">{index + 1}.</span>
                          <span className="text-left leading-relaxed">{question}</span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Chat Interface */}
            <div className="lg:col-span-3">
              <Card 
                className="h-[700px] flex flex-col relative overflow-hidden border-2 border-amber-900/60 shadow-lg hover:shadow-xl transition-all duration-300"
                style={{
                  backgroundImage: 'url("/bg10.png")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat'
                }}
              >
                <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px]"></div>
                
                {/* Enhanced Chat Header */}
                <CardHeader className="relative z-10 border-b border-amber-200/50 bg-gradient-to-r from-white/90 to-amber-50/90 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-md">
                        <Bot className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-gray-800">
                          {language === "en" ? "AI Ayurveda Assistant" : "AI आयुर्वेद सहायक"}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">
                          {selectedPatientId && selectedPatientId !== "general" 
                            ? `Consulting for: ${ayurvedicContext.patients?.find(p => p.id === selectedPatientId)?.name || 'Patient'}`
                            : (language === "en" ? "General consultation mode" : "सामान्य परामर्श मोड")
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 bg-green-100 px-3 py-1.5 rounded-full border border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium text-green-700">
                        {language === "en" ? "Online" : "ऑनलाइन"}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                {/* Enhanced Messages Area */}
                <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 relative z-10">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in slide-in-from-bottom-2 duration-300`}>
                      <div
                        className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
                          message.role === "user" 
                            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white ml-8" 
                            : "bg-white border-2 border-amber-100 text-gray-800 mr-8"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`flex-shrink-0 p-2 rounded-full ${
                            message.role === "user" ? "bg-white/20" : "bg-amber-100"
                          }`}>
                            {message.role === "user" ? (
                              <User className="h-4 w-4" />
                            ) : (
                              <Bot className="h-4 w-4 text-amber-700" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm leading-relaxed ${language === "hi" ? "font-devanagari" : ""}`}>
                              {message.content}
                            </p>
                            <p className="text-xs opacity-70 mt-2">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start animate-in slide-in-from-bottom-2 duration-300">
                      <div className="bg-white border-2 border-amber-100 rounded-2xl p-4 max-w-[85%] mr-8 shadow-sm">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-amber-100 rounded-full">
                            <Bot className="h-4 w-4 text-amber-700" />
                          </div>
                          <div className="flex items-center space-x-2">
                            <Loader2 className="h-4 w-4 animate-spin text-amber-600" />
                            <span className={`text-sm text-gray-600 ${language === "hi" ? "font-devanagari" : ""}`}>
                              {currentContent.typing}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </CardContent>

                {/* Enhanced Input Area */}
                <div className="border-t border-amber-200/50 p-4 relative z-10 bg-gradient-to-r from-white/95 to-amber-50/95 backdrop-blur-sm">
                  <div className="flex items-end space-x-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Input
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          placeholder={currentContent.placeholder}
                          disabled={isTyping}
                          className={`pr-12 border-2 border-amber-300 focus:border-amber-500 focus:ring-amber-500/20 rounded-xl ${language === "hi" ? "font-devanagari" : ""}`}
                          onKeyPress={handleKeyPress}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          {inputMessage.trim() && (
                            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 px-1">
                        {language === "en" ? "Press Enter to send" : "भेजने के लिए Enter दबाएं"}
                      </p>
                    </div>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isTyping}
                      size="lg"
                      className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-6 rounded-xl"
                    >
                      {isTyping ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <Send className="h-5 w-5" />
                      )}
                      <span className={`ml-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                        {isTyping ? (language === "en" ? "Sending..." : "भेज रहे हैं...") : currentContent.send}
                      </span>
                    </Button>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                      <span>{language === "en" ? "AI is ready to help" : "AI मदद के लिए तैयार है"}</span>
                    </span>
                    <span className="bg-amber-100 px-2 py-0.5 rounded-full text-amber-700">
                      {messages.length} {language === "en" ? "messages" : "संदेश"}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}