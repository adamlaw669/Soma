"use client"

import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { DistributionItem } from "@/lib/types"
import { useEffect, useState } from "react"

interface ConfidenceChartProps {
  distribution: DistributionItem[]
  className?: string
}

export function ConfidenceChart({ distribution, className }: ConfidenceChartProps) {
  const [animatedValues, setAnimatedValues] = useState<number[]>([])

  useEffect(() => {
    // Animate bars from 0 to their target values
    const timer = setTimeout(() => {
      setAnimatedValues(distribution.map((item) => item.probability * 100))
    }, 100)

    return () => clearTimeout(timer)
  }, [distribution])

  const getBarColor = (index: number) => {
    const colors = [
      "bg-chart-1", // Primary emerald
      "bg-chart-2", // Secondary emerald
      "bg-chart-3", // Tertiary color
      "bg-chart-4", // Quaternary color
      "bg-chart-5", // Quinary color
    ]
    return colors[index % colors.length]
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg">Confidence Distribution</CardTitle>
        <CardDescription>Probability breakdown for top conditions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {distribution.slice(0, 5).map((item, index) => (
            <div key={item.label} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{item.label}</span>
                <span className="text-muted-foreground">{Math.round(item.probability * 100)}%</span>
              </div>
              <div className="relative">
                <Progress
                  value={animatedValues[index] || 0}
                  className="h-3"
                  style={{
                    // @ts-ignore - Custom CSS property for chart colors
                    "--progress-background": `hsl(var(--chart-${index + 1}))`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground text-center">
            These probabilities are based on your reported symptoms and should not replace professional medical
            evaluation.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
