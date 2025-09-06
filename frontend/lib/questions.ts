import type { Question, SymptomKey } from "./types"

export const QUESTIONS: Question[] = [
  {
    id: "fever",
    label: "Do you have a fever?",
    helpText: "Body temperature above normal (usually 37°C/98.6°F)",
    type: "boolean",
  },
  {
    id: "headache",
    label: "Do you have a headache?",
    helpText: "Pain or discomfort in your head or upper neck",
    type: "boolean",
  },
  {
    id: "chills",
    label: "Are you experiencing chills or shivering?",
    helpText: "Feeling cold with uncontrollable shaking",
    type: "boolean",
  },
  {
    id: "body_pain",
    label: "Do you have body aches or joint pain?",
    helpText: "General muscle soreness or joint discomfort",
    type: "boolean",
  },
  {
    id: "nausea",
    label: "Are you feeling nauseous or have you vomited?",
    helpText: "Feeling sick to your stomach or actual vomiting",
    type: "boolean",
  },
  {
    id: "diarrhea",
    label: "Do you have diarrhea?",
    helpText: "Loose, watery bowel movements",
    type: "boolean",
  },
  {
    id: "cough",
    label: "Do you have a cough?",
    helpText: "Persistent coughing, dry or with phlegm",
    type: "boolean",
  },
  {
    id: "sore_throat",
    label: "Do you have a sore throat?",
    helpText: "Pain or irritation in your throat",
    type: "boolean",
  },
  {
    id: "fatigue",
    label: "Are you experiencing unusual fatigue or weakness?",
    helpText: "Feeling more tired than usual or lacking energy",
    type: "boolean",
  },
  {
    id: "abdominal_pain",
    label: "Do you have abdominal or stomach pain?",
    helpText: "Pain or discomfort in your belly area",
    type: "boolean",
  },
  {
    id: "rash",
    label: "Do you have any skin rash or changes?",
    helpText: "New spots, bumps, or changes in your skin",
    type: "boolean",
  },
  {
    id: "duration_gt_3d",
    label: "Have your symptoms lasted more than 3 days?",
    helpText: "Duration of your current symptoms",
    type: "boolean",
  },
]

export const getQuestionById = (id: SymptomKey): Question | undefined => {
  return QUESTIONS.find((q) => q.id === id)
}

export const getNextQuestion = (currentIndex: number): Question | null => {
  if (currentIndex >= QUESTIONS.length) return null
  return QUESTIONS[currentIndex]
}
