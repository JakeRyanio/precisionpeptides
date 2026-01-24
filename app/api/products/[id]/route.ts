import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Get a single product by ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: params.id, isActive: true, isWholesaleOnly: false }
    })

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Transform to match the frontend Product type
    const transformedProduct = {
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
    }

    return NextResponse.json(transformedProduct)
  } catch (error) {
    console.error("Failed to fetch product:", error)
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    )
  }
}
