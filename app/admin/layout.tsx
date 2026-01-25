"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign,
  Menu,
  X,
  LogOut,
  ChevronRight,
  User
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/products", label: "Products & Pricing", icon: Package },
  { href: "/admin/wholesale", label: "Wholesale Accounts", icon: Users },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()

  // Don't show layout for login page
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-[#1a1816]">
      {/* Mobile Header */}
      <div className="lg:hidden sticky top-0 z-50 bg-[#201c1a] border-b border-[#403c3a] px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="text-[#ebe7e4]"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <span className="font-serif text-lg text-[#ebe7e4]">Admin Dashboard</span>
          </div>
          <Link href="/" className="text-[#a09a94] hover:text-[#ebe7e4] text-sm">
            Back to Store
          </Link>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 h-full w-64 bg-[#201c1a] border-r border-[#403c3a] z-50 transform transition-transform duration-200",
        "lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-[#403c3a]">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-serif text-xl text-[#ebe7e4]">Precision Peptides</h1>
                <p className="text-sm text-[#a09a94]">Owner Dashboard</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-[#a09a94]"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href || 
                (link.href !== "/admin" && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive 
                      ? "bg-[#d2c6b8]/10 text-[#d2c6b8]" 
                      : "text-[#a09a94] hover:bg-[#403c3a]/50 hover:text-[#ebe7e4]"
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  <span className="font-medium">{link.label}</span>
                  {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
                </Link>
              )
            })}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-[#403c3a] space-y-2">
            {session?.user && (
              <div className="px-4 py-2 text-sm">
                <div className="flex items-center gap-2 text-[#a09a94]">
                  <User className="h-4 w-4" />
                  <span className="truncate">{session.user.email}</span>
                </div>
              </div>
            )}
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#a09a94] hover:bg-[#403c3a]/50 hover:text-[#ebe7e4] transition-colors w-full"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen">
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
