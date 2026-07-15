interface ProgressBarProps {
  current: number
  total: number
  className?: string
}

export function ProgressBar({ current, total, className }: ProgressBarProps) {
  const percentage = Math.min(100, Math.round((current / total) * 100))
  const currentDisplay = Math.min(current, total).toString().padStart(2, "0")
  const totalDisplay = total.toString().padStart(2, "0")

  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        <span className="label-eyebrow">Question {currentDisplay} / {totalDisplay}</span>
        <span className="text-xs tabular-nums text-muted-foreground">{percentage}%</span>
      </div>
      <div className="mt-3 h-px w-full bg-border">
        <div
          className="h-px bg-primary transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
