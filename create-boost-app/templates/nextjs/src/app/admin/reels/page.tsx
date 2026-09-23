'use client';

import React, { useState } from 'react';
import {
  Video,
  Plus,
  Play,
  Eye,
  ShoppingBag,
  Trash2,
  Edit2,
  CheckCircle2,
  Sparkles,
  Search,
  ExternalLink,
  Flame
} from 'lucide-react';

interface ReelItem {
  id: string;
  title: string;
  creatorName: string;
  videoUrl: string;
  thumbnailUrl: string;
  status: 'published' | 'draft';
  views: number;
  clicks: number;
  orders: number;
  pinnedProduct: {
    title: string;
    price: number;
    compareAtPrice?: number;
    image: string;
  };
}

export default function AdminReelsPage() {
  const [reels, setReels] = useState<ReelItem[]>([
    {
      id: 'reel_1',
      title: 'How to style our Oversized Heavyweight Hoodie 🔥',
      creatorName: '@fashion_alex',
      videoUrl: 'https://cdn.pixabay.com/video/2023/10/22/186115-877651036_large.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&q=80',
      status: 'published',
      views: 14250,
      clicks: 3420,
      orders: 218,
      pinnedProduct: {
        title: 'Oversized Boxy Tee - Vintage Black',
        price: 999,
        compareAtPrice: 1999,
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&q=80'
      }
    },
    {
      id: 'reel_2',
      title: 'Unboxing the Pro Wireless Earbuds ANC 🎧',
      creatorName: '@tech_review_in',
      videoUrl: 'https://cdn.pixabay.com/video/2020/05/25/40149-425032890_tiny.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&q=80',
      status: 'published',
      views: 8900,
      clicks: 1870,
      orders: 145,
      pinnedProduct: {
        title: 'Pro Wireless Earbuds ANC',
        price: 2499,
        compareAtPrice: 4999,
        image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&q=80'
      }
    },
    {
      id: 'reel_3',
      title: 'Gym Workout Essentials: Whey & Shaker Bottle',
      creatorName: '@fitness_priya',
      videoUrl: 'https://cdn.pixabay.com/video/2021/04/12/70889-536341258_tiny.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&q=80',
      status: 'draft',
      views: 0,
      clicks: 0,
      orders: 0,
      pinnedProduct: {
        title: 'Pure Whey Isolate 1kg - Double Chocolate',
        price: 2499,
        compareAtPrice: 3299,
        image: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=300&q=80'
      }
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReelTitle, setNewReelTitle] = useState('');
  const [newCreator, setNewCreator] = useState('');
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newProductTitle, setNewProductTitle] = useState('');
  const [newProductPrice, setNewProductPrice] = useState(999);

  const handleCreateReel = (e: React.FormEvent) => {
    e.preventDefault();
    const created: ReelItem = {
      id: `reel_${Date.now()}`,
      title: newReelTitle || 'Shoppable Video Reel',
      creatorName: newCreator || '@brand_official',
      videoUrl: newVideoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-light-1230-large.mp4',
      thumbnailUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80',
      status: 'published',
      views: 0,
      clicks: 0,
      orders: 0,
      pinnedProduct: {
        title: newProductTitle || 'Featured D2C Product',
        price: Number(newProductPrice) || 999,
        compareAtPrice: Number(newProductPrice) * 1.5,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&q=80'
      }
    };

    setReels([created, ...reels]);
    setIsModalOpen(false);
    setNewReelTitle('');
    setNewCreator('');
    setNewVideoUrl('');
    setNewProductTitle('');
  };

  const totalViews = reels.reduce((acc, r) => acc + r.views, 0);
  const totalOrders = reels.reduce((acc, r) => acc + r.orders, 0);
  const totalGMV = reels.reduce((acc, r) => acc + r.orders * r.pinnedProduct.price, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Shoppable Reels & Stories Studio
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full bg-pink-500/10 px-2.5 py-0.5 text-xs font-semibold text-pink-600 dark:text-pink-400 border border-pink-500/20">
              <Sparkles className="h-3 w-3" />
              @boostengine/reels
            </span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Engage mobile shoppers with 9:16 vertical video feeds, pinned product cards, and 1-tap add to bag.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-pink-500 hover:to-rose-500 transition-all"
        >
          <Plus className="h-4 w-4" />
          Upload New Reel
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Video Views</span>
            <Eye className="h-5 w-5 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
            {totalViews.toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            +24.8% organic retention
          </span>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Reel Attributed Orders</span>
            <ShoppingBag className="h-5 w-5 text-pink-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
            {totalOrders} Orders
          </div>
          <span className="text-xs text-pink-600 dark:text-pink-400 mt-1 font-medium">
            1-Tap instant checkout conversion
          </span>
        </div>

        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Video Driven GMV</span>
            <Flame className="h-5 w-5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mt-2">
            ₹{totalGMV.toLocaleString('en-IN')}
          </div>
          <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
            Direct high-converting revenue
          </span>
        </div>
      </div>

      {/* Reels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reels.map(reel => (
          <div
            key={reel.id}
            className="group relative rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            {/* Thumbnail / Video Preview */}
            <div className="relative aspect-[9/14] bg-zinc-950 overflow-hidden">
              <img
                src={reel.thumbnailUrl}
                alt={reel.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

              {/* Status Badge */}
              <div className="absolute top-3 left-3">
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold text-white ${
                    reel.status === 'published' ? 'bg-emerald-600' : 'bg-zinc-600'
                  }`}
                >
                  <CheckCircle2 className="h-3 w-3" />
                  {reel.status === 'published' ? 'Published' : 'Draft'}
                </span>
              </div>

              {/* Play Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/40">
                  <Play className="h-6 w-6 ml-0.5 fill-white" />
                </div>
              </div>

              {/* Overlay Content */}
              <div className="absolute bottom-3 inset-x-3 text-white space-y-2">
                <p className="text-xs font-medium text-pink-300">{reel.creatorName}</p>
                <h3 className="text-sm font-bold line-clamp-2 leading-snug">{reel.title}</h3>

                {/* Pinned Product Card Preview */}
                <div className="flex items-center gap-2.5 bg-black/60 backdrop-blur-md p-2 rounded-xl border border-white/20">
                  <img
                    src={reel.pinnedProduct.image}
                    alt={reel.pinnedProduct.title}
                    className="h-10 w-10 rounded-lg object-cover bg-white"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate text-white">{reel.pinnedProduct.title}</p>
                    <p className="text-xs font-bold text-emerald-400">
                      ₹{reel.pinnedProduct.price}{' '}
                      {reel.pinnedProduct.compareAtPrice && (
                        <span className="text-[10px] text-zinc-400 line-through">
                          ₹{reel.pinnedProduct.compareAtPrice}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-900/30">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Views</span>
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{reel.views.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Clicks</span>
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{reel.clicks.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-[11px] text-zinc-500 dark:text-zinc-400">Orders</span>
                  <p className="text-sm font-bold text-pink-600 dark:text-pink-400">{reel.orders}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Reel Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-zinc-900 p-6 shadow-xl border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Upload & Pin Reel</h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Add a vertical MP4 video link and pin a catalog product for instant 1-tap checkout.
            </p>

            <form onSubmit={handleCreateReel} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Reel Title / Caption</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Try our best-selling coffee blend!"
                  value={newReelTitle}
                  onChange={e => setNewReelTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Creator / Brand Handle</label>
                <input
                  type="text"
                  placeholder="@brand_official"
                  value={newCreator}
                  onChange={e => setNewCreator(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Video URL (MP4 / HLS Stream)</label>
                <input
                  type="url"
                  placeholder="https://cdn.example.com/videos/reel-1.mp4"
                  value={newVideoUrl}
                  onChange={e => setNewVideoUrl(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Pinned Product Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Arabica Dark Roast"
                    value={newProductTitle}
                    onChange={e => setNewProductTitle(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={newProductPrice}
                    onChange={e => setNewProductPrice(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3.5 py-2 text-sm text-zinc-900 dark:text-zinc-100 outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-pink-600 px-4 py-2 text-sm font-semibold text-white hover:bg-pink-500 shadow-sm"
                >
                  Publish Reel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
