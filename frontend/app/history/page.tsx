"use client"

import { useMemo } from "react"
import { NavBar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { HistoryCard } from "@/components/history-card"
import { useSymptomStore } from "@/lib/store"

export default function HistoryPage() {
  const history = useSymptomStore((s) => s.history)
  const ordered = useMemo(() => history.slice().reverse(), [history])

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1 p-4">
        <div className="mx-auto max-w-3xl space-y-4">
          <h1 className="text-2xl font-bold">Diagnosis History</h1>
          {ordered.length === 0 ? (
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

