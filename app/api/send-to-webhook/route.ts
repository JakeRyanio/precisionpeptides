import { NextRequest, NextResponse } from "next/server"

// Zapier Webhook URL - hardcoded as requested
const WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/20980160/udybu6y/"

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json()

    // Send to Zapier webhook
    const webhookResponse = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })

    if (!webhookResponse.ok) {
      console.error("Webhook failed:", await webhookResponse.text())
      return NextResponse.json(
        { success: false, error: "Webhook failed" },
        { status: 500 }
      )
    }

    const result = await webhookResponse.json()
    console.log("Order sent to Zapier successfully:", result)

    return NextResponse.json({ 
      success: true, 
      webhookResult: result 
    })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to send to webhook" },
      { status: 500 }
    )
  }
}

