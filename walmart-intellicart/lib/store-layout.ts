// Store layout configuration with coordinates and connections
export interface StoreSection {
  id: string
  name: string
  x: number
  y: number
  width: number
  height: number
  type: "section" | "entrance" | "checkout" | "aisle" | "obstacle"
  categories: string[]
  crowdLevel: "low" | "medium" | "high"
  crowdFactor: number // 1.0 = normal, 2.0 = twice as slow
  color: string
  connections: string[] // Connected section IDs for pathfinding
}

export interface StoreNode {
  id: string
  x: number
  y: number
  type: "walkable" | "section" | "entrance" | "checkout"
  sectionId?: string
  crowdFactor: number
}

// Walmart store layout with realistic sections and pathfinding nodes
export const STORE_LAYOUT: StoreSection[] = [
  {
    id: "entrance",
    name: "Entrance",
    x: 50,
    y: 90,
    width: 20,
    height: 10,
    type: "entrance",
    categories: [],
    crowdLevel: "medium",
    crowdFactor: 1.2,
    color: "#10B981",
    connections: ["main-aisle-1", "produce"],
  },
  {
    id: "produce",
    name: "Produce",
    x: 20,
    y: 70,
    width: 25,
    height: 15,
    type: "section",
    categories: ["Produce", "Fruits", "Vegetables"],
    crowdLevel: "low",
    crowdFactor: 1.0,
    color: "#22C55E",
    connections: ["main-aisle-1", "deli"],
  },
  {
    id: "deli",
    name: "Deli & Bakery",
    x: 50,
    y: 70,
    width: 20,
    height: 15,
    type: "section",
    categories: ["Bakery", "Deli", "Fresh"],
    crowdLevel: "medium",
    crowdFactor: 1.3,
    color: "#F59E0B",
    connections: ["produce", "main-aisle-1", "dairy"],
  },
  {
    id: "dairy",
    name: "Dairy",
    x: 75,
    y: 70,
    width: 20,
    height: 15,
    type: "section",
    categories: ["Dairy", "Milk", "Cheese", "Yogurt"],
    crowdLevel: "high",
    crowdFactor: 1.8,
    color: "#3B82F6",
    connections: ["deli", "main-aisle-2", "meat"],
  },
  {
    id: "meat",
    name: "Meat & Seafood",
    x: 75,
    y: 45,
    width: 20,
    height: 15,
    type: "section",
    categories: ["Meat", "Seafood", "Poultry"],
    crowdLevel: "high",
    crowdFactor: 1.9,
    color: "#EF4444",
    connections: ["dairy", "main-aisle-2", "frozen"],
  },
  {
    id: "frozen",
    name: "Frozen Foods",
    x: 75,
    y: 20,
    width: 20,
    height: 15,
    type: "section",
    categories: ["Frozen", "Ice Cream", "Frozen Meals"],
    crowdLevel: "medium",
    crowdFactor: 1.2,
    color: "#06B6D4",
    connections: ["meat", "main-aisle-2", "pantry"],
  },
  {
    id: "pantry",
    name: "Pantry & Canned Goods",
    x: 50,
    y: 20,
    width: 20,
    height: 15,
    type: "section",
    categories: ["Pantry", "Canned", "Dry Goods", "Snacks"],
    crowdLevel: "low",
    crowdFactor: 1.1,
    color: "#8B5CF6",
    connections: ["frozen", "main-aisle-2", "main-aisle-1"],
  },
  {
    id: "snacks",
    name: "Snacks & Beverages",
    x: 20,
    y: 45,
    width: 25,
    height: 15,
    type: "section",
    categories: ["Snacks", "Beverages", "Chips", "Soda"],
    crowdLevel: "medium",
    crowdFactor: 1.4,
    color: "#F97316",
    connections: ["main-aisle-1", "household"],
  },
  {
    id: "household",
    name: "Household Items",
    x: 20,
    y: 20,
    width: 25,
    height: 15,
    type: "section",
    categories: ["Household", "Cleaning", "Paper Products"],
    crowdLevel: "low",
    crowdFactor: 1.0,
    color: "#84CC16",
    connections: ["snacks", "main-aisle-1", "checkout"],
  },
  {
    id: "checkout",
    name: "Checkout",
    x: 50,
    y: 5,
    width: 20,
    height: 10,
    type: "checkout",
    categories: [],
    crowdLevel: "high",
    crowdFactor: 2.0,
    color: "#DC2626",
    connections: ["main-aisle-1", "main-aisle-2"],
  },
  // Main aisles for navigation
  {
    id: "main-aisle-1",
    name: "Main Aisle 1",
    x: 50,
    y: 50,
    width: 5,
    height: 40,
    type: "aisle",
    categories: [],
    crowdLevel: "medium",
    crowdFactor: 1.1,
    color: "#6B7280",
    connections: ["entrance", "produce", "deli", "snacks", "household", "checkout", "pantry"],
  },
  {
    id: "main-aisle-2",
    name: "Main Aisle 2",
    x: 70,
    y: 50,
    width: 5,
    height: 40,
    type: "aisle",
    categories: [],
    crowdLevel: "medium",
    crowdFactor: 1.2,
    color: "#6B7280",
    connections: ["dairy", "meat", "frozen", "pantry", "checkout"],
  },
]

// Generate pathfinding nodes from store layout
export function generateStoreNodes(): StoreNode[] {
  const nodes: StoreNode[] = []

  STORE_LAYOUT.forEach((section) => {
    // Add center node for each section
    nodes.push({
      id: section.id,
      x: section.x,
      y: section.y,
      type: section.type === "aisle" ? "walkable" : (section.type as any),
      sectionId: section.id,
      crowdFactor: section.crowdFactor,
    })

    // Add additional walkable nodes for larger sections
    if (section.width > 15 || section.height > 10) {
      const subNodes = [
        { x: section.x - section.width / 4, y: section.y },
        { x: section.x + section.width / 4, y: section.y },
        { x: section.x, y: section.y - section.height / 4 },
        { x: section.x, y: section.y + section.height / 4 },
      ]

      subNodes.forEach((node, index) => {
        nodes.push({
          id: `${section.id}-sub-${index}`,
          x: node.x,
          y: node.y,
          type: "walkable",
          sectionId: section.id,
          crowdFactor: section.crowdFactor,
        })
      })
    }
  })

  return nodes
}

// Map product categories to store sections
export function mapCategoryToSection(category: string): string {
  const categoryMap: Record<string, string> = {
    Produce: "produce",
    Fruits: "produce",
    Vegetables: "produce",
    Dairy: "dairy",
    Milk: "dairy",
    Cheese: "dairy",
    Yogurt: "dairy",
    Meat: "meat",
    Seafood: "meat",
    Poultry: "meat",
    Bakery: "deli",
    Deli: "deli",
    Fresh: "deli",
    Frozen: "frozen",
    "Ice Cream": "frozen",
    "Frozen Meals": "frozen",
    Pantry: "pantry",
    Canned: "pantry",
    "Dry Goods": "pantry",
    Snacks: "snacks",
    Beverages: "snacks",
    Chips: "snacks",
    Soda: "snacks",
    Household: "household",
    Cleaning: "household",
    "Paper Products": "household",
  }

  return categoryMap[category] || "pantry" // Default to pantry if not found
}

// Get current crowd levels (simulated with time-based variation)
export function getCurrentCrowdLevels(): Record<string, number> {
  const baseTime = Date.now()
  const crowdLevels: Record<string, number> = {}

  STORE_LAYOUT.forEach((section) => {
    // Simulate crowd variation based on time and section type
    const timeVariation = Math.sin(baseTime / 60000 + section.x) * 0.3
    const randomVariation = (Math.random() - 0.5) * 0.2

    let baseCrowd = section.crowdFactor

    // Peak hours simulation (higher crowds during certain times)
    const hour = new Date().getHours()
    if (hour >= 17 && hour <= 19) {
      // Evening rush
      baseCrowd *= 1.4
    } else if (hour >= 11 && hour <= 13) {
      // Lunch rush
      baseCrowd *= 1.2
    }

    crowdLevels[section.id] = Math.max(1.0, baseCrowd + timeVariation + randomVariation)
  })

  return crowdLevels
}
