/**
 * Syncs all @boostengine packages to use:
 * Author: Rishabh Gehlot (https://github.com/Rishabhgehlot7)
 * Repository: https://github.com/Rishabhgehlot7/packages
 * Funding: https://github.com/sponsors/Rishabhgehlot7
 *
 * Run with: node scripts/sync-github-metadata.cjs
 */

const fs = require('fs');
const path = require('path');

const PACKAGES_DIR = path.resolve(__dirname, '..');
const GITHUB_PROFILE = 'https://github.com/Rishabhgehlot7';
const GITHUB_REPO = 'https://github.com/Rishabhgehlot7/packages';
const GITHUB_SPONSORS = 'https://github.com/sponsors/Rishabhgehlot7';
const AUTHOR_STRING = 'Rishabh Gehlot <boostengine001@gmail.com> (https://github.com/Rishabhgehlot7)';

const items = fs.readdirSync(PACKAGES_DIR, { withFileTypes: true });

let packageCount = 0;
let readmeCount = 0;

for (const item of items) {
  if (!item.isDirectory() || item.name.startsWith('.') || item.name === 'scripts' || item.name === 'node_modules') {
    continue;
  }

  const pkgDir = path.join(PACKAGES_DIR, item.name);
  const pkgJsonPath = path.join(pkgDir, 'package.json');
  const readmePath = path.join(pkgDir, 'README.md');

  // 1. Update package.json
  if (fs.existsSync(pkgJsonPath)) {
    try {
      const content = fs.readFileSync(pkgJsonPath, 'utf8');
      const pkg = JSON.parse(content);

      pkg.author = AUTHOR_STRING;
      pkg.funding = {
        type: 'github',
        url: GITHUB_SPONSORS
      };
      pkg.homepage = `${GITHUB_REPO}/tree/main/packages/${item.name}#readme`;
      pkg.repository = {
        type: 'git',
        url: `${GITHUB_REPO}.git`,
        directory: `packages/${item.name}`
      };
      pkg.bugs = {
        url: `${GITHUB_REPO}/issues`
      };

      fs.writeFileSync(pkgJsonPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
      packageCount++;
      console.log(`[✓] Updated package.json: ${item.name}`);
    } catch (err) {
      console.error(`[X] Error updating package.json in ${item.name}:`, err.message);
    }
  }

  // 2. Update README.md
  if (fs.existsSync(readmePath)) {
    try {
      let readme = fs.readFileSync(readmePath, 'utf8');

      readme = readme.replace(/https:\/\/github\.com\/boostengine\/boostengine/g, GITHUB_REPO);
      readme = readme.replace(/https:\/\/github\.com\/boostengine(?![a-zA-Z0-9_\-\.])/g, GITHUB_PROFILE);
      readme = readme.replace(/MIT © \[Boost Engine\]\(https:\/\/github\.com\/Rishabhgehlot7\)/g, `MIT © [Rishabh Gehlot](${GITHUB_PROFILE}) • [Repository](${GITHUB_REPO})`);
      readme = readme.replace(/MIT © \[Boost Engine Team\]\(https:\/\/github\.com\/Rishabhgehlot7\)/g, `MIT © [Rishabh Gehlot](${GITHUB_PROFILE}) • [Repository](${GITHUB_REPO})`);
      readme = readme.replace(/Built for the developer community by \*\*\[Boost Engine Team\]\(https:\/\/github\.com\/Rishabhgehlot7\/packages\)\*\*/g, `Built for the developer community by **[Rishabh Gehlot](${GITHUB_PROFILE})** | Repository: **[github.com/Rishabhgehlot7/packages](${GITHUB_REPO})**`);

      fs.writeFileSync(readmePath, readme, 'utf8');
      readmeCount++;
      console.log(`[✓] Updated README.md: ${item.name}`);
    } catch (err) {
      console.error(`[X] Error updating README.md in ${item.name}:`, err.message);
    }
  }
}

console.log(`\n🎉 Successfully synced ${packageCount} package.json files and ${readmeCount} README.md files to Rishabhgehlot7!`);
