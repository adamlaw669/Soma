import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const steps = [
  {
    n: "01",
    title: "Answer twelve questions",
    desc: "Short symptom checkboxes and optional vitals like temperature.",
  },
  {
    n: "02",
    title: "See the distribution",
    desc: "A trained classifier returns probabilities across candidate conditions with a triage suggestion.",
  },
  {
    n: "03",
    title: "Save your report",
    desc: "Download a PDF, share it with your doctor, or review it later. Your session is anonymous.",
  },
]

export function Hero() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pb-24 pt-20 sm:pt-28">
        <span className="label-eyebrow inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          AI symptom checker
        </span>

        <h1 className="mt-8 max-w-4xl text-5xl font-bold leading-[1.03] sm:text-6xl md:text-7xl">
          From symptoms<br />to clarity.
        </h1>

        <p className="mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
          Answer twelve short questions. Soma returns a probability distribution
          over likely conditions with a triage recommendation — in under two minutes.
        </p>

        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/check">
              Start check
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/about">How it works</Link>
          </Button>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <span className="label-eyebrow">The flow</span>
          <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            Three steps, no account.
          </h2>

          <div className="mt-14 grid gap-10 sm:grid-cols-3 sm:gap-8">
            {steps.map((s) => (
              <div key={s.n}>
                <div className="label-eyebrow text-primary">{s.n}</div>
                <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="rounded-lg border border-border p-8 sm:flex sm:items-center sm:justify-between sm:p-10">
            <div className="max-w-lg">
              <span className="label-eyebrow">For clinicians</span>
              <h3 className="mt-3 text-xl font-semibold tracking-tight">
                Review AI predictions and shape the model.
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                The doctor portal shows pending diagnoses so you can approve, correct,
                or annotate them. Access requires a shared key.
              </p>
            </div>
            <Button asChild variant="outline" className="mt-6 shrink-0 sm:mt-0">
              <Link href="/doctor">Open doctor portal</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
