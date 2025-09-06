import { NextResponse } from "next/server"
import type { Report } from "@/lib/types"

// In-memory store for demo
const memory: { reports: Report[] } = (global as any).__SOMA_REPORTS__ || { reports: [] }
;(global as any).__SOMA_REPORTS__ = memory

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const report = memory.reports.find((r) => r.id === params.id)
  if (!report) return new NextResponse("Not found", { status: 404 })
  return NextResponse.json(report)
}

