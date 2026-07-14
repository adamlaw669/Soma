import { NextResponse } from "next/server"
import type { DoctorDiagnosis } from "@/lib/types"

const DOCTOR_API_KEY = process.env.DOCTOR_API_KEY ?? ""

function checkAuth(req: Request): boolean {
  if (!DOCTOR_API_KEY) return false
  const auth = req.headers.get("authorization") ?? ""
  const [scheme, token] = auth.split(" ")
  return scheme?.toLowerCase() === "bearer" && token === DOCTOR_API_KEY
}

const mem: { list: DoctorDiagnosis[] } = (global as any).__SOMA_DIAG__ || { list: [] }
;(global as any).__SOMA_DIAG__ = mem

export async function GET(req: Request) {
  if (!checkAuth(req)) return new NextResponse("Forbidden", { status: 403 })
  return NextResponse.json(mem.list)
}

export async function POST(req: Request) {
  if (!checkAuth(req)) return new NextResponse("Forbidden", { status: 403 })
  const body = (await req.json()) as DoctorDiagnosis
  const idx = mem.list.findIndex((d) => d.id === body.id)
  if (idx >= 0) mem.list[idx] = body
  else mem.list.push(body)
  return NextResponse.json(body)
}
