# @boostengine/collections 📮

[![npm version](https://img.shields.io/npm/v/@boostengine/collections.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/@boostengine/collections)
[![npm downloads](https://img.shields.io/npm/dm/@boostengine/collections.svg?style=flat-square&color=green)](https://www.npmjs.com/package/@boostengine/collections)
[![license](https://img.shields.io/npm/l/@boostengine/collections.svg?style=flat-square)](https://github.com/boostengine/boostengine/blob/main/LICENSE)
[![Postman](https://img.shields.io/badge/Postman%20Schema-v2.1.0-orange.svg?style=flat-square)](https://www.postman.com/)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-3.0.3-green.svg?style=flat-square)](https://www.openapis.org/)
[![Bruno](https://img.shields.io/badge/Bruno-compatible-8b5cf6.svg?style=flat-square)](https://www.usebruno.com/)

> **Enterprise-grade universal API Collections & Tooling engine** for Indian + Global e-commerce APIs: **Razorpay, Cashfree, PhonePe, Paytm, Stripe, Shiprocket, Delhivery, EasyEcom, Shopify.**

Pre-built Postman collections, OpenAPI/Bruno converters, a cURL + code-snippet generator, a lightweight runner, and an **AI Agent Toolkit** (OpenAI / Anthropic / MCP) — all in one typed package.

---

## ✨ Features

- **🎯 9 Production Collections** — Postman v2.1.0 schemas with folders, auth, headers, bodies, and webhook simulators.
- **🔐 Environment Templates** — sandbox + production variables for every provider.
- **🧩 Type-safe Query Engine** — `findEndpoints()`, `interpolateVariables()`, `listCollections()`.
- **⚡ Converters** — Postman → **OpenAPI 3.0 JSON** and Postman → **Bruno**, plus filesystem export.
- **🧪 Lightweight Runner** — in-memory schema validation & mock flows (`runCollection`).
- **🤖 AI Agent Toolkit** — OpenAI function-calling, Anthropic `input_schema`, and MCP tool schemas.

---

## 📦 Installation

```bash
# npm
npm install @boostengine/collections

# pnpm
pnpm add @boostengine/collections

# yarn
yarn add @boostengine/collections
```

---

## 🚀 Quickstart

### Programmatic usage

```ts
import {
  listCollections,
  getCollection,
  getEnvironment,
  findEndpoints,
  generateCurl,
  exportToOpenAPI,
  exportToBruno,
  runCollection,
} from '@boostengine/collections';

// List all providers with endpoint counts & categories
console.log(listCollections());

// Search endpoints
const refunds = findEndpoints({ provider: 'razorpay', method: 'POST', path: 'refund' });

// Generate a cURL command for the first refund endpoint
const ep = refunds[0];
const req = {
  method: ep.method,
  header: ep.headers,
  body: ep.body,
  url: { raw: ep.rawUrl, path: ep.path.split('/').filter(Boolean) },
};
console.log(generateCurl(req, getEnvironment('razorpay'), getCollection('razorpay').auth));

// Convert to OpenAPI / Bruno
const openapi = exportToOpenAPI('razorpay'); // { openapi: '3.0.3', paths: { ... } }
const bruno = exportToBruno('razorpay');

// Run a mock flow
const results = await runCollection('stripe', { dryRun: true });
```

### Collections at a glance

| Provider | Category | Auth | Endpoints |
|---|---|---|---|
| Razorpay | payments | basic | 31 |
| Cashfree | payments | apikey | 27 |
| PhonePe | payments | hmac | 7 |
| Paytm | payments | hmac | 5 |
| Stripe | payments | bearer | 10 |
| EasyEcom | wms | bearer | 12 |
| Shiprocket | logistics | bearer | 19 |
| Delhivery | logistics | apikey | 10 |
| Shopify | platform | apikey | 12 |

---

## 💻 CLI

```bash
# List all collections (table view)
npx @boostengine/collections list

# Inspect endpoints in a collection
npx @boostengine/collections info razorpay

# Export collections (postman | openapi | bruno)
npx @boostengine/collections export razorpay --dir ./out --format openapi
npx @boostengine/collections export all --dir ./postman

# Print a ready-to-run cURL snippet
npx @boostengine/collections curl razorpay "Create Order"

# Open official provider docs
npx @boostengine/collections docs stripe
```

---

## 🔄 OpenAPI Export Guide

Every collection can be converted to a valid **OpenAPI 3.0.3** spec with `paths`, `tags`, `servers`, and `securitySchemes`.

```ts
import { exportToOpenAPI, exportToDirectory } from '@boostengine/collections';

const spec = exportToOpenAPI('razorpay');
// {
//   openapi: '3.0.3',
//   info: { title: 'Razorpay Full eCommerce API Collection', version: '1.0.0', ... },
//   servers: [{ url: 'https://api.razorpay.com' }],
//   paths: { '/v1/orders': { post: { operationId, parameters, requestBody, responses } }, ... },
//   components: { securitySchemes: { basicAuth: { type: 'http', scheme: 'basic' } } },
//   security: [{ basicAuth: [] }],
// }

// Or write to disk
const files = exportToDirectory('stripe', './out', 'openapi');
```

---

## 🤖 AI Agent Usage

Import the multi-entry `./ai` subpath for OpenAI, Anthropic, or MCP tool schemas.

```ts
import {
  collectionTools,     // OpenAI function-calling schemas
  anthropicTools,      // Anthropic input_schema
  mcpTools,            // MCP tool definitions
  executeCollectionTool,
  getCollectionSystemPrompt,
} from '@boostengine/collections/ai';

// Pass tools to your LLM
// OpenAI:
//   { type: 'function', function: { name, description, parameters } }
// Anthropic:
//   { name, description, input_schema }
// MCP:
//   { name, description, inputSchema }

// Execute a tool call
const curl = executeCollectionTool('generate_api_curl', { provider: 'razorpay', search: 'order' });
const openapi = executeCollectionTool('convert_collection_format', { provider: 'stripe', format: 'openapi' });

// Generate coding-agent context
const prompt = getCollectionSystemPrompt('stripe');
```

---

## 📚 API Reference

| Function | Description |
|---|---|
| `listCollections()` | Summaries with endpoint counts, folders, categories, auth scheme. |
| `getCollection(name)` | Type-safe Postman collection getter. |
| `getEnvironment(name)` | Type-safe Postman environment getter. |
| `findEndpoints(query)` | Filter endpoints by provider/method/path/tag. |
| `getAllEndpoints()` | Flatten every endpoint. |
| `interpolateVariables(request, env)` | Resolve `{{var}}` placeholders. |
| `generateCurl(request, env?, auth?)` | Executable cURL string. |
| `generateCodeSnippet(request, env?, target)` | `fetch` / `axios` / `node-https` snippets. |
| `exportToOpenAPI(name)` | OpenAPI 3.0 JSON spec. |
| `exportToBruno(name)` | Bruno collection format. |
| `exportToDirectory(name, dir, format)` | Filesystem exporter. |
| `runCollection(name, options)` | In-memory mock runner. |
| `generateMockResponse(endpoint, status)` | Mock JSON response. |

---

## 📄 License

MIT © [Boost Engine](https://github.com/boostengine)

