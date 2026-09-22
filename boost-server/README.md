# @boostengine/server

> **Universal Headless eCommerce API Router** — mount payment webhooks, cart,
> auth, shipping, coupons, returns, and invoicing endpoints in **1 line** across
> Express, Fastify, and Hono (Edge/Cloudflare Workers).

[![npm version](https://img.shields.io/npm/v/@boostengine/server)](https://www.npmjs.com/package/@boostengine/server)
[![license](https://img.shields.io/npm/l/@boostengine/server)](./LICENSE)

---

## Installation

```bash
npm install @boostengine/server express        # Express
npm install @boostengine/server fastify        # Fastify
npm install @boostengine/server hono           # Hono
```

> Express, Fastify, and Hono are optional peer dependencies — install only the
> framework you use.

---

## Quickstart — Express

```ts
import express from 'express';
import { createBoostRouter } from '@boostengine/server';

const app = express();
app.use(express.json());

app.use('/api', createBoostRouter({
  razorpayKeyId: process.env.RAZORPAY_KEY_ID,
  razorpayKeySecret: process.env.RAZORPAY_KEY_SECRET,
  gstNumber: process.env.GST_NUMBER,
  businessName: 'My Awesome Store',
}));

app.listen(3001, () => console.log('BoostEngine API on :3001'));
```

---

## Quickstart — Fastify

```ts
import Fastify from 'fastify';
import { boostFastifyPlugin } from '@boostengine/server/fastify';

const fastify = Fastify();
fastify.register(boostFastifyPlugin, { businessName: 'My Store' });
fastify.listen({ port: 3001 });
```

---

## Quickstart — Hono (Edge / Workers)

```ts
import { Hono } from 'hono';
import { boostHonoMiddleware } from '@boostengine/server/hono';

const app = new Hono();
boostHonoMiddleware(app, { businessName: 'My Store' });

export default app;
```

---

## Available Routes

| Group | Endpoints |
|-------|-----------|
| 💳 Payments | `POST /payments/create-order`, `/verify`, `/webhook` |
| 🚚 Shipping | `GET /shipping/pincode/:pincode`, `POST /shipping/check-pincode`, `POST /shipping/create-shipment`, `GET /shipping/track/:awb` |
| 🔐 Auth | `POST /auth/send-otp`, `/auth/verify-otp` |
| 🛒 Cart | `GET /cart`, `POST /cart/add`, `PUT /cart/update`, `DELETE /cart/remove/:itemId`, `DELETE /cart/clear` |
| 🏷️ Coupons | `POST /coupons/validate`, `/coupons/apply` |
| 🔄 Returns | `POST /returns/initiate`, `GET /returns/status/:returnId` |
| 🧾 Invoicing | `POST /invoicing/generate` |
| 📣 Notifications | `POST /notifications/whatsapp`, `/email`, `/sms` |
| ❤️ Health | `GET /health`, `GET /ping` |

Routes run in **mock mode** by default (`mockMode: true`) so you can develop
without live credentials.

---

## Webhook Setup & Signature Verification

`verifyWebhookSignature` validates webhooks from Razorpay, Cashfree, PhonePe,
Paytm, Stripe, and Shiprocket:

```ts
import express from 'express';
import { verifyWebhookSignature } from '@boostengine/server';

app.post('/webhooks/razorpay', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-razorpay-signature'] as string;
  const valid = verifyWebhookSignature('razorpay', req.body.toString(), signature, process.env.RAZORPAY_WEBHOOK_SECRET!);
  if (!valid) return res.status(400).json({ success: false, error: 'Invalid signature' });
  // process webhook...
  res.json({ success: true });
});
```

---

## Production Security Tips

1. **Verify every webhook** with `verifyWebhookSignature` — never trust the payload.
2. **Dedupe webhooks** with `createIdempotencyHandler()` (uses the `idempotency-key` header).
3. **Rate-limit public endpoints** with `createRateLimiter({ windowMs: 60_000, max: 100 })`.
4. **Standardize errors** by registering `app.use(errorHandler)` last.
5. **Never commit secrets** — inject credentials via environment variables.

---

## Configuration

```ts
createBoostRouter({
  razorpayKeyId: 'rzp_live_XXXX',
  razorpayKeySecret: 'XXXX',
  shiprocketEmail: 'you@store.com',
  shiprocketPassword: '****',
  fast2smsApiKey: 'XXXX',
  gstNumber: '29ABCDE1234F1Z5',
  businessName: 'My Store Pvt. Ltd.',
  enable: { payments: true, shipping: true, auth: true, cart: true, coupons: true, returns: true, invoicing: true, notifications: false },
  middleware: [authGuard],
  prefix: '/v1',
});
```

---

## AI Agent Toolkit

```ts
import { serverTools, toOpenAITools, getServerSystemPrompt } from '@boostengine/server/ai';

toOpenAITools(serverTools);    // OpenAI function-calling schema
getServerSystemPrompt();       // integration guide for coding agents
```

`serverTools`: `inspect_server_routes`, `generate_webhook_payload`,
`verify_webhook_signature_tool`, `generate_server_boilerplate`.

---

## License

MIT © [Boost Engine](https://github.com/boostengine)
