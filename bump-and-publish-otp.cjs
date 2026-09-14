/**
 * bump-and-publish-otp.cjs
 * Same as bump-and-publish.cjs but passes --otp flag to bypass 2FA.
 *
 * Usage:
 *   node bump-and-publish-otp.cjs 123456
 * Or via the bat:
 *   publish-with-otp.bat
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const otp = process.argv[2];
if (!otp || !/^\d{6}$/.test(otp)) {
  console.error('\n❌ Invalid OTP. Usage: node bump-and-publish-otp.cjs 123456\n');
  process.exit(1);
}

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
console.log('  🚀 @boostengine: Bump Patch Version & Publish (with OTP)');
console.log(`  🔑 Using OTP: ${otp}`);
console.log('=================================================================\n');

let successCount = 0;
let failCount = 0;

for (const pkg of packages) {
  const pkgDir = path.join(__dirname, pkg);
  const pkgJsonPath = path.join(pkgDir, 'package.json');
  if (!fs.existsSync(pkgJsonPath)) {
    console.log(`⚠️ Skipping ${pkg} (package.json not found)`);
    continue;
  }

  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
  const pkgName = pkgJson.name;
  let currentVersion = pkgJson.version;

  console.log(`\n-----------------------------------------------------------------`);
  console.log(`📦 Processing: ${pkgName} (Local: v${currentVersion})`);

  // Check remote version
  let remoteVersion = null;
  try {
    remoteVersion = execSync(`npm view ${pkgName} version`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();
    console.log(`   Remote NPM: v${remoteVersion}`);
  } catch {
    console.log(`   Not yet published on NPM (brand new).`);
  }

  // Bump if version matches remote
  if (remoteVersion && currentVersion === remoteVersion) {
    try {
      execSync('npm version patch --no-git-tag-version', { cwd: pkgDir, stdio: 'inherit' });
      const updated = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
      currentVersion = updated.version;
      console.log(`   ✅ Bumped to: v${currentVersion}`);
    } catch (e) {
      console.log(`   ⚠️ Version bump failed: ${e.message}`);
    }
  }

  // Publish with OTP
  try {
    console.log(`   🚀 Publishing ${pkgName}@${currentVersion} --otp=${otp}`);
    execSync(`npm publish --access public --otp=${otp}`, { cwd: pkgDir, stdio: 'inherit' });
    console.log(`   🎉 SUCCESS: Published ${pkgName}@${currentVersion}`);
    successCount++;
  } catch {
    console.log(`   ⚠️ Publish failed for ${pkgName} (version may already exist)`);
    failCount++;
  }
}

console.log('\n=================================================================');
console.log(`  Summary: ${successCount} published, ${failCount} skipped/failed.`);
console.log('=================================================================\n');

if (successCount > 0) {
  console.log('🎉 Published packages are live at:');
  console.log('   https://www.npmjs.com/org/boostengine\n');
}
