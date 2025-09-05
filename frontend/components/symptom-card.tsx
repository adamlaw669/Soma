"use client"

import { useState, useEffect } from "react"
import { motion, type PanInfo } from "framer-motion"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Check, X, HelpCircle } from "lucide-react"
import type { Question } from "../lib/types"

interface SymptomCardProps {
  question: Question
  onAnswer: (answer: boolean | null) => void
  className?: string
}

export function SymptomCard({ question, onAnswer, className }: SymptomCardProps) {
  const [dragX, setDragX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "y") {
        onAnswer(true)
      } else if (event.key.toLowerCase() === "n") {
        onAnswer(false)
      } else if (event.key.toLowerCase() === "s") {
        onAnswer(null)
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [onAnswer])

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)
    const threshold = 80 // Reduced threshold for easier swiping

    if (info.offset.x > threshold) {
      onAnswer(true)
    } else if (info.offset.x < -threshold) {
      onAnswer(false)
    }

    setDragX(0)
  }

  const getSwipeIndicator = () => {
    if (!isDragging) return null

    if (dragX > 40) {
      // Reduced trigger threshold
      return (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-primary/20 rounded-lg backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="flex items-center space-x-2 text-primary"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <Check className="h-8 w-8" />
            <span className="text-lg font-semibold">Yes</span>
          </motion.div>
        </motion.div>
      )
    }

    if (dragX < -40) {
      // Reduced trigger threshold
      return (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-destructive/20 rounded-lg backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="flex items-center space-x-2 text-destructive"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <X className="h-8 w-8" />
            <span className="text-lg font-semibold">No</span>
          </motion.div>
        </motion.div>
      )
    }

    return null
  }

  return (
    <div className={className}>
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.3}
        dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
        onDrag={(event, info) => {
          setIsDragging(true)
          setDragX(info.offset.x)
        }}
        onDragEnd={handleDragEnd}
        whileDrag={{
          scale: 1.02,
          rotate: dragX * 0.1,
          boxShadow: "0 10px 30px oklch(0.55 0.15 162 / 0.2)",
        }}
        className="relative cursor-grab active:cursor-grabbing"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, x: dragX > 0 ? 300 : -300, scale: 0.8 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Card className="w-full max-w-md mx-auto border-border/50 bg-card/80 backdrop-blur-sm">
          {getSwipeIndicator()}
          <CardHeader className="text-center">
            <CardTitle className="text-lg text-card-foreground">{question.label}</CardTitle>
            {question.helpText && (
              <CardDescription className="text-sm text-muted-foreground">{question.helpText}</CardDescription>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button onClick={() => onAnswer(true)} className="h-12 text-base w-full glow-emerald" variant="default">
                  <Check className="mr-2 h-4 w-4" />
                  Yes
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  onClick={() => onAnswer(false)}
                  className="h-12 text-base w-full border-secondary text-secondary hover:bg-secondary/10"
                  variant="outline"
                >
                  <X className="mr-2 h-4 w-4" />
                  No
                </Button>
              </motion.div>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={() => onAnswer(null)}
                variant="ghost"
                className="w-full text-muted-foreground hover:text-foreground"
              >
                <HelpCircle className="mr-2 h-4 w-4" />I don't know / Skip
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="mt-6 text-center text-sm text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-center space-x-4">
          <Badge variant="outline" className="text-xs border-primary/30 text-primary">
            Y = Yes
          </Badge>
          <Badge variant="outline" className="text-xs border-secondary/30 text-secondary">
            N = No
          </Badge>
          <Badge variant="outline" className="text-xs border-muted-foreground/30">
            S = Skip
          </Badge>
        </div>
        <p className="mt-2">Use keyboard shortcuts or swipe left/right</p>
      </motion.div>
    </div>
  )
}
