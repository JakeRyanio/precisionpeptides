"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Copy, Check, Wallet, AlertCircle } from "lucide-react"
import { useCart } from "@/components/cart/cart-context"

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

interface CryptoPaymentProps {
  formData: CheckoutFormData
  total: number
  onSuccess: () => void
  referralId?: string | null
}

interface CryptoWallet {
  symbol: string
  name: string
  address: string
  network?: string
}

// Crypto wallet addresses
const CRYPTO_WALLETS: CryptoWallet[] = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    address: "bc1q4utg2zy0523ud4e6x7w0fr9d90zcc9xdkhzjpx",
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    address: "0x1F5248EAF77C8a000D5d0347C623d75338a79bDd",
    network: "ERC-20",
  },
  {
    symbol: "SOL",
    name: "Solana",
    address: "8wycX69inEP8BQADRAqoHcs2JW1aqXJhTXzn4zpmHKAg",
  },
  {
    symbol: "XRP",
    name: "Ripple",
    address: "r38p5WwwuVzzKhWtWPZ3EDiT8zf9z6HSYv",
  },
  {
    symbol: "USDT",
    name: "Tether USD",
    address: "0x1F5248EAF77C8a000D5d0347C623d75338a79bDd",
    network: "ERC-20",
  },
]

export function CryptoPayment({ formData, total, onSuccess, referralId }: CryptoPaymentProps) {
  const { items, clearCart } = useCart()
  const [selectedCrypto, setSelectedCrypto] = useState<string>("")
  const [transactionId, setTransactionId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false)

  const selectedWallet = CRYPTO_WALLETS.find(wallet => wallet.symbol === selectedCrypto)

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedAddress(type)
      setTimeout(() => setCopiedAddress(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!disclaimerAccepted) {
      setError("Please accept the research disclaimer to continue")
      return
    }

    if (!selectedCrypto || !transactionId.trim()) {
      setError("Please select a cryptocurrency and provide a transaction ID")
      return
    }

    setIsSubmitting(true)

    try {
      // Submit order via EmailJS or your preferred service
      const response = await fetch("/api/crypto-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderData: {
            items,
            customerInfo: formData,
            total,
            paymentMethod: "crypto",
            cryptocurrency: selectedCrypto,
            transactionId: transactionId.trim(),
            walletAddress: selectedWallet?.address,
            timestamp: new Date().toISOString(),
            referralId,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit order")
      }

      clearCart()
      onSuccess()
    } catch (err) {
      console.error("Crypto payment error:", err)
      setError("Failed to submit order. Please try again or contact support.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="elegant-card p-6">
      <div className="flex items-center mb-6">
        <Wallet className="h-6 w-6 text-[#d2c6b8] mr-3" />
        <h3 className="text-xl font-medium text-[#ebe7e4]">Pay with Cryptocurrency</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Cryptocurrency Selection */}
        <div>
          <label className="block text-sm font-medium mb-2 text-[#ebe7e4]">
            Select Cryptocurrency *
          </label>
          <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
            <SelectTrigger className="elegant-input">
              <SelectValue placeholder="Choose cryptocurrency" />
            </SelectTrigger>
            <SelectContent className="bg-[#2a2624] border-[#403c3a]">
              {CRYPTO_WALLETS.map((wallet) => (
                <SelectItem 
                  key={wallet.symbol} 
                  value={wallet.symbol}
                  className="text-[#ebe7e4] hover:bg-[#403c3a]"
                >
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{wallet.symbol}</span>
                    <span className="text-[#beb2a4]">- {wallet.name}</span>
                    {wallet.network && (
                      <span className="text-xs text-emerald-400">({wallet.network})</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Wallet Address Display */}
        {selectedWallet && (
          <div className="bg-[#2a2624] border border-[#403c3a] rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-[#ebe7e4]">
                Send {selectedWallet.symbol} to this address:
              </h4>
              {selectedWallet.network && (
                <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">
                  {selectedWallet.network}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2 mb-3">
              <div className="flex-1 bg-[#201c1a] border border-[#403c3a] rounded px-3 py-2 text-sm text-[#ebe7e4] font-mono break-all">
                {selectedWallet.address}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(selectedWallet.address, "address")}
                className="border-[#403c3a] text-[#d2c6b8] hover:bg-[#403c3a] hover:text-[#ebe7e4]"
              >
                {copiedAddress === "address" ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-[#d2c6b8] mb-1">
                Amount: ${total.toFixed(2)} USD
              </div>
              <p className="text-sm text-[#beb2a4]">
                Send the equivalent amount in {selectedWallet.symbol}
              </p>
            </div>
          </div>
        )}

        {/* Payment Instructions */}
        {selectedWallet && (
          <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
              <div className="text-sm text-blue-200">
                <h5 className="font-medium mb-2">Payment Instructions:</h5>
                <ol className="list-decimal list-inside space-y-1 text-blue-200/80">
                  <li>Copy the wallet address above</li>
                  <li>Send exactly ${total.toFixed(2)} USD worth of {selectedWallet.symbol} to this address</li>
                  <li>Wait for transaction confirmation</li>
                  <li>Copy and paste your transaction ID below</li>
                  <li>Submit this form to complete your order</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Transaction ID Input */}
        {selectedWallet && (
          <div>
            <label className="block text-sm font-medium mb-2 text-[#ebe7e4]">
              Transaction ID / Hash *
            </label>
            <Input
              type="text"
              required
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              className="elegant-input font-mono"
              placeholder="Enter transaction ID after sending payment"
            />
            <p className="text-xs text-[#beb2a4] mt-1">
              Paste the transaction ID from your wallet or blockchain explorer
            </p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/20 border border-red-500/30 rounded-md p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Research Disclaimer */}
        <div className="p-4 bg-[#2a2624] border border-[#403c3a] rounded-lg">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="crypto-disclaimer"
              checked={disclaimerAccepted}
              onCheckedChange={(checked) => setDisclaimerAccepted(checked as boolean)}
              className="mt-1 border-[#d2c6b8] data-[state=checked]:bg-[#d2c6b8] data-[state=checked]:border-[#d2c6b8]"
            />
            <label 
              htmlFor="crypto-disclaimer" 
              className="text-sm text-[#ebe7e4] leading-relaxed cursor-pointer"
            >
              By purchasing, the buyer acknowledges that all peptides are sold strictly for research purposes only, and Precision Peptides assumes no liability for any unauthorized use, including at-home research.
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!selectedWallet || !transactionId.trim() || isSubmitting || !disclaimerAccepted}
          className="w-full bg-[#d2c6b8] hover:bg-[#beb2a4] text-[#201c1a] font-medium py-6 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#201c1a] mr-2"></div>
              Processing Order...
            </div>
          ) : (
            `Complete Crypto Order - $${total.toFixed(2)}`
          )}
        </Button>

        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
            <div className="text-sm text-yellow-200">
              <p className="font-medium mb-1">Important:</p>
              <p>
                Orders paid with cryptocurrency require manual verification. You will receive 
                an email confirmation once your payment is verified and your order is processed. 
                This typically takes 1-24 hours.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

