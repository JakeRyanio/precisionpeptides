# Stripe Webhook Configuration

## ✅ Your Webhook Endpoint is Ready

The webhook endpoint is already built into your code at:
```
https://precisionpeptides.store/api/stripe-webhook
```

## 🔐 Add Webhook Secret to Vercel

You need to add the Stripe webhook secret to your Vercel environment variables.

### Steps:

1. **Go to Vercel Dashboard**
   - Navigate to your project: `precision-peptides`
   - Click on "Settings" tab
   - Select "Environment Variables" from the left menu

2. **Add the Webhook Secret**
   - Click "Add New"
   - **Key**: `STRIPE_WEBHOOK_SECRET`
   - **Value**: (paste your webhook secret that starts with `whsec_`)
   - **Environment**: Select all (Production, Preview, Development)
   - Click "Save"

3. **Redeploy Your Application**
   - Go to "Deployments" tab
   - Click the three dots on the latest deployment
   - Select "Redeploy"
   - Or push a commit to trigger automatic deployment

## 🧪 Test Your Webhook

### Method 1: Stripe Dashboard Test
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click on your webhook endpoint
3. Click "Send test webhook"
4. Select `checkout.session.completed`
5. Send test
6. Check your Zapier webhook to see if test data arrived

### Method 2: Live Test
1. Place a test order using Stripe test card: `4242 4242 4242 4242`
2. Check Zapier task history
3. Verify order appears in your Google Sheet

## 📊 What Happens When Someone Orders

### Stripe Payment Flow:
1. Customer completes checkout with card
2. Stripe sends `checkout.session.completed` event to your webhook
3. Your webhook endpoint (`/api/stripe-webhook`) receives the event
4. Order data is formatted and sent to Zapier
5. Zapier sends data to Google Sheets/ShipStation

### Crypto Payment Flow:
1. Customer selects crypto and enters transaction ID
2. Order immediately sent to Zapier
3. No Stripe involvement for crypto orders

## 🔍 Monitoring & Debugging

### Check Webhook Activity:
- **Stripe Dashboard**: Developers → Webhooks → Click your endpoint → View attempts
- **Vercel Logs**: Functions tab → View logs for `api/stripe-webhook`
- **Zapier History**: Check task history in your Zap

### Common Issues:

1. **Webhook signature verification failed**
   - Solution: Ensure `STRIPE_WEBHOOK_SECRET` is correctly set in Vercel

2. **Orders not appearing in Zapier**
   - Check Vercel function logs for errors
   - Verify webhook secret is set
   - Check Stripe webhook attempts for failures

3. **Test webhooks work but live ones don't**
   - Ensure you're using live mode webhook secret (not test mode)
   - Verify your Stripe API keys are for live mode

## 📝 Webhook Events Configuration

Your webhook is configured to listen for:
- `checkout.session.completed` - Main event for completed payments
- Optional: `payment_intent.succeeded` - Backup for payment confirmation
- Optional: `customer.subscription.created` - For subscription tracking

## 🚀 Final Checklist

- [ ] Webhook endpoint created in Stripe Dashboard
- [ ] Webhook secret added to Vercel environment variables
- [ ] Application redeployed after adding secret
- [ ] Test webhook sent successfully
- [ ] Zapier receiving webhook data
- [ ] Google Sheets populating with order data

## 📌 Important URLs

- **Webhook Endpoint**: `https://precisionpeptides.store/api/stripe-webhook`
- **Zapier Webhook**: `https://hooks.zapier.com/hooks/catch/20980160/udybu6y/`
- **Stripe Webhooks**: https://dashboard.stripe.com/webhooks

Your Stripe webhook integration is ready! Once you add the secret to Vercel and redeploy, all Stripe orders will automatically flow to your Zapier webhook.

