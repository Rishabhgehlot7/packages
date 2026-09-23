const https = require('https');

const packages = [
  'create-boost-app',
  '@boostengine/core',
  '@boostengine/ui',
  '@boostengine/loyalty',
  '@boostengine/recommendations',
  '@boostengine/deals',
  '@boostengine/referrals',
  '@boostengine/returns',
  '@boostengine/analytics',
  '@boostengine/coupons',
  '@boostengine/payments',
  '@boostengine/invoicing',
  '@boostengine/collections',
  '@boostengine/notifications',
  '@boostengine/inventory',
  '@boostengine/cart',
  '@boostengine/wishlist',
  '@boostengine/search',
  '@boostengine/shipping',
  '@boostengine/reviews',
  '@boostengine/auth',
  '@boostengine/seo',
  '@boostengine/server',
  '@boostengine/communications'
];

function fetchDownloadCount(pkg) {
  return new Promise((resolve) => {
    const encoded = pkg.startsWith('@') ? encodeURIComponent(pkg) : pkg;
    const url = `https://api.npmjs.org/downloads/point/2026-01-01:2026-12-31/${encoded}`;

    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ pkg, downloads: json.downloads || 0, status: res.statusCode === 200 ? 'OK' : 'Not Published / 404' });
        } catch {
          resolve({ pkg, downloads: 0, status: 'Error' });
        }
      });
    }).on('error', () => {
      resolve({ pkg, downloads: 0, status: 'Network Error' });
    });
  });
}

async function run() {
  console.log('\n🚀 Fetching NPM install / download stats for Boost Engine packages...\n');
  
  const results = [];
  for (const pkg of packages) {
    results.push(await fetchDownloadCount(pkg));
  }

  results.sort((a, b) => b.downloads - a.downloads);

  console.table(results.map(r => ({
    'Package Name': r.pkg,
    'Downloads': r.downloads,
    'Status': r.status
  })));

  const total = results.reduce((acc, curr) => acc + curr.downloads, 0);
  console.log(`\n🎉 Total Downloads across all packages: ${total.toLocaleString()}`);
}

run();
