const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

const packages = [
  'boost-core',
  'boost-server',
  'boost-ui',
  'boost-cart',
  'boost-payments',
  'boost-shipping',
  'boost-notifications',
  'boost-coupons',
  'boost-auth',
  'boost-seo',
  'boost-reviews',
  'boost-invoicing',
  'boost-search',
  'boost-wishlist',
  'boost-inventory',
  'boost-deals',
  'boost-recommendations',
  'boost-loyalty',
  'boost-returns',
  'boost-referrals',
  'boost-communications',
  'boost-analytics',
  'boost-collections',
  'boost-bundles',
  'boost-reels',
  'boost-gamification',
  'boost-importer',
  'boost-subscriptions',
  'boost-currency',
  'create-boost-app'
];

console.log('=======================================================');
console.log('  Publishing All 30 @boostengine Packages to NPM');
console.log('=======================================================\n');

for (const pkg of packages) {
  const pkgDir = path.join(__dirname, '..', pkg);
  if (!fs.existsSync(pkgDir)) continue;

  console.log(`\n-------------------------------------------------------`);
  console.log(`[${pkg}] Publishing to npm...`);
  console.log(`-------------------------------------------------------`);

  try {
    execFileSync(npmCmd, ['publish', '--access', 'public'], { cwd: pkgDir, stdio: 'inherit', shell: true });
    console.log(`>>> PUBLISHED: ${pkg} <<<`);
  } catch (err) {
    console.log(`>>> Note: ${pkg} might already be published or need otp/auth.`);
  }
}

console.log('\n=======================================================');
console.log('  NPM Publish Run Completed!');
console.log('=======================================================\n');
