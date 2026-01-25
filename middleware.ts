import { NextResponse } from "next/server"
import { auth } from "@/auth"

export default auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const user = req.auth?.user

  // Admin routes protection
  if (pathname.startsWith("/admin")) {
    // Allow admin login page
    if (pathname === "/admin/login") {
      if (isLoggedIn && user?.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", req.url))
      }
      return NextResponse.next()
    }

    // Protect all other admin routes
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }

    if (user?.role !== "ADMIN") {
      // Not an admin, redirect to home
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  // Wholesale routes protection
  if (pathname.startsWith("/wholesale")) {
    // Allow wholesale apply/request page without login
    if (pathname === "/wholesale/apply" || pathname === "/wholesale/login") {
      if (isLoggedIn && user?.role === "WHOLESALER" && user?.wholesaleStatus === "APPROVED") {
        return NextResponse.redirect(new URL("/wholesale", req.url))
      }
      return NextResponse.next()
    }

    // Protect all other wholesale routes
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/wholesale/login", req.url))
    }

    if (user?.role !== "WHOLESALER") {
      // Not a wholesaler, redirect to home
      return NextResponse.redirect(new URL("/", req.url))
    }

    // Check wholesale account status
    if (user?.wholesaleStatus !== "APPROVED") {
      // Account not approved, show pending page
      if (pathname !== "/wholesale/pending") {
        return NextResponse.redirect(new URL("/wholesale/pending", req.url))
      }
    }
  }

  // Login page - redirect if already logged in
  if (pathname === "/login") {
    if (isLoggedIn) {
      if (user?.role === "ADMIN") {
        return NextResponse.redirect(new URL("/admin", req.url))
      }
      if (user?.role === "WHOLESALER" && user?.wholesaleStatus === "APPROVED") {
        return NextResponse.redirect(new URL("/wholesale", req.url))
      }
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/admin/:path*",
    "/wholesale/:path*",
    "/login",
  ],
}
