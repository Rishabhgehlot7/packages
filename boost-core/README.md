# @boostengine/core ⚡

[![npm version](https://img.shields.io/npm/v/@boostengine/core.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/@boostengine/core)
[![license](https://img.shields.io/npm/l/@boostengine/core.svg?style=flat-square)](https://github.com/boostengine/boostengine/blob/main/LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6.svg?style=flat-square)](https://www.typescriptlang.org/)

> The central kernel of the BoostEngine ecosystem. WordPress/Shopify-style
> action/filter hooks, a decoupled event bus, a modular plugin runtime with
> lifecycle & health checks, a reactive store, and an integer-safe money engine
> — shared by all 23 `@boostengine/*` packages.

---

## Architecture

```text
                        [ Storefront Action / Checkout Event ]
                                       │
                                       ▼
   ┌─────────────────────────────────────────────────────────────────────┐
   │                        @boostengine/core                            │
   ├─────────────────────────────────────────────────────────────────────┤
   │  Hooks        │  Event Bus     │  Plugin Runtime │  Store  │ Money  │
   │  addAction    │  on/emit       │  createBoostEngine│ atom   │ int-safe│
   │  applyFilters │  wildcard      │  lifecycle/health│ derive │ format │
   └───────┬───────────────┬───────────────┬──────────────┬───────────────┘
           │               │               │              │
   ┌───────▼──────┐ ┌──────▼──────┐ ┌───────▼────────┐ ┌──▼──────────┐
   │ WhatsApp     │ │ Loyalty     │ │ Inventory      │ │ Cart UI     │
   │ Alert Plugin │ │ Engine      │ │ Sync Plugin    │ │ (derived)   │
   └──────────────┘ └─────────────┘ └────────────────┘ └─────────────┘
```

---

## Installation

```bash
npm install @boostengine/core      # pnpm add / yarn add
```

---

## Quickstart

```ts
import { createBoostEngine, type BoostPlugin } from '@boostengine/core';

const loyalty: BoostPlugin = {
  id: 'boost-loyalty',
  name: 'Loyalty Engine',
  version: '1.0.0',
  async init(ctx) {
    console.log('loaded with settings:', ctx.config);
  },
  async registerHooks(engine) {
    engine.hooks.addAction('order.created', async (order) => {
      // award points on every new order
    });
    engine.events.on('payment.success', (e) => console.log('paid:', e.payload));
  },
  async boot() {},
  async shutdown() {},
};

const engine = createBoostEngine({ autoStart: true });
await engine.registerPlugin(loyalty);
await engine.start();
```

---

## Hooks (Actions & Filters)

```ts
import { createHooks } from '@boostengine/core';

const hooks = createHooks();

// Actions: fire-and-forget side effects, ordered by priority (lower = first)
hooks.addAction('order.created', (order) => console.log(order.id), 10);

// Filters: transform a value through an ordered pipeline
hooks.addFilter('cart.total', (total, cart) => (cart.vip ? total - 100 : total), 10);
const total = await hooks.applyFilters('cart.total', 500, { vip: true }); // 400
```

Standalone globals (`addAction`, `doAction`, `addFilter`, `applyFilters`,
`removeAction`, `removeFilter`, `hasAction`, `hasFilter`, `removeAllHooks`)
operate on a process-wide default hook system.

---

## Event Bus

```ts
import { createEventBus, DOMAIN_EVENTS } from '@boostengine/core';

const bus = createEventBus({ defaultTtl: 60_000, historyLimit: 1000 });

bus.on('order.*', (e) => console.log('order event:', e.topic)); // wildcard
bus.on(DOMAIN_EVENTS.PAYMENT.SUCCESS, (e) => console.log('paid'));

await bus.emit(DOMAIN_EVENTS.ORDER.CREATED, { id: 'ord_1' });
bus.replay('order.*'); // recent, non-expired events
```

---

## Plugin Runtime

Lifecycle order: `init` → `registerHooks` → `boot` → `shutdown`.
Dependencies resolve topologically; health checks flag unhealthy plugins.

```ts
import { createBoostEngine } from '@boostengine/core';

const engine = createBoostEngine({ strictDependencies: true });

await engine.registerPlugin({ id: 'auth', name: 'Auth', version: '1' });
await engine.registerPlugin({
  id: 'cart', name: 'Cart', version: '1',
  dependencies: ['auth'],
  async boot() { console.log('auth booted before cart'); },
});

await engine.start();
engine.healthCheck();          // [{ id, status, healthy, missingDependencies, ... }]
await engine.shutdown();
```

Legacy 1.x surface is preserved: `BoostPluginEngine`, `boostCore`, `BOOST_HOOKS`.

---

## Reactive Store

```ts
import { createStore, subscribe, derive } from '@boostengine/core';

const store = createStore({ count: 0 });
const unsub = subscribe(store, (state, prev) => console.log(state.count, prev.count));
store.setState({ count: 1 });

const count = derive(store, (s) => s.count); // memoised projection
```

---

## Money (integer-safe)

```ts
import { addMoney, multiplyMoney, convertMoney, formatMoney } from '@boostengine/core';

addMoney({ amount: 0.1, currency: 'USD' }, { amount: 0.2, currency: 'USD' });
// => { amount: 0.3, currency: 'USD' }   (no 0.30000000000000004)

multiplyMoney({ amount: 19.99, currency: 'USD' }, 3); // { amount: 59.97 }
convertMoney({ amount: 100, currency: 'USD' }, 'INR', 83.5);
formatMoney({ amount: 1299.5, currency: 'INR' });      // "₹1,299.50"
```

---

## AI Agent Toolkit

```ts
import { coreTools, toOpenAITools, toAnthropicTools, toMCPTools, getCoreSystemPrompt } from '@boostengine/core/ai';

toOpenAITools(coreTools);    // OpenAI function-calling schema
toAnthropicTools(coreTools); // Anthropic tools schema
toMCPTools(coreTools);       // MCP tools/list payload
getCoreSystemPrompt();       // authoring guide for coding agents
```

`coreTools`: `inspect_engine_state`, `trigger_engine_event`,
`evaluate_filter_pipeline`, `generate_plugin_boilerplate`.

---

## License

MIT © [Boost Engine](https://github.com/boostengine)
