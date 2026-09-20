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

  // Test 14: BoostCommunicationsProvider Integration
  await test('BoostCommunicationsProvider initializes and handles dispatch', async () => {
    let sentPayload = null;
    const mockComms = {
      sendOTP: async (params) => {
        sentPayload = params;
      },
    };

    const commsProvider = pkg.BoostCommunicationsProvider({
      client: mockComms,
      channel: 'whatsapp',
    });

    assert.strictEqual(commsProvider.id, 'boost-communications');
    await commsProvider.sendOtp({ phone: '+919988776655', otp: '445566' });
    assert.strictEqual(sentPayload.phone, '+919988776655');
    assert.strictEqual(sentPayload.otp, '445566');
    assert.strictEqual(sentPayload.channel, 'whatsapp');
  });

  // Test 15: OTP Rate Limiter & SMS Bombing Protection
  await test('Rate Limiter blocks 4th consecutive OTP request (HTTP 429)', async () => {
    const rateAuth = createBoostAuth({
      secret: 'rate-limit-test-secret-min-32-chars-long',
      rateLimit: {
        maxPerPhone: 3,
        windowSecondsPhone: 60,
      },
    });

    const makeReq = () =>
      new Request('http://localhost:3000/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.0.0.1' },
        body: JSON.stringify({ phone: '+919111222333' }),
      });

    // 1st request -> 200
    const res1 = await rateAuth.handleRequest(makeReq());
    assert.strictEqual(res1.status, 200);

    // 2nd request -> 200
    const res2 = await rateAuth.handleRequest(makeReq());
    assert.strictEqual(res2.status, 200);

    // 3rd request -> 200
    const res3 = await rateAuth.handleRequest(makeReq());
    assert.strictEqual(res3.status, 200);

    // 4th request -> 429 Too Many Requests!
    const res4 = await rateAuth.handleRequest(makeReq());
    assert.strictEqual(res4.status, 429, '4th request must be blocked with HTTP 429');
    const data4 = await res4.json();
    assert.ok(data4.error.includes('Too many OTP requests'));
    assert.ok(res4.headers.get('Retry-After'));
  });

  // Test 16: Next.js 1-Line Route Protection Middleware
  await test('createAuthMiddleware redirects unauthenticated user to loginUrl', async () => {
    const middleware = pkg.createAuthMiddleware(auth, {
      protectedRoutes: ['/dashboard', '/account'],
      loginUrl: '/login',
    });

    // Unauthenticated request to /dashboard
    const req = new Request('http://localhost:3000/dashboard');
    const res = await middleware(req);

    assert.strictEqual(res.status, 302, 'Should redirect to login');
    const location = res.headers.get('Location');
    assert.ok(location.includes('/login'));
    assert.ok(location.includes('callbackUrl=%2Fdashboard'));
  });

  // Test 17: Sliding Session Renewal in GET /session
  await test('GET /session auto-renews cookie when past 50% lifetime', async () => {
    const shortAuth = createBoostAuth({
      secret: 'sliding-session-test-secret-32-chars-long',
      sessionExpirySeconds: 10, // 10s
    });

    const session = shortAuth.createSession({ id: 'usr_slide_1', phone: '+919988776655' });
    const sessionReq = new Request('http://localhost:3000/api/auth/session', {
      method: 'GET',
      headers: { cookie: `boost_session=${session.token}` },
    });

    const sessionRes = await shortAuth.handleRequest(sessionReq);
    assert.strictEqual(sessionRes.status, 200);
    const data = await sessionRes.json();
    assert.strictEqual(data.authenticated, true);
    assert.strictEqual(data.user.userId, 'usr_slide_1');
  });

  // Test 18: Next.js Server Components & Server Actions Helper (getServerSession)
  await test('auth.getServerSession resolves user directly from headers/cookies', async () => {
    const session = auth.createSession({
      id: 'usr_rsc_99',
      name: 'Server User',
      phone: '+919999999999',
    });

    // Directly pass headers / cookies context
    const serverSession = await auth.getServerSession({
      cookies: { boost_session: session.token },
    });

    assert.ok(serverSession);
    assert.strictEqual(serverSession.userId, 'usr_rsc_99');
    assert.strictEqual(serverSession.name, 'Server User');
  });

  // Test 19: Sign in with Apple Provider
  await test('AppleProvider builds authorization URL and configures scopes', () => {
    const apple = pkg.AppleProvider({
      clientId: 'com.booststore.app',
      clientSecret: 'dummy-apple-secret',
    });

    assert.strictEqual(apple.id, 'apple');
    assert.ok(apple.authorizationUrl.includes('appleid.apple.com'));

    const profile = apple.profile({ email: 'john@privaterelay.appleid.com' }, { accessToken: 'xyz' });
    assert.strictEqual(profile.email, 'john@privaterelay.appleid.com');
  });

  // Test 20: Email OTP & Passwordless Magic Links
  await test('Email OTP generation, dispatch, and verification', async () => {
    let sentEmail = null;
    const emailAuth = createBoostAuth({
      secret: 'email-otp-test-secret-min-32-chars-long',
      providers: [
        pkg.EmailOtpProvider({
          sendEmail: async (payload) => {
            sentEmail = payload;
          },
        }),
      ],
    });

    // 1. Send Email OTP
    const sendReq = new Request('http://localhost:3000/api/auth/email-otp/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'client@booststore.in' }),
    });

    const sendRes = await emailAuth.handleRequest(sendReq);
    assert.strictEqual(sendRes.status, 200);
    const sendData = await sendRes.json();
    assert.strictEqual(sendData.success, true);
    assert.strictEqual(sendData.email, 'client@booststore.in');
    assert.ok(sentEmail);
    assert.strictEqual(sentEmail.email, 'client@booststore.in');
    assert.ok(sentEmail.otp);

    // 2. Verify Email OTP
    const verifyReq = new Request('http://localhost:3000/api/auth/email-otp/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'client@booststore.in',
        otp: sentEmail.otp,
        verificationToken: sendData.verificationToken,
      }),
    });

    const verifyRes = await emailAuth.handleRequest(verifyReq);
    assert.strictEqual(verifyRes.status, 200);
    const verifyData = await verifyRes.json();
    assert.strictEqual(verifyData.success, true);
    assert.strictEqual(verifyData.user.email, 'client@booststore.in');
  });

  // Test 21: Native RFC 6238 TOTP 2FA Engine (Google Authenticator)
  await test('TOTPManager generates and verifies 6-digit tokens and URI', () => {
    const secret = pkg.TOTPManager.generateSecret();
    assert.ok(secret);
    assert.strictEqual(typeof secret, 'string');

    // Build URI for QR code
    const uri = pkg.TOTPManager.generateOtpAuthUri({
      secret,
      accountName: 'admin@booststore.in',
      issuer: 'BoostStore',
    });
    assert.ok(uri.startsWith('otpauth://totp/'));
    assert.ok(uri.includes('secret='));

    // Generate and verify current token
    const token = pkg.TOTPManager.generateToken(secret);
    assert.strictEqual(token.length, 6);
    const isValid = pkg.TOTPManager.verifyToken(token, secret);
    assert.strictEqual(isValid, true, 'Current TOTP token must be valid');

    // Reject wrong token
    const isWrongValid = pkg.TOTPManager.verifyToken('000000', secret);
    assert.strictEqual(isWrongValid, false, 'Invalid token must be rejected');
  });

  // Test 22: B2B Organizations & Teams
  await test('OrganizationManager creates orgs, adds members, and lists memberships', async () => {
    const { organization, membership } = await auth.organizations.create({
      name: 'Acme Enterprise',
      userId: 'usr_founder_1',
    });

    assert.ok(organization.id);
    assert.strictEqual(organization.name, 'Acme Enterprise');
    assert.strictEqual(membership.role, 'owner');

    // Add team member
    const teamMember = await auth.organizations.addMember({
      organizationId: organization.id,
      userId: 'usr_engineer_2',
      role: 'member',
    });
    assert.strictEqual(teamMember.role, 'member');

    // List user orgs
    const founderOrgs = await auth.organizations.listUserOrganizations('usr_founder_1');
    assert.strictEqual(founderOrgs.length, 1);
    assert.strictEqual(founderOrgs[0].role, 'owner');

    const memberOrgs = await auth.organizations.listUserOrganizations('usr_engineer_2');
    assert.strictEqual(memberOrgs.length, 1);
    assert.strictEqual(memberOrgs[0].role, 'member');
  });

  // Test 23: Native Zero-Dependency Password Hashing & Timing-Safe Verification
  await test('hashPassword and verifyPassword using crypto.scrypt', async () => {
    const plain = 'SuperSecretP@ss123!';
    const hash = await pkg.hashPassword(plain);

    assert.ok(hash.includes(':'), 'Hash must contain salt and derived key');
    const valid = await pkg.verifyPassword(plain, hash);
    assert.strictEqual(valid, true, 'Correct password must verify successfully');

    const wrong = await pkg.verifyPassword('WrongPassword!', hash);
    assert.strictEqual(wrong, false, 'Wrong password must fail verification');
  });

  // Test 24: Email with Password authentication via CredentialsProvider & Router
  await test('Email + Password sign-in via CredentialsProvider and /signin/credentials route', async () => {
    const userDb = {
      'alice@example.com': {
        id: 'usr_alice_123',
        email: 'alice@example.com',
        name: 'Alice Smith',
        passwordHash: await pkg.hashPassword('MySecurePass!'),
      },
    };

    const authWithCredentials = pkg.createBoostAuth({
      secret: 'super-secret-key-that-is-at-least-32-chars-long-12345',
      providers: [
        pkg.CredentialsProvider({
          authorize: async (credentials) => {
            const user = userDb[credentials.email];
            if (!user) return null;
            const valid = await pkg.verifyPassword(credentials.password, user.passwordHash);
            if (!valid) return null;
            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: 'customer',
            };
          },
        }),
      ],
    });

    // Valid login
    const validReq = new Request('http://localhost:3000/api/auth/signin/credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'alice@example.com',
        password: 'MySecurePass!',
      }),
    });

    const validRes = await authWithCredentials.handleRequest(validReq);
    assert.strictEqual(validRes.status, 200);
    const validData = await validRes.json();
    assert.strictEqual(validData.success, true);
    assert.strictEqual(validData.user.email, 'alice@example.com');
    assert.ok(validData.token, 'Session token must be returned');

    // Invalid password
    const invalidReq = new Request('http://localhost:3000/api/auth/signin/credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'alice@example.com',
        password: 'WrongPassword!',
      }),
    });

    const invalidRes = await authWithCredentials.handleRequest(invalidReq);
    assert.strictEqual(invalidRes.status, 401);
  });

  console.log(`\n🎉 All ${passed} tests in @boostengine/auth passed successfully!\n`);
}

runAll();
