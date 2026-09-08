# @boostengine/inventory 📦

> **Real-Time Stock Urgency, Multi-Warehouse Fulfillment Allocation, Variant Inventory Tracking & Reservation Engine for Modern eCommerce.**

Zero external dependencies, built to generate purchase FOMO and eliminate checkout overselling.

---

## 🌟 Key Features

- **🔥 High-Converting Low Stock Urgency**: Dynamic marketing copy based on real-time stock levels (*"⚡ Almost Gone! Only 2 left in stock!"*).
- **⏱️ Checkout Stock Reservation**: Temporarily reserve items for 15 minutes during checkout; automatically release if payment fails or order abandons.
- **🏭 Multi-Warehouse Fulfillment**: Smart warehouse allocator selecting the hub with complete inventory closest to customer pincode.
- **🛡️ Oversell Prevention**: Safe decrement and increment APIs.

---

## 📦 Installation

```bash
npm install @boostengine/inventory
```

---

## 🚀 Quickstart

```typescript
import { createBoostInventory } from '@boostengine/inventory';

const inventory = createBoostInventory([
  { sku: 'HD-BLK-L', productId: 'hoodie', quantity: 2, lowStockThreshold: 5 },
]);

// 1. Get Live Low Stock Urgency
const urgency = inventory.getUrgency('HD-BLK-L');
console.log(urgency.badgeText); // "⚡ Almost Gone! Only 2 left in stock!"
console.log(urgency.isLowStock); // true

// 2. Reserve Stock During Checkout
const reservation = inventory.reserveStock([
  { sku: 'HD-BLK-L', quantity: 1 }
], 900); // 15 mins hold

if (reservation.success) {
  // Proceed to payment gateway...
  // Once payment succeeds:
  inventory.confirmDeduction(reservation.reservationId!);
}
```

---

## 🛠️ CLI Utilities

```bash
# Run interactive inventory demo
npx @boostengine/inventory demo
```

---

## 📄 License

MIT © [Boost Engine](https://github.com/boostengine)
