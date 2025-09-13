"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Activity,
  Languages,
  Search,
  Filter,
  Utensils,
  Leaf,
  Flame,
  Snowflake,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import { type AyurvedicFood, getAllFoods, searchFoods } from "@/lib/ayurvedic-data"

export default function FoodsPage() {
  const [foods, setFoods] = useState<AyurvedicFood[]>([])
  const [filteredFoods, setFilteredFoods] = useState<AyurvedicFood[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDosha, setSelectedDosha] = useState("")
  const [selectedTaste, setSelectedTaste] = useState("")
  const [selectedCondition, setSelectedCondition] = useState("")
  const [language, setLanguage] = useState<"en" | "hi">("en")
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    loadFoods()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [searchTerm, selectedDosha, selectedTaste, selectedCondition, foods])

  const loadFoods = () => {
    const allFoods = getAllFoods()
    setFoods(allFoods)
    setFilteredFoods(allFoods)
    setLoading(false)
  }

  const applyFilters = () => {
    let filtered = foods

    // Apply search filter
    if (searchTerm) {
      filtered = searchFoods(searchTerm)
    }

    // Apply dosha filter
    if (selectedDosha) {
      filtered = filtered.filter((food) => food["Dosha Effect"].toLowerCase().includes(selectedDosha.toLowerCase()))
    }

    // Apply taste filter
    if (selectedTaste) {
      filtered = filtered.filter((food) => food.Rasa.toLowerCase().includes(selectedTaste.toLowerCase()))
    }

    // Apply condition filter
    if (selectedCondition) {
      filtered = filtered.filter((food) => food.Pathya.toLowerCase().includes(selectedCondition.toLowerCase()))
    }

    setFilteredFoods(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedDosha("")
    setSelectedTaste("")
    setSelectedCondition("")
  }

  const getTasteColor = (taste: string) => {
    const lowerTaste = taste.toLowerCase()
    if (lowerTaste.includes("sweet")) return "bg-yellow-100 text-yellow-800"
    if (lowerTaste.includes("sour")) return "bg-orange-100 text-orange-800"
    if (lowerTaste.includes("salty")) return "bg-blue-100 text-blue-800"
    if (lowerTaste.includes("pungent")) return "bg-red-100 text-red-800"
    if (lowerTaste.includes("bitter")) return "bg-green-100 text-green-800"
    if (lowerTaste.includes("astringent")) return "bg-purple-100 text-purple-800"
    return "bg-gray-100 text-gray-800"
  }

  const getDoshaColor = (dosha: string) => {
    const lowerDosha = dosha.toLowerCase()
    if (lowerDosha.includes("vata")) return "bg-blue-100 text-blue-800"
    if (lowerDosha.includes("pitta")) return "bg-red-100 text-red-800"
    if (lowerDosha.includes("kapha")) return "bg-green-100 text-green-800"
    return "bg-gray-100 text-gray-800"
  }

  const getVeeryaIcon = (veerya: string) => {
    const lowerVeerya = veerya.toLowerCase()
    if (lowerVeerya.includes("hot") || lowerVeerya.includes("heating") || lowerVeerya.includes("warm")) {
      return <Flame className="h-3 w-3 text-red-500" />
    }
    if (lowerVeerya.includes("cold") || lowerVeerya.includes("cooling") || lowerVeerya.includes("cool")) {
      return <Snowflake className="h-3 w-3 text-blue-500" />
    }
    return <Leaf className="h-3 w-3 text-green-500" />
  }

  const content = {
    en: {
      title: "Ayurvedic Food Database",
      subtitle: "Explore foods with their tastes, qualities, and therapeutic properties",
      search: "Search foods...",
      filters: "Filters",
      clearFilters: "Clear Filters",
      dosha: "Dosha Effect",
      taste: "Taste (Rasa)",
      condition: "Beneficial For",
      noResults: "No foods found matching your criteria",
      showingResults: "Showing {count} foods",
      properties: "Properties",
      benefits: "Benefits",
      contraindications: "Contraindications",
      digestibility: "Digestibility",
      quality: "Quality (Guna)",
      potency: "Potency (Veerya)",
      postDigestive: "Post-digestive (Vipaka)",
      beneficialFor: "Beneficial for",
      avoidIn: "Avoid in",
      allDoshas: "All Doshas",
      allTastes: "All Tastes",
      allConditions: "All Conditions",
    },
    hi: {
      title: "आयुर्वेदिक भोजन डेटाबेस",
      subtitle: "भोजन के स्वाद, गुण और चिकित्सीय गुणों का अन्वेषण करें",
      search: "भोजन खोजें...",
      filters: "फिल्टर",
      clearFilters: "फिल्टर साफ़ करें",
      dosha: "दोष प्रभाव",
      taste: "स्वाद (रस)",
      condition: "के लिए लाभकारी",
      noResults: "आपके मानदंडों से मेल खाने वाला कोई भोजन नहीं मिला",
      showingResults: "{count} भोजन दिखा रहे हैं",
      properties: "गुण",
      benefits: "लाभ",
      contraindications: "प्रतिबंध",
      digestibility: "पाचनशक्ति",
      quality: "गुण",
      potency: "वीर्य",
      postDigestive: "विपाक",
      beneficialFor: "के लिए लाभकारी",
      avoidIn: "में बचें",
      allDoshas: "सभी दोष",
      allTastes: "सभी स्वाद",
      allConditions: "सभी स्थितियां",
    },
  }

  const currentContent = content[language]

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p>Loading food database...</p>
        </div>
      </div>
    )
  }

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

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-2 ${language === "hi" ? "font-devanagari" : ""}`}>
            {currentContent.title}
          </h1>
          <p className={`text-muted-foreground text-lg ${language === "hi" ? "font-devanagari" : ""}`}>
            {currentContent.subtitle}
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={currentContent.search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filter Toggle */}
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center space-x-2"
                >
                  <Filter className="h-4 w-4" />
                  <span className={language === "hi" ? "font-devanagari" : ""}>{currentContent.filters}</span>
                </Button>

                <div className="flex items-center space-x-4">
                  <p className={`text-sm text-muted-foreground ${language === "hi" ? "font-devanagari" : ""}`}>
                    {currentContent.showingResults.replace("{count}", filteredFoods.length.toString())}
                  </p>
                  {(searchTerm || selectedDosha || selectedTaste || selectedCondition) && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      <span className={language === "hi" ? "font-devanagari" : ""}>{currentContent.clearFilters}</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Filters */}
              {showFilters && (
                <div className="grid md:grid-cols-3 gap-4 pt-4 border-t">
                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${language === "hi" ? "font-devanagari" : ""}`}>
                      {currentContent.dosha}
                    </label>
                    <Select value={selectedDosha} onValueChange={setSelectedDosha}>
                      <SelectTrigger>
                        <SelectValue placeholder={currentContent.allDoshas} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{currentContent.allDoshas}</SelectItem>
                        <SelectItem value="vata">Vata</SelectItem>
                        <SelectItem value="pitta">Pitta</SelectItem>
                        <SelectItem value="kapha">Kapha</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${language === "hi" ? "font-devanagari" : ""}`}>
                      {currentContent.taste}
                    </label>
                    <Select value={selectedTaste} onValueChange={setSelectedTaste}>
                      <SelectTrigger>
                        <SelectValue placeholder={currentContent.allTastes} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{currentContent.allTastes}</SelectItem>
                        <SelectItem value="sweet">Sweet</SelectItem>
                        <SelectItem value="sour">Sour</SelectItem>
                        <SelectItem value="salty">Salty</SelectItem>
                        <SelectItem value="pungent">Pungent</SelectItem>
                        <SelectItem value="bitter">Bitter</SelectItem>
                        <SelectItem value="astringent">Astringent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className={`text-sm font-medium ${language === "hi" ? "font-devanagari" : ""}`}>
                      {currentContent.condition}
                    </label>
                    <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                      <SelectTrigger>
                        <SelectValue placeholder={currentContent.allConditions} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{currentContent.allConditions}</SelectItem>
                        <SelectItem value="diabetes">Diabetes</SelectItem>
                        <SelectItem value="digestion">Digestion</SelectItem>
                        <SelectItem value="anemia">Anemia</SelectItem>
                        <SelectItem value="inflammation">Inflammation</SelectItem>
                        <SelectItem value="respiratory">Respiratory</SelectItem>
                        <SelectItem value="immunity">Immunity</SelectItem>
                        <SelectItem value="weight">Weight Management</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Foods Grid */}
        {filteredFoods.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Utensils className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className={`text-lg font-semibold mb-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                {currentContent.noResults}
              </h3>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFoods.map((food, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{food.Food}</CardTitle>
                      <div className="flex flex-wrap gap-1 mb-2">
                        <Badge className={getTasteColor(food.Rasa)}>{food.Rasa}</Badge>
                        <Badge className={getDoshaColor(food["Dosha Effect"])}>{food["Dosha Effect"]}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">{getVeeryaIcon(food.Veerya)}</div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Properties */}
                    <div>
                      <p className={`text-sm font-medium mb-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                        {currentContent.properties}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">{currentContent.quality}:</span>
                          <span className="ml-1 font-medium">{food.Guna}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{currentContent.potency}:</span>
                          <span className="ml-1 font-medium">{food.Veerya}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{currentContent.postDigestive}:</span>
                          <span className="ml-1 font-medium">{food.Vipaka}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">{currentContent.digestibility}:</span>
                          <span className="ml-1 font-medium">{food.Digestibility}</span>
                        </div>
                      </div>
                    </div>

                    {/* Benefits */}
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <p className={`text-sm font-medium ${language === "hi" ? "font-devanagari" : ""}`}>
                          {currentContent.beneficialFor}
                        </p>
                      </div>
                      <p className="text-xs text-green-700 bg-green-50 p-2 rounded">{food.Pathya}</p>
                    </div>

                    {/* Contraindications */}
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <AlertCircle className="h-3 w-3 text-red-500" />
                        <p className={`text-sm font-medium ${language === "hi" ? "font-devanagari" : ""}`}>
                          {currentContent.avoidIn}
                        </p>
                      </div>
                      <p className="text-xs text-red-700 bg-red-50 p-2 rounded">{food.Apathya}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
