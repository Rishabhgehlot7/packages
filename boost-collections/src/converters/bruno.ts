import {
  PostmanCollection,
  PostmanItem,
  PostmanRequest,
  PostmanAuth,
  BrunoCollection,
  BrunoRequestFile,
} from '../types';
import { parseRawBody } from './curl';

// ============================================================================
// Postman v2.1 -> Bruno Converter
// ============================================================================

function sanitizeFileName(name: string): string {
  return name.replace(/[\\/:*?"<>|]+/g, '-').trim();
}

function indent(text: string): string {
  return text
    .split('\n')
    .map((l) => '  ' + l)
    .join('\n');
}

function brunoBodyType(req: PostmanRequest): string | null {
  if (!req.body) return null;
  if (req.body.mode === 'raw') return 'json';
  if (req.body.mode === 'urlencoded') return 'form-urlencoded';
  if (req.body.mode === 'formdata') return 'multipart-form';
  return null;
}

function brunoAuthLine(auth?: PostmanAuth): string | null {
  if (!auth) return null;
  if (auth.type === 'basic') return 'basic';
  if (auth.type === 'bearer') return 'bearer';
  return null;
}

function brunoBodyBlock(req: PostmanRequest): string {
  if (!req.body) return '';
  if (req.body.mode === 'raw' && req.body.raw) {
    const { json } = parseRawBody(req.body);
    const content = json != null ? JSON.stringify(json, null, 2) : req.body.raw;
    return `\nbody:json {\n${indent(content)}\n}`;
  }
  const params =
    req.body.mode === 'urlencoded'
      ? req.body.urlencoded
      : req.body.mode === 'formdata'
        ? req.body.formdata
        : null;
  if (params) {
    const kv = (params || [])
      .filter((p) => p && !p.disabled)
      .map((p) => `  ${p.key}: ${p.value}`)
      .join('\n');
    const block = req.body.mode === 'urlencoded' ? 'body:form-urlencoded' : 'body:multipart-form';
    return `\n${block} {\n${kv}\n}`;
  }
  return '';
}

function buildBruFile(
  item: PostmanItem,
  seq: number,
  folder: string,
  auth?: PostmanAuth,
): BrunoRequestFile {
  const req = item.request!;
  const method = (req.method || 'GET').toLowerCase();
  const url = req.url.raw || '';
  const headers = (req.header || []).filter((h) => h && !h.disabled && h.key);
  const bodyType = brunoBodyType(req);
  const authName = brunoAuthLine(auth);

  const methodLines: string[] = [`  url: ${url}`];
  if (bodyType) methodLines.push(`  body: ${bodyType}`);
  if (authName) methodLines.push(`  auth: ${authName}`);

  const lines: string[] = [
    `meta {`,
    `  name: ${item.name}`,
    `  type: http`,
    `  seq: ${seq}`,
    `}`,
    ``,
    `${method} {`,
    ...methodLines,
    `}`,
  ];

  if (headers.length) {
    lines.push(``);
    lines.push(`headers {`);
    for (const h of headers) lines.push(`  ${h.key}: ${h.value}`);
    lines.push(`}`);
  }

  const bodyBlock = brunoBodyBlock(req);
  if (bodyBlock) lines.push(bodyBlock);

  const file = `${folder ? sanitizeFileName(folder) + '/' : ''}${sanitizeFileName(item.name)}.bru`;
  return { name: item.name, file, content: lines.join('\n') + '\n' };
}

export function convertToBruno(
  collection: PostmanCollection,
  options: { baseUrl?: string } = {},
): BrunoCollection {
  const brunoJson: Record<string, any> = {
    version: '1',
    name: collection.info?.name || 'Collection',
    type: 'collection',
    ignore: ['node_modules', '.git', 'dist'],
  };
  if (options.baseUrl) brunoJson.baseUrl = options.baseUrl;

  const requests: BrunoRequestFile[] = [];
  let seq = 0;

  const walk = (items: PostmanItem[], folder: string) => {
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

  walk(collection.item || [], '');
  return { brunoJson, requests };
}
