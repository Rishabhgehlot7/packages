import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Setting from '@/models/Setting';
import { db } from '@/data/db';

export async function GET() {
  try {
    try {
      const conn = await dbConnect();
      if (conn && Setting) {
        const mongoSetting = await Setting.findOne().lean();
        if (mongoSetting) {
          return NextResponse.json({
            success: true,
            source: 'mongodb',
            data: {
              storeName: (mongoSetting as any).storeName || 'Boost Aesthetic',
              storeUrl: (mongoSetting as any).storeUrl || 'https://booststore.com',
              supportEmail: (mongoSetting as any).supportEmail || 'support@booststore.com',
              supportPhone: (mongoSetting as any).supportPhone || '+91 98765 43210',
              freeShippingThreshold: (mongoSetting as any).freeShippingThreshold ?? 999,
              enableCod: (mongoSetting as any).enableCod !== false,
              gstin: (mongoSetting as any).gstin || '',
              state: (mongoSetting as any).state || 'Maharashtra',
            },
          });
        }
      }
    } catch (dbErr) {
      console.warn('MongoDB settings fetch failed, using fallback:', dbErr);
    }

    const fallback = db.getSettings();
    return NextResponse.json({
      success: true,
      source: 'fallback',
      data: {
        storeName: fallback.storeName || 'Boost Aesthetic',
        storeUrl: fallback.storeUrl || 'https://booststore.com',
        supportEmail: fallback.supportEmail || 'support@booststore.com',
        supportPhone: fallback.supportPhone || '+91 98765 43210',
        freeShippingThreshold: fallback.freeShippingThreshold ?? 999,
        enableCod: fallback.enableCod !== false,
        gstin: fallback.gstin || '',
        state: fallback.state || 'Maharashtra',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch store settings' },
      { status: 500 }
    );
  }
}
