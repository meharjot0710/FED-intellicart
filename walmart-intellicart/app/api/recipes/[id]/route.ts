import { type NextRequest, NextResponse } from "next/server"

// Mock recipes storage
const RECIPES_STORAGE = new Map<string, any>()

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "default"

    const userRecipes = RECIPES_STORAGE.get(userId) || []
    const recipe = userRecipes.find((r: any) => r.id === params.id)

    if (!recipe) {
      return NextResponse.json({ success: false, error: "Recipe not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: recipe,
    })
  } catch (error) {
    console.error("Get Recipe Error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch recipe" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { userId = "default" } = body

    const userRecipes = RECIPES_STORAGE.get(userId) || []
    const recipeIndex = userRecipes.findIndex((r: any) => r.id === params.id)

    if (recipeIndex === -1) {
      return NextResponse.json({ success: false, error: "Recipe not found" }, { status: 404 })
    }

    const updatedRecipe = {
      ...userRecipes[recipeIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    userRecipes[recipeIndex] = updatedRecipe
    RECIPES_STORAGE.set(userId, userRecipes)

    return NextResponse.json({
      success: true,
      data: updatedRecipe,
      message: "Recipe updated successfully",
    })
  } catch (error) {
    console.error("Update Recipe Error:", error)
    return NextResponse.json({ success: false, error: "Failed to update recipe" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "default"

    const userRecipes = RECIPES_STORAGE.get(userId) || []
    const recipeIndex = userRecipes.findIndex((r: any) => r.id === params.id)

    if (recipeIndex === -1) {
      return NextResponse.json({ success: false, error: "Recipe not found" }, { status: 404 })
    }

    userRecipes.splice(recipeIndex, 1)
    RECIPES_STORAGE.set(userId, userRecipes)

    return NextResponse.json({
      success: true,
      message: "Recipe deleted successfully",
    })
  } catch (error) {
    console.error("Delete Recipe Error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete recipe" }, { status: 500 })
  }
}
