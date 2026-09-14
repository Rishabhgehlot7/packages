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

  console.log('✅ Next.js Full-Stack Scaffolder verified successfully!');
  fs.rmSync(testOutputDir, { recursive: true, force: true });

  // ── Test Paired Scaffolding: vite+express ─────────────────────────────────
  console.log('🧪 Testing scaffoldPair with vite+express...');
  const { scaffoldPair, PAIRS } = require('./src/scaffolder');
  const pairTestBase = path.join(__dirname, 'test-pair-output');
  if (fs.existsSync(pairTestBase)) {
    fs.rmSync(pairTestBase, { recursive: true, force: true });
  }
  fs.mkdirSync(pairTestBase, { recursive: true });

  const vitePairResult = scaffoldPair(pairTestBase, 'vite+express', {
    storeName: 'my-cool-store',
    brandTitle: 'Cool Store',
  });

  assert.strictEqual(Boolean(vitePairResult), true);
  assert.strictEqual(fs.existsSync(path.join(pairTestBase, 'my-cool-store', 'package.json')), true);
  assert.strictEqual(fs.existsSync(path.join(pairTestBase, 'my-cool-store-api', 'package.json')), true);
  assert.strictEqual(fs.existsSync(path.join(pairTestBase, 'my-cool-store', '.env.local')), true);
  assert.strictEqual(fs.existsSync(path.join(pairTestBase, 'my-cool-store-api', '.env.local')), true);
  console.log('✅ vite+express pair verified: my-cool-store/ + my-cool-store-api/ created!');

  // ── Test Paired Scaffolding: expo+express ─────────────────────────────────
  console.log('🧪 Testing scaffoldPair with expo+express...');
  const expoPairResult = scaffoldPair(pairTestBase, 'expo+express', {
    storeName: 'my-cool-app',
    brandTitle: 'Cool App',
  });

  assert.strictEqual(Boolean(expoPairResult), true);
  assert.strictEqual(fs.existsSync(path.join(pairTestBase, 'my-cool-app', 'package.json')), true);
  assert.strictEqual(fs.existsSync(path.join(pairTestBase, 'my-cool-app-api', 'package.json')), true);
  console.log('✅ expo+express pair verified: my-cool-app/ + my-cool-app-api/ created!');

  // ── Test Paired Scaffolding: web+app ─────────────────────────────────────
  console.log('🧪 Testing scaffoldPair with web+app (Next.js Web + Expo App)...');
  const webAppResult = scaffoldPair(pairTestBase, 'web+app', {
    storeName: 'omni-brand',
    brandTitle: 'Omni Brand',
  });

  assert.strictEqual(Boolean(webAppResult), true);
  assert.strictEqual(fs.existsSync(path.join(pairTestBase, 'omni-brand-web', 'package.json')), true);
  assert.strictEqual(fs.existsSync(path.join(pairTestBase, 'omni-brand-app', 'package.json')), true);
  assert.strictEqual(fs.existsSync(path.join(pairTestBase, 'omni-brand-web', '.env.local')), true);
  console.log('✅ web+app pair verified: omni-brand-web/ + omni-brand-app/ created!');

  // ── Test Omnichannel 3-in-1 Suite: Vite + Expo + Express ───────────────────
  console.log('🧪 Testing scaffoldPair with omnichannel (3-in-1 Suite)...');
  const omniResult = scaffoldPair(pairTestBase, 'omnichannel', {
    storeName: 'complete-store',
    brandTitle: 'Complete Store',
  });

  assert.strictEqual(Boolean(omniResult), true);
  assert.strictEqual(fs.existsSync(path.join(pairTestBase, 'complete-store-web', 'package.json')), true);
  assert.strictEqual(fs.existsSync(path.join(pairTestBase, 'complete-store-app', 'package.json')), true);
  assert.strictEqual(fs.existsSync(path.join(pairTestBase, 'complete-store-api', 'package.json')), true);
  console.log('✅ omnichannel 3-in-1 suite verified: complete-store-web/ + app/ + api/ created!');

  // Cleanup pair test
  fs.rmSync(pairTestBase, { recursive: true, force: true });

  console.log('\n🎉 ALL create-boost-app tests (Standalone, Pairs & 3-in-1 Suites) passed successfully!');
} catch (err) {
  console.error('❌ Scaffolder test failed:', err);
  process.exit(1);
}


