import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  Activity, 
  Users, 
  BookOpen, 
  Utensils, 
  FileText, 
  ChefHat 
} from "lucide-react"

interface NavigationProps {
  className?: string
}

export function Navigation({ className = "" }: NavigationProps) {
  const pathname = usePathname()

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
      name: "Diet Charts",
      href: "/diet-plans",
      icon: FileText,
      current: pathname.startsWith("/diet-plans")
    }
  ]

  return (
    <nav className={`${className}`}>
      <div className="flex flex-wrap gap-4">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center space-x-3 px-7 py-4 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${
                item.current
                  ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/30"
                  : "bg-white/80 text-gray-700 hover:bg-white hover:text-gray-900 border border-gray-200 hover:border-gray-300 shadow hover:shadow-lg hover:shadow-orange-500/10"
              }`}
            >
              <div className={`p-2.5 rounded-xl transition-all duration-300 ${
                item.current 
                  ? "bg-white/20 backdrop-blur-sm" 
                  : "bg-gray-100/80 group-hover:bg-amber-50"
              }`}>
                <Icon className={`h-5 w-5 transition-colors ${
                  item.current ? "text-white" : "text-orange-600 group-hover:text-orange-700"
                }`} />
              </div>
              <span className={`text-sm font-semibold transition-colors ${
                item.current ? "text-white" : "text-gray-700 group-hover:text-orange-800"
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
