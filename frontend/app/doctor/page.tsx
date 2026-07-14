"use client"

import { useEffect, useState } from "react"
import { NavBar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getDiagnoses, submitDoctorReview, setDoctorApiKey, getDoctorApiKey, clearDoctorApiKey } from "@/lib/api"
import type { DoctorDiagnosis } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DoctorDiagnosisCard } from "@/components/doctor-diagnosis-card"
import { Stethoscope, LogOut } from "lucide-react"

export default function DoctorPage() {
  const [list, setList] = useState<DoctorDiagnosis[]>([])
  const [filtered, setFiltered] = useState<DoctorDiagnosis[]>([])
  const [loading, setLoading] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [listError, setListError] = useState<string | null>(null)
  const { toast } = useToast()
  const [accessOk, setAccessOk] = useState(false)
  const [code, setCode] = useState("")
  const [submittingAuth, setSubmittingAuth] = useState(false)
  const [q, setQ] = useState("")
  const [priority, setPriority] = useState("all")

  // Restore session if key already stored
  useEffect(() => {
    const stored = getDoctorApiKey()
    if (stored) {
      loadDiagnoses()
    }
  }, [])

  async function loadDiagnoses() {
    setLoading(true)
    setListError(null)
    try {
      const res = await getDiagnoses()
      setList(res)
      setAccessOk(true)
    } catch (e: any) {
      setListError(e?.message ?? "Failed to load diagnoses")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let data = list.slice()
    if (q.trim()) {
      const s = q.toLowerCase()
      data = data.filter(
        (r) => r.id.toLowerCase().includes(s) || r.predicted.label.toLowerCase().includes(s),
      )
    }
    setFiltered(data)
  }, [list, q, priority])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!code.trim()) return
    setSubmittingAuth(true)
    setAuthError(null)
    setDoctorApiKey(code.trim())
    try {
      const res = await getDiagnoses()
      setList(res)
      setAccessOk(true)
    } catch (e: any) {
      clearDoctorApiKey()
      if (e?.message?.includes("403") || e?.message?.includes("Forbidden")) {
        setAuthError("Invalid access code. Please try again.")
      } else {
        setAuthError(e?.message ?? "Login failed. Please try again.")
      }
    } finally {
      setSubmittingAuth(false)
    }
  }

  function handleLogout() {
    clearDoctorApiKey()
    setAccessOk(false)
    setList([])
    setCode("")
  }

  async function handleReview(diagnosis: DoctorDiagnosis, action: "correct" | "incorrect", notes?: string) {
    try {
      await submitDoctorReview({ diagnosis_id: diagnosis.id, action, notes })
      setList((prev) =>
        prev.map((d) =>
          d.id === diagnosis.id
            ? { ...d, status: "reviewed", review: { action, notes: notes || "", reviewed_at: new Date().toISOString() } }
            : d,
        ),
      )
      toast({ title: "Review submitted successfully" })
    } catch (e: any) {
      toast({ title: "Failed to submit review", description: e?.message ?? "" })
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-3xl space-y-4">
          {!accessOk ? (
            <div className="max-w-md mx-auto">
              <div className="bg-muted/50 rounded-lg p-6 border border-border">
                <div className="text-center mb-4">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                    <Stethoscope className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-lg font-semibold">Doctor Portal Access</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Review AI predictions and provide feedback to improve diagnostic accuracy
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="access-code" className="text-sm font-medium">
                      Access Code
                    </Label>
                    <Input
                      id="access-code"
                      type="password"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Enter doctor access code"
                      className="mt-1"
                      autoComplete="current-password"
                    />
                  </div>

                  {authError && <p className="text-sm text-destructive">{authError}</p>}

                  <Button type="submit" className="w-full" disabled={!code.trim() || submittingAuth}>
                    {submittingAuth ? "Verifying..." : "Access Portal"}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center">
                    Contact your administrator for access credentials.
                  </p>
                </form>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Doctor Review</h1>
                <Button variant="outline" size="sm" onClick={handleLogout} className="bg-transparent">
                  <LogOut className="w-4 h-4 mr-1" />
                  Sign out
                </Button>
              </div>

              {listError && <p className="text-sm text-destructive">{listError}</p>}

              {loading ? (
                <p className="text-sm text-muted-foreground">Loading...</p>
              ) : list.length === 0 ? (
                <p className="text-sm text-muted-foreground">No pending reports.</p>
              ) : (
                <>
                  <div className="grid gap-3 md:grid-cols-2">
                    <Input
                      placeholder="Search by ID or diagnosis"
                      value={q}
                      onChange={(e) => setQ(e.target.value)}
                    />
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger>
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
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
                      <DoctorDiagnosisCard key={d.id} item={d} onReview={handleReview} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
