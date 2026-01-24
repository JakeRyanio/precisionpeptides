import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { create } from 'xmlbuilder2'
import { formatInTimeZone } from 'date-fns-tz'
import { XMLParser } from 'fast-xml-parser'

// ============================================================
// AUTHENTICATION
// ============================================================

function validateBasicAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Basic ')) return false
  
  const base64Credentials = authHeader.split(' ')[1]
  const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8')
  const [username, password] = credentials.split(':')
  
  return (
    username === process.env.SHIPSTATION_USERNAME &&
    password === process.env.SHIPSTATION_PASSWORD
  )
}

// ============================================================
// DATE FORMATTING
// ============================================================

// ShipStation format: MM/dd/yyyy HH:mm (UTC)
function formatDateForShipStation(date: Date): string {
  return formatInTimeZone(date, 'UTC', 'MM/dd/yyyy HH:mm')
}

// Parse ShipStation date format
function parseShipStationDate(dateStr: string): Date {
  // Handle format: MM/dd/yyyy HH:mm
  const [datePart, timePart] = dateStr.split(' ')
  const [month, day, year] = datePart.split('/').map(Number)
  const [hours, minutes] = timePart.split(':').map(Number)
  return new Date(Date.UTC(year, month - 1, day, hours, minutes))
}

// ============================================================
// ORDER STATUS MAPPING
// ============================================================

// Map internal status to ShipStation-compatible status
function mapOrderStatus(status: string): string {
  const mapping: Record<string, string> = {
    'PENDING': 'unpaid',
    'PROCESSING': 'paid',
    'SHIPPED': 'shipped',
    'DELIVERED': 'shipped', // ShipStation treats delivered as shipped
    'CANCELLED': 'cancelled',
    'REFUNDED': 'cancelled',
  }
  return mapping[status] || 'unpaid'
}

// ============================================================
// SKU GENERATION
// ============================================================

// Generate SKU from product name/id
function generateSKU(productId: string, productName: string): string {
  // Use product name to create readable SKU
  // e.g., "BPC 157 10mg" -> "BPC15710MG"
  const sku = productName
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .substring(0, 20)
  return sku || productId.substring(0, 10)
}

// ============================================================
// XML GENERATION
// ============================================================

interface OrderWithItems {
  id: string
  orderId: string
  createdAt: Date
  updatedAt: Date
  orderStatus: string
  paymentMethod: string
  total: number
  tax: number | null
  shipping: number | null
  specialInstructions: string | null
  wholesaleAccountId: string | null
  paymentStatus: string
  customerEmail: string
  customerName: string | null
  customerPhone: string | null
  shippingLine1: string
  shippingLine2: string | null
  shippingCity: string
  shippingState: string
  shippingPostalCode: string
  shippingCountry: string
  items: {
    id: string
    productId: string
    name: string
    quantity: number
    price: number
  }[]
}

function generateOrdersXML(orders: OrderWithItems[], totalPages: number): string {
  const doc = create({ version: '1.0', encoding: 'utf-8' })
  const ordersEl = doc.ele('Orders', { pages: totalPages.toString() })
  
  for (const order of orders) {
    const orderEl = ordersEl.ele('Order')
    
    // Required fields
    orderEl.ele('OrderID').dat(order.id).up()
    orderEl.ele('OrderNumber').dat(order.orderId).up()
    orderEl.ele('OrderDate').txt(formatDateForShipStation(order.createdAt)).up()
    orderEl.ele('OrderStatus').dat(mapOrderStatus(order.orderStatus)).up()
    orderEl.ele('LastModified').txt(formatDateForShipStation(order.updatedAt)).up()
    
    // Optional fields
    orderEl.ele('ShippingMethod').dat('').up()
    orderEl.ele('PaymentMethod').dat(order.paymentMethod || '').up()
    orderEl.ele('CurrencyCode').txt('USD').up()
    orderEl.ele('OrderTotal').txt(order.total.toFixed(2)).up()
    orderEl.ele('TaxAmount').txt((order.tax || 0).toFixed(2)).up()
    orderEl.ele('ShippingAmount').txt((order.shipping || 0).toFixed(2)).up()
    orderEl.ele('CustomerNotes').dat(order.specialInstructions || '').up()
    orderEl.ele('InternalNotes').dat('').up()
    orderEl.ele('Gift').txt('false').up()
    orderEl.ele('GiftMessage').txt('').up()
    
    // Custom fields - use for order type differentiation
    orderEl.ele('CustomField1').dat(order.wholesaleAccountId ? 'wholesale' : 'retail').up()
    orderEl.ele('CustomField2').dat(order.paymentStatus || '').up()
    orderEl.ele('CustomField3').dat('').up()
    
    // Customer
    const customerEl = orderEl.ele('Customer')
    customerEl.ele('CustomerCode').dat(order.customerEmail).up()
    
    // BillTo (use shipping address if no separate billing)
    const billToEl = customerEl.ele('BillTo')
    billToEl.ele('Name').dat(order.customerName || order.customerEmail).up()
    billToEl.ele('Company').dat('').up()
    billToEl.ele('Phone').dat(order.customerPhone || '').up()
    billToEl.ele('Email').dat(order.customerEmail).up()
    billToEl.up()
    
    // ShipTo
    const shipToEl = customerEl.ele('ShipTo')
    shipToEl.ele('Name').dat(order.customerName || order.customerEmail).up()
    shipToEl.ele('Company').dat('').up()
    shipToEl.ele('Address1').dat(order.shippingLine1).up()
    shipToEl.ele('Address2').dat(order.shippingLine2 || '').up()
    shipToEl.ele('City').dat(order.shippingCity).up()
    shipToEl.ele('State').dat(order.shippingState).up()
    shipToEl.ele('PostalCode').dat(order.shippingPostalCode).up()
    shipToEl.ele('Country').dat(order.shippingCountry).up()
    shipToEl.ele('Phone').dat(order.customerPhone || '').up()
    shipToEl.up()
    
    customerEl.up()
    
    // Items
    const itemsEl = orderEl.ele('Items')
    for (const item of order.items) {
      const itemEl = itemsEl.ele('Item')
      itemEl.ele('LineItemID').dat(item.id).up()
      itemEl.ele('SKU').dat(generateSKU(item.productId, item.name)).up()
      itemEl.ele('Name').dat(item.name).up()
      itemEl.ele('ImageUrl').dat('').up()
      itemEl.ele('Weight').txt('2').up() // Default weight in ounces
      itemEl.ele('WeightUnits').txt('Ounces').up()
      itemEl.ele('Quantity').txt(item.quantity.toString()).up()
      itemEl.ele('UnitPrice').txt(item.price.toFixed(2)).up()
      itemEl.ele('Location').dat('').up()
      itemEl.up()
    }
    itemsEl.up()
    
    orderEl.up()
  }
  
  return doc.end({ prettyPrint: false })
}

// ============================================================
// GET HANDLER - Order Export
// ============================================================

export async function GET(request: NextRequest) {
  // Validate authentication
  if (!validateBasicAuth(request)) {
    return new NextResponse('Unauthorized', {
      status: 401,
      headers: { 'WWW-Authenticate': 'Basic realm="ShipStation"' },
    })
  }
  
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const startDateStr = searchParams.get('start_date')
  const endDateStr = searchParams.get('end_date')
  const page = parseInt(searchParams.get('page') || '1', 10)
  
  // Validate action
  if (action !== 'export') {
    return new NextResponse('Invalid action', { status: 400 })
  }
  
  if (!startDateStr || !endDateStr) {
    return new NextResponse('Missing date parameters', { status: 400 })
  }
  
  try {
    let startDate: Date
    let endDate: Date
    
    try {
      startDate = parseShipStationDate(decodeURIComponent(startDateStr))
      endDate = parseShipStationDate(decodeURIComponent(endDateStr))
    } catch (dateError) {
      console.error('[ShipStation] Date parsing error:', dateError)
      return new NextResponse(`Date parsing error: ${dateError}`, { status: 400 })
    }
    
    const PAGE_SIZE = 100
    const offset = (page - 1) * PAGE_SIZE
    
    // Query orders modified between start and end date
    let orders: OrderWithItems[]
    let totalCount: number
    
    try {
      const results = await Promise.all([
        prisma.order.findMany({
          where: {
            updatedAt: {
              gte: startDate,
              lte: endDate,
            },
          },
          include: {
            items: true,
          },
          orderBy: { updatedAt: 'asc' },
          skip: offset,
          take: PAGE_SIZE,
        }),
        prisma.order.count({
          where: {
            updatedAt: {
              gte: startDate,
              lte: endDate,
            },
          },
        }),
      ])
      orders = results[0] as OrderWithItems[]
      totalCount = results[1]
    } catch (dbError) {
      console.error('[ShipStation] Database error:', dbError)
      return new NextResponse(`Database error: ${dbError instanceof Error ? dbError.message : String(dbError)}`, { status: 500 })
    }
    
    let xml: string
    try {
      const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
      xml = generateOrdersXML(orders, totalPages)
      console.log(`[ShipStation] Exported ${orders.length} orders (page ${page}/${totalPages})`)
    } catch (xmlError) {
      console.error('[ShipStation] XML generation error:', xmlError)
      return new NextResponse(`XML generation error: ${xmlError instanceof Error ? xmlError.message : String(xmlError)}`, { status: 500 })
    }
    
    return new NextResponse(xml, {
      status: 200,
      headers: { 'Content-Type': 'application/xml' },
    })
  } catch (error) {
    console.error('[ShipStation] Export error:', error)
    return new NextResponse(`Internal server error: ${error instanceof Error ? error.message : String(error)}`, { status: 500 })
  }
}

// ============================================================
// POST HANDLER - Ship Notify
// ============================================================

export async function POST(request: NextRequest) {
  // Validate authentication
  if (!validateBasicAuth(request)) {
    return new NextResponse('Unauthorized', { status: 401 })
  }
  
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  
  if (action !== 'shipnotify') {
    return new NextResponse('Invalid action', { status: 400 })
  }
  
  // Get data from URL params
  const orderNumber = searchParams.get('order_number')
  const carrier = searchParams.get('carrier')
  const service = searchParams.get('service')
  const trackingNumber = searchParams.get('tracking_number')
  
  if (!orderNumber) {
    return new NextResponse('Missing order_number', { status: 400 })
  }
  
  try {
    // Also parse the XML body for additional data
    const body = await request.text()
    let shipNoticeData: Record<string, unknown> = {}
    
    if (body) {
      const parser = new XMLParser()
      const parsed = parser.parse(body)
      shipNoticeData = (parsed.ShipNotice || {}) as Record<string, unknown>
    }
    
    // Find the order by orderId (OrderNumber in ShipStation terms)
    const order = await prisma.order.findUnique({
      where: { orderId: orderNumber },
    })
    
    if (!order) {
      console.error(`[ShipStation] Order not found: ${orderNumber}`)
      return new NextResponse('Order not found', { status: 404 })
    }
    
    // Parse ship date from ShipStation format or body
    let shipDateValue: Date = new Date()
    if (shipNoticeData.ShipDate && typeof shipNoticeData.ShipDate === 'string') {
      try {
        // ShipDate format from ShipStation is typically MM/dd/yyyy
        const [month, day, year] = shipNoticeData.ShipDate.split('/').map(Number)
        shipDateValue = new Date(Date.UTC(year, month - 1, day))
      } catch {
        shipDateValue = new Date()
      }
    }
    
    // Parse label create date
    let labelCreateDateValue: Date | null = null
    if (shipNoticeData.LabelCreateDate && typeof shipNoticeData.LabelCreateDate === 'string') {
      try {
        labelCreateDateValue = parseShipStationDate(shipNoticeData.LabelCreateDate)
      } catch {
        labelCreateDateValue = null
      }
    }
    
    // Update order with shipping info
    await prisma.order.update({
      where: { orderId: orderNumber },
      data: {
        orderStatus: 'SHIPPED',
        trackingNumber: trackingNumber || (shipNoticeData.TrackingNumber as string) || null,
        carrier: carrier || (shipNoticeData.Carrier as string) || null,
        shippingService: service || (shipNoticeData.Service as string) || null,
        shippingCost: shipNoticeData.ShippingCost ? parseFloat(String(shipNoticeData.ShippingCost)) : null,
        shipDate: shipDateValue,
        labelCreateDate: labelCreateDateValue,
      },
    })
    
    console.log(`[ShipStation] Order shipped: ${orderNumber}, Tracking: ${trackingNumber}`)
    
    // Decrement inventory for order items
    const orderWithItems = await prisma.order.findUnique({
      where: { orderId: orderNumber },
      include: { items: true }
    })

    if (orderWithItems?.items) {
      for (const item of orderWithItems.items) {
        // Find product by productId and decrement inventory
        await prisma.product.updateMany({
          where: { 
            id: item.productId,
            inventory: { gt: 0 }  // Prevent negative inventory
          },
          data: {
            inventory: { decrement: item.quantity }
          }
        })
      }
      console.log(`[ShipStation] Decremented inventory for order ${orderNumber}`)
    }
    
    // Return success (2xx required)
    return new NextResponse('OK', { status: 200 })
  } catch (error) {
    console.error('[ShipStation] Ship notify error:', error)
    return new NextResponse('Internal server error', { status: 500 })
  }
}
