"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, ChevronLeft, Users, Heart, Calendar, Target, CheckCircle } from "lucide-react"

interface OnboardingFlowProps {
  onComplete: () => void
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(1)
  const [preferences, setPreferences] = useState({
    householdSize: "",
    dietaryNeeds: [] as string[],
    healthGoals: [] as string[],
    shoppingDays: [] as string[],
    shoppingFrequency: "",
  })

  const totalSteps = 4
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

  const handleHealthGoalChange = (goal: string, checked: boolean) => {
    if (checked) {
      setPreferences((prev) => ({
        ...prev,
        healthGoals: [...prev.healthGoals, goal],
      }))
    } else {
      setPreferences((prev) => ({
        ...prev,
        healthGoals: prev.healthGoals.filter((g) => g !== goal),
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

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      onComplete()
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-bold text-gray-900">Let's personalize your experience</h1>
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-gray-600">
            Step {step} of {totalSteps}
          </p>
        </div>

        {/* Step 1: Household Size */}
        {step === 1 && (
          <Card className="animate-fade-in">
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
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="1" id="size-1" />
                  <Label htmlFor="size-1" className="flex-1 cursor-pointer">
                    <div className="font-medium">Just me</div>
                    <div className="text-sm text-gray-500">1 person</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="2" id="size-2" />
                  <Label htmlFor="size-2" className="flex-1 cursor-pointer">
                    <div className="font-medium">Couple</div>
                    <div className="text-sm text-gray-500">2 people</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="3-4" id="size-3-4" />
                  <Label htmlFor="size-3-4" className="flex-1 cursor-pointer">
                    <div className="font-medium">Small family</div>
                    <div className="text-sm text-gray-500">3-4 people</div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="5+" id="size-5" />
                  <Label htmlFor="size-5" className="flex-1 cursor-pointer">
                    <div className="font-medium">Large family</div>
                    <div className="text-sm text-gray-500">5+ people</div>
                  </Label>
                </div>
              </RadioGroup>

              <Button onClick={nextStep} className="w-full mt-6" disabled={!preferences.householdSize}>
                Next <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Dietary Preferences */}
        {step === 2 && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-500" />
                <span>Dietary Preferences</span>
              </CardTitle>
              <CardDescription>Select any dietary needs or preferences (optional)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {["Vegetarian", "Vegan", "Gluten-free", "Keto", "Low-carb", "Dairy-free", "Organic", "Halal"].map(
                  (dietary) => (
                    <div key={dietary} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50">
                      <Checkbox
                        id={dietary}
                        checked={preferences.dietaryNeeds.includes(dietary)}
                        onCheckedChange={(checked) => handleDietaryChange(dietary, checked as boolean)}
                      />
                      <Label htmlFor={dietary} className="text-sm cursor-pointer">
                        {dietary}
                      </Label>
                    </div>
                  ),
                )}
              </div>

              {preferences.dietaryNeeds.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Selected preferences:</p>
                  <div className="flex flex-wrap gap-2">
                    {preferences.dietaryNeeds.map((need) => (
                      <Badge key={need} variant="secondary">
                        {need}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-2 mt-6">
                <Button variant="outline" onClick={prevStep} className="flex-1 bg-transparent">
                  <ChevronLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <Button onClick={nextStep} className="flex-1">
                  Next <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Health Goals */}
        {step === 3 && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-green-600" />
                <span>Health Goals</span>
              </CardTitle>
              <CardDescription>What are your health and wellness goals?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { goal: "Weight loss", desc: "Reduce calories and portion sizes" },
                  { goal: "Muscle gain", desc: "Increase protein intake" },
                  { goal: "Heart health", desc: "Low sodium, healthy fats" },
                  { goal: "Energy boost", desc: "Balanced nutrition" },
                  { goal: "Better digestion", desc: "High fiber foods" },
                  { goal: "General wellness", desc: "Balanced, nutritious meals" },
                ].map((item) => (
                  <div key={item.goal} className="flex items-start space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                    <Checkbox
                      id={item.goal}
                      checked={preferences.healthGoals.includes(item.goal)}
                      onCheckedChange={(checked) => handleHealthGoalChange(item.goal, checked as boolean)}
                      className="mt-1"
                    />
                    <Label htmlFor={item.goal} className="flex-1 cursor-pointer">
                      <div className="font-medium">{item.goal}</div>
                      <div className="text-sm text-gray-500">{item.desc}</div>
                    </Label>
                  </div>
                ))}
              </div>

              <div className="flex space-x-2 mt-6">
                <Button variant="outline" onClick={prevStep} className="flex-1 bg-transparent">
                  <ChevronLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <Button onClick={nextStep} className="flex-1">
                  Next <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Shopping Habits */}
        {step === 4 && (
          <Card className="animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <span>Shopping Habits</span>
              </CardTitle>
              <CardDescription>When do you typically shop for groceries?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium mb-3 block">Preferred shopping days:</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <div key={day} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50">
                      <Checkbox
                        id={day}
                        checked={preferences.shoppingDays.includes(day)}
                        onCheckedChange={(checked) => handleShoppingDayChange(day, checked as boolean)}
                      />
                      <Label htmlFor={day} className="text-sm cursor-pointer">
                        {day}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">How often do you shop?</Label>
                <RadioGroup
                  value={preferences.shoppingFrequency}
                  onValueChange={(value) => setPreferences((prev) => ({ ...prev, shoppingFrequency: value }))}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="daily" id="daily" />
                    <Label htmlFor="daily" className="cursor-pointer">
                      Daily
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="weekly" id="weekly" />
                    <Label htmlFor="weekly" className="cursor-pointer">
                      Weekly
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="biweekly" id="biweekly" />
                    <Label htmlFor="biweekly" className="cursor-pointer">
                      Bi-weekly
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly" className="cursor-pointer">
                      Monthly
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" onClick={prevStep} className="flex-1 bg-transparent">
                  <ChevronLeft className="h-4 w-4 mr-2" /> Back
                </Button>
                <Button
                  onClick={nextStep}
                  className="flex-1"
                  disabled={preferences.shoppingDays.length === 0 || !preferences.shoppingFrequency}
                >
                  <CheckCircle className="h-4 w-4 mr-2" /> Complete Setup
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
