import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const SHIPSTATION_API_BASE = 'https://ssapi.shipstation.com'

interface ShipStationProduct {
  productId: number
  sku: string
  name: string
  price: number
  defaultCost: number | null
  length: number | null
  width: number | null
  height: number | null
  weight: number | null
  warehouseLocation: string | null
  internalNotes: string | null
  active: boolean
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

// Check if product exists in ShipStation by SKU
async function findShipStationProductBySku(sku: string): Promise<ShipStationProduct | null> {
  try {
    const response = await shipstationRequest(`/products?sku=${encodeURIComponent(sku)}`)
    
    if (!response.ok) {
      console.error('[ShipStation] Failed to search for product:', await response.text())
      return null
    }

    const data: ShipStationProductsResponse = await response.json()
    
    // Find exact SKU match
    const match = data.products.find(p => p.sku === sku)
    return match || null
  } catch (error) {
    console.error('[ShipStation] Error searching for product:', error)
    return null
  }
}

// Create product in ShipStation
async function createShipStationProduct(product: {
  sku: string
  name: string
  price: number
  weight?: number
}): Promise<ShipStationProduct | null> {
  try {
    const response = await shipstationRequest('/products', 'POST', {
      sku: product.sku,
      name: product.name,
      price: product.price,
      defaultCost: product.price * 0.5, // Default cost at 50% of price
      weight: product.weight || 2, // Default weight in ounces
      weightUnits: 'ounces',
      active: true,
      productCategory: null,
      productType: null,
      fulfillmentSku: product.sku,
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('[ShipStation] Failed to create product:', error)
      return null
    }

    const created = await response.json()
    console.log(`[ShipStation] Created product: ${product.name} (SKU: ${product.sku})`)
    return created
  } catch (error) {
    console.error('[ShipStation] Error creating product:', error)
    return null
  }
}

// GET: Pull products from ShipStation and sync/create missing ones
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
        name: true,
        price: true
      }
    })

    if (localProducts.length === 0) {
      return NextResponse.json({ 
        message: 'No products with SKUs to sync. Add SKUs to your products first.',
        synced: 0 
      })
    }

    // Fetch all products from ShipStation (paginated)
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
        shipstationProducts[product.sku] = product
      }

      hasMore = page < data.pages
      page++
    }

    // Find products that exist locally but not in ShipStation
    const matched: { name: string; sku: string }[] = []
    const created: { name: string; sku: string }[] = []
    const failed: { name: string; sku: string; error: string }[] = []

    for (const product of localProducts) {
      if (!product.sku) continue

      if (shipstationProducts[product.sku]) {
        matched.push({ name: product.name, sku: product.sku })
      } else {
        // Product doesn't exist in ShipStation - create it
        const created_product = await createShipStationProduct({
          sku: product.sku,
          name: product.name,
          price: product.price
        })

        if (created_product) {
          created.push({ name: product.name, sku: product.sku })
        } else {
          failed.push({ name: product.name, sku: product.sku, error: 'Failed to create in ShipStation' })
        }
      }
    }

    console.log(`[ShipStation] Sync complete: ${matched.length} matched, ${created.length} created, ${failed.length} failed`)

    return NextResponse.json({
      message: 'ShipStation product sync complete',
      matched: matched.length,
      created: created.length,
      failed: failed.length,
      details: {
        matched,
        created,
        failed
      }
    })
  } catch (error) {
    console.error('[ShipStation] Sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync with ShipStation' },
      { status: 500 }
    )
  }
}

// POST: Update inventory and ensure product exists in ShipStation
export async function POST(request: NextRequest) {
  try {
    const { productId, quantity } = await request.json()

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { error: 'productId and quantity required' },
        { status: 400 }
      )
    }

    // Get full product details
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { 
        id: true, 
        sku: true, 
        name: true, 
        price: true,
        inventory: true 
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    const oldInventory = product.inventory
    let shipstationStatus = 'skipped'
    let shipstationProductId: number | null = null

    // If product has SKU and ShipStation is configured, sync to ShipStation
    if (product.sku && process.env.SHIPSTATION_API_KEY && process.env.SHIPSTATION_API_SECRET) {
      // Check if product exists in ShipStation
      const existingProduct = await findShipStationProductBySku(product.sku)

      if (existingProduct) {
        shipstationStatus = 'exists'
        shipstationProductId = existingProduct.productId
        console.log(`[ShipStation] Product already exists: ${product.sku} (ID: ${existingProduct.productId})`)
      } else {
        // Create product in ShipStation
        const createdProduct = await createShipStationProduct({
          sku: product.sku,
          name: product.name,
          price: product.price
        })

        if (createdProduct) {
          shipstationStatus = 'created'
          shipstationProductId = createdProduct.productId
          console.log(`[ShipStation] Created new product: ${product.sku} (ID: ${createdProduct.productId})`)
        } else {
          shipstationStatus = 'failed'
          console.error(`[ShipStation] Failed to create product: ${product.sku}`)
        }
      }
    } else if (!product.sku) {
      shipstationStatus = 'no_sku'
    } else {
      shipstationStatus = 'not_configured'
    }

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
      shipstation: {
        status: shipstationStatus,
        productId: shipstationProductId,
        message: getShipStationStatusMessage(shipstationStatus)
      }
    })
  } catch (error) {
    console.error('[Inventory] Update error:', error)
    return NextResponse.json(
      { error: 'Failed to update inventory' },
      { status: 500 }
    )
  }
}

function getShipStationStatusMessage(status: string): string {
  switch (status) {
    case 'exists':
      return 'Product already exists in ShipStation'
    case 'created':
      return 'Product created in ShipStation'
    case 'failed':
      return 'Failed to create product in ShipStation'
    case 'no_sku':
      return 'Product has no SKU - add a SKU to sync with ShipStation'
    case 'not_configured':
      return 'ShipStation API not configured'
    default:
      return 'ShipStation sync skipped'
  }
}
