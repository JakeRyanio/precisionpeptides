"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { 
  Building2, 
  Mail, 
  Phone, 
  User, 
  FileText, 
  CheckCircle,
  ArrowLeft,
  Percent,
  Package,
  Clock
} from "lucide-react"

export default function WholesaleApplyPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission - in production, this would call an API
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-[#1a1816] flex items-center justify-center p-4">
        <Card className="bg-[#201c1a] border-[#403c3a] max-w-lg w-full">
          <CardContent className="pt-8 pb-8 text-center">
            <div className="h-16 w-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
            <h2 className="text-2xl font-serif text-[#ebe7e4] mb-3">Application Submitted!</h2>
            <p className="text-[#a09a94] mb-6">
              Thank you for your interest in becoming a wholesale partner. 
              Our team will review your application and contact you within 1-2 business days.
            </p>
            <Link href="/">
              <Button className="bg-[#d2c6b8] text-[#201c1a] hover:bg-[#c4b8aa]">
                Return to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1a1816]">
      {/* Header */}
      <div className="bg-[#201c1a] border-b border-[#403c3a]">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center text-[#a09a94] hover:text-[#ebe7e4] transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Store
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="h-16 w-16 rounded-2xl bg-[#d2c6b8]/20 flex items-center justify-center mx-auto mb-6">
              <Building2 className="h-8 w-8 text-[#d2c6b8]" />
            </div>
            <h1 className="text-4xl font-serif text-[#ebe7e4] mb-4">Become a Wholesale Partner</h1>
            <p className="text-lg text-[#a09a94] max-w-2xl mx-auto">
              Join our network of trusted wholesale partners and get access to exclusive pricing, 
              dedicated support, and priority fulfillment.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-[#201c1a] border-[#403c3a]">
              <CardContent className="pt-6">
                <Percent className="h-8 w-8 text-[#d2c6b8] mb-3" />
                <h3 className="font-medium text-[#ebe7e4] mb-1">Exclusive Pricing</h3>
                <p className="text-sm text-[#a09a94]">Custom pricing tailored to your business volume</p>
              </CardContent>
            </Card>
            <Card className="bg-[#201c1a] border-[#403c3a]">
              <CardContent className="pt-6">
                <Package className="h-8 w-8 text-[#d2c6b8] mb-3" />
                <h3 className="font-medium text-[#ebe7e4] mb-1">Priority Fulfillment</h3>
                <p className="text-sm text-[#a09a94]">Fast processing and dedicated inventory allocation</p>
              </CardContent>
            </Card>
            <Card className="bg-[#201c1a] border-[#403c3a]">
              <CardContent className="pt-6">
                <Clock className="h-8 w-8 text-[#d2c6b8] mb-3" />
                <h3 className="font-medium text-[#ebe7e4] mb-1">Dedicated Support</h3>
                <p className="text-sm text-[#a09a94]">Personal account manager for your business needs</p>
              </CardContent>
            </Card>
          </div>

          {/* Application Form */}
          <Card className="bg-[#201c1a] border-[#403c3a]">
            <CardHeader>
              <CardTitle className="text-[#ebe7e4]">Wholesale Application</CardTitle>
              <CardDescription className="text-[#a09a94]">
                Please fill out the form below. All fields marked with * are required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Company Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-[#ebe7e4] flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-[#d2c6b8]" />
                    Company Information
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="companyName" className="text-[#ebe7e4]">Company Name *</Label>
                    <Input
                      id="companyName"
                      required
                      placeholder="Your company name"
                      className="bg-[#1a1816] border-[#403c3a] text-[#ebe7e4]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website" className="text-[#ebe7e4]">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      placeholder="https://yourcompany.com"
                      className="bg-[#1a1816] border-[#403c3a] text-[#ebe7e4]"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="space-y-4 pt-4 border-t border-[#403c3a]">
                  <h3 className="text-lg font-medium text-[#ebe7e4] flex items-center gap-2">
                    <User className="h-5 w-5 text-[#d2c6b8]" />
                    Contact Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactName" className="text-[#ebe7e4]">Contact Name *</Label>
                      <Input
                        id="contactName"
                        required
                        placeholder="Full name"
                        className="bg-[#1a1816] border-[#403c3a] text-[#ebe7e4]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactTitle" className="text-[#ebe7e4]">Title / Position</Label>
                      <Input
                        id="contactTitle"
                        placeholder="e.g. Purchasing Manager"
                        className="bg-[#1a1816] border-[#403c3a] text-[#ebe7e4]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[#ebe7e4]">Email Address *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a09a94]" />
                        <Input
                          id="email"
                          type="email"
                          required
                          placeholder="you@company.com"
                          className="pl-10 bg-[#1a1816] border-[#403c3a] text-[#ebe7e4]"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-[#ebe7e4]">Phone Number *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#a09a94]" />
                        <Input
                          id="phone"
                          type="tel"
                          required
                          placeholder="(555) 123-4567"
                          className="pl-10 bg-[#1a1816] border-[#403c3a] text-[#ebe7e4]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Details */}
                <div className="space-y-4 pt-4 border-t border-[#403c3a]">
                  <h3 className="text-lg font-medium text-[#ebe7e4] flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#d2c6b8]" />
                    Business Details
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="businessType" className="text-[#ebe7e4]">Type of Business *</Label>
                    <Input
                      id="businessType"
                      required
                      placeholder="e.g. Research Lab, Clinic, Distributor"
                      className="bg-[#1a1816] border-[#403c3a] text-[#ebe7e4]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expectedVolume" className="text-[#ebe7e4]">Expected Monthly Order Volume *</Label>
                    <Input
                      id="expectedVolume"
                      required
                      placeholder="e.g. $5,000 - $10,000"
                      className="bg-[#1a1816] border-[#403c3a] text-[#ebe7e4]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="additionalInfo" className="text-[#ebe7e4]">Additional Information</Label>
                    <Textarea
                      id="additionalInfo"
                      placeholder="Tell us more about your business and how you plan to use our products..."
                      rows={4}
                      className="bg-[#1a1816] border-[#403c3a] text-[#ebe7e4] resize-none"
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-6 border-t border-[#403c3a]">
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-[#d2c6b8] text-[#201c1a] hover:bg-[#c4b8aa] py-6 text-lg"
                  >
                    {isSubmitting ? "Submitting Application..." : "Submit Application"}
                  </Button>
                  <p className="text-sm text-[#a09a94] text-center mt-4">
                    By submitting this application, you agree to our terms of service and wholesale partner agreement.
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
