#!/usr/bin/env node
console.log('\n🔍 @boostengine/seo v1.1.0 — Industry-King eCommerce SEO & AI Agent Engine');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const args = process.argv.slice(2);
const command = args[0] || 'help';

function showHelp() {
  console.log('Usage:');
  console.log('  npx @boostengine/seo audit --url <url>           Run SEO audit on a page');
  console.log('  npx @boostengine/seo generate-jsonld --type <type>  Generate JSON-LD schema');
  console.log('  npx @boostengine/seo merchant-feed --input <file>   Generate Merchant XML feed');
  console.log('  npx @boostengine/seo demo                         Run interactive demo');
  console.log('  npx @boostengine/seo help                         Show help\n');
}

if (command === 'audit') {
  const urlIndex = args.indexOf('--url');
  const url = urlIndex !== -1 ? args[urlIndex + 1] : null;
  if (!url) {
    console.error('❌ Error: --url parameter is required\n');
    process.exit(1);
  }
  const { auditPageSEO } = require('../dist/index.cjs');
  const result = auditPageSEO({
    title: 'Example Product | My Store',
    description: 'This is an example product description for testing purposes.',
    h1: 'Example Product',
    ogTitle: 'Example Product',
    ogDescription: 'This is an example product description',
    ogImage: 'https://example.com/image.jpg',
    canonical: url,
    pageUrl: url,
  });
  console.log(`📊 SEO Audit Score: ${result.score}/100\n`);
  console.log(`  Title:        ${result.title.message}`);
  console.log(`  Description:  ${result.description.message}`);
  console.log(`  H1:           ${result.h1.message}`);
  console.log(`  OpenGraph:    ${result.openGraph.message}`);
  console.log(`  Canonical:    ${result.canonical.message}`);
  if (result.recommendations.length > 0) {
    console.log('\n📋 Recommendations:');
    result.recommendations.forEach((r, i) => console.log(`  ${i + 1}. ${r}`));
  }
  console.log('');
} else if (command === 'generate-jsonld') {
  const typeIndex = args.indexOf('--type');
  const type = typeIndex !== -1 ? args[typeIndex + 1] : null;
  if (!type) {
    console.error('❌ Error: --type parameter is required\n');
    process.exit(1);
  }
  const { JsonLdGenerator } = require('../dist/index.cjs');
  let schema;
  switch (type.toLowerCase()) {
    case 'product':
      schema = JsonLdGenerator.product({
        id: 'prod_demo', title: 'Example Product', description: 'Amazing example product.',
        url: 'https://myshop.com/products/example', images: ['https://myshop.com/images/example.jpg'],
        price: 99.99, currency: 'USD', brand: 'Example Brand', availability: 'in_stock',
        rating: { value: 4.5, count: 100 },
      });
      break;
    case 'breadcrumbs':
      schema = JsonLdGenerator.breadcrumbs([
        { name: 'Home', url: 'https://myshop.com' },
        { name: 'Category', url: 'https://myshop.com/category' },
        { name: 'Product', url: 'https://myshop.com/category/product' },
      ]);
      break;
    case 'faq':
      schema = JsonLdGenerator.faq([
        { question: 'What is your return policy?', answer: '30-day returns.' },
        { question: 'Do you ship internationally?', answer: 'Yes, worldwide.' },
      ]);
      break;
    default:
      console.error(`❌ Unknown type: ${type}\n`);
      process.exit(1);
  }
  console.log(JSON.stringify(schema, null, 2) + '\n');
} else if (command === 'merchant-feed') {
  const { ProductFeedGenerator } = require('../dist/index.cjs');
  const inputIndex = args.indexOf('--input');
  const input = inputIndex !== -1 ? args[inputIndex + 1] : null;
if (!input) {
    const xml = ProductFeedGenerator.googleMerchantXml(
      { title: 'Demo Store', link: 'https://myshop.com', description: 'Demo product feed' },
      [{ id: 'prod_001', title: 'Demo Product', description: 'An example product for the feed',
        url: 'https://myshop.com/products/demo', images: ['https://myshop.com/images/demo.jpg'],
        price: 49.99, currency: 'USD', brand: 'Demo Brand', availability: 'in_stock' }]
    );
    console.log(xml + '\n');
    console.log('💡 Tip: Use --input products.json to generate from a file\n');
  } else {
    try {
      const fs = require('fs');
      const products = JSON.parse(fs.readFileSync(input, 'utf8'));
      const xml = ProductFeedGenerator.googleMerchantXml(
        { title: 'Store Feed', link: 'https://myshop.com', description: 'Product catalog' },
        products
      );
      console.log(xml + '\n');
    } catch (err) {
      console.error(`❌ Error reading/processing ${input}: ${err.message}\n`);
      process.exit(1);
    }
  }
} else if (command === 'demo') {
  const { JsonLdGenerator, ProductFeedGenerator, SitemapGenerator, generateNextMetadata, auditPageSEO } = require('../dist/index.cjs');

  const demoProduct = {
    id: 'prod_sneaker_01', title: 'Retro High-Top Street Sneakers',
    description: 'Handcrafted vulcanized leather sneakers with cushioned insoles.',
    url: 'https://myshop.com/products/retro-sneakers',
    images: ['https://myshop.com/images/sneakers.jpg'],
    price: 3499, currency: 'INR', brand: 'Boost Kicks',
    rating: { value: 4.8, count: 52 }, availability: 'in_stock',
  };

  console.log('✨ 1. Schema.org Product JSON-LD:');
  console.log(JsonLdGenerator.toScriptTag(JsonLdGenerator.product(demoProduct)));

  console.log('\n🛒 2. Google Merchant Center XML Preview:');
  const xml = ProductFeedGenerator.googleMerchantXml(
    { title: 'Boost Store', link: 'https://myshop.com', description: 'Premium D2C Goods' },
    [demoProduct]
  );
  console.log(xml.slice(0, 450) + '\n...\n');

  console.log('\n🗺️ 3. Sitemap XML Preview:');
  const sm = SitemapGenerator.generateXml([
    { loc: 'https://myshop.com', priority: 1.0, changefreq: 'daily' },
    { loc: 'https://myshop.com/products/retro-sneakers', priority: 0.9, changefreq: 'weekly', images: ['https://myshop.com/images/sneakers.jpg'] },
  ]);
  console.log(sm.slice(0, 350) + '\n...\n');

  console.log('\n📊 4. SEO Audit:');
  const audit = auditPageSEO({
    title: 'Retro High-Top Street Sneakers | Boost Kicks',
    description: 'Handcrafted vulcanized leather sneakers with cushioned insoles.',
    h1: 'Retro High-Top Street Sneakers',
    ogTitle: 'Retro High-Top Street Sneakers',
    ogDescription: 'Handcrafted vulcanized leather sneakers',
    ogImage: 'https://myshop.com/images/sneakers.jpg',
    canonical: 'https://myshop.com/products/retro-sneakers',
  });
  console.log(`  Score: ${audit.score}/100`);
  console.log(`  Title: ${audit.title.message}`);
  console.log(`  Description: ${audit.description.message}`);
  console.log(`  H1: ${audit.h1.message}`);
  console.log(`  OpenGraph: ${audit.openGraph.message}`);
  console.log(`  Canonical: ${audit.canonical.message}`);

  console.log('\n⚡ 5. Next.js Metadata:');
  const meta = generateNextMetadata(demoProduct, { siteName: 'Boost Kicks', twitterHandle: '@boostkicks' });
  console.log(`  Title: ${meta.title}`);
  console.log(`  Description: ${meta.description}`);
  console.log(`  OG Image: ${meta.openGraph.images[0].url}`);
  console.log(`  Twitter Card: ${meta.twitter.card}\n`);
} else {
  showHelp();
}