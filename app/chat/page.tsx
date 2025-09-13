"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Activity, Languages, Send, Bot, User, Loader2 } from "lucide-react"
import Link from "next/link"
import { type ChatMessage, generateAyurvedicResponse, type AyurvedicContext } from "@/lib/ayurvedic-ai"
import { getAllFoods, getAllCategories } from "@/lib/ayurvedic-data"
import { getPatients } from "@/lib/database"

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [language, setLanguage] = useState<"en" | "hi">("en")
  const [isTyping, setIsTyping] = useState(false)
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
          ? "Namaste! I'm your Ayurvedic diet assistant. I can help you with food recommendations, constitution guidance, and dietary advice based on traditional Ayurvedic principles. How can I assist you today?"
          : "नमस्ते! मैं आपका आयुर्वेदिक आहार सहायक हूं। मैं पारंपरिक आयुर्वेदिक सिद्धांतों के आधार पर भोजन की सिफारिशें, संविधान मार्गदर्शन, और आहार सलाह में आपकी मदद कर सकता हूं। आज मैं आपकी कैसे सहायता कर सकता हूं?",
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
      const response = await generateAyurvedicResponse(inputMessage, ayurvedicContext, language)

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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <Activity className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-primary">AyurDiet</h1>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage(language === "en" ? "hi" : "en")}
                className="flex items-center space-x-2"
              >
                <Languages className="h-4 w-4" />
                <span>{language === "en" ? "हिंदी" : "English"}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className={`text-4xl font-bold mb-2 ${language === "hi" ? "font-devanagari" : ""}`}>
            {currentContent.title}
          </h1>
          <p className={`text-muted-foreground text-lg ${language === "hi" ? "font-devanagari" : ""}`}>
            {currentContent.subtitle}
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Quick Questions Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className={`text-lg ${language === "hi" ? "font-devanagari" : ""}`}>
                  {currentContent.quickQuestions}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quickQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className={`w-full text-left justify-start h-auto p-3 text-xs ${language === "hi" ? "font-devanagari" : ""}`}
                      onClick={() => setInputMessage(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <Card className="h-[600px] flex flex-col">
              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <div className="flex items-start space-x-2">
                        <div className="flex-shrink-0">
                          {message.role === "user" ? (
                            <User className="h-4 w-4 mt-0.5" />
                          ) : (
                            <Bot className="h-4 w-4 mt-0.5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm ${language === "hi" ? "font-devanagari" : ""}`}>{message.content}</p>
                          <p className="text-xs opacity-70 mt-1">{message.timestamp.toLocaleTimeString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-4 w-4" />
                        <div className="flex items-center space-x-1">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          <span className={`text-sm ${language === "hi" ? "font-devanagari" : ""}`}>
                            {currentContent.typing}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </CardContent>

              {/* Input */}
              <div className="border-t p-4">
                <div className="flex space-x-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={currentContent.placeholder}
                    disabled={isTyping}
                    className={language === "hi" ? "font-devanagari" : ""}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isTyping}
                    className="flex items-center space-x-2"
                  >
                    <Send className="h-4 w-4" />
                    <span className={language === "hi" ? "font-devanagari" : ""}>{currentContent.send}</span>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
