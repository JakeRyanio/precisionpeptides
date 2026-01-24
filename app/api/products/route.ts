import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Get all active products for the public shop (excluding wholesale-only)
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { 
        activeRetail: true  // Use new activeRetail field for retail shop visibility
      },
      orderBy: { name: 'asc' }
    })
    
    // Transform to match the frontend Product type
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
      reviews: {
        rating: product.rating,
        count: product.reviewCount,
        featured: product.featuredReview
      }
    }))
    
    return NextResponse.json(transformedProducts)
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}
