"use client"

import { useState } from "react"
import Image from "next/image"
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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
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
import { Badge } from "@/components/ui/badge"
import { Search, Edit2, Save, X, Plus, Trash2, Package } from "lucide-react"
import { useRouter } from "next/navigation"

type Product = {
  id: string
  name: string
  category: string
  price: number
  subscriptionPrice: number | null
  wholesaleBasePrice: number | null
  image: string
  isActive: boolean
  isWholesaleOnly: boolean
  // New visibility fields
  activeRetail: boolean
  activeWholesale: boolean
  // Inventory fields
  sku: string | null
  inventory: number
  lowStockThreshold: number | null
  purity: number | null
  overview: string
  benefits: string[]
  useCases: string[]
  disclaimer: string
  storage: string | null
}

const CATEGORIES = [
  "Weight Management",
  "Healing & Recovery",
  "Immunity & Inflammation",
  "Growth & Performance",
  "Anti-Aging & Longevity",
  "Cognitive Enhancement",
  "Bioregulator Peptides",
  "Sexual Health",
  "Skin & Beauty",
  "Research Peptides",
  "Stacks",
  "Supplies"
]

const emptyProduct: Omit<Product, 'id'> = {
  name: "",
  category: "Research Peptides",
  price: 0,
  subscriptionPrice: null,
  wholesaleBasePrice: null,
  image: "/images/precision-peptides-vial.png",
  isActive: true,
  isWholesaleOnly: false,
  activeRetail: true,
  activeWholesale: true,
  sku: null,
  inventory: 0,
  lowStockThreshold: null,
  purity: 99.0,
  overview: "High-quality research peptide for laboratory use only.",
  benefits: [],
  useCases: [],
  disclaimer: "This product is for research purposes only. Not for human consumption.",
  storage: "Store at -20°C"
}

export function ProductsTable({ products: initialProducts }: { products: Product[] }) {
  const [products, setProducts] = useState(initialProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isNewProduct, setIsNewProduct] = useState(false)
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()

  // Get unique categories from products
  const categories = Array.from(new Set(products.map(p => p.category))).sort()

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  function openNewProductModal() {
    setIsNewProduct(true)
    setEditingProduct(emptyProduct as Product)
  }

  async function saveProduct() {
    if (!editingProduct) return
    
    setSaving(true)
    try {
      if (isNewProduct) {
        // Create new product
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: editingProduct.name,
            category: editingProduct.category,
            price: editingProduct.price,
            subscriptionPrice: editingProduct.subscriptionPrice,
            wholesaleBasePrice: editingProduct.wholesaleBasePrice,
            image: editingProduct.image,
            isActive: editingProduct.isActive,
            isWholesaleOnly: editingProduct.isWholesaleOnly,
            activeRetail: editingProduct.activeRetail,
            activeWholesale: editingProduct.activeWholesale,
            sku: editingProduct.sku,
            inventory: editingProduct.inventory,
            lowStockThreshold: editingProduct.lowStockThreshold,
            purity: editingProduct.purity,
            overview: editingProduct.overview,
            benefits: editingProduct.benefits,
            useCases: editingProduct.useCases,
            disclaimer: editingProduct.disclaimer,
            storage: editingProduct.storage
          })
        })

        if (res.ok) {
          const data = await res.json()
          setProducts([...products, data.product])
          setEditingProduct(null)
          setIsNewProduct(false)
          router.refresh()
        } else {
          const error = await res.json()
          alert(error.error || "Failed to create product")
        }
      } else {
        // Update existing product
        const res = await fetch("/api/admin/products", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: editingProduct.id,
            name: editingProduct.name,
            category: editingProduct.category,
            price: editingProduct.price,
            subscriptionPrice: editingProduct.subscriptionPrice,
            wholesaleBasePrice: editingProduct.wholesaleBasePrice,
            image: editingProduct.image,
            isActive: editingProduct.isActive,
            isWholesaleOnly: editingProduct.isWholesaleOnly,
            activeRetail: editingProduct.activeRetail,
            activeWholesale: editingProduct.activeWholesale,
            sku: editingProduct.sku,
            inventory: editingProduct.inventory,
            lowStockThreshold: editingProduct.lowStockThreshold,
            purity: editingProduct.purity,
            overview: editingProduct.overview,
            benefits: editingProduct.benefits,
            useCases: editingProduct.useCases,
            disclaimer: editingProduct.disclaimer,
            storage: editingProduct.storage
          })
        })

        if (res.ok) {
          setProducts(products.map(p => 
            p.id === editingProduct.id ? editingProduct : p
          ))
          setEditingProduct(null)
          router.refresh()
        } else {
          const error = await res.json()
          alert(error.error || "Failed to update product")
        }
      }
    } catch (error) {
      console.error("Failed to save product:", error)
      alert("An error occurred while saving")
    } finally {
      setSaving(false)
    }
  }

  async function handleDeleteProduct() {
    if (!deleteProduct) return
    
    setDeleting(true)
    try {
      const res = await fetch("/api/admin/products", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: deleteProduct.id })
      })

      if (res.ok) {
        setProducts(products.filter(p => p.id !== deleteProduct.id))
        setDeleteProduct(null)
        router.refresh()
      } else {
        const error = await res.json()
        alert(error.error || "Failed to delete product")
      }
    } catch (error) {
      console.error("Failed to delete product:", error)
      alert("An error occurred while deleting")
    } finally {
      setDeleting(false)
    }
  }

  async function toggleProductActive(product: Product) {
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          isActive: !product.isActive
        })
      })

      if (res.ok) {
        setProducts(products.map(p => 
          p.id === product.id ? { ...p, isActive: !p.isActive } : p
        ))
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to toggle product:", error)
    }
  }

  async function toggleProductField(product: Product, field: 'activeRetail' | 'activeWholesale') {
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          [field]: !product[field]
        })
      })

      if (res.ok) {
        setProducts(products.map(p => 
          p.id === product.id ? { ...p, [field]: !p[field] } : p
        ))
        router.refresh()
      }
    } catch (error) {
      console.error(`Failed to toggle ${field}:`, error)
    }
  }

  return (
    <>
      {/* Inventory Value Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/10 rounded-lg border border-emerald-500/30 p-4">
          <p className="text-emerald-400/80 text-sm">Total Inventory Value (Retail)</p>
          <p className="text-3xl font-bold text-emerald-400">
            ${products.reduce((sum, p) => sum + (p.inventory * p.price), 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-[#201c1a] rounded-lg border border-[#403c3a] p-4">
          <p className="text-[#a09a94] text-sm">Total Units in Stock</p>
          <p className="text-3xl font-bold text-[#ebe7e4]">
            {products.reduce((sum, p) => sum + p.inventory, 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-[#201c1a] rounded-lg border border-[#403c3a] p-4">
          <p className="text-[#a09a94] text-sm">Average Unit Value</p>
          <p className="text-3xl font-bold text-[#d2c6b8]">
            ${(products.reduce((sum, p) => sum + p.inventory, 0) > 0 
              ? (products.reduce((sum, p) => sum + (p.inventory * p.price), 0) / products.reduce((sum, p) => sum + p.inventory, 0))
              : 0
            ).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Product Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="bg-[#201c1a] rounded-lg border border-[#403c3a] p-4">
          <p className="text-[#a09a94] text-sm">Total Products</p>
          <p className="text-2xl font-bold text-[#ebe7e4]">{products.length}</p>
        </div>
        <div className="bg-[#201c1a] rounded-lg border border-[#403c3a] p-4">
          <p className="text-[#a09a94] text-sm">Active Products</p>
          <p className="text-2xl font-bold text-green-400">{products.filter(p => p.isActive).length}</p>
        </div>
        <div className="bg-[#201c1a] rounded-lg border border-[#403c3a] p-4">
          <p className="text-[#a09a94] text-sm">Inactive Products</p>
          <p className="text-2xl font-bold text-red-400">{products.filter(p => !p.isActive).length}</p>
        </div>
        <div className="bg-[#201c1a] rounded-lg border border-[#403c3a] p-4">
          <p className="text-[#a09a94] text-sm">Low Stock</p>
          <p className="text-2xl font-bold text-yellow-400">
            {products.filter(p => p.lowStockThreshold && p.inventory <= p.lowStockThreshold && p.inventory > 0).length}
          </p>
        </div>
        <div className="bg-[#201c1a] rounded-lg border border-[#403c3a] p-4">
          <p className="text-[#a09a94] text-sm">Out of Stock</p>
          <p className="text-2xl font-bold text-red-400">
            {products.filter(p => p.inventory === 0).length}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a09a94]" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-[#201c1a] border-[#403c3a] text-[#ebe7e4]"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[200px] bg-[#201c1a] border-[#403c3a] text-[#ebe7e4]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent className="bg-[#201c1a] border-[#403c3a]">
            <SelectItem value="all" className="text-[#ebe7e4]">All Categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat} className="text-[#ebe7e4]">{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={openNewProductModal}
          className="bg-[#d2c6b8] text-[#201c1a] hover:bg-[#c4b8aa]"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-[#403c3a] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-[#403c3a] hover:bg-transparent">
              <TableHead className="text-[#a09a94]">Product</TableHead>
              <TableHead className="text-[#a09a94]">Category</TableHead>
              <TableHead className="text-[#a09a94]">SKU</TableHead>
              <TableHead className="text-[#a09a94]">Inventory</TableHead>
              <TableHead className="text-[#a09a94]">Price</TableHead>
              <TableHead className="text-[#a09a94]">Retail</TableHead>
              <TableHead className="text-[#a09a94]">Wholesale</TableHead>
              <TableHead className="text-[#a09a94] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-12">
                  <Package className="h-12 w-12 mx-auto text-[#403c3a] mb-4" />
                  <p className="text-[#a09a94]">No products found</p>
                  <p className="text-[#5a5654] text-sm mt-1">Try adjusting your search or filter</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id} className="border-[#403c3a] hover:bg-[#201c1a]">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-[#1a1816] shrink-0">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-[#ebe7e4] truncate">{product.name}</p>
                        {product.purity && (
                          <p className="text-sm text-[#a09a94]">{product.purity}% purity</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-[#403c3a] text-[#a09a94]">
                      {product.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-[#ebe7e4] font-mono text-sm">
                    {product.sku || <span className="text-[#5a5654]">—</span>}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${
                        product.inventory === 0 ? "text-red-400" :
                        product.lowStockThreshold && product.inventory <= product.lowStockThreshold 
                          ? "text-yellow-400" : "text-green-400"
                      }`}>
                        {product.inventory}
                      </span>
                      {product.inventory === 0 && (
                        <Badge className="bg-red-500/20 text-red-300 text-xs">Out</Badge>
                      )}
                      {product.lowStockThreshold && product.inventory > 0 && 
                       product.inventory <= product.lowStockThreshold && (
                        <Badge className="bg-yellow-500/20 text-yellow-300 text-xs">Low</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-[#ebe7e4] font-medium">
                    ${product.price.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={product.activeRetail}
                      onCheckedChange={() => toggleProductField(product, 'activeRetail')}
                      className="data-[state=checked]:bg-blue-500"
                    />
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={product.activeWholesale}
                      onCheckedChange={() => toggleProductField(product, 'activeWholesale')}
                      className="data-[state=checked]:bg-purple-500"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setIsNewProduct(false)
                          setEditingProduct(product)
                        }}
                        className="text-[#a09a94] hover:text-[#ebe7e4]"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteProduct(product)}
                        className="text-[#a09a94] hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <p className="text-sm text-[#5a5654] mt-4">
        Showing {filteredProducts.length} of {products.length} products
      </p>

      {/* Edit/Add Product Modal */}
      <Dialog open={!!editingProduct} onOpenChange={() => {
        setEditingProduct(null)
        setIsNewProduct(false)
      }}>
        <DialogContent className="bg-[#201c1a] border-[#403c3a] text-[#ebe7e4] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isNewProduct ? "Add New Product" : "Edit Product"}</DialogTitle>
            <DialogDescription className="text-[#a09a94]">
              {isNewProduct 
                ? "Fill in the details to add a new product to your catalog"
                : "Update the product information and pricing"
              }
            </DialogDescription>
          </DialogHeader>
          {editingProduct && (
            <div className="space-y-6">
              {/* Product Image Preview */}
              {!isNewProduct && (
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-[#1a1816]">
                    <Image
                      src={editingProduct.image}
                      alt={editingProduct.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      value={editingProduct.image}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        image: e.target.value
                      })}
                      className="bg-[#1a1816] border-[#403c3a] text-[#ebe7e4] mt-1"
                    />
                  </div>
                </div>
              )}

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      name: e.target.value
                    })}
                    placeholder="e.g., BPC-157 10mg"
                    className="bg-[#1a1816] border-[#403c3a] text-[#ebe7e4]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={editingProduct.category} 
                    onValueChange={(value) => setEditingProduct({
                      ...editingProduct,
                      category: value
                    })}
                  >
                    <SelectTrigger className="bg-[#1a1816] border-[#403c3a] text-[#ebe7e4]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#201c1a] border-[#403c3a]">
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat} className="text-[#ebe7e4]">{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purity">Purity (%)</Label>
                  <Input
                    id="purity"
                    type="number"
                    step="0.1"
                    value={editingProduct.purity || ""}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      purity: e.target.value ? parseFloat(e.target.value) : null
                    })}
                    placeholder="99.0"
                    className="bg-[#1a1816] border-[#403c3a] text-[#ebe7e4]"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-[#d2c6b8] border-b border-[#403c3a] pb-2">Retail Pricing</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Retail Price *</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a09a94]">$</span>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct({
                          ...editingProduct,
                          price: parseFloat(e.target.value) || 0
                        })}
                        className="pl-7 bg-[#1a1816] border-[#403c3a] text-[#ebe7e4]"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subscriptionPrice">Subscription Price</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a09a94]">$</span>
                      <Input
                        id="subscriptionPrice"
                        type="number"
                        step="0.01"
                        value={editingProduct.subscriptionPrice || ""}
                        onChange={(e) => setEditingProduct({
                          ...editingProduct,
                          subscriptionPrice: e.target.value ? parseFloat(e.target.value) : null
                        })}
                        placeholder="Optional"
                        className="pl-7 bg-[#1a1816] border-[#403c3a] text-[#ebe7e4]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Wholesale Pricing */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-green-400 border-b border-[#403c3a] pb-2">Wholesale Settings</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wholesaleBasePrice">Wholesale Base Price</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a09a94]">$</span>
                      <Input
                        id="wholesaleBasePrice"
                        type="number"
                        step="0.01"
                        value={editingProduct.wholesaleBasePrice || ""}
                        onChange={(e) => setEditingProduct({
                          ...editingProduct,
                          wholesaleBasePrice: e.target.value ? parseFloat(e.target.value) : null
                        })}
                        placeholder="Base price for wholesale"
                        className="pl-7 bg-[#1a1816] border-[#403c3a] text-[#ebe7e4]"
                      />
                    </div>
                    <p className="text-xs text-[#5a5654]">Default price shown to wholesale accounts</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Visibility</Label>
                    <div className="flex items-center space-x-3 h-10 px-3 bg-[#1a1816] border border-[#403c3a] rounded-md">
                      <Switch
                        id="wholesaleOnly"
                        checked={editingProduct.isWholesaleOnly}
                        onCheckedChange={(checked) => setEditingProduct({
                          ...editingProduct,
                          isWholesaleOnly: checked
                        })}
                        className="data-[state=checked]:bg-purple-500"
                      />
                      <Label htmlFor="wholesaleOnly" className="text-sm cursor-pointer">
                        {editingProduct.isWholesaleOnly ? "Wholesale Only" : "Retail + Wholesale"}
                      </Label>
                    </div>
                    <p className="text-xs text-[#5a5654]">
                      {editingProduct.isWholesaleOnly 
                        ? "Hidden from retail shop, only for wholesale" 
                        : "Visible on retail shop and wholesale catalogs"
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Overview */}
              <div className="space-y-2">
                <Label htmlFor="overview">Product Overview</Label>
                <Textarea
                  id="overview"
                  value={editingProduct.overview}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    overview: e.target.value
                  })}
                  rows={3}
                  className="bg-[#1a1816] border-[#403c3a] text-[#ebe7e4] resize-none"
                />
              </div>

              {/* Storage */}
              <div className="space-y-2">
                <Label htmlFor="storage">Storage Instructions</Label>
                <Input
                  id="storage"
                  value={editingProduct.storage || ""}
                  onChange={(e) => setEditingProduct({
                    ...editingProduct,
                    storage: e.target.value
                  })}
                  placeholder="e.g., Store at -20°C"
                  className="bg-[#1a1816] border-[#403c3a] text-[#ebe7e4]"
                />
              </div>

              {/* Active Toggle */}
              <div className="flex items-center justify-between p-4 bg-[#1a1816] rounded-lg">
                <div>
                  <Label htmlFor="active">Product Active</Label>
                  <p className="text-sm text-[#a09a94] mt-0.5">
                    Inactive products won&apos;t appear in the shop
                  </p>
                </div>
                <Switch
                  id="active"
                  checked={editingProduct.isActive}
                  onCheckedChange={(checked) => setEditingProduct({
                    ...editingProduct,
                    isActive: checked
                  })}
                  className="data-[state=checked]:bg-green-500"
                />
              </div>

              {/* Visibility Controls */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-[#d2c6b8] border-b border-[#403c3a] pb-2">
                  Channel Visibility
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between p-3 bg-[#1a1816] rounded-lg">
                    <div>
                      <Label htmlFor="activeRetail">Retail Active</Label>
                      <p className="text-xs text-[#5a5654]">Show on retail shop</p>
                    </div>
                    <Switch
                      id="activeRetail"
                      checked={editingProduct.activeRetail}
                      onCheckedChange={(checked) => setEditingProduct({
                        ...editingProduct,
                        activeRetail: checked
                      })}
                      className="data-[state=checked]:bg-blue-500"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#1a1816] rounded-lg">
                    <div>
                      <Label htmlFor="activeWholesale">Wholesale Active</Label>
                      <p className="text-xs text-[#5a5654]">Show in wholesale catalog</p>
                    </div>
                    <Switch
                      id="activeWholesale"
                      checked={editingProduct.activeWholesale}
                      onCheckedChange={(checked) => setEditingProduct({
                        ...editingProduct,
                        activeWholesale: checked
                      })}
                      className="data-[state=checked]:bg-purple-500"
                    />
                  </div>
                </div>
              </div>

              {/* Inventory Settings */}
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-[#d2c6b8] border-b border-[#403c3a] pb-2">
                  Inventory Management
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={editingProduct.sku || ""}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        sku: e.target.value || null
                      })}
                      placeholder="PEPTIDE-001"
                      className="bg-[#1a1816] border-[#403c3a] text-[#ebe7e4] font-mono"
                    />
                    <p className="text-xs text-[#5a5654]">Must match ShipStation SKU</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="inventory">Stock Quantity</Label>
                    <Input
                      id="inventory"
                      type="number"
                      min="0"
                      value={editingProduct.inventory}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        inventory: parseInt(e.target.value) || 0
                      })}
                      className="bg-[#1a1816] border-[#403c3a] text-[#ebe7e4]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lowStockThreshold">Low Stock Alert</Label>
                    <Input
                      id="lowStockThreshold"
                      type="number"
                      min="0"
                      value={editingProduct.lowStockThreshold || ""}
                      onChange={(e) => setEditingProduct({
                        ...editingProduct,
                        lowStockThreshold: e.target.value ? parseInt(e.target.value) : null
                      })}
                      placeholder="Optional"
                      className="bg-[#1a1816] border-[#403c3a] text-[#ebe7e4]"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setEditingProduct(null)
                setIsNewProduct(false)
              }}
              className="text-[#a09a94]"
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={saveProduct}
              disabled={saving || !editingProduct?.name || !editingProduct?.price}
              className="bg-[#d2c6b8] text-[#201c1a] hover:bg-[#c4b8aa]"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : (isNewProduct ? "Add Product" : "Save Changes")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteProduct} onOpenChange={() => setDeleteProduct(null)}>
        <AlertDialogContent className="bg-[#201c1a] border-[#403c3a]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#ebe7e4]">Delete Product</AlertDialogTitle>
            <AlertDialogDescription className="text-[#a09a94]">
              Are you sure you want to delete <span className="font-medium text-[#ebe7e4]">{deleteProduct?.name}</span>? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-[#403c3a] text-[#a09a94] hover:bg-[#2a2624] hover:text-[#ebe7e4]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
              disabled={deleting}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {deleting ? "Deleting..." : "Delete Product"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
