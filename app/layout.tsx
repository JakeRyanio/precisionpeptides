import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/components/cart/cart-context"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL('https://precisionpeptides.store'),
  title: "Buy Research Peptides Online | 99.9% Pure Lab-Tested | Precision Peptides USA",
  description: "Shop premium research peptides with guaranteed 99.9% purity. Lab-tested, USA-made peptides for scientific research. Fast shipping, COA included. Order now!",
  keywords: "buy peptides online, research peptides USA, lab tested peptides, BPC-157 for sale, peptides research grade, pure peptides, HPLC tested peptides, lyophilized peptides, amino acids research, peptide synthesis",
  generator: 'v0.dev',
  openGraph: {
    title: "Buy Research Peptides Online | 99.9% Pure Lab-Tested | Precision Peptides USA",
    description: "Shop premium research peptides with guaranteed 99.9% purity. Lab-tested, USA-made peptides for scientific research. Fast shipping, COA included.",
    url: "https://precisionpeptides.store",
    siteName: "Precision Peptides",
    type: "website",
    images: [
      {
        url: "/images/precision-peptides-vial.png",
        width: 1200,
        height: 630,
        alt: "Premium Research Peptides - Lab Tested & USA Made"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Buy Research Peptides Online | 99.9% Pure Lab-Tested | Precision Peptides USA",
    description: "Shop premium research peptides with guaranteed 99.9% purity. Lab-tested, USA-made peptides for scientific research.",
    images: ["/images/precision-peptides-vial.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // You'll need to add this
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Precision Peptides",
              "url": "https://precisionpeptides.store",
              "logo": "https://precisionpeptides.store/images/logo.jpg",
              "description": "Premium research peptides with guaranteed 99.9% purity. Lab-tested, USA-made peptides for scientific research applications.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "US"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+1-XXX-XXX-XXXX",
                "contactType": "customer service",
                "email": "precisionpeptides@proton.me"
              },
              "sameAs": []
            })
          }}
        />
        {/* WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Precision Peptides",
              "url": "https://precisionpeptides.store",
              "description": "Premium research peptides for scientific applications",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://precisionpeptides.store/shop?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.className} bg-[#201c1a] text-[#ebe7e4] min-h-screen`}>
        <CartProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
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
