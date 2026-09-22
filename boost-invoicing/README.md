# @boostengine/invoicing 🧾

[![npm version](https://img.shields.io/npm/v/@boostengine/invoicing.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/@boostengine/invoicing)
[![npm downloads](https://img.shields.io/npm/dm/@boostengine/invoicing.svg?style=flat-square&color=green)](https://www.npmjs.com/package/@boostengine/invoicing)
[![license](https://img.shields.io/npm/l/@boostengine/invoicing.svg?style=flat-square)](https://github.com/boostengine/boostengine/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)
[![GST Compliant](https://img.shields.io/badge/GST%20Compliant-Rule%2046%20CGST-success.svg?style=flat-square)](https://cbic-gst.gov.in/)
[![AI Agent Ready](https://img.shields.io/badge/AI%20Agents-OpenAI%20%7C%20LangChain%20%7C%20Vercel%20AI-purple.svg?style=flat-square)](https://github.com/boostengine/boostengine)

> **Enterprise Indian GST Tax Invoice, Bill of Supply, Credit Note & 4x6 Thermal Shipping Label Generator for eCommerce. Features built-in GSTIN validation, HSN/SAC directory, dual tax calculation modes, React/React Native hooks, native `@boostengine/cart` bridge, and turnkey AI agent toolkits.**

Zero heavy external PDF rendering dependencies. Generates print-ready HTML/CSS documents instantly in Node.js, Next.js, React Native, Vite, and serverless environments.

---

## 📸 Architecture & Document Flow

```text
               Customer Order / Checkout Completed
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
 ┌─────────────────────────┐           ┌─────────────────────────┐
 │   GSTIN & State Engine  │           │   HSN Tax Calculator    │
 ├─────────────────────────┤           ├─────────────────────────┤
 │ • Seller: 27 (MH)       │           │ • 6109 (Apparel) @ 12%  │
 │ • Buyer:  29 (KA)       │           │ • 8518 (Audio)   @ 18%  │
 │ ──► Inter-State: IGST   │           │ • Inclusive vs Exclusive│
 └──────────┬──────────────┘           └──────────┬──────────────┘
            │                                     │
            └──────────────────┬──────────────────┘
                               │
                               ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                Multi-Document Rendering Engine              │
 ├─────────────────────────────────────────────────────────────┤
 │ 📄 A4 GST Tax Invoice (Rule 46 Compliant + Bank/UPI details)│
 │ 🛒 Non-GST Retail Invoice / Cash Memo (Unregistered sellers)│
 │ 💼 Proforma Invoice (B2B Quotations & Estimates with expiry)│
 │ 📋 Bill of Supply (Composition dealers & exempt goods)      │
 │ 🔖 Credit Note (Order cancellations & return refunds)       │
 │ 🏷️ 4x6 Thermal Shipping Label (AWB Barcode + COD Alert)     │
 │ 🧾 80mm/58mm Thermal POS Slip (Bluetooth handheld printers) │
 └─────────────────────────────────────────────────────────────┘
```

---

## 🌟 Why @boostengine/invoicing?

- **🇮🇳 100% Comprehensive Document Suite**:
  - **GST Tax Invoice**: Rule 46 CGST compliant with seller GSTIN, HSN summary, CGST/SGST/IGST breakdown, and authorized signatory.
  - **Non-GST Retail Invoice / Cash Memo**: Specially designed for small sellers (< ₹40L turnover), Instagram/home businesses, and unregistered merchants (no GST/HSN columns, clean receipt).
  - **Proforma Invoice / Quotation**: Pre-dispatch quotation for B2B client approvals with quote validity dates.
  - **Bill of Supply**: Rule 49 CGST compliant with mandatory composition scheme declaration for composite/exempt dealers.
  - **Credit Note**: Complete accounting adjustment document for customer returns referencing the original invoice.
  - **4x6 Thermal Shipping Label**: Print-ready with Code128 vector barcode SVG and prominent COD collection badges.
  - **3-inch / 2-inch Thermal POS Receipt**: 80mm/58mm compact layout for Bluetooth mobile thermal printers.
- **🔍 Built-in GSTIN Validation**: Validates 15-digit Indian GSTIN format, extracts state jurisdiction, PAN, and business entity classification.
- **📦 Preloaded HSN/SAC Directory**: Instant tax lookup for apparel, footwear, electronics, cosmetics, books, and courier logistics SAC `9968`.
- **⚖️ Dual Mode Tax Engine**: Supports **Tax Inclusive** (D2C retail where retail price includes GST) and **Tax Exclusive** (B2B wholesale where GST is added on top).
- **🔤 Amount in Words Generator**: Converts decimal rupees & paise into standard Indian currency words (*"One Thousand Four Hundred Ninety-Nine Rupees and Fifty Paise Only"*).
- **📑 Multi-Document Support**:
  - **A4 Tax Invoice**: Print-ready with HSN summary table, bank transfer info & authorized signatory.
  - **Credit Note**: For partial or complete customer refunds, referencing the original invoice number.
  - **4x6 Thermal Shipping Label**: Print-ready with Code128 vector barcode SVG and prominent COD collection badges.
  - **3-inch / 2-inch Thermal POS Receipt**: 80mm/58mm compact layout for Bluetooth mobile thermal printers.
- **🛒 Native `@boostengine/cart` Bridge**: Directly generate invoices from cart instances with `InvoiceGenerator.fromCart(cart, options)`.
- **⚛️ Universal React & React Native Hook**: Drop-in `useInvoice()` hook with live tax computations and print triggers.
- **🤖 Built-in AI Agent Toolkit**: Function calling schemas for OpenAI GPT-4o, Claude 3.5, Gemini, LangChain, and Vercel AI SDK.

---

## 📦 Installation

```bash
# npm
npm install @boostengine/invoicing

# pnpm
pnpm add @boostengine/invoicing

# yarn
yarn add @boostengine/invoicing
```

---

## 🚀 Quickstart: Generate GST Tax Invoice

```typescript
import { InvoiceGenerator, type InvoiceData } from '@boostengine/invoicing';

const invoiceData: InvoiceData = {
  invoiceNumber: 'INV-2026-001',
  invoiceDate: '2026-09-21',
  orderId: 'ORD_1001',
  paymentMethod: 'PREPAID',
  seller: {
    name: 'Boost Commerce Pvt Ltd',
    tradeName: 'Boost Urban Store',
    gstin: '27AAAAA0000A1Z5',
    address: '101 Tech Park, Andheri East',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400069',
    bankDetails: {
      accountName: 'Boost Commerce Pvt Ltd',
      accountNumber: '9988776655',
      bankName: 'HDFC Bank',
      ifsc: 'HDFC0001234',
      upiId: 'boost@hdfcbank',
    },
  },
  buyer: {
    name: 'Rahul Sharma',
    address: 'Flat 402, Green Valley Apartments',
    city: 'Bengaluru',
    state: 'Karnataka', // Inter-State -> Automatically applies IGST!
    pincode: '560038',
    phone: '+919876543210',
  },
  items: [
    {
      name: 'Cyberpunk Heavy Hoodie',
      sku: 'HOD-CYBER-01',
      hsn: '6109',
      quantity: 1,
      unitPrice: 1999, // Inclusive of 18% GST
      taxRate: 18,
    },
  ],
  shippingFee: 0,
};

// Generates complete, print-ready HTML string
const html = InvoiceGenerator.generateTaxInvoiceHtml(invoiceData);
```

---

## 📄 Generating Binary PDF Files (Node.js, Next.js & Serverless)

You can convert any generated invoice HTML into a real binary PDF buffer for email attachments, WhatsApp sharing, or saving to cloud storage (AWS S3, Cloudinary):

```typescript
import { InvoiceGenerator } from '@boostengine/invoicing';

const html = InvoiceGenerator.generateTaxInvoiceHtml(invoiceData);

// 1. Server-Side: Generate binary PDF Buffer (using Puppeteer / Playwright)
const pdfBuffer = await InvoiceGenerator.toPdfBuffer(html, {
  format: 'A4',
  printBackground: true,
});

// Save to disk or upload to S3:
// fs.writeFileSync('Invoice.pdf', pdfBuffer);

// 2. Next.js App Router API Route Handler (/api/invoices/[id]/download)
export async function GET(request: Request) {
  const pdfBuffer = await InvoiceGenerator.toPdfBuffer(html);
  return new Response(pdfBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="Invoice-INV-2026-001.pdf"',
    },
  });
}
```

---

## 🛒 Seamless `@boostengine/cart` Bridge

If your eCommerce store uses [`@boostengine/cart`](https://www.npmjs.com/package/@boostengine/cart), convert your cart into an invoice in 1 line:

```typescript
import { CartEngine } from '@boostengine/cart';
import { InvoiceGenerator } from '@boostengine/invoicing';

const cart = new CartEngine();
cart.addItem({ id: 'item_1', name: 'Linen Shirt', price: 1299, quantity: 2 });

const invoiceData = InvoiceGenerator.fromCart(cart, {
  invoiceNumber: 'INV-2026-042',
  invoiceDate: '2026-09-21',
  orderId: 'ORD_9912',
  seller: mySellerEntity,
  buyer: myCustomerEntity,
  paymentMethod: 'COD',
});

const invoiceHtml = InvoiceGenerator.generateTaxInvoiceHtml(invoiceData);
```

---

## 🔍 GSTIN Validation & Tax Type Determination

```typescript
import { validateGSTIN, determineTaxType } from '@boostengine/invoicing';

// 1. Validate GSTIN
const gstinResult = validateGSTIN('27AABCU9603R1ZM');
console.log(gstinResult.isValid);    // true
console.log(gstinResult.stateName);  // "Maharashtra"
console.log(gstinResult.entityType); // "Company"

// 2. Determine Intra-State vs Inter-State
const taxType = determineTaxType('Maharashtra', 'Karnataka');
console.log(taxType.isIntraState);   // false -> Inter-State: IGST applies
```

---

## 🏷️ 4x6 Thermal Shipping Label & POS Receipts

```typescript
import { InvoiceGenerator } from '@boostengine/invoicing';

// 4x6 Thermal Label with Barcode
const labelHtml = InvoiceGenerator.generateShippingLabelHtml({
  awb: 'DEL9876543210',
  courierName: 'Delhivery',
  routingCode: 'BOM/HUB-1',
  orderId: 'ORD_1001',
  seller: mySellerEntity,
  buyer: myCustomerEntity,
  paymentMethod: 'COD',
  collectibleAmount: 1499,
  weightKg: 0.5,
  itemSummary: [{ name: 'Hoodie', quantity: 1 }],
});

// 80mm / 58mm POS Receipt (Bluetooth Handheld Printer)
const receiptHtml = InvoiceGenerator.generateThermalReceiptHtml({
  storeName: 'Boost Store',
  receiptNumber: 'RCPT-101',
  date: '2026-09-21',
  orderId: 'ORD-555',
  items: [{ name: 'Coffee', price: 150, quantity: 1 }],
  subtotal: 150,
  total: 150,
  paymentMethod: 'UPI',
}, 80);
```

---

## ⚛️ React & React Native (`@boostengine/invoicing/react`)

```tsx
import React from 'react';
import { useInvoice } from '@boostengine/invoicing/react';

export function OrderInvoiceView({ orderData }: { orderData: any }) {
  const {
    taxBreakdown,
    amountInWords,
    grandTotal,
    printInvoice,
  } = useInvoice({ invoiceData: orderData });

  return (
    <div className="p-6 bg-white border rounded-xl shadow-sm">
      <h2 className="text-xl font-bold">Tax Summary</h2>
      <p>Taxable Subtotal: ₹{taxBreakdown?.subtotalTaxable}</p>
      <p>Total GST Tax: ₹{taxBreakdown?.totalTax}</p>
      <p className="font-bold text-lg">Grand Total: ₹{grandTotal}</p>
      <p className="text-sm italic text-gray-600">{amountInWords}</p>

      <button
        onClick={printInvoice}
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        🖨️ Print / Save PDF
      </button>
    </div>
  );
}
```

---

## 🤖 Turnkey AI Agent Toolkit (`@boostengine/invoicing/agent`)

Equip conversational commerce agents (OpenAI GPT-4o, Claude 3.5, Gemini, LangChain) with autonomous invoice generation and tax breakdown:

```typescript
import { InvoicingAgentToolkit } from '@boostengine/invoicing/agent';

const toolkit = new InvoicingAgentToolkit();

// 1. Export standard JSON Schemas for LLM function calling
const tools = toolkit.getFunctionSchemas();

// 2. Autonomous GST tax breakdown calculation
const breakdown = toolkit.calculateTaxBreakdown({
  sellerState: 'Maharashtra',
  buyerState: 'Delhi',
  items: [
    { name: 'Oversized Tee', hsn: '6109', quantity: 2, unitPrice: 999, taxRate: 12 },
  ],
});

console.log(breakdown.igstTotal); // Calculated IGST for inter-state delivery
```

---

## 💻 Interactive CLI

```bash
# Run verification test suite
npx @boostengine/invoicing test

# Validate any 15-digit GSTIN number
npx @boostengine/invoicing validate-gstin 27AABCU9603R1ZM

# Lookup standard HSN rate
npx @boostengine/invoicing lookup-hsn 6109

# Live sample demo
npx @boostengine/invoicing demo
```

---

## 📄 License

MIT © [Boost Engine](https://github.com/boostengine)
