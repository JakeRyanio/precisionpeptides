import { PrismaClient } from "@prisma/client"
import { products } from "../lib/products-data"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seed...")

  // Clear existing products
  console.log("🗑️  Clearing existing products...")
  await prisma.productWholesalePricing.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.product.deleteMany()

  console.log(`📦 Seeding ${products.length} products...`)

  for (const product of products) {
    await prisma.product.create({
      data: {
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        subscriptionPrice: product.subscriptionPrice,
        image: product.image,
        overview: product.overview,
        benefits: product.benefits,
        useCases: product.useCases,
        disclaimer: product.disclaimer,
        purity: product.purity || null,
        storage: product.storage || null,
        description: product.description || null,
        molecularWeight: product.molecularWeight || null,
        casNumber: product.casNumber || null,
        sequence: product.sequence || null,
        researchApplications: product.researchApplications || [],
        rating: product.reviews.rating,
        reviewCount: product.reviews.count,
        featuredReview: product.reviews.featured,
        isActive: true,
      },
    })
    console.log(`  ✅ ${product.name}`)
  }

  console.log(`\n🎉 Successfully seeded ${products.length} products!`)
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
