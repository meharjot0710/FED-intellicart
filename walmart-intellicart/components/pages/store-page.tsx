"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Navigation,
  Clock,
  AlertTriangle,
  CheckCircle,
  Map,
  Route,
  ShoppingCart,
  Users,
  User,
} from "lucide-react"
import { useCart } from "@/components/context/cart-context"
import { StoreMap } from "@/components/navigation/store-map"
import { generateNavigationRoute, type OptimizedRoute } from "@/lib/pathfinding"
import { getCurrentCrowdLevels, mapCategoryToSection } from "@/lib/store-layout"

export function StorePage() {
  const [isNavigating, setIsNavigating] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [crowdLevels, setCrowdLevels] = useState<Record<string, number>>({})
  const [activeCartType, setActiveCartType] = useState<"personal" | "shared" | "combined">("combined")
  const { personalItems, sharedItems, state } = useCart()

  // Update crowd levels periodically
  useEffect(() => {
    const updateCrowdLevels = () => {
      setCrowdLevels(getCurrentCrowdLevels())
    }

    updateCrowdLevels()
    const interval = setInterval(updateCrowdLevels, 15000) // Update every 15 seconds

    return () => clearInterval(interval)
  }, [])

  // Generate optimized route based on selected cart type
  const optimizedRoute: OptimizedRoute = useMemo(() => {
    let cartItems: Array<{ name: string; category: string; storeSection?: string }> = []

    switch (activeCartType) {
      case "personal":
        cartItems = personalItems.map((item) => ({
          name: item.name,
          category: item.category,
          storeSection: item.storeSection || mapCategoryToSection(item.category),
        }))
        break
      case "shared":
        cartItems = sharedItems.map((item) => ({
          name: item.name,
          category: item.category,
          storeSection: item.storeSection || mapCategoryToSection(item.category),
        }))
        break
      case "combined":
      default:
        cartItems = [...personalItems, ...sharedItems].map((item) => ({
          name: item.name,
          category: item.category,
          storeSection: item.storeSection || mapCategoryToSection(item.category),
        }))
        break
    }

    return generateNavigationRoute(cartItems, crowdLevels)
  }, [personalItems, sharedItems, activeCartType, crowdLevels])

  // Reset navigation when cart changes
  useEffect(() => {
    if (isNavigating) {
      setCurrentStep(0)
    }
  }, [personalItems, sharedItems, activeCartType])

  const startNavigation = () => {
    if (optimizedRoute.steps.length === 0) return
    setIsNavigating(true)
    setCurrentStep(0)
    console.log("Analytics: Started smart navigation", {
      cartType: activeCartType,
      sections: optimizedRoute.steps.length,
      totalItems: getTotalItemCount(),
      estimatedTime: optimizedRoute.totalTime,
    })
  }

  const completeCurrentStep = () => {
    if (currentStep < optimizedRoute.steps.length - 1) {
      setCurrentStep((prev) => prev + 1)
      console.log("Analytics: Navigation step completed", {
        step: currentStep + 1,
        section: optimizedRoute.steps[currentStep]?.sectionName,
      })
    } else {
      // Navigation complete
      setIsNavigating(false)
      setCurrentStep(0)
      console.log("Analytics: Navigation completed")
    }
  }

  const getTotalItemCount = () => {
    switch (activeCartType) {
      case "personal":
        return personalItems.reduce((sum, item) => sum + item.quantity, 0)
      case "shared":
        return sharedItems.reduce((sum, item) => sum + item.quantity, 0)
      case "combined":
        return state.totalItems
      default:
        return 0
    }
  }

  const getTotalPrice = () => {
    switch (activeCartType) {
      case "personal":
        return state.personalTotal
      case "shared":
        return state.sharedTotal
      case "combined":
        return state.totalPrice
      default:
        return 0
    }
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

  const progress = optimizedRoute.steps.length > 0 ? (currentStep / optimizedRoute.steps.length) * 100 : 0

  return (
    <div className="p-4 space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Smart Store Navigation</h1>
          <p className="text-gray-600">AI-powered routing with real-time optimization</p>
        </div>
        {getTotalItemCount() > 0 && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {getTotalItemCount()} items • ${getTotalPrice().toFixed(2)}
          </Badge>
        )}
      </div>

      {/* Cart Type Selection */}
      {(personalItems.length > 0 || sharedItems.length > 0) && (
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="font-medium text-blue-800">🎯 Choose Navigation Mode</p>
              <div className="flex items-center space-x-2">
                <Button
                  variant={activeCartType === "personal" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCartType("personal")}
                  disabled={personalItems.length === 0}
                  className="bg-transparent"
                >
                  <User className="h-3 w-3 mr-1" />
                  Personal ({personalItems.length})
                </Button>
                <Button
                  variant={activeCartType === "shared" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCartType("shared")}
                  disabled={sharedItems.length === 0}
                  className="bg-transparent"
                >
                  <Users className="h-3 w-3 mr-1" />
                  Household ({sharedItems.length})
                </Button>
                <Button
                  variant={activeCartType === "combined" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCartType("combined")}
                  disabled={personalItems.length === 0 && sharedItems.length === 0}
                  className="bg-transparent"
                >
                  Combined ({personalItems.length + sharedItems.length})
                </Button>
              </div>
            </div>
            <p className="text-sm text-blue-600">
              Navigate with {activeCartType} cart • {optimizedRoute.steps.length} sections • ~{optimizedRoute.totalTime}{" "}
              min
            </p>
          </CardContent>
        </Card>
      )}

      {/* Navigation Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <MapPin className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <p className="text-sm font-medium">Current</p>
            <p className="text-xs text-gray-600">
              {isNavigating ? optimizedRoute.steps[currentStep]?.sectionName || "Checkout" : "Entrance"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <p className="text-sm font-medium">Est. Time</p>
            <p className="text-xs text-gray-600">{optimizedRoute.totalTime} min</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <p className="text-sm font-medium">Progress</p>
            <p className="text-xs text-gray-600">
              {currentStep}/{optimizedRoute.steps.length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Route className="h-6 w-6 text-orange-500 mx-auto mb-2" />
            <p className="text-sm font-medium">Distance</p>
            <p className="text-xs text-gray-600">{Math.round(optimizedRoute.totalDistance)}ft</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="route" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="route" className="flex items-center space-x-2">
            <ShoppingCart className="h-4 w-4" />
            <span>Smart Route</span>
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center space-x-2">
            <Map className="h-4 w-4" />
            <span>Live Map</span>
          </TabsTrigger>
          <TabsTrigger value="navigation" className="flex items-center space-x-2">
            <Navigation className="h-4 w-4" />
            <span>Navigate</span>
          </TabsTrigger>
        </TabsList>

        {/* Smart Route Overview */}
        <TabsContent value="route" className="space-y-4">
          {getTotalItemCount() === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Items in Cart</h3>
                <p className="text-gray-600 mb-4">Add items to your cart to see the optimized shopping route</p>
                <Button variant="outline">Browse Products</Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>🤖 AI-Optimized Shopping Route</CardTitle>
                  <CardDescription>
                    Real-time pathfinding with crowd avoidance and distance optimization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-medium mb-3 text-green-800">🎯 Smart Route Benefits</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="font-medium text-green-800">Time Optimized</p>
                          <p className="text-green-600">~{Math.round(optimizedRoute.totalTime * 0.3)} min saved</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="font-medium text-blue-800">Crowd Avoidance</p>
                          <p className="text-blue-600">Real-time routing</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">Optimized Route Steps:</h4>
                    {optimizedRoute.steps.map((step, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{step.sectionName}</p>
                            <p className="text-xs text-gray-600">
                              {step.items.length > 0 ? step.items.join(", ") : "Checkout"} • ~{step.estimatedTime} min
                            </p>
                            <p className="text-xs text-blue-600">{step.instructions}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getCrowdColor(step.crowdLevel)} variant="secondary">
                            {step.crowdLevel}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {step.items.length} items
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  {!isNavigating && optimizedRoute.steps.length > 0 && (
                    <Button onClick={startNavigation} className="w-full" size="lg">
                      <Navigation className="h-4 w-4 mr-2" />
                      Start AI Navigation
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Interactive Store Map */}
        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Store Map</CardTitle>
              <CardDescription>Real-time crowd levels and optimized pathfinding visualization</CardDescription>
            </CardHeader>
            <CardContent>
              <StoreMap
                route={optimizedRoute}
                currentStep={currentStep}
                showRoute={getTotalItemCount() > 0}
                className="h-96"
              />

              {getTotalItemCount() > 0 && (
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-4 h-1 bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 rounded"></div>
                    <p className="text-sm font-medium text-blue-800">Your AI-Optimized Route</p>
                  </div>
                  <p className="text-xs text-blue-600">
                    Blue path shows your optimized route with real-time crowd avoidance. Numbers indicate stop order for
                    maximum efficiency!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Active Navigation */}
        <TabsContent value="navigation" className="space-y-4">
          {!isNavigating ? (
            <Card>
              <CardHeader>
                <CardTitle>Ready to Navigate</CardTitle>
                <CardDescription>
                  {getTotalItemCount() > 0
                    ? "Start AI-powered navigation to follow your optimized route"
                    : "Add items to your cart to begin navigation"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {getTotalItemCount() > 0 ? (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-200">
                      <h4 className="font-medium mb-2 text-blue-800">🗺️ AI Navigation Preview</h4>
                      <p className="text-sm text-blue-600 mb-3">
                        Your optimized path will guide you through {optimizedRoute.steps.length} sections efficiently.
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium text-blue-800">Total Time</p>
                          <p className="text-blue-600">{optimizedRoute.totalTime} minutes</p>
                        </div>
                        <div>
                          <p className="font-medium text-blue-800">Sections</p>
                          <p className="text-blue-600">{optimizedRoute.steps.length} stops</p>
                        </div>
                      </div>
                    </div>

                    <Button onClick={startNavigation} className="w-full" size="lg">
                      <Navigation className="h-4 w-4 mr-2" />
                      Start AI Navigation
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Add items to your cart to enable navigation</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Navigation Progress</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {Math.round(progress)}% Complete
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={progress} className="mb-4" />
                  <p className="text-sm text-gray-600">
                    {currentStep} of {optimizedRoute.steps.length} sections completed
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-blue-500" />
                    <span>Current: {optimizedRoute.steps[currentStep]?.sectionName || "Checkout"}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {optimizedRoute.steps[currentStep] ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-200">
                        <div>
                          <p className="font-medium text-blue-800">Crowd Level</p>
                          <Badge className={getCrowdColor(optimizedRoute.steps[currentStep].crowdLevel)}>
                            {optimizedRoute.steps[currentStep].crowdLevel}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-blue-800">Est. Time</p>
                          <p className="text-sm text-blue-600">{optimizedRoute.steps[currentStep].estimatedTime} min</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium mb-3">Items to collect:</h4>
                        <div className="space-y-2">
                          {optimizedRoute.steps[currentStep].items.map((item, index) => (
                            <div key={index} className="flex items-center space-x-3 p-3 border rounded-lg bg-white">
                              <CheckCircle className="h-5 w-5 text-gray-400" />
                              <span className="font-medium">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-blue-800 font-medium">📍 Navigation Instructions:</p>
                        <p className="text-sm text-blue-600">{optimizedRoute.steps[currentStep].instructions}</p>
                      </div>

                      <Button onClick={completeCurrentStep} className="w-full" size="lg">
                        ✅ Complete Section ({optimizedRoute.steps[currentStep].items.length} items collected)
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-xl font-bold mb-2 text-green-800">Shopping Complete! 🎉</h3>
                      <p className="text-gray-600 mb-4">All items collected. Head to checkout when ready.</p>
                      <Button onClick={() => setIsNavigating(false)} size="lg">
                        End Navigation
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Live Map During Navigation */}
              <Card>
                <CardHeader>
                  <CardTitle>Live Navigation Map</CardTitle>
                </CardHeader>
                <CardContent>
                  <StoreMap route={optimizedRoute} currentStep={currentStep} showRoute={true} className="h-64" />
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
