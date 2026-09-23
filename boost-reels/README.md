# @boostengine/reels

> Shoppable vertical video reels, Instagram/TikTok-style story players, live product tag overlays, 1-click cart insertion, and AI reel optimization for modern D2C commerce.

[![npm version](https://img.shields.io/npm/v/@boostengine/reels.svg)](https://www.npmjs.com/package/@boostengine/reels)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ⚡ Features

- **📱 9:16 Vertical Video Reels**:
  - Seamless mobile & desktop vertical swipe/scroll video player.
  - Automatic mute/unmute management for browser autoplay compliance.
- **🛍️ Live Product Pinning & Tag Overlays**:
  - Tag multiple products per video reel with price, title, and image.
  - Floating 1-Click "Add to Cart" and "Buy Now" bottom sheet drawer.
- **✨ Story Highlight Player**:
  - Instagram-style auto-advancing story carousel with tap to skip / hold to pause.
- **📊 Engagement & Conversion Analytics**:
  - Built-in tracking for reel views, watch milestones (25%, 50%, 75%, 100%), product tag clicks, and order conversions.
- **🤖 Autonomous AI Agent Tools**:
  - LLM tools to analyze video engagement velocity and rank trending reels.

---

## 📦 Installation

```bash
npm install @boostengine/reels
# or
pnpm add @boostengine/reels
# or
yarn add @boostengine/reels
```

---

## 🚀 Quick Start (React / Next.js)

```tsx
'use client';

import React from 'react';
import { useReels } from '@boostengine/reels/react';

const mockReels = [
  {
    id: 'reel-1',
    videoUrl: 'https://cdn.example.com/videos/summer-tee.mp4',
    title: 'How to Style the Oversized Cotton Tee 🔥',
    creator: { name: 'Aman Sharma', verified: true },
    products: [
      { id: 'p1', productId: 'p1', title: 'Oversized Cotton Tee', price: 999, image: '/images/tee.jpg' },
      { id: 'p2', productId: 'p2', title: 'Relaxed Cargo Pants', price: 1999, image: '/images/cargos.jpg' },
    ],
  },
];

export function ShoppableReelsPlayer() {
  const {
    currentReel,
    isPlaying,
    isMuted,
    togglePlay,
    toggleMute,
    nextReel,
    prevReel,
    selectedProduct,
    setSelectedProduct,
    trackAction,
  } = useReels({
    reels: mockReels,
    onEvent: (e) => console.log('Reel Event Tracked:', e),
  });

  if (!currentReel) return null;

  return (
    <div className="relative aspect-[9/16] max-w-sm mx-auto rounded-3xl overflow-hidden bg-black text-white">
      {/* Video Element */}
      <video
        src={currentReel.videoUrl}
        autoPlay
        loop
        muted={isMuted}
        playsInline
        className="w-full h-full object-cover"
        onClick={togglePlay}
      />

      {/* Overlay: Sound & Like Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-3">
        <button onClick={toggleMute} className="p-2 rounded-full bg-black/40 backdrop-blur">
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>

      {/* Overlay: Creator & Title */}
      <div className="absolute bottom-20 left-4 right-4 space-y-1">
        <div className="font-bold text-sm">@{currentReel.creator?.name}</div>
        <p className="text-xs text-slate-200 line-clamp-2">{currentReel.title}</p>
      </div>

      {/* Overlay: Tagged Products Pill */}
      <div className="absolute bottom-4 left-4 right-4">
        {currentReel.products.map((prod) => (
          <button
            key={prod.id}
            onClick={() => {
              setSelectedProduct(prod);
              trackAction('product_tag_click', prod.productId);
            }}
            className="w-full p-2.5 rounded-2xl bg-white/90 backdrop-blur text-slate-900 flex items-center justify-between shadow-lg"
          >
            <span className="text-xs font-bold truncate">{prod.title}</span>
            <span className="text-xs font-black text-emerald-700 ml-2">₹{prod.price}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

---

## 📄 License

MIT © [BoostEngine Team](https://github.com/boostengine)
