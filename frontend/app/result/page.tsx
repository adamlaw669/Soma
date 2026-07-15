"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { NavBar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { PredictionPanel } from "@/components/prediction-panel"
import { ConfidenceChart } from "@/components/confidence-chart"
import { DiseaseInfoCard } from "@/components/disease-info-card"
import { Button } from "@/components/ui/button"
import { LoadingSpinner } from "@/components/loading-spinner"
import { useSymptomStore } from "@/lib/store"
import {
  predictSymptoms,
  getDiseaseInfo,
  logEvent,
  generateReport,
  getRecentReportsFromLocal,
  saveReportToLocalStorage,
} from "@/lib/api"
import type { PredictResponse, Report } from "@/lib/types"
import { RotateCcw, Share2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { ReportModal } from "@/components/report-modal"
import { ReportView } from "@/components/report-view"

export default function ResultPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { session, resetSession, addDiagnosisToHistory } = useSymptomStore()

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

        const labels = result.distribution.slice(0, 3).map((d) => d.label)
        const info = await getDiseaseInfo(labels)
        setDiseaseInfo(info)

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
        toast({ title: "Report saved", description: "Sent to a doctor for review." })

        addDiagnosisToHistory(result)
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
        title: "Soma results",
        text: `My symptom check suggests ${prediction.top_prediction.label} (${Math.round(
          prediction.top_prediction.probability * 100,
        )}%).`,
        url: window.location.href,
      })
      logEvent("results_shared")
    } catch {
      await navigator.clipboard?.writeText(window.location.href)
      toast({ title: "Link copied", description: "Results link on your clipboard." })
    }
  }

  const renderReportForModal = () => (report ? <ReportView report={report} /> : <></>)

  if (!session) return null

  const topDiseaseInfo =
    prediction && diseaseInfo ? diseaseInfo[prediction.top_prediction.label] : null

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 pb-24 pt-16">
          {loading ? (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
              <LoadingSpinner size="lg" />
              <p className="text-sm text-muted-foreground">Running the classifier…</p>
            </div>
          ) : error ? (
            <div>
              <span className="label-eyebrow text-destructive">Error</span>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                We couldn't generate results.
              </h1>
              <p className="mt-3 text-base text-muted-foreground">{error}</p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button size="lg" onClick={() => window.location.reload()}>
                  Try again
                </Button>
                <Button variant="outline" size="lg" onClick={handleRestart}>
                  Start over
                </Button>
              </div>
            </div>
          ) : prediction ? (
            <>
              <PredictionPanel prediction={prediction} />

              <div className="mt-16 border-t border-border pt-14">
                <ConfidenceChart distribution={prediction.distribution} />
              </div>

              {prediction.explanations && prediction.explanations.length > 0 && (
                <div className="mt-16 border-t border-border pt-14">
                  <span className="label-eyebrow">Why this prediction</span>
                  <ul className="mt-6 space-y-3">
                    {prediction.explanations.map((explanation, i) => (
                      <li key={i} className="flex gap-3 text-sm leading-6">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
                        <span className="text-muted-foreground">{explanation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {topDiseaseInfo && (
                <div className="mt-16 border-t border-border pt-14">
                  <span className="label-eyebrow">About this condition</span>
                  <div className="mt-6">
                    <DiseaseInfoCard diseaseInfo={topDiseaseInfo} />
                  </div>
                </div>
              )}

              <div className="mt-16 flex flex-wrap gap-3 border-t border-border pt-10">
                <Button size="lg" onClick={handleRestart}>
                  <RotateCcw className="h-4 w-4" />
                  New check
                </Button>
                <Button size="lg" variant="outline" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                {report && (
                  <Button size="lg" variant="outline" asChild>
                    <Link href={`/report/${report.id}`}>View full report</Link>
                  </Button>
                )}
              </div>

              <p className="mt-10 max-w-xl text-xs leading-5 text-muted-foreground">
                Not medical advice. This tool provides informational guidance only —
                always consult a qualified healthcare provider for medical concerns.
              </p>
            </>
          ) : null}
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
