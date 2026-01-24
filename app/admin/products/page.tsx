import { prisma } from "@/lib/prisma"
import { ProductsTable } from "./products-table"

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic'

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { name: "asc" },
    })
    return products
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return []
  }
}

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-[#ebe7e4]">Products & Pricing</h1>
        <p className="text-[#a09a94] mt-1">Manage your product catalog and retail pricing</p>
      </div>

      <ProductsTable products={products} />
    </div>
  )
}
