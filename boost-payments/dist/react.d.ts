import { E as createPaymentCheckout, q as BoostPaymentOpenOptions } from './client-CSvi_y91.js';
export { F as loadCashfree, H as loadRazorpay, I as loadScript } from './client-CSvi_y91.js';

declare const openPaymentModal: typeof createPaymentCheckout;
/**
 * Universal React Hook for payment checkout in Next.js / React / React Native WebView.
 * Supports eCommerce, Digital Products, SaaS Subscriptions, and Donations.
 */
declare function useBoostPayment(): {
    openPaymentModal: (options: BoostPaymentOpenOptions) => Promise<void>;
    isProcessing: boolean;
    error: string | null;
};

export { openPaymentModal, useBoostPayment };
