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
      color: "bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg shadow-blue-500/30",
      change: `+${stats.weeklyGrowth}%`,
      changeLabel: "This week"
    },
    {
      title: "Active Diet Charts",
      value: stats.activeDietPlans,
      icon: FileText,
      color: "bg-gradient-to-r from-emerald-500 to-green-500 shadow-lg shadow-emerald-500/30",
      change: "+8%",
      changeLabel: "This week"
    },
    {
      title: "Recipe Collection",
      value: stats.totalRecipes || 0,
      icon: BookOpen,
      color: "bg-gradient-to-r from-orange-500 to-amber-500 shadow-lg shadow-orange-500/30",
      change: "Traditional",
      changeLabel: "Ayurvedic recipes"
    },
    {
      title: "Food Database Items",
      value: `${stats.totalFoods}+`,
      icon: Utensils,
      color: "bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/30",
      change: "8,000+",
      changeLabel: "Total items"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-lg shadow-blue-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl shadow-lg">
                  <Activity className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Ayurvedic Diet Management
                  </h1>
                  <p className="text-sm text-gray-600">Harmonizing modern nutrition with ancient wisdom for optimal health</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-50 to-green-50 px-4 py-2 rounded-full border border-emerald-200">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-emerald-700">Ayurvedic Practitioner</span>
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
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              MANAGEMENT DASHBOARD
            </h2>
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg shadow-blue-500/10 border border-white/20">
            <Navigation />
          </div>
        </div>

        {/* Ayurvedic Principles Section */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              AYURVEDIC PRINCIPLES
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-200 shadow-lg shadow-orange-500/10">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-lg">
                  <Utensils className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">Six Tastes (Rasa)</h3>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">Sweet • Sour • Salt • Pungent • Bitter • Astringent</p>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-2xl border border-emerald-200 shadow-lg shadow-emerald-500/10">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
                  <Activity className="h-4 w-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">Constitutional Types</h3>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">Vata • Pitta • Kapha</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Card key={index} className="border-0 shadow-xl shadow-blue-500/10 bg-white/80 backdrop-blur-sm hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <div className="flex items-center space-x-2 mt-3">
                      <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                        {stat.change}
                      </span>
                      <span className="text-xs text-gray-500">{stat.changeLabel}</span>
                    </div>
                  </div>
                  <div className={`p-4 ${stat.color} rounded-2xl shadow-lg`}>
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
            <Card className="border-0 shadow-xl shadow-blue-500/10 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl shadow-lg">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl font-bold text-gray-900">Recent Patients</CardTitle>
                      <CardDescription className="text-sm text-gray-600">Latest patient registrations and updates</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-3 py-1">
                    {recentPatients.length} Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentPatients.map((patient, index) => (
                    <div key={patient.id} className="group flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl border border-gray-200 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-0.5">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12 ring-2 ring-blue-200 ring-offset-2">
                          <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold">
                            {patient.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-3">
                            <p className="font-bold text-gray-900">{patient.name}</p>
                            <Badge 
                              variant="secondary" 
                              className="text-xs bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 border-amber-200"
                            >
                              {patient.constitution}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 mt-2">
                            <span className="text-sm text-gray-600 flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {patient.age} years
                            </span>
                            <span className="text-sm text-gray-600">Female</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={patient.status === "active" ? "default" : "secondary"}
                          className={`mb-2 ${patient.status === "active" 
                            ? "bg-gradient-to-r from-emerald-500 to-green-500 text-white" 
                            : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {patient.constitution}
                        </Badge>
                        <p className="text-xs text-gray-500 flex items-center justify-end">
                          <Activity className="h-3 w-3 mr-1" />
                          {patient.activeDietPlan ? "Active plan" : "No active plan"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Link href="/patients" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-semibold group">
                    View all patients 
                    <svg className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Practitioner Info */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <Card className="border-0 shadow-xl shadow-purple-500/10 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-2xl">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">Quick Actions</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
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

            {/* Practitioner Info */}
            <Card className="border-0 shadow-xl shadow-teal-500/10 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center mb-6">
                  <div className="p-4 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl shadow-xl">
                    <Activity className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Ayurvedic Practitioner</h3>
                <p className="text-sm text-gray-600 mb-6">Holistic Health & Wellness Specialist</p>
                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200">
                    <p className="text-2xl font-bold text-blue-600">{stats.totalPatients}</p>
                    <p className="text-xs text-blue-700 font-medium uppercase tracking-wide">Total Patients</p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-4 rounded-xl border border-emerald-200">
                    <p className="text-2xl font-bold text-emerald-600">{stats.activeDietPlans}</p>
                    <p className="text-xs text-emerald-700 font-medium uppercase tracking-wide">Active Plans</p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span>System Online & Operational</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
