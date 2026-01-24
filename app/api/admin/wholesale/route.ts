import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// GET all wholesale accounts
export async function GET() {
  try {
    const accounts = await prisma.wholesaleAccount.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, email: true, name: true }
        },
        customPricing: {
          include: {
            product: {
              select: { id: true, name: true, price: true, subscriptionPrice: true }
            }
          }
        },
        _count: {
          select: { orders: true }
        }
      }
    })
    return NextResponse.json(accounts)
  } catch (error) {
    console.error("Failed to fetch wholesale accounts:", error)
    return NextResponse.json(
      { error: "Failed to fetch wholesale accounts" },
      { status: 500 }
    )
  }
}

// POST - Create a new wholesale account
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { 
      email, 
      password, 
      name, 
      companyName, 
      status = "APPROVED",
      discountPercent 
    } = body

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      )
    }

    // Check if user with this email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { wholesaleAccount: true }
    })

    if (existingUser?.wholesaleAccount) {
      return NextResponse.json(
        { error: "A wholesale account already exists for this email" },
        { status: 400 }
      )
    }

    // Hash password if provided
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null

    // Create or update user and wholesale account in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create or update user
      const user = existingUser 
        ? await tx.user.update({
            where: { id: existingUser.id },
            data: { 
              name: name || existingUser.name,
              role: "WHOLESALER",
              password: hashedPassword || existingUser.password
            }
          })
        : await tx.user.create({
            data: {
              email,
              password: hashedPassword,
              name,
              role: "WHOLESALER"
            }
          })

      // Create wholesale account
      const wholesaleAccount = await tx.wholesaleAccount.create({
        data: {
          userId: user.id,
          companyName: companyName || email,
          status,
          discountPercent
        },
        include: {
          user: {
            select: { id: true, email: true, name: true }
          },
          _count: {
            select: { orders: true }
          }
        }
      })

      return wholesaleAccount
    })

    return NextResponse.json({ success: true, account: result })
  } catch (error) {
    console.error("Failed to create wholesale account:", error)
    return NextResponse.json(
      { error: "Failed to create wholesale account" },
      { status: 500 }
    )
  }
}

// PATCH - Update wholesale account status or details
export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { accountId, status, companyName, discountPercent, name, email, password } = body

    if (!accountId) {
      return NextResponse.json(
        { error: "Account ID is required" },
        { status: 400 }
      )
    }

    // Build update data for wholesale account
    const wholesaleData: Record<string, unknown> = {}
    if (status !== undefined) wholesaleData.status = status
    if (companyName !== undefined) wholesaleData.companyName = companyName
    if (discountPercent !== undefined) wholesaleData.discountPercent = discountPercent

    // Update wholesale account
    const account = await prisma.wholesaleAccount.update({
      where: { id: accountId },
      data: wholesaleData,
      include: {
        user: true
      }
    })

    // Update user details if provided
    if (name !== undefined || email !== undefined || password !== undefined) {
      const userData: Record<string, unknown> = {}
      if (name !== undefined) userData.name = name
      if (email !== undefined) userData.email = email
      if (password) userData.password = await bcrypt.hash(password, 10)

      await prisma.user.update({
        where: { id: account.userId },
        data: userData
      })
    }

    return NextResponse.json({ success: true, account })
  } catch (error) {
    console.error("Failed to update account:", error)
    return NextResponse.json(
      { error: "Failed to update account" },
      { status: 500 }
    )
  }
}

// DELETE - Delete a wholesale account
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const accountId = searchParams.get("accountId")
    const deleteUser = searchParams.get("deleteUser") === "true"

    if (!accountId) {
      return NextResponse.json(
        { error: "Account ID is required" },
        { status: 400 }
      )
    }

    // Get the account to find the user
    const account = await prisma.wholesaleAccount.findUnique({
      where: { id: accountId },
      select: { userId: true }
    })

    if (!account) {
      return NextResponse.json(
        { error: "Account not found" },
        { status: 404 }
      )
    }

    if (deleteUser) {
      // Delete user (will cascade delete wholesale account due to schema)
      await prisma.user.delete({
        where: { id: account.userId }
      })
    } else {
      // Just delete the wholesale account, keep the user
      await prisma.wholesaleAccount.delete({
        where: { id: accountId }
      })

      // Update user role back to customer
      await prisma.user.update({
        where: { id: account.userId },
        data: { role: "CUSTOMER" }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete account:", error)
    return NextResponse.json(
      { error: "Failed to delete account" },
      { status: 500 }
    )
  }
}
