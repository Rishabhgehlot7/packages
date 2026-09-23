#!/usr/bin/env node

const { importCatalogFromCsv } = require('../dist/index.js');

console.log('\x1b[35m⚡ BoostEngine Catalog Importer & Exporter CLI v1.1.0\x1b[0m\n');

const demoShopifyCsv = `Handle,Title,Body (HTML),Type,Tags,Option1 Name,Option1 Value,Variant SKU,Variant Price,Variant Inventory Qty,Image Src
oversized-tee,Oversized Tee,<p>Premium Cotton</p>,Apparel,Summer,Size,M,TEE-BLK-M,999.00,50,https://example.com/tee.jpg
oversized-tee,Oversized Tee,<p>Premium Cotton</p>,Apparel,Summer,Size,L,TEE-BLK-L,999.00,30,https://example.com/tee.jpg`;

const result = importCatalogFromCsv(demoShopifyCsv);

console.log(`📦 Platform Detected: \x1b[32m${result.platform.toUpperCase()}\x1b[0m`);
console.log(`📊 Rows Processed: ${result.totalRowsProcessed}`);
console.log(`👕 Products Created: ${result.productsCreated}`);
console.log(`🏷️ Variants Created: ${result.variantsCreated}`);

result.products.forEach((p) => {
  console.log(`\n  ✔ ${p.title} (${p.slug}) — ₹${p.price} [${p.variants.length} Variants]`);
  p.variants.forEach((v) => {
    console.log(`     - SKU: ${v.sku} | Size: ${v.options['Size']} | Stock: ${v.stock}`);
  });
});

console.log('\n\x1b[36m⚡ Visit https://boostengine-docs.netlify.app/ for full documentation.\x1b[0m\n');
