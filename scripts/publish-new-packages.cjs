const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const otp = process.argv[2];

const newPackages = [
  'boost-bundles',
  'boost-reels',
  'boost-gamification',
  'boost-importer',
  'boost-subscriptions',
  'boost-currency',
  'boost-communications'
];

console.log('=================================================================');
console.log('  🚀 @boostengine: Publishing 7 New Packages to NPM');
if (otp) console.log(`  🔑 Using OTP: ${otp}`);
console.log('=================================================================\n');

let successCount = 0;
let failCount = 0;

for (const pkg of newPackages) {
  const pkgDir = path.join(__dirname, '..', pkg);
  const pkgJsonPath = path.join(pkgDir, 'package.json');
  if (!fs.existsSync(pkgJsonPath)) {
    console.log(`⚠️ Skipping ${pkg} (Directory or package.json not found)`);
    continue;
  }

  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
  const pkgName = pkgJson.name;
  const currentVersion = pkgJson.version;

  console.log(`\n-----------------------------------------------------------------`);
  console.log(`📦 Processing: ${pkgName} (v${currentVersion})`);

  // Build first
  try {
    console.log(`   🔨 Building ${pkgName}...`);
    execFileSync(npmCmd, ['run', 'build'], { cwd: pkgDir, stdio: 'inherit', shell: true });
  } catch (bErr) {
    console.log(`   ⚠️ Build warning/skipped: ${bErr.message}`);
  }

  // Publish
  const publishArgs = ['publish', '--access', 'public'];
  if (otp) publishArgs.push(`--otp=${otp}`);

  try {
    console.log(`   🚀 Publishing ${pkgName}@${currentVersion} to NPM...`);
    execFileSync(npmCmd, publishArgs, { cwd: pkgDir, stdio: 'inherit', shell: true });
    console.log(`   🎉 SUCCESS: Published ${pkgName}@${currentVersion}`);
    successCount++;
  } catch (err) {
    console.log(`   ⚠️ Publish failed for ${pkgName}: ${err.message}`);
    failCount++;
  }
}

console.log('\n=================================================================');
console.log(`  Summary: ${successCount} published successfully, ${failCount} failed.`);
console.log('=================================================================\n');
