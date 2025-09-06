import type {
  PredictRequest,
  PredictResponse,
  GenerateReportRequestBody,
  GenerateReportResponseBody,
  Report,
} from "./types"

const getApiBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_BASE_URL || ""
}

export const predictSymptoms = async (request: PredictRequest): Promise<PredictResponse> => {
  const baseUrl = getApiBaseUrl()
  const url = baseUrl ? `${baseUrl}/predict` : "/api/predict"

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    throw new Error(`Prediction failed: ${response.statusText}`)
  }

  return response.json()
}

export const getDiseaseInfo = async (labels: string[]): Promise<Record<string, any>> => {
  const baseUrl = getApiBaseUrl()
  const params = new URLSearchParams({ labels: labels.join(",") })
  const url = baseUrl ? `${baseUrl}/diseases?${params}` : `/api/diseases?${params}`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Disease info failed: ${response.statusText}`)
  }

  return response.json()
}

// Analytics/telemetry helpers
export const logEvent = (event: string, data?: Record<string, any>) => {
  if (typeof window !== "undefined") {
    console.log(`[Soma Analytics] ${event}:`, data)
    // In production, this would send to your analytics service
  }
}

// ----------------------
// Reports (external-first, fallback to internal mocks)
// ----------------------

const externalOrInternal = (path: string) => {
  const baseUrl = getApiBaseUrl()
  return baseUrl ? `${baseUrl}${path}` : `/api${path}`
}

export async function generateReport(payload: GenerateReportRequestBody): Promise<GenerateReportResponseBody> {
  // Try external
  if (getApiBaseUrl()) {
    try {
      const res = await fetch(externalOrInternal(`/reports/generate`), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (res.ok) return res.json()
    } catch {}
  }
  const res2 = await fetch(`/api/reports/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  if (!res2.ok) throw new Error(`Report generation failed: ${res2.statusText}`)
  return res2.json()
}

export async function getReports(sessionId?: string): Promise<Report[]> {
  const url = externalOrInternal(`/reports${sessionId ? `?session_id=${encodeURIComponent(sessionId)}` : ""}`)
  const res = await fetch(url)
  if (res.ok) return res.json()
  const res2 = await fetch(`/api/reports${sessionId ? `?session_id=${encodeURIComponent(sessionId)}` : ""}`)
  if (!res2.ok) throw new Error(`Get reports failed: ${res2.statusText}`)
  return res2.json()
}

export async function getReport(id: string): Promise<Report> {
  const res = await fetch(externalOrInternal(`/reports/${id}`))
  if (res.ok) return res.json()
  const res2 = await fetch(`/api/reports/${id}`)
  if (!res2.ok) throw new Error(`Get report failed: ${res2.statusText}`)
  return res2.json()
}

export async function getPendingReports(): Promise<Report[]> {
  const res = await fetch(externalOrInternal(`/reports?status=pending`))
  if (res.ok) return res.json()
  const res2 = await fetch(`/api/reports?status=pending`)
  if (!res2.ok) throw new Error(`Get pending reports failed: ${res2.statusText}`)
  return res2.json()
}

export async function submitFeedback(
  reportId: string,
  body: { doctor_id: string; action: "approve" | "reject"; corrected_label?: string; notes?: string },
): Promise<Report> {
  const res = await fetch(externalOrInternal(`/reports/${reportId}/feedback`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (res.ok) return res.json()
  const res2 = await fetch(`/api/reports/${reportId}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res2.ok) throw new Error(`Feedback failed: ${res2.statusText}`)
  return res2.json()
}

// Local cache helpers for recent reports context
const LS_KEY = "soma-reports"
export function saveReportToLocalStorage(report: Report) {
  try {
    if (typeof window === "undefined") return
    const raw = window.localStorage.getItem(LS_KEY)
    const arr: Report[] = raw ? JSON.parse(raw) : []
    const next = [...arr, report].slice(-5)
    window.localStorage.setItem(LS_KEY, JSON.stringify(next))
  } catch {}
}

export function getReportsFromLocalStorage(): Report[] {
  try {
    if (typeof window === "undefined") return []
    const raw = window.localStorage.getItem(LS_KEY)
    return raw ? (JSON.parse(raw) as Report[]) : []
  } catch {
    return []
  }
}

export function findReportInLocalStorage(id: string): Report | undefined {
  return getReportsFromLocalStorage().find((r) => r.id === id)
}

export function getRecentReportsFromLocal(): Array<{ id: string; summary: string; predicted_label: string; generated_at: string }> {
  const arr = getReportsFromLocalStorage()
  return arr
    .slice(-5)
    .reverse()
    .slice(0, 3)
    .map((r) => ({ id: r.id, summary: r.llm_summary ?? "", predicted_label: r.predicted.label, generated_at: r.generated_at }))
}
