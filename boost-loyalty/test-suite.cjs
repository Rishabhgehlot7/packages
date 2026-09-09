const { LoyaltyEngine } = require('./dist/index.js');

console.log('🧪 Testing @boostengine/loyalty...');

// Test 1: Tier determination
const tier1 = LoyaltyEngine.determineTier(150);
const tier2 = LoyaltyEngine.determineTier(1200);

if (tier1 !== 'Bronze' || tier2 !== 'SuperStar') {
  console.error('❌ Failed tier determination', { tier1, tier2 });
  process.exit(1);
}
console.log('  ✅ Passed: determineTier classifies customer loyalty status');

// Test 2: Earn coins calculation
const earnedBronze = LoyaltyEngine.calculateCoinsEarned(5000, 'Bronze'); // (5000/100)*2 * 1 = 100
const earnedSuperStar = LoyaltyEngine.calculateCoinsEarned(5000, 'SuperStar'); // (5000/100)*2 * 2 = 200

if (earnedBronze !== 100 || earnedSuperStar !== 200) {
  console.error('❌ Failed calculateCoinsEarned', { earnedBronze, earnedSuperStar });
  process.exit(1);
}
console.log('  ✅ Passed: calculateCoinsEarned accurately applies tier multiplier');

// Test 3: Redemption Quote calculation
// Order = ₹2000. Max 20% = ₹400. Available coins = 600. So max coins usable = 400.
const quote = LoyaltyEngine.calculateRedemption(2000, 600);
if (quote.maxRedeemableCoins !== 400 || quote.rupeeDiscount !== 400 || quote.payableAfterDiscount !== 1600) {
  console.error('❌ Failed calculateRedemption quote', quote);
  process.exit(1);
}
console.log('  ✅ Passed: calculateRedemption correctly enforces max redemption cap');

console.log('🎉 All tests passed for @boostengine/loyalty!');
