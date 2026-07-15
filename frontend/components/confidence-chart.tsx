"use client"

import { useEffect, useState } from "react"
import type { DistributionItem } from "@/lib/types"

interface ConfidenceChartProps {
  distribution: DistributionItem[]
  className?: string
}

export function ConfidenceChart({ distribution, className }: ConfidenceChartProps) {
  const [animatedValues, setAnimatedValues] = useState<number[]>(
    () => distribution.map(() => 0),
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValues(distribution.map((item) => item.probability * 100))
    }, 60)
    return () => clearTimeout(timer)
  }, [distribution])

  const top = distribution.slice(0, 5)

  return (
    <div className={className}>
      <span className="label-eyebrow">Distribution</span>
      <p className="mt-3 text-sm text-muted-foreground">
        Probabilities across the top {top.length} candidate conditions.
      </p>

      <div className="mt-8 space-y-5">
        {top.map((item, index) => {
          const pct = animatedValues[index] ?? 0
          const isTop = index === 0
          return (
            <div key={item.label}>
              <div className="flex items-baseline justify-between text-sm">
                <span className={isTop ? "font-medium" : "text-muted-foreground"}>
                  {item.label}
                </span>
                <span className="tabular-nums text-muted-foreground">
                  {Math.round(item.probability * 100)}%
                </span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className={
                    isTop
                      ? "h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
                      : "h-full rounded-full bg-foreground/25 transition-[width] duration-500 ease-out"
                  }
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
