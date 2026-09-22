/**
 * @boostengine/core
 * WordPress/Shopify-style modular plugin runtime & event hook architecture for
 * BoostEngine eCommerce stores.
 *
 * Central kernel exporting:
 *   - action/filter hooks
 *   - decoupled event bus + domain events
 *   - modular plugin runtime with lifecycle & health checks
 *   - reactive store primitive
 *   - currency/money engine & shared type primitives
 *
 * The AI agent toolkit is a separate entry point: `@boostengine/core/ai`.
 */

export * from './types';
export * from './money';
export * from './hooks';
export * from './events';
export * from './store';
export * from './plugins';
