export interface Product {
  id: string
  name: string
  category: string
  price: number
  subscriptionPrice: number | null // 15% discount for monthly subscription, null for one-time only products
  image: string
  overview: string
  benefits: string[]
  useCases: string[]
  disclaimer: string
  reviews: {
    rating: number
    count: number
    featured: string
  }
  // SEO-focused fields (optional for backward compatibility)
  purity?: number // Purity percentage for SEO
  storage?: string // Storage requirements
  description?: string // SEO-optimized description
  molecularWeight?: string // For scientific SEO
  casNumber?: string // Chemical identifier for SEO
  sequence?: string // Peptide sequence for scientific searches
  researchApplications?: string[] // Specific research use cases
}

export const categories = [
  "All",
  "Weight Loss",
  "Skin & Beauty",
  "Recovery / Immunity",
  "Muscle Growth",
  "Longevity",
  "Sleep",
]

// Helper function to calculate subscription price with different discount rates
const getSubscriptionPrice = (price: number, productId?: string) => {
  // Products with 10% discount (the ones we just updated pricing on)
  const tenPercentDiscountProducts = [
    "tirzepatide-15mg",
    "tirzepatide-30mg", 
    "tirzepatide-60mg",
    "retatrutide-10mg",
    "semaglutide-5mg",
    "semaglutide-10mg",
    "semaglutide-15mg",
    "lipo-c-20ml-10mg",
    "ghk-cu-50mg",
    "bpc-157-5mg",
    "bpc-157-10mg",
    "tb-500-5mg",
    "tb-500-10mg",
    "mots-c-10mg-longevity",
    "nad-100mg",
    "dsip-5mg"
  ]
  
  // Use 10% discount for specified products, 15% for all others
  const discountRate = productId && tenPercentDiscountProducts.includes(productId) ? 0.90 : 0.85
  return Math.round(price * discountRate * 100) / 100
}

export const products: Product[] = [
  // Weight Loss Category - Ordered by mg size (smallest to largest)

  // Tirzepatide - 15mg, 30mg, 60mg
  {
    id: "tirzepatide-15mg",
    name: "Tirzepatide (15mg/vial)",
    category: "Weight Loss",
    price: 189.0,
    subscriptionPrice: getSubscriptionPrice(189.0, "tirzepatide-15mg"), // $170.10
    image: "/images/precision-peptides-vial.png",
    overview:
      "Tirzepatide is a dual GIP and GLP-1 receptor agonist developed to treat type 2 diabetes and support weight loss. It mimics the actions of incretin hormones, helping regulate blood sugar and appetite. Potential Benefits: Improves glycemic control, Promotes significant weight loss, Enhances insulin sensitivity, Reduces cardiovascular risk markers. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=tirzepatide",
    benefits: ["Glycemic control", "Weight loss", "Insulin sensitivity", "Cardiovascular risk reduction"],
    useCases: ["Comprehensive diabetes research", "Extended metabolic studies", "Advanced dosing protocols"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: { rating: 4.8, count: 89, featured: "Excellent mid-range option for comprehensive metabolic research." },
  },
  {
    id: "tirzepatide-30mg",
    name: "Tirzepatide (30mg/vial)",
    category: "Weight Loss",
    price: 329.0,
    subscriptionPrice: getSubscriptionPrice(329.0, "tirzepatide-30mg"), // $296.10
    image: "/images/precision-peptides-vial.png",
    overview:
      "Tirzepatide is a dual GIP and GLP-1 receptor agonist developed to treat type 2 diabetes and support weight loss. It mimics the actions of incretin hormones, helping regulate blood sugar and appetite. Potential Benefits: Improves glycemic control, Promotes significant weight loss, Enhances insulin sensitivity, Reduces cardiovascular risk markers. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=tirzepatide",
    benefits: ["Glycemic control", "Weight loss", "Insulin sensitivity", "Cardiovascular risk reduction"],
    useCases: ["Premium diabetes research", "Maximum dose studies", "Extended research protocols"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: {
      rating: 4.9,
      count: 45,
      featured: "Premium option for advanced research. Exceptional quality and concentration.",
    },
  },
  {
    id: "tirzepatide-60mg",
    name: "Tirzepatide (60mg/vial)",
    category: "Weight Loss",
    price: 599.0,
    subscriptionPrice: getSubscriptionPrice(599.0, "tirzepatide-60mg"), // $539.10
    image: "/images/precision-peptides-vial.png",
    overview:
      "Tirzepatide is a dual GIP and GLP-1 receptor agonist developed to treat type 2 diabetes and support weight loss. It mimics the actions of incretin hormones, helping regulate blood sugar and appetite. Potential Benefits: Improves glycemic control, Promotes significant weight loss, Enhances insulin sensitivity, Reduces cardiovascular risk markers. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=tirzepatide",
    benefits: ["Glycemic control", "Weight loss", "Insulin sensitivity", "Cardiovascular risk reduction"],
    useCases: ["Institutional research", "Bulk study applications", "Large-scale metabolic research"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: {
      rating: 4.9,
      count: 23,
      featured: "Exceptional value for large-scale research. Outstanding purity and concentration.",
    },
  },

  // Retatrutide - 10mg, 20mg, 30mg, 50mg
  {
    id: "retatrutide-10mg",
    name: "Retatrutide (10mg/vial)",
    category: "Weight Loss",
    price: 140.0,
    subscriptionPrice: getSubscriptionPrice(140.0, "retatrutide-10mg"), // $126.00
    image: "/images/precision-peptides-vial.png",
    overview:
      "Retatrutide is a novel triple agonist targeting GIP, GLP-1, and glucagon receptors. It's under investigation for treating obesity, diabetes, and metabolic conditions. Potential Benefits: Accelerates weight loss, Improves metabolic markers, Potential for non-alcoholic fatty liver disease (NAFLD) treatment, Enhances insulin sensitivity. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=retatrutide",
    benefits: [
      "Accelerates weight loss",
      "Improves metabolic markers",
      "Potential for non-alcoholic fatty liver disease (NAFLD) treatment",
      "Enhances insulin sensitivity",
    ],
    useCases: ["Advanced metabolic research", "Multi-receptor studies", "Novel therapy research"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: {
      rating: 4.8,
      count: 67,
      featured: "Cutting-edge for multi-receptor research. Excellent purity and performance.",
    },
  },
  {
    id: "retatrutide-20mg",
    name: "Retatrutide (20mg/vial)",
    category: "Weight Loss",
    price: 200.0,
    subscriptionPrice: getSubscriptionPrice(200.0), // $170.00
    image: "/images/precision-peptides-vial.png",
    overview:
      "Retatrutide is a novel triple agonist targeting GIP, GLP-1, and glucagon receptors. It's under investigation for treating obesity, diabetes, and metabolic conditions. Potential Benefits: Accelerates weight loss, Improves metabolic markers, Potential for non-alcoholic fatty liver disease (NAFLD) treatment, Enhances insulin sensitivity. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=retatrutide",
    benefits: [
      "Accelerates weight loss",
      "Improves metabolic markers",
      "Potential for non-alcoholic fatty liver disease (NAFLD) treatment",
      "Enhances insulin sensitivity",
    ],
    useCases: ["Advanced triple receptor research", "High-dose studies", "Extended research protocols"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: { rating: 4.8, count: 34, featured: "Excellent for advanced research protocols. Outstanding purity." },
  },
  {
    id: "retatrutide-30mg",
    name: "Retatrutide (30mg/vial)",
    category: "Weight Loss",
    price: 250.0,
    subscriptionPrice: getSubscriptionPrice(250.0), // $212.50
    image: "/images/precision-peptides-vial.png",
    overview:
      "Retatrutide is a novel triple agonist targeting GIP, GLP-1, and glucagon receptors. It's under investigation for treating obesity, diabetes, and metabolic conditions. Potential Benefits: Accelerates weight loss, Improves metabolic markers, Potential for non-alcoholic fatty liver disease (NAFLD) treatment, Enhances insulin sensitivity. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=retatrutide",
    benefits: [
      "Accelerates weight loss",
      "Improves metabolic markers",
      "Potential for non-alcoholic fatty liver disease (NAFLD) treatment",
      "Enhances insulin sensitivity",
    ],
    useCases: ["Institutional research", "Premium studies", "Advanced dosing protocols"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: {
      rating: 4.9,
      count: 19,
      featured: "Premium quality for institutional research. Exceptional concentration.",
    },
  },
  {
    id: "retatrutide-50mg",
    name: "Retatrutide (50mg/vial)",
    category: "Weight Loss",
    price: 300.0,
    subscriptionPrice: getSubscriptionPrice(300.0), // $255.00
    image: "/images/precision-peptides-vial.png",
    overview:
      "Retatrutide is a novel triple agonist targeting GIP, GLP-1, and glucagon receptors. It's under investigation for treating obesity, diabetes, and metabolic conditions. Potential Benefits: Accelerates weight loss, Improves metabolic markers, Potential for non-alcoholic fatty liver disease (NAFLD) treatment, Enhances insulin sensitivity. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=retatrutide",
    benefits: [
      "Accelerates weight loss",
      "Improves metabolic markers",
      "Potential for non-alcoholic fatty liver disease (NAFLD) treatment",
      "Enhances insulin sensitivity",
    ],
    useCases: ["Bulk research", "Institutional applications", "Large-scale studies"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: {
      rating: 4.9,
      count: 12,
      featured: "Outstanding value for bulk research. Exceptional quality and purity.",
    },
  },

  // Lean Clean Stack - Bundle Deal (One-time purchase only)
  {
    id: "lean-clean-stack",
    name: "Lean Clean Stack (Retatrutide 20mg + Glow 50)",
    category: "Weight Loss",
    price: 289.0,
    subscriptionPrice: null, // No subscription option for bundles
    image: "/images/lean-clean-stack.png",
    overview:
      "The Lean Clean Stack combines the powerful weight loss benefits of Retatrutide 20mg with the skin and recovery benefits of Glow 50. This bundle includes Retatrutide (20mg) - a novel triple agonist targeting GIP, GLP-1, and glucagon receptors for advanced weight loss research, plus Glow 50 (GHK-Cu 35mg, TB500 10mg, BPC157 5mg) - a proprietary blend for skin health and tissue repair. Save $51 when purchased together! Potential Benefits: Accelerates weight loss, Improves metabolic markers, Stimulates collagen production, Enhances skin quality, Supports tissue repair. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=retatrutide+ghk-cu",
    benefits: [
      "Accelerates weight loss and metabolic function",
      "Stimulates collagen and elastin production",
      "Improves skin quality and elasticity",
      "Enhances tissue repair and recovery",
      "Comprehensive aesthetic and metabolic research",
      "Save $51 compared to individual purchase"
    ],
    useCases: ["Combined weight loss and aesthetic research", "Comprehensive metabolic studies", "Multi-target research protocols", "Advanced body composition research"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: {
      rating: 4.9,
      count: 78,
      featured: "Perfect combination for comprehensive research. Excellent value and synergistic effects.",
    },
  },

  // Semaglutide - 5mg, 10mg, 15mg
  {
    id: "semaglutide-5mg",
    name: "Semaglutide (5mg/vial)",
    category: "Weight Loss",
    price: 149.0,
    subscriptionPrice: getSubscriptionPrice(149.0, "semaglutide-5mg"), // $134.10
    image: "/images/precision-peptides-vial.png",
    overview:
      "Semaglutide is a GLP-1 receptor agonist used for managing type 2 diabetes and chronic weight management. It enhances insulin secretion and suppresses appetite. Potential Benefits: Appetite suppression, Substantial weight reduction, Improved HbA1c levels, Cardiovascular risk reduction. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=semaglutide",
    benefits: [
      "Appetite suppression",
      "Substantial weight reduction",
      "Improved HbA1c levels",
      "Cardiovascular risk reduction",
    ],
    useCases: ["GLP-1 research", "Appetite studies", "Metabolic syndrome research", "Diabetes research"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: { rating: 4.7, count: 189, featured: "Reliable for GLP-1 research. Consistent quality across batches." },
  },
  {
    id: "semaglutide-10mg",
    name: "Semaglutide (10mg/vial)",
    category: "Weight Loss",
    price: 229.0,
    subscriptionPrice: getSubscriptionPrice(229.0, "semaglutide-10mg"), // $206.10
    image: "/images/precision-peptides-vial.png",
    overview:
      "Semaglutide is a GLP-1 receptor agonist used for managing type 2 diabetes and chronic weight management. It enhances insulin secretion and suppresses appetite. Potential Benefits: Appetite suppression, Substantial weight reduction, Improved HbA1c levels, Cardiovascular risk reduction. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=semaglutide",
    benefits: [
      "Appetite suppression",
      "Substantial weight reduction",
      "Improved HbA1c levels",
      "Cardiovascular risk reduction",
    ],
    useCases: ["Advanced GLP-1 research", "High-dose studies", "Extended protocols"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: {
      rating: 4.8,
      count: 98,
      featured: "Excellent for advanced GLP-1 research. High purity and effectiveness.",
    },
  },
  {
    id: "semaglutide-15mg",
    name: "Semaglutide (15mg/vial)",
    category: "Weight Loss",
    price: 299.0,
    subscriptionPrice: getSubscriptionPrice(299.0, "semaglutide-15mg"), // $269.10
    image: "/images/precision-peptides-vial.png",
    overview:
      "Semaglutide is a GLP-1 receptor agonist used for managing type 2 diabetes and chronic weight management. It enhances insulin secretion and suppresses appetite. Potential Benefits: Appetite suppression, Substantial weight reduction, Improved HbA1c levels, Cardiovascular risk reduction. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=semaglutide",
    benefits: [
      "Appetite suppression",
      "Substantial weight reduction",
      "Improved HbA1c levels",
      "Cardiovascular risk reduction",
    ],
    useCases: ["Premium GLP-1 research", "Specialized studies", "Advanced dosing protocols"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: {
      rating: 4.8,
      count: 56,
      featured: "Premium quality for specialized research. Outstanding concentration.",
    },
  },

  // Single dosage products
  {
    id: "tesamorelin-10mg",
    name: "Tesamorelin (10mg/vial)",
    category: "Weight Loss",
    price: 110.0,
    subscriptionPrice: getSubscriptionPrice(110.0), // $93.50
    image: "/images/precision-peptides-vial.png",
    overview:
      "Tesamorelin is a growth hormone-releasing hormone (GHRH) analog that stimulates the pituitary gland to secrete growth hormone. It's FDA-approved for HIV-associated lipodystrophy. Potential Benefits: Reduces visceral fat, Improves lipid profile, Enhances IGF-1 levels, Supports cognitive function. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=tesamorelin",
    benefits: [
      "Reduces visceral fat",
      "Improves lipid profile",
      "Enhances IGF-1 levels",
      "Supports cognitive function",
    ],
    useCases: ["Visceral adiposity research", "GHRH studies", "Body composition research"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: {
      rating: 4.6,
      count: 78,
      featured: "Excellent for visceral fat research. High purity and consistent performance.",
    },
  },

  // Lipo-C - 10ml, 20ml
  {
    id: "lipo-c-10ml-10mg",
    name: "Lipo-C (10ml*10mg/ml/vial)",
    category: "Weight Loss",
    price: 100.0,
    subscriptionPrice: getSubscriptionPrice(100.0),
    image: "/images/precision-peptides-vial.png",
    overview:
      "Lipo-C is a lipotropic injection containing compounds like methionine, inositol, choline, and B12. It's designed to aid fat metabolism and enhance liver function. Potential Benefits: Boosts metabolism, Supports liver detoxification, Increases energy levels, Enhances fat breakdown. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=lipo-c",
    benefits: [
      "Boosts metabolism",
      "Supports liver detoxification",
      "Increases energy levels",
      "Enhances fat breakdown",
    ],
    useCases: ["Metabolism research", "Fat studies", "Energy research", "Cellular metabolism"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: {
      rating: 4.5,
      count: 43,
      featured: "Good for metabolism research. Consistent quality and effectiveness.",
    },
  },
  {
    id: "lipo-c-20ml-10mg",
    name: "Lipo-C (20ml*10mg/ml/vial)",
    category: "Weight Loss",
    price: 165.0,
    subscriptionPrice: getSubscriptionPrice(165.0, "lipo-c-20ml-10mg"),
    image: "/images/precision-peptides-vial.png",
    overview:
      "Higher volume Lipo-C is a lipotropic injection containing compounds like methionine, inositol, choline, and B12. It's designed to aid fat metabolism and enhance liver function for extended research protocols. Potential Benefits: Boosts metabolism, Supports liver detoxification, Increases energy levels, Enhances fat breakdown. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=lipo-c",
    benefits: [
      "Boosts metabolism",
      "Supports liver detoxification",
      "Increases energy levels",
      "Enhances fat breakdown",
    ],
    useCases: ["Extended metabolism research", "Bulk studies", "Long-term protocols"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: {
      rating: 4.6,
      count: 29,
      featured: "Excellent value for extended research. Consistent quality throughout.",
    },
  },

  // Skin & Beauty Category - Ordered by mg size
  {
    id: "ghk-cu-50mg",
    name: "GHK-Cu (50mg/vial)",
    category: "Skin & Beauty",
    price: 61.0,
    subscriptionPrice: getSubscriptionPrice(61.0, "ghk-cu-50mg"),
    image: "/images/precision-peptides-vial.png",
    overview:
      "GHK-Cu is a copper peptide complex with strong regenerative, anti-inflammatory, and anti-aging properties. It's commonly used in dermatological products and wound healing protocols. Potential Benefits: Accelerates wound healing, Reduces inflammation, Stimulates collagen and hair growth, Improves skin texture and firmness. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=ghk-cu",
    benefits: [
      "Accelerates wound healing",
      "Reduces inflammation",
      "Stimulates collagen and hair growth",
      "Improves skin texture and firmness",
    ],
    useCases: ["Dermatological research", "Collagen studies", "Wound healing research", "Anti-aging research"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: {
      rating: 4.8,
      count: 167,
      featured: "Outstanding for collagen research. High-quality peptide with excellent purity.",
    },
  },
  {
    id: "mt-1",
    name: "MT-I (10mg/vial)",
    category: "Skin & Beauty",
    price: 40.0,
    subscriptionPrice: getSubscriptionPrice(40.0),
    image: "/images/precision-peptides-vial.png",
    overview:
      "Melanotan I is a synthetic analog of the natural hormone alpha-MSH that induces melanin production, offering a safer method to tan and potentially providing photoprotective benefits. Potential Benefits: Enhances natural tanning, May offer photoprotection, Reduces UV-related skin damage, Potential appetite-suppressing effects. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=melanotan+1",
    benefits: [
      "Enhances natural tanning",
      "May offer photoprotection",
      "Reduces UV-related skin damage",
      "Potential appetite-suppressing effects",
    ],
    useCases: ["Melanin research", "Skin pigmentation studies", "Dermatological research"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: { rating: 4.5, count: 89, featured: "Excellent for melanogenesis research with reduced side effects." },
  },
  {
    id: "mt-2",
    name: "MT-II (10mg/vial)",
    category: "Skin & Beauty",
    price: 40.0,
    subscriptionPrice: getSubscriptionPrice(40.0),
    image: "/images/precision-peptides-vial.png",
    overview:
      "Melanotan II is a more potent derivative of MT-I and offers both tanning and libido-enhancing effects. It works through the melanocortin receptors and is known for its dual cosmetic and sexual benefits. Potential Benefits: Promotes tanning with less sun exposure, Increases libido, Supports fat loss, Enhances skin protection. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=melanotan+2",
    benefits: [
      "Promotes tanning with less sun exposure",
      "Increases libido",
      "Supports fat loss",
      "Enhances skin protection",
    ],
    useCases: ["Melanin research", "Skin pigmentation studies", "UV protection research"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: { rating: 4.6, count: 134, featured: "Excellent for melanogenesis research. Consistent and pure." },
  },
  {
    id: "glow-50",
    name: "Glow 50 (GHK-Cu 35mg, TB500 10mg, BPC157 5mg)",
    category: "Skin & Beauty",
    price: 140.0,
    subscriptionPrice: getSubscriptionPrice(140.0),
    image: "/images/precision-peptides-vial.png",
    overview:
      "Glow 50 and Glow 70 are proprietary blends formulated to enhance aesthetics and regeneration. These combinations often include peptides like GHK-Cu, CJC-1295, and Ipamorelin to support skin health, fat reduction, and cellular repair. Potential Benefits: Stimulates collagen and elastin production, Improves skin quality and elasticity, Enhances fat metabolism, Supports tissue repair and anti-aging. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=glow+50+glow+70",
    benefits: [
      "Stimulates collagen and elastin production",
      "Improves skin quality and elasticity",
      "Enhances fat metabolism",
      "Supports tissue repair and anti-aging",
    ],
    useCases: ["Skin regeneration research", "Anti-aging studies", "Tissue repair research"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: {
      rating: 4.9,
      count: 143,
      featured: "Outstanding combination for skin research. Excellent synergistic effects.",
    },
  },
  {
    id: "glow-70",
    name: "Glow 70 (GHK-Cu 50mg, TB500 10mg, BPC157 10mg)",
    category: "Skin & Beauty",
    price: 170.0,
    subscriptionPrice: getSubscriptionPrice(170.0),
    image: "/images/precision-peptides-vial.png",
    overview:
      "Glow 50 and Glow 70 are proprietary blends formulated to enhance aesthetics and regeneration. These combinations often include peptides like GHK-Cu, CJC-1295, and Ipamorelin to support skin health, fat reduction, and cellular repair. Enhanced formula with higher concentrations for advanced research. Potential Benefits: Stimulates collagen and elastin production, Improves skin quality and elasticity, Enhances fat metabolism, Supports tissue repair and anti-aging. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=glow+50+glow+70",
    benefits: [
      "Stimulates collagen and elastin production",
      "Improves skin quality and elasticity",
      "Enhances fat metabolism",
      "Supports tissue repair and anti-aging",
    ],
    useCases: ["Advanced skin research", "Premium anti-aging studies", "Enhanced regeneration research"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: {
      rating: 4.9,
      count: 98,
      featured: "Premium formula for advanced research. Exceptional quality and results.",
    },
  },

  // Recovery / Immunity Category - Ordered by mg size

  // BPC-157 - 5mg, 10mg
  {
    id: "bpc-157-5mg",
    name: "BPC-157 (5mg/vial)",
    category: "Recovery / Immunity",
    price: 49.97,
    subscriptionPrice: getSubscriptionPrice(49.97, "bpc-157-5mg"), // $44.97
    image: "/images/bpc-157.png",
    overview:
      "BPC-157 is a synthetic peptide derived from a protective protein in gastric juice. It's known for healing injuries in muscles, tendons, and the digestive tract. Potential Benefits: Accelerates muscle, tendon, and ligament healing, Promotes gut repair (e.g., ulcers, IBS), Reduces inflammation, Supports neuroprotection. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=bpc-157",
    benefits: [
      "Accelerates muscle, tendon, and ligament healing",
      "Promotes gut repair (e.g., ulcers, IBS)",
      "Reduces inflammation",
      "Supports neuroprotection",
    ],
    useCases: ["Initial injury research", "Basic tissue studies", "Entry-level protocols"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: { rating: 4.7, count: 198, featured: "Great entry point for tissue repair research. Reliable quality." },
    // SEO-enhanced fields
    purity: 99.9,
    storage: "Store at -20°C, protect from light",
    description: "BPC-157 research peptide (Body Protection Compound) is a synthetic pentadecapeptide derived from gastric juice proteins. This 99.9% pure, lab-tested peptide is extensively studied for tissue repair, wound healing, and gastrointestinal protection in research applications. Each 5mg vial is lyophilized and includes COA for research verification.",
    molecularWeight: "1419.55 g/mol",
    sequence: "Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val",
    researchApplications: [
      "Tissue repair and regeneration studies",
      "Wound healing research protocols",
      "Gastrointestinal protection studies",
      "Anti-inflammatory pathway research",
      "Tendon and ligament repair studies",
      "Neuroprotection research applications"
    ]
  },
  {
    id: "bpc-157-10mg",
    name: "BPC-157 (10mg/vial)",
    category: "Recovery / Immunity",
    price: 79.77,
    subscriptionPrice: getSubscriptionPrice(79.77, "bpc-157-10mg"),
    image: "/images/precision-peptides-vial.png",
    overview:
      "BPC-157 is a synthetic peptide derived from a protective protein in gastric juice. It's known for healing injuries in muscles, tendons, and the digestive tract. Potential Benefits: Accelerates muscle, tendon, and ligament healing, Promotes gut repair (e.g., ulcers, IBS), Reduces inflammation, Supports neuroprotection. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=bpc-157",
    benefits: [
      "Accelerates muscle, tendon, and ligament healing",
      "Promotes gut repair (e.g., ulcers, IBS)",
      "Reduces inflammation",
      "Supports neuroprotection",
    ],
    useCases: ["Injury research", "Tissue regeneration", "Wound healing studies", "Recovery research"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: {
      rating: 4.8,
      count: 234,
      featured: "Gold standard for tissue repair research. Consistent and reliable.",
    },
  },

  // TB-500 - 5mg, 10mg
  {
    id: "tb-500-5mg",
    name: "TB-500 (TB4 5mg/vial)",
    category: "Recovery / Immunity",
    price: 75.0,
    subscriptionPrice: getSubscriptionPrice(75.0, "tb-500-5mg"),
    image: "/images/precision-peptides-vial.png",
    overview:
      "TB-500 is a synthetic version of Thymosin Beta-4 that enhances tissue repair, reduces inflammation, and promotes cellular migration essential for healing. Potential Benefits: Enhances muscle recovery, Promotes new blood vessel growth, Reduces scar tissue formation, Improves flexibility and mobility. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=tb-500",
    benefits: [
      "Enhances muscle recovery",
      "Promotes new blood vessel growth",
      "Reduces scar tissue formation",
      "Improves flexibility and mobility",
    ],
    useCases: ["Tissue repair research", "Cellular studies", "Wound healing research", "Recovery research"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: {
      rating: 4.7,
      count: 189,
      featured: "Excellent for tissue repair research. High purity and effectiveness.",
    },
  },
  {
    id: "tb-500-10mg",
    name: "TB-500 (TB4 10mg/vial)",
    category: "Recovery / Immunity",
    price: 125.0,
    subscriptionPrice: getSubscriptionPrice(125.0, "tb-500-10mg"),
    image: "/images/precision-peptides-vial.png",
    overview:
      "TB-500 is a synthetic version of Thymosin Beta-4 that enhances tissue repair, reduces inflammation, and promotes cellular migration essential for healing. Potential Benefits: Enhances muscle recovery, Promotes new blood vessel growth, Reduces scar tissue formation, Improves flexibility and mobility. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=tb-500",
    benefits: [
      "Enhances muscle recovery",
      "Promotes new blood vessel growth",
      "Reduces scar tissue formation",
      "Improves flexibility and mobility",
    ],
    useCases: ["Tissue repair research", "Cellular studies", "Wound healing research", "Recovery research"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: {
      rating: 4.7,
      count: 189,
      featured: "Excellent for tissue repair research. High purity and effectiveness.",
    },
  },

  // Thymosin Alpha 1 - 5mg, 10mg
  {
    id: "thymosin-alpha-1-5mg",
    name: "Thymosin Alpha 1 (5mg/vial)",
    category: "Recovery / Immunity",
    price: 70.0,
    subscriptionPrice: getSubscriptionPrice(70.0),
    image: "/images/precision-peptides-vial.png",
    overview:
      "Thymosin Alpha 1 is used to modulate immune function and combat infection. It enhances T-cell production and is used in treating conditions like hepatitis and cancer. Potential Benefits: Boosts T-cell function, Regulates inflammation, Used in cancer and viral therapy, Supports recovery from illness. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=thymosin+alpha+1",
    benefits: [
      "Boosts T-cell function",
      "Regulates inflammation",
      "Used in cancer and viral therapy",
      "Supports recovery from illness",
    ],
    useCases: ["Immune research", "Recovery studies", "Regeneration research", "Immunity research"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: {
      rating: 4.7,
      count: 68,
      featured: "Excellent for immune system research. High purity and effectiveness.",
    },
  },
  {
    id: "thymosin-alpha-1-10mg-recovery",
    name: "Thymosin Alpha 1 (10mg/vial)",
    category: "Recovery / Immunity",
    price: 100.0,
    subscriptionPrice: getSubscriptionPrice(100.0),
    image: "/images/precision-peptides-vial.png",
    overview:
      "Thymosin Alpha 1 is used to modulate immune function and combat infection. It enhances T-cell production and is used in treating conditions like hepatitis and cancer. Potential Benefits: Boosts T-cell function, Regulates inflammation, Used in cancer and viral therapy, Supports recovery from illness. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=thymosin+alpha+1",
    benefits: [
      "Boosts T-cell function",
      "Regulates inflammation",
      "Used in cancer and viral therapy",
      "Supports recovery from illness",
    ],
    useCases: ["Immune research", "Recovery studies", "Regeneration research", "Immunity research"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: {
      rating: 4.7,
      count: 68,
      featured: "Excellent for immune system research. High purity and effectiveness.",
    },
  },

  // TB500+BPC157 combo
  {
    id: "tb500-bpc157-combo",
    name: "TB500+BPC157 (TB500 10mg + BPC157 10mg)",
    category: "Recovery / Immunity",
    price: 120.0,
    subscriptionPrice: getSubscriptionPrice(120.0),
    image: "/images/precision-peptides-vial.png",
    overview:
      "TB500 and BPC-157 together are used synergistically for rapid injury recovery. TB500 aids in cellular repair and muscle healing, while BPC-157 focuses on gut integrity and soft tissue healing. Potential Benefits: Accelerates muscle and joint healing, Reduces inflammation, Improves gut lining integrity, Promotes tissue regeneration. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=tb500+bpc157",
    benefits: [
      "Accelerates muscle and joint healing",
      "Reduces inflammation",
      "Improves gut lining integrity",
      "Promotes tissue regeneration",
    ],
    useCases: ["Tissue repair research", "Recovery studies", "Injury research", "Regeneration studies"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: {
      rating: 4.9,
      count: 156,
      featured: "Perfect combination for recovery research. Excellent synergistic effects.",
    },
  },

  // Muscle Growth Category - Ordered by mg size

  // CJC-1295 (DAC) - 2mg, 5mg
  {
    id: "cjc-1295-dac-2mg",
    name: "CJC-1295 (DAC) (2mg/vial)",
    category: "Muscle Growth",
    price: 70.0,
    subscriptionPrice: getSubscriptionPrice(70.0),
    image: "/images/precision-peptides-vial.png",
    overview:
      "CJC-1295 with DAC is a long-acting growth hormone-releasing hormone analog. The DAC extension increases its half-life, allowing weekly or bi-weekly dosing. Potential Benefits: Increases GH and IGF-1 levels, Enhances muscle growth and fat loss, Improves sleep and recovery, Supports tissue repair and anti-aging. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=cjc-1295+dac",
    benefits: [
      "Increases GH and IGF-1 levels",
      "Enhances muscle growth and fat loss",
      "Improves sleep and recovery",
      "Supports tissue repair and anti-aging",
    ],
    useCases: ["Initial GH research", "Basic GHRH studies", "Entry-level protocols"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: { rating: 4.7, count: 98, featured: "Good starting point for GHRH research. Reliable quality." },
  },
  {
    id: "cjc-1295-dac-5mg",
    name: "CJC-1295 (DAC) (5mg/vial)",
    category: "Muscle Growth",
    price: 130.0,
    subscriptionPrice: getSubscriptionPrice(130.0),
    image: "/images/precision-peptides-vial.png",
    overview:
      "CJC-1295 with DAC is a long-acting growth hormone-releasing hormone analog. The DAC extension increases its half-life, allowing weekly or bi-weekly dosing. Potential Benefits: Increases GH and IGF-1 levels, Enhances muscle growth and fat loss, Improves sleep and recovery, Supports tissue repair and anti-aging. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=cjc-1295+dac",
    benefits: [
      "Increases GH and IGF-1 levels",
      "Enhances muscle growth and fat loss",
      "Improves sleep and recovery",
      "Supports tissue repair and anti-aging",
    ],
    useCases: ["Extended GH research", "Muscle development", "Long-term studies", "Growth research"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: {
      rating: 4.9,
      count: 134,
      featured: "Excellent for extended research protocols. Consistent and reliable results.",
    },
  },

  // CJC-1295 w/o DAC - 2mg, 5mg
  {
    id: "cjc-1295-no-dac-2mg",
    name: "CJC-1295 w/o DAC (2mg/vial)",
    category: "Muscle Growth",
    price: 40.0,
    subscriptionPrice: getSubscriptionPrice(40.0),
    image: "/images/precision-peptides-vial.png",
    overview:
      "CJC-1295 without DAC has a shorter duration and is often used to mimic natural growth hormone pulses. It is frequently combined with Ipamorelin for improved synergy. Potential Benefits: Stimulates natural GH release, Supports muscle building and fat loss, Improves recovery and sleep, Less risk of GH desensitization. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=cjc-1295+no+dac",
    benefits: [
      "Stimulates natural GH release",
      "Supports muscle building and fat loss",
      "Improves recovery and sleep",
      "Less risk of GH desensitization",
    ],
    useCases: ["Short-term GH research", "Basic studies", "Entry-level protocols"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: { rating: 4.6, count: 87, featured: "Good for short-term research. Reliable and cost-effective." },
  },
  {
    id: "cjc-1295-no-dac-5mg",
    name: "CJC-1295 w/o DAC (5mg/vial)",
    category: "Muscle Growth",
    price: 80.0,
    subscriptionPrice: getSubscriptionPrice(80.0),
    image: "/images/precision-peptides-vial.png",
    overview:
      "CJC-1295 without DAC has a shorter duration and is often used to mimic natural growth hormone pulses. It is frequently combined with Ipamorelin for improved synergy. Potential Benefits: Stimulates natural GH release, Supports muscle building and fat loss, Improves recovery and sleep, Less risk of GH desensitization. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=cjc-1295+no+dac",
    benefits: [
      "Stimulates natural GH release",
      "Supports muscle building and fat loss",
      "Improves recovery and sleep",
      "Less risk of GH desensitization",
    ],
    useCases: ["Short-term GH research", "Natural pulse studies", "GHRH research"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: {
      rating: 4.7,
      count: 123,
      featured: "Excellent for short-acting GH research. High purity and effectiveness.",
    },
  },

  // Single dosage products
  {
    id: "ipamorelin-5mg",
    name: "Ipamorelin (5mg/vial)",
    category: "Muscle Growth",
    price: 45.0,
    subscriptionPrice: getSubscriptionPrice(45.0),
    image: "/images/precision-peptides-vial.png",
    overview:
      "Ipamorelin is a selective growth hormone secretagogue known for stimulating GH release without significantly increasing cortisol or prolactin. It's highly regarded for its safety profile. Potential Benefits: Promotes lean muscle growth, Enhances recovery and repair, Improves sleep quality, Supports fat metabolism. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=ipamorelin",
    benefits: [
      "Promotes lean muscle growth",
      "Enhances recovery and repair",
      "Improves sleep quality",
      "Supports fat metabolism",
    ],
    useCases: ["GH research", "Muscle studies", "Performance research", "Body composition research"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: {
      rating: 4.8,
      count: 203,
      featured: "Perfect for selective GH research. Clean results with no unwanted effects.",
    },
  },
  {
    id: "sermorelin-10mg-muscle",
    name: "Sermorelin (10mg/vial)",
    category: "Muscle Growth",
    price: 90.0,
    subscriptionPrice: getSubscriptionPrice(90.0),
    image: "/images/precision-peptides-vial.png",
    overview:
      "Sermorelin is a GHRH analog that stimulates natural growth hormone release. It's used in hormone replacement therapy to promote recovery, energy, and lean mass. Potential Benefits: Increases natural growth hormone production, Improves sleep quality, Promotes lean muscle growth, Supports fat metabolism and energy. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=sermorelin",
    benefits: [
      "Increases natural growth hormone production",
      "Improves sleep quality",
      "Promotes lean muscle growth",
      "Supports fat metabolism and energy",
    ],
    useCases: ["GH research", "Muscle studies", "Natural hormone research", "GHRH studies"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: { rating: 4.7, count: 112, featured: "Great for natural GH research. Reliable and consistent quality." },
  },
  {
    id: "hcg-5000iu",
    name: "HCG (5000iu/vial)",
    category: "Muscle Growth",
    price: 65.0,
    subscriptionPrice: getSubscriptionPrice(65.0),
    image: "/images/precision-peptides-vial.png",
    overview:
      "HCG acts similarly to luteinizing hormone, prompting the testes to produce testosterone. It's often used in hormone replacement therapy or to preserve fertility. Potential Benefits: Maintains or restores testosterone levels, Prevents testicular atrophy, Supports fertility, Enhances libido and mood. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=hcg",
    benefits: [
      "Maintains or restores testosterone levels",
      "Prevents testicular atrophy",
      "Supports fertility",
      "Enhances libido and mood",
    ],
    useCases: ["Hormonal research", "Reproductive studies", "Endocrine research"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: { rating: 4.6, count: 145, featured: "Reliable for hormonal research. Consistent potency and quality." },
  },
  {
    id: "ghrp-2-5mg",
    name: "GHRP-2 (5mg/vial)",
    category: "Muscle Growth",
    price: 45.0,
    subscriptionPrice: getSubscriptionPrice(45.0),
    image: "/images/precision-peptides-vial.png",
    overview:
      "GHRP-2 is a synthetic growth hormone-releasing peptide that stimulates the pituitary to secrete GH. It has appetite-stimulating effects and supports recovery and metabolism. Potential Benefits: Increases growth hormone levels, Enhances appetite and nutrient uptake, Improves recovery and fat metabolism, Supports immune health. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=ghrp-2",
    benefits: [
      "Increases growth hormone levels",
      "Enhances appetite and nutrient uptake",
      "Improves recovery and fat metabolism",
      "Supports immune health",
    ],
    useCases: ["GH research", "Muscle studies", "Performance research"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: { rating: 4.6, count: 123, featured: "Reliable for GH research. Consistent quality and effectiveness." },
  },
  {
    id: "ghrp-6-5mg",
    name: "GHRP-6 (5mg/vial)",
    category: "Muscle Growth",
    price: 45.0,
    subscriptionPrice: getSubscriptionPrice(45.0),
    image: "/images/precision-peptides-vial.png",
    overview:
      "GHRP-6 is a growth hormone-releasing peptide that strongly stimulates both GH secretion and appetite. It's useful for bulking, recovery, and promoting anabolic repair. Potential Benefits: Boosts growth hormone levels, Promotes muscle repair and growth, Stimulates appetite, Aids in fat loss and recovery. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=ghrp-6",
    benefits: [
      "Boosts growth hormone levels",
      "Promotes muscle repair and growth",
      "Stimulates appetite",
      "Aids in fat loss and recovery",
    ],
    useCases: ["GH research", "Appetite studies", "Metabolic research"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: { rating: 4.5, count: 134, featured: "Good for GH and appetite research. Reliable quality." },
  },

  // Longevity Category - Single dosage products
  {
    id: "epithalon-10mg",
    name: "Epithalon (10mg/vial)",
    category: "Longevity",
    price: 43.0,
    subscriptionPrice: getSubscriptionPrice(43.0),
    image: "/images/precision-peptides-vial.png",
    overview:
      "Epithalon is a synthetic peptide with longevity-enhancing effects. It mimics the action of a natural pineal gland peptide and has been linked to increased lifespan in animal studies. Potential Benefits: Extends telomere length, Supports longevity and anti-aging, Improves sleep and circadian rhythm, Boosts immune function. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=epithalon",
    benefits: [
      "Extends telomere length",
      "Supports longevity and anti-aging",
      "Improves sleep and circadian rhythm",
      "Boosts immune function",
    ],
    useCases: ["Aging research", "Telomere studies", "Longevity research", "Cellular regeneration"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: {
      rating: 4.8,
      count: 92,
      featured: "Exceptional quality for longevity research. Reliable results in telomerase studies.",
    },
  },
  {
    id: "mots-c-10mg-longevity",
    name: "MOTS-C (10mg/vial)",
    category: "Longevity",
    price: 97.0,
    subscriptionPrice: getSubscriptionPrice(97.0, "mots-c-10mg-longevity"),
    image: "/images/precision-peptides-vial.png",
    overview:
      "MOTS-C is a mitochondrial-derived peptide involved in cellular energy regulation and metabolic homeostasis. It's being researched for its effects on obesity, aging, and metabolic diseases. Potential Benefits: Improves insulin sensitivity, Enhances mitochondrial function, Supports fat loss, Potential longevity and anti-aging properties. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=mots-c",
    benefits: [
      "Improves insulin sensitivity",
      "Enhances mitochondrial function",
      "Supports fat loss",
      "Potential longevity and anti-aging properties",
    ],
    useCases: ["Mitochondrial research", "Metabolic studies", "Longevity research", "Energy metabolism"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: {
      rating: 4.7,
      count: 76,
      featured: "Excellent for mitochondrial research. High purity and consistent results.",
    },
  },
  {
    id: "pt-141-10mg",
    name: "PT-141 (10mg/vial)",
    category: "Longevity",
    price: 60.0,
    subscriptionPrice: getSubscriptionPrice(60.0),
    image: "/images/precision-peptides-vial.png",
    overview:
      "PT-141 is a melanocortin receptor agonist used to treat sexual dysfunction. Unlike PDE5 inhibitors, it acts on the nervous system to increase sexual desire and arousal. Potential Benefits: Improves libido in men and women, Effective for erectile dysfunction, Enhances sexual arousal, Acts via CNS, not vascular system. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=pt-141",
    benefits: [
      "Improves libido in men and women",
      "Effective for erectile dysfunction",
      "Enhances sexual arousal",
      "Acts via CNS, not vascular system",
    ],
    useCases: ["Neurological research", "Wellness studies", "Behavioral research", "Receptor studies"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: {
      rating: 4.7,
      count: 76,
      featured: "Excellent for receptor binding studies. Pure and effective for research.",
    },
  },
  {
    id: "nad-100mg",
    name: "NAD+ (500mg/vial)",
    category: "Longevity",
    price: 195.0,
    subscriptionPrice: getSubscriptionPrice(195.0, "nad-100mg"),
    image: "/images/precision-peptides-vial.png",
    overview:
      "NAD+ is a crucial coenzyme involved in cellular energy metabolism and DNA repair processes. It's extensively researched for its role in aging, metabolic health, and cellular regeneration. Potential Benefits: Supports cellular energy production, Enhances DNA repair mechanisms, Promotes healthy aging processes, Improves metabolic function. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=nad+anti-aging",
    benefits: ["Cellular energy research", "Anti-aging studies", "Metabolic research", "Mitochondrial studies"],
    useCases: ["Anti-aging research", "Cellular studies", "Energy metabolism research"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: {
      rating: 4.8,
      count: 89,
      featured: "Outstanding for anti-aging research. High purity and effectiveness.",
    },
  },

  // Sleep Category - Single dosage product
  {
    id: "dsip-5mg",
    name: "DSIP (5mg/vial)",
    category: "Sleep",
    price: 45.0,
    subscriptionPrice: getSubscriptionPrice(45.0, "dsip-5mg"),
    image: "/images/precision-peptides-vial.png",
    overview:
      "DSIP is a neuropeptide that promotes deep sleep and relaxation. It may also aid in hormone regulation and has shown promise for treating sleep disorders. Potential Benefits: Improves sleep quality and duration, Reduces stress and anxiety, Supports hormone regulation, May improve recovery and mood. PubMed: https://pubmed.ncbi.nlm.nih.gov/?term=dsip",
    benefits: [
      "Improves sleep quality and duration",
      "Reduces stress and anxiety",
      "Supports hormone regulation",
      "May improve recovery and mood",
    ],
    useCases: ["Sleep research", "Circadian studies", "Neurological research", "Sleep disorder research"],
    disclaimer: "For research use only. Not for human consumption.",
    reviews: { rating: 4.6, count: 54, featured: "Great for sleep research. Consistent quality and reliable results." },
  },
]
