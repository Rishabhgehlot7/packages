#!/usr/bin/env node
console.log('\n🛒 @boostengine/cart - Indian GST & High-Converting Cart Engine');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const args = process.argv.slice(2);
const command = args[0] || 'help';

if (command === 'demo') {
  const { createBoostCart } = require('../dist/index.cjs');

  const cart = createBoostCart({
    origin: { state: 'Maharashtra', taxMode: 'inclusive' },
    destination: { state: 'Delhi' },
    shipping: { freeShippingThreshold: 999, flatShippingRate: 79 },
    payment: { paymentMethod: 'cod', codFee: 49 },
  });

  cart.addItem({
    productId: 'tee_01',
    title: 'Minimalist Black Tee',
    price: 699,
    compareAtPrice: 1299,
    quantity: 1,
    taxRate: 18,
    hsnCode: '6109',
  });

  console.log('📦 Cart State 1:');
  let summary = cart.getSummary();
  console.log(`  Subtotal: ₹${summary.subtotal}`);
  console.log(`  Free Shipping Progress: ${summary.freeShipping.percentage}% (${summary.freeShipping.message})`);
  console.log(`  Shipping Fee: ₹${summary.shippingFee}`);
  console.log(`  COD Surcharge: ₹${summary.codFee}`);
  console.log(`  GST Breakdown: ${summary.gst.taxType} (IGST: ₹${summary.gst.igst})`);
  console.log(`  Final Total: ₹${summary.finalTotal}\n`);

  console.log('➕ Adding another item to cross Free Shipping Threshold:');
  cart.addItem({
    productId: 'cap_01',
    title: 'Vintage Cotton Cap',
    price: 499,
    compareAtPrice: 899,
    quantity: 1,
    taxRate: 18,
    hsnCode: '6505',
  });

  summary = cart.getSummary();
  console.log(`  Subtotal: ₹${summary.subtotal}`);
  console.log(`  Free Shipping Progress: ${summary.freeShipping.percentage}% (${summary.freeShipping.message})`);
  console.log(`  Shipping Fee: ₹${summary.shippingFee} (FREE!)`);
  console.log(`  Total Savings (MRP Discount): ₹${summary.totalSavings}`);
  console.log(`  Final Total: ₹${summary.finalTotal}\n`);
} else {
  console.log('Usage:');
  console.log('  npx @boostengine/cart demo   Run live cart calculation & GST breakdown demo');
  console.log('  npx @boostengine/cart help   Show help information\n');
}
