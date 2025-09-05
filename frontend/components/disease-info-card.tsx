import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Clock, Users, AlertCircle } from "lucide-react"

interface DiseaseInfo {
  label: string
  description: string
  commonSymptoms: string[]
  whenToSeekCare: string[]
  prevalence?: string
  duration?: string
}

interface DiseaseInfoCardProps {
  diseaseInfo: DiseaseInfo
  className?: string
}

export function DiseaseInfoCard({ diseaseInfo, className }: DiseaseInfoCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <span>{diseaseInfo.label}</span>
          {diseaseInfo.prevalence && (
            <Badge variant="outline" className="text-xs">
              <Users className="w-3 h-3 mr-1" />
              {diseaseInfo.prevalence}
            </Badge>
          )}
        </CardTitle>
        <CardDescription>{diseaseInfo.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold text-sm text-foreground mb-2">Common Symptoms</h4>
          <div className="flex flex-wrap gap-1">
            {diseaseInfo.commonSymptoms.map((symptom, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {symptom}
              </Badge>
            ))}
          </div>
        </div>

        {diseaseInfo.duration && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Typical duration: {diseaseInfo.duration}</span>
          </div>
        )}

        <div>
          <h4 className="font-semibold text-sm text-foreground mb-2 flex items-center space-x-1">
            <AlertCircle className="w-4 h-4" />
            <span>When to Seek Care</span>
          </h4>
          <ul className="space-y-1">
            {diseaseInfo.whenToSeekCare.map((care, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">{care}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
