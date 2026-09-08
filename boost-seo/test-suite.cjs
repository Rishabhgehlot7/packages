const assert = require('assert');
const {
  JsonLdGenerator,
  ProductFeedGenerator,
  SitemapGenerator,
  NextSeoHelper,
} = require('./dist/index.cjs');

console.log('🧪 Running @boostengine/seo Test Suite...\n');

let passed = 0;
function test(name, fn) {
  try {
    fn();
    console.log(`  ✅ Passed: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ Failed: ${name}`);
    console.error(err);
    process.exit(1);
  }
}

const mockProduct = {
  id: 'prod_cyberpunk_hoodie',
  title: 'Cyberpunk 2077 Oversized Hoodie',
  description: 'Heavyweight 450 GSM pure cotton oversized cyberpunk aesthetic hoodie.',
  url: 'https://myshop.com/products/cyberpunk-hoodie',
  images: [
    'https://myshop.com/images/hoodie-front.jpg',
    'https://myshop.com/images/hoodie-back.jpg',
  ],
  price: 2499,
  currency: 'INR',
  brand: 'Aesthetic Club',
  category: 'Apparel > Hoodies',
  availability: 'in_stock',
  sku: 'AC-HD-001',
  rating: {
    value: 4.9,
    count: 85,
  },
  reviews: [
    { author: 'Vikram S.', rating: 5, body: 'Insane quality and print!' },
  ],
};

// Test 1: Product JSON-LD Schema
test('Product JSON-LD generation', () => {
  const schema = JsonLdGenerator.product(mockProduct);

  assert.strictEqual(schema['@context'], 'https://schema.org');
  assert.strictEqual(schema['@type'], 'Product');
  assert.strictEqual(schema.name, mockProduct.title);
  assert.strictEqual(schema.offers.price, 2499);
  assert.strictEqual(schema.offers.priceCurrency, 'INR');
  assert.strictEqual(schema.offers.availability, 'https://schema.org/InStock');
  assert.strictEqual(schema.aggregateRating.ratingValue, 4.9);
  assert.strictEqual(schema.review.length, 1);

  const scriptTag = JsonLdGenerator.toScriptTag(schema);
  assert.ok(scriptTag.startsWith('<script type="application/ld+json">'));
});

// Test 2: BreadcrumbList JSON-LD
test('Breadcrumbs JSON-LD generation', () => {
  const crumbs = [
    { name: 'Home', url: 'https://myshop.com' },
    { name: 'Apparel', url: 'https://myshop.com/collections/apparel' },
    { name: 'Hoodies', url: 'https://myshop.com/collections/hoodies' },
  ];

  const schema = JsonLdGenerator.breadcrumbs(crumbs);
  assert.strictEqual(schema['@type'], 'BreadcrumbList');
  assert.strictEqual(schema.itemListElement.length, 3);
  assert.strictEqual(schema.itemListElement[0].position, 1);
  assert.strictEqual(schema.itemListElement[2].name, 'Hoodies');
});

// Test 3: FAQ JSON-LD
test('FAQPage JSON-LD generation', () => {
  const faqs = [
    { question: 'What is the shipping time?', answer: 'Delivery takes 3-5 business days across India.' },
    { question: 'Is COD available?', answer: 'Yes, Cash on Delivery is available across all serviceable pincodes.' },
  ];

  const schema = JsonLdGenerator.faq(faqs);
  assert.strictEqual(schema['@type'], 'FAQPage');
  assert.strictEqual(schema.mainEntity.length, 2);
  assert.strictEqual(schema.mainEntity[0].name, 'What is the shipping time?');
});

// Test 4: Google Merchant Center XML Feed
test('Google Merchant Center XML Feed generation', () => {
  const storeInfo = {
    title: 'Aesthetic Club India',
    link: 'https://myshop.com',
    description: 'Streetwear and Graphic Merchandise',
  };

  const xml = ProductFeedGenerator.googleMerchantXml(storeInfo, [mockProduct]);

  assert.ok(xml.includes('xmlns:g="http://base.google.com/ns/1.0"'));
  assert.ok(xml.includes('<g:id>prod_cyberpunk_hoodie</g:id>'));
  assert.ok(xml.includes('<g:title>Cyberpunk 2077 Oversized Hoodie</g:title>'));
  assert.ok(xml.includes('<g:price>2499.00 INR</g:price>'));
  assert.ok(xml.includes('<g:availability>in_stock</g:availability>'));
  assert.ok(xml.includes('<g:additional_image_link>https://myshop.com/images/hoodie-back.jpg</g:additional_image_link>'));
});

// Test 5: Meta (Facebook) Catalog CSV
test('Meta Product Catalog CSV generation', () => {
  const csv = ProductFeedGenerator.metaCatalogCsv([mockProduct]);
  const lines = csv.trim().split('\n');

  assert.strictEqual(lines.length, 2); // 1 header + 1 row
  assert.ok(lines[0].includes('id,title,description'));
  assert.ok(lines[1].includes('"prod_cyberpunk_hoodie"'));
  assert.ok(lines[1].includes('"2499.00 INR"'));
});

// Test 6: Sitemap XML
test('Sitemap XML generator', () => {
  const xml = SitemapGenerator.generateXml([
    { loc: 'https://myshop.com', priority: 1.0, changefreq: 'daily' },
    { loc: 'https://myshop.com/products/cyberpunk-hoodie', priority: 0.8, changefreq: 'weekly' },
  ]);

  assert.ok(xml.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'));
  assert.ok(xml.includes('<loc>https://myshop.com</loc>'));
  assert.ok(xml.includes('<priority>1.0</priority>'));
});

// Test 7: Next.js App Router Metadata
test('Next.js Metadata helper', () => {
  const meta = NextSeoHelper.generateProductMetadata(mockProduct, {
    siteName: 'Aesthetic Club',
    twitterHandle: '@aestheticclub',
  });

  assert.strictEqual(meta.title, 'Cyberpunk 2077 Oversized Hoodie | Aesthetic Club');
  assert.strictEqual(meta.openGraph.siteName, 'Aesthetic Club');
  assert.strictEqual(meta.openGraph.images[0].url, 'https://myshop.com/images/hoodie-front.jpg');
  assert.strictEqual(meta.twitter.card, 'summary_large_image');
  assert.strictEqual(meta.twitter.creator, '@aestheticclub');
  assert.strictEqual(meta.other['product:price:amount'], '2499');
});

console.log(`\n🎉 All ${passed} tests in @boostengine/seo passed successfully!\n`);
