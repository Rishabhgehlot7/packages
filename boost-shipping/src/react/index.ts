/// <reference path="./shims.d.ts" />
'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { PincodeDetails, PincodeIntelligence } from '../pincode';
import { TrackingResult } from '../types';

export interface UsePincodeCheckOptions {
  debounceMs?: number;
  isCod?: boolean;
  onResolved?: (details: PincodeDetails) => void;
}

export interface UsePincodeCheckResult {
  pincode: string;
  isValid: boolean;
  state?: string;
  city?: string;
  tier: 'METRO' | 'TIER_1' | 'TIER_2' | 'REMOTE';
  isCodAvailable: boolean;
  estimatedDeliveryDays: number;
  estimatedDeliveryDateFormatted: string;
  isLoading: boolean;
}

/**
 * Universal React & React Native hook for instant Indian Pincode validation and city/state auto-fill.
 */
export function usePincodeCheck(
  pincode: string | number,
  options: UsePincodeCheckOptions = {}
): UsePincodeCheckResult {
  const { debounceMs = 250, onResolved } = options;
  const pinStr = String(pincode || '').trim();

  const [debouncedPin, setDebouncedPin] = useState(pinStr);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const handler = setTimeout(() => {
      setDebouncedPin(pinStr);
      setIsLoading(false);
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [pinStr, debounceMs]);

  const resolved = useMemo(() => {
    const details = PincodeIntelligence.resolvePincode(debouncedPin);
    if (details.isValid && onResolved) {
      onResolved(details);
    }
    return details;
  }, [debouncedPin, onResolved]);

  const estDate = useMemo(() => {
    if (!resolved.isValid) return '';
    return PincodeIntelligence.estimateDeliveryDate(debouncedPin).toDateString();
  }, [debouncedPin, resolved.isValid]);

  return {
    pincode: debouncedPin,
    isValid: resolved.isValid,
    state: resolved.state,
    city: resolved.majorHub,
    tier: resolved.tier,
    isCodAvailable: resolved.isCodGenerallyAvailable,
    estimatedDeliveryDays: resolved.expectedStandardDays,
    estimatedDeliveryDateFormatted: estDate,
    isLoading,
  };
}

export interface UseFreeShippingProgressResult {
  isFreeShipping: boolean;
  progressPercent: number;
  amountNeeded: number;
  shippingFee: number;
  bannerText: string;
}

/**
 * React & React Native hook for calculating cart free shipping progress bar & marketing banner.
 */
export function useFreeShippingProgress(
  cartTotal: number,
  thresholdAmount: number = 999,
  defaultFee: number = 60
): UseFreeShippingProgressResult {
  const isFree = cartTotal >= thresholdAmount;
  const needed = isFree ? 0 : Math.max(0, thresholdAmount - cartTotal);
  const progress = Math.min(100, Math.round((cartTotal / thresholdAmount) * 100));

  const banner = useMemo(() => {
    if (isFree) {
      return '🎉 Congratulations! You have unlocked FREE Delivery!';
    }
    return `🚚 Add ₹${needed} more to get FREE Delivery!`;
  }, [isFree, needed]);

  return {
    isFreeShipping: isFree,
    progressPercent: progress,
    amountNeeded: needed,
    shippingFee: isFree ? 0 : defaultFee,
    bannerText: banner,
  };
}

export interface UseShipmentTrackerOptions {
  autoPoll?: boolean;
  pollIntervalMs?: number;
  fetcher?: (awbNumber: string) => Promise<TrackingResult>;
}

export interface UseShipmentTrackerResult {
  data: TrackingResult | null;
  currentStatus: string;
  isDelivered: boolean;
  isOutForDelivery: boolean;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Universal parcel tracking hook for React & React Native order status screens.
 */
export function useShipmentTracker(
  awbNumber?: string,
  options: UseShipmentTrackerOptions = {}
): UseShipmentTrackerResult {
  const { autoPoll = false, pollIntervalMs = 30000, fetcher } = options;
  const [data, setData] = useState<TrackingResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTracking = useCallback(async () => {
    if (!awbNumber || !fetcher) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetcher(awbNumber);
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch shipment tracking.');
    } finally {
      setIsLoading(false);
    }
  }, [awbNumber, fetcher]);

  useEffect(() => {
    fetchTracking();

    if (autoPoll && awbNumber && fetcher) {
      const interval = setInterval(fetchTracking, pollIntervalMs);
      return () => clearInterval(interval);
    }
  }, [fetchTracking, autoPoll, awbNumber, fetcher, pollIntervalMs]);

  return {
    data,
    currentStatus: data?.currentStatus || 'PENDING',
    isDelivered: data?.currentStatus === 'DELIVERED',
    isOutForDelivery: data?.currentStatus === 'OUT_FOR_DELIVERY',
    isLoading,
    error,
    refresh: fetchTracking,
  };
}
