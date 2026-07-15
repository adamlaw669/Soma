"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function NavBar() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
            S
          </span>
          <span className="text-lg font-semibold tracking-tight">Soma</span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/history"
            className="text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            History
          </Link>
          <Link
            href="/doctor"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            Doctor
          </Link>
          <Button asChild size="sm">
            <Link href="/check">Start check</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}
