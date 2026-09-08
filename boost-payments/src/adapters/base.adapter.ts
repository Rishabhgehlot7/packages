import {
  GatewayName,
  UnifiedCreateOrderOptions,
  UnifiedOrderResult,
  UnifiedPaymentVerificationOptions,
  UnifiedPaymentVerificationResult,
  UnifiedRefundOptions,
  UnifiedRefundResult,
  WebhookVerificationOptions,
  WebhookVerificationResult,
} from '../types';

export abstract class BasePaymentAdapter {
  public abstract readonly name: GatewayName;

  /**
   * Create an order or payment session on the gateway.
   */
  public abstract createOrder(options: UnifiedCreateOrderOptions): Promise<UnifiedOrderResult>;

  /**
   * Verify checkout completion signature or status query.
   */
  public abstract verifyPayment(
    options: UnifiedPaymentVerificationOptions
  ): Promise<UnifiedPaymentVerificationResult>;

  /**
   * Initiate a refund back to the customer.
   */
  public abstract refund(options: UnifiedRefundOptions): Promise<UnifiedRefundResult>;

  /**
   * Verify server-to-server webhook authenticity and parse payload.
   */
  public abstract verifyWebhook(
    options: WebhookVerificationOptions
  ): Promise<WebhookVerificationResult>;

  /**
   * Safe helper to extract single string header value from request headers.
   */
  protected getHeader(
    headers: Record<string, string | string[] | undefined>,
    name: string
  ): string | undefined {
    const direct = headers[name] ?? headers[name.toLowerCase()] ?? headers[name.toUpperCase()];
    if (Array.isArray(direct)) return direct[0];
    return direct;
  }

  /**
   * Helper to perform HTTP JSON requests with standard error extraction.
   */
  protected async fetchJson<T = any>(
    url: string,
    options: {
      method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
      headers?: Record<string, string>;
      body?: any;
    } = {}
  ): Promise<T> {
    const { method = 'GET', headers = {}, body } = options;
    const requestHeaders: Record<string, string> = {
      Accept: 'application/json',
      ...headers,
    };

    let serializedBody: string | undefined;
    if (body !== undefined) {
      if (typeof body === 'string') {
        serializedBody = body;
      } else if (headers['Content-Type'] === 'application/x-www-form-urlencoded') {
        serializedBody = new URLSearchParams(body).toString();
      } else {
        requestHeaders['Content-Type'] = 'application/json';
        serializedBody = JSON.stringify(body);
      }
    }

    const res = await fetch(url, {
      method,
      headers: requestHeaders,
      body: serializedBody,
    });

    const text = await res.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    if (!res.ok) {
      const errMsg =
        data?.message ||
        data?.error?.description ||
        data?.error?.message ||
        data?.description ||
        (typeof data === 'string' ? data : `HTTP ${res.status} ${res.statusText}`);
      throw new Error(`[${this.name.toUpperCase()} API Error] ${errMsg}`);
    }

    return data as T;
  }
}
