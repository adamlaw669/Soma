"use client"

import Link from "next/link"
import type { DoctorDiagnosis } from "@/lib/types"

export function DoctorDiagnosisCard({ item }: { item: DoctorDiagnosis }) {
  return (
    <Link href={`/doctor/${item.id}`} className="block rounded-xl border bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-muted-foreground">{new Date(item.created_at).toLocaleString()}</div>
        <span className="text-xs rounded-full px-2 py-0.5 bg-muted uppercase opacity-80">
          {item.status === "reviewed" ? "Reviewed" : "Pending Review"}
        </span>
      </div>
      <div className="text-lg font-semibold">
        {item.predicted.label} ({Math.round(item.predicted.probability * 100)}%)
      </div>
      <div className="text-xs text-muted-foreground">User: Anonymous</div>
    </Link>
  )
}

