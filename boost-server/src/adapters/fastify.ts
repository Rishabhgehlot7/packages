/**
 * @boostengine/server — Fastify Adapter
 *
 * `boostFastifyPlugin` is a standard Fastify plugin that mounts every
 * BoostEngine route group onto a Fastify instance. The `fastify` instance is
 * typed loosely so the adapter has zero hard dependency on Fastify.
 */

import { buildRouteDefinitions } from '../routes';
import type { BoostServerConfig } from '../types';

/**
 * Register all BoostEngine routes as a Fastify plugin.
 *
 * @example
 * ```ts
 * import Fastify from 'fastify';
 * import { boostFastifyPlugin } from '@boostengine/server/fastify';
 *
 * const fastify = Fastify();
 * fastify.register(boostFastifyPlugin, { businessName: 'My Store' });
 * fastify.listen({ port: 3000 });
 * ```
 */
export function boostFastifyPlugin(
  fastify: any,
  options: BoostServerConfig = {},
  done?: (err?: Error) => void,
): void {
  for (const def of buildRouteDefinitions(options)) {
    fastify.route({
      method: def.method,
      url: def.path,
      handler: async (request: any, reply: any) => {
        const result = await def.handler({
          params: request.params || {},
          query: request.query || {},
          body: request.body || {},
          headers: request.headers || {},
        });
        reply.code(result.status);
        return result.body;
      },
    });
  }

  if (done) done();
}
