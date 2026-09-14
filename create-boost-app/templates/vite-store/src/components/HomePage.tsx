import React from 'react';

const storeName = import.meta.env.VITE_STORE_NAME || '{{BRAND_TITLE}}';

export default function HomePage() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 1200, margin: '0 auto', padding: 24 }}>
      <header style={{ borderBottom: '1px solid #eee', paddingBottom: 16, marginBottom: 32 }}>
        <h1 style={{ margin: 0, color: '#1a1a1a' }}>⚡ {storeName}</h1>
        <p style={{ color: '#666', marginTop: 8 }}>Powered by BoostEngine</p>
      </header>

      <main>
        <h2>Welcome to your Vite Store! 🎉</h2>
        <p>This store is built with:</p>
        <ul>
          <li>⚡ Vite + React 18</li>
          <li>🛒 @boostengine/cart</li>
          <li>💳 @boostengine/payments</li>
          <li>🔍 @boostengine/search</li>
          <li>❤️ @boostengine/wishlist</li>
          <li>⭐ @boostengine/reviews</li>
          <li>🏷️ @boostengine/coupons</li>
          <li>🔐 @boostengine/auth</li>
        </ul>
        <p style={{ color: '#888' }}>
          Edit <code>src/components/HomePage.tsx</code> to start building!
        </p>
      </main>
    </div>
  );
}
