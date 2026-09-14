const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const packages = [
  'boost-core',
  'boost-analytics',
  'boost-collections',
  'boost-payments',
  'boost-shipping',
  'boost-notifications',
  'boost-coupons',
  'boost-auth',
  'boost-cart',
  'boost-seo',
  'boost-reviews',
  'boost-invoicing',
  'boost-search',
  'boost-wishlist',
  'boost-inventory',
  'boost-deals',
  'boost-recommendations',
  'boost-loyalty',
  'boost-ui',
  'boost-returns',
  'boost-referrals',
];

console.log('=======================================================');
console.log('  Building and Testing All 21 @boostengine Packages');
console.log('=======================================================\n');

let failed = [];

for (const pkg of packages) {
  const pkgDir = path.join(__dirname, pkg);
  if (!fs.existsSync(pkgDir)) {
    console.log(`[SKIP] Directory not found: ${pkg}`);
    continue;
  }

  console.log(`\n-------------------------------------------------------`);
  console.log(`[${pkg}] Preparing build...`);
  console.log(`-------------------------------------------------------`);

  try {
    // Check if node_modules exists, if not install dependencies
    const nodeModules = path.join(pkgDir, 'node_modules');
    if (!fs.existsSync(nodeModules)) {
      console.log(`[${pkg}] node_modules missing. Running npm install...`);
      execSync('npm install --prefer-offline --no-audit', { cwd: pkgDir, stdio: 'inherit' });
    }

    // 1. Run build
    console.log(`\n[${pkg}] Building with tsup...`);
    execSync('npm run build', { cwd: pkgDir, stdio: 'inherit' });

    // 2. Run tests
    console.log(`\n[${pkg}] Running test suite...`);
    execSync('npm test', { cwd: pkgDir, stdio: 'inherit' });

    console.log(`\n>>> SUCCESS: [${pkg}] built and passed all tests! <<<\n`);
  } catch (err) {
    console.error(`\n>>> ERROR: [${pkg}] failed! <<<`);
    failed.push(pkg);
    break; // stop on first error so user can inspect
  }
}

console.log('\n=======================================================');
if (failed.length === 0) {
  console.log('  ALL PACKAGES BUILT AND VERIFIED SUCCESSFULLY!');
} else {
  console.log(`  FAILED PACKAGES: ${failed.join(', ')}`);
}
console.log('=======================================================\n');

if (failed.length > 0) {
  process.exit(1);
}
