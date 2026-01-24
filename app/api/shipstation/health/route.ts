import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    status: 'ok', 
    service: 'shipstation-integration',
    timestamp: new Date().toISOString() 
  })
}
