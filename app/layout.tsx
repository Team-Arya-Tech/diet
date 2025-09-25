import type React from "react"
import type { Metadata } from "next"
import { Inter, Noto_Sans_Devanagari } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { TranslationProvider } from "@/components/translation-provider"
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
      <body className={`font-sans ${inter.variable} ${notoSansDevanagari.variable}`}>
        <TranslationProvider>
          <Suspense fallback={null}>{children}</Suspense>
        </TranslationProvider>
        <Analytics />
      </body>
    </html>
  )
}
