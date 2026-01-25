"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Clock, LogOut, Mail } from "lucide-react"
import Link from "next/link"

export default function WholesalePendingPage() {
  return (
    <div className="min-h-screen bg-[#1a1816] flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl text-[#ebe7e4] mb-2">Precision Peptides</h1>
          <p className="text-[#d2c6b8]">Wholesale Portal</p>
        </div>

        {/* Pending Card */}
        <div className="bg-[#201c1a] border border-[#403c3a] rounded-xl p-8">
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Clock className="w-8 h-8 text-amber-500" />
          </div>
          
          <h2 className="text-xl font-semibold text-[#ebe7e4] mb-2">
            Application Pending
          </h2>
          
          <p className="text-[#a09a94] mb-6">
            Your wholesale account application is currently under review. 
            We'll notify you by email once your account has been approved.
          </p>

          <div className="bg-[#1a1816] border border-[#403c3a] rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-[#a09a94]">
              <Mail className="w-4 h-4" />
              <span className="text-sm">
                Check your email for updates
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <Link href="/">
              <Button
                variant="outline"
                className="w-full border-[#403c3a] text-[#ebe7e4] hover:bg-[#403c3a]/50"
              >
                Browse Retail Store
              </Button>
            </Link>
            
            <Button
              variant="ghost"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full text-[#a09a94] hover:text-[#ebe7e4] hover:bg-[#403c3a]/50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Contact support */}
        <p className="mt-6 text-sm text-[#a09a94]">
          Questions? Contact us at{" "}
          <a href="mailto:wholesale@precisionpeptides.com" className="text-[#d2c6b8] hover:underline">
            wholesale@precisionpeptides.com
          </a>
        </p>
      </div>
    </div>
  )
}
