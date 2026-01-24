import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Get all products
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: 'asc' }
    })
    return NextResponse.json(products)
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

// Create a new product
export async function POST(request: Request) {
  try {
    const data = await request.json()

    const product = await prisma.product.create({
      data: {
        name: data.name,
        category: data.category,
        price: data.price,
        subscriptionPrice: data.subscriptionPrice || null,
        wholesaleBasePrice: data.wholesaleBasePrice || null,
        image: data.image || "/images/precision-peptides-vial.png",
        overview: data.overview || "High-quality research peptide for laboratory use only.",
        benefits: data.benefits || [],
        useCases: data.useCases || [],
        disclaimer: data.disclaimer || "This product is for research purposes only. Not for human consumption.",
        purity: data.purity || 99.0,
        storage: data.storage || "Store at -20°C",
        description: data.description || null,
        molecularWeight: data.molecularWeight || null,
        casNumber: data.casNumber || null,
        sequence: data.sequence || null,
        researchApplications: data.researchApplications || [],
        rating: data.rating || 5.0,
        reviewCount: data.reviewCount || 0,
        featuredReview: data.featuredReview || null,
        isActive: data.isActive !== undefined ? data.isActive : true,
        isWholesaleOnly: data.isWholesaleOnly || false,
        // New visibility controls
        activeRetail: data.activeRetail !== undefined ? data.activeRetail : true,
        activeWholesale: data.activeWholesale !== undefined ? data.activeWholesale : true,
        // Inventory fields
        sku: data.sku || null,
        inventory: data.inventory || 0,
        lowStockThreshold: data.lowStockThreshold || null,
        // Featured product fields
        featuredDescription: data.featuredDescription || null,
        featuredUseCases: data.featuredUseCases || [],
        isFeatured: data.isFeatured || false,
        featuredOrder: data.featuredOrder || null,
      }
    })

    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error("Failed to create product:", error)
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    )
  }
}

// Update product
export async function PATCH(request: Request) {
  try {
    const { productId, ...data } = await request.json()

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }

    // Build update data dynamically
    const updateData: Record<string, unknown> = {}
    
    const allowedFields = [
      'name', 'category', 'price', 'subscriptionPrice', 'wholesaleBasePrice',
      'image', 'overview', 'benefits', 'useCases', 'disclaimer', 'purity',
      'storage', 'description', 'molecularWeight', 'casNumber',
      'sequence', 'researchApplications', 'rating', 'reviewCount',
      'featuredReview', 'isActive', 'isWholesaleOnly',
      // NEW: Separate visibility controls
      'activeRetail', 'activeWholesale',
      // NEW: Inventory fields
      'sku', 'inventory', 'lowStockThreshold',
      // NEW: Featured product fields
      'featuredDescription', 'featuredUseCases', 'isFeatured', 'featuredOrder'
    ]

    for (const field of allowedFields) {
      if (data[field] !== undefined) {
        updateData[field] = data[field]
      }
    }

    // Check SKU uniqueness if being changed
    if (updateData.sku) {
      const existingProduct = await prisma.product.findFirst({
        where: { 
          sku: updateData.sku as string,
          NOT: { id: productId }
        }
      })
      if (existingProduct) {
        return NextResponse.json(
          { error: "SKU already exists" },
          { status: 400 }
        )
      }
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: updateData
    })

    return NextResponse.json({ success: true, product })
  } catch (error) {
    console.error("Failed to update product:", error)
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    )
  }
}

// Delete product
export async function DELETE(request: Request) {
  try {
    const { productId } = await request.json()

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      )
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId }
    })

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      )
    }

    // Delete any wholesale pricing for this product first
    await prisma.productWholesalePricing.deleteMany({
      where: { productId }
    })

    // Delete the product
    await prisma.product.delete({
      where: { id: productId }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete product:", error)
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    )
  }
}
