"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Activity, Eye, EyeOff, Shield, Lock, User, Languages } from "lucide-react"
import { useRouter } from "next/navigation"

interface LoginCredentials {
  username: string
  password: string
  role: "admin" | "practitioner" | "assistant"
}

// Mock user database - in a real app, this would be in a backend
const users: LoginCredentials[] = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "doctor", password: "doctor123", role: "practitioner" },
  { username: "assistant", password: "assist123", role: "assistant" }
]

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [language, setLanguage] = useState<"en" | "hi">("en")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Check credentials
    const user = users.find(u => u.username === username && u.password === password)
    
    if (user) {
      // Store user session (in a real app, use secure tokens)
      if (typeof window !== "undefined") {
        localStorage.setItem("ayurvedic_user", JSON.stringify({
          username: user.username,
          role: user.role,
          loginTime: new Date().toISOString()
        }))
      }
      
      // Redirect to dashboard
      router.push("/")
    } else {
      setError(language === "en" ? "Invalid username or password" : "गलत उपयोगकर्ता नाम या पासवर्ड")
    }

    setIsLoading(false)
  }

  const content = {
    en: {
      title: "Welcome Back",
      subtitle: "Sign in to your Ayurvedic Diet Management account",
      username: "Username",
      password: "Password",
      signin: "Sign In",
      signingIn: "Signing In...",
      demoAccount: "Demo Accounts",
      admin: "Admin",
      practitioner: "Practitioner", 
      assistant: "Assistant",
      features: [
        "Comprehensive patient management",
        "AI-powered dietary recommendations",
        "Traditional Ayurvedic principles",
        "Real-time progress tracking",
        "Secure data management"
      ]
    },
    hi: {
      title: "स्वागत है",
      subtitle: "अपने आयुर्वेदिक आहार प्रबंधन खाते में साइन इन करें",
      username: "उपयोगकर्ता नाम",
      password: "पासवर्ड",
      signin: "साइन इन",
      signingIn: "साइन इन हो रहा है...",
      demoAccount: "डेमो खाते",
      admin: "प्रशासक",
      practitioner: "चिकित्सक",
      assistant: "सहायक",
      features: [
        "व्यापक रोगी प्रबंधन",
        "AI-संचालित आहार सिफारिशें",
        "पारंपरिक आयुर्वेदिक सिद्धांत",
        "रीयल-टाइम प्रगति ट्रैकिंग",
        "सुरक्षित डेटा प्रबंधन"
      ]
    }
  }

  const currentContent = content[language]

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:block">
          <div className="space-y-8">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Activity className="h-10 w-10 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">AyurDiet</h1>
                <p className="text-gray-600">Modern Ayurvedic Diet Management</p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className={`text-2xl font-semibold text-gray-900 ${language === "hi" ? "font-devanagari" : ""}`}>
                {language === "en" ? "Trusted by Healthcare Professionals" : "स्वास्थ्य सेवा पेशेवरों द्वारा भरोसेमंद"}
              </h2>
              
              <div className="space-y-4">
                {currentContent.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span className={`text-gray-700 ${language === "hi" ? "font-devanagari" : ""}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Demo Accounts Info */}
            <Card className="bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className={`text-lg flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                  <Shield className="h-5 w-5" />
                  <span>{currentContent.demoAccount}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <User className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                    <p className={`text-xs font-medium ${language === "hi" ? "font-devanagari" : ""}`}>
                      {currentContent.admin}
                    </p>
                    <p className="text-xs text-gray-500">admin/admin123</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <User className="h-5 w-5 mx-auto mb-1 text-green-600" />
                    <p className={`text-xs font-medium ${language === "hi" ? "font-devanagari" : ""}`}>
                      {currentContent.practitioner}
                    </p>
                    <p className="text-xs text-gray-500">doctor/doctor123</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <User className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                    <p className={`text-xs font-medium ${language === "hi" ? "font-devanagari" : ""}`}>
                      {currentContent.assistant}
                    </p>
                    <p className="text-xs text-gray-500">assistant/assist123</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Lock className="h-6 w-6 text-primary" />
                  <CardTitle className={`text-2xl ${language === "hi" ? "font-devanagari" : ""}`}>
                    {currentContent.title}
                  </CardTitle>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLanguage(language === "en" ? "hi" : "en")}
                  className="flex items-center space-x-1"
                >
                  <Languages className="h-4 w-4" />
                  <span>{language === "en" ? "हिंदी" : "EN"}</span>
                </Button>
              </div>
              <p className={`text-muted-foreground ${language === "hi" ? "font-devanagari" : ""}`}>
                {currentContent.subtitle}
              </p>
            </CardHeader>
            
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription className={language === "hi" ? "font-devanagari" : ""}>
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className={language === "hi" ? "font-devanagari" : ""}>
                    {currentContent.username}
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={currentContent.username}
                    required
                    className={language === "hi" ? "font-devanagari" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className={language === "hi" ? "font-devanagari" : ""}>
                    {currentContent.password}
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={currentContent.password}
                      required
                      className={language === "hi" ? "font-devanagari" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className={`w-full ${language === "hi" ? "font-devanagari" : ""}`}
                  disabled={isLoading}
                >
                  {isLoading ? currentContent.signingIn : currentContent.signin}
                </Button>
              </form>

              {/* Mobile Demo Accounts */}
              <div className="lg:hidden mt-6">
                <Card className="bg-gray-50">
                  <CardHeader>
                    <CardTitle className={`text-sm flex items-center space-x-2 ${language === "hi" ? "font-devanagari" : ""}`}>
                      <Shield className="h-4 w-4" />
                      <span>{currentContent.demoAccount}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="text-xs space-y-1">
                      <p><span className="font-medium">{currentContent.admin}:</span> admin/admin123</p>
                      <p><span className="font-medium">{currentContent.practitioner}:</span> doctor/doctor123</p>
                      <p><span className="font-medium">{currentContent.assistant}:</span> assistant/assist123</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
