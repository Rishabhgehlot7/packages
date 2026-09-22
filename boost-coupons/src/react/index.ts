/// <reference path="./shims.d.ts" />
'use client';

import { useState, useCallback, useMemo } from 'react';
import { CouponEngine } from '../engine';
import {
  BoostCartLike,
  CartContext,
  CouponApplicationResult,
  CouponRule,
  CouponUpsellHint,
} from '../types';

export interface UseCouponOptions {
  onApplied?: (result: CouponApplicationResult) => void;
  onRemoved?: () => void;
  onError?: (error: string) => void;
}

export interface UseCouponResult {
  appliedCoupon: CouponApplicationResult | null;
  discountAmount: number;
  freeShippingApplied: boolean;
  finalTotal: number;
  error: string | null;
  applyCode: (code: string) => boolean;
  removeCoupon: () => void;
  autoApplyBest: () => boolean;
  eligibleCoupons: CouponRule[];
  upsellHints: CouponUpsellHint[];
}

/**
 * Universal React & React Native Hook for eCommerce Coupons, Discounts, and AOV Upsell Banners.
 */
export function useCoupon(
  availableCoupons: CouponRule[] = [],
  cart: CartContext | BoostCartLike,
  options: UseCouponOptions = {}
): UseCouponResult {
  const { onApplied, onRemoved, onError } = options;

  const [appliedRule, setAppliedRule] = useState<CouponRule | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Evaluate currently applied coupon against latest cart state
  const appliedResult = useMemo<CouponApplicationResult | null>(() => {
    if (!appliedRule) return null;
    const res = CouponEngine.apply(appliedRule, cart);
    if (!res.isValid) {
      return null;
    }
    return res;
  }, [appliedRule, cart]);

  // Generate motivational upsell hints
  const upsellHints = useMemo<CouponUpsellHint[]>(() => {
    return CouponEngine.getUpsellHints(availableCoupons, cart);
  }, [availableCoupons, cart]);

  // Filter coupons that are currently 100% eligible
  const eligibleCoupons = useMemo<CouponRule[]>(() => {
    return availableCoupons.filter((c) => CouponEngine.apply(c, cart).isValid);
  }, [availableCoupons, cart]);

  const applyCode = useCallback(
    (code: string): boolean => {
      const clean = code.trim().toUpperCase();
      const match = availableCoupons.find((c) => c.code.toUpperCase() === clean);

      if (!match) {
        const msg = `Invalid coupon code: '${code}'`;
        setError(msg);
        onError?.(msg);
        return false;
      }

      const res = CouponEngine.apply(match, cart);
      if (!res.isValid) {
        const msg = res.reason || `Coupon '${code}' cannot be applied.`;
        setError(msg);
        onError?.(msg);
        return false;
      }

      setError(null);
      setAppliedRule(match);
      onApplied?.(res);
      return true;
    },
    [availableCoupons, cart, onApplied, onError]
  );

  const removeCoupon = useCallback(() => {
    setAppliedRule(null);
    setError(null);
    onRemoved?.();
  }, [onRemoved]);

  const autoApplyBest = useCallback((): boolean => {
    const best = CouponEngine.autoApplyBest(availableCoupons, cart);
    if (best.bestCoupon && best.bestCoupon.appliedRule) {
      setAppliedRule(best.bestCoupon.appliedRule);
      setError(null);
      onApplied?.(best.bestCoupon);
      return true;
    }
    return false;
  }, [availableCoupons, cart, onApplied]);

  const cartSubtotal = cart.subtotal ?? (cart as any).total ?? 0;
  const shippingFee = cart.shippingFee || 0;
  const discountAmount = appliedResult?.discountAmount || 0;
  const freeShipping = Boolean(appliedResult?.freeShippingApplied);
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + (freeShipping ? 0 : shippingFee));

  return {
    appliedCoupon: appliedResult,
    discountAmount,
    freeShippingApplied: freeShipping,
    finalTotal,
    error,
    applyCode,
    removeCoupon,
    autoApplyBest,
    eligibleCoupons,
    upsellHints,
  };
}
