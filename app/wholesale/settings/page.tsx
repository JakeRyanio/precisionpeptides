"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Lock, Check, AlertCircle, Mail } from "lucide-react"

export default function WholesaleSettingsPage() {
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    setMessage(null)

    // Validate email
    if (!email) {
      setMessage({ type: "error", text: "Please enter your email address" })
      return
    }

    // Validate passwords
    if (!newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "Please fill in all password fields" })
      return
    }

    if (newPassword.length < 8) {
      setMessage({ type: "error", text: "New password must be at least 8 characters" })
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match" })
      return
    }

    setSaving(true)

    try {
      const res = await fetch("/api/wholesale/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          currentPassword: currentPassword || undefined,
          newPassword
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setMessage({ type: "error", text: data.error || "Failed to change password" })
        return
      }

      setMessage({ type: "success", text: "Password changed successfully!" })
      setEmail("")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error) {
      console.error("Failed to change password:", error)
      setMessage({ type: "error", text: "An error occurred. Please try again." })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif text-[#ebe7e4]">Account Settings</h1>
        <p className="text-[#a09a94] mt-1">Manage your account security and preferences</p>
      </div>

      {/* Change Password Card */}
      <Card className="bg-[#201c1a] border-[#403c3a] max-w-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-[#403c3a] flex items-center justify-center">
              <Lock className="h-5 w-5 text-[#d2c6b8]" />
            </div>
            <div>
              <CardTitle className="text-[#ebe7e4]">Change Password</CardTitle>
              <CardDescription className="text-[#a09a94]">
                Update your account password
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            {message && (
              <div className={`p-3 rounded-lg flex items-center gap-2 text-sm ${
                message.type === "success" 
                  ? "bg-green-500/20 border border-green-500/30 text-green-400"
                  : "bg-red-500/20 border border-red-500/30 text-red-400"
              }`}>
                {message.type === "success" 
                  ? <Check className="h-4 w-4" />
                  : <AlertCircle className="h-4 w-4" />
                }
                {message.text}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Your Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a09a94]" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your wholesale account email"
                  className="bg-[#1a1816] border-[#403c3a] pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentPassword">
                Current Password <span className="text-[#a09a94] text-xs">(optional if setting for first time)</span>
              </Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  className="bg-[#1a1816] border-[#403c3a] pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-[#a09a94] hover:text-[#ebe7e4]"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min. 8 characters)"
                  className="bg-[#1a1816] border-[#403c3a] pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-[#a09a94] hover:text-[#ebe7e4]"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="bg-[#1a1816] border-[#403c3a] pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-[#a09a94] hover:text-[#ebe7e4]"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={saving}
              className="w-full bg-[#d2c6b8] text-[#201c1a] hover:bg-[#c4b8aa]"
            >
              {saving ? "Changing Password..." : "Change Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Help Info */}
      <Card className="bg-[#201c1a] border-[#403c3a] max-w-xl">
        <CardContent className="p-6">
          <h3 className="font-medium text-[#ebe7e4] mb-2">Password Requirements</h3>
          <ul className="text-sm text-[#a09a94] space-y-1">
            <li>• Minimum 8 characters</li>
            <li>• Use a mix of letters, numbers, and symbols for better security</li>
            <li>• Avoid using common words or personal information</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
