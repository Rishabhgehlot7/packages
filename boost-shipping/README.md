# @boostengine/shipping

> **Unified Multi-Carrier Logistics Engine** for Indian eCommerce. Connect **Shiprocket, Delhivery, Shadowfax, and BlueDart** with smart courier rate comparison, automatic AWB assignment, warehouse pickup scheduling, live tracking, and NDR automation.

---

## ⚡ Key Highlights

- 🚚 **Universal Shipping API**: Single method to check pincodes, compare freight rates, and generate AWBs across multiple carriers.
- 💰 **Cheapest Courier Auto-Selector**: Automatically compare live rates across Delhivery, Bluedart, Shadowfax and assign the lowest-cost courier!
- 📍 **Pincode & COD Validator**: Instant serviceability check and COD eligibility for 29,000+ Indian pincodes.
- 🏷️ **Shipping Labels & Manifests**: Download thermal barcode labels and driver handover manifests in 1-click.
- 📡 **Live Tracking**: Unified parcel tracking timeline across hubs.
- 🔄 **NDR Actions**: Automated non-delivery report workflows (Re-attempt delivery / Return to Origin).

---

## 📦 Installation

```bash
npm install @boostengine/shipping
```

---

## 🚀 Quickstart

### 1. Initialize ShippingManager

```typescript
import { createShippingManager } from '@boostengine/shipping';

export const shipping = createShippingManager({
  defaultCarrier: 'shiprocket',

  carriers: {
    shiprocket: {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
      defaultPickupPincode: '110001',
      defaultPickupLocation: 'Primary Warehouse',
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
// 1. Check if delivery & COD are available:
const check = await shipping.checkPincode({
  deliveryPincode: '400053',
  isCod: true,
  weightKg: 0.5,
});

console.log(check.isServiceable, check.isCodAvailable, check.estimatedDeliveryDays);

// 2. Compare live courier rates:
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

### 3. Book Shipment (With Cheapest Courier Auto-Selection)

```typescript
const shipment = await shipping.createShipmentWithCheapestCourier({
  orderId: 'ORD_1001',
  customerAddress: {
    name: 'Aman Sharma',
    phone: '9876543210',
    addressLine1: 'Flat 402, Skyline Residency',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400053',
  },
  items: [
    { name: 'Boost Heavy Hoodie', sku: 'HOODIE-BLK-L', quantity: 1, price: 1499 }
  ],
  dimensions: {
    weightKg: 0.5,
    lengthCm: 15,
    breadthCm: 10,
    heightCm: 5,
  },
  paymentMode: 'Prepaid',
  totalAmount: 1499,
});

console.log(`Shipment Booked! Carrier: ${shipment.courierName}, AWB: ${shipment.awbNumber}`);
```

---

### 4. Real-time Live Tracking

```typescript
const tracking = await shipping.track('109283719283');

console.log('Status:', tracking.currentStatus); // 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED'
console.log('Checkpoints:', tracking.events);
```

---

### 5. Take Action on Failed Deliveries (NDR)

```typescript
await shipping.actionNDR({
  awbNumber: '109283719283',
  action: 'REATTEMPT',
  nextAttemptDate: '2026-09-10',
  remarks: 'Customer was not home during first attempt, confirmed tomorrow morning',
});
```

---

## 🛠️ CLI Quickstart

```bash
# List supported logistics carriers
npx @boostengine/shipping list

# Generate .env.shipping.example
npx @boostengine/shipping init-env
```

---

## 📄 License
MIT © Boost Engine Team
