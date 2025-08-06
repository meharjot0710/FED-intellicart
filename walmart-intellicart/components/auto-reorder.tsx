"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Package, AlertTriangle, X, RotateCcw } from "lucide-react"

interface ReorderItem {
  id: string
  name: string
  lastOrdered: string
  daysUntilEmpty: number
  confidence: number
  price: number
  image: string
  category: string
  subscribed: boolean
}

export function AutoReorder() {
  const [reorderItems, setReorderItems] = useState<ReorderItem[]>([
    {
      id: "1",
      name: "Organic Whole Milk",
      lastOrdered: "3 weeks ago",
      daysUntilEmpty: 3,
      confidence: 95,
      price: 4.99,
      image: "🥛",
      category: "Dairy",
      subscribed: false,
    },
    {
      id: "2",
      name: "Huggies Diapers Size 3",
      lastOrdered: "3 weeks ago",
      daysUntilEmpty: 5,
      confidence: 88,
      price: 24.99,
      image: "👶",
      category: "Baby Care",
      subscribed: true,
    },
    {
      id: "3",
      name: "Tide Laundry Detergent",
      lastOrdered: "6 weeks ago",
      daysUntilEmpty: 7,
      confidence: 82,
      price: 12.99,
      image: "🧴",
      category: "Household",
      subscribed: false,
    },
    {
      id: "4",
      name: "Bananas",
      lastOrdered: "1 week ago",
      daysUntilEmpty: 2,
      confidence: 92,
      price: 2.99,
      image: "🍌",
      category: "Produce",
      subscribed: false,
    },
    {
      id: "5",
      name: "Coffee Beans",
      lastOrdered: "2 weeks ago",
      daysUntilEmpty: 4,
      confidence: 78,
      price: 8.99,
      image: "☕",
      category: "Beverages",
      subscribed: true,
    },
  ])

  const toggleSubscription = (id: string) => {
    setReorderItems((prev) => prev.map((item) => (item.id === id ? { ...item, subscribed: !item.subscribed } : item)))
    console.log("Analytics: Subscription toggled", id)
  }

  const addToCart = (id: string) => {
    console.log("Analytics: Auto-reorder item added to cart", id)
    // Simulate adding to cart
  }

  const skipItem = (id: string) => {
    setReorderItems((prev) => prev.filter((item) => item.id !== id))
    console.log("Analytics: Auto-reorder item skipped", id)
  }

  const getUrgencyColor = (days: number) => {
    if (days <= 3) return "text-red-600 bg-red-50"
    if (days <= 7) return "text-yellow-600 bg-yellow-50"
    return "text-green-600 bg-green-50"
  }

  const getUrgencyIcon = (days: number) => {
    if (days <= 3) return <AlertTriangle className="h-4 w-4" />
    if (days <= 7) return <Calendar className="h-4 w-4" />
    return <Package className="h-4 w-4" />
  }

  const totalSubscriptions = reorderItems.filter((item) => item.subscribed).length
  const urgentItems = reorderItems.filter((item) => item.daysUntilEmpty <= 3).length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <RotateCcw className="h-4 w-4 mr-2 text-blue-500" />
              Active Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalSubscriptions}</p>
            <p className="text-xs text-gray-600">auto-reorder items</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
              Urgent Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{urgentItems}</p>
            <p className="text-xs text-gray-600">running low soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Predicted Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">$24.50</p>
            <p className="text-xs text-gray-600">monthly with auto-reorder</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Smart Reorder Predictions</CardTitle>
          <CardDescription>AI-powered predictions based on your usage patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reorderItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{item.image}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium">{item.name}</h3>
                        {item.subscribed && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Subscribed
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        Last ordered {item.lastOrdered} • {item.category}
                      </p>

                      <div className="flex items-center space-x-4 mb-3">
                        <div
                          className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs ${getUrgencyColor(item.daysUntilEmpty)}`}
                        >
                          {getUrgencyIcon(item.daysUntilEmpty)}
                          <span>Runs out in {item.daysUntilEmpty} days</span>
                        </div>
                        <div className="text-sm text-gray-600">{item.confidence}% confidence</div>
                      </div>

                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-600 mb-1">
                          <span>Usage prediction</span>
                          <span>{item.confidence}%</span>
                        </div>
                        <Progress value={item.confidence} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">${item.price}</span>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => toggleSubscription(item.id)}>
                            {item.subscribed ? "Unsubscribe" : "Subscribe"}
                          </Button>
                          <Button size="sm" onClick={() => addToCart(item.id)}>
                            Add to Cart
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => skipItem(item.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
