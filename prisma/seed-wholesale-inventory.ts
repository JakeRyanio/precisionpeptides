import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Complete wholesale inventory with base wholesale prices
// isWholesaleOnly = true means hidden from retail shop, only visible to wholesale accounts
const wholesaleInventory = [
  // COMBO PRODUCTS
  { name: "Reta 5mg + Cagrilintide 5mg", dose: "10mg", price: 247.00, category: "Weight Management", isWholesaleOnly: true },
  { name: "Reta 10mg + Cagrilintide 10mg", dose: "20mg", price: 359.00, category: "Weight Management", isWholesaleOnly: true },
  
  // RETATRUTIDE
  { name: "Retatrutide", dose: "5mg", price: 74.00, category: "Weight Management", isWholesaleOnly: true },
  { name: "Retatrutide", dose: "10mg", price: 124.00, category: "Weight Management", isWholesaleOnly: false },
  { name: "Retatrutide", dose: "15mg", price: 168.00, category: "Weight Management", isWholesaleOnly: true },
  { name: "Retatrutide", dose: "20mg", price: 183.00, category: "Weight Management", isWholesaleOnly: false },
  { name: "Retatrutide", dose: "30mg", price: 276.00, category: "Weight Management", isWholesaleOnly: true },
  { name: "Retatrutide", dose: "40mg", price: 373.00, category: "Weight Management", isWholesaleOnly: false },
  { name: "Retatrutide", dose: "50mg", price: 443.00, category: "Weight Management", isWholesaleOnly: true },
  { name: "Retatrutide", dose: "60mg", price: 522.00, category: "Weight Management", isWholesaleOnly: false },
  
  // SEMAGLUTIDE
  { name: "Semaglutide", dose: "2mg", price: 30.00, category: "Weight Management", isWholesaleOnly: true },
  { name: "Semaglutide", dose: "5mg", price: 43.00, category: "Weight Management", isWholesaleOnly: true },
  { name: "Semaglutide", dose: "10mg", price: 55.00, category: "Weight Management", isWholesaleOnly: false },
  { name: "Semaglutide", dose: "15mg", price: 69.00, category: "Weight Management", isWholesaleOnly: true },
  { name: "Semaglutide", dose: "20mg", price: 85.00, category: "Weight Management", isWholesaleOnly: false },
  { name: "Semaglutide", dose: "30mg", price: 147.00, category: "Weight Management", isWholesaleOnly: true },
  
  // TIRZEPATIDE
  { name: "Tirzepatide", dose: "5mg", price: 49.00, category: "Weight Management", isWholesaleOnly: true },
  { name: "Tirzepatide", dose: "10mg", price: 161.00, category: "Weight Management", isWholesaleOnly: true },
  { name: "Tirzepatide", dose: "15mg", price: 184.00, category: "Weight Management", isWholesaleOnly: false },
  { name: "Tirzepatide", dose: "20mg", price: 207.00, category: "Weight Management", isWholesaleOnly: true },
  { name: "Tirzepatide", dose: "30mg", price: 253.00, category: "Weight Management", isWholesaleOnly: false },
  { name: "Tirzepatide", dose: "40mg", price: 199.00, category: "Weight Management", isWholesaleOnly: true },
  { name: "Tirzepatide", dose: "50mg", price: 238.00, category: "Weight Management", isWholesaleOnly: true },
  { name: "Tirzepatide", dose: "60mg", price: 277.00, category: "Weight Management", isWholesaleOnly: false },
  { name: "Tirzepatide", dose: "80mg", price: 408.00, category: "Weight Management", isWholesaleOnly: true },
  
  // ADIPOTIDE/FTTP
  { name: "Adipotide/FTTP", dose: "2mg", price: 113.00, category: "Weight Management", isWholesaleOnly: true },
  { name: "Adipotide/FTTP", dose: "5mg", price: 239.00, category: "Weight Management", isWholesaleOnly: false },
  { name: "Adipotide/FTTP", dose: "10mg", price: 357.00, category: "Weight Management", isWholesaleOnly: true },
  
  // AICAR
  { name: "AICAR", dose: "50mg", price: 120.00, category: "Weight Management", isWholesaleOnly: true },
  { name: "AICAR", dose: "100mg", price: 170.00, category: "Weight Management", isWholesaleOnly: true },
  
  // AHK-CU
  { name: "AHK-Cu", dose: "100mg", price: 90.00, category: "Skin & Beauty", isWholesaleOnly: false },
  
  // ARA290
  { name: "ARA290 (Cibinetide)", dose: "10mg", price: 120.00, category: "Immunity & Inflammation", isWholesaleOnly: false },
  { name: "ARA290 (Cibinetide)", dose: "16mg", price: 162.00, category: "Immunity & Inflammation", isWholesaleOnly: false },
  
  // AOD9604
  { name: "AOD9604", dose: "2mg", price: 70.00, category: "Weight Management", isWholesaleOnly: true },
  { name: "AOD9604", dose: "5mg", price: 143.00, category: "Weight Management", isWholesaleOnly: false },
  { name: "AOD9604", dose: "10mg", price: 256.00, category: "Weight Management", isWholesaleOnly: false },
  
  // ACE 031
  { name: "ACE 031", dose: "1mg", price: 79.00, category: "Growth & Performance", isWholesaleOnly: true },
  
  // BPC 157
  { name: "BPC157 Oral", dose: "500mcg x 100pcs", price: 77.00, category: "Healing & Recovery", isWholesaleOnly: false },
  { name: "BPC 157", dose: "2mg", price: 43.00, category: "Healing & Recovery", isWholesaleOnly: true },
  { name: "BPC 157", dose: "5mg", price: 55.00, category: "Healing & Recovery", isWholesaleOnly: false },
  { name: "BPC 157", dose: "10mg", price: 86.00, category: "Healing & Recovery", isWholesaleOnly: false },
  { name: "BPC 157", dose: "20mg", price: 132.00, category: "Healing & Recovery", isWholesaleOnly: false },
  
  // BPC + TB COMBOS
  { name: "BPC 5mg + TB 5mg", dose: "10mg", price: 127.00, category: "Healing & Recovery", isWholesaleOnly: true },
  { name: "BPC 10mg + TB 10mg", dose: "20mg", price: 225.00, category: "Healing & Recovery", isWholesaleOnly: false },
  
  // BAC WATER
  { name: "Bacteriostatic Water", dose: "3ml", price: 10.00, category: "Supplies", isWholesaleOnly: true },
  { name: "Bacteriostatic Water", dose: "10ml", price: 16.00, category: "Supplies", isWholesaleOnly: true },
  
  // BIOREGULATOR PEPTIDES
  { name: "Bronchogen", dose: "20mg", price: 202.00, category: "Bioregulator Peptides", isWholesaleOnly: false },
  { name: "Cardiogen", dose: "10mg", price: 164.00, category: "Bioregulator Peptides", isWholesaleOnly: false },
  { name: "Cardiogen", dose: "20mg", price: 202.00, category: "Bioregulator Peptides", isWholesaleOnly: false },
  { name: "Cartalax", dose: "20mg", price: 202.00, category: "Bioregulator Peptides", isWholesaleOnly: false },
  { name: "Chronluten", dose: "10mg", price: 164.00, category: "Bioregulator Peptides", isWholesaleOnly: false },
  { name: "Cortagen", dose: "10mg", price: 128.00, category: "Bioregulator Peptides", isWholesaleOnly: false },
  { name: "Cortagen", dose: "20mg", price: 202.00, category: "Bioregulator Peptides", isWholesaleOnly: false },
  { name: "Ovagen", dose: "20mg", price: 202.00, category: "Bioregulator Peptides", isWholesaleOnly: false },
  { name: "Pancragen", dose: "10mg", price: 150.00, category: "Bioregulator Peptides", isWholesaleOnly: false },
  { name: "Prostamax", dose: "20mg", price: 202.00, category: "Bioregulator Peptides", isWholesaleOnly: false },
  { name: "Pinealon", dose: "10mg", price: 150.00, category: "Bioregulator Peptides", isWholesaleOnly: false },
  { name: "Pinealon", dose: "20mg", price: 135.00, category: "Bioregulator Peptides", isWholesaleOnly: false },
  { name: "Testagen", dose: "10mg", price: 150.00, category: "Bioregulator Peptides", isWholesaleOnly: false },
  { name: "Vilon", dose: "20mg", price: 202.00, category: "Bioregulator Peptides", isWholesaleOnly: true },
  
  // CAGRILINTIDE
  { name: "Cagrilintide", dose: "5mg", price: 146.00, category: "Weight Management", isWholesaleOnly: true },
  { name: "Cagrilintide", dose: "10mg", price: 265.00, category: "Weight Management", isWholesaleOnly: false },
  { name: "Cagrisema (2.5mg+2.5mg)", dose: "5mg", price: 124.00, category: "Weight Management", isWholesaleOnly: false },
  
  // CEREBROLYSIN
  { name: "Cerebrolysin", dose: "60mg", price: 104.00, category: "Cognitive Enhancement", isWholesaleOnly: false },
  
  // CJC 1295
  { name: "CJC1295 with DAC", dose: "2mg", price: 109.00, category: "Growth & Performance", isWholesaleOnly: true },
  { name: "CJC1295 with DAC", dose: "5mg", price: 225.00, category: "Growth & Performance", isWholesaleOnly: false },
  { name: "CJC 1295 (without DAC)", dose: "2mg", price: 64.00, category: "Growth & Performance", isWholesaleOnly: true },
  { name: "CJC 1295 (without DAC)", dose: "5mg", price: 99.00, category: "Growth & Performance", isWholesaleOnly: false },
  { name: "CJC 1295 (without DAC) 5mg + IPA 5mg", dose: "10mg", price: 132.00, category: "Growth & Performance", isWholesaleOnly: false },
  
  // DIHEXA
  { name: "Dihexa (Oral)", dose: "10mg x 60pc", price: 81.00, category: "Cognitive Enhancement", isWholesaleOnly: false },
  { name: "Dihexa (Oral)", dose: "20mg x 25", price: 239.00, category: "Cognitive Enhancement", isWholesaleOnly: false },
  { name: "Dihexa", dose: "10mg", price: 120.00, category: "Cognitive Enhancement", isWholesaleOnly: false },
  
  // DSIP
  { name: "DSIP", dose: "2mg", price: 43.00, category: "Cognitive Enhancement", isWholesaleOnly: true },
  { name: "DSIP", dose: "5mg", price: 60.00, category: "Cognitive Enhancement", isWholesaleOnly: false },
  
  // DULAGLUTIDE
  { name: "Dulaglutide", dose: "5mg", price: 219.00, category: "Weight Management", isWholesaleOnly: true },
  { name: "Dulaglutide", dose: "10mg", price: 358.00, category: "Weight Management", isWholesaleOnly: true },
  
  // DEMORPHIN
  { name: "Demorphin", dose: "2mg", price: 45.00, category: "Research Peptides", isWholesaleOnly: true },
  
  // EPITHALON
  { name: "Epithalon", dose: "10mg", price: 63.00, category: "Anti-Aging & Longevity", isWholesaleOnly: false },
  { name: "Epithalon", dose: "50mg", price: 192.00, category: "Anti-Aging & Longevity", isWholesaleOnly: false },
  
  // FOX04
  { name: "FOX04", dose: "2mg", price: 139.00, category: "Anti-Aging & Longevity", isWholesaleOnly: true },
  { name: "FOX04", dose: "5mg", price: 213.00, category: "Anti-Aging & Longevity", isWholesaleOnly: true },
  { name: "FOX04", dose: "10mg", price: 463.00, category: "Anti-Aging & Longevity", isWholesaleOnly: true },
  { name: "FOXO4-DRI", dose: "10mg", price: 608.00, category: "Anti-Aging & Longevity", isWholesaleOnly: true },
  
  // GHK-CU
  { name: "GHK-Cu", dose: "50mg", price: 40.00, category: "Skin & Beauty", isWholesaleOnly: false },
  { name: "GHK-Cu", dose: "100mg", price: 60.00, category: "Skin & Beauty", isWholesaleOnly: false },
  
  // GLUTATHIONE
  { name: "Glutathione", dose: "600mg", price: 60.00, category: "Immunity & Inflammation", isWholesaleOnly: false },
  { name: "Glutathione", dose: "1500mg", price: 104.00, category: "Immunity & Inflammation", isWholesaleOnly: false },
  
  // GHRP
  { name: "GHRP-2", dose: "5mg", price: 55.00, category: "Growth & Performance", isWholesaleOnly: false },
  { name: "GHRP-2", dose: "10mg", price: 72.00, category: "Growth & Performance", isWholesaleOnly: false },
  { name: "GHRP-2", dose: "15mg", price: 98.00, category: "Growth & Performance", isWholesaleOnly: false },
  { name: "GHRP-6", dose: "5mg", price: 37.00, category: "Growth & Performance", isWholesaleOnly: false },
  { name: "GHRP-6", dose: "10mg", price: 60.00, category: "Growth & Performance", isWholesaleOnly: false },
  
  // GONADORELIN
  { name: "Gonadorelin Acetate", dose: "2mg", price: 41.00, category: "Sexual Health", isWholesaleOnly: true },
  { name: "Gonadorelin Acetate", dose: "5mg", price: 72.00, category: "Sexual Health", isWholesaleOnly: true },
  
  // HCG
  { name: "HCG", dose: "1000iu", price: 55.00, category: "Growth & Performance", isWholesaleOnly: true },
  { name: "HCG", dose: "2000iu", price: 67.00, category: "Growth & Performance", isWholesaleOnly: true },
  { name: "HCG", dose: "5000iu", price: 106.00, category: "Growth & Performance", isWholesaleOnly: false },
  { name: "HCG", dose: "6000iu", price: 98.00, category: "Growth & Performance", isWholesaleOnly: true },
  { name: "HCG", dose: "10000iu", price: 199.00, category: "Growth & Performance", isWholesaleOnly: false },
  
  // HMG
  { name: "HMG", dose: "75iu", price: 93.00, category: "Growth & Performance", isWholesaleOnly: true },
  
  // HGH
  { name: "HGH", dose: "6iu", price: 51.00, category: "Growth & Performance", isWholesaleOnly: true },
  { name: "HGH", dose: "8iu", price: 60.00, category: "Growth & Performance", isWholesaleOnly: true },
  { name: "HGH", dose: "10iu", price: 72.00, category: "Growth & Performance", isWholesaleOnly: true },
  { name: "HGH", dose: "12iu", price: 79.00, category: "Growth & Performance", isWholesaleOnly: true },
  { name: "HGH", dose: "15iu", price: 106.00, category: "Growth & Performance", isWholesaleOnly: true },
  { name: "HGH", dose: "24iu", price: 159.00, category: "Growth & Performance", isWholesaleOnly: true },
  
  // HGH FRAGMENT
  { name: "HGH Fragment 176-191", dose: "1mg", price: 53.00, category: "Weight Management", isWholesaleOnly: true },
  { name: "HGH Fragment 176-191", dose: "2mg", price: 70.00, category: "Weight Management", isWholesaleOnly: true },
  { name: "HGH Fragment 176-191", dose: "5mg", price: 137.00, category: "Weight Management", isWholesaleOnly: true },
  { name: "HGH Fragment 176-191", dose: "10mg", price: 236.00, category: "Weight Management", isWholesaleOnly: true },
  { name: "HGH Fragment 176-191", dose: "12mg", price: 275.00, category: "Weight Management", isWholesaleOnly: true },
  { name: "HGH Fragment 176-191", dose: "15mg", price: 311.00, category: "Weight Management", isWholesaleOnly: true },
  
  // HEXARELIN
  { name: "Hexarelin Acetate", dose: "2mg", price: 53.00, category: "Growth & Performance", isWholesaleOnly: false },
  { name: "Hexarelin Acetate", dose: "5mg", price: 113.00, category: "Growth & Performance", isWholesaleOnly: false },
  
  // HUMANIN
  { name: "Humanin", dose: "10mg", price: 390.00, category: "Anti-Aging & Longevity", isWholesaleOnly: true },
  
  // IPAMORELIN
  { name: "Ipamorelin", dose: "2mg", price: 40.00, category: "Growth & Performance", isWholesaleOnly: true },
  { name: "Ipamorelin", dose: "5mg", price: 58.00, category: "Growth & Performance", isWholesaleOnly: false },
  { name: "Ipamorelin", dose: "10mg", price: 99.00, category: "Growth & Performance", isWholesaleOnly: false },
  
  // KISSPEPTIN
  { name: "Kisspeptin-10", dose: "5mg", price: 72.00, category: "Sexual Health", isWholesaleOnly: false },
  { name: "Kisspeptin-10", dose: "10mg", price: 106.00, category: "Sexual Health", isWholesaleOnly: false },
  
  // LIRAGLUTIDE
  { name: "Liraglutide", dose: "5mg", price: 125.00, category: "Weight Management", isWholesaleOnly: true },
  { name: "Liraglutide", dose: "10mg", price: 231.00, category: "Weight Management", isWholesaleOnly: true },
  { name: "Liraglutide", dose: "30mg", price: 608.00, category: "Weight Management", isWholesaleOnly: true },
  
  // LL37
  { name: "LL37", dose: "2mg", price: 46.00, category: "Immunity & Inflammation", isWholesaleOnly: false },
  { name: "LL37", dose: "5mg", price: 125.00, category: "Immunity & Inflammation", isWholesaleOnly: false },
  
  // MAZDUTIDE
  { name: "Mazdutide", dose: "10mg", price: 173.00, category: "Weight Management", isWholesaleOnly: false },
  { name: "Mazdutide (Premium)", dose: "10mg", price: 291.00, category: "Weight Management", isWholesaleOnly: true },
  
  // MELANOTAN
  { name: "Melanotan I", dose: "10mg", price: 69.00, category: "Skin & Beauty", isWholesaleOnly: false },
  { name: "Melanotan II", dose: "10mg", price: 61.00, category: "Skin & Beauty", isWholesaleOnly: false },
  
  // MOTS-C
  { name: "MOTS-c (Human)", dose: "10mg", price: 90.00, category: "Anti-Aging & Longevity", isWholesaleOnly: false },
  { name: "MOTS-c (Human)", dose: "15mg", price: 146.00, category: "Anti-Aging & Longevity", isWholesaleOnly: true },
  { name: "MOTS-c (Human)", dose: "20mg", price: 183.00, category: "Anti-Aging & Longevity", isWholesaleOnly: false },
  { name: "MOTS-c (Human)", dose: "40mg", price: 291.00, category: "Anti-Aging & Longevity", isWholesaleOnly: false },
  
  // NAD+
  { name: "NAD+", dose: "100mg", price: 56.00, category: "Anti-Aging & Longevity", isWholesaleOnly: true },
  { name: "NAD+", dose: "500mg", price: 82.00, category: "Anti-Aging & Longevity", isWholesaleOnly: false },
  { name: "NAD+", dose: "1000mg", price: 99.00, category: "Anti-Aging & Longevity", isWholesaleOnly: false },
  
  // OXYTOCIN
  { name: "Oxytocin Acetate", dose: "2mg", price: 38.00, category: "Sexual Health", isWholesaleOnly: true },
  { name: "Oxytocin Acetate", dose: "5mg", price: 54.00, category: "Sexual Health", isWholesaleOnly: false },
  { name: "Oxytocin Acetate", dose: "10mg", price: 78.00, category: "Sexual Health", isWholesaleOnly: false },
  
  // PT141
  { name: "PT141", dose: "10mg", price: 86.00, category: "Sexual Health", isWholesaleOnly: false },
  
  // SERMORELIN
  { name: "Sermorelin Acetate", dose: "2mg", price: 67.00, category: "Growth & Performance", isWholesaleOnly: true },
  { name: "Sermorelin Acetate", dose: "5mg", price: 94.00, category: "Growth & Performance", isWholesaleOnly: false },
  { name: "Sermorelin Acetate", dose: "10mg", price: 152.00, category: "Growth & Performance", isWholesaleOnly: false },
  
  // SNAP8
  { name: "Snap8", dose: "10mg", price: 55.00, category: "Skin & Beauty", isWholesaleOnly: false },
  
  // KPV
  { name: "KPV", dose: "5mg", price: 54.00, category: "Immunity & Inflammation", isWholesaleOnly: false },
  { name: "KPV", dose: "10mg", price: 72.00, category: "Immunity & Inflammation", isWholesaleOnly: false },
  
  // SELANK
  { name: "Selank", dose: "5mg", price: 53.00, category: "Cognitive Enhancement", isWholesaleOnly: false },
  { name: "Selank", dose: "10mg", price: 79.00, category: "Cognitive Enhancement", isWholesaleOnly: false },
  
  // SEMAX
  { name: "Semax", dose: "5mg", price: 53.00, category: "Cognitive Enhancement", isWholesaleOnly: false },
  { name: "Semax", dose: "10mg", price: 68.00, category: "Cognitive Enhancement", isWholesaleOnly: false },
  { name: "Semax", dose: "30mg", price: 115.00, category: "Cognitive Enhancement", isWholesaleOnly: false },
  
  // SS-31
  { name: "SS-31", dose: "10mg", price: 106.00, category: "Anti-Aging & Longevity", isWholesaleOnly: false },
  { name: "SS-31", dose: "50mg", price: 430.00, category: "Anti-Aging & Longevity", isWholesaleOnly: false },
  
  // SR9009
  { name: "SR9009 (Oral)", dose: "10mg x 100", price: 113.00, category: "Weight Management", isWholesaleOnly: false },
  
  // TB500
  { name: "TB500", dose: "2mg", price: 60.00, category: "Healing & Recovery", isWholesaleOnly: true },
  { name: "TB500", dose: "5mg", price: 95.00, category: "Healing & Recovery", isWholesaleOnly: false },
  { name: "TB500", dose: "10mg", price: 175.00, category: "Healing & Recovery", isWholesaleOnly: false },
  
  // TESAMORELIN
  { name: "Tesamorelin", dose: "2mg", price: 87.00, category: "Growth & Performance", isWholesaleOnly: true },
  { name: "Tesamorelin", dose: "5mg", price: 132.00, category: "Growth & Performance", isWholesaleOnly: true },
  { name: "Tesamorelin", dose: "10mg", price: 246.00, category: "Growth & Performance", isWholesaleOnly: false },
  { name: "Tesamorelin", dose: "20mg", price: 423.00, category: "Growth & Performance", isWholesaleOnly: false },
  
  // THYMALIN
  { name: "Thymalin/Thymulin", dose: "10mg", price: 86.00, category: "Immunity & Inflammation", isWholesaleOnly: true },
  
  // THYMOSIN ALPHA 1
  { name: "Thymosin Alpha 1", dose: "5mg", price: 120.00, category: "Immunity & Inflammation", isWholesaleOnly: false },
  { name: "Thymosin Alpha 1", dose: "10mg", price: 245.00, category: "Immunity & Inflammation", isWholesaleOnly: false },
  
  // TRIPTORELIN
  { name: "Triptorelin Acetate", dose: "2mg", price: 64.00, category: "Sexual Health", isWholesaleOnly: true },
  
  // IGF-1
  { name: "IGF-1 LR3", dose: "100mcg", price: 53.00, category: "Growth & Performance", isWholesaleOnly: true },
  { name: "IGF-1 LR3", dose: "1mg", price: 291.00, category: "Growth & Performance", isWholesaleOnly: false },
  
  // FST 344
  { name: "FST 344", dose: "1mg", price: 363.00, category: "Growth & Performance", isWholesaleOnly: false },
  
  // LIPO-C
  { name: "Lipo-C", dose: "10ml", price: 104.00, category: "Weight Management", isWholesaleOnly: false },
  { name: "MIC (Lipo C with B12)", dose: "10mg", price: 156.00, category: "Weight Management", isWholesaleOnly: false },
  
  // LEMON BOTTLE
  { name: "Lemon Bottle", dose: "10ml", price: 93.00, category: "Weight Management", isWholesaleOnly: true },
  
  // VIP
  { name: "VIP", dose: "5mg", price: 114.00, category: "Immunity & Inflammation", isWholesaleOnly: false },
  { name: "VIP", dose: "10mg", price: 209.00, category: "Immunity & Inflammation", isWholesaleOnly: false },
  
  // SLU-PP-332
  { name: "SLU-PP-332 (inject)", dose: "5mg", price: 170.00, category: "Weight Management", isWholesaleOnly: false },
  { name: "SLU-PP-332 (oral)", dose: "250mcg x 100pcs", price: 82.00, category: "Weight Management", isWholesaleOnly: false },
  { name: "SLU-PP-332 (Oral)", dose: "500mcg x 100pcs", price: 90.00, category: "Weight Management", isWholesaleOnly: false },
  { name: "SLU-PP-332 (Oral)", dose: "1000mcg x 100pcs", price: 98.00, category: "Weight Management", isWholesaleOnly: false },
  { name: "SLU-PP-332 (Oral)", dose: "5mg x 100pcs", price: 113.00, category: "Weight Management", isWholesaleOnly: true },
  { name: "SLU-PP-332 (Oral)", dose: "20mg x 100pcs", price: 194.00, category: "Weight Management", isWholesaleOnly: true },
  
  // GLOW STACK
  { name: "GLOW (BPC 157 10mg + GHK-Cu 50mg + TB500 10mg)", dose: "70mg", price: 261.00, category: "Skin & Beauty", isWholesaleOnly: false },
  
  // BPC + GHK-Cu + TB500 + KPV
  { name: "BPC 10mg + GHK-Cu 50mg + TB500 10mg + KPV 10mg", dose: "80mg", price: 305.00, category: "Healing & Recovery", isWholesaleOnly: false },
  
  // PE-22-28
  { name: "PE-22-28", dose: "5mg", price: 113.00, category: "Cognitive Enhancement", isWholesaleOnly: false },
  
  // 5-AMINO-1MQ
  { name: "5-AMINO-1MQ", dose: "5mg", price: 56.00, category: "Weight Management", isWholesaleOnly: false },
  { name: "5-AMINO-1MQ", dose: "10mg", price: 77.00, category: "Weight Management", isWholesaleOnly: false },
  { name: "5-AMINO-1MQ (Oral)", dose: "50mcg x 60pcs", price: 93.00, category: "Weight Management", isWholesaleOnly: false },
  
  // SURVODUTIDE
  { name: "Survodutide", dose: "10mg", price: 378.00, category: "Weight Management", isWholesaleOnly: false },
  
  // L-CARNITINE
  { name: "L-Carnitine", dose: "5000mg", price: 90.00, category: "Weight Management", isWholesaleOnly: false },
  
  // TESOFENSINE
  { name: "Tesofensine", dose: "500mcg x 100pcs", price: 76.00, category: "Weight Management", isWholesaleOnly: false },
  
  // TADALAFIL
  { name: "Tadalafil", dose: "50mg x 100pc", price: 52.00, category: "Sexual Health", isWholesaleOnly: true },
  { name: "Tadalafil", dose: "50mg x 500pc", price: 230.00, category: "Sexual Health", isWholesaleOnly: true },
  { name: "Tadalafil", dose: "50mg x 1000pc", price: 403.00, category: "Sexual Health", isWholesaleOnly: true },
]

async function main() {
  console.log("🌱 Starting wholesale inventory sync...")
  console.log(`📦 Processing ${wholesaleInventory.length} products...\n`)

  let created = 0
  let updated = 0

  for (const item of wholesaleInventory) {
    const productName = `${item.name} ${item.dose}`
    
    // Check if product already exists (by name)
    const existing = await prisma.product.findFirst({
      where: { name: productName }
    })

    if (existing) {
      // Update existing product with wholesale info
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          wholesaleBasePrice: item.price,
          isWholesaleOnly: item.isWholesaleOnly,
          category: item.category,
        }
      })
      console.log(`  📝 Updated: ${productName}`)
      updated++
    } else {
      // Create new product
      await prisma.product.create({
        data: {
          name: productName,
          category: item.category,
          price: item.isWholesaleOnly ? item.price * 2 : item.price * 1.5, // Default retail markup
          subscriptionPrice: null,
          wholesaleBasePrice: item.price,
          image: "/images/precision-peptides-vial.png",
          overview: `High-quality ${item.name} peptide for research purposes.`,
          benefits: [],
          useCases: [],
          disclaimer: "This product is for research purposes only. Not for human consumption.",
          purity: 99.0,
          storage: "Store at -20°C",
          rating: 5.0,
          reviewCount: 0,
          isActive: true,
          isWholesaleOnly: item.isWholesaleOnly,
        }
      })
      console.log(`  ✅ Created: ${productName}`)
      created++
    }
  }

  console.log(`\n🎉 Inventory sync complete!`)
  console.log(`   Created: ${created} new products`)
  console.log(`   Updated: ${updated} existing products`)
  console.log(`   Total: ${wholesaleInventory.length} products processed`)
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
