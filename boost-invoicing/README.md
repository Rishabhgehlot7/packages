# @boostengine/invoicing 🧾

> **Enterprise Indian GST Tax Invoice & 4x6 Thermal Shipping Label Generator for Modern eCommerce & Next.js.**

Generate legally compliant, print-ready GST invoices with HSN summaries, amount in words, and thermal shipping labels with SVG barcodes in milliseconds with zero third-party dependencies.

---

## 🌟 Key Features

- **🇮🇳 100% Compliant Indian GST Tax Invoice**:
  - Automatic intra-state (CGST + SGST) vs inter-state (IGST) split.
  - HSN code breakdown summary table.
  - Indian numbering system amount in words (*"Rupees One Thousand Four Hundred Ninety-Nine Only"*).
  - B2B customer GSTIN support.
  - Print-ready and Puppeteer / Chromium PDF friendly.
- **🏷️ 4x6 Inch Thermal Shipping Label**:
  - Standard carrier format (Delhivery, Shiprocket, BlueDart, Shadowfax).
  - Clean SVG Barcode (Code128 compatible) - no heavy font or canvas required.
  - High-visibility COD collectible amount box.
- **⚡ Zero External Dependencies**: Blazing fast, pure TypeScript and standard web technologies.

---

## 📦 Installation

```bash
npm install @boostengine/invoicing
```

---

## 🚀 Quickstart

### 1. Generating a Tax Invoice (API Route or Server Action)

```typescript
// app/api/orders/[id]/invoice/route.ts
import { InvoiceGenerator } from '@boostengine/invoicing';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const invoiceHtml = InvoiceGenerator.generateTaxInvoiceHtml({
    invoiceNumber: `INV-2026-${params.id}`,
    invoiceDate: '2026-09-09',
    orderId: params.id,
    paymentMethod: 'PREPAID',
    seller: {
      name: 'Boost Commerce Pvt Ltd',
      tradeName: 'Aesthetic Club',
      gstin: '27AAAAA0000A1Z5',
      address: '101 Tech Park, Andheri East',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400069',
    },
    buyer: {
      name: 'Rahul Sharma',
      address: 'Flat 402, Green Valley Apartments',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411038',
      phone: '+919876543210',
    },
    items: [
      {
        name: 'Oversized Anime Hoodie',
        sku: 'OAH-BLK-L',
        hsn: '6109',
        quantity: 1,
        unitPrice: 1999,
        taxRate: 18,
      },
    ],
    shippingFee: 0,
  });

  return new Response(invoiceHtml, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
```

---

### 2. Generating 4x6 Thermal Shipping Label

```typescript
import { InvoiceGenerator } from '@boostengine/invoicing';

const labelHtml = InvoiceGenerator.generateShippingLabelHtml({
  awb: 'DEL9876543210',
  courierName: 'Delhivery Surface',
  routingCode: 'BOM/HUB-01',
  orderId: 'ORD_1001',
  seller: {
    name: 'Aesthetic Club',
    address: 'Andheri East',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400069',
  },
  buyer: {
    name: 'Vikram Singh',
    address: 'Sector 62',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201301',
    phone: '+919988776655',
  },
  paymentMethod: 'COD',
  collectibleAmount: 1499,
  weightKg: 0.5,
  itemSummary: [{ name: 'Hoodie', quantity: 1 }],
});
```

---

## 🛠️ CLI Utilities

```bash
# Run interactive demo
npx @boostengine/invoicing demo
```

---

## 📄 License

MIT © [Boost Engine](https://github.com/boostengine)
