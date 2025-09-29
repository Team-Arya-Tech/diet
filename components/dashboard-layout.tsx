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
  Bell
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const navigation = [
    {
      name: "Dashboard",
      href: "/",
      icon: Home,
      current: pathname === "/"
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
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-white/30 text-white text-sm backdrop-blur-sm">
                          {user.fullName?.split(' ').map(n => n[0]).join('') || user.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user.fullName || user.username}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {user.role} • {user.email || `@${user.username}`}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <UserIcon className="mr-2 h-4 w-4" />
                        <span>Profile Settings</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Preferences</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => {
                        if (confirm('Are you sure you want to logout?')) {
                          logout()
                        }
                      }} 
                      className="cursor-pointer text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
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