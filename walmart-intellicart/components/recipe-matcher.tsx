"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"

interface RecipeMatcherProps {
  inventory: string[]
}

interface IngredientMatch {
  name: string
  available: boolean
  quantity?: string
}

export function RecipeMatcher({ inventory }: RecipeMatcherProps) {
  const { toast } = useToast()
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [ingredients, setIngredients] = useState<IngredientMatch[]>([])
  const [matched, setMatched] = useState(false)

  const handleMatchRecipe = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!youtubeUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a YouTube URL",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    setMatched(false)
    setIngredients([])

    try {
      const response = await fetch("/api/recipes/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          youtubeUrl: youtubeUrl.trim(),
          inventory,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Recipe matching failed")
      }

      // Process ingredients and match with inventory
      const processedIngredients = data.ingredients_required.map((ingredient: string) => {
        const available = inventory.some(item => 
          item.toLowerCase().includes(ingredient.toLowerCase()) ||
          ingredient.toLowerCase().includes(item.toLowerCase())
        )
        
        return {
          name: ingredient,
          available,
        }
      })

      setIngredients(processedIngredients)
      setMatched(true)

      toast({
        title: "Success!",
        description: "Recipe ingredients analyzed successfully",
      })
    } catch (error) {
      console.error("Recipe matching error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Recipe matching failed",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const availableCount = ingredients.filter(ing => ing.available).length
  const totalCount = ingredients.length

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          Recipe Ingredient Matcher
        </CardTitle>
        <CardDescription>
          Enter a YouTube recipe URL to check which ingredients you already have
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleMatchRecipe} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="youtube-url">YouTube Recipe URL</Label>
            <Input
              id="youtube-url"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Analyzing Recipe...
              </>
            ) : (
              "Match Ingredients"
            )}
          </Button>
        </form>

        {matched && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium">Ingredient Match Summary</span>
              <span className="text-sm text-gray-600">
                {availableCount} of {totalCount} ingredients available
              </span>
            </div>

            <div className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    ingredient.available
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <span className="font-medium">{ingredient.name}</span>
                  <div className="flex items-center gap-2">
                    {ingredient.available ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-600">Available</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-600" />
                        <span className="text-sm text-red-600">Need to buy</span>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {availableCount > 0 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  Great! You have {availableCount} ingredient{availableCount !== 1 ? 's' : ''} already. 
                  You only need to buy {totalCount - availableCount} more item{totalCount - availableCount !== 1 ? 's' : ''} to make this recipe.
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 