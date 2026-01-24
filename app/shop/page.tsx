"use client"

import { useState, useEffect } from "react"
import { Search, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProductCard } from "@/components/products/product-card"
import type { Product } from "@/lib/products-data"

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [sortBy, setSortBy] = useState("name")

  // Get unique categories from products
  const categories = ["All", ...Array.from(new Set(products.map(p => p.category))).sort()]

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products")
        if (res.ok) {
          const data = await res.json()
          setProducts(data)
        }
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  useEffect(() => {
    // Handle category from URL params
    if (typeof window !== 'undefined' && products.length > 0) {
      const urlParams = new URLSearchParams(window.location.search)
      const categoryParam = urlParams.get("category")
      if (categoryParam) {
        const decodedCategory = decodeURIComponent(categoryParam)
        if (categories.includes(decodedCategory)) {
          setSelectedCategory(decodedCategory)
        }
      }
    }
  }, [products, categories])

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.overview.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.reviews.rating - a.reviews.rating
        default:
          return a.name.localeCompare(b.name)
      }
    })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 bg-[#201c1a] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-[#d2c6b8] mx-auto mb-4" />
          <p className="text-[#beb2a4]">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-[#201c1a] min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-medium mb-4 text-[#ebe7e4]">Research Peptides</h1>
        <p className="text-xl text-[#beb2a4] font-light">Premium quality peptides for advanced scientific research</p>
      </div>

      {/* Filters */}
      <div className="elegant-card p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#beb2a4] h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 elegant-input"
            />
          </div>

          {/* Category Filter */}
          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value)
              // Update URL when category changes
              const url = new URL(window.location.href)
              if (value === "All") {
                url.searchParams.delete("category")
              } else {
                url.searchParams.set("category", encodeURIComponent(value))
              }
              window.history.pushState({}, "", url.toString())
            }}
          >
            <SelectTrigger className="elegant-select">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-[#2a2624] border-[#403c3a]">
              {categories.map((category) => (
                <SelectItem key={category} value={category} className="text-[#ebe7e4] hover:bg-[#403c3a]">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="elegant-select">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-[#2a2624] border-[#403c3a]">
              <SelectItem value="name" className="text-[#ebe7e4] hover:bg-[#403c3a]">
                Name A-Z
              </SelectItem>
              <SelectItem value="price-low" className="text-[#ebe7e4] hover:bg-[#403c3a]">
                Price: Low to High
              </SelectItem>
              <SelectItem value="price-high" className="text-[#ebe7e4] hover:bg-[#403c3a]">
                Price: High to Low
              </SelectItem>
              <SelectItem value="rating" className="text-[#ebe7e4] hover:bg-[#403c3a]">
                Highest Rated
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Results Count */}
          <div className="flex items-center text-[#beb2a4] font-medium">{filteredProducts.length} products found</div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* No Results */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-xl text-[#beb2a4] mb-4">No products found</p>
          <p className="text-[#beb2a4]">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  )
}
