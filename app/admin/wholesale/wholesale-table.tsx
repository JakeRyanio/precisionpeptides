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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Settings, DollarSign, Save, Check, X, Building2, Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

type CustomPricing = {
  id: string
  productId: string
  price: number
  subscriptionPrice: number | null
  product: {
    id: string
    name: string
    price: number
    subscriptionPrice: number | null
  }
}

type WholesaleAccount = {
  id: string
  userId: string
  companyName: string
  taxId: string | null
  status: string
  discountPercent: number | null
  createdAt: Date
  user: {
    email: string
    name: string | null
  }
  customPricing: CustomPricing[]
  _count: {
    orders: number
  }
}

type Product = {
  id: string
  name: string
  price: number
  subscriptionPrice: number | null
  category: string
}

type NewAccountForm = {
  email: string
  password: string
  name: string
  companyName: string
  status: string
  discountPercent: string
}

const initialFormState: NewAccountForm = {
  email: "",
  password: "",
  name: "",
  companyName: "",
  status: "APPROVED",
  discountPercent: "20"
}

export function WholesaleTable({ 
  accounts: initialAccounts,
  products 
}: { 
  accounts: WholesaleAccount[]
  products: Product[]
}) {
  const [accounts, setAccounts] = useState(initialAccounts)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedAccount, setSelectedAccount] = useState<WholesaleAccount | null>(null)
  const [customPrices, setCustomPrices] = useState<Record<string, { price: number; subscriptionPrice: number | null }>>({})
  const [saving, setSaving] = useState(false)
  const [discountPercent, setDiscountPercent] = useState<number | null>(null)
  
  // New account modal state
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingAccount, setEditingAccount] = useState<WholesaleAccount | null>(null)
  const [formData, setFormData] = useState<NewAccountForm>(initialFormState)
  const [formError, setFormError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  
  // Delete confirmation state
  const [deleteAccount, setDeleteAccount] = useState<WholesaleAccount | null>(null)
  const [deleteUserToo, setDeleteUserToo] = useState(false)
  
  const router = useRouter()

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = 
      account.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || account.status === statusFilter

    return matchesSearch && matchesStatus
  })

  function openPricingModal(account: WholesaleAccount) {
    setSelectedAccount(account)
    setDiscountPercent(account.discountPercent)
    
    // Initialize custom prices from existing data
    const prices: Record<string, { price: number; subscriptionPrice: number | null }> = {}
    account.customPricing.forEach(cp => {
      prices[cp.productId] = {
        price: cp.price,
        subscriptionPrice: cp.subscriptionPrice
      }
    })
    setCustomPrices(prices)
  }

  function openEditModal(account: WholesaleAccount) {
    setEditingAccount(account)
    setFormData({
      email: account.user.email,
      password: "",
      name: account.user.name || "",
      companyName: account.companyName,
      status: account.status,
      discountPercent: account.discountPercent?.toString() || ""
    })
    setFormError(null)
    setShowEditModal(true)
  }

  async function updateAccountStatus(accountId: string, newStatus: string) {
    try {
      const res = await fetch("/api/admin/wholesale", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accountId, status: newStatus })
      })

      if (res.ok) {
        setAccounts(accounts.map(a => 
          a.id === accountId ? { ...a, status: newStatus } : a
        ))
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to update account:", error)
    }
  }

  async function createAccount() {
    setFormError(null)
    setSaving(true)
    
    try {
      const res = await fetch("/api/admin/wholesale", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password || undefined,
          name: formData.name || undefined,
          companyName: formData.companyName || undefined,
          status: formData.status,
          discountPercent: formData.discountPercent ? parseFloat(formData.discountPercent) : undefined
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setFormError(data.error || "Failed to create account")
        return
      }

      // Add to local state
      setAccounts([data.account, ...accounts])
      setShowCreateModal(false)
      setFormData(initialFormState)
      router.refresh()
    } catch (error) {
      console.error("Failed to create account:", error)
      setFormError("Failed to create account")
    } finally {
      setSaving(false)
    }
  }

  async function updateAccount() {
    if (!editingAccount) return
    
    setFormError(null)
    setSaving(true)
    
    try {
      const res = await fetch("/api/admin/wholesale", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId: editingAccount.id,
          email: formData.email,
          password: formData.password || undefined,
          name: formData.name || undefined,
          companyName: formData.companyName || undefined,
          status: formData.status,
          discountPercent: formData.discountPercent ? parseFloat(formData.discountPercent) : null
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setFormError(data.error || "Failed to update account")
        return
      }

      // Update local state
      setAccounts(accounts.map(a => 
        a.id === editingAccount.id 
          ? { 
              ...a, 
              companyName: formData.companyName || a.companyName,
              status: formData.status,
              discountPercent: formData.discountPercent ? parseFloat(formData.discountPercent) : null,
              user: {
                ...a.user,
                email: formData.email,
                name: formData.name || null
              }
            } 
          : a
      ))
      setShowEditModal(false)
      setEditingAccount(null)
      setFormData(initialFormState)
      router.refresh()
    } catch (error) {
      console.error("Failed to update account:", error)
      setFormError("Failed to update account")
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteAccount() {
    if (!deleteAccount) return
    
    try {
      const res = await fetch(
        `/api/admin/wholesale?accountId=${deleteAccount.id}&deleteUser=${deleteUserToo}`,
        { method: "DELETE" }
      )

      if (res.ok) {
        setAccounts(accounts.filter(a => a.id !== deleteAccount.id))
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to delete account:", error)
    } finally {
      setDeleteAccount(null)
      setDeleteUserToo(false)
    }
  }

  async function savePricing() {
    if (!selectedAccount) return
    
    setSaving(true)
    try {
      const res = await fetch("/api/admin/wholesale/pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountId: selectedAccount.id,
          discountPercent,
          customPrices: Object.entries(customPrices).map(([productId, prices]) => ({
            productId,
            price: prices.price,
            subscriptionPrice: prices.subscriptionPrice
          }))
        })
      })

      if (res.ok) {
        // Update local state
        setAccounts(accounts.map(a => 
          a.id === selectedAccount.id 
            ? { ...a, discountPercent } 
            : a
        ))
        setSelectedAccount(null)
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to save pricing:", error)
    } finally {
      setSaving(false)
    }
  }

  function applyBulkDiscount() {
    if (discountPercent === null) return
    
    const newPrices: Record<string, { price: number; subscriptionPrice: number | null }> = {}
    products.forEach(product => {
      const discountMultiplier = 1 - (discountPercent / 100)
      newPrices[product.id] = {
        price: Math.round(product.price * discountMultiplier * 100) / 100,
        subscriptionPrice: product.subscriptionPrice 
          ? Math.round(product.subscriptionPrice * discountMultiplier * 100) / 100
          : null
      }
    })
    setCustomPrices(newPrices)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED": return "bg-green-500/20 text-green-400 border-green-500/30"
      case "PENDING": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "SUSPENDED": return "bg-red-500/20 text-red-400 border-red-500/30"
      default: return "bg-[#403c3a] text-[#a09a94] border-[#403c3a]"
    }
  }

  // Form component for create/edit
  const AccountForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-4">
      {formError && (
        <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-sm">
          {formError}
        </div>
      )}
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="wholesaler@company.com"
            className="bg-[#1a1816] border-[#403c3a]"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password">
            Password {isEdit && <span className="text-[#a09a94] text-xs">(leave blank to keep current)</span>}
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder={isEdit ? "••••••••" : "Enter password"}
              className="bg-[#1a1816] border-[#403c3a] pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 text-[#a09a94] hover:text-[#ebe7e4]"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Contact Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Smith"
            className="bg-[#1a1816] border-[#403c3a]"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name</Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            placeholder="ABC Research Labs (optional)"
            className="bg-[#1a1816] border-[#403c3a]"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="status">Account Status</Label>
          <Select 
            value={formData.status} 
            onValueChange={(value: string) => setFormData({ ...formData, status: value })}
          >
            <SelectTrigger className="bg-[#1a1816] border-[#403c3a]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#201c1a] border-[#403c3a]">
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="discountPercent">Default Discount %</Label>
          <div className="relative">
            <Input
              id="discountPercent"
              type="number"
              min="0"
              max="100"
              value={formData.discountPercent}
              onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
              placeholder="20"
              className="bg-[#1a1816] border-[#403c3a] pr-8"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a09a94]">%</span>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-[#201c1a] border-[#403c3a]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[#a09a94]">Total Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-[#ebe7e4]">{accounts.length}</p>
          </CardContent>
        </Card>
        <Card className="bg-[#201c1a] border-[#403c3a]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[#a09a94]">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-400">
              {accounts.filter(a => a.status === "APPROVED").length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#201c1a] border-[#403c3a]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[#a09a94]">Pending Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-400">
              {accounts.filter(a => a.status === "PENDING").length}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#201c1a] border-[#403c3a]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-[#a09a94]">Suspended</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-400">
              {accounts.filter(a => a.status === "SUSPENDED").length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters & Create Button */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a09a94]" />
          <Input
            placeholder="Search by company or email..."
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
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
          </SelectContent>
        </Select>
        <Button 
          onClick={() => {
            setFormData(initialFormState)
            setFormError(null)
            setShowCreateModal(true)
          }}
          className="bg-[#d2c6b8] text-[#201c1a] hover:bg-[#c4b8aa]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-[#403c3a] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-[#403c3a] hover:bg-transparent">
              <TableHead className="text-[#a09a94]">Company</TableHead>
              <TableHead className="text-[#a09a94]">Contact</TableHead>
              <TableHead className="text-[#a09a94]">Status</TableHead>
              <TableHead className="text-[#a09a94]">Discount</TableHead>
              <TableHead className="text-[#a09a94]">Orders</TableHead>
              <TableHead className="text-[#a09a94]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAccounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-[#a09a94]">
                  No wholesale accounts found
                </TableCell>
              </TableRow>
            ) : (
              filteredAccounts.map((account) => (
                <TableRow key={account.id} className="border-[#403c3a] hover:bg-[#201c1a]">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-[#403c3a] flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-[#d2c6b8]" />
                      </div>
                      <div>
                        <p className="font-medium text-[#ebe7e4]">{account.companyName || account.user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-[#ebe7e4]">{account.user.name || "N/A"}</p>
                    <p className="text-sm text-[#a09a94]">{account.user.email}</p>
                  </TableCell>
                  <TableCell>
                    <Select 
                      value={account.status} 
                      onValueChange={(value: string) => updateAccountStatus(account.id, value)}
                    >
                      <SelectTrigger className={`w-32 border ${getStatusColor(account.status)}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#201c1a] border-[#403c3a]">
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="APPROVED">Approved</SelectItem>
                        <SelectItem value="SUSPENDED">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-[#ebe7e4]">
                    {account.discountPercent 
                      ? `${account.discountPercent}%`
                      : <span className="text-[#a09a94]">Custom</span>
                    }
                  </TableCell>
                  <TableCell className="text-[#ebe7e4]">
                    {account._count.orders}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openPricingModal(account)}
                        className="border-[#403c3a] text-[#ebe7e4] hover:bg-[#403c3a]"
                      >
                        <DollarSign className="h-4 w-4 mr-1" />
                        Pricing
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => openEditModal(account)}
                        className="border-[#403c3a] text-[#ebe7e4] hover:bg-[#403c3a] h-8 w-8"
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setDeleteAccount(account)}
                        className="border-[#403c3a] text-red-400 hover:bg-red-500/20 hover:border-red-500/30 h-8 w-8"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Create Account Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="bg-[#201c1a] border-[#403c3a] text-[#ebe7e4] max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create Wholesale Account
            </DialogTitle>
            <DialogDescription className="text-[#a09a94]">
              Manually create a new wholesale account with custom pricing.
            </DialogDescription>
          </DialogHeader>
          
          <AccountForm />

          <DialogFooter className="mt-6">
            <Button
              variant="ghost"
              onClick={() => setShowCreateModal(false)}
              className="text-[#a09a94]"
            >
              Cancel
            </Button>
            <Button
              onClick={createAccount}
              disabled={saving || !formData.email}
              className="bg-[#d2c6b8] text-[#201c1a] hover:bg-[#c4b8aa]"
            >
              <Plus className="h-4 w-4 mr-2" />
              {saving ? "Creating..." : "Create Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Account Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="bg-[#201c1a] border-[#403c3a] text-[#ebe7e4] max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="h-5 w-5" />
              Edit Wholesale Account
            </DialogTitle>
            <DialogDescription className="text-[#a09a94]">
              Update account details for {editingAccount?.companyName}
            </DialogDescription>
          </DialogHeader>
          
          <AccountForm isEdit />

          <DialogFooter className="mt-6">
            <Button
              variant="ghost"
              onClick={() => {
                setShowEditModal(false)
                setEditingAccount(null)
              }}
              className="text-[#a09a94]"
            >
              Cancel
            </Button>
            <Button
              onClick={updateAccount}
              disabled={saving || !formData.email}
              className="bg-[#d2c6b8] text-[#201c1a] hover:bg-[#c4b8aa]"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteAccount} onOpenChange={() => setDeleteAccount(null)}>
        <AlertDialogContent className="bg-[#201c1a] border-[#403c3a]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#ebe7e4]">Delete Wholesale Account</AlertDialogTitle>
            <AlertDialogDescription className="text-[#a09a94]">
              Are you sure you want to delete the wholesale account for{" "}
              <span className="text-[#ebe7e4] font-medium">{deleteAccount?.companyName}</span>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="flex items-center space-x-2 py-2">
            <Checkbox
              id="deleteUser"
              checked={deleteUserToo}
              onCheckedChange={(checked) => setDeleteUserToo(checked === true)}
              className="border-[#403c3a]"
            />
            <label
              htmlFor="deleteUser"
              className="text-sm text-[#a09a94] cursor-pointer"
            >
              Also delete the user account ({deleteAccount?.user.email})
            </label>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-[#403c3a] text-[#a09a94] hover:bg-[#403c3a] hover:text-[#ebe7e4]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              className="bg-red-500 text-white hover:bg-red-600"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Pricing Modal */}
      <Dialog open={!!selectedAccount} onOpenChange={() => setSelectedAccount(null)}>
        <DialogContent className="bg-[#201c1a] border-[#403c3a] text-[#ebe7e4] max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Custom Pricing - {selectedAccount?.companyName}
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="bulk" className="w-full">
            <TabsList className="bg-[#1a1816] border border-[#403c3a]">
              <TabsTrigger value="bulk" className="data-[state=active]:bg-[#403c3a]">
                Bulk Discount
              </TabsTrigger>
              <TabsTrigger value="individual" className="data-[state=active]:bg-[#403c3a]">
                Individual Pricing
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bulk" className="space-y-4">
              <Card className="bg-[#1a1816] border-[#403c3a]">
                <CardHeader>
                  <CardTitle className="text-lg">Apply Bulk Discount</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-[#a09a94]">
                    Set a percentage discount off retail prices for all products.
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="space-y-2 flex-1">
                      <Label>Discount Percentage</Label>
                      <div className="relative">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={discountPercent || ""}
                          onChange={(e) => setDiscountPercent(e.target.value ? parseFloat(e.target.value) : null)}
                          placeholder="e.g. 20"
                          className="pr-8 bg-[#201c1a] border-[#403c3a]"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#a09a94]">%</span>
                      </div>
                    </div>
                    <Button
                      onClick={applyBulkDiscount}
                      disabled={!discountPercent}
                      className="mt-6 bg-[#d2c6b8] text-[#201c1a] hover:bg-[#c4b8aa]"
                    >
                      Apply to All Products
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="individual" className="space-y-4">
              <p className="text-sm text-[#a09a94]">
                Set individual prices for each product. Leave blank to use retail pricing.
              </p>
              
              <div className="grid gap-3 max-h-[400px] overflow-y-auto pr-2">
                {products.map((product) => {
                  const customPrice = customPrices[product.id]
                  const hasCustomPrice = !!customPrice
                  
                  return (
                    <div 
                      key={product.id}
                      className="flex items-center gap-4 p-3 rounded-lg bg-[#1a1816] border border-[#403c3a]"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#ebe7e4] truncate">{product.name}</p>
                        <p className="text-sm text-[#a09a94]">
                          Retail: ${product.price.toFixed(2)}
                          {product.subscriptionPrice && ` / $${product.subscriptionPrice.toFixed(2)} sub`}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="w-28">
                          <Label className="text-xs text-[#a09a94]">One-Time</Label>
                          <div className="relative">
                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[#a09a94] text-sm">$</span>
                            <Input
                              type="number"
                              step="0.01"
                              value={customPrice?.price ?? ""}
                              onChange={(e) => setCustomPrices({
                                ...customPrices,
                                [product.id]: {
                                  price: parseFloat(e.target.value) || product.price,
                                  subscriptionPrice: customPrice?.subscriptionPrice ?? product.subscriptionPrice
                                }
                              })}
                              placeholder={product.price.toFixed(2)}
                              className="pl-6 h-8 text-sm bg-[#201c1a] border-[#403c3a]"
                            />
                          </div>
                        </div>
                        
                        {product.subscriptionPrice && (
                          <div className="w-28">
                            <Label className="text-xs text-[#a09a94]">Subscription</Label>
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[#a09a94] text-sm">$</span>
                              <Input
                                type="number"
                                step="0.01"
                                value={customPrice?.subscriptionPrice ?? ""}
                                onChange={(e) => setCustomPrices({
                                  ...customPrices,
                                  [product.id]: {
                                    price: customPrice?.price ?? product.price,
                                    subscriptionPrice: e.target.value ? parseFloat(e.target.value) : null
                                  }
                                })}
                                placeholder={product.subscriptionPrice?.toFixed(2)}
                                className="pl-6 h-8 text-sm bg-[#201c1a] border-[#403c3a]"
                              />
                            </div>
                          </div>
                        )}
                        
                        {hasCustomPrice && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              const newPrices = { ...customPrices }
                              delete newPrices[product.id]
                              setCustomPrices(newPrices)
                            }}
                            className="h-8 w-8 text-[#a09a94] hover:text-red-400"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button
              variant="ghost"
              onClick={() => setSelectedAccount(null)}
              className="text-[#a09a94]"
            >
              Cancel
            </Button>
            <Button
              onClick={savePricing}
              disabled={saving}
              className="bg-[#d2c6b8] text-[#201c1a] hover:bg-[#c4b8aa]"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Pricing"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
