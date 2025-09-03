import { type NextRequest, NextResponse } from "next/server"

// Mock disease information database
const DISEASE_INFO = {
  Malaria: {
    label: "Malaria",
    description: "A mosquito-borne infectious disease caused by parasites that affects red blood cells.",
    commonSymptoms: ["High fever", "Chills", "Headache", "Body aches", "Fatigue", "Nausea"],
    whenToSeekCare: [
      "High fever (≥39°C/102°F) that doesn't respond to medication",
      "Severe headache with neck stiffness",
      "Difficulty breathing or rapid breathing",
      "Persistent vomiting or inability to keep fluids down",
      "Signs of dehydration or confusion",
    ],
    prevalence: "Endemic areas",
    duration: "1-2 weeks with treatment",
  },
  Typhoid: {
    label: "Typhoid Fever",
    description:
      "A bacterial infection caused by Salmonella typhi, typically spread through contaminated food or water.",
    commonSymptoms: ["Sustained fever", "Headache", "Abdominal pain", "Diarrhea", "Rose-colored rash", "Fatigue"],
    whenToSeekCare: [
      "Persistent high fever for more than 3 days",
      "Severe abdominal pain or bloating",
      "Blood in stool or severe diarrhea",
      "Signs of dehydration (dizziness, dry mouth, reduced urination)",
      "Confusion or altered mental state",
    ],
    prevalence: "Developing countries",
    duration: "2-4 weeks without treatment",
  },
  Flu: {
    label: "Influenza (Flu)",
    description: "A viral respiratory infection that affects the nose, throat, and lungs.",
    commonSymptoms: ["Fever", "Cough", "Sore throat", "Body aches", "Headache", "Fatigue"],
    whenToSeekCare: [
      "Difficulty breathing or shortness of breath",
      "Chest pain or pressure",
      "High fever (≥39°C/102°F) lasting more than 3 days",
      "Severe headache or sinus pain",
      "Persistent vomiting or signs of dehydration",
    ],
    prevalence: "Seasonal outbreaks",
    duration: "5-7 days typically",
  },
  "Common Cold": {
    label: "Common Cold",
    description: "A viral upper respiratory tract infection that primarily affects the nose and throat.",
    commonSymptoms: ["Runny nose", "Sneezing", "Sore throat", "Mild cough", "Low-grade fever", "Congestion"],
    whenToSeekCare: [
      "Symptoms lasting more than 10 days",
      "High fever (≥38.5°C/101°F)",
      "Severe headache or sinus pain",
      "Difficulty breathing or wheezing",
      "Ear pain or discharge",
    ],
    prevalence: "Very common",
    duration: "7-10 days",
  },
  "Food Poisoning": {
    label: "Food Poisoning",
    description:
      "Illness caused by consuming contaminated food or beverages containing harmful bacteria, viruses, or toxins.",
    commonSymptoms: ["Nausea", "Vomiting", "Diarrhea", "Abdominal cramps", "Fever", "Headache"],
    whenToSeekCare: [
      "Severe dehydration (dizziness, dry mouth, little or no urination)",
      "Blood in vomit or stool",
      "High fever (≥38.5°C/101°F)",
      "Severe abdominal pain",
      "Signs of severe dehydration in children or elderly",
    ],
    prevalence: "Common",
    duration: "1-3 days typically",
  },
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const labelsParam = searchParams.get("labels")

    if (!labelsParam) {
      return NextResponse.json({ error: "Labels parameter is required" }, { status: 400 })
    }

    const labels = labelsParam.split(",").map((label) => label.trim())
    const result: Record<string, any> = {}

    for (const label of labels) {
      if (DISEASE_INFO[label as keyof typeof DISEASE_INFO]) {
        result[label] = DISEASE_INFO[label as keyof typeof DISEASE_INFO]
      }
    }

    // Add small delay to simulate API processing
    await new Promise((resolve) => setTimeout(resolve, 300))

    return NextResponse.json(result)
  } catch (error) {
    console.error("Disease info API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
