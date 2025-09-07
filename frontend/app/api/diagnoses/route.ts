import { NextResponse } from "next/server"
import type { DoctorDiagnosis } from "@/lib/types"

const mem: { list: DoctorDiagnosis[] } = (global as any).__SOMA_DIAG__ || { list: [] }
;(global as any).__SOMA_DIAG__ = mem

export async function GET() {
  return NextResponse.json(mem.list)
}

export async function POST(req: Request) {
  const body = (await req.json()) as DoctorDiagnosis
  const idx = mem.list.findIndex((d) => d.id === body.id)
  if (idx >= 0) mem.list[idx] = body
  else mem.list.push(body)
  return NextResponse.json(body)
}

