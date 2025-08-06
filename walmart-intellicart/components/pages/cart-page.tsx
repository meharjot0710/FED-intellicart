"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  MapPin,
  Clock,
  Users,
  User,
  ArrowRightLeft,
  CheckCircle,
  Split,
  Percent,
} from "lucide-react"
import { useCart } from "@/components/context/cart-context"

// Mock household members
const householdMembers = [
  { id: "You", name: "You", avatar: "👤", color: "bg-blue-100 text-blue-800" },
  { id: "Alex", name: "Alex", avatar: "👨", color: "bg-green-100 text-green-800" },
  { id: "Sam", name: "Sam", avatar: "👩", color: "bg-purple-100 text-purple-800" },
]

export function CartPage() {
  const {
    personalItems,
    sharedItems,
    state,
    updatePersonalQuantity,
    updateSharedQuantity,
    removeFromPersonalCart,
    removeFromSharedCart,
    moveToSharedCart,
    moveToPersonalCart,
    claimSharedItem,
    splitSharedItem,
    clearPersonalCart,
    clearSharedCart,
    getSharedDiscounts,
  } = useCart()

  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [activeTab, setActiveTab] = useState("personal")

  const handleCheckout = (cartType: "personal" | "shared" | "both") => {
    setIsCheckingOut(true)
    setTimeout(() => {
      alert(`${cartType === "both" ? "Combined" : cartType} order placed successfully! 🎉`)
      if (cartType === "personal" || cartType === "both") clearPersonalCart()
      if (cartType === "shared" || cartType === "both") clearSharedCart()
      setIsCheckingOut(false)
    }, 2000)
  }

  const getEstimatedPickupTime = (items: number) => {
    const baseTime = 30
    const itemTime = Math.ceil(items / 5) * 5
    return baseTime + itemTime
  }

  const getMemberInfo = (memberName: string) => {
    return householdMembers.find((m) => m.name === memberName) || householdMembers[0]
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "claimed":
        return "bg-green-100 text-green-800"
      case "split":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "claimed":
        return <CheckCircle className="h-3 w-3" />
      case "split":
        return <Split className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const sharedDiscounts = getSharedDiscounts()
  const sharedDiscountAmount = sharedDiscounts.reduce((sum, discount) => {
    const item = sharedItems.find((item) => item.name === discount.item)
    return sum + (item ? (item.price * item.quantity * discount.discount) / 100 : 0)
  }, 0)

  if (personalItems.length === 0 && sharedItems.length === 0) {
    return (
      <div className="p-4 space-y-6 pb-20">
        <div className="text-center py-12">
          <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your carts are empty</h2>
          <p className="text-gray-600 mb-6">Add some items to get started with your shopping</p>
          <Button>Start Shopping</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shopping Carts</h1>
          <p className="text-gray-600">
            {state.totalItems} total items • ${state.totalPrice.toFixed(2)}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <User className="h-3 w-3 mr-1" />
            {personalItems.length}
          </Badge>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Users className="h-3 w-3 mr-1" />
            {sharedItems.length}
          </Badge>
        </div>
      </div>

      {/* Pickup Info */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Ready for pickup</p>
                <p className="text-sm text-green-600">Walmart Supercenter - Main St</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 text-green-600">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">~{getEstimatedPickupTime(state.totalItems)} min</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shared Discounts Alert */}
      {sharedDiscounts.length > 0 && (
        <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Percent className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-800">🎉 Household Savings Active!</p>
                <p className="text-sm text-orange-600">
                  Save ${sharedDiscountAmount.toFixed(2)} with pooled discounts from your household
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cart Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personal" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Personal Cart ({personalItems.length})</span>
          </TabsTrigger>
          <TabsTrigger value="shared" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Household Cart ({sharedItems.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* Personal Cart */}
        <TabsContent value="personal" className="space-y-4">
          {personalItems.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <User className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Personal cart is empty</h3>
                <p className="text-gray-600">Items you add will appear here by default</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Personal Cart Items</CardTitle>
                  <CardDescription>Your individual shopping items</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {personalItems.map((item, index) => (
                    <div key={item.id}>
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{item.image}</div>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-600">{item.category}</p>
                          <p className="text-sm font-medium text-green-600">${item.price.toFixed(2)} each</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updatePersonalQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updatePersonalQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                          <div className="flex space-x-1 mt-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => moveToSharedCart(item.id, "You")}
                              className="text-blue-600 hover:text-blue-700 h-6 px-2"
                            >
                              <ArrowRightLeft className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFromPersonalCart(item.id)}
                              className="text-red-600 hover:text-red-700 h-6 px-2"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      {index < personalItems.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Personal Cart Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Personal Cart Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal ({personalItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>${state.personalTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${(state.personalTotal * 0.08).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${(state.personalTotal * 1.08).toFixed(2)}</span>
                  </div>
                  <Button
                    onClick={() => handleCheckout("personal")}
                    className="w-full"
                    size="lg"
                    disabled={isCheckingOut}
                  >
                    {isCheckingOut
                      ? "Processing..."
                      : `Checkout Personal Cart • $${(state.personalTotal * 1.08).toFixed(2)}`}
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Shared Household Cart */}
        <TabsContent value="shared" className="space-y-4">
          {sharedItems.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Household cart is empty</h3>
                <p className="text-gray-600">Items shared with your household will appear here</p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Household Members */}
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-blue-800">Household Members</p>
                      <div className="flex space-x-2 mt-2">
                        {householdMembers.map((member) => (
                          <Badge key={member.id} variant="secondary" className={member.color}>
                            <span className="mr-1">{member.avatar}</span>
                            {member.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-blue-600">Real-time sync active</p>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mt-1 ml-auto"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Shared Discounts */}
              {sharedDiscounts.length > 0 && (
                <Card className="bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2 text-orange-800">
                      <Percent className="h-5 w-5" />
                      <span>Active Household Discounts</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {sharedDiscounts.map((discount, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                        <div>
                          <p className="font-medium text-sm">{discount.item}</p>
                          <p className="text-xs text-gray-600">{discount.reason}</p>
                        </div>
                        <Badge className="bg-orange-100 text-orange-800">{discount.discount}% off</Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Household Cart Items</CardTitle>
                  <CardDescription>Shared items from all household members</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {sharedItems.map((item, index) => {
                    const memberInfo = getMemberInfo(item.addedBy || "You")
                    const discount = sharedDiscounts.find((d) => d.item === item.name)
                    const discountedPrice = discount ? item.price * (1 - discount.discount / 100) : item.price

                    return (
                      <div key={item.id}>
                        <div className="flex items-start space-x-4">
                          <div className="text-3xl">{item.image}</div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-medium">{item.name}</h3>
                              {discount && (
                                <Badge className="bg-orange-100 text-orange-800 text-xs">
                                  {discount.discount}% off
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{item.category}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="secondary" className={memberInfo.color}>
                                <span className="mr-1">{memberInfo.avatar}</span>
                                Added by {item.addedBy}
                              </Badge>
                              <Badge className={getStatusColor(item.status)}>
                                {getStatusIcon(item.status)}
                                <span className="ml-1 capitalize">{item.status || "pending"}</span>
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                              {discount ? (
                                <div className="flex items-center space-x-1">
                                  <span className="text-sm text-gray-500 line-through">${item.price.toFixed(2)}</span>
                                  <span className="text-sm font-medium text-green-600">
                                    ${discountedPrice.toFixed(2)} each
                                  </span>
                                </div>
                              ) : (
                                <span className="text-sm font-medium text-green-600">
                                  ${item.price.toFixed(2)} each
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateSharedQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateSharedQuantity(item.id, item.quantity + 1)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">${(discountedPrice * item.quantity).toFixed(2)}</p>
                            <div className="flex space-x-1 mt-1">
                              {item.status === "pending" && (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => claimSharedItem(item.id, "You")}
                                    className="text-green-600 hover:text-green-700 h-6 px-2"
                                  >
                                    <CheckCircle className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => splitSharedItem(item.id)}
                                    className="text-blue-600 hover:text-blue-700 h-6 px-2"
                                  >
                                    <Split className="h-3 w-3" />
                                  </Button>
                                </>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => moveToPersonalCart(item.id)}
                                className="text-purple-600 hover:text-purple-700 h-6 px-2"
                              >
                                <ArrowRightLeft className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromSharedCart(item.id)}
                                className="text-red-600 hover:text-red-700 h-6 px-2"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        {index < sharedItems.length - 1 && <Separator className="mt-4" />}
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              {/* Shared Cart Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Household Cart Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal ({sharedItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                    <span>${state.sharedTotal.toFixed(2)}</span>
                  </div>
                  {sharedDiscountAmount > 0 && (
                    <div className="flex justify-between text-orange-600">
                      <span>Household Discounts</span>
                      <span>-${sharedDiscountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${((state.sharedTotal - sharedDiscountAmount) * 0.08).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>${((state.sharedTotal - sharedDiscountAmount) * 1.08).toFixed(2)}</span>
                  </div>
                  <Button
                    onClick={() => handleCheckout("shared")}
                    className="w-full"
                    size="lg"
                    disabled={isCheckingOut}
                  >
                    {isCheckingOut
                      ? "Processing..."
                      : `Checkout Household Cart • $${((state.sharedTotal - sharedDiscountAmount) * 1.08).toFixed(2)}`}
                  </Button>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Combined Checkout */}
      {personalItems.length > 0 && sharedItems.length > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-blue-800">Checkout Both Carts Together</p>
                <p className="text-sm text-blue-600">
                  Combined total: ${((state.totalPrice - sharedDiscountAmount) * 1.08).toFixed(2)}
                </p>
              </div>
              <Button
                onClick={() => handleCheckout("both")}
                disabled={isCheckingOut}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                {isCheckingOut ? "Processing..." : "Checkout Both Carts"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
