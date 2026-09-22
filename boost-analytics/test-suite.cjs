'use strict';
const { BoostAnalyticsManager } = require('./dist/index.js');
let passed = 0, failed = 0;
function test(name, fn) { try { fn(); console.log(`  ✅ ${name}`); passed++; } catch(e) { console.error(`  ❌ ${name}: ${e.message}`); failed++; } }
function assert(c, m) { if (!c) throw new Error(m || 'Assertion failed'); }

console.log('\n🧪 @boostengine/analytics — Test Suite\n');
console.log('── BoostAnalyticsManager ──');

test('trackEvent: creates session on first event', () => {
  const mgr = new BoostAnalyticsManager();
  mgr.trackEvent('page_view', 'sess1');
  assert(mgr.getSession('sess1') !== undefined);
});

test('trackEvent: multiple events in same session', () => {
  const mgr = new BoostAnalyticsManager();
  mgr.trackEvent('page_view', 'sess2');
  mgr.trackEvent('product_view', 'sess2');
  mgr.trackEvent('add_to_cart', 'sess2');
  assert(mgr.getSession('sess2')?.events.length === 3);
});

test('trackEvent: purchase marks session as converted', () => {
  const mgr = new BoostAnalyticsManager();
  mgr.trackEvent('purchase', 'sess3');
  assert(mgr.getSession('sess3')?.converted === true);
});

test('recordSale: increases total revenue', () => {
  const mgr = new BoostAnalyticsManager();
  mgr.recordSale({ orderId: 'ORD1', sessionId: 'sess4', revenue: 1500, items: [{ productId:'P1', productName:'Shoe', quantity:1, price:1500 }] });
  assert(mgr.getKPIs().totalRevenue === 1500);
});

test('recordSale: tracks multiple orders correctly', () => {
  const mgr = new BoostAnalyticsManager();
  mgr.recordSale({ orderId: 'ORD2', sessionId: 'sess5', revenue: 1000, items: [{ productId:'P1', productName:'Item', quantity:2, price:500 }] });
  mgr.recordSale({ orderId: 'ORD3', sessionId: 'sess6', revenue: 2000, items: [{ productId:'P2', productName:'Item2', quantity:1, price:2000 }] });
  const kpis = mgr.getKPIs();
  assert(kpis.totalOrders === 2);
  assert(kpis.totalRevenue === 3000);
  assert(kpis.averageOrderValue === 1500);
});

test('getKPIs: AOV calculated correctly', () => {
  const mgr = new BoostAnalyticsManager();
  mgr.recordSale({ orderId: 'ORD4', sessionId: 's1', revenue: 500,  items: [] });
  mgr.recordSale({ orderId: 'ORD5', sessionId: 's2', revenue: 1500, items: [] });
  assert(mgr.getKPIs().averageOrderValue === 1000);
});

test('getKPIs: CVR 100% when all sessions convert', () => {
  const mgr = new BoostAnalyticsManager();
  mgr.recordSale({ orderId: 'ORD6', sessionId: 's3', revenue: 500, items: [] });
  assert(mgr.getKPIs().conversionRate === 100);
});

test('getKPIs: CVR 50% with 2 sessions 1 converted', () => {
  const mgr = new BoostAnalyticsManager();
  mgr.trackEvent('page_view', 's4');       // non-converting session
  mgr.recordSale({ orderId: 'ORD7', sessionId: 's5', revenue: 500, items: [] });
  assert(mgr.getKPIs().conversionRate === 50);
});

test('getFunnelStats: tracks funnel steps', () => {
  const mgr = new BoostAnalyticsManager();
  mgr.trackEvent('product_view',      'sf1');
  mgr.trackEvent('add_to_cart',       'sf1');
  mgr.trackEvent('checkout_started',  'sf1');
  mgr.trackEvent('checkout_completed','sf1');
  const funnel = mgr.getFunnelStats();
  const pvStep = funnel.steps.find(s => s.step === 'product_view');
  assert(pvStep?.count === 1, `Expected 1 product_view, got ${pvStep?.count}`);
  assert(funnel.overallConversionRate === 100);
});

test('getTopProducts: sorted by revenue', () => {
  const mgr = new BoostAnalyticsManager();
  mgr.recordSale({ orderId: 'ORD8', sessionId: 'st1', revenue: 3000, items: [{ productId:'PA', productName:'A', quantity:1, price:3000 }, { productId:'PB', productName:'B', quantity:1, price:500 }] });
  const top = mgr.getTopProducts(2);
  assert(top[0].productId === 'PA', `Expected PA first, got ${top[0].productId}`);
});

test('event:tracked event fires', () => {
  const mgr = new BoostAnalyticsManager();
  let fired = false;
  mgr.on('event:tracked', () => { fired = true; });
  mgr.trackEvent('page_view', 'sev1');
  assert(fired, 'event:tracked did not fire');
});

test('sale:recorded event fires', () => {
  const mgr = new BoostAnalyticsManager();
  let revenue = 0;
  mgr.on('sale:recorded', ({ revenue: r }) => { revenue = r; });
  mgr.recordSale({ orderId: 'ORD9', sessionId: 'sev2', revenue: 999, items: [] });
  assert(revenue === 999);
});

test('funnel:converted fires on purchase', () => {
  const mgr = new BoostAnalyticsManager();
  let fired = false;
  mgr.on('funnel:converted', () => { fired = true; });
  mgr.recordSale({ orderId: 'ORD10', sessionId: 'sev3', revenue: 500, items: [] });
  assert(fired, 'funnel:converted did not fire');
});

test('sync and export work correctly', () => {
  const mgr1 = new BoostAnalyticsManager();
  mgr1.trackEvent('page_view', 'sync1');
  mgr1.recordSale({ orderId: 'ORD11', sessionId: 'sync1', revenue: 100, items: [] });
  const { sessions, sales } = mgr1.export();
  const mgr2 = new BoostAnalyticsManager();
  mgr2.sync(sessions, sales);
  assert(mgr2.getKPIs().totalOrders === 1);
});

test('RPV: revenue per visit calculated', () => {
  const mgr = new BoostAnalyticsManager();
  mgr.trackEvent('page_view', 'rpv1');
  mgr.trackEvent('page_view', 'rpv2');
  mgr.recordSale({ orderId: 'ORD12', sessionId: 'rpv1', revenue: 1000, items: [] });
  const kpis = mgr.getKPIs();
  assert(kpis.revenuePerVisit === 500, `Expected 500, got ${kpis.revenuePerVisit}`);
});

console.log(`\n${'─'.repeat(45)}`);
console.log(`Total: ${passed+failed} | ✅ ${passed} | ❌ ${failed}`);
if (failed > 0) { console.error('\n💥 Tests failed!\n'); process.exit(1); }
else { console.log('\n🎉 All tests passed!\n'); }
