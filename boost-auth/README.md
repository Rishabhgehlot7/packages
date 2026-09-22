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

## ⚡ Native Synergy with BoostEngine Ecosystem

`@boostengine/auth` is designed to work seamlessly with our sister packages:

1. **[`@boostengine/communications`](https://www.npmjs.com/package/@boostengine/communications)**:
   * **Multi-Tier Smart OTP Fallback**: Automatically sends OTP on **WhatsApp ➔ SMS ➔ Voice Call**.
   * Works out of the box with `BoostCommunicationsProvider()`.
2. **[`@boostengine/ui`](https://www.npmjs.com/package/@boostengine/ui)**:
   * **Drop-in UI Suite**: Zero-config `<SignInCard />`, auto-focusing OTP boxes, and responsive modals.

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

### 3. Next.js 1-Line Route Protection (`middleware.ts`)

```typescript
import { createAuthMiddleware } from '@boostengine/auth';
import { auth } from '@/lib/auth';

export default createAuthMiddleware(auth, {
  protectedRoutes: ['/dashboard', '/account', '/checkout'],
  loginUrl: '/login',
  afterLoginUrl: '/dashboard', // Redirect already-authenticated users from /login
});

export const config = {
  matcher: ['/dashboard/:path*', '/account/:path*', '/checkout/:path*', '/login'],
};
```

---

### 4. Next.js Server Components & Server Actions (`page.tsx` / `actions.ts`)

Direct in-memory session fetch without external network calls:

```typescript
// app/dashboard/page.tsx (Server Component)
import { auth } from '@/lib/auth';

export default async function DashboardPage() {
  const session = await auth.getServerSession();

  return (
    <div>
      <h1>Welcome back, {session?.name || session?.phone}!</h1>
    </div>
  );
}
```

---

### 5. Node.js & Express (`server.ts`)

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

## 🔑 Email & Password Authentication

`@boostengine/auth` provides enterprise-grade, timing-attack resistant password hashing out-of-the-box using native Node.js `crypto.scrypt` (OWASP recommended, zero external `bcrypt` dependencies required!).

### 1. Server Configuration (`lib/auth.ts`)
```typescript
import { createBoostAuth, CredentialsProvider, hashPassword, verifyPassword } from '@boostengine/auth';

export const auth = createBoostAuth({
  secret: process.env.BOOST_AUTH_SECRET!,
  providers: [
    CredentialsProvider({
      name: 'Email & Password',
      authorize: async (credentials) => {
        // 1. Fetch user from your database
        const user = await db.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.passwordHash) return null;

        // 2. Timing-safe password verification
        const isValid = await verifyPassword(credentials.password, user.passwordHash);
        if (!isValid) return null;

        // 3. Return user profile (session created automatically)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role || 'customer',
        };
      },
    }),
  ],
});

// To hash password upon user registration / signup:
// const passwordHash = await hashPassword('plain-user-password');
```

### 2. Client-side Sign In
```typescript
import { authClient } from '@/lib/auth-client';

const handleLogin = async () => {
  try {
    const res = await authClient.signIn.emailPassword({
      email: 'user@example.com',
      password: 'plain-user-password',
    });
    console.log('Logged in user:', res.user);
  } catch (err) {
    alert('Invalid email or password');
  }
};
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

## 🛡️ Built-in OTP Rate Limiting (SMS Bombing Shield)

Protect your SMS bills against malicious bots and SMS bombing out of the box with zero external dependencies:

```typescript
export const auth = createBoostAuth({
  secret: process.env.BOOST_AUTH_SECRET!,
  rateLimit: {
    maxPerPhone: 3,          // Max 3 OTP requests
    windowSecondsPhone: 600, // per 10 minutes
    maxPerIp: 5,             // Max 5 OTP requests
    windowSecondsIp: 60,     // per 1 minute
  },
});
```

---

## 🍎 Sign in with Apple (iOS & App Store Compliant)

Required by Apple App Store guidelines for iOS & React Native mobile applications:

```typescript
import { AppleProvider } from '@boostengine/auth';

export const auth = createBoostAuth({
  secret: process.env.BOOST_AUTH_SECRET!,
  providers: [
    AppleProvider({
      clientId: 'com.yourcompany.app.web',
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
    }),
  ],
});
```

---

## ✉️ Email OTP & Passwordless Magic Links

Perfect for international customers and B2B users:

```typescript
import { EmailOtpProvider } from '@boostengine/auth';

export const auth = createBoostAuth({
  secret: process.env.BOOST_AUTH_SECRET!,
  providers: [
    EmailOtpProvider({
      sendEmail: async ({ email, otp, magicLink }) => {
        // Send using Resend, SendGrid, or @boostengine/communications
        console.log(`Email OTP to ${email}: ${otp}, Magic Link: ${magicLink}`);
      },
    }),
  ],
});
```

---

## 🔐 Two-Factor Authentication (TOTP / Google Authenticator)

RFC 6238 compliant 2FA with zero external dependencies:

```typescript
import { TOTPManager } from '@boostengine/auth';

// 1. Generate Base32 secret
const secret = TOTPManager.generateSecret();

// 2. Build QR Code URI for Google Authenticator / Authy
const uri = TOTPManager.generateOtpAuthUri({
  secret,
  accountName: 'user@example.com',
  issuer: 'BoostStore',
});

// 3. Verify 6-digit user input
const isValid = TOTPManager.verifyToken(userInputCode, secret);
```

---

## 🏢 Multi-Tenant Organizations & Teams (B2B SaaS)

Easily build workspaces and team roles:

```typescript
// Create organization (creator automatically becomes 'owner')
const { organization, membership } = await auth.organizations.create({
  name: 'Acme Corp',
  userId: 'usr_123',
});

// Add member with specific role
await auth.organizations.addMember({
  organizationId: organization.id,
  userId: 'usr_456',
  role: 'admin', // 'owner' | 'admin' | 'member'
});

// List user's workspaces
const userOrgs = await auth.organizations.listUserOrganizations('usr_123');
```

---

## 🛠️ CLI Utilities & 30-Second Setup Wizard

```bash
# 🚀 Interactive Project Setup Wizard (Scaffolds lib/auth.ts, route.ts, and .env)
npx @boostengine/auth init

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

## 📱 React Native & Expo Mobile Apps

Use `createReactNativeStorage` with `@react-native-async-storage/async-storage` or `expo-secure-store` to persist sessions securely on iOS and Android:

```typescript
import { createAuthClient, createReactNativeStorage } from '@boostengine/auth/client';
import * as SecureStore from 'expo-secure-store';

export const authClient = createAuthClient({
  baseURL: 'https://your-api.com/api/auth',
  storage: createReactNativeStorage(SecureStore),
});

// React Native Login Flow:
const handleOtpLogin = async (phone: string, otp: string, token: string) => {
  const session = await authClient.verifyOtp({ phone, otp, verificationToken: token });
  console.log('Mobile user logged in:', session.user);
};
```

---

## 🤖 AI Agent Toolkit (`@boostengine/auth/agent`)

Equip AI customer service agents (Google Gemini, OpenAI, Claude, LangChain, Antigravity) with native authentication and permission verification tools:

```typescript
import { AuthAgentToolkit } from '@boostengine/auth/agent';
import { auth } from '@/lib/auth';

const agentToolkit = new AuthAgentToolkit(auth);

// 1. Get Function Calling Schemas for LLM
const tools = agentToolkit.getToolDefinitions();

// 2. Directly execute tool upon LLM function call
const result = await agentToolkit.executeTool('verifySessionToken', {
  token: 'jwt_session_token_here',
});

// 3. Verify user permissions dynamically in agent workflows
const permission = await agentToolkit.executeTool('checkUserPermission', {
  token: 'jwt_session_token_here',
  requiredRole: 'admin',
});
```

---

## 📄 License

MIT © Boost Engine
