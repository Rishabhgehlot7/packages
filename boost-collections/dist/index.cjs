'use strict';

var fs = require('fs');
var path = require('path');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var fs__default = /*#__PURE__*/_interopDefault(fs);
var path__default = /*#__PURE__*/_interopDefault(path);

// src/index.ts

// src/converters/curl.ts
function resolveVariables(input, variables) {
  if (!input) return input;
  return input.replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (match, name) => {
    const key = name.trim();
    return Object.prototype.hasOwnProperty.call(variables, key) ? variables[key] : match;
  });
}
function environmentToVariables(environment) {
  const map = {};
  if (!environment) return map;
  for (const v of environment.values || []) {
    if (v && typeof v.key === "string") map[v.key] = v.value ?? "";
  }
  return map;
}
function deepInterpolate(value, variables) {
  if (value == null) return value;
  if (typeof value === "string") return resolveVariables(value, variables);
  if (Array.isArray(value)) return value.map((v) => deepInterpolate(v, variables));
  if (typeof value === "object") {
    const out = {};
    for (const k of Object.keys(value)) {
      out[k] = deepInterpolate(value[k], variables);
    }
    return out;
  }
  return value;
}
function interpolateVariables(request, environment) {
  return deepInterpolate(request, environmentToVariables(environment));
}
function resolveRequestUrl(request) {
  if (request.url && request.url.raw) return request.url.raw;
  const host = Array.isArray(request.url.host) ? request.url.host.join(".") : request.url.host || "";
  const pathSegments = request.url.path || [];
  const base = host.startsWith("http") ? host : `https://${host}`;
  return `${base}${pathSegments.map((s) => `/${s}`).join("")}`;
}
function shellQuote(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}
function parseRawBody(body) {
  if (!body) return { json: null, raw: null };
  if (body.mode === "urlencoded" || body.mode === "formdata") {
    const obj = {};
    const params = body.mode === "urlencoded" ? body.urlencoded : body.formdata;
    for (const p of params || []) {
      if (p && !p.disabled) obj[p.key] = p.value;
    }
    return { json: obj, raw: null };
  }
  if (body.raw) {
    try {
      return { json: JSON.parse(body.raw), raw: body.raw };
    } catch {
      return { json: null, raw: body.raw };
    }
  }
  return { json: null, raw: null };
}
function generateCurl(request, environment, auth, options) {
  const req = environment ? interpolateVariables(request, environment) : request;
  const method = (req.method || "GET").toUpperCase();
  const url = resolveRequestUrl(req);
  const parts = [`curl --request ${method}`];
  const vars = environmentToVariables(environment);
  if (options?.includeAuth !== false && auth) {
    if (auth.type === "basic" && auth.basic) {
      const username = resolveVariables(auth.basic.find((e) => e.key === "username")?.value || "", vars);
      const password = resolveVariables(auth.basic.find((e) => e.key === "password")?.value || "", vars);
      parts.push(`--user ${shellQuote(`${username}:${password}`)}`);
    } else if (auth.type === "bearer" && auth.bearer) {
      const token = resolveVariables(auth.bearer[0]?.value || "", vars);
      parts.push(`--header ${shellQuote(`Authorization: Bearer ${token}`)}`);
    }
  }
  for (const h of req.header || []) {
    if (!h || h.disabled || !h.key) continue;
    if (h.key.toLowerCase() === "content-length") continue;
    parts.push(`--header ${shellQuote(`${h.key}: ${h.value}`)}`);
  }
  if (req.body) {
    if (req.body.mode === "raw" && req.body.raw) {
      parts.push(`--data-raw ${shellQuote(req.body.raw)}`);
    } else if (req.body.mode === "urlencoded" && req.body.urlencoded) {
      for (const p of req.body.urlencoded) {
        if (!p || p.disabled) continue;
        parts.push(`--data-urlencode ${shellQuote(`${p.key}=${p.value}`)}`);
      }
    } else if (req.body.mode === "formdata" && req.body.formdata) {
      for (const p of req.body.formdata) {
        if (!p || p.disabled) continue;
        parts.push(`--form ${shellQuote(`${p.key}=${p.value}`)}`);
      }
    }
  }
  parts.push(shellQuote(url));
  return parts.join(" \\\n  ");
}
function singleQuote(value) {
  return `'${String(value).replace(/\\/g, "\\\\").replace(/'/g, "\\'")}'`;
}
function buildHeaderEntries(req, auth) {
  const entries = [];
  for (const h of req.header || []) {
    if (!h || h.disabled || !h.key) continue;
    if (h.key.toLowerCase() === "content-length") continue;
    entries.push([h.key, h.value]);
  }
  if (auth) {
    if (auth.type === "bearer" && auth.bearer) {
      entries.push(["Authorization", `Bearer ${auth.bearer[0]?.value || ""}`]);
    }
  }
  return entries;
}
function jsonBodyLiteral(req) {
  const { json } = parseRawBody(req.body);
  if (json == null) return null;
  return JSON.stringify(json, null, 2);
}
function indentBlock(text, indent2 = "  ") {
  return text.split("\n").map((l) => indent2 + l).join("\n");
}
function generateCodeSnippet(request, environment, target = "fetch", auth) {
  const req = environment ? interpolateVariables(request, environment) : request;
  const method = (req.method || "GET").toUpperCase();
  const url = resolveRequestUrl(req);
  const headers = buildHeaderEntries(req, auth);
  const { raw } = parseRawBody(req.body);
  const jsonLiteral = jsonBodyLiteral(req);
  const urlLit = singleQuote(url);
  const lines = [];
  if (target === "axios") {
    lines.push(`import axios from 'axios';`);
    lines.push(``);
    lines.push(`const response = await axios({`);
    lines.push(`  method: '${method.toLowerCase()}',`);
    lines.push(`  url: ${urlLit},`);
    if (headers.length) {
      lines.push(`  headers: {`);
      for (const [k, v] of headers) lines.push(`    ${singleQuote(k)}: ${singleQuote(v)},`);
      lines.push(`  },`);
    }
    if (jsonLiteral != null) {
      lines.push(`  data: ${indentBlock(jsonLiteral)},`);
    } else if (raw != null) {
      lines.push(`  data: ${singleQuote(raw)},`);
    }
    lines.push(`});`);
    lines.push(`console.log(response.data);`);
    return lines.join("\n");
  }
  if (target === "node-https") {
    const isHttps = url.startsWith("https");
    const mod = isHttps ? "https" : "http";
    lines.push(`const ${mod} = require('${mod}');`);
    lines.push(``);
    if (jsonLiteral != null) {
      lines.push(`const data = JSON.stringify(${indentBlock(jsonLiteral)});`);
    } else if (raw != null) {
      lines.push(`const data = ${singleQuote(raw)};`);
    } else {
      lines.push(`const data = null;`);
    }
    lines.push(``);
    lines.push(`const options = {`);
    lines.push(`  method: '${method}',`);
    if (headers.length) {
      lines.push(`  headers: {`);
      for (const [k, v] of headers) lines.push(`    ${singleQuote(k)}: ${singleQuote(v)},`);
      lines.push(`  },`);
    }
    lines.push(`};`);
    lines.push(``);
    lines.push(`const req = ${mod}.request(${urlLit}, options, (res) => {`);
    lines.push(`  let body = '';`);
    lines.push(`  res.on('data', (chunk) => (body += chunk));`);
    lines.push(`  res.on('end', () => console.log(JSON.parse(body || '{}')));`);
    lines.push(`});`);
    lines.push(``);
    lines.push(`req.on('error', (err) => console.error(err));`);
    lines.push(`if (data) req.write(data);`);
    lines.push(`req.end();`);
    return lines.join("\n");
  }
  lines.push(`const response = await fetch(${urlLit}, {`);
  lines.push(`  method: '${method}',`);
  if (headers.length) {
    lines.push(`  headers: {`);
    for (const [k, v] of headers) lines.push(`    ${singleQuote(k)}: ${singleQuote(v)},`);
    lines.push(`  },`);
  }
  if (jsonLiteral != null) {
    lines.push(`  body: JSON.stringify(${indentBlock(jsonLiteral)}),`);
  } else if (raw != null) {
    lines.push(`  body: ${singleQuote(raw)},`);
  }
  lines.push(`});`);
  lines.push(`const data = await response.json();`);
  lines.push(`console.log(data);`);
  return lines.join("\n");
}

// src/converters/openapi.ts
function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}
function toOperationId(folder, name, method) {
  return `${slugify(folder)}_${slugify(name)}` || slugify(name) || method.toLowerCase();
}
function uniqueOperationId(base, used) {
  let candidate = base || "operation";
  let i = 2;
  while (used.has(candidate)) {
    candidate = `${base}_${i}`;
    i++;
  }
  used.add(candidate);
  return candidate;
}
function joinPath(request) {
  if (request.url.path && request.url.path.length) {
    const p = request.url.path.map((s) => s.replace(/\{\{\s*([\w.-]+)\s*\}\}/g, "{$1}")).join("/");
    return "/" + p.replace(/^\/+/, "");
  }
  const raw = request.url.raw || "";
  const match = raw.match(/^https?:\/\/[^/]+(\/.*)$/);
  return match ? match[1] : "/";
}
function extractPathParams(path2) {
  const params = [];
  const re = /\{([\w.-]+)\}/g;
  let m;
  while ((m = re.exec(path2)) !== null) {
    if (!params.includes(m[1])) params.push(m[1]);
  }
  return params;
}
function firstRequest(collection) {
  const stack = [...collection.item || []];
  while (stack.length) {
    const item = stack.pop();
    if (item.request) return item.request;
    if (item.item) stack.push(...item.item);
  }
  return null;
}
function buildRequestBody(req) {
  if (!req.body) return null;
  if (req.body.mode === "raw" && req.body.raw) {
    let example = req.body.raw;
    try {
      example = JSON.parse(req.body.raw);
    } catch {
    }
    return {
      required: true,
      content: {
        "application/json": {
          schema: { type: "object", example },
          example
        }
      }
    };
  }
  if (req.body.mode === "urlencoded" && req.body.urlencoded) {
    const props = {};
    for (const p of req.body.urlencoded) {
      if (!p || p.disabled) continue;
      props[p.key] = { type: "string", example: p.value };
    }
    return {
      required: true,
      content: {
        "application/x-www-form-urlencoded": { schema: { type: "object", properties: props } }
      }
    };
  }
  if (req.body.mode === "formdata" && req.body.formdata) {
    const props = {};
    for (const p of req.body.formdata) {
      if (!p || p.disabled) continue;
      props[p.key] = { type: "string", example: p.value };
    }
    return {
      required: true,
      content: {
        "multipart/form-data": { schema: { type: "object", properties: props } }
      }
    };
  }
  return null;
}
function convertToOpenAPI(collection, options = {}) {
  const vars = environmentToVariables(options.environment);
  const spec = {
    openapi: options.openapiVersion || "3.0.3",
    info: {
      title: collection.info?.name || "API Collection",
      version: options.version || "1.0.0",
      description: collection.info?.description || ""
    },
    servers: [],
    tags: [],
    paths: {},
    components: { schemas: {}, securitySchemes: {} }
  };
  let baseUrl = options.baseUrl;
  if (!baseUrl && options.environment) {
    const baseVar = (options.environment.values || []).find((v) => /base_url$/i.test(v.key));
    if (baseVar) baseUrl = baseVar.value;
  }
  if (!baseUrl) {
    const first = firstRequest(collection);
    if (first) {
      const host = Array.isArray(first.url.host) ? first.url.host[0] : first.url.host;
      if (typeof host === "string") baseUrl = host;
    }
  }
  if (baseUrl) {
    spec.servers = [{ url: resolveVariables(baseUrl, vars), description: "Primary API server" }];
  }
  if (collection.auth) {
    const t = collection.auth.type;
    if (t === "basic") {
      spec.components.securitySchemes.basicAuth = { type: "http", scheme: "basic" };
      spec.security = [{ basicAuth: [] }];
    } else if (t === "bearer") {
      spec.components.securitySchemes.bearerAuth = { type: "http", scheme: "bearer", bearerFormat: "token" };
      spec.security = [{ bearerAuth: [] }];
    } else if (t === "apikey") {
      spec.components.securitySchemes.apiKeyAuth = { type: "apiKey", in: "header", name: "X-API-Key" };
      spec.security = [{ apiKeyAuth: [] }];
    }
  }
  const tagSet = /* @__PURE__ */ new Set();
  const operationIds = /* @__PURE__ */ new Set();
  const walk = (items, folderName) => {
    for (const item of items || []) {
      if (item.item && item.item.length) {
        walk(item.item, item.name);
        continue;
      }
      if (!item.request) continue;
      const req = item.request;
      const method = (req.method || "GET").toLowerCase();
      const path2 = joinPath(req);
      const operation = {
        operationId: uniqueOperationId(toOperationId(folderName, item.name, method), operationIds),
        summary: item.name,
        description: req.description || item.description || "",
        responses: {
          "200": { description: "Successful response" },
          "201": { description: "Created" }
        }
      };
      if (folderName) {
        operation.tags = [folderName];
        tagSet.add(folderName);
      }
      const params = [];
      for (const p of extractPathParams(path2)) {
        params.push({ name: p, in: "path", required: true, schema: { type: "string" } });
      }
      for (const q of req.url.query || []) {
        if (q.disabled) continue;
        params.push({ name: q.key, in: "query", required: false, schema: { type: "string" }, description: q.description || "" });
      }
      if (params.length) operation.parameters = params;
      const body = buildRequestBody(req);
      if (body) operation.requestBody = body;
      spec.paths[path2] = spec.paths[path2] || {};
      spec.paths[path2][method] = operation;
    }
  };
  walk(collection.item || [], "");
  spec.tags = [...tagSet].map((t) => ({ name: t }));
  return spec;
}

// src/converters/bruno.ts
function sanitizeFileName(name) {
  return name.replace(/[\\/:*?"<>|]+/g, "-").trim();
}
function indent(text) {
  return text.split("\n").map((l) => "  " + l).join("\n");
}
function brunoBodyType(req) {
  if (!req.body) return null;
  if (req.body.mode === "raw") return "json";
  if (req.body.mode === "urlencoded") return "form-urlencoded";
  if (req.body.mode === "formdata") return "multipart-form";
  return null;
}
function brunoAuthLine(auth) {
  if (!auth) return null;
  if (auth.type === "basic") return "basic";
  if (auth.type === "bearer") return "bearer";
  return null;
}
function brunoBodyBlock(req) {
  if (!req.body) return "";
  if (req.body.mode === "raw" && req.body.raw) {
    const { json } = parseRawBody(req.body);
    const content = json != null ? JSON.stringify(json, null, 2) : req.body.raw;
    return `
body:json {
${indent(content)}
}`;
  }
  const params = req.body.mode === "urlencoded" ? req.body.urlencoded : req.body.mode === "formdata" ? req.body.formdata : null;
  if (params) {
    const kv = (params || []).filter((p) => p && !p.disabled).map((p) => `  ${p.key}: ${p.value}`).join("\n");
    const block = req.body.mode === "urlencoded" ? "body:form-urlencoded" : "body:multipart-form";
    return `
${block} {
${kv}
}`;
  }
  return "";
}
function buildBruFile(item, seq, folder, auth) {
  const req = item.request;
  const method = (req.method || "GET").toLowerCase();
  const url = req.url.raw || "";
  const headers = (req.header || []).filter((h) => h && !h.disabled && h.key);
  const bodyType = brunoBodyType(req);
  const authName = brunoAuthLine(auth);
  const methodLines = [`  url: ${url}`];
  if (bodyType) methodLines.push(`  body: ${bodyType}`);
  if (authName) methodLines.push(`  auth: ${authName}`);
  const lines = [
    `meta {`,
    `  name: ${item.name}`,
    `  type: http`,
    `  seq: ${seq}`,
    `}`,
    ``,
    `${method} {`,
    ...methodLines,
    `}`
  ];
  if (headers.length) {
    lines.push(``);
    lines.push(`headers {`);
    for (const h of headers) lines.push(`  ${h.key}: ${h.value}`);
    lines.push(`}`);
  }
  const bodyBlock = brunoBodyBlock(req);
  if (bodyBlock) lines.push(bodyBlock);
  const file = `${folder ? sanitizeFileName(folder) + "/" : ""}${sanitizeFileName(item.name)}.bru`;
  return { name: item.name, file, content: lines.join("\n") + "\n" };
}
function convertToBruno(collection, options = {}) {
  const brunoJson = {
    version: "1",
    name: collection.info?.name || "Collection",
    type: "collection",
    ignore: ["node_modules", ".git", "dist"]
  };
  if (options.baseUrl) brunoJson.baseUrl = options.baseUrl;
  const requests = [];
  let seq = 0;
  const walk = (items, folder) => {
    for (const item of items || []) {
      if (item.item && item.item.length) {
        walk(item.item, item.name);
        continue;
      }
      if (!item.request) continue;
      seq += 1;
      requests.push(buildBruFile(item, seq, folder, collection.auth));
    }
  };
  walk(collection.item || [], "");
  return { brunoJson, requests };
}

// collections/razorpay.collection.json
var razorpay_collection_default = {
  info: {
    _postman_id: "9b12a83e-105b-4832-8419-a86d5e789012",
    name: "Razorpay Full eCommerce API Collection",
    description: "Exhaustive Enterprise Postman Collection for Razorpay (Orders, Payments, Payment Links, Smart Collect Virtual Accounts, UPI QR Codes, Customers & Card Tokens, Invoices, Subscriptions, Route Transfers & Webhook Simulator). Includes auto-chaining test scripts.",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  auth: {
    type: "basic",
    basic: [
      {
        key: "username",
        value: "{{razorpay_key_id}}",
        type: "string"
      },
      {
        key: "password",
        value: "{{razorpay_key_secret}}",
        type: "string"
      }
    ]
  },
  item: [
    {
      name: "1. Orders API",
      description: "Create, fetch, and manage customer checkout orders.",
      item: [
        {
          name: "Create Order (Standard eCommerce)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "var jsonData = pm.response.json();",
                  "if (jsonData && jsonData.id) {",
                  "    pm.environment.set('order_id', jsonData.id);",
                  "    console.log('Saved order_id to environment: ' + jsonData.id);",
                  "}"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "amount": 149900,\n  "currency": "INR",\n  "receipt": "rcpt_boost_{{$timestamp}}",\n  "partial_payment": false,\n  "notes": {\n    "customer_name": "Aman Sharma",\n    "customer_email": "aman@example.com",\n    "customer_phone": "+919876543210",\n    "shipping_address": "Flat 402, Skyline Residency, Mumbai"\n  }\n}'
            },
            url: {
              raw: "{{razorpay_base_url}}/v1/orders",
              host: ["{{razorpay_base_url}}"],
              path: ["v1", "orders"]
            },
            description: "Creates a new Order in Razorpay. Automatically extracts and sets {{order_id}} in environment."
          }
        },
        {
          name: "Fetch Order by ID",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{razorpay_base_url}}/v1/orders/{{order_id}}",
              host: ["{{razorpay_base_url}}"],
              path: ["v1", "orders", "{{order_id}}"]
            },
            description: "Retrieves the order entity using {{order_id}}."
          }
        },
        {
          name: "Fetch Payments for an Order",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{razorpay_base_url}}/v1/orders/{{order_id}}/payments",
              host: ["{{razorpay_base_url}}"],
              path: ["v1", "orders", "{{order_id}}", "payments"]
            },
            description: "Fetches all payment attempts made against {{order_id}}."
          }
        },
        {
          name: "List All Orders (Paginated)",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{razorpay_base_url}}/v1/orders?count=20&skip=0",
              host: ["{{razorpay_base_url}}"],
              path: ["v1", "orders"],
              query: [
                { key: "count", value: "20" },
                { key: "skip", value: "0" }
              ]
            },
            description: "Lists all merchant orders in descending order."
          }
        },
        {
          name: "Update Order Notes",
          request: {
            method: "PATCH",
            header: [
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "notes": {\n    "special_instructions": "Fragile packing required",\n    "delivery_slot": "Morning 9 AM - 12 PM"\n  }\n}'
            },
            url: {
              raw: "{{razorpay_base_url}}/v1/orders/{{order_id}}",
              host: ["{{razorpay_base_url}}"],
              path: ["v1", "orders", "{{order_id}}"]
            },
            description: "Updates metadata/notes for an existing order."
          }
        }
      ]
    },
    {
      name: "2. Payments API",
      description: "Inspect, capture, and process transactions.",
      item: [
        {
          name: "Fetch Payment by ID",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{razorpay_base_url}}/v1/payments/{{payment_id}}",
              host: ["{{razorpay_base_url}}"],
              path: ["v1", "payments", "{{payment_id}}"]
            },
            description: "Fetches details of a specific payment transaction."
          }
        },
        {
          name: "Capture Payment (Manual)",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "amount": 149900,\n  "currency": "INR"\n}'
            },
            url: {
              raw: "{{razorpay_base_url}}/v1/payments/{{payment_id}}/capture",
              host: ["{{razorpay_base_url}}"],
              path: ["v1", "payments", "{{payment_id}}", "capture"]
            },
            description: "Captures an authorized payment before timeout."
          }
        },
        {
          name: "Fetch Card Details of Payment",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{razorpay_base_url}}/v1/payments/{{payment_id}}/card",
              host: ["{{razorpay_base_url}}"],
              path: ["v1", "payments", "{{payment_id}}", "card"]
            },
            description: "Fetches tokenized card brand, last4, and issuer network."
          }
        },
        {
          name: "List All Payments",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{razorpay_base_url}}/v1/payments?count=10",
              host: ["{{razorpay_base_url}}"],
              path: ["v1", "payments"],
              query: [
                { key: "count", value: "10" }
              ]
            },
            description: "Lists recent payments received."
          }
        }
      ]
    },
    {
      name: "3. Payment Links & UPI QR Codes",
      description: "Direct checkout links and dynamic on-counter / on-screen UPI QR codes.",
      item: [
        {
          name: "Create Standard Payment Link",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "var jsonData = pm.response.json();",
                  "if (jsonData && jsonData.id) {",
                  "    pm.environment.set('payment_link_id', jsonData.id);",
                  "    console.log('Saved payment_link_id: ' + jsonData.id);",
                  "}"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "amount": 149900,\n  "currency": "INR",\n  "accept_partial": false,\n  "reference_id": "pl_ref_{{$timestamp}}",\n  "description": "Payment for Boost Engine eCommerce Order",\n  "customer": {\n    "name": "Aman Sharma",\n    "contact": "+919876543210",\n    "email": "aman@example.com"\n  },\n  "notify": {\n    "sms": true,\n    "email": true,\n    "whatsapp": true\n  },\n  "reminder_enable": true\n}'
            },
            url: {
              raw: "{{razorpay_base_url}}/v1/payment_links",
              host: ["{{razorpay_base_url}}"],
              path: ["v1", "payment_links"]
            },
            description: "Generates a hosted payment link with automatic SMS/Email/WhatsApp notification."
          }
        },
        {
          name: "Fetch Payment Link Details",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{razorpay_base_url}}/v1/payment_links/{{payment_link_id}}",
              host: ["{{razorpay_base_url}}"],
              path: ["v1", "payment_links", "{{payment_link_id}}"]
            },
            description: "Checks payment link status (created, paid, expired, cancelled)."
          }
        },
        {
          name: "Cancel Payment Link",
          request: {
            method: "POST",
            header: [],
            url: {
              raw: "{{razorpay_base_url}}/v1/payment_links/{{payment_link_id}}/cancel",
              host: ["{{razorpay_base_url}}"],
              path: ["v1", "payment_links", "{{payment_link_id}}", "cancel"]
            },
            description: "Cancels an unpaid payment link."
          }
        },
        {
          name: "Create Dynamic UPI QR Code",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "var jsonData = pm.response.json();",
                  "if (jsonData && jsonData.id) {",
                  "    pm.environment.set('razorpay_qr_id', jsonData.id);",
                  "}"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "type": "upi_qr",\n  "name": "Boost Engine Checkout QR",\n  "usage": "single_use",\n  "fixed_amount": true,\n  "payment_amount": 149900,\n  "description": "Payment for Order #1001",\n  "customer_id": "{{customer_id}}",\n  "close_by": 1735689600\n}'
            },
            url: {
              raw: "{{razorpay_base_url}}/v1/payments/qr_codes",
              host: ["{{razorpay_base_url}}"],
              path: ["v1", "payments", "qr_codes"]
            },
            description: "Creates a dynamic single-use or multi-use UPI QR code image and payload."
          }
        },
        {
          name: "Fetch QR Code by ID",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{razorpay_base_url}}/v1/payments/qr_codes/{{razorpay_qr_id}}",
              host: ["{{razorpay_base_url}}"],
              path: ["v1", "payments", "qr_codes", "{{razorpay_qr_id}}"]
            },
            description: "Retrieves the status, scanned state, and payments received on a QR code."
          }
        }
      ]
    },
    {
      name: "4. Smart Collect (Virtual Accounts / B2B Bank Transfer)",
      description: "Generate unique virtual bank account & UPI ID for automatic reconciliation of NEFT/RTGS/IMPS payments.",
      item: [
        {
          name: "Create Virtual Account",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "var jsonData = pm.response.json();",
                  "if (jsonData && jsonData.id) {",
                  "    pm.environment.set('razorpay_va_id', jsonData.id);",
                  "}"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "receivers": {\n    "types": [\n      "bank_account",\n      "vpa"\n    ]\n  },\n  "description": "Dedicated Virtual Account for Aman Sharma",\n  "customer_id": "{{customer_id}}",\n  "close_by": 1735689600\n}'
            },
            url: {
              raw: "{{razorpay_base_url}}/v1/virtual_accounts",
              host: ["{{razorpay_base_url}}"],
              path: ["v1", "virtual_accounts"]
            },
            description: "Creates a dedicated virtual bank account (account number + IFSC) and UPI ID."
          }
        },
        {
          name: "Fetch Virtual Account by ID",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{razorpay_base_url}}/v1/virtual_accounts/{{razorpay_va_id}}",
              host: ["{{razorpay_base_url}}"],
              path: ["v1", "virtual_accounts", "{{razorpay_va_id}}"]
            },
            description: "Fetches bank account and receiver details."
          }
        },
        {
          name: "Fetch Payments for Virtual Account",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{razorpay_base_url}}/v1/virtual_accounts/{{razorpay_va_id}}/payments",
              host: ["{{razorpay_base_url}}"],
              path: ["v1", "virtual_accounts", "{{razorpay_va_id}}", "payments"]
            },
            description: "Lists all payments received into the virtual account."
          }
        }
      ]
    },
    {
      name: "5. Customers & Card Vault API",
      description: "Manage customer profiles and saved cards/mandates.",
      item: [
        {
          name: "Create Customer",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "var jsonData = pm.response.json();",
                  "if (jsonData && jsonData.id) {",
                  "    pm.environment.set('customer_id', jsonData.id);",
                  "    console.log('Saved customer_id: ' + jsonData.id);",
                  "}"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "name": "Aman Sharma",\n  "contact": "+919876543210",\n  "email": "aman@example.com",\n  "fail_existing": 0,\n  "notes": {\n    "user_type": "VIP Member",\n    "app_user_id": "usr_boost_1001"\n  }\n}'
            },
            url: {
              raw: "{{razorpay_base_url}}/v1/customers",
              host: ["{{razorpay_base_url}}"],
              path: ["v1", "customers"]
            },
            description: "Creates customer record for one-click checkout and saved payment methods."
          }
        },
        {
          name: "Fetch Customer by ID",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{razorpay_base_url}}/v1/customers/{{customer_id}}",
              host: ["{{razorpay_base_url}}"],
              path: ["v1", "customers", "{{customer_id}}"]
            },
            description: "Fetches customer entity."
          }
        },
        {
          name: "Fetch Saved Tokens / Cards of Customer",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{razorpay_base_url}}/v1/customers/{{customer_id}}/tokens",
              host: ["{{razorpay_base_url}}"],
              path: ["v1", "customers", "{{customer_id}}", "tokens"]
            },
            description: "Fetches RBI-compliant tokenized cards for 1-click seamless re-purchases."
          }
        }
      ]
    },
    {
      name: "6. Invoices API",
      description: "GST-compliant tax invoices for eCommerce sales.",
      item: [
        {
          name: "Create Tax Invoice",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "var jsonData = pm.response.json();",
                  "if (jsonData && jsonData.id) {",
                  "    pm.environment.set('razorpay_invoice_id', jsonData.id);",
                  "}"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "type": "invoice",\n  "customer": {\n    "name": "Aman Sharma",\n    "email": "aman@example.com",\n    "contact": "+919876543210"\n  },\n  "line_items": [\n    {\n      "name": "Boost Engine Premium Hoodie",\n      "description": "Size L, Black color",\n      "amount": 149900,\n      "currency": "INR",\n      "quantity": 1\n    }\n  ],\n  "sms_notify": 1,\n  "email_notify": 1,\n  "currency": "INR"\n}'
            },
            url: {
              raw: "{{razorpay_base_url}}/v1/invoices",
              host: ["{{razorpay_base_url}}"],
              path: ["v1", "invoices"]
            },
            description: "Creates a GST itemized invoice."
          }
        },
        {
          name: "Issue Invoice",
          request: {
            method: "POST",
            header: [],
            url: {
              raw: "{{razorpay_base_url}}/v1/invoices/{{razorpay_invoice_id}}/issue",
              host: ["{{razorpay_base_url}}"],
              path: ["v1", "invoices", "{{razorpay_invoice_id}}", "issue"]
            },
            description: "Issues a draft invoice and sends email/SMS link to customer."
          }
        }
      ]
    },
    {
      name: "7. Subscriptions & Recurring Plans",
      description: "Automated recurring subscriptions with UPI Autopay and cards.",
      item: [
        {
          name: "Create Recurring Plan",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "var jsonData = pm.response.json();",
                  "if (jsonData && jsonData.id) {",
                  "    pm.environment.set('razorpay_plan_id', jsonData.id);",
                  "}"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "period": "monthly",\n  "interval": 1,\n  "item": {\n    "name": "Boost Engine Pro Membership",\n    "amount": 99900,\n    "currency": "INR",\n    "description": "Monthly Pro Membership"\n  }\n}'
            },
            url: {
              raw: "{{razorpay_base_url}}/v1/plans",
              host: ["{{razorpay_base_url}}"],
              path: ["v1", "plans"]
            },
            description: "Creates a billing plan."
          }
        },
        {
          name: "Create Subscription",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "var jsonData = pm.response.json();",
                  "if (jsonData && jsonData.id) {",
                  "    pm.environment.set('razorpay_sub_id', jsonData.id);",
                  "}"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "plan_id": "{{razorpay_plan_id}}",\n  "total_count": 12,\n  "quantity": 1,\n  "customer_notify": 1,\n  "start_at": 1735689600,\n  "notes": {\n    "user_id": "usr_boost_01"\n  }\n}'
            },
            url: {
              raw: "{{razorpay_base_url}}/v1/subscriptions",
              host: ["{{razorpay_base_url}}"],
              path: ["v1", "subscriptions"]
            },
            description: "Initializes a recurring subscription."
          }
        },
        {
          name: "Cancel Subscription",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "cancel_at_cycle_end": 0\n}'
            },
            url: {
              raw: "{{razorpay_base_url}}/v1/subscriptions/{{razorpay_sub_id}}/cancel",
              host: ["{{razorpay_base_url}}"],
              path: ["v1", "subscriptions", "{{razorpay_sub_id}}", "cancel"]
            },
            description: "Cancels active subscription."
          }
        }
      ]
    },
    {
      name: "8. Refunds API",
      description: "Process standard or instant refunds.",
      item: [
        {
          name: "Create Refund",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "var jsonData = pm.response.json();",
                  "if (jsonData && jsonData.id) {",
                  "    pm.environment.set('refund_id', jsonData.id);",
                  "    console.log('Saved refund_id: ' + jsonData.id);",
                  "}"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "amount": 149900,\n  "reverse_all": 1,\n  "notes": {\n    "reason": "Customer requested cancellation before dispatch"\n  }\n}'
            },
            url: {
              raw: "{{razorpay_base_url}}/v1/payments/{{payment_id}}/refund",
              host: ["{{razorpay_base_url}}"],
              path: ["v1", "payments", "{{payment_id}}", "refund"]
            },
            description: "Initiates a full or partial refund."
          }
        },
        {
          name: "Fetch Refund by ID",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{razorpay_base_url}}/v1/refunds/{{refund_id}}",
              host: ["{{razorpay_base_url}}"],
              path: ["v1", "refunds", "{{refund_id}}"]
            },
            description: "Fetches refund details and status (processed, pending)."
          }
        }
      ]
    },
    {
      name: "9. Webhooks Simulator",
      description: "Simulated webhook payloads ready to trigger against local API server.",
      item: [
        {
          name: "Webhook: order.paid",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "X-Razorpay-Signature", value: "{{computed_webhook_signature}}" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "entity": "event",\n  "account_id": "acc_boost_1001",\n  "event": "order.paid",\n  "contains": ["order", "payment"],\n  "payload": {\n    "payment": {\n      "entity": {\n        "id": "pay_test_001",\n        "entity": "payment",\n        "amount": 149900,\n        "currency": "INR",\n        "status": "captured",\n        "order_id": "order_test_001",\n        "method": "upi",\n        "vpa": "aman@upi"\n      }\n    },\n    "order": {\n      "entity": {\n        "id": "order_test_001",\n        "entity": "order",\n        "amount": 149900,\n        "currency": "INR",\n        "status": "paid"\n      }\n    }\n  },\n  "created_at": 1709923200\n}'
            },
            url: {
              raw: "{{local_webhook_url}}",
              host: ["{{local_webhook_url}}"]
            },
            description: "Simulates order.paid webhook."
          }
        },
        {
          name: "Webhook: payment.failed",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "X-Razorpay-Signature", value: "{{computed_webhook_signature}}" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "entity": "event",\n  "account_id": "acc_boost_1001",\n  "event": "payment.failed",\n  "contains": ["payment"],\n  "payload": {\n    "payment": {\n      "entity": {\n        "id": "pay_test_failed",\n        "entity": "payment",\n        "amount": 149900,\n        "currency": "INR",\n        "status": "failed",\n        "error_code": "BAD_REQUEST_ERROR",\n        "error_description": "Payment was declined by bank"\n      }\n    }\n  },\n  "created_at": 1709923200\n}'
            },
            url: {
              raw: "{{local_webhook_url}}",
              host: ["{{local_webhook_url}}"]
            },
            description: "Simulates payment.failed webhook."
          }
        },
        {
          name: "Webhook: refund.processed",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "X-Razorpay-Signature", value: "{{computed_webhook_signature}}" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "entity": "event",\n  "account_id": "acc_boost_1001",\n  "event": "refund.processed",\n  "contains": ["refund"],\n  "payload": {\n    "refund": {\n      "entity": {\n        "id": "rfnd_test_001",\n        "entity": "refund",\n        "amount": 149900,\n        "currency": "INR",\n        "payment_id": "pay_test_001",\n        "status": "processed"\n      }\n    }\n  },\n  "created_at": 1709923500\n}'
            },
            url: {
              raw: "{{local_webhook_url}}",
              host: ["{{local_webhook_url}}"]
            },
            description: "Simulates refund.processed webhook."
          }
        },
        {
          name: "Webhook: virtual_account.credited",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "X-Razorpay-Signature", value: "{{computed_webhook_signature}}" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "entity": "event",\n  "account_id": "acc_boost_1001",\n  "event": "virtual_account.credited",\n  "contains": ["virtual_account", "payment"],\n  "payload": {\n    "payment": {\n      "entity": {\n        "id": "pay_va_001",\n        "amount": 500000,\n        "currency": "INR",\n        "method": "bank_transfer",\n        "bank": "HDFC"\n      }\n    }\n  },\n  "created_at": 1709923800\n}'
            },
            url: {
              raw: "{{local_webhook_url}}",
              host: ["{{local_webhook_url}}"]
            },
            description: "Simulates virtual_account.credited webhook for automated B2B NEFT/RTGS reconciliation."
          }
        }
      ]
    }
  ]
};

// collections/cashfree.collection.json
var cashfree_collection_default = {
  info: {
    _postman_id: "cf123456-7890-4abc-def1-234567890123",
    name: "Cashfree Full Payments & Payouts API Suite",
    description: "Exhaustive Enterprise Postman Collection for Cashfree PG & Banking v2023-08-01 (Orders, Seamless UPI/Cards, Payment Links, Subscriptions, Bank/UPI Verification, Payouts, Refunds, Settlements, Webhooks). Includes auto-chaining test scripts.",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  auth: {
    type: "noauth"
  },
  item: [
    {
      name: "1. Orders API (Checkout & Drop-in)",
      description: "Create, fetch, and manage customer checkout orders in Cashfree PG.",
      item: [
        {
          name: "Create Order (with Session ID)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "var jsonData = pm.response.json();",
                  "if (jsonData && jsonData.order_id) {",
                  "    pm.environment.set('cashfree_order_id', jsonData.order_id);",
                  "    pm.environment.set('payment_session_id', jsonData.payment_session_id);",
                  "    console.log('Saved order_id: ' + jsonData.order_id + ', session_id: ' + jsonData.payment_session_id);",
                  "}"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [
              { key: "x-client-id", value: "{{cashfree_app_id}}" },
              { key: "x-client-secret", value: "{{cashfree_secret_key}}" },
              { key: "x-api-version", value: "2023-08-01" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "order_id": "order_cf_{{$timestamp}}",\n  "order_amount": 1499.00,\n  "order_currency": "INR",\n  "customer_details": {\n    "customer_id": "cust_{{$timestamp}}",\n    "customer_name": "Aman Sharma",\n    "customer_email": "aman@example.com",\n    "customer_phone": "9876543210"\n  },\n  "order_meta": {\n    "return_url": "https://yourstore.com/order-confirmed?order_id={order_id}",\n    "notify_url": "{{local_webhook_url}}",\n    "payment_methods": "cc,dc,upi,nb"\n  },\n  "order_note": "Boost Engine eCommerce Checkout"\n}'
            },
            url: {
              raw: "{{cashfree_base_url}}/orders",
              host: ["{{cashfree_base_url}}"],
              path: ["orders"]
            },
            description: "Creates an order and returns payment_session_id for Cashfree Drop-in UI or Native SDK checkout."
          }
        },
        {
          name: "Get Order Details",
          request: {
            method: "GET",
            header: [
              { key: "x-client-id", value: "{{cashfree_app_id}}" },
              { key: "x-client-secret", value: "{{cashfree_secret_key}}" },
              { key: "x-api-version", value: "2023-08-01" }
            ],
            url: {
              raw: "{{cashfree_base_url}}/orders/{{cashfree_order_id}}",
              host: ["{{cashfree_base_url}}"],
              path: ["orders", "{{cashfree_order_id}}"]
            },
            description: "Retrieves the status of an order (PAID, ACTIVE, EXPIRED)."
          }
        },
        {
          name: "Terminate / Cancel Order",
          request: {
            method: "PATCH",
            header: [
              { key: "x-client-id", value: "{{cashfree_app_id}}" },
              { key: "x-client-secret", value: "{{cashfree_secret_key}}" },
              { key: "x-api-version", value: "2023-08-01" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "order_status": "TERMINATED"\n}'
            },
            url: {
              raw: "{{cashfree_base_url}}/orders/{{cashfree_order_id}}",
              host: ["{{cashfree_base_url}}"],
              path: ["orders", "{{cashfree_order_id}}"]
            },
            description: "Terminates an active order so that no more payments can be made against it."
          }
        },
        {
          name: "Fetch Order Settlements",
          request: {
            method: "GET",
            header: [
              { key: "x-client-id", value: "{{cashfree_app_id}}" },
              { key: "x-client-secret", value: "{{cashfree_secret_key}}" },
              { key: "x-api-version", value: "2023-08-01" }
            ],
            url: {
              raw: "{{cashfree_base_url}}/orders/{{cashfree_order_id}}/settlements",
              host: ["{{cashfree_base_url}}"],
              path: ["orders", "{{cashfree_order_id}}", "settlements"]
            },
            description: "Retrieves settlement breakdown, MDR charges, and bank transfer reference for an order."
          }
        }
      ]
    },
    {
      name: "2. Seamless / Direct Payments API",
      description: "Direct S2S checkout without redirecting to hosted page (UPI Intent, UPI Collect, Cards, Netbanking).",
      item: [
        {
          name: "Pay Order - UPI Intent (GPay, PhonePe, Paytm)",
          request: {
            method: "POST",
            header: [
              { key: "x-client-id", value: "{{cashfree_app_id}}" },
              { key: "x-client-secret", value: "{{cashfree_secret_key}}" },
              { key: "x-api-version", value: "2023-08-01" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "payment_session_id": "{{payment_session_id}}",\n  "payment_method": {\n    "upi": {\n      "channel": "intent"\n    }\n  }\n}'
            },
            url: {
              raw: "{{cashfree_base_url}}/orders/sessions",
              host: ["{{cashfree_base_url}}"],
              path: ["orders", "sessions"]
            },
            description: "Returns deep link / intent URI for mobile app checkouts (GPay, PhonePe, Paytm)."
          }
        },
        {
          name: "Pay Order - UPI Collect (Enter VPA)",
          request: {
            method: "POST",
            header: [
              { key: "x-client-id", value: "{{cashfree_app_id}}" },
              { key: "x-client-secret", value: "{{cashfree_secret_key}}" },
              { key: "x-api-version", value: "2023-08-01" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "payment_session_id": "{{payment_session_id}}",\n  "payment_method": {\n    "upi": {\n      "channel": "collect",\n      "upi_id": "testsuccess@gocash"\n    }\n  }\n}'
            },
            url: {
              raw: "{{cashfree_base_url}}/orders/sessions",
              host: ["{{cashfree_base_url}}"],
              path: ["orders", "sessions"]
            },
            description: "Sends UPI collect request directly to customer's UPI app."
          }
        },
        {
          name: "Pay Order - Netbanking",
          request: {
            method: "POST",
            header: [
              { key: "x-client-id", value: "{{cashfree_app_id}}" },
              { key: "x-client-secret", value: "{{cashfree_secret_key}}" },
              { key: "x-api-version", value: "2023-08-01" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "payment_session_id": "{{payment_session_id}}",\n  "payment_method": {\n    "netbanking": {\n      "channel": "link",\n      "netbanking_bank_code": 3003\n    }\n  }\n}'
            },
            url: {
              raw: "{{cashfree_base_url}}/orders/sessions",
              host: ["{{cashfree_base_url}}"],
              path: ["orders", "sessions"]
            },
            description: "Directly routes customer to bank netbanking portal (e.g. 3003 = HDFC, 3022 = ICICI, 3044 = SBI)."
          }
        }
      ]
    },
    {
      name: "3. Payments & Transactions API",
      description: "Fetch payments, details, and submit headless OTPs.",
      item: [
        {
          name: "Fetch Payments for an Order",
          request: {
            method: "GET",
            header: [
              { key: "x-client-id", value: "{{cashfree_app_id}}" },
              { key: "x-client-secret", value: "{{cashfree_secret_key}}" },
              { key: "x-api-version", value: "2023-08-01" }
            ],
            url: {
              raw: "{{cashfree_base_url}}/orders/{{cashfree_order_id}}/payments",
              host: ["{{cashfree_base_url}}"],
              path: ["orders", "{{cashfree_order_id}}", "payments"]
            },
            description: "Retrieves payment attempts with bank reference IDs, payment methods, and timestamps."
          }
        },
        {
          name: "Get Payment by CF Payment ID",
          request: {
            method: "GET",
            header: [
              { key: "x-client-id", value: "{{cashfree_app_id}}" },
              { key: "x-client-secret", value: "{{cashfree_secret_key}}" },
              { key: "x-api-version", value: "2023-08-01" }
            ],
            url: {
              raw: "{{cashfree_base_url}}/orders/{{cashfree_order_id}}/payments/{{cf_payment_id}}",
              host: ["{{cashfree_base_url}}"],
              path: ["orders", "{{cashfree_order_id}}", "payments", "{{cf_payment_id}}"]
            },
            description: "Fetches a specific transaction attempt."
          }
        },
        {
          name: "Submit Headless Card OTP",
          request: {
            method: "POST",
            header: [
              { key: "x-client-id", value: "{{cashfree_app_id}}" },
              { key: "x-client-secret", value: "{{cashfree_secret_key}}" },
              { key: "x-api-version", value: "2023-08-01" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "action": "SUBMIT_OTP",\n  "otp": "123456"\n}'
            },
            url: {
              raw: "{{cashfree_base_url}}/orders/{{cashfree_order_id}}/payments/{{cf_payment_id}}/otp",
              host: ["{{cashfree_base_url}}"],
              path: ["orders", "{{cashfree_order_id}}", "payments", "{{cf_payment_id}}", "otp"]
            },
            description: "Submits bank OTP directly for headless custom card checkout experiences."
          }
        }
      ]
    },
    {
      name: "4. Payment Links API",
      description: "Generate dynamic payment links with SMS/Email/WhatsApp reminders.",
      item: [
        {
          name: "Create Payment Link",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "var jsonData = pm.response.json();",
                  "if (jsonData && jsonData.link_id) {",
                  "    pm.environment.set('cashfree_link_id', jsonData.link_id);",
                  "}"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [
              { key: "x-client-id", value: "{{cashfree_app_id}}" },
              { key: "x-client-secret", value: "{{cashfree_secret_key}}" },
              { key: "x-api-version", value: "2023-08-01" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "link_id": "link_cf_{{$timestamp}}",\n  "link_amount": 1499.00,\n  "link_currency": "INR",\n  "link_purpose": "Boost Engine Order #9821",\n  "customer_details": {\n    "customer_name": "Aman Sharma",\n    "customer_email": "aman@example.com",\n    "customer_phone": "9876543210"\n  },\n  "link_notify": {\n    "send_sms": true,\n    "send_email": true\n  }\n}'
            },
            url: {
              raw: "{{cashfree_base_url}}/links",
              host: ["{{cashfree_base_url}}"],
              path: ["links"]
            },
            description: "Generates a hosted payment link with SMS/Email notifications."
          }
        },
        {
          name: "Get Payment Link Details",
          request: {
            method: "GET",
            header: [
              { key: "x-client-id", value: "{{cashfree_app_id}}" },
              { key: "x-client-secret", value: "{{cashfree_secret_key}}" },
              { key: "x-api-version", value: "2023-08-01" }
            ],
            url: {
              raw: "{{cashfree_base_url}}/links/{{cashfree_link_id}}",
              host: ["{{cashfree_base_url}}"],
              path: ["links", "{{cashfree_link_id}}"]
            },
            description: "Fetches status of the payment link."
          }
        },
        {
          name: "Cancel Payment Link",
          request: {
            method: "POST",
            header: [
              { key: "x-client-id", value: "{{cashfree_app_id}}" },
              { key: "x-client-secret", value: "{{cashfree_secret_key}}" },
              { key: "x-api-version", value: "2023-08-01" }
            ],
            url: {
              raw: "{{cashfree_base_url}}/links/{{cashfree_link_id}}/cancel",
              host: ["{{cashfree_base_url}}"],
              path: ["links", "{{cashfree_link_id}}", "cancel"]
            },
            description: "Cancels an active payment link."
          }
        }
      ]
    },
    {
      name: "5. Verification Suite (KYC & Bank / UPI Verify)",
      description: "Cashfree Verification Suite for vendor / customer bank account, UPI, and PAN verification.",
      item: [
        {
          name: "Verify Bank Account (Penny Drop)",
          request: {
            method: "POST",
            header: [
              { key: "x-client-id", value: "{{cashfree_app_id}}" },
              { key: "x-client-secret", value: "{{cashfree_secret_key}}" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "bank_account": "001101524321",\n  "ifsc": "HDFC0000001",\n  "name": "Aman Sharma",\n  "phone": "9876543210"\n}'
            },
            url: {
              raw: "https://api.cashfree.com/verification/bank-account/sync",
              protocol: "https",
              host: ["api", "cashfree", "com"],
              path: ["verification", "bank-account", "sync"]
            },
            description: "Performs instant penny-drop verification and returns registered account holder name."
          }
        },
        {
          name: "Verify UPI VPA ID",
          request: {
            method: "POST",
            header: [
              { key: "x-client-id", value: "{{cashfree_app_id}}" },
              { key: "x-client-secret", value: "{{cashfree_secret_key}}" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "vpa": "aman@oksbi",\n  "name": "Aman Sharma"\n}'
            },
            url: {
              raw: "https://api.cashfree.com/verification/upi",
              protocol: "https",
              host: ["api", "cashfree", "com"],
              path: ["verification", "upi"]
            },
            description: "Validates UPI ID existence and checks if VPA is active and matches customer name."
          }
        },
        {
          name: "Verify PAN Card",
          request: {
            method: "POST",
            header: [
              { key: "x-client-id", value: "{{cashfree_app_id}}" },
              { key: "x-client-secret", value: "{{cashfree_secret_key}}" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "pan": "ABCDE1234F",\n  "name": "Aman Sharma"\n}'
            },
            url: {
              raw: "https://api.cashfree.com/verification/pan",
              protocol: "https",
              host: ["api", "cashfree", "com"],
              path: ["verification", "pan"]
            },
            description: "Verifies PAN card authenticity and registered tax name with NSDL."
          }
        }
      ]
    },
    {
      name: "6. Payouts & Disbursals API",
      description: "Instant vendor, affiliate, and refund disbursals via IMPS / NEFT / UPI.",
      item: [
        {
          name: "Add Beneficiary",
          request: {
            method: "POST",
            header: [
              { key: "Authorization", value: "Bearer {{cashfree_payout_token}}" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "beneId": "bene_{{$timestamp}}",\n  "name": "Aman Sharma",\n  "email": "aman@example.com",\n  "phone": "9876543210",\n  "bankAccount": "001101524321",\n  "ifsc": "HDFC0000001",\n  "address1": "Skyline Residency"\n}'
            },
            url: {
              raw: "https://payout-api.cashfree.com/payout/v1/addBeneficiary",
              protocol: "https",
              host: ["payout-api", "cashfree", "com"],
              path: ["payout", "v1", "addBeneficiary"]
            },
            description: "Registers a beneficiary for instant payouts."
          }
        },
        {
          name: "Request Instant Transfer / Payout",
          request: {
            method: "POST",
            header: [
              { key: "Authorization", value: "Bearer {{cashfree_payout_token}}" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "beneId": "bene_12345",\n  "amount": "1500.00",\n  "transferId": "trans_{{$timestamp}}",\n  "transferMode": "imps",\n  "remarks": "Boost Engine Affiliate Payout"\n}'
            },
            url: {
              raw: "https://payout-api.cashfree.com/payout/v1/requestTransfer",
              protocol: "https",
              host: ["payout-api", "cashfree", "com"],
              path: ["payout", "v1", "requestTransfer"]
            },
            description: "Disburses funds instantly to beneficiary bank account via IMPS/UPI/NEFT."
          }
        },
        {
          name: "Get Transfer Status",
          request: {
            method: "GET",
            header: [
              { key: "Authorization", value: "Bearer {{cashfree_payout_token}}" }
            ],
            url: {
              raw: "https://payout-api.cashfree.com/payout/v1/getTransferStatus?transferId=trans_12345",
              protocol: "https",
              host: ["payout-api", "cashfree", "com"],
              path: ["payout", "v1", "getTransferStatus"],
              query: [
                { key: "transferId", value: "trans_12345" }
              ]
            },
            description: "Checks status of payout transfer (SUCCESS, PENDING, REVERSED)."
          }
        }
      ]
    },
    {
      name: "7. Refunds API",
      description: "Trigger instant and standard refund requests.",
      item: [
        {
          name: "Create Refund",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "var jsonData = pm.response.json();",
                  "if (jsonData && jsonData.refund_id) {",
                  "    pm.environment.set('cashfree_refund_id', jsonData.refund_id);",
                  "}"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [
              { key: "x-client-id", value: "{{cashfree_app_id}}" },
              { key: "x-client-secret", value: "{{cashfree_secret_key}}" },
              { key: "x-api-version", value: "2023-08-01" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "refund_id": "rfnd_cf_{{$timestamp}}",\n  "refund_amount": 1499.00,\n  "refund_note": "Customer requested order cancellation"\n}'
            },
            url: {
              raw: "{{cashfree_base_url}}/orders/{{cashfree_order_id}}/refunds",
              host: ["{{cashfree_base_url}}"],
              path: ["orders", "{{cashfree_order_id}}", "refunds"]
            },
            description: "Processes a refund for a paid order."
          }
        },
        {
          name: "Fetch Refund by ID",
          request: {
            method: "GET",
            header: [
              { key: "x-client-id", value: "{{cashfree_app_id}}" },
              { key: "x-client-secret", value: "{{cashfree_secret_key}}" },
              { key: "x-api-version", value: "2023-08-01" }
            ],
            url: {
              raw: "{{cashfree_base_url}}/orders/{{cashfree_order_id}}/refunds/{{cashfree_refund_id}}",
              host: ["{{cashfree_base_url}}"],
              path: ["orders", "{{cashfree_order_id}}", "refunds", "{{cashfree_refund_id}}"]
            },
            description: "Queries the refund status (SUCCESS, PENDING, CANCELLED)."
          }
        },
        {
          name: "List All Refunds for an Order",
          request: {
            method: "GET",
            header: [
              { key: "x-client-id", value: "{{cashfree_app_id}}" },
              { key: "x-client-secret", value: "{{cashfree_secret_key}}" },
              { key: "x-api-version", value: "2023-08-01" }
            ],
            url: {
              raw: "{{cashfree_base_url}}/orders/{{cashfree_order_id}}/refunds",
              host: ["{{cashfree_base_url}}"],
              path: ["orders", "{{cashfree_order_id}}", "refunds"]
            },
            description: "Lists all partial/full refunds created for the order."
          }
        }
      ]
    },
    {
      name: "8. Subscriptions & Recurring API",
      description: "Recurring mandates and subscription billing.",
      item: [
        {
          name: "Create Subscription Plan",
          request: {
            method: "POST",
            header: [
              { key: "x-client-id", value: "{{cashfree_app_id}}" },
              { key: "x-client-secret", value: "{{cashfree_secret_key}}" },
              { key: "x-api-version", value: "2023-08-01" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "plan_id": "plan_monthly_coffee_{{$timestamp}}",\n  "plan_name": "Monthly Coffee Club",\n  "plan_type": "PERIODIC",\n  "plan_currency": "INR",\n  "plan_recurring_amount": 999.00,\n  "plan_max_amount": 2000.00,\n  "plan_intervals": 1,\n  "plan_interval_type": "MONTH"\n}'
            },
            url: {
              raw: "{{cashfree_base_url}}/subscription-plans",
              host: ["{{cashfree_base_url}}"],
              path: ["subscription-plans"]
            },
            description: "Creates a recurring billing plan for UPI Autopay / eNACH / Card mandate."
          }
        },
        {
          name: "Create Subscription",
          request: {
            method: "POST",
            header: [
              { key: "x-client-id", value: "{{cashfree_app_id}}" },
              { key: "x-client-secret", value: "{{cashfree_secret_key}}" },
              { key: "x-api-version", value: "2023-08-01" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "subscription_id": "sub_cf_{{$timestamp}}",\n  "plan_id": "plan_monthly_coffee_123",\n  "customer_details": {\n    "customer_name": "Aman Sharma",\n    "customer_email": "aman@example.com",\n    "customer_phone": "9876543210"\n  },\n  "subscription_expiry_time": "2027-12-31T23:59:59+05:30"\n}'
            },
            url: {
              raw: "{{cashfree_base_url}}/subscriptions",
              host: ["{{cashfree_base_url}}"],
              path: ["subscriptions"]
            },
            description: "Initializes a subscription for a customer to authorize mandate."
          }
        }
      ]
    },
    {
      name: "9. Webhooks Simulator",
      description: "Ready-to-fire simulated Cashfree webhooks for testing local servers and background workers.",
      item: [
        {
          name: "Webhook: PAYMENT_SUCCESS_WEBHOOK",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "x-webhook-signature", value: "{{computed_webhook_signature}}" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "data": {\n    "order": {\n      "order_id": "order_cf_001",\n      "order_amount": 1499.00,\n      "order_currency": "INR"\n    },\n    "payment": {\n      "cf_payment_id": 109283719,\n      "payment_status": "SUCCESS",\n      "payment_amount": 1499.00,\n      "payment_currency": "INR",\n      "payment_message": "Transaction successful",\n      "payment_time": "2026-09-08T18:30:00+05:30",\n      "bank_reference": "UPI-9821739218",\n      "payment_method": {\n        "upi": {\n          "channel": null,\n          "upi_id": "success@upi"\n        }\n      }\n    },\n    "customer_details": {\n      "customer_name": "Aman Sharma",\n      "customer_id": "cust_boost_01",\n      "customer_email": "aman@example.com",\n      "customer_phone": "9876543210"\n    }\n  },\n  "event_time": "2026-09-08T18:30:05+05:30",\n  "type": "PAYMENT_SUCCESS_WEBHOOK"\n}'
            },
            url: {
              raw: "{{local_webhook_url}}",
              host: ["{{local_webhook_url}}"]
            },
            description: "Simulates PAYMENT_SUCCESS_WEBHOOK event."
          }
        },
        {
          name: "Webhook: PAYMENT_FAILED_WEBHOOK",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "x-webhook-signature", value: "{{computed_webhook_signature}}" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "data": {\n    "order": {\n      "order_id": "order_cf_001",\n      "order_amount": 1499.00,\n      "order_currency": "INR"\n    },\n    "payment": {\n      "cf_payment_id": 109283720,\n      "payment_status": "FAILED",\n      "payment_amount": 1499.00,\n      "payment_message": "Bank declined transaction due to insufficient funds"\n    }\n  },\n  "type": "PAYMENT_FAILED_WEBHOOK"\n}'
            },
            url: {
              raw: "{{local_webhook_url}}",
              host: ["{{local_webhook_url}}"]
            },
            description: "Simulates PAYMENT_FAILED_WEBHOOK event."
          }
        },
        {
          name: "Webhook: REFUND_STATUS_WEBHOOK",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "x-webhook-signature", value: "{{computed_webhook_signature}}" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "data": {\n    "refund": {\n      "cf_payment_id": 109283719,\n      "cf_refund_id": 8821921,\n      "order_id": "order_cf_001",\n      "refund_id": "rfnd_cf_001",\n      "refund_amount": 1499.00,\n      "refund_status": "SUCCESS",\n      "refund_arn": "ARN1928374619"\n    }\n  },\n  "event_time": "2026-09-08T18:35:00+05:30",\n  "type": "REFUND_STATUS_WEBHOOK"\n}'
            },
            url: {
              raw: "{{local_webhook_url}}",
              host: ["{{local_webhook_url}}"]
            },
            description: "Simulates REFUND_STATUS_WEBHOOK event."
          }
        }
      ]
    }
  ]
};

// collections/phonepe.collection.json
var phonepe_collection_default = {
  info: {
    _postman_id: "pe123456-7890-4abc-def1-234567890123",
    name: "PhonePe PG Standard & Custom Full Collection",
    description: "Production Postman Collection for PhonePe PG (Standard Web Checkout, Custom UPI Intent Flow, UPI Collect VPA, Dynamic QR, Status Verification, Refunds, S2S Webhooks). Includes Pre-request scripts for automatic Base64 encoding and SHA256 X-VERIFY Checksum generation.",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  auth: {
    type: "noauth"
  },
  item: [
    {
      name: "1. Standard Web Checkout",
      description: "PhonePe Standard Hosted Pay Page flow with auto-checksum calculation.",
      item: [
        {
          name: "Initiate Standard Payment Request",
          event: [
            {
              listen: "prerequest",
              script: {
                exec: [
                  "var txnId = 'MT_' + Date.now();",
                  "pm.environment.set('phonepe_txn_id', txnId);",
                  "var payload = {",
                  "  merchantId: pm.environment.get('phonepe_merchant_id') || 'PGTESTPAYUAT',",
                  "  merchantTransactionId: txnId,",
                  "  merchantUserId: 'MUID_' + Date.now(),",
                  "  amount: 149900,",
                  "  redirectUrl: 'https://yourstore.com/order-success?id=' + txnId,",
                  "  redirectMode: 'POST',",
                  "  callbackUrl: pm.environment.get('local_webhook_url') || 'https://api.yourstore.com/webhooks/phonepe',",
                  "  mobileNumber: '9876543210',",
                  "  paymentInstrument: {",
                  "    type: 'PAY_PAGE'",
                  "  }",
                  "};",
                  "var base64Payload = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(payload)));",
                  "pm.environment.set('phonepe_base64_payload', base64Payload);",
                  "var saltKey = pm.environment.get('phonepe_salt_key') || '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';",
                  "var saltIndex = pm.environment.get('phonepe_salt_index') || '1';",
                  "var stringToHash = base64Payload + '/pg/v1/pay' + saltKey;",
                  "var sha256Hash = CryptoJS.SHA256(stringToHash).toString();",
                  "var xVerify = sha256Hash + '###' + saltIndex;",
                  "pm.environment.set('phonepe_x_verify', xVerify);"
                ],
                type: "text/javascript"
              }
            },
            {
              listen: "test",
              script: {
                exec: [
                  "var jsonData = pm.response.json();",
                  "if (jsonData && jsonData.data && jsonData.data.instrumentResponse) {",
                  "    pm.environment.set('phonepe_redirect_url', jsonData.data.instrumentResponse.redirectInfo.url);",
                  "    console.log('PhonePe checkout redirect URL:', jsonData.data.instrumentResponse.redirectInfo.url);",
                  "}"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "X-VERIFY", value: "{{phonepe_x_verify}}" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "request": "{{phonepe_base64_payload}}"\n}'
            },
            url: {
              raw: "{{phonepe_base_url}}/pg/v1/pay",
              host: ["{{phonepe_base_url}}"],
              path: ["pg", "v1", "pay"]
            },
            description: "Standard PhonePe Web Pay Page. Computes Base64 request body and X-VERIFY checksum in pre-request script."
          }
        }
      ]
    },
    {
      name: "2. Custom Mobile / App Flows (Intent & VPA)",
      description: "Mobile App SDK and Direct Intent Checkout.",
      item: [
        {
          name: "Initiate UPI Intent Payment (Mobile Apps)",
          event: [
            {
              listen: "prerequest",
              script: {
                exec: [
                  "var txnId = 'MT_INTENT_' + Date.now();",
                  "pm.environment.set('phonepe_txn_id', txnId);",
                  "var payload = {",
                  "  merchantId: pm.environment.get('phonepe_merchant_id') || 'PGTESTPAYUAT',",
                  "  merchantTransactionId: txnId,",
                  "  merchantUserId: 'MUID_' + Date.now(),",
                  "  amount: 149900,",
                  "  callbackUrl: pm.environment.get('local_webhook_url') || 'https://api.yourstore.com/webhooks/phonepe',",
                  "  mobileNumber: '9876543210',",
                  "  paymentInstrument: {",
                  "    type: 'UPI_INTENT',",
                  "    targetApp: 'com.phonepe.app'",
                  "  }",
                  "};",
                  "var base64Payload = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(payload)));",
                  "pm.environment.set('phonepe_intent_base64', base64Payload);",
                  "var saltKey = pm.environment.get('phonepe_salt_key') || '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';",
                  "var saltIndex = pm.environment.get('phonepe_salt_index') || '1';",
                  "var stringToHash = base64Payload + '/pg/v1/pay' + saltKey;",
                  "var sha256Hash = CryptoJS.SHA256(stringToHash).toString();",
                  "pm.environment.set('phonepe_intent_x_verify', sha256Hash + '###' + saltIndex);"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "X-VERIFY", value: "{{phonepe_intent_x_verify}}" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "request": "{{phonepe_intent_base64}}"\n}'
            },
            url: {
              raw: "{{phonepe_base_url}}/pg/v1/pay",
              host: ["{{phonepe_base_url}}"],
              path: ["pg", "v1", "pay"]
            },
            description: "Returns intentUrl to trigger PhonePe Android/iOS app directly without browser redirect."
          }
        },
        {
          name: "Initiate UPI Collect (VPA Flow)",
          event: [
            {
              listen: "prerequest",
              script: {
                exec: [
                  "var txnId = 'MT_VPA_' + Date.now();",
                  "pm.environment.set('phonepe_txn_id', txnId);",
                  "var payload = {",
                  "  merchantId: pm.environment.get('phonepe_merchant_id') || 'PGTESTPAYUAT',",
                  "  merchantTransactionId: txnId,",
                  "  merchantUserId: 'MUID_' + Date.now(),",
                  "  amount: 149900,",
                  "  callbackUrl: pm.environment.get('local_webhook_url') || 'https://api.yourstore.com/webhooks/phonepe',",
                  "  mobileNumber: '9876543210',",
                  "  paymentInstrument: {",
                  "    type: 'UPI_COLLECT',",
                  "    vpa: 'aman@oksbi'",
                  "  }",
                  "};",
                  "var base64Payload = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(payload)));",
                  "pm.environment.set('phonepe_vpa_base64', base64Payload);",
                  "var saltKey = pm.environment.get('phonepe_salt_key') || '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';",
                  "var saltIndex = pm.environment.get('phonepe_salt_index') || '1';",
                  "var stringToHash = base64Payload + '/pg/v1/pay' + saltKey;",
                  "var sha256Hash = CryptoJS.SHA256(stringToHash).toString();",
                  "pm.environment.set('phonepe_vpa_x_verify', sha256Hash + '###' + saltIndex);"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "X-VERIFY", value: "{{phonepe_vpa_x_verify}}" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "request": "{{phonepe_vpa_base64}}"\n}'
            },
            url: {
              raw: "{{phonepe_base_url}}/pg/v1/pay",
              host: ["{{phonepe_base_url}}"],
              path: ["pg", "v1", "pay"]
            },
            description: "Sends UPI collect request directly to customer VPA handle."
          }
        },
        {
          name: "Create Dynamic UPI QR",
          event: [
            {
              listen: "prerequest",
              script: {
                exec: [
                  "var txnId = 'MT_QR_' + Date.now();",
                  "pm.environment.set('phonepe_txn_id', txnId);",
                  "var payload = {",
                  "  merchantId: pm.environment.get('phonepe_merchant_id') || 'PGTESTPAYUAT',",
                  "  transactionId: txnId,",
                  "  merchantOrderId: 'ORD_' + Date.now(),",
                  "  amount: 149900,",
                  "  expiresIn: 600,",
                  "  storeId: 'STORE_01',",
                  "  terminalId: 'TERM_01'",
                  "};",
                  "var base64Payload = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(payload)));",
                  "pm.environment.set('phonepe_qr_base64', base64Payload);",
                  "var saltKey = pm.environment.get('phonepe_salt_key') || '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';",
                  "var saltIndex = pm.environment.get('phonepe_salt_index') || '1';",
                  "var stringToHash = base64Payload + '/pg/v1/qr/init' + saltKey;",
                  "var sha256Hash = CryptoJS.SHA256(stringToHash).toString();",
                  "pm.environment.set('phonepe_qr_x_verify', sha256Hash + '###' + saltIndex);"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "X-VERIFY", value: "{{phonepe_qr_x_verify}}" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "request": "{{phonepe_qr_base64}}"\n}'
            },
            url: {
              raw: "{{phonepe_base_url}}/pg/v1/qr/init",
              host: ["{{phonepe_base_url}}"],
              path: ["pg", "v1", "qr", "init"]
            },
            description: "Initializes a dynamic QR code for desktop checkout or in-store POS."
          }
        }
      ]
    },
    {
      name: "3. Status Verification API",
      description: "Verify payment transaction status via S2S polling.",
      item: [
        {
          name: "Check Order Payment Status",
          event: [
            {
              listen: "prerequest",
              script: {
                exec: [
                  "var merchantId = pm.environment.get('phonepe_merchant_id') || 'PGTESTPAYUAT';",
                  "var txnId = pm.environment.get('phonepe_txn_id') || 'MT_TEST_001';",
                  "var saltKey = pm.environment.get('phonepe_salt_key') || '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';",
                  "var saltIndex = pm.environment.get('phonepe_salt_index') || '1';",
                  "var endpoint = '/pg/v1/status/' + merchantId + '/' + txnId;",
                  "var stringToHash = endpoint + saltKey;",
                  "var sha256Hash = CryptoJS.SHA256(stringToHash).toString();",
                  "pm.environment.set('phonepe_status_x_verify', sha256Hash + '###' + saltIndex);"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "GET",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "X-VERIFY", value: "{{phonepe_status_x_verify}}" },
              { key: "X-MERCHANT-ID", value: "{{phonepe_merchant_id}}" }
            ],
            url: {
              raw: "{{phonepe_base_url}}/pg/v1/status/{{phonepe_merchant_id}}/{{phonepe_txn_id}}",
              host: ["{{phonepe_base_url}}"],
              path: ["pg", "v1", "status", "{{phonepe_merchant_id}}", "{{phonepe_txn_id}}"]
            },
            description: "Fetches status of transaction (PAYMENT_SUCCESS, PAYMENT_ERROR, PAYMENT_PENDING)."
          }
        }
      ]
    },
    {
      name: "4. Refunds API",
      description: "Trigger and monitor refund requests.",
      item: [
        {
          name: "Initiate Refund",
          event: [
            {
              listen: "prerequest",
              script: {
                exec: [
                  "var refundTxnId = 'RF_' + Date.now();",
                  "pm.environment.set('phonepe_refund_id', refundTxnId);",
                  "var payload = {",
                  "  merchantId: pm.environment.get('phonepe_merchant_id') || 'PGTESTPAYUAT',",
                  "  merchantTransactionId: refundTxnId,",
                  "  originalTransactionId: pm.environment.get('phonepe_txn_id') || 'MT_TEST_001',",
                  "  amount: 149900,",
                  "  callbackUrl: pm.environment.get('local_webhook_url') || 'https://api.yourstore.com/webhooks/phonepe'",
                  "};",
                  "var base64Payload = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(JSON.stringify(payload)));",
                  "pm.environment.set('phonepe_refund_base64', base64Payload);",
                  "var saltKey = pm.environment.get('phonepe_salt_key') || '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';",
                  "var saltIndex = pm.environment.get('phonepe_salt_index') || '1';",
                  "var stringToHash = base64Payload + '/pg/v1/refund' + saltKey;",
                  "var sha256Hash = CryptoJS.SHA256(stringToHash).toString();",
                  "pm.environment.set('phonepe_refund_x_verify', sha256Hash + '###' + saltIndex);"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "X-VERIFY", value: "{{phonepe_refund_x_verify}}" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "request": "{{phonepe_refund_base64}}"\n}'
            },
            url: {
              raw: "{{phonepe_base_url}}/pg/v1/refund",
              host: ["{{phonepe_base_url}}"],
              path: ["pg", "v1", "refund"]
            },
            description: "Initiates a refund back to customer source account."
          }
        }
      ]
    },
    {
      name: "5. S2S Callback / Webhook Simulator",
      description: "Simulate server-to-server webhook callbacks sent by PhonePe on payment completion.",
      item: [
        {
          name: "S2S Callback: PAYMENT_SUCCESS",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "X-VERIFY", value: "{{phonepe_mock_callback_verify}}" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "response": "eyJzdWNjZXNzIjp0cnVlLCJjb2RlIjoiUEFZTUVOVF9TVUNDRVNTIiwibWVzc2FnZSI6IlBheW1lbnQgc3VjY2Vzc2Z1bCIsImRhdGEiOnsibWVyY2hhbnRJZCI6IlBHVEVTVFBBWVVBVCIsIm1lcmNoYW50VHJhbnNhY3Rpb25JZCI6Ik1UXzA5MjE3MzgxIiwidHJhbnNhY3Rpb25JZCI6IlQyNDA5MDgxODMwMTAiLCJhbW91bnQiOjE0OTkwMCwic3RhdGUiOiJDT01QTEVURUQiLCJyZXNwb25zZUNvZGUiOiJTVUNDRVNTIn19"\n}'
            },
            url: {
              raw: "{{local_webhook_url}}",
              host: ["{{local_webhook_url}}"]
            },
            description: "Simulates PhonePe Base64 decoded PAYMENT_SUCCESS server callback."
          }
        }
      ]
    }
  ]
};

// collections/paytm.collection.json
var paytm_collection_default = {
  info: {
    _postman_id: "pt123456-5555-4abc-def6-789012345678",
    name: "Paytm Payment Gateway Full API Collection",
    description: "Production Postman Collection for Paytm All-In-One PG (Initiate Transaction Token, Fetch Payment Status, Process Refund, Refund Status, Dynamic QR, and S2S Webhooks Simulator).",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  auth: {
    type: "noauth"
  },
  item: [
    {
      name: "1. Transaction & Checkout",
      description: "Initiate checkout and generate txnToken for Paytm JS Checkout SDK / App SDK.",
      item: [
        {
          name: "Initiate Transaction (Generate txnToken)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "var jsonData = pm.response.json();",
                  "if (jsonData && jsonData.body && jsonData.body.txnToken) {",
                  "    pm.environment.set('paytm_txn_token', jsonData.body.txnToken);",
                  "    console.log('Saved paytm_txn_token: ' + jsonData.body.txnToken);",
                  "}"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "head": {\n    "signature": "{{paytm_checksum}}"\n  },\n  "body": {\n    "requestType": "Payment",\n    "mid": "{{paytm_mid}}",\n    "websiteName": "DEFAULT",\n    "orderId": "ORDER_PTM_{{$timestamp}}",\n    "callbackUrl": "{{local_webhook_url}}",\n    "txnAmount": {\n      "value": "1499.00",\n      "currency": "INR"\n    },\n    "userInfo": {\n      "custId": "CUST_{{$timestamp}}",\n      "mobile": "9876543210",\n      "email": "aman@example.com"\n    }\n  }\n}'
            },
            url: {
              raw: "{{paytm_base_url}}/theia/api/v1/initiateTransaction?mid={{paytm_mid}}&orderId=ORDER_PTM_{{$timestamp}}",
              host: ["{{paytm_base_url}}"],
              path: ["theia", "api", "v1", "initiateTransaction"],
              query: [
                { key: "mid", value: "{{paytm_mid}}" },
                { key: "orderId", value: "ORDER_PTM_{{$timestamp}}" }
              ]
            },
            description: "Initiates payment session and returns txnToken used by frontend checkout."
          }
        }
      ]
    },
    {
      name: "2. Payment Status Verification",
      description: "Query Paytm backend for real-time payment status.",
      item: [
        {
          name: "Transaction Status Check",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "head": {\n    "signature": "{{paytm_checksum}}"\n  },\n  "body": {\n    "mid": "{{paytm_mid}}",\n    "orderId": "{{paytm_order_id}}"\n  }\n}'
            },
            url: {
              raw: "{{paytm_base_url}}/v3/order/status",
              host: ["{{paytm_base_url}}"],
              path: ["v3", "order", "status"]
            },
            description: "Verifies transaction state (TXN_SUCCESS, TXN_FAILURE, PENDING)."
          }
        }
      ]
    },
    {
      name: "3. Refunds API",
      description: "Trigger and monitor refund status.",
      item: [
        {
          name: "Initiate Refund",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "head": {\n    "signature": "{{paytm_checksum}}"\n  },\n  "body": {\n    "mid": "{{paytm_mid}}",\n    "txnType": "REFUND",\n    "orderId": "{{paytm_order_id}}",\n    "txnId": "{{paytm_txn_id}}",\n    "refId": "REFUND_PTM_{{$timestamp}}",\n    "refundAmount": "1499.00"\n  }\n}'
            },
            url: {
              raw: "{{paytm_base_url}}/refund/apply",
              host: ["{{paytm_base_url}}"],
              path: ["refund", "apply"]
            },
            description: "Initiates refund to source payment method."
          }
        },
        {
          name: "Check Refund Status",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "head": {\n    "signature": "{{paytm_checksum}}"\n  },\n  "body": {\n    "mid": "{{paytm_mid}}",\n    "orderId": "{{paytm_order_id}}",\n    "refId": "REFUND_PTM_001"\n  }\n}'
            },
            url: {
              raw: "{{paytm_base_url}}/v2/refund/status",
              host: ["{{paytm_base_url}}"],
              path: ["v2", "refund", "status"]
            },
            description: "Checks status of refund (TXN_SUCCESS, PENDING)."
          }
        }
      ]
    },
    {
      name: "4. Webhooks Simulator",
      description: "Simulated Paytm S2S payment notification.",
      item: [
        {
          name: "Webhook: Payment Response S2S",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/x-www-form-urlencoded" }
            ],
            body: {
              mode: "urlencoded",
              urlencoded: [
                { key: "MID", value: "{{paytm_mid}}" },
                { key: "ORDERID", value: "ORDER_PTM_1001" },
                { key: "TXNAMOUNT", value: "1499.00" },
                { key: "CURRENCY", value: "INR" },
                { key: "STATUS", value: "TXN_SUCCESS" },
                { key: "RESPCODE", value: "01" },
                { key: "RESPMSG", value: "Txn Success" },
                { key: "BANKTXNID", value: "109283719283" },
                { key: "PAYMENTMODE", value: "UPI" },
                { key: "CHECKSUMHASH", value: "{{paytm_checksum}}" }
              ]
            },
            url: {
              raw: "{{local_webhook_url}}",
              host: ["{{local_webhook_url}}"]
            },
            description: "Simulates S2S POST callback sent by Paytm on transaction completion."
          }
        }
      ]
    }
  ]
};

// collections/stripe.collection.json
var stripe_collection_default = {
  info: {
    _postman_id: "st123456-1111-4abc-def2-345678901234",
    name: "Stripe Full Global Payments API Collection",
    description: "Exhaustive Production Postman Collection for Stripe API (Checkout Sessions, PaymentIntents, Customers, Payment Methods, Refunds, Webhooks).",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  auth: {
    type: "bearer",
    bearer: [
      {
        key: "token",
        value: "{{stripe_secret_key}}",
        type: "string"
      }
    ]
  },
  item: [
    {
      name: "1. Checkout Sessions",
      description: "Hosted checkout page APIs for global card and local payment methods.",
      item: [
        {
          name: "Create Checkout Session",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "var jsonData = pm.response.json();",
                  "if (jsonData && jsonData.id) {",
                  "    pm.environment.set('stripe_session_id', jsonData.id);",
                  "}"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/x-www-form-urlencoded"
              }
            ],
            body: {
              mode: "urlencoded",
              urlencoded: [
                {
                  key: "mode",
                  value: "payment"
                },
                {
                  key: "success_url",
                  value: "https://yourstore.com/order-confirmed?session_id={CHECKOUT_SESSION_ID}"
                },
                {
                  key: "cancel_url",
                  value: "https://yourstore.com/cart"
                },
                {
                  key: "line_items[0][price_data][currency]",
                  value: "inr"
                },
                {
                  key: "line_items[0][price_data][product_data][name]",
                  value: "Boost Engine Cyberpunk Hoodie"
                },
                {
                  key: "line_items[0][price_data][unit_amount]",
                  value: "199900"
                },
                {
                  key: "line_items[0][quantity]",
                  value: "1"
                }
              ]
            },
            url: {
              raw: "{{stripe_base_url}}/checkout/sessions",
              host: ["{{stripe_base_url}}"],
              path: ["checkout", "sessions"]
            },
            description: "Creates a Stripe Checkout Session."
          }
        },
        {
          name: "Retrieve Checkout Session",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{stripe_base_url}}/checkout/sessions/{{stripe_session_id}}",
              host: ["{{stripe_base_url}}"],
              path: ["checkout", "sessions", "{{stripe_session_id}}"]
            },
            description: "Retrieves the checkout session to verify payment status."
          }
        },
        {
          name: "Expire Checkout Session",
          request: {
            method: "POST",
            header: [],
            url: {
              raw: "{{stripe_base_url}}/checkout/sessions/{{stripe_session_id}}/expire",
              host: ["{{stripe_base_url}}"],
              path: ["checkout", "sessions", "{{stripe_session_id}}", "expire"]
            },
            description: "Expires an open checkout session so it cannot be paid."
          }
        }
      ]
    },
    {
      name: "2. Payment Intents (Headless)",
      description: "Direct server-driven payment flows.",
      item: [
        {
          name: "Create PaymentIntent",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "var jsonData = pm.response.json();",
                  "if (jsonData && jsonData.id) {",
                  "    pm.environment.set('stripe_payment_intent_id', jsonData.id);",
                  "}"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/x-www-form-urlencoded"
              }
            ],
            body: {
              mode: "urlencoded",
              urlencoded: [
                {
                  key: "amount",
                  value: "199900"
                },
                {
                  key: "currency",
                  value: "inr"
                },
                {
                  key: "automatic_payment_methods[enabled]",
                  value: "true"
                }
              ]
            },
            url: {
              raw: "{{stripe_base_url}}/payment_intents",
              host: ["{{stripe_base_url}}"],
              path: ["payment_intents"]
            },
            description: "Creates a PaymentIntent for custom checkout Elements."
          }
        },
        {
          name: "Retrieve PaymentIntent",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{stripe_base_url}}/payment_intents/{{stripe_payment_intent_id}}",
              host: ["{{stripe_base_url}}"],
              path: ["payment_intents", "{{stripe_payment_intent_id}}"]
            },
            description: "Checks PaymentIntent status."
          }
        },
        {
          name: "Capture PaymentIntent",
          request: {
            method: "POST",
            header: [],
            url: {
              raw: "{{stripe_base_url}}/payment_intents/{{stripe_payment_intent_id}}/capture",
              host: ["{{stripe_base_url}}"],
              path: ["payment_intents", "{{stripe_payment_intent_id}}", "capture"]
            },
            description: "Captures funds of an authorized PaymentIntent."
          }
        }
      ]
    },
    {
      name: "3. Customers API",
      description: "Manage saved payment methods and customer records.",
      item: [
        {
          name: "Create Customer",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "var jsonData = pm.response.json();",
                  "if (jsonData && jsonData.id) {",
                  "    pm.environment.set('stripe_customer_id', jsonData.id);",
                  "}"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/x-www-form-urlencoded"
              }
            ],
            body: {
              mode: "urlencoded",
              urlencoded: [
                {
                  key: "name",
                  value: "Aman Sharma"
                },
                {
                  key: "email",
                  value: "aman@example.com"
                },
                {
                  key: "phone",
                  value: "+919876543210"
                }
              ]
            },
            url: {
              raw: "{{stripe_base_url}}/customers",
              host: ["{{stripe_base_url}}"],
              path: ["customers"]
            },
            description: "Creates customer record in Stripe."
          }
        },
        {
          name: "Retrieve Customer",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{stripe_base_url}}/customers/{{stripe_customer_id}}",
              host: ["{{stripe_base_url}}"],
              path: ["customers", "{{stripe_customer_id}}"]
            },
            description: "Retrieves customer profile."
          }
        }
      ]
    },
    {
      name: "4. Refunds API",
      description: "Process and query refunds.",
      item: [
        {
          name: "Create Refund",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/x-www-form-urlencoded"
              }
            ],
            body: {
              mode: "urlencoded",
              urlencoded: [
                {
                  key: "payment_intent",
                  value: "{{stripe_payment_intent_id}}"
                },
                {
                  key: "amount",
                  value: "199900"
                }
              ]
            },
            url: {
              raw: "{{stripe_base_url}}/refunds",
              host: ["{{stripe_base_url}}"],
              path: ["refunds"]
            },
            description: "Processes refund."
          }
        },
        {
          name: "List All Refunds",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{stripe_base_url}}/refunds?limit=10",
              host: ["{{stripe_base_url}}"],
              path: ["refunds"],
              query: [
                {
                  key: "limit",
                  value: "10"
                }
              ]
            },
            description: "Lists recent refunds."
          }
        }
      ]
    }
  ]
};

// collections/easyecom.collection.json
var easyecom_collection_default = {
  info: {
    _postman_id: "8f21bc90-2134-4b45-9128-b12a83e01290",
    name: "EasyEcom Full eCommerce & Warehouse ERP API Collection",
    description: "Exhaustive Enterprise Postman Collection for EasyEcom (Orders, Batch Dispatches, Multi-Warehouse Stock Sync, Master Catalog SKUs, Inward/Outward Inventory, AWB & Courier Manifests, Returns Reconciliation).",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  auth: {
    type: "bearer",
    bearer: [
      {
        key: "token",
        value: "{{easyecom_api_token}}",
        type: "string"
      }
    ]
  },
  item: [
    {
      name: "1. Orders & Dispatches API",
      description: "Push storefront orders, fetch pending shipments, allocate couriers, and generate manifests.",
      item: [
        {
          name: "Fetch Pending Orders",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{easyecom_base_url}}/orders/v2/getOrders?status=pending&limit=20",
              host: ["{{easyecom_base_url}}"],
              path: ["orders", "v2", "getOrders"],
              query: [
                { key: "status", value: "pending" },
                { key: "limit", value: "20" }
              ]
            },
            description: "Fetches unfulfilled orders."
          }
        },
        {
          name: "Create / Push Store Order",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "order_details": {\n    "order_reference_id": "ORD_BOOST_{{$timestamp}}",\n    "order_date": "2026-09-08 18:30:00",\n    "payment_mode": "Prepaid",\n    "marketplace": "CustomStore",\n    "customer_details": {\n      "first_name": "Rahul",\n      "last_name": "Verma",\n      "email": "rahul.verma@example.com",\n      "contact_number": "9876543210"\n    },\n    "shipping_address": {\n      "address_line_1": "Flat 402, Skyline Residency",\n      "city": "Mumbai",\n      "state": "Maharashtra",\n      "pin_code": "400053",\n      "country": "India"\n    },\n    "order_items": [\n      {\n        "sku": "TEE-ANIME-BLK-L",\n        "item_title": "Oversized Anime Black T-Shirt (Large)",\n        "quantity": 1,\n        "selling_price": 799,\n        "tax_percentage": 5,\n        "discount": 0\n      }\n    ],\n    "total_amount": 799,\n    "shipping_charges": 0\n  }\n}'
            },
            url: {
              raw: "{{easyecom_base_url}}/orders/v2/createOrder",
              host: ["{{easyecom_base_url}}"],
              path: ["orders", "v2", "createOrder"]
            },
            description: "Pushes storefront order into EasyEcom ERP."
          }
        },
        {
          name: "Update Order Status (Shipped / Delivered)",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "order_reference_id": "ORD_BOOST_9821",\n  "status": "shipped",\n  "tracking_number": "AWB_DELHIVERY_1092831",\n  "courier_name": "Delhivery Surface"\n}'
            },
            url: {
              raw: "{{easyecom_base_url}}/orders/v2/updateOrderStatus",
              host: ["{{easyecom_base_url}}"],
              path: ["orders", "v2", "updateOrderStatus"]
            },
            description: "Updates fulfillment status."
          }
        },
        {
          name: "Cancel Order",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "order_reference_id": "ORD_BOOST_9821",\n  "cancellation_reason": "Customer requested cancellation before pack"\n}'
            },
            url: {
              raw: "{{easyecom_base_url}}/orders/v2/cancelOrder",
              host: ["{{easyecom_base_url}}"],
              path: ["orders", "v2", "cancelOrder"]
            },
            description: "Cancels order in EasyEcom ERP."
          }
        },
        {
          name: "Generate Dispatch Manifest",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "carrier_name": "Delhivery",\n  "warehouse_id": 101,\n  "order_ids": ["ORD_BOOST_9821", "ORD_BOOST_9822"]\n}'
            },
            url: {
              raw: "{{easyecom_base_url}}/orders/v2/generateManifest",
              host: ["{{easyecom_base_url}}"],
              path: ["orders", "v2", "generateManifest"]
            },
            description: "Generates dispatch handover manifest document."
          }
        }
      ]
    },
    {
      name: "2. Inventory & Warehouses API",
      description: "Multi-location inventory sync, stock adjustment, and warehouse management.",
      item: [
        {
          name: "Get Inventory by Warehouse",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{easyecom_base_url}}/inventory/v2/getInventory?warehouse_id=101&limit=50",
              host: ["{{easyecom_base_url}}"],
              path: ["inventory", "v2", "getInventory"],
              query: [
                { key: "warehouse_id", value: "101" },
                { key: "limit", value: "50" }
              ]
            },
            description: "Fetches current stock on hand and available to sell."
          }
        },
        {
          name: "Update Stock (Single SKU)",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "sku": "TEE-ANIME-BLK-L",\n  "warehouse_id": 101,\n  "quantity": 150,\n  "update_type": "absolute"\n}'
            },
            url: {
              raw: "{{easyecom_base_url}}/inventory/v2/updateStock",
              host: ["{{easyecom_base_url}}"],
              path: ["inventory", "v2", "updateStock"]
            },
            description: "Updates physical inventory for an SKU across sales channels."
          }
        },
        {
          name: "List All Warehouses",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{easyecom_base_url}}/warehouses/v2/getWarehouses",
              host: ["{{easyecom_base_url}}"],
              path: ["warehouses", "v2", "getWarehouses"]
            },
            description: "Lists all fulfillment centers and locations."
          }
        }
      ]
    },
    {
      name: "3. Master Catalog & SKUs",
      description: "Manage master product catalog, barcodes, and HSN tax codes.",
      item: [
        {
          name: "Get Product Master by SKU",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{easyecom_base_url}}/products/v2/getProduct?sku=TEE-ANIME-BLK-L",
              host: ["{{easyecom_base_url}}"],
              path: ["products", "v2", "getProduct"],
              query: [
                { key: "sku", value: "TEE-ANIME-BLK-L" }
              ]
            },
            description: "Fetches SKU attributes, weight, dimensions, and HSN code."
          }
        },
        {
          name: "Create / Update Product Master",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "sku": "HOODIE-WINTER-NVY-XL",\n  "name": "Oversized Navy Blue Winter Hoodie (XL)",\n  "hsn_code": "61012000",\n  "cost_price": 650,\n  "mrp": 2499,\n  "tax_rate": 12,\n  "weight_grams": 650,\n  "length": 30,\n  "width": 25,\n  "height": 8\n}'
            },
            url: {
              raw: "{{easyecom_base_url}}/products/v2/createProduct",
              host: ["{{easyecom_base_url}}"],
              path: ["products", "v2", "createProduct"]
            },
            description: "Creates master product record in ERP."
          }
        }
      ]
    },
    {
      name: "4. Returns & Inward Reconciliation",
      description: "Process RTO & Customer Returns.",
      item: [
        {
          name: "List Inward Returns",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{easyecom_base_url}}/returns/v2/getReturns?status=in_transit&limit=20",
              host: ["{{easyecom_base_url}}"],
              path: ["returns", "v2", "getReturns"],
              query: [
                { key: "status", value: "in_transit" },
                { key: "limit", value: "20" }
              ]
            },
            description: "Lists customer returns on their way to warehouse."
          }
        },
        {
          name: "Reconcile Inward Return",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "return_id": "RET_109283",\n  "qc_status": "PASSED",\n  "restock_inventory": true,\n  "warehouse_id": 101,\n  "remarks": "Item verified in original packaging"\n}'
            },
            url: {
              raw: "{{easyecom_base_url}}/returns/v2/reconcileReturn",
              host: ["{{easyecom_base_url}}"],
              path: ["returns", "v2", "reconcileReturn"]
            },
            description: "Runs QC check and restocks returned item back to inventory."
          }
        }
      ]
    }
  ]
};

// collections/shiprocket.collection.json
var shiprocket_collection_default = {
  info: {
    _postman_id: "sr123456-2222-4abc-def3-456789012345",
    name: "Shiprocket Full Logistics & Courier API Collection",
    description: "Exhaustive Enterprise Postman Collection for Shiprocket (Authentication, Pincode & International Serviceability, Custom & Bulk Orders, AWB Generation, Courier Pickup, Manifests, Labels, Tax Invoices, Live Tracking, NDR Actions, and Webhooks Simulator). Includes auto-chaining token and shipment IDs.",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  auth: {
    type: "bearer",
    bearer: [
      {
        key: "token",
        value: "{{shiprocket_token}}",
        type: "string"
      }
    ]
  },
  item: [
    {
      name: "1. Authentication",
      description: "Login API to generate Bearer JWT token.",
      item: [
        {
          name: "Login & Auto-Set Token",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "var jsonData = pm.response.json();",
                  "if (jsonData && jsonData.token) {",
                  "    pm.environment.set('shiprocket_token', jsonData.token);",
                  "    console.log('Shiprocket token saved to environment!');",
                  "}"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "email": "{{shiprocket_email}}",\n  "password": "{{shiprocket_password}}"\n}'
            },
            url: {
              raw: "{{shiprocket_base_url}}/auth/login",
              host: ["{{shiprocket_base_url}}"],
              path: ["auth", "login"]
            },
            description: "Logs in and automatically saves JWT into {{shiprocket_token}} for all subsequent requests."
          }
        }
      ]
    },
    {
      name: "2. Serviceability & Courier Rates",
      description: "Check pin code delivery, courier rates, and COD eligibility.",
      item: [
        {
          name: "Check Domestic Courier Serviceability & Rates",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{shiprocket_base_url}}/courier/serviceability?pickup_postcode={{pickup_pincode}}&delivery_postcode={{delivery_pincode}}&weight=0.5&cod=1",
              host: ["{{shiprocket_base_url}}"],
              path: ["courier", "serviceability"],
              query: [
                { key: "pickup_postcode", value: "{{pickup_pincode}}" },
                { key: "delivery_postcode", value: "{{delivery_pincode}}" },
                { key: "weight", value: "0.5" },
                { key: "cod", value: "1" }
              ]
            },
            description: "Returns courier partners (Delhivery, Bluedart, Xpressbees, Shadowfax) with freight rates and estimated delivery times."
          }
        },
        {
          name: "Check International Courier Serviceability",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{shiprocket_base_url}}/courier/international/serviceability?pickup_postcode={{pickup_pincode}}&delivery_country=US&delivery_postcode=90001&weight=1",
              host: ["{{shiprocket_base_url}}"],
              path: ["courier", "international", "serviceability"],
              query: [
                { key: "pickup_postcode", value: "{{pickup_pincode}}" },
                { key: "delivery_country", value: "US" },
                { key: "delivery_postcode", value: "90001" },
                { key: "weight", value: "1" }
              ]
            },
            description: "Calculates cross-border shipping rates for DHL, FedEx, Aramex."
          }
        }
      ]
    },
    {
      name: "3. Orders API",
      description: "Create, modify, and cancel shipment orders.",
      item: [
        {
          name: "Create Custom / Quick Order",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "var jsonData = pm.response.json();",
                  "if (jsonData && jsonData.order_id) {",
                  "    pm.environment.set('shiprocket_order_id', jsonData.order_id);",
                  "    pm.environment.set('shipment_id', jsonData.shipment_id);",
                  "    console.log('Saved order_id: ' + jsonData.order_id + ', shipment_id: ' + jsonData.shipment_id);",
                  "}"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "order_id": "ORD_SR_{{$timestamp}}",\n  "order_date": "2026-09-08 18:30",\n  "pickup_location": "Primary Warehouse",\n  "billing_customer_name": "Aman",\n  "billing_last_name": "Sharma",\n  "billing_address": "Flat 402, Skyline Residency",\n  "billing_city": "Mumbai",\n  "billing_pincode": "400053",\n  "billing_state": "Maharashtra",\n  "billing_country": "India",\n  "billing_email": "aman@example.com",\n  "billing_phone": "9876543210",\n  "shipping_is_billing": true,\n  "order_items": [\n    {\n      "name": "Boost Engine Heavy Hoodie",\n      "sku": "HOODIE-BLK-L",\n      "units": 1,\n      "selling_price": 1499,\n      "discount": 0,\n      "tax": 18\n    }\n  ],\n  "payment_method": "Prepaid",\n  "sub_total": 1499,\n  "length": 10,\n  "breadth": 15,\n  "height": 5,\n  "weight": 0.5\n}'
            },
            url: {
              raw: "{{shiprocket_base_url}}/orders/create/adhoc",
              host: ["{{shiprocket_base_url}}"],
              path: ["orders", "create", "adhoc"]
            },
            description: "Creates shipment order and sets {{shiprocket_order_id}} and {{shipment_id}}."
          }
        },
        {
          name: "Update Customer Delivery Address",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "order_id": [{{shiprocket_order_id}}],\n  "shipping_customer_name": "Aman Sharma",\n  "shipping_phone": "9876543210",\n  "shipping_address": "Plot 12, Tech Park, Andheri East",\n  "shipping_city": "Mumbai",\n  "shipping_state": "Maharashtra",\n  "shipping_pincode": "400069",\n  "shipping_country": "India"\n}'
            },
            url: {
              raw: "{{shiprocket_base_url}}/orders/address/update",
              host: ["{{shiprocket_base_url}}"],
              path: ["orders", "address", "update"]
            },
            description: "Updates customer shipping address before courier pickup."
          }
        },
        {
          name: "Cancel Order",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "ids": [{{shiprocket_order_id}}]\n}'
            },
            url: {
              raw: "{{shiprocket_base_url}}/orders/cancel",
              host: ["{{shiprocket_base_url}}"],
              path: ["orders", "cancel"]
            },
            description: "Cancels an order before dispatch."
          }
        },
        {
          name: "Create Return Order",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "order_id": "RET_SR_{{$timestamp}}",\n  "order_date": "2026-09-08 18:30",\n  "channel_id": "",\n  "pickup_customer_name": "Aman Sharma",\n  "pickup_phone": "9876543210",\n  "pickup_address": "Flat 402, Skyline Residency",\n  "pickup_city": "Mumbai",\n  "pickup_state": "Maharashtra",\n  "pickup_pincode": "400053",\n  "order_items": [\n    {\n      "name": "Boost Engine Heavy Hoodie",\n      "sku": "HOODIE-BLK-L",\n      "units": 1,\n      "selling_price": 1499\n    }\n  ],\n  "sub_total": 1499,\n  "length": 10,\n  "breadth": 15,\n  "height": 5,\n  "weight": 0.5\n}'
            },
            url: {
              raw: "{{shiprocket_base_url}}/orders/create/return",
              host: ["{{shiprocket_base_url}}"],
              path: ["orders", "create", "return"]
            },
            description: "Creates reverse pickup request for returned products."
          }
        }
      ]
    },
    {
      name: "4. Shipments, AWB & Labels",
      description: "Assign courier AWB, schedule pickup, print labels & manifests.",
      item: [
        {
          name: "Generate AWB (Assign Courier)",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "var jsonData = pm.response.json();",
                  "if (jsonData && jsonData.response && jsonData.response.data) {",
                  "    pm.environment.set('shiprocket_awb', jsonData.response.data.awb_code);",
                  "    console.log('Saved AWB: ' + jsonData.response.data.awb_code);",
                  "}"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "shipment_id": {{shipment_id}},\n  "courier_id": ""\n}'
            },
            url: {
              raw: "{{shiprocket_base_url}}/courier/assign/awb",
              host: ["{{shiprocket_base_url}}"],
              path: ["courier", "assign", "awb"]
            },
            description: "Assigns courier and generates AWB tracking number."
          }
        },
        {
          name: "Request Courier Pickup",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "shipment_id": [{{shipment_id}}]\n}'
            },
            url: {
              raw: "{{shiprocket_base_url}}/courier/generate/pickup",
              host: ["{{shiprocket_base_url}}"],
              path: ["courier", "generate", "pickup"]
            },
            description: "Schedules rider pickup at your warehouse."
          }
        },
        {
          name: "Generate Shipping Label",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "shipment_id": [{{shipment_id}}]\n}'
            },
            url: {
              raw: "{{shiprocket_base_url}}/courier/generate/label",
              host: ["{{shiprocket_base_url}}"],
              path: ["courier", "generate", "label"]
            },
            description: "Returns PDF label download URL with barcode for thermal printing."
          }
        },
        {
          name: "Generate Manifest & Print",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "shipment_id": [{{shipment_id}}]\n}'
            },
            url: {
              raw: "{{shiprocket_base_url}}/manifests/generate",
              host: ["{{shiprocket_base_url}}"],
              path: ["manifests", "generate"]
            },
            description: "Generates courier handover manifest document for driver signature."
          }
        },
        {
          name: "Print Tax Invoice",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "ids": [{{shiprocket_order_id}}]\n}'
            },
            url: {
              raw: "{{shiprocket_base_url}}/orders/print/invoice",
              host: ["{{shiprocket_base_url}}"],
              path: ["orders", "print", "invoice"]
            },
            description: "Downloads PDF invoice for customer package."
          }
        }
      ]
    },
    {
      name: "5. Live Tracking API",
      description: "Realtime parcel location, transit updates, and ETA.",
      item: [
        {
          name: "Track by AWB Code",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{shiprocket_base_url}}/courier/track/awb/{{shiprocket_awb}}",
              host: ["{{shiprocket_base_url}}"],
              path: ["courier", "track", "awb", "{{shiprocket_awb}}"]
            },
            description: "Returns complete scan history, current hub, and delivered timestamp."
          }
        },
        {
          name: "Track by Order ID",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{shiprocket_base_url}}/courier/track?order_id={{shiprocket_order_id}}",
              host: ["{{shiprocket_base_url}}"],
              path: ["courier", "track"],
              query: [
                { key: "order_id", value: "{{shiprocket_order_id}}" }
              ]
            },
            description: "Fetches tracking history directly by order ID."
          }
        }
      ]
    },
    {
      name: "6. NDR (Non-Delivery Reports & Escalations)",
      description: "Manage undelivered packages, trigger WhatsApp verification & re-attempts.",
      item: [
        {
          name: "Fetch All NDR Orders",
          request: {
            method: "GET",
            header: [],
            url: {
              raw: "{{shiprocket_base_url}}/ndr/all",
              host: ["{{shiprocket_base_url}}"],
              path: ["ndr", "all"]
            },
            description: "Lists failed delivery attempts (Customer Unavailable, Address Incomplete, COD Refused)."
          }
        },
        {
          name: "Action NDR (Re-attempt Delivery)",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "action": "reattempt",\n  "awb": "{{shiprocket_awb}}",\n  "next_attempt_date": "2026-09-09",\n  "comments": "Customer confirmed availability on phone call"\n}'
            },
            url: {
              raw: "{{shiprocket_base_url}}/ndr/action",
              host: ["{{shiprocket_base_url}}"],
              path: ["ndr", "action"]
            },
            description: "Instructs courier to reattempt package delivery."
          }
        },
        {
          name: "Action NDR (Return to Origin - RTO)",
          request: {
            method: "POST",
            header: [
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "action": "return",\n  "awb": "{{shiprocket_awb}}",\n  "comments": "Customer cancelled order"\n}'
            },
            url: {
              raw: "{{shiprocket_base_url}}/ndr/action",
              host: ["{{shiprocket_base_url}}"],
              path: ["ndr", "action"]
            },
            description: "Instructs courier to return undelivered parcel back to merchant warehouse."
          }
        }
      ]
    },
    {
      name: "7. Webhooks Simulator",
      description: "Ready-to-fire simulated Shiprocket webhook payloads.",
      item: [
        {
          name: "Webhook: shipment.shipped",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "x-api-key", value: "{{shiprocket_webhook_token}}" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "awb": "10928371928",\n  "courier_name": "Delhivery",\n  "current_status": "SHIPPED",\n  "order_id": "ORD_SR_1001",\n  "scans": [\n    {\n      "date": "2026-09-08 20:00:00",\n      "activity": "Picked up from warehouse",\n      "location": "Bhiwandi Hub"\n    }\n  ]\n}'
            },
            url: {
              raw: "{{local_webhook_url}}",
              host: ["{{local_webhook_url}}"]
            },
            description: "Simulates shipment.shipped status update."
          }
        },
        {
          name: "Webhook: shipment.delivered",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" },
              { key: "x-api-key", value: "{{shiprocket_webhook_token}}" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "awb": "10928371928",\n  "courier_name": "Delhivery",\n  "current_status": "DELIVERED",\n  "order_id": "ORD_SR_1001",\n  "delivered_to": "Aman Sharma",\n  "delivered_date": "2026-09-10 14:20:00"\n}'
            },
            url: {
              raw: "{{local_webhook_url}}",
              host: ["{{local_webhook_url}}"]
            },
            description: "Simulates shipment.delivered event."
          }
        }
      ]
    }
  ]
};

// collections/delhivery.collection.json
var delhivery_collection_default = {
  info: {
    _postman_id: "dl123456-3333-4abc-def4-567890123456",
    name: "Delhivery Full Express Logistics API Collection",
    description: "Exhaustive Enterprise Postman Collection for Delhivery Express (Pincode Serviceability, Waybill Management, Single & Bulk Shipment Manifests, Shipping Labels, Warehouse Pickup Requests, Live Tracking, NDR Actions, and Webhooks Simulator).",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  auth: {
    type: "noauth"
  },
  item: [
    {
      name: "1. Serviceability & Rates",
      description: "Check pin code delivery, COD status, and calculate freight rates.",
      item: [
        {
          name: "Check Pincode Serviceability",
          request: {
            method: "GET",
            header: [
              { key: "Authorization", value: "Token {{delhivery_api_token}}" }
            ],
            url: {
              raw: "{{delhivery_base_url}}/c/api/pin-codes/json/?filter_codes={{check_pincode}}",
              host: ["{{delhivery_base_url}}"],
              path: ["c", "api", "pin-codes", "json", ""],
              query: [
                { key: "filter_codes", value: "{{check_pincode}}" }
              ]
            },
            description: "Checks if the pincode is serviceable for Surface/Express and COD."
          }
        },
        {
          name: "Calculate Estimated Shipping Rate",
          request: {
            method: "GET",
            header: [
              { key: "Authorization", value: "Token {{delhivery_api_token}}" }
            ],
            url: {
              raw: "{{delhivery_base_url}}/api/kinko/v1/invoice/charges/.json?md=S&ss=Delivered&d_pin={{check_pincode}}&o_pin=110001&cgm=500&pt=Pre-paid",
              host: ["{{delhivery_base_url}}"],
              path: ["api", "kinko", "v1", "invoice", "charges", ".json"],
              query: [
                { key: "md", value: "S", description: "Mode: S (Surface) or E (Express)" },
                { key: "ss", value: "Delivered" },
                { key: "d_pin", value: "{{check_pincode}}" },
                { key: "o_pin", value: "110001" },
                { key: "cgm", value: "500" },
                { key: "pt", value: "Pre-paid" }
              ]
            },
            description: "Calculates shipping charges based on weight, distance, and payment type."
          }
        }
      ]
    },
    {
      name: "2. Waybill & Shipments API",
      description: "Generate bulk waybills, create manifest shipments, and update orders.",
      item: [
        {
          name: "Fetch Bulk Waybill Numbers",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "var jsonData = pm.response.text();",
                  "if (jsonData) {",
                  `    var firstWbn = jsonData.split(',')[0].replace(/"/g, '').trim();`,
                  "    pm.environment.set('delhivery_waybill', firstWbn);",
                  "    console.log('Saved Delhivery Waybill: ' + firstWbn);",
                  "}"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "GET",
            header: [
              { key: "Authorization", value: "Token {{delhivery_api_token}}" }
            ],
            url: {
              raw: "{{delhivery_base_url}}/waybill/api/bulk/json/?count=5",
              host: ["{{delhivery_base_url}}"],
              path: ["waybill", "api", "bulk", "json", ""],
              query: [
                { key: "count", value: "5" }
              ]
            },
            description: "Fetches a pre-allocated pool of waybill tracking numbers."
          }
        },
        {
          name: "Create Surface / Express Shipment",
          request: {
            method: "POST",
            header: [
              { key: "Authorization", value: "Token {{delhivery_api_token}}" },
              { key: "Content-Type", value: "application/x-www-form-urlencoded" }
            ],
            body: {
              mode: "urlencoded",
              urlencoded: [
                {
                  key: "format",
                  value: "json",
                  type: "text"
                },
                {
                  key: "data",
                  value: '{\n  "shipments": [\n    {\n      "name": "Aman Sharma",\n      "add": "Flat 402, Skyline Residency",\n      "pin": "400053",\n      "city": "Mumbai",\n      "state": "Maharashtra",\n      "country": "India",\n      "phone": "9876543210",\n      "order": "ORD_DEL_{{$timestamp}}",\n      "payment_mode": "Pre-paid",\n      "products_desc": "Boost Apparel",\n      "cod_amount": "0",\n      "order_date": "2026-09-08 18:30:00",\n      "total_amount": "1499",\n      "seller_add": "Warehouse 1, Bhiwandi",\n      "seller_name": "Boost Engine Store",\n      "seller_inv": "INV_9821",\n      "quantity": "1",\n      "waybill": "{{delhivery_waybill}}",\n      "shipment_width": 15,\n      "shipment_height": 5,\n      "weight": 500\n    }\n  ],\n  "pickup_location": {\n    "name": "Primary Warehouse"\n  }\n}',
                  type: "text"
                }
              ]
            },
            url: {
              raw: "{{delhivery_base_url}}/api/cmu/create.json",
              host: ["{{delhivery_base_url}}"],
              path: ["api", "cmu", "create.json"]
            },
            description: "Manifests an order and books parcel pickup with Delhivery Express."
          }
        },
        {
          name: "Edit Shipment Customer Address",
          request: {
            method: "POST",
            header: [
              { key: "Authorization", value: "Token {{delhivery_api_token}}" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "waybill": "{{delhivery_waybill}}",\n  "name": "Aman Sharma",\n  "phone": "9876543210",\n  "add": "Plot 12, Tech Park, Andheri East"\n}'
            },
            url: {
              raw: "{{delhivery_base_url}}/api/p/edit",
              host: ["{{delhivery_base_url}}"],
              path: ["api", "p", "edit"]
            },
            description: "Updates receiver contact or delivery address."
          }
        },
        {
          name: "Cancel Shipment Waybill",
          request: {
            method: "POST",
            header: [
              { key: "Authorization", value: "Token {{delhivery_api_token}}" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "waybill": "{{delhivery_waybill}}",\n  "cancellation": "true"\n}'
            },
            url: {
              raw: "{{delhivery_base_url}}/api/p/edit",
              host: ["{{delhivery_base_url}}"],
              path: ["api", "p", "edit"]
            },
            description: "Cancels a booked waybill."
          }
        }
      ]
    },
    {
      name: "3. Warehouse & Pickup Request",
      description: "Schedule rider warehouse pickup.",
      item: [
        {
          name: "Create Warehouse Pickup Request",
          request: {
            method: "POST",
            header: [
              { key: "Authorization", value: "Token {{delhivery_api_token}}" },
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "pickup_time": "14:00:00",\n  "pickup_date": "2026-09-09",\n  "pickup_location": "Primary Warehouse",\n  "expected_package_count": 10\n}'
            },
            url: {
              raw: "{{delhivery_base_url}}/fm/request/new/",
              host: ["{{delhivery_base_url}}"],
              path: ["fm", "request", "new", ""]
            },
            description: "Requests Delhivery pickup van at your warehouse location."
          }
        }
      ]
    },
    {
      name: "4. Shipping Label & Barcodes",
      description: "Generate thermal shipping slips.",
      item: [
        {
          name: "Download Shipping Label (PDF / Barcode)",
          request: {
            method: "GET",
            header: [
              { key: "Authorization", value: "Token {{delhivery_api_token}}" }
            ],
            url: {
              raw: "{{delhivery_base_url}}/api/p/packing_slip?wbns={{delhivery_waybill}}&pdf=true",
              host: ["{{delhivery_base_url}}"],
              path: ["api", "p", "packing_slip"],
              query: [
                { key: "wbns", value: "{{delhivery_waybill}}" },
                { key: "pdf", value: "true" }
              ]
            },
            description: "Downloads PDF shipping label with courier routing code and barcode."
          }
        }
      ]
    },
    {
      name: "5. Live Tracking API",
      description: "Realtime parcel scan checkpoints and delivery confirmations.",
      item: [
        {
          name: "Live Track by Waybill",
          request: {
            method: "GET",
            header: [
              { key: "Authorization", value: "Token {{delhivery_api_token}}" }
            ],
            url: {
              raw: "{{delhivery_base_url}}/api/v1/packages/json/?waybill={{delhivery_waybill}}",
              host: ["{{delhivery_base_url}}"],
              path: ["api", "v1", "packages", "json", ""],
              query: [
                { key: "waybill", value: "{{delhivery_waybill}}" }
              ]
            },
            description: "Returns full transit scans, current hub, and delivery status."
          }
        }
      ]
    },
    {
      name: "6. Webhooks Simulator",
      description: "Simulated Delhivery push event notifications.",
      item: [
        {
          name: "Webhook: In-Transit Status",
          request: {
            method: "POST",
            header: [
              { key: "Content-Type", value: "application/json" }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "Shipment": {\n    "AWB": "128371928371",\n    "Status": {\n      "Status": "In Transit",\n      "StatusDateTime": "2026-09-08T22:00:00+05:30",\n      "StatusType": "UD",\n      "Instructions": "Package arrived at Mumbai Central Sort Center"\n    }\n  }\n}'
            },
            url: {
              raw: "{{local_webhook_url}}",
              host: ["{{local_webhook_url}}"]
            },
            description: "Simulates Delhivery push tracking event."
          }
        }
      ]
    }
  ]
};

// collections/shopify.collection.json
var shopify_collection_default = {
  info: {
    _postman_id: "sp123456-4444-4abc-def5-678901234567",
    name: "Shopify Full Admin REST API Collection (2024-07)",
    description: "Exhaustive Production Postman Collection for Shopify Admin REST API 2024-07 (Products, Variants, Orders, Fulfillments, Customers, Inventory Levels, Webhooks). Includes auto-chaining IDs.",
    schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  auth: {
    type: "noauth"
  },
  item: [
    {
      name: "1. Products & Variants",
      description: "Manage catalog products, variants, images, and prices.",
      item: [
        {
          name: "Fetch Products List",
          request: {
            method: "GET",
            header: [
              {
                key: "X-Shopify-Access-Token",
                value: "{{shopify_access_token}}"
              }
            ],
            url: {
              raw: "https://{{shopify_store_domain}}.myshopify.com/admin/api/2024-07/products.json?limit=20",
              protocol: "https",
              host: ["{{shopify_store_domain}}", "myshopify", "com"],
              path: ["admin", "api", "2024-07", "products.json"],
              query: [
                {
                  key: "limit",
                  value: "20"
                }
              ]
            },
            description: "Lists store products."
          }
        },
        {
          name: "Create Product",
          event: [
            {
              listen: "test",
              script: {
                exec: [
                  "var jsonData = pm.response.json();",
                  "if (jsonData && jsonData.product && jsonData.product.id) {",
                  "    pm.environment.set('shopify_product_id', jsonData.product.id);",
                  "    if (jsonData.product.variants && jsonData.product.variants[0]) {",
                  "        pm.environment.set('shopify_variant_id', jsonData.product.variants[0].id);",
                  "        pm.environment.set('shopify_inventory_item_id', jsonData.product.variants[0].inventory_item_id);",
                  "    }",
                  "}"
                ],
                type: "text/javascript"
              }
            }
          ],
          request: {
            method: "POST",
            header: [
              {
                key: "X-Shopify-Access-Token",
                value: "{{shopify_access_token}}"
              },
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "product": {\n    "title": "Boost Engine Oversized Tee",\n    "body_html": "<strong>240 GSM Luxury Heavyweight Cotton</strong>",\n    "vendor": "Boost Engine",\n    "product_type": "Apparel",\n    "tags": "anime, oversized, luxury",\n    "variants": [\n      {\n        "option1": "Large",\n        "price": "999.00",\n        "sku": "TEE-BOOST-L",\n        "inventory_management": "shopify"\n      }\n    ]\n  }\n}'
            },
            url: {
              raw: "https://{{shopify_store_domain}}.myshopify.com/admin/api/2024-07/products.json",
              protocol: "https",
              host: ["{{shopify_store_domain}}", "myshopify", "com"],
              path: ["admin", "api", "2024-07", "products.json"]
            },
            description: "Creates product and auto-saves product ID, variant ID, and inventory item ID in environment."
          }
        },
        {
          name: "Get Product by ID",
          request: {
            method: "GET",
            header: [
              {
                key: "X-Shopify-Access-Token",
                value: "{{shopify_access_token}}"
              }
            ],
            url: {
              raw: "https://{{shopify_store_domain}}.myshopify.com/admin/api/2024-07/products/{{shopify_product_id}}.json",
              protocol: "https",
              host: ["{{shopify_store_domain}}", "myshopify", "com"],
              path: ["admin", "api", "2024-07", "products", "{{shopify_product_id}}.json"]
            },
            description: "Fetches a specific product entity."
          }
        },
        {
          name: "Update Variant Price",
          request: {
            method: "PUT",
            header: [
              {
                key: "X-Shopify-Access-Token",
                value: "{{shopify_access_token}}"
              },
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "variant": {\n    "id": {{shopify_variant_id}},\n    "price": "899.00",\n    "compare_at_price": "1499.00"\n  }\n}'
            },
            url: {
              raw: "https://{{shopify_store_domain}}.myshopify.com/admin/api/2024-07/variants/{{shopify_variant_id}}.json",
              protocol: "https",
              host: ["{{shopify_store_domain}}", "myshopify", "com"],
              path: ["admin", "api", "2024-07", "variants", "{{shopify_variant_id}}.json"]
            },
            description: "Updates variant price and strikethrough compare-at price."
          }
        }
      ]
    },
    {
      name: "2. Orders & Fulfillments",
      description: "Fetch orders, create manual orders, and manage fulfillments.",
      item: [
        {
          name: "Fetch Orders List",
          request: {
            method: "GET",
            header: [
              {
                key: "X-Shopify-Access-Token",
                value: "{{shopify_access_token}}"
              }
            ],
            url: {
              raw: "https://{{shopify_store_domain}}.myshopify.com/admin/api/2024-07/orders.json?status=any&limit=20",
              protocol: "https",
              host: ["{{shopify_store_domain}}", "myshopify", "com"],
              path: ["admin", "api", "2024-07", "orders.json"],
              query: [
                {
                  key: "status",
                  value: "any"
                },
                {
                  key: "limit",
                  value: "20"
                }
              ]
            },
            description: "Lists store orders."
          }
        },
        {
          name: "Get Order Details",
          request: {
            method: "GET",
            header: [
              {
                key: "X-Shopify-Access-Token",
                value: "{{shopify_access_token}}"
              }
            ],
            url: {
              raw: "https://{{shopify_store_domain}}.myshopify.com/admin/api/2024-07/orders/{{shopify_order_id}}.json",
              protocol: "https",
              host: ["{{shopify_store_domain}}", "myshopify", "com"],
              path: ["admin", "api", "2024-07", "orders", "{{shopify_order_id}}.json"]
            },
            description: "Fetches line items, shipping address, and payment gateway details."
          }
        },
        {
          name: "Cancel Order",
          request: {
            method: "POST",
            header: [
              {
                key: "X-Shopify-Access-Token",
                value: "{{shopify_access_token}}"
              },
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "reason": "customer",\n  "email": true,\n  "restock": true\n}'
            },
            url: {
              raw: "https://{{shopify_store_domain}}.myshopify.com/admin/api/2024-07/orders/{{shopify_order_id}}/cancel.json",
              protocol: "https",
              host: ["{{shopify_store_domain}}", "myshopify", "com"],
              path: ["admin", "api", "2024-07", "orders", "{{shopify_order_id}}", "cancel.json"]
            },
            description: "Cancels order and optionally restocks inventory."
          }
        }
      ]
    },
    {
      name: "3. Customers API",
      description: "Search and manage customer profiles.",
      item: [
        {
          name: "Search Customer by Email",
          request: {
            method: "GET",
            header: [
              {
                key: "X-Shopify-Access-Token",
                value: "{{shopify_access_token}}"
              }
            ],
            url: {
              raw: "https://{{shopify_store_domain}}.myshopify.com/admin/api/2024-07/customers/search.json?query=email:aman@example.com",
              protocol: "https",
              host: ["{{shopify_store_domain}}", "myshopify", "com"],
              path: ["admin", "api", "2024-07", "customers", "search.json"],
              query: [
                {
                  key: "query",
                  value: "email:aman@example.com"
                }
              ]
            },
            description: "Searches for an existing customer profile."
          }
        }
      ]
    },
    {
      name: "4. Inventory & Locations",
      description: "Sync multi-location inventory levels.",
      item: [
        {
          name: "List Store Locations",
          request: {
            method: "GET",
            header: [
              {
                key: "X-Shopify-Access-Token",
                value: "{{shopify_access_token}}"
              }
            ],
            url: {
              raw: "https://{{shopify_store_domain}}.myshopify.com/admin/api/2024-07/locations.json",
              protocol: "https",
              host: ["{{shopify_store_domain}}", "myshopify", "com"],
              path: ["admin", "api", "2024-07", "locations.json"]
            },
            description: "Retrieves warehouse locations."
          }
        },
        {
          name: "Set Inventory Level",
          request: {
            method: "POST",
            header: [
              {
                key: "X-Shopify-Access-Token",
                value: "{{shopify_access_token}}"
              },
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "location_id": {{shopify_location_id}},\n  "inventory_item_id": {{shopify_inventory_item_id}},\n  "available": 100\n}'
            },
            url: {
              raw: "https://{{shopify_store_domain}}.myshopify.com/admin/api/2024-07/inventory_levels/set.json",
              protocol: "https",
              host: ["{{shopify_store_domain}}", "myshopify", "com"],
              path: ["admin", "api", "2024-07", "inventory_levels", "set.json"]
            },
            description: "Updates live available stock count."
          }
        }
      ]
    },
    {
      name: "5. Webhooks API",
      description: "Register and manage Shopify real-time webhooks.",
      item: [
        {
          name: "List Registered Webhooks",
          request: {
            method: "GET",
            header: [
              {
                key: "X-Shopify-Access-Token",
                value: "{{shopify_access_token}}"
              }
            ],
            url: {
              raw: "https://{{shopify_store_domain}}.myshopify.com/admin/api/2024-07/webhooks.json",
              protocol: "https",
              host: ["{{shopify_store_domain}}", "myshopify", "com"],
              path: ["admin", "api", "2024-07", "webhooks.json"]
            },
            description: "Lists active webhooks."
          }
        },
        {
          name: "Register Order Paid Webhook",
          request: {
            method: "POST",
            header: [
              {
                key: "X-Shopify-Access-Token",
                value: "{{shopify_access_token}}"
              },
              {
                key: "Content-Type",
                value: "application/json"
              }
            ],
            body: {
              mode: "raw",
              raw: '{\n  "webhook": {\n    "topic": "orders/paid",\n    "address": "https://yourstore.com/api/webhooks/shopify",\n    "format": "json"\n  }\n}'
            },
            url: {
              raw: "https://{{shopify_store_domain}}.myshopify.com/admin/api/2024-07/webhooks.json",
              protocol: "https",
              host: ["{{shopify_store_domain}}", "myshopify", "com"],
              path: ["admin", "api", "2024-07", "webhooks.json"]
            },
            description: "Subscribes endpoint to orders/paid notifications."
          }
        }
      ]
    }
  ]
};

// environments/razorpay.env.json
var razorpay_env_default = {
  id: "razorpay-environment-template",
  name: "Razorpay Environment (Boost Engine)",
  values: [
    {
      key: "razorpay_base_url",
      value: "https://api.razorpay.com",
      type: "default",
      enabled: true
    },
    {
      key: "razorpay_key_id",
      value: "rzp_test_YOUR_KEY_HERE",
      type: "secret",
      enabled: true
    },
    {
      key: "razorpay_key_secret",
      value: "YOUR_KEY_SECRET_HERE",
      type: "secret",
      enabled: true
    },
    {
      key: "order_id",
      value: "order_test_001",
      type: "default",
      enabled: true
    },
    {
      key: "payment_id",
      value: "pay_test_001",
      type: "default",
      enabled: true
    },
    {
      key: "payment_link_id",
      value: "plink_test_001",
      type: "default",
      enabled: true
    },
    {
      key: "customer_id",
      value: "cust_test_001",
      type: "default",
      enabled: true
    },
    {
      key: "refund_id",
      value: "rfnd_test_001",
      type: "default",
      enabled: true
    },
    {
      key: "local_webhook_url",
      value: "http://localhost:3000/api/webhooks/razorpay",
      type: "default",
      enabled: true
    },
    {
      key: "computed_webhook_signature",
      value: "sample_hmac_signature_hex",
      type: "default",
      enabled: true
    }
  ],
  _postman_variable_scope: "environment"
};

// environments/cashfree.env.json
var cashfree_env_default = {
  id: "cashfree-environment-template",
  name: "Cashfree Environment (Boost Engine)",
  values: [
    {
      key: "cashfree_base_url",
      value: "https://sandbox.cashfree.com/pg",
      type: "default",
      enabled: true
    },
    {
      key: "cashfree_app_id",
      value: "YOUR_CASHFREE_APP_ID",
      type: "secret",
      enabled: true
    },
    {
      key: "cashfree_secret_key",
      value: "YOUR_CASHFREE_SECRET_KEY",
      type: "secret",
      enabled: true
    },
    {
      key: "cashfree_order_id",
      value: "order_cf_001",
      type: "default",
      enabled: true
    },
    {
      key: "payment_session_id",
      value: "session_sample_token",
      type: "default",
      enabled: true
    },
    {
      key: "cf_payment_id",
      value: "109283719",
      type: "default",
      enabled: true
    },
    {
      key: "cashfree_link_id",
      value: "link_cf_001",
      type: "default",
      enabled: true
    },
    {
      key: "cashfree_refund_id",
      value: "rfnd_cf_001",
      type: "default",
      enabled: true
    },
    {
      key: "local_webhook_url",
      value: "http://localhost:3000/api/webhooks/cashfree",
      type: "default",
      enabled: true
    },
    {
      key: "computed_webhook_signature",
      value: "sample_signature",
      type: "default",
      enabled: true
    }
  ],
  _postman_variable_scope: "environment"
};

// environments/phonepe.env.json
var phonepe_env_default = {
  id: "phonepe-environment-template",
  name: "PhonePe Environment (Boost Engine)",
  values: [
    {
      key: "phonepe_base_url",
      value: "https://api-preprod.phonepe.com/apis/pg-sandbox",
      type: "default",
      enabled: true
    },
    {
      key: "phonepe_merchant_id",
      value: "PGTESTPAYUAT",
      type: "default",
      enabled: true
    },
    {
      key: "phonepe_salt_key",
      value: "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399",
      type: "secret",
      enabled: true
    },
    {
      key: "phonepe_salt_index",
      value: "1",
      type: "default",
      enabled: true
    },
    {
      key: "merchant_transaction_id",
      value: "TXN_BOOST_001",
      type: "default",
      enabled: true
    },
    {
      key: "phonepe_refund_id",
      value: "RFND_BOOST_001",
      type: "default",
      enabled: true
    },
    {
      key: "phonepe_x_verify",
      value: "computed_sha256_hash###1",
      type: "default",
      enabled: true
    },
    {
      key: "phonepe_status_x_verify",
      value: "computed_status_sha256_hash###1",
      type: "default",
      enabled: true
    },
    {
      key: "phonepe_refund_status_x_verify",
      value: "computed_refund_status_hash###1",
      type: "default",
      enabled: true
    },
    {
      key: "phonepe_base64_payload",
      value: "ewogICJtZXJjaGFudElkIjogIlBHVEVTVFBBWVVBVCIsCiAgIm1lcmNoYW50VHJhbnNhY3Rpb25JZCI6ICJUWE5fQk9PU1RfMDAxIiwKICAiYW1vdW50IjogOTk5MDAsCiAgInJlZGlyZWN0VXJsIjogImh0dHBzOi8veW91cnN0b3JlLmNvbS9vcmRlci1jb25maXJtZWQiLAogICJyZWRpcmVjdE1vZGUiOiAiUE9TVCIKfQ==",
      type: "default",
      enabled: true
    },
    {
      key: "phonepe_qr_base64_payload",
      value: "ewogICJtZXJjaGFudElkIjogIlBHVEVTVFBBWVVBVCIsCiAgIm1lcmNoYW50VHJhbnNhY3Rpb25JZCI6ICJUWE5fUVJfMDAxIiwKICAiYW1vdW50IjogOTk5MDAsCiAgInBheW1lbnRJbnN0cnVtZW50IjogewogICAgInR5cGUiOiAiVVBJX1FSIgogIH0KfQ==",
      type: "default",
      enabled: true
    },
    {
      key: "phonepe_refund_base64_payload",
      value: "ewogICJtZXJjaGFudElkIjogIlBHVEVTVFBBWVVBVCIsCiAgIm1lcmNoYW50VHJhbnNhY3Rpb25JZCI6ICJUWE5fQk9PU1RfMDAxIiwKICAib3JpZ2luYWxUcmFuc2FjdGlvbklkIjogIlQyMjA5MDgyMDAwMDAwMDAiLAogICJhbW91bnQiOiA5OTkwMCwKICAiY2FsbGJhY2tVcmwiOiAiaHR0cHM6Ly95b3Vyc3RvcmUuY29tL2FwaS93ZWJob29rcy9waG9uZXBlIgp9",
      type: "default",
      enabled: true
    },
    {
      key: "local_webhook_url",
      value: "http://localhost:3000/api/webhooks/phonepe",
      type: "default",
      enabled: true
    }
  ],
  _postman_variable_scope: "environment"
};

// environments/paytm.env.json
var paytm_env_default = {
  id: "env-paytm-001",
  name: "Paytm PG Environment",
  values: [
    {
      key: "paytm_base_url",
      value: "https://securegw-stage.paytm.in",
      type: "default",
      enabled: true
    },
    {
      key: "paytm_mid",
      value: "YOUR_PAYTM_STAGE_MID",
      type: "default",
      enabled: true
    },
    {
      key: "paytm_merchant_key",
      value: "YOUR_PAYTM_STAGE_MERCHANT_KEY",
      type: "secret",
      enabled: true
    },
    {
      key: "paytm_checksum",
      value: "SAMPLE_GENERATED_CHECKSUM",
      type: "default",
      enabled: true
    },
    {
      key: "paytm_order_id",
      value: "ORDER_PTM_001",
      type: "default",
      enabled: true
    },
    {
      key: "paytm_txn_id",
      value: "20260908111212800110168928300103721",
      type: "default",
      enabled: true
    },
    {
      key: "local_webhook_url",
      value: "http://localhost:3000/api/webhooks/paytm",
      type: "default",
      enabled: true
    }
  ],
  _postman_variable_scope: "environment"
};

// environments/stripe.env.json
var stripe_env_default = {
  id: "stripe-environment-template",
  name: "Stripe Environment (Boost Engine)",
  values: [
    {
      key: "stripe_base_url",
      value: "https://api.stripe.com/v1",
      type: "default",
      enabled: true
    },
    {
      key: "stripe_secret_key",
      value: "sk_test_YOUR_STRIPE_SECRET_KEY",
      type: "secret",
      enabled: true
    },
    {
      key: "stripe_session_id",
      value: "cs_test_sample_session",
      type: "default",
      enabled: true
    },
    {
      key: "stripe_payment_intent_id",
      value: "pi_test_sample_intent",
      type: "default",
      enabled: true
    }
  ],
  _postman_variable_scope: "environment"
};

// environments/easyecom.env.json
var easyecom_env_default = {
  id: "easyecom-environment-template",
  name: "EasyEcom Environment (Boost Engine)",
  values: [
    {
      key: "easyecom_base_url",
      value: "https://api.easyecom.com",
      type: "default",
      enabled: true
    },
    {
      key: "easyecom_api_token",
      value: "YOUR_EASYECOM_API_TOKEN_HERE",
      type: "secret",
      enabled: true
    },
    {
      key: "warehouse_id",
      value: "WH_PRIMARY_01",
      type: "default",
      enabled: true
    },
    {
      key: "sku",
      value: "TEE-ANIME-BLK-L",
      type: "default",
      enabled: true
    }
  ],
  _postman_variable_scope: "environment"
};

// environments/shiprocket.env.json
var shiprocket_env_default = {
  id: "shiprocket-environment-template",
  name: "Shiprocket Environment (Boost Engine)",
  values: [
    {
      key: "shiprocket_base_url",
      value: "https://apiv2.shiprocket.in/v1/external",
      type: "default",
      enabled: true
    },
    {
      key: "shiprocket_email",
      value: "YOUR_SHIPROCKET_EMAIL",
      type: "default",
      enabled: true
    },
    {
      key: "shiprocket_password",
      value: "YOUR_SHIPROCKET_PASSWORD",
      type: "secret",
      enabled: true
    },
    {
      key: "shiprocket_token",
      value: "YOUR_BEARER_JWT_TOKEN",
      type: "secret",
      enabled: true
    },
    {
      key: "pickup_pincode",
      value: "110001",
      type: "default",
      enabled: true
    },
    {
      key: "delivery_pincode",
      value: "400053",
      type: "default",
      enabled: true
    },
    {
      key: "shiprocket_shipment_id",
      value: "1001",
      type: "default",
      enabled: true
    },
    {
      key: "shiprocket_courier_id",
      value: "1",
      type: "default",
      enabled: true
    },
    {
      key: "awb_code",
      value: "7821928312",
      type: "default",
      enabled: true
    }
  ],
  _postman_variable_scope: "environment"
};

// environments/delhivery.env.json
var delhivery_env_default = {
  id: "delhivery-environment-template",
  name: "Delhivery Environment (Boost Engine)",
  values: [
    {
      key: "delhivery_base_url",
      value: "https://stage-express.delhivery.com",
      type: "default",
      enabled: true
    },
    {
      key: "delhivery_api_token",
      value: "YOUR_DELHIVERY_API_TOKEN",
      type: "secret",
      enabled: true
    },
    {
      key: "check_pincode",
      value: "400053",
      type: "default",
      enabled: true
    },
    {
      key: "delhivery_waybill",
      value: "129837192831",
      type: "default",
      enabled: true
    }
  ],
  _postman_variable_scope: "environment"
};

// environments/shopify.env.json
var shopify_env_default = {
  id: "shopify-environment-template",
  name: "Shopify Environment (Boost Engine)",
  values: [
    {
      key: "shopify_store_domain",
      value: "your-store-name",
      type: "default",
      enabled: true
    },
    {
      key: "shopify_access_token",
      value: "shpat_YOUR_ADMIN_API_ACCESS_TOKEN",
      type: "secret",
      enabled: true
    },
    {
      key: "shopify_location_id",
      value: "123456789",
      type: "default",
      enabled: true
    },
    {
      key: "shopify_inventory_item_id",
      value: "987654321",
      type: "default",
      enabled: true
    }
  ],
  _postman_variable_scope: "environment"
};

// src/index.ts
var razorpayCollection = razorpay_collection_default;
var cashfreeCollection = cashfree_collection_default;
var phonepeCollection = phonepe_collection_default;
var paytmCollection = paytm_collection_default;
var stripeCollection = stripe_collection_default;
var easyecomCollection = easyecom_collection_default;
var shiprocketCollection = shiprocket_collection_default;
var delhiveryCollection = delhivery_collection_default;
var shopifyCollection = shopify_collection_default;
var razorpayEnvironment = razorpay_env_default;
var cashfreeEnvironment = cashfree_env_default;
var phonepeEnvironment = phonepe_env_default;
var paytmEnvironment = paytm_env_default;
var stripeEnvironment = stripe_env_default;
var easyecomEnvironment = easyecom_env_default;
var shiprocketEnvironment = shiprocket_env_default;
var delhiveryEnvironment = delhivery_env_default;
var shopifyEnvironment = shopify_env_default;
var COLLECTION_NAMES = [
  "razorpay",
  "cashfree",
  "phonepe",
  "paytm",
  "stripe",
  "easyecom",
  "shiprocket",
  "delhivery",
  "shopify"
];
var CATEGORIES = {
  razorpay: ["payments"],
  cashfree: ["payments"],
  phonepe: ["payments"],
  paytm: ["payments"],
  stripe: ["payments"],
  easyecom: ["wms"],
  shiprocket: ["logistics"],
  delhivery: ["logistics"],
  shopify: ["platform"]
};
var AUTH_SCHEMES = {
  razorpay: "basic",
  cashfree: "apikey",
  phonepe: "hmac",
  paytm: "hmac",
  stripe: "bearer",
  easyecom: "bearer",
  shiprocket: "bearer",
  delhivery: "apikey",
  shopify: "apikey"
};
var registry = {
  razorpay: {
    collection: razorpayCollection,
    environment: razorpayEnvironment,
    provider: "Razorpay Payments",
    docsUrl: "https://razorpay.com/docs/api",
    categories: CATEGORIES.razorpay,
    authScheme: AUTH_SCHEMES.razorpay
  },
  cashfree: {
    collection: cashfreeCollection,
    environment: cashfreeEnvironment,
    provider: "Cashfree Payments",
    docsUrl: "https://docs.cashfree.com/reference",
    categories: CATEGORIES.cashfree,
    authScheme: AUTH_SCHEMES.cashfree
  },
  phonepe: {
    collection: phonepeCollection,
    environment: phonepeEnvironment,
    provider: "PhonePe PG",
    docsUrl: "https://developer.phonepe.com/v1/reference",
    categories: CATEGORIES.phonepe,
    authScheme: AUTH_SCHEMES.phonepe
  },
  paytm: {
    collection: paytmCollection,
    environment: paytmEnvironment,
    provider: "Paytm Payment Gateway",
    docsUrl: "https://developer.paytm.com/docs/api",
    categories: CATEGORIES.paytm,
    authScheme: AUTH_SCHEMES.paytm
  },
  stripe: {
    collection: stripeCollection,
    environment: stripeEnvironment,
    provider: "Stripe Global",
    docsUrl: "https://stripe.com/docs/api",
    categories: CATEGORIES.stripe,
    authScheme: AUTH_SCHEMES.stripe
  },
  easyecom: {
    collection: easyecomCollection,
    environment: easyecomEnvironment,
    provider: "EasyEcom WMS & ERP",
    docsUrl: "https://api.easyecom.com/documentation",
    categories: CATEGORIES.easyecom,
    authScheme: AUTH_SCHEMES.easyecom
  },
  shiprocket: {
    collection: shiprocketCollection,
    environment: shiprocketEnvironment,
    provider: "Shiprocket Logistics",
    docsUrl: "https://apidocs.shiprocket.in",
    categories: CATEGORIES.shiprocket,
    authScheme: AUTH_SCHEMES.shiprocket
  },
  delhivery: {
    collection: delhiveryCollection,
    environment: delhiveryEnvironment,
    provider: "Delhivery Express",
    docsUrl: "https://delhivery.com/developer",
    categories: CATEGORIES.delhivery,
    authScheme: AUTH_SCHEMES.delhivery
  },
  shopify: {
    collection: shopifyCollection,
    environment: shopifyEnvironment,
    provider: "Shopify Admin REST",
    docsUrl: "https://shopify.dev/docs/api/admin-rest",
    categories: CATEGORIES.shopify,
    authScheme: AUTH_SCHEMES.shopify
  }
};
function getRegistryEntry(name) {
  const entry = registry[name];
  if (!entry) {
    throw new Error(`Provider "${name}" not found. Available: ${Object.keys(registry).join(", ")}`);
  }
  return entry;
}
function getAuthScheme(name) {
  return getRegistryEntry(name).authScheme;
}
function getCollectionAuth(name) {
  return getRegistryEntry(name).collection.auth;
}
function slugify2(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
}
function joinPath2(req) {
  if (req.url.path && req.url.path.length) {
    const p = req.url.path.join("/");
    return "/" + p.replace(/^\/+/, "");
  }
  const raw = req.url.raw || "";
  const match = raw.match(/^https?:\/\/[^/]+(\/.*)$/);
  return match ? match[1] : "/";
}
function flattenCollection(provider, collection) {
  const entry = registry[provider];
  const result = [];
  const walk = (items, folder) => {
    for (const item of items || []) {
      if (item.item && item.item.length) {
        walk(item.item, item.name);
        continue;
      }
      if (!item.request) continue;
      const req = item.request;
      result.push({
        id: `${provider}:${slugify2(folder)}:${slugify2(item.name)}`,
        name: item.name,
        method: (req.method || "GET").toUpperCase(),
        path: joinPath2(req),
        rawUrl: req.url.raw || "",
        description: req.description || item.description || "",
        provider,
        providerName: entry.provider,
        folder,
        tag: folder,
        headers: req.header || [],
        body: req.body,
        query: req.url.query || [],
        auth: collection.auth,
        authScheme: entry.authScheme
      });
    }
  };
  walk(collection.item || [], "");
  return result;
}
function listCollections() {
  return COLLECTION_NAMES.map((key) => {
    const entry = registry[key];
    const folders = entry.collection.item.map((item) => item.name);
    let requestCount = 0;
    for (const folder of entry.collection.item) {
      if (folder.item) requestCount += folder.item.length;
      else if (folder.request) requestCount += 1;
    }
    return {
      id: key,
      name: entry.collection.info.name,
      provider: entry.provider,
      requestCount,
      folders,
      categories: entry.categories,
      authScheme: entry.authScheme,
      docsUrl: entry.docsUrl
    };
  });
}
function getCollection(name) {
  return getRegistryEntry(name).collection;
}
function getEnvironment(name) {
  return getRegistryEntry(name).environment;
}
function getAllEndpoints() {
  return COLLECTION_NAMES.reduce(
    (acc, key) => acc.concat(flattenCollection(key, registry[key].collection)),
    []
  );
}
function findEndpoints(query = {}) {
  let endpoints = [];
  for (const key of COLLECTION_NAMES) {
    if (query.provider && query.provider !== key) continue;
    endpoints = endpoints.concat(flattenCollection(key, registry[key].collection));
  }
  if (query.method) {
    const m = query.method.toUpperCase();
    endpoints = endpoints.filter((e) => e.method === m);
  }
  if (query.path) {
    const p = query.path.toLowerCase();
    endpoints = endpoints.filter(
      (e) => e.path.toLowerCase().includes(p) || e.rawUrl.toLowerCase().includes(p)
    );
  }
  if (query.tag) {
    const t = query.tag.toLowerCase();
    endpoints = endpoints.filter(
      (e) => e.tag.toLowerCase().includes(t) || e.folder.toLowerCase().includes(t)
    );
  }
  return endpoints;
}
function mockValue(key, sample) {
  if (typeof sample === "number") return sample;
  if (typeof sample === "boolean") return sample;
  if (Array.isArray(sample)) return [];
  if (sample && typeof sample === "object") return {};
  return `${key}_sample`;
}
function generateMockResponse(endpoint, statusCode = 200) {
  const method = endpoint.method || "GET";
  if (statusCode >= 400) {
    return {
      error: {
        code: `ERR_${statusCode}`,
        message: `Mock ${statusCode} error for ${endpoint.name}`,
        status: statusCode
      }
    };
  }
  const { json } = parseRawBody(endpoint.body);
  const data = {};
  if (json && typeof json === "object" && !Array.isArray(json)) {
    for (const k of Object.keys(json)) data[k] = mockValue(k, json[k]);
  }
  if (method === "GET") {
    return { entity: endpoint.name, count: 0, items: [], ...data };
  }
  if (method === "DELETE") {
    return { deleted: true, id: `${endpoint.id}_mock` };
  }
  data.id = `${endpoint.id}_${Math.floor(Math.random() * 9e4 + 1e4)}`;
  data.created_at = Math.floor(Date.now() / 1e3);
  return data;
}
function mockStatusFor(endpoint) {
  const m = endpoint.method;
  if (m === "POST") return 201;
  if (m === "DELETE") return 204;
  return 200;
}
function extractBaseUrl(environment) {
  const baseVar = (environment.values || []).find((v) => /base_url$/i.test(v.key));
  return baseVar ? baseVar.value : void 0;
}
function exportToOpenAPI(name, options) {
  const entry = getRegistryEntry(name);
  return convertToOpenAPI(entry.collection, { environment: entry.environment, ...options });
}
function exportToBruno(name) {
  const entry = getRegistryEntry(name);
  return convertToBruno(entry.collection, { baseUrl: extractBaseUrl(entry.environment) });
}
function exportToDirectory(name, targetDir = process.cwd(), format = "postman") {
  if (!fs__default.default.existsSync(targetDir)) fs__default.default.mkdirSync(targetDir, { recursive: true });
  const targets = name === "all" ? [...COLLECTION_NAMES] : [name];
  const exported = [];
  for (const item of targets) {
    const entry = registry[item];
    if (!entry) continue;
    if (format === "openapi") {
      const spec = exportToOpenAPI(item);
      const file = path__default.default.join(targetDir, `${item}.openapi.json`);
      fs__default.default.writeFileSync(file, JSON.stringify(spec, null, 2), "utf8");
      exported.push(file);
    } else if (format === "bruno") {
      const bruno = exportToBruno(item);
      const dir = path__default.default.join(targetDir, `${item}.bruno`);
      fs__default.default.mkdirSync(dir, { recursive: true });
      const manifest = path__default.default.join(dir, "bruno.json");
      fs__default.default.writeFileSync(manifest, JSON.stringify(bruno.brunoJson, null, 2), "utf8");
      exported.push(manifest);
      for (const r of bruno.requests) {
        const file = path__default.default.join(dir, r.file);
        fs__default.default.mkdirSync(path__default.default.dirname(file), { recursive: true });
        fs__default.default.writeFileSync(file, r.content, "utf8");
        exported.push(file);
      }
    } else {
      const colFile = path__default.default.join(targetDir, `${item}.collection.json`);
      const envFile = path__default.default.join(targetDir, `${item}.env.json`);
      fs__default.default.writeFileSync(colFile, JSON.stringify(entry.collection, null, 2), "utf8");
      fs__default.default.writeFileSync(envFile, JSON.stringify(entry.environment, null, 2), "utf8");
      exported.push(colFile, envFile);
    }
  }
  return exported;
}
async function runCollection(name, options = {}) {
  const entry = getRegistryEntry(name);
  const endpoints = flattenCollection(name, entry.collection);
  const vars = { ...environmentToVariables(entry.environment), ...options.env || {} };
  if (options.baseUrl) {
    const baseKey = Object.keys(vars).find((k) => /base_url$/i.test(k));
    if (baseKey) vars[baseKey] = options.baseUrl;
    else vars.base_url = options.baseUrl;
  }
  const results = [];
  const total = endpoints.length;
  for (let i = 0; i < total; i++) {
    const endpoint = endpoints[i];
    options.onProgress?.({ index: i, total, endpoint });
    const url = resolveVariables(endpoint.rawUrl || endpoint.path, vars);
    const status = options.dryRun ? 200 : mockStatusFor(endpoint);
    const mockResponse = generateMockResponse(endpoint, status);
    results.push({
      provider: name,
      endpoint,
      method: endpoint.method,
      url,
      status,
      mockResponse,
      dryRun: !!options.dryRun
    });
  }
  return results;
}

exports.COLLECTION_NAMES = COLLECTION_NAMES;
exports.cashfreeCollection = cashfreeCollection;
exports.cashfreeEnvironment = cashfreeEnvironment;
exports.convertToBruno = convertToBruno;
exports.convertToOpenAPI = convertToOpenAPI;
exports.delhiveryCollection = delhiveryCollection;
exports.delhiveryEnvironment = delhiveryEnvironment;
exports.easyecomCollection = easyecomCollection;
exports.easyecomEnvironment = easyecomEnvironment;
exports.environmentToVariables = environmentToVariables;
exports.exportToBruno = exportToBruno;
exports.exportToDirectory = exportToDirectory;
exports.exportToOpenAPI = exportToOpenAPI;
exports.findEndpoints = findEndpoints;
exports.generateCodeSnippet = generateCodeSnippet;
exports.generateCurl = generateCurl;
exports.generateMockResponse = generateMockResponse;
exports.getAllEndpoints = getAllEndpoints;
exports.getAuthScheme = getAuthScheme;
exports.getCollection = getCollection;
exports.getCollectionAuth = getCollectionAuth;
exports.getEnvironment = getEnvironment;
exports.getRegistryEntry = getRegistryEntry;
exports.interpolateVariables = interpolateVariables;
exports.listCollections = listCollections;
exports.parseRawBody = parseRawBody;
exports.paytmCollection = paytmCollection;
exports.paytmEnvironment = paytmEnvironment;
exports.phonepeCollection = phonepeCollection;
exports.phonepeEnvironment = phonepeEnvironment;
exports.razorpayCollection = razorpayCollection;
exports.razorpayEnvironment = razorpayEnvironment;
exports.resolveVariables = resolveVariables;
exports.runCollection = runCollection;
exports.shiprocketCollection = shiprocketCollection;
exports.shiprocketEnvironment = shiprocketEnvironment;
exports.shopifyCollection = shopifyCollection;
exports.shopifyEnvironment = shopifyEnvironment;
exports.stripeCollection = stripeCollection;
exports.stripeEnvironment = stripeEnvironment;
