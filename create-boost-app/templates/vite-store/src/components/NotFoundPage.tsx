import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, ShoppingBagIcon, HeartIcon } from './Icons';

export default function NotFoundPage() {
  return (
    <div style={{ backgroundColor: '#09090b', color: '#f4f4f5', minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #27272a', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#18181b' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#fff' }}>
          <span style={{ fontSize: '22px' }}>⚡</span>
          <span style={{ fontWeight: '800', letterSpacing: '-0.5px', fontSize: '18px' }}>BOOST ENGINE</span>
        </Link>
        <Link
          to="/"
          style={{ color: '#a1a1aa', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}
        >
          Return to Store
        </Link>
      </header>

      {/* 404 Center Message */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '96px', fontWeight: '900', letterSpacing: '-4px', color: '#27272a', lineHeight: 1, marginBottom: '16px' }}>
          404
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 12px 0', letterSpacing: '-0.5px' }}>
          Drop Not Found
        </h1>
        <p style={{ color: '#a1a1aa', maxWidth: '460px', margin: '0 0 32px 0', fontSize: '15px', lineHeight: '1.6' }}>
          The page or streetwear collection you're looking for doesn't exist, has been moved, or sold out completely.
        </p>

        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link
            to="/"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#e11d48', color: '#fff', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontWeight: '700', fontSize: '14px' }}
          >
            Explore Streetwear <ArrowRightIcon size={16} />
          </Link>

          <Link
            to="/cart"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', padding: '12px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}
          >
            <ShoppingBagIcon size={16} /> View Bag
          </Link>

          <Link
            to="/wishlist"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', padding: '12px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}
          >
            <HeartIcon size={16} /> Wishlist
          </Link>

          <Link
            to="/admin"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#27272a', border: '1px solid #3f3f46', color: '#fff', padding: '12px 20px', borderRadius: '8px', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}
          >
            Command Center
          </Link>
        </div>
      </main>
    </div>
  );
}
