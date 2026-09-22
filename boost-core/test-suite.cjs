/**
 * Verification test suite for @boostengine/core v1.1.0
 * Run: npm run build && npm test
 */
'use strict';

const assert = require('assert');

const core = require('./dist/index.cjs');
const ai = require('./dist/ai/index.cjs');

let passed = 0;
function ok(name) {
  passed += 1;
  console.log(`  ✅ ${name}`);
}

async function main() {
  console.log('🧪 Testing @boostengine/core v1.1.0 architecture...\n');

  // 1. Action hooks execute in priority order + removal/query helpers
  {
    const { createHooks } = core;
    const hooks = createHooks();
    const order = [];
    hooks.addAction('test', () => order.push('late'), 20);
    hooks.addAction('test', () => order.push('early'), 5);
    hooks.addAction('test', () => order.push('mid'), 10);
    await hooks.doAction('test');
    assert.deepStrictEqual(order, ['early', 'mid', 'late']);

    let asyncRan = false;
    hooks.addAction('async', async () => {
      await new Promise((r) => setTimeout(r, 5));
      asyncRan = true;
    });
    await hooks.doAction('async');
    assert.strictEqual(asyncRan, true);

    const cb = () => {};
    hooks.addAction('removable', cb);
    assert.strictEqual(hooks.hasAction('removable'), true);
    assert.strictEqual(hooks.hasAction('removable', cb), true);
    assert.strictEqual(hooks.removeAction('removable', cb), true);
    assert.strictEqual(hooks.hasAction('removable'), false);
    ok('Action hooks: priority order, async, has/remove');
  }

  // 2. Filter hooks mutate and pipe values accurately
  {
    const { createHooks } = core;
    const fh = createHooks();
    fh.addFilter('price', (v) => v + 1, 10);
    fh.addFilter('price', (v) => v * 2, 20); // runs after +1
    const result = await fh.applyFilters('price', 5);
    assert.strictEqual(result, 12); // (5 + 1) * 2

    fh.addFilter('tax', async (v, rate) => v * rate, 10);
    const taxed = await fh.applyFilters('tax', 100, 1.18);
    assert.strictEqual(taxed, 118);

    const untouched = await fh.applyFilters('missing', 42);
    assert.strictEqual(untouched, 42);

    const fcb = (v) => v;
    fh.addFilter('rm', fcb);
    assert.strictEqual(fh.hasFilter('rm', fcb), true);
    assert.strictEqual(fh.removeFilter('rm'), true);
    assert.strictEqual(fh.hasFilter('rm'), false);
    ok('Filter hooks: pipeline mutation, args, removal');
  }

  // 3. Event bus: wildcards, async listeners, replay, TTL
  {
    const { createEventBus } = core;
    const bus = createEventBus();
    const seen = [];
    bus.on('order.*', (e) => seen.push(`wild:${e.topic}`));
    bus.on('order.created', (e) => seen.push('exact'));
    await bus.emit('order.created', { id: 'o1' });
    await bus.emit('payment.success', { ok: true });
    assert.deepStrictEqual(seen, ['wild:order.created', 'exact']);

    const bus2 = createEventBus();
    let asyncRan = false;
    bus2.on('cart.updated', async () => {
      await new Promise((r) => setTimeout(r, 5));
      asyncRan = true;
    });
    await bus2.emit('cart.updated', {});
    assert.strictEqual(asyncRan, true);

    const bus3 = createEventBus();
    await bus3.emit('auth.login', { user: 1 });
    const replay = bus3.replay('auth.*');
    assert.strictEqual(replay.length, 1);
    assert.strictEqual(replay[0].topic, 'auth.login');

    const bus4 = createEventBus();
    await bus4.emit('order.created', {}, { ttl: 1 });
    await new Promise((r) => setTimeout(r, 10));
    assert.strictEqual(bus4.replay('order.created').length, 0);

    const bus5 = createEventBus();
    let count = 0;
    bus5.once('one.shot', () => count++);
    await bus5.emit('one.shot', {});
    await bus5.emit('one.shot', {});
    assert.strictEqual(count, 1);
    ok('Event bus: wildcard, async, replay, TTL, once');
  }

  // 4. Plugin lifecycle: init -> registerHooks -> boot -> shutdown + deps
  {
    const { createBoostEngine } = core;
    const engine = createBoostEngine();
    const lifecycle = [];
    await engine.registerPlugin({
      id: 'a', name: 'A', version: '1.0.0',
      async init() { lifecycle.push('a:init'); },
      async registerHooks() { lifecycle.push('a:registerHooks'); },
      async boot() { lifecycle.push('a:boot'); },
      async shutdown() { lifecycle.push('a:shutdown'); },
    });
    await engine.start();
    assert.strictEqual(engine.getPlugin('a').status, 'booted');
    assert.deepStrictEqual(lifecycle.slice(0, 3), ['a:init', 'a:registerHooks', 'a:boot']);
    await engine.shutdown();
    assert.strictEqual(engine.getPlugin('a').status, 'shutdown');
    assert.strictEqual(lifecycle.includes('a:shutdown'), true);

    const engine2 = createBoostEngine();
    const order = [];
    await engine2.registerPlugin({ id: 'dep', name: 'Dep', version: '1', async boot() { order.push('dep'); } });
    await engine2.registerPlugin({ id: 'main', name: 'Main', version: '1', dependencies: ['dep'], async boot() { order.push('main'); } });
    await engine2.start();
    assert.deepStrictEqual(order, ['dep', 'main']);
    assert.strictEqual(engine2.isPluginHealthy('main'), true);

    const engine3 = createBoostEngine();
    await engine3.registerPlugin({ id: 'orphan', name: 'Orphan', version: '1', dependencies: ['nope'] });
    await assert.rejects(() => engine3.start(), /missing dependencies/);

    const engine4 = createBoostEngine({ strictDependencies: false });
    await engine4.registerPlugin({ id: 'orphan2', name: 'Orphan2', version: '1', dependencies: ['missing'] });
    await engine4.start();
    const report = engine4.healthCheck().find((r) => r.id === 'orphan2');
    assert.strictEqual(report.healthy, false);
    assert.strictEqual(report.missingDependencies.includes('missing'), true);
    ok('Plugin lifecycle: lifecycle, dependency order, health checks');
  }

  // 5. Reactive store: updates, subscribers, derive
  {
    const { createStore } = core;
    const store = createStore({ count: 0, label: 'a' });
    const calls = [];
    store.subscribe((s, prev) => calls.push([s.count, prev.count]));
    store.setState({ count: 1 });
    store.setState((s) => ({ count: s.count + 1 }));
    assert.strictEqual(store.getState().count, 2);
    assert.deepStrictEqual(calls, [[1, 0], [2, 1]]);

    const base = createStore({ user: { name: 'x' }, count: 0 });
    const derived = base.derive((s) => s.count);
    let derivedCalls = 0;
    derived.subscribe(() => derivedCalls++);
    base.setState({ count: 1 });
    assert.strictEqual(derived.getState(), 1);
    assert.strictEqual(derivedCalls, 1);
    base.setState({ user: { name: 'y' } }); // unrelated -> no re-emit
    assert.strictEqual(derivedCalls, 1);

    const store2 = createStore({ count: 0 });
    const events = [];
    const unsub2 = store2.subscribe(() => events.push(1));
    store2.setState({ count: 1 });
    unsub2();
    store2.setState({ count: 2 });
    assert.strictEqual(events.length, 1);
    ok('Reactive store: setState, subscribe, derive, unsubscribe');
  }

  // 6. Monetary math: integer-safe precision, formatting, conversion
  {
    const m = core;
    const a = { amount: 0.1, currency: 'USD' };
    const b = { amount: 0.2, currency: 'USD' };
    const sum = m.addMoney(a, b);
    assert.strictEqual(sum.amount, 0.3);
    assert.strictEqual(sum.currency, 'USD');
    assert.strictEqual(m.toMinorUnits({ amount: 0.1, currency: 'USD' }), 10);
    assert.strictEqual(m.subtractMoney({ amount: 1.0, currency: 'USD' }, { amount: 0.33, currency: 'USD' }).amount, 0.67);
    assert.strictEqual(m.multiplyMoney({ amount: 19.99, currency: 'USD' }, 3).amount, 59.97);
    assert.strictEqual(m.formatMoney({ amount: 19.99, currency: 'USD' }), '$19.99');
    const inr = m.convertMoney({ amount: 1, currency: 'USD' }, 'INR', 83.5);
    assert.strictEqual(inr.amount, 83.5);
    assert.strictEqual(inr.currency, 'INR');
    assert.throws(() => m.addMoney({ amount: 1, currency: 'USD' }, { amount: 1, currency: 'EUR' }), /Currency mismatch/);
    ok('Monetary math: precision, format, convert, mismatch guard');
  }

  // 7. AI tools: valid OpenAI / Anthropic / MCP schemas + execution
  {
    assert.strictEqual(ai.coreTools.length, 4);
    const names = ai.coreTools.map((t) => t.name);
    assert.deepStrictEqual(names, [
      'inspect_engine_state',
      'trigger_engine_event',
      'evaluate_filter_pipeline',
      'generate_plugin_boilerplate',
    ]);

    const openai = ai.toOpenAITools(ai.coreTools);
    assert.strictEqual(openai.length, 4);
    assert.strictEqual(openai[0].type, 'function');
    assert.strictEqual(openai[0].function.name, 'inspect_engine_state');
    assert.ok(openai[0].function.parameters);

    const anthropic = ai.toAnthropicTools(ai.coreTools);
    assert.strictEqual(anthropic.length, 4);
    assert.strictEqual(anthropic[0].name, 'inspect_engine_state');
    assert.ok(anthropic[0].input_schema);

    const mcp = ai.toMCPTools(ai.coreTools);
    assert.strictEqual(mcp.tools.length, 4);
    assert.ok(mcp.tools[0].inputSchema);

    const prompt = ai.getCoreSystemPrompt();
    assert.strictEqual(typeof prompt, 'string');
    assert.ok(prompt.includes('BoostEngine'));

    const engine = core.createBoostEngine();
    engine.hooks.addFilter('discount', (v) => v + 10);
    await engine.start();
    const tools = ai.createCoreTools(engine);
    const state = await tools[0].execute({});
    assert.strictEqual(state.id, engine.id);

    const evalTool = tools.find((t) => t.name === 'evaluate_filter_pipeline');
    const res = await evalTool.execute({ tag: 'discount', value: 5 });
    assert.strictEqual(res.result, 15);

    const genTool = tools.find((t) => t.name === 'generate_plugin_boilerplate');
    const gen = genTool.execute({ id: 'my-plugin', name: 'My Plugin' });
    assert.strictEqual(gen.id, 'my-plugin');
    assert.ok(gen.source.includes("id: 'my-plugin'"));
    ok('AI tools: OpenAI/Anthropic/MCP schemas + tool execution');
  }

  // 8. Multi-entry exports load cleanly in CJS and ESM
  {
    assert.strictEqual(typeof core.createBoostEngine, 'function');
    assert.strictEqual(typeof core.createEventBus, 'function');
    assert.strictEqual(typeof core.createStore, 'function');
    assert.strictEqual(typeof core.addMoney, 'function');
    assert.strictEqual(typeof core.BoostHookSystem, 'function');
    assert.strictEqual(typeof core.boostCore, 'object');
    assert.strictEqual(typeof core.DOMAIN_EVENTS, 'object');
    assert.strictEqual(typeof ai.getCoreSystemPrompt, 'function');

    const esm = await import('./dist/index.mjs');
    assert.strictEqual(typeof esm.createBoostEngine, 'function');
    assert.strictEqual(typeof esm.addMoney, 'function');
    assert.strictEqual(typeof esm.createStore, 'function');

    const esmAi = await import('./dist/ai/index.mjs');
    assert.strictEqual(typeof esmAi.getCoreSystemPrompt, 'function');
    assert.strictEqual(esmAi.coreTools.length, 4);
    ok('Multi-entry exports: CJS + ESM load cleanly');
  }

  console.log(`\n🎉 All ${passed} test groups passed successfully!`);
}

main().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});



