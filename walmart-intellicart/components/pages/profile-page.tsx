"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Settings,
  CreditCard,
  MapPin,
  Bell,
  HelpCircle,
  LogOut,
  ShoppingBag,
  Clock,
  TrendingUp,
} from "lucide-react"

export function ProfilePage() {
    const [user, setuser] = useState<any>()
    useEffect(() => {
      const userStr = localStorage.getItem("intellicart-user")
      setuser(userStr ? JSON.parse(userStr) : null)
    }, [])
  return (
    <div className="p-4 space-y-6 pb-20">
      {/* Header */}
      <div className="text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User className="h-10 w-10 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
        <p className="text-gray-600">{user?.email}</p>
        <Badge className="mt-2 bg-yellow-100 text-yellow-800">Walmart+ Member</Badge>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <ShoppingBag className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <p className="text-lg font-bold text-green-600">47</p>
            <p className="text-xs text-gray-600">Orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-blue-500 mx-auto mb-2" />
            <p className="text-lg font-bold text-blue-600">$342</p>
            <p className="text-xs text-gray-600">Saved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-purple-500 mx-auto mb-2" />
            <p className="text-lg font-bold text-purple-600">12h</p>
            <p className="text-xs text-gray-600">Time Saved</p>
          </CardContent>
        </Card>
      </div>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-gray-500" />
              <span>Personal Information</span>
            </div>
            <Button variant="ghost" size="sm">
              Edit
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-5 w-5 text-gray-500" />
              <span>Payment Methods</span>
            </div>
            <Button variant="ghost" size="sm">
              Manage
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-500" />
              <span>Delivery Addresses</span>
            </div>
            <Button variant="ghost" size="sm">
              Edit
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bell className="h-5 w-5 text-gray-500" />
              <span>Notifications</span>
            </div>
            <Button variant="ghost" size="sm">
              Settings
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Shopping Preferences</CardTitle>
          <CardDescription>Customize your shopping experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Smart Recommendations</span>
            <Badge variant="secondary">Enabled</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span>Auto-Reorder</span>
            <Badge variant="secondary">Weekly</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span>Dietary Preferences</span>
            <Badge variant="secondary">Vegetarian</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span>Store Location</span>
            <Badge variant="secondary">Main St Store</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <Card>
        <CardHeader>
          <CardTitle>Support & Help</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="ghost" className="w-full justify-start">
            <HelpCircle className="h-5 w-5 mr-3" />
            Help Center
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="h-5 w-5 mr-3" />
            App Settings
          </Button>
          <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700">
            <LogOut className="h-5 w-5 mr-3" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

