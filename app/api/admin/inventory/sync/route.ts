import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const SHIPSTATION_V2_BASE = 'https://api.shipstation.com/v2'

interface ShipStationInventoryItem {
  sku: string
  on_hand: number
  allocated: number
  available: number
  inventory_warehouse_id: string
}

interface ShipStationInventoryResponse {
  inventory: ShipStationInventoryItem[]
  total: number
  page: number
  pages: number
}

// Helper to call ShipStation V2 API
async function shipstationV2Request(
  endpoint: string, 
  method: 'GET' | 'POST' = 'GET',
  body?: object
): Promise<Response> {
  const apiKey = process.env.SHIPSTATION_V2_API_KEY
  if (!apiKey) {
    throw new Error('SHIPSTATION_V2_API_KEY not configured')
  }

  return fetch(`${SHIPSTATION_V2_BASE}${endpoint}`, {
    method,
    headers: {
      'API-Key': apiKey,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
}

// GET: Pull inventory from ShipStation and update local database
export async function GET() {
  try {
    // Check if API key is configured
    if (!process.env.SHIPSTATION_V2_API_KEY) {
      return NextResponse.json({ 
        message: 'ShipStation V2 API key not configured',
        synced: 0 
      })
    }

    // Get all products with SKUs
    const products = await prisma.product.findMany({
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

    if (products.length === 0) {
      return NextResponse.json({ 
        message: 'No products with SKUs to sync',
        synced: 0 
      })
    }

    // Build SKU list for query
    const skus = products.map(p => p.sku).filter(Boolean) as string[]
    
    // Fetch inventory from ShipStation (paginated)
    const inventoryMap: Record<string, number> = {}
    let page = 1
    let hasMore = true

    while (hasMore) {
      const response = await shipstationV2Request(
        `/inventory?page=${page}&page_size=100`
      )

      if (!response.ok) {
        const error = await response.text()
        console.error('[ShipStation Inventory] API error:', error)
        return NextResponse.json(
          { error: 'Failed to fetch from ShipStation', details: error },
          { status: 500 }
        )
      }

      const data: ShipStationInventoryResponse = await response.json()
      
      // Map SKU to available inventory
      for (const item of data.inventory) {
        if (skus.includes(item.sku)) {
          // Use 'available' (on_hand - allocated) for accurate sellable quantity
          inventoryMap[item.sku] = (inventoryMap[item.sku] || 0) + item.available
        }
      }

      hasMore = page < data.pages
      page++
    }

    // Update local database
    const updates: { id: string; sku: string; oldInventory: number; newInventory: number }[] = []

    for (const product of products) {
      if (product.sku && inventoryMap[product.sku] !== undefined) {
        const newInventory = inventoryMap[product.sku]
        if (newInventory !== product.inventory) {
          await prisma.product.update({
            where: { id: product.id },
            data: { inventory: newInventory }
          })
          updates.push({
            id: product.id,
            sku: product.sku,
            oldInventory: product.inventory,
            newInventory
          })
        }
      }
    }

    console.log(`[ShipStation Inventory] Synced ${updates.length} products`)

    return NextResponse.json({
      message: 'Inventory sync complete',
      synced: updates.length,
      updates
    })
  } catch (error) {
    console.error('[ShipStation Inventory] Sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync inventory' },
      { status: 500 }
    )
  }
}

// POST: Push inventory update to ShipStation
export async function POST(request: NextRequest) {
  try {
    const { productId, quantity, transactionType = 'adjust' } = await request.json()

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { error: 'productId and quantity required' },
        { status: 400 }
      )
    }

    // Get product SKU
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, sku: true, name: true }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Update local database first
    await prisma.product.update({
      where: { id: productId },
      data: { inventory: quantity }
    })

    // If no SKU or no API key, just update locally
    if (!product.sku || !process.env.SHIPSTATION_V2_API_KEY) {
      return NextResponse.json({
        message: 'Local inventory updated',
        localUpdated: true,
        shipstationSynced: false,
        reason: !product.sku ? 'No SKU configured' : 'ShipStation API key not configured'
      })
    }

    // Push to ShipStation
    // Note: Requires inventory_location_id - fetch default location first
    const locationsRes = await shipstationV2Request('/inventory_locations')
    if (!locationsRes.ok) {
      console.error('[ShipStation] Failed to fetch locations')
      return NextResponse.json({
        message: 'Local inventory updated, but ShipStation sync failed',
        localUpdated: true,
        shipstationSynced: false
      })
    }

    const locations = await locationsRes.json()
    const defaultLocation = locations.locations?.[0]?.inventory_location_id

    if (!defaultLocation) {
      console.error('[ShipStation] No inventory locations configured')
      return NextResponse.json({
        message: 'Local inventory updated, but no ShipStation location configured',
        localUpdated: true,
        shipstationSynced: false
      })
    }

    const syncRes = await shipstationV2Request('/inventory', 'POST', {
      transaction_type: transactionType,
      inventory_location_id: defaultLocation,
      sku: product.sku,
      quantity: quantity,
      condition: 'sellable',
      reason: 'Admin portal update'
    })

    if (!syncRes.ok) {
      const error = await syncRes.text()
      console.error('[ShipStation] Inventory update failed:', error)
      return NextResponse.json({
        message: 'Local inventory updated, ShipStation sync failed',
        localUpdated: true,
        shipstationSynced: false,
        error
      })
    }

    console.log(`[ShipStation Inventory] Updated ${product.sku}: ${quantity}`)

    return NextResponse.json({
      message: 'Inventory updated and synced',
      localUpdated: true,
      shipstationSynced: true
    })
  } catch (error) {
    console.error('[ShipStation Inventory] Update error:', error)
    return NextResponse.json(
      { error: 'Failed to update inventory' },
      { status: 500 }
    )
  }
}
