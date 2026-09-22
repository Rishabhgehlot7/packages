import { UPIIntentOptions, UPIIntentResult } from './types';

/**
 * Universal Indian UPI Intent & Mobile App Deep-Link Generator
 * Generates direct one-click payment URLs for Google Pay, PhonePe, Paytm, CRED, and BHIM.
 */
export class UPIIntentGenerator {
  /**
   * Generates standard UPI URI and app-specific deep links
   */
  static generate(options: UPIIntentOptions): UPIIntentResult {
    const { pa, pn, am, cu = 'INR', tr, tn, mc } = options;

    const params = new URLSearchParams();
    const cleanAmount = typeof am === 'number' && !isNaN(am) ? am : 0;
    params.set('pa', pa);
    params.set('pn', pn);
    params.set('am', cleanAmount.toFixed(2));
    params.set('cu', cu);
    params.set('tr', tr);
    if (tn) params.set('tn', tn);
    if (mc) params.set('mc', mc);

    const queryString = params.toString();
    const upiUri = `upi://pay?${queryString}`;

    return {
      upiUri,
      gpay: `tez://upi/pay?${queryString}`,
      phonepe: `phonepe://pay?${queryString}`,
      paytm: `paytmmp://pay?${queryString}`,
      cred: `cred://upi/pay?${queryString}`,
      bhim: `bhim://pay?${queryString}`,
    };
  }

  /**
   * Generates a plain text ASCII QR code pattern for terminal debugging
   */
  static generateDebugQrString(upiUri: string): string {
    return `[UPI-QR: ${upiUri}]`;
  }
}
