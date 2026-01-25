/**
 * SKU Update Script
 * 
 * This script updates all product SKUs in the database based on the 
 * Precision Internal SKU's Google Sheet.
 * 
 * Run with: npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/update-skus.ts
 * Or: npx tsx prisma/update-skus.ts
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// SKU Data from Google Sheet: "Precision Internal SKU's"
// Format: { productName: string, dosage: string, sku: string }
const skuData = [
  // Retatrutide + Cagrilintide Combos
  { name: "Reta 5mg + Cagrilintide 5mg", dosage: "10mg", sku: "RETA-CAG-10" },
  { name: "Reta 10mg + Cagrilintide 10mg", dosage: "20mg", sku: "RETA-CAG-20" },
  
  // Retatrutide
  { name: "Retatrutide", dosage: "5mg", sku: "RETA-5" },
  { name: "Retatrutide", dosage: "10mg", sku: "RETA-10" },
  { name: "Retatrutide", dosage: "15mg", sku: "RETA-15" },
  { name: "Retatrutide", dosage: "20mg", sku: "RETA-20" },
  { name: "Retatrutide", dosage: "30mg", sku: "RETA-30" },
  { name: "Retatrutide", dosage: "40mg", sku: "RETA-40" },
  { name: "Retatrutide", dosage: "50mg", sku: "RETA-50" },
  { name: "Retatrutide", dosage: "60mg", sku: "RETA-60" },
  
  // Semaglutide
  { name: "Semaglutide", dosage: "2mg", sku: "SEMA-2" },
  { name: "Semaglutide", dosage: "5mg", sku: "SEMA-5" },
  { name: "Semaglutide", dosage: "5mg 20 vials", sku: "SEMA-5-20V" },
  { name: "Semaglutide", dosage: "10mg", sku: "SEMA-10" },
  { name: "Semaglutide", dosage: "15mg", sku: "SEMA-15" },
  { name: "Semaglutide", dosage: "20mg", sku: "SEMA-20" },
  
  // Tirzepatide
  { name: "Tirzepatide", dosage: "5mg", sku: "TIRZE-5" },
  { name: "Tirzepatide", dosage: "10mg", sku: "TIRZE-10" },
  { name: "Tirzepatide", dosage: "15mg", sku: "TIRZE-15" },
  { name: "Tirzepatide", dosage: "20mg", sku: "TIRZE-20" },
  { name: "Tirzepatide", dosage: "30mg", sku: "TIRZE-30" },
  { name: "Tirzepatide", dosage: "40mg", sku: "TIRZE-40" },
  { name: "Tirzepatide", dosage: "50mg", sku: "TIRZE-50" },
  { name: "Tirzepatide", dosage: "60mg", sku: "TIRZE-60" },
  { name: "Tirzepatide", dosage: "80mg", sku: "TIRZE-80" },
  
  // Adipotide/FTPP
  { name: "Adipotide/FTTP", dosage: "2mg", sku: "ADIP-FTPP-2" },
  { name: "Adipotide/FTTP", dosage: "5mg", sku: "ADIP-FTPP-5" },
  { name: "Adipotide/FTTP", dosage: "10mg", sku: "ADIP-FTPP-10" },
  
  // AICAR
  { name: "AICAR", dosage: "50mg", sku: "AICAR-50" },
  { name: "AICAR", dosage: "100mg", sku: "AICAR-100" },
  
  // AHK-Cu
  { name: "AHK-Cu", dosage: "100mg", sku: "AHK-CU-100" },
  
  // ARA290 (Cibinetide)
  { name: "ARA290", dosage: "10mg", sku: "ARA290-10" },
  { name: "ARA290", dosage: "16mg", sku: "ARA290-16" },
  
  // AOD9604
  { name: "AOD9604", dosage: "2mg", sku: "AOD9604-2" },
  { name: "AOD9604", dosage: "5mg", sku: "AOD9604-5" },
  { name: "AOD9604", dosage: "10mg", sku: "AOD9604-10" },
  
  // ACE 031
  { name: "ACE 031", dosage: "1mg", sku: "ACE031-1" },
  
  // BPC 157
  { name: "BPC 157 Oral", dosage: "500mcg x 100pcs", sku: "BPC157-ORAL-500-100C" },
  { name: "BPC 157", dosage: "2mg", sku: "BPC157-2" },
  { name: "BPC 157", dosage: "5mg", sku: "BPC157-5" },
  { name: "BPC 157", dosage: "10mg", sku: "BPC157-10" },
  { name: "BPC 157", dosage: "20mg", sku: "BPC157-20" },
  
  // BPC + TB Combos
  { name: "BPC 5mg + TB 5mg", dosage: "10mg", sku: "COMBO-BPC5-TB5" },
  { name: "BPC 10mg + TB 10mg", dosage: "20mg", sku: "COMBO-BPC10-TB10-20V" },
  
  // Bacteriostatic Water
  { name: "Bacteriostatic Water", dosage: "3ml", sku: "BW-3ML" },
  { name: "Bacteriostatic Water", dosage: "10ml", sku: "BW-10ML" },
  
  // Bioregulators
  { name: "Bronchogen", dosage: "20mg", sku: "BRONCHO-20-10P" },
  { name: "Cardiogen", dosage: "10mg", sku: "CARDIO-10-10P" },
  { name: "Cardiogen", dosage: "20mg", sku: "CARDIO-20-10P" },
  { name: "Cartalax", dosage: "20mg", sku: "CART-20-10P" },
  { name: "Chronluten", dosage: "10mg", sku: "CHRON-10-10P" },
  { name: "Cortagen", dosage: "10mg", sku: "CORT-10-10P" },
  { name: "Cortagen", dosage: "20mg", sku: "CORT-20-10P" },
  
  // Cagrilintide
  { name: "Cagrilintide", dosage: "5mg", sku: "CAGRI-5" },
  { name: "Cagrilintide", dosage: "10mg", sku: "CAGRI-10" },
  
  // Cagrisema
  { name: "Cagrisema", dosage: "5mg", sku: "CAGRISEMA-5" },
  
  // Cerebrolysin
  { name: "Cerebrolysin", dosage: "60mg", sku: "CEREBRO-60-6V" },
  
  // CJC-1295
  { name: "CJC1295 with DAC", dosage: "2mg", sku: "CJC-DAC-2" },
  { name: "CJC1295 with DAC", dosage: "5mg", sku: "CJC-DAC-5" },
  { name: "CJC 1295 without DAC", dosage: "2mg", sku: "CJC-NODAC-2" },
  { name: "CJC 1295 without DAC", dosage: "5mg", sku: "CJC-NODAC-5" },
  { name: "CJC 1295 + Ipamorelin", dosage: "10mg", sku: "CJC-IPA-10" },
  
  // Dihexa
  { name: "Dihexa Oral", dosage: "10mg x 60pc", sku: "DIHEXA-ORAL-10-60C" },
  { name: "Dihexa Oral", dosage: "20mg x 25pc", sku: "DIHEXA-ORAL-20-25C" },
  { name: "Dihexa", dosage: "10mg", sku: "DIHEXA-10" },
  
  // DSIP
  { name: "DSIP", dosage: "2mg", sku: "DSIP-2" },
  { name: "DSIP", dosage: "5mg", sku: "DSIP-5" },
  
  // Dulaglutide
  { name: "Dulaglutide", dosage: "5mg", sku: "DULA-5" },
  { name: "Dulaglutide", dosage: "10mg", sku: "DULA-10" },
  
  // Dermorphin
  { name: "Dermorphin", dosage: "2mg", sku: "DEMOR-2" },
  
  // Epithalon
  { name: "Epithalon", dosage: "10mg", sku: "EPITH-10" },
  { name: "Epithalon", dosage: "50mg", sku: "EPITH-50" },
  
  // FOXO4-DRI
  { name: "FOXO4-DRI", dosage: "2mg", sku: "FOX04-2" },
  { name: "FOXO4-DRI", dosage: "5mg", sku: "FOX04-5" },
  { name: "FOXO4-DRI", dosage: "10mg", sku: "FOX04-10" },
  
  // GHK-Cu
  { name: "GHK-Cu", dosage: "50mg", sku: "GHKCU-50" },
  { name: "GHK-Cu", dosage: "100mg", sku: "GHKCU-100" },
  
  // Glutathione
  { name: "Glutathione", dosage: "600mg", sku: "GLUTA-600" },
  { name: "Glutathione", dosage: "1500mg", sku: "GLUTA-1500" },
  
  // GHRP-2
  { name: "GHRP-2", dosage: "5mg", sku: "GHRP2-5" },
  { name: "GHRP-2", dosage: "10mg", sku: "GHRP2-10" },
  { name: "GHRP-2", dosage: "15mg", sku: "GHRP2-15" },
  
  // GHRP-6
  { name: "GHRP-6", dosage: "5mg", sku: "GHRP6-5" },
  { name: "GHRP-6", dosage: "10mg", sku: "GHRP6-10" },
  
  // Gonadorelin
  { name: "Gonadorelin Acetate", dosage: "2mg", sku: "GONA-2" },
  { name: "Gonadorelin Acetate", dosage: "5mg", sku: "GONA-5" },
  
  // HCG
  { name: "HCG", dosage: "1000iu", sku: "HCG-1000" },
  { name: "HCG", dosage: "2000iu", sku: "HCG-2000" },
  { name: "HCG", dosage: "5000iu", sku: "HCG-5000" },
  { name: "HCG", dosage: "6000iu", sku: "HCG-6000" },
  { name: "HCG", dosage: "10000iu", sku: "HCG-10000" },
  
  // HMG
  { name: "HMG", dosage: "75iu", sku: "HMG-75" },
  
  // HGH
  { name: "HGH", dosage: "6iu", sku: "HGH-6IU" },
  { name: "HGH", dosage: "8iu", sku: "HGH-8IU" },
  { name: "HGH", dosage: "10iu", sku: "HGH-10IU" },
  { name: "HGH", dosage: "10iu 50 vials", sku: "HGH-10IU-50V" },
  { name: "HGH", dosage: "12iu", sku: "HGH-12IU" },
  { name: "HGH", dosage: "15iu", sku: "HGH-15IU" },
  { name: "HGH", dosage: "15iu 20 vials", sku: "HGH-15IU-20V" },
  { name: "HGH", dosage: "24iu", sku: "HGH-24IU" },
  { name: "HGH", dosage: "24iu 20 vials", sku: "HGH-24IU-20V" },
  
  // Hexarelin
  { name: "Hexarelin", dosage: "2mg", sku: "HEXA-2" },
  { name: "Hexarelin", dosage: "5mg", sku: "HEXA-5" },
  
  // IGF-1 LR3
  { name: "IGF-1 LR3", dosage: "1mg", sku: "IGF1-LR3-1" },
  { name: "IGF-1 LR3", dosage: "0.1mg", sku: "IGF1-LR3-01" },
  
  // Ipamorelin
  { name: "Ipamorelin", dosage: "2mg", sku: "IPA-2" },
  { name: "Ipamorelin", dosage: "5mg", sku: "IPA-5" },
  { name: "Ipamorelin", dosage: "10mg", sku: "IPA-10" },
  
  // Kisspeptin
  { name: "Kisspeptin-10", dosage: "5mg", sku: "KISS-10-5" },
  { name: "Kisspeptin-10", dosage: "10mg", sku: "KISS-10-10" },
  
  // KPV
  { name: "KPV", dosage: "5mg", sku: "KPV-5" },
  { name: "KPV", dosage: "10mg", sku: "KPV-10" },
  
  // LL-37
  { name: "LL-37", dosage: "2mg", sku: "LL37-2" },
  { name: "LL-37", dosage: "5mg", sku: "LL37-5" },
  
  // Melanotan
  { name: "Melanotan I", dosage: "10mg", sku: "MT1-10" },
  { name: "Melanotan II", dosage: "10mg", sku: "MT2-10" },
  
  // MOTS-c
  { name: "MOTS-c", dosage: "5mg", sku: "MOTS-C-5" },
  { name: "MOTS-c", dosage: "10mg", sku: "MOTS-C-10" },
  { name: "MOTS-c", dosage: "20mg", sku: "MOTS-C-20" },
  { name: "MOTS-c", dosage: "40mg", sku: "MOTS-C-40" },
  
  // NAD+
  { name: "NAD+", dosage: "500mg", sku: "NAD-500" },
  { name: "NAD+", dosage: "1000mg", sku: "NAD-1000" },
  
  // Oxytocin
  { name: "Oxytocin", dosage: "5mg", sku: "OXY-5" },
  { name: "Oxytocin", dosage: "10mg", sku: "OXY-10" },
  
  // Ovagen
  { name: "Ovagen", dosage: "20mg", sku: "OVAGEN-20-10P" },
  
  // Pancragen
  { name: "Pancragen", dosage: "10mg", sku: "PANCR-10-10P" },
  
  // PE-22-28
  { name: "PE-22-28", dosage: "5mg", sku: "PE22-28-5" },
  
  // Pinealon
  { name: "Pinealon", dosage: "10mg", sku: "PINEAL-10-10P" },
  { name: "Pinealon", dosage: "20mg", sku: "PINEAL-20-10P" },
  
  // Prostamax
  { name: "Prostamax", dosage: "20mg", sku: "PROSTA-20-10P" },
  
  // PT-141
  { name: "PT-141", dosage: "10mg", sku: "PT141-10" },
  
  // Selank
  { name: "Selank", dosage: "5mg", sku: "SELANK-5" },
  { name: "Selank", dosage: "10mg", sku: "SELANK-10" },
  
  // Semax
  { name: "Semax", dosage: "5mg", sku: "SEMAX-5" },
  { name: "Semax", dosage: "10mg", sku: "SEMAX-10" },
  { name: "Semax", dosage: "30mg", sku: "SEMAX-30" },
  
  // Sermorelin
  { name: "Sermorelin", dosage: "2mg", sku: "SERM-2" },
  { name: "Sermorelin", dosage: "5mg", sku: "SERM-5" },
  { name: "Sermorelin", dosage: "10mg", sku: "SERM-10" },
  
  // Snap-8
  { name: "Snap-8", dosage: "10mg", sku: "SNAP8-10" },
  
  // SS-31 (Elamipretide)
  { name: "SS-31", dosage: "10mg", sku: "SS31-10" },
  { name: "SS-31", dosage: "50mg", sku: "SS31-50" },
  
  // Survodutide
  { name: "Survodutide", dosage: "10mg", sku: "SURVO-10" },
  
  // TB-500
  { name: "TB-500", dosage: "2mg", sku: "TB500-2" },
  { name: "TB-500", dosage: "5mg", sku: "TB500-5" },
  { name: "TB-500", dosage: "10mg", sku: "TB500-10" },
  
  // Tesamorelin
  { name: "Tesamorelin", dosage: "2mg", sku: "TESA-2" },
  { name: "Tesamorelin", dosage: "5mg", sku: "TESA-5" },
  { name: "Tesamorelin", dosage: "10mg", sku: "TESA-10" },
  { name: "Tesamorelin", dosage: "20mg", sku: "TESA-20" },
  
  // Testagen
  { name: "Testagen", dosage: "10mg", sku: "TESTA-10-10P" },
  
  // Tesofensine
  { name: "Tesofensine", dosage: "500mcg x 100pcs", sku: "TESO-500-100C" },
  
  // Thymalin
  { name: "Thymalin", dosage: "10mg", sku: "THYMA-10" },
  { name: "Thymalin", dosage: "20mg", sku: "THYMA-20" },
  
  // Thymosin Alpha-1
  { name: "Thymosin Alpha-1", dosage: "5mg", sku: "TA1-5" },
  { name: "Thymosin Alpha-1", dosage: "10mg", sku: "TA1-10" },
  
  // Thymosin Beta-4 (TB-500 fragment)
  { name: "Thymosin Beta-4", dosage: "5mg", sku: "TB4-5" },
  
  // VIP
  { name: "VIP", dosage: "5mg", sku: "VIP-5" },
  { name: "VIP", dosage: "10mg", sku: "VIP-10" },
  
  // 5-Amino-1MQ
  { name: "5-Amino-1MQ", dosage: "5mg", sku: "5A1MQ-5" },
  { name: "5-Amino-1MQ", dosage: "10mg", sku: "5A1MQ-10" },
  { name: "5-Amino-1MQ Oral", dosage: "50mcg x 60pcs", sku: "5A1MQ-ORAL-50-60C" },
  
  // FST-344 (Follistatin)
  { name: "FST-344", dosage: "1mg", sku: "FST344-1" },
  
  // Mazdutide
  { name: "Mazdutide", dosage: "10mg", sku: "MAZDU-10" },
  
  // L-Carnitine
  { name: "L-Carnitine", dosage: "5000mg", sku: "LCAR-5000" },
  
  // Lipo-C
  { name: "Lipo-C", dosage: "10ml", sku: "LIPOC-10ML" },
  
  // MIC (Lipo C with B12)
  { name: "MIC Lipo C B12", dosage: "10mg", sku: "MIC-LIPOC-B12-10" },
  
  // SR9009
  { name: "SR9009 Oral", dosage: "10mg", sku: "SR9009-ORAL-10" },
  
  // SLU-PP-322
  { name: "SLU-PP-322", dosage: "5mg", sku: "SLUPP322-5" },
  
  // SLU-PP-332 Oral
  { name: "SLU-PP-332 Oral", dosage: "250mcg x 100pcs", sku: "SLUPP332-ORAL-250-100C" },
  { name: "SLU-PP-332 Oral", dosage: "500mcg x 100pcs", sku: "SLUPP332-ORAL-500-100C" },
  { name: "SLU-PP-332 Oral", dosage: "1000mcg x 100pcs", sku: "SLUPP332-ORAL-1000-100C" },
  
  // GLOW Stack
  { name: "GLOW Stack", dosage: "70mg", sku: "GLOW-70" },
  { name: "GLOW Plus Stack", dosage: "80mg", sku: "GLOW-PLUS-80" },
]

// Mapping function to match Google Sheet SKUs to database products
// This maps various name formats to help with matching
const productNameMatchers: Record<string, string[]> = {
  // Retatrutide variations
  "RETA-10": ["retatrutide 10mg", "retatrutide-10mg"],
  "RETA-20": ["retatrutide 20mg", "retatrutide-20mg"],
  "RETA-40": ["retatrutide 40mg", "retatrutide-40mg"],
  "RETA-60": ["retatrutide 60mg", "retatrutide-60mg"],
  
  // Semaglutide variations
  "SEMA-10": ["semaglutide 10mg", "semaglutide-10mg"],
  "SEMA-20": ["semaglutide 20mg", "semaglutide-20mg"],
  
  // Tirzepatide variations
  "TIRZE-15": ["tirzepatide 15mg", "tirzepatide-15mg"],
  "TIRZE-30": ["tirzepatide 30mg", "tirzepatide-30mg"],
  "TIRZE-60": ["tirzepatide 60mg", "tirzepatide-60mg"],
  
  // Adipotide variations
  "ADIP-FTPP-5": ["adipotide/fttp 5mg", "adipotide 5mg", "adipotide-fttp-5mg"],
  
  // AOD9604 variations
  "AOD9604-5": ["aod9604 5mg", "aod9604-5mg", "aod 9604 5mg"],
  "AOD9604-10": ["aod9604 10mg", "aod9604-10mg", "aod 9604 10mg"],
  
  // BPC 157 variations
  "BPC157-ORAL-500-100C": ["bpc157 oral 500mcg x 100pcs", "bpc-157 oral 500mcg", "bpc157 oral"],
  "BPC157-5": ["bpc 157 5mg", "bpc-157 5mg", "bpc157-5mg"],
  "BPC157-10": ["bpc 157 10mg", "bpc-157 10mg", "bpc157-10mg"],
  "BPC157-20": ["bpc 157 20mg", "bpc-157 20mg", "bpc157-20mg"],
  
  // BPC + TB Combo
  "COMBO-BPC10-TB10-20V": ["bpc 10mg + tb 10mg", "bpc10mg-tb10mg-combo"],
  "COMBO-BPC5-TB5": ["bpc 5mg + tb 5mg", "bpc5mg+tb5mg"],
  
  // CJC-1295 variations
  "CJC-DAC-5": ["cjc1295 with dac 5mg", "cjc-1295 dac 5mg", "cjc1295-dac-5mg"],
  "CJC-NODAC-5": ["cjc 1295 (without dac) 5mg", "cjc 1295 without dac 5mg", "cjc1295-no-dac-5mg"],
  "CJC-IPA-10": ["cjc 1295 (without dac) 5mg + ipa 5mg", "cjc1295-ipamorelin-10mg"],
  
  // GHK-Cu variations
  "GHKCU-50": ["ghk-cu 50mg", "ghkcu 50mg", "ghk-cu-50mg"],
  "GHKCU-100": ["ghk-cu 100mg", "ghkcu 100mg", "ghk-cu-100mg"],
  
  // AHK-Cu variations
  "AHK-CU-100": ["ahk-cu 100mg", "ahkcu 100mg", "ahk-cu-100mg"],
  
  // Epithalon variations
  "EPITH-10": ["epithalon 10mg", "epithalon-10mg"],
  "EPITH-50": ["epithalon 50mg", "epithalon-50mg"],
  
  // MOTS-c variations
  "MOTS-C-10": ["mots-c (human) 10mg", "mots-c 10mg", "motsc-10mg"],
  "MOTS-C-20": ["mots-c (human) 20mg", "mots-c 20mg", "motsc-20mg"],
  "MOTS-C-40": ["mots-c (human) 40mg", "mots-c 40mg", "motsc-40mg"],
  
  // NAD+ variations
  "NAD-500": ["nad+ 500mg", "nad 500mg", "nad-500mg"],
  "NAD-1000": ["nad+ 1000mg", "nad 1000mg", "nad-1000mg"],
  
  // Cagrilintide variations
  "CAGRI-10": ["cagrilintide 10mg", "cagrilintide-10mg"],
  
  // Cagrisema variations
  "CAGRISEMA-5": ["cagrisema (2.5mg+2.5mg) 5mg", "cagrisema 5mg"],
  
  // Cerebrolysin variations
  "CEREBRO-60-6V": ["cerebrolysin 60mg", "cerebrolysin-60mg"],
  
  // Dihexa variations
  "DIHEXA-ORAL-10-60C": ["dihexa (oral) 10mg x 60pc", "dihexa oral 10mg"],
  "DIHEXA-ORAL-20-25C": ["dihexa (oral) 20mg x 25pc", "dihexa oral 20mg"],
  "DIHEXA-10": ["dihexa 10mg", "dihexa-10mg"],
  
  // DSIP variations
  "DSIP-5": ["dsip 5mg", "dsip-5mg"],
  
  // GHRP-2 variations
  "GHRP2-5": ["ghrp-2 5mg", "ghrp2 5mg", "ghrp-2-5mg"],
  "GHRP2-10": ["ghrp-2 10mg", "ghrp2 10mg", "ghrp-2-10mg"],
  "GHRP2-15": ["ghrp-2 15mg", "ghrp2 15mg", "ghrp-2-15mg"],
  
  // GHRP-6 variations
  "GHRP6-5": ["ghrp-6 5mg", "ghrp6 5mg", "ghrp-6-5mg"],
  "GHRP6-10": ["ghrp-6 10mg", "ghrp6 10mg", "ghrp-6-10mg"],
  
  // Glutathione variations
  "GLUTA-600": ["glutathione 600mg", "glutathione-600mg"],
  "GLUTA-1500": ["glutathione 1500mg", "glutathione-1500mg"],
  
  // HCG variations
  "HCG-5000": ["hcg 5000iu", "hcg-5000iu"],
  "HCG-10000": ["hcg 10000iu", "hcg-10000iu"],
  
  // ARA290 variations
  "ARA290-10": ["ara290 (cibinetide) 10mg", "ara290 10mg", "ara290-10mg"],
  "ARA290-16": ["ara290 (cibinetide) 16mg", "ara290 16mg", "ara290-16mg"],
  
  // Bioregulators
  "BRONCHO-20-10P": ["bronchogen 20mg", "bronchogen-20mg"],
  "CARDIO-10-10P": ["cardiogen 10mg", "cardiogen-10mg"],
  "CARDIO-20-10P": ["cardiogen 20mg", "cardiogen-20mg"],
  "CART-20-10P": ["cartalax 20mg", "cartalax-20mg"],
  "CHRON-10-10P": ["chronluten 10mg", "chronluten-10mg"],
  "CORT-10-10P": ["cortagen 10mg", "cortagen-10mg"],
  "CORT-20-10P": ["cortagen 20mg", "cortagen-20mg"],
  "OVAGEN-20-10P": ["ovagen 20mg", "ovagen-20mg"],
  "PANCR-10-10P": ["pancragen 10mg", "pancragen-10mg"],
  "PINEAL-10-10P": ["pinealon 10mg", "pinealon-10mg"],
  "PINEAL-20-10P": ["pinealon 20mg", "pinealon-20mg"],
  "PROSTA-20-10P": ["prostamax 20mg", "prostamax-20mg"],
  "TESTA-10-10P": ["testagen 10mg", "testagen-10mg"],
  
  // Ipamorelin variations
  "IPA-5": ["ipamorelin 5mg", "ipamorelin-5mg"],
  "IPA-10": ["ipamorelin 10mg", "ipamorelin-10mg"],
  
  // Sermorelin variations
  "SERM-5": ["sermorelin acetate 5mg", "sermorelin 5mg", "sermorelin-5mg"],
  "SERM-10": ["sermorelin acetate 10mg", "sermorelin 10mg", "sermorelin-10mg"],
  
  // Hexarelin variations
  "HEXA-2": ["hexarelin acetate 2mg", "hexarelin 2mg", "hexarelin-2mg"],
  "HEXA-5": ["hexarelin acetate 5mg", "hexarelin 5mg", "hexarelin-5mg"],
  
  // TB-500 variations
  "TB500-5": ["tb500 5mg", "tb-500 5mg", "tb500-5mg"],
  "TB500-10": ["tb500 10mg", "tb-500 10mg", "tb500-10mg"],
  
  // Thymosin Alpha-1 variations
  "TA1-5": ["thymosin alpha 1 5mg", "thymosin alpha-1 5mg", "ta1-5mg"],
  "TA1-10": ["thymosin alpha 1 10mg", "thymosin alpha-1 10mg", "ta1-10mg"],
  
  // LL-37 variations
  "LL37-2": ["ll37 2mg", "ll-37 2mg", "ll37-2mg"],
  "LL37-5": ["ll37 5mg", "ll-37 5mg", "ll37-5mg"],
  
  // KPV variations
  "KPV-5": ["kpv 5mg", "kpv-5mg"],
  "KPV-10": ["kpv 10mg", "kpv-10mg"],
  
  // VIP variations
  "VIP-5": ["vip 5mg", "vip-5mg"],
  "VIP-10": ["vip 10mg", "vip-10mg"],
  
  // SS-31 variations
  "SS31-10": ["ss-31 10mg", "ss31 10mg", "ss-31-10mg"],
  "SS31-50": ["ss-31 50mg", "ss31 50mg", "ss-31-50mg"],
  
  // Tesamorelin variations
  "TESA-10": ["tesamorelin 10mg", "tesamorelin-10mg"],
  "TESA-20": ["tesamorelin 20mg", "tesamorelin-20mg"],
  
  // IGF-1 LR3 variations
  "IGF1-LR3-1": ["igf-1 lr3 1mg", "igf1 lr3 1mg", "igf1-lr3-1mg"],
  
  // FST-344 variations
  "FST344-1": ["fst 344 1mg", "fst-344 1mg", "fst344-1mg"],
  
  // Selank variations
  "SELANK-5": ["selank 5mg", "selank-5mg"],
  "SELANK-10": ["selank 10mg", "selank-10mg"],
  
  // Semax variations
  "SEMAX-5": ["semax 5mg", "semax-5mg"],
  "SEMAX-10": ["semax 10mg", "semax-10mg"],
  "SEMAX-30": ["semax 30mg", "semax-30mg"],
  
  // PT-141 variations
  "PT141-10": ["pt141 10mg", "pt-141 10mg", "pt141-10mg"],
  
  // Oxytocin variations
  "OXY-5": ["oxytocin acetate 5mg", "oxytocin 5mg", "oxytocin-5mg"],
  "OXY-10": ["oxytocin acetate 10mg", "oxytocin 10mg", "oxytocin-10mg"],
  
  // Kisspeptin variations
  "KISS-10-5": ["kisspeptin-10 5mg", "kisspeptin 10 5mg", "kisspeptin-10-5mg"],
  "KISS-10-10": ["kisspeptin-10 10mg", "kisspeptin 10 10mg", "kisspeptin-10-10mg"],
  
  // Melanotan variations
  "MT1-10": ["melanotan i 10mg", "melanotan 1 10mg", "melanotan-i-10mg"],
  "MT2-10": ["melanotan ii 10mg", "melanotan 2 10mg", "melanotan-ii-10mg"],
  
  // Snap-8 variations
  "SNAP8-10": ["snap8 10mg", "snap-8 10mg", "snap8-10mg"],
  
  // GLOW variations
  "GLOW-70": ["glow (bpc 157 10mg + ghk-cu 50mg + tb500 10mg) 70mg", "glow 70mg", "glow-70mg"],
  "GLOW-PLUS-80": ["bpc 10mg + ghk-cu 50mg + tb500 10mg + kpv 10mg (80mg)", "glow plus 80mg"],
  
  // 5-Amino-1MQ variations
  "5A1MQ-5": ["5-amino-1mq 5mg", "5amino1mq 5mg", "5-amino-1mq-5mg"],
  "5A1MQ-10": ["5-amino-1mq 10mg", "5amino1mq 10mg", "5-amino-1mq-10mg"],
  "5A1MQ-ORAL-50-60C": ["5-amino-1mq oral 50mcg x 60pcs", "5-amino-1mq oral"],
  
  // Tesofensine variations
  "TESO-500-100C": ["tesofensine 500mcg x 100pcs", "tesofensine oral"],
  
  // L-Carnitine variations
  "LCAR-5000": ["l-carnitine 5000mg", "l carnitine 5000mg", "l-carnitine-5000mg"],
  
  // Lipo-C variations
  "LIPOC-10ML": ["lipo-c 10ml", "lipo c 10ml", "lipo-c-10ml"],
  
  // MIC variations
  "MIC-LIPOC-B12-10": ["mic (lipo c with b12) 10mg", "mic lipo c b12 10mg"],
  
  // SR9009 variations
  "SR9009-ORAL-10": ["sr9009 (oral) 10mg", "sr9009 oral 10mg"],
  
  // SLU-PP variations
  "SLUPP322-5": ["slu-pp-322 5mg", "slu pp 322 5mg"],
  "SLUPP332-ORAL-250-100C": ["slu-pp-332 (oral) 250mcg x 100pcs"],
  "SLUPP332-ORAL-500-100C": ["slu-pp-332 (oral) 500mcg x 100pcs"],
  "SLUPP332-ORAL-1000-100C": ["slu-pp-332 (oral) 1000mcg x 100pcs"],
  
  // Survodutide variations
  "SURVO-10": ["survodutide 10mg", "survodutide-10mg"],
  
  // Mazdutide variations
  "MAZDU-10": ["mazdutide 10mg", "mazdutide-10mg"],
}

function normalizeProductName(name: string): string {
  return name.toLowerCase().trim()
    .replace(/\s+/g, ' ')
    .replace(/[()]/g, '')
}

function findSkuForProduct(productName: string): string | null {
  const normalizedName = normalizeProductName(productName)
  
  // First, check direct matchers
  for (const [sku, matchers] of Object.entries(productNameMatchers)) {
    for (const matcher of matchers) {
      if (normalizedName === matcher || normalizedName.includes(matcher)) {
        return sku
      }
    }
  }
  
  // Then try to match from skuData by building product name
  for (const item of skuData) {
    const fullName = normalizeProductName(`${item.name} ${item.dosage}`)
    if (normalizedName === fullName || normalizedName.includes(fullName) || fullName.includes(normalizedName)) {
      return item.sku
    }
    // Also try just the base name with dosage extracted from product name
    const baseName = normalizeProductName(item.name)
    if (normalizedName.includes(baseName)) {
      // Extract dosage from product name
      const dosageMatch = normalizedName.match(/(\d+(?:\.\d+)?)(mg|mcg|iu|ml)/i)
      if (dosageMatch) {
        const productDosage = normalizeProductName(item.dosage)
        if (productDosage.includes(dosageMatch[0].toLowerCase())) {
          return item.sku
        }
      }
    }
  }
  
  return null
}

async function updateProductSkus() {
  console.log('🚀 Starting SKU update process...\n')
  
  try {
    // Fetch all products from database
    const products = await prisma.product.findMany({
      orderBy: { name: 'asc' }
    })
    
    console.log(`📦 Found ${products.length} products in database\n`)
    
    // Phase 1: Build mapping and identify conflicts
    console.log('📋 Phase 1: Analyzing products and building SKU mapping...\n')
    
    type ProductUpdate = {
      id: string
      name: string
      oldSku: string | null
      newSku: string
    }
    
    const pendingUpdates: ProductUpdate[] = []
    const notFoundProducts: string[] = []
    const skuToProductId: Map<string, string> = new Map()
    
    // First, map current SKUs to product IDs
    for (const product of products) {
      if (product.sku) {
        skuToProductId.set(product.sku, product.id)
      }
    }
    
    // Build list of updates needed
    for (const product of products) {
      const newSku = findSkuForProduct(product.name)
      
      if (newSku) {
        if (product.sku !== newSku) {
          pendingUpdates.push({
            id: product.id,
            name: product.name,
            oldSku: product.sku,
            newSku: newSku
          })
        }
      } else {
        notFoundProducts.push(product.name)
      }
    }
    
    console.log(`   Found ${pendingUpdates.length} products needing SKU updates`)
    console.log(`   Found ${notFoundProducts.length} products without SKU mapping\n`)
    
    // Phase 2: Clear conflicting SKUs first
    console.log('🔧 Phase 2: Clearing conflicting SKUs...\n')
    
    const skusToAssign = new Set(pendingUpdates.map(u => u.newSku))
    const productIdsToUpdate = new Set(pendingUpdates.map(u => u.id))
    
    // Find products that currently have SKUs we want to assign to other products
    for (const [currentSku, productId] of skuToProductId.entries()) {
      if (skusToAssign.has(currentSku) && !productIdsToUpdate.has(productId)) {
        // This product has a SKU we want to assign elsewhere - clear it first
        console.log(`   Clearing conflicting SKU "${currentSku}" from product ${productId}`)
        await prisma.product.update({
          where: { id: productId },
          data: { sku: null }
        })
      }
    }
    
    // Also clear SKUs from products we're about to update (to avoid unique constraint)
    for (const update of pendingUpdates) {
      if (update.oldSku && update.oldSku !== update.newSku) {
        // Check if another pending update wants this old SKU
        const wantsOldSku = pendingUpdates.some(u => u.newSku === update.oldSku && u.id !== update.id)
        if (wantsOldSku) {
          console.log(`   Clearing SKU "${update.oldSku}" from "${update.name}" (needed by another product)`)
          await prisma.product.update({
            where: { id: update.id },
            data: { sku: null }
          })
          update.oldSku = null
        }
      }
    }
    
    // Phase 3: Apply all SKU updates
    console.log('\n✏️  Phase 3: Applying SKU updates...\n')
    
    let updated = 0
    const updateResults: { name: string; oldSku: string | null; newSku: string }[] = []
    
    for (const update of pendingUpdates) {
      try {
        await prisma.product.update({
          where: { id: update.id },
          data: { sku: update.newSku }
        })
        updateResults.push({
          name: update.name,
          oldSku: update.oldSku,
          newSku: update.newSku
        })
        updated++
        console.log(`   ✓ ${update.name}: ${update.oldSku || '(none)'} → ${update.newSku}`)
      } catch (error: unknown) {
        const prismaError = error as { code?: string; message?: string }
        if (prismaError.code === 'P2002') {
          console.log(`   ⚠️ SKU "${update.newSku}" already exists, skipping ${update.name}`)
        } else {
          console.log(`   ❌ Failed to update ${update.name}: ${prismaError.message}`)
        }
      }
    }
    
    // Calculate skipped (already correct)
    const skipped = products.length - pendingUpdates.length - notFoundProducts.length
    
    // Print results
    console.log('\n' + '='.repeat(60))
    console.log('📊 UPDATE RESULTS')
    console.log('='.repeat(60))
    
    if (notFoundProducts.length > 0) {
      console.log('\n⚠️  Products without SKU mapping (need manual assignment):')
      for (const name of notFoundProducts) {
        console.log(`   - ${name}`)
      }
    }
    
    console.log('\n' + '='.repeat(60))
    console.log('📈 SUMMARY')
    console.log('='.repeat(60))
    console.log(`   Total products: ${products.length}`)
    console.log(`   ✅ Updated: ${updated}`)
    console.log(`   ⏭️  Skipped (already correct): ${skipped}`)
    console.log(`   ⚠️  Not found (need manual): ${notFoundProducts.length}`)
    console.log('='.repeat(60))
    
  } catch (error) {
    console.error('❌ Error updating SKUs:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run the update
updateProductSkus()
  .then(() => {
    console.log('\n✅ SKU update complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ SKU update failed:', error)
    process.exit(1)
  })
