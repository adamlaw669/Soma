export type SymptomKey =
  | "fever"
  | "headache"
  | "nausea"
  | "diarrhea"
  | "body_pain"
  | "cough"
  | "chills"
  | "fatigue"
  | "sore_throat"
  | "abdominal_pain"
  | "rash"
  | "duration_gt_3d"

export interface PredictRequest {
  symptoms: Record<SymptomKey, boolean>
  vitals?: { temperature_c?: number }
  demographics?: { age?: number; sex?: "male" | "female" | "unspecified" }
  meta?: { session_id?: string; question_count?: number }
}

export interface DistributionItem {
  label: string
  probability: number
}

export interface PredictResponse {
  top_prediction: { label: string; probability: number }
  distribution: DistributionItem[]
  triage: "low" | "medium" | "high"
  advice: string[]
  explanations?: string[]
}

export interface Question {
  id: SymptomKey
  label: string
  helpText?: string
  type: "boolean" | "number" | "choice"
  validation?: {
    min?: number
    max?: number
    required?: boolean
  }
}

export interface SymptomSession {
  sessionId: string
  symptoms: Partial<Record<SymptomKey, boolean>>
  vitals: { temperature_c?: number }
  demographics: { age?: number; sex?: "male" | "female" | "unspecified" }
  currentQuestionIndex: number
  isComplete: boolean
}
