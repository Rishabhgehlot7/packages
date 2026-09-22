#!/usr/bin/env node
// @boostengine/loyalty — CLI Demo
'use strict';

const { LoyaltyEngine, BoostLoyaltyManager } = require('../dist/index.js');

console.log('\n╔══════════════════════════════════════════════════╗');
console.log('║        @boostengine/loyalty — CLI Demo           ║');
console.log('╚══════════════════════════════════════════════════╝\n');

const manager = new BoostLoyaltyManager({ welcomeCoins: 100, earnRatePerHundred: 2 });

// Events
manager.on('tier:upgraded',       e => console.log(`  🏆 TIER UP! ${e.customerId}: ${e.oldTier} → ${e.newTier}`));
manager.on('challenge:completed', e => console.log(`  🎮 CHALLENGE DONE! +${e.bonusCoins} bonus coins`));
manager.on('coins:earned',        e => console.log(`  💰 Earned ${e.coins} coins | Balance: ${e.newBalance}`));
manager.on('coins:redeemed',      e => console.log(`  💳 Redeemed ${e.coins} coins | Balance: ${e.newBalance}`));

// Step 1: Create profiles
console.log('▶ Step 1: Creating customer profiles...');
const alice = manager.createProfile('alice');
const bob   = manager.createProfile('bob');
console.log(`  Alice: ${alice.balance} coins, Tier: ${alice.tier}`);
console.log(`  Bob:   ${bob.balance} coins, Tier: ${bob.tier}`);

// Step 2: Add a challenge
console.log('\n▶ Step 2: Adding gamification challenge...');
manager.addChallenge({
  id: 'ch1', name: 'Big Spender', description: 'Spend ₹10,000 to earn 500 bonus coins',
  targetValue: 10000, metric: 'spend', bonusCoins: 500,
  startsAt: new Date(), endsAt: new Date(Date.now() + 30 * 86400_000),
});
manager.joinChallenge('alice', 'ch1');
console.log('  Alice joined "Big Spender" challenge ✓');

// Step 3: Earn coins from orders
console.log('\n▶ Step 3: Simulating orders...');
manager.earnCoins('alice', 3000, 'ORD-001');
manager.earnCoins('alice', 4000, 'ORD-002');
manager.earnCoins('alice', 5000, 'ORD-003'); // should trigger challenge complete

// Step 4: Check tier after lots of earning
console.log('\n▶ Step 4: Alice profile after orders...');
const aliceNow = manager.getProfile('alice');
console.log(`  Balance: ${aliceNow.balance} | Lifetime: ${aliceNow.lifetimeEarned} | Tier: ${aliceNow.tier}`);

// Step 5: Redemption quote
console.log('\n▶ Step 5: Redemption quote for ₹2000 order...');
const quote = manager.getRedemptionQuote('alice', 2000);
console.log(`  Max redeemable: ${quote.maxRedeemableCoins} coins`);
console.log(`  Coins to use:   ${quote.coinsToRedeem} coins`);
console.log(`  Discount:       ₹${quote.rupeeDiscount}`);
console.log(`  Payable:        ₹${quote.payableAfterDiscount}`);
console.log(`  New coins earn: ${quote.coinsEarnedOnThisOrder}`);

// Step 6: Leaderboard
console.log('\n▶ Step 6: Leaderboard...');
manager.earnCoins('bob', 500, 'ORD-B01');
const board = manager.getLeaderboard(3);
board.forEach(e => console.log(`  #${e.rank} ${e.customerId} — ${e.lifetimeEarned} lifetime coins | Tier: ${e.tier}`));

// Step 7: Backward compat check
console.log('\n▶ Step 7: Backward compat (static LoyaltyEngine)...');
const tier     = LoyaltyEngine.determineTier(600);
const coins    = LoyaltyEngine.calculateCoinsEarned(5000, 'Gold');
const profile  = LoyaltyEngine.createProfile('static-user', 150);
console.log(`  determineTier(600) → ${tier}`);
console.log(`  calculateCoinsEarned(5000, Gold) → ${coins} coins`);
console.log(`  createProfile → Tier: ${profile.tier}, Balance: ${profile.balance}`);

console.log('\n✅ All demos passed!\n');
