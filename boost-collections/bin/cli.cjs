#!/usr/bin/env node
'use strict';

const path = require('path');
const fs = require('fs');

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

let api = null;
try {
  api = require(path.join(__dirname, '..', 'dist', 'index.cjs'));
} catch (err) {
  api = null;
}

function requireApi() {
  if (!api) {
    console.error(`${C.red}✖ dist build not found. Run \`npm run build\` first.${C.reset}`);
    process.exit(1);
  }
  return api;
}

function parseArgs(argv) {
  const flags = { dir: null, format: 'postman', includeAuth: true };
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dir' || a === '-d') flags.dir = argv[++i];
    else if (a.startsWith('--dir=')) flags.dir = a.slice(6);
    else if (a === '--format' || a === '-f') flags.format = argv[++i];
    else if (a.startsWith('--format=')) flags.format = a.slice(9);
    else if (a === '--no-auth') flags.includeAuth = false;
    else positional.push(a);
  }
  return { flags, positional };
}

function banner() {
  console.log(`\n${C.bold}${C.blue}@boostengine/collections${C.reset} v1.2.0 — Universal eCommerce API Collections & AI Tooling\n`);
}

function resolveEndpoint(api, provider, query) {
  const endpoints = api.findEndpoints({ provider });
  if (!endpoints.length) throw new Error(`No endpoints found for "${provider}".`);
  if (!query) return endpoints[0];
  const q = query.toLowerCase();
  return (
    endpoints.find((e) => e.id === query || e.name === query) ||
    endpoints.find((e) => e.name.toLowerCase().includes(q) || e.path.toLowerCase().includes(q)) ||
    endpoints[0]
  );
}

function listCommand(api) {
  const rows = api.listCollections();
  console.log(`${C.bold}Available Production-Ready Collections:${C.reset}\n`);
  const header = ['provider', 'endpoints', 'auth', 'categories'];
  const data = rows.map((r) => [
    r.id,
    String(r.requestCount),
    r.authScheme,
    r.categories.join(', '),
  ]);
  const widths = header.map((h, i) => Math.max(h.length, ...data.map((d) => d[i].length)));
  const line = (cells) => '  ' + cells.map((c, i) => c.padEnd(widths[i])).join('  ').trimEnd();
  console.log(line(header));
  console.log(line(header.map((h) => '-'.repeat(h.length))));
  for (const d of data) console.log(line(d));
  console.log(`\n${C.dim}Use:${C.reset} ${C.cyan}boost-collections info <provider>${C.reset} to inspect endpoints.`);
}

function exportCommand(api, positional, flags) {
  const name = (positional[0] || 'all').toLowerCase();
  const dir = flags.dir ? path.resolve(process.cwd(), flags.dir) : process.cwd();
  const format = flags.format.toLowerCase();
  const valid = ['postman', 'openapi', 'bruno'];
  if (!valid.includes(format)) {
    console.error(`${C.red}✖ Invalid --format "${format}". Use ${valid.join('|')}.${C.reset}`);
    process.exit(1);
  }
  const files = api.exportToDirectory(name, dir, format);
  console.log(`${C.green}✔ Exported ${files.length} file(s)${C.reset} -> ${C.cyan}${dir}${C.reset} (format: ${C.yellow}${format}${C.reset})\n`);
  for (const f of files) console.log(`  • ${path.relative(process.cwd(), f)}`);
}

function curlCommand(api, positional, flags) {
  const provider = positional[0];
  if (!provider) {
    console.error(`${C.red}Usage:${C.reset} boost-collections curl <provider> [endpointId|search] [--no-auth]`);
    process.exit(1);
  }
  const ep = resolveEndpoint(api, provider, positional.slice(1).join(' '));
  const env = api.getEnvironment(provider);
  const auth = flags.includeAuth ? api.getCollectionAuth(provider) : undefined;
  const req = {
    method: ep.method,
    header: ep.headers || [],
    body: ep.body,
    url: { raw: ep.rawUrl || ep.path, path: (ep.path || '').split('/').filter(Boolean) },
  };
  const curl = api.generateCurl(req, env, auth, { includeAuth: flags.includeAuth });
  console.log(`${C.bold}${ep.name}${C.reset} ${C.dim}[${ep.method} ${ep.path}]${C.reset}\n`);
  console.log(curl + '\n');
}

function docsCommand(api, positional) {
  const provider = positional[0];
  const rows = api.listCollections();
  if (!provider) {
    console.log(`${C.bold}Official provider docs:${C.reset}\n`);
    for (const r of rows) console.log(`  ${C.green}${r.id.padEnd(12)}${C.reset} ${C.cyan}${r.docsUrl}${C.reset}`);
    return;
  }
  const summary = rows.find((r) => r.id === provider);
  if (!summary) {
    console.error(`${C.red}✖ Unknown provider "${provider}".${C.reset}`);
    process.exit(1);
  }
  console.log(`${C.bold}${summary.provider}${C.reset}\n`);
  console.log(`  ${C.green}Docs:${C.reset} ${C.cyan}${summary.docsUrl}${C.reset}`);
}

function infoCommand(api, positional) {
  const provider = positional[0];
  if (!provider) {
    console.error(`${C.red}Usage:${C.reset} boost-collections info <provider>`);
    process.exit(1);
  }
  const summary = api.listCollections().find((r) => r.id === provider);
  if (!summary) {
    console.error(`${C.red}✖ Unknown provider "${provider}".${C.reset}`);
    process.exit(1);
  }
  const endpoints = api.findEndpoints({ provider });
  console.log(`${C.bold}${summary.name}${C.reset} (${endpoints.length} endpoints)\n`);
  const byFolder = {};
  for (const e of endpoints) (byFolder[e.folder || 'Root'] ||= []).push(e);
  for (const folder of Object.keys(byFolder)) {
    console.log(`  ${C.bold}📁 ${folder}${C.reset}`);
    for (const e of byFolder[folder]) console.log(`     ${C.dim}[${e.method}]${C.reset} ${e.name}`);
  }
  console.log('');
}

function helpCommand() {
  console.log(`${C.bold}Commands:${C.reset}`);
  console.log(`  ${C.cyan}boost-collections list${C.reset}                                    List all collections (endpoints, auth, categories)`);
  console.log(`  ${C.cyan}boost-collections export [name] [--dir ./] [--format f]${C.reset}  Export (postman|openapi|bruno)`);
  console.log(`  ${C.cyan}boost-collections curl <name> [search] [--no-auth]${C.reset}        Print a ready-to-run cURL snippet`);
  console.log(`  ${C.cyan}boost-collections docs [name]${C.reset}                           Show official provider docs link`);
  console.log(`  ${C.cyan}boost-collections info <name>${C.reset}                          Inspect folders & endpoints\n`);
}

const args = process.argv.slice(2);
const command = args[0] || 'help';
banner();

try {
  switch (command) {
    case 'list':
      listCommand(requireApi());
      break;
    case 'export': {
      const { flags, positional } = parseArgs(args.slice(1));
      exportCommand(requireApi(), positional, flags);
      break;
    }
    case 'curl': {
      const { flags, positional } = parseArgs(args.slice(1));
      curlCommand(requireApi(), positional, flags);
      break;
    }
    case 'docs':
      docsCommand(requireApi(), args.slice(1));
      break;
    case 'info':
      infoCommand(requireApi(), args.slice(1));
      break;
    case 'openapi': {
      const { flags, positional } = parseArgs(args.slice(1));
      flags.format = 'openapi';
      exportCommand(requireApi(), positional, flags);
      break;
    }
    case 'help':
    case '--help':
    case '-h':
    default:
      helpCommand();
      break;
  }
} catch (err) {
  console.error(`${C.red}✖ ${err.message}${C.reset}\n`);
  process.exit(1);
}

