const assert = require('assert');

let pkg;
try {
  pkg = require('./dist/index.cjs');
} catch (e) {
  console.warn('⚠️ Note: dist/index.cjs not compiled yet. Run npm run build before running node test-suite.cjs.');
}

if (pkg) {
  const {
    BoostCart,
    createBoostCart,
    GSTCalculator,
    MemoryStorageAdapter,
    createMemoryStorageAdapter,
    CartAgentToolkit,
    CurrencyFormatter,
  } = pkg;

  console.log('🧪 Running @boostengine/cart Enterprise Test Suite...\n');

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

  // Test 1: Item Addition, Deduplication & Max Stock Capping
  test('Item addition, quantity deduplication & max stock enforcement', () => {
    const cart = createBoostCart();
    cart.addItem({
      productId: 'prod_tee',
      variantId: 'size_l',
      title: 'Oversized Anime Tee',
      price: 999,
      compareAtPrice: 1499,
      quantity: 1,
      maxStock: 5,
    });

    cart.addItem({
      productId: 'prod_tee',
      variantId: 'size_l',
      title: 'Oversized Anime Tee',
      price: 999,
      compareAtPrice: 1499,
      quantity: 2,
    });

    let items = cart.getItems();
    assert.strictEqual(items.length, 1);
    assert.strictEqual(items[0].quantity, 3);

    // Exceed max stock
    cart.addItem({
      productId: 'prod_tee',
      variantId: 'size_l',
      title: 'Oversized Anime Tee',
      price: 999,
      quantity: 10,
    });

    items = cart.getItems();
    assert.strictEqual(items[0].quantity, 5); // Capped at 5

    const summary = cart.getSummary();
    assert.strictEqual(summary.subtotal, 4995);
    assert.strictEqual(summary.totalMRP, 7495);
    assert.strictEqual(summary.totalSavings, 2500);
  });

  // Test 2: Free Shipping Progress Bar
  test('Free shipping progress calculation and formatting', () => {
    const cart = createBoostCart({
      shipping: { freeShippingThreshold: 1000, flatShippingRate: 80 },
    });

    cart.addItem({ productId: 'p1', title: 'Cap', price: 600, quantity: 1 });
    let summary = cart.getSummary();

    assert.strictEqual(summary.freeShipping.isEligible, false);
    assert.strictEqual(summary.freeShipping.percentage, 60);
    assert.strictEqual(summary.freeShipping.amountRemaining, 400);
    assert.strictEqual(summary.shippingFee, 80);

    // Cross threshold
    cart.addItem({ productId: 'p2', title: 'Socks', price: 450, quantity: 1 });
    summary = cart.getSummary();

    assert.strictEqual(summary.freeShipping.isEligible, true);
    assert.strictEqual(summary.freeShipping.percentage, 100);
    assert.strictEqual(summary.freeShipping.amountRemaining, 0);
    assert.strictEqual(summary.shippingFee, 0);
  });

  // Test 3: Advanced Discounts (Percentage, Max Cap & MOV)
  test('Percentage discount with maximum cap and Minimum Order Value', () => {
    const cart = createBoostCart();
    cart.addItem({ productId: 'p1', title: 'Jacket', price: 2000, quantity: 1 });

    const res = cart.applyDiscount({
      code: 'WINTER10',
      type: 'percentage',
      value: 10,
      maxDiscount: 150,
      minOrderValue: 1500,
    });

    assert.strictEqual(res.isValid, true);
    assert.strictEqual(res.amount, 150); // 10% of 2000 = 200, capped at 150

    // MOV rejection
    cart.updateQuantity('p1', 0);
    cart.addItem({ productId: 'p2', title: 'Keychain', price: 200, quantity: 1 });

    const failedRes = cart.applyDiscount({
      code: 'BIGDEAL',
      type: 'percentage',
      value: 20,
      minOrderValue: 500,
    });
    assert.strictEqual(failedRes.isValid, false);
    assert.ok(failedRes.error.includes('Minimum order value'));
  });

  // Test 4: BOGO Offers (Buy 2 Get 1 Free)
  test('BOGO promotional math (Buy 2 Get 1 Free on lowest priced item)', () => {
    const cart = createBoostCart();
    // Add 3 items with prices: 1000, 800, 600
    cart.addItem({ productId: 'p1', title: 'Sneakers', price: 1000, quantity: 1 });
    cart.addItem({ productId: 'p2', title: 'Hoodie', price: 800, quantity: 1 });
    cart.addItem({ productId: 'p3', title: 'Tee', price: 600, quantity: 1 });

    const res = cart.applyDiscount({
      code: 'BUY2GET1',
      type: 'bogo',
      bogoConfig: { buyQuantity: 2, getQuantity: 1 },
    });

    assert.strictEqual(res.isValid, true);
    assert.strictEqual(res.amount, 600); // 600 is the lowest price item, made free!

    const summary = cart.getSummary();
    assert.strictEqual(summary.subtotal, 2400);
    assert.strictEqual(summary.discount.amount, 600);
    assert.strictEqual(summary.finalTotal, 1800); // 2400 - 600
  });

  // Test 5: Tiered Quantity Volume Discounts
  test('Tiered volume discounts (Buy 3 get 20% off)', () => {
    const cart = createBoostCart();
    cart.addItem({ productId: 'p1', title: 'Soap Bar', price: 200, quantity: 4 });

    const res = cart.applyDiscount({
      code: 'VOLUMESAVE',
      type: 'tiered',
      tieredRules: [
        { minQuantity: 2, discountPercentage: 10 },
        { minQuantity: 3, discountPercentage: 20 },
      ],
    });

    assert.strictEqual(res.isValid, true);
    // Subtotal: 800. 4 units >= 3, so 20% of 800 = 160
    assert.strictEqual(res.amount, 160);

    const summary = cart.getSummary();
    assert.strictEqual(summary.discount.amount, 160);
  });

  // Test 6: Custom Surcharges & Add-ons (Gift Wrap, Express delivery)
  test('Custom surcharges & gift wrap fees included in checkout total', () => {
    const cart = createBoostCart({
      shipping: { freeShippingThreshold: 5000, flatShippingRate: 0 },
    });
    cart.addItem({ productId: 'p1', title: 'Watch', price: 2000, quantity: 1 });

    cart.addFee({
      id: 'gift_wrap',
      title: 'Luxury Gift Wrap & Ribbon',
      amount: 50,
    });
    cart.addFee({
      id: 'express_delivery',
      title: 'Same-Day Express Courier',
      amount: 150,
    });

    const summary = cart.getSummary();
    assert.strictEqual(summary.customFees.length, 2);
    assert.strictEqual(summary.totalCustomFees, 200);
    assert.strictEqual(summary.formatted.totalCustomFees, '₹200.00');
    assert.strictEqual(summary.finalTotal, 2200); // 2000 + 200
  });

  // Test 7: Intra-State GST (CGST + SGST Split) & Tax-Exempt
  test('Intra-state Indian GST calculation (CGST + SGST split)', () => {
    const cart = createBoostCart({
      origin: { state: 'Maharashtra', taxMode: 'inclusive' },
      destination: { state: 'MH' },
    });

    cart.addItem({
      productId: 'p_tech',
      title: 'Mechanical Keyboard',
      price: 1180,
      taxRate: 18,
      hsnCode: '8471',
      quantity: 1,
    });

    cart.addItem({
      productId: 'p_book',
      title: 'Coding Handbook',
      price: 500,
      isTaxExempt: true,
      quantity: 1,
    });

    const summary = cart.getSummary();
    assert.strictEqual(summary.gst.taxType, 'INTRA_STATE');
    assert.strictEqual(summary.gst.taxableAmount, 1500);
    assert.strictEqual(summary.gst.totalTax, 180);
    assert.strictEqual(summary.gst.cgst, 90);
    assert.strictEqual(summary.gst.sgst, 90);
  });

  // Test 8: Abandoned Cart & Checkout Funnel Recovery
  test('Abandoned cart recovery metadata tracking', () => {
    const cart = createBoostCart();
    cart.addItem({ productId: 'p1', title: 'Backpack', price: 1999, quantity: 1 });

    cart.setCustomerInfo({
      name: 'Rohan Sharma',
      phone: '9876543210',
      email: 'rohan@example.com',
    });
    cart.setCheckoutStep('address');

    const recovery = cart.getRecoveryPayload();
    assert.strictEqual(recovery.customer.name, 'Rohan Sharma');
    assert.strictEqual(recovery.customer.phone, '9876543210');
    assert.strictEqual(recovery.checkoutStep, 'address');
    assert.strictEqual(recovery.subtotal, 1999);
    assert.strictEqual(recovery.itemCount, 1);
  });

  // Test 9: Pluggable Storage Adapter Auto-Sync & Cross-Tab callback
  test('Pluggable MemoryStorageAdapter with onSync callback', () => {
    const storage = createMemoryStorageAdapter();
    let syncTriggered = false;

    storage.onSync((val) => {
      syncTriggered = true;
    });

    const cart = createBoostCart({ storage, storageKey: 'test_store_cart' });
    cart.addItem({ productId: 'p_watch', title: 'Smartwatch', price: 4999, quantity: 1 });

    assert.strictEqual(syncTriggered, true);
  });

  // Test 10: Reactive Subscriptions
  test('Reactive subscription contract for Svelte & React useSyncExternalStore', () => {
    const cart = createBoostCart();
    let notificationCount = 0;
    let latestTotal = 0;

    const unsubscribe = cart.subscribe((summary) => {
      notificationCount++;
      latestTotal = summary.finalTotal;
    });

    assert.strictEqual(notificationCount, 1);
    assert.strictEqual(latestTotal, 0);

    cart.addItem({ productId: 'i1', title: 'Shirt', price: 1000, quantity: 1 });
    assert.strictEqual(notificationCount, 2);
    assert.strictEqual(latestTotal, 1000);

    unsubscribe();
    cart.addItem({ productId: 'i2', title: 'Belt', price: 500, quantity: 1 });
    assert.strictEqual(notificationCount, 2);
  });

  // Test 11: AI Agent Toolkit Inspector
  test('CartAgentToolkit generates diagnostic markdown report', () => {
    const cart = createBoostCart();
    cart.addItem({ productId: 'p1', title: 'Wireless Mouse', price: 799, quantity: 2 });

    const report = CartAgentToolkit.inspect(cart);
    assert.ok(report.includes('BoostCart State Report'));
    assert.ok(report.includes('Wireless Mouse'));

    const validation = CartAgentToolkit.validateItem({ productId: 'test', title: 'Item', price: -50 });
    assert.strictEqual(validation.valid, false);
  });

  console.log(`\n🎉 All ${passed} Enterprise Tests in @boostengine/cart passed successfully!\n`);
}
