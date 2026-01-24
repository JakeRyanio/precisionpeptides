"use client"

import { useState } from "react"
import Image from "next/image"
import { Star, Shield, Beaker, Clock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QuickPurchaseOptions } from "./quick-purchase-options"
import type { Product } from "@/lib/products-data"

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1)

  return (
    <div className="container mx-auto px-4 py-8 bg-[#201c1a] min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative elegant-card p-4">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={600}
              height={600}
              className="w-full product-image rounded-md"
              style={{ objectFit: "contain", objectPosition: "center", minHeight: "400px" }}
            />
            <div className="absolute top-8 left-8">
              <span className="elegant-badge">{product.category}</span>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-serif font-medium mb-4 text-[#ebe7e4]">{product.name}</h1>

            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.reviews.rating) ? "text-[#d2c6b8] fill-current" : "text-[#504c4a]"
                    }`}
                  />
                ))}
              </div>
              <span className="text-[#beb2a4] ml-2">
                {product.reviews.rating} ({product.reviews.count} reviews)
              </span>
            </div>

            {/* Price Display */}
            <div className="mb-6">
              <div className="text-4xl font-medium text-[#d2c6b8] mb-2">${product.price.toFixed(2)}</div>
              {product.subscriptionPrice && (
                <div className="text-lg text-emerald-400">
                  Or ${product.subscriptionPrice.toFixed(2)}/month with subscription (Save 15%)
                </div>
              )}
              {!product.subscriptionPrice && (
                <div className="text-lg text-[#beb2a4]">
                  One-time purchase only • No subscription available
                </div>
              )}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-4">
            {/* Purchase Options Component */}
            <QuickPurchaseOptions product={product} />
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 py-6 border-t border-[#403c3a]">
            <div className="text-center">
              <div className="w-12 h-12 bg-[#403c3a] rounded-full flex items-center justify-center mx-auto mb-2">
                <Shield className="h-6 w-6 text-[#d2c6b8]" />
              </div>
              <p className="text-sm text-[#beb2a4]">Lab Tested</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#403c3a] rounded-full flex items-center justify-center mx-auto mb-2">
                <Beaker className="h-6 w-6 text-[#d2c6b8]" />
              </div>
              <p className="text-sm text-[#beb2a4]">COA Included</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-[#403c3a] rounded-full flex items-center justify-center mx-auto mb-2">
                <Clock className="h-6 w-6 text-[#d2c6b8]" />
              </div>
              <p className="text-sm text-[#beb2a4]">Free Shipping</p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-[#403c3a] rounded-md">
            <TabsTrigger
              value="overview"
              className="text-[#beb2a4] data-[state=active]:bg-[#504c4a] data-[state=active]:text-[#ebe7e4]"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="benefits"
              className="text-[#beb2a4] data-[state=active]:bg-[#504c4a] data-[state=active]:text-[#ebe7e4]"
            >
              Benefits
            </TabsTrigger>
            <TabsTrigger
              value="research"
              className="text-[#beb2a4] data-[state=active]:bg-[#504c4a] data-[state=active]:text-[#ebe7e4]"
            >
              Research Use
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="text-[#beb2a4] data-[state=active]:bg-[#504c4a] data-[state=active]:text-[#ebe7e4]"
            >
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-8">
            <div className="elegant-card p-8">
              <h3 className="text-2xl font-medium mb-4 text-[#ebe7e4]">Product Overview</h3>
              <div className="text-[#beb2a4] text-lg leading-relaxed">
                {product.overview.split("PubMed: ").map((part, index) => {
                  if (index === 0) {
                    return <span key={index}>{part}</span>
                  }
                  const linkMatch = part.match(/^(https?:\/\/[^\s]+)(.*)/)
                  if (linkMatch) {
                    return (
                      <span key={index}>
                        PubMed:{" "}
                        <a
                          href={linkMatch[1]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#d2c6b8] hover:text-[#ebe7e4] underline"
                        >
                          {linkMatch[1]}
                        </a>
                        {linkMatch[2]}
                      </span>
                    )
                  }
                  return <span key={index}>PubMed: {part}</span>
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="benefits" className="mt-8">
            <div className="elegant-card p-8">
              <h3 className="text-2xl font-medium mb-6 text-[#ebe7e4]">Potential Benefits</h3>
              <ul className="space-y-4">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#d2c6b8] rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-[#beb2a4]">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="research" className="mt-8">
            <div className="elegant-card p-8">
              <h3 className="text-2xl font-medium mb-6 text-[#ebe7e4]">Scientific Use Cases</h3>
              <ul className="space-y-4 mb-8">
                {product.useCases.map((useCase, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[#d2c6b8] rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-[#beb2a4]">{useCase}</span>
                  </li>
                ))}
              </ul>

              <div className="bg-[#403c3a] border border-[#504c4a] rounded-md p-6">
                <h4 className="text-lg font-medium text-red-400 mb-2">Safety Disclaimer</h4>
                <p className="text-red-300">{product.disclaimer}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-8">
            <div className="elegant-card p-8">
              <h3 className="text-2xl font-medium mb-6 text-[#ebe7e4]">Customer Reviews</h3>

              <div className="bg-[#403c3a] rounded-md p-6">
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-[#d2c6b8] fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 font-medium text-[#ebe7e4]">5.0</span>
                </div>

                <p className="text-[#beb2a4] italic mb-4">"{product.reviews.featured}"</p>
                <p className="text-sm text-[#beb2a4]">Verified Research Purchase</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
