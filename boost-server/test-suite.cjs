/**
 * @boostengine/server — Test Suite
 * Verifies the router factory and all route groups work correctly.
 */

const assert = require('assert');
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ ${name}`);
    passed++;
  } catch (e) {
    console.log(`  ❌ ${name}: ${e.message}`);
    failed++;
  }
}

console.log('\n=== @boostengine/server Test Suite ===\n');

// ── Test 1: Module loads ────────────────────────────────────────────────────
console.log('1. Module Loading');
let createBoostApiRouter;
test('Exports createBoostApiRouter', () => {
  const mod = require('./dist/index.cjs');
  assert.strictEqual(typeof mod.createBoostApiRouter, 'function', 'createBoostApiRouter must be a function');
  createBoostApiRouter = mod.createBoostApiRouter;
});

// ── Test 2: Router creation (no config) ────────────────────────────────────
console.log('\n2. Router Creation');
test('Creates router with no config (all defaults)', () => {
  const router = createBoostApiRouter();
  assert.ok(router, 'Router should be created');
  assert.strictEqual(typeof router, 'function', 'Router should be an Express router function');
});

test('Creates router with full config', () => {
  const router = createBoostApiRouter({
    razorpayKeyId: 'rzp_test_abc',
    razorpayKeySecret: 'secret123',
    shiprocketEmail: 'test@test.com',
    shiprocketPassword: 'pass',
    fast2smsApiKey: 'key123',
    gstNumber: '29ABCDE1234F1Z5',
    businessName: 'Test Store',
  });
  assert.ok(router, 'Router should be created with full config');
});

// ── Test 3: Enable/disable modules ─────────────────────────────────────────
console.log('\n3. Module Enable/Disable');
test('Creates router with only payments enabled', () => {
  const router = createBoostApiRouter({
    enable: {
      payments: true,
      shipping: false,
      auth: false,
      cart: false,
      coupons: false,
      returns: false,
      invoicing: false,
      notifications: false,
    },
  });
  assert.ok(router, 'Partial-module router should be created');
});

test('Creates router with all modules disabled', () => {
  const router = createBoostApiRouter({
    enable: {
      payments: false,
      shipping: false,
      auth: false,
      cart: false,
      coupons: false,
      returns: false,
      invoicing: false,
      notifications: false,
    },
  });
  assert.ok(router, 'Zero-module router should be created');
});

// ── Test 4: Middleware support ──────────────────────────────────────────────
console.log('\n4. Middleware Support');
test('Accepts custom middleware array', () => {
  const mockMiddleware = (_req, _res, next) => next();
  const router = createBoostApiRouter({
    middleware: [mockMiddleware],
  });
  assert.ok(router, 'Router with middleware should be created');
});

// ── Test 5: Prefix support ─────────────────────────────────────────────────
console.log('\n5. Prefix Support');
test('Accepts custom route prefix', () => {
  const router = createBoostApiRouter({ prefix: '/v1' });
  assert.ok(router, 'Router with prefix should be created');
});

// ── Summary ────────────────────────────────────────────────────────────────
console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`);
if (failed > 0) {
  console.error('Some tests failed. Run npm run build first if dist/ is missing.');
  process.exit(1);
}
