"use client"

import { useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, History } from "lucide-react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import type { Report } from "@/lib/types"

export function ReportModal({ open, onOpenChange, report, renderReportView }: {
  open: boolean
  onOpenChange: (open: boolean) => void
  report: Report | null
  renderReportView: () => JSX.Element
}) {
  const ref = useRef<HTMLDivElement>(null)

  async function handleDownload() {
    if (!ref.current || !report) return
    const canvas = await html2canvas(ref.current)
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF("p", "mm", "a4")
    const pageWidth = 190
    pdf.addImage(imgData, "PNG", 10, 10, pageWidth, 0)
    pdf.save(`Soma_Report_${new Date(report.generated_at).toISOString().slice(0,10)}_${report.id}.pdf`)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby="report-modal-desc">
        <DialogHeader>
          <DialogTitle>Diagnosis report sent for doctor review</DialogTitle>
          <DialogDescription id="report-modal-desc">
            A clinician will review shortly. You can download and keep a copy now.
          </DialogDescription>
        </DialogHeader>
        <div className="sr-only">
          <div ref={ref}>{renderReportView()}</div>
        </div>
        <DialogFooter className="flex items-center justify-between gap-2">
          <Button asChild variant="outline" className="bg-transparent" aria-label="View history">
            <a href="/reports">
              <History className="mr-2 h-4 w-4" /> View History
            </a>
          </Button>
          <Button onClick={handleDownload} aria-label="Download report PDF">
            <Download className="mr-2 h-4 w-4" /> Download Report (PDF)
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

