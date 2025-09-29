"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  User,
  Download,
  FileText,
  BarChart3,
  Target,
  Lightbulb,
  CheckCircle,
  AlertTriangle,
  Info,
  Star,
  Calendar,
  Activity,
  Heart,
  Leaf,
  Brain,
  Shield,
  TrendingUp,
  Clock
} from "lucide-react"
import Link from "next/link"
import {
  generateCategoryRecommendations,
  generateRecommendationReport,
  exportRecommendationToPDF,
  exportRecommendationToCSV,
  exportRecommendationToJSON,
  saveUserProfile,
  loadUserProfile,
  getSampleProfiles,
  type UserProfile,
  type CategoryRecommendation,
  type RecommendationReport
} from "@/lib/category-recommendations"
import { useTranslation } from "@/components/translation-provider"

export default function CategoryRecommendationsPage() {
  const { language } = useTranslation()
  
  // State management
  const [activeTab, setActiveTab] = useState("profile")
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [recommendations, setRecommendations] = useState<CategoryRecommendation[]>([])
  const [report, setReport] = useState<RecommendationReport | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [profileForm, setProfileForm] = useState({
    age: "",
    gender: "",
    constitution: "",
    occupation: "",
    healthConditions: "",
    dietaryRestrictions: "",
    lifeStage: "",
    currentSeason: "summer",
    activityLevel: "",
    isPregnant: false,
    pregnancyStage: "",
    isLactating: false,
    isMenupausal: false,
    specificGoals: ""
  })

  // Load saved profile on mount
  useEffect(() => {
    const savedProfile = loadUserProfile()
    if (savedProfile) {
      setUserProfile(savedProfile)
      populateFormFromProfile(savedProfile)
      setActiveTab("recommendations")
    }
  }, [])

  // Populate form from profile
  const populateFormFromProfile = (profile: UserProfile) => {
    setProfileForm({
      age: profile.age.toString(),
      gender: profile.gender,
      constitution: profile.constitution,
      occupation: profile.occupation,
      healthConditions: profile.healthConditions.join(", "),
      dietaryRestrictions: profile.dietaryRestrictions.join(", "),
      lifeStage: profile.lifeStage,
      currentSeason: profile.currentSeason,
      activityLevel: profile.activityLevel,
      isPregnant: profile.isPregnant || false,
      pregnancyStage: profile.pregnancyStage || "",
      isLactating: profile.isLactating || false,
      isMenupausal: profile.isMenupausal || false,
      specificGoals: profile.specificGoals.join(", ")
    })
  }

  // Generate recommendations
  const handleGenerateRecommendations = async () => {
    if (!profileForm.age || !profileForm.constitution || !profileForm.currentSeason) {
      alert("Please fill in the required fields: Age, Constitution, and Current Season")
      return
    }

    setIsGenerating(true)

    try {
      // Create user profile from form
      const profile: UserProfile = {
        age: parseInt(profileForm.age),
        gender: profileForm.gender as any,
        constitution: profileForm.constitution as any,
        occupation: profileForm.occupation,
        healthConditions: profileForm.healthConditions.split(",").map(s => s.trim()).filter(s => s),
        dietaryRestrictions: profileForm.dietaryRestrictions.split(",").map(s => s.trim()).filter(s => s),
        lifeStage: profileForm.lifeStage,
        currentSeason: profileForm.currentSeason as any,
        activityLevel: profileForm.activityLevel as any,
        isPregnant: profileForm.isPregnant,
        pregnancyStage: profileForm.pregnancyStage as any,
        isLactating: profileForm.isLactating,
        isMenupausal: profileForm.isMenupausal,
        specificGoals: profileForm.specificGoals.split(",").map(s => s.trim()).filter(s => s)
      }

      // Generate recommendations
      const recs = generateCategoryRecommendations(profile)
      const fullReport = generateRecommendationReport("user-001", "User", profile)

      setUserProfile(profile)
      setRecommendations(recs)
      setReport(fullReport)
      
      // Save profile
      saveUserProfile(profile)
      
      setActiveTab("recommendations")
    } catch (error) {
      console.error("Error generating recommendations:", error)
      alert("Error generating recommendations. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  // Load sample profile
  const handleLoadSampleProfile = (index: number) => {
    const samples = getSampleProfiles()
    if (samples[index]) {
      const profile = samples[index]
      setUserProfile(profile)
      populateFormFromProfile(profile)
    }
  }

  // Export functions
  const handleExport = (format: "pdf" | "csv" | "json") => {
    if (!report) return

    switch (format) {
      case "pdf":
        exportRecommendationToPDF(report)
        break
      case "csv":
        exportRecommendationToCSV(report)
        break
      case "json":
        exportRecommendationToJSON(report)
        break
    }
  }

  // Get priority icon
  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "medium":
        return <Info className="h-4 w-4 text-yellow-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50"
      case "medium":
        return "border-yellow-200 bg-yellow-50"
      default:
        return "border-green-200 bg-green-50"
    }
  }

  const content = {
    en: {
      title: "Ayurvedic Category Recommendations",
      subtitle: "Get personalized dietary recommendations based on Ayurvedic principles",
      backToDashboard: "Back to Dashboard",
      profileTab: "User Profile",
      recommendationsTab: "Recommendations",
      reportTab: "Report & Export",
      // Profile form
      personalInfo: "Personal Information",
      age: "Age",
      gender: "Gender",
      constitution: "Constitution (Dosha)",
      occupation: "Occupation",
      healthConditions: "Health Conditions",
      dietaryRestrictions: "Dietary Restrictions",
      currentSeason: "Current Season",
      activityLevel: "Activity Level",
      specificGoals: "Specific Health Goals",
      womenSpecific: "Women-Specific Information",
      isPregnant: "Currently Pregnant",
      pregnancyStage: "Pregnancy Stage",
      isLactating: "Currently Lactating",
      isMenupausal: "Post-Menopausal",
      generateRecommendations: "Generate Recommendations",
      loadSample: "Load Sample Profile",
      // Recommendations
      highPriority: "High Priority",
      mediumPriority: "Medium Priority",
      lowPriority: "Low Priority",
      matchScore: "Match Score",
      recommendedFoods: "Recommended Foods",
      avoidFoods: "Foods to Avoid",
      reason: "Reason",
      mealSuggestions: "Meal Suggestions",
      specialNotes: "Special Notes",
      // Report
      reportSummary: "Report Summary",
      totalCategories: "Total Categories",
      avgMatchScore: "Average Match Score",
      keyInsights: "Key Insights",
      actionItems: "Action Items",
      exportOptions: "Export Options",
      exportPDF: "Export as PDF",
      exportCSV: "Export as CSV",
      exportJSON: "Export as JSON",
      // Options
      male: "Male",
      female: "Female",
      other: "Other",
      vata: "Vata",
      pitta: "Pitta",
      kapha: "Kapha",
      spring: "Spring",
      summer: "Summer",
      autumn: "Autumn",
      winter: "Winter",
      sedentary: "Sedentary",
      moderate: "Moderate",
      active: "Active",
      veryActive: "Very Active",
      firstTrimester: "First Trimester",
      secondTrimester: "Second Trimester",
      thirdTrimester: "Third Trimester"
    },
    hi: {
      title: "आयुर्वेदिक श्रेणी सिफारिशें",
      subtitle: "आयुर्वेदिक सिद्धांतों के आधार पर व्यक्तिगत आहार सिफारिशें प्राप्त करें",
      backToDashboard: "डैशबोर्ड पर वापस जाएं",
      profileTab: "उपयोगकर्ता प्रोफ़ाइल",
      recommendationsTab: "सिफारिशें",
      reportTab: "रिपोर्ट और निर्यात",
      personalInfo: "व्यक्तिगत जानकारी",
      age: "आयु",
      gender: "लिंग",
      constitution: "प्रकृति (दोष)",
      occupation: "व्यवसाय",
      healthConditions: "स्वास्थ्य स्थितियां",
      dietaryRestrictions: "आहार प्रतिबंध",
      currentSeason: "वर्तमान मौसम",
      activityLevel: "गतिविधि स्तर",
      specificGoals: "विशिष्ट स्वास्थ्य लक्ष्य",
      womenSpecific: "महिला-विशिष्ट जानकारी",
      isPregnant: "वर्तमान में गर्भवती",
      pregnancyStage: "गर्भावस्था चरण",
      isLactating: "वर्तमान में स्तनपान",
      isMenupausal: "रजोनिवृत्ति के बाद",
      generateRecommendations: "सिफारिशें बनाएं",
      loadSample: "नमूना प्रोफ़ाइल लोड करें",
      highPriority: "उच्च प्राथमिकता",
      mediumPriority: "मध्यम प्राथमिकता",
      lowPriority: "कम प्राथमिकता",
      matchScore: "मैच स्कोर",
      recommendedFoods: "अनुशंसित खाद्य पदार्थ",
      avoidFoods: "बचने वाले खाद्य पदार्थ",
      reason: "कारण",
      mealSuggestions: "भोजन सुझाव",
      specialNotes: "विशेष नोट्स",
      reportSummary: "रिपोर्ट सारांश",
      totalCategories: "कुल श्रेणियां",
      avgMatchScore: "औसत मैच स्कोर",
      keyInsights: "मुख्य अंतर्दृष्टि",
      actionItems: "कार्य आइटम",
      exportOptions: "निर्यात विकल्प",
      exportPDF: "PDF के रूप में निर्यात करें",
      exportCSV: "CSV के रूप में निर्यात करें",
      exportJSON: "JSON के रूप में निर्यात करें",
      male: "पुरुष",
      female: "महिला",
      other: "अन्य",
      vata: "वात",
      pitta: "पित्त",
      kapha: "कफ",
      spring: "वसंत",
      summer: "गर्मी",
      autumn: "शरद",
      winter: "सर्दी",
      sedentary: "गतिहीन",
      moderate: "मध्यम",
      active: "सक्रिय",
      veryActive: "बहुत सक्रिय",
      firstTrimester: "पहली तिमाही",
      secondTrimester: "दूसरी तिमाही",
      thirdTrimester: "तीसरी तिमाही"
    }
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
                <Leaf className="h-6 w-6 text-amber-900" />
              </div>
              <div className="flex-1">
                <h1 className={`text-xl sm:text-2xl font-bold text-amber-900 ${language === "hi" ? "font-devanagari" : ""}`}>
                  {currentContent.title}
                </h1>
                <p className={`text-sm sm:text-base text-amber-800 mt-1 ${language === "hi" ? "font-devanagari" : ""}`}>
                  {currentContent.subtitle}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile" className={language === "hi" ? "font-devanagari" : ""}>
              <User className="h-4 w-4 mr-2" />
              {currentContent.profileTab}
            </TabsTrigger>
            <TabsTrigger value="recommendations" className={language === "hi" ? "font-devanagari" : ""}>
              <Target className="h-4 w-4 mr-2" />
              {currentContent.recommendationsTab}
            </TabsTrigger>
            <TabsTrigger value="report" className={language === "hi" ? "font-devanagari" : ""}>
              <FileText className="h-4 w-4 mr-2" />
              {currentContent.reportTab}
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className={language === "hi" ? "font-devanagari" : ""}>
                  {currentContent.personalInfo}
                </CardTitle>
                <CardDescription>
                  Fill in your details to get personalized Ayurvedic recommendations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Sample Profiles */}
                <div className="mb-4">
                  <Label className={language === "hi" ? "font-devanagari" : ""}>
                    {currentContent.loadSample}
                  </Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLoadSampleProfile(0)}
                    >
                      Software Engineer
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLoadSampleProfile(1)}
                    >
                      Teacher
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleLoadSampleProfile(2)}
                    >
                      Healthcare Worker
                    </Button>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className={language === "hi" ? "font-devanagari" : ""}>
                      {currentContent.age} *
                    </Label>
                    <Input
                      type="number"
                      value={profileForm.age}
                      onChange={(e) => setProfileForm({ ...profileForm, age: e.target.value })}
                      placeholder="25"
                    />
                  </div>

                  <div>
                    <Label className={language === "hi" ? "font-devanagari" : ""}>
                      {currentContent.gender}
                    </Label>
                    <Select
                      value={profileForm.gender}
                      onValueChange={(value) => setProfileForm({ ...profileForm, gender: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">{currentContent.male}</SelectItem>
                        <SelectItem value="female">{currentContent.female}</SelectItem>
                        <SelectItem value="other">{currentContent.other}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className={language === "hi" ? "font-devanagari" : ""}>
                      {currentContent.constitution} *
                    </Label>
                    <Select
                      value={profileForm.constitution}
                      onValueChange={(value) => setProfileForm({ ...profileForm, constitution: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select constitution" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vata">{currentContent.vata}</SelectItem>
                        <SelectItem value="pitta">{currentContent.pitta}</SelectItem>
                        <SelectItem value="kapha">{currentContent.kapha}</SelectItem>
                        <SelectItem value="vata-pitta">Vata-Pitta</SelectItem>
                        <SelectItem value="pitta-kapha">Pitta-Kapha</SelectItem>
                        <SelectItem value="vata-kapha">Vata-Kapha</SelectItem>
                        <SelectItem value="tridoshic">Tridoshic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className={language === "hi" ? "font-devanagari" : ""}>
                      {currentContent.currentSeason} *
                    </Label>
                    <Select
                      value={profileForm.currentSeason}
                      onValueChange={(value) => setProfileForm({ ...profileForm, currentSeason: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select season" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spring">{currentContent.spring}</SelectItem>
                        <SelectItem value="summer">{currentContent.summer}</SelectItem>
                        <SelectItem value="autumn">{currentContent.autumn}</SelectItem>
                        <SelectItem value="winter">{currentContent.winter}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Occupation and Activity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className={language === "hi" ? "font-devanagari" : ""}>
                      {currentContent.occupation}
                    </Label>
                    <Input
                      value={profileForm.occupation}
                      onChange={(e) => setProfileForm({ ...profileForm, occupation: e.target.value })}
                      placeholder="Software Engineer, Teacher, etc."
                    />
                  </div>

                  <div>
                    <Label className={language === "hi" ? "font-devanagari" : ""}>
                      {currentContent.activityLevel}
                    </Label>
                    <Select
                      value={profileForm.activityLevel}
                      onValueChange={(value) => setProfileForm({ ...profileForm, activityLevel: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select activity level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sedentary">{currentContent.sedentary}</SelectItem>
                        <SelectItem value="moderate">{currentContent.moderate}</SelectItem>
                        <SelectItem value="active">{currentContent.active}</SelectItem>
                        <SelectItem value="very-active">{currentContent.veryActive}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Health Information */}
                <div>
                  <Label className={language === "hi" ? "font-devanagari" : ""}>
                    {currentContent.healthConditions}
                  </Label>
                  <Textarea
                    value={profileForm.healthConditions}
                    onChange={(e) => setProfileForm({ ...profileForm, healthConditions: e.target.value })}
                    placeholder="Diabetes, Hypertension, Eye Strain, etc. (comma-separated)"
                    rows={3}
                  />
                </div>

                <div>
                  <Label className={language === "hi" ? "font-devanagari" : ""}>
                    {currentContent.dietaryRestrictions}
                  </Label>
                  <Textarea
                    value={profileForm.dietaryRestrictions}
                    onChange={(e) => setProfileForm({ ...profileForm, dietaryRestrictions: e.target.value })}
                    placeholder="Vegetarian, Vegan, Gluten-free, etc. (comma-separated)"
                    rows={2}
                  />
                </div>

                <div>
                  <Label className={language === "hi" ? "font-devanagari" : ""}>
                    {currentContent.specificGoals}
                  </Label>
                  <Textarea
                    value={profileForm.specificGoals}
                    onChange={(e) => setProfileForm({ ...profileForm, specificGoals: e.target.value })}
                    placeholder="Weight management, Immunity, Stress relief, etc. (comma-separated)"
                    rows={2}
                  />
                </div>

                {/* Women-Specific Section */}
                {profileForm.gender === "female" && (
                  <Card className="p-4">
                    <h4 className={`font-semibold mb-3 ${language === "hi" ? "font-devanagari" : ""}`}>
                      {currentContent.womenSpecific}
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={profileForm.isPregnant}
                          onChange={(e) => setProfileForm({ ...profileForm, isPregnant: e.target.checked })}
                        />
                        <Label className={language === "hi" ? "font-devanagari" : ""}>
                          {currentContent.isPregnant}
                        </Label>
                      </div>

                      {profileForm.isPregnant && (
                        <div>
                          <Label className={language === "hi" ? "font-devanagari" : ""}>
                            {currentContent.pregnancyStage}
                          </Label>
                          <Select
                            value={profileForm.pregnancyStage}
                            onValueChange={(value) => setProfileForm({ ...profileForm, pregnancyStage: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select stage" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="first-trimester">{currentContent.firstTrimester}</SelectItem>
                              <SelectItem value="second-trimester">{currentContent.secondTrimester}</SelectItem>
                              <SelectItem value="third-trimester">{currentContent.thirdTrimester}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={profileForm.isLactating}
                          onChange={(e) => setProfileForm({ ...profileForm, isLactating: e.target.checked })}
                        />
                        <Label className={language === "hi" ? "font-devanagari" : ""}>
                          {currentContent.isLactating}
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={profileForm.isMenupausal}
                          onChange={(e) => setProfileForm({ ...profileForm, isMenupausal: e.target.checked })}
                        />
                        <Label className={language === "hi" ? "font-devanagari" : ""}>
                          {currentContent.isMenupausal}
                        </Label>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Generate Button */}
                <Button
                  onClick={handleGenerateRecommendations}
                  disabled={isGenerating || !profileForm.age || !profileForm.constitution}
                  className={`w-full ${language === "hi" ? "font-devanagari" : ""}`}
                >
                  {isGenerating ? (
                    <>
                      <Activity className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      {currentContent.generateRecommendations}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            {recommendations.length > 0 ? (
              <>
                {/* Priority Filter */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="destructive">
                    {currentContent.highPriority}: {recommendations.filter(r => r.priority === "high").length}
                  </Badge>
                  <Badge variant="secondary">
                    {currentContent.mediumPriority}: {recommendations.filter(r => r.priority === "medium").length}
                  </Badge>
                  <Badge variant="outline">
                    {currentContent.lowPriority}: {recommendations.filter(r => r.priority === "low").length}
                  </Badge>
                </div>

                {/* Recommendations List */}
                <div className="space-y-4">
                  {recommendations.map((rec, index) => (
                    <Card key={rec.id} className={`border-l-4 ${getPriorityColor(rec.priority)}`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                            {getPriorityIcon(rec.priority)}
                            <span>{rec.categoryType} - {rec.subCategory}</span>
                          </CardTitle>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline">
                              {currentContent.matchScore}: {rec.matchScore}
                            </Badge>
                            <Badge variant={rec.priority === "high" ? "destructive" : rec.priority === "medium" ? "secondary" : "outline"}>
                              {rec.priority}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Reason */}
                        <div>
                          <h4 className={`font-semibold text-sm mb-2 flex items-center ${language === "hi" ? "font-devanagari" : ""}`}>
                            <Lightbulb className="h-4 w-4 mr-2" />
                            {currentContent.reason}
                          </h4>
                          <p className="text-sm text-muted-foreground">{rec.reason}</p>
                        </div>

                        {/* Recommended Foods */}
                        <div>
                          <h4 className={`font-semibold text-sm mb-2 flex items-center ${language === "hi" ? "font-devanagari" : ""}`}>
                            <Heart className="h-4 w-4 mr-2 text-green-600" />
                            {currentContent.recommendedFoods}
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {rec.recommendedFoods.map((food, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {food}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Avoid Foods */}
                        <div>
                          <h4 className={`font-semibold text-sm mb-2 flex items-center ${language === "hi" ? "font-devanagari" : ""}`}>
                            <Shield className="h-4 w-4 mr-2 text-red-600" />
                            {currentContent.avoidFoods}
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {rec.avoidFoods.map((food, idx) => (
                              <Badge key={idx} variant="destructive" className="text-xs">
                                {food}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Meal Suggestions */}
                        <div>
                          <h4 className={`font-semibold text-sm mb-2 flex items-center ${language === "hi" ? "font-devanagari" : ""}`}>
                            <Clock className="h-4 w-4 mr-2" />
                            {currentContent.mealSuggestions}
                          </h4>
                          <p className="text-sm text-muted-foreground">{rec.mealSuggestions}</p>
                        </div>

                        {/* Special Notes */}
                        {rec.specialNotes && (
                          <Alert>
                            <Info className="h-4 w-4" />
                            <AlertDescription className="text-sm">
                              <strong>{currentContent.specialNotes}:</strong> {rec.specialNotes}
                            </AlertDescription>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">
                    Generate recommendations from your profile to see them here
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Report Tab */}
          <TabsContent value="report" className="space-y-6">
            {report ? (
              <>
                {/* Report Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                      <BarChart3 className="h-5 w-5" />
                      <span>{currentContent.reportSummary}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-primary">{report.summary.totalCategories}</p>
                        <p className="text-sm text-muted-foreground">{currentContent.totalCategories}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-red-600">{report.summary.highPriorityCount}</p>
                        <p className="text-sm text-muted-foreground">{currentContent.highPriority}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-yellow-600">{report.summary.mediumPriorityCount}</p>
                        <p className="text-sm text-muted-foreground">{currentContent.mediumPriority}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">{report.summary.lowPriorityCount}</p>
                        <p className="text-sm text-muted-foreground">{currentContent.lowPriority}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Key Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                      <Lightbulb className="h-5 w-5" />
                      <span>{currentContent.keyInsights}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {report.keyInsights.map((insight, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <Star className="h-4 w-4 text-yellow-500 mt-0.5" />
                          <span className="text-sm">{insight}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Action Items */}
                <Card>
                  <CardHeader>
                    <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                      <CheckCircle className="h-5 w-5" />
                      <span>{currentContent.actionItems}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {report.actionItems.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Export Options */}
                <Card>
                  <CardHeader>
                    <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                      <Download className="h-5 w-5" />
                      <span>{currentContent.exportOptions}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      <Button onClick={() => handleExport("pdf")} variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        {currentContent.exportPDF}
                      </Button>
                      <Button onClick={() => handleExport("csv")} variant="outline">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        {currentContent.exportCSV}
                      </Button>
                      <Button onClick={() => handleExport("json")} variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        {currentContent.exportJSON}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">
                    Generate recommendations to see the detailed report
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
