import fs from 'fs';
import path from 'path';
import {
  PostmanCollection,
  PostmanEnvironment,
  PostmanAuth,
  PostmanRequest,
  PostmanItem,
  CollectionName,
  CollectionCategory,
  CollectionSummary,
  APIEndpoint,
  FindEndpointsQuery,
  CodeSnippetTarget,
  ExportFormat,
  OpenAPISpec,
  BrunoCollection,
  RunCollectionOptions,
  RunCollectionResult,
} from './types';
import {
  resolveVariables,
  interpolateVariables,
  environmentToVariables,
  generateCurl,
  generateCodeSnippet,
  parseRawBody,
} from './converters/curl';
import { convertToOpenAPI } from './converters/openapi';
import { convertToBruno } from './converters/bruno';

// Inlined JSON objects for zero runtime path fragility
import razorpayCollectionJson from '../collections/razorpay.collection.json';
import cashfreeCollectionJson from '../collections/cashfree.collection.json';
import phonepeCollectionJson from '../collections/phonepe.collection.json';
import paytmCollectionJson from '../collections/paytm.collection.json';
import stripeCollectionJson from '../collections/stripe.collection.json';
import easyecomCollectionJson from '../collections/easyecom.collection.json';
import shiprocketCollectionJson from '../collections/shiprocket.collection.json';
import delhiveryCollectionJson from '../collections/delhivery.collection.json';
import shopifyCollectionJson from '../collections/shopify.collection.json';

import razorpayEnvironmentJson from '../environments/razorpay.env.json';
import cashfreeEnvironmentJson from '../environments/cashfree.env.json';
import phonepeEnvironmentJson from '../environments/phonepe.env.json';
import paytmEnvironmentJson from '../environments/paytm.env.json';
import stripeEnvironmentJson from '../environments/stripe.env.json';
import easyecomEnvironmentJson from '../environments/easyecom.env.json';
import shiprocketEnvironmentJson from '../environments/shiprocket.env.json';
import delhiveryEnvironmentJson from '../environments/delhivery.env.json';
import shopifyEnvironmentJson from '../environments/shopify.env.json';

export * from './types';

// ============================================================================
// Raw Collection & Environment Exports
// ============================================================================

export const razorpayCollection: PostmanCollection = razorpayCollectionJson as unknown as PostmanCollection;
export const cashfreeCollection: PostmanCollection = cashfreeCollectionJson as unknown as PostmanCollection;
export const phonepeCollection: PostmanCollection = phonepeCollectionJson as unknown as PostmanCollection;
export const paytmCollection: PostmanCollection = paytmCollectionJson as unknown as PostmanCollection;
export const stripeCollection: PostmanCollection = stripeCollectionJson as unknown as PostmanCollection;
export const easyecomCollection: PostmanCollection = easyecomCollectionJson as unknown as PostmanCollection;
export const shiprocketCollection: PostmanCollection = shiprocketCollectionJson as unknown as PostmanCollection;
export const delhiveryCollection: PostmanCollection = delhiveryCollectionJson as unknown as PostmanCollection;
export const shopifyCollection: PostmanCollection = shopifyCollectionJson as unknown as PostmanCollection;

export const razorpayEnvironment: PostmanEnvironment = razorpayEnvironmentJson as unknown as PostmanEnvironment;
export const cashfreeEnvironment: PostmanEnvironment = cashfreeEnvironmentJson as unknown as PostmanEnvironment;
export const phonepeEnvironment: PostmanEnvironment = phonepeEnvironmentJson as unknown as PostmanEnvironment;
export const paytmEnvironment: PostmanEnvironment = paytmEnvironmentJson as unknown as PostmanEnvironment;
export const stripeEnvironment: PostmanEnvironment = stripeEnvironmentJson as unknown as PostmanEnvironment;
export const easyecomEnvironment: PostmanEnvironment = easyecomEnvironmentJson as unknown as PostmanEnvironment;
export const shiprocketEnvironment: PostmanEnvironment = shiprocketEnvironmentJson as unknown as PostmanEnvironment;
export const delhiveryEnvironment: PostmanEnvironment = delhiveryEnvironmentJson as unknown as PostmanEnvironment;
export const shopifyEnvironment: PostmanEnvironment = shopifyEnvironmentJson as unknown as PostmanEnvironment;

// ============================================================================
// Provider Registry
// ============================================================================

export const COLLECTION_NAMES: CollectionName[] = [
  'razorpay',
  'cashfree',
  'phonepe',
  'paytm',
  'stripe',
  'easyecom',
  'shiprocket',
  'delhivery',
  'shopify',
];

const CATEGORIES: Record<CollectionName, CollectionCategory[]> = {
  razorpay: ['payments'],
  cashfree: ['payments'],
  phonepe: ['payments'],
  paytm: ['payments'],
  stripe: ['payments'],
  easyecom: ['wms'],
  shiprocket: ['logistics'],
  delhivery: ['logistics'],
  shopify: ['platform'],
};

const AUTH_SCHEMES: Record<CollectionName, string> = {
  razorpay: 'basic',
  cashfree: 'apikey',
  phonepe: 'hmac',
  paytm: 'hmac',
  stripe: 'bearer',
  easyecom: 'bearer',
  shiprocket: 'bearer',
  delhivery: 'apikey',
  shopify: 'apikey',
};

export interface ProviderEntry {
  collection: PostmanCollection;
  environment: PostmanEnvironment;
  provider: string;
  docsUrl: string;
  categories: CollectionCategory[];
  authScheme: string;
}

const registry: Record<CollectionName, ProviderEntry> = {
  razorpay: {
    collection: razorpayCollection,
    environment: razorpayEnvironment,
    provider: 'Razorpay Payments',
    docsUrl: 'https://razorpay.com/docs/api',
    categories: CATEGORIES.razorpay,
    authScheme: AUTH_SCHEMES.razorpay,
  },
  cashfree: {
    collection: cashfreeCollection,
    environment: cashfreeEnvironment,
    provider: 'Cashfree Payments',
    docsUrl: 'https://docs.cashfree.com/reference',
    categories: CATEGORIES.cashfree,
    authScheme: AUTH_SCHEMES.cashfree,
  },
  phonepe: {
    collection: phonepeCollection,
    environment: phonepeEnvironment,
    provider: 'PhonePe PG',
    docsUrl: 'https://developer.phonepe.com/v1/reference',
    categories: CATEGORIES.phonepe,
    authScheme: AUTH_SCHEMES.phonepe,
  },
  paytm: {
    collection: paytmCollection,
    environment: paytmEnvironment,
    provider: 'Paytm Payment Gateway',
    docsUrl: 'https://developer.paytm.com/docs/api',
    categories: CATEGORIES.paytm,
    authScheme: AUTH_SCHEMES.paytm,
  },
  stripe: {
    collection: stripeCollection,
    environment: stripeEnvironment,
    provider: 'Stripe Global',
    docsUrl: 'https://stripe.com/docs/api',
    categories: CATEGORIES.stripe,
    authScheme: AUTH_SCHEMES.stripe,
  },
  easyecom: {
    collection: easyecomCollection,
    environment: easyecomEnvironment,
    provider: 'EasyEcom WMS & ERP',
    docsUrl: 'https://api.easyecom.com/documentation',
    categories: CATEGORIES.easyecom,
    authScheme: AUTH_SCHEMES.easyecom,
  },
  shiprocket: {
    collection: shiprocketCollection,
    environment: shiprocketEnvironment,
    provider: 'Shiprocket Logistics',
    docsUrl: 'https://apidocs.shiprocket.in',
    categories: CATEGORIES.shiprocket,
    authScheme: AUTH_SCHEMES.shiprocket,
  },
  delhivery: {
    collection: delhiveryCollection,
    environment: delhiveryEnvironment,
    provider: 'Delhivery Express',
    docsUrl: 'https://delhivery.com/developer',
    categories: CATEGORIES.delhivery,
    authScheme: AUTH_SCHEMES.delhivery,
  },
  shopify: {
    collection: shopifyCollection,
    environment: shopifyEnvironment,
    provider: 'Shopify Admin REST',
    docsUrl: 'https://shopify.dev/docs/api/admin-rest',
    categories: CATEGORIES.shopify,
    authScheme: AUTH_SCHEMES.shopify,
  },
};

export function getRegistryEntry(name: CollectionName): ProviderEntry {
  const entry = registry[name];
  if (!entry) {
    throw new Error(`Provider "${name}" not found. Available: ${Object.keys(registry).join(', ')}`);
  }
  return entry;
}

export function getAuthScheme(name: CollectionName): string {
  return getRegistryEntry(name).authScheme;
}

export function getCollectionAuth(name: CollectionName): PostmanAuth | undefined {
  return getRegistryEntry(name).collection.auth;
}

// ============================================================================
// Query & Utility Functions
// ============================================================================

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function joinPath(req: PostmanRequest): string {
  if (req.url.path && req.url.path.length) {
    const p = req.url.path.join('/');
    return '/' + p.replace(/^\/+/, '');
  }
  const raw = req.url.raw || '';
  const match = raw.match(/^https?:\/\/[^/]+(\/.*)$/);
  return match ? match[1] : '/';
}

function flattenCollection(provider: CollectionName, collection: PostmanCollection): APIEndpoint[] {
  const entry = registry[provider];
  const result: APIEndpoint[] = [];
  const walk = (items: PostmanItem[], folder: string) => {
    for (const item of items || []) {
      if (item.item && item.item.length) {
        walk(item.item, item.name);
        continue;
      }
      if (!item.request) continue;
      const req = item.request;
      result.push({
        id: `${provider}:${slugify(folder)}:${slugify(item.name)}`,
        name: item.name,
        method: (req.method || 'GET').toUpperCase(),
        path: joinPath(req),
        rawUrl: req.url.raw || '',
        description: req.description || item.description || '',
        provider,
        providerName: entry.provider,
        folder,
        tag: folder,
        headers: req.header || [],
        body: req.body,
        query: req.url.query || [],
        auth: collection.auth,
        authScheme: entry.authScheme,
      });
    }
  };
  walk(collection.item || [], '');
  return result;
}

/** List all available collections with endpoint counts, folders and categories. */
export function listCollections(): CollectionSummary[] {
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
      docsUrl: entry.docsUrl,
    };
  });
}

/** Get a specific Postman Collection by name. */
export function getCollection(name: CollectionName): PostmanCollection {
  return getRegistryEntry(name).collection;
}

/** Get a specific Postman Environment by name. */
export function getEnvironment(name: CollectionName): PostmanEnvironment {
  return getRegistryEntry(name).environment;
}

/** Flatten every endpoint from every collection into a single list. */
export function getAllEndpoints(): APIEndpoint[] {
  return COLLECTION_NAMES.reduce<APIEndpoint[]>(
    (acc, key) => acc.concat(flattenCollection(key, registry[key].collection)),
    [],
  );
}

/** Filter endpoints across all collections by provider, method, path or tag. */
export function findEndpoints(query: FindEndpointsQuery = {}): APIEndpoint[] {
  let endpoints: APIEndpoint[] = [];
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
      (e) => e.path.toLowerCase().includes(p) || e.rawUrl.toLowerCase().includes(p),
    );
  }
  if (query.tag) {
    const t = query.tag.toLowerCase();
    endpoints = endpoints.filter(
      (e) => e.tag.toLowerCase().includes(t) || e.folder.toLowerCase().includes(t),
    );
  }
  return endpoints;
}

// ============================================================================
// Mock Response Generation
// ============================================================================

function mockValue(key: string, sample: any): any {
  if (typeof sample === 'number') return sample;
  if (typeof sample === 'boolean') return sample;
  if (Array.isArray(sample)) return [];
  if (sample && typeof sample === 'object') return {};
  return `${key}_sample`;
}

/** Generate a plausible mock response for an endpoint & status code. */
export function generateMockResponse(endpoint: APIEndpoint, statusCode = 200): Record<string, any> {
  const method = endpoint.method || 'GET';
  if (statusCode >= 400) {
    return {
      error: {
        code: `ERR_${statusCode}`,
        message: `Mock ${statusCode} error for ${endpoint.name}`,
        status: statusCode,
      },
    };
  }
  const { json } = parseRawBody(endpoint.body);
  const data: Record<string, any> = {};
  if (json && typeof json === 'object' && !Array.isArray(json)) {
    for (const k of Object.keys(json)) data[k] = mockValue(k, json[k]);
  }
  if (method === 'GET') {
    return { entity: endpoint.name, count: 0, items: [], ...data };
  }
  if (method === 'DELETE') {
    return { deleted: true, id: `${endpoint.id}_mock` };
  }
  data.id = `${endpoint.id}_${Math.floor(Math.random() * 90000 + 10000)}`;
  data.created_at = Math.floor(Date.now() / 1000);
  return data;
}

function mockStatusFor(endpoint: APIEndpoint): number {
  const m = endpoint.method;
  if (m === 'POST') return 201;
  if (m === 'DELETE') return 204;
  return 200;
}

// ============================================================================
// Converters & Exporters
// ============================================================================

function extractBaseUrl(environment: PostmanEnvironment): string | undefined {
  const baseVar = (environment.values || []).find((v) => /base_url$/i.test(v.key));
  return baseVar ? baseVar.value : undefined;
}

/** Convert a Postman collection into a valid OpenAPI 3.0 JSON spec. */
export function exportToOpenAPI(
  name: CollectionName,
  options?: { version?: string; openapiVersion?: string },
): OpenAPISpec {
  const entry = getRegistryEntry(name);
  return convertToOpenAPI(entry.collection, { environment: entry.environment, ...options });
}

/** Convert a Postman collection into the Bruno collection format. */
export function exportToBruno(name: CollectionName): BrunoCollection {
  const entry = getRegistryEntry(name);
  return convertToBruno(entry.collection, { baseUrl: extractBaseUrl(entry.environment) });
}

/** Export collections to disk in Postman, OpenAPI or Bruno format. */
export function exportToDirectory(
  name: CollectionName | 'all',
  targetDir: string = process.cwd(),
  format: ExportFormat = 'postman',
): string[] {
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
  const targets: CollectionName[] = name === 'all' ? [...COLLECTION_NAMES] : [name];
  const exported: string[] = [];

  for (const item of targets) {
    const entry = registry[item];
    if (!entry) continue;

    if (format === 'openapi') {
      const spec = exportToOpenAPI(item);
      const file = path.join(targetDir, `${item}.openapi.json`);
      fs.writeFileSync(file, JSON.stringify(spec, null, 2), 'utf8');
      exported.push(file);
    } else if (format === 'bruno') {
      const bruno = exportToBruno(item);
      const dir = path.join(targetDir, `${item}.bruno`);
      fs.mkdirSync(dir, { recursive: true });
      const manifest = path.join(dir, 'bruno.json');
      fs.writeFileSync(manifest, JSON.stringify(bruno.brunoJson, null, 2), 'utf8');
      exported.push(manifest);
      for (const r of bruno.requests) {
        const file = path.join(dir, r.file);
        fs.mkdirSync(path.dirname(file), { recursive: true });
        fs.writeFileSync(file, r.content, 'utf8');
        exported.push(file);
      }
    } else {
      const colFile = path.join(targetDir, `${item}.collection.json`);
      const envFile = path.join(targetDir, `${item}.env.json`);
      fs.writeFileSync(colFile, JSON.stringify(entry.collection, null, 2), 'utf8');
      fs.writeFileSync(envFile, JSON.stringify(entry.environment, null, 2), 'utf8');
      exported.push(colFile, envFile);
    }
  }

  return exported;
}

// ============================================================================
// Lightweight In-Memory Runner
// ============================================================================

/** Simulate running every endpoint in a collection (schema validation & mocks). */
export async function runCollection(
  name: CollectionName,
  options: RunCollectionOptions = {},
): Promise<RunCollectionResult[]> {
  const entry = getRegistryEntry(name);
  const endpoints = flattenCollection(name, entry.collection);
  const vars = { ...environmentToVariables(entry.environment), ...(options.env || {}) };

  if (options.baseUrl) {
    const baseKey = Object.keys(vars).find((k) => /base_url$/i.test(k));
    if (baseKey) vars[baseKey] = options.baseUrl;
    else vars.base_url = options.baseUrl;
  }

  const results: RunCollectionResult[] = [];
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
      dryRun: !!options.dryRun,
    });
  }

  return results;
}

// ============================================================================
// Re-exports from converter modules
// ============================================================================

export {
  resolveVariables,
  interpolateVariables,
  environmentToVariables,
  generateCurl,
  generateCodeSnippet,
  parseRawBody,
};
export { convertToOpenAPI };
export { convertToBruno };

