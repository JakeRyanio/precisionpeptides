import { notFound } from "next/navigation"
import { ProductDetail } from "@/components/products/product-detail"
import { prisma } from "@/lib/prisma"

interface ProductPageProps {
  params: {
    id: string
  }
}

async function getProduct(id: string) {
  try {
    const product = await prisma.product.findFirst({
      where: { id, isActive: true, isWholesaleOnly: false }
    })

    if (!product) return null

    // Transform to match the frontend Product type
    return {
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
  } catch (error) {
    console.error("Failed to fetch product:", error)
    return null
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.id)

  if (!product) {
    notFound()
  }

  return <ProductDetail product={product} />
}

// Generate static params for all retail products at build time
export async function generateStaticParams() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, isWholesaleOnly: false },
      select: { id: true }
    })
    return products.map((product) => ({
      id: product.id,
    }))
  } catch {
    return []
  }
}

// Revalidate every 60 seconds to pick up product changes
export const revalidate = 60
