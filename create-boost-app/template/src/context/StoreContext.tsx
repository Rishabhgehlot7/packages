'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createBoostCart, BoostCart, CartSummary, CartItem } from '@boostengine/cart';
import { createBoostWishlist, BoostWishlist, WishlistItem } from '@boostengine/wishlist';
import { CouponEngine, CouponRule } from '@boostengine/coupons';
import { createBoostInventory, BoostInventory } from '@boostengine/inventory';
import { PRODUCTS, StoreProduct } from '../data/products';

interface StoreContextType {
  cart: BoostCart;
  cartSummary: CartSummary;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: StoreProduct, variantId?: string, quantity?: number) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  wishlist: BoostWishlist;
  wishlistItems: WishlistItem[];
  toggleWishlist: (product: StoreProduct) => boolean;
  inventory: BoostInventory;
  activeCoupons: CouponRule[];
  superCoins: number;
  customerTier: 'Bronze' | 'Silver' | 'Gold' | 'SuperStar';
  deliveryLocation: { city: string; pincode: string };
  setDeliveryLocation: (loc: { city: string; pincode: string }) => void;
  addBundleToCart: (items: Array<{ id: string; title: string; price: number; imageUrl?: string }>) => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const DEFAULT_COUPONS: CouponRule[] = [
  { code: 'BOOST200', discountType: 'FLAT', discountValue: 200, minSubtotal: 999 },
  { code: 'SUPER10', discountType: 'PERCENTAGE', discountValue: 10, maxDiscount: 500, minSubtotal: 1499 },
  { code: 'PREPAID5', discountType: 'PERCENTAGE', discountValue: 5, maxDiscount: 200, applicablePaymentMode: 'Prepaid' },
];

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart] = useState<BoostCart>(() =>
    createBoostCart({
      origin: { state: 'Maharashtra', taxMode: 'inclusive' },
      destination: { state: 'Maharashtra' },
      shipping: { freeShippingThreshold: 999, flatShippingRate: 79 },
      payment: { paymentMethod: 'prepaid', codFee: 49 },
    })
  );

  const [wishlist] = useState<BoostWishlist>(() => createBoostWishlist());
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  const [inventory] = useState<BoostInventory>(() => {
    const initialStock = PRODUCTS.flatMap((p) => {
      if (p.variants) {
        return p.variants.map((v) => ({
          sku: v.sku,
          productId: p.id,
          variantId: v.id,
          quantity: v.stock,
          lowStockThreshold: 3,
        }));
      }
      return [{
        sku: p.sku,
        productId: p.id,
        quantity: 5,
        lowStockThreshold: 3,
      }];
    });
    return createBoostInventory(initialStock);
  });

  const [activeCoupons] = useState<CouponRule[]>(DEFAULT_COUPONS);
  const [cartSummary, setCartSummary] = useState<CartSummary>(() => cart.getSummary());
  const [isCartOpen, setIsCartOpen] = useState(false);

  const syncCart = () => {
    setCartSummary({ ...cart.getSummary() });
  };

  const addToCart = (product: StoreProduct, variantId?: string, quantity = 1) => {
    let sku = product.sku;
    let price = product.price;
    let title = product.title;
    let variantTitle: string | undefined;

    if (variantId && product.variants) {
      const v = product.variants.find((item) => item.id === variantId);
      if (v) {
        sku = v.sku;
        price = v.price;
        variantTitle = v.title;
      }
    }

    cart.addItem({
      id: `${product.id}_${variantId || 'default'}`,
      productId: product.id,
      variantId,
      title,
      variantTitle,
      price,
      quantity,
      taxRate: product.taxRate || 18,
      hsnCode: product.hsnCode || '6109',
      image: product.images[0],
      metadata: { sku },
    } as any);

    syncCart();
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, quantity: number) => {
    cart.updateQuantity(id, quantity);
    syncCart();
  };

  const removeFromCart = (id: string) => {
    cart.removeItem(id);
    syncCart();
  };

  const clearCart = () => {
    cart.clear();
    syncCart();
  };

  const applyCoupon = (code: string) => {
    const found = activeCoupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!found) {
      return { success: false, message: 'Invalid coupon code.' };
    }
    const currentSubtotal = cart.getSummary().subtotal;
    const res = CouponEngine.apply(found, {
      items: cart.getItems().map((i) => ({
        id: i.id,
        name: i.title,
        price: i.price,
        quantity: i.quantity,
      })),
      subtotal: currentSubtotal,
      paymentMode: 'Prepaid',
    });

    if (!res.isValid) {
      return { success: false, message: res.reason || 'Coupon terms not met.' };
    }

    cart.applyDiscount({
      code: found.code,
      amount: res.discountAmount,
      description: `Coupon ${found.code} applied`,
    });
    syncCart();
    return { success: true, message: `Coupon ${found.code} applied! Saved ₹${res.discountAmount}` };
  };

  const removeCoupon = () => {
    cart.removeDiscount();
    syncCart();
  };

  const toggleWishlist = (product: StoreProduct) => {
    const isWishlisted = wishlist.hasItem(product.id);
    if (isWishlisted) {
      wishlist.removeItem(product.id);
    } else {
      wishlist.addItem({
        id: product.id,
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.images[0],
        inStock: product.inStock,
      });
    }
    setWishlistItems([...wishlist.getItems()]);
    return !isWishlisted;
  };

  const [superCoins, setSuperCoins] = useState<number>(250);
  const [customerTier] = useState<'Bronze' | 'Silver' | 'Gold' | 'SuperStar'>('Gold');
  const [deliveryLocation, setDeliveryLocation] = useState({ city: 'Mumbai', pincode: '400050' });

  const addBundleToCart = (items: Array<{ id: string; title: string; price: number; imageUrl?: string }>) => {
    items.forEach((item) => {
      cart.addItem({
        id: `${item.id}_bundle`,
        productId: item.id,
        title: item.title,
        price: item.price,
        quantity: 1,
        taxRate: 18,
        hsnCode: '6109',
        image: item.imageUrl || '',
      } as any);
    });
    syncCart();
    setIsCartOpen(true);
  };

  return (
    <StoreContext.Provider
      value={{
        cart,
        cartSummary,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        wishlist,
        wishlistItems,
        toggleWishlist,
        inventory,
        activeCoupons,
        superCoins,
        customerTier,
        deliveryLocation,
        setDeliveryLocation,
        addBundleToCart,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};
