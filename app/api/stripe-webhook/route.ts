import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil",
})

// Zapier Webhook URL
const WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/20980160/udybu6y/"

// This is your Stripe webhook secret - you'll need to set this up in Stripe Dashboard
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || ""

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get("stripe-signature")!

  let event: Stripe.Event

  try {
    // Verify the webhook signature if secret is configured
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
    } else {
      // For testing without webhook secret (not recommended for production)
      event = JSON.parse(body) as Stripe.Event
    }
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`)
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    )
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session

      // Retrieve the full session with line items
      const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ["line_items", "customer"],
      })

      // Get customer details
      const customer = fullSession.customer_details

      // Prepare order data for Zapier
      const orderDetails = {
        orderId: fullSession.metadata?.orderId || `STRIPE-${Date.now()}`,
        orderSource: "website",
        paymentMethod: "stripe", // This field shows crypto vs stripe
        customerInfo: {
          firstName: customer?.name?.split(" ")[0] || "",
          lastName: customer?.name?.split(" ").slice(1).join(" ") || "",
          email: customer?.email || "",
          phone: customer?.phone || "",
        },
        shippingAddress: {
          line1: customer?.address?.line1 || "",
          line2: customer?.address?.line2 || "",
          city: customer?.address?.city || "",
          state: customer?.address?.state || "",
          postalCode: customer?.address?.postal_code || "",
          country: customer?.address?.country || "",
        },
        items: fullSession.line_items?.data.map((item: any) => ({
          productId: item.price?.product || "",
          name: item.description || "",
          quantity: item.quantity || 1,
          price: (item.amount_total || 0) / 100 / (item.quantity || 1),
          subtotal: (item.amount_total || 0) / 100,
          purchaseType: fullSession.mode === "subscription" ? "subscription" : "oneTime",
        })) || [],
        totals: {
          subtotal: (fullSession.amount_subtotal || 0) / 100,
          shipping: (fullSession.total_details?.amount_shipping || 0) / 100,
          tax: (fullSession.total_details?.amount_tax || 0) / 100,
          total: (fullSession.amount_total || 0) / 100,
        },
        stripePaymentDetails: {
          sessionId: fullSession.id,
          paymentIntentId: fullSession.payment_intent as string || null,
          subscriptionId: fullSession.subscription as string || null,
          paymentStatus: fullSession.payment_status,
          mode: fullSession.mode,
          referralId: fullSession.metadata?.promotekit_referral || null,
        },
        cryptoPaymentDetails: null, // null for Stripe orders
        specialInstructions: "",
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      }

      // Send to Zapier webhook
      try {
        const webhookResponse = await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderDetails),
        })

        if (!webhookResponse.ok) {
          console.error("Failed to send to Zapier:", await webhookResponse.text())
        } else {
          console.log("Stripe order sent to Zapier successfully")
        }
      } catch (error) {
        console.error("Error sending to Zapier:", error)
      }

      break
    }

    case "payment_intent.succeeded": {
      // Handle successful payment for one-time purchases
      console.log("Payment succeeded:", event.data.object)
      break
    }

    case "customer.subscription.created": {
      // Handle new subscription
      console.log("Subscription created:", event.data.object)
      break
    }

    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
