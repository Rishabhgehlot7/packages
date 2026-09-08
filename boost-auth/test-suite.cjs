const assert = require('assert');
const { BoostAuth, createBoostAuth } = require('./dist/index.cjs');

console.log('🧪 Running @boostengine/auth Test Suite...\n');

const auth = createBoostAuth({
  secret: 'super-secret-key-that-is-at-least-32-chars-long-12345',
  sessionExpirySeconds: 3600,
  otpExpirySeconds: 300,
});

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

// Test 1: OTP Generation & Stateless Verification
test('Stateless OTP generation and valid verification', () => {
  const otpRes = auth.generateOTP({ phone: '+919876543210' });
  assert.strictEqual(otpRes.otp.length, 6, 'Default OTP length should be 6 digits');
  assert.ok(otpRes.verificationToken, 'Should produce a stateless verification token');

  const verification = auth.verifyOTP({
    phone: '+919876543210',
    otp: otpRes.otp,
    verificationToken: otpRes.verificationToken,
  });

  assert.strictEqual(verification.success, true, 'OTP verification must succeed');
});

// Test 2: Invalid OTP Rejection
test('Stateless OTP verification rejects incorrect OTP', () => {
  const otpRes = auth.generateOTP({ phone: '+919876543210' });
  const wrongOtp = otpRes.otp === '123456' ? '654321' : '123456';

  const verification = auth.verifyOTP({
    phone: '+919876543210',
    otp: wrongOtp,
    verificationToken: otpRes.verificationToken,
  });

  assert.strictEqual(verification.success, false);
  assert.ok(verification.error.includes('Incorrect OTP'));
});

// Test 3: Expired OTP Rejection
test('Stateless OTP verification rejects expired token', () => {
  // Generate OTP with -10 second expiry
  const otpRes = auth.generateOTP({ phone: '+919876543210', expirySeconds: -10 });
  const verification = auth.verifyOTP({
    phone: '+919876543210',
    otp: otpRes.otp,
    verificationToken: otpRes.verificationToken,
  });

  assert.strictEqual(verification.success, false);
  assert.ok(verification.error.includes('expired'));
});

// Test 4: Session Creation and Verification
test('Session token creation and verification', () => {
  const session = auth.createSession({
    id: 'usr_101',
    phone: '+919876543210',
    email: 'client@example.com',
    role: 'customer',
    metadata: { name: 'Rahul Sharma' },
  });

  assert.ok(session.token, 'Session token must exist');
  assert.ok(session.cookie.headerString.includes('boost_session='), 'Cookie header must include name');
  assert.ok(session.cookie.headerString.includes('HttpOnly'), 'Cookie must be HttpOnly');

  const verified = auth.verifySession(session.token);
  assert.strictEqual(verified.isValid, true);
  assert.strictEqual(verified.user.userId, 'usr_101');
  assert.strictEqual(verified.user.phone, '+919876543210');
  assert.strictEqual(verified.user.metadata.name, 'Rahul Sharma');
});

// Test 5: Tampered Token Rejection
test('Tampered token is rejected', () => {
  const session = auth.createSession({
    id: 'usr_101',
    phone: '+919876543210',
  });

  const parts = session.token.split('.');
  // Modify payload slightly
  const tampered = `${parts[0]}.${parts[1]}abc.${parts[2]}`;
  const verified = auth.verifySession(tampered);

  assert.strictEqual(verified.isValid, false);
});

// Test 6: Extract Session from Headers
test('Extract session from Cookie or Bearer header', () => {
  const session = auth.createSession({ id: 'usr_101', phone: '+919876543210' });

  // From plain object Cookie
  const extractedCookie = auth.extractSessionToken({
    cookie: `theme=dark; boost_session=${session.token}; other=1`,
  });
  assert.strictEqual(extractedCookie, session.token);

  // From Bearer Authorization
  const extractedBearer = auth.extractSessionToken({
    authorization: `Bearer ${session.token}`,
  });
  assert.strictEqual(extractedBearer, session.token);
});

// Test 7: Logout Cookie
test('Logout cookie clears max-age', () => {
  const logout = auth.createLogoutCookie();
  assert.strictEqual(logout.options.maxAge, 0);
  assert.ok(logout.headerString.includes('Max-Age=0'));
});

// Test 8: Guest Cart Merge Engine
test('Guest cart merge combines quantities and deduplicates', () => {
  const userCart = [
    { productId: 'prod_1', variantId: 'size_m', quantity: 1, price: 999 },
    { productId: 'prod_2', variantId: 'color_blue', quantity: 2, price: 499 },
  ];

  const guestCart = [
    { productId: 'prod_1', variantId: 'size_m', quantity: 2, price: 999 }, // Duplicate! Quantity should become 3
    { productId: 'prod_3', variantId: 'default', quantity: 1, price: 1499 }, // New item
  ];

  const merged = auth.mergeGuestCart(guestCart, userCart);

  assert.strictEqual(merged.conflictsResolved, 1, 'Should resolve 1 duplicate item conflict');
  assert.strictEqual(merged.mergedItems.length, 3, 'Should have 3 distinct products in total');
  
  const item1 = merged.mergedItems.find(i => i.productId === 'prod_1');
  assert.strictEqual(item1.quantity, 3, 'prod_1 quantity should be 1 + 2 = 3');
  
  // Total: 3*999 (2997) + 2*499 (998) + 1*1499 (1499) = 5494
  assert.strictEqual(merged.subtotal, 5494);
  assert.strictEqual(merged.itemCount, 6);
});

console.log(`\n🎉 All ${passed} tests in @boostengine/auth passed successfully!\n`);
