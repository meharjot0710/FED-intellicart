"use client"

import { useEffect, useRef, useState } from "react"
import { STORE_LAYOUT, getCurrentCrowdLevels } from "@/lib/store-layout"
import { type OptimizedRoute, smoothPath } from "@/lib/pathfinding"

interface StoreMapProps {
  route?: OptimizedRoute
  currentStep?: number
  showRoute?: boolean
  className?: string
}

export function StoreMap({ route, currentStep = 0, showRoute = true, className = "" }: StoreMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [crowdLevels, setCrowdLevels] = useState<Record<string, number>>({})
  const [animationFrame, setAnimationFrame] = useState(0)

  // Update crowd levels periodically
  useEffect(() => {
    const updateCrowdLevels = () => {
      setCrowdLevels(getCurrentCrowdLevels())
    }

    updateCrowdLevels()
    const interval = setInterval(updateCrowdLevels, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  // Animation loop for route visualization
  useEffect(() => {
    if (!showRoute || !route) return

    const animate = () => {
      setAnimationFrame((prev) => (prev + 1) % 200)
      requestAnimationFrame(animate)
    }

    const animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [showRoute, route])

  // Draw the store map
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

    const canvasWidth = rect.width
    const canvasHeight = rect.height

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)

    // Draw store sections
    STORE_LAYOUT.forEach((section) => {
      const x = (section.x / 100) * canvasWidth - ((section.width / 100) * canvasWidth) / 2
      const y = (section.y / 100) * canvasHeight - ((section.height / 100) * canvasHeight) / 2
      const width = (section.width / 100) * canvasWidth
      const height = (section.height / 100) * canvasHeight

      // Apply crowd-based opacity
      const crowdFactor = crowdLevels[section.id] || section.crowdFactor
      const opacity = Math.min(1.0, 0.3 + (crowdFactor - 1.0) * 0.4)

      // Draw section background
      ctx.fillStyle =
        section.color +
        Math.floor(opacity * 255)
          .toString(16)
          .padStart(2, "0")
      ctx.fillRect(x, y, width, height)

      // Draw section border
      ctx.strokeStyle = section.color
      ctx.lineWidth = 2
      ctx.strokeRect(x, y, width, height)

      // Draw section label
      ctx.fillStyle = "#000000"
      ctx.font = `${Math.max(10, width / 8)}px Arial`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      const centerX = x + width / 2
      const centerY = y + height / 2

      // Multi-line text for long names
      const words = section.name.split(" ")
      if (words.length > 1 && width < 80) {
        ctx.fillText(words[0], centerX, centerY - 6)
        ctx.fillText(words.slice(1).join(" "), centerX, centerY + 6)
      } else {
        ctx.fillText(section.name, centerX, centerY)
      }

      // Draw crowd level indicator
      if (section.type === "section") {
        const indicatorSize = 8
        const indicatorX = x + width - indicatorSize - 4
        const indicatorY = y + 4

        ctx.fillStyle = crowdFactor > 1.5 ? "#EF4444" : crowdFactor > 1.2 ? "#F59E0B" : "#10B981"
        ctx.beginPath()
        ctx.arc(indicatorX, indicatorY, indicatorSize / 2, 0, 2 * Math.PI)
        ctx.fill()
      }
    })

    // Draw route path
    if (showRoute && route && route.path.length > 1) {
      const smoothedPath = smoothPath(route.path)

      // Draw path background
      ctx.strokeStyle = "#3B82F6"
      ctx.lineWidth = 8
      ctx.lineCap = "round"
      ctx.lineJoin = "round"
      ctx.globalAlpha = 0.3

      ctx.beginPath()
      smoothedPath.forEach((point, index) => {
        const x = (point.x / 100) * canvasWidth
        const y = (point.y / 100) * canvasHeight

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()

      // Draw animated path
      ctx.globalAlpha = 1.0
      ctx.strokeStyle = "#1D4ED8"
      ctx.lineWidth = 4

      // Animated dashed line
      const dashLength = 10
      const gapLength = 5
      const animationOffset = (animationFrame * 0.5) % (dashLength + gapLength)

      ctx.setLineDash([dashLength, gapLength])
      ctx.lineDashOffset = -animationOffset

      ctx.beginPath()
      smoothedPath.forEach((point, index) => {
        const x = (point.x / 100) * canvasWidth
        const y = (point.y / 100) * canvasHeight

        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()

      ctx.setLineDash([]) // Reset dash

      // Draw route waypoints
      route.steps.forEach((step, index) => {
        const x = (step.x / 100) * canvasWidth
        const y = (step.y / 100) * canvasHeight

        // Waypoint circle
        ctx.fillStyle = index <= currentStep ? "#10B981" : "#6B7280"
        ctx.strokeStyle = "#FFFFFF"
        ctx.lineWidth = 3

        ctx.beginPath()
        ctx.arc(x, y, 12, 0, 2 * Math.PI)
        ctx.fill()
        ctx.stroke()

        // Step number
        ctx.fillStyle = "#FFFFFF"
        ctx.font = "bold 12px Arial"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText((index + 1).toString(), x, y)

        // Current position indicator
        if (index === currentStep) {
          ctx.strokeStyle = "#EF4444"
          ctx.lineWidth = 3
          ctx.beginPath()
          ctx.arc(x, y, 18, 0, 2 * Math.PI)
          ctx.stroke()

          // Pulsing animation
          const pulseRadius = 18 + Math.sin(animationFrame * 0.2) * 4
          ctx.globalAlpha = 0.5
          ctx.strokeStyle = "#EF4444"
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(x, y, pulseRadius, 0, 2 * Math.PI)
          ctx.stroke()
          ctx.globalAlpha = 1.0
        }
      })

      // Draw direction arrows along the path
      if (smoothedPath.length > 1) {
        ctx.fillStyle = "#1D4ED8"
        const arrowSpacing = 50 // pixels between arrows

        for (let i = 1; i < smoothedPath.length; i++) {
          const prev = smoothedPath[i - 1]
          const curr = smoothedPath[i]

          const prevX = (prev.x / 100) * canvasWidth
          const prevY = (prev.y / 100) * canvasHeight
          const currX = (curr.x / 100) * canvasWidth
          const currY = (curr.y / 100) * canvasHeight

          const distance = Math.sqrt(Math.pow(currX - prevX, 2) + Math.pow(currY - prevY, 2))

          if (distance > arrowSpacing) {
            const angle = Math.atan2(currY - prevY, currX - prevX)
            const midX = prevX + (currX - prevX) * 0.5
            const midY = prevY + (currY - prevY) * 0.5

            // Draw arrow
            const arrowSize = 8
            ctx.save()
            ctx.translate(midX, midY)
            ctx.rotate(angle)

            ctx.beginPath()
            ctx.moveTo(arrowSize, 0)
            ctx.lineTo(-arrowSize / 2, -arrowSize / 2)
            ctx.lineTo(-arrowSize / 2, arrowSize / 2)
            ctx.closePath()
            ctx.fill()

            ctx.restore()
          }
        }
      }
    }

    // Draw entrance indicator
    const entrance = STORE_LAYOUT.find((s) => s.id === "entrance")
    if (entrance) {
      const x = (entrance.x / 100) * canvasWidth
      const y = (entrance.y / 100) * canvasHeight

      ctx.fillStyle = "#10B981"
      ctx.font = "bold 14px Arial"
      ctx.textAlign = "center"
      ctx.fillText("🚪 START", x, y - 20)
    }

    // Draw checkout indicator
    const checkout = STORE_LAYOUT.find((s) => s.id === "checkout")
    if (checkout) {
      const x = (checkout.x / 100) * canvasWidth
      const y = (checkout.y / 100) * canvasHeight

      ctx.fillStyle = "#DC2626"
      ctx.font = "bold 14px Arial"
      ctx.textAlign = "center"
      ctx.fillText("🛒 CHECKOUT", x, y - 20)
    }
  }, [route, currentStep, showRoute, crowdLevels, animationFrame])

  return (
    <div className={`relative bg-gray-100 rounded-lg overflow-hidden ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" style={{ minHeight: "400px" }} />

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs space-y-2">
        <div className="font-semibold">Crowd Levels</div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span>Low</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span>Medium</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <span>High</span>
        </div>
        {showRoute && route && (
          <>
            <div className="border-t pt-2 mt-2">
              <div className="font-semibold">Route</div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-1 bg-blue-600 rounded"></div>
                <span>Your Path</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
