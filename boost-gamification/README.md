# @boostengine/gamification

> Interactive eCommerce gamification engine: Lucky Spin-the-Wheel, Scratch-to-Reveal Cards, Mystery Gift Boxes, exit-intent lead capture, and AI reward optimization.

[![npm version](https://img.shields.io/npm/v/@boostengine/gamification.svg)](https://www.npmjs.com/package/@boostengine/gamification)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ⚡ Features

- **🎡 Lucky Spin-the-Wheel**:
  - Configurable slices, weighted probability distribution, and precise canvas/SVG rotation angle calculation.
- **✨ Scratch-to-Reveal Card**:
  - Interactive scratchable overlay with threshold-based auto-reveal (e.g. 50% cleared -> instant win).
- **🚪 Smart Trigger Triggers**:
  - Exit-intent cursor detection, time delay (e.g. 5 seconds after page load), or scroll-depth triggers.
- **📱 Built-In Lead Generation**:
  - Captures 10-digit Indian mobile numbers or email IDs before / after claiming rewards.
- **🛡️ Anti-Abuse Cooldown Shield**:
  - Session/Cookie-based cooldown periods (e.g. 7-day limit per device) to prevent discount farming.

---

## 📦 Installation

```bash
npm install @boostengine/gamification
# or
pnpm add @boostengine/gamification
# or
yarn add @boostengine/gamification
```

---

## 🚀 Quick Start (React / Next.js)

```tsx
'use client';

import React from 'react';
import { useSpinWheel } from '@boostengine/gamification/react';

const config = {
  id: 'wheel-welcome-1',
  title: 'Spin to Win Exclusive Discounts!',
  type: 'spin_wheel',
  trigger: 'exit_intent',
  cooldownDays: 7,
  slices: [
    { id: '1', label: '10% OFF', probabilityWeight: 50, discountType: 'percentage', discountValue: 10, couponCode: 'SPIN10' },
    { id: '2', label: '20% OFF', probabilityWeight: 20, discountType: 'percentage', discountValue: 20, couponCode: 'LUCKY20' },
    { id: '3', label: 'Flat ₹500 OFF', probabilityWeight: 10, discountType: 'fixed_amount', discountValue: 500, couponCode: 'MEGA500' },
    { id: '4', label: 'Free Delivery', probabilityWeight: 15, discountType: 'free_shipping', discountValue: 0, couponCode: 'FREESHIP' },
    { id: '5', label: 'Better Luck Next Time', probabilityWeight: 5, discountType: 'no_reward', discountValue: 0, isLosingSlice: true },
  ],
};

export function LuckySpinWheelModal() {
  const {
    isOpen,
    isSpinning,
    rotationAngle,
    winningOutcome,
    hasPlayed,
    leadInput,
    setLeadInput,
    isLeadValid,
    spin,
    submitLead,
    close,
  } = useSpinWheel({
    config,
    onRewardWon: (res) => console.log('Won:', res),
    onLeadSubmit: (lead) => console.log('Lead Captured:', lead),
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-center">
        <h3 className="text-xl font-black">{config.title}</h3>

        {/* Wheel Graphic Container */}
        <div
          className="w-48 h-48 mx-auto rounded-full border-4 border-amber-400 transition-transform duration-[3500ms] ease-out flex items-center justify-center bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-bold"
          style={{ transform: `rotate(${rotationAngle}deg)` }}
        >
          🎡 Wheel
        </div>

        {!hasPlayed ? (
          <button
            onClick={spin}
            disabled={isSpinning}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-2xl shadow-lg transition"
          >
            {isSpinning ? 'Spinning...' : 'SPIN NOW!'}
          </button>
        ) : (
          <div className="space-y-3">
            <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl font-bold">
              🎉 You Won: {winningOutcome?.discountText}
              <div className="font-mono text-sm mt-1">{winningOutcome?.couponCode}</div>
            </div>

            <input
              type="text"
              placeholder="Enter your phone (+91) to claim"
              value={leadInput}
              onChange={(e) => setLeadInput(e.target.value)}
              className="w-full px-4 py-2.5 border rounded-xl"
            />

            <button
              onClick={submitLead}
              disabled={!isLeadValid}
              className="w-full py-2.5 bg-indigo-600 text-white font-bold rounded-xl disabled:opacity-50"
            >
              Claim & Apply to Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 📄 License

MIT © [BoostEngine Team](https://github.com/boostengine)
