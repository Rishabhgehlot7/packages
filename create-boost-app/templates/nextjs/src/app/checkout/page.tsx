'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore, getCityFromPincode } from '../../context/StoreContext';
import { LoyaltyEngine } from '@boostengine/loyalty';
import { AssuredBadge } from '@boostengine/ui';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  ArrowLeft,
  Zap,
  Sparkles,
  Check,
  Smartphone,
  Building2,
  AlertTriangle,
  QrCode,
} from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSummary, clearCart, superCoins, customerTier, deliveryLocation, setDeliveryLocation, settings } = useStore();
  const [submitting, setSubmitting] = useState(false);
  const [useSuperCoins, setUseSuperCoins] = useState(true);
  const [deliverySpeed, setDeliverySpeed] = useState<'express' | 'standard'>('express');
  const [shippingQuote, setShippingQuote] = useState<any>(null);
  const [loadingShipping, setLoadingShipping] = useState(false);

  // B2B GST State
  const [claimGst, setClaimGst] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [buyerGstin, setBuyerGstin] = useState('');

  // 1-Click Profile State
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'cred'>('phonepe');

  // COD Anti-Fraud OTP State
  const [showCodOtpModal, setShowCodOtpModal] = useState(false);
  const [codOtp, setCodOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpSentMessage, setOtpSentMessage] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [codVerified, setCodVerified] = useState(false);

  const initialGeo = deliveryLocation?.pincode
    ? getCityFromPincode(deliveryLocation.pincode)
    : { city: 'Mumbai', state: 'Maharashtra' };

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

  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: any;
    if (showCodOtpModal && resendTimer > 0) {
      timer = setInterval(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [showCodOtpModal, resendTimer]);

  const triggerSendOtp = async () => {
    setOtpError('');
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', phone: form.phone }),
      });
      const data = await res.json();
      if (data.success) {
        setOtpSentMessage(data.message || 'OTP sent to mobile');
        setResendTimer(30);
      } else {
        setOtpError(data.error || 'Failed to send OTP');
      }
    } catch (e) {
      setOtpError('Error sending OTP');
    }
  };

  // Fetch live shipping rates when pincode changes
  const checkPincodeShipping = async (pin: string) => {
    if (pin.length !== 6) return;
    try {
      setLoadingShipping(true);
      const res = await fetch('/api/shipping/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pincode: pin,
          subtotal: cartSummary.subtotal,
          isCod: form.paymentMethod === 'cod',
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setShippingQuote(data.data);
      }
    } catch (e) {
      console.warn('Shipping API fetch failed:', e);
    } finally {
      setLoadingShipping(false);
    }
  };

  useEffect(() => {
    if (form.pincode && form.pincode.length === 6) {
      checkPincodeShipping(form.pincode);
    }
  }, [form.pincode, form.paymentMethod]);

  const autofillSavedProfile = (profile: { name: string; phone: string; line1: string; city: string; state: string; pincode: string }) => {
    setForm((prev) => ({ ...prev, ...profile }));
    setDeliveryLocation({ city: profile.city, pincode: profile.pincode });
    checkPincodeShipping(profile.pincode);
  };

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

  async function executeOrderPlacement(isCodVerified = false, overridePaymentMethod?: 'razorpay' | 'cod' | 'upi', discountOffset = 0) {
    try {
      setSubmitting(true);

      const activeMethod = overridePaymentMethod || form.paymentMethod;
      const payableAmount = Math.max(0, finalPayable - discountOffset);

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
        discount: (cartSummary.discount?.amount || 0) + (useSuperCoins ? loyaltyQuote.rupeeDiscount : 0) + discountOffset,
        shipping: cartSummary.shippingFee,
        tax: cartSummary.gst?.totalTax || 0,
        total: payableAmount,
        paymentMethod: activeMethod,
        paymentStatus: activeMethod === 'cod' ? 'pending' : 'paid',
        orderStatus: 'processing',
        shippingDetails: {
          courierName: shippingQuote?.rates?.[deliverySpeed]?.carrier || 'Delhivery Express',
          estimatedDelivery: shippingQuote?.rates?.[deliverySpeed]?.deliveryDate || 'Within 2-3 days',
          awb: `DLV${Math.floor(10000000 + Math.random() * 90000000)}`,
        },
        gstDetails: claimGst
          ? {
              buyerGstin: buyerGstin.trim().toUpperCase(),
              companyName: companyName.trim(),
            }
          : undefined,
        metadata: {
          deliverySpeed,
          codVerified: isCodVerified,
          prepaidDiscount: discountOffset,
          selectedUpiApp: activeMethod === 'upi' ? selectedUpiApp : undefined,
          superCoinsRedeemed: useSuperCoins ? loyaltyQuote.coinsToRedeem : 0,
          coinsEarned: loyaltyQuote.coinsEarnedOnThisOrder,
        },
      };

      // 1. Place order in database
      const res = await fetch('/api/admin/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(basePayload),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to place order');
      }

      const createdOrderId = data.data.id || data.data.orderNumber;

      // 2. Trigger automated WhatsApp order confirmation in background
      try {
        fetch('/api/notifications/whatsapp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'order_confirmed',
            phone: form.phone,
            customerName: form.name,
            orderId: createdOrderId,
            orderNumber: data.data.orderNumber || createdOrderId,
            totalAmount: payableAmount,
          }),
        }).catch(() => {});
      } catch (waErr) {}

      // If COD or direct UPI demo, route straight to success
      if (activeMethod === 'cod' || activeMethod === 'upi') {
        clearCart();
        router.push(`/order-success/${createdOrderId}`);
        return;
      }

      // Online Payment Flow via Razorpay
      const isLoaded = await loadRazorpayScript();
      if (!isLoaded) {
        clearCart();
        router.push(`/order-success/${createdOrderId}`);
        return;
      }

      const rzpOrderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: payableAmount,
          receipt: `rcpt_${Date.now()}`,
          notes: { customerName: form.name, customerEmail: form.email, orderId: createdOrderId },
        }),
      });

      const rzpData = await rzpOrderRes.json();
      if (!rzpData.success) {
        clearCart();
        router.push(`/order-success/${createdOrderId}`);
        return;
      }

      if (rzpData.mock) {
        // Mock test mode: complete verification and route immediately to order-success!
        try {
          await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: rzpData.order.id,
              razorpay_payment_id: 'pay_mock_' + Date.now(),
              razorpay_signature: 'sig_mock_verified',
              boostOrderId: createdOrderId,
            }),
          });
        } catch (e) {}
        clearCart();
        router.push(`/order-success/${createdOrderId}`);
        return;
      }

      const options = {
        key: rzpData.key,
        amount: rzpData.order.amount,
        currency: rzpData.order.currency,
        name: 'Boost D2C Store',
        description: `Order #${createdOrderId}`,
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=200&q=80',
        order_id: rzpData.order.id,
        handler: async function (response: any) {
          try {
            await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                boostOrderId: createdOrderId,
              }),
            });
            clearCart();
            router.push(`/order-success/${createdOrderId}`);
          } catch (verErr) {
            router.push(`/order-success/${createdOrderId}`);
          }
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: '#eab308' },
        modal: {
          ondismiss: function () {
            setSubmitting(false);
          },
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.open();
    } catch (err: any) {
      alert(err.message || 'Error processing order');
      setSubmitting(false);
    }
  }

  async function handleCompleteOrder(e?: React.FormEvent) {
    if (e) e.preventDefault();

    // Anti-Fraud COD Check: Intercept with OTP verification
    if (form.paymentMethod === 'cod' && !codVerified) {
      setShowCodOtpModal(true);
      triggerSendOtp();
      return;
    }

    await executeOrderPlacement(codVerified);
  }

  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codOtp || codOtp.trim().length < 4) {
      setOtpError('Please enter the 4-digit code (e.g. 1234)');
      return;
    }

    try {
      setVerifyingOtp(true);
      setOtpError('');
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', phone: form.phone, otp: codOtp }),
      });
      const data = await res.json();
      if (data.success && data.verified) {
        setCodVerified(true);
        setShowCodOtpModal(false);
        await executeOrderPlacement(true);
      } else {
        setOtpError(data.error || 'Invalid OTP code');
      }
    } catch (err) {
      setOtpError('Verification failed. Try again.');
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleSwitchToPrepaidUpi = async () => {
    setShowCodOtpModal(false);
    setForm((prev) => ({ ...prev, paymentMethod: 'upi' }));
    // Award flat ₹50 discount for converting COD to UPI!
    await executeOrderPlacement(false, 'upi', 50);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Store</span>
        </Link>
        <AssuredBadge type="assured" />
      </div>

      {/* 1-Click Fast Checkout Banner (Shop Pay / GoKwik Style) */}
      <div className="bg-gradient-to-r from-yellow-400/10 via-amber-500/10 to-yellow-400/5 border border-yellow-400/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-yellow-400 text-black flex items-center justify-center font-black">
            <Zap className="w-5 h-5 fill-black" />
          </div>
          <div>
            <div className="text-xs font-black text-gray-900 dark:text-white flex items-center gap-1.5">
              1-Click Smart Checkout
              <span className="text-[10px] font-bold uppercase bg-yellow-400 text-black px-2 py-0.5 rounded-full">
                Saved Profile
              </span>
            </div>
            <p className="text-[11px] text-gray-500">Addresses auto-detected for phone {form.phone}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() =>
              autofillSavedProfile({
                name: 'Aarav Mehta',
                phone: '9876543210',
                line1: 'Flat 402, Sea Breeze Apts, Bandra West',
                city: 'Mumbai',
                state: 'Maharashtra',
                pincode: '400050',
              })
            }
            className="text-[11px] font-bold px-3 py-1.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg hover:border-yellow-400 transition"
          >
            Mumbai Office
          </button>
          <button
            type="button"
            onClick={() =>
              autofillSavedProfile({
                name: 'Aarav Mehta',
                phone: '9876543210',
                line1: 'Villa 12, Indiranagar 100ft Road',
                city: 'Bengaluru',
                state: 'Karnataka',
                pincode: '560038',
              })
            }
            className="text-[11px] font-bold px-3 py-1.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg hover:border-yellow-400 transition"
          >
            Bengaluru Residence
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Form (Left) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black tracking-tight text-gray-950 dark:text-white">
              Checkout & Delivery
            </h1>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full flex items-center gap-1 border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Safe & Encrypted
            </span>
          </div>

          <form id="checkout-form" onSubmit={handleCompleteOrder} className="space-y-6">
            {/* 1. Address Section */}
            <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-black dark:bg-yellow-400 dark:text-black text-white flex items-center justify-center text-[10px]">
                    1
                  </span>
                  <span>Delivery Address</span>
                </h2>
                {shippingQuote && (
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Serviceable by {shippingQuote.city} Hub
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                    Mobile Number (For WhatsApp Updates)
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                  Flat, House no., Building, Street
                </label>
                <input
                  type="text"
                  required
                  value={form.line1}
                  onChange={(e) => setForm({ ...form, line1: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                    Pincode
                  </label>
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
                        checkPincodeShipping(pin);
                      } else {
                        setForm((prev) => ({ ...prev, pincode: pin }));
                      }
                    }}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 dark:text-gray-300 uppercase mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    required
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
              </div>

              {/* B2B GSTIN Section */}
              <div className="pt-2 border-t border-gray-100 dark:border-zinc-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={claimGst}
                    onChange={(e) => setClaimGst(e.target.checked)}
                    className="rounded text-yellow-400 focus:ring-yellow-400"
                  />
                  <span className="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-yellow-500" />
                    Claim GST Input Tax Credit (For Business Purchases)
                  </span>
                </label>

                {claimGst && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 p-3 bg-gray-50 dark:bg-zinc-800/60 rounded-xl border border-gray-200 dark:border-zinc-700">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">
                        Registered Company Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Acme Innovations LLP"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black uppercase text-gray-500 mb-1">
                        Buyer GSTIN (15 Digits)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 27AAAAA0000A1Z5"
                        maxLength={15}
                        value={buyerGstin}
                        onChange={(e) => setBuyerGstin(e.target.value.toUpperCase())}
                        className="w-full px-3 py-1.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Delivery Speed Options with Live Courier API Quotes */}
            <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-black dark:bg-yellow-400 dark:text-black text-white flex items-center justify-center text-[10px]">
                    2
                  </span>
                  <span>Logistics & Courier Delivery</span>
                </h2>
                {loadingShipping && (
                  <span className="text-[11px] text-gray-400 animate-pulse">Calculating rates...</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setDeliverySpeed('express')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition ${
                    deliverySpeed === 'express'
                      ? 'border-yellow-400 bg-yellow-400/10 dark:bg-yellow-400/5 shadow-xs'
                      : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      Bluedart / Air Express
                    </span>
                    <span className="text-[11px] font-extrabold text-emerald-600">FREE</span>
                  </div>
                  <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1">
                    {shippingQuote?.rates?.express?.deliveryDate || 'Tomorrow by 1:00 PM'}
                  </p>
                </div>

                <div
                  onClick={() => setDeliverySpeed('standard')}
                  className={`p-3.5 rounded-xl border cursor-pointer transition ${
                    deliverySpeed === 'standard'
                      ? 'border-yellow-400 bg-yellow-400/10 dark:bg-yellow-400/5 shadow-xs'
                      : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900 dark:text-white">
                      Delhivery Surface
                    </span>
                    <span className="text-[11px] font-extrabold text-emerald-600">FREE</span>
                  </div>
                  <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-1">
                    {shippingQuote?.rates?.standard?.deliveryDate || '2-3 Business Days'}
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Payment Method with Mobile Native UPI Intent & COD Risk Shield */}
            <div className="p-5 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-xs space-y-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-black dark:bg-yellow-400 dark:text-black text-white flex items-center justify-center text-[10px]">
                  3
                </span>
                <span>Payment Method</span>
              </h2>

              <div className="space-y-3">
                {/* Razorpay Gateway */}
                <label
                  className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                    form.paymentMethod === 'razorpay'
                      ? 'border-yellow-400 bg-yellow-400/10 dark:bg-yellow-400/5 shadow-xs'
                      : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={form.paymentMethod === 'razorpay'}
                    onChange={() => setForm({ ...form, paymentMethod: 'razorpay' })}
                    className="mt-0.5 accent-yellow-400"
                  />
                  <div>
                    <span className="text-xs font-bold text-gray-900 dark:text-white block">
                      Credit / Debit Cards & NetBanking (Razorpay)
                    </span>
                    <span className="text-[11px] text-gray-500">
                      All banks supported with 3D Secure 2.0 authentication
                    </span>
                  </div>
                </label>

                {/* Direct Mobile UPI Intent */}
                <div
                  onClick={() => setForm({ ...form, paymentMethod: 'upi' })}
                  className={`p-3.5 rounded-xl border cursor-pointer transition ${
                    form.paymentMethod === 'upi'
                      ? 'border-yellow-400 bg-yellow-400/10 dark:bg-yellow-400/5 shadow-xs'
                      : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="upi"
                        checked={form.paymentMethod === 'upi'}
                        onChange={() => setForm({ ...form, paymentMethod: 'upi' })}
                        className="accent-yellow-400"
                      />
                      <span className="text-xs font-bold text-gray-900 dark:text-white">
                        1-Tap UPI Intent (No QR scan required)
                      </span>
                    </div>
                    <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded">
                      Instant 5% Cashback
                    </span>
                  </div>

                  {form.paymentMethod === 'upi' && (
                    <div className="grid grid-cols-4 gap-2 pt-2 border-t border-gray-100 dark:border-zinc-800">
                      {[
                        { id: 'phonepe', name: 'PhonePe', color: 'text-purple-600' },
                        { id: 'gpay', name: 'Google Pay', color: 'text-blue-600' },
                        { id: 'paytm', name: 'Paytm', color: 'text-sky-500' },
                        { id: 'cred', name: 'CRED', color: 'text-zinc-900 dark:text-white' },
                      ].map((app) => (
                        <button
                          key={app.id}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedUpiApp(app.id as any);
                          }}
                          className={`py-2 px-1 text-center rounded-lg border text-xs font-black transition ${
                            selectedUpiApp === app.id
                              ? 'border-yellow-400 bg-white dark:bg-zinc-800 ring-2 ring-yellow-400/20 shadow-sm'
                              : 'border-gray-200 dark:border-zinc-800 hover:bg-gray-50'
                          }`}
                        >
                          <span className={app.color}>{app.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Cash on Delivery with Smart COD Shield */}
                {settings.enableCod !== false ? (
                  <label
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition ${
                      form.paymentMethod === 'cod'
                        ? 'border-yellow-400 bg-yellow-400/10 dark:bg-yellow-400/5 shadow-xs'
                        : 'border-gray-200 dark:border-zinc-800 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={form.paymentMethod === 'cod'}
                      onChange={() => setForm({ ...form, paymentMethod: 'cod' })}
                      className="mt-0.5 accent-yellow-400"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900 dark:text-white">
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" /> Pincode Verified
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-500 block mt-0.5">
                        Pay via Cash or QR code when delivery agent arrives
                      </span>
                    </div>
                  </label>
                ) : (
                  <div className="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/30 opacity-60">
                    <span className="text-xs font-bold text-gray-500">Cash on Delivery (COD)</span>
                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                      Disabled by Store
                    </span>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Sidebar Summary (Right) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Flipkart / Boost SuperCoins Redemption Box */}
          <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 rounded-2xl space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🪙</span>
                <div>
                  <p className="text-xs font-black text-amber-950 dark:text-amber-200">
                    Boost SuperCoins Loyalty Wallet
                  </p>
                  <p className="text-[11px] text-amber-800 dark:text-amber-400">
                    Balance: {superCoins} Coins ({customerTier} Tier)
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
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            {useSuperCoins && (
              <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 p-2 rounded-lg border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between">
                <span>Redeemed {loyaltyQuote.coinsToRedeem} SuperCoins:</span>
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
                      <p className="font-bold text-white truncate max-w-[160px]">{item.title}</p>
                      <p className="text-[10px] text-gray-400">
                        Qty: {item.quantity} {item.variantTitle && `• ${item.variantTitle}`}
                      </p>
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
                <span>Express Shipping</span>
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
              <span>
                {submitting ? 'Placing Order...' : `Place Order • Pay ₹${finalPayable.toLocaleString('en-IN')}`}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* COD Anti-Fraud OTP Verification Modal (GoKwik / Shopify Plus Style) */}
      {showCodOtpModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl space-y-5 text-center relative animate-in fade-in zoom-in duration-200">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowCodOtpModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white text-lg font-bold"
            >
              ✕
            </button>

            {/* Icon Header */}
            <div className="w-14 h-14 rounded-2xl bg-yellow-400/10 dark:bg-yellow-400/20 text-yellow-500 flex items-center justify-center mx-auto ring-8 ring-yellow-400/5">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-yellow-600 dark:text-yellow-400 bg-yellow-400/10 px-2.5 py-0.5 rounded-full">
                RTO Anti-Fraud Verification
              </span>
              <h3 className="text-lg font-black text-gray-950 dark:text-white mt-1.5">
                Verify Cash on Delivery (COD)
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Enter the 4-digit verification code sent via WhatsApp & SMS to{' '}
                <span className="font-bold text-gray-800 dark:text-gray-200">+91 {form.phone}</span>
              </p>
            </div>

            {/* OTP Form */}
            <form onSubmit={handleVerifyOtpSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  maxLength={4}
                  autoFocus
                  placeholder="• • • •"
                  value={codOtp}
                  onChange={(e) => setCodOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  className="w-48 mx-auto text-center font-mono text-2xl font-black tracking-[0.6em] py-3 bg-gray-50 dark:bg-zinc-800 border-2 border-yellow-400 rounded-2xl text-gray-900 dark:text-white focus:outline-none shadow-inner"
                />
                <p className="text-[11px] text-gray-400 mt-2">
                  Demo Testing Code: <span className="font-mono font-bold text-yellow-500">1234</span>
                </p>
              </div>

              {otpError && (
                <p className="text-xs font-bold text-rose-500 bg-rose-50 dark:bg-rose-950/40 py-1.5 px-3 rounded-lg">
                  {otpError}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 px-2">
                <span>Didn't receive OTP?</span>
                {resendTimer > 0 ? (
                  <span className="text-gray-400 font-bold">Resend in {resendTimer}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={triggerSendOtp}
                    className="font-bold text-yellow-600 dark:text-yellow-400 hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={verifyingOtp || codOtp.length < 4}
                className="w-full py-3.5 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 text-black font-black text-xs uppercase tracking-wider rounded-xl transition shadow-md flex items-center justify-center gap-2"
              >
                {verifyingOtp ? 'Verifying OTP...' : 'Verify & Confirm COD Order'}
              </button>
            </form>

            {/* GoKwik / Shopify Style Prepaid Incentive Banner */}
            <div className="pt-2 border-t border-gray-100 dark:border-zinc-800 text-left">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600" /> Skip OTP & Save ₹50
                  </span>
                  <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 dark:bg-emerald-900 px-2 py-0.5 rounded">
                    Instant Cashback
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 dark:text-gray-400">
                  Switch to 1-Tap UPI now: no OTP required, no cash change hassle at your doorstep.
                </p>
                <button
                  type="button"
                  onClick={handleSwitchToPrepaidUpi}
                  className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Pay with 1-Tap UPI • Pay ₹{Math.max(0, finalPayable - 50)}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
