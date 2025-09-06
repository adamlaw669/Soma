"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { NavBar } from "../../components/navbar"
import { Footer } from "../../components/footer"
import { PredictionPanel } from "../../components/prediction-panel"
import { ConfidenceChart } from "../../components/confidence-chart"
import { DiseaseInfoCard } from "../../components/disease-info-card"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Skeleton } from "../../components/ui/skeleton"
import { Alert, AlertDescription } from "../../components/ui/alert"
import { useSymptomStore } from "../../lib/store"
import { predictSymptoms, getDiseaseInfo, logEvent, generateReport, getRecentReportsFromLocal, saveReportToLocalStorage } from "../../lib/api"
import type { PredictResponse, Report}  from "../../lib/types"
import { RotateCcw, Share2, Calendar, AlertTriangle } from "lucide-react"
import { useToast } from "../../hooks/use-toast"
import { ReportModal } from "../../components/report-modal" 
import { ReportView } from "../../components/report-view"

export default function ResultPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { session, resetSession } = useSymptomStore()

  const [prediction, setPrediction] = useState<PredictResponse | null>(null)
  const [diseaseInfo, setDiseaseInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [report, setReport] = useState<Report | null>(null)
  const [showReportModal, setShowReportModal] = useState(false)

  useEffect(() => {
    if (!session) {
      router.push("/check")
      return
    }

    const fetchPrediction = async () => {
      try {
        setLoading(true)
        setError(null)

        const request = {
          symptoms: session.symptoms as Record<string, boolean>,
          vitals: session.vitals,
          demographics: session.demographics,
          meta: {
            session_id: session.sessionId,
            question_count: Object.keys(session.symptoms).length,
          },
        }

        const result = await predictSymptoms(request)
        setPrediction(result)

        logEvent("prediction_received", {
          session_id: session.sessionId,
          top_prediction: result.top_prediction.label,
          confidence: result.top_prediction.probability,
          triage: result.triage,
        })

        // Fetch disease information
        const labels = result.distribution.slice(0, 3).map((d) => d.label)
        const info = await getDiseaseInfo(labels)
        setDiseaseInfo(info)

        // Generate and persist report
        const recent = getRecentReportsFromLocal()
        const gen = await generateReport({
          predict_response: result,
          session: {
            sessionId: session.sessionId,
            symptoms: session.symptoms,
            vitals: session.vitals,
            demographics: session.demographics,
          },
          recent_reports: recent,
        })
        setReport(gen.report)
        saveReportToLocalStorage(gen.report)
        setShowReportModal(true)
        toast({ title: "Report generated", description: "Sent to a doctor for review." })
      } catch (err) {
        console.error("Prediction error:", err)
        setError(err instanceof Error ? err.message : "Failed to get prediction")
      } finally {
        setLoading(false)
      }
    }

    fetchPrediction()
  }, [session, router])

  const handleRestart = () => {
    resetSession()
    router.push("/check")
    logEvent("symptom_check_restarted", { from: "results" })
  }

  const handleShare = async () => {
    if (!prediction) return

    try {
      await navigator.share({
        title: "Soma Health Check Results",
        text: `My symptom check suggests ${prediction.top_prediction.label} with ${Math.round(
          prediction.top_prediction.probability * 100,
        )}% confidence.`,
        url: window.location.href,
      })
      logEvent("results_shared")
    } catch (err) {
      // Fallback to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied",
        description: "Results link copied to clipboard",
      })
    }
  }

  const handleBookTelehealth = () => {
    toast({
      title: "Feature coming soon",
      description: "Telehealth booking will be available in a future update",
    })
    logEvent("telehealth_booking_attempted")
  }

  const renderReportForModal = () => (report ? <ReportView report={report} /> : <></>)

  if (!session) {
    return null // Will redirect
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 p-4">
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="text-center">
              <Skeleton className="h-8 w-64 mx-auto mb-2" />
              <Skeleton className="h-4 w-48 mx-auto" />
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <Skeleton className="h-64" />
              <Skeleton className="h-64" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <CardTitle>Unable to Generate Results</CardTitle>
              <CardDescription>We encountered an error processing your symptoms</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
              <div className="flex gap-2">
                <Button onClick={() => window.location.reload()} className="flex-1">
                  Try Again
                </Button>
                <Button onClick={handleRestart} variant="outline" className="flex-1 bg-transparent">
                  Start Over
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  if (!prediction) {
    return null
  }

  const topDiseaseInfo = diseaseInfo?.[prediction.top_prediction.label]

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-4xl space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground">Your Health Insights</h1>
            <p className="text-muted-foreground mt-2">Based on your reported symptoms</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <PredictionPanel prediction={prediction} />
            <ConfidenceChart distribution={prediction.distribution} />
          </div>

          {prediction.explanations && prediction.explanations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Why This Prediction?</CardTitle>
                <CardDescription>AI reasoning behind the assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {prediction.explanations.map((explanation, index) => (
                    <li key={index} className="flex items-start space-x-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{explanation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {topDiseaseInfo && <DiseaseInfoCard diseaseInfo={topDiseaseInfo} />}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={handleRestart} variant="outline" className="bg-transparent">
              <RotateCcw className="mr-2 h-4 w-4" />
              Start New Check
            </Button>
            <Button onClick={handleShare} variant="outline" className="bg-transparent">
              <Share2 className="mr-2 h-4 w-4" />
              Share Results
            </Button>
            <Button onClick={handleBookTelehealth} className="bg-accent hover:bg-accent/90">
              <Calendar className="mr-2 h-4 w-4" />
              Book Telehealth
            </Button>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> This tool provides informational guidance only and is not a substitute for
              professional medical advice, diagnosis, or treatment. Always consult a healthcare professional for medical
              concerns.
            </AlertDescription>
          </Alert>
        </div>
      </main>
      <Footer />
      <ReportModal
        open={showReportModal}
        onOpenChange={setShowReportModal}
        report={report}
        renderReportView={renderReportForModal}
        onDownloaded={() => toast({ title: "PDF downloaded" })}
      />
    </div>
  )
}
