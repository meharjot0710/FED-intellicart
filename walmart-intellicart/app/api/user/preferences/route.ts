import { type NextRequest, NextResponse } from "next/server"

// Mock user storage
const USERS_STORAGE = new Map<string, any>()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "default"

    const user = USERS_STORAGE.get(userId)
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: user.preferences || {},
    })
  } catch (error) {
    console.error("Get Preferences Error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch preferences" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId = "default", preferences } = body

    if (!preferences) {
      return NextResponse.json({ success: false, error: "Preferences data is required" }, { status: 400 })
    }

    const user = USERS_STORAGE.get(userId) || { id: userId }
    user.preferences = { ...user.preferences, ...preferences }
    user.onboarded = true
    user.updatedAt = new Date().toISOString()

    USERS_STORAGE.set(userId, user)

    return NextResponse.json({
      success: true,
      data: user,
      message: "Preferences updated successfully",
    })
  } catch (error) {
    console.error("Update Preferences Error:", error)
    return NextResponse.json({ success: false, error: "Failed to update preferences" }, { status: 500 })
  }
}
