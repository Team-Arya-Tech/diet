"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useTranslation } from "@/components/translation-provider"
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
import { type AyurvedicFood, getAyurvedicFoods, searchFoods } from "@/lib/database"

export default function FoodsPage() {
  const { t, language, setLanguage } = useTranslation();
  const [foods, setFoods] = useState<AyurvedicFood[]>([])
  const [filteredFoods, setFilteredFoods] = useState<AyurvedicFood[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDosha, setSelectedDosha] = useState("")
  const [selectedTaste, setSelectedTaste] = useState("")
  const [selectedCondition, setSelectedCondition] = useState("")
  const [selectedConditionCategory, setSelectedConditionCategory] = useState("all")
  const [availableConditions, setAvailableConditions] = useState<string[]>([])
  const [conditionCategories, setConditionCategories] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)

  useEffect(() => {
    loadFoods()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [searchTerm, selectedDosha, selectedTaste, selectedCondition, selectedConditionCategory, foods])

  // Helper function to extract all unique conditions from the data
  const extractConditionsFromData = (foods: AyurvedicFood[]) => {
    const conditionsSet = new Set<string>()
    foods.forEach(food => {
      // Split multiple conditions and clean them
      const pathyaConditions = food.Pathya.split(/[,;]/).map(c => c.trim()).filter(c => c.length > 0)
      pathyaConditions.forEach(condition => {
        // Normalize condition names (capitalize first letter, clean extra spaces)
        const normalizedCondition = condition.charAt(0).toUpperCase() + condition.slice(1).toLowerCase()
        conditionsSet.add(normalizedCondition)
      })
    })
    return Array.from(conditionsSet).sort()
  }

  // Categorize conditions for better organization
  const categorizeConditions = (conditions: string[]) => {
    const categories = {
      digestive: [] as string[],
      respiratory: [] as string[],
      metabolic: [] as string[],
      mental: [] as string[],
      skin: [] as string[],
      cardiovascular: [] as string[],
      reproductive: [] as string[],
      immunity: [] as string[],
      general: [] as string[]
    }

    conditions.forEach(condition => {
      const lowerCondition = condition.toLowerCase()
      if (lowerCondition.includes('digest') || lowerCondition.includes('nausea') || 
          lowerCondition.includes('constipation') || lowerCondition.includes('diarrhea') ||
          lowerCondition.includes('bloating') || lowerCondition.includes('acidity') ||
          lowerCondition.includes('hyperacidity') || lowerCondition.includes('indigestion')) {
        categories.digestive.push(condition)
      } else if (lowerCondition.includes('respiratory') || lowerCondition.includes('cold') ||
                 lowerCondition.includes('cough') || lowerCondition.includes('asthma')) {
        categories.respiratory.push(condition)
      } else if (lowerCondition.includes('diabetes') || lowerCondition.includes('weight') ||
                 lowerCondition.includes('obesity') || lowerCondition.includes('metabolism')) {
        categories.metabolic.push(condition)
      } else if (lowerCondition.includes('mental') || lowerCondition.includes('stress') ||
                 lowerCondition.includes('anxiety') || lowerCondition.includes('depression')) {
        categories.mental.push(condition)
      } else if (lowerCondition.includes('skin')) {
        categories.skin.push(condition)
      } else if (lowerCondition.includes('hypertension') || lowerCondition.includes('heart') ||
                 lowerCondition.includes('blood pressure')) {
        categories.cardiovascular.push(condition)
      } else if (lowerCondition.includes('female') || lowerCondition.includes('pregnancy') ||
                 lowerCondition.includes('reproductive')) {
        categories.reproductive.push(condition)
      } else if (lowerCondition.includes('immunity') || lowerCondition.includes('immune')) {
        categories.immunity.push(condition)
      } else {
        categories.general.push(condition)
      }
    })

    return categories
  }

  const loadFoods = () => {
    const allFoods = getAyurvedicFoods()
    const conditions = extractConditionsFromData(allFoods)
    const categories = categorizeConditions(conditions)
    
    setFoods(allFoods)
    setFilteredFoods(allFoods)
    setAvailableConditions(conditions)
    setConditionCategories(categories)
    setLoading(false)
  }

  const applyFilters = () => {
    let filtered = foods

    // Apply text search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter((food) =>
        food.Food.toLowerCase().includes(searchLower) ||
        food.Rasa.toLowerCase().includes(searchLower) ||
        food["Dosha Effect"].toLowerCase().includes(searchLower) ||
        food.Pathya.toLowerCase().includes(searchLower) ||
        food.Apathya.toLowerCase().includes(searchLower)
      )
    }

    // Apply dosha filter
    if (selectedDosha) {
      filtered = filtered.filter((food) => food["Dosha Effect"].toLowerCase().includes(selectedDosha.toLowerCase()))
    }

    // Apply taste filter
    if (selectedTaste) {
      filtered = filtered.filter((food) => food.Rasa.toLowerCase().includes(selectedTaste.toLowerCase()))
    }

    // Apply condition filter with enhanced matching
    if (selectedCondition && selectedCondition !== "all") {
      filtered = filtered.filter((food) => {
        const pathyaLower = food.Pathya.toLowerCase()
        const conditionLower = selectedCondition.toLowerCase()
        
        // Direct match
        if (pathyaLower.includes(conditionLower)) return true
        
        // Handle common aliases and related terms
        const aliases: { [key: string]: string[] } = {
          'diabetes': ['diabetic', 'blood sugar', 'glucose'],
          'digestion': ['digestive', 'indigestion', 'gut health'],
          'weight': ['obesity', 'weight loss', 'weight management'],
          'respiratory': ['breathing', 'lung', 'bronchial'],
          'inflammation': ['inflammatory', 'swelling'],
          'immunity': ['immune', 'immunodeficiency'],
          'anemia': ['anaemia', 'iron deficiency'],
          'hypertension': ['high blood pressure', 'blood pressure']
        }
        
        if (aliases[conditionLower]) {
          return aliases[conditionLower].some(alias => pathyaLower.includes(alias))
        }
        
        return false
      })
    }

    setFilteredFoods(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedDosha("")
    setSelectedTaste("")
    setSelectedCondition("")
    setSelectedConditionCategory("all")
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
    <DashboardLayout>
      <div className="p-6 space-y-6 min-h-screen" style={{
        backgroundImage: 'url("/main_bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Header Section */}
        <div className="mb-6">
          <div 
            className="relative rounded-xl overflow-hidden p-6 mb-4 min-h-[120px] border-2"
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
                className="p-3 rounded-xl w-fit border-2"
                style={{
                  backgroundColor: '#F0E6D2',
                  borderColor: '#D4C4A8'
                }}
              >
                <Utensils className="h-6 w-6 text-amber-900" />
              </div>
              <div className="flex-1">
                <h1 className={`text-xl sm:text-2xl font-bold text-amber-900 ${language === "hi" ? "font-devanagari" : ""}`}>
                  {currentContent.title}
                </h1>
                <p className={`text-sm sm:text-base text-amber-800 mt-1 ${language === "hi" ? "font-devanagari" : ""}`}>
                  {currentContent.subtitle}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLanguage(language === "en" ? "hi" : "en")}
                className="flex items-center space-x-2 bg-white/80"
              >
                <Languages className="h-4 w-4" />
                <span>{language === "en" ? "हिंदी" : "English"}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card 
          className="mb-6 relative overflow-hidden border-2 border-amber-900/60 shadow-md"
          style={{
            backgroundImage: 'url("/bg10.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px]"></div>
          <CardContent className="pt-6 relative z-10">
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
                    {currentContent.showingResults.replace("{count}", "8000")}
                  </p>
                  {(searchTerm || selectedDosha || selectedTaste || selectedCondition || selectedConditionCategory !== "all") && (
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
                    <div className="flex items-center justify-between">
                      <label className={`text-sm font-medium ${language === "hi" ? "font-devanagari" : ""}`}>
                        {currentContent.condition}
                      </label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className="text-xs"
                      >
                        {showAdvancedFilters ? "Simple" : "Advanced"}
                      </Button>
                    </div>
                    
                    {!showAdvancedFilters ? (
                      <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                        <SelectTrigger>
                          <SelectValue placeholder={currentContent.allConditions} />
                        </SelectTrigger>
                        <SelectContent className="max-h-60">
                          <SelectItem value="all">{currentContent.allConditions}</SelectItem>
                          {availableConditions.slice(0, 20).map((condition) => (
                            <SelectItem key={condition} value={condition.toLowerCase()}>
                              {condition}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="space-y-3">
                        <Select value={selectedConditionCategory} onValueChange={setSelectedConditionCategory}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            <SelectItem value="digestive">🍃 Digestive Health</SelectItem>
                            <SelectItem value="respiratory">🫁 Respiratory</SelectItem>
                            <SelectItem value="metabolic">⚡ Metabolic</SelectItem>
                            <SelectItem value="mental">🧠 Mental Health</SelectItem>
                            <SelectItem value="skin">✨ Skin Care</SelectItem>
                            <SelectItem value="cardiovascular">❤️ Heart Health</SelectItem>
                            <SelectItem value="reproductive">🌸 Reproductive</SelectItem>
                            <SelectItem value="immunity">🛡️ Immunity</SelectItem>
                            <SelectItem value="general">🌿 General Health</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                          <SelectTrigger>
                            <SelectValue placeholder={`Select from ${selectedConditionCategory === 'all' ? 'all' : selectedConditionCategory} conditions`} />
                          </SelectTrigger>
                          <SelectContent className="max-h-60">
                            <SelectItem value="all">{currentContent.allConditions}</SelectItem>
                            {(selectedConditionCategory === 'all' 
                              ? availableConditions 
                              : conditionCategories[selectedConditionCategory] || []
                            ).map((condition: string) => (
                              <SelectItem key={condition} value={condition.toLowerCase()}>
                                {condition}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Statistics */}
        {showFilters && (
          <Card className="mb-6 border-2 border-amber-900/60">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5" />
                {language === "hi" ? "डेटाबेस इनसाइट्स" : "Database Insights"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{availableConditions.length}</p>
                  <p className="text-sm text-blue-700">{language === "hi" ? "कुल स्थितियां" : "Total Conditions"}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">8000</p>
                  <p className="text-sm text-green-700">{language === "hi" ? "मैच होने वाले खाद्य पदार्थ" : "Matching Foods"}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">
                    {Object.keys(conditionCategories).reduce((acc, key) => acc + conditionCategories[key].length, 0)}
                  </p>
                  <p className="text-sm text-purple-700">{language === "hi" ? "वर्गीकृत स्थितियां" : "Categorized Conditions"}</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">
                    {selectedCondition && selectedCondition !== "all" 
                      ? 8000 
                      : 8000}
                  </p>
                  <p className="text-sm text-orange-700">{language === "hi" ? "कुल खाद्य पदार्थ" : "Total Foods"}</p>
                </div>
              </div>
              
              {selectedCondition && selectedCondition !== "all" && (
                <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-700 text-center">
                    <strong>{filteredFoods.length}</strong> foods beneficial for{" "}
                    <Badge className="bg-amber-100 text-amber-800 border-amber-300">
                      {selectedCondition}
                    </Badge>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

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
              <Card 
                key={index} 
                className="hover:shadow-lg transition-all duration-300 relative overflow-hidden border-2 border-amber-900/60 shadow-md"
                style={{
                  backgroundImage: 'url("/bg3.png")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  minHeight: '200px'
                }}
              >
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px]"></div>
                <CardHeader className="relative z-10">
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
                <CardContent className="relative z-10">
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
                      <div className="flex items-center space-x-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <p className={`text-sm font-medium ${language === "hi" ? "font-devanagari" : ""}`}>
                          {currentContent.beneficialFor}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {food.Pathya.split(/[,;]/).map((condition, idx) => {
                          const trimmedCondition = condition.trim()
                          if (!trimmedCondition) return null
                          const isSelected = selectedCondition && 
                            (trimmedCondition.toLowerCase().includes(selectedCondition.toLowerCase()) ||
                             selectedCondition.toLowerCase().includes(trimmedCondition.toLowerCase()))
                          return (
                            <Badge 
                              key={idx}
                              variant="outline"
                              className={`text-xs ${
                                isSelected 
                                  ? 'bg-green-100 text-green-800 border-green-300 ring-2 ring-green-200' 
                                  : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                              }`}
                            >
                              {trimmedCondition}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>

                    {/* Contraindications */}
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <p className={`text-sm font-medium ${language === "hi" ? "font-devanagari" : ""}`}>
                          {currentContent.avoidIn}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {food.Apathya.split(/[,;]/).map((condition, idx) => {
                          const trimmedCondition = condition.trim()
                          if (!trimmedCondition) return null
                          return (
                            <Badge 
                              key={idx}
                              variant="outline"
                              className="text-xs bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                            >
                              {trimmedCondition}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
