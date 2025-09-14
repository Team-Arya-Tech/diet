"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Navigation, QuickActionButton } from "@/components/navigation"
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
  Leaf
} from "lucide-react"
import Link from "next/link"
import { 
  getDashboardStats, 
  getRecentPatients, 
  initializeSampleData,
  type DashboardStats,
  type PatientSummary 
} from "@/lib/database"

export default function DashboardPage() {
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

  useEffect(() => {
    // Initialize sample data if needed
    initializeSampleData()
    
    // Load dashboard data
    setStats(getDashboardStats())
    setRecentPatients(getRecentPatients(3))
  }, [])

  const statCards = [
    {
      title: "Total Patients",
      value: stats.totalPatients,
      icon: Users,
      color: "bg-blue-500",
      change: `+${stats.weeklyGrowth}%`,
      changeLabel: "This week"
    },
    {
      title: "Active Diet Charts",
      value: stats.activeDietPlans,
      icon: FileText,
      color: "bg-green-500",
      change: "+8%",
      changeLabel: "This week"
    },
    {
      title: "Recipe Collection",
      value: stats.totalRecipes || 0,
      icon: BookOpen,
      color: "bg-orange-500",
      change: "Traditional",
      changeLabel: "Ayurvedic recipes"
    },
    {
      title: "Food Database Items",
      value: `${stats.totalFoods}+`,
      icon: Utensils,
      color: "bg-cyan-500",
      change: "8,000+",
      changeLabel: "Total items"
    }
  ]

  const quickActions = [
    {
      title: "Add New Patient",
      description: "Register a new patient and assess their Prakriti",
      icon: UserPlus,
      href: "/patients/new",
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200"
    },
    {
      title: "Create Diet Chart",
      description: "Design personalized Ayurvedic meal plans",
      icon: ChefHat,
      href: "/diet-plans/create",
      color: "bg-green-50 hover:bg-green-100 border-green-200"
    },
    {
      title: "Browse Recipes",
      description: "Explore Ayurvedic recipes and create new ones",
      icon: BookOpen,
      href: "/recipes",
      color: "bg-orange-50 hover:bg-orange-100 border-orange-200"
    },
    {
      title: "Add Food Item",
      description: "Expand database with new food items",
      icon: Plus,
      href: "/foods",
      color: "bg-cyan-50 hover:bg-cyan-100 border-cyan-200"
    },
    {
      title: "Category Recommendations",
      description: "Get personalized Ayurvedic category recommendations",
      icon: Leaf,
      href: "/category-recommendations",
      color: "bg-emerald-50 hover:bg-emerald-100 border-emerald-200"
    },
    {
      title: "View Reports",
      description: "Analyze patient progress and system analytics",
      icon: BarChart3,
      href: "/reports",
      color: "bg-purple-50 hover:bg-purple-100 border-purple-200"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <Activity className="h-8 w-8 text-teal-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Ayurvedic Diet Management</h1>
                  <p className="text-sm text-gray-500">Harmonizing modern nutrition with ancient wisdom for optimal health</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-700">Ayurvedic Practitioner</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Holistic Health & Wellness</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Management Navigation */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">MANAGEMENT</h2>
          <Navigation />
        </div>

        {/* Ayurvedic Principles Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">AYURVEDIC PRINCIPLES</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-medium text-gray-900 mb-2">Six Tastes (Rasa)</h3>
              <p className="text-sm text-gray-600">Sweet • Sour • Salt • Pungent • Bitter • Astringent</p>
            </div>
            <div className="bg-white p-4 rounded-lg border">
              <h3 className="font-medium text-gray-900 mb-2">Constitutional Types</h3>
              <p className="text-sm text-gray-600">Vata • Pitta • Kapha</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center space-x-1 mt-2">
                      <span className="text-sm font-medium text-green-600">{stat.change}</span>
                      <span className="text-sm text-gray-500">{stat.changeLabel}</span>
                    </div>
                  </div>
                  <div className={`p-3 ${stat.color} rounded-full`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Patients */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold">Recent Patients</CardTitle>
                    <CardDescription className="text-sm text-gray-500">Latest patient registrations</CardDescription>
                  </div>
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentPatients.map((patient) => (
                    <div key={patient.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-blue-100 text-blue-700">
                            {patient.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-medium text-gray-900">{patient.name}</p>
                            <Badge variant="secondary" className="text-xs">
                              {patient.constitution}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-sm text-gray-500">{patient.age} years</span>
                            <span className="text-sm text-gray-500">Female</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={patient.status === "active" ? "default" : "secondary"}
                          className="mb-1"
                        >
                          {patient.constitution}
                        </Badge>
                        <p className="text-xs text-gray-500">
                          {patient.activeDietPlan ? "Active plan" : "No active plan"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Link href="/patients" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    View all patients →
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="border-0 shadow-sm mb-6">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <QuickActionButton
                  href="/patients/new"
                  icon={UserPlus}
                  title="Add New Patient"
                  description="Register a new patient and assess their Prakriti"
                  colorClass="bg-blue-50 hover:bg-blue-100 border-blue-200"
                />
                <QuickActionButton
                  href="/diet-plans/create"
                  icon={ChefHat}
                  title="Create Diet Chart"
                  description="Design personalized Ayurvedic meal plans"
                  colorClass="bg-green-50 hover:bg-green-100 border-green-200"
                />
                <QuickActionButton
                  href="/recipes"
                  icon={BookOpen}
                  title="Browse Recipes"
                  description="Explore Ayurvedic recipes and create new ones"
                  colorClass="bg-orange-50 hover:bg-orange-100 border-orange-200"
                />
                <QuickActionButton
                  href="/recipes/ai-generator"
                  icon={Zap}
                  title="AI Recipe Generator"
                  description="Generate personalized recipes using AI"
                  colorClass="bg-purple-50 hover:bg-purple-100 border-purple-200"
                />
                <QuickActionButton
                  href="/category-recommendations"
                  icon={Leaf}
                  title="Category Recommendations"
                  description="Get personalized Ayurvedic recommendations"
                  colorClass="bg-emerald-50 hover:bg-emerald-100 border-emerald-200"
                />
                <QuickActionButton
                  href="/foods"
                  icon={Plus}
                  title="Add Food Item"
                  description="Expand database with new food items"
                  colorClass="bg-cyan-50 hover:bg-cyan-100 border-cyan-200"
                />
              </CardContent>
            </Card>

            {/* Practitioner Info */}
            <Card className="border-0 shadow-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-orange-500" />
                  <CardTitle className="text-lg font-semibold">Recipe Highlights</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <QuickActionButton
                  href="/recipes"
                  icon={BookOpen}
                  title="Browse Recipes"
                  description={`${stats.totalRecipes || 0}+ traditional Ayurvedic recipes`}
                  colorClass="bg-orange-50 hover:bg-orange-100 border-orange-200"
                />
                <QuickActionButton
                  href="/recipes/ai-generator"
                  icon={Zap}
                  title="AI Recipe Generator"
                  description="Create personalized recipes with AI"
                  colorClass="bg-purple-50 hover:bg-purple-100 border-purple-200"
                />
              </CardContent>
            </Card>

            {/* Practitioner Info */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-teal-100 rounded-full">
                    <Activity className="h-6 w-6 text-teal-600" />
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Ayurvedic Practitioner</h3>
                <p className="text-sm text-gray-600">Holistic Health & Wellness</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
