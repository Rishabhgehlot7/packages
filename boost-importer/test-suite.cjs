const assert = require('assert');
const {
  parseCsvString,
  detectPlatformSchema,
  importCatalogFromCsv,
  exportCatalogToCsv,
  parseCatalogCsvTool,
  exportCatalogCsvTool,
} = require('./dist/index.js');

console.log('🧪 Running @boostengine/importer complete test suite...\n');

try {
  // ── Test 1: CSV Parser ────────────────────────────────────────────────────
  console.log('🔹 1. Testing RFC 4180 CSV String Parser...');
  const rawCsv = `Handle,Title,"Description, with comma",Price\ntee-1,"Oversized ""Heavy"" Tee",100% Cotton,999.00\ntee-2,Chino Shorts,Summer Fit,1499.00`;
  const parsedRows = parseCsvString(rawCsv);
  assert.strictEqual(parsedRows.length, 2);
  assert.strictEqual(parsedRows[0]['Title'], 'Oversized "Heavy" Tee');
  assert.strictEqual(parsedRows[0]['Price'], '999.00');
  console.log('✅ CSV parser passed!');

  // ── Test 2: Platform Schema Detection ─────────────────────────────────────
  console.log('🔹 2. Testing Platform Detection...');
  const shopifyHeaders = ['Handle', 'Title', 'Variant SKU', 'Variant Price'];
  assert.strictEqual(detectPlatformSchema(shopifyHeaders), 'shopify');

  const wooHeaders = ['ID', 'Type', 'SKU', 'Name', 'Regular_price'];
  assert.strictEqual(detectPlatformSchema(wooHeaders), 'woocommerce');
  console.log('✅ Platform schema detection passed!');

  // ── Test 3: Shopify Multi-Variant CSV Import ──────────────────────────────
  console.log('🔹 3. Testing Shopify Multi-Variant CSV Import...');
  const shopifySample = `Handle,Title,Body (HTML),Type,Tags,Option1 Name,Option1 Value,Variant SKU,Variant Price,Variant Inventory Qty,Image Src
hoodie,Winter Hoodie,<p>Warm Fleece</p>,Apparel,Winter,Size,M,HD-M,1999.00,40,https://cdn.example.com/hoodie-m.jpg
hoodie,Winter Hoodie,<p>Warm Fleece</p>,Apparel,Winter,Size,L,HD-L,1999.00,25,https://cdn.example.com/hoodie-l.jpg
hoodie,Winter Hoodie,<p>Warm Fleece</p>,Apparel,Winter,Size,XL,HD-XL,2199.00,10,https://cdn.example.com/hoodie-xl.jpg
jogger,Cargo Jogger,<p>Slim fit</p>,Apparel,Bottoms,Size,M,JG-M,1499.00,50,https://cdn.example.com/jogger.jpg`;

  const importResult = importCatalogFromCsv(shopifySample);
  assert.strictEqual(importResult.platform, 'shopify');
  assert.strictEqual(importResult.totalRowsProcessed, 4);
  assert.strictEqual(importResult.productsCreated, 2); // 'hoodie' and 'jogger'
  assert.strictEqual(importResult.variantsCreated, 4);

  const hoodie = importResult.products.find((p) => p.slug === 'hoodie');
  assert.strictEqual(hoodie.variants.length, 3);
  assert.strictEqual(hoodie.stock, 75); // 40 + 25 + 10
  assert.strictEqual(hoodie.variants[0].options['Size'], 'M');
  assert.strictEqual(hoodie.variants[2].price, 2199.00);
  console.log('✅ Shopify Multi-Variant CSV Import passed!');

  // ── Test 4: Export to Standard CSV ────────────────────────────────────────
  console.log('🔹 4. Testing Export to CSV...');
  const exportCsv = exportCatalogToCsv(importResult.products);
  assert.strictEqual(typeof exportCsv, 'string');
  assert.strictEqual(exportCsv.includes('Winter Hoodie'), true);
  assert.strictEqual(exportCsv.includes('HD-M'), true);
  console.log('✅ Export to CSV passed!');

  // ── Test 5: AI Agent Tools ────────────────────────────────────────────────
  console.log('🔹 5. Testing AI Agent Import Tools...');
  const aiParse = parseCatalogCsvTool({ csvContent: shopifySample });
  assert.strictEqual(aiParse.detectedPlatform, 'shopify');
  assert.strictEqual(aiParse.productsCreated, 2);

  const aiExport = exportCatalogCsvTool({ products: importResult.products });
  assert.strictEqual(aiExport.rowCount, 2);
  console.log('✅ AI Agent Import Tools passed!');

  console.log('\n🎉 ALL 5 TEST STAGES FOR @boostengine/importer PASSED (100% SUCCESS)!');
} catch (err) {
  console.error('\n❌ Test failed:', err);
  process.exit(1);
}
