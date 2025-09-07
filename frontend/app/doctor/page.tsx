"use client"

import { useEffect, useState } from "react"
import { NavBar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { DoctorReviewCard } from "@/components/doctor-review-card"
import { getDiagnoses } from "@/lib/api"
import type { DoctorDiagnosis } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DoctorDiagnosisCard } from "@/components/doctor-diagnosis-card"

export default function DoctorPage() {
  const [list, setList] = useState<DoctorDiagnosis[]>([])
  const [filtered, setFiltered] = useState<DoctorDiagnosis[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  const [accessOk, setAccessOk] = useState(false)
  const [code, setCode] = useState("")
  const [q, setQ] = useState("")
  const [priority, setPriority] = useState("all")

  useEffect(() => {
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const res = await getDiagnoses()
        setList(res)
      } catch (e: any) {
        setError(e?.message ?? "Failed to load diagnoses")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    let data = list.slice()
    if (priority !== "all") data = data.filter((r) => r.distribution[0] && r.distribution[0].label && r.triage === (priority as any))
    if (q.trim()) {
      const s = q.toLowerCase()
      data = data.filter((r) => r.id.toLowerCase().includes(s) || r.predicted.label.toLowerCase().includes(s))
    }
    setFiltered(data)
  }, [list, q, priority])

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
          {!accessOk ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Enter access code</p>
              <div className="flex gap-2">
                <Input value={code} onChange={(e)=>setCode(e.target.value)} placeholder="Access code" />
                <Button onClick={()=> setAccessOk(code.trim().length > 0)}>Continue</Button>
              </div>
            </div>
          ) : loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : list.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending reports.</p>
          ) : (
            <>
              <div className="grid gap-3 md:grid-cols-3">
                <Input placeholder="Search by ID or diagnosis" value={q} onChange={(e)=>setQ(e.target.value)} />
                <Select value={priority} onValueChange={setPriority}>
                  <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3">
                {filtered.map((d) => (
                  <DoctorDiagnosisCard key={d.id} item={d} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

