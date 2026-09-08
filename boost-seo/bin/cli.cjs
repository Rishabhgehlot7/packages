#!/usr/bin/env node
console.log('\n🔍 @boostengine/seo - eCommerce SEO & Rich Snippet Generator');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const args = process.argv.slice(2);
const command = args[0] || 'help';

if (command === 'demo') {
  const { JsonLdGenerator, ProductFeedGenerator } = require('../dist/index.cjs');

  const demoProduct = {
    id: 'prod_sneaker_01',
    title: 'Retro High-Top Street Sneakers',
    description: 'Handcrafted vulcanized leather sneakers with cushioned insoles.',
    url: 'https://myshop.com/products/retro-sneakers',
    images: ['https://myshop.com/images/sneakers.jpg'],
    price: 3499,
    brand: 'Boost Kicks',
    rating: { value: 4.8, count: 52 },
  };

  console.log('✨ 1. Schema.org Product JSON-LD Script Tag (for <head>):');
  const jsonld = JsonLdGenerator.product(demoProduct);
  console.log(JsonLdGenerator.toScriptTag(jsonld));

  console.log('\n🛒 2. Google Merchant Center XML Preview:');
  const xml = ProductFeedGenerator.googleMerchantXml(
    { title: 'Boost Store', link: 'https://myshop.com', description: 'Premium D2C Goods' },
    [demoProduct]
  );
  console.log(xml.slice(0, 450) + '\n...\n');
} else {
  console.log('Usage:');
  console.log('  npx @boostengine/seo demo    Run rich snippets and Google Merchant feed preview');
  console.log('  npx @boostengine/seo help    Show help information\n');
}
