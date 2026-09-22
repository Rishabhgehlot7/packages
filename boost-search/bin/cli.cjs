#!/usr/bin/env node

console.log('\n🔍 @boostengine/search - High-Performance Headless Product Search & Filtering');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const args = process.argv.slice(2);
const command = args[0] || 'help';

let indexModule;
try {
  indexModule = require('../dist/index.cjs');
} catch (e) {
  try {
    indexModule = require('./dist/index.cjs');
  } catch (err) {}
}

const { BoostSearchIndex, BoostSearchEngine } = indexModule || {};

const mockProducts = [
  { id: '1', title: 'Oversized Cyberpunk Hoodie', brand: 'NeoTokyo', category: 'Hoodies', price: 2499, inStock: true, tags: ['streetwear', 'hoodie', 'oversized'] },
  { id: '2', title: 'Vintage Denim Cargo Jeans', brand: 'RetroWave', category: 'Pants', price: 1899, inStock: true, tags: ['denim', 'jeans', 'casual'] },
  { id: '3', title: 'Classic White Cotton Tee', brand: 'BasicsLab', category: 'T-Shirts', price: 699, inStock: true, tags: ['cotton', 'tshirt', 'plain'] },
  { id: '4', title: 'Performance Running Sneakers', brand: 'AeroStride', category: 'Footwear', price: 3999, inStock: false, tags: ['shoes', 'sneakers', 'sports'] },
  { id: '5', title: 'Waterproof Winter Windbreaker', brand: 'NeoTokyo', category: 'Jackets', price: 4999, inStock: true, tags: ['winter', 'jacket', 'outerwear'] },
];

if (command === 'demo') {
  if (!BoostSearchIndex) {
    console.log('❌ Please run `npm run build` before running the demo.');
    process.exit(1);
  }

  const index = new BoostSearchIndex({}, mockProducts);

  console.log('⚡ [1/3] Typo-Tolerant Search Demo:');
  const typoQuery = 'hoddie';
  const res = index.search({ query: typoQuery });
  console.log(`  • Search Query: "${typoQuery}" (Typo for "hoodie")`);
  console.log(`  • Matches Found: ${res.total}`);
  res.products.forEach((p) => {
    console.log(`    -> [${p.id}] ${p.title} - ₹${p.price} (${p.category} | ${p.brand})`);
  });

  console.log('\n💡 [2/3] Autocomplete Typeahead Demo:');
  const suggest = index.suggest('den');
  console.log(`  • Prefix Query: "den"`);
  console.log(`  • Query Completions: [${suggest.completions.join(', ')}]`);
  console.log(`  • Preview Items: ${suggest.products.map((p) => p.title).join(', ')}`);

  console.log('\n📊 [3/3] Dynamic Multi-Facet Extraction:');
  const allRes = index.search({});
  console.log(`  • Categories: ${allRes.facets.categories.map((c) => `${c.value} (${c.count})`).join(', ')}`);
  console.log(`  • Brands: ${allRes.facets.brands.map((b) => `${b.value} (${b.count})`).join(', ')}`);
  console.log(`  • Price Range: ₹${allRes.facets.priceRange.min} - ₹${allRes.facets.priceRange.max}`);

  console.log('\n✨ Demo completed successfully!\n');
} else if (command === 'suggest') {
  if (!BoostSearchIndex) {
    console.log('❌ Please run `npm run build` before running suggest.');
    process.exit(1);
  }

  const query = args[1] || 'sh';
  const index = new BoostSearchIndex({}, mockProducts);
  const res = index.suggest(query);

  console.log(`Suggestions for "${query}":`);
  console.log('Completions:', res.completions);
  console.log('Products:', res.products.map((p) => `${p.title} (₹${p.price})`));
  console.log();
} else if (command === 'benchmark') {
  if (!BoostSearchIndex) {
    console.log('❌ Please run `npm run build` before running benchmark.');
    process.exit(1);
  }

  console.log('⏱️ Generating 5,000 synthetic catalog products...');
  const synthetic = [];
  const categories = ['Hoodies', 'Jeans', 'T-Shirts', 'Footwear', 'Jackets', 'Accessories'];
  const brands = ['NeoTokyo', 'RetroWave', 'BasicsLab', 'AeroStride', 'UrbanDrift'];

  for (let i = 0; i < 5000; i++) {
    const cat = categories[i % categories.length];
    const brand = brands[i % brands.length];
    synthetic.push({
      id: `p_${i}`,
      title: `${brand} Premium ${cat} Model ${i}`,
      brand,
      category: cat,
      price: 500 + (i % 5000),
      inStock: i % 5 !== 0,
      tags: [cat.toLowerCase(), brand.toLowerCase(), 'premium'],
    });
  }

  const startBuild = Date.now();
  const index = new BoostSearchIndex({}, synthetic);
  const buildTime = Date.now() - startBuild;
  console.log(`✅ Indexed 5,000 products in ${buildTime}ms!`);

  const startSearch = Date.now();
  const queries = ['hoodie', 'retro', 'sneakers', 'denim', 'nonexistent'];
  let totalMatches = 0;
  for (let i = 0; i < 500; i++) {
    const q = queries[i % queries.length];
    const r = index.search({ query: q, inStockOnly: true });
    totalMatches += r.total;
  }
  const searchTime = Date.now() - startSearch;
  console.log(`🚀 Executed 500 complex faceted searches in ${searchTime}ms (${(searchTime / 500).toFixed(2)}ms per search)!\n`);
} else {
  console.log('Usage:');
  console.log('  npx @boostengine/search demo              Run interactive search & facet demo');
  console.log('  npx @boostengine/search suggest <query>   Test autocomplete suggestions');
  console.log('  npx @boostengine/search benchmark         Run 5,000 product indexing & query benchmark');
  console.log('  npx @boostengine/search help              Show help information\n');
}
