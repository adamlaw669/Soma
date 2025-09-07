"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "../components/ui/button"
import { Settings, Menu, X, Stethoscope } from "lucide-react"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet"
import { Label } from "../components/ui/label"
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group"
import { useTheme } from "next-themes"

export function NavBar() {
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigationLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/history", label: "History" },
    { href: "/contact", label: "Contact" },
    { href: "/doctor", label: "Doctor Portal", icon: Stethoscope },
  ]

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-lg font-bold">S</span>
              </div>
              <span className="text-xl font-bold text-foreground">Soma</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center space-x-1"
                >
                  {link.icon && <link.icon className="h-4 w-4" />}
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Button asChild>
              <Link href="/check">Start Check</Link>
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                  <span className="sr-only">Settings</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Settings</SheetTitle>
                  <SheetDescription>Configure your Soma app preferences</SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label>Theme</Label>
                    <RadioGroup
                      value={(theme as string) || "system"}
                      onValueChange={(v) => setTheme(v as any)}
                      className="grid grid-cols-3 gap-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id="theme-light" value="light" />
                        <Label htmlFor="theme-light">Light</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id="theme-dark" value="dark" />
                        <Label htmlFor="theme-dark">Dark</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id="theme-system" value="system" />
                        <Label htmlFor="theme-system">System</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <Button asChild size="sm">
              <Link href="/check">Start</Link>
            </Button>
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle className="text-left">Navigation</SheetTitle>
                  <SheetDescription className="text-left">
                    Access all Soma features
                  </SheetDescription>
                </SheetHeader>
                
                <div className="mt-6 space-y-1">
                  {navigationLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center space-x-3 rounded-md px-3 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      {link.icon && <link.icon className="h-4 w-4" />}
                      <span>{link.label}</span>
                    </Link>
                  ))}
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="px-3 py-2">
                      <Label className="text-sm font-medium">Theme</Label>
                      <RadioGroup
                        value={(theme as string) || "system"}
                        onValueChange={(v) => setTheme(v as any)}
                        className="mt-2 space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem id="mobile-theme-light" value="light" />
                          <Label htmlFor="mobile-theme-light">Light</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem id="mobile-theme-dark" value="dark" />
                          <Label htmlFor="mobile-theme-dark">Dark</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem id="mobile-theme-system" value="system" />
                          <Label htmlFor="mobile-theme-system">System</Label>
                        </div>
                      </RadioGroup>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
