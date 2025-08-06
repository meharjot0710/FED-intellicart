import { type NextRequest, NextResponse } from "next/server"

// Mock analytics storage
const ANALYTICS_STORAGE = new Map<string, any[]>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId = "default", event, properties = {}, timestamp = new Date().toISOString() } = body

    if (!event) {
      return NextResponse.json({ success: false, error: "Event name is required" }, { status: 400 })
    }

    const userAnalytics = ANALYTICS_STORAGE.get(userId) || []

    const analyticsEvent = {
      id: `event_${Date.now()}`,
      event,
      properties,
      timestamp,
      userId,
    }

    userAnalytics.push(analyticsEvent)
    ANALYTICS_STORAGE.set(userId, userAnalytics)

    // Log for debugging
    console.log("Analytics Event:", analyticsEvent)

    return NextResponse.json({
      success: true,
      message: "Event tracked successfully",
    })
  } catch (error) {
    console.error("Analytics Error:", error)
    return NextResponse.json({ success: false, error: "Failed to track event" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "default"
    const event = searchParams.get("event")
    const limit = Number.parseInt(searchParams.get("limit") || "100")

    let userAnalytics = ANALYTICS_STORAGE.get(userId) || []

    if (event) {
      userAnalytics = userAnalytics.filter((e: any) => e.event === event)
    }

    // Sort by timestamp descending and limit
    userAnalytics = userAnalytics
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)

    return NextResponse.json({
      success: true,
      data: userAnalytics,
      total: userAnalytics.length,
    })
  } catch (error) {
    console.error("Get Analytics Error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch analytics" }, { status: 500 })
  }
}
