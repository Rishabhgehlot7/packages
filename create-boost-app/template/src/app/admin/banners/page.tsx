'use client';

import React, { useEffect, useState } from 'react';
import {
  Megaphone,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  Sparkles,
  Smartphone,
  Monitor,
  X,
  Palette,
  Layers,
  Save,
  Image as ImageIcon
} from 'lucide-react';

interface BannerItem {
  id: string;
  _id?: string;
  title?: string;
  desktopImage?: string;
  mobileImage?: string;
  image?: string;
  link?: string;
  buttonText?: string;
  desktopOrder: number;
  mobileOrder: number;
  isActive: boolean;
  isDeleted: boolean;
  isHeroBanner?: boolean;
  isNewArrival?: boolean;
  createdAt?: string;
}

interface AdBannerItem {
  id?: string;
  _id?: string;
  text: string;
  backgroundColor: string;
  textColor: string;
  link: string;
  isActive: boolean;
  showCloseButton: boolean;
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<BannerItem[]>([]);
  const [adBanner, setAdBanner] = useState<AdBannerItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'hero' | 'promo'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerItem | null>(null);
  const [savingBanner, setSavingBanner] = useState(false);
  const [savingAd, setSavingAd] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Banner Form State
  const [formData, setFormData] = useState({
    title: '',
    desktopImage: '',
    mobileImage: '',
    link: '/shop',
    buttonText: 'Shop Collection',
    desktopOrder: 0,
    mobileOrder: 0,
    isActive: true,
    isHeroBanner: false,
    isNewArrival: false,
  });

  async function loadData() {
    try {
      setLoading(true);
      const [bannersRes, adRes] = await Promise.all([
        fetch('/api/admin/banners'),
        fetch('/api/admin/ad-banner'),
      ]);
      const bannersData = await bannersRes.json();
      const adData = await adRes.json();

      if (bannersData.success) {
        setBanners(bannersData.data);
      }
      if (adData.success) {
        setAdBanner(adData.data);
      }
    } catch (err) {
      console.error('Failed to load banners', err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function handleOpenCreate() {
    setEditingBanner(null);
    setFormData({
      title: '',
      desktopImage: '',
      mobileImage: '',
      link: '/shop',
      buttonText: 'Explore Now',
      desktopOrder: banners.length + 1,
      mobileOrder: banners.length + 1,
      isActive: true,
      isHeroBanner: activeTab === 'hero',
      isNewArrival: false,
    });
    setModalOpen(true);
  }

  function handleOpenEdit(b: BannerItem) {
    setEditingBanner(b);
    setFormData({
      title: b.title || '',
      desktopImage: b.desktopImage || b.image || '',
      mobileImage: b.mobileImage || b.desktopImage || b.image || '',
      link: b.link || '/shop',
      buttonText: b.buttonText || 'Shop Now',
      desktopOrder: b.desktopOrder || 0,
      mobileOrder: b.mobileOrder || 0,
      isActive: b.isActive,
      isHeroBanner: !!b.isHeroBanner,
      isNewArrival: !!b.isNewArrival,
    });
    setModalOpen(true);
  }

  async function handleSaveBanner(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSavingBanner(true);
      const method = editingBanner ? 'PATCH' : 'POST';
      const body = editingBanner
        ? { id: editingBanner.id || (editingBanner as any)._id, ...formData }
        : formData;

      const res = await fetch('/api/admin/banners', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (data.success) {
        setToast({
          type: 'success',
          text: editingBanner ? 'Banner updated successfully!' : 'Banner added to catalog!',
        });
        setTimeout(() => setToast(null), 3500);
        setModalOpen(false);
        loadData();
      } else {
        setToast({ type: 'error', text: data.error || 'Failed to save banner' });
      }
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', text: 'Network error saving banner' });
    } finally {
      setSavingBanner(false);
    }
  }

  async function handleToggleActive(banner: BannerItem) {
    const newStatus = !banner.isActive;
    const bId = banner.id || (banner as any)._id;
    try {
      setBanners((prev) =>
        prev.map((b) => ((b.id || (b as any)._id) === bId ? { ...b, isActive: newStatus } : b))
      );
      await fetch('/api/admin/banners', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bId, isActive: newStatus }),
      });
    } catch (err) {
      console.error(err);
      loadData();
    }
  }

  async function handleDeleteBanner(id: string) {
    if (!confirm('Are you sure you want to remove this banner?')) return;
    try {
      const res = await fetch(`/api/admin/banners?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setToast({ type: 'success', text: 'Banner removed.' });
        setTimeout(() => setToast(null), 3000);
        setBanners((prev) => prev.filter((b) => (b.id || (b as any)._id) !== id));
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSaveAdBanner(e: React.FormEvent) {
    e.preventDefault();
    if (!adBanner) return;
    try {
      setSavingAd(true);
      const res = await fetch('/api/admin/ad-banner', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adBanner),
      });
      const data = await res.json();
      if (data.success) {
        setToast({ type: 'success', text: 'Top announcement bar updated in real-time! 🎉' });
        setTimeout(() => setToast(null), 3500);
      } else {
        setToast({ type: 'error', text: data.error || 'Failed to update ticker' });
      }
    } catch (err) {
      console.error(err);
      setToast({ type: 'error', text: 'Network error updating announcement bar' });
    } finally {
      setSavingAd(false);
    }
  }

  const heroBanners = banners.filter((b) => b.isHeroBanner);
  const promoBanners = banners.filter((b) => !b.isHeroBanner);

  const filteredBanners = banners.filter((b) => {
    if (activeTab === 'hero' && !b.isHeroBanner) return false;
    if (activeTab === 'promo' && b.isHeroBanner) return false;

    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return b.title?.toLowerCase().includes(q) || b.link?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Banner Header */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200/90 shadow-xs p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 z-10">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 border border-indigo-200/80 text-indigo-700 uppercase tracking-widest">
              Merchandising & Media
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              MongoDB Connected
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900">
            Banners & Announcement Hub
          </h1>
          <p className="text-xs md:text-sm text-slate-500 max-w-xl">
            Configure homepage hero carousels, responsive promotional image creatives, and global top announcement alert bars.
          </p>
        </div>

        <div className="flex items-center space-x-3 z-10 flex-shrink-0">
          <button
            onClick={handleOpenCreate}
            className="flex items-center space-x-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Banner</span>
          </button>
        </div>
      </div>

      {/* Toast Feedback */}
      {toast && (
        <div
          className={`p-4 rounded-xl border flex items-center space-x-3 animate-in fade-in duration-200 ${
            toast.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span className="text-xs font-semibold">{toast.text}</span>
        </div>
      )}

      {/* Top Announcement Bar Manager */}
      {adBanner && (
        <div className="bg-white border border-slate-200/90 shadow-xs rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Megaphone className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Storefront Top Announcement Bar
                </h2>
                <p className="text-[11px] text-slate-500">
                  Global notification ticker displayed above the navigation bar across all pages.
                </p>
              </div>
            </div>

            <button
              onClick={handleSaveAdBanner}
              disabled={savingAd}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-xs"
            >
              {savingAd ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Announcement</span>
                </>
              )}
            </button>
          </div>

          {/* Live Preview Box */}
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase font-bold text-slate-400">Live Preview:</div>
            <div
              style={{
                backgroundColor: adBanner.backgroundColor || '#4f46e5',
                color: adBanner.textColor || '#ffffff',
              }}
              className="py-2.5 px-4 rounded-xl text-center text-xs font-bold transition-all shadow-xs"
            >
              {adBanner.text || 'Preview announcement text...'}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Announcement Text Message
              </label>
              <input
                type="text"
                value={adBanner.text}
                onChange={(e) => setAdBanner({ ...adBanner, text: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Destination Link
              </label>
              <input
                type="text"
                value={adBanner.link}
                onChange={(e) => setAdBanner({ ...adBanner, link: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Background Hex Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={adBanner.backgroundColor || '#4f46e5'}
                  onChange={(e) => setAdBanner({ ...adBanner, backgroundColor: e.target.value })}
                  className="w-9 h-9 rounded-lg bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={adBanner.backgroundColor}
                  onChange={(e) => setAdBanner({ ...adBanner, backgroundColor: e.target.value })}
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Text Hex Color
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={adBanner.textColor || '#ffffff'}
                  onChange={(e) => setAdBanner({ ...adBanner, textColor: e.target.value })}
                  className="w-9 h-9 rounded-lg bg-transparent border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={adBanner.textColor}
                  onChange={(e) => setAdBanner({ ...adBanner, textColor: e.target.value })}
                  className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center space-x-4">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={adBanner.isActive}
                  onChange={(e) => setAdBanner({ ...adBanner, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-semibold text-slate-800">Enable on Storefront</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            All Creatives ({banners.length})
          </button>
          <button
            onClick={() => setActiveTab('hero')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'hero'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Hero Carousel ({heroBanners.length})
          </button>
          <button
            onClick={() => setActiveTab('promo')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
              activeTab === 'promo'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
            }`}
          >
            Promotional & Grid ({promoBanners.length})
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search banner title or link..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 transition shadow-2xs"
          />
        </div>
      </div>

      {/* Banners Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs text-slate-500 font-medium">Loading banners from MongoDB...</p>
        </div>
      ) : filteredBanners.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <Megaphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900">No banners found</h3>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your filters or click "+ Add New Banner"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBanners.map((banner, idx) => {
            const bId = banner.id || (banner as any)._id || idx;
            const imgSrc = banner.desktopImage || banner.mobileImage || banner.image;

            return (
              <div
                key={bId}
                className="bg-white border border-slate-200/90 hover:border-indigo-300 hover:shadow-md rounded-2xl overflow-hidden flex flex-col justify-between transition-all group shadow-xs"
              >
                {/* Banner Preview Image */}
                <div className="relative aspect-[16/8] bg-slate-100 overflow-hidden">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={banner.title || 'Banner'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}

                  {/* Badges on preview */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    {banner.isHeroBanner ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-600 text-white shadow-xs">
                        HERO SLIDER
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/95 text-slate-700 shadow-xs border border-slate-200">
                        PROMO
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/80 text-white shadow-xs font-mono">
                      Order: #{banner.desktopOrder || 0}
                    </span>
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <button
                      onClick={() => handleToggleActive(banner)}
                      className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider transition shadow-xs ${
                        banner.isActive
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {banner.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                </div>

                {/* Banner Info */}
                <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-1">
                      {banner.title || 'Untitled Banner Creative'}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                      Link: {banner.link || '/shop'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                    <span className="text-[11px] text-indigo-600 font-semibold flex items-center gap-1">
                      Button: "{banner.buttonText || 'Shop Now'}"
                    </span>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleOpenEdit(banner)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 inline-flex transition"
                        title="Edit Banner"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteBanner(banner.id || (banner as any)._id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 inline-flex transition"
                        title="Delete Banner"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Banner Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <Megaphone className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingBanner ? 'Edit Banner Creative' : 'Add New Banner'}
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Banner Headline Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Live Luxe, Live Hachi"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Desktop Image URL (Landscape) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://... or /images/..."
                  value={formData.desktopImage}
                  onChange={(e) => setFormData({ ...formData, desktopImage: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Mobile Image URL (Optional - Portrait)
                </label>
                <input
                  type="text"
                  placeholder="Leave empty to use desktop image"
                  value={formData.mobileImage}
                  onChange={(e) => setFormData({ ...formData, mobileImage: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Click Link / Route
                  </label>
                  <input
                    type="text"
                    placeholder="/category/travel-bags"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Button CTA Text
                  </label>
                  <input
                    type="text"
                    placeholder="Explore Collection"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Desktop Sequence Order
                  </label>
                  <input
                    type="number"
                    value={formData.desktopOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, desktopOrder: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Mobile Sequence Order
                  </label>
                  <input
                    type="number"
                    value={formData.mobileOrder}
                    onChange={(e) =>
                      setFormData({ ...formData, mobileOrder: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-1 border-t border-slate-100">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isHeroBanner}
                    onChange={(e) => setFormData({ ...formData, isHeroBanner: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-semibold text-slate-800">
                    Show in Homepage Top Hero Slider
                  </span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-xs font-semibold text-slate-800">Active (Visible to Shoppers)</span>
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingBanner}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-xs"
                >
                  {savingBanner ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingBanner ? 'Update Banner' : 'Create Banner'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
