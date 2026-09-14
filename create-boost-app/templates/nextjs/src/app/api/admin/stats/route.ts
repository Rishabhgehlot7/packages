import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { db } from '@/data/db';

export async function GET() {
  try {
    // Try MongoDB live aggregation
    try {
      const conn = await dbConnect();
      if (conn && Order && Product) {
        const [totalOrders, totalProducts, pendingOrders, revenueAgg] = await Promise.all([
          Order.countDocuments(),
          Product.countDocuments(),
          Order.countDocuments({ orderStatus: { $in: ['pending', 'processing'] } }),
          Order.aggregate([
            { $match: { paymentStatus: { $ne: 'failed' } } },
            { $group: { _id: null, total: { $sum: '$total' } } },
          ]),
        ]);

        const totalRevenue = revenueAgg && revenueAgg[0] ? revenueAgg[0].total : 0;

        return NextResponse.json({
          success: true,
          source: 'mongodb',
          data: {
            totalRevenue,
            totalOrders,
            totalProducts,
            pendingOrders,
          },
        });
      }
    } catch (dbErr) {
      console.warn('MongoDB stats aggregation error, using fallback:', dbErr);
    }

    const stats = db.getStats();
    return NextResponse.json({ success: true, source: 'in-memory', data: stats });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}

