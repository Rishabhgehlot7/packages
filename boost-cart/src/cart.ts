import {
  CartItem,
  StoreOriginConfig,
  CustomerShippingAddress,
  ShippingConfig,
  PaymentConfig,
  DiscountRule,
  AppliedDiscount,
  DiscountValidationResult,
  FreeShippingProgress,
  CartSummary,
  StorageAdapter,
  CurrencyConfig,
  CartEventType,
  CartEventListener,
  CartSubscription,
  CustomFee,
  AbandonedCartMetadata,
} from './types';
import { GSTCalculator } from './gst';
import { CartEventEmitter } from './events';
import { CurrencyFormatter } from './format';

export interface CartOptions {
  /** Warehouse / Store origin for GST calculation */
  origin?: StoreOriginConfig;
  /** Customer shipping destination */
  destination?: CustomerShippingAddress;
  /** Shipping rates and threshold rules */
  shipping?: ShippingConfig;
  /** Payment method and surcharge configuration */
  payment?: PaymentConfig;
  /** Initial items array */
  initialItems?: CartItem[];
  /** Initial custom fees (e.g. Gift wrap, Express shipping) */
  initialFees?: CustomFee[];
  /** Optional pluggable storage adapter (LocalStorage, AsyncStorage, Memory) */
  storage?: StorageAdapter;
  /** Storage key for persistence. Default: 'boost_cart' */
  storageKey?: string;
  /** Currency display and localization preferences */
  currency?: CurrencyConfig;
  /** Optional initial event listener */
  onEvent?: CartEventListener;
}

export type MergeStrategy = 'combine' | 'replace';

export class BoostCart {
  private items: CartItem[] = [];
  private customFees: CustomFee[] = [];
  private origin: StoreOriginConfig;
  private destination?: CustomerShippingAddress;
  private shipping: ShippingConfig;
  private payment: PaymentConfig;
  private discountRule: DiscountRule | null = null;
  private storage?: StorageAdapter;
  private storageKey: string;
  private events: CartEventEmitter;
  private formatter: CurrencyFormatter;
  private subscribers: Set<CartSubscription> = new Set();
  private recovery: AbandonedCartMetadata;
  private storageUnsync?: () => void;

  constructor(options: CartOptions = {}) {
    this.origin = options.origin || { state: 'Maharashtra', taxMode: 'inclusive' };
    this.destination = options.destination;
    this.shipping = options.shipping || { freeShippingThreshold: 999, flatShippingRate: 79 };
    this.payment = options.payment || { paymentMethod: 'prepaid', codFee: 49, prepaidDiscountPercentage: 0 };
    this.storage = options.storage;
    this.storageKey = options.storageKey || 'boost_cart';
    this.events = new CartEventEmitter();
    this.formatter = new CurrencyFormatter(options.currency);
    this.recovery = {
      lastModifiedAt: Date.now(),
      checkoutStep: 'cart',
    };

    if (options.onEvent) {
      this.events.onAny(options.onEvent);
    }

    if (options.initialItems && options.initialItems.length > 0) {
      this.items = options.initialItems.map((i) => ({ ...i }));
    }

    if (options.initialFees && options.initialFees.length > 0) {
      this.customFees = options.initialFees.map((f) => ({ ...f }));
    }

    // Auto-setup cross-tab sync if storage adapter supports it
    if (this.storage?.onSync) {
      this.storageUnsync = this.storage.onSync((raw) => {
        try {
          if (raw) {
            const parsed = JSON.parse(raw);
            this.fromJSON(parsed, false); // don't re-sync storage in loop
          }
        } catch {
          // Ignore
        }
      });
    }

    // Try auto-loading from storage if available
    this.tryRehydrateFromStorage();
  }

  private getItemKey(item: { productId: string; variantId?: string; id?: string }): string {
    if (item.id) return item.id;
    return `${item.productId}_${item.variantId || 'default'}`;
  }

  private matchesItem(item: CartItem, identifier: string): boolean {
    return (
      item.id === identifier ||
      item.productId === identifier ||
      `${item.productId}_${item.variantId || 'default'}` === identifier
    );
  }

  private notifySubscribers(): void {
    if (this.subscribers.size === 0) return;
    const summary = this.getSummary();
    for (const sub of this.subscribers) {
      try {
        sub(summary);
      } catch (err) {
        console.error('[BoostCart Subscriber Error]:', err);
      }
    }
  }

  private triggerMutation(eventType: CartEventType, item?: CartItem, fee?: CustomFee, syncStorage: boolean = true): void {
    this.recovery.lastModifiedAt = Date.now();
    const summary = this.getSummary();

    this.events.emit({
      type: eventType,
      item,
      fee,
      discount: summary.discount,
      summary,
    });

    this.notifySubscribers();

    if (syncStorage) {
      this.syncStorage();
    }
  }

  private syncStorage(): void {
    if (!this.storage) return;
    try {
      const payload = JSON.stringify(this.toJSON());
      this.storage.setItem(this.storageKey, payload);
    } catch (err) {
      console.warn('[BoostCart Storage Error] Failed to persist cart state:', err);
    }
  }

  private tryRehydrateFromStorage(): void {
    if (!this.storage) return;
    try {
      const raw = this.storage.getItem(this.storageKey);
      if (typeof raw === 'string' && raw) {
        const parsed = JSON.parse(raw);
        this.fromJSON(parsed, false);
      } else if (raw && typeof (raw as any).then === 'function') {
        (raw as Promise<string | null>)
          .then((asyncVal) => {
            if (asyncVal) {
              this.fromJSON(JSON.parse(asyncVal), false);
            }
          })
          .catch(() => {
            // Ignore
          });
      }
    } catch {
      // Ignore initial parse errors
    }
  }

  /**
   * Adds an item to the cart or increments its quantity if it already exists
   */
  addItem(item: Omit<CartItem, 'id'> & { id?: string }): CartItem {
    if (typeof item.price !== 'number' || isNaN(item.price) || item.price < 0) {
      throw new Error(`[BoostCart] Item price must be a non-negative number. Received: ${item.price}`);
    }

    const key = this.getItemKey(item);
    const existing = this.items.find((i) => this.matchesItem(i, key));
    const addQty = item.quantity > 0 ? Math.floor(item.quantity) : 1;

    let affectedItem: CartItem;

    if (existing) {
      const effectiveMaxStock = item.maxStock !== undefined ? item.maxStock : existing.maxStock;
      let targetQty = existing.quantity + addQty;
      if (effectiveMaxStock !== undefined && targetQty > effectiveMaxStock) {
        targetQty = effectiveMaxStock;
      }
      existing.quantity = targetQty;
      if (item.maxStock !== undefined) existing.maxStock = item.maxStock;
      if (item.price !== undefined) existing.price = item.price;
      if (item.title) existing.title = item.title;
      affectedItem = existing;
    } else {
      let initialQty = addQty;
      if (item.maxStock !== undefined && initialQty > item.maxStock) {
        initialQty = item.maxStock;
      }
      const newItem: CartItem = {
        ...item,
        id: key,
        quantity: initialQty,
      };
      this.items.push(newItem);
      affectedItem = newItem;
    }

    this.triggerMutation('item:added', affectedItem);
    return affectedItem;
  }

  /**
   * Updates an item's quantity. If quantity <= 0, the item is removed.
   */
  updateQuantity(id: string, quantity: number): boolean {
    const item = this.items.find((i) => this.matchesItem(i, id));
    if (!item) return false;

    if (quantity <= 0) {
      return this.removeItem(id);
    }

    let nextQty = Math.floor(quantity);
    if (item.maxStock !== undefined && nextQty > item.maxStock) {
      nextQty = item.maxStock;
    }

    item.quantity = nextQty;
    this.triggerMutation('item:updated', item);
    return true;
  }

  /**
   * Removes an item by its unique ID, composite key, or productId
   */
  removeItem(id: string): boolean {
    const itemIndex = this.items.findIndex((i) => this.matchesItem(i, id));
    if (itemIndex === -1) return false;

    const [removed] = this.items.splice(itemIndex, 1);
    this.triggerMutation('item:removed', removed);
    return true;
  }

  /**
   * Clears all items, applied discounts, and custom fees
   */
  clear(): void {
    this.items = [];
    this.discountRule = null;
    this.customFees = [];
    this.triggerMutation('cart:cleared');
  }

  /**
   * Returns a clean copy of all current items
   */
  getItems(): CartItem[] {
    return this.items.map((i) => ({ ...i }));
  }

  /**
   * Finds a specific item by its ID or productId
   */
  getItem(id: string): CartItem | undefined {
    const found = this.items.find((i) => this.matchesItem(i, id));
    return found ? { ...found } : undefined;
  }

  /**
   * Checks if an item exists in the cart by its ID or productId
   */
  hasItem(id: string): boolean {
    return this.items.some((i) => this.matchesItem(i, id));
  }

  // ==========================================
  // CUSTOM FEES & SURCHARGES (Gift Wrap, etc.)
  // ==========================================

  /**
   * Adds or updates a custom surcharge (e.g. Gift Wrap, Express Shipping, Fragile Packaging)
   */
  addFee(fee: CustomFee): void {
    const existingIndex = this.customFees.findIndex((f) => f.id === fee.id);
    if (existingIndex !== -1) {
      this.customFees[existingIndex] = { ...fee };
    } else {
      this.customFees.push({ ...fee });
    }
    this.triggerMutation('fee:added', undefined, fee);
  }

  /**
   * Removes a custom surcharge by ID
   */
  removeFee(id: string): boolean {
    const idx = this.customFees.findIndex((f) => f.id === id);
    if (idx === -1) return false;

    const [removed] = this.customFees.splice(idx, 1);
    this.triggerMutation('fee:removed', undefined, removed);
    return true;
  }

  /**
   * Returns all active custom fees
   */
  getFees(): CustomFee[] {
    return this.customFees.map((f) => ({ ...f }));
  }

  /**
   * Clears all active custom fees
   */
  clearFees(): void {
    this.customFees = [];
    this.triggerMutation('fee:removed');
  }

  // ==========================================
  // ABANDONED CART & FUNNEL RECOVERY
  // ==========================================

  /**
   * Sets customer contact information for abandoned cart recovery
   */
  setCustomerInfo(info: { email?: string; phone?: string; name?: string }): void {
    if (info.email) this.recovery.customerEmail = info.email;
    if (info.phone) this.recovery.customerPhone = info.phone;
    if (info.name) this.recovery.customerName = info.name;
    this.triggerMutation('recovery:updated');
  }

  /**
   * Tracks customer's current checkout progress step
   */
  setCheckoutStep(step: 'cart' | 'address' | 'payment' | 'completed'): void {
    this.recovery.checkoutStep = step;
    this.triggerMutation('recovery:updated');
  }

  /**
   * Returns a ready-to-post payload for WhatsApp / SMS / Webhook abandoned cart bots
   */
  getRecoveryPayload(): {
    customer: { email?: string; phone?: string; name?: string };
    checkoutStep: string;
    lastModifiedAt: number;
    subtotal: number;
    finalTotal: number;
    itemCount: number;
    items: Array<{ title: string; quantity: number; price: number }>;
  } {
    const summary = this.getSummary();
    return {
      customer: {
        email: this.recovery.customerEmail,
        phone: this.recovery.customerPhone,
        name: this.recovery.customerName,
      },
      checkoutStep: this.recovery.checkoutStep,
      lastModifiedAt: this.recovery.lastModifiedAt,
      subtotal: summary.subtotal,
      finalTotal: summary.finalTotal,
      itemCount: summary.totalQuantity,
      items: summary.items.map((i) => ({
        title: i.title,
        quantity: i.quantity,
        price: i.price,
      })),
    };
  }

  // ==========================================
  // CART MERGE (Guest to User)
  // ==========================================

  /**
   * Merges another set of items into this cart (e.g. Guest Cart -> Logged-in Cart merge)
   */
  merge(
    source: CartItem[] | { items: CartItem[]; discount?: DiscountRule | AppliedDiscount | null; fees?: CustomFee[] },
    options: { strategy?: MergeStrategy } = {}
  ): void {
    const strategy = options.strategy || 'combine';
    const sourceItems = Array.isArray(source) ? source : source.items || [];

    for (const item of sourceItems) {
      const key = this.getItemKey(item);
      const existing = this.items.find((i) => this.getItemKey(i) === key);

      if (existing) {
        if (strategy === 'combine') {
          let newQty = existing.quantity + item.quantity;
          if (item.maxStock !== undefined && newQty > item.maxStock) {
            newQty = item.maxStock;
          }
          existing.quantity = newQty;
        } else {
          existing.quantity = item.quantity;
        }
      } else {
        this.items.push({ ...item, id: key });
      }
    }

    if (!Array.isArray(source)) {
      if (source.discount) {
        this.applyDiscount(source.discount);
      }
      if (source.fees && Array.isArray(source.fees)) {
        for (const fee of source.fees) {
          this.addFee(fee);
        }
      }
    }

    this.triggerMutation('cart:merged');
  }

  // ==========================================
  // ADVANCED DISCOUNTS (Flat, %, BOGO, Tiered)
  // ==========================================

  /**
   * Validates whether a coupon code or discount rule can be applied to the current cart
   */
  validateDiscount(discount: DiscountRule | AppliedDiscount): DiscountValidationResult {
    const subtotal = this.calculateBaseSubtotal();
    const code = discount.code.toUpperCase().trim();

    // Minimum order value (MOV) check
    const minOrder = (discount as DiscountRule).minOrderValue || 0;
    if (minOrder > 0 && subtotal < minOrder) {
      return {
        isValid: false,
        code,
        amount: 0,
        error: `Minimum order value of ${this.formatter.format(minOrder)} required for code ${code}.`,
      };
    }

    const type = (discount as DiscountRule).type || 'flat';
    const rawDiscount = discount as any;
    const discountValue: number =
      rawDiscount.value !== undefined
        ? rawDiscount.value
        : rawDiscount.amount !== undefined
        ? rawDiscount.amount
        : 0;
    let computedAmount = 0;

    if (type === 'flat') {
      computedAmount = Math.min(subtotal, Math.max(0, discountValue));
    } else if (type === 'percentage') {
      const pctDiscount = subtotal * (discountValue / 100);
      const maxCap = (discount as DiscountRule).maxDiscount;
      computedAmount = maxCap && pctDiscount > maxCap ? maxCap : pctDiscount;
      computedAmount = Math.min(subtotal, Math.round(computedAmount * 100) / 100);
    } else if (type === 'free_shipping') {
      computedAmount = 0; // Handled as shipping fee waiver
    } else if (type === 'bogo') {
      // BOGO Calculation (Buy X Get Y Free)
      const bogo = (discount as DiscountRule).bogoConfig || { buyQuantity: 2, getQuantity: 1 };
      const setSize = bogo.buyQuantity + bogo.getQuantity;

      // Expand qualifying individual units
      const qualifyingUnitPrices: number[] = [];
      for (const item of this.items) {
        if (!bogo.eligibleProductIds || bogo.eligibleProductIds.includes(item.productId)) {
          for (let q = 0; q < item.quantity; q++) {
            qualifyingUnitPrices.push(item.price);
          }
        }
      }

      if (qualifyingUnitPrices.length < setSize) {
        return {
          isValid: false,
          code,
          amount: 0,
          error: `Code ${code} requires purchasing at least ${setSize} qualifying items.`,
        };
      }

      // Sort lowest price first (free units take lowest priced items)
      qualifyingUnitPrices.sort((a, b) => a - b);
      const freeUnitsCount = Math.floor(qualifyingUnitPrices.length / setSize) * bogo.getQuantity;
      computedAmount = qualifyingUnitPrices.slice(0, freeUnitsCount).reduce((sum, p) => sum + p, 0);
    } else if (type === 'tiered') {
      // Tiered Volume Discount (Buy 2 get 10%, Buy 3 get 20%)
      const rules = (discount as DiscountRule).tieredRules || [];
      const totalUnits = this.items.reduce((sum, item) => sum + item.quantity, 0);

      // Sort descending by minQuantity
      const sortedRules = [...rules].sort((a, b) => b.minQuantity - a.minQuantity);
      const matchedRule = sortedRules.find((r) => totalUnits >= r.minQuantity);

      if (!matchedRule) {
        const lowestReq = sortedRules[sortedRules.length - 1]?.minQuantity || 2;
        return {
          isValid: false,
          code,
          amount: 0,
          error: `Code ${code} requires at least ${lowestReq} items in cart to unlock tier discount.`,
        };
      }

      const pctDiscount = subtotal * (matchedRule.discountPercentage / 100);
      const maxCap = (discount as DiscountRule).maxDiscount;
      computedAmount = maxCap && pctDiscount > maxCap ? maxCap : pctDiscount;
      computedAmount = Math.min(subtotal, Math.round(computedAmount * 100) / 100);
    }

    return {
      isValid: true,
      code,
      amount: Math.max(0, Math.round(computedAmount * 100) / 100),
    };
  }

  /**
   * Applies a coupon discount (supports Flat, Percentage with Max Cap, Free Shipping, BOGO, and Tiered rules)
   */
  applyDiscount(
    discount: DiscountRule | (Partial<DiscountRule> & { code: string; amount?: number })
  ): DiscountValidationResult {
    const raw = discount as any;
    const normalizedRule: DiscountRule = {
      code: discount.code.toUpperCase().trim(),
      type: discount.type || 'flat',
      value: raw.value !== undefined ? raw.value : (raw.amount !== undefined ? raw.amount : 0),
      minOrderValue: discount.minOrderValue,
      maxDiscount: discount.maxDiscount,
      bogoConfig: discount.bogoConfig,
      tieredRules: discount.tieredRules,
      description: discount.description,
    };

    const validation = this.validateDiscount(normalizedRule);

    if (!validation.isValid) {
      return validation;
    }

    this.discountRule = normalizedRule;
    this.triggerMutation('discount:applied');
    return validation;
  }

  /**
   * Removes currently applied discount coupon
   */
  removeDiscount(): void {
    if (this.discountRule) {
      this.discountRule = null;
      this.triggerMutation('discount:removed');
    }
  }

  setOrigin(origin: StoreOriginConfig): void {
    this.origin = origin;
    this.triggerMutation('config:updated');
  }

  setDestination(destination?: CustomerShippingAddress): void {
    this.destination = destination;
    this.triggerMutation('config:updated');
  }

  setShippingConfig(shipping: ShippingConfig): void {
    this.shipping = shipping;
    this.triggerMutation('config:updated');
  }

  setPaymentConfig(payment: PaymentConfig): void {
    this.payment = payment;
    this.triggerMutation('config:updated');
  }

  setCurrency(currency: CurrencyConfig): void {
    this.formatter = new CurrencyFormatter(currency);
    this.triggerMutation('config:updated');
  }

  /**
   * Subscribes to cart state changes (Svelte store & React useSyncExternalStore compliant)
   */
  subscribe(listener: CartSubscription): () => void {
    this.subscribers.add(listener);
    listener(this.getSummary());

    return () => {
      this.subscribers.delete(listener);
    };
  }

  /**
   * Subscribes to fine-grained cart events ('item:added', 'fee:added', etc.)
   */
  on(event: CartEventType, listener: CartEventListener): () => void {
    return this.events.on(event, listener);
  }

  /**
   * Subscribes to any cart event
   */
  onAny(listener: CartEventListener): () => void {
    return this.events.onAny(listener);
  }

  private calculateBaseSubtotal(): number {
    return Math.round(
      this.items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100
    ) / 100;
  }

  /**
   * Calculates Free Shipping Progress Bar status
   */
  calculateFreeShippingProgress(subtotal: number): FreeShippingProgress {
    const threshold = this.shipping.freeShippingThreshold || 0;
    if (threshold <= 0 || this.shipping.isPromotionalFreeShipping) {
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
      const remainingStr = this.formatter.format(amountRemaining);
      message = `🚚 Add ${remainingStr} more to unlock FREE Delivery!`;
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
   * Produces a comprehensive summary with all taxes, discounts, shipping, custom fees & checkout totals
   */
  getSummary(): CartSummary {
    const itemCount = this.items.length;
    const totalQuantity = this.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalWeightGrams = this.items.reduce(
      (sum, item) => sum + (item.weightGrams || 0) * item.quantity,
      0
    );

    const subtotal = this.calculateBaseSubtotal();

    const totalMRP = Math.round(
      this.items.reduce((sum, item) => {
        const mrp =
          item.compareAtPrice && item.compareAtPrice > item.price ? item.compareAtPrice : item.price;
        return sum + mrp * item.quantity;
      }, 0) * 100
    ) / 100;

    const freeShipping = this.calculateFreeShippingProgress(subtotal);

    // Shipping fee calculation
    let shippingFee = 0;
    const hasFreeShippingCoupon = this.discountRule?.type === 'free_shipping';
    if (!freeShipping.isEligible && !hasFreeShippingCoupon && !this.shipping.isPromotionalFreeShipping && subtotal > 0) {
      shippingFee = this.shipping.flatShippingRate || 0;
    }

    // Discount calculation
    let appliedDiscount: AppliedDiscount | null = null;
    let discountAmount = 0;

    if (this.discountRule) {
      const validation = this.validateDiscount(this.discountRule);
      if (validation.isValid) {
        discountAmount = validation.amount;
        appliedDiscount = {
          code: this.discountRule.code,
          type: this.discountRule.type,
          value: this.discountRule.value || 0,
          amount: discountAmount,
          description: this.discountRule.description,
        };
      }
    }

    // Custom Fees Sum (Gift Wrap, Express delivery, etc.)
    const totalCustomFees = Math.round(
      this.customFees.reduce((sum, fee) => sum + fee.amount, 0) * 100
    ) / 100;

    // COD Fee
    let codFee = 0;
    if (this.payment.paymentMethod === 'cod' && subtotal > 0) {
      codFee = this.payment.codFee || 0;
    }

    // Prepaid Discount
    let prepaidDiscount = 0;
    if (
      this.payment.paymentMethod === 'prepaid' &&
      this.payment.prepaidDiscountPercentage &&
      this.payment.prepaidDiscountPercentage > 0
    ) {
      const eligibleBase = Math.max(0, subtotal - discountAmount);
      const calculated = eligibleBase * (this.payment.prepaidDiscountPercentage / 100);
      prepaidDiscount = Math.round(calculated * 100) / 100;
      if (this.payment.prepaidDiscountMax && prepaidDiscount > this.payment.prepaidDiscountMax) {
        prepaidDiscount = this.payment.prepaidDiscountMax;
      }
    }

    // Total Savings (MRP - Price + Coupon Discount + Prepaid Discount)
    const mrpDiscount = Math.max(0, totalMRP - subtotal);
    const totalSavings = Math.round((mrpDiscount + discountAmount + prepaidDiscount) * 100) / 100;

    // GST calculation (items + taxable custom fees)
    const gstItems: CartItem[] = [...this.items];
    for (const fee of this.customFees) {
      if (fee.isTaxable) {
        gstItems.push({
          id: `fee_${fee.id}`,
          productId: `fee_${fee.id}`,
          title: fee.title,
          price: fee.amount,
          quantity: 1,
          taxRate: fee.taxRate !== undefined ? fee.taxRate : 18,
          hsnCode: '9968', // Services HSN
        });
      }
    }
    const gst = GSTCalculator.calculate(gstItems, this.origin, this.destination);

    // Final Total
    let finalTotal = subtotal - discountAmount + shippingFee + codFee + totalCustomFees - prepaidDiscount;
    if (this.origin.taxMode === 'exclusive') {
      finalTotal += gst.totalTax;
    }
    if (this.items.length === 0) {
      finalTotal = 0;
    } else {
      finalTotal = Math.max(0, Math.round(finalTotal * 100) / 100);
    }

    // Formatted strings
    const formatted = this.formatter.formatSummary({
      subtotal,
      totalMRP,
      totalSavings,
      discountAmount,
      shippingFee,
      codFee,
      prepaidDiscount,
      totalCustomFees,
      totalTax: gst.totalTax,
      cgst: gst.cgst,
      sgst: gst.sgst,
      igst: gst.igst,
      finalTotal,
    });

    return {
      items: this.getItems(),
      itemCount,
      totalQuantity,
      totalWeightGrams,
      subtotal,
      totalMRP,
      totalSavings,
      discount: appliedDiscount,
      customFees: this.getFees(),
      totalCustomFees,
      shippingFee,
      codFee,
      prepaidDiscount,
      gst,
      freeShipping,
      finalTotal,
      formatted,
      recovery: { ...this.recovery },
    };
  }

  /**
   * Serializes current state to a portable JSON object
   */
  toJSON(): {
    items: CartItem[];
    discount: DiscountRule | null;
    fees: CustomFee[];
    origin: StoreOriginConfig;
    destination?: CustomerShippingAddress;
    shipping: ShippingConfig;
    payment: PaymentConfig;
    recovery: AbandonedCartMetadata;
  } {
    return {
      items: this.items,
      discount: this.discountRule,
      fees: this.customFees,
      origin: this.origin,
      destination: this.destination,
      shipping: this.shipping,
      payment: this.payment,
      recovery: this.recovery,
    };
  }

  /**
   * Rehydrates cart from stored JSON object
   */
  fromJSON(
    data: {
      items?: CartItem[];
      discount?: DiscountRule | AppliedDiscount | null;
      fees?: CustomFee[];
      origin?: StoreOriginConfig;
      destination?: CustomerShippingAddress;
      shipping?: ShippingConfig;
      payment?: PaymentConfig;
      recovery?: AbandonedCartMetadata;
    },
    syncStorage: boolean = true
  ): void {
    if (data.items && Array.isArray(data.items)) {
      this.items = data.items.map((i) => ({ ...i }));
    }
    if (data.discount) {
      this.applyDiscount(data.discount as any);
    } else if (data.discount === null) {
      this.discountRule = null;
    }
    if (data.fees && Array.isArray(data.fees)) {
      this.customFees = data.fees.map((f) => ({ ...f }));
    }
    if (data.origin) this.origin = data.origin;
    if (data.destination) this.destination = data.destination;
    if (data.shipping) this.shipping = data.shipping;
    if (data.payment) this.payment = data.payment;
    if (data.recovery) this.recovery = { ...data.recovery };

    this.triggerMutation('cart:rehydrated', undefined, undefined, syncStorage);
  }

  destroy(): void {
    if (this.storageUnsync) {
      this.storageUnsync();
    }
    this.subscribers.clear();
    this.events.removeAllListeners();
  }
}

/**
 * Factory function to create a new BoostCart instance
 */
export function createBoostCart(options?: CartOptions): BoostCart {
  return new BoostCart(options);
}
