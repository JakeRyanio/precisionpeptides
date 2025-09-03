"use client"

import React, { useState, useEffect } from "react"

// TypeScript declaration for PromoteKit global variable
declare global {
  interface Window {
    promotekit_referral?: string;
  }
}
import { useRouter } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { useCart } from "@/components/cart/cart-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { ShoppingCart, CreditCard, Truck, Shield, ArrowLeft, Wallet } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { CryptoPayment } from "@/components/checkout/crypto-payment"

// Initialize Stripe with proper error handling
const getStripePromise = () => {
  try {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    if (!publishableKey || publishableKey === "pk_test_placeholder") {
      console.warn("Stripe publishable key not configured")
      return null
    }
    return loadStripe(publishableKey)
  } catch (error) {
    console.error("Failed to initialize Stripe:", error)
    return null
  }
}

interface CheckoutFormData {
  email: string
  firstName: string
  lastName: string
  address: string
  address2: string
  city: string
  state: string
  zipCode: string
  country: string
  phone: string
  specialInstructions: string
}

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const { items, total, clearCart } = useCart()

  const [formData, setFormData] = useState<CheckoutFormData>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "US",
    phone: "",
    specialInstructions: "",
  })

  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isStripeReady, setIsStripeReady] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto">("card")
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false)
  const [referralId, setReferralId] = useState<string | null>(null)

  useEffect(() => {
    if (stripe && elements) {
      setIsStripeReady(true)
    }
  }, [stripe, elements])

  // Capture PromoteKit referral ID
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check for referral ID in URL parameters first
      const urlParams = new URLSearchParams(window.location.search)
      const urlReferral = urlParams.get('ref') || urlParams.get('referral')
      
      if (urlReferral) {
        setReferralId(urlReferral)
      } else {
        // Check for PromoteKit referral ID
        const checkPromoteKit = () => {
          if (window.promotekit_referral) {
            setReferralId(window.promotekit_referral)
          }
        }
        
        // Check immediately and after a delay for script to load
        checkPromoteKit()
        const timer = setTimeout(checkPromoteKit, 1000)
        return () => clearTimeout(timer)
      }
    }
  }, [])

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCryptoSuccess = () => {
    clearCart()
    router.push("/checkout/success?payment_method=crypto")
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!disclaimerAccepted) {
      setError("Please accept the research disclaimer to continue")
      return
    }

    if (!stripe || !elements) {
      setError("Payment processing is not available. Please refresh the page and try again.")
      return
    }

    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === "pk_test_placeholder") {
      setError("Payment processing is not configured. Please contact support.")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const response = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: Math.round(total * 100),
          currency: "usd",
          referralId,
          orderData: {
            items,
            customerInfo: formData,
            total,
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }

      const { clientSecret, error: serverError } = await response.json()

      if (serverError) {
        throw new Error(serverError)
      }

      if (!clientSecret) {
        throw new Error("No payment intent received from server")
      }

      const cardElement = elements.getElement(CardElement)
      if (!cardElement) {
        throw new Error("Card element not found")
      }

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            address: {
              line1: formData.address,
              line2: formData.address2 || undefined,
              city: formData.city,
              state: formData.state,
              postal_code: formData.zipCode,
              country: formData.country,
            },
          },
        },
      })

      if (stripeError) {
        throw new Error(stripeError.message)
      }

      if (paymentIntent?.status === "succeeded") {
        clearCart()
        router.push(`/checkout/success?payment_intent=${paymentIntent.id}`)
      }
    } catch (err) {
      console.error("Checkout error:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsProcessing(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <ShoppingCart className="h-16 w-16 text-[#beb2a4] mx-auto mb-6" />
          <h2 className="text-2xl font-medium text-[#ebe7e4] mb-4">Your cart is empty</h2>
          <p className="text-[#beb2a4] mb-8">Add some products to your cart before checking out.</p>
          <Link href="/shop">
            <Button className="bg-[#d2c6b8] hover:bg-[#beb2a4] text-[#201c1a] font-medium">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href="/shop" className="inline-flex items-center text-[#d2c6b8] hover:text-[#ebe7e4] transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shop
        </Link>
        <h1 className="text-4xl font-serif font-medium mt-4 text-[#ebe7e4]">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Order Summary */}
        <div className="order-2 lg:order-1">
          <div className="elegant-card p-6 sticky top-8">
            <h2 className="text-2xl font-medium mb-6 text-[#ebe7e4]">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={`${item.id}-${item.purchaseType}`} className="flex items-center space-x-4">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={60}
                    height={60}
                    className="rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-[#ebe7e4]">{item.name}</h3>
                    <p className="text-[#beb2a4] text-sm">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium text-[#d2c6b8]">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <Separator className="bg-[#403c3a] mb-6" />

            <div className="space-y-3">
              <div className="flex justify-between text-[#beb2a4]">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#beb2a4]">
                <span>Shipping</span>
                <span className="text-emerald-400">FREE</span>
              </div>
              <div className="flex justify-between text-[#beb2a4]">
                <span>Tax</span>
                <span>$0.00</span>
              </div>
              <Separator className="bg-[#403c3a]" />
              <div className="flex justify-between text-xl font-medium text-[#ebe7e4]">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Security Badges */}
            <div className="mt-6 pt-6 border-t border-[#403c3a]">
              <div className="flex items-center justify-center space-x-6 text-[#beb2a4]">
                <div className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span className="text-xs">Secure Payment</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Truck className="h-4 w-4" />
                  <span className="text-xs">Free Shipping</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <div className="order-1 lg:order-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Information */}
            <div className="elegant-card p-6">
              <h3 className="text-xl font-medium mb-6 text-[#ebe7e4]">Contact Information</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#ebe7e4]">Email Address *</label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="elegant-input"
                    placeholder="your@email.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#ebe7e4]">First Name *</label>
                    <Input
                      required
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      className="elegant-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#ebe7e4]">Last Name *</label>
                    <Input
                      required
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      className="elegant-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[#ebe7e4]">Phone Number</label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="elegant-input"
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="elegant-card p-6">
              <h3 className="text-xl font-medium mb-6 text-[#ebe7e4]">Shipping Information</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-[#ebe7e4]">Address *</label>
                  <Input
                    required
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="elegant-input"
                    placeholder="123 Main St"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[#ebe7e4]">Address Line 2</label>
                  <Input
                    value={formData.address2}
                    onChange={(e) => handleInputChange("address2", e.target.value)}
                    className="elegant-input"
                    placeholder="Apt, Suite, Unit, Building, Floor, etc."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#ebe7e4]">City *</label>
                    <Input
                      required
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className="elegant-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#ebe7e4]">State *</label>
                    <Input
                      required
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      className="elegant-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#ebe7e4]">ZIP Code *</label>
                    <Input
                      required
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange("zipCode", e.target.value)}
                      className="elegant-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-[#ebe7e4]">Country *</label>
                    <Select value={formData.country} onValueChange={(value) => handleInputChange("country", value)}>
                      <SelectTrigger className="elegant-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="CA">Canada</SelectItem>
                        <SelectItem value="GB">United Kingdom</SelectItem>
                        <SelectItem value="AU">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-[#ebe7e4]">Special Instructions</label>
                  <Textarea
                    value={formData.specialInstructions}
                    onChange={(e) => handleInputChange("specialInstructions", e.target.value)}
                    className="elegant-input"
                    placeholder="Any special delivery instructions..."
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="elegant-card p-6">
              <h3 className="text-xl font-medium mb-6 text-[#ebe7e4]">Payment Method</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === "card"
                      ? "border-[#d2c6b8] bg-[#d2c6b8]/10"
                      : "border-[#403c3a] hover:border-[#504c4a]"
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <CreditCard className="h-6 w-6 text-[#d2c6b8]" />
                    <span className="text-sm font-medium text-[#ebe7e4]">Credit/Debit Card</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("crypto")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === "crypto"
                      ? "border-[#d2c6b8] bg-[#d2c6b8]/10"
                      : "border-[#403c3a] hover:border-[#504c4a]"
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Wallet className="h-6 w-6 text-[#d2c6b8]" />
                    <span className="text-sm font-medium text-[#ebe7e4]">Cryptocurrency</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Card Payment */}
            {paymentMethod === "card" && (
              <div className="elegant-card p-6">
                <h3 className="text-xl font-medium mb-6 text-[#ebe7e4]">Card Payment</h3>

                {!isStripeReady ? (
                  <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-md">
                    <p className="text-yellow-400 text-sm">Loading payment system...</p>
                  </div>
                ) : (
                  <div className="mb-6">
                    <label className="block text-sm font-medium mb-2 text-[#ebe7e4]">Card Details *</label>
                    <div className="p-4 border border-[#403c3a] rounded-md bg-[#2a2624]">
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: "16px",
                              color: "#ebe7e4",
                              "::placeholder": {
                                color: "#beb2a4",
                              },
                            },
                            invalid: {
                              color: "#ef4444",
                            },
                          },
                        }}
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-md">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}

                {/* Research Disclaimer */}
                <div className="mb-6 p-4 bg-[#2a2624] border border-[#403c3a] rounded-lg">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="disclaimer"
                      checked={disclaimerAccepted}
                      onCheckedChange={(checked) => setDisclaimerAccepted(checked as boolean)}
                      className="mt-1 border-[#d2c6b8] data-[state=checked]:bg-[#d2c6b8] data-[state=checked]:border-[#d2c6b8]"
                    />
                    <label 
                      htmlFor="disclaimer" 
                      className="text-sm text-[#ebe7e4] leading-relaxed cursor-pointer"
                    >
                      By purchasing, the buyer acknowledges that all peptides are sold strictly for research purposes only, and Precision Peptides assumes no liability for any unauthorized use, including at-home research.
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={!isStripeReady || isProcessing || !disclaimerAccepted}
                  className="w-full bg-[#d2c6b8] hover:bg-[#beb2a4] text-[#201c1a] font-medium py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#201c1a] mr-2"></div>
                      Processing Payment...
                    </div>
                  ) : (
                    `Complete Order - $${total.toFixed(2)}`
                  )}
                </Button>

                <p className="text-xs text-[#beb2a4] text-center mt-4">
                  Your payment information is secure and encrypted. We never store your card details.
                </p>
              </div>
            )}

            {/* Crypto Payment */}
            {paymentMethod === "crypto" && (
              <CryptoPayment
                formData={formData}
                total={total}
                onSuccess={handleCryptoSuccess}
                referralId={referralId}
              />
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  const [stripePromise, setStripePromise] = useState<any>(null)
  const [stripeError, setStripeError] = useState<string | null>(null)

  useEffect(() => {
    const initStripe = async () => {
      try {
        const promise = getStripePromise()
        if (promise) {
          setStripePromise(promise)
        } else {
          setStripeError("Payment processing is not configured")
        }
      } catch (error) {
        console.error("Failed to initialize Stripe:", error)
        setStripeError("Failed to load payment system")
      }
    }

    initStripe()
  }, [])

  if (stripeError) {
    return (
      <div className="min-h-screen bg-[#201c1a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-medium text-[#ebe7e4] mb-4">Payment System Unavailable</h1>
          <p className="text-[#beb2a4] mb-6">{stripeError}</p>
          <Link href="/shop">
            <Button className="bg-[#d2c6b8] hover:bg-[#beb2a4] text-[#201c1a] font-medium">
              Return to Shop
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!stripePromise) {
    return (
      <div className="min-h-screen bg-[#201c1a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#d2c6b8] mx-auto mb-4"></div>
          <p className="text-[#beb2a4]">Loading payment system...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#201c1a]">
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </div>
  )
}
