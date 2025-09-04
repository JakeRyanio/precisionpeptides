# Google Sheets Column Setup for Zapier Integration

## Required Columns (Copy these exactly into Row 1 of your Google Sheet)

### Column A-J: Basic Order Info
- **A:** Order ID
- **B:** Order Date
- **C:** Payment Method
- **D:** Order Total
- **E:** First Name
- **F:** Last Name
- **G:** Email
- **H:** Phone
- **I:** Order Status
- **J:** Special Instructions

### Column K-P: Shipping Address
- **K:** Address Line 1
- **L:** Address Line 2
- **M:** City
- **N:** State
- **O:** Zip Code
- **P:** Country

### Column Q-T: Order Items (Combined)
- **Q:** Products Ordered
- **R:** Quantities
- **S:** Item Prices
- **T:** Item Subtotals

### Column U-Y: Payment Details (Stripe)
- **U:** Stripe Session ID
- **V:** Stripe Payment Intent
- **W:** Stripe Subscription ID
- **X:** Stripe Payment Status
- **Y:** Stripe Mode

### Column Z-AC: Payment Details (Crypto)
- **Z:** Cryptocurrency Type
- **AA:** Transaction ID
- **AB:** Wallet Address
- **AC:** Crypto Status

### Column AD-AF: Order Totals Breakdown
- **AD:** Subtotal
- **AE:** Shipping
- **AF:** Tax

## Zapier Field Mapping Guide

In your Zapier action (Google Sheets → Create Spreadsheet Row), map these fields:

### Basic Info Mapping:
- **Order ID** → `orderId`
- **Order Date** → `createdAt`
- **Payment Method** → `paymentMethod`
- **Order Total** → `totals.total`
- **First Name** → `customerInfo.firstName`
- **Last Name** → `customerInfo.lastName`
- **Email** → `customerInfo.email`
- **Phone** → `customerInfo.phone`
- **Order Status** → Use formula: `IF(paymentMethod = "cryptocurrency", "Pending Verification", "Paid")`
- **Special Instructions** → `specialInstructions`

### Address Mapping:
- **Address Line 1** → `shippingAddress.line1`
- **Address Line 2** → `shippingAddress.line2`
- **City** → `shippingAddress.city`
- **State** → `shippingAddress.state`
- **Zip Code** → `shippingAddress.postalCode`
- **Country** → `shippingAddress.country`

### Items Mapping (Use Formatter in Zapier):
Since items is an array, you'll need to use Zapier's Formatter:

1. **Products Ordered**:
   - Use Formatter → Utilities → Line Items to Text
   - Input: `items.name`
   - Separator: `, `

2. **Quantities**:
   - Use Formatter → Utilities → Line Items to Text
   - Input: `items.quantity`
   - Separator: `, `

3. **Item Prices**:
   - Use Formatter → Utilities → Line Items to Text
   - Input: `items.price`
   - Separator: `, `

4. **Item Subtotals**:
   - Use Formatter → Utilities → Line Items to Text
   - Input: `items.subtotal`
   - Separator: `, `

### Stripe Details Mapping:
- **Stripe Session ID** → `stripePaymentDetails.sessionId`
- **Stripe Payment Intent** → `stripePaymentDetails.paymentIntentId`
- **Stripe Subscription ID** → `stripePaymentDetails.subscriptionId`
- **Stripe Payment Status** → `stripePaymentDetails.paymentStatus`
- **Stripe Mode** → `stripePaymentDetails.mode`

### Crypto Details Mapping:
- **Cryptocurrency Type** → `cryptoPaymentDetails.cryptocurrency`
- **Transaction ID** → `cryptoPaymentDetails.transactionId`
- **Wallet Address** → `cryptoPaymentDetails.walletAddress`
- **Crypto Status** → `cryptoPaymentDetails.status`

### Totals Mapping:
- **Subtotal** → `totals.subtotal`
- **Shipping** → `totals.shipping`
- **Tax** → `totals.tax`

## Alternative: Simplified Column Setup

If you want a simpler setup with fewer columns, use these essential columns only:

### Essential Columns (Row 1):
1. **Order ID**
2. **Date**
3. **Payment Method**
4. **Customer Name** (combine first + last in Zapier)
5. **Email**
6. **Phone**
7. **Full Address** (combine all address fields in Zapier)
8. **Products** (all items as text)
9. **Total**
10. **Transaction ID** (for crypto)
11. **Status**

## Google Sheets Setup Tips:

1. **Create Headers First**: Add all column names to Row 1 before connecting Zapier
2. **Format Columns**:
   - Format Date column as Date/Time
   - Format price columns as Currency
   - Format email column as Plain Text
3. **Freeze Row 1**: Select Row 1 → View → Freeze → 1 row
4. **Auto-resize Columns**: Select all → Right-click column header → Resize columns

## Zapier Pro Tips:

1. **Test with Sample Data**: Use Zapier's test feature before going live
2. **Add Filters**: Filter by payment method if you want separate sheets
3. **Set up Formatting**: Use Zapier Formatter for arrays and combined fields
4. **Add Timestamps**: Use Zapier's timestamp feature for accurate order times

## Sample Google Sheets Formula for Status:

Add this formula in the Status column to auto-set order status:
```
=IF(C2="cryptocurrency","Pending Crypto Verification",IF(C2="stripe","Paid","Unknown"))
```
(Assuming Payment Method is in column C)

## Ready-to-Copy Column Names:

Copy this entire row and paste into Row 1 of your Google Sheet:

```
Order ID	Order Date	Payment Method	Order Total	First Name	Last Name	Email	Phone	Order Status	Special Instructions	Address Line 1	Address Line 2	City	State	Zip Code	Country	Products Ordered	Quantities	Item Prices	Item Subtotals	Stripe Session ID	Stripe Payment Intent	Stripe Subscription ID	Stripe Payment Status	Stripe Mode	Cryptocurrency Type	Transaction ID	Wallet Address	Crypto Status	Subtotal	Shipping	Tax
```

Your Google Sheet is now ready to receive all order data from your website!

