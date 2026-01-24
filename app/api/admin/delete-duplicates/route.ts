import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// DELETE duplicate products
export async function POST() {
  try {
    // List of duplicate product IDs to delete (auto-generated cmk IDs that are duplicates)
    const duplicateIds = [
      "cmk7zql8000293xx98llh2b7h", // 5-AMINO-1MQ (Oral) - duplicate of 5-amino-1mq-oral
      "cmk7zqh5300283xx9nwq99cz6", // BPC 10mg + GHK-Cu 50mg + TB500 10mg + KPV 10mg - duplicate of glow-plus-80mg
      "cmk7zmggy000o3xx9qdsxwpdo", // BPC 10mg + TB 10mg - duplicate of bpc10mg-tb10mg-combo
      "cmk7zn857000v3xx9guoodmql", // CJC 1295 + IPA - duplicate of cjc1295-ipamorelin-10mg
      "cmk7zna6u000w3xx9mc7j0mvc", // Dihexa (Oral) - duplicate of dihexa-oral-20mg-25pc
    ]

    // Get products before deletion
    const productsToDelete = await prisma.product.findMany({
      where: { id: { in: duplicateIds } },
      select: { id: true, name: true, price: true }
    })

    // Delete the duplicates
    const result = await prisma.product.deleteMany({
      where: { id: { in: duplicateIds } }
    })

    return NextResponse.json({ 
      success: true, 
      deleted: result.count,
      products: productsToDelete
    })
  } catch (error) {
    console.error("Failed to delete duplicates:", error)
    return NextResponse.json(
      { error: "Failed to delete duplicate products" },
      { status: 500 }
    )
  }
}

// GET - List potential duplicates for review
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: { id: true, name: true, price: true },
      orderBy: { name: "asc" }
    })

    // Find products with cmk IDs (likely auto-generated duplicates)
    const potentialDuplicates = products.filter(p => p.id.startsWith("cmk"))

    return NextResponse.json({ 
      total: products.length,
      potentialDuplicates 
    })
  } catch (error) {
    console.error("Failed to check duplicates:", error)
    return NextResponse.json(
      { error: "Failed to check duplicates" },
      { status: 500 }
    )
  }
}
