#!/usr/bin/env node
console.log('\n🧾 @boostengine/invoicing - Enterprise GST Invoicing, Labels & AI Toolkit');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const args = process.argv.slice(2);
const command = args[0] || 'help';

if (command === 'test') {
  require('../test-suite.cjs');
} else if (command === 'validate-gstin') {
  const gstinToTest = args[1] || '27AABCU9603R1ZM';
  try {
    const { validateGSTIN } = require('../dist/index.cjs');
    const res = validateGSTIN(gstinToTest);
    console.log(`🔍 GSTIN Validation for: ${gstinToTest}`);
    console.log(JSON.stringify(res, null, 2));
  } catch (err) {
    console.error('Please build package first: npm run build');
  }
} else if (command === 'lookup-hsn') {
  const hsnToTest = args[1] || '6109';
  try {
    const { COMMON_HSN_DIRECTORY } = require('../dist/index.cjs');
    const entry = COMMON_HSN_DIRECTORY[hsnToTest];
    if (entry) {
      console.log(`📦 HSN Code ${hsnToTest}:`);
      console.log(`  Category: ${entry.category}`);
      console.log(`  Description: ${entry.description}`);
      console.log(`  Standard GST: ${entry.standardGstRate}%`);
    } else {
      console.log(`ℹ️ HSN ${hsnToTest} not found in preloaded quick directory. (Standard rate typically 18%)`);
    }
  } catch (err) {
    console.error('Please build package first: npm run build');
  }
} else if (command === 'demo') {
  try {
    const { InvoiceGenerator, numberToIndianWords, validateGSTIN } = require('../dist/index.cjs');

    console.log('💰 Number to Words Test:');
    console.log('  1499.50 -> ' + numberToIndianWords(1499.50));
    console.log('  98250.00 -> ' + numberToIndianWords(98250.00) + '\n');

    console.log('🔍 GSTIN Validation Test:');
    const gstinRes = validateGSTIN('27AABCU9603R1ZM');
    console.log(`  State: ${gstinRes.stateName} (Code ${gstinRes.stateCode}), Entity: ${gstinRes.entityType}\n`);

    console.log('📄 Tax Invoice Sample HTML:');
    const html = InvoiceGenerator.generateTaxInvoiceHtml({
      invoiceNumber: 'INV-DEMO-01',
      invoiceDate: '2026-09-09',
      orderId: 'ORD_999',
      paymentMethod: 'PREPAID',
      seller: {
        name: 'Demo Brand',
        address: 'Mumbai',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001',
        gstin: '27ABCDE1234F1Z5',
      },
      buyer: {
        name: 'Pooja Roy',
        address: 'Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        pincode: '560038',
        phone: '+919876543210',
      },
      items: [
        { name: 'Casual Linen Shirt', hsn: '6205', quantity: 2, unitPrice: 1299, taxRate: 12 },
      ],
    });

    console.log('  HTML Length: ' + html.length + ' characters (Ready to print or stream to PDF)\n');
  } catch (err) {
    console.error('Please build package first: npm run build');
  }
} else {
  console.log('Usage:');
  console.log('  npx @boostengine/invoicing test                  Run verification test suite');
  console.log('  npx @boostengine/invoicing validate-gstin <num>  Validate 15-digit Indian GSTIN');
  console.log('  npx @boostengine/invoicing lookup-hsn <code>     Lookup standard tax rate for HSN');
  console.log('  npx @boostengine/invoicing demo                  Run live invoice & currency words demo');
  console.log('  npx @boostengine/invoicing help                  Show help information\n');
}
