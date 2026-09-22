/**
 * @boostengine/server
 * Plug-and-Play Headless eCommerce API Router for Express, Fastify & Hono.
 *
 * Main entry point exposes the Express adapter plus the shared webhook,
 * middleware, and route-table primitives. Fastify and Hono adapters live in
 * their own subpath entries (`@boostengine/server/fastify`, `.../hono`).
 */

export * from './types';
export * from './webhooks';
export * from './middleware';
export * from './routes';
export { createBoostRouter, createBoostApiRouter } from './adapters/express';

export type { Request, Response, NextFunction, Router } from 'express';
