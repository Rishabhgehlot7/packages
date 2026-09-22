'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

let passed = 0;
let failed = 0;

function assert(condition, testName, details) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    if (details !== undefined) console.error('     Details:', details);
    failed++;
  }
}

console.log('\n=======================================================');
console.log('🚀 @boostengine/collections v1.2.0 — Enterprise Test Suite');
console.log('=======================================================\n');

let api;
let ai;
try {
  api = require(path.join(__dirname, 'dist', 'index.cjs'));
  ai = require(path.join(__dirname, 'dist', 'ai.cjs'));
} catch (err) {
  console.error('❌ dist build not found. Run `npm run build` first.');
  console.error(err.message);
  process.exit(1);
}

const PROVIDERS = ['razorpay', 'cashfree', 'phonepe', 'paytm', 'stripe', 'easyecom', 'shiprocket', 'delhivery', 'shopify'];

async function main() {
  // ============================================================
  // 1. listCollections()
  // ============================================================
  console.log('--- Test Group 1: listCollections() ---');
  const summaries = api.listCollections();
  assert(Array.isArray(summaries) && summaries.length === 9, 'listCollections() returns 9 providers', `got ${summaries.length}`);
  assert(PROVIDERS.every((n) => summaries.some((c) => c.id === n)), 'All 9 provider ids are present');
  for (const c of summaries) {
    assert(c.requestCount > 0, `[${c.id}] valid endpoint count (${c.requestCount})`);
    assert(Array.isArray(c.folders) && c.folders.length > 0, `[${c.id}] has folders (${c.folders.length})`);
    assert(Array.isArray(c.categories) && c.categories.length > 0, `[${c.id}] has categories (${c.categories.join(',')})`);
    assert(typeof c.authScheme === 'string' && c.authScheme.length > 0, `[${c.id}] has auth scheme (${c.authScheme})`);
    assert(typeof c.docsUrl === 'string' && c.docsUrl.startsWith('http'), `[${c.id}] has docs URL`);
  }

  // ============================================================
  // 2. getCollection() & getEnvironment()
  // ============================================================
  console.log('\n--- Test Group 2: getCollection() & getEnvironment() ---');
  for (const n of PROVIDERS) {
    const col = api.getCollection(n);
    const env = api.getEnvironment(n);
    assert(col && col.info && String(col.info.schema).includes('v2.1.0'), `[${n}] collection loads with v2.1.0 schema`);
    assert(Array.isArray(col.item) && col.item.length > 0, `[${n}] collection has folders (${col.item.length})`);
    assert(env && Array.isArray(env.values) && env.values.length > 0, `[${n}] environment loads with variables (${env.values.length})`);
    assert(env._postman_variable_scope === 'environment', `[${n}] environment scope is 'environment'`);
  }
  let threw = false;
  try { api.getCollection('nonexistent'); } catch { threw = true; }
  assert(threw, 'getCollection() throws for unknown provider');

  // ============================================================
  // 3. interpolateVariables()
  // ============================================================
  console.log('\n--- Test Group 3: interpolateVariables() ---');
  const razorpay = api.getCollection('razorpay');
  const razorpayEnv = api.getEnvironment('razorpay');
  const fetchOrderReq = razorpay.item[0].item[1].request; // "Fetch Order by ID"
  const interpolated = api.interpolateVariables(fetchOrderReq, razorpayEnv);
  assert(
    interpolated.url.raw === 'https://api.razorpay.com/v1/orders/order_test_001',
    'interpolateVariables() replaces base_url + order_id',
    interpolated.url.raw,
  );
  assert(!interpolated.url.raw.includes('{{'), 'interpolateVariables() leaves no unresolved variables');
  assert(typeof api.resolveVariables === 'function', 'resolveVariables() is exported');

  // ============================================================
  // 4. generateCurl() & generateCodeSnippet()
  // ============================================================
  console.log('\n--- Test Group 4: generateCurl() & generateCodeSnippet() ---');
  const createOrderReq = razorpay.item[0].item[0].request; // "Create Order"
  const curl = api.generateCurl(createOrderReq, razorpayEnv, razorpay.auth);
  assert(curl.startsWith('curl --request POST'), 'cURL uses correct method');
  assert(curl.includes('--header'), 'cURL includes headers');
  assert(curl.includes('--data-raw'), 'cURL includes request body');
  assert(curl.includes('--user'), 'cURL includes basic auth');
  assert(curl.includes('https://api.razorpay.com/v1/orders'), 'cURL resolves base_url');
  assert(!curl.includes('{{razorpay_base_url}}'), 'cURL has no unresolved base_url');

  const snippet = api.generateCodeSnippet(createOrderReq, razorpayEnv, 'fetch');
  assert(snippet.includes('fetch(') && snippet.includes("method: 'POST'"), 'fetch snippet generated');
  assert(snippet.includes('body: JSON.stringify'), 'fetch snippet has body');
  const axiosSnippet = api.generateCodeSnippet(createOrderReq, razorpayEnv, 'axios');
  assert(axiosSnippet.includes('axios') && axiosSnippet.includes('data:'), 'axios snippet generated');
  const httpsSnippet = api.generateCodeSnippet(createOrderReq, razorpayEnv, 'node-https');
  assert(httpsSnippet.includes('https.request'), 'node-https snippet generated');

  // ============================================================
  // 5. exportToOpenAPI()
  // ============================================================
  console.log('\n--- Test Group 5: exportToOpenAPI() ---');
  const oa = api.exportToOpenAPI('razorpay');
  assert(oa.openapi === '3.0.3', 'OpenAPI version is 3.0.3', oa.openapi);
  assert(oa.info && typeof oa.info.title === 'string', 'OpenAPI has info.title');
  assert(oa.paths && Object.keys(oa.paths).length > 0, 'OpenAPI has paths', `${Object.keys(oa.paths).length} paths`);
  const firstPath = Object.keys(oa.paths)[0];
  const firstMethod = Object.keys(oa.paths[firstPath])[0];
  assert(['get', 'post', 'put', 'patch', 'delete'].includes(firstMethod), 'OpenAPI path has valid HTTP method', firstMethod);
  assert(Array.isArray(oa.servers) && oa.servers.length > 0, 'OpenAPI has servers');
  const stripeOa = api.exportToOpenAPI('stripe');
  assert(stripeOa.components.securitySchemes.bearerAuth, 'Stripe OpenAPI has bearerAuth security scheme');
  assert(oa.components.securitySchemes.basicAuth, 'Razorpay OpenAPI has basicAuth security scheme');

  // ============================================================
  // 6. exportToBruno()
  // ============================================================
  console.log('\n--- Test Group 6: exportToBruno() ---');
  const bruno = api.exportToBruno('razorpay');
  assert(bruno.brunoJson && bruno.brunoJson.version === '1', 'Bruno bruno.json has version 1');
  assert(bruno.brunoJson.type === 'collection', 'Bruno manifest type is collection');
  assert(Array.isArray(bruno.requests) && bruno.requests.length > 0, 'Bruno has request files', `${bruno.requests.length} requests`);
  assert(bruno.requests[0].content.includes('meta {'), 'Bruno request has meta block');
  assert(bruno.requests[0].content.includes('post {'), 'Bruno request has method block');
  assert(bruno.requests[0].file.endsWith('.bru'), 'Bruno request file ends with .bru');

  // ============================================================
  // 7. AI Toolkit (collectionTools / anthropicTools / mcpTools)
  // ============================================================
  console.log('\n--- Test Group 7: AI Toolkit ---');
  assert(Array.isArray(ai.collectionTools) && ai.collectionTools.length >= 5, 'collectionTools has >= 5 tools', `${ai.collectionTools.length}`);
  const requiredTools = ['list_api_collections', 'get_api_endpoints', 'generate_api_curl', 'convert_collection_format', 'generate_mock_response'];
  const toolNames = ai.collectionTools.map((t) => t.function && t.function.name);
  for (const name of requiredTools) {
    assert(toolNames.includes(name), `AI tool "${name}" is defined`);
  }
  for (const t of ai.collectionTools) {
    assert(t.type === 'function', `[${t.function.name}] OpenAI type === 'function'`);
    assert(t.function.parameters && t.function.parameters.type === 'object', `[${t.function.name}] has JSON-schema parameters`);
  }
  assert(Array.isArray(ai.anthropicTools) && ai.anthropicTools.length >= 5, 'anthropicTools defined');
  for (const t of ai.anthropicTools) {
    assert(t.input_schema && t.input_schema.type === 'object', `[${t.name}] anthropic input_schema valid`);
  }
  assert(Array.isArray(ai.mcpTools) && ai.mcpTools.length >= 5, 'mcpTools defined');
  for (const t of ai.mcpTools) {
    assert(t.inputSchema && t.inputSchema.type === 'object', `[${t.name}] MCP inputSchema valid`);
  }

  const listResult = ai.executeCollectionTool('list_api_collections', {});
  assert(Array.isArray(listResult) && listResult.length === 9, 'executeCollectionTool(list_api_collections) returns 9');
  const curlResult = ai.executeCollectionTool('generate_api_curl', { provider: 'razorpay', search: 'order' });
  assert(curlResult && typeof curlResult.curl === 'string' && curlResult.curl.startsWith('curl'), 'executeCollectionTool(generate_api_curl) works');
  const convResult = ai.executeCollectionTool('convert_collection_format', { provider: 'stripe', format: 'openapi' });
  assert(convResult && convResult.openapi === '3.0.3', 'executeCollectionTool(convert_collection_format) works');
  const mockResult = ai.executeCollectionTool('generate_mock_response', { provider: 'razorpay', statusCode: 201 });
  assert(mockResult && mockResult.statusCode === 201 && mockResult.body, 'executeCollectionTool(generate_mock_response) works');
  const prompt = ai.getCollectionSystemPrompt('stripe');
  assert(typeof prompt === 'string' && prompt.includes('Stripe') && prompt.includes('Bearer'), 'getCollectionSystemPrompt() returns context');

  // ============================================================
  // 8. CLI Smoke Test + exportToDirectory
  // ============================================================
  console.log('\n--- Test Group 8: CLI & exportToDirectory ---');
  const cliPath = path.join(__dirname, 'bin', 'cli.cjs');
  assert(fs.existsSync(cliPath), 'CLI executable exists');
  try {
    const listOut = execSync(`node "${cliPath}" list`, { encoding: 'utf8' });
    assert(listOut.includes('razorpay') && listOut.includes('shopify'), 'CLI "list" outputs all providers');
  } catch (e) {
    assert(false, 'CLI "list" runs without error', e.message);
  }
  try {
    const curlOut = execSync(`node "${cliPath}" curl razorpay "Create Order"`, { encoding: 'utf8' });
    assert(curlOut.includes('curl --request POST'), 'CLI "curl" prints a cURL command');
  } catch (e) {
    assert(false, 'CLI "curl" runs without error', e.message);
  }

  const exportDir = path.join(__dirname, 'temp_test_export');
  const exported = api.exportToDirectory('razorpay', exportDir, 'postman');
  assert(exported.length === 2 && fs.existsSync(exportDir), 'exportToDirectory (postman) writes files');
  const openapiFiles = api.exportToDirectory('stripe', exportDir, 'openapi');
  assert(openapiFiles.length === 1 && openapiFiles[0].endsWith('.openapi.json'), 'exportToDirectory (openapi) writes spec');
  const brunoFiles = api.exportToDirectory('shopify', exportDir, 'bruno');
  assert(brunoFiles.length > 1, 'exportToDirectory (bruno) writes manifest + requests', `${brunoFiles.length} files`);
  fs.rmSync(exportDir, { recursive: true, force: true });
  assert(!fs.existsSync(exportDir), 'cleaned up temp export directory');

  // ============================================================
  // Summary
  // ============================================================
  console.log('\n=======================================================');
  console.log(`📊 Test Results: ${passed} Passed | ${failed} Failed`);
  console.log('=======================================================\n');

  if (failed > 0) {
    console.error('❌ SOME TESTS FAILED');
    process.exit(1);
  } else {
    console.log('✨ ALL TESTS PASSED — @boostengine/collections v1.2.0 is enterprise-ready!');
  }
}

main().catch((err) => {
  console.error('\n❌ Test suite crashed:', err);
  process.exit(1);
});

