"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Package, Plus, Minus, ShoppingCart, Info } from "lucide-react"

const VIALS_PER_KIT = 10

interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  purity: number | null
}

interface CartItem {
  product: Product
  kits: number
}

export default function WholesaleShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState<CartItem[]>([])
  const [kitQuantities, setKitQuantities] = useState<Record<string, number>>({})

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/wholesale/products")
        if (res.ok) {
          const data = await res.json()
          setProducts(data)
          // Initialize quantities to 1 kit for each product
          const initialQuantities: Record<string, number> = {}
          data.forEach((p: Product) => {
            initialQuantities[p.id] = 1
          })
          setKitQuantities(initialQuantities)
        }
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const updateKitQuantity = (productId: string, delta: number) => {
    setKitQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta)
    }))
  }

  const setKitQuantity = (productId: string, value: number) => {
    const quantity = Math.max(1, Math.floor(value) || 1)
    setKitQuantities(prev => ({
      ...prev,
      [productId]: quantity
    }))
  }

  const addToCart = (product: Product) => {
    const kits = kitQuantities[product.id] || 1
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id)
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex].kits += kits
        return updated
      }
      return [...prev, { product, kits }]
    })
    // Reset quantity to 1 after adding
    setKitQuantities(prev => ({ ...prev, [product.id]: 1 }))
  }

  const cartTotal = cart.reduce((total, item) => {
    const wholesalePrice = item.product.price * 0.8 * VIALS_PER_KIT
    return total + (wholesalePrice * item.kits)
  }, 0)

  const totalVials = cart.reduce((total, item) => total + (item.kits * VIALS_PER_KIT), 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-[#403c3a] rounded animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="bg-[#201c1a] border-[#403c3a]">
              <div className="aspect-square bg-[#1a1816] animate-pulse" />
              <CardContent className="p-4 space-y-3">
                <div className="h-4 w-20 bg-[#403c3a] rounded animate-pulse" />
                <div className="h-5 w-32 bg-[#403c3a] rounded animate-pulse" />
                <div className="h-4 w-24 bg-[#403c3a] rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[#ebe7e4]">Shop Products</h1>
          <p className="text-[#a09a94] mt-1">Browse all products with your wholesale pricing</p>
        </div>
        
        {/* Cart Summary */}
        {cart.length > 0 && (
          <Card className="bg-[#d2c6b8]/10 border-[#d2c6b8]/30">
            <CardContent className="p-3 flex items-center gap-3">
              <ShoppingCart className="h-5 w-5 text-[#d2c6b8]" />
              <div>
                <p className="text-sm font-medium text-[#ebe7e4]">
                  {cart.reduce((sum, item) => sum + item.kits, 0)} kit(s) • {totalVials} vials
                </p>
                <p className="text-xs text-[#d2c6b8]">${cartTotal.toFixed(2)} total</p>
              </div>
              <Button size="sm" className="ml-2 bg-[#d2c6b8] text-[#201c1a] hover:bg-[#c4b8aa]">
                Checkout
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Kit Info Banner */}
      <Card className="bg-blue-900/20 border-blue-500/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-blue-300">Kit-Based Ordering</p>
              <p className="text-sm text-blue-200/80">
                All wholesale orders are placed by the <span className="font-semibold">KIT</span>. 
                Each kit contains <span className="font-semibold">{VIALS_PER_KIT} vials</span>. 
                Select the number of kits you need below.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => {
          // Demo: Apply 20% discount for wholesale pricing
          const wholesalePricePerVial = product.price * 0.8
          const kitPrice = wholesalePricePerVial * VIALS_PER_KIT
          const retailKitPrice = product.price * VIALS_PER_KIT
          const savingsPerKit = retailKitPrice - kitPrice
          const currentKits = kitQuantities[product.id] || 1

          return (
            <Card key={product.id} className="bg-[#201c1a] border-[#403c3a] overflow-hidden group">
              <div className="relative aspect-square bg-[#1a1816]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <Badge className="absolute top-3 left-3 bg-[#d2c6b8] text-[#201c1a]">
                  <Package className="h-3 w-3 mr-1" />
                  {VIALS_PER_KIT} vials/kit
                </Badge>
                <Badge className="absolute top-3 right-3 bg-green-500/90 text-white">
                  Save ${savingsPerKit.toFixed(2)}/kit
                </Badge>
              </div>
              
              <CardContent className="p-4">
                <Badge variant="outline" className="border-[#403c3a] text-[#a09a94] text-xs mb-2">
                  {product.category}
                </Badge>
                
                <h3 className="font-medium text-[#ebe7e4] mb-1">{product.name}</h3>
                
                {product.purity && (
                  <p className="text-sm text-[#a09a94] mb-3">{product.purity}% purity</p>
                )}
                
                {/* Pricing */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xl font-bold text-[#d2c6b8]">
                        ${kitPrice.toFixed(2)}
                      </span>
                      <span className="text-sm text-[#a09a94] line-through ml-2">
                        ${retailKitPrice.toFixed(2)}
                      </span>
                    </div>
                    <span className="text-xs text-[#a09a94]">per kit</span>
                  </div>
                  <p className="text-xs text-[#a09a94]">
                    ${wholesalePricePerVial.toFixed(2)} per vial × {VIALS_PER_KIT} vials
                  </p>
                </div>

                {/* Kit Quantity Selector */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-[#a09a94]">Kits:</span>
                  <div className="flex items-center border border-[#403c3a] rounded-md">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-[#a09a94] hover:text-[#ebe7e4] hover:bg-[#403c3a]"
                      onClick={() => updateKitQuantity(product.id, -1)}
                      disabled={currentKits <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={currentKits}
                      onChange={(e) => setKitQuantity(product.id, parseInt(e.target.value))}
                      className="h-8 w-12 text-center border-0 bg-transparent text-[#ebe7e4] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-[#a09a94] hover:text-[#ebe7e4] hover:bg-[#403c3a]"
                      onClick={() => updateKitQuantity(product.id, 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <span className="text-xs text-[#a09a94]">
                    = {currentKits * VIALS_PER_KIT} vials
                  </span>
                </div>

                {/* Subtotal & Add Button */}
                <div className="flex items-center justify-between pt-3 border-t border-[#403c3a]">
                  <div>
                    <p className="text-xs text-[#a09a94]">Subtotal</p>
                    <p className="font-bold text-[#ebe7e4]">${(kitPrice * currentKits).toFixed(2)}</p>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-[#d2c6b8] text-[#201c1a] hover:bg-[#c4b8aa]"
                    onClick={() => addToCart(product)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add {currentKits} Kit{currentKits > 1 ? 's' : ''}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {products.length === 0 && (
        <Card className="bg-[#201c1a] border-[#403c3a]">
          <CardContent className="p-8 text-center text-[#a09a94]">
            No products available at this time
          </CardContent>
        </Card>
      )}
    </div>
  )
}
