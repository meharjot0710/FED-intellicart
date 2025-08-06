import { type NextRequest, NextResponse } from "next/server"
import { getProductById, getProductRecommendations, PRODUCTS_DATABASE } from "@/lib/products-database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const product = getProductById(params.id)

    if (!product) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    const recommendations = getProductRecommendations(params.id)

    return NextResponse.json({
      success: true,
      data: {
        product,
        recommendations,
      },
    })
  } catch (error) {
    console.error("Get Product Error:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const productIndex = PRODUCTS_DATABASE.findIndex((p) => p.id === params.id)

    if (productIndex === -1) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    // Update product
    const updatedProduct = {
      ...PRODUCTS_DATABASE[productIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    }

    PRODUCTS_DATABASE[productIndex] = updatedProduct

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: "Product updated successfully",
    })
  } catch (error) {
    console.error("Update Product Error:", error)
    return NextResponse.json({ success: false, error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productIndex = PRODUCTS_DATABASE.findIndex((p) => p.id === params.id)

    if (productIndex === -1) {
      return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 })
    }

    // Remove product
    PRODUCTS_DATABASE.splice(productIndex, 1)

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    })
  } catch (error) {
    console.error("Delete Product Error:", error)
    return NextResponse.json({ success: false, error: "Failed to delete product" }, { status: 500 })
  }
}
