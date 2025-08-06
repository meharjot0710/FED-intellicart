"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Search, ShoppingCart, Clock, CheckCircle, Trash2, Users } from "lucide-react"
import { useCart } from "@/components/context/cart-context"

interface ListItem {
  id: string
  name: string
  category: string
  price: number
  image: string
  completed: boolean
  storeSection?: string
}

interface ShoppingList {
  id: string
  name: string
  items: ListItem[]
  createdAt: string
  estimatedTotal: number
  type: "personal" | "shared"
}

export function ListsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [newItemName, setNewItemName] = useState("")
  const { addItem } = useCart()

  // Removed Party Supplies - Focus on regular groceries only
  const [lists, setLists] = useState<ShoppingList[]>([
    {
      id: "1",
      name: "Weekly Groceries",
      type: "personal",
      createdAt: "2024-01-15",
      estimatedTotal: 67.89,
      items: [
        {
          id: "1",
          name: "Organic Bananas",
          category: "Produce",
          price: 2.48,
          image: "🍌",
          completed: false,
          storeSection: "Produce",
        },
        {
          id: "2",
          name: "Greek Yogurt",
          category: "Dairy",
          price: 5.99,
          image: "🥛",
          completed: true,
          storeSection: "Dairy",
        },
        {
          id: "3",
          name: "Chicken Breast",
          category: "Meat",
          price: 8.99,
          image: "🍗",
          completed: false,
          storeSection: "Meat & Seafood",
        },
        {
          id: "4",
          name: "Whole Grain Bread",
          category: "Bakery",
          price: 3.49,
          image: "🍞",
          completed: false,
          storeSection: "Bakery",
        },
        {
          id: "5",
          name: "Frozen Berries",
          category: "Frozen",
          price: 4.99,
          image: "🫐",
          completed: false,
          storeSection: "Frozen",
        },
        {
          id: "6",
          name: "Olive Oil",
          category: "Pantry",
          price: 6.99,
          image: "🫒",
          completed: false,
          storeSection: "Pantry",
        },
        {
          id: "7",
          name: "Baby Spinach",
          category: "Produce",
          price: 3.99,
          image: "🥬",
          completed: false,
          storeSection: "Produce",
        },
        {
          id: "8",
          name: "Cheddar Cheese",
          category: "Dairy",
          price: 4.49,
          image: "🧀",
          completed: true,
          storeSection: "Dairy",
        },
      ],
    },
    {
      id: "2",
      name: "Household Essentials",
      type: "shared",
      createdAt: "2024-01-14",
      estimatedTotal: 34.56,
      items: [
        {
          id: "9",
          name: "Paper Towels",
          category: "Pantry",
          price: 8.99,
          image: "🧻",
          completed: false,
          storeSection: "Pantry",
        },
        {
          id: "10",
          name: "Laundry Detergent",
          category: "Pantry",
          price: 12.99,
          image: "🧴",
          completed: false,
          storeSection: "Pantry",
        },
        {
          id: "11",
          name: "Dish Soap",
          category: "Pantry",
          price: 3.99,
          image: "🧽",
          completed: true,
          storeSection: "Pantry",
        },
        {
          id: "12",
          name: "Toilet Paper",
          category: "Pantry",
          price: 8.59,
          image: "🧻",
          completed: false,
          storeSection: "Pantry",
        },
      ],
    },
  ])

  const [activeListId, setActiveListId] = useState("1")
  const activeList = lists.find((list) => list.id === activeListId)

  const toggleItemCompletion = (listId: string, itemId: string) => {
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? {
              ...list,
              items: list.items.map((item) => (item.id === itemId ? { ...item, completed: !item.completed } : item)),
            }
          : list,
      ),
    )
    console.log("Analytics: List item toggled", { listId, itemId })
  }

  const addItemToList = (listId: string) => {
    if (!newItemName.trim()) return

    const newItem: ListItem = {
      id: Date.now().toString(),
      name: newItemName,
      category: "General",
      price: 0,
      image: "📦",
      completed: false,
      storeSection: "General",
    }

    setLists((prev) => prev.map((list) => (list.id === listId ? { ...list, items: [...list.items, newItem] } : list)))

    setNewItemName("")
    console.log("Analytics: Item added to list", newItem.name)
  }

  const removeItemFromList = (listId: string, itemId: string) => {
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId ? { ...list, items: list.items.filter((item) => item.id !== itemId) } : list,
      ),
    )
    console.log("Analytics: Item removed from list", { listId, itemId })
  }

  const addListItemToCart = (item: ListItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      storeSection: item.storeSection,
    })
    console.log("Analytics: List item added to cart", item.name)
  }

  const addAllItemsToCart = () => {
    if (!activeList) return

    const uncompletedItems = activeList.items.filter((item) => !item.completed)
    uncompletedItems.forEach((item) => {
      addListItemToCart(item)
    })
    console.log("Analytics: All list items added to cart", uncompletedItems.length)
  }

  const completedItems = activeList?.items.filter((item) => item.completed).length || 0
  const totalItems = activeList?.items.length || 0
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0

  return (
    <div className="p-4 space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Smart Lists</h1>
          <p className="text-gray-600">Organize your grocery shopping efficiently</p>
        </div>
        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New List
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search lists and items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* List Tabs */}
      <div className="flex space-x-2 overflow-x-auto">
        {lists.map((list) => (
          <Button
            key={list.id}
            variant={activeListId === list.id ? "default" : "outline"}
            onClick={() => setActiveListId(list.id)}
            className="whitespace-nowrap flex items-center space-x-2"
          >
            <span>{list.name}</span>
            {list.type === "shared" && <Users className="h-3 w-3" />}
            <Badge variant="secondary" className="ml-1">
              {list.items.length}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Active List */}
      {activeList && (
        <div className="space-y-4">
          {/* List Header */}
          <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2">
                    <span>{activeList.name}</span>
                    {activeList.type === "shared" && (
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        <Users className="h-3 w-3 mr-1" />
                        Shared
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {completedItems} of {totalItems} items completed • Est. ${activeList.estimatedTotal.toFixed(2)}
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={addAllItemsToCart} size="sm" className="bg-green-600 hover:bg-green-700">
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Add All to Cart
                  </Button>
                </div>
              </div>
              {totalItems > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </CardHeader>
          </Card>

          {/* Add New Item */}
          <Card>
            <CardContent className="p-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Add new item to list..."
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addItemToList(activeList.id)}
                  className="flex-1"
                />
                <Button onClick={() => addItemToList(activeList.id)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* List Items */}
          <Card>
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeList.items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center space-x-3 p-4 border rounded-lg transition-all duration-200 ${
                    item.completed
                      ? "bg-gradient-to-r from-green-50 to-blue-50 border-green-200"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <Checkbox
                    checked={item.completed}
                    onCheckedChange={() => toggleItemCompletion(activeList.id, item.id)}
                  />
                  <div className="text-2xl">{item.image}</div>
                  <div className="flex-1">
                    <h3 className={`font-medium ${item.completed ? "line-through text-gray-500" : ""}`}>{item.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>{item.category}</span>
                      {item.storeSection && (
                        <>
                          <span>•</span>
                          <span>{item.storeSection}</span>
                        </>
                      )}
                    </div>
                    {item.price > 0 && <p className="text-sm font-medium text-green-600">${item.price.toFixed(2)}</p>}
                  </div>
                  <div className="flex items-center space-x-2">
                    {!item.completed && (
                      <Button size="sm" variant="outline" onClick={() => addListItemToCart(item)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeItemFromList(activeList.id, item.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}

              {activeList.items.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <h3 className="text-lg font-medium mb-2">No items yet</h3>
                  <p className="text-gray-600">Add some items to get started with your list</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Enhanced Quick Actions */}
          {activeList.items.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                    <Clock className="h-4 w-4" />
                    <span>Schedule Pickup</span>
                  </Button>
                  <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                    <CheckCircle className="h-4 w-4" />
                    <span>Mark All Done</span>
                  </Button>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-800 mb-2">💡 Smart Shopping Tip</h4>
                  <p className="text-sm text-blue-600">
                    Add all items to your cart to get an AI-optimized store route that saves time and avoids crowds!
                  </p>
                </div>

                {/* List Statistics */}
                <div className="grid grid-cols-3 gap-4 pt-3 border-t">
                  <div className="text-center">
                    <p className="text-lg font-bold text-blue-600">{totalItems}</p>
                    <p className="text-xs text-gray-600">Total Items</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-600">{completedItems}</p>
                    <p className="text-xs text-gray-600">Completed</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-orange-600">${activeList.estimatedTotal.toFixed(2)}</p>
                    <p className="text-xs text-gray-600">Est. Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
