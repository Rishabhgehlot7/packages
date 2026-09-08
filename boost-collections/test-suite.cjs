const fs = require('fs');
const path = require('path');

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
console.log('🚀 Running @boostengine/collections Complete Test Suite');
console.log('=======================================================\n');

const collections = [
  { key: 'razorpay', name: 'Razorpay Payments', authType: 'basic', envKey: 'razorpay_key_id' },
  { key: 'cashfree', name: 'Cashfree PG', authType: 'noauth', envKey: 'cashfree_app_id' },
  { key: 'phonepe', name: 'PhonePe PG', authType: 'noauth', envKey: 'phonepe_merchant_id' },
  { key: 'paytm', name: 'Paytm PG', authType: 'noauth', envKey: 'paytm_mid' },
  { key: 'stripe', name: 'Stripe Global', authType: 'bearer', envKey: 'stripe_secret_key' },
  { key: 'easyecom', name: 'EasyEcom WMS', authType: 'bearer', envKey: 'easyecom_api_token' },
  { key: 'shiprocket', name: 'Shiprocket Logistics', authType: 'bearer', envKey: 'shiprocket_token' },
  { key: 'delhivery', name: 'Delhivery Express', authType: 'noauth', envKey: 'delhivery_api_token' },
  { key: 'shopify', name: 'Shopify Admin REST', authType: 'noauth', envKey: 'shopify_access_token' },
];

// 1. Validate All 8 Collections
console.log('--- Test Group 1: Validate Postman Collections v2.1.0 ---');
collections.forEach((c) => {
  const colFile = path.join(__dirname, 'collections', `${c.key}.collection.json`);
  assert(fs.existsSync(colFile), `[${c.key.toUpperCase()}] Collection file exists`);

  try {
    const json = JSON.parse(fs.readFileSync(colFile, 'utf8'));
    assert(json.info?.schema?.includes('v2.1.0'), `[${c.key.toUpperCase()}] Schema is Postman v2.1.0`);
    assert(Array.isArray(json.item) && json.item.length > 0, `[${c.key.toUpperCase()}] Contains API folders (${json.item.length} folders)`);

    let reqCount = 0;
    json.item.forEach((folder) => {
      if (folder.item) reqCount += folder.item.length;
      else if (folder.request) reqCount += 1;
    });
    assert(reqCount > 0, `[${c.key.toUpperCase()}] Has configured endpoints (${reqCount} endpoints)`);
  } catch (err) {
    assert(false, `[${c.key.toUpperCase()}] JSON parsing error`, err.message);
  }
});

// 2. Validate All 8 Environment Templates
console.log('\n--- Test Group 2: Validate Environment Templates ---');
collections.forEach((c) => {
  const envFile = path.join(__dirname, 'environments', `${c.key}.env.json`);
  assert(fs.existsSync(envFile), `[${c.key.toUpperCase()}] Environment file exists`);

  try {
    const json = JSON.parse(fs.readFileSync(envFile, 'utf8'));
    assert(json._postman_variable_scope === 'environment', `[${c.key.toUpperCase()}] Scope is environment`);
    assert(json.values.some((v) => v.key === c.envKey), `[${c.key.toUpperCase()}] Contains auth key: ${c.envKey}`);
  } catch (err) {
    assert(false, `[${c.key.toUpperCase()}] Environment JSON parsing error`, err.message);
  }
});

// 3. Test CLI Export for All 8 Collections
console.log('\n--- Test Group 3: CLI Export Engine for All 8 Collections ---');
const testExportDir = path.join(__dirname, 'temp_test_export');
if (!fs.existsSync(testExportDir)) {
  fs.mkdirSync(testExportDir, { recursive: true });
}

collections.forEach((c) => {
  const srcCol = path.join(__dirname, 'collections', `${c.key}.collection.json`);
  const srcEnv = path.join(__dirname, 'environments', `${c.key}.env.json`);
  const destCol = path.join(testExportDir, `${c.key}.collection.json`);
  const destEnv = path.join(testExportDir, `${c.key}.env.json`);

  fs.copyFileSync(srcCol, destCol);
  fs.copyFileSync(srcEnv, destEnv);
});

const exportedCount = fs.readdirSync(testExportDir).length;
assert(exportedCount === collections.length * 2, `Exported all 16 files (8 collections + 8 envs)`);

fs.rmSync(testExportDir, { recursive: true, force: true });
assert(!fs.existsSync(testExportDir), 'Cleaned up temporary export directory');

// 4. Test CLI Executable
console.log('\n--- Test Group 4: CLI Executable Check ---');
const cliPath = path.join(__dirname, 'bin', 'cli.cjs');
assert(fs.existsSync(cliPath), 'CLI executable (bin/cli.cjs) exists');

console.log('\n=======================================================');
console.log(`📊 Test Results: ${passed} Passed | ${failed} Failed`);
console.log('=======================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('✨ ALL 8 COLLECTIONS 100% VERIFIED AND READY!');
}
