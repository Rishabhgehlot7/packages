# @boostengine/notifications 🔔

[![npm version](https://img.shields.io/npm/v/@boostengine/notifications.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/@boostengine/notifications)
[![npm downloads](https://img.shields.io/npm/dm/@boostengine/notifications.svg?style=flat-square&color=green)](https://www.npmjs.com/package/@boostengine/notifications)
[![license](https://img.shields.io/npm/l/@boostengine/notifications.svg?style=flat-square)](https://github.com/boostengine/boostengine/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Channels](https://img.shields.io/badge/Channels-WhatsApp%20%7C%20SMS%20%7C%20Email-25d366.svg?style=flat-square)](https://github.com/boostengine/boostengine)

> **Unified multi-channel transactional messaging engine (WhatsApp, SMS, Email) for eCommerce. Connects Interakt, Wati, Gupshup, MSG91, and Resend with pre-built transactional templates for Order Confirmation, Live Tracking, Abandoned Cart Recovery, and COD OTP.**

---

## 📸 WhatsApp Transactional Order Alert Preview

```text
  WhatsApp Incoming Message (+91 98765 43210)
  ═════════════════════════════════════════════════════════════
  🛍️ BoostStore — Order Confirmed!
  
  Hi Rahul,
  Your order #BOOST-1001 (₹1,499) has been confirmed!
  
  📦 Items: Cyberpunk Heavy Hoodie (Size: L)
  🚚 Delivery Destination: Mumbai, Maharashtra
  
  [ Track Live Shipment 📍 ]     [ WhatsApp Support 💬 ]
  ═════════════════════════════════════════════════════════════
```

---

## 🌟 Key Highlights

- **💬 WhatsApp Business Automation**: Native integrations for Interakt, WATI, and Gupshup with pre-approved Meta HSM template variables.
- **📱 Indian High-Delivery SMS**: Direct fallback to MSG91 with DLT template ID verification for OTPs and delivery alerts.
- **📧 Transactional Email**: Modern HTML transactional receipts using Resend or custom SMTP.
- **🛡️ Channel Fallback Engine**: If WhatsApp message fails to deliver, automatically falls back to transactional SMS within seconds.

---

## 📦 Installation

```bash
# npm
npm install @boostengine/notifications

# pnpm
pnpm add @boostengine/notifications

# yarn
yarn add @boostengine/notifications
```

---

## 🚀 Quickstart Guide

```typescript
import { createNotificationManager } from '@boostengine/notifications';

// 1. Initialize Notification Manager
export const notifications = createNotificationManager({
  defaultChannel: 'whatsapp',
  providers: {
    whatsapp: {
      provider: 'interakt',
      apiKey: process.env.INTERAKT_API_KEY!,
    },
    sms: {
      provider: 'msg91',
      authKey: process.env.MSG91_AUTH_KEY!,
      senderId: 'BOOSTS',
    },
    email: {
      provider: 'resend',
      apiKey: process.env.RESEND_API_KEY!,
      from: 'orders@booststore.in',
    },
  },
});

// 2. Send an Order Confirmation Alert
await notifications.sendOrderConfirmation({
  channel: 'whatsapp',
  recipient: '+919876543210',
  orderNumber: 'BOOST-1001',
  customerName: 'Rahul Sharma',
  totalAmount: 1499,
  trackingUrl: 'https://booststore.in/orders/track/BOOST-1001',
});
```

---

## 📄 License

MIT © [Boost Engine](https://github.com/boostengine)
