import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../data/products';
import {
  HeartIcon,
  ShoppingBagIcon,
  TrashIcon,
  ArrowRightIcon,
  ZapIcon,
  CheckIcon,
} from './Icons';

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('boost_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('boost_wishlist', JSON.stringify(wishlist));
    } catch {
      // Ignore quota
    }
  }, [wishlist]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const removeFromWishlist = (id: string) => {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
    showToast('Removed from wishlist');
  };

  const moveToCart = (product: Product) => {
    try {
      const savedCart = localStorage.getItem('boost_cart');
      const cart = savedCart ? JSON.parse(savedCart) : [];
      const existing = cart.find((item: any) => item.product.id === product.id);

      let updatedCart;
      if (existing) {
        updatedCart = cart.map((item: any) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedCart = [...cart, { product, quantity: 1, size: product.sizes?.[0] || 'L' }];
      }

      localStorage.setItem('boost_cart', JSON.stringify(updatedCart));
      removeFromWishlist(product.id);
      showToast(`Moved ${product.title} to Bag! 🛍️`);
    } catch {
      showToast('Could not move to cart');
    }
  };

  return (
    <div style={{ backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #27272a', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#18181b', position: 'sticky', top: 0, zIndex: 40 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#fff' }}>
          <span style={{ fontSize: '22px' }}>⚡</span>
          <span style={{ fontWeight: '800', letterSpacing: '-0.5px', fontSize: '18px' }}>BOOST ENGINE</span>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link to="/" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
            Store
          </Link>
          <Link to="/orders" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
            Track Orders
          </Link>
          <Link to="/admin" style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
            Admin
          </Link>
          <Link
            to="/cart"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', padding: '8px 14px', borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: '600' }}
          >
            <ShoppingBagIcon size={16} />
            Bag
          </Link>
        </div>
      </header>

      {/* Toast Alert */}
      {toastMessage && (
        <div style={{ position: 'fixed', top: '80px', right: '24px', backgroundColor: '#10b981', color: '#fff', padding: '12px 20px', borderRadius: '8px', fontWeight: '600', fontSize: '14px', zIndex: 100, display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
          <CheckIcon size={16} />
          {toastMessage}
        </div>
      )}

      {/* Main Wishlist Body */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', borderBottom: '1px solid #27272a', paddingBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e11d48', fontSize: '13px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
              <HeartIcon size={16} filled /> Saved Collection
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>My Wishlist</h1>
          </div>
          <div style={{ fontSize: '14px', color: '#a1a1aa' }}>
            {wishlist.length} item{wishlist.length === 1 ? '' : 's'} saved
          </div>
        </div>

        {wishlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', backgroundColor: '#18181b', borderRadius: '16px', border: '1px dashed #27272a' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#27272a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px auto', color: '#e11d48' }}>
              <HeartIcon size={28} />
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 8px 0' }}>Your Wishlist is Empty</h2>
            <p style={{ color: '#a1a1aa', maxWidth: '400px', margin: '0 auto 24px auto', fontSize: '14px', lineHeight: '1.5' }}>
              Found something you love? Tap the heart icon on any product to save it here for later.
            </p>
            <Link
              to="/"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#e11d48', color: '#fff', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}
            >
              Explore Streetwear Catalog <ArrowRightIcon size={16} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}>
            {wishlist.map((item) => (
              <div key={item.id} style={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'relative', height: '300px', backgroundColor: '#27272a' }}>
                  <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    title="Remove from wishlist"
                    style={{ position: 'absolute', top: '12px', right: '12px', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.6)', border: 'none', color: '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    <TrashIcon size={16} />
                  </button>
                  <span style={{ position: 'absolute', bottom: '12px', left: '12px', backgroundColor: '#09090b', color: '#fff', fontSize: '11px', fontWeight: '700', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                    {item.category}
                  </span>
                </div>

                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <Link to={`/product/${item.id}`} style={{ color: '#fff', textDecoration: 'none', fontWeight: '600', fontSize: '15px', marginBottom: '8px' }}>
                    {item.title}
                  </Link>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: '#fff' }}>
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                    {item.compareAtPrice > item.price && (
                      <span style={{ fontSize: '13px', color: '#71717a', textDecoration: 'line-through' }}>
                        ₹{item.compareAtPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>

                  <div style={{ marginTop: 'auto', display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => moveToCart(item)}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', backgroundColor: '#fff', color: '#09090b', padding: '10px', borderRadius: '8px', border: 'none', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                    >
                      <ShoppingBagIcon size={15} /> Move to Bag
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
