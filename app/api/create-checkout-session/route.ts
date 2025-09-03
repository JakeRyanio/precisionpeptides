import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { createLineItemsFromCart } from "@/lib/stripe-products"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
})

export async function POST(request: NextRequest) {
  try {
    const { orderData, referralId } = await request.json()

    // Create line items from cart
    const lineItems = createLineItemsFromCart(orderData.items)

    // Check if any items are subscriptions to determine the mode
    const hasSubscriptions = orderData.items.some((item: any) => item.purchaseType === "subscription")
    const mode = hasSubscriptions ? "subscription" : "payment"

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: mode,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/checkout`,
      customer_email: orderData.customerInfo.email,
      metadata: {
        orderId: `order_${Date.now()}`,
        customerName: `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`,
        hasSubscriptions: hasSubscriptions.toString(),
        ...(referralId && { promotekit_referral: referralId }),
      },
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "AU"],
      },
      billing_address_collection: "required",
      // Add subscription-specific settings
      ...(hasSubscriptions && {
        subscription_data: {
          metadata: {
            customerName: `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}`,
            customerEmail: orderData.customerInfo.email,
          },
        },
      }),
    })

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      mode: mode,
    })
  } catch (error) {
    console.error("Error creating checkout session:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create checkout session",
      },
      { status: 500 },
    )
  }
}
