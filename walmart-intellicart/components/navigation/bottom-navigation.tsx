"use client"

import { Home, List, ChefHat, MapPin, ShoppingCart, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/context/cart-context"

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export function BottomNavigation({ activeTab, onTabChange }: BottomNavigationProps) {
  const { totalItems } = useCart()

  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "lists", label: "Lists", icon: List },
    { id: "recipes", label: "Recipes", icon: ChefHat },
    { id: "store", label: "Store", icon: MapPin },
    { id: "cart", label: "Cart", icon: ShoppingCart, badge: totalItems },
    { id: "profile", label: "Profile", icon: User },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 safe-area-pb shadow-lg">
      <div className="flex justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center space-y-1 px-2 py-2 rounded-lg transition-all duration-200 relative ${
                isActive ? "text-blue-600 bg-blue-50 scale-105" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <div className="relative">
                <Icon className={`h-5 w-5 ${isActive ? "scale-110" : ""} transition-transform`} />
                {tab.badge && tab.badge > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs font-bold bg-red-500 hover:bg-red-500"
                  >
                    {tab.badge > 99 ? "99+" : tab.badge}
                  </Badge>
                )}
              </div>
              <span className={`text-xs font-medium ${isActive ? "font-semibold" : ""}`}>{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
