"use client"

import { useState } from "react"
import type { Report } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const DISEASES = ["Malaria", "Typhoid", "Dengue", "Influenza", "Common cold", "COVID-19"]

export function DoctorReviewCard({ report, onSubmit }: { report: Report; onSubmit: (payload: { action: "approve" | "reject"; corrected_label?: string; notes?: string }) => Promise<void> }) {
  const [action, setAction] = useState<"approve" | "reject" | null>(null)
  const [corrected, setCorrected] = useState<string | undefined>(undefined)
  const [notes, setNotes] = useState<string>("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!action) return
    setLoading(true)
    try {
      await onSubmit({ action, corrected_label: action === "reject" ? corrected : undefined, notes })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border rounded p-4 space-y-3">
      <div>
        <div className="text-sm text-muted-foreground">Case</div>
        <div className="text-base font-medium">{report.predicted.label} ({Math.round(report.predicted.probability * 100)}%)</div>
        <div className="text-xs">Session: {report.patient_session_id}</div>
      </div>

      <div>
        <div className="text-sm font-medium mb-1">Action</div>
        <div className="flex gap-2">
          <Button type="button" variant={action === "approve" ? "default" : "outline"} className={action === "approve" ? "" : "bg-transparent"} onClick={() => setAction("approve")}>Approve</Button>
          <Button type="button" variant={action === "reject" ? "default" : "outline"} className={action === "reject" ? "" : "bg-transparent"} onClick={() => setAction("reject")}>Reject</Button>
        </div>
      </div>

      {action === "reject" && (
        <div className="space-y-2">
          <div className="text-sm">Correct diagnosis</div>
          <Select onValueChange={(v) => setCorrected(v)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select disease" />
            </SelectTrigger>
            <SelectContent>
              {DISEASES.map((d) => (
                <SelectItem key={d} value={d}>
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="space-y-2">
        <div className="text-sm">Notes (optional)</div>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add brief feedback" />
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSubmit} disabled={loading || (action === "reject" && !corrected)} aria-live="polite">
          {loading ? "Saving..." : "Submit"}
        </Button>
      </div>
    </div>
  )
}

