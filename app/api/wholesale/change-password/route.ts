import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { currentPassword, newPassword, email } = body

    if (!newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters" },
        { status: 400 }
      )
    }

    // In a production app, you'd get the user from the session
    // For now, we'll accept email in the request or from a cookie
    const cookieStore = await cookies()
    const userEmail = email || cookieStore.get("wholesale_email")?.value

    if (!userEmail) {
      return NextResponse.json(
        { error: "Please provide your email address" },
        { status: 400 }
      )
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: { wholesaleAccount: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Verify the user has a wholesale account
    if (!user.wholesaleAccount) {
      return NextResponse.json(
        { error: "No wholesale account found" },
        { status: 403 }
      )
    }

    // If user has a password, verify the current password
    if (user.password && currentPassword) {
      const isValid = await bcrypt.compare(currentPassword, user.password)
      if (!isValid) {
        return NextResponse.json(
          { error: "Current password is incorrect" },
          { status: 400 }
        )
      }
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update the password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    })

    return NextResponse.json({ success: true, message: "Password updated successfully" })
  } catch (error) {
    console.error("Failed to change password:", error)
    return NextResponse.json(
      { error: "Failed to change password" },
      { status: 500 }
    )
  }
}
