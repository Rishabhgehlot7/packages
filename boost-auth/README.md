# @boostengine/auth 🚀

> **Frictionless Phone OTP, Stateless Sessions & Guest-to-Customer Merge Engine for Modern eCommerce & Next.js.**

Zero external dependencies (uses native Node `crypto`), blazing fast, and designed specifically for high-converting Indian & global D2C checkout flows.

---

## 🌟 Key Features

- **📱 Frictionless Phone OTP**: Generate numeric OTPs with cryptographically secure stateless HMAC tokens. **No Redis or database needed** to verify OTPs!
- **🍪 Next.js App Router Native**: Complete `Set-Cookie` header generators with `HttpOnly`, `Secure`, and `SameSite` flags.
- **🔄 Guest Cart Merge Engine**: Automatically merge guest cart items into authenticated customer accounts on login with quantity de-duplication.
- **🛡️ Stateless JWT Sessions**: Zero-database auth tokens signed with HMAC-SHA256 with expiry and tamper verification.
- **⚡ Zero Dependency**: Built exclusively with native Node.js standard library.

---

## 📦 Installation

```bash
npm install @boostengine/auth
```

---

## 🚀 Quickstart

### 1. Initialize Auth Manager

```typescript
import { BoostAuth } from '@boostengine/auth';

export const auth = new BoostAuth({
  secret: process.env.BOOST_AUTH_SECRET!, // min 16 characters
  sessionExpirySeconds: 30 * 24 * 60 * 60, // 30 days
  cookieName: 'boost_session',
});
```

*(Tip: Generate a high-entropy secret by running `npx @boostengine/auth generate-secret`)*

---

### 2. Passwordless Phone Login Flow

#### Step A: Send OTP (API Route)
```typescript
// app/api/auth/send-otp/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { notifications } from '@/lib/notifications'; // @boostengine/notifications

export async function POST(req: Request) {
  const { phone } = await req.json();

  const otpRes = auth.generateOTP({ phone, expirySeconds: 300 });

  // Send via WhatsApp or SMS in 1 line
  await notifications.send({
    channel: 'whatsapp',
    recipient: phone,
    content: `Your verification code is ${otpRes.otp}. Valid for 5 minutes.`,
  });

  // Return the stateless verificationToken back to the client
  return NextResponse.json({
    success: true,
    verificationToken: otpRes.verificationToken,
  });
}
```

#### Step B: Verify OTP & Issue Session Cookie (API Route)
```typescript
// app/api/auth/verify-otp/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  const { phone, otp, verificationToken } = await req.json();

  const verify = auth.verifyOTP({ phone, otp, verificationToken });
  if (!verify.success) {
    return NextResponse.json({ error: verify.error }, { status: 400 });
  }

  // Fetch or upsert user from your DB
  const user = { id: 'usr_123', phone, role: 'customer' as const };

  // Issue session token & cookie
  const session = auth.createSession(user);

  const response = NextResponse.json({ success: true, user });
  response.headers.set('Set-Cookie', session.cookie.headerString);
  return response;
}
```

---

### 3. Merging Guest Cart on Login

When a guest user logs in during checkout, easily merge their browser cart with their saved database cart:

```typescript
const guestCart = [
  { productId: 'prod_hoodie', variantId: 'L', quantity: 1, price: 1499 },
];

const userDbCart = [
  { productId: 'prod_hoodie', variantId: 'L', quantity: 1, price: 1499 },
  { productId: 'prod_tshirt', variantId: 'M', quantity: 2, price: 499 },
];

const mergeResult = auth.mergeGuestCart(guestCart, userDbCart);

console.log(mergeResult.mergedItems);
// prod_hoodie quantity is now 2!
// subtotal: Rs 3,996
```

---

## 🛠️ CLI Utilities

```bash
# Generate high entropy random secret
npx @boostengine/auth generate-secret

# Run interactive demo simulation
npx @boostengine/auth demo
```

---

## 📄 License

MIT © [Boost Engine](https://github.com/boostengine)
