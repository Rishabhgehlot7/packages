import { BoostAuth } from '../manager';

export interface NextJsHandlers {
  GET: (request: Request) => Promise<Response>;
  POST: (request: Request) => Promise<Response>;
}

/**
 * 1-Line Route Handler for Next.js App Router
 * Usage:
 * // app/api/auth/[...boost]/route.ts
 * export const { GET, POST } = toNextJsHandler(auth);
 */
export function toNextJsHandler(auth: BoostAuth): NextJsHandlers {
  const handler = async (request: Request): Promise<Response> => {
    return await auth.handleRequest(request);
  };

  return {
    GET: handler,
    POST: handler,
  };
}

/**
 * Handler for Next.js Pages Router
 * Usage:
 * // pages/api/auth/[...boost].ts
 * export default toPagesHandler(auth);
 */
export function toPagesHandler(auth: BoostAuth) {
  return async (req: any, res: any) => {
    // Construct full URL
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const url = new URL(req.url, `${protocol}://${host}`);

    // Create web-standard headers
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (Array.isArray(value)) {
        value.forEach((v) => headers.append(key, v));
      } else if (value) {
        headers.set(key, value as string);
      }
    }

    const init: RequestInit = {
      method: req.method,
      headers,
    };

    if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
      init.body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    }

    const webRequest = new Request(url.toString(), init);
    const webResponse = await auth.handleRequest(webRequest);

    // Write back response
    res.status(webResponse.status);

    webResponse.headers.forEach((val, key) => {
      res.setHeader(key, val);
    });

    const bodyText = await webResponse.text();
    res.send(bodyText);
  };
}
