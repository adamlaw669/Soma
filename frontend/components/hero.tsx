"use client"

import Link from "next/link"
import { Button } from "../components/ui/button"
import { ArrowRight, Shield, Zap, Brain } from "lucide-react"
import { motion } from "framer-motion"

export function Hero() {
  return (
    <div className="relative overflow-hidden bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative pb-16 pt-16 sm:pb-24 sm:pt-24">
          <main className="mx-auto max-w-4xl">
            <div className="text-center">
              <motion.h1
                className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <motion.span
                  className="block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                >
                  Soma – From Symptoms
                </motion.span>
                <motion.span
                  className="block text-primary glow-emerald"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  to Clarity
                </motion.span>
              </motion.h1>

              <motion.p
                className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                Get instant health insights with our AI-powered symptom checker. Answer a few questions and receive
                personalized guidance in minutes.
              </motion.p>

              <motion.div
                className="mt-10 flex items-center justify-center gap-x-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button asChild size="lg" className="text-base glow-emerald">
                    <Link href="/check">
                      Start Check
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                    className="text-base bg-transparent border-secondary text-secondary hover:bg-secondary/10"
                  >
                    <Link href="/about">Learn More</Link>
                  </Button>
                </motion.div>
              </motion.div>
            </div>

            <motion.div
              className="mt-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
                {[
                  {
                    icon: Zap,
                    title: "Instant Results",
                    description: "Get AI-powered health insights in under 2 minutes",
                    delay: 0.7,
                  },
                  {
                    icon: Brain,
                    title: "Personalized Insights",
                    description: "Tailored recommendations based on your specific symptoms",
                    delay: 0.8,
                  },
                  {
                    icon: Shield,
                    title: "Confidential & Secure",
                    description: "Your health data is private and protected",
                    delay: 0.9,
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    className="text-center"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: feature.delay }}
                    whileHover={{ y: -5 }}
                  >
                    <motion.div
                      className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20"
                      whileHover={{ scale: 1.1, boxShadow: "0 0 20px oklch(0.55 0.15 162 / 0.3)" }}
                    >
                      <feature.icon className="h-6 w-6 text-primary" />
                    </motion.div>
                    <h3 className="mt-4 text-lg font-semibold text-foreground">{feature.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  )
}
