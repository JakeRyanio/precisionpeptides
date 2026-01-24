import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Get featured products (highest inventory, active for retail)
export async function GET() {
  try {
    // First, try to get manually featured products
    const manuallyFeatured = await prisma.product.findMany({
      where: { 
        activeRetail: true,
        isFeatured: true
      },
      orderBy: [
        { featuredOrder: 'asc' },
        { inventory: 'desc' }
      ],
      take: 6
    })

    // If we have enough manually featured, return them
    if (manuallyFeatured.length >= 3) {
      return NextResponse.json(transformProducts(manuallyFeatured))
    }

    // Otherwise, fill with highest inventory products
    const featuredIds = manuallyFeatured.map(p => p.id)
    const highInventoryProducts = await prisma.product.findMany({
      where: { 
        activeRetail: true,
        inventory: { gt: 0 },
        id: { notIn: featuredIds }
      },
      orderBy: { inventory: 'desc' },
      take: 6 - manuallyFeatured.length
    })

    const combined = [...manuallyFeatured, ...highInventoryProducts]
    
    return NextResponse.json(transformProducts(combined))
  } catch (error) {
    console.error("Failed to fetch featured products:", error)
    return NextResponse.json(
      { error: "Failed to fetch featured products" },
      { status: 500 }
    )
  }
}

interface ProductWithFields {
  id: string
  name: string
  category: string
  price: number
  subscriptionPrice: number | null
  image: string
  overview: string
  inventory: number
  featuredDescription: string | null
  featuredUseCases: string[]
  useCases: string[]
  rating: number
  reviewCount: number
}

function transformProducts(products: ProductWithFields[]) {
  return products.map(product => ({
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    subscriptionPrice: product.subscriptionPrice,
    image: product.image,
    overview: product.overview,
    inventory: product.inventory,
    featuredDescription: product.featuredDescription,
    featuredUseCases: product.featuredUseCases || product.useCases || [],
    reviews: {
      rating: product.rating,
      count: product.reviewCount,
    }
  }))
}
