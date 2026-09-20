# @boostengine/auth 🔐

[![npm version](https://img.shields.io/npm/v/@boostengine/auth.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/@boostengine/auth)
[![license](https://img.shields.io/npm/l/@boostengine/auth.svg?style=flat-square)](https://github.com/Rishabhgehlot7/packages/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Universal](https://img.shields.io/badge/Platforms-Next.js%20%7C%20React%20Native%20%7C%20Express%20%7C%20NestJS-success.svg?style=flat-square)](https://nodejs.org/)
[![Stateless](https://img.shields.io/badge/Architecture-100%25%20Stateless%20%2B%20Optional%20DB-blueviolet.svg?style=flat-square)](https://nodejs.org/)

> **The Universal, Zero-Dependency Authentication Engine for Next.js, React Native (Expo), Node.js, Express, and NestJS.**
> Supporting Frictionless Phone OTP, Google/GitHub OAuth, Pluggable DB Adapters (Prisma, Drizzle, MongoDB), and Guest-to-Customer Cart Merging.

---

## ⚡ Why @boostengine/auth?

| Feature | Next-Auth (Auth.js) | Clerk | Supabase Auth | **@boostengine/auth** |
| :--- | :---: | :---: | :---: | :---: |
| **Next.js App Router** | ✅ | ✅ | ✅ | **✅ (1-Line Handler)** |
| **React Native (Expo)** | ❌ (Extremely Hard) | ✅ (Paid) | ⚠️ (Vendor Locked) | **✅ (First-Class Native Client)** |
| **Express / Fastify / Node** | ❌ | ⚠️ | ⚠️ | **✅ (Built-in Middleware)** |
| **Phone OTP (Zero-Redis)** | ❌ | ⚠️ | ⚠️ | **✅ (Stateless HMAC Engine)** |
| **Zero External Dependencies** | ❌ (Many deps) | ❌ | ❌ | **✅ (Pure Node.js `crypto`)** |
| **Database Freedom** | Prisma / Drizzle | Hosted Only | Postgres Only | **Stateless OR Prisma/Drizzle/Mongo** |
| **eCommerce Cart Merging** | ❌ | ❌ | ❌ | **✅ Built-in Guest Merger** |
| **Pricing** | Free | Expensive at scale | Tiered | **100% Free & Open Source (MIT)** |

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

*(Tip: Generate a production-ready secret with `npx @boostengine/auth generate-secret`)*

---

## 🚀 1-Minute Quickstart

### 1. Configure Auth Instance (`lib/auth.ts`)

```typescript
import { createBoostAuth, GoogleProvider, GitHubProvider } from '@boostengine/auth';
// Optional: import { prismaAdapter } from '@boostengine/auth/adapters';

export const auth = createBoostAuth({
  secret: process.env.BOOST_AUTH_SECRET || 'your-super-secret-key-min-32-chars-long',
  // adapter: prismaAdapter(prisma), // Optional! Omit for 100% Stateless Zero-DB mode
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
});
```

---

### 2. Next.js App Router (`app/api/auth/[...boost]/route.ts`)

```typescript
import { toNextJsHandler } from '@boostengine/auth';
import { auth } from '@/lib/auth';

// Handles all OTP, OAuth, Sessions, and SignOut requests automatically!
export const { GET, POST } = toNextJsHandler(auth);
```

---

### 3. Node.js & Express (`server.ts`)

```typescript
import express from 'express';
import { toNodeHandler } from '@boostengine/auth';
import { auth } from './auth';

const app = express();
app.use(express.json());

// Mount universal auth router
app.use('/api/auth', toNodeHandler(auth));

app.listen(3000, () => console.log('Auth server running on :3000'));
```

---

## 📱 Universal Frontend & React Native (Expo)

### Initialize Universal Client (`lib/auth-client.ts`)

```typescript
import { createAuthClient } from '@boostengine/auth/client';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3000/api/auth',
});
```

#### For React Native (Expo) with Secure Storage:
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAuthClient } from '@boostengine/auth/client';

export const authClient = createAuthClient({
  baseURL: 'https://api.yourdomain.com/api/auth',
  storage: {
    getItem: (key) => AsyncStorage.getItem(key),
    setItem: (key, val) => AsyncStorage.setItem(key, val),
    removeItem: (key) => AsyncStorage.removeItem(key),
  },
});
```

---

### React Component Usage

```tsx
'use client';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';

export function LoginCard() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [token, setToken] = useState('');

  // 1. Send OTP
  const handleSendOtp = async () => {
    const res = await authClient.signIn.phone({ phone });
    setToken(res.verificationToken);
    alert('OTP sent to ' + phone);
  };

  // 2. Verify OTP & Create Session Cookie
  const handleVerifyOtp = async () => {
    await authClient.verifyOtp({ phone, otp, verificationToken: token });
    alert('Logged in successfully!');
  };

  return (
    <div className="auth-card">
      {/* Phone OTP */}
      <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 9876543210" />
      <button onClick={handleSendOtp}>Send OTP</button>

      <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit OTP" />
      <button onClick={handleVerifyOtp}>Verify OTP</button>

      <hr />

      {/* 1-Click Social OAuth */}
      <button onClick={() => authClient.signIn.social({ provider: 'google' })}>
        Sign In with Google
      </button>
      <button onClick={() => authClient.signIn.social({ provider: 'github' })}>
        Sign In with GitHub
      </button>
    </div>
  );
}
```

---

## 🗄️ Database Adapters

Choose any database, or run completely **Stateless (Zero DB)**:

### 1. Prisma Adapter
```typescript
import { prismaAdapter } from '@boostengine/auth/adapters';
import { prisma } from './prisma';

export const auth = createBoostAuth({
  secret: process.env.BOOST_AUTH_SECRET!,
  adapter: prismaAdapter(prisma),
});
```
*(Run `npx @boostengine/auth schema prisma` to get the ready-made `schema.prisma` snippet!)*

### 2. MongoDB / Mongoose Adapter
```typescript
import { mongodbAdapter } from '@boostengine/auth/adapters';
import { db } from './mongodb';

export const auth = createBoostAuth({
  secret: process.env.BOOST_AUTH_SECRET!,
  adapter: mongodbAdapter(db),
});
```

### 3. Drizzle ORM Adapter
```typescript
import { drizzleAdapter } from '@boostengine/auth/adapters';
import { eq, and } from 'drizzle-orm';
import { db } from './db';
import * as schema from './schema';

export const auth = createBoostAuth({
  secret: process.env.BOOST_AUTH_SECRET!,
  adapter: drizzleAdapter(db, schema, { eq, and }),
});
```
*(Run `npx @boostengine/auth schema drizzle` to get the starter schema!)*

---

## 🛒 eCommerce Guest Cart Merger

When an anonymous user adds products to cart and then logs in via OTP or OAuth, automatically merge their cart:

```typescript
const mergedCart = auth.mergeGuestCart(guestCartItems, customerSavedCartItems);

console.log(mergedCart.mergedItems);        // Deduplicated and quantities merged
console.log(mergedCart.conflictsResolved);  // Number of duplicate lines combined
console.log(mergedCart.subtotal);           // Recalculated total
```

Or call via client SDK:
```typescript
const merged = await authClient.guestCart.merge(localCartItems, userCartItems);
```

---

## 🛠️ CLI Utilities

```bash
# Generate high-entropy 256-bit secret for .env
npx @boostengine/auth generate-secret

# Print starter Prisma schema
npx @boostengine/auth schema prisma

# Print starter Drizzle schema
npx @boostengine/auth schema drizzle

# Run interactive demo simulation
npx @boostengine/auth demo
```

---

## 🤖 AI-Agent Ready (Cursor / Claude / Copilot)

This package contains an `llms.txt` file at the root. AI assistants automatically understand all exports, schemas, and framework adapters without hallucination.

---

## 📄 License

MIT © [Rishabh Gehlot](https://github.com/Rishabhgehlot7)
