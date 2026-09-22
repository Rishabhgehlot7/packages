import {
  PostmanCollection,
  PostmanEnvironment,
  PostmanItem,
  PostmanRequest,
  OpenAPISpec,
} from '../types';
import { resolveVariables, environmentToVariables } from './curl';

// ============================================================================
// Postman v2.1 -> OpenAPI 3.0 Converter
// ============================================================================

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function toOperationId(folder: string, name: string, method: string): string {
  return `${slugify(folder)}_${slugify(name)}` || slugify(name) || method.toLowerCase();
}

function uniqueOperationId(base: string, used: Set<string>): string {
  let candidate = base || 'operation';
  let i = 2;
  while (used.has(candidate)) {
    candidate = `${base}_${i}`;
    i++;
  }
  used.add(candidate);
  return candidate;
}

function joinPath(request: PostmanRequest): string {
  if (request.url.path && request.url.path.length) {
    const p = request.url.path
      .map((s) => s.replace(/\{\{\s*([\w.-]+)\s*\}\}/g, '{$1}'))
      .join('/');
    return '/' + p.replace(/^\/+/, '');
  }
  const raw = request.url.raw || '';
  const match = raw.match(/^https?:\/\/[^/]+(\/.*)$/);
  return match ? match[1] : '/';
}

function extractPathParams(path: string): string[] {
  const params: string[] = [];
  const re = /\{([\w.-]+)\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(path)) !== null) {
    if (!params.includes(m[1])) params.push(m[1]);
  }
  return params;
}

function firstRequest(collection: PostmanCollection): PostmanRequest | null {
  const stack: PostmanItem[] = [...(collection.item || [])];
  while (stack.length) {
    const item = stack.pop()!;
    if (item.request) return item.request;
    if (item.item) stack.push(...item.item);
  }
  return null;
}

function buildRequestBody(req: PostmanRequest): any {
  if (!req.body) return null;
  if (req.body.mode === 'raw' && req.body.raw) {
    let example: any = req.body.raw;
    try {
      example = JSON.parse(req.body.raw);
    } catch {
      /* keep raw string */
    }
    return {
      required: true,
      content: {
        'application/json': {
          schema: { type: 'object', example },
          example,
        },
      },
    };
  }
  if (req.body.mode === 'urlencoded' && req.body.urlencoded) {
    const props: Record<string, any> = {};
    for (const p of req.body.urlencoded) {
      if (!p || p.disabled) continue;
      props[p.key] = { type: 'string', example: p.value };
    }
    return {
      required: true,
      content: {
        'application/x-www-form-urlencoded': { schema: { type: 'object', properties: props } },
      },
    };
  }
  if (req.body.mode === 'formdata' && req.body.formdata) {
    const props: Record<string, any> = {};
    for (const p of req.body.formdata) {
      if (!p || p.disabled) continue;
      props[p.key] = { type: 'string', example: p.value };
    }
    return {
      required: true,
      content: {
        'multipart/form-data': { schema: { type: 'object', properties: props } },
      },
    };
  }
  return null;
}


export function convertToOpenAPI(
  collection: PostmanCollection,
  options: {
    environment?: PostmanEnvironment;
    baseUrl?: string;
    version?: string;
    openapiVersion?: string;
  } = {},
): OpenAPISpec {
  const vars = environmentToVariables(options.environment);
  const spec: OpenAPISpec = {
    openapi: options.openapiVersion || '3.0.3',
    info: {
      title: collection.info?.name || 'API Collection',
      version: options.version || '1.0.0',
      description: collection.info?.description || '',
    },
    servers: [],
    tags: [],
    paths: {},
    components: { schemas: {}, securitySchemes: {} },
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
      if (typeof host === 'string') baseUrl = host;
    }
  }
  if (baseUrl) {
    spec.servers = [{ url: resolveVariables(baseUrl, vars), description: 'Primary API server' }];
  }

  if (collection.auth) {
    const t = collection.auth.type;
    if (t === 'basic') {
      spec.components.securitySchemes.basicAuth = { type: 'http', scheme: 'basic' };
      spec.security = [{ basicAuth: [] }];
    } else if (t === 'bearer') {
      spec.components.securitySchemes.bearerAuth = { type: 'http', scheme: 'bearer', bearerFormat: 'token' };
      spec.security = [{ bearerAuth: [] }];
    } else if (t === 'apikey') {
      spec.components.securitySchemes.apiKeyAuth = { type: 'apiKey', in: 'header', name: 'X-API-Key' };
      spec.security = [{ apiKeyAuth: [] }];
    }
  }

  const tagSet = new Set<string>();
  const operationIds = new Set<string>();

  const walk = (items: PostmanItem[], folderName: string) => {
    for (const item of items || []) {
      if (item.item && item.item.length) {
        walk(item.item, item.name);
        continue;
      }
      if (!item.request) continue;
      const req = item.request;
      const method = (req.method || 'GET').toLowerCase();
      const path = joinPath(req);
      const operation: Record<string, any> = {
        operationId: uniqueOperationId(toOperationId(folderName, item.name, method), operationIds),
        summary: item.name,
        description: req.description || item.description || '',
        responses: {
          '200': { description: 'Successful response' },
          '201': { description: 'Created' },
        },
      };

      if (folderName) {
        operation.tags = [folderName];
        tagSet.add(folderName);
      }

      const params: any[] = [];
      for (const p of extractPathParams(path)) {
        params.push({ name: p, in: 'path', required: true, schema: { type: 'string' } });
      }
      for (const q of req.url.query || []) {
        if (q.disabled) continue;
        params.push({ name: q.key, in: 'query', required: false, schema: { type: 'string' }, description: q.description || '' });
      }
      if (params.length) operation.parameters = params;

      const body = buildRequestBody(req);
      if (body) operation.requestBody = body;

      spec.paths[path] = spec.paths[path] || {};
      spec.paths[path][method] = operation;
    }
  };

  walk(collection.item || [], '');
  spec.tags = [...tagSet].map((t) => ({ name: t }));
  return spec;
}
