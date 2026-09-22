import { PackageDoc } from '../../types';

export const corePackages: PackageDoc[] = [
  {
    id: 'boost-core',
    name: '@boostengine/core',
    categoryId: 'core',
    version: '1.1.0',
    description: 'WordPress/Shopify-style modular plugin runtime with Action/Filter event dispatch, Event Bus, Plugin lifecycle management, Money Engine, and AI Agent toolkits.',
    badge: 'Foundation',
    npmInstall: 'npm i @boostengine/core',
    bundleSize: '4.2 KB',
    useCase: 'Allows 3rd party plugins or custom business logic to hook into checkout, orders, or price calculations without modifying core code.',
    features: [
      'Synchronous and Asynchronous Action hooks (doAction / doActionAsync)',
      'Value mutating Filters (applyFilters / applyFiltersAsync)',
      'Priority ordering for multiple listeners',
      'Isolated plugin sandbox with error safety'
    ],
    apiMethods: [
      {
        name: 'addAction',
        signature: 'addAction(hookName: string, callback: Function, priority?: number): void',
        description: 'Registers a callback to be executed when an action hook triggers.',
        params: [
          { name: 'hookName', type: 'string', description: 'Event identifier (e.g. order.created)', required: true },
          { name: 'callback', type: 'Function', description: 'Execution handler receiving payload', required: true },
          { name: 'priority', type: 'number', description: 'Execution priority (lower runs earlier, default: 10)', required: false }
        ],
        returns: 'void'
      },
      {
        name: 'applyFilters',
        signature: 'applyFilters<T>(hookName: string, initialValue: T, ...args: any[]): T',
        description: 'Runs an initial value through a pipeline of registered filter functions to mutate it.',
        params: [
          { name: 'hookName', type: 'string', description: 'Filter identifier (e.g. cart.item_price)', required: true },
          { name: 'initialValue', type: 'T', description: 'Original value to be modified', required: true }
        ],
        returns: 'T - Mutated final value'
      }
    ],
    examples: [
      {
        title: 'Multi-Entry Imports: Root + ./ai Agent Toolkit',
        language: 'typescript',
        code: `// Root entry: Hooks, Event Bus, Plugin Runtime, Money Engine
import { addAction, addFilter, applyFilters, createEventBus } from '@boostengine/core';

// ./ai entry: AI Agent toolkits (OpenAI / Anthropic / MCP)
import { toOpenAITools, toAnthropicTools, toMCPTools, coreTools } from '@boostengine/core/ai';

// Use both in one app
const bus = createEventBus();
bus.on('order.placed', (order) => console.log('Order', order.id));
addFilter('cart.item_price', (price) => price * 0.9, 5);

// Expose the plugin runtime to an LLM agent
const agentTools = toOpenAITools(coreTools); // structured callable tools`
      },
      {
        title: 'Custom VIP Discount via Filter',
        language: 'typescript',
        code: `import { addFilter, applyFilters } from '@boostengine/core';

// 1. VIP Customer Plugin hooks into price calculation
addFilter('cart.item_price', (price, item, customer) => {
  if (customer?.isVIP) {
    return price * 0.90; // 10% Extra VIP discount
  }
  return price;
}, 5);

// 2. Core cart calculates final price
const finalPrice = applyFilters('cart.item_price', 1499, item, currentCustomer);
console.log('Discounted Price:', finalPrice); // 1349.1`
      }
    ]
  },
  {
    id: 'boost-server',
    name: '@boostengine/server',
    categoryId: 'core',
    version: '1.1.0',
    description: 'Plug-and-Play Headless eCommerce API Router for Express, Fastify, and Node.js. 1-line auto-mount for Payments, Logistics, Returns, Coupons, Phone Auth, and GST Invoicing.',
    badge: 'Backend Adapter',
    npmInstall: 'npm i @boostengine/server',
    bundleSize: '8.4 KB',
    useCase: 'Turns any Node.js/Express server into a full eCommerce backend API with verified webhooks and payment endpoints.',
    features: [
      'Auto-mounts /api/cart, /api/payments, /api/shipping, /api/auth',
      'Automated Razorpay & Cashfree webhook signature verification',
      'Standardized JSON REST response format',
      'Compatible with Express 4/5, Fastify, and NestJS'
    ],
    apiMethods: [
      {
        name: 'mountBoostServer',
        signature: 'mountBoostServer(app: Express, config: BoostServerConfig): void',
        description: 'Mounts all eCommerce micro-package controllers onto an Express application.',
        params: [
          { name: 'app', type: 'Express', description: 'Express application instance', required: true },
          { name: 'config', type: 'BoostServerConfig', description: 'Secrets for Razorpay, Shiprocket, Resend, JWT', required: true }
        ],
        returns: 'void'
      }
    ],
    examples: [
      {
        title: 'Multi-Entry Imports: Express / Fastify / Hono / ./ai',
        language: 'typescript',
        code: `// Root entry: Express & Node.js adapter
import { mountBoostServer, createBoostRouter } from '@boostengine/server';

// ./fastify entry: Fastify plugin
import boostFastifyPlugin from '@boostengine/server/fastify';

// ./hono entry: Hono middleware
import { boostHonoMiddleware } from '@boostengine/server/hono';

// ./ai entry: server AI agent toolkits
import { serverTools, createServerTools } from '@boostengine/server/ai';

// Express 1-line mount
const app = express();
mountBoostServer(app, {
  apiPrefix: '/api/v1',
  razorpay: { keyId: process.env.RAZORPAY_KEY, keySecret: process.env.RAZORPAY_SECRET },
  authJwtSecret: process.env.JWT_SECRET
});`
      },
      {
        title: 'Express 1-Line Integration',
        language: 'typescript',
        code: `import express from 'express';
import { mountBoostServer } from '@boostengine/server';

const app = express();
app.use(express.json());

// Mount full eCommerce backend API in 1 line
mountBoostServer(app, {
  apiPrefix: '/api/v1',
  razorpay: { keyId: process.env.RAZORPAY_KEY, keySecret: process.env.RAZORPAY_SECRET },
  shiprocket: { email: process.env.SHIPROCKET_USER, password: process.env.SHIPROCKET_PASS },
  authJwtSecret: process.env.JWT_SECRET
});

app.listen(5000, () => console.log('BoostEngine API running on port 5000'));`
      }
    ]
  }
];
