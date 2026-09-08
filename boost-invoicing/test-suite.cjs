const assert = require('assert');
const { InvoiceGenerator, numberToIndianWords, generateBarcodeSvg } = require('./dist/index.cjs');

console.log('🧪 Running @boostengine/invoicing Test Suite...\n');

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

// Test 1: Number to Indian Currency Words
test('Number to Indian currency words', () => {
  const words1 = numberToIndianWords(1499.50);
  assert.ok(
    words1.includes('One Thousand Four Hundred Ninety-Nine Rupees and Fifty Paise Only') ||
    words1.includes('One Thousand Four Hundred Ninety Nine Rupees and Fifty Paise Only')
  );

  const words2 = numberToIndianWords(25000);
  assert.ok(words2.includes('Twenty-Five Thousand Rupees Only') || words2.includes('Twenty Five Thousand Rupees Only'));
});

// Test 2: Barcode SVG Generation
test('Barcode SVG generator produces valid SVG', () => {
  const svg = generateBarcodeSvg('SR123456789IN');
  assert.ok(svg.startsWith('<svg'));
  assert.ok(svg.includes('SR123456789IN'));
  assert.ok(svg.endsWith('</svg>'));
});

// Test 3: Tax Invoice HTML Generation
test('Tax invoice HTML generation with GST and HSN summary', () => {
  const invoiceHtml = InvoiceGenerator.generateTaxInvoiceHtml({
    invoiceNumber: 'INV-2026-001',
    invoiceDate: '2026-09-09',
    orderId: 'ORD_1001',
    paymentMethod: 'PREPAID',
    seller: {
      name: 'Boost Commerce Pvt Ltd',
      tradeName: 'Boost Store',
      gstin: '27AAAAA0000A1Z5',
      address: '101 Tech Park, Andheri East',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400069',
    },
    buyer: {
      name: 'Rahul Sharma',
      address: 'Flat 402, Green Valley Apartments',
      city: 'Pune',
      state: 'Maharashtra', // Intra-state -> CGST + SGST
      pincode: '411038',
      phone: '+919876543210',
    },
    items: [
      {
        name: 'Oversized Cotton Hoodie',
        hsn: '6109',
        quantity: 1,
        unitPrice: 1999,
        taxRate: 18,
      },
    ],
    shippingFee: 0,
  });

  assert.ok(invoiceHtml.includes('TAX INVOICE'));
  assert.ok(invoiceHtml.includes('INV-2026-001'));
  assert.ok(invoiceHtml.includes('27AAAAA0000A1Z5'));
  assert.ok(invoiceHtml.includes('Rahul Sharma'));
  assert.ok(invoiceHtml.includes('6109'));
  assert.ok(invoiceHtml.toLowerCase().includes('rupees only'));
});

// Test 4: Thermal 4x6 Shipping Label
test('Thermal shipping label HTML generation', () => {
  const labelHtml = InvoiceGenerator.generateShippingLabelHtml({
    awb: 'DEL9876543210',
    courierName: 'Delhivery',
    routingCode: 'BOM/HUB-1',
    orderId: 'ORD_1001',
    seller: {
      name: 'Boost Store',
      address: 'Andheri East',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400069',
    },
    buyer: {
      name: 'Vikram Singh',
      address: 'Sector 62',
      city: 'Noida',
      state: 'Uttar Pradesh',
      pincode: '201301',
      phone: '+919988776655',
    },
    paymentMethod: 'COD',
    collectibleAmount: 1499,
    weightKg: 0.6,
    itemSummary: [{ name: 'Hoodie', quantity: 1 }],
  });

  assert.ok(labelHtml.includes('DEL9876543210'));
  assert.ok(labelHtml.includes('DELHIVERY'));
  assert.ok(labelHtml.includes('C.O.D. COLLECT ₹1499'));
  assert.ok(labelHtml.includes('Noida, Uttar Pradesh - 201301'));
});

console.log(`\n🎉 All ${passed} tests in @boostengine/invoicing passed successfully!\n`);
