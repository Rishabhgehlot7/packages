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
 * Direct Server-Side Session Fetcher for Next.js React Server Components (RSC) and Server Actions.
 * Usage in app/dashboard/page.tsx:
 *   const session = await getServerSession(auth);
 */
export async function getServerSession(auth: BoostAuth, context?: any) {
  return await auth.getServerSession(context);
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

export interface AuthMiddlewareOptions {
  /**
   * Routes that require authentication (e.g. ['/dashboard', '/checkout', '/account'])
   */
  protectedRoutes?: string[];
  /**
   * Route where unauthenticated users should be redirected (default: '/login')
   */
  loginUrl?: string;
  /**
   * Where to redirect logged-in users if they visit loginUrl (e.g. '/dashboard')
   */
  afterLoginUrl?: string;
  /**
   * Roles allowed for specific route prefixes (e.g. { '/admin': ['admin'] })
   */
  rolePermissions?: Record<string, string[]>;
}

/**
 * 1-Line Route Protection Middleware for Next.js (middleware.ts)
 * Usage:
 * // middleware.ts
 * import { createAuthMiddleware } from '@boostengine/auth';
 * import { auth } from '@/lib/auth';
 *
 * export default createAuthMiddleware(auth, {
 *   protectedRoutes: ['/dashboard', '/account'],
 *   loginUrl: '/login',
 * });
 * export const config = { matcher: ['/dashboard/:path*', '/account/:path*', '/login'] };
 */
export function createAuthMiddleware(auth: BoostAuth, options: AuthMiddlewareOptions = {}) {
  const protectedRoutes = options.protectedRoutes || [];
  const loginUrl = options.loginUrl || '/login';
  const afterLoginUrl = options.afterLoginUrl;
  const rolePermissions = options.rolePermissions || {};

  return async (request: any) => {
    const url = new URL(request.url);
    const pathname = url.pathname;

    const token = auth.extractSessionToken(request.headers);
    const session = token ? auth.verifySession(token) : { isValid: false, user: undefined };
    const isAuthenticated = session.isValid && !!session.user;

    // 1. If authenticated user tries to visit login page -> redirect to afterLoginUrl
    if (isAuthenticated && afterLoginUrl && pathname === loginUrl) {
      return Response.redirect(new URL(afterLoginUrl, request.url));
    }

    // 2. Check if route is protected
    const isProtected = protectedRoutes.some((route) =>
      pathname === route || pathname.startsWith(route + '/')
    );

    if (isProtected && !isAuthenticated) {
      const redirectTarget = new URL(loginUrl, request.url);
      redirectTarget.searchParams.set('callbackUrl', pathname);
      return Response.redirect(redirectTarget);
    }

    // 3. Role-based checks
    if (isAuthenticated && session.user) {
      for (const [prefix, allowedRoles] of Object.entries(rolePermissions)) {
        if (pathname === prefix || pathname.startsWith(prefix + '/')) {
          const userRole = session.user.role || 'customer';
          if (!allowedRoles.includes(userRole)) {
            return new Response('Access Forbidden: Insufficient Permissions', { status: 403 });
          }
        }
      }
    }

    // 4. Sliding Session Auto-Renewal
    // If session is valid and older than 50% of its lifetime, auto-renew cookie
    if (isAuthenticated && session.user && session.user.exp && session.user.iat) {
      const now = Math.floor(Date.now() / 1000);
      const totalDuration = session.user.exp - session.user.iat;
      const elapsed = now - session.user.iat;

      if (elapsed > totalDuration / 2) {
        const renewed = auth.createSession(session.user);
        const res = new Response(null, { status: 200, headers: { 'x-middleware-next': '1' } });
        res.headers.set('Set-Cookie', renewed.cookie.headerString);
        return res;
      }
    }

    // Allow through
    return new Response(null, {
      status: 200,
      headers: { 'x-middleware-next': '1' },
    });
  };
}
