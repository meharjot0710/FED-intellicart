"use client"

import { useState } from "react"
import { BottomNavigation } from "@/components/navigation/bottom-navigation"
import { HomePage } from "@/components/pages/home-page"
import { ListsPage } from "@/components/pages/lists-page"
import { RecipesPage } from "@/components/pages/recipes-page"
import { StorePage } from "@/components/pages/store-page"
import { CartPage } from "@/components/pages/cart-page"
import { ProfilePage } from "@/components/pages/profile-page"
import { CartProvider } from "@/components/context/cart-context"

export function MainApp() {
  const [activeTab, setActiveTab] = useState("home")

  const renderPage = () => {
    switch (activeTab) {
      case "home":
        return <HomePage />
      case "lists":
        return <ListsPage />
      // case "recipes":
      //   return <RecipesPage />
      // case "store":
      //   return <StorePage />
      case "cart":
        return <CartPage />
      case "profile":
        return <ProfilePage />
      default:
        return <HomePage />
    }
  }

  return (
    <CartProvider>
      <div className="min-h-screen bg-gray-50">
        {renderPage()}
        <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </CartProvider>
  )
}
