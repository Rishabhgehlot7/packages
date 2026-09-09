const { DealsEngine } = require('./dist/index.js');

console.log('🧪 Testing @boostengine/deals...');

// Test 1: Calculate remaining time
const future = new Date(Date.now() + 3665 * 1000); // 1 hr 1 min 5 sec
const time = DealsEngine.calculateTimeRemaining(future);
if (time.hours !== 1 || time.minutes !== 1 || time.isExpired) {
  console.error('❌ Failed TimeRemaining calculation', time);
  process.exit(1);
}
console.log('  ✅ Passed: calculateTimeRemaining calculates future timestamps');

// Test 2: Calculate claim percentage
const claim = DealsEngine.calculateClaimInfo(75, 100);
if (claim.percentageClaimed !== 75 || !claim.urgencyText.includes('75% Claimed')) {
  console.error('❌ Failed ClaimInfo calculation', claim);
  process.exit(1);
}
console.log('  ✅ Passed: calculateClaimInfo computes accurate urgency metrics');

// Test 3: Compute deal price
const pricing = DealsEngine.computeDealPrice(2000, 25);
if (pricing.dealPrice !== 1500 || pricing.savings !== 500) {
  console.error('❌ Failed deal price computation', pricing);
  process.exit(1);
}
console.log('  ✅ Passed: computeDealPrice calculates exact discount and savings');

console.log('🎉 All tests passed for @boostengine/deals!');
