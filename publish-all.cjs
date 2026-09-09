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
];

console.log('=======================================================');
console.log('  Publishing All 19 @boostengine Packages to NPM');
console.log('=======================================================\n');

for (const pkg of packages) {
  const pkgDir = path.join(__dirname, pkg);
  if (!fs.existsSync(pkgDir)) continue;

  console.log(`\n-------------------------------------------------------`);
  console.log(`[${pkg}] Publishing to npm...`);
  console.log(`-------------------------------------------------------`);

  try {
    execSync('npm publish --access public', { cwd: pkgDir, stdio: 'inherit' });
    console.log(`>>> PUBLISHED: ${pkg} <<<`);
  } catch (err) {
    console.log(`>>> Note: ${pkg} might already be published or need otp/auth.`);
  }
}

console.log('\n=======================================================');
console.log('  NPM Publish Run Completed!');
console.log('=======================================================\n');
