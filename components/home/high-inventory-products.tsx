"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Star, ShoppingCart, Sparkles } from "lucide-react"
import { useCart } from "@/components/cart/cart-context"

interface FeaturedProduct {
  id: string
  name: string
  category: string
  price: number
  subscriptionPrice: number | null
  image: string
  overview: string
  inventory: number
  featuredDescription: string | null
  featuredUseCases: string[]
  reviews: {
    rating: number
    count: number
  }
}

export function HighInventoryProducts() {
  const [products, setProducts] = useState<FeaturedProduct[]>([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()

  const handleAddToCart = (product: FeaturedProduct) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      purchaseType: "one-time",
    })
  }

  useEffect(() => {
    async function fetchFeaturedProducts() {
      try {
        const res = await fetch("/api/products/featured")
        if (res.ok) {
          const data = await res.json()
          setProducts(data)
        }
      } catch (error) {
        console.error("Failed to fetch featured products:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchFeaturedProducts()
  }, [])

  if (loading || products.length === 0) {
    return null
  }

  return (
    <section className="py-16 content-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-emerald-500/10 rounded-full">
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-medium text-emerald-400">In Stock & Ready to Ship</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-medium mb-3 text-[#ebe7e4]">
            Featured Products
          </h2>
          <p className="text-lg text-[#beb2a4] max-w-2xl mx-auto">
            Our most popular research peptides, fully stocked and available for immediate shipping
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="bg-[#201c1a] border-[#403c3a] overflow-hidden group">
              <Link href={`/products/${product.id}`}>
                <div className="relative aspect-[4/3] bg-[#1a1816]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                  <Badge className="absolute top-3 left-3 bg-emerald-500 text-white">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                  <Badge className="absolute top-3 right-3 bg-[#201c1a]/90 text-[#ebe7e4]">
                    {product.inventory} in stock
                  </Badge>
                </div>
              </Link>

              <CardContent className="p-5">
                <Badge variant="outline" className="border-[#403c3a] text-[#a09a94] text-xs mb-2">
                  {product.category}
                </Badge>

                <Link href={`/products/${product.id}`}>
                  <h3 className="text-lg font-medium text-[#ebe7e4] mb-2 group-hover:text-[#d2c6b8] transition-colors">
                    {product.name}
                  </h3>
                </Link>

                {/* Featured Description or Overview */}
                <p className="text-sm text-[#a09a94] mb-3 line-clamp-2">
                  {product.featuredDescription || product.overview}
                </p>

                {/* Use Cases */}
                {product.featuredUseCases && product.featuredUseCases.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {product.featuredUseCases.slice(0, 3).map((useCase, i) => (
                      <Badge key={i} variant="outline" className="text-xs border-[#403c3a] text-[#beb2a4]">
                        {useCase}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < Math.round(product.reviews.rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-[#403c3a]"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-[#a09a94] ml-1">
                    ({product.reviews.count})
                  </span>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-3 border-t border-[#403c3a]">
                  <div>
                    <span className="text-xl font-bold text-[#d2c6b8]">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-[#d2c6b8] text-[#201c1a] hover:bg-[#c4b8aa]"
                    onClick={() => handleAddToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link href="/shop">
            <Button variant="outline" className="border-[#403c3a] text-[#ebe7e4] hover:bg-[#201c1a]">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
