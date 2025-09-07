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

// ----------------------
// Diagnosis history
// ----------------------

export interface DiagnosisHistoryEntry {
  id: string
  created_at: string
  session_id: string
  top_label: string
  top_probability: number
  top3: DistributionItem[]
  symptoms: Partial<Record<SymptomKey, boolean>>
  full_distribution: DistributionItem[]
  triage: "low" | "medium" | "high"
  status?: "pending" | "reviewed" | "confirmed"
}

// ----------------------
// Reports
// ----------------------

export interface ReportDoctorFeedback {
  doctor_id: string
  action: "approve" | "reject"
  corrected_label?: string
  notes?: string
}

export interface Report {
  id: string
  patient_session_id: string
  generated_at: string
  predicted: { label: string; probability: number }
  distribution: DistributionItem[]
  triage: "low" | "medium" | "high"
  advice: string[]
  explanations?: string[]
  llm_summary?: string
  status: "pending" | "reviewed" | "confirmed"
  doctor_feedback?: ReportDoctorFeedback
}

export interface GenerateReportRequestBody {
  predict_response: PredictResponse
  session: {
    sessionId: string
    symptoms: Partial<Record<SymptomKey, boolean>>
    vitals: { temperature_c?: number }
    demographics: { age?: number; sex?: "male" | "female" | "unspecified" }
  }
  recent_reports?: Array<{ id: string; summary: string; predicted_label: string; generated_at: string }>
}

export interface GenerateReportResponseBody {
  report: Report
}
