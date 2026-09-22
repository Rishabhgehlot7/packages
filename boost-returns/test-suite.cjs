'use strict';
const { BoostReturnsManager } = require('./dist/index.js');
let passed = 0, failed = 0;
function test(name, fn) { try { fn(); console.log(`  ✅ ${name}`); passed++; } catch(e) { console.error(`  ❌ ${name}: ${e.message}`); failed++; } }
function assert(c, m) { if (!c) throw new Error(m || 'Assertion failed'); }

console.log('\n🧪 @boostengine/returns — Test Suite\n');
console.log('── BoostReturnsManager ──');

test('createReturn: generates RMA id', () => {
  const mgr = new BoostReturnsManager();
  const r = mgr.createReturn({ orderId: 'ORD1', customerId: 'C1', items: [{ productId:'P1', productName:'Shoe', quantity:1, unitPrice:500, reason:'defective' }] });
  assert(r.id.startsWith('RMA-'), `Expected RMA- prefix, got ${r.id}`);
  assert(r.status === 'requested');
});

test('createReturn: refundAmount calculated correctly', () => {
  const mgr = new BoostReturnsManager();
  const r = mgr.createReturn({ orderId: 'ORD2', customerId: 'C1', items: [{ productId:'P1', productName:'Shoe', quantity:2, unitPrice:500, reason:'wrong_item' }] });
  assert(r.refundAmount === 1000, `Expected 1000, got ${r.refundAmount}`);
});

test('createReturn: autoApprove policy works', () => {
  const mgr = new BoostReturnsManager({ autoApprove: true });
  const r = mgr.createReturn({ orderId: 'ORD3', customerId: 'C1', items: [{ productId:'P1', productName:'T-shirt', quantity:1, unitPrice:200, reason:'size_fit_issue' }] });
  assert(r.status === 'approved', `Expected approved, got ${r.status}`);
});

test('approveReturn: changes status to approved', () => {
  const mgr = new BoostReturnsManager();
  const r = mgr.createReturn({ orderId: 'ORD4', customerId: 'C1', items: [{ productId:'P1', productName:'T-shirt', quantity:1, unitPrice:200, reason:'defective' }] });
  mgr.approveReturn(r.id);
  assert(mgr.getReturn(r.id)?.status === 'approved');
});

test('rejectReturn: changes status and sets adminNote', () => {
  const mgr = new BoostReturnsManager();
  const r = mgr.createReturn({ orderId: 'ORD5', customerId: 'C1', items: [{ productId:'P1', productName:'Item', quantity:1, unitPrice:100, reason:'changed_mind' }] });
  mgr.rejectReturn(r.id, 'Outside return window');
  assert(mgr.getReturn(r.id)?.status === 'rejected');
  assert(mgr.getReturn(r.id)?.adminNote === 'Outside return window');
});

test('full lifecycle: requested → approved → picked_up → refunded', () => {
  const mgr = new BoostReturnsManager();
  const r = mgr.createReturn({ orderId: 'ORD6', customerId: 'C2', items: [{ productId:'P2', productName:'Pants', quantity:1, unitPrice:800, reason:'defective' }] });
  mgr.approveReturn(r.id);
  mgr.schedulePickup(r.id, { provider: 'shiprocket' });
  mgr.markPickedUp(r.id, 'AWB123');
  mgr.markReceived(r.id);
  mgr.processRefund(r.id);
  assert(mgr.getReturn(r.id)?.status === 'refunded');
  assert(mgr.getReturn(r.id)?.timeline.length === 6, `Expected 6 timeline entries, got ${mgr.getReturn(r.id)?.timeline.length}`);
});

test('return:created event fires', () => {
  const mgr = new BoostReturnsManager();
  let fired = false;
  mgr.on('return:created', () => { fired = true; });
  mgr.createReturn({ orderId: 'ORD7', customerId: 'C3', items: [{ productId:'P1', productName:'Item', quantity:1, unitPrice:100, reason:'other' }] });
  assert(fired, 'return:created did not fire');
});

test('return:refunded event fires with correct amount', () => {
  const mgr = new BoostReturnsManager({ autoApprove: true });
  let refundAmount = 0;
  mgr.on('return:refunded', ({ refundAmount: a }) => { refundAmount = a; });
  const r = mgr.createReturn({ orderId: 'ORD8', customerId: 'C4', items: [{ productId:'P1', productName:'Item', quantity:3, unitPrice:200, reason:'defective' }] });
  mgr.markPickedUp(r.id);
  mgr.markReceived(r.id);
  mgr.processRefund(r.id);
  assert(refundAmount === 600, `Expected 600, got ${refundAmount}`);
});

test('getReturnsByCustomer: returns correct subset', () => {
  const mgr = new BoostReturnsManager();
  mgr.createReturn({ orderId: 'ORD9',  customerId: 'alice', items: [{ productId:'P1', productName:'Item', quantity:1, unitPrice:100, reason:'other' }] });
  mgr.createReturn({ orderId: 'ORD10', customerId: 'bob',   items: [{ productId:'P2', productName:'Item2', quantity:1, unitPrice:200, reason:'wrong_item' }] });
  mgr.createReturn({ orderId: 'ORD11', customerId: 'alice', items: [{ productId:'P3', productName:'Item3', quantity:1, unitPrice:300, reason:'defective' }] });
  assert(mgr.getReturnsByCustomer('alice').length === 2);
  assert(mgr.getReturnsByCustomer('bob').length === 1);
});

test('getStats: totals correct', () => {
  const mgr = new BoostReturnsManager({ autoApprove: true });
  mgr.createReturn({ orderId: 'ORD12', customerId: 'C5', items: [{ productId:'P1', productName:'Item', quantity:1, unitPrice:500, reason:'defective' }] });
  mgr.createReturn({ orderId: 'ORD13', customerId: 'C5', items: [{ productId:'P1', productName:'Item', quantity:1, unitPrice:300, reason:'wrong_item' }] });
  const stats = mgr.getStats();
  assert(stats.total === 2, `Expected 2, got ${stats.total}`);
});

test('sync: loads external returns', () => {
  const mgr = new BoostReturnsManager();
  const other = new BoostReturnsManager();
  const r = other.createReturn({ orderId: 'ORD14', customerId: 'C6', items: [{ productId:'P1', productName:'Item', quantity:1, unitPrice:100, reason:'other' }] });
  mgr.sync([r]);
  assert(mgr.getReturn(r.id) !== undefined);
});

test('exchange type supported', () => {
  const mgr = new BoostReturnsManager();
  const r = mgr.createReturn({ orderId: 'ORD15', customerId: 'C7', items: [{ productId:'P1', productName:'Shoe', quantity:1, unitPrice:700, reason:'size_fit_issue' }], type: 'exchange' });
  assert(r.type === 'exchange');
});

test('dispatchExchange: sets exchangeOrderId', () => {
  const mgr = new BoostReturnsManager({ autoApprove: true });
  const r = mgr.createReturn({ orderId: 'ORD16', customerId: 'C8', items: [{ productId:'P1', productName:'Item', quantity:1, unitPrice:100, reason:'wrong_item' }], type: 'exchange' });
  mgr.dispatchExchange(r.id, 'EXC-001');
  assert(mgr.getReturn(r.id)?.exchangeOrderId === 'EXC-001');
  assert(mgr.getReturn(r.id)?.status === 'exchange_dispatched');
});

test('getReturnsByOrder: finds returns by orderId', () => {
  const mgr = new BoostReturnsManager();
  mgr.createReturn({ orderId: 'ORD-SAME', customerId: 'C9', items: [{ productId:'P1', productName:'Item', quantity:1, unitPrice:100, reason:'other' }] });
  mgr.createReturn({ orderId: 'ORD-SAME', customerId: 'C9', items: [{ productId:'P2', productName:'Item2', quantity:1, unitPrice:200, reason:'defective' }], type: 'partial_return' });
  assert(mgr.getReturnsByOrder('ORD-SAME').length === 2);
});

console.log(`\n${'─'.repeat(45)}`);
console.log(`Total: ${passed+failed} | ✅ ${passed} | ❌ ${failed}`);
if (failed > 0) { console.error('\n💥 Tests failed!\n'); process.exit(1); }
else { console.log('\n🎉 All tests passed!\n'); }
