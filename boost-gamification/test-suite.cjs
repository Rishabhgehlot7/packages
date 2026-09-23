const assert = require('assert');
const {
  calculateSpinOutcome,
  formatRewardDisplay,
  calculateScratchPercentage,
  checkCooldownEligibility,
  validateContactInput,
  simulateGamificationCampaignTool,
} = require('./dist/index.js');

console.log('🧪 Running @boostengine/gamification complete test suite...\n');

try {
  // ── Test 1: Spin Outcome Calculation ───────────────────────────────────────
  console.log('🔹 1. Testing Spin Outcome & Probability Math...');
  const slices = [
    { id: '1', label: '10% OFF', probabilityWeight: 60, discountType: 'percentage', discountValue: 10 },
    { id: '2', label: '20% OFF', probabilityWeight: 30, discountType: 'percentage', discountValue: 20 },
    { id: '3', label: 'Jackpot ₹1000', probabilityWeight: 10, discountType: 'fixed_amount', discountValue: 1000 },
  ];

  const outcome = calculateSpinOutcome(slices, 5, 0);
  assert.strictEqual(Boolean(outcome.winningSlice), true);
  assert.strictEqual(typeof outcome.targetAngle, 'number');
  assert.strictEqual(outcome.targetAngle > 360, true);
  console.log('✅ Spin outcome calculation passed!');

  // ── Test 2: Reward Formatting ──────────────────────────────────────────────
  console.log('🔹 2. Testing Reward String Formatting...');
  assert.strictEqual(formatRewardDisplay({ label: 'Free', discountType: 'free_shipping', discountValue: 0, probabilityWeight: 1 }), 'Free Express Delivery');
  assert.strictEqual(formatRewardDisplay({ label: 'Loss', discountType: 'no_reward', discountValue: 0, isLosingSlice: true, probabilityWeight: 1 }), 'Better luck next time!');
  assert.strictEqual(formatRewardDisplay({ label: '15% off', discountType: 'percentage', discountValue: 15, probabilityWeight: 1 }), '15% OFF');
  console.log('✅ Reward string formatting passed!');

  // ── Test 3: Scratch Card Percentage ────────────────────────────────────────
  console.log('🔹 3. Testing Scratch Percentage...');
  assert.strictEqual(calculateScratchPercentage(50, 100), 50);
  assert.strictEqual(calculateScratchPercentage(80, 100), 80);
  assert.strictEqual(calculateScratchPercentage(0, 100), 0);
  console.log('✅ Scratch percentage passed!');

  // ── Test 4: Cooldown & Contact Validation ──────────────────────────────────
  console.log('🔹 4. Testing Cooldown Shield & Lead Validation...');
  const activeCooldown = checkCooldownEligibility(Date.now() - (2 * 24 * 60 * 60 * 1000), 7);
  assert.strictEqual(activeCooldown.isEligible, false);
  assert.strictEqual(activeCooldown.daysRemaining, 5);

  const expiredCooldown = checkCooldownEligibility(Date.now() - (10 * 24 * 60 * 60 * 1000), 7);
  assert.strictEqual(expiredCooldown.isEligible, true);

  const phoneValid = validateContactInput('9876543210');
  assert.strictEqual(phoneValid.isValid, true);
  assert.strictEqual(phoneValid.parsedType, 'phone');

  const emailValid = validateContactInput('user@example.com');
  assert.strictEqual(emailValid.isValid, true);
  assert.strictEqual(emailValid.parsedType, 'email');

  const invalid = validateContactInput('123');
  assert.strictEqual(invalid.isValid, false);
  console.log('✅ Cooldown shield and lead validation passed!');

  // ── Test 5: AI Agent Simulation Tool ──────────────────────────────────────
  console.log('🔹 5. Testing AI Campaign Simulation Tool...');
  const sim = simulateGamificationCampaignTool({
    config: { id: 'c1', title: 'Festive Wheel', type: 'spin_wheel', trigger: 'exit_intent', slices },
    totalSimulations: 100,
  });
  assert.strictEqual(sim.simulationsRun, 100);
  assert.strictEqual(sim.distribution.length, 3);
  console.log('✅ AI Campaign Simulation passed!');

  console.log('\n🎉 ALL 5 TEST STAGES FOR @boostengine/gamification PASSED (100% SUCCESS)!');
} catch (err) {
  console.error('\n❌ Test failed:', err);
  process.exit(1);
}
