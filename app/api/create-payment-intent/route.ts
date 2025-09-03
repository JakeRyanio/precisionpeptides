import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
})

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = "usd", orderData, referralId } = await request.json()

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: `order_${Date.now()}`,
        customerEmail: orderData.customerInfo.email,
        customerName: `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`,
        itemCount: orderData.items.length.toString(),
        totalAmount: orderData.total.toString(),
        ...(referralId && { promotekit_referral: referralId }),
        items: JSON.stringify(
          orderData.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            purchaseType: item.purchaseType || "one-time",
          })),
        ),
        shippingAddress: JSON.stringify({
          line1: orderData.customerInfo.address,
          line2: orderData.customerInfo.address2 || "",
          city: orderData.customerInfo.city,
          state: orderData.customerInfo.state,
          postal_code: orderData.customerInfo.zipCode,
          country: orderData.customerInfo.country,
        }),
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error("Error creating payment intent:", error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : "Failed to create payment intent" 
    }, { status: 500 })
  }
}
