"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SomaLogo } from "@/components/soma-logo"

export function NavBar() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-primary transition-opacity hover:opacity-80"
          aria-label="Soma home"
        >
          <SomaLogo size={22} wordmark />
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
