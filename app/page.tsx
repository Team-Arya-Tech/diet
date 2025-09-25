"use client"

import { useEffect, useState } from "react"
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
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50/30 to-orange-50/20">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
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
            <Card key={index} className="border border-amber-100 shadow-xl shadow-orange-500/5 bg-white/90 backdrop-blur-sm hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300 hover:-translate-y-1 rounded-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-orange-700 uppercase tracking-wide">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                        <div className="flex items-center space-x-2 mt-3">
                          <span className="text-sm font-bold text-orange-600 bg-amber-50 px-3 py-1 rounded-lg">
                            {stat.change}
                          </span>
                          <span className="text-xs text-gray-500">{stat.changeLabel}</span>
                        </div>
                      </div>
                      <div className={`p-4 ${stat.color} rounded-xl shadow-lg`}>
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Patients and Practitioner Info */}
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
                      <div className="text-right">
                        <Badge 
                          variant={patient.status === "active" ? "default" : "secondary"}
                          className={`mb-2 px-4 py-1 ${patient.status === "active" 
                            ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm" 
                            : "bg-gray-100 text-gray-600"
                          } rounded-lg`}
                        >
                          {patient.constitution}
                        </Badge>
                        <p className="text-xs text-gray-500 flex items-center justify-end mt-2">
                          <Activity className="h-3 w-3 mr-1.5" />
                          {patient.activeDietPlan ? "Active plan" : "No active plan"}
                        </p>
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

            {/* Practitioner Info - Horizontal Layout in Bottom Left */}
            <Card className="border border-emerald-100 shadow-xl shadow-emerald-500/5 bg-white/90 backdrop-blur-md rounded-xl overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 h-2 w-full"></div>
                <div className="p-6">
                  <div className="flex items-center space-x-6">
                    <div className="flex-shrink-0">
                      <div className="p-5 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-xl">
                        <Activity className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">AhaarWISE Practitioner</h3>
                      <p className="text-sm text-gray-600 mb-3">Holistic Health & Wellness Specialist</p>
                      <div className="flex items-center space-x-2 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100 max-w-fit">
                        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-emerald-700 font-medium">System Online & Operational</span>
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <div className="text-center bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-200 min-w-[90px] shadow-md">
                        <p className="text-2xl font-bold text-emerald-600">{stats.totalPatients}</p>
                        <p className="text-xs text-emerald-700 font-medium uppercase tracking-wide">Patients</p>
                      </div>
                      <div className="text-center bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-xl border border-emerald-200 min-w-[90px] shadow-md">
                        <p className="text-2xl font-bold text-emerald-600">{stats.activeDietPlans}</p>
                        <p className="text-xs text-emerald-700 font-medium uppercase tracking-wide">Plans</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="border border-emerald-100 shadow-xl shadow-emerald-500/5 bg-white/90 backdrop-blur-md rounded-xl overflow-hidden">
              <CardHeader className="pb-6 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-xl border-b border-emerald-100">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-md">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">Quick Actions</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-5">
                <QuickActionButton
                  href="/patients/new"
                  icon={UserPlus}
                  title="Add New Patient"
                  description="Register a new patient and assess their Prakriti"
                  colorClass="bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-200 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/20"
                />
                <QuickActionButton
                  href="/diet-charts"
                  icon={ChefHat}
                  title="Diet Chart Builder"
                  description="Build comprehensive diet charts with AI assistance"
                  colorClass="bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 border-emerald-200 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/20"
                />
                <QuickActionButton
                  href="/diet-plans/create"
                  icon={Calendar}
                  title="Create Diet Plan"
                  description="Design personalized Ayurvedic meal plans"
                  colorClass="bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border-amber-200 hover:border-amber-300 hover:shadow-lg hover:shadow-amber-500/20"
                />
                <QuickActionButton
                  href="/foods"
                  icon={Plus}
                  title="Manage Food Database"
                  description="Add and manage food items in the database"
                  colorClass="bg-gradient-to-r from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 border-cyan-200 hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-500/20"
                />
                <QuickActionButton
                  href="/category-recommendations"
                  icon={Leaf}
                  title="Category Recommendations"
                  description="Get personalized Ayurvedic recommendations"
                  colorClass="bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-green-200 hover:border-green-300 hover:shadow-lg hover:shadow-green-500/20"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
