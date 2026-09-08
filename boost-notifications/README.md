# @boostengine/notifications

> **Unified Multi-Channel eCommerce Messaging Engine** for WhatsApp, SMS, and Email. Pre-built, high-converting templates for **Order Confirmation, Live Tracking, WhatsApp Abandoned Cart Recovery, and COD OTPs**.

---

## ⚡ Key Highlights

- 📲 **WhatsApp Business API**: Built-in support for Interakt, Wati, Gupshup, and Meta Cloud API.
- 💬 **DLT-Compliant SMS**: Fast2SMS, Msg91, and Twilio for India transactional OTPs.
- 📧 **Transactional Emails**: Resend and SendGrid for HTML order confirmations and invoices.
- 🛒 **Pre-Built eCommerce Triggers**:
  - `sendOrderConfirmation(...)`
  - `sendShippingUpdate(...)`
  - `sendAbandonedCartRecovery(...)`
  - `sendCODVerificationOTP(...)`

---

## 📦 Installation

```bash
npm install @boostengine/notifications
```

---

## 🚀 Quickstart

### 1. Initialize NotificationManager

```typescript
import { createNotificationManager } from '@boostengine/notifications';

export const notifications = createNotificationManager({
  defaultChannel: 'whatsapp',

  whatsapp: {
    provider: 'interakt',
    apiKey: process.env.INTERAKT_API_KEY!,
  },
  sms: {
    provider: 'fast2sms',
    apiKey: process.env.FAST2SMS_API_KEY!,
    senderId: 'BOOST',
  },
  email: {
    provider: 'resend',
    apiKey: process.env.RESEND_API_KEY!,
    fromEmail: 'orders@yourstore.com',
  },
});
```

---

### 2. Send Order Confirmation (WhatsApp + Email)

```typescript
await notifications.sendOrderConfirmation({
  customer: {
    name: 'Aman Sharma',
    phone: '9876543210',
    email: 'aman@example.com',
  },
  orderId: 'ORD_1001',
  amount: 1499.00,
  itemsSummary: '1x Heavy Black Hoodie (L)',
  invoiceUrl: 'https://yourstore.com/invoices/1001.pdf',
});
```

---

### 3. Send Shipping Update with Live Tracking Link

```typescript
await notifications.sendShippingUpdate({
  customer: {
    name: 'Aman Sharma',
    phone: '9876543210',
  },
  orderId: 'ORD_1001',
  courierName: 'Delhivery Surface',
  awbNumber: '109283719283',
  trackingUrl: 'https://yourstore.com/track/109283719283',
});
```

---

### 4. High-Converting WhatsApp Abandoned Cart Recovery

```typescript
await notifications.sendAbandonedCartRecovery({
  customer: {
    name: 'Aman Sharma',
    phone: '9876543210',
  },
  orderId: 'CART_982',
  amount: 1499.00,
  discountCode: 'FLASH10',
  cartUrl: 'https://yourstore.com/cart?recover=CART_982',
});
```

---

## 🛠️ CLI Quickstart

```bash
# List supported channels
npx @boostengine/notifications list

# Generate .env.notifications.example template
npx @boostengine/notifications init-env
```

---

## 📄 License
MIT © Boost Engine Team
