import { NextResponse } from "next/server"
import type { Report } from "@/lib/types"

// In-memory store for demo
const memory: { reports: Report[] } = (global as any).__SOMA_REPORTS__ || { reports: [] }
;(global as any).__SOMA_REPORTS__ = memory

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get("session_id")
  const status = searchParams.get("status")

  let data = memory.reports
  if (sessionId) data = data.filter((r) => r.patient_session_id === sessionId)
  if (status) data = data.filter((r) => r.status === status)
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  try {
    const incoming = (await req.json()) as Report
    // Upsert by id
    const idx = memory.reports.findIndex((r) => r.id === incoming.id)
    if (idx >= 0) memory.reports[idx] = incoming
    else memory.reports.push(incoming)
    return NextResponse.json(incoming)
  } catch (err: any) {
    return new NextResponse(`Error: ${err?.message ?? "unknown"}`, { status: 400 })
  }
}

