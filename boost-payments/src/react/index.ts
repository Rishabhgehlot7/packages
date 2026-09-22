'use client';

import { useState, useCallback } from 'react';
import { BoostPaymentOpenOptions } from '../types';
import { createPaymentCheckout, loadScript, loadRazorpay, loadCashfree } from '../client';

export { loadScript, loadRazorpay, loadCashfree };
export const openPaymentModal = createPaymentCheckout;

/**
 * Universal React Hook for payment checkout in Next.js / React / React Native WebView.
 * Supports eCommerce, Digital Products, SaaS Subscriptions, and Donations.
 */
export function useBoostPayment() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startPayment = useCallback(async (options: BoostPaymentOpenOptions) => {
    setIsProcessing(true);
    setError(null);

    try {
      await createPaymentCheckout({
        ...options,
        onSuccess: (res) => {
          setIsProcessing(false);
          options.onSuccess(res);
        },
        onFailure: (err) => {
          setIsProcessing(false);
          setError(err.message);
          options.onFailure?.(err);
        },
        onDismiss: () => {
          setIsProcessing(false);
          options.onDismiss?.();
        },
      });
    } catch (err: any) {
      setIsProcessing(false);
      setError(err.message);
      options.onFailure?.({
        gateway: options.order.gateway,
        message: err.message || 'Payment initiation failed',
        rawError: err,
      });
    }
  }, []);

  return {
    openPaymentModal: startPayment,
    isProcessing,
    error,
  };
}
