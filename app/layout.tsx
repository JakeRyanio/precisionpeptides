import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/components/cart/cart-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Precision Peptides - Research Peptides",
  description: "Premium research peptides for scientific applications. Precision. Purity. Potential.",
  keywords: "peptides, research, BPC-157, scientific, laboratory",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#201c1a] text-[#ebe7e4] min-h-screen`}>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </CartProvider>
        {/* PromoteKit Affiliate Tracking Script */}
        <script 
          async 
          src="https://cdn.promotekit.com/promotekit.js" 
          data-promotekit="4731abc5-b68c-4eda-9722-00ba5c401bbc"
        ></script>
      </body>
    </html>
  )
}
