# @boostengine/server

> **Plug-and-Play Headless eCommerce API Router for Express & Node.js**  
> Mount all your eCommerce backend routes in **1 line of code**.

[![npm version](https://img.shields.io/npm/v/@boostengine/server)](https://www.npmjs.com/package/@boostengine/server)
[![license](https://img.shields.io/npm/l/@boostengine/server)](./LICENSE)

---

## What is this?

When building an eCommerce backend, you need dozens of API routes:
- Payment gateway (create order, verify, webhooks)
- Shipping (create shipment, track, pincode check)
- OTP authentication
- Cart management
- Coupon validation
- Returns & refunds
- GST Invoice generation
- WhatsApp/Email/SMS notifications

Writing all of this from scratch takes weeks. `@boostengine/server` gives you **all of these routes pre-built** and ready to mount in your Express app.

---

## Installation

```bash
npm install @boostengine/server express
```

---

## Quick Start (30 seconds)

```ts
import express from 'express';
import { createBoostApiRouter } from '@boostengine/server';

const app = express();
app.use(express.json());

// 1. Create the router with your credentials
const boostRouter = createBoostApiRouter({
  razorpayKeyId:     process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
  shiprocketEmail:   process.env.SHIPROCKET_EMAIL,
  shiprocketPassword: process.env.SHIPROCKET_PASSWORD,
  fast2smsApiKey:    process.env.FAST2SMS_API_KEY,
  gstNumber:         process.env.GST_NUMBER,
  businessName:      'My Awesome Store',
});

// 2. Mount it — that's it!
app.use('/api', boostRouter);

app.listen(3001, () => {
  console.log('BoostEngine API running on http://localhost:3001');
});
```

---

## Available API Routes

Once mounted at `/api`, you get these routes automatically:

### 💳 Payments (`/api/payments`)

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/payments/create-order` | Create Razorpay order |
| `POST` | `/api/payments/verify` | Verify payment signature |
| `POST` | `/api/payments/webhook` | Handle Razorpay webhooks |

### 🚚 Shipping (`/api/shipping`)

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/shipping/create-shipment` | Create Shiprocket shipment |
| `GET`  | `/api/shipping/track/:awb` | Track shipment by AWB |
| `POST` | `/api/shipping/check-pincode` | Check pincode serviceability |

### 🔐 Authentication (`/api/auth`)

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/auth/send-otp` | Send OTP via Fast2SMS |
| `POST` | `/api/auth/verify-otp` | Verify OTP |

### 🛒 Cart (`/api/cart`)

| Method | Route | Description |
|--------|-------|-------------|
| `GET`  | `/api/cart` | Get cart contents |
| `POST` | `/api/cart/add` | Add item to cart |
| `PUT`  | `/api/cart/update` | Update item quantity |
| `DELETE` | `/api/cart/remove/:itemId` | Remove specific item |
| `DELETE` | `/api/cart/clear` | Clear entire cart |

### 🏷️ Coupons (`/api/coupons`)

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/coupons/validate` | Validate a coupon code |
| `POST` | `/api/coupons/apply` | Apply coupon to cart |

### 🔄 Returns (`/api/returns`)

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/returns/initiate` | Initiate a return request |
| `GET`  | `/api/returns/status/:returnId` | Get return status |

### 🧾 Invoicing (`/api/invoicing`)

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/invoicing/generate` | Generate GST invoice PDF |

### 🔔 Notifications (`/api/notifications`)

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/notifications/whatsapp` | Send WhatsApp message |
| `POST` | `/api/notifications/email` | Send email notification |
| `POST` | `/api/notifications/sms` | Send SMS notification |

### ❤️ Health Check

| Method | Route | Description |
|--------|-------|-------------|
| `GET`  | `/api/health` | Check server status & active modules |

---

## Configuration

```ts
const boostRouter = createBoostApiRouter({
  // Payment Gateway (Razorpay)
  razorpayKeyId:      'rzp_live_XXXX',
  razorpayKeySecret:  'XXXX',

  // Logistics (Shiprocket)
  shiprocketEmail:    'you@store.com',
  shiprocketPassword: 'your_password',

  // OTP Auth (Fast2SMS)
  fast2smsApiKey:     'your_fast2sms_key',

  // GST Invoicing
  gstNumber:     '29ABCDE1234F1Z5',
  businessName:  'My Store Pvt. Ltd.',

  // Enable or disable specific modules
  enable: {
    payments:      true,
    shipping:      true,
    auth:          true,
    cart:          true,
    coupons:       true,
    returns:       true,
    invoicing:     true,
    notifications: false, // disable if not needed
  },

  // Add custom middleware (e.g., JWT auth check)
  middleware: [myAuthMiddleware],

  // Add a prefix to all routes
  prefix: '/v1',
});
```

---

## Disable Specific Modules

Only need payments and shipping? Disable the rest:

```ts
const boostRouter = createBoostApiRouter({
  razorpayKeyId:     process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
  enable: {
    payments:      true,
    shipping:      true,
    auth:          false,
    cart:          false,
    coupons:       false,
    returns:       false,
    invoicing:     false,
    notifications: false,
  },
});
```

---

## Add Authentication Middleware

Protect routes with your JWT or session middleware:

```ts
import jwt from 'jsonwebtoken';

function authGuard(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

const boostRouter = createBoostApiRouter({
  middleware: [authGuard],
  // ... other config
});
```

---

## Health Check

Test that your server is running:

```bash
curl http://localhost:3001/api/health
```

Response:
```json
{
  "success": true,
  "service": "@boostengine/server",
  "version": "1.0.0",
  "modules": {
    "payments": true,
    "shipping": true,
    "auth": true,
    "cart": true,
    "coupons": true,
    "returns": true,
    "invoicing": true,
    "notifications": true
  }
}
```

---

## Used with `create-boost-app`

If you scaffold a backend project with `create-boost-app --template backend-express`, `@boostengine/server` is already wired up for you:

```bash
npx create-boost-app my-api --template backend-express
cd my-api
npm install
npm run dev
```

---

## TypeScript Support

Full TypeScript support is built in:

```ts
import { createBoostApiRouter, BoostServerConfig, BoostMiddleware } from '@boostengine/server';

const config: BoostServerConfig = {
  razorpayKeyId: process.env.RAZORPAY_KEY_ID!,
  // ...
};
```

---

## License

MIT © [Boost Engine](https://github.com/boostengine)
