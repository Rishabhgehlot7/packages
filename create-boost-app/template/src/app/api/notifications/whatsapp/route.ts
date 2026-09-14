import { NextRequest, NextResponse } from 'next/server';
import { WhatsAppAdapter } from '@boostengine/notifications';

const whatsapp = new WhatsAppAdapter({
  provider: 'interakt',
  apiKey: process.env.INTERAKT_API_KEY || 'demo_key',
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, phone, customerName, orderId, orderNumber, cartItems, totalAmount, trackingUrl } = body;

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Recipient phone number is required' }, { status: 400 });
    }

    const cleanPhone = phone.replace(/\D/g, '');
    let messageText = '';
    let directWaUrl = '';

    if (type === 'abandoned_cart') {
      const itemsList = (cartItems || []).map((i: any) => `• ${i.title} (x${i.quantity || 1})`).join('\n');
      messageText = `Hey ${customerName || 'there'}! 👋 We noticed you left items in your shopping bag:\n\n${itemsList}\n\nUse code *RECOVER10* to get an EXTRA 10% OFF if you complete your order now! 🎁\n\n👉 Complete Checkout: https://boostengine.store/checkout?coupon=RECOVER10`;
      directWaUrl = `https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(messageText)}`;
    } else if (type === 'order_confirmed') {
      messageText = `Hi ${customerName || 'Customer'}! 🎉 Your order #${orderNumber || orderId} of ₹${totalAmount} has been confirmed!\n\nWe are preparing your items for dispatch. 📦\n\n👉 Track your order live: https://boostengine.store/orders/${orderId}/track\n\nThank you for shopping with Boost!`;
      directWaUrl = `https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(messageText)}`;
    } else if (type === 'out_for_delivery') {
      messageText = `🚚 Out for Delivery: Your order #${orderNumber || orderId} is arriving today!\n\nKeep phone handy. Track delivery partner: ${trackingUrl || `https://boostengine.store/orders/${orderId}/track`}`;
      directWaUrl = `https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(messageText)}`;
    } else {
      messageText = `Hello from Boost Store! How can we assist you today?`;
      directWaUrl = `https://wa.me/91${cleanPhone.slice(-10)}?text=${encodeURIComponent(messageText)}`;
    }

    // Attempt dispatch via adapter
    const result = await whatsapp.send({
      channel: 'whatsapp',
      to: { phone: cleanPhone, name: customerName || 'Customer' },
      message: messageText,
      variables: {
        customerName: customerName || 'Customer',
        orderNumber: orderNumber || orderId || '',
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        dispatched: result.isSuccess,
        channel: 'whatsapp',
        phone: cleanPhone,
        message: messageText,
        directWaUrl,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'WhatsApp notification error' },
      { status: 500 }
    );
  }
}
