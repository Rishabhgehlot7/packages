interface CartItem {
    id: string;
    productId: string;
    variantId?: string;
    title: string;
    variantTitle?: string;
    price: number;
    compareAtPrice?: number;
    quantity: number;
    image?: string;
    sku?: string;
    weightGrams?: number;
    hsnCode?: string;
    taxRate?: number;
    metadata?: Record<string, any>;
}
interface StoreOriginConfig {
    state: string;
    pincode?: string;
    gstin?: string;
    taxMode?: 'inclusive' | 'exclusive';
}
interface CustomerShippingAddress {
    state: string;
    pincode?: string;
    country?: string;
}
interface ShippingConfig {
    freeShippingThreshold?: number;
    flatShippingRate?: number;
}
interface PaymentConfig {
    paymentMethod?: 'prepaid' | 'cod';
    codFee?: number;
    prepaidDiscountPercentage?: number;
    prepaidDiscountMax?: number;
}
interface AppliedDiscount {
    code: string;
    amount: number;
    description?: string;
}
interface HSNTaxEntry {
    hsnCode: string;
    taxRate: number;
    taxableAmount: number;
    taxAmount: number;
}
interface GSTBreakdown {
    taxableAmount: number;
    totalTax: number;
    cgst: number;
    sgst: number;
    igst: number;
    taxType: 'INTRA_STATE' | 'INTER_STATE';
    hsnBreakdown: HSNTaxEntry[];
}
interface FreeShippingProgress {
    threshold: number;
    currentAmount: number;
    amountRemaining: number;
    percentage: number;
    isEligible: boolean;
    message: string;
}
interface CartSummary {
    items: CartItem[];
    itemCount: number;
    totalQuantity: number;
    subtotal: number;
    totalMRP: number;
    totalSavings: number;
    discount: AppliedDiscount | null;
    shippingFee: number;
    codFee: number;
    prepaidDiscount: number;
    gst: GSTBreakdown;
    freeShipping: FreeShippingProgress;
    finalTotal: number;
}

interface CartOptions {
    origin?: StoreOriginConfig;
    destination?: CustomerShippingAddress;
    shipping?: ShippingConfig;
    payment?: PaymentConfig;
    initialItems?: CartItem[];
}
declare class BoostCart {
    private items;
    private origin;
    private destination?;
    private shipping;
    private payment;
    private discount;
    constructor(options?: CartOptions);
    private getItemKey;
    /**
     * Adds an item to the cart or increments quantity if already present
     */
    addItem(item: Omit<CartItem, 'id'> & {
        id?: string;
    }): CartItem;
    /**
     * Removes an item by its unique ID
     */
    removeItem(id: string): boolean;
    /**
     * Updates an item's quantity. If quantity <= 0, the item is removed.
     */
    updateQuantity(id: string, quantity: number): boolean;
    /**
     * Clears all items from the cart
     */
    clear(): void;
    /**
     * Gets current items
     */
    getItems(): CartItem[];
    setOrigin(origin: StoreOriginConfig): void;
    setDestination(destination?: CustomerShippingAddress): void;
    setShippingConfig(shipping: ShippingConfig): void;
    setPaymentConfig(payment: PaymentConfig): void;
    applyDiscount(discount: AppliedDiscount): void;
    removeDiscount(): void;
    /**
     * Calculates Free Shipping Progress Bar status
     */
    calculateFreeShippingProgress(subtotal: number): FreeShippingProgress;
    /**
     * Produces a comprehensive summary with all taxes, discounts, shipping & checkout totals
     */
    getSummary(): CartSummary;
    /**
     * Serializes current state to a portable JSON object (ideal for localStorage or DB)
     */
    toJSON(): {
        items: CartItem[];
        discount: AppliedDiscount | null;
    };
    /**
     * Rehydrates cart from stored JSON
     */
    fromJSON(data: {
        items?: CartItem[];
        discount?: AppliedDiscount | null;
    }): void;
}
declare function createBoostCart(options?: CartOptions): BoostCart;

declare class GSTCalculator {
    /**
     * Calculates detailed GST breakdown across cart items
     */
    static calculate(items: CartItem[], origin: StoreOriginConfig, destination?: CustomerShippingAddress): GSTBreakdown;
}

export { type AppliedDiscount, BoostCart, type CartItem, type CartOptions, type CartSummary, type CustomerShippingAddress, type FreeShippingProgress, type GSTBreakdown, GSTCalculator, type HSNTaxEntry, type PaymentConfig, type ShippingConfig, type StoreOriginConfig, createBoostCart };
