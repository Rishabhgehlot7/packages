import { GatewayName } from '../types';

export class PaymentError extends Error {
  public readonly gateway?: GatewayName;
  public readonly statusCode?: number;
  public readonly rawError?: any;

  constructor(message: string, options?: { gateway?: GatewayName; statusCode?: number; rawError?: any }) {
    super(message);
    this.name = 'PaymentError';
    this.gateway = options?.gateway;
    this.statusCode = options?.statusCode;
    this.rawError = options?.rawError;
    Object.setPrototypeOf(this, PaymentError.prototype);
  }
}

export class GatewayNotConfiguredError extends PaymentError {
  constructor(gateway: GatewayName) {
    super(`Payment gateway '${gateway}' is not configured in PaymentManager.`, { gateway, statusCode: 400 });
    this.name = 'GatewayNotConfiguredError';
    Object.setPrototypeOf(this, GatewayNotConfiguredError.prototype);
  }
}

export class SignatureVerificationError extends PaymentError {
  constructor(gateway: GatewayName, details?: string) {
    super(`Invalid webhook/payment signature for gateway '${gateway}'. ${details || ''}`.trim(), {
      gateway,
      statusCode: 401,
    });
    this.name = 'SignatureVerificationError';
    Object.setPrototypeOf(this, SignatureVerificationError.prototype);
  }
}
