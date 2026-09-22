# @boostengine/communications 📡

[![npm version](https://img.shields.io/npm/v/@boostengine/communications.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/@boostengine/communications)
[![license](https://img.shields.io/npm/l/@boostengine/communications.svg?style=flat-square)](https://github.com/boostengine/boostengine/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Channels](https://img.shields.io/badge/Channels-WhatsApp%20%7C%20SMS%20%7C%20Telephony%20%7C%20AI%20Voice%20%7C%20RCS%20%7C%20Email-25d366.svg?style=flat-square)](https://github.com/boostengine/boostengine)
[![Frameworks](https://img.shields.io/badge/Frameworks-Next.js%20%7C%20React%20%7C%20React%20Native%20%7C%20Vite%20%7C%20Node-8a2be2.svg?style=flat-square)](https://nodejs.org/)
[![AI Ready](https://img.shields.io/badge/AI%20Agent-OpenAI%20%7C%20Claude%20%7C%20Gemini%20%7C%20Vercel%20AI-orange.svg?style=flat-square)](https://github.com/boostengine/boostengine)

> **Industry-King Unified CPaaS, Cloud Telephony & Omnichannel Communications Engine for Modern eCommerce & SaaS.**  
> Connects **WhatsApp, SMS, Cloud Telephony (MCUBE / Exotel / MyOperator), IVR Click-to-Call, Autonomous AI Voice Agents (Bolna AI), RCS, Email, and Smart OTP** under a single unified, developer-friendly API with **automatic multi-tier fallback (WhatsApp ➔ SMS ➔ Voice)**, built-in **anti-spam rate limiting**, **webhook signature verification**, **AI Agent Toolkits**, and **Universal React & React Native hooks**.

---

## 🇮🇳 & 🌎 Comprehensive Provider Matrix (41+ Adapters)

| Category / Channel | Supported Providers | Key Capabilities |
| :--- | :--- | :--- |
| **WhatsApp** | **Interakt**, **360dialog**, **Route Mobile**, **Infobip**, **Vonage**, **AiSensy**, **WATI**, **Meta Cloud API (v20.0)**, **Gupshup**, **Twilio** | Meta HSM templates, media headers (PDF/Images), interactive buttons, delivery tracking |
| **SMS** | **MSG91 (DLT Flow)**, **Fast2SMS**, **2Factor**, **Route Mobile**, **Infobip**, **Vonage**, **Twilio**, **Exotel** | India DLT Entity/Template ID validation, Transactional routes, Unicode / regional languages |
| **Cloud Telephony** | **MCUBE**, **MyOperator**, **Exotel**, **Ozonetel**, **Knowlarity**, **Tata Smartflo**, **Airtel IQ**, **Servetel / Acefone**, **Plivo** | Click-to-Call (Agent & Customer connect), Virtual Numbers, Call Recording, IVR |
| **AI Voice Agent** | **Bolna AI** | Autonomous Conversational AI Voice Agents that talk in Hindi/English to verify COD, confirm orders, or collect feedback |
| **Voice & Voice OTP** | **Exotel**, **MSG91 Voice OTP**, **Twilio Voice (TwiML)**, **Infobip TTS**, **Gupshup Voice**, **2Factor Voice OTP** | Automated text-to-speech voice OTP calls, IVR retry logic |
| **RCS** | **Gupshup RCS**, **Route Mobile RCS**, **Infobip RCS**, **Interakt RCS** | Verified Sender Rich Cards, suggestions, interactive carousels |
| **Email** | **Resend**, **SendGrid**, **SMTP Relay**, **AWS SES** | High-deliverability transactional HTML order receipts & invoices |
| **Smart OTP** | **Unified Multi-Tier Engine** | **Auto-Fallback (WhatsApp ➔ SMS ➔ Voice Call)** + Stateless HMAC-SHA256 Token Verification |

---

## 📦 Installation

```bash
# npm
npm install @boostengine/communications

# pnpm
pnpm add @boostengine/communications

# yarn
yarn add @boostengine/communications
```

---

## ⚡ Instant Zero-Config Quickstart

`comms` automatically detects configured credentials from `process.env`. Zero boilerplate required!

```typescript
import { comms } from '@boostengine/communications';

// 1. Order Confirmation (WhatsApp or SMS auto-routed)
await comms.sendOrderConfirmation({
  customerName: 'Rahul Sharma',
  phone: '+919876543210',
  orderId: 'BOOST-1001',
  amount: 1499,
  trackingUrl: 'https://booststore.in/track/1001',
});

// 2. Shipping & Live Tracking Update
await comms.sendShippingUpdate({
  customerName: 'Rahul',
  phone: '+919876543210',
  orderId: 'BOOST-1001',
  courierName: 'Bluedart',
  awbNumber: 'BLU8829104',
  trackingUrl: 'https://booststore.in/track/BLU8829104',
  expectedDelivery: 'Tomorrow by 5 PM',
});

// 3. Out for Delivery Alert
await comms.sendOutForDelivery({
  customerName: 'Rahul',
  phone: '+919876543210',
  orderId: 'BOOST-1001',
  riderName: 'Vikram',
  riderPhone: '+919123456780',
  trackingUrl: 'https://booststore.in/track/live',
});

// 4. Order Delivered & Review Request
await comms.sendOrderDelivered({
  customerName: 'Rahul',
  phone: '+919876543210',
  orderId: 'BOOST-1001',
  feedbackUrl: 'https://booststore.in/review/1001',
});

// 5. Abandoned Cart Recovery with Auto-Coupon
await comms.sendAbandonedCartAlert({
  customerName: 'Priya',
  phone: '+919876543211',
  cartUrl: 'https://booststore.in/cart/recover',
  discountCode: 'COMEBACK15',
  itemCount: 2,
});

// 6. COD Verification OTP (WhatsApp ➔ SMS ➔ Voice Call Auto-Fallback)
const otp = await comms.sendCODVerificationOTP({
  phone: '+919876543210',
  orderId: 'BOOST-1001',
  amount: 1499,
});
```

---

## ⚡ 1-Liner Convenience Methods

Send quick one-off messages without worrying about templates or configurations:

```typescript
import { comms } from '@boostengine/communications';

// Quick SMS
await comms.quickSMS('+919876543210', 'Your order is ready for pickup!');

// Quick WhatsApp
await comms.quickWhatsApp('+919876543210', 'order_status_template', { 1: 'Rahul', 2: 'ORD-101' });

// Quick Transactional Email
await comms.quickEmail('customer@example.com', 'Your Invoice', '<h1>Paid ₹1,499</h1>');

// Quick Text-to-Speech Voice Call
await comms.quickVoice('+919876543210', 'Your verification code is 5 8 2 1');
```

---

## 🛡️ Anti-Spam Rate Limiting & Deduplication

Prevent accidental double-messaging or spamming customers during network retries or batch jobs:

```typescript
import { createOmnichannelEngine } from '@boostengine/communications';

const engine = createOmnichannelEngine({
  deduplication: {
    enabled: true,
    windowMs: 60000,   // 1 minute window
    maxPerWindow: 3,   // Max 3 messages per phone number per window
  },
});
```

---

## 🔐 Webhook Verification & Next.js Route Handler

Support for Meta WhatsApp Webhooks, MSG91 DLR, Twilio, Resend, and Gupshup:

### Next.js App Router (`app/api/webhooks/comms/route.ts`)

```typescript
import { comms } from '@boostengine/communications';

// 1-line Next.js Route Handler (Supports GET verification challenge & POST events)
export const POST = comms.createNextWebhookHandler();
export const GET = comms.createNextWebhookHandler();
```

### Cryptographic Signature Check

```typescript
import { comms } from '@boostengine/communications';

const isValid = comms.verifyWebhookSignature({
  provider: 'meta', // 'meta' | 'twilio' | 'resend' | 'msg91'
  secret: process.env.META_WEBHOOK_SECRET!,
  payload: rawBodyString,
  headers: req.headers,
});
```

---

## 🤖 AI Agent Toolkit (`@boostengine/communications/agent`)

Turnkey agentic tools for **OpenAI Assistants**, **Anthropic Claude**, **Google Gemini**, and **Vercel AI SDK**:

```typescript
import { CommunicationsAgentToolkit } from '@boostengine/communications/agent';

const toolkit = new CommunicationsAgentToolkit();

// 1. OpenAI Function Calling Format
const openAITools = toolkit.getOpenAITools();

// 2. Anthropic Claude Tools Format
const claudeTools = toolkit.getAnthropicTools();

// 3. Google Gemini Function Declarations Format
const geminiTools = toolkit.getGeminiTools();

// 4. Vercel AI SDK Tools Format
const vercelTools = toolkit.getVercelAITools();

// 5. Autonomous Tool Execution
const result = await toolkit.execute('send_order_update', {
  stage: 'confirmed',
  customerName: 'Rahul',
  phone: '+919876543210',
  orderId: 'ORD-9021',
  amount: 2499,
});
```

### Supported AI Agent Tools
- `send_order_update` — Send order confirmation, shipping, out for delivery, or delivered alerts.
- `send_smart_otp` — Send cryptographic OTP with automatic WhatsApp ➔ SMS ➔ Voice failover.
- `verify_smart_otp` — Cryptographically verify customer OTP token.
- `send_cart_recovery` — High-conversion abandoned cart recovery notification with discount voucher.
- `send_customer_message` — Direct customer support message via WhatsApp/SMS/Email.
- `trigger_ai_voice_call` — Dispatch Bolna AI / autonomous voice agent call.
- `check_channel_health` — Query active communication channels and provider status.

---

## 📱 Universal React & React Native Hooks (`@boostengine/communications/react`)

Works in **Next.js (Client Components)**, **Vite**, **React SPA**, and **React Native / Expo**:

### 1. `useOTP()` Hook

```tsx
import React from 'react';
import { useOTP } from '@boostengine/communications/react';

export function PhoneLoginForm() {
  const {
    phone,
    setPhone,
    otp,
    setOtp,
    countdown,
    canResend,
    isSending,
    isVerifying,
    isVerified,
    error,
    sendOTP,
    verifyOTP,
    resendOTP,
  } = useOTP({ resendCooldownSeconds: 30 });

  if (isVerified) {
    return <div className="p-4 bg-green-100">🎉 Verified Successfully!</div>;
  }

  return (
    <div className="space-y-4 max-w-sm">
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="Enter Phone (+91...)"
      />
      <button onClick={() => sendOTP()} disabled={isSending}>
        {isSending ? 'Sending OTP...' : 'Send OTP'}
      </button>

      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="6-digit OTP"
      />
      <button onClick={() => verifyOTP()} disabled={isVerifying}>
        {isVerifying ? 'Verifying...' : 'Verify'}
      </button>

      {countdown > 0 ? (
        <p>Resend in {countdown}s</p>
      ) : (
        <button onClick={resendOTP} disabled={!canResend}>
          Resend OTP
        </button>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}
```

---

## 💻 Interactive Developer CLI (`boost-comms`)

Quickly test credentials, send test SMS, test WhatsApp templates, or verify OTPs right from the terminal:

```bash
# Check detected environment variables & active providers
npx boost-comms status

# Send a test SMS
npx boost-comms send-sms --to +919876543210 --msg "Hello from BoostEngine"

# Dispatch a test Smart OTP
npx boost-comms send-otp --to +919876543210

# Test Order Confirmation
npx boost-comms send-order --to +919876543210 --order ORD1001 --amount 1499 --name Rahul
```

---

## 📄 License

MIT © [Boost Engine](https://github.com/boostengine)
