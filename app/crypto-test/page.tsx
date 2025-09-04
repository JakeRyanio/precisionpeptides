"use client"

export default function CryptoTestPage() {
  return (
    <div className="min-h-screen bg-[#201c1a] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-[#ebe7e4] mb-8">Crypto Payment Test</h1>
        
        <div className="bg-[#2a2624] border border-[#403c3a] rounded-lg p-6 mb-4">
          <h2 className="text-xl font-medium text-[#d2c6b8] mb-4">Payment Options Status:</h2>
          <ul className="space-y-2 text-[#ebe7e4]">
            <li>✅ Crypto payment component exists at: /components/checkout/crypto-payment.tsx</li>
            <li>✅ Payment method selection buttons are in checkout page</li>
            <li>✅ Both Card and Crypto options should be visible</li>
          </ul>
        </div>

        <div className="bg-[#2a2624] border border-[#403c3a] rounded-lg p-6 mb-4">
          <h2 className="text-xl font-medium text-[#d2c6b8] mb-4">How to Access Crypto Payment:</h2>
          <ol className="list-decimal list-inside space-y-2 text-[#ebe7e4]">
            <li>Go to checkout page with items in cart</li>
            <li>Fill in customer information</li>
            <li>Look for "Payment Method" section</li>
            <li>You should see two buttons: "Credit/Debit Card" and "Cryptocurrency"</li>
            <li>Click "Cryptocurrency" to switch to crypto payment</li>
          </ol>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
          <h2 className="text-xl font-medium text-yellow-400 mb-4">Important:</h2>
          <p className="text-yellow-200">
            If you don't see the payment method selection buttons, the site needs to be redeployed.
            The code is ready but may not be deployed to production yet.
          </p>
        </div>

        <div className="mt-8">
          <a 
            href="/checkout" 
            className="inline-block bg-[#d2c6b8] hover:bg-[#beb2a4] text-[#201c1a] font-medium px-6 py-3 rounded-md"
          >
            Go to Checkout Page
          </a>
        </div>
      </div>
    </div>
  )
}

