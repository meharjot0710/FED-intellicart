"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sun, Calendar, TrendingUp } from "lucide-react"
import { ProductCard } from "./product-card"
import {
  mockProducts,
  getWeatherRecommendations,
  getHealthRecommendations,
  getEventRecommendations,
} from "@/lib/mock-data"

export function SmartPlanner() {
  const [weeklyList, setWeeklyList] = useState<any[]>([])
  const [recommendations, setRecommendations] = useState<any[]>([])

  useEffect(() => {
    // Simulate loading recommendations based on various factors
    const weatherRecs = getWeatherRecommendations("hot") // Simulated hot weather
    const healthRecs = getHealthRecommendations(["low-carb", "high-protein"])
    const eventRecs = getEventRecommendations("summer-bbq")

    const allRecs = [...weatherRecs, ...healthRecs, ...eventRecs]
    setRecommendations(allRecs.slice(0, 8))

    // Generate weekly list from past purchases
    setWeeklyList(mockProducts.slice(0, 6))
  }, [])

  const addToCart = (product: any) => {
    console.log("Analytics: Added to cart", product.name)
    // Simulate adding to cart
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Sun className="h-4 w-4 mr-2 text-yellow-500" />
              Weather Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600">Hot week ahead - BBQ essentials recommended</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
              Health Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600">Low-carb options prioritized</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-blue-500" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-gray-600">4th of July BBQ prep</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Weekly Grocery List</CardTitle>
          <CardDescription>Auto-generated based on your shopping patterns and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {weeklyList.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => addToCart(product)}
                showAddButton={true}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Smart Recommendations</CardTitle>
          <CardDescription>Personalized suggestions based on weather, health goals, and events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendations.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => addToCart(product)}
                showAddButton={true}
                compact={true}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
