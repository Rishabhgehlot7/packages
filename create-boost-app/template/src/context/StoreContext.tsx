'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createBoostCart, BoostCart, CartSummary, CartItem } from '@boostengine/cart';
import { createBoostWishlist, BoostWishlist, WishlistItem } from '@boostengine/wishlist';
import { CouponEngine, CouponRule } from '@boostengine/coupons';
import { createBoostInventory, BoostInventory } from '@boostengine/inventory';
import { PRODUCTS, StoreProduct } from '../data/products';

export function getCityFromPincode(pincode: string): { city: string; state: string } {
  const pin = pincode.replace(/\D/g, '');
  if (pin.length < 2) return { city: 'Mumbai', state: 'Maharashtra' };
  const prefix = pin.substring(0, 2);

  if (prefix === '11') return { city: 'New Delhi', state: 'Delhi' };
  if (prefix === '40') return { city: 'Mumbai', state: 'Maharashtra' };
  if (prefix === '41') return { city: 'Pune', state: 'Maharashtra' };
  if (prefix === '56') return { city: 'Bengaluru', state: 'Karnataka' };
  if (prefix === '50') return { city: 'Hyderabad', state: 'Telangana' };
  if (prefix === '60') return { city: 'Chennai', state: 'Tamil Nadu' };
  if (prefix === '70') return { city: 'Kolkata', state: 'West Bengal' };
  if (prefix === '38') return { city: 'Ahmedabad', state: 'Gujarat' };
  if (prefix === '30') return { city: 'Jaipur', state: 'Rajasthan' };
  if (prefix === '20') return { city: 'Noida / Ghaziabad', state: 'Uttar Pradesh' };
  if (prefix === '22') return { city: 'Lucknow', state: 'Uttar Pradesh' };
  if (prefix === '12') return { city: 'Gurugram', state: 'Haryana' };
  if (prefix === '14') return { city: 'Ludhiana', state: 'Punjab' };
  if (prefix === '46') return { city: 'Bhopal', state: 'Madhya Pradesh' };
  if (prefix === '45') return { city: 'Indore', state: 'Madhya Pradesh' };
  if (prefix === '80') return { city: 'Patna', state: 'Bihar' };
  if (prefix === '83') return { city: 'Ranchi', state: 'Jharkhand' };
  if (prefix === '75') return { city: 'Bhubaneswar', state: 'Odisha' };
  if (prefix === '78') return { city: 'Guwahati', state: 'Assam' };
  if (prefix === '68') return { city: 'Kochi', state: 'Kerala' };
  if (prefix === '69') return { city: 'Thiruvananthapuram', state: 'Kerala' };
  if (prefix === '39') return { city: 'Surat', state: 'Gujarat' };
  if (prefix === '34') return { city: 'Jodhpur', state: 'Rajasthan' };

  const num = parseInt(prefix, 10);
  if (num >= 12 && num <= 13) return { city: 'Haryana', state: 'Haryana' };
  if (num >= 14 && num <= 16) return { city: 'Punjab', state: 'Punjab' };
  if (num >= 20 && num <= 28) return { city: 'Uttar Pradesh', state: 'Uttar Pradesh' };
  if (num >= 30 && num <= 34) return { city: 'Rajasthan', state: 'Rajasthan' };
  if (num >= 36 && num <= 39) return { city: 'Gujarat', state: 'Gujarat' };
  if (num >= 40 && num <= 44) return { city: 'Maharashtra', state: 'Maharashtra' };
  if (num >= 45 && num <= 49) return { city: 'Madhya Pradesh', state: 'Madhya Pradesh' };
  if (num >= 50 && num <= 53) return { city: 'Telangana', state: 'Telangana' };
  if (num >= 56 && num <= 59) return { city: 'Karnataka', state: 'Karnataka' };
  if (num >= 60 && num <= 64) return { city: 'Tamil Nadu', state: 'Tamil Nadu' };
  if (num >= 67 && num <= 69) return { city: 'Kerala', state: 'Kerala' };
  if (num >= 70 && num <= 74) return { city: 'West Bengal', state: 'West Bengal' };
  if (num >= 75 && num <= 77) return { city: 'Odisha', state: 'Odisha' };
  if (num >= 78 && num <= 79) return { city: 'Assam', state: 'Assam' };
  if (num >= 80 && num <= 85) return { city: 'Bihar', state: 'Bihar' };

  return { city: 'India', state: 'India' };
}

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
  toggleWishlist: (productOrId: StoreProduct | string) => boolean;
  removeFromWishlist: (productId: string) => void;
  moveToCartFromWishlist: (item: WishlistItem) => void;
  isInWishlist: (productId: string) => boolean;
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
  const [deliveryLocation, setDeliveryLocationState] = useState<{ city: string; pincode: string }>({
    city: 'Mumbai',
    pincode: '400050',
  });

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
      return [
        {
          sku: p.sku,
          productId: p.id,
          quantity: 5,
          lowStockThreshold: 3,
        },
      ];
    });
    return createBoostInventory(initialStock);
  });

  const [activeCoupons] = useState<CouponRule[]>(DEFAULT_COUPONS);
  const [cartSummary, setCartSummary] = useState<CartSummary>(() => cart.getSummary());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [superCoins] = useState<number>(250);
  const [customerTier] = useState<'Bronze' | 'Silver' | 'Gold' | 'SuperStar'>('Gold');

  // Sync state & persist to LocalStorage
  const syncCart = () => {
    setCartSummary({ ...cart.getSummary() });
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('boost_cart_items', JSON.stringify(cart.getItems()));
      }
    } catch (e) {
      console.warn('Could not save cart to localStorage', e);
    }
  };

  const syncWishlist = () => {
    const items = [...wishlist.getItems()];
    setWishlistItems(items);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('boost_wishlist_items', JSON.stringify(items));
      }
    } catch (e) {
      console.warn('Could not save wishlist to localStorage', e);
    }
  };

  const setDeliveryLocation = (loc: { city: string; pincode: string }) => {
    setDeliveryLocationState(loc);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('boost_delivery_location', JSON.stringify(loc));
      }
    } catch (e) {
      console.warn('Could not save location to localStorage', e);
    }
  };

  // Restore state from LocalStorage on mount
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;

      // 1. Restore Location
      const savedLoc = localStorage.getItem('boost_delivery_location');
      if (savedLoc) {
        const parsedLoc = JSON.parse(savedLoc);
        if (parsedLoc?.pincode) {
          setDeliveryLocationState(parsedLoc);
        }
      }

      // 2. Restore Wishlist
      const savedWishlist = localStorage.getItem('boost_wishlist_items');
      if (savedWishlist) {
        const parsedWishlist: WishlistItem[] = JSON.parse(savedWishlist);
        if (Array.isArray(parsedWishlist)) {
          wishlist.clear();
          parsedWishlist.forEach((item) => wishlist.addItem(item));
          setWishlistItems([...wishlist.getItems()]);
        }
      }

      // 3. Restore Cart
      const savedCart = localStorage.getItem('boost_cart_items');
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart) && parsedCart.length > 0) {
          cart.clear();
          parsedCart.forEach((item) => cart.addItem(item));
          setCartSummary({ ...cart.getSummary() });
        }
      }
    } catch (err) {
      console.warn('Error hydrating store state from localStorage:', err);
    }
  }, []);

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

  const toggleWishlist = (productOrId: StoreProduct | string) => {
    const prod =
      typeof productOrId === 'string'
        ? PRODUCTS.find((p) => p.id === productOrId)
        : productOrId;

    if (!prod) return false;

    const isWishlisted = wishlist.hasItem(prod.id);
    if (isWishlisted) {
      wishlist.removeItem(prod.id);
    } else {
      wishlist.addItem({
        id: prod.id,
        productId: prod.id,
        title: prod.title,
        price: prod.price,
        image: prod.images[0],
        inStock: prod.inStock,
      });
    }
    syncWishlist();
    return !isWishlisted;
  };

  const removeFromWishlist = (productId: string) => {
    wishlist.removeItem(productId);
    syncWishlist();
  };

  const isInWishlist = (productId: string) => {
    return wishlist.hasItem(productId);
  };

  const moveToCartFromWishlist = (item: WishlistItem) => {
    const product = PRODUCTS.find((p) => p.id === item.productId);
    if (product) {
      addToCart(product);
    } else {
      cart.addItem({
        id: item.id,
        productId: item.productId,
        title: item.title,
        price: item.price,
        quantity: 1,
        image: item.image || '',
        taxRate: 18,
        hsnCode: '6109',
      } as any);
      syncCart();
      setIsCartOpen(true);
    }
    removeFromWishlist(item.productId);
  };

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
        removeFromWishlist,
        moveToCartFromWishlist,
        isInWishlist,
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
