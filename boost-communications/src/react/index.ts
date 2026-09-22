import { useState, useEffect, useCallback, useRef } from 'react';
import { OmnichannelEngine, comms } from '../engine';
import {
  UniversalResult,
  SmartOTPResult,
  VerifyOTPResult,
  OrderNotificationParams,
  CartRecoveryParams,
} from '../types';

/**
 * Universal React & React Native Hook for Communications
 *
 * Works in Next.js (Client Components), React SPA (Vite/CRA), and React Native (Expo).
 */
export function useCommunications(customEngine?: OmnichannelEngine) {
  const engine = customEngine || comms;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<UniversalResult | null>(null);

  const sendSMS = useCallback(
    async (to: string, message: string): Promise<UniversalResult> => {
      setLoading(true);
      setError(null);
      try {
        const res = await engine.quickSMS(to, message);
        setLastResult(res);
        if (!res.success) setError(res.error || 'Failed to send SMS');
        return res;
      } catch (err: any) {
        const res: UniversalResult = { success: false, channel: 'sms', provider: 'unknown', error: err.message };
        setError(err.message);
        setLastResult(res);
        return res;
      } finally {
        setLoading(false);
      }
    },
    [engine]
  );

  const sendWhatsApp = useCallback(
    async (
      to: string,
      templateOrText: string,
      variables?: Record<string, string | number>
    ): Promise<UniversalResult> => {
      setLoading(true);
      setError(null);
      try {
        const res = await engine.quickWhatsApp(to, templateOrText, variables);
        setLastResult(res);
        if (!res.success) setError(res.error || 'Failed to send WhatsApp message');
        return res;
      } catch (err: any) {
        const res: UniversalResult = { success: false, channel: 'whatsapp', provider: 'unknown', error: err.message };
        setError(err.message);
        setLastResult(res);
        return res;
      } finally {
        setLoading(false);
      }
    },
    [engine]
  );

  const sendEmail = useCallback(
    async (to: string | string[], subject: string, htmlOrText: string): Promise<UniversalResult> => {
      setLoading(true);
      setError(null);
      try {
        const res = await engine.quickEmail(to, subject, htmlOrText);
        setLastResult(res);
        if (!res.success) setError(res.error || 'Failed to send Email');
        return res;
      } catch (err: any) {
        const res: UniversalResult = { success: false, channel: 'email', provider: 'unknown', error: err.message };
        setError(err.message);
        setLastResult(res);
        return res;
      } finally {
        setLoading(false);
      }
    },
    [engine]
  );

  const sendOrderConfirmation = useCallback(
    async (params: OrderNotificationParams): Promise<UniversalResult> => {
      setLoading(true);
      setError(null);
      try {
        const res = await engine.sendOrderConfirmation(params);
        setLastResult(res);
        if (!res.success) setError(res.error || 'Failed to send order confirmation');
        return res;
      } catch (err: any) {
        const res: UniversalResult = { success: false, channel: 'sms', provider: 'unknown', error: err.message };
        setError(err.message);
        setLastResult(res);
        return res;
      } finally {
        setLoading(false);
      }
    },
    [engine]
  );

  const sendCartRecovery = useCallback(
    async (params: CartRecoveryParams): Promise<UniversalResult> => {
      setLoading(true);
      setError(null);
      try {
        const res = await engine.sendAbandonedCartAlert(params);
        setLastResult(res);
        if (!res.success) setError(res.error || 'Failed to send cart recovery');
        return res;
      } catch (err: any) {
        const res: UniversalResult = { success: false, channel: 'sms', provider: 'unknown', error: err.message };
        setError(err.message);
        setLastResult(res);
        return res;
      } finally {
        setLoading(false);
      }
    },
    [engine]
  );

  return {
    loading,
    error,
    lastResult,
    sendSMS,
    sendWhatsApp,
    sendEmail,
    sendOrderConfirmation,
    sendCartRecovery,
    engine,
  };
}

export interface UseOTPOptions {
  engine?: OmnichannelEngine;
  defaultPhone?: string;
  length?: number;
  validityMinutes?: number;
  resendCooldownSeconds?: number;
}

/**
 * Universal React & React Native Hook for OTP Lifecycle Management
 *
 * Handles sending, countdown timers, resend cooldowns, verification, and error states.
 */
export function useOTP(options: UseOTPOptions = {}) {
  const engine = options.engine || comms;
  const cooldownSec = options.resendCooldownSeconds ?? 30;

  const [phone, setPhone] = useState(options.defaultPhone || '');
  const [otp, setOtp] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastOTPResult, setLastOTPResult] = useState<SmartOTPResult | null>(null);

  const timerRef = useRef<any>(null);

  // Countdown timer logic
  useEffect(() => {
    if (countdown > 0) {
      timerRef.current = setTimeout(() => {
        setCountdown((c: number) => c - 1);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [countdown]);

  const sendOTP = useCallback(
    async (overridePhone?: string): Promise<SmartOTPResult> => {
      const targetPhone = (overridePhone || phone).trim();
      if (!targetPhone) {
        const errResult = {
          success: false,
          channel: 'sms' as const,
          provider: 'local',
          otp: '',
          token: '',
          deliveredVia: 'sms' as const,
          attempts: [],
          error: 'Phone number is required',
        };
        setError('Phone number is required');
        return errResult;
      }

      setIsSending(true);
      setError(null);
      setIsVerified(false);

      try {
        const res = await engine.otp.sendSmartOTP({
          phone: targetPhone,
          length: options.length || 6,
          validityMinutes: options.validityMinutes || 5,
        });

        setLastOTPResult(res);
        if (res.success && res.token) {
          setToken(res.token);
          setCountdown(cooldownSec);
        } else {
          setError(res.error || 'Failed to dispatch OTP');
        }
        return res;
      } catch (err: any) {
        const errResult = {
          success: false,
          channel: 'sms' as const,
          provider: 'local',
          otp: '',
          token: '',
          deliveredVia: 'sms' as const,
          attempts: [],
          error: err.message,
        };
        setError(err.message);
        return errResult;
      } finally {
        setIsSending(false);
      }
    },
    [phone, engine, options.length, options.validityMinutes, cooldownSec]
  );

  const verifyOTP = useCallback(
    async (enteredOtp?: string): Promise<VerifyOTPResult> => {
      const targetOtp = (enteredOtp || otp).trim();
      if (!token) {
        const res = { valid: false, phone, error: 'No active OTP session token found. Please send OTP first.' };
        setError(res.error);
        return res;
      }
      if (!targetOtp) {
        const res = { valid: false, phone, error: 'Please enter the OTP code' };
        setError(res.error);
        return res;
      }

      setIsVerifying(true);
      setError(null);

      try {
        const res = engine.otp.verifyOTP({
          phone,
          otp: targetOtp,
          token,
        });

        if (res.valid) {
          setIsVerified(true);
        } else {
          setError(res.error || 'Invalid or expired OTP');
        }
        return res;
      } catch (err: any) {
        const res = { valid: false, phone, error: err.message };
        setError(err.message);
        return res;
      } finally {
        setIsVerifying(false);
      }
    },
    [phone, otp, token, engine]
  );

  const resendOTP = useCallback(() => {
    if (countdown > 0) return Promise.resolve(lastOTPResult);
    return sendOTP();
  }, [countdown, sendOTP, lastOTPResult]);

  const reset = useCallback(() => {
    setOtp('');
    setToken(null);
    setCountdown(0);
    setIsVerified(false);
    setError(null);
    setLastOTPResult(null);
  }, []);

  return {
    phone,
    setPhone,
    otp,
    setOtp,
    token,
    countdown,
    canResend: countdown === 0 && !isSending,
    isSending,
    isVerifying,
    isVerified,
    error,
    lastOTPResult,
    sendOTP,
    verifyOTP,
    resendOTP,
    reset,
  };
}
