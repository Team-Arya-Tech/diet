"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
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
  Calendar
} from "lucide-react"
import { useAuth } from "./auth-context"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Avatar, AvatarFallback } from "./ui/avatar"

interface NavigationProps {
  className?: string
}

export function Navigation({ className = "" }: NavigationProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const navItems = [
    {
      name: "Dashboard",
      href: "/",
      icon: Activity,
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
      current: pathname.startsWith("/chat")
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
      name: "Reports",
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
    <nav className={`relative ${className}`}>
      {/* Ayurveda leaf accent, top left */}
      <svg
        className="absolute -top-4 -left-4 w-10 h-10 opacity-15 text-primary pointer-events-none select-none z-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 2C12 2 20 8 20 14C20 18 16 22 12 22C8 22 4 18 4 14C4 8 12 2 12 2Z" />
        <path d="M12 8V14" />
      </svg>
      <div className="flex flex-wrap gap-4 relative z-10 items-center justify-between">
        <div className="flex flex-wrap gap-4">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center space-x-3 px-7 py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${
                  item.current
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/20"
                    : "bg-white/80 text-foreground hover:bg-accent/10 hover:text-primary border border-accent/30 hover:border-accent/50 shadow hover:shadow-lg hover:shadow-primary/10"
                }`}
              >
                <div className={`p-2.5 rounded-xl transition-all duration-300 ${
                  item.current 
                    ? "bg-white/20 backdrop-blur-sm" 
                    : "bg-accent/10 group-hover:bg-accent/20"
                }`}>
                  <Icon className={`h-5 w-5 transition-colors ${
                    item.current ? "text-white" : "text-primary group-hover:text-primary/80"
                  }`} />
                </div>
                <span className={`text-sm font-semibold transition-colors ${
                  item.current ? "text-white" : "text-foreground group-hover:text-primary"
                }`}>
                  {item.name}
                </span>
                {item.current && (
                  <div className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse mr-1"></div>
                    <span className="text-xs text-white/80">Active</span>
                  </div>
                )}
              </Link>
            )
          })}
        </div>

        {/* User Profile Dropdown */}
        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full bg-white/80 hover:bg-white shadow-md"
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.fullName?.split(' ').map(n => n[0]).join('') || user.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.fullName || user.username}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.role} • {user.email || `@${user.username}`}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  )
}

export function QuickActionButton({ href, icon: Icon, title, description, colorClass }: {
  href: string
  icon: any
  title: string
  description: string
  colorClass: string
}) {
  return (
    <Link href={href} className="block">
      <div className={`group p-6 rounded-xl border transition-all duration-300 cursor-pointer transform hover:-translate-y-1.5 hover:shadow-xl ${colorClass}`}>
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white/70 backdrop-blur-md rounded-xl shadow group-hover:shadow-md transition-all duration-300">
            <Icon className="h-6 w-6 text-orange-600 group-hover:text-orange-700 transition-colors" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 group-hover:text-orange-800 transition-colors text-base">
              {title}
            </h3>
            <p className="text-sm text-gray-600 group-hover:text-gray-700 mt-1 leading-relaxed transition-colors">
              {description}
            </p>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-amber-100">
            <svg className="h-4 w-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}
