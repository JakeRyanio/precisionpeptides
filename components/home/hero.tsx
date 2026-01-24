import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, Beaker, Shield, Zap } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center hero-section">
      {/* Subtle pastel background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-emerald-200/10 to-emerald-300/20 rounded-full animate-float blur-xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-br from-rose-200/10 to-rose-300/20 rounded-full animate-pulse blur-xl"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-gradient-to-br from-sky-200/10 to-sky-300/20 rounded-full animate-float blur-xl"></div>
        <div className="absolute bottom-1/3 left-1/3 w-40 h-40 bg-gradient-to-br from-purple-200/10 to-purple-300/20 rounded-full animate-pulse blur-xl"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            {/* Logo */}
            <div className="mb-6">
              <Image
                src="/images/precision-peptides-monogram.png"
                alt="Precision Peptides"
                width={80}
                height={80}
                className="object-contain"
              />
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-serif font-medium mb-6 leading-tight text-[#ebe7e4]">
              PRECISION
              <br />
              PEPTIDES
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-[#d2c6b8] mb-8 max-w-2xl font-light">
              Premium research peptides crafted for scientific excellence.
              <br />
              <em className="text-emerald-300">Precision. Purity. Potential.</em>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <Link href="/shop">
                <Button className="bg-gradient-to-r from-[#d2c6b8] to-[#c4b8a4] hover:from-[#beb2a4] hover:to-[#b2a698] text-[#201c1a] font-medium px-8 py-6 text-lg hover:scale-105 transition-all duration-300 shadow-lg">
                  Explore Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <div className="flex flex-col items-center sm:items-start">
                <span className="text-sm text-[#a09a94] mb-2">Buying in Bulk?</span>
                <Link href="/wholesale/apply">
                  <Button variant="outline" className="border-[#d2c6b8]/50 text-[#d2c6b8] hover:bg-[#d2c6b8]/10 hover:border-[#d2c6b8] font-medium px-8 py-6 text-lg hover:scale-105 transition-all duration-300">
                    Wholesale Partner
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <Image
              src="/images/website-hero-section.png"
              alt="Precision Peptides Product"
              width={600}
              height={600}
              className="object-contain"
            />
          </div>
        </div>

        {/* Key Features with pastel colors */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="flex flex-col items-center p-8 elegant-card elegant-hover bg-gradient-to-br from-emerald-200/10 to-emerald-300/20 border border-emerald-300/20">
            <div className="w-16 h-16 bg-emerald-200/30 rounded-full flex items-center justify-center mb-6">
              <Beaker className="h-8 w-8 text-emerald-300" />
            </div>
            <h3 className="text-xl font-medium mb-3 text-[#ebe7e4]">Lab-Grade Purity</h3>
            <p className="text-[#beb2a4] text-center leading-relaxed">
              99%+ purity guaranteed through rigorous testing protocols
            </p>
          </div>

          <div className="flex flex-col items-center p-8 elegant-card elegant-hover bg-gradient-to-br from-sky-200/10 to-sky-300/20 border border-sky-300/20">
            <div className="w-16 h-16 bg-sky-200/30 rounded-full flex items-center justify-center mb-6">
              <Shield className="h-8 w-8 text-sky-300" />
            </div>
            <h3 className="text-xl font-medium mb-3 text-[#ebe7e4]">Research Compliant</h3>
            <p className="text-[#beb2a4] text-center leading-relaxed">
              All products meet strict research-only guidelines
            </p>
          </div>

          <div className="flex flex-col items-center p-8 elegant-card elegant-hover bg-gradient-to-br from-orange-200/10 to-orange-300/20 border border-orange-300/20">
            <div className="w-16 h-16 bg-orange-200/30 rounded-full flex items-center justify-center mb-6">
              <Zap className="h-8 w-8 text-orange-300" />
            </div>
            <h3 className="text-xl font-medium mb-3 text-[#ebe7e4]">Free Shipping</h3>
            <p className="text-[#beb2a4] text-center leading-relaxed">
              Complimentary shipping with 24-48 hour processing
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
