# @boostengine/invoicing 🧾

[![npm version](https://img.shields.io/npm/v/@boostengine/invoicing.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/@boostengine/invoicing)
[![npm downloads](https://img.shields.io/npm/dm/@boostengine/invoicing.svg?style=flat-square&color=green)](https://www.npmjs.com/package/@boostengine/invoicing)
[![license](https://img.shields.io/npm/l/@boostengine/invoicing.svg?style=flat-square)](https://github.com/boostengine/boostengine/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)
[![GST Compliant](https://img.shields.io/badge/GST%20Compliant-Rule%2046%20CGST-success.svg?style=flat-square)](https://cbic-gst.gov.in/)

> **Automated, 100% compliant Indian GST Tax Invoice and 4x6 thermal packing slip generator for eCommerce. Generates clean HTML & PDF-ready invoice layouts with HSN code tax breakdowns, CGST/SGST/IGST splits, and amounts in words.**

Zero external rendering dependencies. Generates print-ready HTML/CSS templates instantly in Node.js, Next.js, and serverless environments.

---

## 📸 Generated GST Tax Invoice Preview

```text
  TAX INVOICE (Compliant with Rule 46 of CGST Rules, 2017)
  ═════════════════════════════════════════════════════════════════════════════
  Sold By: BoostStore Retail Pvt Ltd             Invoice No:  INV-2026-98124
  GSTIN:   27ABCDE1234F1Z5                       Invoice Date:14-Sep-2026
  State:   Maharashtra (Code: 27)                Order ID:    BOOST-1001
  ─────────────────────────────────────────────────────────────────────────────
  Billed / Shipped To:
  Rahul Sharma | Flat 402, Skyline Residency, Mumbai, MH - 400053
  ─────────────────────────────────────────────────────────────────────────────
  #  Item Description           HSN   Qty  Rate (₹)  Taxable (₹)  GST Rate  Tax (₹)
  ─  ────────────────────────  ────   ───  ────────  ───────────  ────────  ───────
  1  Cyberpunk Heavy Hoodie    6109    1   1,270.34    1,270.34     18%     228.66
  ─────────────────────────────────────────────────────────────────────────────
  Total Taxable Amount:                           ₹1,270.34
  CGST (9.0%):                                      ₹114.33
  SGST (9.0%):                                      ₹114.33
  ─────────────────────────────────────────────────────────────────────────────
  TOTAL INVOICE AMOUNT:                           ₹1,499.00
  
  Amount in Words: One Thousand Four Hundred Ninety-Nine Rupees Only.
  ═════════════════════════════════════════════════════════════════════════════
```

---

## 🌟 Key Features

- **🇮🇳 Rule 46 CGST Compliance**: Complete with seller GSTIN, state codes, invoice numbering sequences, HSN codes, and taxable values.
- **🔤 Amount in Words Generator**: Automatically converts numbers into Indian numbering currency words (e.g. `₹1,499.00` &rarr; *"One Thousand Four Hundred Ninety-Nine Rupees Only"*).
- **🖨️ Thermal Shipping Labels**: Generates compact 4x6 inch thermal shipping labels with scannable barcode placeholders.
- **⚡ PDF / HTML Output**: Renders standalone HTML strings that can be piped directly into browser print dialogs or headless Chrome PDF engines (e.g. Puppeteer).

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

## 🚀 Quickstart Guide

```typescript
import { InvoiceGenerator, type InvoiceData } from '@boostengine/invoicing';

const invoiceData: InvoiceData = {
  invoiceNumber: 'INV-2026-98124',
  orderId: 'BOOST-1001',
  date: '2026-09-14',
  seller: {
    name: 'BoostStore Retail Pvt Ltd',
    gstin: '27ABCDE1234F1Z5',
    address: 'Plot 42, Tech Park, Andheri East',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400093',
  },
  customer: {
    name: 'Rahul Sharma',
    address: 'Flat 402, Skyline Residency',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400053',
  },
  items: [
    {
      description: 'Cyberpunk Heavy Hoodie - Size L',
      hsnCode: '6109',
      quantity: 1,
      unitPrice: 1270.34,
      taxRate: 18,
    },
  ],
  shippingFee: 0,
};

// 1. Generate Clean HTML Invoice String
const html = InvoiceGenerator.generateHtml(invoiceData);

// 2. Convert Amount to Words
const words = InvoiceGenerator.amountInWords(1499);
console.log(words); // "One Thousand Four Hundred Ninety-Nine Rupees Only"
```

---

## 📄 License

MIT © [Boost Engine](https://github.com/boostengine)
