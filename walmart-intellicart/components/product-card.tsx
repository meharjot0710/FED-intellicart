"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, ChevronDown, User, Users } from "lucide-react"

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  tags?: string[]
  rating?: number
  inStock?: boolean
  storeSection?: string
}

interface ProductCardProps {
  product: Product
  onAddToCart: () => void
  onAddToSharedCart?: (addedBy: string) => void
  showAddButton?: boolean
  compact?: boolean
  buttonText?: string
}

export function ProductCard({
  product,
  onAddToCart,
  onAddToSharedCart,
  showAddButton = false,
  compact = false,
  buttonText = "Add to Cart",
}: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToPersonal = () => {
    setIsAdding(true)
    onAddToCart()
    setTimeout(() => setIsAdding(false), 500)
  }

  const handleAddToShared = () => {
    setIsAdding(true)
    onAddToSharedCart?.("You")
    setTimeout(() => setIsAdding(false), 500)
  }

  return (
    <Card
      className={`hover:shadow-md transition-all duration-200 ${compact ? "h-auto" : "h-full"} ${isAdding ? "scale-105 shadow-lg" : ""}`}
    >
      <CardContent className={compact ? "p-3" : "p-4"}>
        <div className="text-center mb-3">
          <div className={`text-${compact ? "3xl" : "4xl"} mb-2`}>{product.image}</div>
          <h3 className={`font-medium ${compact ? "text-sm" : "text-base"} mb-1`}>{product.name}</h3>
          <p className={`text-gray-600 ${compact ? "text-xs" : "text-sm"} mb-2`}>{product.category}</p>
        </div>

        {product.tags && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.slice(0, compact ? 2 : 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className={`font-bold ${compact ? "text-base" : "text-lg"}`}>${product.price.toFixed(2)}</span>
          {showAddButton && (
            <div className="flex items-center space-x-1">
              {/* Default Add to Personal Cart */}
              <Button
                size={compact ? "sm" : "default"}
                onClick={handleAddToPersonal}
                disabled={isAdding}
                className="flex items-center space-x-1"
              >
                <Plus className="h-3 w-3" />
                <span className={compact ? "text-xs" : "text-sm"}>
                  {isAdding ? "Adding..." : compact ? "Add" : buttonText}
                </span>
              </Button>

              {/* Dropdown for cart selection */}
              {onAddToSharedCart && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size={compact ? "sm" : "default"}
                      className="px-2 bg-transparent"
                      disabled={isAdding}
                    >
                      <ChevronDown className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleAddToPersonal}>
                      <User className="h-4 w-4 mr-2" />
                      Add to Personal Cart
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleAddToShared}>
                      <Users className="h-4 w-4 mr-2" />
                      Add to Household Cart
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}
        </div>

        {product.rating && (
          <div className="mt-2 flex items-center justify-center">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < Math.floor(product.rating!) ? "text-yellow-400" : "text-gray-300"}>
                  ⭐
                </span>
              ))}
            </div>
            <span className="ml-1 text-xs text-gray-600">({product.rating})</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
