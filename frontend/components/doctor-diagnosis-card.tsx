"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import type { DoctorDiagnosis } from "@/lib/types"
import { CheckCircle, XCircle, Eye } from "lucide-react"

interface DoctorDiagnosisCardProps {
  item: DoctorDiagnosis
  onReview?: (diagnosis: DoctorDiagnosis, action: "correct" | "incorrect", notes?: string) => void
}

export function DoctorDiagnosisCard({ item, onReview }: DoctorDiagnosisCardProps) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const handleReview = async (action: "correct" | "incorrect") => {
    if (!onReview) return
    setSubmitting(true)
    try {
      await onReview(item, action, notes)
      setShowReviewForm(false)
      setNotes("")
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "reviewed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            {item.predicted.label} ({Math.round(item.predicted.probability * 100)}%)
          </CardTitle>
          <Badge className={getStatusColor(item.status)}>
            {item.status === "reviewed" ? "Reviewed" : "Pending Review"}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          {new Date(item.created_at).toLocaleString()} • User: {item.user_id || "Anonymous"}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm">
          <strong>Top 3 Predictions:</strong>
          <div className="mt-1 space-y-1">
            {item.distribution.slice(0, 3).map((dist, idx) => (
              <div key={idx} className="flex justify-between text-xs">
                <span>{dist.label}</span>
                <span>{Math.round(dist.probability * 100)}%</span>
              </div>
            ))}
          </div>
        </div>

        {item.review && (
          <div className="text-sm border-t pt-3">
            <strong>Doctor Review:</strong>
            <div className="mt-1">
              <Badge className={item.review.action === "correct" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                {item.review.action === "correct" ? "Correct" : "Incorrect"}
              </Badge>
              {item.review.notes && (
                <p className="text-xs text-muted-foreground mt-1">{item.review.notes}</p>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/doctor/${item.id}`}>
              <Eye className="h-4 w-4 mr-1" />
              View Details
            </Link>
          </Button>

          {item.status === "pending" && onReview && (
            <>
              {!showReviewForm ? (
                <Button onClick={() => setShowReviewForm(true)} size="sm">
                  Review
                </Button>
              ) : (
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Optional notes..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="text-xs"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleReview("correct")}
                      disabled={submitting}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Correct
                    </Button>
                    <Button
                      onClick={() => handleReview("incorrect")}
                      disabled={submitting}
                      size="sm"
                      variant="destructive"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Incorrect
                    </Button>
                    <Button
                      onClick={() => setShowReviewForm(false)}
                      disabled={submitting}
                      size="sm"
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

