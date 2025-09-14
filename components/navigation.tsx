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
              className={`group flex items-center space-x-3 px-6 py-4 rounded-2xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-lg ${
                item.current
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30"
                  : "bg-white/70 text-gray-700 hover:bg-white hover:text-gray-900 border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md"
              }`}
            >
              <div className={`p-2 rounded-xl transition-all duration-300 ${
                item.current 
                  ? "bg-white/20 backdrop-blur-sm" 
                  : "bg-gray-100 group-hover:bg-gray-200"
              }`}>
                <Icon className={`h-4 w-4 transition-colors ${
                  item.current ? "text-white" : "text-gray-600 group-hover:text-gray-800"
                }`} />
              </div>
              <span className={`text-sm font-semibold transition-colors ${
                item.current ? "text-white" : "text-gray-700 group-hover:text-gray-900"
              }`}>
                {item.name}
              </span>
              {item.current && (
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
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
      <div className={`group p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${colorClass}`}>
        <div className="flex items-start space-x-4">
          <div className="p-2 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm group-hover:shadow-md transition-all duration-300">
            <Icon className="h-5 w-5 text-gray-700 group-hover:text-gray-900 transition-colors" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-900 group-hover:text-gray-800 transition-colors text-sm">
              {title}
            </h3>
            <p className="text-xs text-gray-600 group-hover:text-gray-700 mt-1 leading-relaxed transition-colors">
              {description}
            </p>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}
