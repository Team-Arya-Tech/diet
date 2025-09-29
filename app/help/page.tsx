"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { 
  HelpCircle, 
  Mail, 
  Phone, 
  MessageCircle, 
  Book, 
  Video, 
  FileText,
  Search,
  ExternalLink,
  Clock,
  CheckCircle
} from "lucide-react"
import { useTranslation } from "@/components/translation-provider"

export default function HelpPage() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = React.useState("")
  const [translatedStrings, setTranslatedStrings] = React.useState<{[key: string]: string}>({})
  const [message, setMessage] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [subject, setSubject] = React.useState("")

  // Load translations
  React.useEffect(() => {
    const loadTranslations = async () => {
      const strings = {
        searchPlaceholder: await t("Search for help topics, features, or issues..."),
        emailPlaceholder: await t("your.email@example.com"),
        subjectPlaceholder: await t("Brief description of your issue"),
        messagePlaceholder: await t("Describe your issue or question in detail...")
      }
      setTranslatedStrings(strings)
    }
    loadTranslations()
  }, [t])

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Mock support ticket submission
    alert(await t("Support request submitted! We'll get back to you within 24 hours."))
    setMessage("")
    setEmail("")
    setSubject("")
  }

  const faqItems = [
    {
      question: "How do I create a new diet plan?",
      answer: "Navigate to the Diet Plans section and click 'Create New Plan'. Follow the guided steps to set up personalized recommendations."
    },
    {
      question: "How can I change my language preferences?",
      answer: "Go to Profile → Preferences → Language and select your preferred language. The interface will update immediately."
    },
    {
      question: "What should I do if I forgot my password?",
      answer: "On the login page, click 'Forgot Password' and follow the instructions sent to your registered email address."
    },
    {
      question: "How do I view patient reports?",
      answer: "Access the Analytics section from the main menu to view comprehensive patient reports and dietary progress."
    }
  ]

  const supportChannels = [
    {
      icon: Mail,
      title: "Email Support",
      description: "Get help via email within 24 hours",
      contact: "support@ahaarwise.com",
      available: "24/7"
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Talk to our support team directly",
      contact: "+1-555-AHAARA (242272)",
      available: "Mon-Fri 9AM-6PM"
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
      description: "Chat with our support team in real-time",
      contact: "Available in dashboard",
      available: "Mon-Fri 9AM-6PM"
    }
  ]

  const resources = [
    {
      icon: Book,
      title: "User Guide",
      description: "Comprehensive guide to using AhaarWISE",
      link: "#"
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Step-by-step video walkthroughs",
      link: "#"
    },
    {
      icon: FileText,
      title: "API Documentation",
      description: "Technical documentation for developers",
      link: "#"
    }
  ]

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{t("Help & Support")}</h1>
        <p className="text-muted-foreground">{t("Get help with your AhaarWISE account and features")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search Help */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>{t("Search Help")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Input
                  placeholder={translatedStrings.searchPlaceholder || "Search for help topics, features, or issues..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <HelpCircle className="h-5 w-5" />
                <span>{t("Frequently Asked Questions")}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {faqItems.map((faq, index) => (
                <div key={index} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <h4 className="font-medium mb-2">{t(faq.question)}</h4>
                  <p className="text-sm text-muted-foreground">{t(faq.answer)}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card>
            <CardHeader>
              <CardTitle>{t("Contact Support")}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSupportSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("Email Address")}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={translatedStrings.emailPlaceholder || "your.email@example.com"}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">{t("Subject")}</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder={translatedStrings.subjectPlaceholder || "Brief description of your issue"}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{t("Message")}</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={translatedStrings.messagePlaceholder || "Describe your issue or question in detail..."}
                    rows={5}
                    required
                  />
                </div>
                <Button type="submit" className="w-full md:w-auto">
                  <Mail className="h-4 w-4 mr-2" />
                  {t("Submit Support Request")}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Support Channels */}
          <Card>
            <CardHeader>
              <CardTitle>{t("Support Channels")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {supportChannels.map((channel, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <channel.icon className="h-5 w-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <h5 className="font-medium">{t(channel.title)}</h5>
                    <p className="text-sm text-muted-foreground mb-1">{t(channel.description)}</p>
                    <p className="text-sm font-medium">{channel.contact}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Clock className="h-3 w-3 text-green-600" />
                      <span className="text-xs text-green-600">{t(channel.available)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Resources */}
          <Card>
            <CardHeader>
              <CardTitle>{t("Resources")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {resources.map((resource, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <resource.icon className="h-4 w-4 text-primary" />
                    <div>
                      <h6 className="font-medium text-sm">{t(resource.title)}</h6>
                      <p className="text-xs text-muted-foreground">{t(resource.description)}</p>
                    </div>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* System Status */}
          <Card>
            <CardHeader>
              <CardTitle>{t("System Status")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t("API Status")}</span>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">{t("Operational")}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t("Database")}</span>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">{t("Operational")}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t("AI Services")}</span>
                  <div className="flex items-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">{t("Operational")}</span>
                  </div>
                </div>
                <Separator />
                <p className="text-xs text-muted-foreground">
                  {t("Last updated")}: {new Date().toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}