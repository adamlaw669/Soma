import type React from "react"
import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { ErrorBoundary } from "../components/error-boundary"
import { Toaster } from "../components/ui/toaster"
import { ThemeProvider } from "../components/theme-provider"
import "./globals.css"

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Soma — AI symptom checker",
  description:
    "AI symptom checker. Not a substitute for professional medical advice.",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    title: "Soma",
    description: "AI symptom checker.",
    siteName: "Soma",
  },
  twitter: {
    card: "summary_large_image",
    title: "Soma",
    description: "AI symptom checker.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jakarta.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <ErrorBoundary>
            <Suspense fallback={null}>{children}</Suspense>
            <Toaster />
          </ErrorBoundary>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
