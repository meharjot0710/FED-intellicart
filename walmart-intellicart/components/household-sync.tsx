"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Check, Clock, DollarSign, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"

interface ListItem {
  id: string
  name: string
  addedBy: string
  status: "pending" | "approved" | "claimed"
  price?: number
  avatar?: string
}

export function HouseholdSync() {
  const [sharedList, setSharedList] = useState<ListItem[]>([
    { id: "1", name: "Organic Milk", addedBy: "You", status: "approved", price: 4.99 },
    { id: "2", name: "Whole Grain Bread", addedBy: "Alex", status: "pending", price: 3.49 },
    { id: "3", name: "Greek Yogurt", addedBy: "Sam", status: "claimed", price: 5.99 },
    { id: "4", name: "Bananas", addedBy: "You", status: "approved", price: 2.99 },
    { id: "5", name: "Chicken Breast", addedBy: "Alex", status: "pending", price: 8.99 },
  ])
  const [newItem, setNewItem] = useState("")

  const householdMembers = [
    { name: "You", avatar: "👤", color: "bg-blue-100 text-blue-800" },
    { name: "Alex", avatar: "👨", color: "bg-green-100 text-green-800" },
    { name: "Sam", avatar: "👩", color: "bg-purple-100 text-purple-800" },
  ]

  const updateItemStatus = (id: string, status: "pending" | "approved" | "claimed") => {
    setSharedList((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)))
    console.log("Analytics: Item status updated", { id, status })
  }

  const addNewItem = () => {
    if (!newItem.trim()) return

    const item: ListItem = {
      id: Date.now().toString(),
      name: newItem,
      addedBy: "You",
      status: "pending",
      price: Math.random() * 10 + 1, // Random price for demo
    }

    setSharedList((prev) => [...prev, item])
    setNewItem("")
    console.log("Analytics: New item added to shared list", item.name)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800"
      case "claimed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-yellow-100 text-yellow-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <Check className="h-3 w-3" />
      case "claimed":
        return <DollarSign className="h-3 w-3" />
      default:
        return <Clock className="h-3 w-3" />
    }
  }

  const totalCost = sharedList.reduce((sum, item) => sum + (item.price || 0), 0)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Users className="h-4 w-4 mr-2 text-blue-500" />
              Household Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              {householdMembers.map((member) => (
                <div key={member.name} className="text-center">
                  <div className="text-2xl mb-1">{member.avatar}</div>
                  <Badge variant="secondary" className={member.color}>
                    {member.name}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{sharedList.length}</p>
            <p className="text-xs text-gray-600">items in shared list</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Estimated Cost</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">${totalCost.toFixed(2)}</p>
            <p className="text-xs text-gray-600">total estimated</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shared Grocery List</CardTitle>
          <CardDescription>Real-time collaboration with your household members</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            <Input
              placeholder="Add new item to shared list..."
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addNewItem()}
              className="flex-1"
            />
            <Button onClick={addNewItem} disabled={!newItem.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {sharedList.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-lg">{item.addedBy === "You" ? "👤" : item.addedBy === "Alex" ? "👨" : "👩"}</div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-600">Added by {item.addedBy}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="font-medium">${item.price?.toFixed(2)}</span>
                  <Badge className={getStatusColor(item.status)}>
                    {getStatusIcon(item.status)}
                    <span className="ml-1 capitalize">{item.status}</span>
                  </Badge>

                  {item.status === "pending" && (
                    <div className="flex space-x-1">
                      <Button size="sm" variant="outline" onClick={() => updateItemStatus(item.id, "approved")}>
                        Approve
                      </Button>
                      <Button size="sm" onClick={() => updateItemStatus(item.id, "claimed")}>
                        Claim
                      </Button>
                    </div>
                  )}

                  {item.status === "approved" && (
                    <Button size="sm" onClick={() => updateItemStatus(item.id, "claimed")}>
                      Claim
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
