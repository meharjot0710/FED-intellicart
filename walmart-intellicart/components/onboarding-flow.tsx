"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { ChevronRight, Users, Calendar, Heart } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface OnboardingFlowProps {
  onComplete: () => void
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1)
  const [preferences, setPreferences] = useState({
    householdSize: "",
    dietaryNeeds: [] as string[],
    shoppingDays: [] as string[],
  })
  const { updateUserPreferences } = useAuth()

  const totalSteps = 3
  const progress = (step / totalSteps) * 100

  const handleDietaryChange = (dietary: string, checked: boolean) => {
    if (checked) {
      setPreferences((prev) => ({
        ...prev,
        dietaryNeeds: [...prev.dietaryNeeds, dietary],
      }))
    } else {
      setPreferences((prev) => ({
        ...prev,
        dietaryNeeds: prev.dietaryNeeds.filter((d) => d !== dietary),
      }))
    }
  }

  const handleShoppingDayChange = (day: string, checked: boolean) => {
    if (checked) {
      setPreferences((prev) => ({
        ...prev,
        shoppingDays: [...prev.shoppingDays, day],
      }))
    } else {
      setPreferences((prev) => ({
        ...prev,
        shoppingDays: prev.shoppingDays.filter((d) => d !== day),
      }))
    }
  }

  const handleComplete = async () => {
    await updateUserPreferences(preferences)
    console.log("Analytics: Onboarding completed", preferences)
    onComplete()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">Let's personalize your experience</h1>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-600">
            Step {step} of {totalSteps}
          </p>
        </div>

        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Household Size</span>
              </CardTitle>
              <CardDescription>How many people are in your household?</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={preferences.householdSize}
                onValueChange={(value) => setPreferences((prev) => ({ ...prev, householdSize: value }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1" id="size-1" />
                  <Label htmlFor="size-1">Just me (1 person)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="2" id="size-2" />
                  <Label htmlFor="size-2">Couple (2 people)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="3-4" id="size-3-4" />
                  <Label htmlFor="size-3-4">Small family (3-4 people)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="5+" id="size-5" />
                  <Label htmlFor="size-5">Large family (5+ people)</Label>
                </div>
              </RadioGroup>
              <Button onClick={() => setStep(2)} className="w-full mt-4" disabled={!preferences.householdSize}>
                Next <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-500" />
                <span>Dietary Preferences</span>
              </CardTitle>
              <CardDescription>Select any dietary needs or preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["Vegetarian", "Vegan", "Gluten-free", "Keto", "Low-carb", "Dairy-free", "Organic preferred"].map(
                  (dietary) => (
                    <div key={dietary} className="flex items-center space-x-2">
                      <Checkbox
                        id={dietary}
                        checked={preferences.dietaryNeeds.includes(dietary)}
                        onCheckedChange={(checked) => handleDietaryChange(dietary, checked as boolean)}
                      />
                      <Label htmlFor={dietary}>{dietary}</Label>
                    </div>
                  ),
                )}
              </div>
              <div className="flex space-x-2 mt-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Back
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1">
                  Next <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <span>Shopping Schedule</span>
              </CardTitle>
              <CardDescription>When do you typically shop for groceries?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={day}
                      checked={preferences.shoppingDays.includes(day)}
                      onCheckedChange={(checked) => handleShoppingDayChange(day, checked as boolean)}
                    />
                    <Label htmlFor={day}>{day}</Label>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2 mt-4">
                <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                  Back
                </Button>
                <Button onClick={handleComplete} className="flex-1" disabled={preferences.shoppingDays.length === 0}>
                  Complete Setup
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
