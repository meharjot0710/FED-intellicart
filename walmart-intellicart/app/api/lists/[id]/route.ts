import { type NextRequest, NextResponse } from "next/server"

// Mock lists storage
const LISTS_STORAGE = new Map<string, any>()

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "default"

    const userLists = LISTS_STORAGE.get(userId) || []
    const list = userLists.find((l: any) => l.id === params.id)

    if (!list) {
      return NextResponse.json({ success: false, error: "List not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: list,
    })
  } catch (error) {
    console.error("Get List Error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch list" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { userId = "default" } = body

    const userLists = LISTS_STORAGE.get(userId) || []
    const listIndex = userLists.findIndex((l: any) => l.id === params.id)

    if (listIndex === -1) {
      return NextResponse.json({ success: false, error: "List not found" }, { status: 404 })
    }

    const updatedList = {
      ...userLists[listIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    // Recalculate estimated total
    if (updatedList.items) {
      updatedList.estimatedTotal = updatedList.items.reduce(
        (sum: number, item: any) => sum + (item.price * item.quantity || 0),
        0,
      )
    }

    userLists[listIndex] = updatedList
    LISTS_STORAGE.set(userId, userLists)

    return NextResponse.json({
      success: true,
      data: updatedList,
      message: "List updated successfully",
    })
  } catch (error) {
    console.error("Update List Error:", error)
    return NextResponse.json({ success: false, error: "Failed to update list" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "default"

    const userLists = LISTS_STORAGE.get(userId) || []
    const listIndex = userLists.findIndex((l: any) => l.id === params.id)

    if (listIndex === -1) {
      return NextResponse.json({ success: false, error: "List not found" }, { status: 404 })
    }

    userLists.splice(listIndex, 1)
    LISTS_STORAGE.set(userId, userLists)

    return NextResponse.json({
      success: true,
      message: "List deleted successfully",
    })
  } catch (error) {
    console.error("Delete List Error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete list" }, { status: 500 })
  }
}
