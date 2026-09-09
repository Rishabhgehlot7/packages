'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore, getCityFromPincode } from '../../context/StoreContext';
import { LoyaltyEngine } from '@boostengine/loyalty';
import { AssuredBadge } from '@boostengine/ui';
import { ShieldCheck, Truck, CreditCard, ArrowLeft, Zap, Sparkles, Check } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSummary, clearCart, superCoins, customerTier, deliveryLocation, setDeliveryLocation } = useStore();
  const [submitting, setSubmitting] = useState(false);
  const [useSuperCoins, setUseSuperCoins] = useState(true);
  const [deliverySpeed, setDeliverySpeed] = useState<'express' | 'standard'>('express');

  const initialGeo = deliveryLocation?.pincode ? getCityFromPincode(deliveryLocation.pincode) : { city: 'Mumbai', state: 'Maharashtra' };

  const [form, setForm] = useState({
    name: 'Aarav Mehta',
    phone: '9876543210',
    email: 'aarav@example.com',
    line1: 'Flat 402, Sea Breeze Apts, Bandra West',
    city: deliveryLocation.city || initialGeo.city,
    state: initialGeo.state,
    pincode: deliveryLocation.pincode || '400050',
    paymentMethod: 'razorpay' as 'razorpay' | 'cod' | 'upi',
  });

  React.useEffect(() => {
    if (deliveryLocation?.pincode) {
      const geo = getCityFromPincode(deliveryLocation.pincode);
      setForm((prev) => ({
        ...prev,
        city: deliveryLocation.city || geo.city,
        state: geo.state || prev.state,
        pincode: deliveryLocation.pincode,
      }));
    }
  }, [deliveryLocation]);

  if (cartSummary.totalQuantity === 0) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center space-y-4">
        <h1 className="text-2xl font-black">Your Shopping Bag is Empty</h1>
        <p className="text-xs text-gray-500">Add products to your cart before proceeding to checkout.</p>
        <Link
          href="/"
          className="inline-block bg-yellow-400 text-black px-6 py-3 rounded-full text-xs font-black shadow-md hover:bg-yellow-500 transition"
        >
          Return to Marketplace
        </Link>
      </div>
    );
  }

  // Calculate SuperCoins redemption via @boostengine/loyalty
  const loyaltyQuote = LoyaltyEngine.calculateRedemption(
    cartSummary.finalTotal,
    superCoins,
    useSuperCoins ? superCoins : 0,
    customerTier
  );

  const finalPayable = useSuperCoins ? loyaltyQuote.payableAfterDiscount : cartSummary.finalTotal;

  // Load Razorpay checkout.js dynamically if needed
  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  async function handleCompleteOrder(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSubmitting(true);

      const basePayload = {
        customer: {
          name: form.name,
          email: form.email,
          phone: form.phone,
          address: {
            line1: form.line1,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
          },
        },
        items: cart.getItems().map((i: any) => ({
          productId: i.productId,
          variantId: i.variantId || '',
          variantSku: i.variantSku || i.metadata?.sku || '',
          variantName: i.variantTitle || i.variantName || '',
          title: i.title,
          sku: i.sku || i.variantSku || i.metadata?.sku || '',
          price: i.price,
          quantity: i.quantity,
          image: i.image,
          gstRate: i.taxRate || 18,
          hsnCode: i.hsnCode || '6109',
        })),
        subtotal: cartSummary.subtotal,
        discount: (cartSummary.discount?.amount || 0) + (useSuperCoins ? loyaltyQuote.rupeeDiscount : 0),
        shipping: cartSummary.shippingFee,
        tax: cartSummary.gst?.totalTax || 0,
        total: finalPayable,
        paymentMethod: form.paymentMethod,
        paymentStatus: 'pending',
        orderStatus: 'processing',
        metadata: {
          deliverySpeed,
          superCoinsRedeemed: useSuperCoins ? loyaltyQuote.coinsToRedeem : 0,
          coinsEarned: loyaltyQuote.coinsEarnedOnThisOrder,
        },
      };

      // COD Flow
      if (form.paymentMethod === 'cod') {
        const res = await fetch('/api/admin/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(basePayload),
        });
        const data = await res.json();
        if (data.success) {
          clearCart();
          router.push(`/order-success/${data.data.id}`);
        } else {
          alert(data.error || 'Failed to place order');
        }
        return;
      }

      // Online Payment Flow via Razorpay
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        alert('Razorpay payment gateway failed to load. Please check your internet connection.');
        setSubmitting(false);
        return;
      }

      // 1. Create order on server
      const rzpOrderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalPayable,
          receipt: `rcpt_${Date.now()}`,
          notes: { customerName: form.name, customerEmail: form.email },
        }),
      });

      const rzpData = await rzpOrderRes.json();
      if (!rzpData.success) {
        throw new Error(rzpData.error || 'Failed to initiate Razorpay transaction');
      }

      // 2. Pre-create pending order in store DB
      const orderCreateRes = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...basePayload,
          razorpayOrderId: rzpData.order.id,
        }),
      });
      const localOrderData = await orderCreateRes.json();
      const boostOrderId = localOrderData.data?.id || `ord_${Date.now()}`;

      // 3. Launch Razorpay Checkout Popup
      const options = {
        key: rzpData.key,
        amount: rzpData.order.amount,
        currency: rzpData.order.currency,
        name: 'Boost D2C Store',
        description: `Order #${localOrderData.data?.orderNumber || boostOrderId}`,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80',
        order_id: rzpData.order.id,
        handler: async function (response: any) {
          try {
            // Verify HMAC signature
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                boostOrderId,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              clearCart();
              router.push(`/order-success/${boostOrderId}`);
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (verErr) {
            console.error('Verification error:', verErr);
            alert('Error verifying payment.');
          }
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        notes: {
          boostOrderId,
        },
        theme: {
          color: '#2563eb',
        },
        modal: {
          ondismiss: function () {
            setSubmitting(false);
          },
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.on('payment.failed', function (resp: any) {
        console.error('Payment failed:', resp.error);
        alert(`Payment failed: ${resp.error.description}`);
        setSubmitting(false);
      });
      razorpayInstance.open();
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Error processing order');
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Store</span>
        </Link>
        <AssuredBadge type="assured" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Form (Left) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black tracking-tight text-gray-950">
              Checkout & Delivery
            </h1>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Safe & Secure
            </span>
          </div>

          <form id="checkout-form" onSubmit={handleCompleteOrder} className="space-y-6">
            {/* 1. Address Section */}
            <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px]">
                  1
                </span>
                <span>Delivery Address</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                    Mobile Number (For Delivery OTP)
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">
                  Flat, House no., Building, Street
                </label>
                <input
                  type="text"
                  required
                  value={form.line1}
                  onChange={(e) => setForm({ ...form, line1: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 uppercase mb-1">Pincode</label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={form.pincode}
                    onChange={(e) => {
                      const pin = e.target.value.replace(/\D/g, '').slice(0, 6);
                      if (pin.length === 6) {
                        const detected = getCityFromPincode(pin);
                        setForm((prev) => ({ ...prev, pincode: pin, city: detected.city, state: detected.state }));
                        setDeliveryLocation({ city: detected.city, pincode: pin });
                      } else {
                        setForm((prev) => ({ ...prev, pincode: pin }));
                      }
                    }}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </div>

            {/* 2. Delivery Speed Options (Amazon Prime Style) */}
            <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px]">
                  2
                </span>
                <span>Select Delivery Option</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setDeliverySpeed('express')}
                  className={`p-3 rounded-xl border cursor-pointer transition ${
                    deliverySpeed === 'express'
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-blue-900 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-blue-600 fill-blue-600" />
                      Prime 1-Day Express
                    </span>
                    <span className="text-[11px] font-extrabold text-emerald-600">FREE</span>
                  </div>
                  <p className="text-[11px] text-gray-600 mt-1">Tomorrow by 11:00 AM</p>
                </div>

                <div
                  onClick={() => setDeliverySpeed('standard')}
                  className={`p-3 rounded-xl border cursor-pointer transition ${
                    deliverySpeed === 'standard'
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900">Standard Delivery</span>
                    <span className="text-[11px] font-extrabold text-emerald-600">FREE</span>
                  </div>
                  <p className="text-[11px] text-gray-600 mt-1">2-3 Business Days</p>
                </div>
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="p-5 bg-white rounded-2xl border border-gray-200 shadow-xs space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px]">
                  3
                </span>
                <span>Payment Method</span>
              </h2>

              <div className="space-y-2.5">
                {[
                  {
                    id: 'razorpay',
                    label: 'UPI / Cards / NetBanking (All Banks & Wallets)',
                    desc: 'Extra 5% instant cashback applied on UPI & Credit cards',
                  },
                  {
                    id: 'cod',
                    label: 'Cash on Delivery (COD)',
                    desc: 'Pay via Cash or QR code when delivery agent arrives',
                  },
                  {
                    id: 'upi',
                    label: 'Direct UPI Instant QR / PhonePe / GPay',
                    desc: 'Fastest 1-click checkout',
                  },
                ].map((pm) => (
                  <label
                    key={pm.id}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                      form.paymentMethod === pm.id
                        ? 'border-blue-600 bg-blue-50/30 shadow-xs'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={pm.id}
                      checked={form.paymentMethod === pm.id}
                      onChange={(e) => setForm({ ...form, paymentMethod: e.target.value as any })}
                      className="mt-0.5 accent-blue-600"
                    />
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">{pm.label}</span>
                      <span className="text-[11px] text-gray-500">{pm.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Sidebar Summary (Right) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Flipkart SuperCoins Redemption Box */}
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🪙</span>
                <div>
                  <p className="text-xs font-black text-amber-950">Flipkart / Boost SuperCoins</p>
                  <p className="text-[11px] text-amber-800">
                    Balance: {superCoins} Coins ({customerTier} Member)
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useSuperCoins}
                  onChange={(e) => setUseSuperCoins(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
              </label>
            </div>

            {useSuperCoins && (
              <div className="text-[11px] font-bold text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-200 flex items-center justify-between">
                <span>Saving with {loyaltyQuote.coinsToRedeem} SuperCoins:</span>
                <span>-₹{loyaltyQuote.rupeeDiscount} OFF</span>
              </div>
            )}
          </div>

          {/* Order Summary Card */}
          <div className="p-6 bg-gray-950 text-white rounded-2xl space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-300">
                Order Summary ({cartSummary.totalQuantity} items)
              </h2>
              <span className="text-[11px] text-amber-400 font-bold">
                + Earn {loyaltyQuote.coinsEarnedOnThisOrder} Coins
              </span>
            </div>

            <div className="divide-y divide-gray-800 max-h-52 overflow-y-auto pr-1">
              {cart.getItems().map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.title} className="w-10 h-10 object-cover rounded-lg" />
                    <div>
                      <p className="font-bold text-white truncate max-w-[150px]">{item.title}</p>
                      <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 border-t border-gray-800 pt-3 text-xs">
              <div className="flex justify-between text-gray-400">
                <span>Item Subtotal</span>
                <span>₹{cartSummary.subtotal.toLocaleString('en-IN')}</span>
              </div>

              {cartSummary.discount && cartSummary.discount.amount > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Coupon Discount ({cartSummary.discount.code})</span>
                  <span>-₹{cartSummary.discount.amount.toLocaleString('en-IN')}</span>
                </div>
              )}

              {useSuperCoins && loyaltyQuote.rupeeDiscount > 0 && (
                <div className="flex justify-between text-amber-400 font-bold">
                  <span>SuperCoins Discount</span>
                  <span>-₹{loyaltyQuote.rupeeDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-400">
                <span>GST Tax (Included)</span>
                <span>₹{cartSummary.gst?.totalTax ?? 0}</span>
              </div>

              <div className="flex justify-between text-gray-400">
                <span>Delivery Charges</span>
                <span className="text-emerald-400 font-bold">FREE</span>
              </div>

              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-gray-800">
                <span>Total Amount</span>
                <span>₹{finalPayable.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={submitting}
              className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-500 text-black font-black text-xs uppercase tracking-wider rounded-xl transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-black" />
              <span>{submitting ? 'Processing Order...' : `Place Order • Pay ₹${finalPayable.toLocaleString('en-IN')}`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
