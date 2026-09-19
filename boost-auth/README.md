# @boostengine/auth 🔐

[![npm version](https://img.shields.io/npm/v/@boostengine/auth.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/@boostengine/auth)
[![npm downloads](https://img.shields.io/npm/dm/@boostengine/auth.svg?style=flat-square&color=green)](https://www.npmjs.com/package/@boostengine/auth)
[![license](https://img.shields.io/npm/l/@boostengine/auth.svg?style=flat-square)](https://github.com/Rishabhgehlot7/packages/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Stateless](https://img.shields.io/badge/Architecture-100%25%20Stateless%20(Zero--Redis)-blueviolet.svg?style=flat-square)](https://nodejs.org/)

> **Frictionless phone OTP login, stateless HMAC verification tokens, session cookies, and guest-to-customer cart merger for modern eCommerce.**

Zero external dependencies (built exclusively with native Node.js `crypto`). Works seamlessly with Next.js App Router, Express, Fastify, and Remix.

---

## 📸 Passwordless OTP & Guest Cart Flow

```text
  Customer Enters Phone (+91 98765 43210)
                     │
                     ▼
  ┌─────────────────────────────────────────────────────────────┐
  │                 Stateless Token Generator                   │
  ├─────────────────────────────────────────────────────────────┤
  │ 1. Generates 6-digit OTP (e.g. 492810)                      │
  │ 2. Computes HMAC-SHA256 Stateless Verification Token        │
  │    (Contains encrypted timestamp + phone signature)         │
  │    *NO REDIS OR DATABASE WRITE REQUIRED!*                   │
  └────────────────────────────┬────────────────────────────────┘
                               │
                               ▼
  ┌─────────────────────────────────────────────────────────────┐
  │                 SMS / WhatsApp Dispatch                     │
  ├─────────────────────────────────────────────────────────────┤
  │ "Your BoostStore verification code is 492810. Valid for 5m" │
  └────────────────────────────┬────────────────────────────────┘
                               │
                               ▼
  ┌─────────────────────────────────────────────────────────────┐
  │           Customer Submits OTP & Token Verification         │
  ├─────────────────────────────────────────────────────────────┤
  │ 1. Cryptographic HMAC validation confirms authenticity      │
  │ 2. Issues HttpOnly Secure Session Cookie (`boost_session`)  │
  │ 3. Merges anonymous Guest Cart items with saved user cart   │
  └─────────────────────────────────────────────────────────────┘
```

---

## 🌟 Key Features

- **📱 Stateless Phone OTP**: Verify OTPs cryptographically using HMAC signatures without storing OTPs in Redis, memcached, or PostgreSQL.
- **🍪 Next.js App Router Native**: Pre-built `Set-Cookie` header generators with `HttpOnly`, `SameSite=lax`, and `Secure` flags.
- **🔄 Guest Cart Merge Engine**: Merges anonymous visitor cart items into customer accounts after login, automatically de-duplicating line items.
- **🛡️ Tamper-Proof Sessions**: High-performance JWT-like stateless sessions signed with HMAC-SHA256.
- **🪶 Zero Dependency Bloat**: No external crypto libraries, completely native Node.js.

---

## 📦 Installation

```bash
# npm
npm install @boostengine/auth

# pnpm
pnpm add @boostengine/auth

# yarn
yarn add @boostengine/auth
```

---

## 🚀 Quickstart Guide

### 1. Initialize Auth Manager (`lib/auth.ts`)

```typescript
import { BoostAuth } from '@boostengine/auth';

export const auth = new BoostAuth({
  secret: process.env.BOOST_AUTH_SECRET || 'a_very_long_random_secret_string_32_chars',
  sessionExpirySeconds: 30 * 24 * 60 * 60, // 30 days
  cookieName: 'boost_session',
});
```

*(Tip: Generate a production-ready secret with `npx @boostengine/auth generate-secret`)*

---

### 2. Send Phone OTP (`app/api/auth/send-otp/route.ts`)

```typescript
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  const { phone } = await req.json();

  // Generate OTP and stateless verification token
  const otpResult = auth.generateOTP({ phone, expirySeconds: 300 });

  // Send OTP via SMS or WhatsApp (e.g. using @boostengine/notifications)
  console.log(`[DEV] Send OTP ${otpResult.otp} to ${phone}`);

  // Return the stateless verification token to the client
  return NextResponse.json({
    success: true,
    verificationToken: otpResult.verificationToken,
  });
}
```

---

### 3. Verify OTP & Set Session Cookie (`app/api/auth/verify-otp/route.ts`)

```typescript
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  const { phone, otp, verificationToken } = await req.json();

  // Validate OTP cryptographically
  const verification = auth.verifyOTP({ phone, otp, verificationToken });
  if (!verification.success) {
    return NextResponse.json({ error: verification.error }, { status: 400 });
  }

  // Create session for authenticated customer
  const customer = { id: `cust_${Date.now()}`, phone, role: 'customer' as const };
  const session = auth.createSession(customer);

  const res = NextResponse.json({ success: true, customer });
  res.headers.set('Set-Cookie', session.cookie.headerString);
  return res;
}
```

---

### 4. Merging Guest Cart Upon Login

```typescript
const guestCart = [
  { productId: 'hoodie_01', variantId: 'L', quantity: 1, price: 1499 },
];

const savedUserCart = [
  { productId: 'hoodie_01', variantId: 'L', quantity: 1, price: 1499 },
  { productId: 'tee_02', variantId: 'M', quantity: 1, price: 499 },
];

// Automatically consolidates quantities and recalculates subtotals
const merged = auth.mergeGuestCart(guestCart, savedUserCart);

console.log(merged.mergedItems);
// hoodie_01 quantity is now 2!
// subtotal is now ₹3,497
```

---

## 🛠️ CLI Utilities

```bash
# Generate high entropy 256-bit secret key
npx @boostengine/auth generate-secret

# Run interactive terminal simulation
npx @boostengine/auth demo
```

---

## 📄 License

MIT © [Boost Engine](https://github.com/boostengine)
