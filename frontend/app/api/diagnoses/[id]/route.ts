import { NextResponse } from "next/server"
import type { DoctorDiagnosis } from "@/lib/types"

const mem: { list: DoctorDiagnosis[] } = (global as any).__SOMA_DIAG__ || { list: [] }
;(global as any).__SOMA_DIAG__ = mem

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const item = mem.list.find((d) => d.id === params.id)
  if (!item) return new NextResponse("not found", { status: 404 })
  return NextResponse.json(item)
}
