import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { youtubeUrl, inventory } = body

    if (!youtubeUrl || !inventory || !Array.isArray(inventory)) {
      return NextResponse.json(
        { error: "Invalid input. youtubeUrl and inventory array are required" },
        { status: 400 }
      )
    }

    const response = await fetch(`${API_BASE_URL}/recipie/check-ingredients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ youtubeUrl, inventory }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || "Recipe matching failed" },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Recipe matching error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 