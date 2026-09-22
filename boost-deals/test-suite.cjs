const assert = require('assert');

console.log('\x1b[36m%s\x1b[0m', '🧪 Running @boostengine/deals v1.1.0 Verification Test Suite...\n');

let DealsEngine, BoostDealsManager, deals, DealsAgentToolkit;

try {
  const pkg = require('./dist/index.js');
  DealsEngine = pkg.DealsEngine;
  BoostDealsManager = pkg.BoostDealsManager;
  deals = pkg.deals;
  DealsAgentToolkit = pkg.DealsAgentToolkit;
} catch (e) {
  console.error('\x1b[31m%s\x1b[0m', 'Failed to load dist/index.js. Ensure "npm run build" ran first.');
  console.error(e);
  process.exit(1);
}

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  \x1b[32m✓\x1b[0m ${name}`);
    passed++;
  } catch (err) {
    console.error(`  \x1b[31m✗\x1b[0m ${name}`);
    console.error(err);
    failed++;
  }
}

// 1. Backward Compatibility: calculateTimeRemaining
test('DealsEngine.calculateTimeRemaining returns formatted countdown', () => {
  const future = new Date(Date.now() + 3600 * 1000 * 2).toISOString(); // 2 hours
  const res = DealsEngine.calculateTimeRemaining(future);
  assert.strictEqual(res.isExpired, false);
  assert.strictEqual(res.hours >= 1, true);

  const past = new Date(Date.now() - 1000).toISOString();
  const pastRes = DealsEngine.calculateTimeRemaining(past);
  assert.strictEqual(pastRes.isExpired, true);
  assert.strictEqual(pastRes.seconds, 0);
});

// 2. Backward Compatibility: calculateClaimInfo
test('DealsEngine.calculateClaimInfo calculates percentage, sold-out status & remaining claims', () => {
  const info50 = DealsEngine.calculateClaimInfo(50, 100);
  assert.strictEqual(info50.percentageClaimed, 50);
  assert.strictEqual(info50.isSoldOut, false);
  assert.strictEqual(info50.remainingClaims, 50);

  const info100 = DealsEngine.calculateClaimInfo(100, 100);
  assert.strictEqual(info100.percentageClaimed, 100);
  assert.strictEqual(info100.isSoldOut, true);
  assert.strictEqual(info100.remainingClaims, 0);

  const unlimited = DealsEngine.calculateClaimInfo(25);
  assert.strictEqual(unlimited.percentageClaimed, 0);
  assert.strictEqual(unlimited.isSoldOut, false);
});

// 3. Backward Compatibility: computeDealPrice
test('DealsEngine.computeDealPrice computes percentage & fixed discount', () => {
  const pctDeal = {
    id: 'd1',
    title: '20% Off',
    type: 'percentage',
    discountValue: 20,
    startDate: '',
    endDate: ''
  };
  const calc1 = DealsEngine.computeDealPrice(100, pctDeal);
  assert.strictEqual(calc1.dealPrice, 80);
  assert.strictEqual(calc1.savings, 20);
  assert.strictEqual(calc1.discountPercentage, 20);

  const fixedDeal = {
    id: 'd2',
    title: '$15 Off',
    type: 'fixed_discount',
    discountValue: 15,
    startDate: '',
    endDate: ''
  };
  const calc2 = DealsEngine.computeDealPrice(50, fixedDeal);
  assert.strictEqual(calc2.dealPrice, 35);
  assert.strictEqual(calc2.savings, 15);
});

// 4. BoostDealsManager Registration & Lookup
test('BoostDealsManager registers and retrieves deals', () => {
  const mgr = new BoostDealsManager();
  mgr.registerDeal({
    id: 'deal_shoe',
    title: 'Running Shoes Sale',
    type: 'percentage',
    discountValue: 10,
    startDate: '2026-01-01T00:00:00Z',
    endDate: '2026-12-31T23:59:59Z'
  });

  const found = mgr.getDeal('deal_shoe');
  assert.ok(found);
  assert.strictEqual(found.title, 'Running Shoes Sale');
  assert.strictEqual(found.claimedCount, 0);
});

// 5. Active and Upcoming Deals filtering
test('BoostDealsManager lists active vs upcoming deals based on dates', () => {
  const mgr = new BoostDealsManager();
  const now = Date.now();

  mgr.registerDeal({
    id: 'active_1',
    title: 'Current Deal',
    type: 'percentage',
    discountValue: 10,
    startDate: new Date(now - 10000).toISOString(),
    endDate: new Date(now + 100000).toISOString()
  });

  mgr.registerDeal({
    id: 'upcoming_1',
    title: 'Future Black Friday',
    type: 'percentage',
    discountValue: 50,
    startDate: new Date(now + 200000).toISOString(),
    endDate: new Date(now + 300000).toISOString()
  });

  const active = mgr.listActiveDeals();
  assert.strictEqual(active.length, 1);
  assert.strictEqual(active[0].id, 'active_1');

  const upcoming = mgr.listUpcomingDeals();
  assert.strictEqual(upcoming.length, 1);
  assert.strictEqual(upcoming[0].id, 'upcoming_1');
});

// 6. Lightning Deal Claim Reservation with TTL hold
test('reserveClaim locks claims and releases upon cancel/commit', () => {
  const mgr = new BoostDealsManager();
  const now = Date.now();
  mgr.registerDeal({
    id: 'flash_ps5',
    title: 'PS5 Lightning Deal',
    type: 'flash_sale',
    discountValue: 30,
    startDate: new Date(now - 5000).toISOString(),
    endDate: new Date(now + 50000).toISOString(),
    totalClaimLimit: 2,
    claimedCount: 0
  });

  const res1 = mgr.reserveClaim('flash_ps5', 'user_1', 1, 60);
  assert.ok(res1.reservationId);
  assert.strictEqual(mgr.getDeal('flash_ps5').claimedCount, 1);

  // Release reservation
  mgr.releaseClaim(res1.reservationId);
  assert.strictEqual(mgr.getDeal('flash_ps5').claimedCount, 0);

  // Re-reserve and commit
  const res2 = mgr.reserveClaim('flash_ps5', 'user_2', 2, 60);
  assert.strictEqual(mgr.getDeal('flash_ps5').claimedCount, 2);
  mgr.commitClaim(res2.reservationId);
  assert.strictEqual(mgr.getDeal('flash_ps5').claimedCount, 2);

  // Now sold out - attempting to reserve should throw
  assert.throws(() => {
    mgr.reserveClaim('flash_ps5', 'user_3', 1, 60);
  }, /Sold out/);
});

// 7. Bot & Scalper Protection (maxClaimsPerUser)
test('reserveClaim enforces maxClaimsPerUser', () => {
  const mgr = new BoostDealsManager();
  const now = Date.now();
  mgr.registerDeal({
    id: 'flash_limited',
    title: '1 per customer deal',
    type: 'flash_sale',
    discountValue: 50,
    startDate: new Date(now - 5000).toISOString(),
    endDate: new Date(now + 50000).toISOString(),
    totalClaimLimit: 10,
    maxClaimsPerUser: 1, // Only 1 allowed per user
    claimedCount: 0
  });

  // First claim succeeds
  mgr.reserveClaim('flash_limited', 'user_hacker', 1, 60);

  // Second claim by same user fails!
  assert.throws(() => {
    mgr.reserveClaim('flash_limited', 'user_hacker', 1, 60);
  }, /limit of 1 claim\(s\) per customer reached/);

  // Different user succeeds
  const resOther = mgr.reserveClaim('flash_limited', 'user_honest', 1, 60);
  assert.ok(resOther.reservationId);
});

// 8. Auto-sweep expired reservations
test('sweepExpiredReservations frees up unclaimed slots', () => {
  const mgr = new BoostDealsManager();
  const now = Date.now();
  mgr.registerDeal({
    id: 'flash_exp',
    title: 'Expiring Deal',
    type: 'flash_sale',
    discountValue: 20,
    startDate: new Date(now - 5000).toISOString(),
    endDate: new Date(now + 50000).toISOString(),
    totalClaimLimit: 5,
    claimedCount: 0
  });

  // Reserve with -1s TTL so it expires immediately
  mgr.reserveClaim('flash_exp', 'user_ghost', 2, -1);
  assert.strictEqual(mgr.getDeal('flash_exp').claimedCount, 2);

  const freed = mgr.sweepExpiredReservations();
  assert.strictEqual(freed, 2);
  assert.strictEqual(mgr.getDeal('flash_exp').claimedCount, 0);
});

// 9. BOGO Rule Evaluation in Cart
test('evaluateCartDeals calculates Buy 2 Get 1 Free', () => {
  const mgr = new BoostDealsManager();
  const now = Date.now();
  mgr.registerDeal({
    id: 'bogo_tee',
    title: 'BOGO Tees',
    type: 'bogo',
    discountValue: 0,
    startDate: new Date(now - 1000).toISOString(),
    endDate: new Date(now + 50000).toISOString(),
    applicableProductIds: ['tee_1'],
    bogoRule: {
      buyQuantity: 2,
      getQuantity: 1,
      discountPercentage: 100 // Free
    }
  });

  const cart = [{ productId: 'tee_1', unitPrice: 30, quantity: 3 }];
  const res = mgr.evaluateCartDeals(cart);

  // Original: 3 * 30 = 90. 1 item free = $30 savings. Discounted: 60.
  assert.strictEqual(res.originalSubtotal, 90);
  assert.strictEqual(res.totalSavings, 30);
  assert.strictEqual(res.discountedSubtotal, 60);
  assert.strictEqual(res.appliedDeals.length, 1);
});

// 10. Tiered Volume Discounts
test('evaluateCartDeals handles volume discount tiers', () => {
  const mgr = new BoostDealsManager();
  const now = Date.now();
  mgr.registerDeal({
    id: 'tier_socks',
    title: 'Bulk Socks Discount',
    type: 'tiered_volume',
    discountValue: 0,
    startDate: new Date(now - 1000).toISOString(),
    endDate: new Date(now + 50000).toISOString(),
    applicableProductIds: ['socks_1'],
    tiers: [
      { minQuantity: 3, discountPercentage: 10 },
      { minQuantity: 5, discountPercentage: 20 }
    ]
  });

  // 5 pairs @ $10 = $50. Tier matches 20% discount = $10 savings.
  const cart = [{ productId: 'socks_1', unitPrice: 10, quantity: 5 }];
  const res = mgr.evaluateCartDeals(cart);

  assert.strictEqual(res.originalSubtotal, 50);
  assert.strictEqual(res.totalSavings, 10);
  assert.strictEqual(res.discountedSubtotal, 40);
  assert.strictEqual(res.appliedDeals[0].dealType, 'tiered_volume');
});

// 11. Deal Exclusivity & Non-Stacking
test('evaluateCartDeals respects stackable=false and exclusive rules', () => {
  const mgr = new BoostDealsManager();
  const now = Date.now();

  // Non-stackable flash sale (30%)
  mgr.registerDeal({
    id: 'flash_non_stack',
    title: 'Exclusive Flash Sale',
    type: 'flash_sale',
    discountValue: 30,
    stackable: false,
    priority: 10,
    startDate: new Date(now - 1000).toISOString(),
    endDate: new Date(now + 50000).toISOString(),
    applicableProductIds: ['prod_vip']
  });

  // Secondary promo (10%)
  mgr.registerDeal({
    id: 'promo_extra',
    title: '10% Extra',
    type: 'percentage',
    discountValue: 10,
    priority: 5,
    startDate: new Date(now - 1000).toISOString(),
    endDate: new Date(now + 50000).toISOString(),
    applicableProductIds: ['prod_vip']
  });

  const cart = [{ productId: 'prod_vip', unitPrice: 100, quantity: 1 }];
  const res = mgr.evaluateCartDeals(cart);

  // Only the priority 10 deal should apply because stackable is false!
  assert.strictEqual(res.appliedDeals.length, 1);
  assert.strictEqual(res.appliedDeals[0].dealId, 'flash_non_stack');
  assert.strictEqual(res.totalSavings, 30);
});

// 12. Cart Spend Threshold Rule
test('evaluateCartDeals applies Spend Threshold promotion', () => {
  const mgr = new BoostDealsManager();
  const now = Date.now();
  mgr.registerDeal({
    id: 'spend_threshold_1',
    title: 'Spend $100 Get $15 Off',
    type: 'spend_threshold',
    discountValue: 15,
    startDate: new Date(now - 1000).toISOString(),
    endDate: new Date(now + 50000).toISOString(),
    spendThreshold: {
      minimumSpend: 100,
      discountAmount: 15
    }
  });

  const cart = [{ productId: 'item_x', unitPrice: 60, quantity: 2 }]; // $120 total
  const res = mgr.evaluateCartDeals(cart);

  assert.strictEqual(res.originalSubtotal, 120);
  assert.strictEqual(res.totalSavings, 15);
  assert.strictEqual(res.discountedSubtotal, 105);
});

// 13. Real-Time Event Emitter
test('BoostDealsManager emits real-time events for reservations & sold-out', () => {
  const mgr = new BoostDealsManager();
  const now = Date.now();
  let reservedEventFired = false;
  let soldOutEventFired = false;

  mgr.on('claim:reserved', (payload) => {
    reservedEventFired = payload.dealId === 'event_deal';
  });

  mgr.on('deal:sold_out', (payload) => {
    soldOutEventFired = payload.dealId === 'event_deal';
  });

  mgr.registerDeal({
    id: 'event_deal',
    title: 'Event Test Deal',
    type: 'flash_sale',
    discountValue: 20,
    startDate: new Date(now - 1000).toISOString(),
    endDate: new Date(now + 50000).toISOString(),
    totalClaimLimit: 1
  });

  mgr.reserveClaim('event_deal', 'user_eve', 1, 60);

  assert.strictEqual(reservedEventFired, true);
  assert.strictEqual(soldOutEventFired, true);
});

// 14. Universal DB Sync
test('Universal sync maps database records into deals', () => {
  const mgr = new BoostDealsManager();
  const mongoDbDocs = [
    { _id: 'm1', name: 'Spring Promo', pct: 15, validFrom: '2026-01-01', validTo: '2026-12-31' },
    { _id: 'm2', name: 'Summer Promo', pct: 25, validFrom: '2026-06-01', validTo: '2026-08-31' }
  ];

  const count = mgr.sync(mongoDbDocs, doc => ({
    id: doc._id,
    title: doc.name,
    type: 'percentage',
    discountValue: doc.pct,
    startDate: doc.validFrom,
    endDate: doc.validTo
  }));

  assert.strictEqual(count, 2);
  assert.strictEqual(mgr.getDeal('m1').title, 'Spring Promo');
  assert.strictEqual(mgr.getDeal('m1').discountValue, 15);
});

// 15. DealsAgentToolkit autonomous execution
test('DealsAgentToolkit generates schemas and executes tools', async () => {
  const mgr = new BoostDealsManager();
  const now = Date.now();
  mgr.registerDeal({
    id: 'ai_deal_1',
    title: 'AI Flash Deal',
    type: 'percentage',
    discountValue: 20,
    startDate: new Date(now - 1000).toISOString(),
    endDate: new Date(now + 50000).toISOString(),
    applicableProductIds: ['prod_laptop']
  });

  const toolkit = new DealsAgentToolkit(mgr);
  const tools = toolkit.getTools();
  assert.strictEqual(tools.length, 5);

  // Execute list_active_deals
  const listResult = await toolkit.executeTool('list_active_deals', {});
  assert.strictEqual(listResult.count, 1);
  assert.strictEqual(listResult.deals[0].id, 'ai_deal_1');

  // Execute get_product_deal
  const prodResult = await toolkit.executeTool('get_product_deal', {
    productId: 'prod_laptop',
    originalPrice: 1000
  });
  assert.strictEqual(prodResult.calculation.dealPrice, 800);
  assert.strictEqual(prodResult.calculation.savings, 200);
});

console.log(`\n\x1b[36mSummary:\x1b[0m ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('\x1b[32m%s\x1b[0m', '🎉 All 15 verification test assertions passed successfully!');
}
