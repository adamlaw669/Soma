"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { NavBar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { SymptomCard } from "@/components/symptom-card"
import { ProgressBar } from "@/components/progress"
import { VitalsInput } from "@/components/vitals-input"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { useSymptomStore } from "@/lib/store"
import { QUESTIONS, getNextQuestion } from "@/lib/questions"
import { logEvent } from "@/lib/api"
import { ArrowRight, RotateCcw } from "lucide-react"

export default function CheckPage() {
  const router = useRouter()
  const {
    session,
    initSession,
    updateSymptom,
    updateVitals,
    nextQuestion,
    resetSession,
  } = useSymptomStore()

  const [showVitalsInput, setShowVitalsInput] = useState(false)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    if (!session) {
      initSession()
      logEvent("symptom_check_started")
    }
    const timer = setTimeout(() => setIsInitializing(false), 300)
    return () => clearTimeout(timer)
  }, [session, initSession])

  useEffect(() => {
    if (session) {
      const answered = Object.values(session.symptoms).filter(
        (v) => v !== undefined,
      ).length
      setAnsweredCount(answered)
    }
  }, [session])

  const currentQuestion = session ? getNextQuestion(session.currentQuestionIndex) : null
  const canSeeResults = answeredCount >= 8 || (session?.isComplete ?? false)

  const handleAnswer = (answer: boolean | null) => {
    if (!currentQuestion || !session) return

    if (answer !== null) {
      updateSymptom(currentQuestion.id, answer)
      logEvent("question_answered", {
        question: currentQuestion.id,
        answer,
        session_id: session.sessionId,
      })
      if (currentQuestion.id === "fever" && answer === true) {
        setShowVitalsInput(true)
        return
      }
    }
    nextQuestion()
  }

  const handleVitalsComplete = () => {
    setShowVitalsInput(false)
    nextQuestion()
  }

  const handleTemperatureChange = (temperature: number | undefined) => {
    updateVitals({ temperature_c: temperature })
  }

  const handleSeeResults = () => {
    if (!session) return
    logEvent("flow_completed", {
      session_id: session.sessionId,
      questions_answered: answeredCount,
      total_questions: QUESTIONS.length,
    })
    router.push("/result")
  }

  const handleRestart = () => {
    resetSession()
    initSession()
    setShowVitalsInput(false)
    logEvent("symptom_check_restarted")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-6 pb-24 pt-16">
          {isInitializing || !session ? (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
              <LoadingSpinner size="lg" />
              <p className="text-sm text-muted-foreground">Preparing your check-in…</p>
            </div>
          ) : showVitalsInput ? (
            <>
              <ProgressBar current={answeredCount} total={QUESTIONS.length} />
              <div className="mt-14">
                <VitalsInput
                  onTemperatureChange={handleTemperatureChange}
                  onContinue={handleVitalsComplete}
                  initialTemperature={session.vitals.temperature_c}
                />
              </div>
            </>
          ) : !currentQuestion || session.currentQuestionIndex >= QUESTIONS.length ? (
            <div>
              <span className="label-eyebrow">All done</span>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Symptom check complete.
              </h2>
              <p className="mt-3 text-base text-muted-foreground">
                You answered {answeredCount} of {QUESTIONS.length} questions. Ready to see the analysis?
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button size="lg" onClick={handleSeeResults}>
                  See results
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" onClick={handleRestart}>
                  <RotateCcw className="h-4 w-4" />
                  Start over
                </Button>
              </div>
            </div>
          ) : (
            <>
              <ProgressBar current={answeredCount} total={QUESTIONS.length} />
              <div className="mt-14">
                <SymptomCard question={currentQuestion} onAnswer={handleAnswer} />
              </div>

              {canSeeResults && (
                <div className="mt-16 border-t border-border pt-8">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                      You've answered enough to get a prediction — continue for a
                      more confident one, or stop now.
                    </p>
                    <Button variant="outline" size="sm" onClick={handleSeeResults}>
                      See results now
                    </Button>
                  </div>
                </div>
              )}

              <div className="mt-16">
                <Link
                  href="/"
                  className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  ← Cancel and go home
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
