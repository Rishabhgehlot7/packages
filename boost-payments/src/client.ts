import { BoostPaymentOpenOptions, GatewayName } from './types';

/**
 * Dynamically loads an external script into browser document safely
 */
export function loadScript(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return resolve(false);
    }
    if (document.querySelector(`script[src="${src}"]`)) {
      return resolve(true);
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export async function loadRazorpay(): Promise<boolean> {
  return loadScript('https://checkout.razorpay.com/v1/checkout.js');
}

export async function loadCashfree(): Promise<boolean> {
  return loadScript('https://sdk.cashfree.com/js/v3/cashfree.js');
}

/**
 * Universal Framework-Agnostic Checkout Launcher
 * Compatible with React, Vue 3, Svelte, Angular, Vanilla JS, and Mobile WebViews.
 */
export async function createPaymentCheckout(options: BoostPaymentOpenOptions): Promise<void> {
  const { order, onSuccess, onFailure, onDismiss, name, description, image, themeColor, prefill } = options;

  // React Native / Non-DOM environment guard
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    if (order.redirectUrl) {
      // In React Native, the caller handles Linking.openURL(order.redirectUrl)
      return;
    }
    if (order.upiIntent?.upiUri) {
      return;
    }
    throw new Error('createPaymentCheckout requires browser DOM or mobile redirectUrl.');
  }

  const gateway = order.gateway;

  // 1. RAZORPAY MODAL
  if (gateway === 'razorpay') {
    const loaded = await loadRazorpay();
    if (!loaded) {
      onFailure?.({ gateway: 'razorpay', message: 'Failed to load Razorpay checkout SDK.' });
      return;
    }

    const RazorpayConstructor = (window as any).Razorpay;
    if (!RazorpayConstructor) {
      onFailure?.({ gateway: 'razorpay', message: 'Razorpay SDK is not available on window.' });
      return;
    }

    const rzpOptions = {
      key: (order.rawResponse as any)?.key || (order.rawResponse as any)?.key_id,
      amount: Math.round(order.amount * 100),
      currency: order.currency,
      name: name || 'Checkout',
      description: description || `Order #${order.orderId}`,
      image: image,
      order_id: order.gatewayOrderId,
      prefill: prefill || {},
      theme: {
        color: themeColor || '#3399cc',
      },
      handler: function (response: any) {
        onSuccess({
          gateway: 'razorpay',
          orderId: order.orderId,
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
          rawResponse: response,
        });
      },
      modal: {
        ondismiss: function () {
          onDismiss?.();
        },
      },
    };

    const rzp = new RazorpayConstructor(rzpOptions);
    rzp.on('payment.failed', function (resp: any) {
      onFailure?.({
        gateway: 'razorpay',
        message: resp.error?.description || 'Payment was declined',
        rawError: resp.error,
      });
    });
    rzp.open();
    return;
  }

  // 2. CASHFREE DROP-IN
  if (gateway === 'cashfree') {
    if (order.paymentSessionId) {
      const loaded = await loadCashfree();
      if (!loaded) {
        onFailure?.({ gateway: 'cashfree', message: 'Failed to load Cashfree SDK.' });
        return;
      }

      const CashfreeConstructor = (window as any).Cashfree;
      if (CashfreeConstructor) {
        const isSandbox =
          order.paymentSessionId.includes('test') || (order.rawResponse as any)?.environment === 'SANDBOX';
        const cashfree = CashfreeConstructor({ mode: isSandbox ? 'sandbox' : 'production' });
        cashfree.checkout({
          paymentSessionId: order.paymentSessionId,
          redirectTarget: '_self',
        });
        return;
      }
    }

    if (order.redirectUrl) {
      window.location.href = order.redirectUrl;
      return;
    }

    onFailure?.({ gateway: 'cashfree', message: 'No payment session ID or redirect URL found for Cashfree.' });
    return;
  }

  // 3. PHONEPE / STRIPE / PAYTM REDIRECT
  if (gateway === 'phonepe' || gateway === 'stripe' || gateway === 'paytm') {
    if (order.redirectUrl) {
      window.location.href = order.redirectUrl;
      return;
    }
    onFailure?.({ gateway, message: `No redirect URL returned for ${gateway} checkout.` });
    return;
  }

  // 4. CASH ON DELIVERY (COD)
  if (gateway === 'cod') {
    onSuccess({
      gateway: 'cod',
      orderId: order.orderId,
      paymentId: `COD_${order.orderId}`,
      rawResponse: order.rawResponse,
    });
    return;
  }

  onFailure?.({ gateway, message: `Unsupported checkout gateway: ${gateway}` });
}
