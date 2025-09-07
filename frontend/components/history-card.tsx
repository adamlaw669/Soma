"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import type { DiagnosisHistoryEntry } from "@/lib/types"

export function HistoryCard({ entry, index }: { entry: DiagnosisHistoryEntry; index: number }) {
  const top3 = entry.top3
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="rounded-xl border bg-card shadow-sm p-4"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-muted-foreground">{new Date(entry.created_at).toLocaleString()}</div>
        <span className="text-xs uppercase opacity-70">{entry.status}</span>
      </div>
      <div className="text-lg font-semibold">{entry.top_label}</div>
      <div className="text-sm text-muted-foreground">
        {top3.map((d, i) => (
          <span key={i} className="mr-3">
            {d.label}: {Math.round(d.probability * 100)}%
          </span>
        ))}
      </div>
      <div className="mt-3">
        <Link href={`/history/${encodeURIComponent(entry.id)}`} className="text-primary text-sm underline">
          View details
        </Link>
      </div>
    </motion.div>
  )
}

