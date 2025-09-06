"use client"

import { useEffect, useState } from "react"
import { NavBar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { DoctorReviewCard } from "@/components/doctor-review-card"
import { getPendingReports, submitFeedback } from "@/lib/api"
import type { Report } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"

export default function DoctorPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const res = await getPendingReports()
        setReports(res)
      } catch (e: any) {
        setError(e?.message ?? "Failed to load pending reports")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  async function handleSubmit(report: Report, payload: { action: "approve" | "reject"; corrected_label?: string; notes?: string }) {
    try {
      // optimistic update
      setReports((prev) => prev.filter((r) => r.id !== report.id))
      await submitFeedback(report.id, { doctor_id: "demo-doctor", action: payload.action, corrected_label: payload.corrected_label, notes: payload.notes })
      toast({ title: "Feedback saved" })
    } catch (e: any) {
      toast({ title: "Failed to save feedback", description: e?.message ?? "" })
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-3xl space-y-4">
          <h1 className="text-2xl font-bold">Doctor Review</h1>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : reports.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending reports.</p>
          ) : (
            <div className="space-y-3">
              {reports.map((r) => (
                <DoctorReviewCard key={r.id} report={r} onSubmit={(p) => handleSubmit(r, p)} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

