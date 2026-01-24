import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Package } from "lucide-react"

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic'

const VIALS_PER_KIT = 10

// Demo: In production, get the logged-in user's wholesale account ID
async function getWholesalePricing() {
  try {
    // Get all products with retail pricing
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { category: "asc" }
    })

    return products
  } catch (error) {
    console.error("Failed to fetch pricing:", error)
    return []
  }
}

export default async function WholesalePricingPage() {
  const products = await getWholesalePricing()

  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = []
    }
    acc[product.category].push(product)
    return acc
  }, {} as Record<string, typeof products>)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-[#ebe7e4]">My Wholesale Pricing</h1>
        <p className="text-[#a09a94] mt-1">Your custom pricing for all available products</p>
      </div>

      {/* Kit Info Banner */}
      <Card className="bg-[#d2c6b8]/10 border-[#d2c6b8]/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#d2c6b8]/20 flex items-center justify-center">
              <Package className="h-5 w-5 text-[#d2c6b8]" />
            </div>
            <div>
              <p className="font-medium text-[#ebe7e4]">Kit-Based Ordering</p>
              <p className="text-sm text-[#a09a94]">
                All wholesale orders are placed per <span className="text-[#d2c6b8] font-medium">KIT ({VIALS_PER_KIT} vials)</span>. 
                Prices shown below include per-kit and per-vial breakdown.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products by Category */}
      {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
        <div key={category}>
          <h2 className="text-xl font-serif text-[#ebe7e4] mb-4">{category}</h2>
          <div className="grid gap-4">
            {categoryProducts.map((product) => {
              // Demo: Apply 20% discount for wholesale pricing display
              const wholesalePricePerVial = product.price * 0.8
              const kitPrice = wholesalePricePerVial * VIALS_PER_KIT
              const retailKitPrice = product.price * VIALS_PER_KIT
              const savingsPerKit = retailKitPrice - kitPrice

              return (
                <Card key={product.id} className="bg-[#201c1a] border-[#403c3a]">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-[#1a1816] flex-shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-[#ebe7e4]">{product.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {product.purity && (
                            <Badge variant="outline" className="border-[#403c3a] text-[#a09a94] text-xs">
                              {product.purity}% purity
                            </Badge>
                          )}
                          <Badge variant="outline" className="border-[#d2c6b8]/30 text-[#d2c6b8] text-xs">
                            {VIALS_PER_KIT} vials/kit
                          </Badge>
                        </div>
                      </div>

                      <div className="text-right">
                        {/* Kit Price */}
                        <div className="flex items-baseline gap-2">
                          <span className="text-xl font-bold text-[#d2c6b8]">
                            ${kitPrice.toFixed(2)}
                          </span>
                          <span className="text-sm text-[#a09a94] line-through">
                            ${retailKitPrice.toFixed(2)}
                          </span>
                        </div>
                        <p className="text-xs text-[#a09a94]">per kit of {VIALS_PER_KIT}</p>
                        
                        {/* Per Vial Breakdown */}
                        <div className="mt-2 pt-2 border-t border-[#403c3a]">
                          <p className="text-sm text-[#ebe7e4]">
                            ${wholesalePricePerVial.toFixed(2)} <span className="text-[#a09a94]">per vial</span>
                          </p>
                          <p className="text-xs text-green-400">Save ${savingsPerKit.toFixed(2)} per kit</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      ))}

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
