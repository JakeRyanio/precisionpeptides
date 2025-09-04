import { Hero } from "@/components/home/hero"
import { FeaturedProducts } from "@/components/home/featured-products"
import { FeaturedStack } from "@/components/home/featured-stack"
import { Benefits } from "@/components/home/benefits"
import { Testimonials } from "@/components/home/testimonials"
import { FloatingReviewButton } from "@/components/home/floating-review-button"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Buy Premium Research Peptides Online | 99.9% Pure Lab-Tested USA",
  description: "Shop the best research peptides online. BPC-157, Semaglutide, Tirzepatide & more. 99.9% purity guaranteed, HPLC tested, fast USA shipping. Order research-grade peptides now!",
  keywords: "buy peptides online, research peptides for sale, BPC-157 buy online, semaglutide research peptide, tirzepatide peptide, lab tested peptides USA, pure research peptides, HPLC tested peptides",
  openGraph: {
    title: "Buy Premium Research Peptides Online | 99.9% Pure Lab-Tested USA",
    description: "Shop the best research peptides online. BPC-157, Semaglutide, Tirzepatide & more. 99.9% purity guaranteed, HPLC tested, fast USA shipping.",
    images: ["/images/website-hero-section.png"]
  }
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Homepage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Premium Research Peptides - Lab Tested & USA Made",
            "description": "Buy premium research peptides with 99.9% purity guarantee. BPC-157, Semaglutide, Tirzepatide and more research-grade peptides.",
            "url": "https://precisionpeptides.store",
            "mainEntity": {
              "@type": "ItemList",
              "name": "Featured Research Peptides",
              "description": "Top-selling research peptides for scientific applications",
              "numberOfItems": 12
            }
          })
        }}
      />
      
      <header>
        <h1 className="sr-only">Buy Premium Research Peptides Online - Lab Tested & USA Made</h1>
      </header>
      
      <Hero />
      <FeaturedProducts />
      <FeaturedStack />
      <Benefits />
      <FloatingReviewButton />
      <Testimonials />
    </div>
  )
}
