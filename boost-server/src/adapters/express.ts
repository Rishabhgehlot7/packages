/**
 * @boostengine/server — Express Adapter
 *
 * `createBoostRouter(config)` returns a ready-to-mount Express `Router` with
 * every BoostEngine route group auto-mounted.
 */

import express from 'express';
import type { Router } from 'express';
import { buildRouteDefinitions } from '../routes';
import type { BoostServerConfig, RouteRequest } from '../types';

function toRouteRequest(req: any): RouteRequest {
  return {
    params: req.params || {},
    query: req.query || {},
    body: req.body || {},
    headers: req.headers || {},
  };
}

/**
 * Create a pre-configured Express Router with all @boostengine API routes.
 *
 * @example
 * ```ts
 * import express from 'express';
 * import { createBoostRouter } from '@boostengine/server';
 *
 * const app = express();
 * app.use(express.json());
 * app.use('/api', createBoostRouter({ businessName: 'My Store' }));
 * app.listen(3000);
 * ```
 */
export function createBoostRouter(config: BoostServerConfig = {}): Router {
  const router = express.Router();

  if (config.middleware && config.middleware.length > 0) {
    for (const mw of config.middleware) router.use(mw);
  }

  for (const def of buildRouteDefinitions(config)) {
    const method = def.method.toLowerCase();
    (router as any)[method](def.path, async (req: any, res: any) => {
      try {
        const result = await def.handler(toRouteRequest(req));
        res.status(result.status).json(result.body);
      } catch (err: any) {
        res.status(500).json({ success: false, error: err?.message || 'Internal Server Error' });
      }
    });
  }

  return router;
}

/** Backward-compatible alias for `createBoostRouter`. */
export const createBoostApiRouter = createBoostRouter;
