import { type NextRequest, NextResponse } from "next/server"
import type { PredictRequest, PredictResponse } from "../../../lib/types"

// Mock prediction logic based on symptom patterns
function generateMockPrediction(request: PredictRequest): PredictResponse {
  const { symptoms, vitals, demographics, meta } = request

  // Base priors for common conditions
  const scores = {
    Malaria: 0.4,
    Typhoid: 0.3,
    Flu: 0.3,
  }

  // Adjust scores based on symptom patterns

  // Malaria indicators: fever + chills + headache
  if (symptoms.fever && symptoms.chills && symptoms.headache) {
    scores.Malaria += 0.3
  }
  if (symptoms.fever && symptoms.body_pain) {
    scores.Malaria += 0.2
  }
  if (symptoms.fatigue && symptoms.fever) {
    scores.Malaria += 0.15
  }

  // Typhoid indicators: fever + diarrhea + abdominal pain
  if (symptoms.fever && symptoms.diarrhea) {
    scores.Typhoid += 0.25
  }
  if (symptoms.abdominal_pain && symptoms.nausea) {
    scores.Typhoid += 0.2
  }
  if (symptoms.headache && symptoms.fatigue && symptoms.fever) {
    scores.Typhoid += 0.15
  }

  // Flu indicators: cough + sore throat + body aches
  if (symptoms.cough && symptoms.sore_throat) {
    scores.Flu += 0.3
  }
  if (symptoms.body_pain && symptoms.headache && !symptoms.diarrhea) {
    scores.Flu += 0.2
  }
  if (symptoms.fatigue && symptoms.cough) {
    scores.Flu += 0.15
  }

  // Reduce flu probability if GI symptoms present
  if (symptoms.diarrhea || symptoms.nausea) {
    scores.Flu *= 0.7
  }

  // Reduce malaria if respiratory symptoms dominant
  if (symptoms.cough && symptoms.sore_throat && !symptoms.chills) {
    scores.Malaria *= 0.6
  }

  // Temperature-based adjustments
  if (vitals?.temperature_c) {
    if (vitals.temperature_c >= 39) {
      scores.Malaria += 0.1
      scores.Typhoid += 0.05
    } else if (vitals.temperature_c >= 38) {
      scores.Malaria += 0.05
      scores.Typhoid += 0.03
    }
  }

  // Duration-based adjustments
  if (symptoms.duration_gt_3d) {
    scores.Typhoid += 0.1
    scores.Malaria += 0.05
    scores.Flu *= 0.8 // Flu typically shorter
  }

  // Normalize scores to probabilities
  const total = Object.values(scores).reduce((sum, score) => sum + score, 0)
  const normalizedScores = Object.entries(scores).map(([label, score]) => ({
    label,
    probability: score / total,
  }))

  // Sort by probability (highest first)
  normalizedScores.sort((a, b) => b.probability - a.probability)

  // Determine triage level
  let triage: "low" | "medium" | "high" = "low"
  const topProbability = normalizedScores[0].probability
  const hasHighFever = vitals?.temperature_c && vitals.temperature_c >= 39
  const hasMultipleSymptoms = Object.values(symptoms).filter(Boolean).length >= 5

  if (hasHighFever || (topProbability > 0.7 && hasMultipleSymptoms)) {
    triage = "high"
  } else if (topProbability > 0.5 || hasMultipleSymptoms) {
    triage = "medium"
  }

  // Generate advice based on triage and top prediction
  const advice = generateAdvice(normalizedScores[0].label, triage, symptoms, vitals)

  // Generate explanations
  const explanations = generateExplanations(normalizedScores[0].label, symptoms, vitals)

  return {
    top_prediction: normalizedScores[0],
    distribution: normalizedScores,
    triage,
    advice,
    explanations,
  }
}

function generateAdvice(topCondition: string, triage: string, symptoms: any, vitals: any): string[] {
  const baseAdvice = [
    "Consult a healthcare professional for proper diagnosis.",
    "Stay hydrated and get adequate rest.",
    "Monitor your symptoms and temperature regularly.",
  ]

  if (triage === "high") {
    return [
      "Seek immediate medical attention.",
      "Do not delay in consulting a healthcare provider.",
      "Consider visiting an emergency room if symptoms worsen.",
      ...baseAdvice.slice(1),
    ]
  }

  if (triage === "medium") {
    return [
      "Schedule an appointment with your doctor within 24-48 hours.",
      "Avoid self-medication without professional guidance.",
      ...baseAdvice,
    ]
  }

  // Low triage
  const advice = [...baseAdvice]

  if (symptoms.fever) {
    advice.push("Use fever-reducing medication as directed by a healthcare provider.")
  }

  if (symptoms.diarrhea) {
    advice.push("Maintain fluid intake to prevent dehydration.")
  }

  return advice
}

function generateExplanations(topCondition: string, symptoms: any, vitals: any): string[] {
  const explanations: string[] = []

  if (topCondition === "Malaria") {
    if (symptoms.fever && symptoms.chills) {
      explanations.push("High fever with chills is a classic malaria symptom pattern.")
    }
    if (symptoms.headache && symptoms.body_pain) {
      explanations.push("Headache and body aches commonly occur together in malaria.")
    }
    if (!symptoms.cough && !symptoms.sore_throat) {
      explanations.push("Absence of respiratory symptoms reduces likelihood of flu-like illnesses.")
    }
  }

  if (topCondition === "Typhoid") {
    if (symptoms.fever && symptoms.diarrhea) {
      explanations.push("Fever with gastrointestinal symptoms suggests typhoid fever.")
    }
    if (symptoms.abdominal_pain) {
      explanations.push("Abdominal pain is commonly associated with typhoid fever.")
    }
    if (symptoms.duration_gt_3d) {
      explanations.push("Prolonged symptoms are characteristic of typhoid fever.")
    }
  }

  if (topCondition === "Flu") {
    if (symptoms.cough && symptoms.sore_throat) {
      explanations.push("Respiratory symptoms strongly indicate influenza-like illness.")
    }
    if (symptoms.body_pain && symptoms.fatigue) {
      explanations.push("Body aches and fatigue are typical flu symptoms.")
    }
    if (!symptoms.diarrhea) {
      explanations.push("Absence of gastrointestinal symptoms supports respiratory illness.")
    }
  }

  if (vitals?.temperature_c && vitals.temperature_c >= 39) {
    explanations.push("High fever (≥39°C) indicates a potentially serious condition requiring medical attention.")
  }

  return explanations
}

export async function POST(request: NextRequest) {
  try {
    const body: PredictRequest = await request.json()

    // Validate required fields
    if (!body.symptoms || typeof body.symptoms !== "object") {
      return NextResponse.json({ error: "Invalid symptoms data" }, { status: 400 })
    }

    // Add small delay to simulate API processing
    await new Promise((resolve) => setTimeout(resolve, 800))

    const prediction = generateMockPrediction(body)

    return NextResponse.json(prediction)
  } catch (error) {
    console.error("Prediction API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
