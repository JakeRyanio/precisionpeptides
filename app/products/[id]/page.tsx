import { notFound } from "next/navigation"
import { ProductDetail } from "@/components/products/product-detail"
import { products } from "@/lib/products-data"
import { Metadata } from "next"

interface ProductPageProps {
  params: {
    id: string
  }
}

// Generate dynamic metadata for each product
export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = products.find((p) => p.id === params.id)
  
  if (!product) {
    return {
      title: "Product Not Found | Precision Peptides",
      description: "The requested product could not be found."
    }
  }

  const subscriptionText = product.subscriptionPrice ? ` | Subscribe & Save ${Math.round((1 - product.subscriptionPrice / product.price) * 100)}%` : ""
  
  return {
    title: `Buy ${product.name} Online | Premium Research Peptide${subscriptionText}`,
    description: `Shop ${product.name} research peptide - lab-tested, USA-made. ${(product.description || product.overview).substring(0, 100)}... Fast shipping with COA included.`,
    keywords: `buy ${product.name.toLowerCase()}, ${product.name.toLowerCase()} for sale, ${product.name.toLowerCase()} research peptide, ${product.name.toLowerCase()} online, research peptides, lab tested peptides`,
    openGraph: {
      title: `Buy ${product.name} Online | Premium Research Peptide`,
      description: `Shop ${product.name} research peptide - lab-tested, USA-made. Fast shipping with COA included.`,
      images: [product.image],
      url: `https://precisionpeptides.store/products/${product.id}`
    },
    alternates: {
      canonical: `https://precisionpeptides.store/products/${product.id}`
    }
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = products.find((p) => p.id === params.id)

  if (!product) {
    notFound()
  }

  return (
    <div>
      {/* Product Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "description": product.description || product.overview,
            "image": `https://precisionpeptides.store${product.image}`,
            "brand": {
              "@type": "Brand",
              "name": "Precision Peptides"
            },
            "offers": {
              "@type": "Offer",
              "priceCurrency": "USD",
              "price": product.price,
              "availability": "https://schema.org/InStock",
              "seller": {
                "@type": "Organization",
                "name": "Precision Peptides"
              },
              "validFrom": new Date().toISOString(),
              "url": `https://precisionpeptides.store/products/${product.id}`
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": product.reviews.rating,
              "reviewCount": product.reviews.count
            },
            "additionalProperty": [
              ...(product.purity ? [{
                "@type": "PropertyValue",
                "name": "Purity",
                "value": `${product.purity}%`
              }] : []),
              ...(product.storage ? [{
                "@type": "PropertyValue", 
                "name": "Storage",
                "value": product.storage
              }] : [])
            ]
          })
        }}
      />
      <ProductDetail product={product} />
    </div>
  )
}

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }))
}
