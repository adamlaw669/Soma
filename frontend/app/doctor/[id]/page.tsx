"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { NavBar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { getDiagnosis, submitDoctorReview } from "@/lib/api"
import type { DoctorDiagnosis } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

export default function DoctorDetailPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const { toast } = useToast()
  const [item, setItem] = useState<DoctorDiagnosis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const loaded = useRef(false)

  useEffect(() => {
    async function load() {
      if (loaded.current) return
      loaded.current = true
      try {
        setLoading(true)
        setError(null)
        const d = await getDiagnosis(params.id)
        setItem(d)
      } catch (e: any) {
        setError(e?.message ?? "Failed to load diagnosis")
      } finally {
        setLoading(false)
      }
    }
    if (params?.id) load()
  }, [params?.id])

  async function handleReview(action: "correct" | "incorrect") {
    if (!item) return
    setSubmitting(true)
    try {
      const updated = await submitDoctorReview({ diagnosis_id: item.id, action, notes })
      setItem(updated)
      toast({ title: "Review saved" })
      router.push("/doctor")
    } catch (e: any) {
      toast({ title: "Failed to save review", description: e?.message ?? "" })
    } finally {
      setSubmitting(false)
    }
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
          ) : !item ? (
            <p className="text-sm text-muted-foreground">Not found.</p>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Diagnosis Review</h1>
                <span className="text-xs rounded-full px-2 py-0.5 bg-muted uppercase opacity-80">
                  {item.status === "reviewed" ? "Reviewed" : "Pending Review"}
                </span>
              </div>
              <div className="rounded-xl border bg-card p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div>{new Date(item.created_at).toLocaleString()}</div>
                  <div>User: Anonymous</div>
                </div>
                <div className="text-lg font-semibold">
                  {item.predicted.label} ({Math.round(item.predicted.probability * 100)}%)
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Full predictions</div>
                  <ul className="text-sm text-muted-foreground">
                    {item.distribution.map((d, i) => (
                      <li key={i}>{d.label}: {Math.round(d.probability * 100)}%</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Symptoms</div>
                  <div className="text-sm text-muted-foreground flex flex-wrap gap-2">
                    {Object.entries(item.symptoms).filter(([,v])=>v).map(([k]) => (
                      <span key={k} className="rounded-full px-2 py-0.5 bg-muted">{k}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="rounded-xl border bg-card p-4 space-y-3">
                <div className="text-sm font-medium">Doctor Review</div>
                <Textarea placeholder="Optional notes" value={notes} onChange={(e)=>setNotes(e.target.value)} />
                <div className="flex gap-2">
                  <Button disabled={submitting} onClick={()=>handleReview("correct")}>Correct</Button>
                  <Button disabled={submitting} variant="outline" className="bg-transparent" onClick={()=>handleReview("incorrect")}>Incorrect</Button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

