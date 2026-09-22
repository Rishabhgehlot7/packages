/**
 * @boostengine/server — AI Agent Toolkit
 *
 * Exposes the server router to coding agents and MCP servers: route discovery,
 * webhook payload generation/signature verification, and boilerplate
 * generation. Tools are described once as JSON Schema and converted on demand
 * into OpenAI, Anthropic, or MCP tool-schema shapes.
 */

import { buildRouteDefinitions } from '../routes';
import {
  generateWebhookPayload,
  signWebhookPayload,
  verifyWebhookSignature,
} from '../webhooks';
import type { BoostServerConfig, WebhookProvider } from '../types';

export interface JsonSchema {
  type?: 'object' | 'string' | 'number' | 'boolean' | 'array' | 'null';
  description?: string;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  items?: JsonSchema;
  enum?: Array<string | number>;
  additionalProperties?: boolean;
  [key: string]: any;
}

export interface ToolContext {
  config?: BoostServerConfig;
  [key: string]: any;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: JsonSchema;
  execute?: (
    args: Record<string, any>,
    context?: ToolContext,
  ) => any | Promise<any>;
}

/** Convert tool definitions to the OpenAI function-calling schema. */
export function toOpenAITools(tools: ToolDefinition[]): Array<Record<string, any>> {
  return tools.map((tool) => ({
    type: 'function',
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
    },
  }));
}

/** Convert tool definitions to the Anthropic `tools` schema. */
export function toAnthropicTools(tools: ToolDefinition[]): Array<Record<string, any>> {
  return tools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    input_schema: tool.parameters,
  }));
}

/** Convert tool definitions to an MCP `tools/list` response body. */
export function toMCPTools(tools: ToolDefinition[]): { tools: Array<Record<string, any>> } {
  return {
    tools: tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      inputSchema: tool.parameters,
    })),
  };
}

/** Generate a production-ready server setup source string for a framework. */
export function generateServerBoilerplate(
  framework: 'express' | 'fastify' | 'hono',
  config: BoostServerConfig = {},
): string {
  const opts = JSON.stringify({ businessName: config.businessName || 'My Store' }, null, 2);

  if (framework === 'fastify') {
    return [
      `import Fastify from 'fastify';`,
      `import { boostFastifyPlugin } from '@boostengine/server/fastify';`,
      ``,
      `const fastify = Fastify();`,
      ``,
      `fastify.register(boostFastifyPlugin, ${opts});`,
      ``,
      `fastify.listen({ port: 3000 }, (err) => {`,
      `  if (err) throw err;`,
      `  console.log('BoostEngine Fastify server on :3000');`,
      `});`,
    ].join('\n');
  }

  if (framework === 'hono') {
    return [
      `import { Hono } from 'hono';`,
      `import { boostHonoMiddleware } from '@boostengine/server/hono';`,
      ``,
      `const app = new Hono();`,
      `boostHonoMiddleware(app, ${opts});`,
      ``,
      `export default app;`,
    ].join('\n');
  }

  return [
    `import express from 'express';`,
    `import { createBoostRouter } from '@boostengine/server';`,
    ``,
    `const app = express();`,
    `app.use(express.json());`,
    ``,
    `app.use('/api', createBoostRouter(${opts}));`,
    ``,
    `app.listen(3000, () => console.log('BoostEngine server on http://localhost:3000'));`,
  ].join('\n');
}

const PROVIDER_ENUM = ['razorpay', 'cashfree', 'phonepe', 'paytm', 'stripe', 'shiprocket'];

/** Create the four server tools wired to a given config. */
export function createServerTools(config: BoostServerConfig = {}): ToolDefinition[] {
  return [
    {
      name: 'inspect_server_routes',
      description:
        'List all mounted server routes with their HTTP method, path, and description.',
      parameters: { type: 'object', properties: {}, additionalProperties: false },
      execute() {
        return buildRouteDefinitions(config).map((r) => ({
          method: r.method,
          path: r.path,
          name: r.name,
          description: r.description,
        }));
      },
    },
    {
      name: 'generate_webhook_payload',
      description:
        'Generate a valid mock webhook event payload (e.g. payment.captured, order.delivered).',
      parameters: {
        type: 'object',
        properties: {
          provider: { type: 'string', enum: PROVIDER_ENUM },
          event: { type: 'string', description: 'Event name, e.g. payment.captured' },
        },
        required: ['provider', 'event'],
        additionalProperties: false,
      },
      execute(args) {
        return generateWebhookPayload(args.provider as WebhookProvider, String(args.event));
      },
    },
    {
      name: 'verify_webhook_signature_tool',
      description:
        'Debug and test webhook signatures. Verifies a supplied signature and returns the expected one.',
      parameters: {
        type: 'object',
        properties: {
          provider: { type: 'string', enum: PROVIDER_ENUM },
          payload: { type: 'string', description: 'Raw webhook body string.' },
          signature: { type: 'string', description: 'Signature to verify (optional).' },
          secret: { type: 'string', description: 'Webhook secret.' },
          timestamp: { type: 'string', description: 'Epoch timestamp for Cashfree/Stripe.' },
        },
        required: ['provider', 'payload', 'secret'],
        additionalProperties: false,
      },
      execute(args) {
        const provider = args.provider as WebhookProvider;
        const payload = String(args.payload);
        const secret = String(args.secret);
        const options = { timestamp: args.timestamp ? String(args.timestamp) : undefined };
        const expected = signWebhookPayload(provider, payload, secret, options);
        const supplied = args.signature ? String(args.signature) : undefined;
        return {
          provider,
          valid: supplied ? verifyWebhookSignature(provider, payload, supplied, secret, options) : null,
          expected,
          supplied: supplied ?? null,
        };
      },
    },
    {
      name: 'generate_server_boilerplate',
      description:
        'Generate production-ready Express, Fastify, or Hono server setup code.',
      parameters: {
        type: 'object',
        properties: {
          framework: { type: 'string', enum: ['express', 'fastify', 'hono'] },
          businessName: { type: 'string' },
        },
        required: ['framework'],
        additionalProperties: false,
      },
      execute(args) {
        const framework = args.framework as 'express' | 'fastify' | 'hono';
        return {
          framework,
          source: generateServerBoilerplate(framework, { businessName: args.businessName }),
        };
      },
    },
  ];
}

/** The default server tools. */
export const serverTools: ToolDefinition[] = createServerTools();

/**
 * Return a system prompt guiding AI coding agents on mounting BoostEngine
 * routers, configuring environment variables, and handling webhook idempotency.
 */
export function getServerSystemPrompt(): string {
  return [
    'You are a BoostEngine server integration assistant.',
    '',
    '@boostengine/server is a universal headless e-commerce API router for Express, Fastify, and Hono.',
    '',
    'Mounting:',
    '  - Express: app.use("/api", createBoostRouter(config))',
    '  - Fastify: fastify.register(boostFastifyPlugin, config)',
    '  - Hono:    boostHonoMiddleware(app, config)',
    '',
    'Environment variables: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, SHIPROCKET_EMAIL, SHIPROCKET_PASSWORD, FAST2SMS_API_KEY, GST_NUMBER.',
    '',
    'Webhook security:',
    '  - Verify signatures with verifyWebhookSignature(provider, rawBody, signature, secret).',
    '  - Use an idempotency-key header and createIdempotencyHandler to deduplicate webhook events.',
    '  - Use createRateLimiter to protect public endpoints.',
    '',
    'Always return type-safe TypeScript that compiles under strict mode.',
  ].join('\n');
}
