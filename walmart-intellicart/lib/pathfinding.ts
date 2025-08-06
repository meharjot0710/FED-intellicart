import { STORE_LAYOUT, generateStoreNodes } from "./store-layout"

export interface PathNode {
  id: string
  x: number
  y: number
  g: number // Cost from start
  h: number // Heuristic cost to goal
  f: number // Total cost (g + h)
  parent?: PathNode
  sectionId?: string
  crowdFactor: number
}

export interface NavigationStep {
  sectionId: string
  sectionName: string
  x: number
  y: number
  items: string[]
  estimatedTime: number
  crowdLevel: "low" | "medium" | "high"
  distance: number
  instructions: string
}

export interface OptimizedRoute {
  steps: NavigationStep[]
  totalDistance: number
  totalTime: number
  path: Array<{ x: number; y: number }>
}

// Calculate Euclidean distance between two points
function calculateDistance(x1: number, y1: number, x2: number, y2: number): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

// A* pathfinding algorithm implementation
export function findPath(
  startId: string,
  goalId: string,
  crowdLevels: Record<string, number> = {},
): Array<{ x: number; y: number }> {
  const nodes = generateStoreNodes()
  const nodeMap = new Map(nodes.map((node) => [node.id, node]))

  const startNode = nodeMap.get(startId)
  const goalNode = nodeMap.get(goalId)

  if (!startNode || !goalNode) {
    return []
  }

  const openSet: PathNode[] = []
  const closedSet = new Set<string>()

  // Initialize start node
  const start: PathNode = {
    id: startNode.id,
    x: startNode.x,
    y: startNode.y,
    g: 0,
    h: calculateDistance(startNode.x, startNode.y, goalNode.x, goalNode.y),
    f: 0,
    sectionId: startNode.sectionId,
    crowdFactor: crowdLevels[startNode.sectionId || startNode.id] || startNode.crowdFactor,
  }
  start.f = start.g + start.h

  openSet.push(start)

  while (openSet.length > 0) {
    // Find node with lowest f score
    openSet.sort((a, b) => a.f - b.f)
    const current = openSet.shift()!

    if (current.id === goalId) {
      // Reconstruct path
      const path: Array<{ x: number; y: number }> = []
      let node: PathNode | undefined = current

      while (node) {
        path.unshift({ x: node.x, y: node.y })
        node = node.parent
      }

      return path
    }

    closedSet.add(current.id)

    // Get neighbors from store layout connections
    const currentSection = STORE_LAYOUT.find((s) => s.id === current.sectionId || s.id === current.id)
    const neighbors = currentSection?.connections || []

    for (const neighborId of neighbors) {
      if (closedSet.has(neighborId)) continue

      const neighborNode = nodeMap.get(neighborId)
      if (!neighborNode) continue

      const crowdFactor = crowdLevels[neighborNode.sectionId || neighborId] || neighborNode.crowdFactor
      const distance = calculateDistance(current.x, current.y, neighborNode.x, neighborNode.y)
      const tentativeG = current.g + distance * crowdFactor // Apply crowd penalty

      let neighbor = openSet.find((n) => n.id === neighborId)

      if (!neighbor) {
        neighbor = {
          id: neighborNode.id,
          x: neighborNode.x,
          y: neighborNode.y,
          g: tentativeG,
          h: calculateDistance(neighborNode.x, neighborNode.y, goalNode.x, goalNode.y),
          f: 0,
          parent: current,
          sectionId: neighborNode.sectionId,
          crowdFactor,
        }
        neighbor.f = neighbor.g + neighbor.h
        openSet.push(neighbor)
      } else if (tentativeG < neighbor.g) {
        neighbor.g = tentativeG
        neighbor.f = neighbor.g + neighbor.h
        neighbor.parent = current
      }
    }
  }

  return [] // No path found
}

// Traveling Salesman Problem solver using nearest neighbor heuristic
export function optimizeMultiStopRoute(
  startId: string,
  destinations: string[],
  crowdLevels: Record<string, number> = {},
): string[] {
  if (destinations.length === 0) return []
  if (destinations.length === 1) return destinations

  const unvisited = [...destinations]
  const route = [startId]
  let current = startId

  while (unvisited.length > 0) {
    let nearest = unvisited[0]
    let shortestDistance = Number.POSITIVE_INFINITY

    for (const destination of unvisited) {
      const path = findPath(current, destination, crowdLevels)
      if (path.length > 0) {
        // Calculate weighted distance considering crowd levels
        let distance = 0
        for (let i = 0; i < path.length - 1; i++) {
          const segmentDistance = calculateDistance(path[i].x, path[i].y, path[i + 1].x, path[i + 1].y)
          const section = STORE_LAYOUT.find((s) => Math.abs(s.x - path[i].x) < 10 && Math.abs(s.y - path[i].y) < 10)
          const crowdFactor = section ? crowdLevels[section.id] || section.crowdFactor : 1.0
          distance += segmentDistance * crowdFactor
        }

        if (distance < shortestDistance) {
          shortestDistance = distance
          nearest = destination
        }
      }
    }

    route.push(nearest)
    current = nearest
    unvisited.splice(unvisited.indexOf(nearest), 1)
  }

  return route.slice(1) // Remove start position
}

// Generate complete navigation route with steps
export function generateNavigationRoute(
  cartItems: Array<{ name: string; category: string; storeSection?: string }>,
  crowdLevels: Record<string, number> = {},
): OptimizedRoute {
  // Group items by store section
  const itemsBySection = cartItems.reduce(
    (acc, item) => {
      const sectionId = item.storeSection || "pantry"
      if (!acc[sectionId]) {
        acc[sectionId] = []
      }
      acc[sectionId].push(item.name)
      return acc
    },
    {} as Record<string, string[]>,
  )

  const sectionIds = Object.keys(itemsBySection)
  if (sectionIds.length === 0) {
    return { steps: [], totalDistance: 0, totalTime: 0, path: [] }
  }

  // Optimize route order
  const optimizedOrder = optimizeMultiStopRoute("entrance", sectionIds, crowdLevels)

  // Generate navigation steps
  const steps: NavigationStep[] = []
  const fullPath: Array<{ x: number; y: number }> = []
  let totalDistance = 0
  let totalTime = 0
  let currentPosition = "entrance"

  for (let i = 0; i < optimizedOrder.length; i++) {
    const sectionId = optimizedOrder[i]
    const section = STORE_LAYOUT.find((s) => s.id === sectionId)

    if (!section) continue

    // Find path to this section
    const pathToSection = findPath(currentPosition, sectionId, crowdLevels)

    if (pathToSection.length > 0) {
      // Calculate distance and time for this segment
      let segmentDistance = 0
      for (let j = 0; j < pathToSection.length - 1; j++) {
        segmentDistance += calculateDistance(
          pathToSection[j].x,
          pathToSection[j].y,
          pathToSection[j + 1].x,
          pathToSection[j + 1].y,
        )
      }

      const crowdFactor = crowdLevels[sectionId] || section.crowdFactor
      const estimatedTime = Math.ceil((segmentDistance * crowdFactor) / 10) + 2 // Base time + collection time

      // Generate instructions
      let instructions = `Head to ${section.name}`
      if (i === 0) {
        instructions = `Start at entrance, then go to ${section.name}`
      } else {
        const prevSection = STORE_LAYOUT.find((s) => s.id === optimizedOrder[i - 1])
        if (prevSection) {
          instructions = `From ${prevSection.name}, go to ${section.name}`
        }
      }

      steps.push({
        sectionId,
        sectionName: section.name,
        x: section.x,
        y: section.y,
        items: itemsBySection[sectionId] || [],
        estimatedTime,
        crowdLevel: section.crowdLevel,
        distance: segmentDistance,
        instructions,
      })

      // Add path points to full path
      fullPath.push(...pathToSection.slice(fullPath.length > 0 ? 1 : 0))
      totalDistance += segmentDistance
      totalTime += estimatedTime
      currentPosition = sectionId
    }
  }

  // Add checkout step
  const checkoutPath = findPath(currentPosition, "checkout", crowdLevels)
  if (checkoutPath.length > 0) {
    let checkoutDistance = 0
    for (let i = 0; i < checkoutPath.length - 1; i++) {
      checkoutDistance += calculateDistance(
        checkoutPath[i].x,
        checkoutPath[i].y,
        checkoutPath[i + 1].x,
        checkoutPath[i + 1].y,
      )
    }

    const checkoutSection = STORE_LAYOUT.find((s) => s.id === "checkout")!
    const checkoutTime = Math.ceil(checkoutDistance / 10) + 5 // Extra time for checkout

    steps.push({
      sectionId: "checkout",
      sectionName: "Checkout",
      x: checkoutSection.x,
      y: checkoutSection.y,
      items: [],
      estimatedTime: checkoutTime,
      crowdLevel: "high",
      distance: checkoutDistance,
      instructions: "Proceed to checkout when ready",
    })

    fullPath.push(...checkoutPath.slice(1))
    totalDistance += checkoutDistance
    totalTime += checkoutTime
  }

  return {
    steps,
    totalDistance,
    totalTime,
    path: fullPath,
  }
}

// Smooth path for better visualization
export function smoothPath(path: Array<{ x: number; y: number }>): Array<{ x: number; y: number }> {
  if (path.length < 3) return path

  const smoothed: Array<{ x: number; y: number }> = [path[0]]

  for (let i = 1; i < path.length - 1; i++) {
    const prev = path[i - 1]
    const current = path[i]
    const next = path[i + 1]

    // Apply simple smoothing
    const smoothedX = (prev.x + 2 * current.x + next.x) / 4
    const smoothedY = (prev.y + 2 * current.y + next.y) / 4

    smoothed.push({ x: smoothedX, y: smoothedY })
  }

  smoothed.push(path[path.length - 1])
  return smoothed
}
