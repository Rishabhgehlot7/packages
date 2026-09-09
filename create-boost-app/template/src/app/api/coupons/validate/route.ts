import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Coupon from '@/models/Coupon';

export async function POST(request: Request) {
  try {
    const { code, cartTotal = 0 } = await request.json();

    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Coupon code is required.' },
        { status: 400 }
      );
    }

    const cleanCode = code.trim().toUpperCase();

    // 1. Check MongoDB first
    try {
      const conn = await dbConnect();
      if (conn && Coupon) {
        const coupon = await Coupon.findOne({
          code: cleanCode,
          isActive: true,
          isDeleted: false,
        }).lean();

        if (coupon) {
          if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) {
            return NextResponse.json(
              { success: false, error: 'This coupon has expired.' },
              { status: 400 }
            );
          }

          if (coupon.minSpend && cartTotal < coupon.minSpend) {
            return NextResponse.json(
              {
                success: false,
                error: `Minimum order amount of ₹${coupon.minSpend} required for this coupon.`,
              },
              { status: 400 }
            );
          }

          if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
            return NextResponse.json(
              { success: false, error: 'This coupon usage limit has been reached.' },
              { status: 400 }
            );
          }

          let discountAmount = 0;
          if (coupon.type === 'percentage') {
            discountAmount = Math.round((cartTotal * coupon.value) / 100);
          } else {
            discountAmount = Math.min(coupon.value, cartTotal);
          }

          return NextResponse.json({
            success: true,
            data: {
              code: coupon.code,
              type: coupon.type,
              value: coupon.value,
              discountAmount,
            },
          });
        }
      }
    } catch (dbErr) {
      console.warn('MongoDB coupon check failed:', dbErr);
    }

    // 2. Default fallback coupons (e.g. WELCOME10)
    if (cleanCode === 'WELCOME10') {
      const discountAmount = Math.round(cartTotal * 0.1);
      return NextResponse.json({
        success: true,
        data: {
          code: 'WELCOME10',
          type: 'percentage',
          value: 10,
          discountAmount,
        },
      });
    }

    if (cleanCode === 'BOOST20') {
      const discountAmount = Math.round(cartTotal * 0.2);
      return NextResponse.json({
        success: true,
        data: {
          code: 'BOOST20',
          type: 'percentage',
          value: 20,
          discountAmount,
        },
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid or inactive coupon code.' },
      { status: 404 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Coupon validation failed' },
      { status: 500 }
    );
  }
}
