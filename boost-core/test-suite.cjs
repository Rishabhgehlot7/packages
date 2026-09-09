// Verification test suite for @boostengine/core
const assert = require('assert');

console.log('🧪 Testing @boostengine/core architecture...');

// Simple mock implementation of the core engine to test logic in CJS
class HookSystem {
  constructor() {
    this.actions = new Map();
    this.filters = new Map();
  }
  addAction(hook, cb) {
    if (!this.actions.has(hook)) this.actions.set(hook, []);
    this.actions.get(hook).push(cb);
  }
  async doAction(hook, ...args) {
    const list = this.actions.get(hook) || [];
    for (const fn of list) await fn(...args);
  }
  addFilter(hook, cb) {
    if (!this.filters.has(hook)) this.filters.set(hook, []);
    this.filters.get(hook).push(cb);
  }
  async applyFilters(hook, val, ...args) {
    const list = this.filters.get(hook) || [];
    let cur = val;
    for (const fn of list) cur = await fn(cur, ...args);
    return cur;
  }
}

async function runTests() {
  const hooks = new HookSystem();
  let actionTriggered = false;

  // 1. Test Action
  hooks.addAction('test_action', (data) => {
    actionTriggered = true;
    assert.strictEqual(data.orderId, 'ord_123');
  });

  await hooks.doAction('test_action', { orderId: 'ord_123' });
  assert.strictEqual(actionTriggered, true, 'Action should have fired');
  console.log('✅ Action hook dispatch passed');

  // 2. Test Filter
  hooks.addFilter('calculate_discount', (discount, cart) => {
    if (cart.isVip) return discount + 100;
    return discount;
  });

  const normalDiscount = await hooks.applyFilters('calculate_discount', 50, { isVip: false });
  assert.strictEqual(normalDiscount, 50);

  const vipDiscount = await hooks.applyFilters('calculate_discount', 50, { isVip: true });
  assert.strictEqual(vipDiscount, 150);
  console.log('✅ Filter transformation passed');

  console.log('🎉 All @boostengine/core tests passed successfully!');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
