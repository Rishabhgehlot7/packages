// @boostengine/loyalty — Test Suite
'use strict';

const { LoyaltyEngine, BoostLoyaltyManager } = require('./dist/index.js');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    console.error(`  ❌ ${name}`);
    console.error(`     ${e.message}`);
    failed++;
  }
}

function assert(condition, msg) {
  if (!condition) throw new Error(msg || 'Assertion failed');
}

console.log('\n🧪 @boostengine/loyalty — Test Suite\n');

// ── BACKWARD COMPAT: LoyaltyEngine static methods ────────────────────────────
console.log('── Static LoyaltyEngine (Backward Compat) ──');

test('determineTier: Bronze < 200', () => assert(LoyaltyEngine.determineTier(100) === 'Bronze'));
test('determineTier: Silver 200-499', () => assert(LoyaltyEngine.determineTier(300) === 'Silver'));
test('determineTier: Gold 500-999', () => assert(LoyaltyEngine.determineTier(700) === 'Gold'));
test('determineTier: SuperStar >= 1000', () => assert(LoyaltyEngine.determineTier(1500) === 'SuperStar'));

test('getTierPerks: Bronze multiplier 1x', () => {
  assert(LoyaltyEngine.getTierPerks('Bronze').coinMultiplier === 1.0);
});
test('getTierPerks: SuperStar multiplier 2x', () => {
  assert(LoyaltyEngine.getTierPerks('SuperStar').coinMultiplier === 2.0);
});
test('getTierPerks: Gold freeExpressShipping', () => {
  assert(LoyaltyEngine.getTierPerks('Gold').freeExpressShipping === true);
});
test('getTierPerks: Silver no earlyAccess', () => {
  assert(LoyaltyEngine.getTierPerks('Silver').earlyAccessDeals === false);
});

test('calculateCoinsEarned: Bronze ₹1000 = 20 coins', () => {
  assert(LoyaltyEngine.calculateCoinsEarned(1000, 'Bronze') === 20);
});
test('calculateCoinsEarned: Gold ₹1000 = 30 coins', () => {
  assert(LoyaltyEngine.calculateCoinsEarned(1000, 'Gold') === 30);
});

test('calculateRedemption: 20% cap', () => {
  const q = LoyaltyEngine.calculateRedemption(1000, 500);
  assert(q.maxRedeemableCoins === 200, `Expected 200, got ${q.maxRedeemableCoins}`);
  assert(q.rupeeDiscount === 200, `Discount should be 200`);
  assert(q.payableAfterDiscount === 800, `Payable should be 800`);
});

test('createProfile: initializes with welcome coins', () => {
  const p = LoyaltyEngine.createProfile('test', 150);
  assert(p.balance === 150);
  assert(p.tier === 'Bronze', `Expected Bronze for 150 coins, got ${p.tier}`);
});

// ── BoostLoyaltyManager ───────────────────────────────────────────────────────
console.log('\n── BoostLoyaltyManager ──');

test('createProfile: creates and returns profile', () => {
  const mgr = new BoostLoyaltyManager();
  const p   = mgr.createProfile('u1');
  assert(p.customerId === 'u1');
  assert(p.balance === 50); // default welcomeCoins
});

test('createProfile: idempotent (same profile returned)', () => {
  const mgr = new BoostLoyaltyManager();
  mgr.createProfile('u2');
  const p = mgr.createProfile('u2');
  assert(p.customerId === 'u2');
  assert(mgr.getAllProfiles().length === 1);
});

test('earnCoins: increases balance and lifetimeEarned', () => {
  const mgr = new BoostLoyaltyManager({ welcomeCoins: 0 });
  mgr.createProfile('u3');
  mgr.earnCoins('u3', 1000);
  const p = mgr.getProfile('u3');
  assert(p.balance === 20);
  assert(p.lifetimeEarned === 20);
});

test('tier:upgraded event fires on earning enough coins', done => {
  const mgr = new BoostLoyaltyManager({ welcomeCoins: 0 });
  let upgraded = false;
  mgr.on('tier:upgraded', () => { upgraded = true; });
  mgr.createProfile('u4');
  mgr.earnCoins('u4', 15000); // should push past 200 threshold → Silver
  assert(upgraded, 'tier:upgraded event did not fire');
});

test('redeemCoins: decreases balance and records tx', () => {
  const mgr = new BoostLoyaltyManager({ welcomeCoins: 200 });
  mgr.createProfile('u5');
  mgr.redeemCoins('u5', 100, 'ORD-X');
  const p = mgr.getProfile('u5');
  assert(p.balance === 100);
  const tx = p.transactions.find(t => t.type === 'redeem');
  assert(tx !== undefined, 'Redeem transaction not found');
});

test('redeemCoins: throws on insufficient balance', () => {
  const mgr = new BoostLoyaltyManager({ welcomeCoins: 10 });
  mgr.createProfile('u6');
  let threw = false;
  try { mgr.redeemCoins('u6', 500); } catch { threw = true; }
  assert(threw, 'Should have thrown');
});

test('adjustCoins: positive adjustment works', () => {
  const mgr = new BoostLoyaltyManager({ welcomeCoins: 0 });
  mgr.createProfile('u7');
  mgr.adjustCoins('u7', 300, 'Birthday bonus');
  assert(mgr.getProfile('u7').balance === 300);
});

test('challenge:completed fires and awards bonus coins', () => {
  const mgr = new BoostLoyaltyManager({ welcomeCoins: 0, earnRatePerHundred: 2 });
  let completed = false;
  mgr.on('challenge:completed', () => { completed = true; });
  mgr.addChallenge({
    id: 'c1', name: 'Test', description: '', targetValue: 1000, metric: 'spend',
    bonusCoins: 100, startsAt: new Date(), endsAt: new Date(Date.now() + 86400_000),
  });
  mgr.createProfile('u8');
  mgr.joinChallenge('u8', 'c1');
  mgr.earnCoins('u8', 1000); // spend = 1000 → completes challenge
  assert(completed, 'challenge:completed event not fired');
  const p = mgr.getProfile('u8');
  assert(p.balance >= 120, `Expected >= 120, got ${p.balance}`); // 20 earned + 100 bonus
});

test('getLeaderboard: ranked by lifetimeEarned', () => {
  const mgr = new BoostLoyaltyManager({ welcomeCoins: 0 });
  mgr.createProfile('a'); mgr.earnCoins('a', 3000);
  mgr.createProfile('b'); mgr.earnCoins('b', 5000);
  mgr.createProfile('c'); mgr.earnCoins('c', 1000);
  const board = mgr.getLeaderboard(3);
  assert(board[0].customerId === 'b', 'b should be rank 1');
  assert(board[1].customerId === 'a', 'a should be rank 2');
});

test('sync: loads external profiles', () => {
  const mgr = new BoostLoyaltyManager();
  mgr.sync([LoyaltyEngine.createProfile('synced', 999)]);
  const p = mgr.getProfile('synced');
  assert(p !== undefined, 'Synced profile not found');
  assert(p.tier === 'Gold', `Expected Gold, got ${p.tier}`);
});

test('getRedemptionQuote: correct discount calc', () => {
  const mgr = new BoostLoyaltyManager({ welcomeCoins: 500 });
  mgr.createProfile('u9');
  const q = mgr.getRedemptionQuote('u9', 1000);
  assert(q.maxRedeemableCoins === 200, `Expected 200, got ${q.maxRedeemableCoins}`);
  assert(q.rupeeDiscount === 200);
});

// ── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n${'─'.repeat(45)}`);
console.log(`Total: ${passed + failed} | ✅ Passed: ${passed} | ❌ Failed: ${failed}`);
if (failed > 0) { console.error('\n💥 Some tests failed!\n'); process.exit(1); }
else            { console.log('\n🎉 All tests passed!\n');              }
