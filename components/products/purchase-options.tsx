"use client"

import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/components/cart/cart-context"
import type { Product } from "@/lib/products-data"

interface PurchaseOptionsProps {
  product: Product
  quantity?: number
}

export function PurchaseOptions({ product, quantity = 1 }: PurchaseOptionsProps) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        purchaseType: "one-time",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Price Display */}
      <div className="elegant-card p-4 border-[#d2c6b8] bg-[#d2c6b8]/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div>
              <div className="flex items-center space-x-2">
                <ShoppingCart className="h-4 w-4 text-[#d2c6b8]" />
                <span className="font-medium text-[#ebe7e4]">One-time Purchase</span>
              </div>
              <p className="text-sm text-[#beb2a4]">Single purchase, no commitment</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-medium text-[#ebe7e4]">${product.price.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button
        onClick={handleAddToCart}
        className="w-full font-medium text-lg py-6 rounded-md transition-all duration-200 bg-[#d2c6b8] hover:bg-[#beb2a4] text-[#201c1a]"
      >
        <ShoppingCart className="h-5 w-5 mr-2" />
        Add to Cart - ${(product.price * quantity).toFixed(2)}
      </Button>
    </div>
  )
}
