import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, Users, DollarSign, TrendingUp, Clock } from "lucide-react"

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic'

async function getDashboardStats() {
  try {
    const [
      totalOrders,
      pendingOrders,
      totalProducts,
      wholesaleAccounts,
      pendingWholesale,
      recentOrders
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { orderStatus: "PENDING" } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.wholesaleAccount.count({ where: { status: "APPROVED" } }),
      prisma.wholesaleAccount.count({ where: { status: "PENDING" } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          orderId: true,
          customerEmail: true,
          total: true,
          orderStatus: true,
          createdAt: true,
        }
      })
    ])

    const totalRevenue = await prisma.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "paid" }
    })

    return {
      totalOrders,
      pendingOrders,
      totalProducts,
      wholesaleAccounts,
      pendingWholesale,
      recentOrders,
      totalRevenue: totalRevenue._sum.total || 0
    }
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error)
    return {
      totalOrders: 0,
      pendingOrders: 0,
      totalProducts: 0,
      wholesaleAccounts: 0,
      pendingWholesale: 0,
      recentOrders: [],
      totalRevenue: 0
    }
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats()

  const statCards = [
    {
      title: "Total Revenue",
      value: `$${stats.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "text-green-500"
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "text-blue-500"
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      color: "text-yellow-500"
    },
    {
      title: "Active Products",
      value: stats.totalProducts,
      icon: Package,
      color: "text-purple-500"
    },
    {
      title: "Wholesale Accounts",
      value: stats.wholesaleAccounts,
      icon: Users,
      color: "text-[#d2c6b8]"
    },
    {
      title: "Pending Approvals",
      value: stats.pendingWholesale,
      icon: TrendingUp,
      color: "text-orange-500"
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-[#ebe7e4]">Dashboard Overview</h1>
        <p className="text-[#a09a94] mt-1">Welcome back! Here&apos;s what&apos;s happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat) => (
          <Card key={stat.title} className="bg-[#201c1a] border-[#403c3a]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[#a09a94]">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#ebe7e4]">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className="bg-[#201c1a] border-[#403c3a]">
        <CardHeader>
          <CardTitle className="text-[#ebe7e4]">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentOrders.length === 0 ? (
            <p className="text-[#a09a94] text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {stats.recentOrders.map((order) => (
                <div 
                  key={order.id} 
                  className="flex items-center justify-between p-4 rounded-lg bg-[#1a1816] border border-[#403c3a]"
                >
                  <div>
                    <p className="font-medium text-[#ebe7e4]">{order.orderId}</p>
                    <p className="text-sm text-[#a09a94]">{order.customerEmail}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[#ebe7e4]">
                      ${order.total.toFixed(2)}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.orderStatus === "DELIVERED" ? "bg-green-500/20 text-green-400" :
                      order.orderStatus === "SHIPPED" ? "bg-blue-500/20 text-blue-400" :
                      order.orderStatus === "PROCESSING" ? "bg-yellow-500/20 text-yellow-400" :
                      order.orderStatus === "CANCELLED" ? "bg-red-500/20 text-red-400" :
                      "bg-[#403c3a] text-[#a09a94]"
                    }`}>
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
