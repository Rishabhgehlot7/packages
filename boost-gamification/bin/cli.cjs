#!/usr/bin/env node

const { calculateSpinOutcome, formatRewardDisplay } = require('../dist/index.js');

console.log('\x1b[35m⚡ BoostEngine Gamification CLI v1.1.0\x1b[0m\n');

const demoSlices = [
  { id: '1', label: '10% OFF', probabilityWeight: 50, discountType: 'percentage', discountValue: 10, couponCode: 'SPIN10' },
  { id: '2', label: '20% OFF', probabilityWeight: 20, discountType: 'percentage', discountValue: 20, couponCode: 'LUCKY20' },
  { id: '3', label: 'Flat ₹500 OFF', probabilityWeight: 10, discountType: 'fixed_amount', discountValue: 500, couponCode: 'MEGA500' },
  { id: '4', label: 'Free Shipping', probabilityWeight: 15, discountType: 'free_shipping', discountValue: 0, couponCode: 'FREEDEL' },
  { id: '5', label: 'Better Luck Next Time', probabilityWeight: 5, discountType: 'no_reward', discountValue: 0, isLosingSlice: true },
];

const outcome = calculateSpinOutcome(demoSlices);

console.log(`🎡 Spin Result: \x1b[1m${outcome.winningSlice.label}\x1b[0m`);
console.log(`🎁 Reward: \x1b[32m${formatRewardDisplay(outcome.winningSlice)}\x1b[0m`);
if (outcome.couponCode) {
  console.log(`🎟️ Coupon Code: \x1b[33m${outcome.couponCode}\x1b[0m`);
}
console.log(`🎯 Target Stop Angle: ${outcome.targetAngle}°`);

console.log('\n\x1b[36m⚡ Visit https://boostengine-docs.netlify.app/ for full documentation.\x1b[0m\n');
