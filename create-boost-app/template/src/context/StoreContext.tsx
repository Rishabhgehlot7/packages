'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createBoostCart, BoostCart, CartSummary, CartItem } from '@boostengine/cart';
import { createBoostWishlist, BoostWishlist, WishlistItem } from '@boostengine/wishlist';
import { CouponEngine, CouponRule } from '@boostengine/coupons';
import { createBoostInventory, BoostInventory } from '@boostengine/inventory';
import { PRODUCTS, StoreProduct } from '../data/products';

export { getCityFromPincode } from '../lib/geo';

export interface DynamicStoreSettings {
  storeName: string;
  storeUrl: string;
  supportEmail: string;
  supportPhone: string;
  freeShippingThreshold: number;
  enableCod: boolean;
  gstin: string;
  state: string;
}

interface StoreContextType {
  settings: DynamicStoreSettings;
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
  const [settings, setSettings] = useState<DynamicStoreSettings>({
    storeName: 'Club Hachi',
    storeUrl: 'https://clubhachi.com',
    supportEmail: 'support@clubhachi.com',
    supportPhone: '+91 98765 43210',
    freeShippingThreshold: 999,
    enableCod: true,
    gstin: '',
    state: 'Maharashtra',
  });

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

  useEffect(() => {
    async function fetchDynamicStoreData() {
      try {
        const [settingsRes, productsRes] = await Promise.all([
          fetch('/api/settings'),
          fetch('/api/products')
        ]);
        const settingsData = await settingsRes.json();
        const productsData = await productsRes.json();

        if (settingsData.success && settingsData.data) {
          setSettings(settingsData.data);
        }

        if (productsData.success && productsData.data && Array.isArray(productsData.data)) {
          productsData.data.forEach((p: any) => {
            if (p.variants && p.variants.length > 0) {
              p.variants.forEach((v: any) => {
                if (v.sku && !inventory.getStock(v.sku)) {
                  inventory.setStock({
                    sku: v.sku,
                    productId: p.id,
                    variantId: v.id,
                    quantity: v.stock ?? 10,
                    lowStockThreshold: 3,
                  });
                }
              });
            } else if (p.sku && !inventory.getStock(p.sku)) {
              inventory.setStock({
                sku: p.sku,
                productId: p.id,
                quantity: p.stockQuantity ?? (p.inStock ? 10 : 0),
                lowStockThreshold: 3,
              });
            }
          });
        }
      } catch (e) {
        // fallback
      }
    }
    fetchDynamicStoreData();
  }, [inventory]);

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
    let price = product.salePrice || product.price;
    let title = product.name || product.title;
    let variantTitle: string | undefined;
    let itemImage = (product.images && product.images[0]) || product.media?.[0]?.url || '';

    if (variantId && product.variants) {
      const v = product.variants.find((item) => item.id === variantId || item.sku === variantId);
      if (v) {
        sku = v.sku;
        price = v.salePrice || v.price;
        variantTitle = v.title || v.name || v.options?.map((o) => o.value).join(' / ');
        if (v.images && v.images.length > 0 && v.images[0]) {
          itemImage = v.images[0];
        }
      }
    }

    cart.addItem({
      id: `${product.id}_${variantId || 'default'}`,
      productId: product.id,
      variantId,
      variantSku: sku,
      variantName: variantTitle,
      title,
      variantTitle,
      price,
      quantity,
      taxRate: product.gstRate || product.taxRate || 18,
      hsnCode: product.hsnCode || '6109',
      image: itemImage,
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
        title: prod.title || prod.name || '',
        price: prod.salePrice || prod.price,
        image: prod.images?.[0] || prod.media?.[0]?.url || '',
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
        settings,
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
