"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { NavBar } from "../../components/navbar"
import { Footer } from "../../components/footer"
import { SymptomCard } from "../../components/symptom-card"
import { ProgressBar } from "../../components/progress"
import { VitalsInput } from "../../components/vitals-input"
import { LoadingSpinner } from "../../components/loading-spinner"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { useSymptomStore } from "../../lib/store"
import { QUESTIONS, getNextQuestion } from "../../lib/questions"
import { logEvent } from "../../lib/api"
import { ArrowRight, RotateCcw } from "lucide-react"

export default function CheckPage() {
  const router = useRouter()
  const { session, initSession, updateSymptom, updateVitals, nextQuestion, resetSession } = useSymptomStore()

  const [showVitalsInput, setShowVitalsInput] = useState(false)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [isInitializing, setIsInitializing] = useState(true)

  useEffect(() => {
    if (!session) {
      initSession()
      logEvent("symptom_check_started")
    }
    const timer = setTimeout(() => setIsInitializing(false), 500)
    return () => clearTimeout(timer)
  }, [session, initSession])

  useEffect(() => {
    if (session) {
      const answered = Object.values(session.symptoms).filter((v) => v !== undefined).length
      setAnsweredCount(answered)
    }
  }, [session])

  if (isInitializing || !session) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <LoadingSpinner size="lg" />
            <p className="text-muted-foreground">Initializing symptom check...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const currentQuestion = getNextQuestion(session.currentQuestionIndex)
  const canSeeResults = answeredCount >= 8 || session.isComplete

  const handleAnswer = (answer: boolean | null) => {
    if (!currentQuestion) return

    if (answer !== null) {
      updateSymptom(currentQuestion.id, answer)
      logEvent("question_answered", {
        question: currentQuestion.id,
        answer,
        session_id: session.sessionId,
      })

      // Show vitals input if fever is confirmed
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

  if (showVitalsInput) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <ProgressBar current={answeredCount} total={QUESTIONS.length} className="mb-8" />
            <VitalsInput
              onTemperatureChange={handleTemperatureChange}
              onContinue={handleVitalsComplete}
              initialTemperature={session.vitals.temperature_c}
            />
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!currentQuestion || session.currentQuestionIndex >= QUESTIONS.length) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Symptom Check Complete</CardTitle>
              <CardDescription>You've answered {answeredCount} questions. Ready to see your results?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleSeeResults} className="w-full" size="lg">
                <ArrowRight className="mr-2 h-4 w-4" />
                See Results
              </Button>
              <Button onClick={handleRestart} variant="outline" className="w-full bg-transparent">
                <RotateCcw className="mr-2 h-4 w-4" />
                Start Over
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <ProgressBar current={answeredCount} total={QUESTIONS.length} className="mb-8" />

          <SymptomCard question={currentQuestion} onAnswer={handleAnswer} className="mb-8" />

          {canSeeResults && (
            <div className="text-center">
              <Button onClick={handleSeeResults} size="lg" className="bg-accent hover:bg-accent/90">
                <ArrowRight className="mr-2 h-4 w-4" />
                See Results ({answeredCount} questions answered)
              </Button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
