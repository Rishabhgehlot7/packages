'use client';
'use strict';

var react = require('react');

function loadScript(src) {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      return resolve(false);
    }
    if (document.querySelector(`script[src="${src}"]`)) {
      return resolve(true);
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}
async function loadRazorpay() {
  return loadScript("https://checkout.razorpay.com/v1/checkout.js");
}
async function loadCashfree() {
  return loadScript("https://sdk.cashfree.com/js/v3/cashfree.js");
}
async function openPaymentModal(options) {
  const { order, onSuccess, onFailure, onDismiss, name, description, image, themeColor, prefill } = options;
  if (typeof window === "undefined") {
    throw new Error("openPaymentModal can only be called in a browser environment.");
  }
  const gateway = order.gateway;
  if (gateway === "razorpay") {
    const loaded = await loadRazorpay();
    if (!loaded) {
      onFailure?.({ gateway: "razorpay", message: "Failed to load Razorpay checkout SDK." });
      return;
    }
    const RazorpayConstructor = window.Razorpay;
    if (!RazorpayConstructor) {
      onFailure?.({ gateway: "razorpay", message: "Razorpay SDK is not available on window." });
      return;
    }
    const rzpOptions = {
      key: order.rawResponse?.key || order.rawResponse?.key_id,
      amount: Math.round(order.amount * 100),
      currency: order.currency,
      name: name || "Order Checkout",
      description: description || `Payment for order #${order.orderId}`,
      image,
      order_id: order.gatewayOrderId,
      prefill: prefill || {},
      theme: {
        color: themeColor || "#3399cc"
      },
      handler: function(response) {
        onSuccess({
          gateway: "razorpay",
          orderId: order.orderId,
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
          rawResponse: response
        });
      },
      modal: {
        ondismiss: function() {
          onDismiss?.();
        }
      }
    };
    const rzp = new RazorpayConstructor(rzpOptions);
    rzp.on("payment.failed", function(resp) {
      onFailure?.({
        gateway: "razorpay",
        message: resp.error?.description || "Payment was declined",
        rawError: resp.error
      });
    });
    rzp.open();
    return;
  }
  if (gateway === "cashfree") {
    if (order.paymentSessionId) {
      const loaded = await loadCashfree();
      if (!loaded) {
        onFailure?.({ gateway: "cashfree", message: "Failed to load Cashfree SDK." });
        return;
      }
      const CashfreeConstructor = window.Cashfree;
      if (CashfreeConstructor) {
        const isSandbox = order.paymentSessionId.includes("test") || order.rawResponse?.environment === "SANDBOX";
        const cashfree = CashfreeConstructor({ mode: isSandbox ? "sandbox" : "production" });
        cashfree.checkout({
          paymentSessionId: order.paymentSessionId,
          redirectTarget: "_self"
        });
        return;
      }
    }
    if (order.redirectUrl) {
      window.location.href = order.redirectUrl;
      return;
    }
    onFailure?.({ gateway: "cashfree", message: "No payment session ID or redirect URL found for Cashfree order." });
    return;
  }
  if (gateway === "phonepe" || gateway === "stripe" || gateway === "paytm") {
    if (order.redirectUrl) {
      window.location.href = order.redirectUrl;
      return;
    }
    onFailure?.({ gateway, message: `No redirect URL returned for ${gateway} checkout.` });
    return;
  }
  if (gateway === "cod") {
    onSuccess({
      gateway: "cod",
      orderId: order.orderId,
      paymentId: `COD_${order.orderId}`,
      rawResponse: order.rawResponse
    });
    return;
  }
  onFailure?.({ gateway, message: `Unsupported checkout gateway: ${gateway}` });
}
function useBoostPayment() {
  const [isProcessing, setIsProcessing] = react.useState(false);
  const [error, setError] = react.useState(null);
  const startPayment = react.useCallback(async (options) => {
    setIsProcessing(true);
    setError(null);
    try {
      await openPaymentModal({
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
        }
      });
    } catch (err) {
      setIsProcessing(false);
      setError(err.message);
      options.onFailure?.({
        gateway: options.order.gateway,
        message: err.message || "Payment initiation failed",
        rawError: err
      });
    }
  }, []);
  return {
    openPaymentModal: startPayment,
    isProcessing,
    error
  };
}

exports.loadCashfree = loadCashfree;
exports.loadRazorpay = loadRazorpay;
exports.loadScript = loadScript;
exports.openPaymentModal = openPaymentModal;
exports.useBoostPayment = useBoostPayment;
//# sourceMappingURL=react.cjs.map
//# sourceMappingURL=react.cjs.map