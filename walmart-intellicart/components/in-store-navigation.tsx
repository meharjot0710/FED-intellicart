"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MapPin, Navigation, Clock, Users, AlertTriangle, CheckCircle } from "lucide-react"

interface StoreSection {
  id: string
  name: string
  items: string[]
  crowdLevel: "low" | "medium" | "high"
  estimatedTime: number
  completed: boolean
}

export function InStoreNavigation() {
  const [currentSection, setCurrentSection] = useState(0)
  const [isNavigating, setIsNavigating] = useState(false)
  const [sections, setSections] = useState<StoreSection[]>([
    {
      id: "1",
      name: "Produce",
      items: ["Bananas", "Organic Spinach", "Tomatoes"],
      crowdLevel: "low",
      estimatedTime: 3,
      completed: false,
    },
    {
      id: "2",
      name: "Dairy",
      items: ["Organic Milk", "Greek Yogurt"],
      crowdLevel: "medium",
      estimatedTime: 2,
      completed: false,
    },
    {
      id: "3",
      name: "Meat & Seafood",
      items: ["Chicken Breast", "Salmon Fillet"],
      crowdLevel: "high",
      estimatedTime: 5,
      completed: false,
    },
    {
      id: "4",
      name: "Bakery",
      items: ["Whole Grain Bread"],
      crowdLevel: "low",
      estimatedTime: 1,
      completed: false,
    },
    {
      id: "5",
      name: "Frozen Foods",
      items: ["Frozen Berries", "Ice Cream"],
      crowdLevel: "medium",
      estimatedTime: 2,
      completed: false,
    },
  ])

  const startNavigation = () => {
    setIsNavigating(true)
    console.log("Analytics: In-store navigation started")
  }

  const completeSection = (sectionId: string) => {
    setSections((prev) => prev.map((section) => (section.id === sectionId ? { ...section, completed: true } : section)))

    if (currentSection < sections.length - 1) {
      setCurrentSection((prev) => prev + 1)
    }

    console.log("Analytics: Section completed", sectionId)
  }

  const getCrowdColor = (level: string) => {
    switch (level) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCrowdIcon = (level: string) => {
    switch (level) {
      case "high":
        return <AlertTriangle className="h-3 w-3" />
      default:
        return <Users className="h-3 w-3" />
    }
  }

  const totalTime = sections.reduce((sum, section) => sum + section.estimatedTime, 0)
  const completedSections = sections.filter((section) => section.completed).length
  const progress = (completedSections / sections.length) * 100

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-blue-500" />
              Current Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{isNavigating ? sections[currentSection]?.name || "Checkout" : "Entrance"}</p>
            <p className="text-xs text-gray-600">Store section</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Clock className="h-4 w-4 mr-2 text-green-500" />
              Estimated Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">{totalTime} min</p>
            <p className="text-xs text-gray-600">optimized route</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold">
              {completedSections}/{sections.length}
            </p>
            <p className="text-xs text-gray-600">sections completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Route Status</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className={isNavigating ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}>
              {isNavigating ? "Active" : "Ready"}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {!isNavigating ? (
        <Card>
          <CardHeader>
            <CardTitle>Optimized Shopping Route</CardTitle>
            <CardDescription>AI-generated path to minimize time and avoid crowds</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">🗺️ Smart Route Preview</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Your optimized path avoids high-traffic areas and groups similar items together.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {sections.map((section, index) => (
                    <div key={section.id} className="bg-white p-3 rounded border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">
                          {index + 1}. {section.name}
                        </span>
                        <Badge className={getCrowdColor(section.crowdLevel)}>
                          {getCrowdIcon(section.crowdLevel)}
                          <span className="ml-1">{section.crowdLevel}</span>
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">{section.items.join(", ")}</p>
                      <p className="text-xs text-gray-500">~{section.estimatedTime} min</p>
                    </div>
                  ))}
                </div>
              </div>

              <Button onClick={startNavigation} className="w-full" size="lg">
                <Navigation className="h-4 w-4 mr-2" />
                Start Navigation
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Shopping Progress</span>
                <Badge variant="secondary">{Math.round(progress)}% Complete</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={progress} className="mb-4" />
              <div className="text-sm text-gray-600">
                {completedSections} of {sections.length} sections completed
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-blue-500" />
                <span>Current Section: {sections[currentSection]?.name || "Checkout"}</span>
              </CardTitle>
              <CardDescription>
                {sections[currentSection]
                  ? `${sections[currentSection].items.length} items to collect`
                  : "All items collected! Head to checkout."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sections[currentSection] ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium">Crowd Level</p>
                      <Badge className={getCrowdColor(sections[currentSection].crowdLevel)}>
                        {getCrowdIcon(sections[currentSection].crowdLevel)}
                        <span className="ml-1 capitalize">{sections[currentSection].crowdLevel}</span>
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">Est. Time</p>
                      <p className="text-sm text-gray-600">{sections[currentSection].estimatedTime} minutes</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Items to collect:</h4>
                    <div className="space-y-2">
                      {sections[currentSection].items.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2 p-2 border rounded">
                          <CheckCircle className="h-4 w-4 text-gray-400" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button onClick={() => completeSection(sections[currentSection].id)} className="w-full">
                    Complete Section
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Shopping Complete!</h3>
                  <p className="text-gray-600 mb-4">All items collected. Head to checkout when ready.</p>
                  <Button onClick={() => setIsNavigating(false)}>End Navigation</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
