/**
 * @boostengine/server — Hono Adapter
 *
 * `boostHonoMiddleware` mounts every BoostEngine route group onto a Hono app,
 * making the router usable on Edge/Cloudflare Workers runtimes. The app is
 * typed loosely so the adapter has zero hard dependency on Hono.
 */

import { buildRouteDefinitions } from '../routes';
import type { BoostServerConfig } from '../types';

/**
 * Mount all BoostEngine routes onto a Hono app.
 *
 * @example
 * ```ts
 * import { Hono } from 'hono';
 * import { boostHonoMiddleware } from '@boostengine/server/hono';
 *
 * const app = new Hono();
 * boostHonoMiddleware(app, { businessName: 'My Store' });
 * export default app;
 * ```
 */
export function boostHonoMiddleware(app: any, config: BoostServerConfig = {}): void {
  for (const def of buildRouteDefinitions(config)) {
    app.on(def.method, def.path, async (c: any) => {
      let body: any = {};
      try {
        body = await c.req.json();
      } catch {
        body = {};
      }

      const result = await def.handler({
        params: c.req.param ? c.req.param() : {},
        query: c.req.query ? c.req.query() : {},
        body,
        headers: c.req.header ? c.req.header() : {},
      });

      c.status(result.status);
      return c.json(result.body);
    });
  }
}
