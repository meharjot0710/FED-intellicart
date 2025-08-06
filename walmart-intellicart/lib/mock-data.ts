export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  tags: string[]
  rating: number
  inStock: boolean
}

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Organic Whole Milk",
    price: 4.99,
    image: "🥛",
    category: "Dairy",
    tags: ["Organic", "Fresh"],
    rating: 4.5,
    inStock: true,
  },
  {
    id: "2",
    name: "Free-Range Eggs",
    price: 3.49,
    image: "🥚",
    category: "Dairy",
    tags: ["Free-Range", "Protein"],
    rating: 4.8,
    inStock: true,
  },
  {
    id: "3",
    name: "Whole Grain Bread",
    price: 2.99,
    image: "🍞",
    category: "Bakery",
    tags: ["Whole Grain", "Fiber"],
    rating: 4.2,
    inStock: true,
  },
  {
    id: "4",
    name: "Greek Yogurt",
    price: 5.99,
    image: "🥛",
    category: "Dairy",
    tags: ["High Protein", "Probiotic"],
    rating: 4.6,
    inStock: true,
  },
  {
    id: "5",
    name: "Organic Bananas",
    price: 2.99,
    image: "🍌",
    category: "Produce",
    tags: ["Organic", "Potassium"],
    rating: 4.3,
    inStock: true,
  },
  {
    id: "6",
    name: "Chicken Breast",
    price: 8.99,
    image: "🍗",
    category: "Meat",
    tags: ["Lean Protein", "Fresh"],
    rating: 4.4,
    inStock: true,
  },
  {
    id: "7",
    name: "Honey Nut Cheerios",
    price: 4.49,
    image: "🥣",
    category: "Cereal",
    tags: ["Whole Grain", "Heart Healthy"],
    rating: 4.1,
    inStock: true,
  },
  {
    id: "8",
    name: "Organic Spinach",
    price: 3.99,
    image: "🥬",
    category: "Produce",
    tags: ["Organic", "Iron", "Leafy Green"],
    rating: 4.5,
    inStock: true,
  },
  {
    id: "9",
    name: "Almond Butter",
    price: 7.99,
    image: "🥜",
    category: "Pantry",
    tags: ["Natural", "Protein", "Healthy Fats"],
    rating: 4.7,
    inStock: true,
  },
  {
    id: "10",
    name: "Vanilla Ice Cream",
    price: 5.49,
    image: "🍦",
    category: "Frozen",
    tags: ["Premium", "Dessert"],
    rating: 4.3,
    inStock: true,
  },
]

export function getWeatherRecommendations(weather: string): Product[] {
  const weatherProducts = {
    hot: [
      { ...mockProducts[9], tags: [...mockProducts[9].tags, "Summer"] }, // Ice cream
      { ...mockProducts[4], tags: [...mockProducts[4].tags, "Refreshing"] }, // Bananas
    ],
    cold: [
      { ...mockProducts[2], tags: [...mockProducts[2].tags, "Comfort"] }, // Bread
      { ...mockProducts[5], tags: [...mockProducts[5].tags, "Warming"] }, // Chicken
    ],
  }

  return weatherProducts[weather as keyof typeof weatherProducts] || []
}

export function getHealthRecommendations(goals: string[]): Product[] {
  const healthProducts = goals.includes("low-carb")
    ? [mockProducts[1], mockProducts[5], mockProducts[8]] // Eggs, Chicken, Spinach
    : [mockProducts[3], mockProducts[8], mockProducts[6]] // Yogurt, Spinach, Cereal

  return healthProducts.map((product) => ({
    ...product,
    tags: [...product.tags, "Health Goal"],
  }))
}

export function getEventRecommendations(event: string): Product[] {
  const eventProducts = {
    "summer-bbq": [
      { ...mockProducts[5], tags: [...mockProducts[5].tags, "BBQ"] }, // Chicken
      { ...mockProducts[9], tags: [...mockProducts[9].tags, "BBQ"] }, // Ice cream
    ],
    holiday: [
      { ...mockProducts[2], tags: [...mockProducts[2].tags, "Holiday"] }, // Bread
    ],
  }

  return eventProducts[event as keyof typeof eventProducts] || []
}

export function searchProducts(query: string): Product[] {
  const searchTerms = query.toLowerCase().split(" ")

  return mockProducts.filter((product) => {
    const searchableText = `${product.name} ${product.category} ${product.tags.join(" ")}`.toLowerCase()
    return searchTerms.some((term) => searchableText.includes(term))
  })
}
