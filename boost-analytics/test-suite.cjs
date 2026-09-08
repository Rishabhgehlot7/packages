/**
 * Boost Analytics - Comprehensive Pre-Publish Test Suite
 * Validates all eCommerce tracking events, GTM DataLayer pushes,
 * Meta Pixel calls, deduplication, and listeners.
 */

// 1. Setup Mock Browser Environment
const mockSessionStore = new Map();
const mockDataLayer = [];
const mockFbqCalls = [];
const mockClarityCalls = [];

const mockWindow = {
  location: { search: '' },
  dataLayer: mockDataLayer,
  fbq: function (...args) {
    mockFbqCalls.push(args);
  },
  clarity: function (...args) {
    mockClarityCalls.push(args);
  },
  sessionStorage: {
    getItem: (key) => mockSessionStore.get(key) || null,
    setItem: (key, val) => mockSessionStore.set(key, String(val)),
    removeItem: (key) => mockSessionStore.delete(key),
    clear: () => mockSessionStore.clear(),
  },
  addEventListener: () => {},
  removeEventListener: () => {},
};

global.window = mockWindow;
global.document = {
  head: { appendChild: () => {} },
  getElementById: () => null,
  createElement: () => ({ setAttribute: () => {}, style: {} }),
  getElementsByTagName: () => [{ parentNode: { insertBefore: () => {} } }],
};
global.sessionStorage = mockWindow.sessionStorage;

const path = require('path');
const fs = require('fs');

// 2. Load compiled analytics tracker
let tracker;
const cjsPath = path.join(__dirname, 'dist', 'index.cjs');
const jsPath = path.join(__dirname, 'dist', 'index.js');

try {
  if (fs.existsSync(cjsPath)) {
    tracker = require(cjsPath);
    console.log(`📦 Testing against compiled bundle (${cjsPath})`);
  } else if (fs.existsSync(jsPath)) {
    tracker = require(jsPath);
    console.log(`📦 Testing against compiled bundle (${jsPath})`);
  } else {
    throw new Error('Neither dist/index.cjs nor dist/index.js was found.');
  }
} catch (err) {
  console.error('\n❌ Could not load built bundle: ' + err.message);
  console.error('💡 Please make sure you are in the "packages/boost-analytics" folder and run:\n   npm run build\n');
  process.exit(1);
}

// 3. Test Runner Utilities
let passed = 0;
let failed = 0;

function assert(condition, testName, details) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    if (details) console.error('     Details:', details);
    failed++;
  }
}

console.log('\n=======================================================');
console.log('🚀 Running Boost Analytics Verification Test Suite');
console.log('=======================================================\n');

// Test 1: initAnalytics & getAnalyticsConfig
console.log('--- Test Group 1: Configuration ---');
tracker.initAnalytics({
  currency: 'INR',
  defaultBrand: 'Boost Wear',
  debug: false,
});
const config = tracker.getAnalyticsConfig();
assert(config.currency === 'INR', 'Currency configured as INR');
assert(config.defaultBrand === 'Boost Wear', 'Default brand configured');

// Test 2: diagnoseAnalytics
console.log('\n--- Test Group 2: Diagnostics ---');
const diagnosis = tracker.diagnoseAnalytics();
assert(diagnosis.metaPixelReady === true, 'Meta Pixel diagnosed as Ready');
assert(diagnosis.gtmReady === true, 'GTM DataLayer diagnosed as Ready');
assert(diagnosis.clarityReady === true, 'Clarity diagnosed as Ready');

// Test 3: Event Listeners
console.log('\n--- Test Group 3: Event Listeners ---');
let capturedLogs = [];
const unsubscribe = tracker.onAnalyticsEvent((log, allLogs) => {
  capturedLogs.push(log);
});
assert(typeof unsubscribe === 'function', 'Listener returns unsubscribe function');

// Test 4: trackViewItem (PDP)
console.log('\n--- Test Group 4: Product View (ViewContent / view_item) ---');
tracker.trackViewItem({
  id: 'PROD-001',
  name: 'Oversized Anime Tee',
  price: 799,
  category: 'T-Shirts',
});

const lastGtmView = mockDataLayer.find((e) => e.event === 'view_item');
assert(!!lastGtmView, 'GTM event view_item pushed to DataLayer');
assert(lastGtmView?.ecommerce?.value === 799, 'GTM view_item price correct (799)');
assert(lastGtmView?.ecommerce?.items?.[0]?.item_id === 'PROD-001', 'GTM item_id matches PROD-001');
assert(lastGtmView?.ecommerce?.items?.[0]?.item_brand === 'Boost Wear', 'Fallback to default brand works');

const lastFbView = mockFbqCalls.find((c) => c[0] === 'track' && c[1] === 'ViewContent');
assert(!!lastFbView, 'Meta Pixel track ViewContent called');
assert(lastFbView?.[2]?.content_ids?.[0] === 'PROD-001', 'Meta Pixel content_ids matches PROD-001');
assert(lastFbView?.[2]?.value === 799, 'Meta Pixel ViewContent value correct');

// Test 5: trackAddToCart
console.log('\n--- Test Group 5: Add To Cart ---');
tracker.trackAddToCart({
  id: 'PROD-001',
  name: 'Oversized Anime Tee',
  price: 799,
  quantity: 2,
  category: 'T-Shirts',
});

const lastGtmCart = mockDataLayer.find((e) => e.event === 'add_to_cart');
assert(!!lastGtmCart, 'GTM add_to_cart event pushed');
assert(lastGtmCart?.ecommerce?.value === 1598, 'GTM add_to_cart calculated total (799 * 2 = 1598)');
assert(lastGtmCart?.ecommerce?.items?.[0]?.quantity === 2, 'GTM item quantity set to 2');

const lastFbCart = mockFbqCalls.find((c) => c[0] === 'track' && c[1] === 'AddToCart');
assert(!!lastFbCart, 'Meta Pixel AddToCart called');
assert(lastFbCart?.[2]?.value === 1598, 'Meta Pixel AddToCart value is 1598');

// Test 6: trackRemoveFromCart
console.log('\n--- Test Group 6: Remove From Cart ---');
tracker.trackRemoveFromCart({
  id: 'PROD-001',
  name: 'Oversized Anime Tee',
  price: 799,
  quantity: 1,
});
const lastGtmRemove = mockDataLayer.find((e) => e.event === 'remove_from_cart');
assert(!!lastGtmRemove, 'GTM remove_from_cart pushed to dataLayer');

// Test 7: trackBeginCheckout
console.log('\n--- Test Group 7: Initiate / Begin Checkout ---');
tracker.trackBeginCheckout({
  totalValue: 1598,
  coupon: 'BOOST50',
  items: [
    { id: 'PROD-001', name: 'Oversized Anime Tee', price: 799, quantity: 2 },
  ],
});

const lastGtmCheckout = mockDataLayer.find((e) => e.event === 'begin_checkout');
assert(!!lastGtmCheckout, 'GTM begin_checkout pushed');
assert(lastGtmCheckout?.ecommerce?.coupon === 'BOOST50', 'GTM coupon captured');

const lastFbCheckout = mockFbqCalls.find((c) => c[0] === 'track' && c[1] === 'InitiateCheckout');
assert(!!lastFbCheckout, 'Meta Pixel InitiateCheckout called');
assert(lastFbCheckout?.[2]?.num_items === 2, 'Meta Pixel num_items correctly sums quantity');

// Test 8: trackAddPaymentInfo
console.log('\n--- Test Group 8: Add Payment Info ---');
tracker.trackAddPaymentInfo({
  totalValue: 1598,
  paymentMethod: 'UPI',
  items: [
    { id: 'PROD-001', name: 'Oversized Anime Tee', price: 799, quantity: 2 },
  ],
});

const lastGtmPayment = mockDataLayer.find((e) => e.event === 'add_payment_info');
assert(!!lastGtmPayment, 'GTM add_payment_info pushed');
assert(lastGtmPayment?.ecommerce?.payment_type === 'UPI', 'Payment method UPI tracked');

// Test 9: trackPurchase & Deduplication
console.log('\n--- Test Group 9: Purchase & Deduplication ---');
const txnId = 'ORDER_1001';
tracker.trackPurchase({
  transaction_id: txnId,
  value: 1598,
  tax: 50,
  shipping: 0,
  coupon: 'BOOST50',
  items: [
    { id: 'PROD-001', name: 'Oversized Anime Tee', price: 799, quantity: 2 },
  ],
});

const purchaseGtmCount1 = mockDataLayer.filter((e) => e.event === 'purchase').length;
const purchaseFbCount1 = mockFbqCalls.filter((c) => c[1] === 'Purchase').length;
assert(purchaseGtmCount1 === 1, 'First Purchase event recorded in GTM');
assert(purchaseFbCount1 === 1, 'First Purchase event recorded in Meta Pixel');

// Fire SAME purchase again (simulating page reload / re-render)
tracker.trackPurchase({
  transaction_id: txnId,
  value: 1598,
  items: [
    { id: 'PROD-001', name: 'Oversized Anime Tee', price: 799, quantity: 2 },
  ],
});

const purchaseGtmCount2 = mockDataLayer.filter((e) => e.event === 'purchase').length;
const purchaseFbCount2 = mockFbqCalls.filter((c) => c[1] === 'Purchase').length;
assert(
  purchaseGtmCount2 === 1 && purchaseFbCount2 === 1,
  'Deduplication prevented duplicate Purchase from firing on refresh'
);

// Test 10: Event Logs & Clear
console.log('\n--- Test Group 10: Event Log Stream & Clear ---');
const totalLogs = tracker.getEventLogs();
assert(totalLogs.length > 0, `Captured ${totalLogs.length} events in memory stream`);

tracker.clearEventLogs();
assert(tracker.getEventLogs().length === 0, 'Event logs cleared cleanly');

// Test 11: MongoDB / Mongoose Model Compatibility (nested product, _id, qty)
console.log('\n--- Test Group 11: Mongoose / MongoDB Model Compatibility ---');
tracker.trackPurchase({
  transaction_id: 'MONGO_ORD_5001',
  value: 1299,
  items: [
    {
      product: {
        _id: '64f8a123bc456def78901234',
        title: 'Cyberpunk Jacket',
        price: 1299,
        brand: 'NeonStreet',
      },
      qty: 1,
    },
  ],
});
const lastMongoGtm = mockDataLayer.find((e) => e.ecommerce?.transaction_id === 'MONGO_ORD_5001');
assert(!!lastMongoGtm, 'Mongoose order recorded in GTM dataLayer');
assert(lastMongoGtm?.ecommerce?.items?.[0]?.item_id === '64f8a123bc456def78901234', 'Extracted _id from nested product');
assert(lastMongoGtm?.ecommerce?.items?.[0]?.item_name === 'Cyberpunk Jacket', 'Extracted title from nested product');

unsubscribe();

// Summary
console.log('\n=======================================================');
console.log(`📊 Test Results: ${passed} Passed | ${failed} Failed`);
console.log('=======================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('✨ ALL TESTS PASSED! Ready for NPM publish.');
}
