import { NextResponse } from "next/server"
import { nanoid } from "nanoid"
import type { GenerateReportRequestBody, GenerateReportResponseBody, Report } from "@/lib/types"

// In-memory store for demo
const memory: { reports: Report[] } = (global as any).__SOMA_REPORTS__ || { reports: [] }
;(global as any).__SOMA_REPORTS__ = memory

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as GenerateReportRequestBody

    const nowIso = new Date().toISOString()
    const id = nanoid(12)

    const report: Report = {
      id,
      patient_session_id: body.session.sessionId,
      generated_at: nowIso,
      predicted: {
        label: body.predict_response.top_prediction.label,
        probability: body.predict_response.top_prediction.probability,
      },
      distribution: body.predict_response.distribution,
      triage: body.predict_response.triage,
      advice: body.predict_response.advice,
      explanations: body.predict_response.explanations,
      llm_summary:
        body.recent_reports && body.recent_reports.length > 0
          ? `Context-aware summary referencing ${body.recent_reports.length} prior report(s).`
          : "Concise clinical summary based on current inputs.",
      status: "pending",
    }

    memory.reports.push(report)

    const response: GenerateReportResponseBody = { report }
    return NextResponse.json(response)
  } catch (err: any) {
    return new NextResponse(`Error: ${err?.message ?? "unknown"}`, { status: 400 })
  }
}

