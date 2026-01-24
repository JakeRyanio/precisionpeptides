import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, ShoppingCart, DollarSign, ArrowRight, CheckCircle, Clock, Building2 } from "lucide-react"
import Link from "next/link"

// For now, this is a demo view. In production, you'd fetch the logged-in wholesale account's data
export default function WholesaleDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-[#ebe7e4]">Welcome to Your Wholesale Portal</h1>
        <p className="text-[#a09a94] mt-1">Manage your orders and view your custom pricing</p>
      </div>

      {/* Account Status Banner */}
      <Card className="bg-gradient-to-r from-[#d2c6b8]/20 to-[#201c1a] border-[#d2c6b8]/30">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-[#d2c6b8]/20 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-[#d2c6b8]" />
            </div>
            <div>
              <p className="text-lg font-medium text-[#ebe7e4]">Account Status: <span className="text-green-400">Approved</span></p>
              <p className="text-sm text-[#a09a94]">You have access to wholesale pricing on all products</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-[#201c1a] border-[#403c3a] hover:border-[#d2c6b8]/50 transition-colors">
          <CardHeader className="pb-2">
            <DollarSign className="h-8 w-8 text-[#d2c6b8]" />
          </CardHeader>
          <CardContent>
            <h3 className="font-medium text-[#ebe7e4] mb-1">View My Pricing</h3>
            <p className="text-sm text-[#a09a94] mb-4">See your custom wholesale pricing for all products</p>
            <Link href="/wholesale/pricing">
              <Button variant="outline" size="sm" className="border-[#403c3a] text-[#ebe7e4] hover:bg-[#403c3a]">
                View Pricing <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-[#201c1a] border-[#403c3a] hover:border-[#d2c6b8]/50 transition-colors">
          <CardHeader className="pb-2">
            <Package className="h-8 w-8 text-[#d2c6b8]" />
          </CardHeader>
          <CardContent>
            <h3 className="font-medium text-[#ebe7e4] mb-1">Place an Order</h3>
            <p className="text-sm text-[#a09a94] mb-4">Browse products with your wholesale pricing</p>
            <Link href="/wholesale/shop">
              <Button variant="outline" size="sm" className="border-[#403c3a] text-[#ebe7e4] hover:bg-[#403c3a]">
                Shop Now <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-[#201c1a] border-[#403c3a] hover:border-[#d2c6b8]/50 transition-colors">
          <CardHeader className="pb-2">
            <ShoppingCart className="h-8 w-8 text-[#d2c6b8]" />
          </CardHeader>
          <CardContent>
            <h3 className="font-medium text-[#ebe7e4] mb-1">Order History</h3>
            <p className="text-sm text-[#a09a94] mb-4">Track your past and current orders</p>
            <Link href="/wholesale/orders">
              <Button variant="outline" size="sm" className="border-[#403c3a] text-[#ebe7e4] hover:bg-[#403c3a]">
                View Orders <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-[#201c1a] border-[#403c3a]">
        <CardHeader>
          <CardTitle className="text-[#ebe7e4]">Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-[#a09a94]">
            <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No recent orders</p>
            <p className="text-sm mt-1">Place your first wholesale order to get started</p>
            <Link href="/wholesale/shop">
              <Button className="mt-4 bg-[#d2c6b8] text-[#201c1a] hover:bg-[#c4b8aa]">
                Start Shopping
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Support Info */}
      <Card className="bg-[#201c1a] border-[#403c3a]">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Building2 className="h-6 w-6 text-[#d2c6b8] flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-medium text-[#ebe7e4] mb-1">Need Help?</h3>
              <p className="text-sm text-[#a09a94]">
                Contact your dedicated wholesale account manager for pricing questions, 
                bulk order inquiries, or any assistance you need.
              </p>
              <p className="text-sm text-[#d2c6b8] mt-2">precisionpep@proton.me</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
