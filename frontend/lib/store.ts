import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { SymptomSession, SymptomKey, DiagnosisHistoryEntry, PredictResponse } from "./types"

interface SymptomStore {
  session: SymptomSession | null
  apiBaseUrl: string | null
  history: DiagnosisHistoryEntry[]

  // Actions
  initSession: () => void
  updateSymptom: (symptom: SymptomKey, value: boolean) => void
  updateVitals: (vitals: Partial<{ temperature_c: number }>) => void
  updateDemographics: (demographics: Partial<{ age: number; sex: "male" | "female" | "unspecified" }>) => void
  nextQuestion: () => void
  resetSession: () => void
  setApiBaseUrl: (url: string | null) => void
  addDiagnosisToHistory: (prediction: PredictResponse) => DiagnosisHistoryEntry | null
}

const generateSessionId = (): string => {
  return "session_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now()
}

export const useSymptomStore = create<SymptomStore>()(
  persist(
    (set, get) => ({
      session: null,
      apiBaseUrl: null,
      history: [],

      initSession: () => {
        set({
          session: {
            sessionId: generateSessionId(),
            symptoms: {},
            vitals: {},
            demographics: {},
            currentQuestionIndex: 0,
            isComplete: false,
          },
        })
      },

      updateSymptom: (symptom: SymptomKey, value: boolean) => {
        const { session } = get()
        if (!session) return

        set({
          session: {
            ...session,
            symptoms: {
              ...session.symptoms,
              [symptom]: value,
            },
          },
        })
      },

      updateVitals: (vitals) => {
        const { session } = get()
        if (!session) return

        set({
          session: {
            ...session,
            vitals: {
              ...session.vitals,
              ...vitals,
            },
          },
        })
      },

      updateDemographics: (demographics) => {
        const { session } = get()
        if (!session) return

        set({
          session: {
            ...session,
            demographics: {
              ...session.demographics,
              ...demographics,
            },
          },
        })
      },

      nextQuestion: () => {
        const { session } = get()
        if (!session) return

        const nextIndex = session.currentQuestionIndex + 1
        set({
          session: {
            ...session,
            currentQuestionIndex: nextIndex,
            isComplete: nextIndex >= 8, // Minimum 8 questions before allowing results
          },
        })
      },

      resetSession: () => {
        set({ session: null })
      },

      setApiBaseUrl: (url: string | null) => {
        set({ apiBaseUrl: url })
      },

      addDiagnosisToHistory: (prediction) => {
        const session = get().session
        if (!session) return null
        const top3 = prediction.distribution.slice(0, 3)
        const entry: DiagnosisHistoryEntry = {
          id: `${session.sessionId}-${Date.now()}`,
          created_at: new Date().toISOString(),
          session_id: session.sessionId,
          top_label: prediction.top_prediction.label,
          top_probability: prediction.top_prediction.probability,
          top3,
          symptoms: session.symptoms,
          full_distribution: prediction.distribution,
          triage: prediction.triage,
          status: "pending",
        }
        set((state) => ({ history: [...state.history, entry] }))
        return entry
      },
    }),
    {
      name: "soma-session",
      partialize: (state) => ({
        session: state.session,
        apiBaseUrl: state.apiBaseUrl,
        history: state.history,
      }),
    },
  ),
)
