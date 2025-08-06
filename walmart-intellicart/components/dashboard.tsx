"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SmartPlanner } from "./smart-planner"
import { AIAssistant } from "./ai-assistant"
import { HouseholdSync } from "./household-sync"
import { AutoReorder } from "./auto-reorder"
import { InStoreNavigation } from "./in-store-navigation"
import { Header } from "./header"
import { ShoppingCart, Brain, Users, RotateCcw, MapPin } from "lucide-react"

export function Dashboard() {
  const [activeTab, setActiveTab] = useState("planner")

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="planner" className="flex items-center space-x-2">
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline">Planner</span>
            </TabsTrigger>
            <TabsTrigger value="assistant" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span className="hidden sm:inline">AI Assistant</span>
            </TabsTrigger>
            <TabsTrigger value="household" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Household</span>
            </TabsTrigger>
            <TabsTrigger value="reorder" className="flex items-center space-x-2">
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Auto-Order</span>
            </TabsTrigger>
            <TabsTrigger value="navigation" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span className="hidden sm:inline">Navigate</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="planner">
            <SmartPlanner />
          </TabsContent>

          <TabsContent value="assistant">
            <AIAssistant />
          </TabsContent>

          <TabsContent value="household">
            <HouseholdSync />
          </TabsContent>

          <TabsContent value="reorder">
            <AutoReorder />
          </TabsContent>

          <TabsContent value="navigation">
            <InStoreNavigation />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
