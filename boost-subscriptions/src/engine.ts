/**
 * @boostengine/subscriptions - Core Engine Implementation
 */

import {
  SubscriptionFrequency,
  SubscriptionStatus,
  SubscriptionPlan,
  SubscriptionItem,
  SubscriptionRecord,
  CreateSubscriptionInput,
  SubscriptionMetrics,
  SubscriptionShippingAddress,
  SubscriptionPaymentMethod
} from './types';

export class SubscriptionEngine {
  private subscriptions: Map<string, SubscriptionRecord> = new Map();

  constructor(initialSubscriptions: SubscriptionRecord[] = []) {
    for (const sub of initialSubscriptions) {
      this.subscriptions.set(sub.id, sub);
    }
  }

  /**
   * Calculates the interval in days from frequency or custom days
   */
  public getIntervalDays(frequency: SubscriptionFrequency, customDays?: number): number {
    switch (frequency) {
      case 'daily':
        return 1;
      case 'weekly':
        return 7;
      case 'biweekly':
        return 14;
      case 'monthly':
        return 30;
      case 'bimonthly':
        return 60;
      case 'quarterly':
        return 90;
      case 'yearly':
        return 365;
      case 'custom_days':
        return customDays && customDays > 0 ? customDays : 30;
      default:
        return 30;
    }
  }

  /**
   * Calculates the next date given a base date and frequency
   */
  public calculateNextDate(baseDate: Date | string, frequency: SubscriptionFrequency, customDays?: number): string {
    const d = new Date(baseDate);
    const intervalDays = this.getIntervalDays(frequency, customDays);
    d.setDate(d.getDate() + intervalDays);
    return d.toISOString();
  }

  /**
   * Calculates discount unit price for an item based on plan & cycle count
   */
  public calculateDiscountedPrice(unitPrice: number, plan: SubscriptionPlan, currentCycle: number = 0): { discountedPrice: number; discountAmount: number } {
    let percentage = 0;
    let fixed = 0;

    if (plan.discount.type === 'percentage') {
      percentage = plan.discount.value;
    } else {
      fixed = plan.discount.value;
    }

    // Check tier discounts for recurring loyalty
    if (plan.discount.tierDiscounts && plan.discount.tierDiscounts.length > 0) {
      const applicableTiers = plan.discount.tierDiscounts
        .filter(t => currentCycle >= t.orderThreshold)
        .sort((a, b) => b.orderThreshold - a.orderThreshold);

      if (applicableTiers.length > 0) {
        percentage = Math.max(percentage, applicableTiers[0].discountPercentage);
      }
    }

    // Check if apply on first order only
    if (plan.discount.applyOnFirstOrderOnly && currentCycle > 1) {
      percentage = 0;
      fixed = 0;
    }

    let discountedPrice = unitPrice;
    if (percentage > 0) {
      discountedPrice = Math.max(0, unitPrice - (unitPrice * percentage) / 100);
    } else if (fixed > 0) {
      discountedPrice = Math.max(0, unitPrice - fixed);
    }

    discountedPrice = Math.round(discountedPrice * 100) / 100;
    const discountAmount = Math.round((unitPrice - discountedPrice) * 100) / 100;

    return { discountedPrice, discountAmount };
  }

  /**
   * Creates and registers a new subscription
   */
  public createSubscription(input: CreateSubscriptionInput): SubscriptionRecord {
    const id = `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date();
    const startDate = input.startDate ? new Date(input.startDate) : now;

    // Trial days handling
    let firstBilling = new Date(startDate);
    if (input.plan.trialDays && input.plan.trialDays > 0) {
      firstBilling.setDate(firstBilling.getDate() + input.plan.trialDays);
    }

    const nextBillingDate = firstBilling.toISOString();
    const nextDeliveryDate = this.calculateNextDate(nextBillingDate, 'daily', 3); // Delivery typically 3 days after billing

    // Calculate discounted items
    const items: SubscriptionItem[] = input.items.map(item => {
      const { discountedPrice } = this.calculateDiscountedPrice(item.unitPrice, input.plan, 1);
      return {
        ...item,
        discountedPrice
      };
    });

    const subtotal = items.reduce((acc, it) => acc + it.unitPrice * it.quantity, 0);
    const discountedSubtotal = items.reduce((acc, it) => acc + it.discountedPrice * it.quantity, 0);
    const discountTotal = Math.round((subtotal - discountedSubtotal) * 100) / 100;

    const shippingFee = input.plan.freeShipping ? 0 : (input.shippingFee ?? 0);
    const taxRate = (input.taxRatePercent ?? 0) / 100;
    const taxTotal = Math.round(discountedSubtotal * taxRate * 100) / 100;
    const totalAmount = Math.round((discountedSubtotal + shippingFee + taxTotal) * 100) / 100;

    const record: SubscriptionRecord = {
      id,
      customerId: input.customerId,
      customerEmail: input.customerEmail,
      customerName: input.customerName,
      planId: input.plan.id,
      planName: input.plan.name,
      status: 'active',
      items,
      shippingAddress: input.shippingAddress,
      paymentMethod: input.paymentMethod,
      currency: input.currency || 'INR',
      frequency: input.plan.frequency,
      intervalDays: input.plan.intervalDays,
      subtotal: Math.round(subtotal * 100) / 100,
      discountTotal,
      shippingFee,
      taxTotal,
      totalAmount,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      nextBillingDate,
      nextDeliveryDate,
      cycleCount: 0,
      orderHistory: [],
      metadata: input.metadata || {}
    };

    this.subscriptions.set(id, record);
    return record;
  }

  /**
   * Retrieves a subscription by ID
   */
  public getSubscription(id: string): SubscriptionRecord | undefined {
    return this.subscriptions.get(id);
  }

  /**
   * List all subscriptions for a specific customer
   */
  public getCustomerSubscriptions(customerId: string): SubscriptionRecord[] {
    return Array.from(this.subscriptions.values()).filter(s => s.customerId === customerId);
  }

  /**
   * Pause an active subscription
   */
  public pauseSubscription(id: string, untilDate?: string): SubscriptionRecord {
    const sub = this.subscriptions.get(id);
    if (!sub) throw new Error(`Subscription ${id} not found.`);
    if (sub.status === 'cancelled') throw new Error(`Cannot pause a cancelled subscription.`);

    sub.status = 'paused';
    sub.pausedUntil = untilDate;
    sub.updatedAt = new Date().toISOString();
    return sub;
  }

  /**
   * Resume a paused subscription
   */
  public resumeSubscription(id: string): SubscriptionRecord {
    const sub = this.subscriptions.get(id);
    if (!sub) throw new Error(`Subscription ${id} not found.`);
    if (sub.status === 'cancelled') throw new Error(`Cannot resume a cancelled subscription.`);

    sub.status = 'active';
    sub.pausedUntil = undefined;
    
    // If next billing date is in the past, reset it to tomorrow
    const nextBill = new Date(sub.nextBillingDate);
    const now = new Date();
    if (nextBill < now) {
      now.setDate(now.getDate() + 1);
      sub.nextBillingDate = now.toISOString();
      sub.nextDeliveryDate = this.calculateNextDate(sub.nextBillingDate, 'daily', 3);
    }
    
    sub.updatedAt = new Date().toISOString();
    return sub;
  }

  /**
   * Skip next delivery cycle
   */
  public skipNextDelivery(id: string): SubscriptionRecord {
    const sub = this.subscriptions.get(id);
    if (!sub) throw new Error(`Subscription ${id} not found.`);
    if (sub.status !== 'active') throw new Error(`Can only skip active subscriptions.`);

    const currentNextBill = sub.nextBillingDate;
    sub.nextBillingDate = this.calculateNextDate(currentNextBill, sub.frequency, sub.intervalDays);
    sub.nextDeliveryDate = this.calculateNextDate(sub.nextBillingDate, 'daily', 3);
    sub.status = 'skipped';
    sub.updatedAt = new Date().toISOString();
    return sub;
  }

  /**
   * Cancel a subscription
   */
  public cancelSubscription(id: string, reason?: string): SubscriptionRecord {
    const sub = this.subscriptions.get(id);
    if (!sub) throw new Error(`Subscription ${id} not found.`);

    sub.status = 'cancelled';
    sub.cancelledAt = new Date().toISOString();
    sub.cancellationReason = reason || 'Customer requested cancellation';
    sub.updatedAt = new Date().toISOString();
    return sub;
  }

  /**
   * Update item quantity in subscription
   */
  public updateItemQuantity(id: string, productId: string, newQuantity: number): SubscriptionRecord {
    const sub = this.subscriptions.get(id);
    if (!sub) throw new Error(`Subscription ${id} not found.`);
    if (newQuantity <= 0) throw new Error(`Quantity must be greater than 0.`);

    const item = sub.items.find(i => i.productId === productId);
    if (!item) throw new Error(`Product ${productId} not found in subscription.`);

    item.quantity = newQuantity;
    this.recalculateTotals(sub);
    return sub;
  }

  /**
   * Swap a product variant or product in subscription
   */
  public swapProduct(id: string, oldProductId: string, newItem: SubscriptionItem): SubscriptionRecord {
    const sub = this.subscriptions.get(id);
    if (!sub) throw new Error(`Subscription ${id} not found.`);

    const index = sub.items.findIndex(i => i.productId === oldProductId);
    if (index === -1) throw new Error(`Product ${oldProductId} not found in subscription.`);

    sub.items[index] = newItem;
    this.recalculateTotals(sub);
    return sub;
  }

  /**
   * Update delivery frequency
   */
  public updateFrequency(id: string, newFrequency: SubscriptionFrequency, intervalDays?: number): SubscriptionRecord {
    const sub = this.subscriptions.get(id);
    if (!sub) throw new Error(`Subscription ${id} not found.`);

    sub.frequency = newFrequency;
    sub.intervalDays = intervalDays;
    sub.nextBillingDate = this.calculateNextDate(new Date(), newFrequency, intervalDays);
    sub.nextDeliveryDate = this.calculateNextDate(sub.nextBillingDate, 'daily', 3);
    sub.updatedAt = new Date().toISOString();
    return sub;
  }

  /**
   * Update shipping address
   */
  public updateShippingAddress(id: string, newAddress: SubscriptionShippingAddress): SubscriptionRecord {
    const sub = this.subscriptions.get(id);
    if (!sub) throw new Error(`Subscription ${id} not found.`);

    sub.shippingAddress = newAddress;
    sub.updatedAt = new Date().toISOString();
    return sub;
  }

  /**
   * Update payment method
   */
  public updatePaymentMethod(id: string, newPayment: SubscriptionPaymentMethod): SubscriptionRecord {
    const sub = this.subscriptions.get(id);
    if (!sub) throw new Error(`Subscription ${id} not found.`);

    sub.paymentMethod = newPayment;
    sub.updatedAt = new Date().toISOString();
    return sub;
  }

  /**
   * Process a billing cycle (trigger charge, update cycle count, advance next billing date)
   */
  public processBillingCycle(id: string, simulatedSuccess: boolean = true): { subscription: SubscriptionRecord; orderId: string; success: boolean } {
    const sub = this.subscriptions.get(id);
    if (!sub) throw new Error(`Subscription ${id} not found.`);
    if (sub.status !== 'active' && sub.status !== 'skipped') {
      throw new Error(`Subscription is not active for billing (Current status: ${sub.status}).`);
    }

    const orderId = `ord_sub_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date();

    if (simulatedSuccess) {
      sub.cycleCount += 1;
      sub.status = 'active'; // In case it was skipped
      sub.orderHistory.push({
        orderId,
        cycleNumber: sub.cycleCount,
        billedAt: now.toISOString(),
        amount: sub.totalAmount,
        status: 'paid'
      });

      // Advance next billing date
      sub.nextBillingDate = this.calculateNextDate(now, sub.frequency, sub.intervalDays);
      sub.nextDeliveryDate = this.calculateNextDate(sub.nextBillingDate, 'daily', 3);
      sub.updatedAt = now.toISOString();

      return { subscription: sub, orderId, success: true };
    } else {
      sub.status = 'failed';
      sub.orderHistory.push({
        orderId,
        cycleNumber: sub.cycleCount + 1,
        billedAt: now.toISOString(),
        amount: sub.totalAmount,
        status: 'failed'
      });
      sub.updatedAt = now.toISOString();

      return { subscription: sub, orderId, success: false };
    }
  }

  /**
   * Returns subscriptions that are due for billing on or before a given date
   */
  public getDueSubscriptions(asOfDate: Date = new Date()): SubscriptionRecord[] {
    const asOfTime = asOfDate.getTime();
    return Array.from(this.subscriptions.values()).filter(sub => {
      if (sub.status !== 'active') return false;
      const billTime = new Date(sub.nextBillingDate).getTime();
      return billTime <= asOfTime;
    });
  }

  /**
   * Calculates comprehensive subscription business metrics
   */
  public getMetrics(): SubscriptionMetrics {
    const all = Array.from(this.subscriptions.values());
    const totalActive = all.filter(s => s.status === 'active').length;
    const totalPaused = all.filter(s => s.status === 'paused').length;
    const totalCancelled = all.filter(s => s.status === 'cancelled').length;

    let mrr = 0;
    let totalRevenue = 0;
    let totalOrders = 0;

    for (const sub of all) {
      if (sub.status === 'active') {
        const intervalDays = this.getIntervalDays(sub.frequency, sub.intervalDays);
        const monthlyMultiplier = 30 / intervalDays;
        mrr += sub.totalAmount * monthlyMultiplier;
      }

      for (const ord of sub.orderHistory) {
        if (ord.status === 'paid') {
          totalRevenue += ord.amount;
          totalOrders += 1;
        }
      }
    }

    const roundedMrr = Math.round(mrr * 100) / 100;
    const roundedArr = Math.round(roundedMrr * 12 * 100) / 100;
    const aov = totalOrders > 0 ? Math.round((totalRevenue / totalOrders) * 100) / 100 : 0;
    const totalSubscribersEver = totalActive + totalPaused + totalCancelled;
    const churnRate = totalSubscribersEver > 0 ? Math.round((totalCancelled / totalSubscribersEver) * 10000) / 100 : 0;

    return {
      totalActiveSubscriptions: totalActive,
      totalPausedSubscriptions: totalPaused,
      totalCancelledSubscriptions: totalCancelled,
      monthlyRecurringRevenue: roundedMrr,
      annualRecurringRevenue: roundedArr,
      averageOrderValue: aov,
      churnRatePercentage: churnRate,
      activeSubscriberCount: totalActive
    };
  }

  /**
   * Recalculates subtotal, taxes, and total amounts
   */
  private recalculateTotals(sub: SubscriptionRecord): void {
    const subtotal = sub.items.reduce((acc, it) => acc + it.unitPrice * it.quantity, 0);
    const discountedSubtotal = sub.items.reduce((acc, it) => acc + it.discountedPrice * it.quantity, 0);
    sub.subtotal = Math.round(subtotal * 100) / 100;
    sub.discountTotal = Math.round((subtotal - discountedSubtotal) * 100) / 100;
    sub.totalAmount = Math.round((discountedSubtotal + sub.shippingFee + sub.taxTotal) * 100) / 100;
    sub.updatedAt = new Date().toISOString();
  }

  /**
   * Export all subscriptions
   */
  public exportData(): SubscriptionRecord[] {
    return Array.from(this.subscriptions.values());
  }
}
