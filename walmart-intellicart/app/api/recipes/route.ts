import { type NextRequest, NextResponse } from "next/server"

// Mock recipes storage
const RECIPES_STORAGE = new Map<string, any>()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "default"

    const userRecipes = RECIPES_STORAGE.get(userId) || []

    return NextResponse.json({
      success: true,
      data: userRecipes,
    })
  } catch (error) {
    console.error("Get Recipes Error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch recipes" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId = "default", youtubeUrl, action = "parse" } = body

    if (action === "parse") {
      if (!youtubeUrl) {
        return NextResponse.json({ success: false, error: "YouTube URL is required" }, { status: 400 })
      }

      // Mock YouTube recipe parsing
      const mockParsedRecipe = {
        id: `recipe_${Date.now()}`,
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
            storeSection: "dairy",
          },
          {
            id: "p2",
            name: "Butter",
            quantity: "2 tbsp",
            category: "Dairy",
            price: 4.49,
            image: "🧈",
            storeSection: "dairy",
          },
          {
            id: "p3",
            name: "Heavy Cream",
            quantity: "2 tbsp",
            category: "Dairy",
            price: 3.99,
            image: "🥛",
            storeSection: "dairy",
          },
          {
            id: "p4",
            name: "Chives",
            quantity: "1 bunch",
            category: "Produce",
            price: 1.99,
            image: "🌿",
            storeSection: "produce",
          },
        ],
      }

      return NextResponse.json({
        success: true,
        data: mockParsedRecipe,
        message: "Recipe parsed successfully",
      })
    } else if (action === "save") {
      const { recipe } = body
      if (!recipe) {
        return NextResponse.json({ success: false, error: "Recipe data is required" }, { status: 400 })
      }

      const userRecipes = RECIPES_STORAGE.get(userId) || []
      const savedRecipe = {
        ...recipe,
        savedAt: new Date().toISOString(),
        isFavorite: false,
        servings: recipe.servings || 4,
        cookTime: recipe.cookTime || 30,
      }

      userRecipes.unshift(savedRecipe)
      RECIPES_STORAGE.set(userId, userRecipes)

      return NextResponse.json(
        {
          success: true,
          data: savedRecipe,
          message: "Recipe saved successfully",
        },
        { status: 201 },
      )
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Recipe Action Error:", error)
    return NextResponse.json({ success: false, error: "Failed to process recipe" }, { status: 500 })
  }
}
