// ============================================================
// @boostengine/seo — v1.1.0 — AI Agent Dispatcher
// Executes AI tool calls and dispatches responses
// ============================================================

import { allAITools, type AIToolDefinition } from './tools';

/**
 * Find a tool by name from the available tools registry
 */
export function findTool(name: string): AIToolDefinition | undefined {
  return allAITools.find((t) => t.name === name);
}

/**
 * Execute a tool call by name with the given arguments.
 * Returns the result directly or throws if not found.
 */
export function executeToolCall(name: string, args: Record<string, any>): any {
  const tool = findTool(name);
  if (!tool) {
    throw new Error(`Unknown AI tool: "${name}". Available tools: ${allAITools.map((t) => t.name).join(', ')}`);
  }
  return tool.execute(args);
}

/**
 * Convert all tools to OpenAI-compatible function definitions
 * (useful for direct integration with OpenAI SDK)
 */
export function toOpenAIFunctions() {
  return allAITools.map((tool) => ({
    type: 'function' as const,
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
    },
  }));
}

/**
 * Convert all tools to Anthropic Claude-compatible tool definitions
 */
export function toAnthropicTools() {
  return allAITools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    input_schema: tool.parameters,
  }));
}

export { allAITools };