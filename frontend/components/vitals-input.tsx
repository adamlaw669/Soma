"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

interface VitalsInputProps {
  onTemperatureChange: (temperature: number | undefined) => void
  onContinue: () => void
  initialTemperature?: number
}

export function VitalsInput({
  onTemperatureChange,
  onContinue,
  initialTemperature,
}: VitalsInputProps) {
  const [temperature, setTemperature] = useState<string>(
    initialTemperature?.toString() ?? "",
  )
  const [error, setError] = useState<string>("")

  const handleTemperatureChange = (value: string) => {
    setTemperature(value)
    setError("")

    if (value === "") {
      onTemperatureChange(undefined)
      return
    }

    const temp = Number.parseFloat(value)
    if (isNaN(temp)) {
      setError("Please enter a valid number.")
      return
    }
    if (temp < 34 || temp > 43) {
      setError("Temperature should be between 34°C and 43°C.")
      return
    }

    onTemperatureChange(temp)
  }

  return (
    <div>
      <span className="label-eyebrow">Vitals</span>
      <h2 className="mt-3 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
        What's your temperature?
      </h2>
      <p className="mt-3 text-base text-muted-foreground">
        Since you have a fever, add your temperature if you have a reading. Skip
        if you don't.
      </p>

      <div className="mt-10 max-w-xs">
        <Label htmlFor="temperature" className="text-sm">
          Temperature
        </Label>
        <div className="mt-2 flex items-center gap-2">
          <Input
            id="temperature"
            type="number"
            inputMode="decimal"
            placeholder="37.0"
            value={temperature}
            onChange={(e) => handleTemperatureChange(e.target.value)}
            min="34"
            max="43"
            step="0.1"
            className="h-12 text-base"
          />
          <span className="text-sm text-muted-foreground">°C</span>
        </div>
        {error ? (
          <p className="mt-2 text-sm text-destructive">{error}</p>
        ) : (
          <p className="mt-2 text-xs text-muted-foreground">Normal is around 37°C.</p>
        )}
      </div>

      <div className="mt-10 flex gap-3">
        <Button variant="outline" size="lg" onClick={onContinue}>
          Skip
        </Button>
        <Button size="lg" onClick={onContinue} disabled={!!error}>
          Continue
        </Button>
      </div>
    </div>
  )
}
