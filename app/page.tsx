"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-context"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Users, 
  BookOpen, 
  Utensils, 
  Calendar,
  Activity,
  ChefHat,
  BarChart3,
  Leaf,
  Bot,
  Heart,
  TrendingUp,
  Database,
  Clock
} from "lucide-react"
import Link from "next/link"
import { 
  getDashboardStats, 
  getRecentPatients, 
  initializeSampleData,
  type DashboardStats,
  type PatientSummary 
} from "@/lib/database"

function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  
  // All state declarations must come before any conditional returns
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    activePatients: 0,
    activeDietPlans: 0,
    totalFoods: 0,
    totalRecipes: 0,
    weeklyGrowth: 0,
    monthlyConsultations: 0,
    averageAdherence: 0
  })
  const [recentPatients, setRecentPatients] = useState<PatientSummary[]>([])

  // Personalized greeting and Ayurveda tip
  const greetings = [
    "Good morning! Start your day with warm water and mindfulness.",
    "Namaste! Remember to balance all six tastes in your meals today.",
    "Ayurveda Tip: Eat with gratitude and awareness for better digestion.",
    "Stay hydrated and take a mindful walk after meals.",
    "Balance your doshas with seasonal fruits and vegetables."
  ];
  const [greeting, setGreeting] = useState("");
  
  // Initialize data and greeting
  useEffect(() => {
    initializeSampleData();
    setStats(getDashboardStats());
    setRecentPatients(getRecentPatients(5));
    // Pick a random greeting
    setGreeting(greetings[Math.floor(Math.random() * greetings.length)]);
  }, []);
  
  // Redirect to login if not authenticated and not loading
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  // Don't render if user is not authenticated
  if (!user) {
    return null
  }

  const statCards = [
    {
      title: "Total Patients",
      value: stats.totalPatients,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      change: `+${stats.weeklyGrowth}%`,
      changeLabel: "This week"
    },
    {
      title: "Active Diet Plans",
      value: stats.activeDietPlans,
      icon: Heart,
      color: "text-green-600",
      bgColor: "bg-green-50",
      change: "+8%",
      changeLabel: "This week"
    },
    {
      title: "Recipe Collection",
      value: stats.totalRecipes || 0,
      icon: ChefHat,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      change: "Traditional",
      changeLabel: "Ayurvedic recipes"
    },
    {
      title: "Food Database",
      value: `${stats.totalFoods}+`,
      icon: Database,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      change: "8,000+",
      changeLabel: "Total items"
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Welcome Section */}
        <div className="mb-6">
          <div className="relative rounded-xl overflow-hidden p-6 mb-4 min-h-[120px]">
            {/* Background Image */}
            <div 
              className="absolute inset-0 w-full h-full"
              style={{
                backgroundImage: 'url("/banner_canva.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            />
            {/* Content */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div className="p-3 bg-white/30 backdrop-blur-sm rounded-xl w-fit">
                <Heart className="h-6 w-6 text-amber-800" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-black drop-shadow-sm">Welcome back, Dr. Ayurved Practitioner!</h1>
                <p className="text-sm sm:text-base text-amber-900 mt-1 drop-shadow-sm">Balance your doshas with seasonal fruits and vegetables.</p>
              </div>
            </div>
          </div>
        </div>



        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 lg:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-600 truncate">{stat.title}</p>
                    <p className="text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      <span className="text-green-600 font-medium">{stat.change}</span> {stat.changeLabel}
                    </p>
                  </div>
                  <div className={`p-2 lg:p-3 rounded-lg ${stat.bgColor} flex-shrink-0`}>
                    <stat.icon className={`h-5 w-5 lg:h-6 lg:w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>



        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Recent Patients */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Recent Patients</span>
                </CardTitle>
                <CardDescription>
                  Latest patient registrations and updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPatients.map((patient) => (
                    <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{patient.name}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <span>{patient.age} years</span>
                            <Badge variant="secondary" className="text-xs">
                              {patient.constitution}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link href={`/patients/${patient.id}`}>
                          <Button size="sm" variant="outline">
                            View
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t">
                  <Link href="/patients">
                    <Button variant="outline" className="w-full">
                      View All Patients
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Ayurvedic Principles & System Status */}
          <div className="space-y-6">
            {/* Ayurvedic Principles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Leaf className="h-5 w-5" />
                  <span>Ayurvedic Principles</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Six Tastes (Rasa)</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-green-50 px-2 py-1 rounded text-center">Sweet</div>
                    <div className="bg-yellow-50 px-2 py-1 rounded text-center">Sour</div>
                    <div className="bg-blue-50 px-2 py-1 rounded text-center">Salt</div>
                    <div className="bg-red-50 px-2 py-1 rounded text-center">Pungent</div>
                    <div className="bg-purple-50 px-2 py-1 rounded text-center">Bitter</div>
                    <div className="bg-gray-50 px-2 py-1 rounded text-center">Astringent</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Constitutional Types</h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-blue-50 px-2 py-2 rounded text-center">
                      <div className="font-medium">Vata</div>
                      <div className="text-gray-600">Air & Ether</div>
                    </div>
                    <div className="bg-red-50 px-2 py-2 rounded text-center">
                      <div className="font-medium">Pitta</div>
                      <div className="text-gray-600">Fire & Water</div>
                    </div>
                    <div className="bg-yellow-50 px-2 py-2 rounded text-center">
                      <div className="font-medium">Kapha</div>
                      <div className="text-gray-600">Earth & Water</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>System Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-green-800">AI Assistant</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-700">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-blue-800">Database</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-xs text-blue-700">Connected</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium text-purple-800">OpenAI API</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-xs text-purple-700">Active</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashboardPage
