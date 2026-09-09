'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { CartDrawer } from '@boostengine/ui';
import { useStore } from '../context/StoreContext';

export const GlobalCartDrawer: React.FC = () => {
  const router = useRouter();
  const {
    cart,
    cartSummary,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    applyCoupon,
    removeCoupon,
  } = useStore();

  return (
    <CartDrawer
      isOpen={isCartOpen}
      onClose={() => setIsCartOpen(false)}
      items={cart.getItems()}
      subtotal={cartSummary.subtotal || 0}
      freeShippingThreshold={cartSummary.freeShipping?.threshold || 999}
      onUpdateQuantity={updateQuantity}
      onRemoveItem={removeFromCart}
      onCheckout={() => {
        setIsCartOpen(false);
        router.push('/checkout');
      }}
    />
  );
};
