import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Get all active products for wholesale shop (includes all products with availability status)
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { 
        isActive: true
      },
      orderBy: { name: 'asc' }
    })
    
    // Transform to match the frontend Product type, including wholesale availability
    const transformedProducts = products.map(product => ({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price,
      subscriptionPrice: product.subscriptionPrice,
      image: product.image,
      overview: product.overview,
      benefits: product.benefits,
      useCases: product.useCases,
      disclaimer: product.disclaimer,
      purity: product.purity,
      storage: product.storage,
      description: product.description,
      molecularWeight: product.molecularWeight,
      casNumber: product.casNumber,
      sequence: product.sequence,
      researchApplications: product.researchApplications,
      // Include wholesale availability status
      activeWholesale: product.activeWholesale,
      inventory: product.inventory,
      reviews: {
        rating: product.rating,
        count: product.reviewCount,
        featured: product.featuredReview
      }
    }))
    
    return NextResponse.json(transformedProducts)
  } catch (error) {
    console.error("Failed to fetch wholesale products:", error)
    return NextResponse.json(
      { error: "Failed to fetch wholesale products" },
      { status: 500 }
    )
  }
}
