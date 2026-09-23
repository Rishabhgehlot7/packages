/**
 * @boostengine/subscriptions - React Hooks for Storefront & Customer Portal
 */

import { useState, useMemo, useCallback } from 'react';
import { SubscriptionEngine } from './engine';
import {
  SubscriptionRecord,
  SubscriptionPlan,
  SubscriptionFrequency,
  SubscriptionShippingAddress,
  SubscriptionPaymentMethod,
  SubscriptionItem,
  CreateSubscriptionInput
} from './types';

export interface UseSubscriptionManagerOptions {
  initialSubscriptions?: SubscriptionRecord[];
  customerId?: string;
}

export function useSubscriptionManager(options: UseSubscriptionManagerOptions = {}) {
  const [engine] = useState(() => new SubscriptionEngine(options.initialSubscriptions || []));
  const [, setRevision] = useState(0);

  const forceUpdate = useCallback(() => {
    setRevision(r => r + 1);
  }, []);

  const subscriptions = useMemo(() => {
    if (options.customerId) {
      return engine.getCustomerSubscriptions(options.customerId);
    }
    return engine.exportData();
  }, [engine, options.customerId, forceUpdate]);

  const activeSubscriptions = useMemo(() => {
    return subscriptions.filter(s => s.status === 'active');
  }, [subscriptions]);

  const metrics = useMemo(() => {
    return engine.getMetrics();
  }, [engine, subscriptions]);

  const createSubscription = useCallback((input: CreateSubscriptionInput) => {
    const sub = engine.createSubscription(input);
    forceUpdate();
    return sub;
  }, [engine, forceUpdate]);

  const pauseSubscription = useCallback((id: string, untilDate?: string) => {
    const sub = engine.pauseSubscription(id, untilDate);
    forceUpdate();
    return sub;
  }, [engine, forceUpdate]);

  const resumeSubscription = useCallback((id: string) => {
    const sub = engine.resumeSubscription(id);
    forceUpdate();
    return sub;
  }, [engine, forceUpdate]);

  const skipNextDelivery = useCallback((id: string) => {
    const sub = engine.skipNextDelivery(id);
    forceUpdate();
    return sub;
  }, [engine, forceUpdate]);

  const cancelSubscription = useCallback((id: string, reason?: string) => {
    const sub = engine.cancelSubscription(id, reason);
    forceUpdate();
    return sub;
  }, [engine, forceUpdate]);

  const updateFrequency = useCallback((id: string, newFrequency: SubscriptionFrequency, intervalDays?: number) => {
    const sub = engine.updateFrequency(id, newFrequency, intervalDays);
    forceUpdate();
    return sub;
  }, [engine, forceUpdate]);

  const updateShippingAddress = useCallback((id: string, newAddress: SubscriptionShippingAddress) => {
    const sub = engine.updateShippingAddress(id, newAddress);
    forceUpdate();
    return sub;
  }, [engine, forceUpdate]);

  const updatePaymentMethod = useCallback((id: string, newPayment: SubscriptionPaymentMethod) => {
    const sub = engine.updatePaymentMethod(id, newPayment);
    forceUpdate();
    return sub;
  }, [engine, forceUpdate]);

  const updateItemQuantity = useCallback((id: string, productId: string, quantity: number) => {
    const sub = engine.updateItemQuantity(id, productId, quantity);
    forceUpdate();
    return sub;
  }, [engine, forceUpdate]);

  const swapProduct = useCallback((id: string, oldProductId: string, newItem: SubscriptionItem) => {
    const sub = engine.swapProduct(id, oldProductId, newItem);
    forceUpdate();
    return sub;
  }, [engine, forceUpdate]);

  return {
    subscriptions,
    activeSubscriptions,
    metrics,
    createSubscription,
    pauseSubscription,
    resumeSubscription,
    skipNextDelivery,
    cancelSubscription,
    updateFrequency,
    updateShippingAddress,
    updatePaymentMethod,
    updateItemQuantity,
    swapProduct
  };
}

export interface UseSubscribeAndSaveOptions {
  productUnitPrice: number;
  plans: SubscriptionPlan[];
  defaultPlanId?: string;
  defaultPurchaseType?: 'one_time' | 'subscribe';
}

export function useSubscribeAndSave(options: UseSubscribeAndSaveOptions) {
  const [purchaseType, setPurchaseType] = useState<'one_time' | 'subscribe'>(
    options.defaultPurchaseType || 'one_time'
  );
  
  const [selectedPlanId, setSelectedPlanId] = useState<string>(
    options.defaultPlanId || (options.plans[0]?.id ?? '')
  );

  const selectedPlan = useMemo(() => {
    return options.plans.find(p => p.id === selectedPlanId) || options.plans[0];
  }, [options.plans, selectedPlanId]);

  const { discountedPrice, discountAmount, savingsPercent } = useMemo(() => {
    if (!selectedPlan) {
      return { discountedPrice: options.productUnitPrice, discountAmount: 0, savingsPercent: 0 };
    }
    const engine = new SubscriptionEngine();
    const { discountedPrice, discountAmount } = engine.calculateDiscountedPrice(options.productUnitPrice, selectedPlan);
    const savingsPercent = options.productUnitPrice > 0
      ? Math.round((discountAmount / options.productUnitPrice) * 100)
      : 0;
    return { discountedPrice, discountAmount, savingsPercent };
  }, [options.productUnitPrice, selectedPlan]);

  const currentPrice = purchaseType === 'subscribe' ? discountedPrice : options.productUnitPrice;

  return {
    purchaseType,
    setPurchaseType,
    selectedPlanId,
    setSelectedPlanId,
    selectedPlan,
    currentPrice,
    oneTimePrice: options.productUnitPrice,
    discountedPrice,
    discountAmount,
    savingsPercent,
    isSubscribed: purchaseType === 'subscribe'
  };
}
