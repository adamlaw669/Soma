"use client"

import { useEffect, useMemo, useState } from "react"
import { NavBar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HistoryCard } from "@/components/history-card"
import { useSymptomStore } from "@/lib/store"
import type { DiagnosisHistoryEntry } from "@/lib/types"

export default function HistoryPage() {
  const localHistory = useSymptomStore((s) => s.history)
  const [backendHistory, setBackendHistory] = useState<DiagnosisHistoryEntry[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch history from backend
  useEffect(() => {
    async function fetchBackendHistory() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
        if (baseUrl) {
          const response = await fetch(`${baseUrl}/diagnoses/anonymous`)
          if (response.ok) {
            const diagnoses = await response.json()
            // Convert backend format to frontend format
            const converted = diagnoses.map((d: any) => ({
              id: d.id,
              created_at: d.timestamp,
              session_id: d.user_id,
              top_label: d.top_prediction,
              top_probability: d.distribution?.[0]?.probability || 0,
              top3: d.distribution?.slice(0, 3) || [],
              symptoms: d.symptoms,
              full_distribution: d.distribution || [],
              triage: 'medium', // Default since backend doesn't have triage
              status: d.doctor_review_status || 'pending'
            }))
            setBackendHistory(converted)
          }
        }
      } catch (error) {
        console.warn('Failed to fetch backend history:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBackendHistory()
  }, [])

  // Combine local and backend history, removing duplicates
  const allHistory = useMemo(() => {
    const combined = [...localHistory, ...backendHistory]
    const unique = combined.filter((item, index, self) => 
      index === self.findIndex(t => t.id === item.id)
    )
    return unique.slice().reverse()
  }, [localHistory, backendHistory])

  const ordered = allHistory

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-3xl space-y-4">
          <h1 className="text-2xl font-bold">Diagnosis History</h1>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading history...</p>
          ) : ordered.length === 0 ? (
            <p className="text-sm text-muted-foreground">No history yet.</p>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[70vh] pr-1">
              {ordered.map((e, i) => (
                <HistoryCard key={e.id} entry={e} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

