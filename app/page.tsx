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
      color: "text-amber-800",
      change: `+${stats.weeklyGrowth}%`,
      changeLabel: "This week"
    },
    {
      title: "Active Diet Plans",
      value: stats.activeDietPlans,
      icon: Heart,
      color: "text-yellow-800",
      change: "+8%",
      changeLabel: "This week"
    },
    {
      title: "Recipe Collection",
      value: stats.totalRecipes || 0,
      icon: ChefHat,
      color: "text-orange-800",
      change: "Traditional",
      changeLabel: "Ayurvedic recipes"
    },
    {
      title: "Food Database",
      value: `${stats.totalFoods}+`,
      icon: Database,
      color: "text-stone-800",
      change: "8,000+",
      changeLabel: "Total items"
    }
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6 min-h-screen" style={{
        backgroundImage: 'url("/main_bg.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Welcome Section */}
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
            {/* Content */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div 
                className="p-3 rounded-xl w-fit border-2"
                style={{
                  backgroundColor: '#F0E6D2',
                  borderColor: '#D4C4A8'
                }}
              >
                <Heart className="h-6 w-6 text-amber-900" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-amber-900">
                  Welcome back, Dr. Ayurved Practitioner!
                </h1>
                <p className="text-sm sm:text-base text-amber-800 mt-1">
                  Balance your doshas with seasonal fruits and vegetables.
                </p>
              </div>
            </div>
          </div>
        </div>



        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-all duration-300 relative overflow-hidden border-2 border-amber-900/60 shadow-md"
              style={{
                backgroundImage: 'url("/bg3.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                minHeight: '140px'
              }}
            >
              {/* Reduced overlay opacity to show more of the background */}
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px]"></div>
              <CardContent className="p-4 lg:p-6 relative z-10 h-full flex items-center">
                <div className="flex items-center justify-between w-full">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-800 truncate">{stat.title}</p>
                    <p className="text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-700 mt-1">
                      <span className="text-green-700 font-medium">{stat.change}</span> {stat.changeLabel}
                    </p>
                  </div>
                  <div className="p-2 lg:p-3 rounded-lg bg-white/80 flex-shrink-0 shadow-sm">
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
            <Card 
              className="relative overflow-hidden border-2 border-amber-900/60 shadow-md"
              style={{
                backgroundImage: 'url("/bg10.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px]"></div>
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center space-x-2 text-gray-800">
                  <Users className="h-5 w-5" />
                  <span>Recent Patients</span>
                </CardTitle>
                <CardDescription className="text-gray-700">
                  Latest patient registrations and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-4">
                  {recentPatients.map((patient) => (
                    <div key={patient.id} className="flex items-center justify-between p-4 border border-gray-300/50 rounded-lg bg-white/60">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>{patient.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-800">{patient.name}</p>
                          <div className="flex items-center space-x-2 text-sm text-gray-700">
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
                <div className="mt-6 pt-4 border-t border-gray-300/50">
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
            <Card 
              className="overflow-hidden border-2 border-amber-900/60 shadow-md"
              style={{
                backgroundImage: 'url("/bg18.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-800">
                  <Leaf className="h-5 w-5" />
                  <span>Ayurvedic Principles</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 text-amber-900">Six Tastes (Rasa)</h4>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-amber-50/90 px-2 py-1 rounded text-center text-amber-900 font-medium border border-amber-200/50">Sweet</div>
                    <div className="bg-stone-50/90 px-2 py-1 rounded text-center text-stone-900 font-medium border border-stone-200/50">Sour</div>
                    <div className="bg-amber-100/90 px-2 py-1 rounded text-center text-amber-800 font-medium border border-amber-300/50">Salt</div>
                    <div className="bg-yellow-50/90 px-2 py-1 rounded text-center text-yellow-900 font-medium border border-yellow-200/50">Pungent</div>
                    <div className="bg-stone-100/90 px-2 py-1 rounded text-center text-stone-800 font-medium border border-stone-300/50">Bitter</div>
                    <div className="bg-neutral-50/90 px-2 py-1 rounded text-center text-neutral-800 font-medium border border-neutral-200/50">Astringent</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-amber-900">Constitutional Types</h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="bg-stone-50/90 px-2 py-2 rounded text-center border border-stone-200/50">
                      <div className="font-medium text-stone-900">Vata</div>
                      <div className="text-stone-700">Air & Ether</div>
                    </div>
                    <div className="bg-amber-50/90 px-2 py-2 rounded text-center border border-amber-200/50">
                      <div className="font-medium text-amber-900">Pitta</div>
                      <div className="text-amber-700">Fire & Water</div>
                    </div>
                    <div className="bg-yellow-50/90 px-2 py-2 rounded text-center border border-yellow-200/50">
                      <div className="font-medium text-yellow-900">Kapha</div>
                      <div className="text-yellow-700">Earth & Water</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card 
              className="overflow-hidden border-2 border-amber-900/60 shadow-md"
              style={{
                backgroundImage: 'url("/bg14.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-gray-800">
                  <Activity className="h-5 w-5" />
                  <span>System Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-amber-50/90 rounded-lg border border-amber-200/50">
                    <span className="text-sm font-medium text-amber-900">AI Assistant</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-amber-600 rounded-full"></div>
                      <span className="text-xs text-amber-800">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-stone-50/90 rounded-lg border border-stone-200/50">
                    <span className="text-sm font-medium text-stone-900">Database</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-stone-600 rounded-full"></div>
                      <span className="text-xs text-stone-800">Connected</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50/90 rounded-lg border border-yellow-200/50">
                    <span className="text-sm font-medium text-yellow-900">OpenAI API</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                      <span className="text-xs text-yellow-800">Active</span>
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
