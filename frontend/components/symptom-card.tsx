"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import type { Question } from "@/lib/types"

interface SymptomCardProps {
  question: Question
  onAnswer: (answer: boolean | null) => void
  className?: string
}

export function SymptomCard({ question, onAnswer, className }: SymptomCardProps) {
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement) return
      const k = event.key.toLowerCase()
      if (k === "y") onAnswer(true)
      else if (k === "n") onAnswer(false)
      else if (k === "s") onAnswer(null)
    }
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [onAnswer])

  return (
    <div className={className}>
      <h2 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
        {question.label}
      </h2>
      {question.helpText && (
        <p className="mt-3 text-base text-muted-foreground">{question.helpText}</p>
      )}

      <div className="mt-10 grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          size="lg"
          onClick={() => onAnswer(false)}
          className="h-14 text-base"
        >
          No
        </Button>
        <Button
          size="lg"
          onClick={() => onAnswer(true)}
          className="h-14 text-base"
        >
          Yes
        </Button>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={() => onAnswer(null)}
          className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        >
          I don't know — skip
        </button>
        <span className="hidden text-xs text-muted-foreground sm:inline">
          <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px]">Y</kbd>{" "}
          <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px]">N</kbd>{" "}
          <kbd className="rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px]">S</kbd>
        </span>
      </div>
    </div>
  )
}
