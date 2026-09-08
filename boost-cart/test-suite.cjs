const assert = require('assert');
const { BoostCart, createBoostCart, GSTCalculator } = require('./dist/index.cjs');

console.log('🧪 Running @boostengine/cart Test Suite...\n');

let passed = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ Passed: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ Failed: ${name}`);
    console.error(err);
    process.exit(1);
  }
}

// Test 1: Item Addition & Quantity Deduplication
test('Item addition and quantity updates', () => {
  const cart = createBoostCart();
  cart.addItem({
    productId: 'prod_tee',
    variantId: 'size_l',
    title: 'Oversized Anime Tee',
    price: 999,
    compareAtPrice: 1499,
    quantity: 1,
  });

  // Adding same product/variant increments quantity
  cart.addItem({
    productId: 'prod_tee',
    variantId: 'size_l',
    title: 'Oversized Anime Tee',
    price: 999,
    compareAtPrice: 1499,
    quantity: 2,
  });

  const items = cart.getItems();
  assert.strictEqual(items.length, 1);
  assert.strictEqual(items[0].quantity, 3);

  const summary = cart.getSummary();
  assert.strictEqual(summary.subtotal, 2997);
  assert.strictEqual(summary.totalMRP, 4497);
  assert.strictEqual(summary.totalSavings, 1500); // 4497 - 2997
});

// Test 2: Free Shipping Progress Bar
test('Free shipping progress calculation', () => {
  const cart = createBoostCart({
    shipping: { freeShippingThreshold: 1000, flatShippingRate: 80 },
  });

  cart.addItem({ productId: 'p1', title: 'Cap', price: 600, quantity: 1 });
  let summary = cart.getSummary();

  assert.strictEqual(summary.freeShipping.isEligible, false);
  assert.strictEqual(summary.freeShipping.percentage, 60);
  assert.strictEqual(summary.freeShipping.amountRemaining, 400);
  assert.strictEqual(summary.shippingFee, 80);

  // Add another item to cross 1000
  cart.addItem({ productId: 'p2', title: 'Socks', price: 450, quantity: 1 });
  summary = cart.getSummary();

  assert.strictEqual(summary.freeShipping.isEligible, true);
  assert.strictEqual(summary.freeShipping.percentage, 100);
  assert.strictEqual(summary.freeShipping.amountRemaining, 0);
  assert.strictEqual(summary.shippingFee, 0);
});

// Test 3: Intra-State GST (CGST + SGST)
test('Intra-state Indian GST calculation (CGST + SGST split)', () => {
  const cart = createBoostCart({
    origin: { state: 'Maharashtra', taxMode: 'inclusive' },
    destination: { state: 'MH' }, // Intra-state
  });

  cart.addItem({
    productId: 'p_tech',
    title: 'Mechanical Keyboard',
    price: 1180, // Inclusive 18% GST -> 1000 taxable + 180 GST
    taxRate: 18,
    hsnCode: '8471',
    quantity: 1,
  });

  const summary = cart.getSummary();
  assert.strictEqual(summary.gst.taxType, 'INTRA_STATE');
  assert.strictEqual(summary.gst.taxableAmount, 1000);
  assert.strictEqual(summary.gst.totalTax, 180);
  assert.strictEqual(summary.gst.cgst, 90);
  assert.strictEqual(summary.gst.sgst, 90);
  assert.strictEqual(summary.gst.igst, 0);
  assert.strictEqual(summary.gst.hsnBreakdown[0].hsnCode, '8471');
});

// Test 4: Inter-State GST (IGST)
test('Inter-state Indian GST calculation (IGST only)', () => {
  const cart = createBoostCart({
    origin: { state: 'Maharashtra', taxMode: 'inclusive' },
    destination: { state: 'Delhi' }, // Inter-state
  });

  cart.addItem({
    productId: 'p_tech',
    title: 'Mechanical Keyboard',
    price: 1180,
    taxRate: 18,
    quantity: 1,
  });

  const summary = cart.getSummary();
  assert.strictEqual(summary.gst.taxType, 'INTER_STATE');
  assert.strictEqual(summary.gst.totalTax, 180);
  assert.strictEqual(summary.gst.cgst, 0);
  assert.strictEqual(summary.gst.sgst, 0);
  assert.strictEqual(summary.gst.igst, 180);
});

// Test 5: COD Surcharge and Discount Application
test('COD Fee & Coupon Discount calculation', () => {
  const cart = createBoostCart({
    shipping: { freeShippingThreshold: 2000, flatShippingRate: 100 },
    payment: { paymentMethod: 'cod', codFee: 50 },
  });

  cart.addItem({ productId: 'p1', title: 'Bag', price: 1500, quantity: 1 });
  cart.applyDiscount({ code: 'SAVE200', amount: 200 });

  const summary = cart.getSummary();
  // subtotal: 1500, discount: 200, shipping: 100 (<2000), codFee: 50
  // total: 1500 - 200 + 100 + 50 = 1450
  assert.strictEqual(summary.subtotal, 1500);
  assert.strictEqual(summary.discount.amount, 200);
  assert.strictEqual(summary.shippingFee, 100);
  assert.strictEqual(summary.codFee, 50);
  assert.strictEqual(summary.finalTotal, 1450);
});

// Test 6: Serialization to JSON & Rehydration
test('Cart serialization toJSON & fromJSON', () => {
  const cart1 = createBoostCart();
  cart1.addItem({ productId: 'p1', title: 'Watch', price: 2999, quantity: 2 });
  cart1.applyDiscount({ code: 'OFF100', amount: 100 });

  const savedState = cart1.toJSON();

  const cart2 = createBoostCart();
  cart2.fromJSON(savedState);

  const summary = cart2.getSummary();
  assert.strictEqual(summary.items.length, 1);
  assert.strictEqual(summary.items[0].quantity, 2);
  assert.strictEqual(summary.subtotal, 5998);
  assert.strictEqual(summary.discount.code, 'OFF100');
});

console.log(`\n🎉 All ${passed} tests in @boostengine/cart passed successfully!\n`);
