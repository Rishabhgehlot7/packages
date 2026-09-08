import { B as BoostPaymentOpenOptions } from './types-D3bPaYhQ.mjs';

/**
 * Dynamically loads an external script into the browser document.
 */
declare function loadScript(src: string): Promise<boolean>;
/**
 * Loads Razorpay Checkout JavaScript library.
 */
declare function loadRazorpay(): Promise<boolean>;
/**
 * Loads Cashfree JS SDK v3.
 */
declare function loadCashfree(): Promise<boolean>;
/**
 * Universal Checkout Launcher for Browser & React applications.
 * Automatically loads the gateway script, opens modals, or redirects.
 */
declare function openPaymentModal(options: BoostPaymentOpenOptions): Promise<void>;
/**
 * React Hook for seamless payment checkout in Next.js / React.
 */
declare function useBoostPayment(): {
    openPaymentModal: (options: BoostPaymentOpenOptions) => Promise<void>;
    isProcessing: boolean;
    error: string | null;
};

export { loadCashfree, loadRazorpay, loadScript, openPaymentModal, useBoostPayment };
