"use client"

import { useEffect, useState } from "react"
import { NavBar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ReportListItem } from "@/components/report-list-item"
import { getReports, getReportsFromLocalStorage } from "@/lib/api"
import { useSymptomStore } from "@/lib/store"
import type { Report } from "@/lib/types"

export default function ReportsPage() {
  const { session } = useSymptomStore()
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(null)
        if (session?.sessionId) {
          const res = await getReports(session.sessionId)
          setReports(res)
        } else {
          // fallback to local
          setReports(getReportsFromLocalStorage())
        }
      } catch (e: any) {
        // fallback to local on error
        setReports(getReportsFromLocalStorage())
        setError(e?.message ?? "Failed to load reports")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [session?.sessionId])

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-3xl space-y-4">
          <h1 className="text-2xl font-bold">Report History</h1>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : reports.length === 0 ? (
            <p className="text-sm text-muted-foreground">No reports yet.</p>
          ) : (
            <div className="space-y-2">
              {reports
                .slice()
                .reverse()
                .map((r) => (
                  <ReportListItem key={r.id} report={r} />
                ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

