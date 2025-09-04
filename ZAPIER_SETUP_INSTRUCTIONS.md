# Zapier Integration - Complete Setup Instructions

## ✅ What's Been Done

Your Zapier webhook URL has been **hardcoded directly into the application**:
- Webhook URL: `https://hooks.zapier.com/hooks/catch/20980160/udybu6y/`
- **ALL orders** (both Stripe and Crypto) will be sent to this webhook
- No environment variables needed - it's built right into the code

## 🎯 How It Works

### For Crypto Orders:
1. Customer selects cryptocurrency and submits transaction ID
2. Order is immediately sent to your Zapier webhook
3. Order ID format: `CRYPTO-timestamp-randomID`
4. Payment method field shows: `"cryptocurrency"`

### For Stripe Orders:
1. Customer completes Stripe checkout
2. Stripe webhook receives payment confirmation
3. Order is automatically sent to your Zapier webhook
4. Order ID format: `STRIPE-timestamp`
5. Payment method field shows: `"stripe"`

## 📊 Order Data You'll Receive

Every order includes:
- **paymentMethod**: `"stripe"` or `"cryptocurrency"` (THIS IS THE KEY FIELD)
- **orderId**: Unique order identifier
- **customerInfo**: Name, email, phone
- **shippingAddress**: Complete address with line1, line2, city, state, zip
- **items**: All products with quantities and prices
- **totals**: Subtotal, shipping, tax, total
- **stripePaymentDetails**: Session ID, payment status (null for crypto)
- **cryptoPaymentDetails**: Crypto type, transaction ID, wallet (null for Stripe)

## 🔧 Stripe Webhook Setup (REQUIRED)

For Stripe orders to be sent to Zapier, you need to configure the Stripe webhook:

1. **Go to Stripe Dashboard**:
   - Navigate to: Developers → Webhooks
   - Click "Add endpoint"

2. **Configure Endpoint**:
   - Endpoint URL: `https://precisionpeptides.store/api/stripe-webhook`
   - Select events: 
     - `checkout.session.completed`
     - `payment_intent.succeeded` (optional)
     - `customer.subscription.created` (optional)

3. **Get Webhook Secret**:
   - After creating, click on the webhook
   - Copy the "Signing secret" (starts with `whsec_`)

4. **Add to Vercel**:
   - Go to your Vercel project settings
   - Add environment variable:
     ```
     STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
     ```

## 📝 Zapier Configuration

In your Zapier Zap:

1. **Trigger is already set up** (Webhooks by Zapier)

2. **Add Filter (Optional but Recommended)**:
   - Filter by `paymentMethod`
   - You can create separate Zaps for Stripe vs Crypto orders
   - Or handle both in one Zap with conditional logic

3. **For Google Sheets**:
   - Create columns for:
     - Order ID
     - Payment Method (Stripe/Crypto)
     - Customer Name
     - Email
     - Items
     - Total
     - Transaction ID (for crypto)
     - Order Date

4. **For ShipStation**:
   - Map fields appropriately
   - Use `paymentMethod` field to add order tags
   - Include crypto transaction ID in order notes

## 🚀 Deployment Steps

1. **Deploy to Vercel**:
   ```bash
   git add .
   git commit -m "Add Zapier webhook integration for all orders"
   git push
   ```

2. **Set up Stripe Webhook** (see above)

3. **Test Both Payment Methods**:
   - Place a test Stripe order
   - Place a test crypto order
   - Check your Zapier task history
   - Verify data in Google Sheets/ShipStation

## ✨ Benefits

- **Single Integration Point**: All orders go through one Zapier webhook
- **Clear Payment Identification**: `paymentMethod` field clearly shows payment type
- **No Email Setup Required**: Direct integration with your tools
- **Automatic Processing**: Orders flow directly to your systems
- **Easy Filtering**: Can separate Stripe vs Crypto orders in Zapier

## 🔍 Troubleshooting

1. **Orders not appearing in Zapier?**
   - Check Zapier task history
   - Check Vercel function logs
   - Ensure Stripe webhook is configured

2. **Stripe orders not sending?**
   - Verify Stripe webhook URL is correct
   - Check webhook signing secret in Vercel
   - Test with Stripe CLI locally

3. **Crypto orders not sending?**
   - Check browser console for errors
   - Verify order completes successfully

## 📌 Important Notes

- The webhook URL is hardcoded as: `https://hooks.zapier.com/hooks/catch/20980160/udybu6y/`
- If you ever need to change this URL, you'll need to update the code in:
  - `/app/api/crypto-order/route.ts`
  - `/app/api/stripe-webhook/route.ts`
- All orders are sent in real-time
- Zapier free plan allows 100 tasks/month (upgrade if needed)

Your integration is ready! Deploy to Vercel and set up the Stripe webhook to start receiving ALL orders in your Zapier workflow.

