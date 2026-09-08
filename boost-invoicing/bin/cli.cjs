#!/usr/bin/env node
console.log('\n🧾 @boostengine/invoicing - Enterprise GST Invoicing & Thermal Shipping Labels');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const args = process.argv.slice(2);
const command = args[0] || 'help';

if (command === 'demo') {
  const { InvoiceGenerator, numberToIndianWords } = require('../dist/index.cjs');

  console.log('💰 Number to Words Test:');
  console.log('  1499.50 -> ' + numberToIndianWords(1499.50));
  console.log('  98250.00 -> ' + numberToIndianWords(98250.00) + '\n');

  console.log('📄 Tax Invoice Sample HTML generated:');
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

  console.log('  HTML Length: ' + html.length + ' characters (Ready to print or stream to PDF)');
} else {
  console.log('Usage:');
  console.log('  npx @boostengine/invoicing demo   Run live invoice & currency words demo');
  console.log('  npx @boostengine/invoicing help   Show help information\n');
}
