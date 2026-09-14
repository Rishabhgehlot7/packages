# @boostengine/loyalty 🪙

[![npm version](https://img.shields.io/npm/v/@boostengine/loyalty.svg?color=blue)](https://www.npmjs.com/package/@boostengine/loyalty)
[![npm downloads](https://img.shields.io/npm/dm/@boostengine/loyalty.svg?color=green)](https://www.npmjs.com/package/@boostengine/loyalty)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Tree Shakable](https://img.shields.io/badge/Tree--Shakable-Yes-success.svg)](https://bundlephobia.com)

> **Flipkart SuperCoins & Amazon Pay style loyalty rewards, tier progression & checkout redemptions for Next.js, Vite, React, and Node.js.**

Retain high-value customers by rewarding every purchase with redeemable coins, VIP tiers, and instant discount slider redemptions at checkout.

---

## 🌟 Features

- 🏆 **Dynamic VIP Tiers**: Automatic progression (`Bronze` ➔ `Silver` ➔ `Gold` ➔ `SuperStar`) based on lifetime earned coins.
- 💸 **Fair Redemption Caps**: Built-in maximum redemption rules (e.g. up to 20% of cart value can be paid with coins).
- 🎁 **Tier Perks Engine**: Automatic multipliers for VIPs (1.5x, 2x coins per purchase), free express shipping flags, and early access sales.
- 🚀 **Universal Compatibility**: Works out-of-the-box in Next.js (Server & Client), Vite, Express, and React Native.

---

## 📐 VIP Tiers & Perks Matrix

| Tier | Lifetime Coins | Multiplier | Free Express Delivery | Early Access Deals | Cashback % |
|---|:---:|:---:|:---:|:---:|:---:|
| **Bronze** | 0 - 199 | 1.0x | ❌ | ❌ | 1% |
| **Silver** | 200 - 499 | 1.2x | ❌ | ❌ | 2% |
| **Gold** | 500 - 999 | 1.5x | ✅ | ✅ | 3% |
| **SuperStar** | 1000+ | 2.0x | ✅ | ✅ | 5% |

---

## 📦 Installation

```bash
npm install @boostengine/loyalty
# or
yarn add @boostengine/loyalty
# or
pnpm add @boostengine/loyalty
```

---

## ⚡ 60-Second Quickstart

```typescript
import { LoyaltyEngine } from '@boostengine/loyalty';

// 1. Calculate coins earned on an order
const coinsEarned = LoyaltyEngine.calculateCoinsEarned(
  2499,      // Order total in ₹
  'SuperStar' // Customer VIP Tier (2x multiplier)
);
console.log(coinsEarned); // 98 SuperCoins

// 2. Calculate Checkout Redemption Quote
const quote = LoyaltyEngine.calculateRedemption(
  2000, // Order Total
  300,  // Customer's available coins balance
  200,  // Requested coins to redeem
  'Gold'
);

console.log(quote.maxRedeemableCoins);     // 400 (Cap is 20% of ₹2000)
console.log(quote.rupeeDiscount);          // ₹200 OFF
console.log(quote.payableAfterDiscount);   // ₹1800
console.log(quote.coinsEarnedOnThisOrder); // Coins earned on remaining payable amount

// 3. Check / Update Customer Tier based on lifetime coins
const tier = LoyaltyEngine.determineTier(650);
console.log(tier); // "Gold"
```

---

## 🚀 Framework Integration Examples

### A. Next.js App Router (Redemption API)

Create `app/api/loyalty/quote/route.ts`:

```typescript
import { NextResponse } from 'next/server';
import { LoyaltyEngine } from '@boostengine/loyalty';

export async function POST(req: Request) {
  const { cartTotal, userBalance, requestedCoins, tier } = await req.json();

  const quote = LoyaltyEngine.calculateRedemption(
    cartTotal,
    userBalance,
    requestedCoins,
    tier
  );

  return NextResponse.json({ success: true, quote });
}
```

### B. Vite + React (Checkout Coin Slider Component)

```tsx
import React, { useState } from 'react';
import { LoyaltyEngine } from '@boostengine/loyalty';

export function CoinRedemptionBox({ orderTotal, availableCoins, tier, onApply }) {
  const quote = LoyaltyEngine.calculateRedemption(orderTotal, availableCoins, availableCoins, tier);
  const [useCoins, setUseCoins] = useState(false);

  return (
    <div className="border border-amber-200 bg-amber-50/50 p-4 rounded-2xl flex items-center justify-between">
      <div>
        <h4 className="font-bold text-sm text-gray-900">🪙 Redeem SuperCoins</h4>
        <p className="text-xs text-gray-600">
          You have {availableCoins} coins. Use up to {quote.maxRedeemableCoins} coins for ₹{quote.maxRedeemableCoins} discount.
        </p>
      </div>
      <button
        onClick={() => {
          setUseCoins(!useCoins);
          onApply(useCoins ? 0 : quote.maxRedeemableCoins);
        }}
        className="bg-black text-white text-xs font-bold px-4 py-2 rounded-xl"
      >
        {useCoins ? 'Remove' : 'Apply Coins'}
      </button>
    </div>
  );
}
```

---

## 📖 API Reference

### `LoyaltyEngine.calculateCoinsEarned(orderTotal: number, tier?: CustomerTier): number`
Calculates coins awarded for a purchase based on standard ₹ spend and VIP multipliers.

### `LoyaltyEngine.calculateRedemption(orderTotal, availableCoins, requestedCoins?, tier?): RedemptionQuote`
Evaluates checkout discount, applies the 20% order cap limit, and outputs net payable balance.

### `LoyaltyEngine.determineTier(lifetimeCoins: number): CustomerTier`
Returns `'Bronze' | 'Silver' | 'Gold' | 'SuperStar'`.

### `LoyaltyEngine.getTierPerks(tier: CustomerTier): TierPerks`
Outputs multiplier, free shipping eligibility, and cashback rates.

---

## 📄 License

MIT © [Boost Engine Team](https://github.com/boostengine)
