# @boostengine/inventory 📦

[![npm version](https://img.shields.io/npm/v/@boostengine/inventory.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/@boostengine/inventory)
[![npm downloads](https://img.shields.io/npm/dm/@boostengine/inventory.svg?style=flat-square&color=green)](https://www.npmjs.com/package/@boostengine/inventory)
[![license](https://img.shields.io/npm/l/@boostengine/inventory.svg?style=flat-square)](https://github.com/boostengine/boostengine/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)
[![AI Agent Ready](https://img.shields.io/badge/AI%20Agent-Toolkit%20Inside-purple.svg?style=flat-square)](https://github.com/boostengine/boostengine)
[![Frameworks](https://img.shields.io/badge/Frameworks-Next.js%20%7C%20React%20%7C%20React%20Native%20%7C%20Vite%20%7C%20Node-orange.svg?style=flat-square)](https://github.com/boostengine/boostengine)

> **High-performance headless eCommerce inventory engine with flash-sale stock locks (TTL), proximity multi-warehouse routing, multi-origin split shipments, safety stock buffers, backorders, AI agent toolkits, and universal React/React Native hooks.**

---

## 🚀 Key Features

- **⚡ Flash Sale Stock Lock (TTL)**: Temporarily hold stock during checkout (e.g. 15-min hold) to prevent race-condition overselling. Automatically frees expired holds.
- **📍 Proximity Multi-Warehouse Routing**: Automatically allocate shipments from the nearest warehouse matching the customer's pincode/state.
- **📦 Multi-Origin Split Shipments**: If no single warehouse has all items in the cart, intelligently splits the order across the minimal set of fulfillment hubs.
- **🛡️ Safety Stock Buffer**: Reserve a hidden safety margin for VIPs or offline channels without displaying it to online shoppers.
- **⏳ Backorders with Restock ETAs**: Allow pre-orders with dynamic `"Ships by [Date]"` messaging instead of losing customers to out-of-stock.
- **🔥 FOMO Stock Urgency Badges**: Conversion-optimized urgency badges (*"⚡ Almost Gone! Only 2 left!"*, *"🔥 Hurry! Only 4 left!"*).
- **🛒 Direct Cart Bridge**: Native compatibility with `@boostengine/cart` for single-step cart validation.
- **🤖 Autonomous AI Agent Toolkit**: Out-of-the-box function schemas and executors for **OpenAI, Anthropic Claude, Google Gemini, and Vercel AI SDK**.
- **⚛️ Universal React & React Native Hooks**: `useStockUrgency`, `useStockLevel`, and `useCartInventory` with real-time refresh.

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

## ⚡ 1-Minute Quick Start

### 1. Zero-Config 1-Liners
```typescript
import { inventory } from '@boostengine/inventory';

// Register or update product stock
inventory.setStock({
  sku: 'HOODIE_BLACK_L',
  productId: 'p_101',
  quantity: 12,
  lowStockThreshold: 5,
  safetyStock: 2, // 2 kept as safety buffer => 10 available for sale
});

// Quick availability check
const inStock = inventory.quickCheck('HOODIE_BLACK_L', 2); // true

// Flash sale 15-minute checkout lock
const lock = inventory.quickReserve('HOODIE_BLACK_L', 2, 900);
console.log(lock.reservationId); // "res_172694..."

// On successful payment confirmation
inventory.quickConfirm(lock.reservationId);

// If checkout is abandoned or payment failed
inventory.quickRelease(lock.reservationId);
```

---

## 🏢 Proximity Multi-Warehouse & Split Fulfillment

```typescript
import { createBoostInventory } from '@boostengine/inventory';

const inv = createBoostInventory([
  { sku: 'TEE_BLACK', productId: 'p1', quantity: 50, warehouseId: 'WH_DELHI' },
  { sku: 'TEE_BLACK', productId: 'p1', quantity: 100, warehouseId: 'WH_MUMBAI' },
  { sku: 'JEANS_BLUE', productId: 'p2', quantity: 30, warehouseId: 'WH_MUMBAI' },
]);

const warehouses = [
  { id: 'WH_DELHI', name: 'Delhi Hub', pincode: '110001', state: 'Delhi', priority: 1 },
  { id: 'WH_MUMBAI', name: 'Mumbai Hub', pincode: '400001', state: 'Maharashtra', priority: 1 },
];

// Split shipment planning for customer in Mumbai
const plan = inv.allocateSplitShipment(
  [
    { sku: 'TEE_BLACK', quantity: 2 },
    { sku: 'JEANS_BLUE', quantity: 1 },
  ],
  warehouses,
  '400050' // Customer Pincode
);

console.log(plan.canFulfill); // true
console.log(plan.isSplit);    // false (Mumbai hub has both!)
console.log(plan.shipments[0].warehouseName); // "Mumbai Hub"
```

---

## ⚛️ Universal React & React Native Provider & Hooks

Import directly from `@boostengine/inventory/react`:

### 1. `InventoryProvider` & `useInventory` (App-Wide Context)
```tsx
import React from 'react';
import { InventoryProvider, useInventory, useStockUrgency } from '@boostengine/inventory/react';

// Wrap in Root Layout or Store Layout (Next.js / Vite / React Native)
export function App({ children }: { children: React.ReactNode }) {
  return (
    <InventoryProvider
      defaultWarehouseId="WH_MUMBAI"
      initialStock={[
        { sku: 'HOODIE_BLACK_L', productId: 'p1', quantity: 12, lowStockThreshold: 5 },
      ]}
    >
      {children}
    </InventoryProvider>
  );
}

// Child Component
export function QuickBuy({ sku }: { sku: string }) {
  const { quickCheck, quickReserve } = useInventory();
  const { badgeText, urgencyLevel } = useStockUrgency(sku);

  const handleCheckout = () => {
    if (quickCheck(sku, 1)) {
      const lock = quickReserve(sku, 1, 900); // 15-min lock
      console.log('Stock locked:', lock.reservationId);
    }
  };

  return (
    <div>
      <span>{badgeText}</span>
      <button onClick={handleCheckout}>Reserve & Buy</button>
    </div>
  );
}
```

### 2. `useStockUrgency` (Conversion Badges)
```tsx
import React from 'react';
import { useStockUrgency } from '@boostengine/inventory/react';

export function ProductBuyButton({ sku }: { sku: string }) {
  const { badgeText, urgencyLevel, isOutOfStock, availableQuantity } = useStockUrgency(sku, {
    refreshIntervalMs: 15000, // Live poll during flash sales
  });

  return (
    <div className="stock-container">
      {urgencyLevel !== 'none' && (
        <span className={`badge badge-${urgencyLevel}`}>{badgeText}</span>
      )}
      <button disabled={isOutOfStock}>
        {isOutOfStock ? 'Sold Out' : `Add to Cart (${availableQuantity} left)`}
      </button>
    </div>
  );
}
```

### 3. `useCartInventory` (Cart Validation Screen)
```tsx
import React from 'react';
import { useCartInventory } from '@boostengine/inventory/react';

export function CheckoutCart({ cartItems }: { cartItems: Array<{ sku: string; quantity: number }> }) {
  const { allAvailable, hasBackorders, items } = useCartInventory(cartItems);

  if (!allAvailable) {
    return (
      <div className="alert alert-warning">
        Some items in your bag exceed available stock! Please adjust quantities.
      </div>
    );
  }

  return (
    <div>
      {hasBackorders && <p>ℹ️ Some items will ship when restocked.</p>}
      <button>Proceed to Checkout</button>
    </div>
  );
}
```

### 4. `useStockReservation` (Checkout Hold & Countdown Timer)
```tsx
import React from 'react';
import { useStockReservation } from '@boostengine/inventory/react';

export function CheckoutHoldBanner({ checkoutItems }: { checkoutItems: Array<{ sku: string; quantity: number }> }) {
  const { isReserved, expiresIn, isExpired, extend } = useStockReservation(checkoutItems, {
    ttlSeconds: 900, // 15-minute hold
    autoReserve: true,
  });

  if (!isReserved) return null;

  const minutes = Math.floor(expiresIn / 60);
  const seconds = expiresIn % 60;

  return (
    <div className="reservation-banner">
      {isExpired ? (
        <span>⚠️ Reservation expired. Stock has been returned to pool.</span>
      ) : (
        <span>
          ⚡ Items reserved! Complete payment in {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          <button onClick={() => extend(300)}>Need more time?</button>
        </span>
      )}
    </div>
  );
}
```

---

## 🤖 Autonomous AI Agent Toolkit

Connect AI Agents (OpenAI, Claude, Gemini, Vercel AI SDK) directly to inventory operations:

```typescript
import { InventoryAgentToolkit } from '@boostengine/inventory/agent';

// 1. Get tool specifications for your AI framework
const openAITools = InventoryAgentToolkit.getOpenAITools();
const geminiTools = InventoryAgentToolkit.getGeminiTools();
const claudeTools = InventoryAgentToolkit.getClaudeTools();

// 2. Autonomous Tool Execution
const result = await InventoryAgentToolkit.executeTool('reserve_order_stock', {
  items: [{ sku: 'HOODIE_L', quantity: 1 }],
  ttlSeconds: 900,
});

console.log(result.success); // true
console.log(result.data.reservationId); // "res_..."
```

### Supported Agent Tools:
1. `check_stock_availability`: Real-time stock check with backorders and urgency badges.
2. `reserve_order_stock`: Temporary lock for checkout / flash sales.
3. `release_stock_reservation`: Free held stock if customer abandons bag.
4. `confirm_stock_deduction`: Permanently deduct stock upon captured order.
5. `find_fulfillment_warehouse`: Route order to optimal warehouse or create split plan.
6. `get_low_stock_reorder_list`: Scan shortages and replenishment alerts.

---

## 💻 CLI Tools

Run without installing:
```bash
# Live interactive demo of urgency & multi-warehouse routing
npx @boostengine/inventory demo

# Display low stock reorder alerts
npx @boostengine/inventory alerts
```

---

## 🛠️ API Reference

### `BoostInventory` Methods
- `setStock(stock: StockLevel): void`
- `getStock(sku: string, warehouseId?: string): StockLevel | null`
- `getAvailableQuantity(sku: string, warehouseId?: string): number`
- `getUrgency(sku: string, warehouseId?: string): StockUrgencyInfo`
- `reserveStock(items: AllocationItem[], ttlSeconds?: number, metadata?: Record<string, any>)`
- `extendReservation(reservationId: string, extraSeconds?: number): boolean`
- `releaseReservation(reservationId: string, reason?: string): boolean`
- `confirmDeduction(reservationId: string, orderId?: string): boolean`
- `cleanupExpiredReservations(nowSeconds?: number): string[]`
- `checkCartAvailability(items: AllocationItem[]): CartAvailabilityResult`
- `getLowStockAlerts(warehouseId?: string): LowStockAlert[]`
- `allocateWarehouse(items, warehouses, customerPincode?): AllocationResult`
- `allocateSplitShipment(items, warehouses, customerPincode?): SplitAllocationPlan`
- `restock(sku, quantity, warehouseId?, reason?): StockLevel`
- `getMovements(sku?): StockMovementLog[]`

---

## 📄 License

MIT © [Boost Engine](https://github.com/boostengine)
