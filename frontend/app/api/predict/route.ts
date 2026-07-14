import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    { error: "Prediction service is unavailable. Please ensure the backend is running." },
    { status: 503 },
  )
}
