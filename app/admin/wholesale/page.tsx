import { prisma } from "@/lib/prisma"
import { WholesaleTable } from "./wholesale-table"

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic'

async function getWholesaleAccounts() {
  try {
    const accounts = await prisma.wholesaleAccount.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { email: true, name: true }
        },
        customPricing: {
          include: {
            product: {
              select: { id: true, name: true, price: true, subscriptionPrice: true }
            }
          }
        },
        _count: {
          select: { orders: true }
        }
      }
    })
    return accounts
  } catch (error) {
    console.error("Failed to fetch wholesale accounts:", error)
    return []
  }
}

async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, price: true, subscriptionPrice: true, category: true }
    })
    return products
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return []
  }
}

export default async function WholesalePage() {
  const [accounts, products] = await Promise.all([
    getWholesaleAccounts(),
    getProducts()
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-[#ebe7e4]">Wholesale Accounts</h1>
        <p className="text-[#a09a94] mt-1">Manage wholesale accounts and set custom pricing for each</p>
      </div>

      <WholesaleTable accounts={accounts} products={products} />
    </div>
  )
}
