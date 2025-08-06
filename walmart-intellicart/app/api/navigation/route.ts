import { type NextRequest, NextResponse } from "next/server"
import { generateNavigationRoute, getCurrentCrowdLevels } from "@/lib/pathfinding"
import { mapCategoryToSection } from "@/lib/store-layout"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, preferences = {} } = body

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ success: false, error: "Items array is required" }, { status: 400 })
    }

    // Transform items to include store sections
    const cartItems = items.map((item: any) => ({
      name: item.name,
      category: item.category,
      storeSection: item.storeSection || mapCategoryToSection(item.category),
    }))

    // Get current crowd levels
    const crowdLevels = getCurrentCrowdLevels()

    // Generate optimized route
    const optimizedRoute = generateNavigationRoute(cartItems, crowdLevels)

    return NextResponse.json({
      success: true,
      data: {
        route: optimizedRoute,
        crowdLevels,
        preferences,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Navigation Route Error:", error)
    return NextResponse.json({ success: false, error: "Failed to generate navigation route" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "crowd-levels"

    switch (type) {
      case "crowd-levels":
        const crowdLevels = getCurrentCrowdLevels()
        return NextResponse.json({
          success: true,
          data: {
            crowdLevels,
            updatedAt: new Date().toISOString(),
          },
        })

      case "store-layout":
        const { STORE_LAYOUT } = await import("@/lib/store-layout")
        return NextResponse.json({
          success: true,
          data: {
            layout: STORE_LAYOUT,
            updatedAt: new Date().toISOString(),
          },
        })

      default:
        return NextResponse.json({ success: false, error: "Invalid type parameter" }, { status: 400 })
    }
  } catch (error) {
    console.error("Navigation GET Error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch navigation data" }, { status: 500 })
  }
}
