const { execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const otp = process.argv[2];

const packagesToPublish = [
  'boost-ui',     // v1.2.2 (hardened components, local > remote v1.2.1)
  'boost-seo',    // v1.0.2 (sanitized JSON-LD, local > remote v1.0.1)
  'boost-server', // v1.0.0 (brand new package)
];

console.log('=================================================================');
console.log('  🚀 Publishing Updated Packages to Public NPM');
if (otp) console.log(`  🔑 OTP: ${otp}`);
console.log('=================================================================\n');

for (const pkg of packagesToPublish) {
  const pkgDir = path.join(__dirname, pkg);
  const pkgJsonPath = path.join(pkgDir, 'package.json');
  if (!fs.existsSync(pkgJsonPath)) continue;

  const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'));
  const pkgName = pkgJson.name;
  const version = pkgJson.version;

  console.log(`\n📦 Publishing ${pkgName}@${version}...`);

  const publishArgs = ['publish', '--access', 'public'];
  if (otp) publishArgs.push(`--otp=${otp}`);

  try {
    execFileSync(npmCmd, publishArgs, { cwd: pkgDir, stdio: 'inherit' });
    console.log(`🎉 SUCCESS: Published ${pkgName}@${version}`);
  } catch (err) {
    console.log(`⚠️ Failed to publish ${pkgName}@${version}. Please check if you are logged in (npm login) or need OTP.`);
  }
}

console.log('\n=================================================================\n');
