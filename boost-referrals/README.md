# @boostengine/referrals 🎁

[![npm version](https://img.shields.io/npm/v/@boostengine/referrals.svg?color=blue)](https://www.npmjs.com/package/@boostengine/referrals)
[![npm downloads](https://img.shields.io/npm/dm/@boostengine/referrals.svg?color=green)](https://www.npmjs.com/package/@boostengine/referrals)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Tree Shakable](https://img.shields.io/badge/Tree--Shakable-Yes-success.svg)](https://bundlephobia.com)

> **The complete Double-Sided Viral Referral & Rewards Engine with Built-in Fraud Detection for Next.js, Vite, React, and Node.js eCommerce applications.**

Turn your customers into brand ambassadors. Give new buyers an instant discount while rewarding the referrer with wallet cashback or SuperCoins.

---

## 🌟 Why Use @boostengine/referrals?

Acquiring new customers via paid Meta/Google ads is getting more expensive every day. A viral referral program (*"Give ₹200, Get ₹200"*) is one of the highest ROI acquisition channels for D2C brands.

`@boostengine/referrals` provides:
- **Clean Human-Readable Codes**: Generates short, memorable codes like `REF-AJAY-98` or `AARAV200`.
- **Anti-Fraud Shield**: Automatically prevents self-referrals by detecting matching phone numbers, email addresses, device IDs, and IP addresses.
- **Double-Sided Incentives**: Give the friend an instant checkout discount while unlocking store credit/SuperCoins for the referrer upon order delivery.
- **1-Click Social Sharing**: Instant deep links for WhatsApp, Telegram, and Twitter with pre-filled promotional messages.
- **Framework Agnostic**: Works out-of-the-box in Next.js, Vite, React, Vue, Express, and React Native.

---

## 📐 How It Works (Viral Loop)

```text
User A (Existing Customer)
          │
          ▼
Shares referral link via WhatsApp
          │
          ▼
User B (Friend) opens link & signs up
          │
          ▼
User B checks out with ₹200 Instant Discount
          │
          ▼
Order is Delivered & Verified
          │
          ▼
User A receives ₹200 Wallet Credit / SuperCoins 🎉
```

---

## 📦 Installation

```bash
npm install @boostengine/referrals
# or
yarn add @boostengine/referrals
# or
pnpm add @boostengine/referrals
```

---

## ⚡ 60-Second Quickstart

```typescript
import { ReferralEngine } from '@boostengine/referrals';

// 1. Generate a personalized referral code for a customer
const code = ReferralEngine.generateCode('Rohit Sharma', 'user_9812');
console.log(code); // "REF-ROHIT-812"

// 2. Generate 1-Click WhatsApp & Social Share Links
const share = ReferralEngine.generateSharePayloads(
  code,
  'https://mybrand.com',
  'Urban Streetwear',
  200 // Discount in ₹
);

console.log(share.whatsappUrl);
// "https://api.whatsapp.com/send?text=Hey! Use my referral code REF-ROHIT-812..."

// 3. Validate Referral Code Application at Checkout
const validation = ReferralEngine.validateReferralApplication(
  code,
  { customerId: 'user_9812', phone: '9876543210', email: 'rohit@test.com' }, // Referrer
  { customerId: 'user_1102', phone: '9123456789', email: 'friend@test.com' }, // Referee
  1499, // Order Subtotal
  true  // Is Referee First Order
);

if (validation.isValid) {
  console.log(`Discount Applied: ₹${validation.discountAmount}`); // ₹200
} else {
  console.log(`Failed: ${validation.error}`);
}
```

---

## 🛡️ Built-in Anti-Fraud Protection

Self-referral abuse is a major problem in eCommerce. `@boostengine/referrals` validates incoming applications to block exploiters automatically:

```typescript
// Case 1: Same Customer ID
const res1 = ReferralEngine.validateReferralApplication(code, userA, userA, 1500);
console.log(res1.errorCode); // "SELF_REFERRAL"

// Case 2: Matching Phone Number
const res2 = ReferralEngine.validateReferralApplication(
  code,
  { customerId: '1', phone: '9999999999' },
  { customerId: '2', phone: '9999999999' },
  1500
);
console.log(res2.errorCode); // "SELF_REFERRAL"

// Case 3: Minimum Order Value Not Met (Default ₹999)
const res3 = ReferralEngine.validateReferralApplication(code, userA, userB, 499);
console.log(res3.errorCode); // "MIN_ORDER_NOT_MET"
```

---

## 🚀 Framework Integration Examples

### A. Next.js App Router (Checkout Validation API)

Create `app/api/referrals/validate/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { ReferralEngine } from '@boostengine/referrals';

export async function POST(req: Request) {
  try {
    const { code, referrer, referee, orderTotal, isFirstOrder } = await req.json();

    const result = ReferralEngine.validateReferralApplication(
      code,
      referrer,
      referee,
      orderTotal,
      isFirstOrder
    );

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
```

### B. Vite + React (Referral Share Button)

```tsx
import React, { useState } from 'react';
import { ReferralEngine } from '@boostengine/referrals';

export function ReferFriendCard({ user }) {
  const code = ReferralEngine.generateCode(user.name, user.id);
  const share = ReferralEngine.generateSharePayloads(code, window.location.origin, 'MyStore', 200);

  return (
    <div className="p-6 bg-gradient-to-r from-purple-900 to-indigo-900 text-white rounded-2xl">
      <h3 className="text-xl font-bold">Give ₹200, Get ₹200!</h3>
      <p className="text-sm text-gray-300 mt-1">Your code: <span className="font-mono font-bold text-amber-300">{code}</span></p>

      <a
        href={share.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-block bg-emerald-500 hover:bg-emerald-600 text-black font-bold px-4 py-2 rounded-xl text-sm"
      >
        Share on WhatsApp
      </a>
    </div>
  );
}
```

---

## 📖 API Reference

### `ReferralEngine.generateCode(name, userId)`
Generates clean, human-friendly referral codes.
- **Parameters:** `name` (string), `userId` (string)
- **Returns:** string (e.g. `"REF-ROHIT-345"`)

### `ReferralEngine.generateSharePayloads(code, baseUrl, brandName?, refereeDiscount?)`
Creates pre-built social share URLs and copy text.
- **Returns:** `{ code, referralLink, whatsappUrl, telegramUrl, twitterUrl, shareText }`

### `ReferralEngine.validateReferralApplication(code, referrer, referee, orderTotal, isRefereeFirstOrder?, config?)`
Evaluates business rules and anti-fraud conditions before applying a referral discount.
- **Returns:** `{ isValid: boolean, code?: string, discountAmount?: number, error?: string, errorCode?: string }`

---

## 📄 License

MIT © [Boost Engine Team](https://github.com/boostengine)
