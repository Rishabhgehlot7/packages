# @boostengine/deals ⚡

[![npm version](https://img.shields.io/npm/v/@boostengine/deals.svg?color=blue)](https://www.npmjs.com/package/@boostengine/deals)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18%20%7C%2019-61dafb.svg)](https://react.dev/)

> Enterprise Promotions, Flash Sales, Lightning Deals with Claim Holds & Bot Protection, BOGO, Tiered Volume Discounts, Stacking & Exclusivity Rules, Real-Time Events, and Autonomous AI Agent Deals Toolkit for Modern Commerce.

Part of the **BoostEngine** headless ecommerce micro-packages ecosystem.

---

## 🌟 Key Features

- ⚡ **Lightning Deals & Flash Sales**: Real-time claim counters, remaining claims, and live countdown timers.
- 🔒 **TTL Claim Reservations**: Temporarily lock flash deal stock for shoppers during checkout with auto-sweep expiration.
- 🛡️ **Bot & Scalper Protection**: Enforce `maxClaimsPerUser` to prevent scalpers/bots from hoarding flash sale inventory.
- 🎁 **BOGO (Buy X Get Y)**: Configurable BOGO rules (e.g. "Buy 2 Get 1 Free" or "Buy 1 Get 2nd at 50% Off").
- 📦 **Tiered Volume Discounts**: Quantity-based wholesale/bulk pricing tiers (e.g., 3+ units 10% off, 5+ units 20% off).
- 🔀 **Deal Stacking & Exclusivity**: Precision promotion rules (`stackable: false`, `exclusive: true`, `priority: number`).
- 🛒 **Cart Spend Threshold Promotions**: Dynamic order value discounts (e.g., "Spend $100 get $15 off").
- 📡 **Real-time Event Emitter**: Subscribe to live promotional events (`claim:reserved`, `claim:released`, `deal:sold_out`, `deal:expired`) for WebSockets.
- 🔄 **Universal Database Sync**: Ingest deals effortlessly from MongoDB, PostgreSQL, Supabase, Prisma, DynamoDB, or Firebase.
- ⚛️ **Universal React Suite**: `<DealsProvider>`, `useDeals()`, `useLightningDeal()`, `useCountdownTimer()`, and `useCartDeals()`.
- 🤖 **Autonomous AI Agent Toolkit**: Ready-to-use function definitions and executor for OpenAI, Claude, Gemini, and Vercel AI SDK.
- 💻 **Interactive CLI**: Test and simulate promotions right in your terminal.
- 🛡️ **100% Backward Compatible**: Retains all original static `DealsEngine` methods (`calculateTimeRemaining`, `calculateClaimInfo`, `computeDealPrice`).

---

## 📦 Installation

```bash
npm install @boostengine/deals
# or
yarn add @boostengine/deals
# or
pnpm add @boostengine/deals
```

---

## 🚀 Quick Start (Node.js / Backend)

```typescript
import { deals, DealsEngine } from '@boostengine/deals';

// 1. Register a Flash Sale Deal with Bot Protection & Exclusivity
deals.registerDeal({
  id: 'deal_headphones',
  title: 'Midnight Flash Sale: ANC Headphones',
  type: 'flash_sale',
  discountValue: 40, // 40% OFF
  startDate: '2026-01-01T00:00:00Z',
  endDate: '2026-12-31T23:59:59Z',
  applicableProductIds: ['prod_headphones_1'],
  totalClaimLimit: 100,
  maxClaimsPerUser: 1, // Only 1 per customer
  stackable: false,    // Cannot combine with other discounts
  priority: 10
});

// 2. Register a BOGO Deal ("Buy 2 Get 1 Free")
deals.registerDeal({
  id: 'deal_bogo_tees',
  title: 'Summer BOGO: T-Shirts',
  type: 'bogo',
  discountValue: 0,
  startDate: '2026-01-01T00:00:00Z',
  endDate: '2026-12-31T23:59:59Z',
  applicableProductIds: ['prod_tee_1'],
  bogoRule: {
    buyQuantity: 2,
    getQuantity: 1,
    discountPercentage: 100 // Free
  }
});

// 3. Register a Cart Spend Rule ("Spend $100 Get $15 Off")
deals.registerDeal({
  id: 'deal_spend_100',
  title: 'Spend $100 Get $15 Off',
  type: 'spend_threshold',
  discountValue: 15,
  startDate: '2026-01-01T00:00:00Z',
  endDate: '2026-12-31T23:59:59Z',
  spendThreshold: {
    minimumSpend: 100,
    discountAmount: 15
  }
});

// 4. Evaluate Entire Shopping Cart
const cart = [
  { productId: 'prod_headphones_1', unitPrice: 150, quantity: 1 },
  { productId: 'prod_tee_1', unitPrice: 25, quantity: 3 }
];

const result = deals.evaluateCartDeals(cart);
console.log(`Original: $${result.originalSubtotal}, Saved: $${result.totalSavings}, Pay: $${result.discountedSubtotal}`);
```

---

## 📡 Real-time Event Emitter (WebSockets / Socket.io)

Broadcast live flash sale updates to all connected customers:

```typescript
import { deals } from '@boostengine/deals';

// When customer locks a claim during checkout
deals.on('claim:reserved', ({ dealId, remainingClaims }) => {
  io.emit('flash_deal:updated', { dealId, remainingClaims });
});

// When flash sale sells out
deals.on('deal:sold_out', ({ dealId, title }) => {
  io.emit('flash_deal:sold_out', { dealId, message: `${title} is now SOLD OUT!` });
});

// When expired checkout locks are released back to stock
deals.on('claim:released', ({ dealId, quantity, reason }) => {
  io.emit('flash_deal:restocked', { dealId, freedQuantity: quantity });
});
```

---

## 🔒 Lightning Deals & TTL Claim Locks

Prevent inventory overselling during high-concurrency flash sales:

```typescript
import { deals } from '@boostengine/deals';

// Lock 1 unit claim during checkout for 10 minutes (600s)
const reservation = deals.reserveClaim('deal_headphones', 'user_12345', 1, 600);
console.log(`Reservation created: ${reservation.reservationId}`);

// If customer completes payment:
deals.commitClaim(reservation.reservationId);

// Or if customer leaves checkout:
deals.releaseClaim(reservation.reservationId);

// Background auto-sweep will automatically return expired reservations!
const freedSlots = deals.sweepExpiredReservations();
```

---

## 🔄 Universal Database Sync

Sync promotional rules from any database into memory for lightning-fast evaluations:

```typescript
import { deals } from '@boostengine/deals';

// MongoDB, Prisma, PostgreSQL, Supabase, DynamoDB
const mongoDeals = await db.collection('promotions').find({ status: 'active' }).toArray();

deals.sync(mongoDeals, doc => ({
  id: doc._id.toString(),
  title: doc.name,
  type: doc.dealType,
  discountValue: doc.percentageOff || doc.flatOff,
  startDate: doc.startsAt.toISOString(),
  endDate: doc.endsAt.toISOString(),
  applicableProductIds: doc.productIds,
  totalClaimLimit: doc.stockLimit,
  claimedCount: doc.claimedCount
}));
```

---

## ⚛️ Universal React Suite

Import from `@boostengine/deals/react` in Next.js, Vite, React, or React Native:

### 1. App-Wide Provider

```tsx
import { DealsProvider } from '@boostengine/deals/react';

export function App({ children }) {
  return (
    <DealsProvider>
      {children}
    </DealsProvider>
  );
}
```

### 2. Live Countdown & Claim Bar

```tsx
import React from 'react';
import { useLightningDeal } from '@boostengine/deals/react';

export function FlashSaleCard({ dealId }: { dealId: string }) {
  const { deal, claimInfo, countdown, reserve, isSoldOut, isExpired, remainingClaims } = useLightningDeal(dealId);

  if (!deal) return null;

  return (
    <div className="border p-4 rounded-xl shadow-sm">
      <h3 className="font-bold text-lg">{deal.title}</h3>
      
      {/* Real-time Countdown */}
      <div className="text-red-600 font-mono text-sm my-2">
        ⏳ Ends in: {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 my-2">
        <div 
          className="bg-orange-500 h-2.5 rounded-full" 
          style={{ width: `${claimInfo.percentageClaimed}%` }}
        />
      </div>
      <p className="text-xs text-gray-500">{claimInfo.percentageClaimed}% claimed ({remainingClaims} left!)</p>

      {/* Action Button */}
      <button 
        disabled={isSoldOut || isExpired}
        onClick={() => reserve('current_user_id')}
        className="mt-3 w-full bg-orange-600 text-white py-2 rounded-lg disabled:opacity-50"
      >
        {isSoldOut ? 'Sold Out' : isExpired ? 'Deal Expired' : 'Claim Deal Now'}
      </button>
    </div>
  );
}
```

---

## 🤖 Autonomous AI Agent Toolkit

Equip AI shopping assistants and customer support bots with promotional tools:

```typescript
import { DealsAgentToolkit, deals } from '@boostengine/deals';

const toolkit = new DealsAgentToolkit(deals);

// Universal schemas for OpenAI, Claude, Gemini, or Vercel AI SDK
const openAITools = toolkit.toOpenAITools();
const claudeTools = toolkit.toClaudeTools();
const geminiTools = toolkit.toGeminiTools();

// Autonomous Tool Execution Router
const result = await toolkit.executeTool('evaluate_cart_deals', {
  items: [
    { productId: 'prod_laptop', unitPrice: 1200, quantity: 1 }
  ]
});
```

---

## 💻 CLI Commands

```bash
# Run interactive simulation of Flash Sale, BOGO & Cart Deals
npx boost-deals demo

# Evaluate sample cart
npx boost-deals evaluate
```

---

## 📄 License

MIT © [BoostEngine Team](https://github.com/Rishabhgehlot7)
