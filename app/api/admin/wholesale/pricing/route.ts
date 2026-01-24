import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { accountId, discountPercent, customPrices } = await request.json()

    if (!accountId) {
      return NextResponse.json(
        { error: "Account ID is required" },
        { status: 400 }
      )
    }

    // Update discount percent on the account
    await prisma.wholesaleAccount.update({
      where: { id: accountId },
      data: { discountPercent }
    })

    // Delete existing custom pricing for this account
    await prisma.productWholesalePricing.deleteMany({
      where: { wholesaleAccountId: accountId }
    })

    // Create new custom pricing entries
    if (customPrices && customPrices.length > 0) {
      await prisma.productWholesalePricing.createMany({
        data: customPrices.map((cp: { productId: string; price: number; subscriptionPrice: number | null }) => ({
          productId: cp.productId,
          wholesaleAccountId: accountId,
          price: cp.price,
          subscriptionPrice: cp.subscriptionPrice
        }))
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to update pricing:", error)
    return NextResponse.json(
      { error: "Failed to update pricing" },
      { status: 500 }
    )
  }
}
