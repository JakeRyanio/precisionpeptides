import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Note: ShipStation does NOT support creating products via API.
// Products are automatically created when orders containing them are imported.
// This endpoint manages LOCAL inventory only.
// When orders ship via ShipStation webhook, inventory is automatically decremented.

// GET: Get inventory status for all products with SKUs
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        sku: { not: null }
      },
      select: {
        id: true,
        sku: true,
        name: true,
        inventory: true,
        lowStockThreshold: true,
        activeRetail: true,
        activeWholesale: true
      },
      orderBy: { name: 'asc' }
    })

    const stats = {
      total: products.length,
      inStock: products.filter(p => p.inventory > 0).length,
      lowStock: products.filter(p => p.lowStockThreshold && p.inventory <= p.lowStockThreshold && p.inventory > 0).length,
      outOfStock: products.filter(p => p.inventory === 0).length
    }

    return NextResponse.json({
      message: 'Inventory status retrieved',
      stats,
      products
    })
  } catch (error) {
    console.error('[Inventory] Error:', error)
    return NextResponse.json(
      { error: 'Failed to get inventory status' },
      { status: 500 }
    )
  }
}

// POST: Update local inventory for a product
export async function POST(request: NextRequest) {
  try {
    const { productId, quantity } = await request.json()

    if (!productId || quantity === undefined) {
      return NextResponse.json(
        { error: 'productId and quantity required' },
        { status: 400 }
      )
    }

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

    await prisma.product.update({
      where: { id: productId },
      data: { inventory: quantity }
    })

    console.log(`[Inventory] Updated ${product.name}: ${oldInventory} → ${quantity}`)

    return NextResponse.json({
      success: true,
      product: product.name,
      sku: product.sku,
      oldInventory,
      newInventory: quantity,
      note: product.sku 
        ? 'SKU set - product will sync to ShipStation when orders are placed'
        : 'No SKU - add a SKU to enable ShipStation integration'
    })
  } catch (error) {
    console.error('[Inventory] Update error:', error)
    return NextResponse.json(
      { error: 'Failed to update inventory' },
      { status: 500 }
    )
  }
}
