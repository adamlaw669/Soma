"use client"

import { useEffect, useState } from "react"
import { NavBar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ReportListItem } from "@/components/report-list-item"
import { getReports, getReportsFromLocalStorage } from "@/lib/api"
import { useSymptomStore } from "@/lib/store"
import type { Report } from "@/lib/types"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ReportsPage() {
  const { session } = useSymptomStore()
  const [reports, setReports] = useState<Report[]>([])
  const [filtered, setFiltered] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string>("all")
  const [priority, setPriority] = useState<string>("all")
  const [q, setQ] = useState("")

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

  useEffect(() => {
    let data = reports.slice()
    if (status !== "all") data = data.filter((r) => r.status === status)
    if (priority !== "all") {
      data = data.filter((r) => {
        const p = r.triage
        return (priority === "high" && p === "high") || (priority === "medium" && p === "medium") || (priority === "low" && p === "low")
      })
    }
    if (q.trim()) {
      const s = q.toLowerCase()
      data = data.filter((r) => r.id.toLowerCase().includes(s) || r.predicted.label.toLowerCase().includes(s))
    }
    setFiltered(data)
  }, [reports, status, priority, q])

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-3xl space-y-4">
          <h1 className="text-2xl font-bold">Report History</h1>
          <div className="grid gap-3 md:grid-cols-4">
            <Card className="p-3"><div className="text-xs text-muted-foreground">Total</div><div className="text-xl font-bold">{reports.length}</div></Card>
            <Card className="p-3"><div className="text-xs text-muted-foreground">Pending</div><div className="text-xl font-bold">{reports.filter(r=>r.status==="pending").length}</div></Card>
            <Card className="p-3"><div className="text-xs text-muted-foreground">Reviewed</div><div className="text-xl font-bold">{reports.filter(r=>r.status==="reviewed").length}</div></Card>
            <Card className="p-3"><div className="text-xs text-muted-foreground">High Priority</div><div className="text-xl font-bold">{reports.filter(r=>r.triage==="high").length}</div></Card>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <Input placeholder="Search by ID or diagnosis" value={q} onChange={(e)=>setQ(e.target.value)} aria-label="Search reports" />
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
              </SelectContent>
            </Select>
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
          {error && <p className="text-sm text-destructive">{error}</p>}
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : reports.length === 0 ? (
            <p className="text-sm text-muted-foreground">No reports yet.</p>
          ) : (
            <div className="space-y-2">
              {filtered
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

