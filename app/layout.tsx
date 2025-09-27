import type React from "react"
import type { Metadata } from "next"
import { Inter, Noto_Sans_Devanagari } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { TranslationProvider } from "@/components/translation-provider"
import { AuthProvider } from "@/components/auth-context"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-devanagari",
})

export const metadata: Metadata = {
  title: "AhaarWISE - Ayurvedic Diet Intelligence System",
  description: "Comprehensive patient management and diet planning system for Ayurvedic practitioners",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`font-sans ${inter.variable} ${notoSansDevanagari.variable} bg-background text-foreground min-h-screen relative`}
        style={{
          background:
            'linear-gradient(120deg, var(--secondary) 0%, var(--background) 100%)',
        }}
      >
        {/* Ayurveda leaf accent, bottom left */}
        <svg
          className="fixed bottom-0 left-0 w-32 h-32 opacity-10 text-primary pointer-events-none select-none z-0"
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
        <div className="relative z-10">
          <AuthProvider>
            <TranslationProvider>
              <Suspense fallback={null}>{children}</Suspense>
            </TranslationProvider>
          </AuthProvider>
          <Analytics />
        </div>
      </body>
    </html>
  )
}
