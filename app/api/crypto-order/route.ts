import { NextRequest, NextResponse } from "next/server"

// Zapier Webhook URL
const WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/20980160/udybu6y/"

export async function POST(request: NextRequest) {
  try {
    const { orderData } = await request.json()

    if (!orderData) {
      return NextResponse.json({ error: "Missing order data" }, { status: 400 })
    }

    const {
      items,
      customerInfo,
      total,
      paymentMethod,
      cryptocurrency,
      transactionId,
      walletAddress,
      timestamp,
      referralId,
    } = orderData

    // Generate order ID
    const orderId = `CRYPTO-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Prepare order details for webhook - standardized format for ALL orders
    const orderDetails = {
      orderId,
      orderSource: "website",
      paymentMethod: "cryptocurrency", // This field shows crypto vs stripe
      customerInfo: {
        firstName: customerInfo.firstName,
        lastName: customerInfo.lastName,
        email: customerInfo.email,
        phone: customerInfo.phone || '',
      },
      shippingAddress: {
        line1: customerInfo.address,
        line2: customerInfo.address2 || '',
        city: customerInfo.city,
        state: customerInfo.state,
        postalCode: customerInfo.zipCode,
        country: customerInfo.country,
      },
      items: items.map((item: any) => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.price * item.quantity,
        purchaseType: item.purchaseType || 'oneTime',
      })),
      totals: {
        subtotal: total,
        shipping: 0,
        tax: 0,
        total: total,
      },
      cryptoPaymentDetails: {
        cryptocurrency,
        transactionId,
        walletAddress,
        status: "pending_verification",
        referralId: referralId || null,
      },
      stripePaymentDetails: null, // null for crypto orders
      specialInstructions: customerInfo.specialInstructions || '',
      timestamp: new Date(timestamp).toISOString(),
      createdAt: new Date().toISOString(),
    }

    // Send to webhook (Zapier, Make, n8n, etc.)
    if (WEBHOOK_URL) {
      try {
        const webhookResponse = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderDetails),
        })

        if (!webhookResponse.ok) {
          console.error("Webhook failed:", await webhookResponse.text())
        } else {
          console.log("Order sent to webhook successfully")
        }
      } catch (webhookError) {
        console.error("Failed to send to webhook:", webhookError)
        // Continue processing even if webhook fails
      }
    } else {
      console.warn("No webhook URL configured. Order data:")
      console.log(JSON.stringify(orderDetails, null, 2))
    }

    // Log order for debugging
    console.log("Crypto order received:", {
      orderId,
      customerEmail: customerInfo.email,
      total,
      cryptocurrency,
      transactionId,
      timestamp,
    })

    return NextResponse.json({
      success: true,
      orderId,
      message: "Order submitted successfully. We'll verify your payment and process your order shortly.",
    })
  } catch (error) {
    console.error("Crypto order error:", error)
    return NextResponse.json(
      { error: "Failed to process order" },
      { status: 500 }
    )
  }
}

