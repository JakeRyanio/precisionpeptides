"use client"

import { useState } from "react"
import { format } from "date-fns"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Eye, Search } from "lucide-react"
import { useRouter } from "next/navigation"

type Order = {
  id: string
  orderId: string
  customerEmail: string
  customerName: string | null
  total: number
  orderStatus: string
  paymentMethod: string
  paymentStatus: string
  createdAt: Date
  shippingCity: string
  shippingState: string
  trackingNumber: string | null
  carrier: string | null
  items: {
    id: string
    name: string
    quantity: number
    price: number
    purchaseType: string
  }[]
  wholesaleAccount: { companyName: string } | null
}

// Helper function to get tracking URL based on carrier
function getTrackingUrl(carrier: string | null, trackingNumber: string): string {
  const urls: Record<string, string> = {
    'usps': `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`,
    'ups': `https://www.ups.com/track?tracknum=${trackingNumber}`,
    'fedex': `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`,
    'dhl': `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`,
    'dhl_express': `https://www.dhl.com/en/express/tracking.html?AWB=${trackingNumber}`,
  }
  return urls[carrier?.toLowerCase() || ''] || `https://www.google.com/search?q=${trackingNumber}`
}

const orderStatuses = [
  "PENDING",
  "PROCESSING", 
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED"
]

export function OrdersTable({ orders: initialOrders }: { orders: Order[] }) {
  const [orders, setOrders] = useState(initialOrders)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  const router = useRouter()

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === "all" || order.orderStatus === statusFilter

    return matchesSearch && matchesStatus
  })

  async function updateOrderStatus(orderId: string, newStatus: string) {
    setUpdating(orderId)
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus })
      })

      if (res.ok) {
        setOrders(orders.map(o => 
          o.id === orderId ? { ...o, orderStatus: newStatus } : o
        ))
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to update order:", error)
    } finally {
      setUpdating(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED": return "bg-green-500/20 text-green-400 border-green-500/30"
      case "SHIPPED": return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "PROCESSING": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "CANCELLED": return "bg-red-500/20 text-red-400 border-red-500/30"
      case "REFUNDED": return "bg-purple-500/20 text-purple-400 border-purple-500/30"
      default: return "bg-[#403c3a] text-[#a09a94] border-[#403c3a]"
    }
  }

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a09a94]" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#201c1a] border-[#403c3a] text-[#ebe7e4]"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-[#201c1a] border-[#403c3a] text-[#ebe7e4]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-[#201c1a] border-[#403c3a]">
            <SelectItem value="all">All Statuses</SelectItem>
            {orderStatuses.map(status => (
              <SelectItem key={status} value={status}>{status}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-[#403c3a] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-[#403c3a] hover:bg-transparent">
              <TableHead className="text-[#a09a94]">Order ID</TableHead>
              <TableHead className="text-[#a09a94]">Customer</TableHead>
              <TableHead className="text-[#a09a94]">Total</TableHead>
              <TableHead className="text-[#a09a94]">Status</TableHead>
              <TableHead className="text-[#a09a94]">Tracking</TableHead>
              <TableHead className="text-[#a09a94]">Date</TableHead>
              <TableHead className="text-[#a09a94]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-[#a09a94]">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id} className="border-[#403c3a] hover:bg-[#201c1a]">
                  <TableCell className="font-medium text-[#ebe7e4]">
                    {order.orderId}
                    {order.wholesaleAccount && (
                      <Badge variant="outline" className="ml-2 text-xs border-[#d2c6b8] text-[#d2c6b8]">
                        Wholesale
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-[#ebe7e4]">{order.customerName || "N/A"}</p>
                      <p className="text-sm text-[#a09a94]">{order.customerEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-[#ebe7e4]">${order.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <Select 
                      value={order.orderStatus} 
                      onValueChange={(value) => updateOrderStatus(order.id, value)}
                      disabled={updating === order.id}
                    >
                      <SelectTrigger className={`w-32 border ${getStatusColor(order.orderStatus)}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#201c1a] border-[#403c3a]">
                        {orderStatuses.map(status => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-[#ebe7e4]">
                    {order.trackingNumber ? (
                      <a 
                        href={getTrackingUrl(order.carrier, order.trackingNumber)} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:underline text-sm"
                      >
                        {order.trackingNumber.length > 15 
                          ? `${order.trackingNumber.substring(0, 15)}...` 
                          : order.trackingNumber}
                      </a>
                    ) : (
                      <span className="text-[#a09a94]">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-[#a09a94]">
                    {format(new Date(order.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedOrder(order)}
                      className="text-[#a09a94] hover:text-[#ebe7e4]"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Order Details Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="bg-[#201c1a] border-[#403c3a] text-[#ebe7e4] max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.orderId}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#a09a94]">Customer</p>
                  <p className="font-medium">{selectedOrder.customerName || "N/A"}</p>
                  <p className="text-sm">{selectedOrder.customerEmail}</p>
                </div>
                <div>
                  <p className="text-sm text-[#a09a94]">Shipping</p>
                  <p>{selectedOrder.shippingCity}, {selectedOrder.shippingState}</p>
                </div>
                <div>
                  <p className="text-sm text-[#a09a94]">Payment</p>
                  <p>{selectedOrder.paymentMethod} - {selectedOrder.paymentStatus}</p>
                </div>
                <div>
                  <p className="text-sm text-[#a09a94]">Date</p>
                  <p>{format(new Date(selectedOrder.createdAt), "PPpp")}</p>
                </div>
                {selectedOrder.trackingNumber && (
                  <div className="col-span-2">
                    <p className="text-sm text-[#a09a94]">Tracking</p>
                    <a 
                      href={getTrackingUrl(selectedOrder.carrier, selectedOrder.trackingNumber)} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      {selectedOrder.trackingNumber}
                      {selectedOrder.carrier && ` (${selectedOrder.carrier.toUpperCase()})`}
                    </a>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm text-[#a09a94] mb-2">Items</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex justify-between p-3 bg-[#1a1816] rounded-lg">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-[#a09a94]">
                          {item.purchaseType} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-[#403c3a]">
                <span className="text-lg font-medium">Total</span>
                <span className="text-lg font-bold">${selectedOrder.total.toFixed(2)}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
