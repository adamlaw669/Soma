"use client"

import { useParams } from "next/navigation"
import { useMemo, useRef } from "react"
import { NavBar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { useSymptomStore } from "@/lib/store"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { Button } from "@/components/ui/button"

export default function HistoryDetailPage() {
  const params = useParams<{ id: string }>()
  const history = useSymptomStore((s) => s.history)
  const entry = useMemo(() => history.find((h) => h.id === params?.id), [history, params?.id])
  const ref = useRef<HTMLDivElement>(null)

  async function downloadPdf() {
    if (!ref.current || !entry) return
    const canvas = await html2canvas(ref.current)
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF("p", "mm", "a4")
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0)
    pdf.save(`Soma_History_${entry.id}.pdf`)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-3xl space-y-4">
          {!entry ? (
            <p className="text-sm text-muted-foreground">Entry not found.</p>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Detailed Report</h1>
                <Button onClick={downloadPdf}>Download PDF</Button>
              </div>
              <div ref={ref} className="rounded-xl border bg-card p-4 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div>{new Date(entry.created_at).toLocaleString()}</div>
                  <div className="uppercase opacity-70">{entry.status}</div>
                </div>
                <div className="text-lg font-semibold">{entry.top_label}</div>
                <div>
                  <div className="text-sm font-medium mb-1">Top predictions</div>
                  <ul className="text-sm text-muted-foreground">
                    {entry.full_distribution.map((d, idx) => (
                      <li key={idx}>
                        {d.label}: {Math.round(d.probability * 100)}%
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Symptoms entered</div>
                  <div className="text-sm text-muted-foreground flex flex-wrap gap-2">
                    {Object.entries(entry.symptoms)
                      .filter(([, v]) => v)
                      .map(([k]) => (
                        <span key={k} className="rounded-full px-2 py-0.5 bg-muted">
                          {k}
                        </span>
                      ))}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground pt-2 border-t">This is a suspected diagnosis. Not a final medical diagnosis.</div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

