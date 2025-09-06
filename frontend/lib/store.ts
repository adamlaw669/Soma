import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { SymptomSession, SymptomKey } from "./types"

interface SymptomStore {
  session: SymptomSession | null
  apiBaseUrl: string | null

  // Actions
  initSession: () => void
  updateSymptom: (symptom: SymptomKey, value: boolean) => void
  updateVitals: (vitals: Partial<{ temperature_c: number }>) => void
  updateDemographics: (demographics: Partial<{ age: number; sex: "male" | "female" | "unspecified" }>) => void
  nextQuestion: () => void
  resetSession: () => void
  setApiBaseUrl: (url: string | null) => void
}

const generateSessionId = (): string => {
  return "session_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now()
}

export const useSymptomStore = create<SymptomStore>()(
  persist(
    (set, get) => ({
      session: null,
      apiBaseUrl: null,

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
    }),
    {
      name: "soma-session",
      partialize: (state) => ({
        session: state.session,
        apiBaseUrl: state.apiBaseUrl,
      }),
    },
  ),
)
