import jsPDF from "jspdf"
import type { DiagnosisHistoryEntry } from "./types"

export interface ReportData {
  diagnosis: DiagnosisHistoryEntry
  doctorReview?: {
    action: "correct" | "incorrect"
    notes?: string
    reviewed_at: string
  }
}

/**
 * Generates a PDF report from diagnosis data
 * @param data - The diagnosis data and optional doctor review
 * @returns Promise that resolves when the PDF is downloaded
 */
export async function generateReport(data: ReportData): Promise<void> {
  const { diagnosis, doctorReview } = data
  
  // Create a new PDF document
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  })
  
  // Define colors and styles
  const primaryColor = { r: 59, g: 130, b: 246 } // Blue
  const textColor = { r: 31, g: 41, b: 55 } // Dark gray
  const mutedColor = { r: 107, g: 114, b: 128 } // Gray
  
  // Set initial position
  let yPosition = 20
  
  // Header with logo/title
  pdf.setFontSize(24)
  pdf.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
  pdf.setFont("helvetica", "bold")
  pdf.text("Soma Diagnosis Report", 105, yPosition, { align: "center" })
  
  yPosition += 15
  
  // Patient Info Section
  pdf.setFontSize(16)
  pdf.setTextColor(textColor.r, textColor.g, textColor.b)
  pdf.text("Patient Information", 20, yPosition)
  
  yPosition += 8
  pdf.setFontSize(11)
  pdf.setFont("helvetica", "normal")
  pdf.setTextColor(mutedColor.r, mutedColor.g, mutedColor.b)
  pdf.text(`Report ID: ${diagnosis.id}`, 20, yPosition)
  yPosition += 6
  pdf.text(`Date: ${new Date(diagnosis.created_at).toLocaleDateString("en-US", { 
    year: "numeric", 
    month: "long", 
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  })}`, 20, yPosition)
  
  yPosition += 12
  
  // Symptoms Section
  pdf.setFontSize(16)
  pdf.setFont("helvetica", "bold")
  pdf.setTextColor(textColor.r, textColor.g, textColor.b)
  pdf.text("Reported Symptoms", 20, yPosition)
  
  yPosition += 8
  pdf.setFontSize(11)
  pdf.setFont("helvetica", "normal")
  
  const activeSymptoms = Object.entries(diagnosis.symptoms)
    .filter(([_, value]) => value)
    .map(([key]) => {
      // Convert symptom keys to readable format
      return key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())
    })
  
  if (activeSymptoms.length > 0) {
    activeSymptoms.forEach(symptom => {
      pdf.setTextColor(textColor.r, textColor.g, textColor.b)
      pdf.text(`• ${symptom}`, 25, yPosition)
      yPosition += 6
    })
  } else {
    pdf.setTextColor(mutedColor.r, mutedColor.g, mutedColor.b)
    pdf.text("No symptoms reported", 25, yPosition)
    yPosition += 6
  }
  
  yPosition += 6
  
  // Diagnosis Section
  pdf.setFontSize(16)
  pdf.setFont("helvetica", "bold")
  pdf.setTextColor(textColor.r, textColor.g, textColor.b)
  pdf.text("AI-Predicted Diagnosis", 20, yPosition)
  
  yPosition += 8
  pdf.setFontSize(12)
  pdf.setFont("helvetica", "bold")
  pdf.text(`Primary Diagnosis: ${diagnosis.top_label}`, 20, yPosition)
  
  yPosition += 6
  pdf.setFontSize(11)
  pdf.setFont("helvetica", "normal")
  pdf.text(`Confidence: ${Math.round(diagnosis.top_probability * 100)}%`, 20, yPosition)
  
  yPosition += 8
  pdf.text(`Triage Level: ${diagnosis.triage.toUpperCase()}`, 20, yPosition)
  
  yPosition += 10
  
  // Top 3 Predictions
  if (diagnosis.top3 && diagnosis.top3.length > 0) {
    pdf.setFontSize(14)
    pdf.setFont("helvetica", "bold")
    pdf.text("Differential Diagnosis", 20, yPosition)
    
    yPosition += 8
    pdf.setFontSize(11)
    pdf.setFont("helvetica", "normal")
    
    diagnosis.top3.forEach((prediction, index) => {
      pdf.text(`${index + 1}. ${prediction.label} - ${Math.round(prediction.probability * 100)}%`, 25, yPosition)
      yPosition += 6
    })
    
    yPosition += 6
  }
  
  // Doctor Review Section
  pdf.setFontSize(16)
  pdf.setFont("helvetica", "bold")
  pdf.setTextColor(textColor.r, textColor.g, textColor.b)
  pdf.text("Medical Review Status", 20, yPosition)
  
  yPosition += 8
  pdf.setFontSize(11)
  pdf.setFont("helvetica", "normal")
  
  if (doctorReview) {
    const statusColor = doctorReview.action === "correct" ? { r: 34, g: 197, b: 94 } : { r: 239, g: 68, b: 68 }
    pdf.setTextColor(statusColor.r, statusColor.g, statusColor.b)
    pdf.text(`Status: ${doctorReview.action === "correct" ? "Verified" : "Requires Review"}`, 20, yPosition)
    
    yPosition += 6
    if (doctorReview.notes) {
      pdf.setTextColor(textColor.r, textColor.g, textColor.b)
      pdf.text("Doctor's Notes:", 20, yPosition)
      yPosition += 6
      
      // Split long notes into multiple lines
      const splitNotes = pdf.splitTextToSize(doctorReview.notes, 170)
      pdf.setTextColor(mutedColor.r, mutedColor.g, mutedColor.b)
      splitNotes.forEach((line: string) => {
        pdf.text(line, 25, yPosition)
        yPosition += 5
      })
    }
    
    yPosition += 4
    pdf.setTextColor(mutedColor.r, mutedColor.g, mutedColor.b)
    pdf.text(`Reviewed on: ${new Date(doctorReview.reviewed_at).toLocaleDateString("en-US")}`, 20, yPosition)
  } else {
    pdf.setTextColor(mutedColor.r, mutedColor.g, mutedColor.b)
    pdf.text(`Status: ${diagnosis.status === "reviewed" ? "Reviewed" : "Pending Review"}`, 20, yPosition)
  }
  
  // Add disclaimer at the bottom
  yPosition = 250 // Fixed position near bottom
  
  // Draw a line above disclaimer
  pdf.setDrawColor(mutedColor.r, mutedColor.g, mutedColor.b)
  pdf.line(20, yPosition - 5, 190, yPosition - 5)
  
  pdf.setFontSize(10)
  pdf.setFont("helvetica", "italic")
  pdf.setTextColor(mutedColor.r, mutedColor.g, mutedColor.b)
  
  const disclaimer = "This is an AI-generated suspected diagnosis. Please consult a medical professional for proper medical advice, diagnosis, and treatment. This report should not be used as a substitute for professional medical consultation."
  const splitDisclaimer = pdf.splitTextToSize(disclaimer, 170)
  
  splitDisclaimer.forEach((line: string) => {
    pdf.text(line, 105, yPosition, { align: "center" })
    yPosition += 5
  })
  
  // Footer
  yPosition = 280
  pdf.setFontSize(9)
  pdf.setFont("helvetica", "normal")
  pdf.setTextColor(primaryColor.r, primaryColor.g, primaryColor.b)
  pdf.text("Powered by Soma", 105, yPosition, { align: "center" })
  
  // Generate and download the PDF
  pdf.save(`Soma_Diagnosis_Report_${diagnosis.id}.pdf`)
}

/**
 * Mock function that will later integrate with AI APIs (Gemini/OpenAI)
 * to generate natural language summaries
 */
export async function generateAISummary(diagnosis: DiagnosisHistoryEntry): Promise<string> {
  // TODO: Integrate with Gemini/OpenAI API
  // For now, return a placeholder summary
  
  const symptoms = Object.entries(diagnosis.symptoms)
    .filter(([_, value]) => value)
    .map(([key]) => key.replace(/_/g, " "))
    .join(", ")
  
  return `Based on the reported symptoms (${symptoms}), our AI system has identified ${diagnosis.top_label} as the most likely diagnosis with ${Math.round(diagnosis.top_probability * 100)}% confidence. This condition has been classified as ${diagnosis.triage} priority for medical attention.`
}