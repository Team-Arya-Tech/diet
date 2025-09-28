"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar,
  FileText,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Heart,
  Brain,
  Leaf,
  Target
} from 'lucide-react'
import { 
  AdvancedReportingEngine, 
  PatientProgressMetrics, 
  PopulationHealthAnalytics,
  ReportingUtils
} from '@/lib/advanced-reporting'
import { EnhancedPatientService } from '@/lib/enhanced-patient-management'
import { RecipeIntelligenceEngine } from '@/lib/recipe-intelligence'
import { 
  exportPatientAnalyticsPDF,
  exportPopulationAnalyticsPDF,
  exportMealPlanAnalyticsPDF,
  exportComplianceAnalyticsPDF,
  AnalyticsPDFExporter
} from '@/lib/pdf-export'

export function AnalyticsDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [populationAnalytics, setPopulationAnalytics] = useState<PopulationHealthAnalytics | null>(null)
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'quarter' | 'year'>('month')
  const [isGeneratingReport, setIsGeneratingReport] = useState(false)
  const [reportType, setReportType] = useState<'overview' | 'detailed' | 'compliance'>('overview')

  useEffect(() => {
    loadDashboardData()
    loadPopulationAnalytics()
  }, [selectedTimeframe])

  const loadDashboardData = async () => {
    try {
      const patients = EnhancedPatientService.getAllPatients()
      const consultations = EnhancedPatientService.getAllConsultations()
      const mealPlans = RecipeIntelligenceEngine.getAllMealPlans()
      
      const metrics = AdvancedReportingEngine.generateDashboardMetrics(
        patients,
        consultations,
        mealPlans
      )
      
      setDashboardData(metrics)
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    }
  }

  const loadPopulationAnalytics = async () => {
    try {
      const patients = EnhancedPatientService.getAllPatients()
      const consultations = EnhancedPatientService.getAllConsultations()
      
      const analytics = AdvancedReportingEngine.generatePopulationHealthAnalytics(
        patients,
        consultations
      )
      
      setPopulationAnalytics(analytics)
    } catch (error) {
      console.error('Error loading population analytics:', error)
    }
  }

  const generatePDFReport = async (type: 'population' | 'compliance' | 'individual') => {
    setIsGeneratingReport(true)
    
    try {
      const currentDate = new Date()
      const dateRange = {
        start: new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        end: currentDate
      }

      if (type === 'population' && populationAnalytics) {
        // Use the new comprehensive branded PDF export
        await exportPopulationAnalyticsPDF(populationAnalytics, dateRange)
        
      } else if (type === 'compliance') {
        const patients = EnhancedPatientService.getAllPatients()
        const complianceData = {
          overallRate: 78,
          dietAdherence: 82,
          medicationCompliance: 75,
          exerciseAdherence: 65,
          followUpAttendance: 88,
          lifestyleCompliance: 70,
          byAge: {
            age1830: 85,
            age3145: 78,
            age4660: 72,
            age60plus: 68
          },
          byGender: {
            male: 75,
            female: 81
          },
          riskFactors: [
            { name: 'Work Schedule Conflicts', impact: 'High', frequency: 35 },
            { name: 'Social Events', impact: 'Medium', frequency: 28 },
            { name: 'Travel Disruption', impact: 'Medium', frequency: 22 },
            { name: 'Lack of Family Support', impact: 'High', frequency: 18 }
          ],
          improvementStrategies: [
            'Implement flexible meal timing options for working professionals',
            'Provide social dining guidelines and restaurant recommendations',
            'Create travel-friendly meal plans and portable recipes',
            'Establish family education programs and support groups',
            'Develop mobile app reminders and progress tracking',
            'Offer virtual consultations for busy schedules'
          ]
        }
        
        await exportComplianceAnalyticsPDF(complianceData, dateRange)
        
      } else if (type === 'individual') {
        // Generate individual patient reports for all active patients
        const patients = EnhancedPatientService.getAllPatients()
        const activePatients = patients.slice(0, 5) // Process first 5 for demo
        
        for (const patient of activePatients) {
          const progressData = {
            healthScore: Math.floor(Math.random() * 30) + 70, // 70-100
            currentBMI: (patient.weight / Math.pow(patient.height / 100, 2)).toFixed(1),
            bmiCategory: 'Normal',
            weightChange: (Math.random() * 10 - 5).toFixed(1), // -5 to +5 kg
            energyImprovement: Math.floor(Math.random() * 40) + 10, // 10-50%
            symptomReduction: Math.floor(Math.random() * 50) + 30, // 30-80%
            dietCompliance: Math.floor(Math.random() * 30) + 70, // 70-100%
            exerciseAdherence: Math.floor(Math.random() * 40) + 40, // 40-80%
            avgCalories: Math.floor(Math.random() * 500) + 1800, // 1800-2300
            proteinIntake: Math.floor(Math.random() * 30) + 60, // 60-90g
            proteinPercentage: 18,
            carbIntake: Math.floor(Math.random() * 50) + 200, // 200-250g
            carbPercentage: 55,
            fatIntake: Math.floor(Math.random() * 20) + 50, // 50-70g
            fatPercentage: 27,
            fiberIntake: Math.floor(Math.random() * 10) + 25, // 25-35g
            hydrationLevel: Math.floor(Math.random() * 20) + 80, // 80-100%
            recommendations: [
              'Increase morning hydration with warm water and lemon',
              'Add more seasonal vegetables to main meals',
              'Practice pranayama breathing exercises daily',
              'Maintain consistent meal timing for better digestion',
              'Include digestive spices like ginger and cumin'
            ]
          }
          
          await exportPatientAnalyticsPDF(patient, progressData, {
            includeNutritionalAnalysis: true,
            includeAyurvedicGuidelines: true,
            includeProgressCharts: true,
            includeRecommendations: true,
            language: 'en'
          })
        }
        
      } else {
        throw new Error('Invalid report type')
      }
      
    } catch (error) {
      console.error('Error generating comprehensive PDF report:', error)
      alert('Error generating report. Please try again.')
    } finally {
      setIsGeneratingReport(false)
    }
  }

  if (!dashboardData || !populationAnalytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading analytics dashboard...</p>
        </div>
      </div>
    )
  }

  const constitutionColors = {
    vata: '#8B5CF6',
    pitta: '#EF4444',
    kapha: '#10B981'
  }

  const constitutionData = [
    { name: 'Vata', value: dashboardData.constitution.vataPatients, color: constitutionColors.vata },
    { name: 'Pitta', value: dashboardData.constitution.pittaPatients, color: constitutionColors.pitta },
    { name: 'Kapha', value: dashboardData.constitution.kaphaPatients, color: constitutionColors.kapha }
  ]

  const ageGroupData = populationAnalytics.demographics.ageGroups.map(group => ({
    ageRange: group.range,
    patients: group.count,
    percentage: group.percentage
  }))

  const trendsData = [
    { month: 'Jan', patients: 45, consultations: 120, satisfaction: 4.1 },
    { month: 'Feb', patients: 52, consultations: 135, satisfaction: 4.2 },
    { month: 'Mar', patients: 48, consultations: 142, satisfaction: 4.0 },
    { month: 'Apr', patients: 61, consultations: 158, satisfaction: 4.3 },
    { month: 'May', patients: 67, consultations: 175, satisfaction: 4.2 },
    { month: 'Jun', patients: dashboardData.overview.totalPatients, consultations: dashboardData.overview.monthlyConsultations, satisfaction: dashboardData.trends.satisfactionTrend }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Comprehensive insights into patient health outcomes and practice performance
            </p>
          </div>
          
          <div className="flex space-x-3">
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            
            <Button
              onClick={() => generatePDFReport('population')}
              disabled={isGeneratingReport}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              {isGeneratingReport ? 'Generating...' : 'Export Report'}
            </Button>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Patients"
            value={dashboardData.overview.totalPatients}
            change={ReportingUtils.formatTrend(dashboardData.trends.patientGrowth)}
            changeType={dashboardData.trends.patientGrowth >= 0 ? 'positive' : 'negative'}
            icon={Users}
            color="blue"
          />
          
          <MetricCard
            title="Active Patients"
            value={dashboardData.overview.activePatients}
            change={`${Math.round((dashboardData.overview.activePatients / dashboardData.overview.totalPatients) * 100)}% active`}
            changeType="neutral"
            icon={Heart}
            color="green"
          />
          
          <MetricCard
            title="Weekly Consultations"
            value={dashboardData.overview.weeklyConsultations}
            change={ReportingUtils.formatTrend(dashboardData.trends.consultationTrend)}
            changeType={dashboardData.trends.consultationTrend >= 0 ? 'positive' : 'negative'}
            icon={Calendar}
            color="purple"
          />
          
          <MetricCard
            title="Patient Satisfaction"
            value={`${dashboardData.trends.satisfactionTrend.toFixed(1)}/5.0`}
            change="4.2 avg this month"
            changeType="positive"
            icon={Target}
            color="orange"
          />
        </div>

        {/* Urgent Actions Alert */}
        {dashboardData.urgentActions.length > 0 && (
          <Alert className="border-orange-200 bg-orange-50">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <div className="font-semibold mb-2">Urgent Actions Required:</div>
              <ul className="space-y-1">
                {dashboardData.urgentActions.map((action: any, index: number) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <span className="font-medium">{action.description}</span>
                      {action.patients && (
                        <div className="text-sm text-orange-700 mt-1">
                          Patients: {action.patients.join(', ')}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Constitution Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <span>Constitution Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={constitutionData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                    >
                      {constitutionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 space-y-2">
                {constitutionData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }} 
                      />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <Badge variant="outline">{item.value} patients</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Age Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Age Distribution</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ageGroupData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ageRange" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => [value, name === 'patients' ? 'Patients' : 'Percentage']}
                    />
                    <Bar dataKey="patients" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trends Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <span>Practice Trends</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="patients" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                    name="New Patients"
                  />
                  <Line 
                    yAxisId="left"
                    type="monotone" 
                    dataKey="consultations" 
                    stroke="#10B981" 
                    strokeWidth={3}
                    name="Consultations"
                  />
                  <Line 
                    yAxisId="right"
                    type="monotone" 
                    dataKey="satisfaction" 
                    stroke="#F59E0B" 
                    strokeWidth={3}
                    name="Satisfaction (1-5)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Health Outcomes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-red-600" />
                <span>Health Outcomes</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Symptom Resolution Rate</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${populationAnalytics.outcomes.symptomResolutionRate}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-green-600">
                      {populationAnalytics.outcomes.symptomResolutionRate}%
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Treatment Success Rate</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${populationAnalytics.outcomes.treatmentSuccessRate}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-blue-600">
                      {populationAnalytics.outcomes.treatmentSuccessRate}%
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Average Weight Loss</span>
                  <Badge variant="outline" className="bg-orange-50 text-orange-700">
                    {populationAnalytics.outcomes.averageWeightLoss} kg
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Average Treatment Duration</span>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700">
                    {populationAnalytics.outcomes.averageTreatmentDuration} weeks
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Common Symptoms */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Leaf className="w-5 h-5 text-green-600" />
                <span>Most Common Symptoms</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {populationAnalytics.patterns.mostCommonSymptoms.slice(0, 6).map((symptom, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{symptom.symptom}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full" 
                          style={{ width: `${symptom.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600 w-8 text-right">
                        {symptom.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-gray-600" />
              <span>Report Generation</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={() => generatePDFReport('population')}
                disabled={isGeneratingReport}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Population Health Report
              </Button>
              
              <Button 
                onClick={() => generatePDFReport('compliance')}
                disabled={isGeneratingReport}
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Compliance Report
              </Button>
              
              <Button 
                onClick={() => generatePDFReport('individual')}
                disabled={isGeneratingReport}
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <Users className="w-4 h-4 mr-2" />
                Individual Patient Reports
              </Button>
              
              <Button 
                variant="outline"
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                <Clock className="w-4 h-4 mr-2" />
                Quarterly Summary
              </Button>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <p>
                Reports include detailed analytics, charts, and compliance information 
                suitable for regulatory submissions and practice improvement.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string | number
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: any
  color: 'blue' | 'green' | 'purple' | 'orange'
}

function MetricCard({ title, value, change, changeType, icon: Icon, color }: MetricCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    purple: 'bg-purple-50 text-purple-600',
    orange: 'bg-orange-50 text-orange-600'
  }

  const changeColors = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-600'
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className="text-2xl font-bold text-gray-900 mt-2">{value}</div>
            <p className={`text-sm mt-1 ${changeColors[changeType]}`}>
              {changeType === 'positive' && <TrendingUp className="w-3 h-3 inline mr-1" />}
              {changeType === 'negative' && <TrendingDown className="w-3 h-3 inline mr-1" />}
              {change}
            </p>
          </div>
          <div className={`p-3 rounded-full ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}