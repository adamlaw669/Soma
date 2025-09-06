import type { Report } from "@/lib/types"

export function ReportView({ report }: { report: Report }) {
  const lowConfidence = report.predicted.probability < 0.6
  return (
    <div className="p-6 bg-white text-black max-w-a4 w-[794px]" style={{ fontFamily: "ui-sans-serif, system-ui" }}>
      <header className="mb-4">
        <h1 className="text-2xl font-bold">Soma Diagnosis Report</h1>
        <p className="text-sm">Generated: {new Date(report.generated_at).toLocaleString()}</p>
        <p className="text-xs mt-1">Report ID: {report.id}</p>
      </header>

      <section className="mb-4">
        <h2 className="text-lg font-semibold">Summary</h2>
        <p className="text-sm leading-relaxed mt-1">{report.llm_summary ?? "No summary available."}</p>
      </section>

      <section className="mb-4">
        <h2 className="text-lg font-semibold">Predicted Diagnosis</h2>
        <p className="text-sm mt-1">
          {report.predicted.label} ({Math.round(report.predicted.probability * 100)}% confidence)
        </p>
      </section>

      <section className="mb-4">
        <h2 className="text-lg font-semibold">Triage & Advice</h2>
        <p className="text-sm mt-1">Triage level: {report.triage}</p>
        <ul className="list-disc pl-5 text-sm mt-1">
          {report.advice.map((a, i) => (
            <li key={i}>{a}</li>
          ))}
        </ul>
      </section>

      {report.explanations && report.explanations.length > 0 && (
        <section className="mb-4">
          <h2 className="text-lg font-semibold">Explanations</h2>
          <ul className="list-disc pl-5 text-sm mt-1">
            {report.explanations.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </section>
      )}

      <footer className="mt-6 border-t pt-3">
        <p className="text-xs font-semibold">
          This is a suspected diagnosis. Not a final medical diagnosis.
        </p>
        {lowConfidence && (
          <p className="text-xs text-red-700 mt-1">Low confidence — consult a doctor immediately.</p>
        )}
      </footer>
    </div>
  )
}

