const https = require('https');
const fs = require('fs');
const path = require('path');

const packages = [
  'create-boost-app',
  'boost-core',
  'boost-ui',
  'boost-seo',
  'boost-server',
  'boost-analytics',
  'boost-collections',
  'boost-payments',
  'boost-shipping',
  'boost-notifications',
  'boost-coupons',
  'boost-auth',
  'boost-cart',
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
  'boost-communications'
];

function fetchNpmVersion(pkgName) {
  return new Promise((resolve) => {
    const encoded = pkgName.startsWith('@') ? encodeURIComponent(pkgName) : pkgName;
    const url = `https://registry.npmjs.org/${encoded}/latest`;

    https.get(url, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const data = JSON.parse(body);
            resolve(data.version || null);
          } catch {
            resolve(null);
          }
        } else {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function audit() {
  console.log('\n🔍 Auditing all 23 packages against live NPM Registry...\n');

  const tasks = packages.map(async (pkg) => {
    const pkgDir = path.join(__dirname, '..', pkg);
    const pkgJsonPath = path.join(pkgDir, 'package.json');
    if (!fs.existsSync(pkgJsonPath)) return null;

    const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf8'));
    const pkgName = pkgJson.name;
    const localVersion = pkgJson.version;
    const remoteVersion = await fetchNpmVersion(pkgName);

    let status = '✅ Live & Synced';
    if (!remoteVersion) {
      status = '❌ NOT PUBLISHED (404)';
    } else if (localVersion !== remoteVersion) {
      status = `🔄 Update Pending (v${localVersion} > v${remoteVersion})`;
    }

    return {
      'Package Name': pkgName,
      'Local': `v${localVersion}`,
      'NPM Live': remoteVersion ? `v${remoteVersion}` : 'None (404)',
      'Status': status
    };
  });

  const results = (await Promise.all(tasks)).filter(Boolean);
  console.table(results);
}

audit();
