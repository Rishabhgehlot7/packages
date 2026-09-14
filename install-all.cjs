const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const args = process.argv.slice(2);
const mode = args[0] || '--templates'; // default to templates since packages already have node_modules

console.log('=======================================================');
console.log('   Boost Commerce Dependency Installer');
console.log(`   Mode: ${mode}`);
console.log('=======================================================\n');

const packagesDir = __dirname;
const templatesDir = path.join(packagesDir, 'create-boost-app', 'templates');

const targets = [];

// Templates
if (mode === '--templates' || mode === '--all') {
  if (fs.existsSync(templatesDir)) {
    const templates = fs.readdirSync(templatesDir, { withFileTypes: true });
    for (const t of templates) {
      if (!t.isDirectory()) continue;
      const tPath = path.join(templatesDir, t.name);
      if (fs.existsSync(path.join(tPath, 'package.json'))) {
        targets.push({ name: `template: ${t.name}`, dir: tPath });
      }
    }
  }
}

// Packages
if (mode === '--packages' || mode === '--all') {
  const entries = fs.readdirSync(packagesDir, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name.startsWith('.') || entry.name === 'create-boost-app') continue;
    const pPath = path.join(packagesDir, entry.name);
    if (fs.existsSync(path.join(pPath, 'package.json'))) {
      targets.push({ name: `package: ${entry.name}`, dir: pPath });
    }
  }
}

console.log(`Found ${targets.length} target(s) to process.\n`);

let successCount = 0;
let failCount = 0;

for (const target of targets) {
  const nodeModules = path.join(target.dir, 'node_modules');
  const hasModules = fs.existsSync(nodeModules);

  if (hasModules && !args.includes('--force')) {
    console.log(`[SKIP] ${target.name} (node_modules already exists. Use --force to re-install)`);
    successCount++;
    continue;
  }

  console.log(`\n-------------------------------------------------------`);
  console.log(`[INSTALLING] ${target.name}...`);
  console.log(`Directory: ${target.dir}`);
  console.log(`-------------------------------------------------------`);

  try {
    execSync('npm install --prefer-offline --no-audit', {
      cwd: target.dir,
      stdio: 'inherit',
    });
    console.log(`✅ [SUCCESS] ${target.name} installed successfully!`);
    successCount++;
  } catch (err) {
    console.error(`❌ [FAILED] ${target.name} installation failed!`);
    failCount++;
  }
}

console.log('\n=======================================================');
console.log(`Installation Summary:`);
console.log(`  ✅ Successful/Skipped: ${successCount}`);
console.log(`  ❌ Failed: ${failCount}`);
console.log('=======================================================\n');
