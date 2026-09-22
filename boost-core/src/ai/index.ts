/**
 * @boostengine/core — AI Agent Toolkit
 *
 * Exposes the BoostEngine kernel to coding agents and MCP (Model Context
 * Protocol) servers. Tools are described once with a JSON Schema and converted
 * on demand into OpenAI, Anthropic, or MCP tool-schema shapes.
 */

import { getDefaultEngine, type BoostEngine } from '../plugins';

/** A minimal, self-contained JSON Schema subset for describing tool inputs. */
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
  engine?: BoostEngine;
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

const EMPTY_SCHEMA: JsonSchema = { type: 'object', properties: {}, additionalProperties: false };

/** Generate a type-safe plugin scaffold source string. */
export function generatePluginBoilerplate(args: Record<string, any>): string {
  const id = String(args.id ?? 'boost-plugin');
  const name = String(args.name ?? 'My Plugin');
  const description = String(args.description ?? 'A BoostEngine plugin.');
  const category = String(args.category ?? 'operations');
  const deps = Array.isArray(args.dependencies) ? args.dependencies : [];

  const lines = [
    `import type { BoostPlugin } from '@boostengine/core';`,
    ``,
    `export const plugin: BoostPlugin = {`,
    `  id: '${id}',`,
    `  name: '${name}',`,
    `  version: '1.0.0',`,
    `  description: '${description}',`,
    `  category: '${category}',`,
  ];

  if (deps.length) {
    lines.push(`  dependencies: [${deps.map((d: string) => `'${d}'`).join(', ')}],`);
  }

  lines.push(
    ``,
    `  async init(context) {`,
    `    console.log('[${id}] init', context.config);`,
    `  },`,
    ``,
    `  async registerHooks(engine) {`,
    `    engine.hooks.addAction('order:created', async (order) => {});`,
    `  },`,
    ``,
    `  async boot() {},`,
    ``,
    `  async shutdown() {},`,
    `};`,
  );

  return lines.join('\n');
}

/** Create the four core debugging/reflection tools wired to a kernel. */
export function createCoreTools(engine?: BoostEngine): ToolDefinition[] {
  const resolve = (): BoostEngine => engine ?? getDefaultEngine();

  return [
    {
      name: 'inspect_engine_state',
      description:
        'Inspect the registered plugins, active action/filter hooks, event listeners and configuration of a BoostEngine kernel.',
      parameters: EMPTY_SCHEMA,
      async execute() {
        return resolve().inspect();
      },
    },
    {
      name: 'trigger_engine_event',
      description:
        'Dispatch a synthetic event onto the kernel event bus to test system reactions and integrations.',
      parameters: {
        type: 'object',
        properties: {
          topic: { type: 'string', description: 'Event topic, e.g. "payment.success".' },
          payload: { type: 'object', description: 'Event payload.' },
        },
        required: ['topic'],
        additionalProperties: false,
      },
      async execute(args) {
        await resolve().events.emit(args.topic, args.payload ?? {});
        return { ok: true, topic: args.topic };
      },
    },
    {
      name: 'evaluate_filter_pipeline',
      description:
        'Evaluate how registered filters transform a value (e.g. cart discounts, tax calculations).',
      parameters: {
        type: 'object',
        properties: {
          tag: { type: 'string', description: 'Filter hook tag to evaluate.' },
          value: { description: 'Initial value passed into the filter pipeline.' },
          args: {
            type: 'array',
            description: 'Additional arguments forwarded to each filter.',
            items: {},
          },
        },
        required: ['tag', 'value'],
        additionalProperties: false,
      },
      async execute(args) {
        const result = await resolve().hooks.applyFilters(
          args.tag,
          args.value,
          ...(Array.isArray(args.args) ? args.args : []),
        );
        return { tag: args.tag, result };
      },
    },
    {
      name: 'generate_plugin_boilerplate',
      description:
        'Scaffold a type-safe @boostengine plugin structure with proper typing and lifecycle hooks.',
      parameters: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'Unique plugin id.' },
          name: { type: 'string', description: 'Human-readable plugin name.' },
          description: { type: 'string', description: 'Short description.' },
          category: {
            type: 'string',
            enum: ['marketing', 'operations', 'payments', 'sales', 'engagement', 'analytics', 'inventory'],
          },
          dependencies: {
            type: 'array',
            items: { type: 'string' },
            description: 'IDs of plugins this plugin depends on.',
          },
        },
        required: ['id'],
        additionalProperties: false,
      },
      execute(args) {
        return { id: args.id, source: generatePluginBoilerplate(args) };
      },
    },
  ];
}

/** The default core tools, wired to the process-wide default engine. */
export const coreTools: ToolDefinition[] = createCoreTools();

/**
 * Return a system prompt guiding coding agents on how to build custom
 * plugins, extend hook pipelines, and adhere to BoostEngine standards.
 */
export function getCoreSystemPrompt(): string {
  return [
    'You are a BoostEngine plugin authoring assistant.',
    '',
    'BoostEngine is a WordPress/Shopify-style modular runtime for e-commerce.',
    'Build custom plugins by exporting an object implementing the BoostPlugin interface:',
    '  - id, name, version are required.',
    '  - init(context) runs first to read settings and prepare resources.',
    '  - registerHooks(engine) wires actions (addAction/doAction), filters (addFilter/applyFilters) and event-bus listeners.',
    '  - boot() runs after every plugin has registered hooks.',
    '  - shutdown() cleans up resources.',
    '  - dependencies lists other plugin ids that must register first.',
    '',
    'Architectural standards:',
    '  - Prefer integer-safe monetary arithmetic via addMoney/subtractMoney/multiplyMoney/convertMoney/formatMoney.',
    '  - Use the shared data models (Money, Order, LineItem, Customer, Address, PaymentSession).',
    '  - Emit and subscribe to domain events (auth.*, cart.*, checkout.*, payment.*, order.*, inventory.*, shipping.*).',
    '  - Keep plugins side-effect safe: a failing listener must not break the kernel.',
    '',
    'Always return type-safe TypeScript that compiles under strict mode.',
  ].join('\n');
}


