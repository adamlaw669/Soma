"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import { NavBar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ReportView } from "@/components/report-view"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Button } from "@/components/ui/button"
import { getReport, findReportInLocalStorage } from "@/lib/api"
import type { Report } from "@/lib/types"
import { Download } from "lucide-react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export default function ReportDetailPage() {
  const params = useParams<{ id: string }>()
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function load() {
      if (!params?.id) return
      try {
        setLoading(true)
        setError(null)
        const r = await getReport(params.id)
        setReport(r)
      } catch (e: any) {
        const local = findReportInLocalStorage(params.id)
        if (local) setReport(local)
        else setError(e?.message ?? "Failed to load report")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params?.id])

  async function downloadPdf() {
    if (!report) return
    setDownloading(true)
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
      const filename = `Soma_Report_${new Date(report.generated_at)
        .toISOString()
        .slice(0, 10)}_${report.id}.pdf`

      if (baseUrl) {
        try {
          const response = await fetch(`${baseUrl}/report/${report.id}/pdf`)
          if (response.ok) {
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = filename
            document.body.appendChild(a)
            a.click()
            window.URL.revokeObjectURL(url)
            document.body.removeChild(a)
            return
          }
        } catch (err) {
          console.warn("Backend PDF download failed, falling back to canvas:", err)
        }
      }

      if (!ref.current) return
      const canvas = await html2canvas(ref.current)
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      pdf.addImage(imgData, "PNG", 10, 10, 190, 0)
      pdf.save(filename)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">
        <div className="mx-auto max-w-3xl px-6 pb-24 pt-16">
          {loading ? (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
              <LoadingSpinner size="lg" />
              <p className="text-sm text-muted-foreground">Loading report…</p>
            </div>
          ) : error ? (
            <div>
              <span className="label-eyebrow text-destructive">Error</span>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                Report couldn't be loaded.
              </h1>
              <p className="mt-3 text-base text-muted-foreground">{error}</p>
            </div>
          ) : !report ? (
            <div>
              <span className="label-eyebrow">Not found</span>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                We couldn't find that report.
              </h1>
              <p className="mt-3 text-base text-muted-foreground">
                Reports are stored locally per session — if you cleared browser data or
                switched devices, this one won't be here.
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="label-eyebrow">Diagnosis report</span>
                  <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                    {report.predicted.label}
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Generated {new Date(report.generated_at).toLocaleString()} · ID {report.id}
                  </p>
                </div>
                <Button onClick={downloadPdf} disabled={downloading}>
                  <Download className="h-4 w-4" />
                  {downloading ? "Preparing…" : "Download PDF"}
                </Button>
              </div>

              <div className="mt-10 overflow-x-auto rounded-lg border border-border">
                <div ref={ref} className="bg-white">
                  <ReportView report={report} />
                </div>
              </div>

              <p className="mt-8 max-w-xl text-xs leading-5 text-muted-foreground">
                Not medical advice. This report is informational only — always consult
                a qualified healthcare provider for medical concerns.
              </p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
