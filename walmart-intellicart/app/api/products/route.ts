import { type NextRequest, NextResponse } from "next/server"
import {
  PRODUCTS_DATABASE,
  searchProducts,
  getProductsByDietaryRestrictions,
  getFeaturedProducts,
  getTopRatedProducts,
  getProductsOnSale,
  getAllCategories,
  getAllBrands,
} from "@/lib/products-database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // Query parameters
    const search = searchParams.get("search")
    const category = searchParams.get("category")
    const storeSection = searchParams.get("storeSection")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const dietary = searchParams.get("dietary")?.split(",") || []
    const featured = searchParams.get("featured") === "true"
    const topRated = searchParams.get("topRated") === "true"
    const onSale = searchParams.get("onSale") === "true"
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")
    const sortBy = searchParams.get("sortBy") || "name"
    const sortOrder = searchParams.get("sortOrder") || "asc"

    let products = [...PRODUCTS_DATABASE]

    // Apply filters
    if (search) {
      products = searchProducts(search)
    }

    if (category) {
      products = products.filter((p) => p.category.toLowerCase() === category.toLowerCase())
    }

    if (storeSection) {
      products = products.filter((p) => p.storeSection.toLowerCase() === storeSection.toLowerCase())
    }

    if (minPrice && maxPrice) {
      const min = Number.parseFloat(minPrice)
      const max = Number.parseFloat(maxPrice)
      products = products.filter((p) => p.price >= min && p.price <= max)
    }

    if (dietary.length > 0) {
      products = getProductsByDietaryRestrictions(dietary)
    }

    if (featured) {
      products = getFeaturedProducts(limit)
    } else if (topRated) {
      products = getTopRatedProducts(limit)
    } else if (onSale) {
      products = getProductsOnSale()
    }

    // Apply sorting
    products.sort((a, b) => {
      let aValue: any = a[sortBy as keyof typeof a]
      let bValue: any = b[sortBy as keyof typeof b]

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (sortOrder === "desc") {
        return bValue > aValue ? 1 : -1
      }
      return aValue > bValue ? 1 : -1
    })

    // Apply pagination
    const paginatedProducts = products.slice(offset, offset + limit)

    return NextResponse.json({
      success: true,
      data: paginatedProducts,
      pagination: {
        total: products.length,
        limit,
        offset,
        hasMore: offset + limit < products.length,
      },
      filters: {
        categories: getAllCategories(),
        brands: getAllBrands(),
      },
    })
  } catch (error) {
    console.error("Products API Error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    const requiredFields = ["name", "price", "category", "brand", "description"]
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ success: false, error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Create new product
    const newProduct = {
      id: `prod_${Date.now()}`,
      name: body.name,
      price: Number.parseFloat(body.price),
      originalPrice: body.originalPrice ? Number.parseFloat(body.originalPrice) : undefined,
      image: body.image || "📦",
      category: body.category,
      subcategory: body.subcategory || "",
      brand: body.brand,
      description: body.description,
      tags: body.tags || [],
      rating: body.rating || 0,
      reviewCount: body.reviewCount || 0,
      inStock: body.inStock !== false,
      stockQuantity: body.stockQuantity || 0,
      storeSection: body.storeSection || "pantry",
      barcode: body.barcode || "",
      nutritionInfo: body.nutritionInfo || {},
      allergens: body.allergens || [],
      organic: body.organic || false,
      glutenFree: body.glutenFree || false,
      vegan: body.vegan || false,
      vegetarian: body.vegetarian || false,
      weight: body.weight || "",
      dimensions: body.dimensions || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // In a real app, you would save to database here
    PRODUCTS_DATABASE.push(newProduct)

    return NextResponse.json(
      {
        success: true,
        data: newProduct,
        message: "Product created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Create Product Error:", error)
    return NextResponse.json({ success: false, error: "Failed to create product" }, { status: 500 })
  }
}
