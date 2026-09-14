# @boostengine/deals ⚡

[![npm version](https://img.shields.io/npm/v/@boostengine/deals.svg?color=blue)](https://www.npmjs.com/package/@boostengine/deals)
[![npm downloads](https://img.shields.io/npm/dm/@boostengine/deals.svg?color=green)](https://www.npmjs.com/package/@boostengine/deals)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Tree Shakable](https://img.shields.io/badge/Tree--Shakable-Yes-success.svg)](https://bundlephobia.com)

> **Amazon & Flipkart-style Lightning Deals, Flash Sales, and Countdown Urgency Timers for Next.js, Vite, React, and Node.js.**

Drive urgency and boost checkout conversion with live countdown clocks, stock claim progress bars, and active deal verifications.

---

## 🌟 Features

- ⏳ **High-Precision Countdown Timers**: Calculates formatted hours, minutes, seconds (`02h 45m 12s`) and expiry flags with zero drift.
- 🔥 **Amazon-style Claim Progress Meter**: Dynamic percentage claimed calculation with urgency labels (*"Almost Gone! 85% Claimed"*).
- 🏷️ **Deal Exclusivity & Verification**: Validate if a deal is currently active, upcoming, or expired based on ISO timestamps.
- 🚀 **Universal Compatibility**: Works effortlessly in Next.js (App Router / SSR), Vite (React, Vue), and Node.js backends.

---

## 📐 Deal Card UI Preview

```text
┌──────────────────────────────────────────────────────────┐
│  ⚡ LIGHTNING DEAL                Ends in: 02h 14m 38s   │
├──────────────────────────────────────────────────────────┤
│  Urban Acid Wash Hoodie                                  │
│  ₹1,499  MRP: ₹2,999 (50% OFF)                           │
│                                                          │
│  [████████████████████░░░░] 82% Claimed (Almost Gone!)   │
│                                                          │
│  [ ADD TO BAG NOW ]                                      │
└──────────────────────────────────────────────────────────┘
```

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

## ⚡ 60-Second Quickstart

```typescript
import { DealsEngine } from '@boostengine/deals';

// 1. Calculate Time Remaining for a Flash Sale
const timer = DealsEngine.calculateTimeRemaining('2026-09-14T23:59:59Z');

console.log(timer.formatted); // "05h 22m 14s"
console.log(timer.isExpired); // false
console.log(timer.hours);     // 5

// 2. Calculate Stock Claim Percentage & Urgency Label
const claim = DealsEngine.calculateClaimInfo(
  85, // 85 items claimed
  100 // 100 total deal inventory
);

console.log(claim.percentageClaimed); // 85
console.log(claim.urgencyText);       // "Almost Gone! 85% Claimed"
console.log(claim.isSoldOut);         // false
```

---

## 🚀 Framework Integration Examples

### A. Next.js / React (Live Countdown Hook & Widget)

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import { DealsEngine } from '@boostengine/deals';

export function LightningDealBanner({ dealEndsAt, claimed, total }) {
  const [timer, setTimer] = useState(() => DealsEngine.calculateTimeRemaining(dealEndsAt));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(DealsEngine.calculateTimeRemaining(dealEndsAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [dealEndsAt]);

  const claim = DealsEngine.calculateClaimInfo(claimed, total);

  if (timer.isExpired) {
    return <div className="text-gray-400 text-sm">Deal Ended</div>;
  }

  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 text-gray-900">
      <div className="flex items-center justify-between">
        <span className="font-bold text-amber-600 flex items-center gap-1">⚡ Lightning Deal</span>
        <span className="font-mono font-bold text-xs bg-black text-white px-2.5 py-1 rounded-lg">
          {timer.formatted}
        </span>
      </div>

      <div className="mt-3">
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div
            className="bg-amber-500 h-full transition-all duration-300"
            style={{ width: `${claim.percentageClaimed}%` }}
          />
        </div>
        <p className="text-xs text-amber-700 font-semibold mt-1">{claim.urgencyText}</p>
      </div>
    </div>
  );
}
```

---

## 📖 API Reference

### `DealsEngine.calculateTimeRemaining(endsAt: string | Date): TimeRemaining`
Calculates remaining hours, minutes, seconds, and human-readable formatted clock string.
- **Returns:** `{ hours, minutes, seconds, totalSeconds, isExpired, formatted }`

### `DealsEngine.calculateClaimInfo(claimedCount: number, totalAvailable: number): DealClaimInfo`
Computes stock claim percentage and dynamic psychological urgency messages.
- **Returns:** `{ claimedCount, totalAvailable, percentageClaimed, isSoldOut, urgencyText }`

---

## 📄 License

MIT © [Boost Engine Team](https://github.com/boostengine)
