/**
 * Verification test suite for @boostengine/server v1.1.0
 * Run: npm run build && npm test
 */
'use strict';

const assert = require('assert');
const crypto = require('crypto');

const core = require('./dist/index.cjs');
const fastifyMod = require('./dist/fastify.cjs');
const honoMod = require('./dist/hono.cjs');
const ai = require('./dist/ai.cjs');

let passed = 0;
function ok(name) {
  passed += 1;
  console.log(`  ✅ ${name}`);
}

async function main() {
  console.log('🧪 Testing @boostengine/server v1.1.0...\n');

  // 1. createBoostRouter creates a valid Express router with all routes
  {
    assert.strictEqual(typeof core.createBoostRouter, 'function');
    assert.strictEqual(typeof core.createBoostApiRouter, 'function');

    const router = core.createBoostRouter();
    assert.strictEqual(typeof router, 'function', 'Express router should be a function');

    const routes = core.buildRouteDefinitions();
    const paths = routes.map((r) => `${r.method} ${r.path}`);
    assert.ok(paths.includes('POST /payments/create-order'));
    assert.ok(paths.includes('POST /payments/webhook'));
    assert.ok(paths.includes('GET /shipping/track/:awb'));
    assert.ok(paths.includes('POST /auth/send-otp'));
    assert.ok(paths.includes('GET /cart'));
    assert.ok(paths.includes('POST /coupons/validate'));
    assert.ok(paths.includes('POST /returns/initiate'));
    assert.ok(paths.includes('POST /invoicing/generate'));
    assert.ok(paths.includes('GET /health'));
    assert.ok(paths.includes('GET /ping'));

    assert.ok(router.stack.length >= 20, `expected >=20 mounted routes, got ${router.stack.length}`);

    const prefixed = core.buildRouteDefinitions({ prefix: '/v1' });
    assert.ok(prefixed.some((r) => r.path === '/v1/health'));
    ok('Express router creation + all registered routes');
  }

  // 2. Webhook signature verification (Razorpay, Stripe, Cashfree)
  {
    const secret = 'whsec_test_123';
    const payload = JSON.stringify({ event: 'payment.captured', id: 'pay_1' });

    const rzpSig = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    assert.strictEqual(core.verifyWebhookSignature('razorpay', payload, rzpSig, secret), true);
    assert.strictEqual(core.verifyWebhookSignature('razorpay', payload, 'deadbeef', secret), false);

    const ts = '1700000000';
    const stripeV1 = crypto.createHmac('sha256', secret).update(`${ts}.${payload}`).digest('hex');
    const stripeSig = `t=${ts},v1=${stripeV1}`;
    assert.strictEqual(core.verifyWebhookSignature('stripe', payload, stripeSig, secret), true);
    assert.strictEqual(core.verifyWebhookSignature('stripe', payload, `t=${ts},v1=bad`, secret), false);

    const cfts = '1700000000000';
    const cfSig = crypto.createHmac('sha256', secret).update(`${cfts}${payload}`).digest('base64');
    assert.strictEqual(core.verifyWebhookSignature('cashfree', payload, cfSig, secret, { timestamp: cfts }), true);
    assert.strictEqual(core.verifyWebhookSignature('cashfree', payload, 'wrong', secret, { timestamp: cfts }), false);

    const signed = core.signWebhookPayload('razorpay', payload, secret);
    assert.strictEqual(core.verifyWebhookSignature('razorpay', payload, signed, secret), true);
    ok('Webhook signature verification: Razorpay, Stripe, Cashfree');
  }

  // 3. Fastify & Hono adapters initialize without crashes
  {
    const mockFastify = { routes: [], route(def) { this.routes.push(def); } };
    let doneCalled = false;
    fastifyMod.boostFastifyPlugin(mockFastify, {}, () => { doneCalled = true; });
    assert.strictEqual(mockFastify.routes.length >= 20, true);
    assert.strictEqual(doneCalled, true);

    const mockHono = { handlers: [], on(method, path, handler) { this.handlers.push({ method, path, handler }); } };
    honoMod.boostHonoMiddleware(mockHono, {});
    assert.strictEqual(mockHono.handlers.length >= 20, true);
    ok('Fastify & Hono adapters initialize without crashes');
  }

  // 4. Error handler middleware formats standard error responses
  {
    let status = 0;
    let jsonBody = null;
    const res = {
      status(code) { status = code; return this; },
      json(body) { jsonBody = body; return this; },
    };
    core.errorHandler(new Error('Boom'), {}, res, () => {});
    assert.strictEqual(status, 500);
    assert.deepStrictEqual(jsonBody, { success: false, error: 'Boom' });

    let status2 = 0;
    let jsonBody2 = null;
    const res2 = {
      status(code) { status2 = code; return this; },
      json(body) { jsonBody2 = body; return this; },
    };
    core.errorHandler({ status: 400, message: 'Bad input', code: 'BAD_INPUT' }, {}, res2, () => {});
    assert.strictEqual(status2, 400);
    assert.deepStrictEqual(jsonBody2, { success: false, error: 'Bad input', code: 'BAD_INPUT' });

    const idem = core.createIdempotencyHandler();
    let idemStatus = 0;
    let idemBody = null;
    const req = { headers: { 'idempotency-key': 'k1' } };
    const res3 = { status(c) { idemStatus = c; return this; }, json(b) { idemBody = b; return this; } };
    idem(req, res3, () => {});
    assert.strictEqual(idemStatus, 0);
    idem(req, res3, () => {});
    assert.strictEqual(idemStatus, 409);
    assert.strictEqual(idemBody.success, false);
    ok('Error handler + idempotency middleware');
  }

  // 5. AI tool schemas & execution
  {
    assert.strictEqual(ai.serverTools.length, 4);
    const names = ai.serverTools.map((t) => t.name);
    assert.deepStrictEqual(names, [
      'inspect_server_routes',
      'generate_webhook_payload',
      'verify_webhook_signature_tool',
      'generate_server_boilerplate',
    ]);

    const openai = ai.toOpenAITools(ai.serverTools);
    assert.strictEqual(openai[0].type, 'function');
    assert.strictEqual(openai[0].function.name, 'inspect_server_routes');
    assert.ok(openai[0].function.parameters);

    const anthropic = ai.toAnthropicTools(ai.serverTools);
    assert.strictEqual(anthropic[0].name, 'inspect_server_routes');
    assert.ok(anthropic[0].input_schema);

    const mcp = ai.toMCPTools(ai.serverTools);
    assert.ok(mcp.tools[0].inputSchema);

    const routes = ai.serverTools[0].execute({});
    assert.ok(routes.length >= 20);
    assert.ok(routes.some((r) => r.path === '/health'));

    const payload = ai.serverTools[1].execute({ provider: 'razorpay', event: 'payment.captured' });
    assert.ok(payload.payload.payment.entity.id);

    const verify = ai.serverTools[2].execute({ provider: 'razorpay', payload: '{}', secret: 's3cret' });
    assert.strictEqual(verify.valid, null);
    const verify2 = ai.serverTools[2].execute({ provider: 'razorpay', payload: '{}', secret: 's3cret', signature: verify.expected });
    assert.strictEqual(verify2.valid, true);

    const gen = ai.serverTools[3].execute({ framework: 'express' });
    assert.ok(gen.source.includes('createBoostRouter'));

    const prompt = ai.getServerSystemPrompt();
    assert.ok(prompt.includes('BoostEngine'));
    ok('AI tools: schemas + execution');
  }

  // 6. Multi-entry submodules load in CJS and ESM
  {
    assert.strictEqual(typeof core.verifyWebhookSignature, 'function');
    assert.strictEqual(typeof fastifyMod.boostFastifyPlugin, 'function');
    assert.strictEqual(typeof honoMod.boostHonoMiddleware, 'function');
    assert.strictEqual(typeof ai.getServerSystemPrompt, 'function');

    const esmIndex = await import('./dist/index.mjs');
    assert.strictEqual(typeof esmIndex.createBoostRouter, 'function');
    assert.strictEqual(typeof esmIndex.verifyWebhookSignature, 'function');

    const esmFastify = await import('./dist/fastify.mjs');
    assert.strictEqual(typeof esmFastify.boostFastifyPlugin, 'function');

    const esmHono = await import('./dist/hono.mjs');
    assert.strictEqual(typeof esmHono.boostHonoMiddleware, 'function');

    const esmAi = await import('./dist/ai.mjs');
    assert.strictEqual(esmAi.serverTools.length, 4);
    ok('Multi-entry submodules load cleanly in CJS + ESM');
  }

  console.log(`\n🎉 All ${passed} test groups passed successfully!`);
}

main().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});


