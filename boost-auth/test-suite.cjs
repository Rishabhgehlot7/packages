const assert = require('assert');

console.log('🧪 Running @boostengine/auth Comprehensive Test Suite...\n');

let pkg;
try {
  pkg = require('./dist/index.cjs');
} catch {
  console.log('⚠️ Warning: ./dist/index.cjs not found. Please run "npm run build" first.');
  process.exit(1);
}

const {
  BoostAuth,
  createBoostAuth,
  memoryAdapter,
  GoogleProvider,
  GitHubProvider,
  CredentialsProvider,
  OAuthHelper,
  toNextJsHandler,
  toNodeHandler,
  createAuthClient,
} = pkg;

const auth = createBoostAuth({
  secret: 'super-secret-key-that-is-at-least-32-chars-long-12345',
  sessionExpirySeconds: 3600,
  otpExpirySeconds: 300,
  providers: [
    GoogleProvider({ clientId: 'google-client-id', clientSecret: 'google-client-secret' }),
    GitHubProvider({ clientId: 'github-client-id', clientSecret: 'github-client-secret' }),
  ],
});

let passed = 0;
async function test(name, fn) {
  try {
    await fn();
    console.log(`  ✅ Passed: ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ Failed: ${name}`);
    console.error(err);
    process.exit(1);
  }
}

async function runAll() {
  // Test 1: OTP Generation & Stateless Verification
  await test('Stateless OTP generation and valid verification', () => {
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
  await test('Stateless OTP verification rejects incorrect OTP', () => {
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
  await test('Stateless OTP verification rejects expired token', () => {
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
  await test('Session token creation and verification', () => {
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
  await test('Tampered token is rejected', () => {
    const session = auth.createSession({
      id: 'usr_101',
      phone: '+919876543210',
    });

    const parts = session.token.split('.');
    const tampered = `${parts[0]}.${parts[1]}abc.${parts[2]}`;
    const verified = auth.verifySession(tampered);

    assert.strictEqual(verified.isValid, false);
  });

  // Test 6: Extract Session from Headers
  await test('Extract session from Cookie or Bearer header', () => {
    const session = auth.createSession({ id: 'usr_101', phone: '+919876543210' });

    const extractedCookie = auth.extractSessionToken({
      cookie: `theme=dark; boost_session=${session.token}; other=1`,
    });
    assert.strictEqual(extractedCookie, session.token);

    const extractedBearer = auth.extractSessionToken({
      authorization: `Bearer ${session.token}`,
    });
    assert.strictEqual(extractedBearer, session.token);
  });

  // Test 7: Logout Cookie
  await test('Logout cookie clears max-age', () => {
    const logout = auth.createLogoutCookie();
    assert.strictEqual(logout.options.maxAge, 0);
    assert.ok(logout.headerString.includes('Max-Age=0'));
  });

  // Test 8: Guest Cart Merge Engine
  await test('Guest cart merge combines quantities and deduplicates', () => {
    const userCart = [
      { productId: 'prod_1', variantId: 'size_m', quantity: 1, price: 999 },
      { productId: 'prod_2', variantId: 'color_blue', quantity: 2, price: 499 },
    ];

    const guestCart = [
      { productId: 'prod_1', variantId: 'size_m', quantity: 2, price: 999 },
      { productId: 'prod_3', variantId: 'default', quantity: 1, price: 1499 },
    ];

    const merged = auth.mergeGuestCart(guestCart, userCart);

    assert.strictEqual(merged.conflictsResolved, 1, 'Should resolve 1 duplicate item conflict');
    assert.strictEqual(merged.mergedItems.length, 3, 'Should have 3 distinct products in total');

    const item1 = merged.mergedItems.find((i) => i.productId === 'prod_1');
    assert.strictEqual(item1.quantity, 3, 'prod_1 quantity should be 1 + 2 = 3');
    assert.strictEqual(merged.subtotal, 5494);
    assert.strictEqual(merged.itemCount, 6);
  });

  // Test 9: Memory Database Adapter
  await test('MemoryAdapter CRUD and account linking', async () => {
    const adapter = memoryAdapter();
    const created = await adapter.createUser({
      name: 'Priya Verma',
      email: 'priya@example.com',
      phone: '+919811223344',
      role: 'customer',
    });

    assert.ok(created.id);
    assert.strictEqual(created.name, 'Priya Verma');

    const fetchedByEmail = await adapter.getUserByEmail('priya@example.com');
    assert.strictEqual(fetchedByEmail.id, created.id);

    const fetchedByPhone = await adapter.getUserByPhone('+919811223344');
    assert.strictEqual(fetchedByPhone.id, created.id);

    // Link OAuth account
    await adapter.linkAccount({
      userId: created.id,
      provider: 'google',
      providerAccountId: 'google_sub_998877',
    });

    const userByAccount = await adapter.getUserByAccount('google', 'google_sub_998877');
    assert.strictEqual(userByAccount.id, created.id);
  });

  // Test 10: OAuth Authorization URL Generation
  await test('OAuthHelper builds valid consent URLs with PKCE/State', () => {
    const google = GoogleProvider({
      clientId: 'google-client-id-123',
      clientSecret: 'secret',
    });

    const url = OAuthHelper.buildAuthorizationUrl(google, {
      redirectUri: 'http://localhost:3000/api/auth/callback/google',
      state: 'random_state_xyz',
      codeChallenge: 'code_challenge_abc',
    });

    assert.ok(url.includes('accounts.google.com'));
    assert.ok(url.includes('client_id=google-client-id-123'));
    assert.ok(url.includes('state=random_state_xyz'));
    assert.ok(url.includes('code_challenge=code_challenge_abc'));
  });

  // Test 11: Web Standard HTTP Router Dispatching
  await test('AuthRouter processes standard Web Request/Response for OTP', async () => {
    // 1. Send OTP Request
    const sendReq = new Request('http://localhost:3000/api/auth/otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+919988776655' }),
    });

    const sendRes = await auth.handleRequest(sendReq);
    assert.strictEqual(sendRes.status, 200);

    const sendData = await sendRes.json();
    assert.strictEqual(sendData.success, true);
    assert.strictEqual(sendData.phone, '+919988776655');
    assert.ok(sendData.verificationToken);
    assert.ok(sendData.devOtp); // Dev mode returns devOtp for instant testing

    // 2. Verify OTP Request
    const verifyReq = new Request('http://localhost:3000/api/auth/otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: '+919988776655',
        otp: sendData.devOtp,
        verificationToken: sendData.verificationToken,
      }),
    });

    const verifyRes = await auth.handleRequest(verifyReq);
    assert.strictEqual(verifyRes.status, 200);
    assert.ok(verifyRes.headers.get('set-cookie').includes('boost_session='));

    const verifyData = await verifyRes.json();
    assert.strictEqual(verifyData.success, true);
    assert.strictEqual(verifyData.user.phone, '+919988776655');
  });

  // Test 12: Framework Handlers (Next.js & Node)
  await test('Framework wrapper functions initialize without errors', () => {
    const nextHandlers = toNextJsHandler(auth);
    assert.strictEqual(typeof nextHandlers.GET, 'function');
    assert.strictEqual(typeof nextHandlers.POST, 'function');

    const nodeMiddleware = toNodeHandler(auth);
    assert.strictEqual(typeof nodeMiddleware, 'function');
  });

  // Test 13: Universal Client SDK
  await test('createAuthClient creates client with expected API shape', () => {
    const client = createAuthClient({
      baseURL: 'http://localhost:3000/api/auth',
    });

    assert.strictEqual(typeof client.signIn.phone, 'function');
    assert.strictEqual(typeof client.signIn.credentials, 'function');
    assert.strictEqual(typeof client.signIn.social, 'function');
    assert.strictEqual(typeof client.verifyOtp, 'function');
    assert.strictEqual(typeof client.getSession, 'function');
    assert.strictEqual(typeof client.signOut, 'function');
    assert.strictEqual(typeof client.guestCart.merge, 'function');
  });

  console.log(`\n🎉 All ${passed} tests in @boostengine/auth passed successfully!\n`);
}

runAll();
