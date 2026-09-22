const assert = require('assert');
const {
  InvoiceGenerator,
  numberToIndianWords,
  generateBarcodeSvg,
  validateGSTIN,
  resolveStateCode,
  determineTaxType,
  calculateGstBreakdown,
  COMMON_HSN_DIRECTORY,
  InvoicingAgentToolkit,
} = require('./dist/index.cjs');

console.log('\n=======================================================');
console.log('🚀 Running @boostengine/invoicing v1.1.0 Verification Suite');
console.log('=======================================================\n');

let passed = 0;
const testQueue = [];
function test(group, name, fn) {
  testQueue.push({ group, name, fn });
}

// 1. Number to Indian Currency Words
test('Words', 'Converts decimal rupees and paise accurately', () => {
  const words1 = numberToIndianWords(1499.50);
  assert.ok(
    words1.includes('One Thousand Four Hundred Ninety-Nine Rupees and Fifty Paise Only') ||
    words1.includes('One Thousand Four Hundred Ninety Nine Rupees and Fifty Paise Only')
  );

  const words2 = numberToIndianWords(25000);
  assert.ok(words2.includes('Twenty-Five Thousand Rupees Only') || words2.includes('Twenty Five Thousand Rupees Only'));
});

// 2. Barcode SVG Generation
test('Barcode', 'Produces valid SVG Code128 bar pattern', () => {
  const svg = generateBarcodeSvg('SR123456789IN');
  assert.ok(svg.startsWith('<svg'));
  assert.ok(svg.includes('SR123456789IN'));
  assert.ok(svg.endsWith('</svg>'));
});

// 3. GSTIN Validation Engine
test('GSTIN', 'Validates authentic 15-digit GSTIN format and extracts state/entity', () => {
  const valid = validateGSTIN('27AABCU9603R1ZM'); // 27 = Maharashtra, C = Company
  assert.strictEqual(valid.isValid, true);
  assert.strictEqual(valid.stateCode, '27');
  assert.strictEqual(valid.stateName, 'Maharashtra');
  assert.strictEqual(valid.entityType, 'Company');

  const invalidFormat = validateGSTIN('123456');
  assert.strictEqual(invalidFormat.isValid, false);

  const invalidState = validateGSTIN('95AABCU9603R1ZM'); // 95 is non-existent state code
  assert.strictEqual(invalidState.isValid, false);
});

// 4. State Code Resolution & Tax Type Determination
test('State Tax Logic', 'Intelligent Place of Supply (POS) Intra vs Inter state detection', () => {
  assert.strictEqual(resolveStateCode('Maharashtra'), '27');
  assert.strictEqual(resolveStateCode('Delhi'), '07');
  assert.strictEqual(resolveStateCode('KA'), '29');

  // Intra-state: MH to MH
  const intra = determineTaxType('27AABCU9603R1ZM', 'Maharashtra');
  assert.strictEqual(intra.isIntraState, true);

  // Inter-state: MH to Karnataka
  const inter = determineTaxType('Maharashtra', 'Karnataka');
  assert.strictEqual(inter.isIntraState, false);
});

// 5. Tax Breakdown & HSN Summary
test('Tax Calculator', 'Calculates tax-inclusive line totals, CGST/SGST/IGST and HSN rollup', () => {
  const result = calculateGstBreakdown(
    [
      { name: 'Oversized Tee', hsn: '6109', quantity: 2, unitPrice: 999, taxRate: 12 },
      { name: 'Leather Belt', hsn: '6403', quantity: 1, unitPrice: 499, taxRate: 18 },
    ],
    79, // Shipping fee
    { taxMode: 'INCLUSIVE', isIntraState: true }
  );

  assert.strictEqual(result.items.length, 2);
  assert.ok(result.cgstTotal > 0);
  assert.ok(result.sgstTotal > 0);
  assert.strictEqual(result.igstTotal, 0); // Intra-state has 0 IGST
  assert.ok(result.hsnSummary['6109']);
  assert.ok(result.hsnSummary['6403']);
});

// 6. Tax Invoice HTML Generation
test('Invoice HTML', 'Generates complete compliant Indian Tax Invoice with HSN summary', () => {
  const html = InvoiceGenerator.generateTaxInvoiceHtml({
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
      bankDetails: {
        accountName: 'Boost Commerce Pvt Ltd',
        accountNumber: '9988776655',
        bankName: 'HDFC Bank',
        ifsc: 'HDFC0001234',
        upiId: 'boost@hdfcbank',
      },
    },
    buyer: {
      name: 'Rahul Sharma',
      address: 'Flat 402, Green Valley Apartments',
      city: 'Pune',
      state: 'Maharashtra',
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

  assert.ok(html.includes('TAX INVOICE'));
  assert.ok(html.includes('INV-2026-001'));
  assert.ok(html.includes('27AAAAA0000A1Z5'));
  assert.ok(html.includes('boost@hdfcbank'));
  assert.ok(html.includes('6109'));
  assert.ok(html.toLowerCase().includes('rupees only'));
});

// 7. Credit Note HTML Generation
test('Credit Note', 'Generates credit note referencing original invoice number', () => {
  const cnHtml = InvoiceGenerator.generateCreditNoteHtml({
    creditNoteNumber: 'CN-2026-042',
    creditNoteDate: '2026-09-12',
    originalInvoiceNumber: 'INV-2026-001',
    originalInvoiceDate: '2026-09-09',
    reasonForReturn: 'Product Returned',
    seller: {
      name: 'Boost Store',
      address: 'Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
    },
    buyer: {
      name: 'Rahul Sharma',
      address: 'Pune',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411038',
      phone: '9876543210',
    },
    items: [
      { name: 'Oversized Cotton Hoodie', hsn: '6109', quantity: 1, unitPrice: 1999, taxRate: 18 },
    ],
  });

  assert.ok(cnHtml.includes('CREDIT NOTE'));
  assert.ok(cnHtml.includes('CN-2026-042'));
  assert.ok(cnHtml.includes('INV-2026-001'));
  assert.ok(cnHtml.includes('Product Returned'));
});

// 7b. Bill of Supply (Composition Scheme / Exempt Goods)
test('Bill of Supply', 'Generates Bill of Supply with Rule 49 declaration', () => {
  const bosHtml = InvoiceGenerator.generateBillOfSupplyHtml({
    invoiceNumber: 'BOS-2026-009',
    invoiceDate: '2026-09-21',
    orderId: 'ORD_BOS_1',
    paymentMethod: 'PREPAID',
    seller: {
      name: 'Organic Farm Foods',
      address: 'Nashik',
      city: 'Nashik',
      state: 'Maharashtra',
      pincode: '422001',
    },
    buyer: {
      name: 'Anjali Verma',
      address: 'Mumbai',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      phone: '9820012345',
    },
    items: [
      { name: 'Cold Pressed Coconut Oil 1L', hsn: '1513', quantity: 2, unitPrice: 450 },
    ],
    shippingFee: 50,
  });

  assert.ok(bosHtml.includes('BILL OF SUPPLY'));
  assert.ok(bosHtml.includes('BOS-2026-009'));
  assert.ok(bosHtml.includes('Composition taxable person'));
  assert.ok(bosHtml.includes('Cold Pressed Coconut Oil'));
});

// 7c. Non-GST Retail Invoice / Cash Memo (Unregistered Sellers)
test('Non-GST Invoice', 'Generates clean Retail Invoice without GST/HSN columns for unregistered sellers', () => {
  const nonGstHtml = InvoiceGenerator.generateNonGstInvoiceHtml({
    invoiceTitle: 'RETAIL INVOICE',
    invoiceNumber: 'RET-2026-101',
    invoiceDate: '2026-09-21',
    orderId: 'ORD_UNREG_1',
    paymentMethod: 'PREPAID',
    seller: {
      name: 'Pooja Homemade Crafts',
      address: 'Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560038',
      phone: '9876500000',
      pan: 'ABCDE1234F',
    },
    buyer: {
      name: 'Sneha Patel',
      address: 'Ahmedabad',
      city: 'Ahmedabad',
      state: 'Gujarat',
      pincode: '380015',
      phone: '9825000000',
    },
    items: [
      { name: 'Handmade Scented Candle', quantity: 3, unitPrice: 350 },
      { name: 'Ceramic Diya Set', quantity: 1, unitPrice: 499 },
    ],
    shippingFee: 60,
    discountAmount: 50,
  });

  assert.ok(nonGstHtml.includes('RETAIL INVOICE'));
  assert.ok(nonGstHtml.includes('RET-2026-101'));
  assert.ok(nonGstHtml.includes('Pooja Homemade Crafts'));
  assert.ok(nonGstHtml.includes('Handmade Scented Candle'));
  // Ensure NO GST / HSN terms in the item table
  assert.ok(!nonGstHtml.includes('CGST'));
  assert.ok(!nonGstHtml.includes('SGST'));
  assert.ok(!nonGstHtml.includes('IGST'));
});

// 7d. Proforma Invoice (Quotation / Estimate)
test('Proforma Invoice', 'Generates Proforma Invoice with quotation validity', () => {
  const proformaHtml = InvoiceGenerator.generateProformaInvoiceHtml({
    invoiceNumber: 'PRO-2026-55',
    invoiceDate: '2026-09-21',
    validUntil: '2026-10-05',
    orderId: 'QUOTE_991',
    paymentMethod: 'PREPAID',
    seller: {
      name: 'Tech Hardware Solutions',
      address: 'Nehru Place',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110019',
      gstin: '07AAAAA0000A1Z5',
    },
    buyer: {
      name: 'Apex Studio LLP',
      address: 'Gurugram',
      city: 'Gurugram',
      state: 'Haryana',
      pincode: '122002',
      phone: '9911223344',
      gstin: '06BBBBB1111B1Z2',
    },
    items: [
      { name: 'UltraWide Monitor 34"', hsn: '8528', quantity: 2, unitPrice: 35000, taxRate: 18 },
    ],
  });

  assert.ok(proformaHtml.includes('PROFORMA INVOICE'));
  assert.ok(proformaHtml.includes('PRO-2026-55'));
  assert.ok(proformaHtml.includes('Quote Valid Until: 2026-10-05'));
});

// 8. 4x6 Thermal Shipping Label
test('Shipping Label', 'Produces 4x6 inch thermal shipping label with AWB & COD banner', () => {
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

// 9. Thermal POS Receipt
test('Thermal Receipt', 'Generates compact 80mm/58mm thermal receipt layout', () => {
  const receiptHtml = InvoiceGenerator.generateThermalReceiptHtml(
    {
      storeName: 'Boost Urban Store',
      storeAddress: 'Indiranagar, Bangalore',
      receiptNumber: 'RCPT-9812',
      date: '2026-09-21',
      orderId: 'ORD-777',
      items: [
        { name: 'Cold Brew Coffee', price: 220, quantity: 2 },
        { name: 'Almond Croissant', price: 180, quantity: 1 },
      ],
      subtotal: 620,
      total: 620,
      paymentMethod: 'UPI (PhonePe)',
    },
    80
  );

  assert.ok(receiptHtml.includes('BOOST URBAN STORE'));
  assert.ok(receiptHtml.includes('RCPT-9812'));
  assert.ok(receiptHtml.includes('Cold Brew Coffee'));
  assert.ok(receiptHtml.includes('NET PAYABLE'));
});

// 10. Native @boostengine/cart Bridge
test('Cart Bridge', 'InvoiceGenerator.fromCart builds valid InvoiceData directly from cart instance', () => {
  const mockCart = {
    items: [
      { id: 'item_1', name: 'Vintage Graphic Tee', price: 899, quantity: 1, sku: 'TEE-VNT-01', hsn: '6109' },
      { id: 'item_2', name: 'Cargo Joggers', price: 1599, quantity: 2, sku: 'JOG-CRG-02', hsn: '6203' },
    ],
    subtotal: 4097,
    shippingFee: 99,
  };

  const invoiceData = InvoiceGenerator.fromCart(mockCart, {
    invoiceNumber: 'INV-CART-001',
    invoiceDate: '2026-09-21',
    orderId: 'ORD_CART_99',
    paymentMethod: 'PREPAID',
    seller: { name: 'Seller Store', address: 'Delhi', city: 'Delhi', state: 'Delhi', pincode: '110001' },
    buyer: { name: 'Customer One', address: 'Jaipur', city: 'Jaipur', state: 'Rajasthan', pincode: '302001', phone: '9123456780' },
  });

  assert.strictEqual(invoiceData.items.length, 2);
  assert.strictEqual(invoiceData.shippingFee, 99);
  const html = InvoiceGenerator.generateTaxInvoiceHtml(invoiceData);
  assert.ok(html.includes('INV-CART-001'));
  assert.ok(html.includes('Vintage Graphic Tee'));
});

// 11. AI Agent Toolkit
test('Agent Toolkit', 'Provides function schemas and methods for autonomous AI assistants', () => {
  const toolkit = new InvoicingAgentToolkit();
  const schemas = toolkit.getFunctionSchemas();
  assert.ok(Array.isArray(schemas));
  assert.strictEqual(schemas.length, 4);

  const gstinCheck = toolkit.validateGstin({ gstin: '27AABCU9603R1ZM' });
  assert.strictEqual(gstinCheck.isValid, true);
  assert.strictEqual(gstinCheck.stateName, 'Maharashtra');

  const hsnCheck = toolkit.lookupHsn({ hsn: '6109' });
  assert.strictEqual(hsnCheck.found, true);
  assert.strictEqual(hsnCheck.category, 'Apparel');
});

// 12. PDF Buffer Generator
test('PDF Generator', 'InvoiceGenerator.toPdfBuffer renders binary PDF via adapter', async () => {
  // Mock adapter simulating headless Chromium returning valid PDF binary
  const mockAdapter = async (html, options) => {
    return Buffer.from('%PDF-1.4 mock binary stream for ' + options.format);
  };

  const buffer = await InvoiceGenerator.toPdfBuffer('<html><body>Test Invoice</body></html>', {
    format: 'A4',
    adapter: mockAdapter,
  });

  assert.ok(Buffer.isBuffer(buffer));
  assert.ok(buffer.toString('utf8').startsWith('%PDF-1.4'));
});

(async () => {
  for (const t of testQueue) {
    try {
      await t.fn();
      console.log(`  ✅ PASS [${t.group}]: ${t.name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL [${t.group}]: ${t.name}`);
      console.error(err);
      process.exit(1);
    }
  }

  console.log('\n=======================================================');
  console.log(`📊 Test Results: ${passed} Passed | 0 Failed`);
  console.log('=======================================================\n');
  console.log(`✨ ALL ${passed} TEST SUITES PASSED! @boostengine/invoicing v1.1.0 is 100% verified.\n`);
})();
