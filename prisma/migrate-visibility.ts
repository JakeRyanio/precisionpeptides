// Migration script to populate new product visibility and inventory fields
// Run with: npx ts-node prisma/migrate-visibility.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting migration of product visibility fields...')
  
  const products = await prisma.product.findMany()
  
  let updated = 0
  
  for (const product of products) {
    // Set activeRetail based on isActive AND NOT isWholesaleOnly
    const activeRetail = product.isActive && !product.isWholesaleOnly
    
    // Set activeWholesale based on isActive
    const activeWholesale = product.isActive
    
    await prisma.product.update({
      where: { id: product.id },
      data: {
        activeRetail,
        activeWholesale,
        inventory: product.inventory ?? 0
      }
    })
    
    updated++
    console.log(`  Updated: ${product.name} (retail: ${activeRetail}, wholesale: ${activeWholesale})`)
  }
  
  console.log(`\nMigration complete! Updated ${updated} products.`)
}

main()
  .catch((e) => {
    console.error('Migration failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
