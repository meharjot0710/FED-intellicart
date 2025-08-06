import { type NextRequest, NextResponse } from "next/server"

// Mock cart storage (in production, use database)
const CARTS_STORAGE = new Map<string, any>()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "default"
    const cartType = searchParams.get("type") || "personal" // personal, shared, both

    const userCart = CARTS_STORAGE.get(userId) || {
      personal: [],
      shared: [],
      updatedAt: new Date().toISOString(),
    }

    let responseData
    switch (cartType) {
      case "personal":
        responseData = { items: userCart.personal, type: "personal" }
        break
      case "shared":
        responseData = { items: userCart.shared, type: "shared" }
        break
      case "both":
      default:
        responseData = {
          personal: userCart.personal,
          shared: userCart.shared,
          type: "both",
        }
        break
    }

    return NextResponse.json({
      success: true,
      data: responseData,
      updatedAt: userCart.updatedAt,
    })
  } catch (error) {
    console.error("Get Cart Error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch cart" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId = "default", cartType = "personal", item, action = "add" } = body

    if (!item || !item.id) {
      return NextResponse.json({ success: false, error: "Item ID is required" }, { status: 400 })
    }

    const userCart = CARTS_STORAGE.get(userId) || {
      personal: [],
      shared: [],
      updatedAt: new Date().toISOString(),
    }

    const targetCart = cartType === "shared" ? userCart.shared : userCart.personal
    const existingItemIndex = targetCart.findIndex((cartItem: any) => cartItem.id === item.id)

    switch (action) {
      case "add":
        if (existingItemIndex >= 0) {
          targetCart[existingItemIndex].quantity += item.quantity || 1
        } else {
          targetCart.push({
            ...item,
            quantity: item.quantity || 1,
            addedAt: new Date().toISOString(),
            addedBy: body.addedBy || "User",
          })
        }
        break

      case "update":
        if (existingItemIndex >= 0) {
          targetCart[existingItemIndex] = {
            ...targetCart[existingItemIndex],
            ...item,
            updatedAt: new Date().toISOString(),
          }
        }
        break

      case "remove":
        if (existingItemIndex >= 0) {
          targetCart.splice(existingItemIndex, 1)
        }
        break

      case "clear":
        if (cartType === "shared") {
          userCart.shared = []
        } else if (cartType === "personal") {
          userCart.personal = []
        } else {
          userCart.personal = []
          userCart.shared = []
        }
        break

      default:
        return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
    }

    userCart.updatedAt = new Date().toISOString()
    CARTS_STORAGE.set(userId, userCart)

    return NextResponse.json({
      success: true,
      data: {
        personal: userCart.personal,
        shared: userCart.shared,
      },
      message: `Item ${action}ed successfully`,
    })
  } catch (error) {
    console.error("Cart Action Error:", error)
    return NextResponse.json({ success: false, error: "Failed to update cart" }, { status: 500 })
  }
}
