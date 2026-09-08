import {
  CartItem,
  StoreOriginConfig,
  CustomerShippingAddress,
  ShippingConfig,
  PaymentConfig,
  AppliedDiscount,
  FreeShippingProgress,
  CartSummary,
} from './types';
import { GSTCalculator } from './gst';

export interface CartOptions {
  origin?: StoreOriginConfig;
  destination?: CustomerShippingAddress;
  shipping?: ShippingConfig;
  payment?: PaymentConfig;
  initialItems?: CartItem[];
}

export class BoostCart {
  private items: CartItem[] = [];
  private origin: StoreOriginConfig;
  private destination?: CustomerShippingAddress;
  private shipping: ShippingConfig;
  private payment: PaymentConfig;
  private discount: AppliedDiscount | null = null;

  constructor(options: CartOptions = {}) {
    this.origin = options.origin || { state: 'Maharashtra', taxMode: 'inclusive' };
    this.destination = options.destination;
    this.shipping = options.shipping || { freeShippingThreshold: 999, flatShippingRate: 79 };
    this.payment = options.payment || { paymentMethod: 'prepaid', codFee: 49, prepaidDiscountPercentage: 0 };
    if (options.initialItems && options.initialItems.length > 0) {
      this.items = options.initialItems.map((i) => ({ ...i }));
    }
  }

  private getItemKey(item: { productId: string; variantId?: string; id?: string }): string {
    if (item.id) return item.id;
    return `${item.productId}_${item.variantId || 'default'}`;
  }

  /**
   * Adds an item to the cart or increments quantity if already present
   */
  addItem(item: Omit<CartItem, 'id'> & { id?: string }): CartItem {
    const key = this.getItemKey(item);
    const existing = this.items.find((i) => this.getItemKey(i) === key);

    if (existing) {
      existing.quantity += item.quantity > 0 ? item.quantity : 1;
      return existing;
    }

    const newItem: CartItem = {
      ...item,
      id: key,
      quantity: item.quantity > 0 ? item.quantity : 1,
    };
    this.items.push(newItem);
    return newItem;
  }

  /**
   * Removes an item by its unique ID
   */
  removeItem(id: string): boolean {
    const initialLen = this.items.length;
    this.items = this.items.filter((i) => i.id !== id && this.getItemKey(i) !== id);
    return this.items.length < initialLen;
  }

  /**
   * Updates an item's quantity. If quantity <= 0, the item is removed.
   */
  updateQuantity(id: string, quantity: number): boolean {
    const item = this.items.find((i) => i.id === id || this.getItemKey(i) === id);
    if (!item) return false;

    if (quantity <= 0) {
      return this.removeItem(id);
    }

    item.quantity = Math.floor(quantity);
    return true;
  }

  /**
   * Clears all items from the cart
   */
  clear(): void {
    this.items = [];
    this.discount = null;
  }

  /**
   * Gets current items
   */
  getItems(): CartItem[] {
    return [...this.items];
  }

  setOrigin(origin: StoreOriginConfig): void {
    this.origin = origin;
  }

  setDestination(destination?: CustomerShippingAddress): void {
    this.destination = destination;
  }

  setShippingConfig(shipping: ShippingConfig): void {
    this.shipping = shipping;
  }

  setPaymentConfig(payment: PaymentConfig): void {
    this.payment = payment;
  }

  applyDiscount(discount: AppliedDiscount): void {
    this.discount = discount;
  }

  removeDiscount(): void {
    this.discount = null;
  }

  /**
   * Calculates Free Shipping Progress Bar status
   */
  calculateFreeShippingProgress(subtotal: number): FreeShippingProgress {
    const threshold = this.shipping.freeShippingThreshold || 0;
    if (threshold <= 0) {
      return {
        threshold: 0,
        currentAmount: subtotal,
        amountRemaining: 0,
        percentage: 100,
        isEligible: true,
        message: 'Free shipping unlocked! 🎉',
      };
    }

    const currentAmount = subtotal;
    const amountRemaining = Math.max(0, Math.round((threshold - currentAmount) * 100) / 100);
    const percentage = Math.min(100, Math.round((currentAmount / threshold) * 100));
    const isEligible = amountRemaining === 0;

    let message = '';
    if (isEligible) {
      message = '🎉 Congratulations! You unlocked FREE Delivery!';
    } else {
      message = `🚚 Add ₹${amountRemaining} more to unlock FREE Delivery!`;
    }

    return {
      threshold,
      currentAmount,
      amountRemaining,
      percentage,
      isEligible,
      message,
    };
  }

  /**
   * Produces a comprehensive summary with all taxes, discounts, shipping & checkout totals
   */
  getSummary(): CartSummary {
    const itemCount = this.items.length;
    const totalQuantity = this.items.reduce((sum, item) => sum + item.quantity, 0);

    const subtotal = Math.round(
      this.items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100
    ) / 100;

    const totalMRP = Math.round(
      this.items.reduce((sum, item) => {
        const mrp = item.compareAtPrice && item.compareAtPrice > item.price ? item.compareAtPrice : item.price;
        return sum + mrp * item.quantity;
      }, 0) * 100
    ) / 100;

    const freeShipping = this.calculateFreeShippingProgress(subtotal);

    // Shipping fee
    let shippingFee = 0;
    if (!freeShipping.isEligible && subtotal > 0) {
      shippingFee = this.shipping.flatShippingRate || 0;
    }

    // Discount
    let discountAmount = 0;
    if (this.discount) {
      discountAmount = Math.min(subtotal, Math.max(0, this.discount.amount));
    }

    // COD Fee
    let codFee = 0;
    if (this.payment.paymentMethod === 'cod' && subtotal > 0) {
      codFee = this.payment.codFee || 0;
    }

    // Prepaid Discount
    let prepaidDiscount = 0;
    if (this.payment.paymentMethod === 'prepaid' && this.payment.prepaidDiscountPercentage && this.payment.prepaidDiscountPercentage > 0) {
      const calculated = (subtotal - discountAmount) * (this.payment.prepaidDiscountPercentage / 100);
      prepaidDiscount = Math.round(calculated * 100) / 100;
      if (this.payment.prepaidDiscountMax && prepaidDiscount > this.payment.prepaidDiscountMax) {
        prepaidDiscount = this.payment.prepaidDiscountMax;
      }
    }

    // Total Savings (MRP - Price + Coupon Discount + Prepaid Discount)
    const totalSavings = Math.round(
      (Math.max(0, totalMRP - subtotal) + discountAmount + prepaidDiscount) * 100
    ) / 100;

    // GST calculation
    const gst = GSTCalculator.calculate(this.items, this.origin, this.destination);

    // Final Total
    let finalTotal = subtotal - discountAmount + shippingFee + codFee - prepaidDiscount;
    if (this.origin.taxMode === 'exclusive') {
      finalTotal += gst.totalTax;
    }
    finalTotal = Math.max(0, Math.round(finalTotal * 100) / 100);

    return {
      items: [...this.items],
      itemCount,
      totalQuantity,
      subtotal,
      totalMRP,
      totalSavings,
      discount: this.discount ? { ...this.discount, amount: discountAmount } : null,
      shippingFee,
      codFee,
      prepaidDiscount,
      gst,
      freeShipping,
      finalTotal,
    };
  }

  /**
   * Serializes current state to a portable JSON object (ideal for localStorage or DB)
   */
  toJSON(): { items: CartItem[]; discount: AppliedDiscount | null } {
    return {
      items: this.items,
      discount: this.discount,
    };
  }

  /**
   * Rehydrates cart from stored JSON
   */
  fromJSON(data: { items?: CartItem[]; discount?: AppliedDiscount | null }): void {
    if (data.items && Array.isArray(data.items)) {
      this.items = data.items.map((i) => ({ ...i }));
    }
    if (data.discount) {
      this.discount = data.discount;
    }
  }
}

export function createBoostCart(options?: CartOptions): BoostCart {
  return new BoostCart(options);
}
