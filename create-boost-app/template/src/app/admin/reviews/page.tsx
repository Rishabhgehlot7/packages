'use client';

import React, { useState } from 'react';
import {
  Star,
  CheckCircle2,
  XCircle,
  Search,
  MessageSquare,
  ShieldCheck,
  ThumbsUp,
  Image as ImageIcon,
} from 'lucide-react';

interface AdminReview {
  id: string;
  author: string;
  productTitle: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  isVerifiedBuyer: boolean;
  status: 'PUBLISHED' | 'PENDING' | 'HIDDEN';
  images?: string[];
  reply?: string;
}

const INITIAL_REVIEWS: AdminReview[] = [
  {
    id: 'rev_1',
    author: 'Kabir Oberoi',
    productTitle: 'Vintage Acid Wash Oversized Hoodie',
    rating: 5,
    title: 'Mind blowing fabric quality!',
    content: 'Fabric heavy hai and wash effect bilkul luxury brand jaisa lagta hai. Fits oversized perfectly.',
    date: '2026-09-13',
    isVerifiedBuyer: true,
    status: 'PUBLISHED',
    images: ['https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&q=80'],
  },
  {
    id: 'rev_2',
    author: 'Neha Kakkar',
    productTitle: 'Minimal Heavyweight Oversized Tee',
    rating: 4,
    title: 'Very comfortable for daily wear',
    content: 'Great color and stitching. Only thing is delivery took 4 days to Pune.',
    date: '2026-09-12',
    isVerifiedBuyer: true,
    status: 'PENDING',
  },
  {
    id: 'rev_3',
    author: 'Arjun Kapoor',
    productTitle: 'Graphic Streetwear Tee - Tokyo Edition',
    rating: 1,
    title: 'Spam advertisement',
    content: 'Visit cheapclothes.xyz for discount coupons on this store.',
    date: '2026-09-10',
    isVerifiedBuyer: false,
    status: 'HIDDEN',
  },
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<AdminReview[]>(INITIAL_REVIEWS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});

  const filtered = reviews.filter((r) => {
    if (filter !== 'ALL' && r.status !== filter) return false;
    if (
      search &&
      !r.author.toLowerCase().includes(search.toLowerCase()) &&
      !r.productTitle.toLowerCase().includes(search.toLowerCase()) &&
      !r.content.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const handleSetStatus = (id: string, newStatus: 'PUBLISHED' | 'HIDDEN') => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const handleAddReply = (id: string) => {
    const reply = replyText[id];
    if (!reply) return;
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, reply } : r))
    );
    setReplyText((prev) => ({ ...prev, [id]: '' }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2.5">
            <Star className="w-6 h-6 text-indigo-600 fill-indigo-600" />
            Reviews & Social Proof Moderation
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Moderate customer feedback powered by @boostengine/reviews with verified buyer badges & replies.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs">
          <div className="text-xs text-gray-500 font-semibold mb-1">Average Store Rating</div>
          <div className="text-2xl font-black text-gray-900 flex items-center gap-1.5">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            4.8 / 5.0
          </div>
          <span className="text-[10px] text-emerald-600 font-medium">Based on 1,420 reviews</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs">
          <div className="text-xs text-gray-500 font-semibold mb-1">Pending Approval</div>
          <div className="text-2xl font-black text-amber-600">
            {reviews.filter((r) => r.status === 'PENDING').length}
          </div>
          <span className="text-[10px] text-amber-600 font-medium">Needs moderation</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs">
          <div className="text-xs text-gray-500 font-semibold mb-1">Verified Buyers</div>
          <div className="text-2xl font-black text-emerald-600">92%</div>
          <span className="text-[10px] text-emerald-600 font-medium">Authenticated purchases</span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs">
          <div className="text-xs text-gray-500 font-semibold mb-1">Spam Blocked</div>
          <div className="text-2xl font-black text-rose-600">
            {reviews.filter((r) => r.status === 'HIDDEN').length}
          </div>
          <span className="text-[10px] text-gray-400 font-medium">Auto-flagged links</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search review content, product, author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'PENDING', 'PUBLISHED', 'HIDDEN'].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`text-xs px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                filter === st
                  ? 'bg-black text-white shadow-xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Cards List */}
      <div className="space-y-3">
        {filtered.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs space-y-3"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="font-bold text-gray-900 text-sm">{rev.author}</span>
                {rev.isVerifiedBuyer && (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Verified Buyer
                  </span>
                )}
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs font-semibold text-gray-600">{rev.productTitle}</span>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                    rev.status === 'PUBLISHED'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : rev.status === 'PENDING'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  {rev.status}
                </span>
                <span className="text-[11px] text-gray-400 font-mono">{rev.date}</span>
              </div>
            </div>

            {/* Stars & Text */}
            <div className="space-y-1">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < rev.rating
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-200 fill-gray-200'
                    }`}
                  />
                ))}
                <span className="text-xs font-bold text-gray-900 ml-1.5">{rev.title}</span>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed">{rev.content}</p>
            </div>

            {/* Attached customer photos */}
            {rev.images && rev.images.length > 0 && (
              <div className="flex items-center gap-2 pt-1">
                {rev.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="Customer photo"
                    className="w-14 h-14 rounded-xl object-cover border border-gray-200"
                  />
                ))}
              </div>
            )}

            {/* Existing Reply */}
            {rev.reply && (
              <div className="bg-gray-50 border-l-3 border-indigo-600 p-3 rounded-r-xl text-xs text-gray-800 space-y-1">
                <span className="font-bold text-indigo-700 block">Brand Staff Reply:</span>
                <p>{rev.reply}</p>
              </div>
            )}

            {/* Actions Toolbar */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Write a public response..."
                  value={replyText[rev.id] || ''}
                  onChange={(e) =>
                    setReplyText({ ...replyText, [rev.id]: e.target.value })
                  }
                  className="text-xs px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg w-64 focus:outline-none focus:ring-1 focus:ring-black"
                />
                <button
                  onClick={() => handleAddReply(rev.id)}
                  className="text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1.5 rounded-lg transition"
                >
                  Reply
                </button>
              </div>

              <div className="flex items-center gap-2">
                {rev.status !== 'PUBLISHED' && (
                  <button
                    onClick={() => handleSetStatus(rev.id, 'PUBLISHED')}
                    className="bg-black hover:bg-gray-800 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition"
                  >
                    Publish Review
                  </button>
                )}
                {rev.status !== 'HIDDEN' && (
                  <button
                    onClick={() => handleSetStatus(rev.id, 'HIDDEN')}
                    className="bg-gray-100 hover:bg-rose-50 hover:text-rose-600 text-gray-700 font-semibold text-xs px-3 py-1.5 rounded-xl transition"
                  >
                    Hide / Spam
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
