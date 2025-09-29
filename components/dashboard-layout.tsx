"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { useAuth } from "./auth-context"
import { LanguageSwitcher } from "./language-switcher"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { 
  Activity, 
  Users, 
  BookOpen, 
  Utensils, 
  FileText, 
  ChefHat,
  LogOut,
  User as UserIcon,
  Bot,
  BarChart3,
  Leaf,
  Calendar,
  Menu,
  X,
  Home,
  Settings,
  Bell,
  ChevronDown,
  Shield,
  HelpCircle
} from "lucide-react"
import { Badge } from "./ui/badge"
import { useTranslation } from "./translation-provider"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { t } = useTranslation()

  const getRoleBadgeColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin": return "bg-red-100 text-red-800"
      case "practitioner": return "bg-green-100 text-green-800"
      case "assistant": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const navigation = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
      current: pathname === "/dashboard"
    },
    {
      name: "Patients",
      href: "/patients",
      icon: Users,
      current: pathname.startsWith("/patients")
    },
    {
      name: "AI Assistant",
      href: "/chat",
      icon: Bot,
      current: pathname.startsWith("/chat"),
      badge: "AI"
    },
    {
      name: "Diet Charts",
      href: "/diet-charts",
      icon: ChefHat,
      current: pathname.startsWith("/diet-charts") || pathname.startsWith("/diet-chart")
    },
    {
      name: "Diet Plans",
      href: "/diet-plans",
      icon: Calendar,
      current: pathname.startsWith("/diet-plans")
    },
    {
      name: "Recipes",
      href: "/recipes",
      icon: BookOpen,
      current: pathname.startsWith("/recipes")
    },
    {
      name: "Food Database",
      href: "/foods",
      icon: Utensils,
      current: pathname.startsWith("/foods")
    },
    {
      name: "Exercises",
      href: "/exercises",
      icon: Activity,
      current: pathname.startsWith("/exercises")
    },
    {
      name: "Analytics",
      href: "/reports",
      icon: BarChart3,
      current: pathname.startsWith("/reports")
    },
    {
      name: "Recommendations",
      href: "/category-recommendations",
      icon: Leaf,
      current: pathname.startsWith("/category-recommendations")
    }
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 lg:w-72 shadow-xl transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        style={{
          backgroundImage: 'url("/nbg.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 bg-black/30">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg">AhaarWISE</h1>
                <p className="text-white/80 text-xs">Ayurvedic Intelligence</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white hover:bg-white/20"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200
                    ${item.current
                      ? 'bg-white/20 text-white shadow-md backdrop-blur-sm'
                      : 'text-gray-100 hover:bg-white/10 hover:text-white'
                    }
                  `}
                >
                  <Icon className={`mr-3 h-5 w-5 ${item.current ? 'text-white' : ''}`} />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span className="ml-2 px-2 py-0.5 text-xs bg-white/30 text-white rounded-full backdrop-blur-sm">
                      {item.badge}
                    </span>
                  )}
                  {item.current && (
                    <div className="w-2 h-2 bg-white rounded-full ml-2"></div>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Ayurvedic Principles Quick Access */}
          <div className="px-4 py-4 border-t border-white/20">
            <div className="bg-white/10 rounded-lg p-3 lg:p-4 backdrop-blur-sm">
              <div className="flex items-center space-x-2 mb-2">
                <Leaf className="h-4 w-4 text-gray-100 flex-shrink-0" />
                <span className="text-sm font-medium text-white">Ayurvedic Wisdom</span>
              </div>
              <p className="text-xs text-gray-100 leading-relaxed">
                Balance your doshas with seasonal awareness and mindful eating.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top header */}
        <header 
          className="shadow-sm border-b border-white/20"
          style={{
            backgroundImage: 'url("/nbg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="bg-black/30">
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="lg:hidden mr-2 text-white hover:bg-white/20"
                  onClick={() => setSidebarOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div className="flex items-center space-x-4">
                  <h2 className="text-lg font-semibold text-white">
                    {navigation.find(item => item.current)?.name || 'Dashboard'}
                  </h2>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <LanguageSwitcher />
                
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative text-white hover:bg-white/20">
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">3</span>
                  </span>
                </Button>

              {/* User menu */}
              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-10 w-auto px-3 rounded-lg hover:bg-white/10 backdrop-blur-sm transition-colors">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8 ring-2 ring-white/20">
                          <AvatarFallback className="bg-white/30 text-white text-sm backdrop-blur-sm font-semibold">
                            {user.fullName ? 
                              user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) :
                              user.username.slice(0, 2).toUpperCase()
                            }
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-medium text-white leading-none">
                            {user.fullName || user.username}
                          </span>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge 
                              variant="secondary" 
                              className={`text-xs px-2 py-0 ${getRoleBadgeColor(user.role || 'user')}`}
                            >
                              {t(user.role || 'user')}
                            </Badge>
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                              <span className="text-xs text-white/80">{t('Online')}</span>
                            </div>
                          </div>
                        </div>
                        <ChevronDown className="h-4 w-4 text-white/70" />
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-80" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal p-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold text-lg">
                            {user.fullName ? 
                              user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) :
                              user.username.slice(0, 2).toUpperCase()
                            }
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-semibold leading-none">
                            {user.fullName || user.username}
                          </p>
                          <p className="text-xs text-muted-foreground leading-none">
                            {user.email || `@${user.username}`}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${getRoleBadgeColor(user.role || 'user')}`}
                            >
                              {t(user.role || 'user')}
                            </Badge>
                            <div className="flex items-center space-x-1">
                              <Activity className="h-3 w-3 text-green-500" />
                              <span className="text-xs text-green-600">{t('Active')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    <div className="p-2">
                      <DropdownMenuItem asChild>
                        <Link 
                          href="/profile" 
                          className="cursor-pointer flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-accent/50 transition-colors"
                        >
                          <UserIcon className="h-4 w-4 text-primary" />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{t('Profile')}</span>
                            <span className="text-xs text-muted-foreground">{t('View and edit your profile')}</span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem asChild>
                        <Link 
                          href="/profile?tab=preferences" 
                          className="cursor-pointer flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-accent/50 transition-colors"
                        >
                          <Settings className="h-4 w-4 text-primary" />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{t('Preferences')}</span>
                            <span className="text-xs text-muted-foreground">{t('Language, theme & notifications')}</span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem asChild>
                        <Link 
                          href="/profile?tab=security" 
                          className="cursor-pointer flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-accent/50 transition-colors"
                        >
                          <Shield className="h-4 w-4 text-primary" />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{t('Security')}</span>
                            <span className="text-xs text-muted-foreground">{t('Password & account security')}</span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                      
                      <DropdownMenuItem asChild>
                        <Link 
                          href="/help" 
                          className="cursor-pointer flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-accent/50 transition-colors"
                        >
                          <HelpCircle className="h-4 w-4 text-primary" />
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{t('Help & Support')}</span>
                            <span className="text-xs text-muted-foreground">{t('Get help with your account')}</span>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    </div>
                    
                    <DropdownMenuSeparator />
                    
                    <div className="p-2">
                      <DropdownMenuItem
                        onClick={async () => {
                          const message = await t('Are you sure you want to sign out?')
                          if (confirm(message)) {
                            logout()
                          }
                        }} 
                        className="cursor-pointer flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">{t('Sign Out')}</span>
                          <span className="text-xs text-red-500">{t('Sign out of your account')}</span>
                        </div>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}