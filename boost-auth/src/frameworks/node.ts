import { BoostAuth } from '../manager';

/**
 * Universal Node.js Middleware for Express, Fastify, Connect, and NestJS
 * Usage (Express):
 *   app.use('/api/auth', toNodeHandler(auth));
 * Usage (NestJS Middleware):
 *   consumer.apply(toNodeHandler(auth)).forRoutes('/api/auth');
 */
export function toNodeHandler(auth: BoostAuth) {
  return async (req: any, res: any, next?: () => void) => {
    try {
      const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
      const host = req.headers['x-forwarded-host'] || req.headers.host || 'localhost:3000';
      const fullUrl = `${protocol}://${host}${req.originalUrl || req.url}`;

      const headers = new Headers();
      for (const [key, value] of Object.entries(req.headers)) {
        if (Array.isArray(value)) {
          value.forEach((v) => headers.append(key, v));
        } else if (value) {
          headers.set(key, value as string);
        }
      }

      let body: any = undefined;
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        if (req.body) {
          body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
        } else {
          // Read stream if body parser was not used
          body = await new Promise<string>((resolve, reject) => {
            let data = '';
            req.on('data', (chunk: any) => (data += chunk));
            req.on('end', () => resolve(data));
            req.on('error', reject);
          });
        }
      }

      const webRequest = new Request(fullUrl, {
        method: req.method,
        headers,
        body: body ? body : undefined,
      });

      const webResponse = await auth.handleRequest(webRequest);

      res.statusCode = webResponse.status;

      // Handle headers and multiple cookies
      webResponse.headers.forEach((val, key) => {
        if (key.toLowerCase() === 'set-cookie') {
          // In Node res.setHeader('set-cookie', [...])
          const existing = res.getHeader('set-cookie');
          if (Array.isArray(existing)) {
            res.setHeader('set-cookie', [...existing, val]);
          } else if (existing) {
            res.setHeader('set-cookie', [existing, val]);
          } else {
            res.setHeader('set-cookie', val);
          }
        } else {
          res.setHeader(key, val);
        }
      });

      const text = await webResponse.text();
      res.end(text);
    } catch (err: any) {
      if (typeof next === 'function') {
        next();
      } else {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message || 'Internal Server Error' }));
      }
    }
  };
}
