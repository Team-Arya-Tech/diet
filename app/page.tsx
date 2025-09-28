"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth, withAuth } from "@/components/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Navigation, QuickActionButton } from "@/components/navigation"
import { LanguageSwitcher } from "@/components/language-switcher"
import { 
  Users, 
  BookOpen, 
  Utensils, 
  TrendingUp, 
  Plus, 
  Calendar,
  Activity,
  FileText,
  ChefHat,
  UserPlus,
  Zap,
  BarChart3,
  Leaf,
  User as UserIcon,
  LogOut,
  Bot,
  Sparkles,
  Eye
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
  const { user, loading, logout } = useAuth()
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
    setRecentPatients(getRecentPatients(3));
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
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
      color: "bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30",
      change: `+${stats.weeklyGrowth}%`,
      changeLabel: "This week"
    },
    {
      title: "Active Diet Charts",
      value: stats.activeDietPlans,
      icon: FileText,
      color: "bg-gradient-to-r from-amber-500 to-yellow-500 shadow-lg shadow-amber-500/30",
      change: "+8%",
      changeLabel: "This week"
    },
    {
      title: "Recipe Collection",
      value: stats.totalRecipes || 0,
      icon: BookOpen,
      color: "bg-gradient-to-r from-red-500 to-orange-500 shadow-lg shadow-red-500/30",
      change: "Traditional",
      changeLabel: "Ayurvedic recipes"
    },
    {
      title: "Food Database Items",
      value: `${stats.totalFoods}+`,
      icon: Utensils,
      color: "bg-gradient-to-r from-amber-500 to-yellow-500 shadow-lg shadow-amber-500/30",
      change: "8,000+",
      changeLabel: "Total items"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/20 relative overflow-x-hidden">
      {/* Floating Ayurveda leaves background */}
      <svg className="absolute left-0 top-0 w-40 h-40 opacity-10 text-primary animate-float-slow z-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2C12 2 20 8 20 14C20 18 16 22 12 22C8 22 4 18 4 14C4 8 12 2 12 2Z" />
        <path d="M12 8V14" />
      </svg>
      <svg className="absolute right-0 bottom-0 w-32 h-32 opacity-10 text-emerald-600 animate-float-slower z-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2C12 2 20 8 20 14C20 18 16 22 12 22C8 22 4 18 4 14C4 8 12 2 12 2Z" />
        <path d="M12 8V14" />
      </svg>
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b border-amber-100 shadow-lg shadow-orange-500/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div className="flex items-center">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl shadow-lg">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                    AhaarWISE
                  </h1>
                  <p className="text-sm text-gray-600">Ayurvedic Diet Intelligence System • Modern nutrition with ancient wisdom</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-5">
              <LanguageSwitcher />
              <div className="flex items-center space-x-2 bg-gradient-to-r from-amber-50 to-orange-50 px-5 py-2.5 rounded-xl border border-amber-200 shadow-sm">
                <div className="w-2.5 h-2.5 bg-orange-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-orange-700">Ayurvedic Practitioner</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-100">
                <p className="text-sm font-medium text-gray-900">Holistic Health & Wellness</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        {/* Personalized greeting */}
        <div className="mb-8 flex items-center gap-4 animate-fade-in">
          <svg className="w-8 h-8 text-primary/80 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 2C12 2 20 8 20 14C20 18 16 22 12 22C8 22 4 18 4 14C4 8 12 2 12 2Z" />
            <path d="M12 8V14" />
          </svg>
          <div>
            <h2 className="text-xl font-bold text-primary mb-1">{greeting}</h2>
            <span className="text-sm text-muted-foreground">Your Ayurveda dashboard is ready.</span>
          </div>
        </div>

        {/* User Profile Section */}
        <Card className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                    {user.fullName?.split(' ').map(n => n[0]).join('') || user.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{user.fullName || user.username}</h3>
                  <p className="text-amber-700 font-medium capitalize">{user.role}</p>
                  <p className="text-sm text-gray-600">{user.email || `@${user.username}`}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  asChild
                  className="border-amber-300 hover:bg-amber-100"
                >
                  <Link href="/profile">
                    <UserIcon className="h-4 w-4 mr-2" />
                    View Profile
                  </Link>
                </Button>
                <Button
                  onClick={() => {
                    if (confirm('Are you sure you want to logout?')) {
                      logout()
                    }
                  }}
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Animated Ayurveda leaf divider */}
        <div className="w-full flex justify-center mb-10">
          <svg className="w-full max-w-2xl h-8" viewBox="0 0 400 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 16 Q100 32 200 16 T400 16" stroke="currentColor" strokeWidth="2" fill="none" className="text-primary/20" />
            <path d="M200 16 Q210 8 220 16 Q230 24 240 16" stroke="#eab308" strokeWidth="2" fill="none" />
            <circle cx="200" cy="16" r="4" fill="#eab308" />
          </svg>
        </div>
        {/* Management Navigation */}
  <div className="mb-10">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-2.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl shadow-md">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-orange-700 to-amber-600 bg-clip-text text-transparent">
              MANAGEMENT DASHBOARD
            </h2>
          </div>
          <div className="bg-white/80 backdrop-blur-md rounded-xl p-8 shadow-xl shadow-orange-500/10 border border-amber-100">
            <Navigation />
          </div>
        </div>

        {/* Ayurvedic Principles Section */}
  <div className="mb-10">
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-2.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl shadow-md">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-orange-700 to-amber-600 bg-clip-text text-transparent">
              AYURVEDIC PRINCIPLES
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-7 rounded-xl border border-amber-100 shadow-xl shadow-orange-500/5 hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl shadow-md">
                  <Utensils className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Six Tastes (Rasa)</h3>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-emerald-50 px-3 py-2 rounded-lg text-center">
                  <p className="text-sm font-medium text-emerald-800">Sweet</p>
                </div>
                <div className="bg-amber-50 px-3 py-2 rounded-lg text-center">
                  <p className="text-sm font-medium text-amber-800">Sour</p>
                </div>
                <div className="bg-blue-50 px-3 py-2 rounded-lg text-center">
                  <p className="text-sm font-medium text-blue-800">Salt</p>
                </div>
                <div className="bg-red-50 px-3 py-2 rounded-lg text-center">
                  <p className="text-sm font-medium text-red-800">Pungent</p>
                </div>
                <div className="bg-purple-50 px-3 py-2 rounded-lg text-center">
                  <p className="text-sm font-medium text-purple-800">Bitter</p>
                </div>
                <div className="bg-gray-50 px-3 py-2 rounded-lg text-center">
                  <p className="text-sm font-medium text-gray-800">Astringent</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-7 rounded-xl border border-emerald-100 shadow-xl shadow-emerald-500/5 hover:shadow-emerald-500/10 transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center space-x-4 mb-4">
                <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl shadow-md">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Constitutional Types</h3>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-blue-50 px-3 py-4 rounded-lg text-center">
                  <p className="text-sm font-medium text-blue-800">Vata</p>
                  <p className="text-xs text-blue-600 mt-1">Air & Ether</p>
                </div>
                <div className="bg-red-50 px-3 py-4 rounded-lg text-center">
                  <p className="text-sm font-medium text-red-800">Pitta</p>
                  <p className="text-xs text-red-600 mt-1">Fire & Water</p>
                </div>
                <div className="bg-amber-50 px-3 py-4 rounded-lg text-center">
                  <p className="text-sm font-medium text-amber-800">Kapha</p>
                  <p className="text-xs text-amber-600 mt-1">Earth & Water</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {statCards.map((stat, index) => (
            <Card
              key={index}
              className="border border-amber-100 shadow-xl shadow-orange-500/5 bg-white/90 backdrop-blur-sm hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-primary/40"
              tabIndex={0}
              aria-label={stat.title}
            >
              <CardContent className="p-0">
                <div className="relative group">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-orange-700 uppercase tracking-wide">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2 group-hover:scale-105 transition-transform duration-200">{stat.value}</p>
                        <div className="flex items-center space-x-2 mt-3">
                          <span className="text-sm font-bold text-orange-600 bg-amber-50 px-3 py-1 rounded-lg group-hover:bg-orange-100 transition-colors duration-200">
                            {stat.change}
                          </span>
                          <span className="text-xs text-gray-500">{stat.changeLabel}</span>
                        </div>
                      </div>
                      <div className={`p-4 ${stat.color} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                        <stat.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="h-1 w-full bg-gradient-to-r from-orange-500 to-amber-500"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* AI Assistant Widget */}
          <Card className="lg:col-span-1 border border-purple-100 shadow-xl shadow-purple-500/5 bg-white/90 backdrop-blur-md rounded-xl overflow-hidden">
            <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-t-xl border-b border-purple-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-violet-600 rounded-lg shadow-md">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">AI Assistant</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-4">Get AI-powered Ayurvedic guidance and recommendations</p>
              <Link href="/chat">
                <Button className="w-full bg-gradient-to-r from-purple-500 to-violet-600 hover:from-purple-600 hover:to-violet-700">
                  <Bot className="h-4 w-4 mr-2" />
                  Start Chat
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Diet Charts Widget */}
          <Card className="lg:col-span-1 border border-emerald-100 shadow-xl shadow-emerald-500/5 bg-white/90 backdrop-blur-md rounded-xl overflow-hidden">
            <CardHeader className="pb-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-xl border-b border-emerald-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg shadow-md">
                  <ChefHat className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">Diet Charts</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-4">Build AI-powered personalized diet charts</p>
              <Link href="/diet-charts">
                <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700">
                  <ChefHat className="h-4 w-4 mr-2" />
                  Build Charts
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recipes Widget */}
          <Card className="lg:col-span-1 border border-orange-100 shadow-xl shadow-orange-500/5 bg-white/90 backdrop-blur-md rounded-xl overflow-hidden">
            <CardHeader className="pb-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-t-xl border-b border-orange-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg shadow-md">
                  <BookOpen className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">Recipes</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-4">Explore Ayurvedic recipes and meal ideas</p>
              <Link href="/recipes">
                <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                  <BookOpen className="h-4 w-4 mr-2" />
                  View Recipes
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Reports Widget */}
          <Card className="lg:col-span-1 border border-blue-100 shadow-xl shadow-blue-500/5 bg-white/90 backdrop-blur-md rounded-xl overflow-hidden">
            <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl border-b border-blue-100">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md">
                  <BarChart3 className="h-4 w-4 text-white" />
                </div>
                <CardTitle className="text-lg font-bold text-gray-900">Analytics</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-4">View patient progress and system reports</p>
              <Link href="/reports">
                <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  View Reports
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Patients and Quick Actions */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Patients */}
            <Card className="border border-emerald-100 shadow-xl shadow-emerald-500/5 bg-white/90 backdrop-blur-md rounded-xl overflow-hidden">
              <CardHeader className="pb-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-xl border-b border-emerald-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl shadow-md">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">Recent Patients</CardTitle>
                      <CardDescription className="text-sm text-gray-600">Latest patient registrations and updates</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-1 text-sm rounded-lg shadow-sm">
                    {recentPatients.length} Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-5">
                  {recentPatients.map((patient, index) => (
                    <div 
                      key={patient.id} 
                      className="group flex items-center justify-between p-5 bg-white rounded-xl border border-amber-100 hover:border-amber-200 shadow-md hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-14 w-14 ring-2 ring-amber-200 ring-offset-2 shadow-md">
                          <AvatarFallback className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-lg">
                            {patient.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-3">
                            <p className="font-bold text-gray-900 text-lg">{patient.name}</p>
                            <Badge 
                              variant="secondary" 
                              className="text-xs bg-gradient-to-r from-amber-50 to-orange-50 text-amber-800 border border-amber-200 px-3 py-1 rounded-lg"
                            >
                              {patient.constitution}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-sm text-gray-600 flex items-center bg-gray-50 px-3 py-1 rounded-lg">
                              <Calendar className="h-3 w-3 mr-1.5" />
                              {patient.age} years
                            </span>
                            <span className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-lg">Female</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Link href={`/patients/${patient.id}`}>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </Link>
                        <Link href="/diet-charts">
                          <Button size="sm" variant="outline">
                            <ChefHat className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-6 border-t border-emerald-100">
                  <Link href="/patients" className="inline-flex items-center text-sm text-emerald-600 hover:text-emerald-800 font-semibold group bg-emerald-50 px-4 py-2 rounded-lg hover:bg-emerald-100 transition-colors">
                    View all patients 
                    <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Quick Action Shortcuts */}
            <Card className="border border-amber-100 shadow-xl shadow-amber-500/5 bg-white/90 backdrop-blur-md rounded-xl overflow-hidden">
              <CardHeader className="pb-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-xl border-b border-amber-100">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-md">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">Quick Actions</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/patients/new">
                    <Button variant="outline" className="w-full h-16 flex flex-col space-y-1 border-blue-200 hover:bg-blue-50">
                      <UserPlus className="h-5 w-5 text-blue-600" />
                      <span className="text-sm font-medium">Add Patient</span>
                    </Button>
                  </Link>
                  <Link href="/diet-plans/create">
                    <Button variant="outline" className="w-full h-16 flex flex-col space-y-1 border-emerald-200 hover:bg-emerald-50">
                      <Calendar className="h-5 w-5 text-emerald-600" />
                      <span className="text-sm font-medium">Create Plan</span>
                    </Button>
                  </Link>
                  <Link href="/foods">
                    <Button variant="outline" className="w-full h-16 flex flex-col space-y-1 border-cyan-200 hover:bg-cyan-50">
                      <Utensils className="h-5 w-5 text-cyan-600" />
                      <span className="text-sm font-medium">Manage Foods</span>
                    </Button>
                  </Link>
                  <Link href="/category-recommendations">
                    <Button variant="outline" className="w-full h-16 flex flex-col space-y-1 border-green-200 hover:bg-green-50">
                      <Leaf className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium">Recommendations</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* System Status and Features */}
          <div className="space-y-8">
            {/* System Status */}
            <Card className="border border-emerald-100 shadow-xl shadow-emerald-500/5 bg-white/90 backdrop-blur-md rounded-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 w-full"></div>
                <div className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-xl">
                      <Activity className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">System Status</h3>
                      <p className="text-sm text-gray-600">All services operational</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <span className="text-sm font-medium text-green-800">AI Assistant</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-700">Online</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <span className="text-sm font-medium text-blue-800">Database</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-blue-700">Connected</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <span className="text-sm font-medium text-purple-800">OpenAI API</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-purple-700">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature Access */}
            <Card className="border border-purple-100 shadow-xl shadow-purple-500/5 bg-white/90 backdrop-blur-md rounded-xl overflow-hidden">
              <CardHeader className="pb-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-t-xl border-b border-purple-100">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-violet-600 rounded-xl shadow-md">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">Advanced Features</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <Link href="/chat">
                  <Button variant="outline" className="w-full justify-start p-4 h-auto border-purple-200 hover:bg-purple-50">
                    <div className="flex items-center space-x-3">
                      <Bot className="h-5 w-5 text-purple-600" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">AI Consultation</p>
                        <p className="text-sm text-gray-600">Chat with AI assistant</p>
                      </div>
                    </div>
                  </Button>
                </Link>
                <Link href="/diet-chart">
                  <Button variant="outline" className="w-full justify-start p-4 h-auto border-emerald-200 hover:bg-emerald-50">
                    <div className="flex items-center space-x-3">
                      <Sparkles className="h-5 w-5 text-emerald-600" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">AI Diet Generator</p>
                        <p className="text-sm text-gray-600">Generate smart diet plans</p>
                      </div>
                    </div>
                  </Button>
                </Link>
                <Link href="/recipes/ai-generator">
                  <Button variant="outline" className="w-full justify-start p-4 h-auto border-orange-200 hover:bg-orange-50">
                    <div className="flex items-center space-x-3">
                      <ChefHat className="h-5 w-5 text-orange-600" />
                      <div className="text-left">
                        <p className="font-medium text-gray-900">Recipe Generator</p>
                        <p className="text-sm text-gray-600">AI-powered recipe creation</p>
                      </div>
                    </div>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
