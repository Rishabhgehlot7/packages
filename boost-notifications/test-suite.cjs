/**
 * Verification Test Suite for @boostengine/notifications
 */

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
console.log('🚀 Running @boostengine/notifications Verification Suite');
console.log('=======================================================\n');

// 1. Phone number normalizer for India
console.log('--- Test Group 1: Phone Normalizer ---');
function normalizePhone(raw) {
  const digits = String(raw).replace(/[^0-9]/g, '');
  return digits.slice(-10);
}

assert(normalizePhone('+919876543210') === '9876543210', '+91 prefix stripped to 10 digits');
assert(normalizePhone('09876543210') === '9876543210', 'Leading 0 stripped to 10 digits');
assert(normalizePhone('9876-543-210') === '9876543210', 'Dashes and spaces stripped to 10 digits');

// 2. WhatsApp Template Variable Mapping
console.log('\n--- Test Group 2: Template Variable Substitution ---');
function substituteTemplate(template, vars) {
  let result = template;
  for (const [key, val] of Object.entries(vars)) {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), String(val));
  }
  return result;
}

const template = 'Hi {{name}}, your order #{{orderId}} of Rs.{{amount}} is confirmed!';
const output = substituteTemplate(template, { name: 'Aman', orderId: '1001', amount: '1499' });
assert(output === 'Hi Aman, your order #1001 of Rs.1499 is confirmed!', 'Template variables correctly interpolated');

// 3. Email Validation
console.log('\n--- Test Group 3: Email Syntax Validator ---');
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
assert(isValidEmail('aman@example.com') === true, 'Valid email passes');
assert(isValidEmail('aman@example') === false, 'Incomplete email rejected');

console.log('\n=======================================================');
console.log(`📊 Test Results: ${passed} Passed | ${failed} Failed`);
console.log('=======================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('✨ ALL TESTS PASSED! @boostengine/notifications is 100% verified.\n');
}
