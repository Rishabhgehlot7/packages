const assert = require('assert');
const fs = require('fs');
const path = require('path');
const ui = require('./dist/index.cjs');

console.log('🧪 Running @boostengine/ui Test Suite...\n');

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

// Test 1: All 15 eCommerce Components Exported
test('Verify all 15 core eCommerce components are exported', () => {
  // Original 6
  assert.ok(ui.CartDrawer, 'CartDrawer must be exported');
  assert.ok(ui.StickyAddToCart, 'StickyAddToCart must be exported');
  assert.ok(ui.PincodeChecker, 'PincodeChecker must be exported');
  assert.ok(ui.TrustBadges, 'TrustBadges must be exported');
  assert.ok(ui.OrderTimeline, 'OrderTimeline must be exported');
  assert.ok(ui.StarRating, 'StarRating must be exported');

  // Newly Added Catalog & Layout Components
  assert.ok(ui.ProductGallery, 'ProductGallery must be exported');
  assert.ok(ui.VariantSelector, 'VariantSelector must be exported');
  assert.ok(ui.ProductCard, 'ProductCard must be exported');
  assert.ok(ui.QuantitySelector, 'QuantitySelector must be exported');
  assert.ok(ui.ReviewBreakdownBars, 'ReviewBreakdownBars must be exported');
  assert.ok(ui.AnnouncementBar, 'AnnouncementBar must be exported');
  assert.ok(ui.Navbar, 'Navbar must be exported');
  assert.ok(ui.Footer, 'Footer must be exported');
  assert.ok(ui.MobileBottomBar, 'MobileBottomBar must be exported');
});

// Test 2: Next.js Client Directive Banner Check
test('Verify "use client" directive banner is included in build', () => {
  const cjsContent = fs.readFileSync(path.join(__dirname, 'dist/index.cjs'), 'utf-8');
  assert.ok(cjsContent.includes("'use client'") || cjsContent.includes('"use client"'), '"use client" banner must be present for Next.js App Router');
});

// Test 3: TypeScript Declaration File Existence
test('Verify DTS declaration file exists and is populated', () => {
  const dtsPath = path.join(__dirname, 'dist/index.d.ts');
  assert.ok(fs.existsSync(dtsPath), 'dist/index.d.ts must exist');
  const dtsContent = fs.readFileSync(dtsPath, 'utf-8');
  assert.ok(dtsContent.includes('CartDrawer'));
  assert.ok(dtsContent.includes('ProductGallery'));
  assert.ok(dtsContent.includes('Navbar'));
  assert.ok(dtsContent.includes('Footer'));
});

console.log(`\n🎉 All ${passed} tests in @boostengine/ui passed successfully!\n`);
