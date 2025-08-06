import { type NextRequest, NextResponse } from "next/server"

// Mock user storage
const USERS_STORAGE = new Map<string, any>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, email, password, name } = body

    if (!action) {
      return NextResponse.json({ success: false, error: "Action is required" }, { status: 400 })
    }

    switch (action) {
      case "signin":
        if (!email || !password) {
          return NextResponse.json({ success: false, error: "Email and password are required" }, { status: 400 })
        }

        // Mock authentication
        const user = USERS_STORAGE.get(email) || {
          id: `user_${Date.now()}`,
          name: "Demo User",
          email,
          onboarded: true,
          preferences: {
            householdSize: "2",
            dietaryNeeds: ["Organic preferred"],
            shoppingDays: ["Saturday", "Sunday"],
          },
          createdAt: new Date().toISOString(),
        }

        USERS_STORAGE.set(email, user)

        return NextResponse.json({
          success: true,
          data: {
            user,
            token: `mock_token_${user.id}`,
            expiresIn: 3600,
          },
          message: "Signed in successfully",
        })

      case "signup":
        if (!email || !password || !name) {
          return NextResponse.json({ success: false, error: "Name, email and password are required" }, { status: 400 })
        }

        const newUser = {
          id: `user_${Date.now()}`,
          name,
          email,
          onboarded: false,
          createdAt: new Date().toISOString(),
        }

        USERS_STORAGE.set(email, newUser)

        return NextResponse.json(
          {
            success: true,
            data: {
              user: newUser,
              token: `mock_token_${newUser.id}`,
              expiresIn: 3600,
            },
            message: "Account created successfully",
          },
          { status: 201 },
        )

      case "signout":
        return NextResponse.json({
          success: true,
          message: "Signed out successfully",
        })

      default:
        return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Auth Error:", error)
    return NextResponse.json({ success: false, error: "Authentication failed" }, { status: 500 })
  }
}
