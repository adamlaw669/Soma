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

export async function GET(req: Request, { params }: { params: { id: string } }) {
  if (!checkAuth(req)) return new NextResponse("Forbidden", { status: 403 })
  const item = mem.list.find((d) => d.id === params.id)
  if (!item) return new NextResponse("Not found", { status: 404 })
  return NextResponse.json(item)
}
