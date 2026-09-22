# 🚚 @boostengine/shipping

> **Universal Multi-Carrier Logistics & Shipping Engine for Indian & Global eCommerce**  
> Supports **Shiprocket**, **Delhivery**, **Shadowfax**, **BlueDart**, **Xpressbees**, and **Ecom Express** with Indian Pincode Intelligence, RTO & COD Fraud Prevention, 3D Box Packaging Optimizer, Universal React / React Native Hooks, and AI Agent Toolkits.

[![npm version](https://img.shields.io/npm/v/@boostengine/shipping.svg?color=cb3837)](https://www.npmjs.com/package/@boostengine/shipping)
[![license](https://img.shields.io/npm/l/@boostengine/shipping.svg?color=blue)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6.svg)](https://www.typescriptlang.org/)
[![Framework Agnostic](https://img.shields.io/badge/Framework-Next.js%20%7C%20React%20%7C%20React%20Native%20%7C%20Vue%20%7C%20Node.js-success.svg)](#)

---

## ⚡ Key Superpowers

- 🇮🇳 **Indian Pincode Intelligence**: Instant offline city/state auto-fill & delivery tier resolution (`METRO`, `TIER_1`, `TIER_2`, `REMOTE`) with zero API latency.
- 🛡️ **RTO & COD Fraud Predictor**: Machine-logic scoring (0-100) to mitigate high COD cancellation and Return-to-Origin losses before dispatch.
- 📦 **Packaging & Volumetric Weight Optimizer**: Automatically calculates `(L * B * H) / 5000` vs dead weight and suggests the cheapest tamper-proof flyer or corrugated box.
- ⚡ **Smart Multi-Carrier Routing**: Automatically choose the **Cheapest** or **Fastest** courier across Shiprocket, Delhivery, and Shadowfax with auto-failover.
- 🛒 **@boostengine/cart Bridge**: Direct calculation of billable weights, shipping fees, and progressive "Add ₹X for Free Delivery!" banners.
- ⚛️ **Universal React & React Native Hooks**: Drop-in hooks (`usePincodeCheck`, `useShipmentTracker`, `useFreeShippingProgress`) for instant checkout and tracking UI.
- 🤖 **AI Agent Toolkit**: Pre-configured JSON schema tools for Google Gemini, OpenAI, Claude, LangChain, and Antigravity.

---

## 📦 Installation

```bash
npm install @boostengine/shipping
# or
yarn add @boostengine/shipping
# or
pnpm add @boostengine/shipping
```

---

## 🚀 Quick Start (Node.js / Express / Next.js Server)

```typescript
import { createShippingManager } from '@boostengine/shipping';

const shipping = createShippingManager({
  defaultCarrier: 'shiprocket',
  freeShippingRule: {
    minOrderAmount: 999, // Free shipping above ₹999
    defaultShippingFee: 60, // ₹60 standard shipping
  },
  carriers: {
    shiprocket: {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
      defaultPickupPincode: '110001',
    },
    delhivery: {
      apiToken: process.env.DELHIVERY_TOKEN,
      defaultPickupLocation: 'Main Warehouse',
    },
    shadowfax: {
      apiKey: process.env.SHADOWFAX_KEY,
    },
    bluedart: {
      loginId: process.env.BLUEDART_LOGIN_ID,
      licenceKey: process.env.BLUEDART_LICENCE_KEY,
      customerCode: process.env.BLUEDART_CUSTOMER_CODE,
    },
    xpressbees: {
      email: process.env.XPRESSBEES_EMAIL,
      password: process.env.XPRESSBEES_PASSWORD,
    },
    ecomexpress: {
      username: process.env.ECOMEXPRESS_USERNAME,
      password: process.env.ECOMEXPRESS_PASSWORD,
    },
  },
});

// 1. Instant Pincode Verification & Auto-fill
const pinResult = await shipping.checkPincode({ deliveryPincode: '560001', isCod: true });
console.log(pinResult);
// { isServiceable: true, isCodAvailable: true, city: 'Bengaluru', state: 'Karnataka', tier: 'METRO' }

// 2. Compare Rates Across Couriers
const rates = await shipping.compareRates({ deliveryPincode: '400050', weightKg: 1.2 });
console.log(rates);
// [ { courierName: 'Shadowfax Express', rate: 58 }, { courierName: 'Delhivery Surface', rate: 75 } ]

// 3. Smart Routing: Book with the Cheapest or Fastest Courier
const shipment = await shipping.routeShipment({
  orderId: 'ORDER_1001',
  customerAddress: {
    name: 'Rahul Sharma',
    phone: '9876543210',
    addressLine1: 'Flat 402, Lotus Heights',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
  },
  items: [{ name: 'Running Shoes', sku: 'SHOE-01', quantity: 1, price: 2499 }],
  dimensions: { weightKg: 1.1, lengthCm: 30, breadthCm: 20, heightCm: 12 },
  paymentMode: 'Prepaid',
  totalAmount: 2499,
}, 'CHEAPEST');

console.log(`Shipment Booked! AWB: ${shipment.awbNumber}`);
```

---

## 🛡️ RTO & COD Fraud Predictor

Mitigate costly Return-to-Origin delivery failures before handing parcels to couriers:

```typescript
import { RTORiskEngine } from '@boostengine/shipping';

const risk = RTORiskEngine.evaluateOrder({
  pincode: '841226',
  paymentMode: 'COD',
  totalAmount: 7500, // High-ticket COD order
  customerPhone: '9876543210',
  isPhoneVerified: false,
  addressText: 'Near temple',
});

console.log(risk);
/*
{
  riskScore: 75,
  riskLevel: 'HIGH',
  suggestedAction: 'REQUIRE_OTP_VERIFICATION',
  prepaidIncentiveAmount: 50, // Offer ₹50 discount for UPI payment!
  canSafelyAutoFulfill: false,
  riskReasons: [
    'Payment mode is Cash on Delivery (COD).',
    'High value COD order (₹7,500 > ₹6,000).',
    'Delivery location is Remote tier.',
    'Customer phone number has not completed OTP verification.',
    'Very short or vague shipping address.'
  ]
}
*/
```

---

## 📦 Packaging & Volumetric Weight Optimizer

Prevent volumetric weight penalties on lightweight, bulky parcels:

```typescript
import { PackagingOptimizer } from '@boostengine/shipping';

// 1. Billable Weight Comparison: (L * B * H) / 5000 vs Dead Weight
const billable = PackagingOptimizer.calculateBillableWeight(
  0.8, // 800g actual weight
  { lengthCm: 40, breadthCm: 30, heightCm: 20 } // Volumetric = 4.8 kg!
);
console.log(billable);
// { deadWeightKg: 0.8, volumetricWeightKg: 4.8, billableWeightKg: 4.8, billedOn: 'VOLUMETRIC_WEIGHT' }

// 2. Recommend Best Packaging Container
const suggestion = PackagingOptimizer.suggestContainer(0.4);
console.log(suggestion.suggestedContainer.name);
// "Standard Poly Flyer S (T-Shirt / Mobile Cover)"
```

---

## 🛒 Integration with `@boostengine/cart`

```typescript
import { cart } from '@boostengine/cart';
import { shipping } from './shipping';

// Directly calculate shipping rates and free delivery progress from your cart
const shippingSummary = await shipping.calculateCartShipping(cart, '560001');

console.log(`Shipping Fee: ₹${shippingSummary.shippingFee}`);
console.log(`Progress: ${shippingSummary.freeShippingProgressPercent}%`);
if (!shippingSummary.isFreeShipping) {
  console.log(`Add ₹${shippingSummary.amountNeededForFreeShipping} more for Free Delivery!`);
}
```

---

## ⚛️ React & React Native Hooks (`@boostengine/shipping/react`)

Compatible with Next.js (App Router / Pages), React (Vite/CRA), and React Native (Expo/Bare):

### 1. Pincode Validation & Instant City/State Auto-Fill

```tsx
import { usePincodeCheck } from '@boostengine/shipping/react';

function CheckoutAddressForm() {
  const [pincode, setPincode] = useState('');
  const { isValid, city, state, tier, isCodAvailable, estimatedDeliveryDateFormatted, isLoading } =
    usePincodeCheck(pincode);

  return (
    <div>
      <input
        type="text"
        placeholder="Enter 6-digit Pincode"
        value={pincode}
        onChange={(e) => setPincode(e.target.value)}
      />

      {isValid && (
        <div className="pincode-badge">
          <span>📍 {city}, {state} ({tier})</span>
          <span>🚚 Expected Delivery: {estimatedDeliveryDateFormatted}</span>
          <span>💵 COD: {isCodAvailable ? 'Available' : 'Prepaid Only'}</span>
        </div>
      )}
    </div>
  );
}
```

### 2. Free Delivery Marketing Banner

```tsx
import { useFreeShippingProgress } from '@boostengine/shipping/react';

function CartHeader({ cartSubtotal }: { cartSubtotal: number }) {
  const { isFreeShipping, progressPercent, amountNeeded, bannerText } =
    useFreeShippingProgress(cartSubtotal, 999);

  return (
    <div className="shipping-progress">
      <p>{bannerText}</p>
      <div className="progress-bar">
        <div style={{ width: `${progressPercent}%` }} />
      </div>
    </div>
  );
}
```

### 3. Real-Time Order Tracking

```tsx
import { useShipmentTracker } from '@boostengine/shipping/react';

function OrderTrackingScreen({ awbNumber }: { awbNumber: string }) {
  const { currentStatus, isDelivered, isOutForDelivery, data, isLoading, refresh } =
    useShipmentTracker(awbNumber, {
      fetcher: async (awb) => fetch(`/api/track?awb=${awb}`).then((r) => r.json()),
      autoPoll: true,
      pollIntervalMs: 30000,
    });

  return (
    <div>
      <h3>Status: {currentStatus}</h3>
      {isOutForDelivery && <p className="badge">🚴 Delivery associate is arriving today!</p>}
      {isDelivered && <p className="badge">✅ Package delivered successfully!</p>}
    </div>
  );
}
```

---

## 🤖 AI Agent Toolkit (`@boostengine/shipping/agent`)

Equip AI customer support bots (Google Gemini, OpenAI, Claude, LangChain) with live shipping functions:

```typescript
import { ShippingAgentToolkit } from '@boostengine/shipping/agent';

const agentToolkit = new ShippingAgentToolkit(shippingManager);

// 1. Get Function Calling Schemas for LLM
const tools = agentToolkit.getToolDefinitions();

// 2. Execute tool directly on LLM tool_call
const result = await agentToolkit.executeTool('checkPincodeServiceability', {
  pincode: '560001',
  isCod: true,
});

// 3. Simulate full parcel delivery lifecycle for offline testing
const simulation = agentToolkit.simulateTrackingLifecycle('AWB_TEST_99', 'OUT_FOR_DELIVERY');
```

---

## 📜 License

MIT © Boost Engine
