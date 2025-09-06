import { NextResponse } from "next/server"
import type { Report } from "@/lib/types"

// In-memory store for demo
const memory: { reports: Report[] } = (global as any).__SOMA_REPORTS__ || { reports: [] }
;(global as any).__SOMA_REPORTS__ = memory

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const payload = (await req.json()) as {
      doctor_id: string
      action: "approve" | "reject"
      corrected_label?: string
      notes?: string
    }

    const idx = memory.reports.findIndex((r) => r.id === params.id)
    if (idx < 0) return new NextResponse("Not found", { status: 404 })

    const existing = memory.reports[idx]
    const updated: Report = {
      ...existing,
      status: "reviewed",
      doctor_feedback: {
        doctor_id: payload.doctor_id,
        action: payload.action,
        corrected_label: payload.corrected_label,
        notes: payload.notes,
      },
      // If rejected with corrected label, reflect that for the user view
      predicted:
        payload.action === "reject" && payload.corrected_label
          ? { label: payload.corrected_label, probability: existing.predicted.probability }
          : existing.predicted,
    }
    memory.reports[idx] = updated
    return NextResponse.json(updated)
  } catch (err: any) {
    return new NextResponse(`Error: ${err?.message ?? "unknown"}`, { status: 400 })
  }
}

