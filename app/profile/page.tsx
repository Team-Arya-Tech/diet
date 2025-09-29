"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Bell, 
  Globe, 
  Eye, 
  EyeOff, 
  Camera, 
  Save, 
  Settings,
  Lock,
  UserCheck,
  Activity,
  Languages,
  Moon,
  Sun
} from "lucide-react"
import { useAuth } from "@/components/auth-context"
import { useTranslation } from "@/components/translation-provider"

interface ProfileData {
  fullName: string
  email: string
  phone: string
  address: string
  bio: string
  department: string
  experience: string
  specialization: string
  profilePicture?: string
}

interface PreferencesData {
  language: "en" | "hi"
  theme: "light" | "dark" | "system"
  notifications: {
    email: boolean
    push: boolean
    marketing: boolean
    reports: boolean
  }
  privacy: {
    profileVisibility: "public" | "private" | "team"
    showActivity: boolean
    showEmail: boolean
  }
}

interface SecurityData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
  twoFactorEnabled: boolean
  sessionTimeout: number
}

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth()
  const { t, language, setLanguage } = useTranslation()
  
  // Get tab from URL params
  const [activeTab, setActiveTab] = useState("profile")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null)
  const [placeholders, setPlaceholders] = useState<{[key: string]: string}>({})
  
  // Profile state
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: user?.fullName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    bio: user?.bio || "",
    department: user?.department || "",
    experience: user?.experience || "",
    specialization: user?.specialization || "",
    profilePicture: user?.profilePicture || ""
  })

  // Preferences state
  const [preferences, setPreferences] = useState<PreferencesData>({
    language: language || "en",
    theme: "system",
    notifications: {
      email: true,
      push: true,
      marketing: false,
      reports: true
    },
    privacy: {
      profileVisibility: "team",
      showActivity: true,
      showEmail: false
    }
  })

  // Security state
  const [security, setSecurity] = useState<SecurityData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
    sessionTimeout: 30
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tab = params.get('tab')
    if (tab && ['profile', 'preferences', 'security'].includes(tab)) {
      setActiveTab(tab)
    }
  }, [])

  // Load translated placeholders
  useEffect(() => {
    const loadPlaceholders = async () => {
      const placeholderTexts = {
        fullName: await t("Enter your full name"),
        email: await t("Enter your email"),
        phone: await t("Enter your phone number"),
        department: await t("Enter your department"),
        experience: await t("Years of experience"),
        specialization: await t("Your specialization area"),
        address: await t("Enter your address"),
        bio: await t("Tell us about yourself..."),
        currentPassword: await t("Enter current password"),
        newPassword: await t("Enter new password"),
        confirmPassword: await t("Confirm new password")
      }
      setPlaceholders(placeholderTexts)
    }
    loadPlaceholders()
  }, [t])

  // Update profile data when user changes
  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        bio: user.bio || "",
        department: user.department || "",
        experience: user.experience || "",
        specialization: user.specialization || "",
        profilePicture: user.profilePicture || ""
      }))
    }
  }, [user])

  const handleProfileSave = async () => {
    setIsLoading(true)
    setMessage(null)
    
    try {
      // Mock API call - replace with actual implementation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (updateUserProfile) {
        await updateUserProfile(profileData)
      }
      
      setMessage({
        type: "success",
        text: await t("Profile updated successfully!")
      })
    } catch (error) {
      setMessage({
        type: "error", 
        text: await t("Failed to update profile. Please try again.")
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePreferencesSave = async () => {
    setIsLoading(true)
    setMessage(null)
    
    try {
      // Update language if changed
      if (preferences.language !== language) {
        setLanguage(preferences.language)
      }
      
      // Mock API call for other preferences
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setMessage({
        type: "success",
        text: await t("Preferences updated successfully!")
      })
    } catch (error) {
      setMessage({
        type: "error",
        text: await t("Failed to update preferences. Please try again.")
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    setIsLoading(true)
    setMessage(null)
    
    // Validation
    if (security.newPassword !== security.confirmPassword) {
      setMessage({
        type: "error",
        text: await t("New passwords do not match")
      })
      setIsLoading(false)
      return
    }
    
    if (security.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: await t("Password must be at least 6 characters long")
      })
      setIsLoading(false)
      return
    }
    
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: security.currentPassword,
          newPassword: security.newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password')
      }
      
      setSecurity(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      }))
      
      setMessage({
        type: "success",
        text: await t("Password changed successfully!")
      })
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : await t("Failed to change password. Please try again.")
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role?.toLowerCase()) {
      case "admin": return "bg-red-100 text-red-800"
      case "practitioner": return "bg-green-100 text-green-800"
      case "assistant": return "bg-blue-100 text-blue-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">{t("Authentication Required")}</h2>
              <p className="text-muted-foreground">{t("Please sign in to access your profile.")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{t("Profile Settings")}</h1>
        <p className="text-muted-foreground">{t("Manage your account settings and preferences")}</p>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"} className="mb-6">
          <AlertDescription>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>{t("Profile")}</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>{t("Preferences")}</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Lock className="h-4 w-4" />
            <span>{t("Security")}</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>{t("Personal Information")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture & Basic Info */}
              <div className="flex items-start space-x-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    {profileData.profilePicture ? (
                      <img
                        src={profileData.profilePicture}
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-background shadow-lg"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-background shadow-lg">
                        <span className="text-2xl font-semibold text-primary">
                          {getInitials(profileData.fullName || user.username || "U")}
                        </span>
                      </div>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 rounded-full p-2"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-semibold">{user.fullName || user.username}</h3>
                    <Badge className={getRoleBadgeColor(user.role)}>
                      {t(user.role || "user")}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{t("Member since")} {new Date().getFullYear()}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-green-600">
                    <Activity className="h-4 w-4" />
                    <span>{t("Active")}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Editable Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t("Full Name")}</Label>
                  <Input
                    id="fullName"
                    value={profileData.fullName}
                    onChange={(e) => setProfileData(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder={placeholders.fullName || "Enter your full name"}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">{t("Email Address")}</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder={placeholders.email || "Enter your email"}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">{t("Phone Number")}</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder={placeholders.phone || "Enter your phone number"}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="department">{t("Department")}</Label>
                  <Input
                    id="department"
                    value={profileData.department}
                    onChange={(e) => setProfileData(prev => ({ ...prev, department: e.target.value }))}
                    placeholder={placeholders.department || "Enter your department"}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="experience">{t("Experience")}</Label>
                  <Input
                    id="experience"
                    value={profileData.experience}
                    onChange={(e) => setProfileData(prev => ({ ...prev, experience: e.target.value }))}
                    placeholder={placeholders.experience || "Years of experience"}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="specialization">{t("Specialization")}</Label>
                  <Input
                    id="specialization"
                    value={profileData.specialization}
                    onChange={(e) => setProfileData(prev => ({ ...prev, specialization: e.target.value }))}
                    placeholder={placeholders.specialization || "Your specialization area"}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">{t("Address")}</Label>
                <Input
                  id="address"
                  value={profileData.address}
                  onChange={(e) => setProfileData(prev => ({ ...prev, address: e.target.value }))}
                  placeholder={placeholders.address || "Enter your address"}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">{t("Biography")}</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder={placeholders.bio || "Tell us about yourself..."}
                  rows={4}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleProfileSave} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? t("Saving...") : t("Save Changes")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>{t("Application Preferences")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Language & Theme */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Languages className="h-4 w-4" />
                    <span>{t("Language")}</span>
                  </Label>
                  <Select
                    value={preferences.language}
                    onValueChange={(value: "en" | "hi") => 
                      setPreferences(prev => ({ ...prev, language: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिंदी</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label className="flex items-center space-x-2">
                    <Sun className="h-4 w-4" />
                    <span>{t("Theme")}</span>
                  </Label>
                  <Select
                    value={preferences.theme}
                    onValueChange={(value: "light" | "dark" | "system") => 
                      setPreferences(prev => ({ ...prev, theme: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">{t("Light")}</SelectItem>
                      <SelectItem value="dark">{t("Dark")}</SelectItem>
                      <SelectItem value="system">{t("System")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Notifications */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center space-x-2">
                  <Bell className="h-4 w-4" />
                  <span>{t("Notification Preferences")}</span>
                </h4>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>{t("Email Notifications")}</Label>
                      <p className="text-sm text-muted-foreground">{t("Receive important updates via email")}</p>
                    </div>
                    <Switch
                      checked={preferences.notifications.email}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, email: checked }
                        }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>{t("Push Notifications")}</Label>
                      <p className="text-sm text-muted-foreground">{t("Receive real-time notifications")}</p>
                    </div>
                    <Switch
                      checked={preferences.notifications.push}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, push: checked }
                        }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>{t("Report Notifications")}</Label>
                      <p className="text-sm text-muted-foreground">{t("Get notified about report generation")}</p>
                    </div>
                    <Switch
                      checked={preferences.notifications.reports}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, reports: checked }
                        }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>{t("Marketing Communications")}</Label>
                      <p className="text-sm text-muted-foreground">{t("Receive updates about new features")}</p>
                    </div>
                    <Switch
                      checked={preferences.notifications.marketing}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, marketing: checked }
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Privacy */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>{t("Privacy Settings")}</span>
                </h4>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t("Profile Visibility")}</Label>
                    <Select
                      value={preferences.privacy.profileVisibility}
                      onValueChange={(value: "public" | "private" | "team") =>
                        setPreferences(prev => ({
                          ...prev,
                          privacy: { ...prev.privacy, profileVisibility: value }
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">{t("Public")}</SelectItem>
                        <SelectItem value="team">{t("Team Only")}</SelectItem>
                        <SelectItem value="private">{t("Private")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>{t("Show Activity Status")}</Label>
                      <p className="text-sm text-muted-foreground">{t("Let others see when you're active")}</p>
                    </div>
                    <Switch
                      checked={preferences.privacy.showActivity}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({
                          ...prev,
                          privacy: { ...prev.privacy, showActivity: checked }
                        }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>{t("Show Email Address")}</Label>
                      <p className="text-sm text-muted-foreground">{t("Display email on your profile")}</p>
                    </div>
                    <Switch
                      checked={preferences.privacy.showEmail}
                      onCheckedChange={(checked) =>
                        setPreferences(prev => ({
                          ...prev,
                          privacy: { ...prev.privacy, showEmail: checked }
                        }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handlePreferencesSave} disabled={isLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? t("Saving...") : t("Save Preferences")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>{t("Security Settings")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Change Password */}
              <div className="space-y-4">
                <h4 className="font-medium">{t("Change Password")}</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">{t("Current Password")}</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showPasswords.current ? "text" : "password"}
                        value={security.currentPassword}
                        onChange={(e) => setSecurity(prev => ({ ...prev, currentPassword: e.target.value }))}
                        placeholder={placeholders.currentPassword || "Enter current password"}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                      >
                        {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">{t("New Password")}</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPasswords.new ? "text" : "password"}
                        value={security.newPassword}
                        onChange={(e) => setSecurity(prev => ({ ...prev, newPassword: e.target.value }))}
                        placeholder={placeholders.newPassword || "Enter new password"}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                      >
                        {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t("Confirm Password")}</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showPasswords.confirm ? "text" : "password"}
                        value={security.confirmPassword}
                        onChange={(e) => setSecurity(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        placeholder={placeholders.confirmPassword || "Confirm new password"}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3"
                        onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                      >
                        {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Button onClick={handlePasswordChange} disabled={isLoading}>
                  <Lock className="h-4 w-4 mr-2" />
                  {isLoading ? t("Changing...") : t("Change Password")}
                </Button>
              </div>

              <Separator />

              {/* Two-Factor Authentication */}
              <div className="space-y-4">
                <h4 className="font-medium flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>{t("Two-Factor Authentication")}</span>
                </h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label>{t("Enable 2FA")}</Label>
                    <p className="text-sm text-muted-foreground">{t("Add an extra layer of security to your account")}</p>
                  </div>
                  <Switch
                    checked={security.twoFactorEnabled}
                    onCheckedChange={(checked) =>
                      setSecurity(prev => ({ ...prev, twoFactorEnabled: checked }))
                    }
                  />
                </div>
              </div>

              <Separator />

              {/* Session Management */}
              <div className="space-y-4">
                <h4 className="font-medium">{t("Session Management")}</h4>
                
                <div className="space-y-2">
                  <Label>{t("Auto-logout after inactivity (minutes)")}</Label>
                  <Select
                    value={security.sessionTimeout.toString()}
                    onValueChange={(value) =>
                      setSecurity(prev => ({ ...prev, sessionTimeout: parseInt(value) }))
                    }
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 {t("minutes")}</SelectItem>
                      <SelectItem value="30">30 {t("minutes")}</SelectItem>
                      <SelectItem value="60">1 {t("hour")}</SelectItem>
                      <SelectItem value="120">2 {t("hours")}</SelectItem>
                      <SelectItem value="480">8 {t("hours")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Active Sessions */}
              <div className="space-y-4">
                <h4 className="font-medium">{t("Active Sessions")}</h4>
                
                <div className="space-y-3">
                  <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-green-900">{t("Current Session")}</p>
                          <p className="text-sm text-green-700">
                            {t("Started")}: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                          </p>
                          <p className="text-xs text-green-600">
                            {navigator.userAgent.includes('Chrome') ? 'Chrome Browser' : 
                             navigator.userAgent.includes('Firefox') ? 'Firefox Browser' : 
                             navigator.userAgent.includes('Safari') ? 'Safari Browser' : 'Web Browser'}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        {t("Active")}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      {t("Manage all active sessions and sign out from other devices")}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        // Implement session management
                        alert(t("Session management feature - coming soon!"))
                      }}
                    >
                      {t("Manage Sessions")}
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Account Status */}
              <div className="space-y-4">
                <h4 className="font-medium text-red-600">{t("Account Management")}</h4>
                
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <h5 className="font-medium text-red-900">{t("Deactivate Account")}</h5>
                      <p className="text-sm text-red-700 mt-1">
                        {t("Temporarily disable your account. You can reactivate it anytime by signing in.")}
                      </p>
                      <Button 
                        variant="outline" 
                        className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
                        onClick={async () => {
                          const confirmMessage = await t("Are you sure you want to deactivate your account? This action can be reversed by signing in again.")
                          if (confirm(confirmMessage)) {
                            // Implement account deactivation
                            try {
                              const response = await fetch('/api/auth/profile', {
                                method: 'DELETE'
                              })
                              if (response.ok) {
                                const successMessage = await t("Account deactivated successfully. You will be redirected to the login page.")
                                alert(successMessage)
                                window.location.href = '/auth/login'
                              }
                            } catch (error) {
                              const errorMessage = await t("Failed to deactivate account. Please try again.")
                              alert(errorMessage)
                            }
                          }
                        }}
                      >
                        {t("Deactivate Account")}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}