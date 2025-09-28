"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Sun, 
  Moon, 
  Activity, 
  TrendingUp, 
  Users, 
  Calendar,
  Leaf,
  Zap,
  BarChart3,
  Heart,
  Brain,
  Star
} from "lucide-react"

interface DoshaBalance {
  vata: number
  pitta: number
  kapha: number
}

interface ModernDashboardProps {
  userName: string
  totalPatients: number
  activePlans: number
  todayConsultations: number
  weeklyGrowth: number
}

export function ModernDashboard({
  userName,
  totalPatients,
  activePlans,
  todayConsultations,
  weeklyGrowth
}: ModernDashboardProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [doshaBalance] = useState<DoshaBalance>({ vata: 35, pitta: 40, kapha: 25 })

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 17) return "Good Afternoon"
    return "Good Evening"
  }

  const ayurvedicTips = [
    "Start your day with warm water to kindle Agni (digestive fire)",
    "Eat your largest meal at midday when Pitta is strongest",
    "Include all six tastes in every meal for optimal balance",
    "Mindful eating enhances digestion and nutrient absorption"
  ]

  return (
    <div className={`min-h-screen transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50'
    }`}>
      {/* Header with time and theme toggle */}
      <div className="flex justify-between items-center p-6 bg-white/90 backdrop-blur-xl border-b border-orange-100">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            {getGreeting()}, {userName}
          </h1>
          <p className="text-gray-600 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="border-orange-200"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
          
          <div className="text-right">
            <p className="text-2xl font-mono font-bold text-orange-600">
              {currentTime.toLocaleTimeString('en-US', { 
                hour12: false,
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
            <p className="text-xs text-gray-500">IST</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Ayurvedic Wisdom Card */}
        <Card className="bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0 shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-full">
                <Leaf className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Today's Ayurvedic Wisdom</h3>
                <p className="text-orange-100">
                  {ayurvedicTips[Math.floor(Math.random() * ayurvedicTips.length)]}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Total Patients"
            value={totalPatients}
            icon={Users}
            color="from-blue-500 to-blue-600"
            change={`+${weeklyGrowth}%`}
            trend="up"
          />
          <MetricCard
            title="Active Plans"
            value={activePlans}
            icon={Activity}
            color="from-green-500 to-green-600"
            change="+12%"
            trend="up"
          />
          <MetricCard
            title="Today's Consultations"
            value={todayConsultations}
            icon={Calendar}
            color="from-purple-500 to-purple-600"
            change="On track"
            trend="neutral"
          />
          <MetricCard
            title="Success Rate"
            value="94%"
            icon={TrendingUp}
            color="from-orange-500 to-amber-500"
            change="+2%"
            trend="up"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="doshas">Dosha Analytics</TabsTrigger>
            <TabsTrigger value="patients">Patient Insights</TabsTrigger>
            <TabsTrigger value="trends">Health Trends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-500" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start bg-gradient-to-r from-orange-500 to-amber-500">
                    <Users className="w-4 h-4 mr-2" />
                    Add New Patient
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Activity className="w-4 h-4 mr-2" />
                    Create Diet Plan
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </CardContent>
              </Card>

              {/* System Health */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Database Performance</span>
                      <span className="text-green-600">Excellent</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>AI Response Time</span>
                      <span className="text-green-600">Fast</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Data Sync Status</span>
                      <span className="text-green-600">Synced</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="doshas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Global Dosha Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-blue-600">Vata (Air + Ether)</span>
                      <span>{doshaBalance.vata}%</span>
                    </div>
                    <Progress value={doshaBalance.vata} className="h-3" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-red-600">Pitta (Fire + Water)</span>
                      <span>{doshaBalance.pitta}%</span>
                    </div>
                    <Progress value={doshaBalance.pitta} className="h-3" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-green-600">Kapha (Earth + Water)</span>
                      <span>{doshaBalance.kapha}%</span>
                    </div>
                    <Progress value={doshaBalance.kapha} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle>Patient Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Advanced patient analytics and insights will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle>Health Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Health trends and analytics will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: number | string
  icon: any
  color: string
  change: string
  trend: 'up' | 'down' | 'neutral'
}

function MetricCard({ title, value, icon: Icon, color, change, trend }: MetricCardProps) {
  const trendColors = {
    up: 'text-green-600 bg-green-50',
    down: 'text-red-600 bg-red-50',
    neutral: 'text-gray-600 bg-gray-50'
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
            <Badge className={`mt-2 ${trendColors[trend]}`}>
              {change}
            </Badge>
          </div>
          <div className={`p-3 rounded-full bg-gradient-to-r ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}