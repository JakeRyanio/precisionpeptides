"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Mail, Lock, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function WholesaleLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid email or password")
        setLoading(false)
        return
      }

      // Redirect to wholesale dashboard
      router.push("/wholesale")
      router.refresh()
    } catch (err) {
      setError("An error occurred. Please try again.")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1816] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl text-[#ebe7e4] mb-2">Precision Peptides</h1>
          <div className="flex items-center justify-center gap-2">
            <Building2 className="w-4 h-4 text-[#d2c6b8]" />
            <p className="text-[#d2c6b8]">Wholesale Portal</p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-[#201c1a] border border-[#403c3a] rounded-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-[#ebe7e4]">Wholesale Sign In</h2>
            <p className="text-sm text-[#a09a94] mt-1">Access your wholesale account</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#ebe7e4]">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a09a94]" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-[#1a1816] border-[#403c3a] text-[#ebe7e4] placeholder:text-[#605c58]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#ebe7e4]">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a09a94]" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-[#1a1816] border-[#403c3a] text-[#ebe7e4] placeholder:text-[#605c58]"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#d2c6b8] text-[#1a1816] hover:bg-[#c4b8aa] font-medium"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#403c3a]">
            <p className="text-sm text-[#a09a94] text-center mb-4">
              Don't have a wholesale account?
            </p>
            <Link href="/wholesale/apply">
              <Button
                variant="outline"
                className="w-full border-[#403c3a] text-[#ebe7e4] hover:bg-[#403c3a]/50"
              >
                Apply for Wholesale Access
              </Button>
            </Link>
          </div>
        </div>

        {/* Back to store link */}
        <div className="text-center mt-6">
          <Link href="/" className="text-[#a09a94] hover:text-[#ebe7e4] text-sm transition-colors">
            ← Back to Store
          </Link>
        </div>
      </div>
    </div>
  )
}
