# @boostengine/inventory 📦

[![npm version](https://img.shields.io/npm/v/@boostengine/inventory.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/@boostengine/inventory)
[![npm downloads](https://img.shields.io/npm/dm/@boostengine/inventory.svg?style=flat-square&color=green)](https://www.npmjs.com/package/@boostengine/inventory)
[![license](https://img.shields.io/npm/l/@boostengine/inventory.svg?style=flat-square)](https://github.com/boostengine/boostengine/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Stock Urgency](https://img.shields.io/badge/Conversion-Low%20Stock%20Urgency%20Engine-red.svg?style=flat-square)](https://github.com/boostengine/boostengine)

> **Real-time stock reservation, multi-warehouse fulfillment allocation, variant matrix inventory tracking, and low-stock urgency badges for eCommerce.**

Zero database locks. Features atomic time-based stock reservations (e.g. 15-minute checkout holds) to prevent overselling flash-sale inventory.

---

## 📸 Multi-Warehouse Allocation & Stock Urgency Flow

```text
  Customer at Checkout (Product: Cyber Hoodie - L | Destination: Mumbai 400053)
                                      │
                                      ▼
  ┌─────────────────────────────────────────────────────────────────────────┐
  │                 Multi-Warehouse Proximity Allocation                    │
  ├─────────────────────────────────────────────────────────────────────────┤
  │ • Warehouse A (Bhiwandi / Mumbai Hub)  ──► Available: 4 Units ◄── [BEST]│
  │ • Warehouse B (Delhi NCR Hub)          ──► Available: 50 Units          │
  │ • Warehouse C (Bengaluru Hub)          ──► Available: 0 Units (Sold Out)│
  └───────────────────────────────────┬─────────────────────────────────────┘
                                      │
                                      ▼
  ┌─────────────────────────────────────────────────────────────────────────┐
  │                 Atomic Stock Reservation (15-Minute Hold)               │
  ├─────────────────────────────────────────────────────────────────────────┤
  │ 1. Temporarily holds 1 unit from Bhiwandi Hub                           │
  │ 2. Prevents race-condition overselling during flash sales               │
  │ 3. Returns Conversion Urgency Copy:                                     │
  │    🔥 "Hurry! Only 3 left in stock — 24 people viewing this right now"  │
  └─────────────────────────────────────────────────────────────────────────┘
```

---

## 🌟 Key Highlights

- **⏱️ Atomic Stock Reservation**: Hold inventory during the checkout process for a configurable window (e.g. 10 or 15 minutes). Automatically releases hold if customer abandons payment.
- **🏢 Multi-Warehouse Fulfillment Allocation**: Routes item shipments to the nearest warehouse with available stock, minimizing logistics transit times.
- **🔥 Conversion Urgency Engine**: Generates real-time urgency cues (*"Only 2 left"*, *"Back in stock soon"*) to increase add-to-cart rates.
- **🔢 Variant Matrix Tracking**: Manage SKUs across complex option combinations (e.g. Size `S / M / L` × Color `Black / White / Olive`).

---

## 📦 Installation

```bash
# npm
npm install @boostengine/inventory

# pnpm
pnpm add @boostengine/inventory

# yarn
yarn add @boostengine/inventory
```

---

## 🚀 Quickstart Guide

```typescript
import { InventoryManager } from '@boostengine/inventory';

// 1. Initialize Inventory Manager
const inventory = new InventoryManager({
  warehouses: [
    { id: 'wh_mumbai', name: 'Bhiwandi Hub', state: 'Maharashtra', priority: 1 },
    { id: 'wh_delhi', name: 'Gurgaon Hub', state: 'Haryana', priority: 2 },
  ],
  reservationExpirySeconds: 900, // 15-minute checkout hold
});

// 2. Set stock levels per warehouse
inventory.setStock('HOODIE-BLK-L', {
  wh_mumbai: 4,
  wh_delhi: 25,
});

// 3. Check availability & get urgency badges
const stockStatus = inventory.getStockStatus('HOODIE-BLK-L');

console.log(stockStatus.totalAvailable); // 29
console.log(stockStatus.urgencyLevel);   // "HIGH_URGENCY"
console.log(stockStatus.urgencyMessage); // "🔥 Hurry! Only 4 units left nearby!"

// 4. Reserve item during checkout
const reservation = inventory.reserve({
  sku: 'HOODIE-BLK-L',
  quantity: 1,
  cartId: 'cart_99182',
  preferredState: 'Maharashtra', // Proximity match
});

console.log(reservation.isSuccess);    // true
console.log(reservation.warehouseId);  // "wh_mumbai"
console.log(reservation.expiresAt);    // Date 15 minutes from now
```

---

## 📄 License

MIT © [Boost Engine](https://github.com/boostengine)
