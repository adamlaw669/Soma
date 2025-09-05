import { Progress } from "../components/ui/progress"

interface ProgressBarProps {
  current: number
  total: number
  className?: string
}

export function ProgressBar({ current, total, className }: ProgressBarProps) {
  const percentage = Math.round((current / total) * 100)

  return (
    <div className={className}>
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
        <span>Progress</span>
        <span>{percentage}%</span>
      </div>
      <Progress value={percentage} className="h-2" />
      <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
        <span>
          {current} of {total} questions
        </span>
        <span>{total - current} remaining</span>
      </div>
    </div>
  )
}
