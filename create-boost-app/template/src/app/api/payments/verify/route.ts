import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { db } from '@/data/db';
import { sendOrderConfirmationEmail } from '@/lib/mail';

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, boostOrderId } =
      await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Missing signature parameters for payment verification.' },
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    if (!keySecret) {
      return NextResponse.json(
        { success: false, error: 'RAZORPAY_KEY_SECRET is not configured.' },
        { status: 500 }
      );
    }

    const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(payload)
      .digest('hex');

    const isVerified = expectedSignature === razorpay_signature;

    if (!isVerified) {
      console.error('❌ Razorpay signature mismatch', { expectedSignature, razorpay_signature });
      return NextResponse.json(
        { success: false, error: 'Payment signature verification failed' },
        { status: 400 }
      );
    }

    // Update in MongoDB
    try {
      await dbConnect();
      if (Order) {
        await Order.findOneAndUpdate(
          { $or: [{ id: boostOrderId }, { orderNumber: boostOrderId }, { razorpayOrderId: razorpay_order_id }] },
          {
            paymentStatus: 'paid',
            orderStatus: 'processing',
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
          }
        );
      }
    } catch (dbErr) {
      console.warn('MongoDB order update warning:', dbErr);
    }

    // Update in in-memory fallback db
    if (boostOrderId) {
      const order = db.getOrderById(boostOrderId);
      if (order) {
        order.paymentStatus = 'paid';
        order.orderStatus = 'processing';
        // Send email confirmation
        sendOrderConfirmationEmail({
          orderNumber: order.orderNumber,
          customer: order.customer,
          items: order.items,
          total: order.total,
          paymentMethod: 'Razorpay',
          shippingAddress: order.customer.address,
        }).catch((err) => console.error('Email error:', err));
      }
    }

    return NextResponse.json({
      success: true,
      verified: true,
      message: 'Payment verified successfully',
    });
  } catch (error: any) {
    console.error('Payment Verification Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Payment verification failed' },
      { status: 500 }
    );
  }
}
