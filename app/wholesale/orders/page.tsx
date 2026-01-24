import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Package } from "lucide-react"
import Link from "next/link"

// Demo page - in production, would fetch orders for the logged-in wholesale account
export default function WholesaleOrdersPage() {
  const orders: unknown[] = [] // Would be fetched from database

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif text-[#ebe7e4]">Order History</h1>
        <p className="text-[#a09a94] mt-1">View and track all your wholesale orders</p>
      </div>

      <Card className="bg-[#201c1a] border-[#403c3a]">
        <CardContent className="p-8">
          {orders.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-[#403c3a]" />
              <h3 className="text-xl font-medium text-[#ebe7e4] mb-2">No Orders Yet</h3>
              <p className="text-[#a09a94] mb-6 max-w-md mx-auto">
                You haven&apos;t placed any wholesale orders yet. 
                Browse our products with your exclusive wholesale pricing and place your first order.
              </p>
              <Link href="/wholesale/shop">
                <Button className="bg-[#d2c6b8] text-[#201c1a] hover:bg-[#c4b8aa]">
                  <Package className="h-4 w-4 mr-2" />
                  Start Shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div>
              {/* Order list would go here */}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
