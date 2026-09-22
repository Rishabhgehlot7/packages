/**
 * @boostengine/server — Shared Types
 * Framework-agnostic configuration and route primitives shared by the
 * Express, Fastify, and Hono adapters.
 */

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/** Supported payment/logistics webhook providers. */
export type WebhookProvider =
  | 'razorpay'
  | 'cashfree'
  | 'phonepe'
  | 'paytm'
  | 'stripe'
  | 'shiprocket';

/** Framework-agnostic middleware function (Express-style `(req, res, next)`). */
export type BoostMiddleware = (
  req: any,
  res: any,
  next: (err?: any) => void,
) => void;

export interface BoostServerConfig {
  /** Razorpay key id (for payment routes). */
  razorpayKeyId?: string;
  /** Razorpay key secret (for payment routes). */
  razorpayKeySecret?: string;
  /** Shiprocket email (for logistics routes). */
  shiprocketEmail?: string;
  /** Shiprocket password (for logistics routes). */
  shiprocketPassword?: string;
  /** Fast2SMS API key (for OTP auth routes). */
  fast2smsApiKey?: string;
  /** GST number of the business (for invoicing routes). */
  gstNumber?: string;
  /** Business name for invoices. */
  businessName?: string;
  /** Enable mock/simulation mode when credentials are not provided (default: true). */
  mockMode?: boolean;
  /** Per-provider webhook secrets used for signature verification. */
  webhookSecrets?: Partial<Record<WebhookProvider, string>>;
  /** Enable/disable specific route groups. */
  enable?: {
    payments?: boolean;
    shipping?: boolean;
    auth?: boolean;
    cart?: boolean;
    coupons?: boolean;
    returns?: boolean;
    invoicing?: boolean;
    notifications?: boolean;
  };
  /** Custom middleware to run before each route group. */
  middleware?: BoostMiddleware[];
  /** Prefix for all routes (default: ''). */
  prefix?: string;
  [key: string]: any;
}

/** A normalized, framework-agnostic incoming request. */
export interface RouteRequest {
  params: Record<string, string>;
  query: Record<string, string>;
  body: any;
  headers: Record<string, string>;
}

/** A normalized route response. */
export interface RouteResult {
  status: number;
  body: any;
}

export interface RouteDefinition {
  method: HttpMethod;
  /** Full path including any configured prefix (e.g. `/payments/create-order`). */
  path: string;
  /** Stable identifier (e.g. `payments.create-order`). */
  name: string;
  description?: string;
  handler: (req: RouteRequest) => RouteResult | Promise<RouteResult>;
  queryParams?: Array<{ name: string; required?: boolean; description?: string }>;
  bodySchema?: Record<string, any>;
}
