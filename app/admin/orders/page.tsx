import { prisma } from "@/lib/prisma"
import { OrdersTable } from "./orders-table"

async function getOrders() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: true,
        wholesaleAccount: {
          select: { companyName: true }
        }
      }
    })
    return orders
  } catch (error) {
    console.error("Failed to fetch orders:", error)
    return []
  }
}

export default async function OrdersPage() {
  const orders = await getOrders()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-[#ebe7e4]">Orders</h1>
        <p className="text-[#a09a94] mt-1">Manage and track all customer orders</p>
      </div>

      <OrdersTable orders={orders} />
    </div>
  )
}
