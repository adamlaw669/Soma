import Link from "next/link"
import type { Report } from "@/lib/types"

export function ReportListItem({ report }: { report: Report }) {
  return (
    <Link href={`/report/${report.id}`} className="block rounded border p-3 hover:bg-muted">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">{report.predicted.label}</div>
          <div className="text-xs text-muted-foreground">
            {new Date(report.generated_at).toLocaleString()} • {Math.round(report.predicted.probability * 100)}%
          </div>
        </div>
        <span className="text-xs uppercase tracking-wide opacity-80">{report.status}</span>
      </div>
    </Link>
  )
}

