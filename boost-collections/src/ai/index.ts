import {
  listCollections,
  findEndpoints,
  generateCurl,
  exportToOpenAPI,
  exportToBruno,
  generateMockResponse,
  getEnvironment,
  getCollectionAuth,
  getRegistryEntry,
  getAllEndpoints,
  COLLECTION_NAMES,
} from '../index';
import type {
  CollectionName,
  APIEndpoint,
  PostmanRequest,
  PostmanAuth,
  AIToolSchema,
  MCPToolDefinition,
} from '../types';

// ============================================================================
// Shared JSON-Schema fragments
// ============================================================================

const PROVIDER_ENUM = [...COLLECTION_NAMES];

const objectSchema = (properties: Record<string, any>, required: string[] = []) => ({
  type: 'object',
  properties,
  ...(required.length ? { required } : {}),
});

const stringProp = (description: string, enumValues?: string[]) => ({
  type: 'string',
  description,
  ...(enumValues ? { enum: enumValues } : {}),
});

// ============================================================================
// Tool Definitions (source of truth)
// ============================================================================

interface ToolDef {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
}

const TOOL_DEFS: ToolDef[] = [
  {
    name: 'list_api_collections',
    description:
      'List all available ecommerce API collections (Razorpay, Cashfree, PhonePe, Paytm, Stripe, EasyEcom, Shiprocket, Delhivery, Shopify) with endpoint counts, folders, auth schemes and categories.',
    inputSchema: objectSchema({
      category: stringProp('Optional filter: payments, logistics, wms or platform.', ['payments', 'logistics', 'wms', 'platform']),
    }),
  },
  {
    name: 'get_api_endpoints',
    description:
      'Search API endpoints across all providers by provider, HTTP method, URL path or folder tag. Returns endpoints with method, path, headers and request body.',
    inputSchema: objectSchema({
      provider: stringProp('Provider name, e.g. razorpay, stripe, shiprocket.', PROVIDER_ENUM),
      method: stringProp('HTTP method, e.g. GET, POST, PUT, PATCH, DELETE.', ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']),
      path: stringProp('Substring to match against the URL path, e.g. /v1/orders or refund.'),
      tag: stringProp('Substring to match against the folder/tag name, e.g. Orders, Refunds, Webhooks.'),
    }),
  },
  {
    name: 'generate_api_curl',
    description:
      'Generate a ready-to-run cURL command for a specific provider endpoint, including headers, request body and (optionally) authentication.',
    inputSchema: objectSchema(
      {
        provider: stringProp('Provider name.', PROVIDER_ENUM),
        endpointId: stringProp('Exact endpoint id or name.'),
        search: stringProp('Substring to find an endpoint by name or path if endpointId is omitted.'),
        includeAuth: { type: 'boolean', description: 'Include basic/bearer auth in the command. Default true.' },
      },
      ['provider'],
    ),
  },
  {
    name: 'convert_collection_format',
    description:
      'Convert a full Postman collection into OpenAPI 3.0 JSON or the Bruno collection format.',
    inputSchema: objectSchema(
      {
        provider: stringProp('Provider name.', PROVIDER_ENUM),
        format: stringProp('Target output format.', ['openapi', 'bruno']),
      },
      ['provider', 'format'],
    ),
  },
  {
    name: 'generate_mock_response',
    description:
      'Generate a plausible mock JSON response for a provider endpoint and HTTP status code, derived from the endpoint request body schema.',
    inputSchema: objectSchema(
      {
        provider: stringProp('Provider name.', PROVIDER_ENUM),
        endpointId: stringProp('Exact endpoint id or name (defaults to first endpoint).'),
        statusCode: { type: 'integer', description: 'HTTP status code, e.g. 200, 201, 404. Default 200.' },
      },
      ['provider'],
    ),
  },
];

// ============================================================================
// OpenAI Function-Calling Schemas
// ============================================================================

export const collectionTools: AIToolSchema[] = TOOL_DEFS.map((t) => ({
  type: 'function',
  function: {
    name: t.name,
    description: t.description,
    parameters: t.inputSchema,
  },
}));

// ============================================================================
// Anthropic Tool Schemas (input_schema)
// ============================================================================

export const anthropicTools: { name: string; description: string; input_schema: Record<string, any> }[] =
  TOOL_DEFS.map((t) => ({
    name: t.name,
    description: t.description,
    input_schema: t.inputSchema,
  }));

// ============================================================================
// MCP (Model Context Protocol) Tool Definitions
// ============================================================================

export const mcpTools: MCPToolDefinition[] = TOOL_DEFS.map((t) => ({
  name: t.name,
  description: t.description,
  inputSchema: t.inputSchema,
}));

/** JSON-RPC `tools/list` response payload for MCP servers. */
export const mcpToolsListResponse = {
  jsonrpc: '2.0',
  id: 1,
  result: {
    tools: mcpTools,
  },
};

export const TOOL_NAMES = TOOL_DEFS.map((t) => t.name);

// ============================================================================
// Runtime Helpers
// ============================================================================

function endpointToRequest(ep: APIEndpoint): PostmanRequest {
  return {
    method: ep.method,
    header: ep.headers || [],
    body: ep.body,
    url: {
      raw: ep.rawUrl || ep.path,
      path: (ep.path || '').split('/').filter(Boolean),
    },
  };
}

function resolveEndpoint(provider?: string, endpointId?: string, search?: string): APIEndpoint {
  if (!provider) throw new Error('A "provider" argument is required.');
  const endpoints = findEndpoints({ provider });
  if (!endpoints.length) throw new Error(`No endpoints found for provider "${provider}".`);
  if (endpointId) {
    const found = endpoints.find((e) => e.id === endpointId || e.name === endpointId);
    if (found) return found;
  }
  if (search) {
    const q = search.toLowerCase();
    const found = endpoints.find(
      (e) => e.name.toLowerCase().includes(q) || e.path.toLowerCase().includes(q),
    );
    if (found) return found;
  }
  return endpoints[0];
}

// ============================================================================
// Tool Executor
// ============================================================================

/** Dispatch an AI tool call by name and return its result. */
export function executeCollectionTool(name: string, args: Record<string, any> = {}): any {
  switch (name) {
    case 'list_api_collections': {
      const all = listCollections();
      return args.category ? all.filter((c) => c.categories.includes(args.category)) : all;
    }
    case 'get_api_endpoints': {
      return findEndpoints(args as any);
    }
    case 'generate_api_curl': {
      const endpoint = resolveEndpoint(args.provider, args.endpointId, args.search);
      const env = getEnvironment(endpoint.provider);
      const auth = args.includeAuth === false ? undefined : getCollectionAuth(endpoint.provider);
      const curl = generateCurl(endpointToRequest(endpoint), env, auth, {
        includeAuth: args.includeAuth !== false,
      });
      return { provider: endpoint.provider, endpoint: endpoint.name, method: endpoint.method, curl };
    }
    case 'convert_collection_format': {
      const { provider, format } = args;
      if (!provider) throw new Error('A "provider" argument is required.');
      if (format === 'openapi') return exportToOpenAPI(provider as CollectionName);
      if (format === 'bruno') return exportToBruno(provider as CollectionName);
      throw new Error(`Unsupported format "${format}". Use "openapi" or "bruno".`);
    }
    case 'generate_mock_response': {
      const endpoint = resolveEndpoint(args.provider, args.endpointId);
      const statusCode = typeof args.statusCode === 'number' ? args.statusCode : 200;
      return {
        provider: endpoint.provider,
        endpoint: endpoint.name,
        statusCode,
        body: generateMockResponse(endpoint, statusCode),
      };
    }
    default:
      throw new Error(`Unknown tool "${name}". Available: ${TOOL_NAMES.join(', ')}`);
  }
}

// ============================================================================
// System Prompt Generator
// ============================================================================

const AUTH_CONTEXT: Record<CollectionName, { auth: string; headers: string[] }> = {
  razorpay: {
    auth: 'HTTP Basic Auth — username = key_id, password = key_secret ({{razorpay_key_id}} / {{razorpay_key_secret}}).',
    headers: ['Content-Type: application/json'],
  },
  cashfree: {
    auth: 'API Key — pass x-client-id, x-client-secret and x-api-version (2023-08-01) headers.',
    headers: ['x-client-id', 'x-client-secret', 'x-api-version', 'Content-Type'],
  },
  phonepe: {
    auth: 'HMAC — X-VERIFY header = Base64(SHA256(base64Payload + saltKey + saltIndex)).',
    headers: ['X-VERIFY', 'Content-Type'],
  },
  paytm: {
    auth: 'HMAC checksum — paytm_checksum generated from mid + merchant key.',
    headers: ['x-mid', 'x-checksum', 'Content-Type'],
  },
  stripe: {
    auth: 'Bearer token — Authorization: Bearer {{stripe_secret_key}}.',
    headers: ['Authorization', 'Content-Type'],
  },
  easyecom: {
    auth: 'Bearer token — Authorization: Bearer {{easyecom_api_token}}.',
    headers: ['Authorization', 'Content-Type'],
  },
  shiprocket: {
    auth: 'Bearer token — first POST /auth/login with email + password, then Authorization: Bearer {{shiprocket_token}}.',
    headers: ['Authorization', 'Content-Type'],
  },
  delhivery: {
    auth: 'API Token — Authorization: Token {{delhivery_api_token}}.',
    headers: ['Authorization', 'Content-Type'],
  },
  shopify: {
    auth: 'Access token — X-Shopify-Access-Token: {{shopify_access_token}}.',
    headers: ['X-Shopify-Access-Token', 'Content-Type'],
  },
};

/** Generate LLM context describing a provider's API structure, auth & webhooks. */
export function getCollectionSystemPrompt(provider: CollectionName): string {
  const entry = getRegistryEntry(provider);
  const context = AUTH_CONTEXT[provider];
  const baseUrl =
    (entry.environment.values || []).find((v) => /base_url$/i.test(v.key))?.value || '';
  const endpoints = findEndpoints({ provider });
  const webhookEvents = endpoints.filter(
    (e) => /webhook/i.test(e.folder) || /webhook/i.test(e.name),
  );

  const lines: string[] = [];
  lines.push(`# ${entry.provider} — API Integration Context`);
  lines.push('');
  lines.push(`You are integrating with the **${entry.provider}** API.`);
  lines.push('');
  lines.push(`- **Base URL**: ${baseUrl}`);
  lines.push(`- **Auth scheme**: ${entry.authScheme.toUpperCase()}`);
  lines.push(`- **Official docs**: ${entry.docsUrl}`);
  lines.push('');
  lines.push('## Authentication');
  lines.push(context.auth);
  lines.push('');
  lines.push('## Mandatory Headers');
  for (const h of context.headers) lines.push(`- \`${h}\``);
  lines.push('');
  lines.push(`## Endpoints (${endpoints.length})`);
  for (const ep of endpoints) lines.push(`- \`${ep.method}\` ${ep.path} — ${ep.name}`);
  if (webhookEvents.length) {
    lines.push('');
    lines.push('## Webhook Event Payloads');
    for (const ep of webhookEvents) lines.push(`- ${ep.name} (${ep.method} ${ep.path})`);
  }
  return lines.join('\n');
}


