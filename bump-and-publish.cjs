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
  'boost-server',
  'create-boost-app',
];

console.log('=================================================================');
console.log('  🚀 @boostengine: Bump Patch Version & Publish to Public NPM');
console.log('=================================================================\n');

let successCount = 0;
let failCount = 0;

for (const pkg of packages) {
  const pkgDir = path.join(__dirname, pkg);
  const pkgJsonPath = path.join(pkgDir, 'package.json');
  if (!fs.existsSync(pkgJsonPath)) continue;

  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
  const pkgName = pkgJson.name;
  let currentVersion = pkgJson.version;

  console.log(`\n-----------------------------------------------------------------`);
  console.log(`📦 Processing: ${pkgName} (Current local: v${currentVersion})`);

  // Check remote version on NPM
  let remoteVersion = null;
  try {
    remoteVersion = execSync(`npm view ${pkgName} version`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] }).trim();
    console.log(`   Remote NPM version: v${remoteVersion}`);
  } catch (e) {
    console.log(`   Package not yet published on NPM (brand new).`);
  }

  // If already published and local version matches or is <= remote, bump patch
  if (remoteVersion && currentVersion === remoteVersion) {
    try {
      console.log(`   ⬆️ Bumping patch version (e.g. v${currentVersion} -> patch)...`);
      execSync('npm version patch --no-git-tag-version', { cwd: pkgDir, stdio: 'inherit' });
      const updatedJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
      currentVersion = updatedJson.version;
      console.log(`   ✅ Bumped to: v${currentVersion}`);
    } catch (bumpErr) {
      console.log(`   ⚠️ Failed to bump version: ${bumpErr.message}`);
    }
  }

  // Publish
  try {
    console.log(`   🚀 Publishing ${pkgName}@${currentVersion} to NPM...`);
    execSync('npm publish --access public', { cwd: pkgDir, stdio: 'inherit' });
    console.log(`   🎉 SUCCESS: Published ${pkgName}@${currentVersion}`);
    successCount++;
  } catch (pubErr) {
    console.log(`   ⚠️ Publish skipped or failed for ${pkgName} (check npm login or version)`);
    failCount++;
  }
}

console.log('\n=================================================================');
console.log(`  Summary: ${successCount} published, ${failCount} skipped/failed.`);
console.log('=================================================================\n');
