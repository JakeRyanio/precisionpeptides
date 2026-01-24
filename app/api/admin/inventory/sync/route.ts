import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const SHIPSTATION_API_BASE = 'https://ssapi.shipstation.com'

interface ShipStationProduct {
  productId: number
  sku: string
  name: string
  warehouseLocation: string | null
  internalNotes: string | null
}

interface ShipStationProductsResponse {
  products: ShipStationProduct[]
  total: number
  page: number
  pages: number
}

// Helper to call ShipStation API with Basic Auth
async function shipstationRequest(
  endpoint: string, 
  method: 'GET' | 'POST' | 'PUT' = 'GET',
  body?: object
): Promise<Response> {
  const apiKey = process.env.SHIPSTATION_API_KEY
  const apiSecret = process.env.SHIPSTATION_API_SECRET
  
  if (!apiKey || !apiSecret) {
    throw new Error('ShipStation API credentials not configured')
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

// GET: Pull products from ShipStation (for SKU mapping reference)
export async function GET() {
  try {
    // Check if API credentials are configured
    if (!process.env.SHIPSTATION_API_KEY || !process.env.SHIPSTATION_API_SECRET) {
      return NextResponse.json({ 
        message: 'ShipStation API credentials not configured. Add SHIPSTATION_API_KEY and SHIPSTATION_API_SECRET to your environment.',
        synced: 0 
      })
    }

    // Get all products with SKUs from local database
    const localProducts = await prisma.product.findMany({
      where: {
        sku: { not: null }
      },
      select: {
        id: true,
        sku: true,
        inventory: true,
        name: true
      }
    })

    if (localProducts.length === 0) {
      return NextResponse.json({ 
        message: 'No products with SKUs to sync. Add SKUs to your products first.',
        synced: 0 
      })
    }

    // Build SKU list for matching
    const skus = localProducts.map(p => p.sku).filter(Boolean) as string[]
    
    // Fetch products from ShipStation (paginated)
    const shipstationProducts: Record<string, ShipStationProduct> = {}
    let page = 1
    let hasMore = true

    while (hasMore) {
      const response = await shipstationRequest(`/products?page=${page}&pageSize=100`)

      if (!response.ok) {
        const error = await response.text()
        console.error('[ShipStation] API error:', error)
        return NextResponse.json(
          { error: 'Failed to fetch from ShipStation', details: error },
          { status: 500 }
        )
      }

      const data: ShipStationProductsResponse = await response.json()
      
      // Map SKU to ShipStation product
      for (const product of data.products) {
        if (skus.includes(product.sku)) {
          shipstationProducts[product.sku] = product
        }
      }

      hasMore = page < data.pages
      page++
    }

    // Return matched products info
    const matched = localProducts.filter(p => p.sku && shipstationProducts[p.sku])
    const unmatched = localProducts.filter(p => p.sku && !shipstationProducts[p.sku])

    console.log(`[ShipStation] Found ${matched.length} matching products, ${unmatched.length} unmatched`)

    return NextResponse.json({
      message: 'ShipStation product sync complete',
      matched: matched.length,
      unmatched: unmatched.map(p => ({ name: p.name, sku: p.sku })),
      shipstationProducts: Object.keys(shipstationProducts).length
    })
  } catch (error) {
    console.error('[ShipStation] Sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync with ShipStation' },
      { status: 500 }
    )
  }
}

// POST: Update local inventory (ShipStation inventory is managed via their platform)
export async function POST(request: NextRequest) {
  try {
    const { productId, quantity } = await request.json()

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { error: 'productId and quantity required' },
        { status: 400 }
      )
    }

    // Get product
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, sku: true, name: true, inventory: true }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const oldInventory = product.inventory

    // Update local database
    await prisma.product.update({
      where: { id: productId },
      data: { inventory: quantity }
    })

    console.log(`[Inventory] Updated ${product.name}: ${oldInventory} → ${quantity}`)

    return NextResponse.json({
      message: 'Inventory updated successfully',
      product: product.name,
      sku: product.sku,
      oldInventory,
      newInventory: quantity,
      note: 'ShipStation inventory syncs automatically when orders ship. For manual ShipStation updates, use the ShipStation dashboard.'
    })
  } catch (error) {
    console.error('[Inventory] Update error:', error)
    return NextResponse.json(
      { error: 'Failed to update inventory' },
      { status: 500 }
    )
  }
}
