#!/usr/bin/env node
/**
 * @boostengine/seo v1.1.0 — Automated Test Suite
 * Runs 19 unit and integration tests validating JSON-LD schemas,
 * Google Merchant Center XML feeds, Sitemaps, Metadata, AI tools,
 * React hooks, multi-entry build output, and package configuration.
 *
 * Usage: node test-suite.cjs
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');
let mod;
try { mod = require('./dist/index.cjs'); } catch (e) {
  console.error('❌ Failed to load ./dist/index.cjs. Run "npm run build" first.\n');
  process.exit(1);
}
const {
  JsonLdGenerator, ProductFeedGenerator, SitemapGenerator, NextSeoHelper,
  generateProductJsonLd, generateBreadcrumbJsonLd, generateFaqJsonLd,
  generateHowToJsonLd, generateArticleJsonLd, generateOrganizationJsonLd,
  generateLocalBusinessJsonLd, generateItemListJsonLd,
  generateMerchantFeed, generateSitemapXml, generateRobotsTxt,
  generateNextMetadata, auditPageSEO, toScriptTag,
  allAITools, findTool, executeToolCall, toOpenAIFunctions, toAnthropicTools,
} = mod;

console.log('🧪 @boostengine/seo v1.1.0 Test Suite');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); console.log(`  ✅ ${name}`); passed++; }
  catch (err) { console.error(`  ❌ ${name}\n     ${err.message}`); failed++; }
}

const mockProduct = {
  id: 'prod_cyberpunk_hoodie', title: 'Cyberpunk 2077 Oversized Hoodie',
  description: 'Heavyweight 450 GSM pure cotton oversized hoodie.',
  url: 'https://myshop.com/products/cyberpunk-hoodie',
  images: ['https://myshop.com/images/hoodie-front.jpg', 'https://myshop.com/images/hoodie-back.jpg'],
  price: 2499, currency: 'INR', brand: 'Aesthetic Club', category: 'Apparel > Hoodies',
  availability: 'in_stock', sku: 'AC-HD-001',
  rating: { value: 4.9, count: 85 },
  reviews: [{ author: 'Vikram S.', rating: 5, body: 'Insane quality!' }],
  returnPolicy: { applicableCountry: 'IN', merchantReturnDays: 30, returnMethod: 'https://schema.org/ReturnByMail', returnFees: 'https://schema.org/FreeReturn' },
  shippingDetails: { shippingDestination: ['IN'], shippingRate: { price: 0, currency: 'INR', free: true }, deliveryTime: { minDays: 3, maxDays: 7 } },
};

// === 1. JSON-LD Schema Tests (8 tests) ===

test('1. Product JSON-LD — basic structure', () => {
  const schema = JsonLdGenerator.product(mockProduct);
  assert.strictEqual(schema['@context'], 'https://schema.org');
  assert.strictEqual(schema['@type'], 'Product');
  assert.strictEqual(schema.name, mockProduct.title);
  assert.strictEqual(schema.sku, 'AC-HD-001');
});

test('2. Product JSON-LD — Offer with MerchantReturnPolicy & ShippingDetails', () => {
  const schema = JsonLdGenerator.product(mockProduct);
  assert.ok(schema.offers);
  assert.strictEqual(schema.offers.price, 2499);
  assert.strictEqual(schema.offers.priceCurrency, 'INR');
  assert.ok(schema.offers.hasMerchantReturnPolicy);
  assert.strictEqual(schema.offers.hasMerchantReturnPolicy.merchantReturnDays, 30);
  assert.ok(schema.offers.shippingDetails);
  assert.strictEqual(schema.offers.shippingDetails['@type'], 'OfferShippingDetails');
});

test('3. Product JSON-LD — AggregateRating & Review', () => {
  const schema = JsonLdGenerator.product(mockProduct);
  assert.strictEqual(schema.aggregateRating.ratingValue, 4.9);
  assert.strictEqual(schema.aggregateRating.reviewCount, 85);
  assert.strictEqual(schema.review.length, 1);
  assert.strictEqual(schema.review[0].author.name, 'Vikram S.');
});

test('4. Product JSON-LD — brand & category', () => {
  const schema = JsonLdGenerator.product(mockProduct);
  assert.strictEqual(schema.brand.name, 'Aesthetic Club');
  assert.strictEqual(schema.category, 'Apparel > Hoodies');
});

test('5. BreadcrumbList JSON-LD', () => {
  const crumbs = [{ name: 'Home', url: 'https://myshop.com' }, { name: 'Hoodies', url: 'https://myshop.com/hoodies' }];
  const schema = JsonLdGenerator.breadcrumbs(crumbs);
  assert.strictEqual(schema['@type'], 'BreadcrumbList');
  assert.strictEqual(schema.itemListElement.length, 2);
  assert.strictEqual(schema.itemListElement[1].name, 'Hoodies');
});

test('6. FAQPage JSON-LD', () => {
  const schema = JsonLdGenerator.faq([{ question: 'Q1?', answer: 'A1.' }]);
  assert.strictEqual(schema['@type'], 'FAQPage');
  assert.strictEqual(schema.mainEntity.length, 1);
});

test('7. Organization JSON-LD with address', () => {
  const schema = JsonLdGenerator.organization({
    name: 'Boost Engine', url: 'https://boostengine.com', logo: 'https://boostengine.com/logo.png',
    sameAs: ['https://twitter.com/boostengine'],
    address: { streetAddress: '123 Main St', addressLocality: 'Mumbai', addressRegion: 'MH', postalCode: '400001', addressCountry: 'IN' },
  });
  assert.strictEqual(schema.address.addressLocality, 'Mumbai');
});

test('8. LocalBusiness, HowTo, Article, ItemList', () => {
  const lb = JsonLdGenerator.localBusiness({ name: 'Cafe', url: 'https://cafe.com', logo: 'https://cafe.com/logo.png', servesCuisine: 'Coffee' });
  assert.strictEqual(lb.servesCuisine, 'Coffee');
  const ht = JsonLdGenerator.howTo('Make Tea', 'Steps', [{ name: 'Boil', text: 'Boil water' }]);
  assert.strictEqual(ht.step.length, 1);
  const art = JsonLdGenerator.article({ headline: 'Test', description: 'D', url: 'https://ex.com/a', image: 'https://ex.com/img.jpg', datePublished: '2024-01-01', authorName: 'John', publisherName: 'P', publisherLogo: 'https://ex.com/logo.png' });
  assert.strictEqual(art['@type'], 'Article');
  const il = JsonLdGenerator.itemList([{ name: 'Item 1', url: 'https://ex.com/1' }]);
  assert.strictEqual(il.itemListElement.length, 1);
});
// === 2. Google Merchant Feed Tests ===

test('9. Google Merchant XML — feed structure & fields', () => {
  const xml = ProductFeedGenerator.googleMerchantXml({ title: 'Store', link: 'https://myshop.com', description: 'Streetwear' }, [mockProduct]);
  assert.ok(xml.includes('<?xml version="1.0" encoding="UTF-8"?>'));
  assert.ok(xml.includes('xmlns:g="http://base.google.com/ns/1.0"'));
  assert.ok(xml.includes('<g:id>prod_cyberpunk_hoodie</g:id>'));
  assert.ok(xml.includes('<g:price>2499.00 INR</g:price>'));
  assert.ok(xml.includes('<g:availability>in_stock</g:availability>'));
  assert.ok(xml.includes('<g:additional_image_link>'));
});

test('10. Meta Catalog CSV generation', () => {
  const csv = ProductFeedGenerator.metaCatalogCsv([mockProduct]);
  const lines = csv.trim().split('\n');
  assert.strictEqual(lines.length, 2);
  assert.ok(lines[0].includes('id,title,description'));
});

// === 3. Sitemap & Robots Tests ===

test('11. Sitemap XML with image extension', () => {
  const xml = SitemapGenerator.generateXml([
    { loc: 'https://myshop.com', priority: 1.0, changefreq: 'daily' },
    { loc: 'https://myshop.com/products/hoodie', priority: 0.8, changefreq: 'weekly', images: ['https://myshop.com/images/hoodie.jpg'] },
  ]);
  assert.ok(xml.includes('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'));
  assert.ok(xml.includes('<image:image>'));
  assert.ok(xml.includes('<image:loc>https://myshop.com/images/hoodie.jpg</image:loc>'));
});

test('12. Robots.txt generation', () => {
  const robots = generateRobotsTxt({ userAgent: '*', disallow: ['/admin'], sitemap: 'https://myshop.com/sitemap.xml', crawlDelay: 2 });
  assert.ok(robots.includes('User-agent: *'));
  assert.ok(robots.includes('Disallow: /admin'));
  assert.ok(robots.includes('Crawl-delay: 2'));
  assert.ok(robots.includes('Sitemap: https://myshop.com/sitemap.xml'));
});

// === 4. Next.js Metadata Test ===

test('13. Next.js Metadata generator', () => {
  const meta = generateNextMetadata(mockProduct, { siteName: 'Aesthetic Club', twitterHandle: '@aestheticclub' });
  assert.strictEqual(meta.title, 'Cyberpunk 2077 Oversized Hoodie | Aesthetic Club');
  assert.strictEqual(meta.openGraph.siteName, 'Aesthetic Club');
  assert.strictEqual(meta.twitter.card, 'summary_large_image');
  assert.strictEqual(meta.other['product:price:amount'], '2499');
});

// === 5. SEO Audit Test ===

test('14. SEO Audit scoring', () => {
  const result = auditPageSEO({
    title: 'Perfect Title Length: 55 Characters Here',
    description: 'This description is exactly the right length for optimal SEO performance at about 150 characters for testing.',
    h1: 'Perfect Title Length',
    ogTitle: 'Perfect Title Length',
    ogDescription: 'This description is exactly the right length',
    ogImage: 'https://example.com/image.jpg',
    canonical: 'https://example.com/page',
    pageUrl: 'https://example.com/page',
  });
  assert.ok(result.score >= 60, `Score should be >= 60, got ${result.score}`);
  assert.ok(typeof result.title.ok === 'boolean');
});

// === 6. AI Tools Tests ===

test('15. AI tools — all 5 tools defined with valid schemas', () => {
  assert.strictEqual(allAITools.length, 5);
  const names = allAITools.map((t) => t.name);
  assert.ok(names.includes('generate_jsonld_schema'));
  assert.ok(names.includes('generate_merchant_feed'));
  assert.ok(names.includes('optimize_meta_tags'));
  assert.ok(names.includes('generate_sitemap_xml'));
  assert.ok(names.includes('audit_page_seo'));
  for (const tool of allAITools) {
    assert.ok(typeof tool.name === 'string' && tool.name.length > 0);
    assert.ok(typeof tool.description === 'string' && tool.description.length > 0);
    assert.ok(typeof tool.parameters === 'object');
    assert.ok(typeof tool.execute === 'function');
  }
});

test('16. AI tools — execute functions return valid results', () => {
  const result = executeToolCall('generate_jsonld_schema', { type: 'Product', data: { id: 'test', title: 'Test Product', description: 'Desc', url: 'https://ex.com/p', images: ['https://ex.com/img.jpg'], price: 99.99 } });
  assert.strictEqual(result['@type'], 'Product');
  const tool = findTool('optimize_meta_tags');
  assert.ok(tool);
  assert.strictEqual(tool.name, 'optimize_meta_tags');
});

// === 7. Export Map Tests ===

test('17. Package exports — all named exports available', () => {
  assert.strictEqual(typeof JsonLdGenerator, 'function');
  assert.strictEqual(typeof ProductFeedGenerator, 'function');
  assert.strictEqual(typeof SitemapGenerator, 'function');
  assert.strictEqual(typeof NextSeoHelper, 'function');
  assert.strictEqual(typeof generateProductJsonLd, 'function');
  assert.strictEqual(typeof generateMerchantFeed, 'function');
  assert.strictEqual(typeof generateSitemapXml, 'function');
  assert.strictEqual(typeof generateRobotsTxt, 'function');
  assert.strictEqual(typeof generateNextMetadata, 'function');
  assert.strictEqual(typeof auditPageSEO, 'function');
  assert.strictEqual(typeof toScriptTag, 'function');
  assert.strictEqual(typeof allAITools, 'object');
  assert.strictEqual(typeof findTool, 'function');
  assert.strictEqual(typeof executeToolCall, 'function');
});

// === 8. Multi-Entry Build Tests ===

test('18. React bundle — "use client" directive present (ESM & CJS)', () => {
  const esm = fs.readFileSync(path.join(__dirname, 'dist', 'react', 'index.mjs'), 'utf8');
  const cjs = fs.readFileSync(path.join(__dirname, 'dist', 'react', 'index.cjs'), 'utf8');
  assert.ok(/["']use client["']/.test(esm.split('\n').slice(0, 3).join('\n')), 'ESM react bundle must start with "use client"');
  assert.ok(/["']use client["']/.test(cjs.split('\n').slice(0, 3).join('\n')), 'CJS react bundle must contain "use client"');
});

test('19. AI entry — standalone module loads & re-exports tools', () => {
  const aiMod = require('./dist/ai/index.cjs');
  assert.strictEqual(typeof aiMod.allAITools, 'object');
  assert.ok(Array.isArray(aiMod.allAITools) && aiMod.allAITools.length === 5);
  assert.strictEqual(typeof aiMod.findTool, 'function');
  assert.strictEqual(typeof aiMod.executeToolCall, 'function');
  assert.strictEqual(typeof aiMod.toOpenAIFunctions, 'function');
  assert.strictEqual(typeof aiMod.toAnthropicTools, 'function');
});

// === Results ===

console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
console.log(`📊 Results: ${passed} passed, ${failed} failed, ${passed + failed} total\n`);

if (failed > 0) { console.log('❌ Some tests failed!'); process.exit(1); }
else { console.log('🎉 All tests passed!\n'); }