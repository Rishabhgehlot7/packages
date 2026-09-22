import {
  PostmanRequest,
  PostmanEnvironment,
  PostmanAuth,
  CodeSnippetTarget,
  PostmanBody,
} from '../types';

// ============================================================================
// Variable Interpolation
// ============================================================================

/** Replace `{{variable}}` placeholders using a variable map. */
export function resolveVariables(input: string, variables: Record<string, string>): string {
  if (!input) return input;
  return input.replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (match, name: string) => {
    const key = name.trim();
    return Object.prototype.hasOwnProperty.call(variables, key) ? variables[key] : match;
  });
}

/** Convert a Postman environment into a flat `key -> value` map. */
export function environmentToVariables(environment?: PostmanEnvironment): Record<string, string> {
  const map: Record<string, string> = {};
  if (!environment) return map;
  for (const v of environment.values || []) {
    if (v && typeof v.key === 'string') map[v.key] = v.value ?? '';
  }
  return map;
}

function deepInterpolate<T>(value: T, variables: Record<string, string>): T {
  if (value == null) return value;
  if (typeof value === 'string') return resolveVariables(value, variables) as unknown as T;
  if (Array.isArray(value)) return value.map((v) => deepInterpolate(v, variables)) as unknown as T;
  if (typeof value === 'object') {
    const out: Record<string, any> = {};
    for (const k of Object.keys(value as any)) {
      out[k] = deepInterpolate((value as any)[k], variables);
    }
    return out as unknown as T;
  }
  return value;
}

/** Replace all `{{var}}` placeholders in a request using the environment. */
export function interpolateVariables(request: PostmanRequest, environment?: PostmanEnvironment): PostmanRequest {
  return deepInterpolate(request, environmentToVariables(environment));
}

// ============================================================================
// URL & Body Helpers
// ============================================================================

export function resolveRequestUrl(request: PostmanRequest): string {
  if (request.url && request.url.raw) return request.url.raw;
  const host = Array.isArray(request.url.host)
    ? request.url.host.join('.')
    : request.url.host || '';
  const pathSegments = request.url.path || [];
  const base = host.startsWith('http') ? host : `https://${host}`;
  return `${base}${pathSegments.map((s) => `/${s}`).join('')}`;
}

function shellQuote(value: string): string {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

export function contentTypeOf(body?: PostmanBody): string {
  if (!body) return '';
  if (body.mode === 'urlencoded') return 'application/x-www-form-urlencoded';
  if (body.mode === 'formdata') return 'multipart/form-data';
  return 'application/json';
}

/** Parse a raw body into a JSON value when possible, otherwise keep the raw string. */
export function parseRawBody(body?: PostmanBody): { json: any; raw: string | null } {
  if (!body) return { json: null, raw: null };
  if (body.mode === 'urlencoded' || body.mode === 'formdata') {
    const obj: Record<string, string> = {};
    const params = body.mode === 'urlencoded' ? body.urlencoded : body.formdata;
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

// ============================================================================
// cURL Generation
// ============================================================================

export function generateCurl(
  request: PostmanRequest,
  environment?: PostmanEnvironment,
  auth?: PostmanAuth,
  options?: { includeAuth?: boolean },
): string {
  const req = environment ? interpolateVariables(request, environment) : request;
  const method = (req.method || 'GET').toUpperCase();
  const url = resolveRequestUrl(req);
  const parts: string[] = [`curl --request ${method}`];
  const vars = environmentToVariables(environment);

  if (options?.includeAuth !== false && auth) {
    if (auth.type === 'basic' && auth.basic) {
      const username = resolveVariables(auth.basic.find((e) => e.key === 'username')?.value || '', vars);
      const password = resolveVariables(auth.basic.find((e) => e.key === 'password')?.value || '', vars);
      parts.push(`--user ${shellQuote(`${username}:${password}`)}`);
    } else if (auth.type === 'bearer' && auth.bearer) {
      const token = resolveVariables(auth.bearer[0]?.value || '', vars);
      parts.push(`--header ${shellQuote(`Authorization: Bearer ${token}`)}`);
    }
  }

  for (const h of req.header || []) {
    if (!h || h.disabled || !h.key) continue;
    if (h.key.toLowerCase() === 'content-length') continue;
    parts.push(`--header ${shellQuote(`${h.key}: ${h.value}`)}`);
  }

  if (req.body) {
    if (req.body.mode === 'raw' && req.body.raw) {
      parts.push(`--data-raw ${shellQuote(req.body.raw)}`);
    } else if (req.body.mode === 'urlencoded' && req.body.urlencoded) {
      for (const p of req.body.urlencoded) {
        if (!p || p.disabled) continue;
        parts.push(`--data-urlencode ${shellQuote(`${p.key}=${p.value}`)}`);
      }
    } else if (req.body.mode === 'formdata' && req.body.formdata) {
      for (const p of req.body.formdata) {
        if (!p || p.disabled) continue;
        parts.push(`--form ${shellQuote(`${p.key}=${p.value}`)}`);
      }
    }
  }

  parts.push(shellQuote(url));
  return parts.join(' \\\n  ');
}


// ============================================================================
// Code Snippet Generation
// ============================================================================

function singleQuote(value: string): string {
  return `'${String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function buildHeaderEntries(req: PostmanRequest, auth?: PostmanAuth): [string, string][] {
  const entries: [string, string][] = [];
  for (const h of req.header || []) {
    if (!h || h.disabled || !h.key) continue;
    if (h.key.toLowerCase() === 'content-length') continue;
    entries.push([h.key, h.value]);
  }
  if (auth) {
    if (auth.type === 'bearer' && auth.bearer) {
      entries.push(['Authorization', `Bearer ${auth.bearer[0]?.value || ''}`]);
    }
  }
  return entries;
}

function jsonBodyLiteral(req: PostmanRequest): string | null {
  const { json } = parseRawBody(req.body);
  if (json == null) return null;
  return JSON.stringify(json, null, 2);
}

function indentBlock(text: string, indent = '  '): string {
  return text.split('\n').map((l) => indent + l).join('\n');
}

/** Generate a ready-to-use TypeScript/JavaScript request snippet. */
export function generateCodeSnippet(
  request: PostmanRequest,
  environment?: PostmanEnvironment,
  target: CodeSnippetTarget = 'fetch',
  auth?: PostmanAuth,
): string {
  const req = environment ? interpolateVariables(request, environment) : request;
  const method = (req.method || 'GET').toUpperCase();
  const url = resolveRequestUrl(req);
  const headers = buildHeaderEntries(req, auth);
  const { raw } = parseRawBody(req.body);
  const jsonLiteral = jsonBodyLiteral(req);
  const urlLit = singleQuote(url);
  const lines: string[] = [];

  if (target === 'axios') {
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
    return lines.join('\n');
  }

  if (target === 'node-https') {
    const isHttps = url.startsWith('https');
    const mod = isHttps ? 'https' : 'http';
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
    return lines.join('\n');
  }

  // fetch (default)
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
  return lines.join('\n');
}
