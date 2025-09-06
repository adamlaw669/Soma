import type { PredictRequest, PredictResponse } from "./types"

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
