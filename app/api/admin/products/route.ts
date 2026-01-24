import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

const SHIPSTATION_API_BASE = 'https://ssapi.shipstation.com'

// Helper to call ShipStation API
async function shipstationRequest(
  endpoint: string, 
  method: 'GET' | 'POST' = 'GET',
  body?: object
): Promise<Response | null> {
  const apiKey = process.env.SHIPSTATION_API_KEY
  const apiSecret = process.env.SHIPSTATION_API_SECRET
  
  if (!apiKey || !apiSecret) {
    return null
  }

  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')

  return fetch(`${SHIPSTATION_API_BASE}${endpoint}`, {
    method,
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
}

// Sync product to ShipStation (create if doesn't exist)
async function syncProductToShipStation(product: {
  sku: string
  name: string
  price: number
}): Promise<{ status: string; productId?: number }> {
  try {
    // Check if product exists
    const searchRes = await shipstationRequest(`/products?sku=${encodeURIComponent(product.sku)}`)
    if (!searchRes) {
      return { status: 'not_configured' }
    }

    if (searchRes.ok) {
      const data = await searchRes.json()
      const existing = data.products?.find((p: { sku: string }) => p.sku === product.sku)
      
      if (existing) {
        console.log(`[ShipStation] Product exists: ${product.sku} (ID: ${existing.productId})`)
        return { status: 'exists', productId: existing.productId }
      }
    }

    // Create product in ShipStation
    const createRes = await shipstationRequest('/products', 'POST', {
      sku: product.sku,
      name: product.name,
      price: product.price,
      defaultCost: product.price * 0.5,
      weight: 2,
      weightUnits: 'ounces',
      active: true,
      fulfillmentSku: product.sku,
    })

    if (createRes && createRes.ok) {
      const created = await createRes.json()
      console.log(`[ShipStation] Created product: ${product.sku} (ID: ${created.productId})`)
      return { status: 'created', productId: created.productId }
    }

    console.error('[ShipStation] Failed to create product')
    return { status: 'failed' }
  } catch (error) {
    console.error('[ShipStation] Sync error:', error)
    return { status: 'error' }
  }
}

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

    // Sync to ShipStation if product has SKU
    let shipstationSync = null
    if (product.sku) {
      shipstationSync = await syncProductToShipStation({
        sku: product.sku,
        name: product.name,
        price: product.price
      })
    }

    return NextResponse.json({ 
      success: true, 
      product,
      shipstation: shipstationSync
    })
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

    // Sync to ShipStation if product has SKU and SKU or inventory was updated
    let shipstationSync = null
    if (product.sku && (updateData.sku !== undefined || updateData.inventory !== undefined)) {
      shipstationSync = await syncProductToShipStation({
        sku: product.sku,
        name: product.name,
        price: product.price
      })
    }

    return NextResponse.json({ 
      success: true, 
      product,
      shipstation: shipstationSync
    })
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
