"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import { NavBar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ReportView } from "@/components/report-view"
import { Button } from "@/components/ui/button"
import { getReport, findReportInLocalStorage } from "@/lib/api"
import type { Report } from "@/lib/types"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export default function ReportDetailPage() {
  const params = useParams<{ id: string }>()
  const [report, setReport] = useState<Report | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
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
    
    // Try to download from backend PDF endpoint first
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
    if (baseUrl) {
      try {
        const response = await fetch(`${baseUrl}/report/${report.id}/pdf`)
        if (response.ok) {
          const blob = await response.blob()
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `Soma_Report_${new Date(report.generated_at).toISOString().slice(0,10)}_${report.id}.pdf`
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
          return
        }
      } catch (error) {
        console.warn('Backend PDF download failed, falling back to HTML canvas:', error)
      }
    }
    
    // Fallback to HTML canvas conversion
    if (!ref.current) return
    const canvas = await html2canvas(ref.current)
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF("p", "mm", "a4")
    const pageWidth = 190
    pdf.addImage(imgData, "PNG", 10, 10, pageWidth, 0)
    pdf.save(`Soma_Report_${new Date(report.generated_at).toISOString().slice(0,10)}_${report.id}.pdf`)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-3xl space-y-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : !report ? (
            <p className="text-sm text-muted-foreground">Report not found.</p>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Report</h1>
                <Button onClick={downloadPdf} aria-label="Download report">Download PDF</Button>
              </div>
              <div ref={ref} className="bg-background">
                <ReportView report={report} />
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

