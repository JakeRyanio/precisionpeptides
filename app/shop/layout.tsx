import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shop Research Peptides | Premium Lab-Tested Peptides for Sale USA",
  description: "Browse our complete selection of research peptides. BPC-157, Semaglutide, Tirzepatide, TB-500 & more. 99.9% pure, HPLC tested, fast shipping. Shop peptides online now!",
  keywords: "shop peptides online, research peptides catalog, buy BPC-157, semaglutide for sale, tirzepatide peptide, TB-500 research, peptides store, lab grade peptides, research chemicals peptides"
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {/* Shop Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Research Peptides Shop",
            "description": "Complete collection of premium research peptides for scientific applications",
            "url": "https://precisionpeptides.store/shop"
          })
        }}
      />
      {children}
    </>
  )
}
