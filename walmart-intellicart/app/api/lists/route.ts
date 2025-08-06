import { type NextRequest, NextResponse } from "next/server"

// Mock lists storage
const LISTS_STORAGE = new Map<string, any>()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "default"

    const userLists = LISTS_STORAGE.get(userId) || []

    return NextResponse.json({
      success: true,
      data: userLists,
    })
  } catch (error) {
    console.error("Get Lists Error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch lists" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId = "default", name, type = "personal", items = [] } = body

    if (!name) {
      return NextResponse.json({ success: false, error: "List name is required" }, { status: 400 })
    }

    const userLists = LISTS_STORAGE.get(userId) || []

    const newList = {
      id: `list_${Date.now()}`,
      name,
      type,
      items,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedTotal: items.reduce((sum: number, item: any) => sum + (item.price * item.quantity || 0), 0),
    }

    userLists.push(newList)
    LISTS_STORAGE.set(userId, userLists)

    return NextResponse.json(
      {
        success: true,
        data: newList,
        message: "List created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create List Error:", error)
    return NextResponse.json({ success: false, error: "Failed to create list" }, { status: 500 })
  }
}
