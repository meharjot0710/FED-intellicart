"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Send, Sparkles, MessageCircle } from "lucide-react"
import { ProductCard } from "./product-card"
import { searchProducts } from "@/lib/mock-data"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  products?: any[]
}

export function AIAssistant() {
  const [query, setQuery] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "Hi! I'm your AI grocery assistant. Try asking me things like 'I need cereal' or 'Show me healthy snacks'!",
    },
  ])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: query,
    }

    setMessages((prev) => [...prev, userMessage])
    setLoading(true)
    setQuery("")

    // Simulate AI processing
    setTimeout(() => {
      const products = searchProducts(query)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: `I found ${products.length} items matching "${query}". Here are my top recommendations:`,
        products: products.slice(0, 5),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setLoading(false)
      console.log("Analytics: AI query processed", query)
    }, 1000)
  }

  const addToList = (product: any) => {
    console.log("Analytics: Added to list from AI", product.name)
    // Simulate adding to list
  }

  const quickQueries = [
    "I need cereal",
    "Show me healthy snacks",
    "Breakfast items",
    "Dairy products",
    "Organic vegetables",
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <span>AI Grocery Assistant</span>
          </CardTitle>
          <CardDescription>Ask me anything about groceries and I'll help you find what you need!</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <Input
              placeholder="Type your grocery request..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
              disabled={loading}
            />
            <Button type="submit" disabled={loading || !query.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>

          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Try these quick queries:</p>
            <div className="flex flex-wrap gap-2">
              {quickQueries.map((quickQuery) => (
                <Badge
                  key={quickQuery}
                  variant="secondary"
                  className="cursor-pointer hover:bg-blue-100"
                  onClick={() => setQuery(quickQuery)}
                >
                  {quickQuery}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {messages.map((message) => (
          <Card key={message.id} className={message.type === "user" ? "ml-12" : "mr-12"}>
            <CardContent className="pt-4">
              <div className="flex items-start space-x-2">
                <div className={`p-2 rounded-full ${message.type === "user" ? "bg-blue-100" : "bg-purple-100"}`}>
                  {message.type === "user" ? (
                    <MessageCircle className="h-4 w-4 text-blue-600" />
                  ) : (
                    <Sparkles className="h-4 w-4 text-purple-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm">{message.content}</p>
                  {message.products && (
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {message.products.map((product) => (
                        <ProductCard
                          key={product.id}
                          product={product}
                          onAddToCart={() => addToList(product)}
                          showAddButton={true}
                          compact={true}
                          buttonText="Add to List"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {loading && (
          <Card className="mr-12">
            <CardContent className="pt-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-full bg-purple-100">
                  <Sparkles className="h-4 w-4 text-purple-600 animate-pulse" />
                </div>
                <p className="text-sm text-gray-600">AI is thinking...</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
