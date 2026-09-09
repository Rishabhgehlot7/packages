'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { MobileBottomBar as BoostMobileBottomBar } from '@boostengine/ui';
import { useStore } from '../context/StoreContext';

export const MobileBottomNav: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { cartSummary, setIsCartOpen, wishlistItems } = useStore();

  // Hide mobile nav bar on product details, checkout or admin pages
  if (
    pathname?.startsWith('/checkout') ||
    pathname?.startsWith('/admin') ||
    (pathname?.startsWith('/products/') && pathname !== '/products')
  ) {
    return null;
  }

  return (
    <div className="md:hidden">
      <BoostMobileBottomBar
        activeTab={pathname === '/' ? 'home' : pathname === '/wishlist' ? 'wishlist' : 'shop'}
        cartCount={cartSummary.totalQuantity}
        wishlistCount={wishlistItems.length}
        onTabChange={(tabId) => {
          if (tabId === 'home') router.push('/');
          else if (tabId === 'search') {
            const el = document.getElementById('catalog');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
            else router.push('/#catalog');
          }
          else if (tabId === 'bag' || tabId === 'cart') setIsCartOpen(true);
          else if (tabId === 'wishlist') router.push('/wishlist');
          else if (tabId === 'admin') router.push('/admin');
        }}
      />
    </div>
  );
};
