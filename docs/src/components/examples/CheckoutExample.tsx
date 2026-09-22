import React, { useState } from 'react';
import {
  Stepper,
  AddressForm,
  OrderSummary,
  CouponInput,
  BankOffersAccordion,
  ConfirmationDialog,
  RadioGroup,
  Badge,
  Button,
} from '@boostengine/ui';
import { ShieldCheck, Truck, Lock, CheckCircle2 } from 'lucide-react';

interface CheckoutExampleProps {
  onShowToast: (msg: string) => void;
}

export const CheckoutExample: React.FC<CheckoutExampleProps> = ({ onShowToast }) => {
  const [currentStep, setCurrentStep] = useState(2);
  const [coupon, setCoupon] = useState<string | undefined>('FESTIVE200');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [deliverySpeed, setDeliverySpeed] = useState('express');
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const subtotal = 3498;
  const discount = coupon ? 200 : 0;
  const shippingFee = deliverySpeed === 'express' ? 0 : 0;
  const tax = Math.round((subtotal - discount) * 0.18);

  const handlePlaceOrder = () => {
    setIsConfirmOpen(true);
  };

  const handleConfirmOrder = () => {
    setIsConfirmOpen(false);
    setOrderPlaced(true);
    setCurrentStep(4);
    onShowToast('🎉 Order #BE-98420 placed successfully!');
  };

  if (orderPlaced) {
    return (
      <div style={{ backgroundColor: 'var(--boost-bg, #090d16)', color: 'var(--boost-text, #f8fafc)', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 20px' }}>
        <div style={{
          maxWidth: '520px',
          width: '100%',
          textAlign: 'center',
          padding: '40px 24px',
          borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--boost-border, #334155)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
        }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <CheckCircle2 size={36} />
          </div>
          <Badge variant="success" style={{ marginBottom: '12px' }}>ORDER CONFIRMED</Badge>
          <h2 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 8px' }}>Order #BE-98420 Placed!</h2>
          <p style={{ fontSize: '14px', color: 'var(--boost-text-muted, #94a3b8)', lineHeight: 1.6, margin: '0 0 24px' }}>
            Thank you for shopping with BoostEngine! Confirmation SMS and WhatsApp tracking details have been sent to your registered number.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <Button variant="outline" onClick={() => setOrderPlaced(false)}>Review Order Details</Button>
            <Button variant="primary" onClick={() => onShowToast('Navigating to tracking map...')}>Track Live Shipment</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--boost-bg, #090d16)', color: 'var(--boost-text, #f8fafc)', minHeight: '100vh', padding: '24px 20px', fontFamily: 'inherit' }}>
      {/* Checkout Stepper Header */}
      <div style={{ maxWidth: '1100px', margin: '0 auto 32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 4px' }}>Express D2C Checkout</h1>
            <p style={{ margin: 0, fontSize: '13px', color: 'var(--boost-text-muted, #94a3b8)' }}>
              Encrypted 256-bit SSL transaction • Guaranteed 100% genuine products
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#10b981', fontWeight: 600 }}>
            <Lock size={14} />
            <span>Bank-Grade Security</span>
          </div>
        </div>

        <Stepper
          currentStep={currentStep}
          steps={[
            { id: '1', label: 'Cart Verification' },
            { id: '2', label: 'Delivery Address' },
            { id: '3', label: 'Payment Gateway' },
            { id: '4', label: 'Order Confirmed' }
          ]}
        />
      </div>

      {/* 2-Column Responsive Checkout Grid */}
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '36px',
        alignItems: 'start'
      }}>
        {/* Left Column: Delivery Address & Payment Choice */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Shipping Address Form */}
          <div style={{ border: '1px solid var(--boost-border, #334155)', borderRadius: '14px', padding: '24px', background: 'rgba(255,255,255,0.02)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Truck size={18} color="#6366f1" />
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>1. Shipping & Delivery Destination</h3>
            </div>
            <AddressForm
              onSubmit={(addr) => {
                onShowToast(`Address saved for ${addr.fullName}!`);
                setCurrentStep(3);
              }}
            />
          </div>

          {/* Payment Method Selector */}
          <div style={{ border: '1px solid var(--boost-border, #334155)', borderRadius: '14px', padding: '24px', background: 'rgba(255,255,255,0.02)' }}>
            <h3 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: 700 }}>2. Select Payment Mode</h3>
            <RadioGroup
              name="paymentMethod"
              value={paymentMethod}
              onChange={(val) => {
                setPaymentMethod(String(val));
                onShowToast(`Selected payment: ${val.toString().toUpperCase()}`);
              }}
              options={[
                { label: 'UPI Fast Checkout (GPay, PhonePe, Paytm, QR)', value: 'upi' },
                { label: 'Credit or Debit Cards (Visa, Mastercard, RuPay)', value: 'card' },
                { label: 'Cash on Delivery (COD) with OTP Verification', value: 'cod' }
              ]}
            />
          </div>
        </div>

        {/* Right Column: Order Summary & Instant Checkout */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Coupon Box */}
          <div style={{ border: '1px solid var(--boost-border, #334155)', borderRadius: '14px', padding: '20px', background: 'rgba(255,255,255,0.02)' }}>
            <h4 style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: 700 }}>Apply Coupon or Gift Voucher</h4>
            <CouponInput
              appliedCode={coupon}
              discountText="Flat ₹200 OFF on festive drop"
              onApply={(code) => {
                setCoupon(code);
                onShowToast(`Coupon ${code} applied successfully!`);
              }}
              onRemove={() => {
                setCoupon(undefined);
                onShowToast('Coupon removed');
              }}
            />
          </div>

          {/* Order Summary Component */}
          <div style={{ border: '1px solid var(--boost-border, #334155)', borderRadius: '14px', padding: '24px', background: 'rgba(255,255,255,0.02)' }}>
            <OrderSummary
              subtotal={subtotal}
              discount={discount}
              shippingFee={shippingFee}
              tax={tax}
              freeShippingThreshold={1500}
              onCheckout={handlePlaceOrder}
              checkoutButtonText="Confirm & Place Order →"
            />
          </div>

          {/* Applicable Bank Offers */}
          <BankOffersAccordion
            offers={[
              { id: '1', title: '10% Instant Discount with HDFC Cards', description: 'Applicable on min cart ₹1,999.', code: 'HDFC10' },
              { id: '2', title: 'Flat ₹100 Cashback on UPI', description: 'Valid on PhonePe / GPay.', code: 'UPI100' }
            ]}
          />
        </div>
      </div>

      {/* Confirmation Modal Dialog */}
      <ConfirmationDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmOrder}
        title="Place Order #BE-98420?"
        message={`Total payable amount is ₹${subtotal - discount + shippingFee + tax}. Payment mode selected: ${paymentMethod.toUpperCase()}. Confirm to proceed?`}
        confirmText="Confirm & Pay"
        confirmVariant="primary"
      />
    </div>
  );
};
