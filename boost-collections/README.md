# @boostengine/collections

> Production-ready **Postman Collections (Schema v2.1.0)** and **Environment Templates** for the world's leading eCommerce & Payment APIs: **Razorpay, Cashfree, PhonePe, Paytm, Stripe, EasyEcom WMS, Shiprocket, Delhivery, and Shopify**.

Includes a zero-install **1-second CLI tool** (`npx @boostengine/collections export all`) to dump ready-to-import Postman JSON files into any project instantly.

---

## ⚡ 1-Click Quickstart (CLI)

Export any or all collections and environment variables into your project:

```bash
# Export all 9 collections & environments (18 files)
npx @boostengine/collections export all

# Or export individually:
npx @boostengine/collections export razorpay
npx @boostengine/collections export cashfree
npx @boostengine/collections export phonepe
npx @boostengine/collections export paytm
npx @boostengine/collections export stripe
npx @boostengine/collections export easyecom
npx @boostengine/collections export shiprocket
npx @boostengine/collections export delhivery
npx @boostengine/collections export shopify

# Inspect available endpoints inside your terminal:
npx @boostengine/collections info razorpay
npx @boostengine/collections info cashfree
npx @boostengine/collections info shiprocket
```

### 📥 How to Import into Postman / Bruno / Insomnia:
1. Open **Postman** (or Insomnia / Bruno / ThunderClient / Hoppscotch).
2. Click **Import** (Top left corner).
3. Drag & drop the exported `*.collection.json` and `*.env.json` files.
4. Select the imported Environment from the top-right dropdown, enter your API keys, and start sending requests!

---

## 📦 What's Included (9 Exhaustive Enterprise Collections)

| Provider | Category | Modules & Endpoints Included |
| :--- | :--- | :--- |
| **Razorpay** | 💳 Payments | Orders, Payments & Manual Capture, Payment Links, Dynamic UPI QR, Smart Collect (Virtual Accounts), Customers & Tokenized Card Vault, GST Invoices, Subscriptions & Plans, Refunds, Webhook Simulator (`order.paid`, `payment.failed`, `refund.processed`, `virtual_account.credited`) |
| **Cashfree** | 💳 Payments & Banking | Orders (Drop-in Session), Seamless Direct UPI Intent/Collect/Netbanking, Payment Links, Bank Account Verification (Penny Drop), UPI VPA Verification, PAN Verification, Instant Payouts & Disbursals, Subscriptions, Refunds, Webhooks (`PAYMENT_SUCCESS`, `PAYMENT_FAILED`, `REFUND_STATUS`) |
| **PhonePe** | 💳 Payments | Standard Hosted Pay Page, Custom Mobile App UPI Intent, UPI Collect (VPA handle), Dynamic QR Codes, S2S Status Check (`/pg/v1/status`), Refunds, S2S Webhook Simulator with automatic Base64 & SHA256 `X-VERIFY` pre-request calculation |
| **Paytm** | 💳 Payments | Initiate Transaction Token, Checkout SDK session, Transaction Status Verification (`/v3/order/status`), Refund Initiation & Status, S2S Webhook Callback simulator |
| **Stripe** | 💳 Global | Checkout Sessions, PaymentIntents (Cards/Wallets), Customers & Saved Payment Methods, Products & Subscriptions, Refunds & Disputes, Webhooks Simulator |
| **EasyEcom** | 🏬 WMS / ERP | Storefront Orders Push, Pending Orders, Status Updates, Multi-Warehouse Stock Sync, Single & Bulk SKU updates, Master Catalog SKUs & Barcodes, Dispatch Manifests, Inward Returns Reconciliation |
| **Shiprocket** | 🚚 Logistics | Auth JWT, Domestic & International Pincode Serviceability & Rates, Custom & Bulk Orders, Customer Address Update, Reverse Return Orders, AWB Generation, Courier Pickup Request, Manifests, Thermal Shipping Labels, Tax Invoices, Live Tracking, NDR Actions (Re-attempt / RTO), Webhooks |
| **Delhivery** | 🚚 Logistics | Pincode Serviceability Check, Rate & Freight Calculator, Bulk Waybill Pool, Surface/Express CMU Manifest, Address Update, Cancel Shipment, Warehouse Pickup Request, Packing Slips & PDF Barcode Labels, Live Package Tracking, Webhooks |
| **Shopify** | 🛍️ Storefront | Products & Multi-variant catalog, Orders & Status Filter, Fulfillments & Tracking Number attachment, Customers API, Multi-location Inventory Levels, Webhooks |

---

## 💻 Programmatic Node.js / TypeScript Usage

You can also install this package as a dependency to programmatically parse or mock endpoints in backend integration tests:

```bash
npm install -D @boostengine/collections
```

```typescript
import {
  listCollections,
  getCollection,
  razorpayCollection,
  cashfreeCollection,
  phonepeCollection,
  paytmCollection,
  shiprocketCollection,
} from '@boostengine/collections';

// 1. List metadata and available folders:
console.log(listCollections());

// 2. Access raw Postman JSON collections programmatically:
console.log('Razorpay requests:', razorpayCollection.item.length);
console.log('Cashfree schema:', cashfreeCollection.info.schema);
```

---

## 🔄 Updating Upstream Collections

Run the built-in sync audit tool to check upstream API versions:

```bash
npm run sync:upstream
```

---

## 📄 License
MIT © Boost Engine Team
