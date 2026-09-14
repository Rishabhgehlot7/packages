import { NextResponse } from 'next/server';
import { RazorpayAdapter } from '@boostengine/payments';

export async function POST(request: Request) {
  try {
    const { amount, receipt, notes } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid amount for payment' },
        { status: 400 }
      );
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      // Mock mode fallback so developers can test the checkout flow immediately!
      const mockOrderId = 'order_mock_' + Math.random().toString(36).substring(2, 10);
      return NextResponse.json({
        success: true,
        mock: true,
        key: 'rzp_test_mock_boost',
        order: {
          id: mockOrderId,
          amount: Math.round(amount * 100),
          currency: 'INR',
          receipt: receipt || `rcpt_${Date.now()}`,
        },
      });
    }

    // Direct instantiation of @boostengine/payments RazorpayAdapter
    const adapter = new RazorpayAdapter({ keyId, keySecret });

    const orderResult = await adapter.createOrder({
      amount,
      currency: 'INR',
      receipt: receipt || `rcpt_${Date.now()}`,
      customer: {
        name: notes?.customerName || 'Customer',
        email: notes?.customerEmail || 'customer@example.com',
        phone: notes?.customerPhone || '9876543210',
      },
      notes: notes || {},
    });

    return NextResponse.json({
      success: true,
      key: keyId,
      order: {
        id: orderResult.gatewayOrderId,
        amount: Math.round(orderResult.amount * 100),
        currency: orderResult.currency,
        receipt: orderResult.orderId,
      },
    });
  } catch (error: any) {
    console.error('Razorpay Create Order Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create Razorpay order' },
      { status: 500 }
    );
  }
}
