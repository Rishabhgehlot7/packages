const assert = require('assert');
const {
  calculateBundlePrice,
  calculateVolumeTierPrice,
  transformBundleToCartItem,
  suggestBundleComplements,
  calculateBundleSavingsTool,
  evaluateVolumeDiscountTool,
  generateSmartComboTool,
} = require('./dist/index.js');

console.log('🧪 Running @boostengine/bundles complete test suite...\n');

try {
  // ── Test 1: Frequently Bought Together Percentage Discount ────────────────
  console.log('🔹 1. Testing Frequently Bought Together Bundle...');
  const fbtBundle = {
    id: 'fbt-1',
    title: 'Summer Outfit Set',
    type: 'frequently_bought_together',
    discountType: 'percentage',
    discountValue: 20, // 20% off
    items: [
      { id: 'item-1', productId: 'p1', title: 'Tee', price: 1000, isRequired: true },
      { id: 'item-2', productId: 'p2', title: 'Shorts', price: 1500, isDefaultSelected: true },
      { id: 'item-3', productId: 'p3', title: 'Cap', price: 500, isDefaultSelected: true },
    ],
  };

  const res1 = calculateBundlePrice(fbtBundle);
  assert.strictEqual(res1.isValid, true);
  assert.strictEqual(res1.originalTotal, 3000);
  assert.strictEqual(res1.discountedTotal, 2400); // 3000 - 20%
  assert.strictEqual(res1.savingsAmount, 600);
  assert.strictEqual(res1.savingsPercentage, 20);
  assert.strictEqual(res1.items.length, 3);
  assert.strictEqual(res1.items[0].finalPrice, 800); // 1000 - 20%
  assert.strictEqual(res1.items[1].finalPrice, 1200); // 1500 - 20%
  assert.strictEqual(res1.items[2].finalPrice, 400); // 500 - 20%
  console.log('✅ FBT Bundle calculation passed!');

  // ── Test 2: Item Deselection with Required Constraints ─────────────────────
  console.log('🔹 2. Testing Item Deselection & Required Items...');
  // Customer deselects item-3 (Cap), only Tee + Shorts remain
  const res2 = calculateBundlePrice(fbtBundle, ['item-1', 'item-2']);
  assert.strictEqual(res2.selectedCount, 2);
  assert.strictEqual(res2.originalTotal, 2500);
  assert.strictEqual(res2.discountedTotal, 2000);
  assert.strictEqual(res2.savingsAmount, 500);
  assert.strictEqual(res2.items[2].isSelected, false);
  assert.strictEqual(res2.items[2].lineTotal, 0);

  // Attempting to deselect required item-1 should auto-include it
  const res3 = calculateBundlePrice(fbtBundle, ['item-2']);
  assert.strictEqual(res3.selectedCount, 2); // item-1 is required, so auto-included with item-2
  console.log('✅ Item Deselection & Required constraints passed!');

  // ── Test 3: Mix and Match with Min/Max Select Limits ──────────────────────
  console.log('🔹 3. Testing Mix and Match Box Builder...');
  const mixBox = {
    id: 'box-3pack',
    title: 'Custom 3-Tshirt Box',
    type: 'mix_and_match',
    discountType: 'set_price',
    discountValue: 1999, // Flat ₹1999 for any 3 tees
    minSelectCount: 3,
    maxSelectCount: 3,
    items: [
      { id: 'b1', productId: 'p1', title: 'Black Tee', price: 999 },
      { id: 'b2', productId: 'p2', title: 'White Tee', price: 999 },
      { id: 'b3', productId: 'p3', title: 'Navy Tee', price: 999 },
      { id: 'b4', productId: 'p4', title: 'Olive Tee', price: 999 },
    ],
  };

  // Under limit (selected only 2)
  const resUnder = calculateBundlePrice(mixBox, ['b1', 'b2']);
  assert.strictEqual(resUnder.isValid, false);
  assert.strictEqual(resUnder.validationErrors.length > 0, true);

  // Exact 3 items
  const resValid = calculateBundlePrice(mixBox, ['b1', 'b2', 'b4']);
  assert.strictEqual(resValid.isValid, true);
  assert.strictEqual(resValid.originalTotal, 2997);
  assert.strictEqual(resValid.discountedTotal, 1999);
  assert.strictEqual(resValid.savingsAmount, 998);
  console.log('✅ Mix and Match Box builder passed!');

  // ── Test 4: Tiered Volume Quantity Discounts ──────────────────────────────
  console.log('🔹 4. Testing Tiered Volume Quantity Discounts...');
  const volumeRules = [
    { minQuantity: 2, discountType: 'percentage', discountValue: 10, label: 'Buy 2 Save 10%' },
    { minQuantity: 3, discountType: 'percentage', discountValue: 20, label: 'Buy 3 Save 20%' },
    { minQuantity: 5, discountType: 'percentage', discountValue: 30, label: 'Buy 5+ Save 30%' },
  ];

  // 1 unit (no discount)
  const vol1 = calculateVolumeTierPrice('prod-1', 1000, 1, volumeRules);
  assert.strictEqual(vol1.discountedSubtotal, 1000);
  assert.strictEqual(vol1.totalSavings, 0);
  assert.strictEqual(vol1.appliedTier, null);
  assert.strictEqual(vol1.nextTier.neededQuantity, 1);
  assert.strictEqual(vol1.nextTier.potentialSavingsPercentage, 10);

  // 3 units (20% off)
  const vol3 = calculateVolumeTierPrice('prod-1', 1000, 3, volumeRules);
  assert.strictEqual(vol3.originalSubtotal, 3000);
  assert.strictEqual(vol3.discountedSubtotal, 2400); // 3000 - 20%
  assert.strictEqual(vol3.totalSavings, 600);
  assert.strictEqual(vol3.effectiveUnitPrice, 800);
  assert.strictEqual(vol3.appliedTier.discountValue, 20);
  assert.strictEqual(vol3.nextTier.neededQuantity, 2); // needs 5 for next tier
  console.log('✅ Tiered Volume Pricing & Upsells passed!');

  // ── Test 5: Cart Transformation Helper ────────────────────────────────────
  console.log('🔹 5. Testing Cart Transformation...');
  const cartItem = transformBundleToCartItem(res1);
  assert.strictEqual(cartItem.bundleId, 'fbt-1');
  assert.strictEqual(cartItem.bundleTotalPrice, 2400);
  assert.strictEqual(cartItem.bundleDiscountTotal, 600);
  assert.strictEqual(cartItem.bundleItems.length, 3);
  console.log('✅ Cart Transformation passed!');

  // ── Test 6: AI Agent Tools ────────────────────────────────────────────────
  console.log('🔹 6. Testing AI Agent Tool Integrations...');
  const agentSavings = calculateBundleSavingsTool({ bundle: fbtBundle });
  assert.strictEqual(agentSavings.success, true);
  assert.strictEqual(agentSavings.originalPrice, '₹3000.00');
  assert.strictEqual(agentSavings.dealPrice, '₹2400.00');

  const agentVolume = evaluateVolumeDiscountTool({
    productId: 'p1',
    basePrice: 1000,
    quantity: 2,
    tiers: volumeRules,
  });
  assert.strictEqual(agentVolume.currentQuantity, 2);
  assert.strictEqual(agentVolume.tierApplied, 'Buy 2 Save 10%');

  const smartCombo = generateSmartComboTool({
    mainProduct: { id: 'm1', title: 'Denim Jacket', price: 2999, category: 'Apparel' },
    catalog: [
      { id: 'c1', title: 'White Graphic Tee', price: 999, category: 'Tops' },
      { id: 'c2', title: 'Leather Belt', price: 699, category: 'Accessories' },
      { id: 'c3', title: 'Winter Overcoat', price: 5999, category: 'Apparel' },
    ],
    discountPercentage: 15,
  });
  assert.strictEqual(smartCombo.bundleDiscount, '15% OFF Combo');
  assert.strictEqual(smartCombo.products.length, 3);
  console.log('✅ AI Agent Tools passed!');

  console.log('\n🎉 ALL 6 TEST SUITE STAGES FOR @boostengine/bundles PASSED (100% SUCCESS)!');
} catch (err) {
  console.error('\n❌ Test failed:', err);
  process.exit(1);
}
