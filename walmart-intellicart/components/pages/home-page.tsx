"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, Star, TrendingUp, Clock, User, Users } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { useCart } from "@/components/context/cart-context"

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { addToPersonalCart, addToSharedCart, state } = useCart()

  const featuredProducts = [
    {
      id: "1",
      name: "Organic Bananas",
      price: 2.48,
      image: "🍌",
      category: "Produce",
      tags: ["Organic", "Fresh"],
      rating: 4.5,
      storeSection: "Produce",
    },
    {
      id: "2",
      name: "Greek Yogurt",
      price: 5.99,
      image: "🥛",
      category: "Dairy",
      tags: ["Protein", "Low Fat"],
      rating: 4.8,
      storeSection: "Dairy",
    },
    {
      id: "3",
      name: "Chicken Breast",
      price: 8.99,
      image: "🍗",
      category: "Meat",
      tags: ["Fresh", "Lean"],
      rating: 4.6,
      storeSection: "Meat & Seafood",
    },
    {
      id: "4",
      name: "Whole Grain Bread",
      price: 3.49,
      image: "🍞",
      category: "Bakery",
      tags: ["Whole Grain", "Fresh"],
      rating: 4.3,
      storeSection: "Bakery",
    },
  ]
  const [user, setuser] = useState<any>()
  useEffect(() => {
    const userStr = localStorage.getItem("intellicart-user")
    setuser(userStr ? JSON.parse(userStr) : null)
  }, [])
  const quickAddItems = [
    { id: "5", name: "Milk", price: 3.99, image: "🥛", category: "Dairy", storeSection: "Dairy" },
    { id: "6", name: "Eggs", price: 2.99, image: "🥚", category: "Dairy", storeSection: "Dairy" },
    { id: "7", name: "Bread", price: 2.49, image: "🍞", category: "Bakery", storeSection: "Bakery" },
    { id: "8", name: "Apples", price: 4.99, image: "🍎", category: "Produce", storeSection: "Produce" },
  ]

  const handleAddToPersonalCart = (product: any) => {
    addToPersonalCart(product)
    console.log("Analytics: Added to personal cart", product.name)
  }

  const handleAddToSharedCart = (product: any, addedBy: string) => {
    addToSharedCart(product, addedBy)
    console.log("Analytics: Added to shared cart", product.name, "by", addedBy)
  }

  return (
    <div className="p-4 space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Greetings, {user?.name}! 👋</h1>
          <p className="text-gray-600">Ready to shop smart?</p>
        </div>
        {state.totalItems > 0 && (
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <User className="h-3 w-3 mr-1" />
              {state.personalItems.length}
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Users className="h-3 w-3 mr-1" />
              {state.sharedItems.length}
            </Badge>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Enhanced Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <p className="text-sm font-medium">Savings</p>
            <p className="text-lg font-bold text-green-600">$24.50</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <p className="text-sm font-medium">Time Saved</p>
            <p className="text-lg font-bold text-blue-600">45 min</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-sm font-medium">Smart Score</p>
            <p className="text-lg font-bold text-yellow-600">92%</p>
          </CardContent>
        </Card>
      </div>

      {/* Dual Cart Status */}
      {state.totalItems > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-blue-800">🛒 Your Shopping Carts</p>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center space-x-1">
                    <User className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-600">Personal: {state.personalItems.length} items</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-green-600">Household: {state.sharedItems.length} items</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-800">${state.totalPrice.toFixed(2)}</p>
                <p className="text-xs text-blue-600">combined total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Quick Add Items */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Add</CardTitle>
          <CardDescription>Frequently bought items - choose your cart</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {quickAddItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{item.image}</span>
                  <div>
                    <p className="font-medium text-sm">{item.name}</p>
                    <p className="text-xs text-gray-600">${item.price}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    size="sm"
                    onClick={() => handleAddToPersonalCart(item)}
                    className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700"
                    title="Add to Personal Cart"
                  >
                    <User className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleAddToSharedCart(item, "You")}
                    className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                    title="Add to Household Cart"
                  >
                    <Users className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Featured Products with Dual Cart Options */}
      <Card>
        <CardHeader>
          <CardTitle>Featured Products</CardTitle>
          <CardDescription>Recommended for you - add to personal or household cart</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => handleAddToPersonalCart(product)}
                onAddToSharedCart={(addedBy) => handleAddToSharedCart(product, addedBy)}
                showAddButton={true}
                compact={true}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity with Cart Context */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Alex added milk to household cart</p>
              <p className="text-xs text-gray-600">2 hours ago • Pooled discount available</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Personal shopping list completed</p>
              <p className="text-xs text-gray-600">Yesterday • Saved $12.30</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium">Sam claimed bread from household cart</p>
              <p className="text-xs text-gray-600">Yesterday • Ready for pickup</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
