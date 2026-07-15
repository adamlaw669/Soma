import type { PredictResponse } from "@/lib/types"
import { cn } from "@/lib/utils"

interface PredictionPanelProps {
  prediction: PredictResponse
  className?: string
}

const triageStyles: Record<
  PredictResponse["triage"],
  { label: string; dot: string; text: string; bg: string; border: string }
> = {
  low: {
    label: "Low priority",
    dot: "bg-primary",
    text: "text-primary",
    bg: "bg-primary/5",
    border: "border-primary/20",
  },
  medium: {
    label: "Medium priority",
    dot: "bg-amber-500",
    text: "text-amber-700",
    bg: "bg-amber-500/5",
    border: "border-amber-500/25",
  },
  high: {
    label: "High priority",
    dot: "bg-destructive",
    text: "text-destructive",
    bg: "bg-destructive/5",
    border: "border-destructive/25",
  },
}

export function PredictionPanel({ prediction, className }: PredictionPanelProps) {
  const { top_prediction, triage } = prediction
  const style = triageStyles[triage]
  const confidence = Math.round(top_prediction.probability * 100)

  return (
    <div className={className}>
      <span className="label-eyebrow">Most likely condition</span>

      <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          {top_prediction.label}
        </h1>
        <div className="tabular-nums">
          <span className="text-4xl font-semibold sm:text-5xl">{confidence}</span>
          <span className="ml-1 text-lg text-muted-foreground">%</span>
        </div>
      </div>

      <div className="mt-6">
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.14em]",
            style.border,
            style.bg,
            style.text,
          )}
        >
          <span className={cn("h-1.5 w-1.5 rounded-full", style.dot)} />
          {style.label}
        </span>
      </div>

      {prediction.advice.length > 0 && (
        <div className="mt-10">
          <span className="label-eyebrow">Recommendations</span>
          <ul className="mt-4 space-y-3">
            {prediction.advice.map((a, i) => (
              <li key={i} className="flex gap-3 text-sm leading-6">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-foreground/40" />
                <span>{a}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
