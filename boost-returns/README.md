# @boostengine/returns 🔄

[![npm version](https://img.shields.io/npm/v/@boostengine/returns.svg?color=blue)](https://www.npmjs.com/package/@boostengine/returns)
[![npm downloads](https://img.shields.io/npm/dm/@boostengine/returns.svg?color=green)](https://www.npmjs.com/package/@boostengine/returns)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Tree Shakable](https://img.shields.io/badge/Tree--Shakable-Yes-success.svg)](https://bundlephobia.com)

> **The complete Returns, Replacement, and Instant Refund engine with automated reverse logistics for Next.js, Vite, React, and Node.js eCommerce stores.**

Handle doorstep returns, size exchanges, hygiene category exclusions, Shiprocket reverse pickups, and instant UPI/wallet refunds with just a few lines of code.

---

## 🌟 Why Use @boostengine/returns?

Building return and refund systems from scratch is complicated. You have to handle:
- **Return eligibility windows** (e.g., maximum 7 days from delivery).
- **Non-returnable items** (hygiene rules for innerwear, perfumes, or clearance items).
- **Replacement only items** (allowing size swap instead of cash refunds).
- **Reverse logistics tracking** (generating Shiprocket / Delhivery reverse AWB manifests).
- **Reverse shipping deductions** (deducting ₹100 if the buyer simply changed their mind).
- **State machine tracking** (`REQUESTED` ➔ `PICKUP` ➔ `QC` ➔ `REFUND`).

`@boostengine/returns` handles all of this out-of-the-box in a tiny, zero-bloat, tree-shakable package.

---

## 📐 Return Lifecycle Flow

```text
Customer submits Return / Swap
            │
            ▼
┌───────────────────────────────┐
│ 1. Eligibility Check          │  ➔  Checks delivery date window & non-returnable categories
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ 2. Create Return Request      │  ➔  Calculates net refund & deduction fee
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ 3. Reverse Logistics Manifest │  ➔  Generates Shiprocket / Delhivery reverse pickup AWB
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ 4. Quality Check (QC) Hub     │  ➔  Verify item condition & tags intact
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│ 5. Instant Refund / Exchange  │  ➔  Refund to original source/UPI or dispatch new size
└───────────────────────────────┘
```

---

## 📦 Installation

Works seamlessly in **Next.js, Vite, React, Vue, Node.js, and React Native**:

```bash
npm install @boostengine/returns
# or
yarn add @boostengine/returns
# or
pnpm add @boostengine/returns
```

---

## ⚡ 60-Second Quickstart

```typescript
import { ReturnEngine } from '@boostengine/returns';

// 1. Check if the customer can return the item
const eligibility = ReturnEngine.checkEligibility(
  '2026-09-12T10:00:00Z', // Delivered timestamp
  't-shirts',             // Category
  'DELIVERED',            // Order status
  { returnWindowDays: 7 }
);

console.log(eligibility.isEligible); // true
console.log(eligibility.allowedResolutions); // ['REFUND', 'REPLACEMENT', 'STORE_CREDIT']

// 2. Calculate Refund Quote (with reverse shipping fee handling)
const quote = ReturnEngine.calculateRefundQuote([
  {
    productId: 'p_101',
    name: 'Oversized Hoodie',
    quantity: 1,
    unitPrice: 1999,
    reason: 'SIZE_FIT_ISSUE',
    requestedResolution: 'REFUND'
  }
]);

console.log(quote.netRefundAmount); // 1999
console.log(quote.estimatedSettlementDays); // 3

// 3. Create a Return Request
const returnRequest = ReturnEngine.createReturnRequest({
  orderId: 'ORD-8819',
  customerId: 'CUST-001',
  items: [
    {
      productId: 'p_101',
      name: 'Oversized Hoodie',
      quantity: 1,
      unitPrice: 1999,
      reason: 'SIZE_FIT_ISSUE',
      requestedResolution: 'REFUND'
    }
  ],
  pickupAddress: {
    name: 'Aarav Mehta',
    phone: '9876543210',
    addressLine1: 'Flat 402, Sunset Heights',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050'
  }
});

console.log(returnRequest.id); // "RET-2026-8491"
console.log(returnRequest.status); // "REQUESTED"
```

---

## 🚀 Framework Integration Examples

### A. Next.js App Router (API Route Handler)

Create `app/api/returns/check/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { ReturnEngine } from '@boostengine/returns';

export async function POST(req: Request) {
  try {
    const { deliveredAt, category, status } = await req.json();

    const result = ReturnEngine.checkEligibility(deliveredAt, category, status, {
      returnWindowDays: 7,
      nonReturnableCategories: ['innerwear', 'clearance-sale']
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
```

### B. Vite + React (Client-Side Component)

```tsx
import React, { useState } from 'react';
import { ReturnEngine } from '@boostengine/returns';

export function ReturnQuoteCard({ itemPrice, reason }) {
  const quote = ReturnEngine.calculateRefundQuote([
    {
      productId: '1',
      name: 'Product',
      quantity: 1,
      unitPrice: itemPrice,
      reason: reason,
      requestedResolution: 'REFUND'
    }
  ]);

  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm">
      <h3 className="font-bold text-lg">Refund Breakdown</h3>
      <p>Original Amount: ₹{quote.itemSubtotal}</p>
      {quote.reversePickupFeeDeducted > 0 && (
        <p className="text-red-500">Reverse Pickup Fee: -₹{quote.reversePickupFeeDeducted}</p>
      )}
      <p className="text-emerald-600 font-bold text-xl">
        Estimated Refund: ₹{quote.netRefundAmount}
      </p>
      <small className="text-gray-400">Settles to original source in {quote.estimatedSettlementDays} days</small>
    </div>
  );
}
```

---

## 🚚 Reverse Logistics (Shiprocket & Delhivery)

Automatically generate courier-ready reverse pickup manifests:

```typescript
import { ReturnEngine } from '@boostengine/returns';

const manifest = ReturnEngine.generateReversePickupManifest(
  returnRequest,
  {
    hubName: 'Central Logistics Warehouse',
    address: 'Plot 44, Udyog Vihar Phase 4',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122015'
  },
  'Shiprocket' // or 'Delhivery'
);

console.log(manifest.awbNumber); // "SRR847192048"
console.log(manifest.courierPartner); // "Shiprocket"
```

---

## 📖 API Reference

### `ReturnEngine.checkEligibility(deliveredAt, categorySlug, orderStatus, policy?)`
Evaluates whether an order or product is allowed to be returned.
- **Returns:** `{ isEligible: boolean, reason?: string, daysRemaining?: number, allowedResolutions: string[] }`

### `ReturnEngine.calculateRefundQuote(items, policy?)`
Calculates refund totals, applies reverse pickup deduction if reason is `CHANGED_MIND`, and computes settlement timeframe.
- **Returns:** `RefundQuote`

### `ReturnEngine.createReturnRequest(payload)`
Constructs a strongly-typed return request object with unique tracking ID.
- **Returns:** `ReturnRequest`

### `ReturnEngine.generateReversePickupManifest(returnRequest, warehouse, courier?)`
Builds reverse pickup shipping manifests with automated AWB numbers for Shiprocket or Delhivery.
- **Returns:** `ReversePickupManifest`

### `ReturnEngine.transitionStatus(currentStatus, targetStatus)`
State machine validator to prevent illegal lifecycle jumps (e.g. cannot jump from `REQUESTED` directly to `QC_PASSED`).
- **Returns:** `{ allowed: boolean, newStatus: ReturnStatus, error?: string }`

---

## 📄 License

MIT © [Boost Engine Team](https://github.com/boostengine)
