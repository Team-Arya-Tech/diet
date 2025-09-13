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
    <nav className={`space-y-2 ${className}`}>
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
              item.current
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <div className={`p-1 ${item.current ? "bg-blue-100" : ""} rounded`}>
              <Icon className="h-4 w-4" />
            </div>
            <span className={item.current ? "font-medium" : ""}>{item.name}</span>
          </Link>
        )
      })}
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
    <Link href={href}>
      <div className={`p-4 rounded-lg border-2 transition-colors cursor-pointer ${colorClass}`}>
        <div className="flex items-start space-x-3">
          <Icon className="h-5 w-5 mt-0.5 text-gray-600" />
          <div>
            <h3 className="font-medium text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}
