// Verification test suite for create-boost-app scaffolder
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { scaffoldProject } = require('./src/scaffolder');

console.log('🧪 Testing create-boost-app scaffolder with full-stack template...');

const testOutputDir = path.join(__dirname, 'test-output');

try {
  if (fs.existsSync(testOutputDir)) {
    fs.rmSync(testOutputDir, { recursive: true, force: true });
  }

  const result = scaffoldProject(testOutputDir, {
    storeName: 'urban-streetwear-store',
    brandTitle: 'Urban Streetwear',
  });

  assert.strictEqual(result.success, true);
  assert.strictEqual(fs.existsSync(path.join(testOutputDir, 'package.json')), true);
  assert.strictEqual(fs.existsSync(path.join(testOutputDir, 'tsconfig.json')), true);
  assert.strictEqual(fs.existsSync(path.join(testOutputDir, 'next.config.ts')), true);
  assert.strictEqual(fs.existsSync(path.join(testOutputDir, 'tailwind.config.ts')), true);
  assert.strictEqual(fs.existsSync(path.join(testOutputDir, '.env.local')), true);
  assert.strictEqual(fs.existsSync(path.join(testOutputDir, 'README.md')), true);

  // Storefront checks
  assert.strictEqual(fs.existsSync(path.join(testOutputDir, 'src/app/layout.tsx')), true);
  assert.strictEqual(fs.existsSync(path.join(testOutputDir, 'src/app/page.tsx')), true);
  assert.strictEqual(fs.existsSync(path.join(testOutputDir, 'src/app/products/[id]/page.tsx')), true);
  assert.strictEqual(fs.existsSync(path.join(testOutputDir, 'src/app/checkout/page.tsx')), true);
  assert.strictEqual(fs.existsSync(path.join(testOutputDir, 'src/app/order-success/[orderId]/page.tsx')), true);

  // Admin Panel checks
  assert.strictEqual(fs.existsSync(path.join(testOutputDir, 'src/app/admin/layout.tsx')), true);
  assert.strictEqual(fs.existsSync(path.join(testOutputDir, 'src/app/admin/page.tsx')), true);
  assert.strictEqual(fs.existsSync(path.join(testOutputDir, 'src/app/admin/products/page.tsx')), true);
  assert.strictEqual(fs.existsSync(path.join(testOutputDir, 'src/app/admin/products/new/page.tsx')), true);
  assert.strictEqual(fs.existsSync(path.join(testOutputDir, 'src/app/admin/orders/page.tsx')), true);
  assert.strictEqual(fs.existsSync(path.join(testOutputDir, 'src/app/admin/plugins/page.tsx')), true);
  assert.strictEqual(fs.existsSync(path.join(testOutputDir, 'src/app/admin/settings/page.tsx')), true);

  // Admin API checks
  assert.strictEqual(fs.existsSync(path.join(testOutputDir, 'src/app/api/admin/stats/route.ts')), true);
  assert.strictEqual(fs.existsSync(path.join(testOutputDir, 'src/app/api/admin/products/route.ts')), true);
  assert.strictEqual(fs.existsSync(path.join(testOutputDir, 'src/app/api/admin/orders/route.ts')), true);
  assert.strictEqual(fs.existsSync(path.join(testOutputDir, 'src/app/api/admin/plugins/route.ts')), true);
  assert.strictEqual(fs.existsSync(path.join(testOutputDir, 'src/app/api/admin/settings/route.ts')), true);

  // Components & Context checks
  assert.strictEqual(fs.existsSync(path.join(testOutputDir, 'src/components/Navbar.tsx')), true);
  assert.strictEqual(fs.existsSync(path.join(testOutputDir, 'src/components/Footer.tsx')), true);
  assert.strictEqual(fs.existsSync(path.join(testOutputDir, 'src/components/GlobalCartDrawer.tsx')), true);
  assert.strictEqual(fs.existsSync(path.join(testOutputDir, 'src/components/MobileBottomNav.tsx')), true);
  assert.strictEqual(fs.existsSync(path.join(testOutputDir, 'src/context/StoreContext.tsx')), true);
  assert.strictEqual(fs.existsSync(path.join(testOutputDir, 'src/data/products.ts')), true);
  assert.strictEqual(fs.existsSync(path.join(testOutputDir, 'src/data/db.ts')), true);

  // Verify package.json contents
  const pkg = JSON.parse(fs.readFileSync(path.join(testOutputDir, 'package.json'), 'utf8'));
  assert.strictEqual(pkg.name, 'urban-streetwear-store');
  assert.strictEqual(Boolean(pkg.dependencies['@boostengine/core']), true);
  assert.strictEqual(Boolean(pkg.dependencies['@boostengine/ui']), true);
  assert.strictEqual(Boolean(pkg.dependencies['@boostengine/cart']), true);
  assert.strictEqual(Boolean(pkg.dependencies['@boostengine/payments']), true);
  assert.strictEqual(Boolean(pkg.dependencies['@boostengine/shipping']), true);

  console.log('✅ Scaffolder successfully verified: All Storefront, Admin, API, and Plugin files generated!');

  // Cleanup
  fs.rmSync(testOutputDir, { recursive: true, force: true });
  console.log('🎉 Full create-boost-app test passed successfully!');
} catch (err) {
  console.error('❌ Scaffolder test failed:', err);
  process.exit(1);
}
