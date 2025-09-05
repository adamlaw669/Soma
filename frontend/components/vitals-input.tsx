"use client"

import { useState } from "react"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Thermometer } from "lucide-react"

interface VitalsInputProps {
  onTemperatureChange: (temperature: number | undefined) => void
  onContinue: () => void
  initialTemperature?: number
}

export function VitalsInput({ onTemperatureChange, onContinue, initialTemperature }: VitalsInputProps) {
  const [temperature, setTemperature] = useState<string>(initialTemperature?.toString() || "")
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
      setError("Please enter a valid number")
      return
    }

    if (temp < 34 || temp > 43) {
      setError("Temperature should be between 34°C and 43°C")
      return
    }

    onTemperatureChange(temp)
  }

  const handleContinue = () => {
    if (temperature && error) {
      return
    }
    onContinue()
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-4">
          <Thermometer className="h-6 w-6 text-primary" />
        </div>
        <CardTitle>Temperature Check</CardTitle>
        <CardDescription>Since you have a fever, please enter your current body temperature if known</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="temperature">Temperature (°C)</Label>
          <Input
            id="temperature"
            type="number"
            placeholder="37.0"
            value={temperature}
            onChange={(e) => handleTemperatureChange(e.target.value)}
            min="34"
            max="43"
            step="0.1"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <p className="text-xs text-muted-foreground">Normal body temperature is around 37°C (98.6°F)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleContinue()} className="flex-1">
            Skip
          </Button>
          <Button onClick={handleContinue} disabled={!!error} className="flex-1">
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
