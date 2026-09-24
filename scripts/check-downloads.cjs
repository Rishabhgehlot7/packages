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
  '@boostengine/communications',
  '@boostengine/bundles',
  '@boostengine/reels',
  '@boostengine/gamification',
  '@boostengine/importer',
  '@boostengine/subscriptions',
  '@boostengine/currency'
];

function fetchDownloadCount(pkg) {
  return new Promise((resolve) => {
    const encoded = pkg.startsWith('@') ? encodeURIComponent(pkg) : pkg;
    // Using last-month or range point query
    const url = `https://api.npmjs.org/downloads/point/last-month/${encoded}`;

    const req = https.get(url, { timeout: 8000 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({
            pkg,
            downloads: json.downloads || 0,
            status: res.statusCode === 200 ? 'Published (Live)' : 'Pending Publish / 404'
          });
        } catch {
          resolve({ pkg, downloads: 0, status: 'Parse Error' });
        }
      });
    });

    req.on('error', () => {
      resolve({ pkg, downloads: 0, status: 'Network Error' });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({ pkg, downloads: 0, status: 'Timeout' });
    });
  });
}

async function run() {
  console.log('\n🚀 Fetching live NPM download statistics for all 30 Boost Engine packages...\n');

  const results = await Promise.all(packages.map(pkg => fetchDownloadCount(pkg)));
  results.sort((a, b) => b.downloads - a.downloads);

  console.table(results.map(r => ({
    'Package Name': r.pkg,
    'Last 30 Days Downloads': r.downloads,
    'NPM Status': r.status
  })));

  const total = results.reduce((acc, curr) => acc + curr.downloads, 0);
  const liveCount = results.filter(r => r.status.includes('Live')).length;

  console.log('===============================================================');
  console.log(`🎉 Total Downloads (Last 30 Days): ${total.toLocaleString()}`);
  console.log(`📦 Live Published Packages on NPM: ${liveCount} / ${packages.length}`);
  console.log('===============================================================\n');
}

run();
