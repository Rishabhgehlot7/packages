const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const otp = process.argv[2];

const packagesToPublish = [
  'boost-returns',
  'boost-analytics',
  'boost-notifications',
  'boost-referrals',
];

console.log('=================================================================');
console.log('  Publishing 4 Packages to Public NPM');
console.log('  1. @boostengine/returns');
console.log('  2. @boostengine/analytics');
console.log('  3. @boostengine/notifications');
console.log('  4. @boostengine/referrals');
if (otp) console.log(`  OTP: ${otp}`);
console.log('=================================================================\n');

for (const pkg of packagesToPublish) {
  const pkgDir = path.join(__dirname, '..', pkg);
  const pkgJsonPath = path.join(pkgDir, 'package.json');
  if (!fs.existsSync(pkgJsonPath)) {
    console.log(`⚠️ Folder not found: ${pkg}`);
    continue;
  }

  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
  const pkgName = pkgJson.name;
  const version = pkgJson.version;

  console.log(`\n📦 [${pkg}] Publishing ${pkgName}@${version}...`);

  const publishArgs = ['publish', '--access', 'public'];
  if (otp) publishArgs.push(`--otp=${otp}`);

  try {
    execFileSync(npmCmd, publishArgs, { cwd: pkgDir, stdio: 'inherit', shell: true });
    console.log(`✅ SUCCESS: Published ${pkgName}@${version}`);
  } catch (err) {
    console.log(`❌ Failed to publish ${pkgName}@${version}: ${err.message}`);
  }
}

console.log('\n=================================================================');
console.log('  Process completed!');
console.log('=================================================================\n');
