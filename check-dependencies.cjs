const fs = require('fs');
const path = require('path');

const packagesDir = __dirname;
const entries = fs.readdirSync(packagesDir, { withFileTypes: true });

console.log('=======================================================');
console.log('   Boost Commerce Dependency Audit Report');
console.log('=======================================================\n');

let missingNodeModules = [];
let installedNodeModules = [];

// 1. Audit packages/
for (const entry of entries) {
  if (!entry.isDirectory() || entry.name.startsWith('.')) continue;

  const fullPath = path.join(packagesDir, entry.name);
  const pkgJsonPath = path.join(fullPath, 'package.json');

  if (fs.existsSync(pkgJsonPath)) {
    const nodeModulesPath = path.join(fullPath, 'node_modules');
    const hasNodeModules = fs.existsSync(nodeModulesPath);

    if (hasNodeModules) {
      installedNodeModules.push(`packages/${entry.name}`);
    } else {
      missingNodeModules.push(`packages/${entry.name}`);
    }
  }
}

// 2. Audit create-boost-app templates/
const templatesDir = path.join(packagesDir, 'create-boost-app', 'templates');
if (fs.existsSync(templatesDir)) {
  const templates = fs.readdirSync(templatesDir, { withFileTypes: true });
  for (const t of templates) {
    if (!t.isDirectory()) continue;
    const tPath = path.join(templatesDir, t.name);
    const pkgJson = path.join(tPath, 'package.json');
    if (fs.existsSync(pkgJson)) {
      const nodeModules = path.join(tPath, 'node_modules');
      if (fs.existsSync(nodeModules)) {
        installedNodeModules.push(`templates/${t.name}`);
      } else {
        missingNodeModules.push(`templates/${t.name}`);
      }
    }
  }
}

console.log(`📦 Installed (${installedNodeModules.length} locations):`);
installedNodeModules.forEach(p => console.log(`   ✅ ${p}`));

console.log(`\n⚠️ Missing node_modules (${missingNodeModules.length} locations):`);
missingNodeModules.forEach(p => console.log(`   ❌ ${p}`));

console.log('\n=======================================================');
