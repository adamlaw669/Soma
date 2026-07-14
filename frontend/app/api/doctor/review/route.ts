import { NextResponse } from "next/server"
import type { DoctorDiagnosis, DoctorReviewPayload } from "@/lib/types"

const DOCTOR_API_KEY = process.env.DOCTOR_API_KEY ?? ""

function checkAuth(req: Request): boolean {
  if (!DOCTOR_API_KEY) return false
  const auth = req.headers.get("authorization") ?? ""
  const [scheme, token] = auth.split(" ")
  return scheme?.toLowerCase() === "bearer" && token === DOCTOR_API_KEY
}

const mem: { list: DoctorDiagnosis[] } = (global as any).__SOMA_DIAG__ || { list: [] }
;(global as any).__SOMA_DIAG__ = mem

export async function POST(req: Request) {
  if (!checkAuth(req)) return new NextResponse("Forbidden", { status: 403 })
  const body = (await req.json()) as DoctorReviewPayload
  const idx = mem.list.findIndex((d) => d.id === body.diagnosis_id)
  if (idx < 0) return new NextResponse("Not found", { status: 404 })
  const existing = mem.list[idx]
  const updated: DoctorDiagnosis = {
    ...existing,
    status: "reviewed",
    review: { action: body.action, notes: body.notes, reviewed_at: new Date().toISOString() },
  }
  mem.list[idx] = updated
  return NextResponse.json(updated)
}
