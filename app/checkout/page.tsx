"use client"

import React, { useState, useEffect } from "react"

// TypeScript declaration for PromoteKit global variable
declare global {
  interface Window {
    promotekit_referral?: string;
  }
}
import { useRouter } from "next/navigation"
// Stripe imports disabled - card payments temporarily unavailable
// import { loadStripe } from "@stripe/stripe-js"
// import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
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

// Stripe initialization disabled - payment processing temporarily unavailable
// const getStripePromise = () => {
//   try {
//     const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
//     if (!publishableKey || publishableKey === "pk_test_placeholder") {
//       console.warn("Stripe publishable key not configured")
//       return null
//     }
//     return loadStripe(publishableKey)
//   } catch (error) {
//     console.error("Failed to initialize Stripe:", error)
//     return null
//   }
// }

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
  // Stripe hooks disabled - payment processing temporarily unavailable
  // const stripe = useStripe()
  // const elements = useElements()
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
  const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto">("crypto")
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false)
  const [referralId, setReferralId] = useState<string | null>(null)

  // Stripe initialization disabled
  // useEffect(() => {
  //   if (stripe && elements) {
  //     setIsStripeReady(true)
  //   }
  // }, [stripe, elements])

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
    
    // Payment processing is disabled
    setError("Payment processing is currently unavailable. Please contact us at precisionpeptides@proton.me to place an order.")
    return
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
              
              <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-md">
                <p className="text-blue-400 text-sm font-medium mb-2">💳 Card Payments Temporarily Unavailable</p>
                <p className="text-blue-300 text-sm">
                  We are currently setting up a new payment processor. Card payments will be available soon. 
                  For now, please use cryptocurrency to complete your purchase.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  disabled
                  className="p-4 rounded-lg border-2 border-[#403c3a] opacity-50 cursor-not-allowed"
                >
                  <div className="flex flex-col items-center space-y-2">
                    <CreditCard className="h-6 w-6 text-[#beb2a4]" />
                    <span className="text-sm font-medium text-[#beb2a4]">Credit/Debit Card</span>
                    <span className="text-xs text-red-400">Coming Soon</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("crypto")}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    paymentMethod === "crypto"
                      ? "border-[#d2c6b8] bg-[#d2c6b8]/10"
                      : "border-[#403c3a] hover:border-[#d2c6b8]/50"
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <Wallet className={`h-6 w-6 ${paymentMethod === "crypto" ? "text-[#d2c6b8]" : "text-[#beb2a4]"}`} />
                    <span className={`text-sm font-medium ${paymentMethod === "crypto" ? "text-[#ebe7e4]" : "text-[#beb2a4]"}`}>
                      Cryptocurrency
                    </span>
                    <span className="text-xs text-emerald-400">Available</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Card Payment - Disabled */}
            {paymentMethod === "card" && (
              <div className="elegant-card p-6 opacity-50 pointer-events-none">
                <h3 className="text-xl font-medium mb-6 text-[#ebe7e4]">Card Payment</h3>
                <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-md">
                  <p className="text-red-400 text-sm font-medium">Card payments are temporarily unavailable.</p>
                  <p className="text-red-300 text-sm mt-2">
                    Please select cryptocurrency as your payment method, or contact us at{" "}
                    <a href="mailto:precisionpeptides@proton.me" className="underline">
                      precisionpeptides@proton.me
                    </a>{" "}
                    for assistance.
                  </p>
                </div>
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
  // Stripe is disabled - show payment unavailable message
  return (
    <div className="min-h-screen bg-[#201c1a]">
      <CheckoutForm />
    </div>
  )
}
