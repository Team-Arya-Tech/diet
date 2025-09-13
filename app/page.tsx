"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, BookOpen, MessageCircle, Utensils, Languages, Activity } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [language, setLanguage] = useState<"en" | "hi">("en")

  const content = {
    en: {
      title: "Ayurvedic Diet Management System",
      subtitle: "Comprehensive patient management and personalized diet planning",
      features: [
        {
          icon: Users,
          title: "Patient Management",
          description: "Complete patient profiles with constitution analysis, lifestyle tracking, and medical history",
          href: "/patients",
        },
        {
          icon: Utensils,
          title: "Food Database",
          description: "Extensive Ayurvedic food database with dosha effects, tastes, and therapeutic properties",
          href: "/foods",
        },
        {
          icon: BookOpen,
          title: "Diet Plans",
          description: "Generate personalized diet plans based on constitution, conditions, and lifestyle",
          href: "/diet-plans",
        },
        {
          icon: MessageCircle,
          title: "AI Assistant",
          description: "Intelligent chatbot for Ayurvedic diet guidance and recommendations",
          href: "/chat",
        },
      ],
      stats: [
        { label: "Food Items", value: "500+" },
        { label: "Categories", value: "100+" },
        { label: "Conditions", value: "50+" },
        { label: "Languages", value: "2" },
      ],
    },
    hi: {
      title: "आयुर्वेदिक आहार प्रबंधन प्रणाली",
      subtitle: "व्यापक रोगी प्रबंधन और व्यक्तिगत आहार योजना",
      features: [
        {
          icon: Users,
          title: "रोगी प्रबंधन",
          description: "संविधान विश्लेषण, जीवनशैली ट्रैकिंग और चिकित्सा इतिहास के साथ पूर्ण रोगी प्रोफाइल",
          href: "/patients",
        },
        {
          icon: Utensils,
          title: "भोजन डेटाबेस",
          description: "दोष प्रभाव, स्वाद और चिकित्सीय गुणों के साथ व्यापक आयुर्वेदिक भोजन डेटाबेस",
          href: "/foods",
        },
        {
          icon: BookOpen,
          title: "आहार योजनाएं",
          description: "संविधान, स्थितियों और जीवनशैली के आधार पर व्यक्तिगत आहार योजना बनाएं",
          href: "/diet-plans",
        },
        {
          icon: MessageCircle,
          title: "AI सहायक",
          description: "आयुर्वेदिक आहार मार्गदर्शन और सिफारिशों के लिए बुद्धिमान चैटबॉट",
          href: "/chat",
        },
      ],
      stats: [
        { label: "भोजन आइटम", value: "500+" },
        { label: "श्रेणियां", value: "100+" },
        { label: "स्थितियां", value: "50+" },
        { label: "भाषाएं", value: "2" },
      ],
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
              <Activity className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-primary">AyurDiet</h1>
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

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className={`text-5xl font-bold mb-6 text-balance ${language === "hi" ? "font-devanagari" : ""}`}>
            {currentContent.title}
          </h1>
          <p
            className={`text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty ${language === "hi" ? "font-devanagari" : ""}`}
          >
            {currentContent.subtitle}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-2xl mx-auto">
            {currentContent.stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary">{stat.value}</div>
                <div className={`text-sm text-muted-foreground ${language === "hi" ? "font-devanagari" : ""}`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentContent.features.map((feature, index) => (
              <Link key={index} href={feature.href}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
                  <CardHeader className="text-center">
                    <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className={`text-lg ${language === "hi" ? "font-devanagari" : ""}`}>
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription
                      className={`text-center text-pretty ${language === "hi" ? "font-devanagari" : ""}`}
                    >
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4 text-center">
          <h2 className={`text-3xl font-bold mb-8 ${language === "hi" ? "font-devanagari" : ""}`}>
            {language === "en" ? "Quick Actions" : "त्वरित कार्य"}
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/patients/new">
              <Button size="lg" className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span className={language === "hi" ? "font-devanagari" : ""}>
                  {language === "en" ? "Add New Patient" : "नया रोगी जोड़ें"}
                </span>
              </Button>
            </Link>
            <Link href="/foods">
              <Button variant="outline" size="lg" className="flex items-center space-x-2 bg-transparent">
                <Utensils className="h-5 w-5" />
                <span className={language === "hi" ? "font-devanagari" : ""}>
                  {language === "en" ? "Browse Foods" : "भोजन ब्राउज़ करें"}
                </span>
              </Button>
            </Link>
            <Link href="/chat">
              <Button variant="outline" size="lg" className="flex items-center space-x-2 bg-transparent">
                <MessageCircle className="h-5 w-5" />
                <span className={language === "hi" ? "font-devanagari" : ""}>
                  {language === "en" ? "Ask AI Assistant" : "AI सहायक से पूछें"}
                </span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4 text-center">
          <p className={language === "hi" ? "font-devanagari" : ""}>
            {language === "en"
              ? "© 2024 Ayurvedic Diet Management System. Built with traditional wisdom and modern technology."
              : "© 2024 आयुर्वेदिक आहार प्रबंधन प्रणाली। पारंपरिक ज्ञान और आधुनिक तकनीक के साथ निर्मित।"}
          </p>
        </div>
      </footer>
    </div>
  )
}
