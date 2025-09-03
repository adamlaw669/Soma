import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ErrorBoundary } from "@/components/error-boundary"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

export const metadata: Metadata = {
  title: "Soma - Fast, Simple, Smart Diagnosis",
  description:
    "AI-powered symptom checker for quick health insights. Not a substitute for professional medical advice.",
  generator: "v0.app",
  keywords: ["health", "symptoms", "AI", "diagnosis", "medical", "healthcare"],
  authors: [{ name: "Soma Health" }],
  creator: "Soma Health",
  publisher: "Soma Health",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://soma-health.vercel.app",
    title: "Soma - AI Symptom Checker",
    description: "Fast, simple, smart diagnosis with AI-powered health insights",
    siteName: "Soma",
  },
  twitter: {
    card: "summary_large_image",
    title: "Soma - AI Symptom Checker",
    description: "Fast, simple, smart diagnosis with AI-powered health insights",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ErrorBoundary>
          <Suspense fallback={null}>{children}</Suspense>
          <Toaster />
        </ErrorBoundary>
        <Analytics />
      </body>
    </html>
  )
}
