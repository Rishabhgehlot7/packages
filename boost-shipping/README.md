# @boostengine/shipping 🚚

[![npm version](https://img.shields.io/npm/v/@boostengine/shipping.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/@boostengine/shipping)
[![npm downloads](https://img.shields.io/npm/dm/@boostengine/shipping.svg?style=flat-square&color=green)](https://www.npmjs.com/package/@boostengine/shipping)
[![license](https://img.shields.io/npm/l/@boostengine/shipping.svg?style=flat-square)](https://github.com/boostengine/boostengine/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Carriers](https://img.shields.io/badge/Carriers-Shiprocket%20%7C%20Delhivery%20%7C%20Shadowfax%20%7C%20BlueDart-orange.svg?style=flat-square)](https://npmjs.com/package/@boostengine/shipping)

> **Unified multi-carrier shipping and logistics orchestration for Indian eCommerce. Integrate Shiprocket, Delhivery, Shadowfax, and BlueDart through a single, clean API with real-time freight rate comparison, automatic cheapest courier selection, 1-click AWB generation, and live parcel tracking.**

Zero vendor lock-in. Works directly with standard Node.js runtime, Next.js, Express, and serverless edge functions.

---

## 📸 Logistics Flow & Live Tracking Timeline

```text
  Customer Places Order (Destination: 400053 Mumbai)
                       │
                       ▼
  ┌─────────────────────────────────────────────────────────────┐
  │                 Compare Live Freight Rates                  │
  ├─────────────────────────────────────────────────────────────┤
  │ 1. Shadowfax Express: ₹58 (Est. Delivery: 2 Days) ◄── [BEST]│
  │ 2. Delhivery Surface: ₹72 (Est. Delivery: 3 Days)           │
  │ 3. BlueDart Air:      ₹115 (Est. Delivery: 1 Day)           │
  └────────────────────────────┬────────────────────────────────┘
                               │
                               ▼
  ┌─────────────────────────────────────────────────────────────┐
  │              1-Click Shipment & AWB Generation              │
  ├─────────────────────────────────────────────────────────────┤
  │ AWB Assigned: SFX_982173912                                 │
  │ Shipping Label: PDF Thermal Barcode Ready                   │
  │ Pickup Scheduled: Warehouse Slot 2:00 PM                    │
  └────────────────────────────┬────────────────────────────────┘
                               │
                               ▼
  ┌─────────────────────────────────────────────────────────────┐
  │                 Live Parcel Tracking Timeline               │
  ├─────────────────────────────────────────────────────────────┤
  │ (●) [PICKED UP]       Package handed to courier driver      │
  │ (●) [IN TRANSIT]      Arrived at Gurgaon Sorting Hub        │
  │ (●) [REACHED HUB]     Arrived at Mumbai Kurla Hub           │
  │ (●) [OUT FOR DELIVERY]Rider: Rajesh Kumar (+91 98765 43210) │
  │ (○) [DELIVERED]       Pending OTP verification              │
  └─────────────────────────────────────────────────────────────┘
```

---

## 🌟 Key Highlights

- **⚡ Unified Carrier API**: Query rates, verify serviceability, and generate tracking details across carriers with identical function signatures.
- **💰 Cheapest Courier Auto-Selector**: Automatically fetches quotes across Delhivery, Bluedart, and Shadowfax, then assigns the most economical carrier.
- **📍 29,000+ Indian Pincode Validator**: Fast check for Cash on Delivery (COD) serviceability, prepaid coverage, and expected delivery days.
- **🏷️ Automated Label & Manifest**: Generate downloadable shipping labels with standard thermal barcode compliance.
- **🔄 NDR Workflows**: Streamlined API to respond to Non-Delivery Reports (e.g. reschedule delivery attempt or initiate RTO).

---

## 📦 Installation

```bash
# npm
npm install @boostengine/shipping

# pnpm
pnpm add @boostengine/shipping

# yarn
yarn add @boostengine/shipping
```

---

## 🚀 Quickstart Guide

### 1. Initialize Shipping Manager (`lib/shipping.ts`)

```typescript
import { createShippingManager } from '@boostengine/shipping';

export const shipping = createShippingManager({
  defaultCarrier: 'shiprocket',

  carriers: {
    shiprocket: {
      email: process.env.SHIPROCKET_EMAIL!,
      password: process.env.SHIPROCKET_PASSWORD!,
      defaultPickupPincode: '110001',
      defaultPickupLocation: 'Main Delhi Warehouse',
    },
    delhivery: {
      apiToken: process.env.DELHIVERY_API_TOKEN!,
      defaultPickupPincode: '110001',
    },
    shadowfax: {
      apiKey: process.env.SHADOWFAX_API_KEY!,
    },
  },
});
```

---

### 2. Check Pincode & Compare Rates

```typescript
// 1. Check if delivery is possible to pincode
const check = await shipping.checkPincode({
  deliveryPincode: '400053',
  isCod: true,
  weightKg: 0.5,
});

console.log('Serviceable:', check.isServiceable);
console.log('COD Available:', check.isCodAvailable);
console.log('Expected Days:', check.estimatedDeliveryDays);

// 2. Compare live courier rates
const rates = await shipping.compareRates({
  deliveryPincode: '400053',
  weightKg: 0.5,
  isCod: false,
});

console.log(rates);
/*
[
  { courierName: 'Shadowfax Express', rate: 58, estimatedDeliveryDays: 2 },
  { courierName: 'Delhivery Surface', rate: 72, estimatedDeliveryDays: 3 },
  { courierName: 'BlueDart Air', rate: 115, estimatedDeliveryDays: 1 }
]
*/
```

---

### 3. Book Shipment with Auto-Cheapest Courier

```typescript
const shipment = await shipping.createShipmentWithCheapestCourier({
  orderId: 'ORD_98124',
  customerAddress: {
    name: 'Pooja Verma',
    phone: '9876543210',
    addressLine1: 'Flat 302, Green Meadows',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400053',
  },
  items: [
    { name: 'Minimalist Oversized Tee', sku: 'TEE-BLK-M', quantity: 1, price: 999 }
  ],
  dimensions: {
    weightKg: 0.3,
    lengthCm: 10,
    breadthCm: 10,
    heightCm: 4,
  },
  paymentMode: 'Prepaid',
  totalAmount: 999,
});

console.log(`Shipment Booked! Carrier: ${shipment.courierName}, AWB: ${shipment.awbNumber}`);
```

---

### 4. Real-time Live Tracking

```typescript
const tracking = await shipping.track('SFX_982173912');

console.log('Status:', tracking.currentStatus); // 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED'
console.log('Events:', tracking.events);
```

---

## 🛠️ CLI Utilities

```bash
# List supported carriers
npx @boostengine/shipping list

# Generate .env.shipping template
npx @boostengine/shipping init-env
```

---

## 📄 License

MIT © [Boost Engine](https://github.com/boostengine)
