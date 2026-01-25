import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    const { 
      companyName, 
      contactName, 
      email, 
      password,
      phone, 
      website,
      businessType,
      expectedVolume,
      additionalInfo
    } = data

    // Validate required fields
    if (!companyName || !contactName || !email || !password || !phone || !businessType || !expectedVolume) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please login or use a different email." },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user and wholesale account in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name: contactName,
          role: "WHOLESALER"
        }
      })

      // Create wholesale account (status defaults to PENDING)
      const wholesaleAccount = await tx.wholesaleAccount.create({
        data: {
          userId: user.id,
          companyName,
          taxId: null, // Can be added later
          status: "PENDING",
          discountPercent: null // Set by admin upon approval
        }
      })

      return { user, wholesaleAccount }
    })

    // TODO: Send notification email to admin about new wholesale application
    // TODO: Send confirmation email to applicant

    return NextResponse.json({
      success: true,
      message: "Your wholesale application has been submitted. We'll review it and contact you shortly.",
      wholesaleAccountId: result.wholesaleAccount.id
    })

  } catch (error) {
    console.error("Wholesale application error:", error)
    return NextResponse.json(
      { error: "Failed to submit application. Please try again." },
      { status: 500 }
    )
  }
}
