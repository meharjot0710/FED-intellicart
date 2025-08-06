"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Youtube, Plus, ShoppingCart, Clock, Users, Heart, Trash2, Play, ChefHat, LinkIcon } from "lucide-react"
import { useCart } from "@/components/context/cart-context"

interface ParsedIngredient {
  id: string
  name: string
  quantity: string
  category: string
  price: number
  image: string
  storeSection: string
}

interface ParsedRecipe {
  id: string
  title: string
  channel: string
  duration: string
  thumbnail: string
  ingredients: ParsedIngredient[]
  videoUrl: string
  parsedAt: string
}

interface SavedRecipe {
  id: string
  title: string
  channel: string
  thumbnail: string
  ingredients: ParsedIngredient[]
  videoUrl: string
  savedAt: string
  isFavorite: boolean
  servings: number
  cookTime: number
}

export function RecipesPage() {
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [isParsingRecipe, setIsParsingRecipe] = useState(false)
  const [parsedRecipe, setParsedRecipe] = useState<ParsedRecipe | null>(null)
  const { addItem } = useCart()

  // Mock saved recipes data
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([
    {
      id: "1",
      title: "15-Minute Healthy Chicken Bowl",
      channel: "Tasty",
      thumbnail: "🍲",
      servings: 4,
      cookTime: 15,
      videoUrl: "https://youtube.com/watch?v=example1",
      savedAt: "2024-01-15",
      isFavorite: true,
      ingredients: [
        {
          id: "1",
          name: "Chicken Breast",
          quantity: "1 lb",
          category: "Meat",
          price: 8.99,
          image: "🍗",
          storeSection: "Meat & Seafood",
        },
        {
          id: "2",
          name: "Brown Rice",
          quantity: "1 cup",
          category: "Pantry",
          price: 2.49,
          image: "🍚",
          storeSection: "Pantry",
        },
        {
          id: "3",
          name: "Broccoli",
          quantity: "2 cups",
          category: "Produce",
          price: 3.99,
          image: "🥦",
          storeSection: "Produce",
        },
      ],
    },
    {
      id: "2",
      title: "Quick Vegetarian Pasta",
      channel: "Jamie Oliver",
      thumbnail: "🍝",
      servings: 3,
      cookTime: 20,
      videoUrl: "https://youtube.com/watch?v=example2",
      savedAt: "2024-01-14",
      isFavorite: false,
      ingredients: [
        {
          id: "4",
          name: "Pasta",
          quantity: "12 oz",
          category: "Pantry",
          price: 1.99,
          image: "🍝",
          storeSection: "Pantry",
        },
        {
          id: "5",
          name: "Cherry Tomatoes",
          quantity: "1 pint",
          category: "Produce",
          price: 2.99,
          image: "🍅",
          storeSection: "Produce",
        },
        {
          id: "6",
          name: "Fresh Basil",
          quantity: "1 bunch",
          category: "Produce",
          price: 2.49,
          image: "🌿",
          storeSection: "Produce",
        },
      ],
    },
    {
      id: "3",
      title: "Protein Smoothie Bowl",
      channel: "FitnessBlendr",
      thumbnail: "🥣",
      servings: 2,
      cookTime: 10,
      videoUrl: "https://youtube.com/watch?v=example3",
      savedAt: "2024-01-13",
      isFavorite: true,
      ingredients: [
        {
          id: "7",
          name: "Frozen Berries",
          quantity: "1 cup",
          category: "Frozen",
          price: 4.99,
          image: "🫐",
          storeSection: "Frozen",
        },
        {
          id: "8",
          name: "Protein Powder",
          quantity: "1 scoop",
          category: "Pantry",
          price: 24.99,
          image: "🥤",
          storeSection: "Pantry",
        },
        {
          id: "9",
          name: "Almond Milk",
          quantity: "1 cup",
          category: "Dairy",
          price: 3.99,
          image: "🥛",
          storeSection: "Dairy",
        },
      ],
    },
  ])

  const handleParseRecipe = async () => {
    if (!youtubeUrl.trim()) return

    setIsParsingRecipe(true)
    
    await new Promise((resolve) => setTimeout(resolve, 3000))



    // Mock parsed recipe data
    const mockParsedRecipe: ParsedRecipe = {
      id: Date.now().toString(),
      title: "Gordon Ramsay's Perfect Scrambled Eggs",
      channel: "Gordon Ramsay",
      duration: "4:32",
      thumbnail: "🍳",
      videoUrl: youtubeUrl,
      parsedAt: new Date().toISOString(),
      ingredients: [
        {
          id: "p1",
          name: "Large Eggs",
          quantity: "6 eggs",
          category: "Dairy",
          price: 2.99,
          image: "🥚",
          storeSection: "Dairy",
        },
        {
          id: "p2",
          name: "Butter",
          quantity: "2 tbsp",
          category: "Dairy",
          price: 4.49,
          image: "🧈",
          storeSection: "Dairy",
        },
        {
          id: "p3",
          name: "Heavy Cream",
          quantity: "2 tbsp",
          category: "Dairy",
          price: 3.99,
          image: "🥛",
          storeSection: "Dairy",
        },
        {
          id: "p4",
          name: "Chives",
          quantity: "1 bunch",
          category: "Produce",
          price: 1.99,
          image: "🌿",
          storeSection: "Produce",
        },
      ],
    }

    setParsedRecipe(mockParsedRecipe)
    setIsParsingRecipe(false)
    console.log("Analytics: Recipe parsed from YouTube", { url: youtubeUrl, title: mockParsedRecipe.title })
  }

  const addIngredientToCart = (ingredient: ParsedIngredient) => {
    addItem({
      id: ingredient.id,
      name: ingredient.name,
      price: ingredient.price,
      image: ingredient.image,
      category: ingredient.category,
      storeSection: ingredient.storeSection,
    })
    console.log("Analytics: Ingredient added to cart from recipe", ingredient.name)
  }

  const addAllIngredientsToCart = (ingredients: ParsedIngredient[]) => {
    ingredients.forEach((ingredient) => {
      addIngredientToCart(ingredient)
    })
    console.log("Analytics: All ingredients added to cart", ingredients.length)
  }

  const saveRecipe = (recipe: ParsedRecipe) => {
    const savedRecipe: SavedRecipe = {
      id: recipe.id,
      title: recipe.title,
      channel: recipe.channel,
      thumbnail: recipe.thumbnail,
      ingredients: recipe.ingredients,
      videoUrl: recipe.videoUrl,
      savedAt: new Date().toISOString(),
      isFavorite: false,
      servings: 4, // Default
      cookTime: 30, // Default
    }

    setSavedRecipes((prev) => [savedRecipe, ...prev])
    setParsedRecipe(null)
    setYoutubeUrl("")
    console.log("Analytics: Recipe saved", recipe.title)
  }

  const toggleFavorite = (recipeId: string) => {
    setSavedRecipes((prev) =>
      prev.map((recipe) => (recipe.id === recipeId ? { ...recipe, isFavorite: !recipe.isFavorite } : recipe)),
    )
  }

  const removeRecipe = (recipeId: string) => {
    setSavedRecipes((prev) => prev.filter((recipe) => recipe.id !== recipeId))
    console.log("Analytics: Recipe removed", recipeId)
  }

  const getTotalCost = (ingredients: ParsedIngredient[]) => {
    return ingredients.reduce((sum, ingredient) => sum + ingredient.price, 0)
  }

  return (
    <div className="p-4 space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recipe Hub</h1>
          <p className="text-gray-600">Parse YouTube recipes and manage your collection</p>
        </div>
        <Badge variant="secondary" className="bg-red-100 text-red-800">
          <Youtube className="h-3 w-3 mr-1" />
          YouTube Parser
        </Badge>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="parser" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="parser" className="flex items-center space-x-2">
            <Youtube className="h-4 w-4" />
            <span>YouTube Parser</span>
          </TabsTrigger>
          <TabsTrigger value="saved" className="flex items-center space-x-2">
            <ChefHat className="h-4 w-4" />
            <span>Saved Recipes ({savedRecipes.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* YouTube Recipe Parser */}
        <TabsContent value="parser" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Youtube className="h-5 w-5 text-red-500" />
                <span>YouTube Recipe Parser</span>
              </CardTitle>
              <CardDescription>
                Paste a YouTube cooking video link to automatically extract ingredients and add them to your cart
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Paste YouTube recipe video URL here..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="pl-10"
                    disabled={isParsingRecipe}
                  />
                </div>
                <Button onClick={handleParseRecipe} disabled={!youtubeUrl.trim() || isParsingRecipe}>
                  {isParsingRecipe ? "Parsing..." : "Parse Recipe"}
                </Button>
              </div>

              {isParsingRecipe && (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-sm text-gray-600">Analyzing video and extracting ingredients...</p>
                  </div>
                </div>
              )}

              {/* Sample YouTube URLs for demo */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">🎬 Try these sample YouTube recipe URLs:</h4>
                <div className="space-y-2">
                  {[
                    "https://youtube.com/watch?v=scrambled-eggs-gordon",
                    "https://youtube.com/watch?v=pasta-carbonara-tasty",
                    "https://youtube.com/watch?v=chicken-stir-fry-15min",
                  ].map((url, index) => (
                    <button
                      key={index}
                      onClick={() => setYoutubeUrl(url)}
                      className="block w-full text-left text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {url}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Parsed Recipe Results */}
          {parsedRecipe && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-4xl">{parsedRecipe.thumbnail}</div>
                    <div>
                      <CardTitle className="text-lg">{parsedRecipe.title}</CardTitle>
                      <CardDescription className="flex items-center space-x-2">
                        <span>by {parsedRecipe.channel}</span>
                        <span>•</span>
                        <span>{parsedRecipe.duration}</span>
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => window.open(parsedRecipe.videoUrl, "_blank")}>
                    <Play className="h-3 w-3 mr-1" />
                    Watch
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div>
                    <p className="font-medium">Extracted Ingredients</p>
                    <p className="text-sm text-gray-600">
                      {parsedRecipe.ingredients.length} items • Est. $
                      {getTotalCost(parsedRecipe.ingredients).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={() => addAllIngredientsToCart(parsedRecipe.ingredients)}>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add All to Cart
                    </Button>
                    <Button variant="outline" onClick={() => saveRecipe(parsedRecipe)}>
                      Save Recipe
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {parsedRecipe.ingredients.map((ingredient) => (
                    <div key={ingredient.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">{ingredient.image}</div>
                        <div>
                          <h4 className="font-medium">{ingredient.name}</h4>
                          <p className="text-sm text-gray-600">
                            {ingredient.quantity} • ${ingredient.price.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => addIngredientToCart(ingredient)}>
                        <Plus className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Saved Recipes */}
        <TabsContent value="saved" className="space-y-4">
          {savedRecipes.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <ChefHat className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Saved Recipes</h3>
                <p className="text-gray-600 mb-4">Parse YouTube recipes to start building your collection</p>
                <Button variant="outline">
                  <Youtube className="h-4 w-4 mr-2" />
                  Parse Your First Recipe
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Favorites Section */}
              {savedRecipes.some((recipe) => recipe.isFavorite) && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <Heart className="h-5 w-5 text-red-500 mr-2" />
                    Favorites
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {savedRecipes
                      .filter((recipe) => recipe.isFavorite)
                      .map((recipe) => (
                        <RecipeCard
                          key={recipe.id}
                          recipe={recipe}
                          onToggleFavorite={toggleFavorite}
                          onRemove={removeRecipe}
                          onAddAllToCart={addAllIngredientsToCart}
                          onAddIngredient={addIngredientToCart}
                        />
                      ))}
                  </div>
                  <Separator className="my-6" />
                </div>
              )}

              {/* All Recipes */}
              <div>
                <h3 className="text-lg font-semibold mb-3">All Recipes</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onToggleFavorite={toggleFavorite}
                      onRemove={removeRecipe}
                      onAddAllToCart={addAllIngredientsToCart}
                      onAddIngredient={addIngredientToCart}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Recipe Card Component
function RecipeCard({
  recipe,
  onToggleFavorite,
  onRemove,
  onAddAllToCart,
  onAddIngredient,
}: {
  recipe: SavedRecipe
  onToggleFavorite: (id: string) => void
  onRemove: (id: string) => void
  onAddAllToCart: (ingredients: ParsedIngredient[]) => void
  onAddIngredient: (ingredient: ParsedIngredient) => void
}) {
  const [showIngredients, setShowIngredients] = useState(false)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{recipe.thumbnail}</div>
            <div className="flex-1">
              <h3 className="font-medium text-sm">{recipe.title}</h3>
              <p className="text-xs text-gray-600">{recipe.channel}</p>
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3 text-gray-500" />
                  <span className="text-xs text-gray-600">{recipe.cookTime} min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3 text-gray-500" />
                  <span className="text-xs text-gray-600">{recipe.servings}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button variant="ghost" size="sm" onClick={() => onToggleFavorite(recipe.id)} className="h-8 w-8 p-0">
              <Heart className={`h-4 w-4 ${recipe.isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onRemove(recipe.id)} className="h-8 w-8 p-0">
              <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-500" />
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-green-600">
            ${getTotalCost(recipe.ingredients).toFixed(2)} est.
          </span>
          <Badge variant="secondary" className="text-xs">
            {recipe.ingredients.length} ingredients
          </Badge>
        </div>

        <div className="flex space-x-2 mb-3">
          <Button size="sm" onClick={() => onAddAllToCart(recipe.ingredients)} className="flex-1">
            <ShoppingCart className="h-3 w-3 mr-1" />
            Add All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowIngredients(!showIngredients)}
            className="flex-1 bg-transparent"
          >
            {showIngredients ? "Hide" : "View"} Items
          </Button>
        </div>

        {showIngredients && (
          <div className="space-y-2 pt-3 border-t">
            {recipe.ingredients.map((ingredient) => (
              <div key={ingredient.id} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{ingredient.image}</span>
                  <div>
                    <span className="font-medium">{ingredient.name}</span>
                    <p className="text-xs text-gray-600">{ingredient.quantity}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-medium">${ingredient.price.toFixed(2)}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddIngredient(ingredient)}
                    className="h-6 w-6 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function getTotalCost(ingredients: ParsedIngredient[]) {
  return ingredients.reduce((sum, ingredient) => sum + ingredient.price, 0)
}
