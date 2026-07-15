import Link from "next/link"
import { SomaLogo } from "@/components/soma-logo"

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            className="text-primary transition-opacity hover:opacity-80"
            aria-label="Soma home"
          >
            <SomaLogo size={18} wordmark wordmarkClassName="text-sm" />
          </Link>

          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link href="/about" className="transition-colors hover:text-foreground">About</Link>
            <Link href="/privacy" className="transition-colors hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="transition-colors hover:text-foreground">Terms</Link>
            <Link href="/contact" className="transition-colors hover:text-foreground">Contact</Link>
          </nav>
        </div>

        <p className="mt-10 max-w-2xl text-xs leading-5 text-muted-foreground">
          Not medical advice. Soma is an informational tool — always consult a
          qualified healthcare provider for medical concerns.
        </p>
      </div>
    </footer>
  )
}
