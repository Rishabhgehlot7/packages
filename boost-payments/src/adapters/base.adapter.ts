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
   * Helper to perform HTTP JSON requests with standard error extraction, timeouts, and idempotency.
   */
  protected async fetchJson<T = any>(
    url: string,
    options: {
      method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
      headers?: Record<string, string>;
      body?: any;
      timeoutMs?: number;
      idempotencyKey?: string;
      retries?: number;
    } = {}
  ): Promise<T> {
    const { method = 'GET', headers = {}, body, timeoutMs = 15000, idempotencyKey, retries = 0 } = options;
    const requestHeaders: Record<string, string> = {
      Accept: 'application/json',
      ...headers,
    };

    if (idempotencyKey) {
      requestHeaders['Idempotency-Key'] = idempotencyKey;
    }

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

    let attempt = 0;
    const maxAttempts = Math.max(1, retries + 1);

    while (attempt < maxAttempts) {
      attempt++;
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : undefined;
      const timeoutId = controller && timeoutMs ? setTimeout(() => controller.abort(), timeoutMs) : undefined;

      try {
        const res = await fetch(url, {
          method,
          headers: requestHeaders,
          body: serializedBody,
          signal: controller?.signal,
        });

        if (timeoutId) clearTimeout(timeoutId);

        const text = await res.text();
        let data: any;
        try {
          data = JSON.parse(text);
        } catch {
          data = text;
        }

        if (!res.ok) {
          // Retry on 502, 503, 504 if attempts remain
          if ((res.status === 502 || res.status === 503 || res.status === 504) && attempt < maxAttempts) {
            const delay = Math.min(2000, 300 * Math.pow(2, attempt));
            await new Promise((r) => setTimeout(r, delay));
            continue;
          }

          const errMsg =
            data?.message ||
            data?.error?.description ||
            data?.error?.message ||
            data?.description ||
            (typeof data === 'string' ? data : `HTTP ${res.status} ${res.statusText}`);
          throw new Error(`[${this.name.toUpperCase()} API Error] ${errMsg}`);
        }

        return data as T;
      } catch (err: any) {
        if (timeoutId) clearTimeout(timeoutId);

        const isTimeout = err.name === 'AbortError' || err.message?.includes('aborted');
        if (isTimeout) {
          throw new Error(`[${this.name.toUpperCase()} API Error] Request timed out after ${timeoutMs}ms.`);
        }

        // Retry on network errors if attempts remain
        if (attempt < maxAttempts) {
          const delay = Math.min(2000, 300 * Math.pow(2, attempt));
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }

        throw err;
      }
    }

    throw new Error(`[${this.name.toUpperCase()} API Error] Request failed after ${maxAttempts} attempts.`);
  }
}

