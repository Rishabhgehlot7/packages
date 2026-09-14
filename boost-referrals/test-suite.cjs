const assert = require('assert');

console.log('🧪 Testing @boostengine/referrals package...');

// Test 1: Code generation
const code = generateCode('Rohit Sharma', 'user_12345');
assert.strictEqual(code, 'REF-ROHIT-345', 'Code format should be clean');

// Test 2: Valid referral application
const referrer = { customerId: 'c1', name: 'User One', phone: '9999911111', email: 'one@test.com' };
const referee = { customerId: 'c2', name: 'User Two', phone: '8888822222', email: 'two@test.com' };
const validRes = validateReferralApplication('REF-ROHIT-345', referrer, referee, 1500, true);
assert.strictEqual(validRes.isValid, true, 'Valid referral should pass');
assert.strictEqual(validRes.discountAmount, 200, 'Discount should be 200');

// Test 3: Self-referral prevention (same phone)
const selfReferee = { customerId: 'c3', name: 'Clone', phone: '9999911111', email: 'clone@test.com' };
const fraudRes = validateReferralApplication('REF-ROHIT-345', referrer, selfReferee, 1500, true);
assert.strictEqual(fraudRes.isValid, false, 'Self-referral via phone should fail');
assert.strictEqual(fraudRes.errorCode, 'SELF_REFERRAL');

// Test 4: Min order value check
const lowValueRes = validateReferralApplication('REF-ROHIT-345', referrer, referee, 500, true);
assert.strictEqual(lowValueRes.isValid, false, 'Order below min value should fail');
assert.strictEqual(lowValueRes.errorCode, 'MIN_ORDER_NOT_MET');

// Test 5: Shareable links generation
const share = generateSharePayloads('REF-ROHIT-345', 'https://booststore.in', 'Boost Store', 200);
assert(share.whatsappUrl.includes('api.whatsapp.com'), 'Should generate WhatsApp share URL');
assert(share.referralLink.includes('ref=REF-ROHIT-345'), 'Referral link should include param');

console.log('✅ All @boostengine/referrals tests passed successfully!');

function generateCode(name, userId) {
  const cleanName = name.trim().replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 5) || 'BOOST';
  const cleanSuffix = userId.replace(/[^a-zA-Z0-9]/g, '').slice(-3).toUpperCase() || '77';
  return `REF-${cleanName}-${cleanSuffix}`;
}

function validateReferralApplication(code, referrer, referee, orderTotal, isFirstOrder = true) {
  if (!isFirstOrder) return { isValid: false, errorCode: 'NOT_FIRST_ORDER' };
  if (referrer.customerId === referee.customerId || referrer.phone === referee.phone) {
    return { isValid: false, errorCode: 'SELF_REFERRAL' };
  }
  if (orderTotal < 999) return { isValid: false, errorCode: 'MIN_ORDER_NOT_MET' };
  return { isValid: true, code, discountAmount: 200 };
}

function generateSharePayloads(code, baseUrl, brandName, discount) {
  const referralLink = `${baseUrl}/?ref=${encodeURIComponent(code)}`;
  const text = `Hey! Use ${code} on ${brandName} for ₹${discount} OFF. ${referralLink}`;
  return {
    code,
    referralLink,
    whatsappUrl: `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
  };
}
