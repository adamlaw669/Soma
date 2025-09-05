import { Badge } from "../components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { AlertTriangle, CheckCircle, Info } from "lucide-react"
import type { PredictResponse } from "../lib/types"

interface PredictionPanelProps {
  prediction: PredictResponse
  className?: string
}

export function PredictionPanel({ prediction, className }: PredictionPanelProps) {
  const { top_prediction, triage } = prediction

  const getTriageIcon = () => {
    switch (triage) {
      case "high":
        return <AlertTriangle className="h-5 w-5 text-destructive" />
      case "medium":
        return <Info className="h-5 w-5 text-accent" />
      case "low":
        return <CheckCircle className="h-5 w-5 text-primary" />
      default:
        return <Info className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getTriageColor = () => {
    switch (triage) {
      case "high":
        return "destructive"
      case "medium":
        return "secondary"
      case "low":
        return "default"
      default:
        return "outline"
    }
  }

  const getTriageLabel = () => {
    switch (triage) {
      case "high":
        return "High Priority"
      case "medium":
        return "Medium Priority"
      case "low":
        return "Low Priority"
      default:
        return "Unknown"
    }
  }

  return (
    <Card className={className}>
      <CardHeader className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          {getTriageIcon()}
          <Badge variant={getTriageColor() as any}>{getTriageLabel()}</Badge>
        </div>
        <CardTitle className="text-2xl">{top_prediction.label}</CardTitle>
        <CardDescription>
          <span className="text-3xl font-bold text-primary">{Math.round(top_prediction.probability * 100)}%</span>
          <span className="text-muted-foreground ml-2">confidence</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <h4 className="font-semibold text-foreground">Recommendations:</h4>
          <ul className="space-y-2">
            {prediction.advice.map((advice, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">{advice}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
