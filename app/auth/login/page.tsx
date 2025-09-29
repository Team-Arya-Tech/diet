"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Activity, Eye, EyeOff, Shield, Lock, User, Languages, UserPlus, AlertTriangle, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-context"

interface SignUpData {
  username: string
  email: string
  password: string
  confirmPassword: string
  role: "practitioner" | "assistant"
  fullName: string
}

const registerUser = async (userData: SignUpData) => {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Registration failed')
  }
  
  return data
}

export default function AuthPage() {
  const { login: authLogin, user, loading } = useAuth()
  const router = useRouter()

  // Redirect to home if already authenticated
  useEffect(() => {
    if (!loading && user) {
      router.push('/')
    }
  }, [user, loading, router])
  
  // Login form state
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [language, setLanguage] = useState<"en" | "hi">("en")
  const [rememberMe, setRememberMe] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({})
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)
  const [blockTimeRemaining, setBlockTimeRemaining] = useState(0)
  
  // Sign up form state
  const [signUpData, setSignUpData] = useState<SignUpData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "practitioner",
    fullName: ""
  })
  const [showSignUpPassword, setShowSignUpPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [signUpLoading, setSignUpLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("signin")

  // Load saved credentials if remember me was checked
  useEffect(() => {
    const savedUsername = localStorage.getItem('remembered_username')
    const savedRememberMe = localStorage.getItem('remember_me') === 'true'
    
    if (savedUsername && savedRememberMe) {
      setUsername(savedUsername)
      setRememberMe(true)
    }
    
    // Check for login blocks
    const blockExpiry = localStorage.getItem('login_block_expiry')
    if (blockExpiry && Date.now() < parseInt(blockExpiry)) {
      setIsBlocked(true)
      setBlockTimeRemaining(Math.ceil((parseInt(blockExpiry) - Date.now()) / 1000))
    }
  }, [])

  // Block timer countdown
  useEffect(() => {
    if (isBlocked && blockTimeRemaining > 0) {
      const timer = setTimeout(() => {
        setBlockTimeRemaining(blockTimeRemaining - 1)
      }, 1000)
      
      if (blockTimeRemaining === 1) {
        setIsBlocked(false)
        setLoginAttempts(0)
        localStorage.removeItem('login_block_expiry')
        localStorage.removeItem('login_attempts')
      }
      
      return () => clearTimeout(timer)
    }
  }, [isBlocked, blockTimeRemaining])

  const validateLoginForm = () => {
    const errors: {[key: string]: string} = {}
    
    if (!username.trim()) {
      errors.username = language === "en" ? "Username is required" : "उपयोगकर्ता नाम आवश्यक है"
    } else if (username.length < 3) {
      errors.username = language === "en" ? "Username must be at least 3 characters" : "उपयोगकर्ता नाम कम से कम 3 अक्षर का होना चाहिए"
    }
    
    if (!password.trim()) {
      errors.password = language === "en" ? "Password is required" : "पासवर्ड आवश्यक है"
    } else if (password.length < 6) {
      errors.password = language === "en" ? "Password must be at least 6 characters" : "पासवर्ड कम से कम 6 अक्षर का होना चाहिए"
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isBlocked) {
      setError(language === "en" ? 
        `Too many failed attempts. Please wait ${Math.ceil(blockTimeRemaining / 60)} minutes.` : 
        `बहुत सारे असफल प्रयास। कृपया ${Math.ceil(blockTimeRemaining / 60)} मिनट प्रतीक्षा करें।`)
      return
    }
    
    if (!validateLoginForm()) {
      return
    }
    
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      await authLogin(username, password)
      
      // Handle remember me
      if (rememberMe) {
        localStorage.setItem('remembered_username', username)
        localStorage.setItem('remember_me', 'true')
      } else {
        localStorage.removeItem('remembered_username')
        localStorage.removeItem('remember_me')
      }
      
      // Reset failed attempts on successful login
      setLoginAttempts(0)
      localStorage.removeItem('login_attempts')
      localStorage.removeItem('login_block_expiry')
      
      setSuccess(language === "en" ? "Login successful! Redirecting..." : "लॉगिन सफल! पुनर्निर्देशित कर रहे हैं...")
      
      // Redirect to dashboard after a brief delay
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
      
    } catch (err) {
      // Increment failed attempts
      const newAttempts = loginAttempts + 1
      setLoginAttempts(newAttempts)
      localStorage.setItem('login_attempts', newAttempts.toString())
      
      // Block after 5 failed attempts
      if (newAttempts >= 5) {
        const blockExpiry = Date.now() + (15 * 60 * 1000) // 15 minutes
        localStorage.setItem('login_block_expiry', blockExpiry.toString())
        setIsBlocked(true)
        setBlockTimeRemaining(15 * 60)
        setError(language === "en" ? 
          "Too many failed attempts. Account blocked for 15 minutes." : 
          "बहुत सारे असफल प्रयास। खाता 15 मिनट के लिए ब्लॉक किया गया।")
      } else {
        const remainingAttempts = 5 - newAttempts
        if (err instanceof Error) {
          setError(language === "en" ? 
            `${err.message} (${remainingAttempts} attempts remaining)` : 
            `गलत उपयोगकर्ता नाम या पासवर्ड (${remainingAttempts} प्रयास शेष)`)
        } else {
          setError(language === "en" ? 
            `Login failed. ${remainingAttempts} attempts remaining.` : 
            `लॉगिन असफल। ${remainingAttempts} प्रयास शेष।`)
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignUpLoading(true)
    setError("")
    setSuccess("")

    // Validate passwords match
    if (signUpData.password !== signUpData.confirmPassword) {
      setError(language === "en" ? "Passwords do not match" : "पासवर्ड मेल नहीं खाते")
      setSignUpLoading(false)
      return
    }

    // Validate password strength
    if (signUpData.password.length < 6) {
      setError(language === "en" ? "Password must be at least 6 characters long" : "पासवर्ड कम से कम 6 अक्षर लंबा होना चाहिए")
      setSignUpLoading(false)
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(signUpData.email)) {
      setError(language === "en" ? "Please enter a valid email address" : "कृपया एक वैध ईमेल पता दर्ज करें")
      setSignUpLoading(false)
      return
    }

    try {
      const result = await registerUser(signUpData)
      setSuccess(language === "en" ? "Account created successfully! Please sign in." : "खाता सफलतापूर्वक बनाया गया! कृपया साइन इन करें।")
      
      // Store username to pre-fill login form
      const newUsername = signUpData.username
      
      // Reset form
      setSignUpData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "practitioner",
        fullName: ""
      })
      
      // Switch to sign-in tab after successful registration
      setTimeout(() => {
        setActiveTab("signin")
        setUsername(newUsername) // Pre-fill username for convenience
        setSuccess("") // Clear success message
      }, 2000)
      
    } catch (err) {
      if (err instanceof Error) {
        setError(language === "en" ? err.message : 
          err.message.includes("Username") ? "उपयोगकर्ता नाम पहले से मौजूद है" :
          err.message.includes("Email") ? "ईमेल पहले से मौजूद है" :
          "पंजीकरण में त्रुटि")
      } else {
        setError(language === "en" ? "Registration failed. Please try again." : "पंजीकरण असफल। कृपया पुनः प्रयास करें।")
      }
    } finally {
      setSignUpLoading(false)
    }
  }

  const content = {
    en: {
      title: "Welcome Back",
      subtitle: "Sign in to your Ayurvedic Diet Management account",
      createAccount: "Create Account",
      createSubtitle: "Join our Ayurvedic Diet Management platform",
      username: "Username",
      password: "Password",
      confirmPassword: "Confirm Password",
      fullName: "Full Name",
      email: "Email Address",
      role: "Role",
      signin: "Sign In",
      signup: "Sign Up",
      signingIn: "Signing In...",
      signingUp: "Creating Account...",
      demoAccount: "Demo Accounts",
      admin: "Admin",
      practitioner: "Practitioner", 
      assistant: "Assistant",
      selectRole: "Select your role",
      rememberMe: "Remember me",
      forgotPassword: "Forgot password?",
      secureLogin: "Secure Login",
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
      createAccount: "खाता बनाएं",
      createSubtitle: "हमारे आयुर्वेदिक आहार प्रबंधन प्लेटफॉर्म से जुड़ें",
      username: "उपयोगकर्ता नाम",
      password: "पासवर्ड",
      confirmPassword: "पासवर्ड की पुष्टि करें",
      fullName: "पूरा नाम",
      email: "ईमेल पता",
      role: "भूमिका",
      signin: "साइन इन",
      signup: "साइन अप",
      signingIn: "साइन इन हो रहा है...",
      signingUp: "खाता बनाया जा रहा है...",
      demoAccount: "डेमो खाते",
      admin: "प्रशासक",
      practitioner: "चिकित्सक",
      assistant: "सहायक",
      selectRole: "अपनी भूमिका चुनें",
      rememberMe: "मुझे याद रखें",
      forgotPassword: "पासवर्ड भूल गए?",
      secureLogin: "सुरक्षित लॉगिन",
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

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Don't render if already authenticated (will redirect)
  if (user) {
    return null
  }

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
                <h1 className="text-3xl font-bold text-gray-900">AhaarWISE</h1>
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

        {/* Right Side - Authentication Forms */}
        <div className="flex justify-center">
          <Card className="w-full max-w-md shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Lock className="h-6 w-6 text-primary" />
                  <CardTitle className="text-xl">
                    AhaarWISE Auth
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
            </CardHeader>
            
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertDescription className={language === "hi" ? "font-devanagari" : ""}>
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-4 border-green-200 bg-green-50">
                  <AlertDescription className={`text-green-700 ${language === "hi" ? "font-devanagari" : ""}`}>
                    {success}
                  </AlertDescription>
                </Alert>
              )}

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="signin" className={language === "hi" ? "font-devanagari" : ""}>
                    {currentContent.signin}
                  </TabsTrigger>
                  <TabsTrigger value="signup" className={language === "hi" ? "font-devanagari" : ""}>
                    {currentContent.signup}
                  </TabsTrigger>
                </TabsList>

                {/* Sign In Tab */}
                <TabsContent value="signin" className="space-y-4 mt-6">
                  <div className="text-center mb-4">
                    <h3 className={`text-lg font-semibold ${language === "hi" ? "font-devanagari" : ""}`}>
                      {currentContent.title}
                    </h3>
                    <p className={`text-sm text-muted-foreground ${language === "hi" ? "font-devanagari" : ""}`}>
                      {currentContent.subtitle}
                    </p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="username" className={language === "hi" ? "font-devanagari" : ""}>
                        <User className="w-4 h-4 inline mr-2" />
                        {currentContent.username}
                      </Label>
                      <Input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => {
                          setUsername(e.target.value)
                          if (validationErrors.username) {
                            setValidationErrors(prev => ({ ...prev, username: "" }))
                          }
                        }}
                        placeholder={currentContent.username}
                        required
                        className={`${language === "hi" ? "font-devanagari" : ""} ${
                          validationErrors.username ? "border-red-500 focus:ring-red-500" : ""
                        }`}
                        disabled={isBlocked}
                      />
                      {validationErrors.username && (
                        <div className="flex items-center space-x-1 text-red-600 text-sm">
                          <AlertTriangle className="h-4 w-4" />
                          <span>{validationErrors.username}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className={language === "hi" ? "font-devanagari" : ""}>
                        <Lock className="w-4 h-4 inline mr-2" />
                        {currentContent.password}
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value)
                            if (validationErrors.password) {
                              setValidationErrors(prev => ({ ...prev, password: "" }))
                            }
                          }}
                          placeholder={currentContent.password}
                          required
                          className={`${language === "hi" ? "font-devanagari" : ""} ${
                            validationErrors.password ? "border-red-500 focus:ring-red-500" : ""
                          }`}
                          disabled={isBlocked}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isBlocked}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      {validationErrors.password && (
                        <div className="flex items-center space-x-1 text-red-600 text-sm">
                          <AlertTriangle className="h-4 w-4" />
                          <span>{validationErrors.password}</span>
                        </div>
                      )}
                    </div>

                    {/* Remember Me & Security Info */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="rememberMe"
                          checked={rememberMe}
                          onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                          disabled={isBlocked}
                        />
                        <Label 
                          htmlFor="rememberMe" 
                          className={`text-sm ${language === "hi" ? "font-devanagari" : ""}`}
                        >
                          {language === "en" ? "Remember me" : "मुझे याद रखें"}
                        </Label>
                      </div>

                      {/* Security indicators */}
                      {loginAttempts > 0 && !isBlocked && (
                        <div className="flex items-center space-x-2 text-amber-600 text-sm">
                          <Shield className="h-4 w-4" />
                          <span className={language === "hi" ? "font-devanagari" : ""}>
                            {language === "en" ? 
                              `${5 - loginAttempts} attempts remaining` : 
                              `${5 - loginAttempts} प्रयास शेष`}
                          </span>
                        </div>
                      )}

                      {isBlocked && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm">
                          <Lock className="h-4 w-4" />
                          <span className={language === "hi" ? "font-devanagari" : ""}>
                            {language === "en" ? 
                              `Account blocked. ${Math.floor(blockTimeRemaining / 60)}:${(blockTimeRemaining % 60).toString().padStart(2, '0')} remaining` : 
                              `खाता ब्लॉक। ${Math.floor(blockTimeRemaining / 60)}:${(blockTimeRemaining % 60).toString().padStart(2, '0')} शेष`}
                          </span>
                        </div>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      className={`w-full ${language === "hi" ? "font-devanagari" : ""}`}
                      disabled={isLoading || isBlocked}
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          <span>{currentContent.signingIn}</span>
                        </div>
                      ) : isBlocked ? (
                        <div className="flex items-center space-x-2">
                          <Lock className="h-4 w-4" />
                          <span>{language === "en" ? "Account Blocked" : "खाता ब्लॉक"}</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <CheckCircle className="h-4 w-4" />
                          <span>{currentContent.signin}</span>
                        </div>
                      )}
                    </Button>
                  </form>
                </TabsContent>

                {/* Sign Up Tab */}
                <TabsContent value="signup" className="space-y-4 mt-6">
                  <div className="text-center mb-4">
                    <h3 className={`text-lg font-semibold ${language === "hi" ? "font-devanagari" : ""}`}>
                      {currentContent.createAccount}
                    </h3>
                    <p className={`text-sm text-muted-foreground ${language === "hi" ? "font-devanagari" : ""}`}>
                      {currentContent.createSubtitle}
                    </p>
                  </div>

                  <form onSubmit={handleSignUp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className={`text-sm font-medium ${language === "hi" ? "font-devanagari" : ""}`}>
                        <User className="w-4 h-4 inline mr-2" />
                        {currentContent.fullName}
                      </Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={signUpData.fullName}
                        onChange={(e) => setSignUpData({...signUpData, fullName: e.target.value})}
                        className="w-full"
                        placeholder={currentContent.fullName}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className={`text-sm font-medium ${language === "hi" ? "font-devanagari" : ""}`}>
                        {currentContent.email}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={signUpData.email}
                        onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                        className="w-full"
                        placeholder={currentContent.email}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signupUsername" className={`text-sm font-medium ${language === "hi" ? "font-devanagari" : ""}`}>
                        {currentContent.username}
                      </Label>
                      <Input
                        id="signupUsername"
                        type="text"
                        value={signUpData.username}
                        onChange={(e) => setSignUpData({...signUpData, username: e.target.value})}
                        className="w-full"
                        placeholder={currentContent.username}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role" className={`text-sm font-medium ${language === "hi" ? "font-devanagari" : ""}`}>
                        {currentContent.role}
                      </Label>
                      <Select 
                        value={signUpData.role} 
                        onValueChange={(value: "practitioner" | "assistant") => 
                          setSignUpData({...signUpData, role: value})
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={currentContent.selectRole} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="practitioner">{currentContent.practitioner}</SelectItem>
                          <SelectItem value="assistant">{currentContent.assistant}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signupPassword" className={`text-sm font-medium ${language === "hi" ? "font-devanagari" : ""}`}>
                        <Lock className="w-4 h-4 inline mr-2" />
                        {currentContent.password}
                      </Label>
                      <div className="relative">
                        <Input
                          id="signupPassword"
                          type={showSignUpPassword ? "text" : "password"}
                          value={signUpData.password}
                          onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                          className="w-full pr-10"
                          placeholder={currentContent.password}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                        >
                          {showSignUpPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className={`text-sm font-medium ${language === "hi" ? "font-devanagari" : ""}`}>
                        <Lock className="w-4 h-4 inline mr-2" />
                        {currentContent.confirmPassword}
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={signUpData.confirmPassword}
                          onChange={(e) => setSignUpData({...signUpData, confirmPassword: e.target.value})}
                          className="w-full pr-10"
                          placeholder={currentContent.confirmPassword}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
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
                      disabled={signUpLoading}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      {signUpLoading ? currentContent.signingUp : currentContent.signup}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>

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
