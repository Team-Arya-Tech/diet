"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Activity, 
  Languages, 
  Download, 
  TrendingUp, 
  TrendingDown,
  Users,
  Calendar,
  Target,
  BarChart3,
  PieChart,
  FileText,
  Filter
} from "lucide-react"
import Link from "next/link"
import { getPatients, getDietPlans, getConsultations, getDashboardStats } from "@/lib/database"
import { exportDietChartToPDF, exportProgressReportToPDF } from "@/lib/pdf-export"
import type { Patient, DietPlan, Consultation } from "@/lib/database"

interface PatientProgressReport {
  patient: Patient
  dietPlan?: DietPlan
  progressPercentage: number
  adherenceScore: number
  weightChange: number
  lastConsultation?: Consultation
  status: "excellent" | "good" | "needs-improvement" | "poor"
}

interface AnalyticsData {
  constitutionDistribution: { [key: string]: number }
  ageGroupDistribution: { [key: string]: number }
  conditionFrequency: { [key: string]: number }
  monthlyConsultations: { [key: string]: number }
  dietPlanEffectiveness: { [key: string]: number }
}

export default function ReportsPage() {
  const [language, setLanguage] = useState<"en" | "hi">("en")
  const [timeRange, setTimeRange] = useState("last-30-days")
  const [selectedPatient, setSelectedPatient] = useState<string>("all")
  const [reportType, setReportType] = useState("overview")
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [patientReports, setPatientReports] = useState<PatientProgressReport[]>([])
  const [dashboardStats, setDashboardStats] = useState<any>(null)

  useEffect(() => {
    loadReportData()
  }, [timeRange, selectedPatient])

  const loadReportData = () => {
    const patients = getPatients()
    const dietPlans = getDietPlans()
    const consultations = getConsultations()
    const stats = getDashboardStats()

    setDashboardStats(stats)

    // Generate analytics data
    const analytics = generateAnalyticsData(patients, dietPlans, consultations)
    setAnalyticsData(analytics)

    // Generate patient progress reports
    const reports = generatePatientProgressReports(patients, dietPlans, consultations)
    setPatientReports(reports)
  }

  const generateAnalyticsData = (
    patients: Patient[], 
    dietPlans: DietPlan[], 
    consultations: Consultation[]
  ): AnalyticsData => {
    // Constitution distribution
    const constitutionDistribution: { [key: string]: number } = {}
    patients.forEach(patient => {
      constitutionDistribution[patient.constitution] = (constitutionDistribution[patient.constitution] || 0) + 1
    })

    // Age group distribution
    const ageGroupDistribution: { [key: string]: number } = {
      "18-30": 0,
      "31-45": 0,
      "46-60": 0,
      "60+": 0
    }
    patients.forEach(patient => {
      if (patient.age <= 30) ageGroupDistribution["18-30"]++
      else if (patient.age <= 45) ageGroupDistribution["31-45"]++
      else if (patient.age <= 60) ageGroupDistribution["46-60"]++
      else ageGroupDistribution["60+"]++
    })

    // Condition frequency
    const conditionFrequency: { [key: string]: number } = {}
    patients.forEach(patient => {
      patient.currentConditions.forEach(condition => {
        conditionFrequency[condition] = (conditionFrequency[condition] || 0) + 1
      })
    })

    // Monthly consultations (last 6 months)
    const monthlyConsultations: { [key: string]: number } = {}
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    for (let i = 0; i < 6; i++) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthKey = months[date.getMonth()]
      monthlyConsultations[monthKey] = Math.floor(Math.random() * 20) + 10 // Mock data
    }

    // Diet plan effectiveness (mock data for now)
    const dietPlanEffectiveness: { [key: string]: number } = {
      "Weight Loss Plans": 85,
      "Diabetes Management": 78,
      "Digestive Health": 92,
      "Immunity Boost": 88,
      "Stress Relief": 75
    }

    return {
      constitutionDistribution,
      ageGroupDistribution,
      conditionFrequency,
      monthlyConsultations,
      dietPlanEffectiveness
    }
  }

  const generatePatientProgressReports = (
    patients: Patient[], 
    dietPlans: DietPlan[], 
    consultations: Consultation[]
  ): PatientProgressReport[] => {
    return patients.map(patient => {
      const patientDietPlans = dietPlans.filter(plan => plan.patientId === patient.id)
      const activeDietPlan = patientDietPlans.find(plan => plan.isActive)
      const patientConsultations = consultations.filter(c => c.patientId === patient.id)
      const lastConsultation = patientConsultations.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )[0]

      // Mock progress calculations
      const progressPercentage = Math.floor(Math.random() * 100)
      const adherenceScore = Math.floor(Math.random() * 100)
      const weightChange = (Math.random() - 0.5) * 10 // -5kg to +5kg

      let status: "excellent" | "good" | "needs-improvement" | "poor"
      if (adherenceScore >= 90) status = "excellent"
      else if (adherenceScore >= 75) status = "good"
      else if (adherenceScore >= 60) status = "needs-improvement"
      else status = "poor"

      return {
        patient,
        dietPlan: activeDietPlan,
        progressPercentage,
        adherenceScore,
        weightChange,
        lastConsultation,
        status
      }
    })
  }

  const exportReport = async (format: "pdf" | "csv") => {
    try {
      if (format === "pdf") {
        // Export comprehensive progress report
        const patients = getPatients()
        const dietPlans = getDietPlans()
        
        if (selectedPatient === "all") {
          // Export overall progress report
          await exportProgressReportToPDF(patients, dietPlans, timeRange)
        } else {
          // Export specific patient diet chart
          const patient = patients.find(p => p.id === selectedPatient)
          const dietPlan = dietPlans.find(plan => plan.patientId === selectedPatient && plan.isActive)
          
          if (patient && dietPlan) {
            await exportDietChartToPDF(patient, dietPlan, {
              includeNutritionalAnalysis: true,
              includeAyurvedicGuidelines: true,
              includeProgressCharts: true,
              includeRecommendations: true,
              language: language
            })
          } else {
            alert("No active diet plan found for selected patient")
          }
        }
      } else if (format === "csv") {
        // Generate CSV export
        const filename = `ayurvedic-diet-report-${new Date().toISOString().split('T')[0]}.csv`
        
        const csvContent = generateCSVReport()
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const link = document.createElement('a')
        
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob)
          link.setAttribute('href', url)
          link.setAttribute('download', filename)
          link.style.visibility = 'hidden'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }
    } catch (error) {
      console.error("Error exporting report:", error)
      alert("Error generating report. Please try again.")
    }
  }

  const generateCSVReport = (): string => {
    const patients = getPatients()
    const dietPlans = getDietPlans()
    
    let csvContent = "Patient Name,Constitution,Age,Current Conditions,Diet Plan,Plan Status,Adherence,Weight Change,Last Updated\n"
    
    patients.forEach(patient => {
      const activePlan = dietPlans.find(plan => plan.patientId === patient.id && plan.isActive)
      const row = [
        patient.name,
        patient.constitution,
        patient.age.toString(),
        patient.currentConditions.join('; '),
        activePlan?.planName || 'No active plan',
        activePlan ? 'Active' : 'Inactive',
        activePlan ? `${activePlan.progress.adherence}%` : 'N/A',
        activePlan ? `${activePlan.progress.weightChange} kg` : 'N/A',
        patient.updatedAt.toLocaleDateString()
      ].map(field => `"${field.replace(/"/g, '""')}"`)
      
      csvContent += row.join(',') + '\n'
    })
    
    return csvContent
  }

  const content = {
    en: {
      title: "Reports & Analytics",
      subtitle: "Comprehensive insights into patient progress and system performance",
      overview: "Overview",
      patientProgress: "Patient Progress",
      analytics: "Analytics",
      exports: "Exports",
      timeRange: "Time Range",
      last30Days: "Last 30 Days",
      last90Days: "Last 90 Days",
      last6Months: "Last 6 Months",
      lastYear: "Last Year",
      allPatients: "All Patients",
      selectPatient: "Select Patient",
      exportPDF: "Export PDF",
      exportCSV: "Export CSV",
      totalPatients: "Total Patients",
      activePatients: "Active Patients",
      activeDietPlans: "Active Diet Plans",
      avgAdherence: "Avg. Adherence",
      constitutionDistribution: "Constitution Distribution",
      ageGroups: "Age Groups",
      commonConditions: "Common Conditions",
      monthlyTrend: "Monthly Consultation Trend",
      patientName: "Patient Name",
      constitution: "Constitution",
      dietPlan: "Diet Plan",
      progress: "Progress",
      adherence: "Adherence",
      weightChange: "Weight Change",
      lastVisit: "Last Visit",
      status: "Status",
      excellent: "Excellent",
      good: "Good",
      needsImprovement: "Needs Improvement",
      poor: "Poor",
      planEffectiveness: "Diet Plan Effectiveness"
    },
    hi: {
      title: "रिपोर्ट और विश्लेषण",
      subtitle: "रोगी प्रगति और सिस्टम प्रदर्शन में व्यापक अंतर्दृष्टि",
      overview: "अवलोकन",
      patientProgress: "रोगी प्रगति",
      analytics: "विश्लेषण",
      exports: "निर्यात",
      timeRange: "समय सीमा",
      last30Days: "पिछले 30 दिन",
      last90Days: "पिछले 90 दिन",
      last6Months: "पिछले 6 महीने",
      lastYear: "पिछला साल",
      allPatients: "सभी रोगी",
      selectPatient: "रोगी चुनें",
      exportPDF: "PDF निर्यात",
      exportCSV: "CSV निर्यात",
      totalPatients: "कुल रोगी",
      activePatients: "सक्रिय रोगी",
      activeDietPlans: "सक्रिय आहार योजनाएं",
      avgAdherence: "औसत पालन",
      constitutionDistribution: "संविधान वितरण",
      ageGroups: "आयु समूह",
      commonConditions: "सामान्य स्थितियां",
      monthlyTrend: "मासिक परामर्श प्रवृत्ति",
      patientName: "रोगी का नाम",
      constitution: "संविधान",
      dietPlan: "आहार योजना",
      progress: "प्रगति",
      adherence: "पालन",
      weightChange: "वजन परिवर्तन",
      lastVisit: "अंतिम यात्रा",
      status: "स्थिति",
      excellent: "उत्कृष्ट",
      good: "अच्छा",
      needsImprovement: "सुधार की आवश्यकता",
      poor: "खराब",
      planEffectiveness: "आहार योजना प्रभावशीलता"
    }
  }

  const currentContent = content[language]
  const patients = getPatients()

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link href="/" className="flex items-center space-x-2">
                <Activity className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-primary">AhaarWISE</h1>
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

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className={`w-[180px] ${language === "hi" ? "font-devanagari" : ""}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last-30-days" className={language === "hi" ? "font-devanagari" : ""}>
                  {currentContent.last30Days}
                </SelectItem>
                <SelectItem value="last-90-days" className={language === "hi" ? "font-devanagari" : ""}>
                  {currentContent.last90Days}
                </SelectItem>
                <SelectItem value="last-6-months" className={language === "hi" ? "font-devanagari" : ""}>
                  {currentContent.last6Months}
                </SelectItem>
                <SelectItem value="last-year" className={language === "hi" ? "font-devanagari" : ""}>
                  {currentContent.lastYear}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Select value={selectedPatient} onValueChange={setSelectedPatient}>
            <SelectTrigger className={`w-[200px] ${language === "hi" ? "font-devanagari" : ""}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className={language === "hi" ? "font-devanagari" : ""}>
                {currentContent.allPatients}
              </SelectItem>
              {patients.map((patient) => (
                <SelectItem key={patient.id} value={patient.id}>
                  {patient.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex space-x-2 ml-auto">
            <Button onClick={() => exportReport("pdf")} className={language === "hi" ? "font-devanagari" : ""}>
              <Download className="h-4 w-4 mr-2" />
              {currentContent.exportPDF}
            </Button>
            <Button variant="outline" onClick={() => exportReport("csv")} className={language === "hi" ? "font-devanagari" : ""}>
              <FileText className="h-4 w-4 mr-2" />
              {currentContent.exportCSV}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className={language === "hi" ? "font-devanagari" : ""}>
              {currentContent.overview}
            </TabsTrigger>
            <TabsTrigger value="progress" className={language === "hi" ? "font-devanagari" : ""}>
              {currentContent.patientProgress}
            </TabsTrigger>
            <TabsTrigger value="analytics" className={language === "hi" ? "font-devanagari" : ""}>
              {currentContent.analytics}
            </TabsTrigger>
            <TabsTrigger value="exports" className={language === "hi" ? "font-devanagari" : ""}>
              {currentContent.exports}
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            {dashboardStats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className={`text-sm font-medium ${language === "hi" ? "font-devanagari" : ""}`}>
                      {currentContent.totalPatients}
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats.totalPatients}</div>
                    <p className="text-xs text-muted-foreground">
                      <TrendingUp className="inline h-3 w-3 mr-1" />
                      +{dashboardStats.weeklyGrowth}% from last week
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className={`text-sm font-medium ${language === "hi" ? "font-devanagari" : ""}`}>
                      {currentContent.activePatients}
                    </CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats.activePatients}</div>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((dashboardStats.activePatients / dashboardStats.totalPatients) * 100)}% of total patients
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className={`text-sm font-medium ${language === "hi" ? "font-devanagari" : ""}`}>
                      {currentContent.activeDietPlans}
                    </CardTitle>
                    <Target className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats.activeDietPlans}</div>
                    <p className="text-xs text-muted-foreground">
                      Across all patients
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className={`text-sm font-medium ${language === "hi" ? "font-devanagari" : ""}`}>
                      {currentContent.avgAdherence}
                    </CardTitle>
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{dashboardStats.averageAdherence}%</div>
                    <p className="text-xs text-muted-foreground">
                      <TrendingUp className="inline h-3 w-3 mr-1" />
                      +2% from last month
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Charts Row */}
            {analyticsData && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                      <PieChart className="h-5 w-5" />
                      <span>{currentContent.constitutionDistribution}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(analyticsData.constitutionDistribution).map(([constitution, count]) => (
                        <div key={constitution} className="flex items-center justify-between">
                          <span className="capitalize">{constitution}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${(count / dashboardStats?.totalPatients || 1) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground w-8">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className={`flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                      <BarChart3 className="h-5 w-5" />
                      <span>{currentContent.ageGroups}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(analyticsData.ageGroupDistribution).map(([ageGroup, count]) => (
                        <div key={ageGroup} className="flex items-center justify-between">
                          <span>{ageGroup}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-secondary rounded-full"
                                style={{ width: `${(count / dashboardStats?.totalPatients || 1) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground w-8">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Patient Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className={language === "hi" ? "font-devanagari" : ""}>
                  {currentContent.patientProgress}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className={language === "hi" ? "font-devanagari" : ""}>
                        {currentContent.patientName}
                      </TableHead>
                      <TableHead className={language === "hi" ? "font-devanagari" : ""}>
                        {currentContent.constitution}
                      </TableHead>
                      <TableHead className={language === "hi" ? "font-devanagari" : ""}>
                        {currentContent.dietPlan}
                      </TableHead>
                      <TableHead className={language === "hi" ? "font-devanagari" : ""}>
                        {currentContent.progress}
                      </TableHead>
                      <TableHead className={language === "hi" ? "font-devanagari" : ""}>
                        {currentContent.adherence}
                      </TableHead>
                      <TableHead className={language === "hi" ? "font-devanagari" : ""}>
                        {currentContent.weightChange}
                      </TableHead>
                      <TableHead className={language === "hi" ? "font-devanagari" : ""}>
                        {currentContent.status}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientReports.slice(0, 10).map((report) => (
                      <TableRow key={report.patient.id}>
                        <TableCell className="font-medium">
                          {report.patient.name}
                        </TableCell>
                        <TableCell className="capitalize">
                          {report.patient.constitution}
                        </TableCell>
                        <TableCell>
                          {report.dietPlan?.planName || "No active plan"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${report.progressPercentage}%` }}
                              />
                            </div>
                            <span className="text-sm">{report.progressPercentage}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-500 rounded-full"
                                style={{ width: `${report.adherenceScore}%` }}
                              />
                            </div>
                            <span className="text-sm">{report.adherenceScore}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className={report.weightChange < 0 ? "text-green-600" : report.weightChange > 0 ? "text-red-600" : "text-gray-600"}>
                            {report.weightChange > 0 ? "+" : ""}{report.weightChange.toFixed(1)}kg
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              report.status === "excellent" ? "default" :
                              report.status === "good" ? "secondary" :
                              report.status === "needs-improvement" ? "outline" : "destructive"
                            }
                            className={language === "hi" ? "font-devanagari" : ""}
                          >
                            {currentContent[report.status.replace("-", "") as keyof typeof currentContent] as string}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {analyticsData && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className={language === "hi" ? "font-devanagari" : ""}>
                      {currentContent.commonConditions}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(analyticsData.conditionFrequency)
                        .sort(([,a], [,b]) => b - a)
                        .slice(0, 5)
                        .map(([condition, count]) => (
                        <div key={condition} className="flex items-center justify-between">
                          <span>{condition}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-orange-500 rounded-full"
                                style={{ width: `${(count / Math.max(...Object.values(analyticsData.conditionFrequency))) * 100}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground w-8">{count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className={language === "hi" ? "font-devanagari" : ""}>
                      {currentContent.planEffectiveness}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(analyticsData.dietPlanEffectiveness).map(([plan, effectiveness]) => (
                        <div key={plan} className="flex items-center justify-between">
                          <span className="text-sm">{plan}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-green-500 rounded-full"
                                style={{ width: `${effectiveness}%` }}
                              />
                            </div>
                            <span className="text-sm text-muted-foreground">{effectiveness}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Exports Tab */}
          <TabsContent value="exports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className={language === "hi" ? "font-devanagari" : ""}>
                  {currentContent.exports}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-lg p-4">
                    <h3 className={`font-semibold mb-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                      Patient Progress Report
                    </h3>
                    <p className={`text-sm text-muted-foreground mb-3 ${language === "hi" ? "font-devanagari" : ""}`}>
                      Detailed progress reports for all patients
                    </p>
                    <div className="flex space-x-2">
                      <Button onClick={() => exportReport("pdf")} size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                      <Button onClick={() => exportReport("csv")} variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        CSV
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className={`font-semibold mb-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                      Analytics Summary
                    </h3>
                    <p className={`text-sm text-muted-foreground mb-3 ${language === "hi" ? "font-devanagari" : ""}`}>
                      Statistical analysis and trends
                    </p>
                    <div className="flex space-x-2">
                      <Button onClick={() => exportReport("pdf")} size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                      <Button onClick={() => exportReport("csv")} variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        CSV
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className={`font-semibold mb-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                      Diet Plan Performance
                    </h3>
                    <p className={`text-sm text-muted-foreground mb-3 ${language === "hi" ? "font-devanagari" : ""}`}>
                      Effectiveness of different diet plans
                    </p>
                    <div className="flex space-x-2">
                      <Button onClick={() => exportReport("pdf")} size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                      <Button onClick={() => exportReport("csv")} variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        CSV
                      </Button>
                    </div>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className={`font-semibold mb-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                      Custom Report
                    </h3>
                    <p className={`text-sm text-muted-foreground mb-3 ${language === "hi" ? "font-devanagari" : ""}`}>
                      Generate custom reports with specific criteria
                    </p>
                    <div className="flex space-x-2">
                      <Button onClick={() => exportReport("pdf")} size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </Button>
                      <Button onClick={() => exportReport("csv")} variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        CSV
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
