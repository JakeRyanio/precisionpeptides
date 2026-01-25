/**
 * Fix Remaining SKUs Script
 * 
 * This script fixes incorrect SKU mappings and adds missing SKUs.
 * 
 * Run with: npx tsx prisma/fix-remaining-skus.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Direct product name to SKU mappings for products that need correction or were missing
const directMappings: Record<string, string> = {
  // Fix incorrect mappings
  "GLOW (BPC 157 10mg + GHK-Cu 50mg + TB500 10mg) 70mg": "GLOW-70",
  "BPC 10mg + GHK-Cu 50mg + TB500 10mg + KPV 10mg (80mg)": "GLOW-PLUS-80",
  "KLOW STACK (BPC 10mg + GHK-Cu 50mg + TB500 10mg + KPV 10mg)": "GLOW-PLUS-80",
  "Reta 10mg + Cagrilintide 10mg 20mg": "RETA-CAG-20",
  "Reta 5mg + Cagrilintide 5mg 10mg": "RETA-CAG-10",
  "CJC 1295 (without DAC) 5mg + IPA 5mg (10mg)": "CJC-IPA-10",
  
  // BPC 157 products
  "BPC 157 2mg": "BPC157-2",
  "BPC 157 5mg": "BPC157-5",
  "BPC 157 10mg": "BPC157-10",
  "BPC 157 20mg": "BPC157-20",
  "BPC157 Oral 500mcg x 100pcs": "BPC157-ORAL-500-100C",
  
  // Cagrilintide products
  "Cagrilintide 5mg": "CAGRI-5",
  "Cagrilintide 10mg": "CAGRI-10",
  "Cagrisema (2.5mg+2.5mg) 5mg": "CAGRISEMA-5",
  
  // CJC products
  "CJC 1295 (without DAC) 2mg": "CJC-NODAC-2",
  "CJC 1295 (without DAC) 5mg": "CJC-NODAC-5",
  
  // Wolverine / BPC+TB combos
  "BPC 10mg + TB 10mg (20mg)": "COMBO-BPC10-TB10",
  "Wolverine Stack (BPC 10mg + TB 10mg)": "COMBO-BPC10-TB10",
  "BPC 5mg + TB 5mg (10mg)": "COMBO-BPC5-TB5",
  
  // Missing products from Google Sheet
  "5-AMINO-1MQ 5mg": "5A1MQ-5",
  "5-AMINO-1MQ 10mg": "5A1MQ-10",
  "5-AMINO-1MQ Oral 50mcg x 60pcs": "5A1MQ-ORAL-50-60C",
  "Adipotide/FTTP 2mg": "ADIP-FTPP-2",
  "Adipotide/FTTP 5mg": "ADIP-FTPP-5",
  "Adipotide/FTTP 10mg": "ADIP-FTPP-10",
  "AICAR 50mg": "AICAR-50",
  "AICAR 100mg": "AICAR-100",
  "AHK-Cu 100mg": "AHK-CU-100",
  "AOD9604 2mg": "AOD9604-2",
  "AOD9604 5mg": "AOD9604-5",
  "AOD9604 10mg": "AOD9604-10",
  "ACE 031 1mg": "ACE031-1",
  "ARA290 (Cibinetide) 10mg": "ARA290-10",
  "ARA290 (Cibinetide) 16mg": "ARA290-16",
  "Bacteriostatic Water 3ml": "BW-3ML",
  "Bacteriostatic Water 10ml": "BW-10ML",
  "Bronchogen 20mg": "BRONCHO-20-10P",
  "Cardiogen 10mg": "CARDIO-10-10P",
  "Cardiogen 20mg": "CARDIO-20-10P",
  "Cartalax 20mg": "CART-20-10P",
  "Cerebrolysin 60mg": "CEREBRO-60-6V",
  "Chronluten 10mg": "CHRON-10-10P",
  "Dermorphin 2mg": "DEMOR-2",
  "Demorphin 2mg": "DEMOR-2",
  
  // FOXO4 products
  "FOXO4-DRI 2mg": "FOX04-2",
  "FOXO4-DRI 5mg": "FOX04-5",
  "FOXO4-DRI 10mg": "FOX04-10",
  "FOX04 2mg": "FOX04-2",
  "FOX04 5mg": "FOX04-5",
  "FOX04 10mg": "FOX04-10",
  
  // HGH products
  "HGH 10iu 50 vials": "HGH-10IU-50V",
  "HGH 15iu 20 vials": "HGH-15IU-20V",
  "HGH 24iu 20 vials": "HGH-24IU-20V",
  
  // HGH Fragment (if in sheet - adding standard naming)
  "HGH Fragment 176-191 1mg": "HGHFRAG-1",
  "HGH Fragment 176-191 2mg": "HGHFRAG-2",
  "HGH Fragment 176-191 5mg": "HGHFRAG-5",
  "HGH Fragment 176-191 10mg": "HGHFRAG-10",
  "HGH Fragment 176-191 12mg": "HGHFRAG-12",
  "HGH Fragment 176-191 15mg": "HGHFRAG-15",
  
  // Humanin
  "Humanin 10mg": "HUMANIN-10",
  
  // IGF-1 LR3
  "IGF-1 LR3 100mcg": "IGF1-LR3-01",
  "IGF-1 LR3 0.1mg": "IGF1-LR3-01",
  
  // Lemon Bottle
  "Lemon Bottle 10ml": "LEMON-10ML",
  
  // Liraglutide
  "Liraglutide 5mg": "LIRA-5",
  "Liraglutide 10mg": "LIRA-10",
  "Liraglutide 30mg": "LIRA-30",
  
  // MIC
  "MIC (Lipo C with B12) 10mg": "MIC-LIPOC-B12-10",
  
  // MOTS-c
  "MOTS-c (Human) 10mg": "MOTS-C-10",
  "MOTS-c (Human) 15mg": "MOTS-C-15",
  "MOTS-c (Human) 20mg": "MOTS-C-20",
  "MOTS-c (Human) 40mg": "MOTS-C-40",
  "MOTS-c 10mg": "MOTS-C-10",
  "MOTS-c 15mg": "MOTS-C-15",
  "MOTS-c 20mg": "MOTS-C-20",
  "MOTS-c 40mg": "MOTS-C-40",
  
  // NAD+
  "NAD+ 100mg": "NAD-100",
  "NAD+ 500mg": "NAD-500",
  "NAD+ 1000mg": "NAD-1000",
  
  // Oxytocin
  "Oxytocin Acetate 2mg": "OXY-2",
  
  // Semaglutide
  "Semaglutide 30mg": "SEMA-30",
  
  // SLU-PP products
  "SLU-PP-322 5mg": "SLUPP322-5",
  "SLU-PP-332 (inject) 5mg": "SLUPP332-INJ-5",
  "SLU-PP-332 (Oral) 5mg x 100pcs": "SLUPP332-ORAL-5-100C",
  "SLU-PP-332 (Oral) 20mg x 100pcs": "SLUPP332-ORAL-20-100C",
  
  // Tadalafil
  "Tadalafil 50mg x 100pc": "TADA-50-100C",
  "Tadalafil 50mg x 500pc": "TADA-50-500C",
  "Tadalafil 50mg x 1000pc": "TADA-50-1000C",
  
  // TB500
  "TB500 2mg": "TB500-2",
  
  // Triptorelin
  "Triptorelin Acetate 2mg": "TRIP-2",
  
  // Vilon
  "Vilon 20mg": "VILON-20-10P",
  
  // Mazdutide - needs unique SKUs
  "Mazdutide 10mg": "MAZDU-10",
  "Mazdutide 10mg (Premium)": "MAZDU-10-PREM",
  "Mazdutide (Premium) 10mg": "MAZDU-10-PREM",
  
  // SR9009 - needs unique SKUs  
  "SR9009 (Oral) 10mg": "SR9009-ORAL-10",
  "SR9009 (Oral) 10mg x 100": "SR9009-ORAL-10-100C",
}

async function fixRemainingSkus() {
  console.log('🔧 Starting SKU fix process...\n')
  
  try {
    // Fetch all products
    const products = await prisma.product.findMany({
      orderBy: { name: 'asc' }
    })
    
    console.log(`📦 Found ${products.length} products in database\n`)
    
    // Phase 1: First, clear all SKUs that we're about to reassign
    console.log('🧹 Phase 1: Clearing SKUs that will be reassigned...\n')
    
    const skusToAssign = new Set(Object.values(directMappings))
    
    for (const product of products) {
      if (product.sku && skusToAssign.has(product.sku)) {
        // Check if this product should keep this SKU
        const expectedSku = directMappings[product.name]
        if (expectedSku !== product.sku) {
          console.log(`   Clearing SKU "${product.sku}" from "${product.name}"`)
          await prisma.product.update({
            where: { id: product.id },
            data: { sku: null }
          })
        }
      }
    }
    
    // Phase 2: Apply all direct mappings
    console.log('\n✏️  Phase 2: Applying direct SKU mappings...\n')
    
    let updated = 0
    let notFound = 0
    const updateResults: string[] = []
    const notFoundNames: string[] = []
    
    for (const [productName, sku] of Object.entries(directMappings)) {
      // Find product by name (case-insensitive)
      const product = products.find(p => 
        p.name.toLowerCase() === productName.toLowerCase()
      )
      
      if (product) {
        if (product.sku !== sku) {
          try {
            await prisma.product.update({
              where: { id: product.id },
              data: { sku: sku }
            })
            updateResults.push(`✓ ${product.name}: ${product.sku || '(none)'} → ${sku}`)
            updated++
          } catch (error: unknown) {
            const prismaError = error as { code?: string }
            if (prismaError.code === 'P2002') {
              updateResults.push(`⚠️ SKU "${sku}" conflict for ${product.name}`)
            } else {
              throw error
            }
          }
        }
      } else {
        notFoundNames.push(productName)
        notFound++
      }
    }
    
    // Print results
    console.log('Updates:')
    for (const result of updateResults) {
      console.log(`   ${result}`)
    }
    
    console.log('\n' + '='.repeat(60))
    console.log('📈 SUMMARY')
    console.log('='.repeat(60))
    console.log(`   ✅ Updated: ${updated}`)
    console.log(`   ❌ Product not found in DB: ${notFound}`)
    
    if (notFoundNames.length > 0) {
      console.log('\n   Names not found in database (may have different names):')
      for (const name of notFoundNames.slice(0, 20)) {
        console.log(`      - ${name}`)
      }
      if (notFoundNames.length > 20) {
        console.log(`      ... and ${notFoundNames.length - 20} more`)
      }
    }
    console.log('='.repeat(60))
    
    // Phase 3: Show products still without SKUs
    console.log('\n📋 Products still without SKUs:')
    
    const updatedProducts = await prisma.product.findMany({
      where: { sku: null },
      orderBy: { name: 'asc' }
    })
    
    for (const product of updatedProducts) {
      console.log(`   - ${product.name}`)
    }
    
    console.log(`\n   Total without SKUs: ${updatedProducts.length}`)
    
  } catch (error) {
    console.error('❌ Error fixing SKUs:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the fix
fixRemainingSkus()
  .then(() => {
    console.log('\n✅ SKU fix complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ SKU fix failed:', error)
    process.exit(1)
  })
