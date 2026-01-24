import { NextResponse } from "next/server"

const SHIPSTATION_API_BASE = 'https://ssapi.shipstation.com'

// Test ShipStation API connection and create a test product
export async function GET() {
  const apiKey = process.env.SHIPSTATION_API_KEY
  const apiSecret = process.env.SHIPSTATION_API_SECRET
  
  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    credentials: {
      apiKeySet: !!apiKey,
      apiSecretSet: !!apiSecret,
      apiKeyLength: apiKey?.length || 0,
      apiSecretLength: apiSecret?.length || 0,
    }
  }

  if (!apiKey || !apiSecret) {
    return NextResponse.json({
      ...results,
      error: 'ShipStation credentials not configured',
      help: 'Add SHIPSTATION_API_KEY and SHIPSTATION_API_SECRET to Vercel environment variables'
    })
  }

  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')

  // Test 1: List existing products
  try {
    console.log('[ShipStation Test] Fetching products...')
    const listRes = await fetch(`${SHIPSTATION_API_BASE}/products?pageSize=5`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    })

    const listStatus = listRes.status
    const listText = await listRes.text()
    
    results.listProducts = {
      status: listStatus,
      ok: listRes.ok,
      response: listStatus === 200 ? JSON.parse(listText) : listText
    }
    
    console.log('[ShipStation Test] List products status:', listStatus)
  } catch (error) {
    results.listProducts = { error: String(error) }
    console.error('[ShipStation Test] List error:', error)
  }

  // Test 2: Try to create a test product
  try {
    console.log('[ShipStation Test] Creating test product...')
    const testProduct = {
      sku: `TEST-${Date.now()}`,
      name: 'API Test Product (can delete)',
      price: 9.99,
      defaultCost: 5.00,
      weight: 2,
      weightUnits: 'ounces',
      active: true,
    }

    const createRes = await fetch(`${SHIPSTATION_API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testProduct),
    })

    const createStatus = createRes.status
    const createText = await createRes.text()
    
    results.createProduct = {
      status: createStatus,
      ok: createRes.ok,
      sentData: testProduct,
      response: createStatus === 200 || createStatus === 201 ? JSON.parse(createText) : createText
    }
    
    console.log('[ShipStation Test] Create product status:', createStatus)
    console.log('[ShipStation Test] Create response:', createText)
  } catch (error) {
    results.createProduct = { error: String(error) }
    console.error('[ShipStation Test] Create error:', error)
  }

  // Test 3: Check stores/accounts
  try {
    console.log('[ShipStation Test] Fetching stores...')
    const storesRes = await fetch(`${SHIPSTATION_API_BASE}/stores`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
    })

    const storesStatus = storesRes.status
    const storesText = await storesRes.text()
    
    results.stores = {
      status: storesStatus,
      ok: storesRes.ok,
      response: storesStatus === 200 ? JSON.parse(storesText) : storesText
    }
  } catch (error) {
    results.stores = { error: String(error) }
  }

  return NextResponse.json(results)
}
